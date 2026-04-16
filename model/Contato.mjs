export class Contato {
  constructor(nome, telefone, email) {
    this.id = Date.now();
    this.nome = nome;
    this.telefone = telefone;
    this.email = email;
  }
}
