import ModalTarefa from "../componentes/modaltarefa";

const [modalAberto, setModalAberto] = useState(false);
const [tarefaEditando, setTarefaEditando] = useState(null);
const [colunaAtiva, setColunaAtiva] = useState("afazer");

// Abre modal para CRIAR — botão + na coluna

function abrirModalCriar(coluna) {
  setTarefaEditando(null); // null = modo criação
  setColunaAtiva(coluna);
  setModalAberto(true);
}

// Abre modal para EDITAR — duplo clique no card

function abrirModalEditar(tarefa) {
  setTarefaEditando(tarefa); // objeto = modo edição
  setModalAberto(true);
}

// Uma função para criar E editar

function salvarTarefa(dados) {
  if (dados.id) {
    // EDITAR: atualiza a tarefa com o id correspondente

    setTarefas(
      tarefas.map((t) => (t.id === dados.id ? { ...t, ...dados } : t)),
    );
  } else {
    // CRIAR: adiciona nova tarefa com id gerado

    setTarefas([...tarefas, { ...dados, id: Date.now() }]);
  }
}

<div className="kanban-coluna-header">
  <h3>A Fazer</h3>
  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
    <span className="kanban-contador">
      {tarefas.filter((t) => t.coluna === "afazer").length}
    </span>

    <button
      className="kanban-btn-add"
      onClick={() => abrirModalCriar("afazer")}
    >
      +
    </button>
  </div>
</div>;

{
  /* ListaTarefas passa onEditar para o TarefaItem */
}

<ListaTarefas
  tarefas={tarefas.filter((t) => t.coluna === "afazer")}
  onDeletar={deletarTarefa}
  onEditar={abrirModalEditar}
  onMover={moverTarefa}
  colunaAnterior={null}
  colunaProxima="andamento"
/>;

{
}

<ModalTarefa
  aberto={modalAberto}
  onFechar={() => setModalAberto(false)}
  onSalvar={salvarTarefa}
  tarefa={tarefaEditando}
  coluna={colunaAtiva}
/>;
