# Portafolio · Anggie Alcedo

Sitio web personal: QA Automation, WordPress y Python.
Está hecho solo con **HTML, CSS y JavaScript puro**, así que funciona directamente en **GitHub Pages**. No necesita instalar ni compilar nada.

## 📁 Estructura

```
portafolio/
├── index.html              contenido y etiquetas SEO / Open Graph
├── style.css               estilos (modo oscuro, modo claro y responsive)
├── script.js               animaciones e interacciones
├── README.md
└── assets/
    ├── CV_Anggie_Alcedo.pdf      ← agrega tu CV aquí
    └── img/
        ├── foto.jpg              ← tu foto (cuadrada, mínimo 600×600)
        ├── og-image.png          imagen que se ve al compartir el enlace
        ├── facturacion-1.png … facturacion-3.png
        ├── inventario-1.png  … inventario-3.png
        ├── itam-1.png        … itam-3.png
        ├── restaurante-1.png … restaurante-3.png
        ├── rrhh-1.png        … rrhh-3.png
        └── gestorpro-1.png   … gestorpro-3.png
```

> Si falta una captura, el carrusel muestra un placeholder con el nombre del proyecto. Si falta la foto, se ven las iniciales **AA**. Puedes publicar el sitio aunque todavía no tengas todas las imágenes.

## 🖼️ Antes de publicar

1. Copia tu foto en `assets/img/foto.jpg`.
2. Copia tu CV en `assets/CV_Anggie_Alcedo.pdf`.
3. Agrega las capturas de cada proyecto con los nombres de arriba. El formato ideal es **16:10**, por ejemplo 1440×900.
4. Revisa en `index.html` los porcentajes de habilidades (`style="--level:90%"`) y los logros de cada experiencia.

Para verlo en tu computadora, abre `index.html` con doble clic. También puedes usar la extensión **Live Server** de VS Code.

## 🚀 Publicar en GitHub Pages

### Opción recomendada: dirección principal

Así el sitio queda en **https://alcedoanggi-crypto.github.io/**

1. En GitHub, crea un repositorio **público** llamado exactamente `alcedoanggi-crypto.github.io`.
2. En la terminal, dentro de esta carpeta, ejecuta:

   ```bash
   git init
   git add .
   git commit -m "Portafolio personal"
   git branch -M main
   git remote add origin https://github.com/alcedoanggi-crypto/alcedoanggi-crypto.github.io.git
   git push -u origin main
   ```

3. En el repositorio, entra a **Settings → Pages**.
4. En **Source**, elige **Deploy from a branch**. Luego selecciona la rama `main` y la carpeta `/ (root)`, y pulsa **Save**.
5. Espera 1 o 2 minutos y abre `https://alcedoanggi-crypto.github.io/`.

### Otra opción: repositorio con otro nombre

Si llamas al repositorio, por ejemplo, `portafolio`, el sitio queda en `https://alcedoanggi-crypto.github.io/portafolio/`.

En ese caso, cambia en `index.html` las URLs de `canonical`, `og:url`, `og:image` y `twitter:image` para que incluyan `/portafolio/`. Si no lo haces, la vista previa en LinkedIn y WhatsApp no mostrará la imagen.

## 🔄 Actualizar el sitio

```bash
git add .
git commit -m "Actualiza proyectos"
git push
```

GitHub Pages vuelve a publicar el sitio solo, en 1 o 2 minutos.

## 🔗 Vista previa al compartir

LinkedIn guarda en caché la vista previa de los enlaces. Si cambias la imagen o el texto, fuerza la actualización en el [Post Inspector de LinkedIn](https://www.linkedin.com/post-inspector/).

## ✏️ Personalización rápida

| Qué cambiar | Dónde |
|---|---|
| Colores | Variables al inicio de `style.css` (`--blue`, `--cyan`, `--bg`) |
| Frases de la máquina de escribir | Lista `roles` en `script.js` |
| Contadores | Atributo `data-target` en `index.html` |
| Categorías de los filtros | Atributo `data-category` de cada proyecto (`python`, `gestion`, `web`) |
| Nuevo proyecto | Copia un bloque `<article class="project">` y cambia textos, imágenes y enlace |

## ♿ Accesibilidad y rendimiento

- Respeta `prefers-reduced-motion`: si el sistema pide menos movimiento, se desactivan las animaciones.
- Las imágenes tienen `loading="lazy"` y texto alternativo.
- Funciona con teclado: enlace para saltar al contenido, foco visible y menú que se cierra con Esc.
- El fondo animado se pausa cuando la pestaña no está visible.

---

© 2026 Anggie Alcedo
