document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const cargo = document.getElementById('cargo').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !email || !cargo || !endereco || !email.includes('@')) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  await fetch('/api/pessoas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, cargo, endereco })
  });

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
    item.innerHTML = `${pessoa.nome} - ${pessoa.email} - ${pessoa.cargo} - ${pessoa.endereco}
      <button onclick="removerPessoa(${pessoa.id})">Excluir</button>`;
    lista.appendChild(item);
  });
}

async function removerPessoa(id) {
  await fetch(`/api/pessoas/${id}`, { method: 'DELETE' });
  carregarPessoas();
}

carregarPessoas();
