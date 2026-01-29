/**
 * Script para otimizar imagens do projeto
 * Executa: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets');
const OUTPUT_DIR = join(__dirname, '..', 'src', 'assets-optimized');

const CONFIG = {
  // Imagem Hero - maior, mas otimizada
  hero: {
    width: 1920,
    height: 1080,
    quality: 80,
  },
  // Imagens de projetos
  projects: {
    width: 800,
    height: 600,
    quality: 75,
  },
  // Outras imagens
  default: {
    width: 1200,
    height: 800,
    quality: 75,
  },
};

async function getFilesRecursive(dir) {
  const files = [];
  const items = await readdir(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      files.push(...(await getFilesRecursive(fullPath)));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(item)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getConfig(filePath) {
  const name = basename(filePath).toLowerCase();
  
  if (name.includes('fachada-ilustracao') || name.includes('hero')) {
    return CONFIG.hero;
  }
  if (filePath.includes('project')) {
    return CONFIG.projects;
  }
  return CONFIG.default;
}

async function optimizeImage(inputPath, outputPath) {
  const config = getConfig(inputPath);
  const ext = extname(inputPath).toLowerCase();
  
  const inputStats = await stat(inputPath);
  const inputSizeKB = Math.round(inputStats.size / 1024);

  let pipeline = sharp(inputPath)
    .resize(config.width, config.height, {
      fit: 'inside',
      withoutEnlargement: true,
    });

  // Converter para WebP (melhor compressão)
  const outputWebP = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  await pipeline
    .webp({ quality: config.quality })
    .toFile(outputWebP);

  const outputStats = await stat(outputWebP);
  const outputSizeKB = Math.round(outputStats.size / 1024);
  const reduction = Math.round((1 - outputSizeKB / inputSizeKB) * 100);

  console.log(`✅ ${basename(inputPath)}`);
  console.log(`   ${inputSizeKB}KB → ${outputSizeKB}KB (-${reduction}%)`);
  console.log(`   → ${basename(outputWebP)}\n`);

  return { inputSizeKB, outputSizeKB };
}

async function main() {
  console.log('🖼️  Otimizador de Imagens - Educandário\n');
  console.log('='.repeat(50) + '\n');

  // Criar pasta de saída
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    await mkdir(join(OUTPUT_DIR, 'project'), { recursive: true });
  } catch (e) {}

  const files = await getFilesRecursive(ASSETS_DIR);
  
  if (files.length === 0) {
    console.log('❌ Nenhuma imagem encontrada');
    return;
  }

  console.log(`📁 Encontradas ${files.length} imagens\n`);

  let totalInput = 0;
  let totalOutput = 0;

  for (const file of files) {
    const relativePath = file.replace(ASSETS_DIR, '');
    const outputPath = join(OUTPUT_DIR, relativePath);
    
    // Criar subpasta se necessário
    const outputDir = dirname(outputPath);
    await mkdir(outputDir, { recursive: true });

    try {
      const { inputSizeKB, outputSizeKB } = await optimizeImage(file, outputPath);
      totalInput += inputSizeKB;
      totalOutput += outputSizeKB;
    } catch (err) {
      console.log(`❌ Erro em ${basename(file)}: ${err.message}\n`);
    }
  }

  console.log('='.repeat(50));
  console.log(`\n📊 RESUMO:`);
  console.log(`   Total antes:  ${totalInput}KB (${(totalInput/1024).toFixed(2)}MB)`);
  console.log(`   Total depois: ${totalOutput}KB (${(totalOutput/1024).toFixed(2)}MB)`);
  console.log(`   Economia:     ${totalInput - totalOutput}KB (-${Math.round((1 - totalOutput/totalInput) * 100)}%)`);
  console.log(`\n✨ Imagens otimizadas em: src/assets-optimized/`);
  console.log(`\n📝 Próximos passos:`);
  console.log(`   1. Revise as imagens em assets-optimized/`);
  console.log(`   2. Copie para assets/ substituindo as originais`);
  console.log(`   3. Atualize imports se necessário (.jpg → .webp)`);
}

main().catch(console.error);
