# Dónde poner las imágenes

## Carpeta base: `public/images/`

Todo lo que pongas en `public/images/` se sirve en la web como `/images/...`.

---

## 1. Imágenes del sitio (logo, banner, etc.)

**Carpeta:** `public/images/` (directamente en esta carpeta)

El proyecto ya usa estas imágenes si están en el repo:

| Archivo | Uso |
|---------|-----|
| `logo-navbar.png` | Logo del menú (navbar). |
| `icon.png` | Icono / favicon. |
| `banner.jpg` | Banner de la portada (hero). |
| `about.jpg` | Imagen de la sección "Nosotros". |

En Admin → Contenido del sitio las rutas deben ser solo el nombre del archivo: `logo-navbar.png`, `icon.png`, `banner.jpg`, `about.jpg` (sin `site/`).

Si quieres usar una subcarpeta `public/images/site/`, en Admin escribe la ruta con prefijo, por ejemplo: `site/mi-logo.png`.

---

## 2. Imágenes de productos

**Carpeta:** `public/images/productos/`

- Sube aquí las fotos de cada producto (JPG, PNG, WebP, etc.).
- En Admin, al crear o editar un producto, en **"Imagen del producto"** escribe la ruta, por ejemplo:
  - `productos/1.jpg`
  - `productos/blusa-roja.png`
- Si no pones ruta, se muestra el placeholder (`placeholder.svg` ya está en esa carpeta).

---

## Estructura actual del repo

```
public/
  images/
    logo-navbar.png   ← logo del encabezado (ya en el repo)
    icon.png          ← favicon / icono (ya en el repo)
    banner.jpg        ← banner del inicio (ya en el repo)
    about.jpg         ← imagen "Nosotros" (ya en el repo)
    productos/
      placeholder.svg ← ya existe
      1.jpg, 2.jpg…   ← fotos de cada producto
```

Con esto el sitio encuentra todas las imágenes correctamente.
