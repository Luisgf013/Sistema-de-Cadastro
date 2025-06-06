let pessoaEditando = null;

document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const cargo = document.getElementById('cargo').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !email || !email.includes('@')) {
    alert('Preencha os campos corretamente!');
    return;
  }

  const pessoa = { nome, email, cargo, endereco };

  if (pessoaEditando) {
    await fetch(`/api/pessoas/${pessoaEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pessoa)
    });
    pessoaEditando = null;
  } else {
    await fetch('/api/pessoas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pessoa)
    });
  }

  document.getElementById('cadastro-form').reset();
  carregarPessoas();
});

async function carregarPessoas() {
  const res = await fetch('/api/pessoas');
  const pessoas = await res.json();
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  pessoas.forEach(pessoa => {
    const item = document.createElement('li');
    item.innerHTML = `
      ${pessoa.nome} - ${pessoa.email} - ${pessoa.cargo || ''} - ${pessoa.endereco || ''}
      <button onclick="editarPessoa(${pessoa.id})">Editar</button>
      <button onclick="deletarPessoa(${pessoa.id})">Excluir</button>
    `;
    lista.appendChild(item);
  });
}

function editarPessoa(id) {
  fetch(`/api/pessoas/${id}`)
    .then(res => res.json())
    .then(pessoa => {
      document.getElementById('nome').value = pessoa.nome;
      document.getElementById('email').value = pessoa.email;
      document.getElementById('cargo').value = pessoa.cargo;
      document.getElementById('endereco').value = pessoa.endereco;
      pessoaEditando = pessoa.id;
    });
}

function deletarPessoa(id) {
  fetch(`/api/pessoas/${id}`, { method: 'DELETE' })
    .then(() => carregarPessoas());
}

carregarPessoas();
