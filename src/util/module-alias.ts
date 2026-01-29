import * as path from 'path';
import moduleAlias from 'module-alias';

const files = path.resolve(__dirname, '../..');

moduleAlias.addAliases({
  // Se o diretório atual terminar com 'dist', aponta para a raiz da dist, 
  // caso contrário (desenvolvimento), aponta para 'src'
  '@src': path.join(files, __dirname.includes('dist') ? '' : 'src'),
  '@test': path.join(files, 'test'),
});