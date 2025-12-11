document.addEventListener('DOMContentLoaded', function () {
  // ═════════ CONFIGURACIÓN DE APIS ═════════
  const NEWS_API_URL = `json/json.json`;
  const FREE_TO_GAME_API = 'https://www.freetogame.com/api/games';
  const CORS_PROXY = 'https://corsproxy.io/?';

  // ═════════ UTILIDADES ═════════
  const FALLO_IMAGEN = 'imagenes/Pylon.png';

  function crearImagen(src, alt = 'Imagen') {
    const img = document.createElement('img');
    img.src = src || FALLO_IMAGEN;
    img.alt = alt;
    img.onerror = () => {
      if (img.src !== window.location.origin + '/' + FALLO_IMAGEN) {
        img.src = FALLO_IMAGEN;
      }
    };
    return img;
  }
  // ═════════ 1. PÁGINA PRINCIPAL ═════════
if (document.getElementById('img-principal')) {
  fetch(NEWS_API_URL)
    .then(res => res.ok ? res.json() : Promise.reject('Error en la red'))
    .then(data => {
      if (data.status !== 'ok' || !data.articles?.length) throw new Error('Sin artículos');
      const art = data.articles;

      // Noticia principal (índice 0)
      const p = art[0];
      document.getElementById('titulo-principal').textContent = p.title || 'Sin título';
      document.getElementById('descripcion-principal').textContent = p.description || 'Descripción no disponible.';
      document.getElementById('enlace-principal').href = 'leer-mas.html?noticia=0';
      
      const imgPrincipal = document.getElementById('img-principal');
      imgPrincipal.src = p.urlToImage || FALLO_IMAGEN;
      imgPrincipal.alt = p.title || 'Noticia principal';
      imgPrincipal.onerror = () => { imgPrincipal.src = FALLO_IMAGEN; };

      // Noticias secundarias (índices 1 a 4)
      const sec = document.getElementById('noticias-secundarias');
      if (sec) {
        sec.innerHTML = '';
        art.slice(1, 5).forEach((a, i) => {
          const realIndex = i + 1;
          const article = document.createElement('article');
          article.className = 'tarjeta';
          const img = crearImagen(a.urlToImage, a.title || 'Noticia');
          const titulo = document.createElement('h3');
          titulo.className = 'titulo-tarjeta';
          titulo.textContent = a.title || 'Sin título';
          const desc = document.createElement('p');
          desc.className = 'texto-tarjeta';
          desc.textContent = a.description || 'Descripción no disponible.';
          const link = document.createElement('a');
          link.href = `leer-mas.html?noticia=${realIndex}`;
          link.target = '_self';
          link.style.cssText = 'color:var(--color-primario); text-decoration:underline; font-size:0.8rem; display:block; margin-top:0.5rem;';
          link.textContent = 'Leer más';
          article.append(img, titulo, desc, link);
          sec.appendChild(article);
        });
      }

      // Noticias inferiores (índices 5 a 13)
      const inf = document.getElementById('noticias-inferiores');
      if (inf) {
        inf.innerHTML = '';
        art.slice(5, 11).forEach((a, i) => {
          const realIndex = i + 5;
          const article = document.createElement('article');
          article.className = 'tarjeta';
          const img = crearImagen(a.urlToImage, a.title || 'Noticia');
          const titulo = document.createElement('h3');
          titulo.className = 'titulo-tarjeta';
          titulo.textContent = a.title || 'Sin título';
          const desc = document.createElement('p');
          desc.className = 'texto-tarjeta';
          desc.textContent = a.description || 'Descripción no disponible.';
          const link = document.createElement('a');
          link.href = `leer-mas.html?noticia=${realIndex}`;
          link.target = '_self';
          link.style.cssText = 'color:var(--color-primario); text-decoration:underline; font-size:0.8rem; display:block; margin-top:0.5rem;';
          link.textContent = 'Leer más';
          article.append(img, titulo, desc, link);
          inf.appendChild(article);
        });
      }
    })
    .catch(err => {
      console.warn('API de noticias (principal) falló. Se mantiene contenido base.', err);
    });
}

  // ═════════ 2. TOP JUEGOS ═════════
  if (document.getElementById('contenedor-juegos')) {
    fetch(CORS_PROXY + encodeURIComponent(FREE_TO_GAME_API))
      .then(res => res.ok ? res.json() : Promise.reject('API no respondió'))
      .then(juegos => {
        if (!Array.isArray(juegos) || juegos.length === 0) throw new Error('Sin datos');
        const cont = document.getElementById('contenedor-juegos');
        if (!cont) return;

        cont.innerHTML = '';
        juegos.slice(0, 12).forEach(j => {
          const article = document.createElement('article');
          article.className = 'tarjeta-juego';
          const img = crearImagen(j.thumbnail, j.title || 'Juego');
          const titulo = document.createElement('h3');
          titulo.textContent = j.title || 'Sin título';
          titulo.style.cssText = 'margin:0.5rem 0; font-size:1.1rem; color:var(--color-primario);';
          const plat = document.createElement('p');
          plat.className = 'info-juego';
          plat.textContent = `Plataforma: ${j.platform || 'N/A'}`;
          const gen = document.createElement('p');
          gen.className = 'info-juego';
          gen.textContent = `Género: ${j.genre || 'N/A'}`;
          const btn = document.createElement('button');
          btn.className = 'boton boton-blanco';
          btn.textContent = 'Jugar';
          btn.onclick = () => window.open(j.game_url || '#', '_blank');
          article.append(img, titulo, plat, gen, btn);
          cont.appendChild(article);
        });
      })
      .catch(err => {
        console.warn('API de juegos falló. Se mantiene contenido base del HTML.', err);
      });
  }

  // ═════════ 3. NOTICIAS.HTML ═════════
  if (document.getElementById('contenedor-noticias') && !document.getElementById('img-principal')) {
  fetch(NEWS_API_URL)
    .then(res => res.ok ? res.json() : Promise.reject('Error en la red'))
    .then(data => {
      if (data.status !== 'ok' || !data.articles?.length) throw new Error('Sin artículos');
      const contenedor = document.getElementById('contenedor-noticias');
      contenedor.innerHTML = '';
      data.articles.slice(0, 21).forEach((art, index) => {
        if (!art.title || art.title === '[Removed]') return;
        const article = document.createElement('article');
        article.className = 'tarjeta';
        const img = crearImagen(art.urlToImage, art.title);
        const titulo = document.createElement('h2');
        titulo.textContent = art.title;
        const desc = document.createElement('p');
        desc.textContent = art.description || 'Descripción no disponible.';
        const link = document.createElement('a');
        link.href = `leer-mas.html?noticia=${index}`; 
        link.target = '_self';
        link.style.cssText = 'color:var(--color-primario); text-decoration:underline; font-size:0.9rem;';
        link.textContent = 'Leer más';
        article.append(img, titulo, desc, link);
        contenedor.appendChild(article);
      });
    })
    .catch(err => {
      console.warn('API en noticias.html falló. Se mantiene contenido base.', err);
    });
}

  // ═════════ 4. FORO CON FILTRO ═════════
  const form = document.getElementById('formulario-foro');
const grilla = document.querySelector('.grilla-foro');
const filtroSelect = document.getElementById('filtro-categoria');

if (form && grilla) {
  const categoriaSelect = document.getElementById('categoria');
  const comentarioTextarea = document.getElementById('comentario');

  const nombresCategorias = {
    general: 'General',
    lanzamientos: 'Lanzamientos',
    opinion: 'Opinión',
    soporte: 'Soporte Técnico',
    offtopic: 'Off-Topic'
  };

  function obtenerFechaHoy() {
    const hoy = new Date();
    return `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`;
  }

  function crearTarjetaComentario(categoria, texto) {
    const article = document.createElement('article');
    article.className = 'tarjeta';
    article.dataset.categoria = categoria;
    article.innerHTML = `<p><strong>${nombresCategorias[categoria] || categoria} • ${obtenerFechaHoy()}</strong><br>${texto}</p>`;
    return article;
  }

  function aplicarFiltro() {
    const categoriaFiltro = filtroSelect?.value || 'general';
    const tarjetas = grilla.querySelectorAll('.tarjeta');
    tarjetas.forEach(tarjeta => {
      if (categoriaFiltro === 'general') {
        tarjeta.style.display = 'block';
      } else {
        const cat = tarjeta.dataset.categoria;
        tarjeta.style.display = (cat === categoriaFiltro) ? 'block' : 'none';
      }
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault(); // ← Esto es clave
    const texto = comentarioTextarea.value.trim();
    const categoria = categoriaSelect.value;
    if (!texto) {
      alert('Por favor, escribe un comentario.');
      return;
    }
    const tarjeta = crearTarjetaComentario(categoria, texto);
    grilla.insertBefore(tarjeta, grilla.firstChild);
    comentarioTextarea.value = '';
    // Nota: el filtro se mantiene como estaba
  });

  if (filtroSelect) {
    filtroSelect.addEventListener('change', aplicarFiltro);
    aplicarFiltro();
  }
}

  // ═════════ 5. MENÚ HAMBURGUESA ═════════
  const botonMenu = document.querySelector('.menu-hamburguesa');
  const menuNav = document.getElementById('menu-principal');

  if (botonMenu && menuNav) {
    botonMenu.addEventListener('click', () => {
      menuNav.classList.toggle('abierto');
    });
    menuNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuNav.classList.remove('abierto');
      }); 
    });
  }
    // ═════════ 6. LEER MÁS (desde JSON local) ═════════
  if (document.getElementById('contenido-completo')) {
    // Extraer el parámetro 'noticia' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const index = parseInt(urlParams.get('noticia'), 10);

    if (isNaN(index) || index < 0) {
      document.getElementById('titulo-noticia').textContent = 'Noticia no encontrada';
      document.getElementById('contenido-completo').textContent = 'El índice de la noticia es inválido.';
      return;
    }
    // Cargar el JSON local
    fetch(NEWS_API_URL)
      .then(res => res.ok ? res.json() : Promise.reject('Error al cargar noticias'))
      .then(data => {
        if (data.status !== 'ok' || !data.articles?.length) throw new Error('Sin datos');
        const articulos = data.articles;
        if (index >= articulos.length) throw new Error('Índice fuera de rango');
        const art = articulos[index];
        // Título
        document.getElementById('titulo-noticia').textContent = art.title || 'Sin título';
        // Imagen
        const imgNoticia = document.getElementById('img-noticia');
        imgNoticia.src = art.urlToImage || FALLO_IMAGEN;
        imgNoticia.alt = art.title || 'Imagen de la noticia';
        imgNoticia.onerror = () => { imgNoticia.src = FALLO_IMAGEN; };
        // Contenido completo (el campo 'content')
        const contenido = art.content?.trim() || art.description?.trim() || 'Contenido no disponible.';
        document.getElementById('contenido-completo').textContent = contenido;
        // Enlace a la fuente original
        const enlaceOriginal = document.getElementById('enlace-original');
        enlaceOriginal.href = art.url || '#';
      })
      .catch(err => {
        console.error('Error al cargar la noticia:', err);
        document.getElementById('titulo-noticia').textContent = 'Error al cargar la noticia';
        document.getElementById('contenido-completo').textContent = 'No se pudo recuperar el contenido. ¿El archivo JSON está en la ruta correcta?';
      });
  }
  document.querySelector('.formulario-contacto').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    alert("Gracias por su mensaje, " + nombre + "!");
    });
});