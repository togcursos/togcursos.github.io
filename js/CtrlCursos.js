import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  cod,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";

const lista = document.
  querySelector("#lista");
const daoCurso =
  getFirestore().
    collection("Curso");

getAuth().
  onAuthStateChanged(
    protege, muestraError);

async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    consulta();
  }
}

function consulta() {
  daoCurso.
    orderBy("nombre")
    .onSnapshot(
      htmlLista, errConsulta);
}

function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) {
    snap.forEach(doc =>
      html += htmlFila(doc));
  } else {
    html += 
      `<li class="vacio">
        -- No hay registro
        de Cursos. --
      </li>`;
  }
  lista.innerHTML = html;
}

function htmlFila(doc) {
  const data = doc.data();
  const nombre = cod(data.nombre);
  const parámetros =
    new URLSearchParams();
  parámetros.append("id", doc.id);
  return ( 
    `<li>
      <a class="fila" href=
  "curso.html?${parámetros}">
        <strong class="primario">
          ${nombre}
        </strong>
      </a>
    </li>`);
}

function errConsulta(e) {
  muestraError(e);
  consulta();
}
