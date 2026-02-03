#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..');

/**
 * Получает список измененных файлов из git
 */
function getChangedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
      cwd: ROOT_DIR,
    });
    return output
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim());
  } catch (error) {
    // Если это не git репозиторий или нет staged файлов, возвращаем пустой массив
    return [];
  }
}

/**
 * Проверяет, являются ли измененные файлы файлами переводов
 */
function hasTranslationFilesChanged(changedFiles) {
  const translationPatterns = [
    /libs\/i18n\/src\/lib\/assets\/i18n\/.*\.json$/,
    /apps\/.*\/public\/assets\/i18n\/.*\/.*\.json$/,
  ];

  return changedFiles.some(file =>
    translationPatterns.some(pattern => pattern.test(file))
  );
}

/**
 * Основная функция
 */
function main() {
  const changedFiles = getChangedFiles();

  if (changedFiles.length === 0) {
    console.log('ℹ️  Нет измененных файлов для проверки');
    process.exit(0);
  }

  // Проверяем, есть ли изменения в файлах переводов
  if (hasTranslationFilesChanged(changedFiles)) {
    console.log('📝 Обнаружены изменения в файлах переводов');
    console.log('🔍 Запуск полной проверки переводов...\n');
    
    // Запускаем полную проверку
    try {
      execSync('pnpm i18n:check', {
        stdio: 'inherit',
        cwd: ROOT_DIR,
      });
    } catch (error) {
      console.error('\n❌ Проверка переводов не пройдена');
      process.exit(1);
    }
  } else {
    console.log('ℹ️  Файлы переводов не изменены, пропускаем проверку');
  }

  process.exit(0);
}

main();
