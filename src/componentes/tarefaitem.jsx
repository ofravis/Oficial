import styles from "./tarefaitem.module.css";

function TarefaItem({
  // Props existentes — sem alteração
  texto,
  concluida = false,
  prioridade = "media",
  cidade = "",
  onDeletar,
  onConcluir,

  // Props novas — opcionais, com valor padrão null
  // Recebidas via ListaTarefas, que injeta o tarefa.id no onMover/onEditar
  onMover = null,
  onEditar = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  // ── Classes CSS — sem alteração ──────────────────────────────────────────
  const classeItem =
    (concluida ? styles.tarefa + " " + styles.concluida : styles.tarefa) +
    " " +
    styles[prioridade];

  const classeTexto = concluida
    ? styles.textoTarefa + " " + styles["texto-tarefa"]
    : styles.textoTarefa;

  const classePrioridade =
    styles["badge-prioridade"] + " " + styles["badge-" + prioridade];

  // ── Modo Kanban: detectado pela presença da prop onMover ─────────────────
  const modoKanban = onMover !== null;

  return (
    <li className={classeItem}>
      {/* Texto da tarefa — duplo clique para concluir (funciona nos dois modos) */}
      {/* <span className={classeTexto} onDoubleClick={onConcluir}>
          {texto}
        </span> */}

      <div className={styles.conteudo}>
        {/* Duplo clique abre o modal de edição com os dados preenchidos */}
        <span
          className={classeTexto}
          onDoubleClick={onEditar || onConcluir}
          title="Duplo clique para editar"
        >
          {texto}
        </span>
        {cidade && <span className={styles.cidade}>{cidade}</span>}
      </div>

      {/* Badge de prioridade — reutilizado nos dois modos sem alteração */}
      <span className={classePrioridade}>{prioridade}</span>

      {/*
        ── Container de ações ────────────────────────────────────────────────
        Modo lista:  só o botão X aparece
        Modo Kanban: botões ← → e X aparecem juntos
      */}
      <div className={styles.acoes}>
        {/* Botão ← só aparece no modo Kanban E se há coluna anterior */}
        {modoKanban && colunaAnterior && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaAnterior)}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}

        {/* Botão → só aparece no modo Kanban E se há próxima coluna */}
        {modoKanban && colunaProxima && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaProxima)}
            title="Mover para próxima coluna"
          >
            →
          </button>
        )}

        {/* Botão X — deletar — presente nos dois modos */}
        <button className={styles.btnDeletar} onClick={onDeletar}>
          X
        </button>
      </div>
    </li>
  );
}

export default TarefaItem;
