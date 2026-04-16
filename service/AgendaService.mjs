const STORAGE_KEY = 'agenda_contatos';

export class AgendaService {
  getContatos() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  saveContato(contato) {
    const contatos = this.getContatos();
    contatos.push(contato);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contatos));
  }

  deleteContato(id) {
    const contatos = this.getContatos();
    const atualizados = contatos.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));
  }
}
