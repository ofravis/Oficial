import styles from "./sobre.module.css";

function Sobre() {
  return (
    <div className={styles.pagina}>
      <h1>Sobre</h1>
      <h2>TaskFlow</h2>
      <p>
        Página simples como teste para o projeto "TaskFlow" - Aluno Flávio
        Azevedo - Prof. Alan Glei
      </p>
      <p>SENAI CTGAS-ER</p>

      <button className={styles.btnNothing} type="button">
        TaskFlow
      </button>
    </div>
  );
}
export default Sobre;
