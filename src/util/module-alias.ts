import * as path from 'path';
import moduleAlias from 'module-alias';

// Listando os arquivos que temos

const files = path.resolve(__dirname, '../..');

// adiconando alias para o src e para o teste
// já foi feito lá no type script, importante fazer no código também
// se for feito apenas no type script quando compilar o código na vai alias e não vai funcionar

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test'),
});
