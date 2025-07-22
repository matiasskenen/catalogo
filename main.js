// Supabase config
const SUPABASE_URL = 'https://usydjgeczejnulewloac.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeWRqZ2VjemVqbnVsZXdsb2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTM3MDAsImV4cCI6MjA2ODY2OTcwMH0.sBI9P9bDGYwNDU8D6Laca6OPWzUTAqsVpQCp0-zUf2U';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
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

  // Solo se ejecuta en el index.html
  if (document.getElementById("lista")) {
    cargarArchivos();
  }
});

async function cargarArchivos() {
  const { data, error } = await supabase
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
      <img src="${archivo.imagen || 'default-image.png'}" alt="${archivo.titulo}" style="max-width:100px;max-height:100px;" />
      <h2>${archivo.titulo}</h2>
      <p>${archivo.descripcion || "Sin descripción"}</p>
      <a href="${archivo.link}" target="_blank">Descargar</a>
    `;
    contenedor.appendChild(div);
  });
}

async function guardarArchivo(event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const link = document.getElementById("link").value;
  const archivoImagen = document.getElementById("imagen").files[0];

  if (!archivoImagen) {
    alert("Seleccioná una imagen.");
    return;
  }

  const nombreArchivo = Date.now() + "-" + archivoImagen.name;

  // Subir imagen al bucket 'imagenes'
  const { error: uploadError } = await supabase
    .storage
    .from("imagenes")
    .upload(nombreArchivo, archivoImagen);

  if (uploadError) {
    alert("Error al subir la imagen: " + uploadError.message);
    return;
  }

  // Obtener URL pública
  const { data: publicUrlData } = supabase
    .storage
    .from("imagenes")
    .getPublicUrl(nombreArchivo);

  const imagenUrl = publicUrlData.publicUrl;

  // Insertar datos en la tabla
  const { error: insertError } = await supabase
    .from("archivos")
    .insert([{ titulo, descripcion, link, imagen: imagenUrl }]);

  if (insertError) {
    alert("Error al guardar datos: " + insertError.message);
  } else {
    alert("Archivo guardado con éxito.");
    event.target.reset();
  }
}
