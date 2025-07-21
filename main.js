// Supabase config
const SUPABASE_URL = 'https://usydjgeczejnulewloac.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeWRqZ2VjemVqbnVsZXdsb2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTM3MDAsImV4cCI6MjA2ODY2OTcwMH0.sBI9P9bDGYwNDU8D6Laca6OPWzUTAqsVpQCp0-zUf2U';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  // Buscador
  const buscador = document.getElementById("buscador");
  if (buscador) {
    buscador.addEventListener("keyup", () => {
      const filtro = buscador.value.toLowerCase();
      const archivos = document.querySelectorAll(".archivo");
      archivos.forEach(div => {
        div.style.display = div.innerText.toLowerCase().includes(filtro) ? "block" : "none";
      });
    });
  }

  // Cargar archivos dinámicos desde Supabase
  cargarArchivos();
});

async function cargarArchivos() {
  const { data, error } = await supabaseClient
    .from("archivos")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) {
    document.getElementById("lista").innerHTML = "Error al cargar archivos.";
    return;
  }

  const contenedor = document.getElementById("lista");
  data.forEach((archivo) => {
    const div = document.createElement("div");
    div.className = "archivo";
    div.innerHTML = `
      <h2>${archivo.titulo}</h2>
      <p>${archivo.descripcion || "Sin descripción"}</p>
      <a href="${archivo.link}" target="_blank">Descargar</a>
    `;
    contenedor.appendChild(div);
  });
}
