document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  const res = await fetch('/api/pessoas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
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
    item.textContent = `${pessoa.nome} - ${pessoa.email}`;
    lista.appendChild(item);
  });
}

carregarPessoas();
