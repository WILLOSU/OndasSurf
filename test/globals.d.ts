// test/globals.d.ts

/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare var testRequest: import('supertest').SuperTest<
  import('supertest').Test
>;
/*
poriamos importar o tipo do testRequest, o prolema se usarmos ele aqui neste arquivo o typscript
vai tratar esse arquivo d.ts como modo local e não global.

precisamos declarar in line

adiconando assim tipos para os tipos globais

*/
