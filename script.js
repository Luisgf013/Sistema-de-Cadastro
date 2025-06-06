const API_URL = 'https://4fa447b5-259a-4fd8-8e89-3d662275b15d-00-1gybqmxrxuf3e.janeway.replit.dev/api/pessoas';

let pessoaEditando = null;

document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const cargo = document.getElementById('cargo').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !email || !cargo || !endereco) {
    alert('Preencha todos os campos!');
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert('Digite um e-mail válido.');
    return;
  }

  const dados = { nome, email, cargo, endereco };

  try {
    if (pessoaEditando) {
      await fetch(`${API_URL}/${pessoaEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      pessoaEditando = null;
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }

    document.getElementById('cadastro-form').reset();
    carregarPessoas();
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
  }
});

async function carregarPessoas() {
  try {
    const res = await fetch(API_URL);
    const pessoas = await res.json();
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    pessoas.forEach(pessoa => {
      const item = document.createElement('li');
      item.innerHTML = `
        <strong>${pessoa.nome}</strong> - ${pessoa.email} - ${pessoa.cargo} - ${pessoa.endereco}
        <button onclick="editarPessoa(${pessoa.id}, '${pessoa.nome}', '${pessoa.email}', '${pessoa.cargo}', '${pessoa.endereco}')">Editar</button>
        <button onclick="deletarPessoa(${pessoa.id})">Excluir</button>
      `;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error('Erro ao carregar:', error);
  }
}

window.editarPessoa = function(id, nome, email, cargo, endereco) {
  document.getElementById('nome').value = nome;
  document.getElementById('email').value = email;
  document.getElementById('cargo').value = cargo;
  document.getElementById('endereco').value = endereco;
  pessoaEditando = id;
};

window.deletarPessoa = async function(id) {
  if (!confirm('Deseja realmente excluir?')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    carregarPessoas();
  } catch (error) {
    console.error('Erro ao excluir:', error);
  }
};

carregarPessoas();
