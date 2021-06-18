class MiProgeso
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = 
      `<progress max="100">
        Cargando…
      </progress>`;
  }
}

customElements.define(
  "mi-progreso", MiProgeso);
