import { Contato } from '../model/Contato.mjs';
import { AgendaService } from '../service/AgendaService.mjs';

export class AgendaController {
  constructor() {
    this.service = new AgendaService();

    this.form         = document.getElementById('form-contato');
    this.inputNome    = document.getElementById('input-nome');
    this.inputTel     = document.getElementById('input-telefone');
    this.inputEmail   = document.getElementById('input-email');
    this.erroNome     = document.getElementById('erro-nome');
    this.erroTel      = document.getElementById('erro-telefone');
    this.erroEmail    = document.getElementById('erro-email');
    this.lista        = document.getElementById('lista-contatos');
    this.tabela       = document.getElementById('tabela-contatos');

    this._bindEvents();
  }

  init() {
    this._renderizarLista();
  }

  _bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._adicionarContato();
    });

    // Limpa o erro do campo ao começar a digitar
    this.inputNome.addEventListener('input',  () => this._limparErro(this.erroNome,  this.inputNome));
    this.inputTel.addEventListener('input',   () => this._limparErro(this.erroTel,   this.inputTel));
    this.inputEmail.addEventListener('input', () => this._limparErro(this.erroEmail, this.inputEmail));
  }

  _adicionarContato() {
    const nome  = this.inputNome.value.trim();
    const tel   = this.inputTel.value.trim();
    const email = this.inputEmail.value.trim();

    const valido = this._validar(nome, tel, email);
    if (!valido) return;

    const contato = new Contato(nome, tel, email);
    this.service.saveContato(contato);
    this.form.reset();
    this.inputNome.focus();
    this._renderizarLista();
  }

  _validar(nome, tel, email) {
    let ok = true;

    if (!nome) {
      this._mostrarErro(this.erroNome, this.inputNome, 'O nome é obrigatório.');
      ok = false;
    }

    if (!tel) {
      this._mostrarErro(this.erroTel, this.inputTel, 'O telefone é obrigatório.');
      ok = false;
    }else if (!/^\d+$/.test(tel)) {
      this._mostrarErro(this.erroTel, this.inputTel, 'O telefone deve conter apenas números.');
      ok = false;
    }


    if (!email) {
      this._mostrarErro(this.erroEmail, this.inputEmail, 'O e-mail é obrigatório.');
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this._mostrarErro(this.erroEmail, this.inputEmail, 'Informe um e-mail válido.');
      ok = false;
    }

    return ok;
  }

  _mostrarErro(erroEl, inputEl, msg) {
    erroEl.textContent = msg;
    erroEl.style.display = 'inline';
    inputEl.style.outline = '2px solid red';
  }

  _limparErro(erroEl, inputEl) {
    erroEl.textContent = '';
    erroEl.style.display = 'none';
    inputEl.style.outline = '';
  }

  _removerContato(id) {
    this.service.deleteContato(id);
    this._renderizarLista();
  }

  _renderizarLista() {
    const contatos = this.service.getContatos();
    this.lista.innerHTML = '';

    if (contatos.length === 0) {
      this.tabela.style.display   = 'none';
      return;
    }

    this.tabela.style.display   = 'table';

    contatos.forEach(contato => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${this._escapar(contato.nome)}</td>
        <td>${this._escapar(contato.telefone)}</td>
        <td>${this._escapar(contato.email)}</td>
        <td>
          <button class="btn-remover" data-id="${contato.id}">Remover</button>
        </td>
      `;

      tr.querySelector('.btn-remover').addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        this._removerContato(id);
      });

      this.lista.appendChild(tr);
    });
  }

  _escapar(texto) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(texto));
    return div.innerHTML;
  }
}
