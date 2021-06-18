import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  urlStorage
} from "../lib/storage.js";
import {
  cod,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";

const lista = document.
  querySelector("#lista");
const firestore = getFirestore();
const daoRol = firestore.
  collection("Rol");
const daoCurso = firestore.
  collection("Curso");
const daoUsuario = firestore.
  collection("Usuario");

getAuth().onAuthStateChanged(
  protege, muestraError);

async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    consulta();
  }
}

function consulta() {
  daoUsuario.onSnapshot(
    htmlLista, errConsulta);
}

async function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) {
    let usuarios = [];
    snap.forEach(doc => usuarios.
      push(htmlFila(doc)));
    const htmlFilas =
      await Promise.all(usuarios);
    html += htmlFilas.join("");
  } else {
    html +=
      `<li class="vacio">
        -- No hay usuarios
        registrados. --
      </li>`;
  }
  lista.innerHTML = html;
}

async function htmlFila(doc) {
  const data = doc.data();
  const img = cod(
    await urlStorage(doc.id));
  const curso =
    await buscaCurso(
      data.cursoId);
  const roles =
    await buscaRoles(data.rolIds);
  const parámetros =
    new URLSearchParams();
  parámetros.append("id", doc.id);
  return (
    `<li>
      <a class="fila conImagen"
          href=
    "usuario.html?${parámetros}">
        <span class="marco">
          <img src="${img}"
            alt="Falta el Avatar">
        </span>
        <span class="texto">
          <strong
              class="primario">
            ${cod(doc.id)}
          </strong>
          <span
              class="secundario">
            ${curso}<br>
            ${roles}
          </span>
        </span>
      </a>
    </li>`);
}

async function
  buscaCurso(id) {
  if (id) {
    const doc =
      await daoCurso.
        doc(id).
        get();
    if (doc.exists) {
      const data = doc.data();
      return (
        `${cod(data.nombre)}`);
    }
  }
  return "-- Curso sin Registrar --";
}

async function buscaRoles(ids) {
  let html = "";
  if (ids && ids.length > 0) {
    for (const id of ids) {
      const doc = await daoRol.
        doc(id).
        get();
      const data = doc.data();
      html += 
        `<em>${cod(doc.id)}</em>
        <br>
        ${cod(data.descripción)}
        <br>`;
    }
    return html;
  } else {
    return "-- Sin Rol --";
  }
}

function errConsulta(e) {
  muestraError(e);
  consulta();
}
