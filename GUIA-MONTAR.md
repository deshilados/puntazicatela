# Guía para montar y ver el proyecto (Deshilados PXM en Vue + Supabase)

Este proyecto es la migración del sistema PHP MVC (Deshilados Pxm) a **Vue 3 + Vite + TypeScript**, con base de datos en **Supabase**. Las imágenes se gestionan solo por **ruta en la tabla**; los archivos los subes tú al servidor o a un bucket.

---

## 1. Requisitos

- **Node.js** 18+ y npm
- Cuenta en **Supabase** (https://supabase.com)

---

## 2. Instalar dependencias

En la raíz del proyecto:

```bash
npm install
```

---

## 3. Configurar Supabase

### 3.1 Crear proyecto en Supabase

1. Entra en https://supabase.com y crea un proyecto.
2. En **Project Settings → API** copia:
   - **Project URL**
   - **anon public** key

### 3.2 Crear tablas y datos iniciales

1. En el panel de Supabase ve a **SQL Editor**.
2. Abre el archivo `supabase/schema.sql` de este proyecto.
3. Copia todo el contenido y pégalo en el editor SQL.
4. Ejecuta el script (Run). Con esto se crean las tablas `users`, `products`, `site_content` y los datos por defecto.

### 3.3 Variables de entorno

En la raíz del proyecto crea un archivo **`.env`** (no lo subas a Git):

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_KEY=tu_anon_public_key_aqui
```

Sustituye por tu URL y tu anon key de Supabase.

---

## 4. Imágenes: dónde copiarlas y cuáles agregar

Todas las imágenes del sitio se sirven desde la carpeta **`public/images/`** del proyecto. La base de datos solo guarda la **ruta relativa** (ej: `site/logo-navbar.png`); el código concatena `images/` + esa ruta.

### Dónde copiar las imágenes

| Carpeta en el proyecto | Uso |
|------------------------|-----|
| **`public/images/site/`** | Logo, icono, banner del inicio, imagen “Nosotros”. |
| **`public/images/productos/`** | Fotos de cada producto (una por producto o las que quieras). |

En desarrollo, al hacer `npm run dev`, las URLs serán del tipo `/images/site/banner.jpg` y `/images/productos/1.jpg`.

### Imágenes del sitio (logo y demás)

Copia estos archivos en **`public/images/site/`** con **exactamente** estos nombres (o cambia después el valor en Admin → Contenido del sitio):

| Archivo que debes poner | Nombre en la carpeta | Dónde se usa |
|-------------------------|----------------------|--------------|
| Logo del menú (navbar) | `logo-navbar.png` | Encabezado de la web. |
| Icono / favicon | `icon.png` (o `.ico`) | Pestaña del navegador y fallback si no hay logo. |
| Banner principal (hero) | `banner.jpg` | Imagen grande de la portada. |
| Imagen “Nosotros” | `about.jpg` | Sección “Raíces que Visten” en el inicio. |

Si usas otros nombres (ej: `mi-logo.png`), en **Admin → Contenido del sitio** guarda en los campos correspondientes la ruta `site/mi-logo.png`.

### Imágenes de productos

- Cada producto tiene en la base de datos un campo **`imagen_url`** (ruta).
- Pon las fotos en **`public/images/productos/`**, por ejemplo:
  - `1.jpg`, `2.jpg`… (según el id del producto), o
  - `blusa-roja.jpg`, `rebozo-azul.jpg`, etc.
- En Admin, al crear/editar un producto, en “Imagen del producto” escribe solo la ruta, p. ej.:
  - `productos/1.jpg`
  - `productos/blusa-roja.jpg`
- Si dejas la ruta vacía, se mostrará el placeholder (`public/images/productos/placeholder.svg` ya existe).

### Resumen rápido

- **Logo y resto del sitio** → `public/images/site/` (archivos: `logo-navbar.png`, `icon.png`, `banner.jpg`, `about.jpg`).
- **Fotos de productos** → `public/images/productos/` (rutas en BD: `productos/nombre-archivo.jpg`).
- Si subes las imágenes a otro sitio (ej: Supabase Storage), en la BD puedes guardar la URL completa (https://…) y el código la usará tal cual.

---

## 5. Ejecutar en desarrollo

```bash
npm run dev
```

Se abrirá el navegador en `http://localhost:5173` (o el puerto que indique Vite).

### Rutas del sitio público

- **/** – Inicio (hero, productos portada, nosotros)
- **/categorias** – Catálogo por categorías y búsqueda
- **/producto/:id** – Ficha del producto
- **/ordenar** – Formulario de pedido (redirige a WhatsApp)
- **/login** – Inicio de sesión (usuarios)
- **/register** – Registro
- **/about** – Sobre nosotros
- **/contact** – Contacto

### Admin

- **/admin** – Listado de productos (requiere login admin)
- **/admin/login** – Login de administrador
- **/admin/crear** – Nuevo producto
- **/admin/editar/:id** – Editar producto
- **/admin/contenido** – Textos del sitio (navbar, footer, meta, home)

**Usuario admin por defecto** (tras ejecutar `schema.sql`):

- Email: `admin@deshiladospxm.com`
- Contraseña: la que hayas definido en el hash del `schema.sql` (en el script de ejemplo se usa un hash de ejemplo; en producción debes usar Supabase Auth o una Edge Function que valide la contraseña).

**Nota:** El login admin actual solo comprueba que el email exista en `users` y tenga `rol = 'admin'`. La validación de contraseña en producción debe hacerse con Supabase Auth o una Edge Function que consulte la tabla `users`.

---

## 6. Build para producción

```bash
npm run build
```

Los archivos quedan en la carpeta **`dist/`**. Sirve el contenido de `dist` con cualquier servidor estático (Nginx, Netlify, Vercel, etc.).

Asegúrate de que las variables **VITE_SUPABASE_URL** y **VITE_SUPABASE_KEY** estén definidas en el entorno de build (en Netlify/Vercel se configuran en el panel).

---

## 7. Migrar datos desde MySQL (Deshilados Pxm)

Si ya tienes datos en la base MySQL del PHP:

1. Exporta cada tabla (`users`, `products`, `site_content`) a CSV.
2. En Supabase → **Table Editor** → selecciona la tabla → **Import data from CSV**.
3. Ajusta tipos de columnas si hace falta (en PostgreSQL `activo` y `portada` son boolean; en MySQL pueden ser 0/1).

---

## 8. Resumen de equivalencias PHP → Vue

| PHP (Deshilados Pxm)   | Vue (este proyecto)                    |
|------------------------|----------------------------------------|
| `HomeController::index`| `HomeTextil.vue`                       |
| `HomeController::categorias` | `Categorias.vue`               |
| `HomeController::producto`  | `ProductoShow.vue`               |
| `HomeController::ordenar`   | `Ordenar.vue`                    |
| `login` / `register`       | `LoginTextil.vue`, `RegisterTextil.vue` |
| `about` / `contact`        | `About.vue`, `Contact.vue`       |
| `AdminController::index`   | `AdminProducts.vue`              |
| `AdminController::crear` / `editar` | `AdminProductForm.vue`   |
| `AdminController::contenido` | `AdminContenido.vue`         |
| `AdminController::login`   | `AdminLogin.vue`                |
| Layout main.php           | `MainLayoutTextil.vue`          |
| Layout admin.php          | `AdminLayout.vue`               |
| Model Product / SiteContent / User | Stores Pinia + Supabase |

Con esto puedes montar el proyecto, configurar Supabase y ver el sitio en local o en producción.
