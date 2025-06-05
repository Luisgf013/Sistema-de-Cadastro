document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const cargo = document.getElementById('cargo').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !email || !cargo || !endereco) {
    alert("Todos os campos são obrigatórios.");
    return;
  }

  const res = await fetch('/api/pessoas', {
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
    item.textContent = `${pessoa.nome} - ${pessoa.email} - ${pessoa.cargo} - ${pessoa.endereco}`;
    lista.appendChild(item);
  });
}

carregarPessoas();
