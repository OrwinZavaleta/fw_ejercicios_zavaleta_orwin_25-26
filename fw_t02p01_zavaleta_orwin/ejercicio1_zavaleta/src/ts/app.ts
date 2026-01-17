debugger
console.log("Orwin Zavaleta");

document.addEventListener("DOMContentLoaded", () => {
  comprobarSesionUsuario();
});

console.log("hola desde fuera");
function comprobarSesionUsuario(): void {
  let sesion: string | null = localStorage.getItem("session");

  console.log("hola");
  
  if (typeof sesion === "string") {
    document.querySelector("#menu-auth")?.classList.remove("d-none");
    document.querySelector("#menu-guest")?.classList.add("d-none");
  }
}
