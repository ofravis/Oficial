import Header from "../componentes/header";
import Contador from "../componentes/contador";
import ListaTarefas from "../componentes/listatarefas";
import ModalTarefa from "../componentes/modaltarefa";
import { useState, useEffect } from "react";

function Kanban() {
  const [proximaId, setProximaId] = useState(1);
  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (!tarefasSalvas) return [];
    const tarefasConvertidas = JSON.parse(tarefasSalvas);
    setProximaId(
      tarefasConvertidas[tarefasConvertidas.length - 1]?.id + 1 || 1,
    );
    return Array.isArray(tarefasConvertidas) ? tarefasConvertidas : [];
  });

  // ── Modal: controla criação e edição de tarefas ─────────────────────────
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  // ── Melhoria: filtro por prioridade nas colunas ─────────────────────────
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  // ── Melhoria: contador de pendentes no título da aba ────────────────────
  useEffect(() => {
    const pendentes = tarefas.filter((t) => !t.concluida).length;
    document.title =
      pendentes > 0 ? `(${pendentes}) TaskFlow Hub` : "TaskFlow Hub";
  }, [tarefas]);

  // Abre o modal para CRIAR — botão + na coluna, campos vazios
  function abrirModalCriar(coluna) {
    setTarefaEditando(null); // null = modo criação
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  // Abre o modal para EDITAR — duplo clique no card, campos preenchidos
  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa); // objeto = modo edição
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  // Uma função só para criar E editar — decide pelo id em dados
  function salvarTarefa(dados) {
    if (dados.id) {
      // EDITAR: atualiza a tarefa mantendo a coluna original
      setTarefas(
        tarefas.map((t) => (t.id === dados.id ? { ...t, ...dados } : t)),
      );
    } else {
      // CRIAR: adiciona nova tarefa na coluna escolhida
      setTarefas([...tarefas, { ...dados, id: proximaId, concluida: false }]);
      setProximaId(proximaId + 1);
    }
  }

  // ── Melhoria: confirmação antes de deletar ──────────────────────────────
  const deletarTarefa = (id) => {
    const tarefa = tarefas.find((t) => t.id === id);
    const confirmou = window.confirm(
      `Excluir a tarefa "${tarefa?.texto}"? Essa ação não pode ser desfeita.`,
    );
    if (!confirmou) return;
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  // ── Sem alteração ─────────────────────────────────────────────────────────
  const alternarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  };

  const moverTarefa = (id, novaColuna) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id
          ? {
              ...tarefa,
              coluna: novaColuna,
              concluida: novaColuna === "concluido",
            }
          : tarefa,
      ),
    );
  };

  // Aplica o filtro de prioridade (se houver) antes de separar por coluna
  const tarefasFiltradas =
    filtroPrioridade === "todas"
      ? tarefas
      : tarefas.filter((t) => t.prioridade === filtroPrioridade);

  return (
    <>
      {/* Sem alteração */}
      <Contador
        total={tarefas.length}
        pendentes={tarefas.filter((t) => !t.concluida).length}
        concluidas={tarefas.filter((t) => t.concluida).length}
      />
      <Header
        titulo="TaskFlow Hub"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />

      <main className="container">
        <section id="formulario">
          <div className="campo-linha">
            {/* Filtro por prioridade — afeta as três colunas do quadro */}
            <select
              id="sel-prioridade"
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
            >
              <option value="todas">Todas as prioridades</option>
              <option value="alta">🔴 Alta</option>
              <option value="media">🟡 Média</option>
              <option value="baixa">🟢 Baixa</option>
            </select>
          </div>
        </section>

        {/*
          ── MODIFICAÇÃO 3: quadro Kanban ──────────────────────────────────────
          Estilos em index.css — seção "16. KANBAN"
          Cada coluna tem um botão "+" que abre o modal já na coluna certa.
        */}
        <div className="kanban-quadro">
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              <div className="kanban-coluna-acoes">
                {/* Contador usa array completo para mostrar o total real */}
                <span className="kanban-contador">
                  {tarefasFiltradas.filter((t) => t.coluna === "afazer").length}
                </span>
                <button
                  className="kanban-btn-add"
                  type="button"
                  title="Nova tarefa em A Fazer"
                  onClick={() => abrirModalCriar("afazer")}
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "afazer")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior={null}
              colunaProxima="andamento"
            />
          </div>

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Em Andamento</h3>
              <div className="kanban-coluna-acoes">
                <span className="kanban-contador">
                  {
                    tarefasFiltradas.filter((t) => t.coluna === "andamento")
                      .length
                  }
                </span>
                <button
                  className="kanban-btn-add"
                  type="button"
                  title="Nova tarefa em Em Andamento"
                  onClick={() => abrirModalCriar("andamento")}
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Concluído</h3>
              <div className="kanban-coluna-acoes">
                <span className="kanban-contador">
                  {
                    tarefasFiltradas.filter((t) => t.coluna === "concluido")
                      .length
                  }
                </span>
                <button
                  className="kanban-btn-add"
                  type="button"
                  title="Nova tarefa em Concluído"
                  onClick={() => abrirModalCriar("concluido")}
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>
        </div>
      </main>

      {/* Modal — único, fora das colunas, cuida de criar e editar */}
      <ModalTarefa
        aberto={modalAberto}
        onFechar={fecharModal}
        onSalvar={salvarTarefa}
        tarefa={tarefaEditando}
        coluna={colunaAtiva}
      />

      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Dev Flávio Azevedo &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default Kanban;
