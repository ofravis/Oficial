function Contador({ total = 0, pendentes = 0, concluidas = 0 }) {
  return (
    <div id="contadores" aria-label="Contadores de tarefas">
      <span id="cont-total">Total: {total}</span>
      <span className="separador">•</span>
      <span id="cont-pendentes">Pendentes: {pendentes}</span>
      <span className="separador">•</span>
      <span id="cont-concluidas">Concluídas: {concluidas}</span>
    </div>
  );
}

export default Contador;
