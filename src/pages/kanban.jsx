import Header from "../componentes/header";
import Contador from "../componentes/contador";
import ListaTarefas from "../componentes/listatarefas";
import ModalTarefa from "../componentes/modaltarefa";
import { useState, useEffect } from "react";

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const URL_API = "https://6a85afa89c451dc67a63f802.mockapi.io/api/v1/tarefas";

  // ── Modal: controla criação e edição de tarefas ─────────────────────────
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  // ── Melhoria: filtro por prioridade nas colunas ─────────────────────────
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await axios.get(URL_API);
        setTarefas(resposta.data); // array de tarefas
      } catch (e) {
        setErro("Erro ao carregar tarefas. Verifique a conexão.");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }

    carregarTarefas();
  }, []); // [] = executa uma vez ao montar
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

  // ──────────────────────────────────────────────────────────────
  // Uma função só para criar E editar — decide pelo id em dados

  async function salvarTarefa(dados) {
    try {
      if (dados.id !== undefined) {
        // EDITAR — PUT com id na URL
        const { data: tarefaEditada } = await axios.put(
          URL_API + "/" + dados.id,
          {
            texto: dados.texto,
            prioridade: dados.prioridade,
            cidade: dados.cidade,
            coluna: dados.coluna,
          },
        );
        setTarefas((t) =>
          t.map((x) => (x.id === dados.id ? tarefaEditada : x)),
        );
      } else {
        // CRIAR — POST sem id (API gera automaticamente)
        const { data: novaTarefa } = await axios.post(URL_API, {
          texto: dados.texto,
          prioridade: dados.prioridade,
          cidade: dados.cidade,
          coluna: dados.coluna,
        });
        setTarefas((t) => [...t, novaTarefa]);
      }
    } catch (e) {
      setErro("Erro ao salvar tarefa.");
      console.error(e);
    }
  }

  // ------------------------------------

  const alternarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  };

  // ----------------------------------------------

  async function moverTarefa(id, novaColuna) {
    try {
      const { data: tarefaMovida } = await axios.patch(
        URL_API + "/" + id,
        { coluna: novaColuna }, // só o campo alterado
      );
      setTarefas((t) => t.map((x) => (x.id === id ? tarefaMovida : x)));
    } catch (e) {
      setErro("Erro ao mover tarefa.");
    }
  }
  // DELETE — remover com confirmação
  async function deletarTarefa(id) {
    const confirmado = window.confirm("Deletar esta tarefa?");
    if (!confirmado) return;
    try {
      await axios.delete(URL_API + "/" + id);
      // Atualiza local APÓS confirmar na API
      setTarefas((t) => t.filter((x) => x.id !== id));
    } catch (e) {
      setErro("Erro ao deletar tarefa.");
    }
  }

  //---------------------------------------------------
  {
    carregando && (
      <p style={{ textAlign: "center", color: "#94A3B8" }}>
        Carregando tarefas...
      </p>
    );
  }
  {
    erro && <p style={{ textAlign: "center", color: "#EF4444" }}>{erro}</p>;
  }
  {
    !carregando && !erro && (
      <div className="kanban-quadro">{/* colunas do Kanban */}</div>
    );
  }

  // ── Melhoria: confirmação antes de deletar ──────────────────────────────

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
