import Header from "../componentes/header";
import Contador from "../componentes/contador";
import ListaTarefas from "../componentes/listatarefas";
import ModalTarefa from "../componentes/modaltarefa";
import { useState, useEffect } from "react";
import axios from "axios"; // 1. IMPORT DO AXIOS ADICIONADO

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Altere para "http://localhost:3000/tarefas" se for usar o seu backend Express local
  const URL_API = "https://6a85afa89c451dc67a63f802.mockapi.io/api/v1/tarefas";

  // ── Modal: controla criação e edição de tarefas ─────────────────────────
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  // ── Filtro por prioridade ─────────────────────────
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");

  // CARREGAR TAREFAS (GET)
  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await axios.get(URL_API);
        setTarefas(resposta.data);
      } catch (e) {
        setErro("Erro ao carregar tarefas. Verifique a conexão.");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }

    carregarTarefas();
  }, []);

  // Controladores do Modal
  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setTarefaEditando(null);
  }

  // SALVAR TAREFA (POST / PUT) - Função Única e Unificada
  async function salvarTarefa(dados) {
    try {
      setErro("");

      // Se possui ID válido (diferente de null/undefined), é EDITAR (PUT)
      if (dados.id) {
        const { data: tarefaEditada } = await axios.put(
          `${URL_API}/${dados.id}`,
          {
            texto: dados.texto,
            prioridade: dados.prioridade,
            cidade: dados.cidade,
            coluna: dados.coluna || colunaAtiva,
          },
        );

        setTarefas((prev) =>
          prev.map((t) => (t.id === dados.id ? tarefaEditada : t)),
        );
      } else {
        // Se NÃO possui ID, é CRIAR (POST)
        const { data: novaTarefa } = await axios.post(URL_API, {
          texto: dados.texto,
          prioridade: dados.prioridade || "media",
          cidade: dados.cidade || "",
          coluna: dados.coluna || colunaAtiva, // Usa coluna passada ou a coluna onde clicou no +
        });

        setTarefas((prev) => [...prev, novaTarefa]);
      }

      fecharModal(); // Fecha o modal após o sucesso
    } catch (e) {
      setErro(
        "Erro ao salvar tarefa. Verifique se os campos obrigatórios estão preenchidos.",
      );
      console.error(e);
    }
  }

  // ALTERAR CONCLUÍDA
  const alternarConcluida = (id) => {
    setTarefas((prev) =>
      prev.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  };

  // MOVER TAREFA DE COLUNA (PUT)
  async function moverTarefa(id, novaColuna) {
    try {
      setErro("");
      // Busca a tarefa atual no estado
      const tarefaAtual = tarefas.find((t) => t.id === id);
      if (!tarefaAtual) return;

      // Utiliza PUT em vez de PATCH
      const { data: tarefaMovida } = await axios.put(`${URL_API}/${id}`, {
        ...tarefaAtual,
        coluna: novaColuna,
      });

      setTarefas((prev) => prev.map((t) => (t.id === id ? tarefaMovida : t)));
    } catch (e) {
      setErro("Erro ao mover tarefa. Verifique se o servidor está rodando.");
      console.error(e);
    }
  }

  // DELETAR TAREFA (DELETE)
  async function deletarTarefa(id) {
    const confirmado = window.confirm("Deletar esta tarefa?");
    if (!confirmado) return;

    try {
      await axios.delete(`${URL_API}/${id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setErro("Erro ao deletar tarefa.");
      console.error(e);
    }
  }

  // Aplicar filtro de prioridade
  const tarefasFiltradas =
    filtroPrioridade === "todas"
      ? tarefas
      : tarefas.filter((t) => t.prioridade === filtroPrioridade);

  return (
    <>
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
        {/* Exibição de Mensagens de Estado */}
        {carregando && (
          <p style={{ textAlign: "center", color: "#94A3B8" }}>
            Carregando tarefas...
          </p>
        )}

        {erro && (
          <p
            style={{
              textAlign: "center",
              color: "#EF4444",
              fontWeight: "bold",
            }}
          >
            {erro}
          </p>
        )}

        <section id="formulario">
          <div className="campo-linha">
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

        {/* Quadro Kanban */}
        <div className="kanban-quadro">
          {/* Coluna: A Fazer */}
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              <div className="kanban-coluna-acoes">
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

          {/* Coluna: Em Andamento */}
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

          {/* Coluna: Concluído */}
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

      {/* Modal de Criação / Edição */}
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
