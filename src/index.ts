import * as path from 'path';
import moduleAlias from 'module-alias';

// __dirname é a pasta onde este arquivo (module-alias.js) está.
// Precisamos subir dois níveis para chegar na raiz do projeto (dist ou src).
const files = path.resolve(__dirname, '../..');

moduleAlias.addAliases({
  // Se o caminho atual contém 'dist', usamos a raiz da dist. 
  // Caso contrário, usamos a pasta 'src'.
  '@src': __dirname.includes('dist') 
    ? path.join(files) 
    : path.join(files, 'src'),
    
  '@test': path.join(files, 'test'),
});