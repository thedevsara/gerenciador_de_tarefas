let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let idCounter = tarefas.length > 0 ? Math.max(...tarefas.map(t => t.id)) + 1 : 1;

const inputDescricao = document.getElementById('descricaoTarefa');
const btnAdicionar = document.getElementById('adicionarBtn');
const tabela = document.getElementById('tabelaTarefas').getElementsByTagName('tbody')[0];
const seletorFiltro = document.getElementById('filtro');

btnAdicionar.addEventListener("click", adicionarTarefa);
seletorFiltro.addEventListener("change", renderizarTabela);

function adicionarTarefa() {
  const descricao = inputDescricao.value.trim();
  if (!descricao) {
    alert("Por favor, insira uma descrição para a tarefa.");
    return;
  }

  const novaTarefa = {
    id: idCounter++,
    descricao: descricao,
    dataInicio: new Date().toLocaleDateString('pt-BR'),
    dataConclusao: ""
  };

  tarefas.push(novaTarefa);
  salvarTarefas();
  inputDescricao.value = "";
  renderizarTabela();
}

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function renderizarTabela() {
  tabela.innerHTML = "";

  const filtro = seletorFiltro.value;
  let tarefasFiltradas = tarefas;

  if (filtro === "pendentes") {
    tarefasFiltradas = tarefas.filter(t => !t.dataConclusao);
  } else if (filtro === "concluidas") {
    tarefasFiltradas = tarefas.filter(t => t.dataConclusao);
  }

  tarefasFiltradas.forEach(tarefa => {
    const linha = tabela.insertRow();

    linha.insertCell().innerText = tarefa.id;

    const cellDescricao = linha.insertCell();
    cellDescricao.innerText = tarefa.descricao;
    cellDescricao.ondblclick = () => editarDescricao(tarefa, cellDescricao);

    linha.insertCell().innerText = tarefa.dataInicio;
    linha.insertCell().innerText = tarefa.dataConclusao;

    const celulaAcoes = linha.insertCell();

    if (!tarefa.dataConclusao) {
      const btnConcluir = document.createElement("button");
      btnConcluir.innerText = "Concluir";
      btnConcluir.className = "concluirBtn";
      btnConcluir.onclick = () => concluirTarefa(tarefa.id);
      celulaAcoes.appendChild(btnConcluir);
    } else {
      const btnReabrir = document.createElement("button");
      btnReabrir.innerText = "Reabrir";
      btnReabrir.className = "reabrirBtn";
      btnReabrir.onclick = () => reabrirTarefa(tarefa.id);
      celulaAcoes.appendChild(btnReabrir);
    }

    const btnExcluir = document.createElement("button");
    btnExcluir.innerText = "Excluir";
    btnExcluir.className = "excluirBtn";
    btnExcluir.onclick = () => excluirTarefa(tarefa.id);
    celulaAcoes.appendChild(btnExcluir);
  });
}

function concluirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  const usarDataAtual = confirm("Deseja usar a data atual para conclusão?");
  if (usarDataAtual) {
    tarefa.dataConclusao = new Date().toLocaleDateString('pt-BR');
  } else {
    const dataManual = prompt("Digite a data de conclusão (DD/MM/AAAA):");
    if (dataManual && /^\d{2}\/\d{2}\/\d{4}$/.test(dataManual)) {
      tarefa.dataConclusao = dataManual;
    } else {
      alert("Data inválida. A tarefa não foi concluída.");
      return;
    }
  }

  salvarTarefas();
  renderizarTabela();
}

function reabrirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.dataConclusao = "";
    salvarTarefas();
    renderizarTabela();
  }
}

function excluirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa.dataConclusao) {
    alert("Não é possível excluir tarefas concluídas.");
    return;
  }

  if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
    tarefas = tarefas.filter(t => t.id !== id);

     if (tarefas.length === 0) {      // 🔁 Resetar contador se tudo for excluído
      idCounter = 1;
    }

    salvarTarefas();
    renderizarTabela();
  }
}

function editarDescricao(tarefa, celula) {
  const novaDescricao = prompt("Editar descrição:", tarefa.descricao);
  if (novaDescricao && novaDescricao.trim() !== "") {
    tarefa.descricao = novaDescricao.trim();
    salvarTarefas();
    renderizarTabela();
  }
}

// Primeira renderização ao carregar a página
renderizarTabela();
