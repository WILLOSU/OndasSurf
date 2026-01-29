import * as path from 'path';
import moduleAlias from 'module-alias';

// Pega o diretório onde este arquivo compilado está (dist/util)
const currentDir = __dirname;

// Se estivermos na 'dist', a raiz do código é a própria 'dist'
// Se estivermos na 'src', a raiz é a 'src'
const isProduction = currentDir.includes('dist');
const rootPath = isProduction 
  ? path.resolve(currentDir, '..') // Sobe de 'util' para 'dist'
  : path.resolve(currentDir, '..'); // Sobe de 'util' para 'src'

moduleAlias.addAliases({
  '@src': rootPath,
  '@test': path.resolve(rootPath, '..', 'test'),
});