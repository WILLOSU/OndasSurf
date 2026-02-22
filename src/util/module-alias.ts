import * as path from 'path';
import * as moduleAlias from 'module-alias';

const rootPath = path.resolve(__dirname, '..');

moduleAlias.addAliases({
  '@src': rootPath,
  '@test': path.resolve(rootPath, '..', 'test'),
});
