-- Esquema Supabase (PostgreSQL) equivalente al MySQL del proyecto Deshilados Pxm
-- Ejecutar en SQL Editor del panel de Supabase

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
  id          BIGSERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  rol         VARCHAR(50) DEFAULT 'usuario',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- Habilitar RLS (opcional: políticas para que solo admin lea users)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política: permitir lectura de users para login (anon puede leer por email para comprobar)
CREATE POLICY "Allow read users for auth" ON public.users FOR SELECT USING (true);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
  id                 BIGSERIAL PRIMARY KEY,
  nombre             VARCHAR(200) NOT NULL,
  descripcion        TEXT,
  categoria          VARCHAR(100) NOT NULL,
  precio             NUMERIC(10, 2) NOT NULL,
  stock              INTEGER DEFAULT 0,
  imagen_url         VARCHAR(500),
  activo             BOOLEAN DEFAULT true,
  portada            BOOLEAN DEFAULT false,
  tallas_disponibles VARCHAR(200) DEFAULT '',
  orden              INTEGER,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products (categoria);
CREATE INDEX IF NOT EXISTS idx_products_activo ON public.products (activo);
CREATE INDEX IF NOT EXISTS idx_products_portada ON public.products (portada);
CREATE INDEX IF NOT EXISTS idx_products_orden ON public.products (orden);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all for products" ON public.products FOR ALL USING (true);

-- Tabla de contenido del sitio
CREATE TABLE IF NOT EXISTS public.site_content (
  id         BIGSERIAL PRIMARY KEY,
  key        VARCHAR(120) NOT NULL UNIQUE,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_content_key ON public.site_content (key);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all site_content" ON public.site_content FOR ALL USING (true);

-- Usuario admin por defecto (cambiar contraseña en producción)
-- En producción usa Supabase Auth o hashea la contraseña con bcrypt
INSERT INTO public.users (nombre, email, password, rol)
VALUES (
  'Administrador',
  'deshiladospxm@outlook.com',
  '$2y$10$RFvz.hTVHPtBWtEJNvHVouKZqyKVG0a8q9nMrapPVqi6xvlL5AR.q',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Valores por defecto de site_content (mismos que schema MySQL)
INSERT INTO public.site_content ("key", value) VALUES
('navbar_brand', 'Deshilados PXM'),
('navbar_logo', 'logo-navbar.png'),
('footer_brand', 'PRENDAS TÍPICAS OAXACA'),
('footer_description', 'Prendas artesanales de la costa chica de Oaxaca.'),
('footer_contact_title', 'Contacto'),
('footer_contact_street', 'Punta Zicatela'),
('footer_contact_city', 'Puerto Escondido, Oaxaca'),
('footer_contact_phone', '+52 954 181 78 23'),
('footer_contact_email', 'prendastipicasoaxaca@gmail.com'),
('footer_schedule_title', 'Horario'),
('footer_schedule_days', 'Fines de semana'),
('footer_schedule_hours', '10:00 AM - 7:00 PM'),
('footer_social_whatsapp', '529541817823'),
('footer_copyright_text', 'Deshilados PXM. Todos los derechos reservados.'),
('footer_copyright_made_with', 'Hecho con amor en Puerto Escondido, Oaxaca'),
('meta_site_name', 'Deshilados PXM'),
('meta_site_icon', 'icon.png'),
('meta_site_description', 'Descubre la belleza de la ropa típica oaxaqueña.'),
('home_hero_title', 'Tradición de los Deshilados Oaxaqueños'),
('home_hero_description', 'Descubre prendas únicas tejidas a mano por artesanas de la costa chica de Oaxaca.'),
('home_hero_image', 'banner.jpg'),
('home_collection_title', 'Prendas Artesanales'),
('home_about_title', 'Raíces que Visten'),
('home_about_image', 'about.jpg')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;