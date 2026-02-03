#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..');

/**
 * Рекурсивно получает все ключи из объекта переводов
 * @param {object} obj - объект переводов
 * @param {string} prefix - префикс для вложенных ключей
 * @returns {string[]} массив ключей в формате "parent.child"
 */
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * Сравнивает ключи между двумя файлами переводов
 * @param {string} filePathRu - путь к русскому файлу
 * @param {string} filePathEn - путь к английскому файлу
 * @returns {{ isValid: boolean, missingInEn: string[], missingInRu: string[] }}
 */
function validateTranslationFiles(filePathRu, filePathEn) {
  if (!existsSync(filePathRu)) {
    console.error(`❌ Файл не найден: ${filePathRu}`);
    return { isValid: false, missingInEn: [], missingInRu: [] };
  }

  if (!existsSync(filePathEn)) {
    console.error(`❌ Файл не найден: ${filePathEn}`);
    return { isValid: false, missingInEn: [], missingInRu: [] };
  }

  const ruContent = JSON.parse(readFileSync(filePathRu, 'utf-8'));
  const enContent = JSON.parse(readFileSync(filePathEn, 'utf-8'));

  const ruKeys = new Set(getAllKeys(ruContent));
  const enKeys = new Set(getAllKeys(enContent));

  const missingInEn = [...ruKeys].filter(key => !enKeys.has(key));
  const missingInRu = [...enKeys].filter(key => !ruKeys.has(key));

  return {
    isValid: missingInEn.length === 0 && missingInRu.length === 0,
    missingInEn,
    missingInRu,
  };
}

/**
 * Основная функция валидации
 */
function main() {
  console.log('🔍 Проверка переводов...\n');

  let hasErrors = false;
  const errors = [];

  // Валидация глобальных переводов
  console.log('📦 Глобальные переводы (libs/i18n):');
  const globalRu = join(ROOT_DIR, 'libs/i18n/src/lib/assets/i18n/ru.json');
  const globalEn = join(ROOT_DIR, 'libs/i18n/src/lib/assets/i18n/en.json');
  const globalResult = validateTranslationFiles(globalRu, globalEn);

  if (globalResult.isValid) {
    console.log('  ✅ ru.json и en.json синхронизированы\n');
  } else {
    hasErrors = true;
    console.log('  ❌ Обнаружены расхождения:\n');
    if (globalResult.missingInEn.length > 0) {
      console.log(`    Отсутствуют в en.json (${globalResult.missingInEn.length}):`);
      globalResult.missingInEn.forEach(key => console.log(`      - ${key}`));
    }
    if (globalResult.missingInRu.length > 0) {
      console.log(`    Отсутствуют в ru.json (${globalResult.missingInRu.length}):`);
      globalResult.missingInRu.forEach(key => console.log(`      - ${key}`));
    }
    console.log('');
    errors.push({ file: 'global', ...globalResult });
  }

  // Валидация переводов приложений
  const apps = ['scratch-master-app', 'driving-exam-app'];

  for (const appId of apps) {
    console.log(`📱 Переводы приложения ${appId}:`);
    const appRu = join(ROOT_DIR, `apps/${appId}/public/assets/i18n/${appId}/ru.json`);
    const appEn = join(ROOT_DIR, `apps/${appId}/public/assets/i18n/${appId}/en.json`);

    if (!existsSync(appRu) || !existsSync(appEn)) {
      console.log(`  ⚠️  Файлы переводов не найдены (пропуск)\n`);
      continue;
    }

    const appResult = validateTranslationFiles(appRu, appEn);

    if (appResult.isValid) {
      console.log(`  ✅ ru.json и en.json синхронизированы\n`);
    } else {
      hasErrors = true;
      console.log(`  ❌ Обнаружены расхождения:\n`);
      if (appResult.missingInEn.length > 0) {
        console.log(`    Отсутствуют в en.json (${appResult.missingInEn.length}):`);
        appResult.missingInEn.forEach(key => console.log(`      - ${key}`));
      }
      if (appResult.missingInRu.length > 0) {
        console.log(`    Отсутствуют в ru.json (${appResult.missingInRu.length}):`);
        appResult.missingInRu.forEach(key => console.log(`      - ${key}`));
      }
      console.log('');
      errors.push({ file: appId, ...appResult });
    }
  }

  // Итоговый результат
  console.log('━'.repeat(50));
  if (hasErrors) {
    console.log('❌ Валидация завершилась с ошибками\n');
    process.exit(1);
  } else {
    console.log('✅ Все переводы синхронизированы!\n');
    process.exit(0);
  }
}

main();
