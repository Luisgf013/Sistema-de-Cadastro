const apiUrl = 'https://9f0bcfbd-2ac7-44af-a918-179e573b3f8d-00-wcbk1zfkwnzn.spock.replit.dev/
';

const form = document.getElementById('formCliente');
const listaClientes = document.getElementById('listaClientes');
const inputId = document.getElementById('clienteId');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputTelefone = document.getElementById('telefone');
const inputCpf = document.getElementById('cpf');
const btnCancelar = document.getElementById('cancelarEdicao');

let editando = false;

async function listarClientes() {
  const res = await fetch(apiUrl);
  const clientes = await res.json();
  listaClientes.innerHTML = '';

  clientes.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.email}</td>
      <td>${c.telefone}</td>
      <td>${c.cpf}</td>
      <td>
        <button class="editar" data-id="${c.id}">Editar</button>
        <button class="deletar" data-id="${c.id}">Deletar</button>
      </td>
    `;
    listaClientes.appendChild(tr);
  });

  document.querySelectorAll('.editar').forEach(btn => {
    btn.onclick = async e => {
      const id = e.target.dataset.id;
      const res = await fetch(`${apiUrl}/${id}`);
      if (res.ok) {
        const cliente = await res.json();
        inputId.value = cliente.id;
        inputNome.value = cliente.nome;
        inputEmail.value = cliente.email;
        inputTelefone.value = cliente.telefone;
        inputCpf.value = cliente.cpf;
        editando = true;
        btnCancelar.style.display = 'inline-block';
      }
    };
  });

  document.querySelectorAll('.deletar').forEach(btn => {
    btn.onclick = async e => {
      const id = e.target.dataset.id;
      if (confirm('Deseja realmente deletar este cliente?')) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        listarClientes();
      }
    };
  });
}

form.onsubmit = async e => {
  e.preventDefault();

  const cliente = {
    nome: inputNome.value.trim(),
    email: inputEmail.value.trim(),
    telefone: inputTelefone.value.trim(),
    cpf: inputCpf.value.trim()
  };

  if (!cliente.nome || !cliente.email) {
    alert('Nome e Email são obrigatórios');
    return;
  }

  if (editando) {
    const id = inputId.value;
    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
  } else {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
  }

  editando = false;
  btnCancelar.style.display = 'none';
  form.reset();
  listarClientes();
};

btnCancelar.onclick = () => {
  editando = false;
  btnCancelar.style.display = 'none';
  form.reset();
};

window.onload = () => {
  listarClientes();
};

