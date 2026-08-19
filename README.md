# 🦊 FoxCraft

> **Plataforma de contenido para Minecraft, rápida, moderna y orientada a la comunidad.**

FoxCraft es una plataforma web enfocada en reunir y organizar contenido para Minecraft en un único lugar.

El proyecto está construido con **Next.js, React, TypeScript y Tailwind CSS**, utilizando una arquitectura basada en componentes reutilizables, repositorios de contenido y tipos fuertemente definidos.

La plataforma está diseñada para permitir explorar diferentes categorías de contenido, consultar información individual de cada recurso y acceder directamente a sus enlaces de descarga.

Además, FoxCraft cuenta con un sistema específico para **skins de Minecraft**, capaz de consultar perfiles, obtener UUIDs y generar representaciones visuales de los jugadores mediante diferentes servicios externos.

---

## 📖 Índice

* [Características](#-características)
* [Categorías](#-categorías)
* [Tecnologías](#-tecnologías)
* [Arquitectura](#-arquitectura)
* [Estructura del proyecto](#-estructura-del-proyecto)
* [Sistema de contenido](#-sistema-de-contenido)
* [Sistema de skins](#-sistema-de-skins)
* [Búsqueda](#-búsqueda)
* [Paginación](#-paginación)
* [Diseño y UI](#-diseño-y-ui)
* [Rutas principales](#-rutas-principales)
* [Instalación](#-instalación)
* [Scripts disponibles](#-scripts-disponibles)
* [Configuración](#-configuración)
* [Desarrollo](#-desarrollo)
* [Estado del proyecto](#-estado-del-proyecto)
* [Roadmap](#-roadmap)
* [Contribuciones](#-contribuciones)
* [Licencia](#-licencia)

---

# 🚀 Características

FoxCraft actualmente cuenta con una base funcional para una plataforma de contenido de Minecraft.

### 🏠 Página principal

La página de inicio presenta:

* Hero principal.
* Descripción de FoxCraft.
* Acceso directo al explorador.
* Acceso directo a Mods.
* Estadísticas visuales.
* Categorías disponibles.
* Contenido destacado.
* Últimos contenidos agregados.
* Preview visual del contenido.

La estructura principal del Home está dividida en componentes independientes como `Hero`, `Categories`, `Featured` y `LatestContent`, lo que permite mantener la página modular y fácil de extender.

---

### 🔎 Explorador de contenido

FoxCraft incorpora una sección de exploración que permite:

* Buscar contenido.
* Filtrar resultados mediante texto.
* Buscar por título.
* Buscar por descripción.
* Mostrar resultados dinámicamente.
* Mostrar un estado vacío cuando no existen coincidencias.

La búsqueda se realiza sobre el contenido proporcionado por `ContentRepository`.

Actualmente la búsqueda se ejecuta del lado del cliente mediante un componente interactivo.

---

### 📦 Catálogo

El catálogo utiliza un sistema de tarjetas reutilizables.

Dependiendo del tipo de contenido, FoxCraft puede utilizar diferentes componentes:

* `ContentCard`
* `SkinCard`
* `SchematicCard`

Esto permite que cada categoría tenga una representación visual adecuada sin romper la arquitectura general del catálogo.

---

### 📄 Páginas individuales

Cada contenido puede disponer de una página propia utilizando una ruta dinámica:

```text
/[category]/[slug]
```

La página verifica que:

1. El contenido exista.
2. El `slug` sea válido.
3. La categoría de la URL coincida con la categoría real del contenido.

Esto evita situaciones como intentar acceder a un contenido de Mods utilizando una URL perteneciente a Maps.

Las páginas de contenido estándar muestran:

* Imagen principal.
* Categoría.
* Plataforma.
* Versión de Minecraft.
* Título.
* Descripción.
* Autor.
* Cantidad de descargas.
* Fecha de incorporación.
* Botón de descarga.
* Acceso para continuar explorando.

---

# 🗂️ Categorías

FoxCraft utiliza un sistema tipado de categorías.

Actualmente están contempladas:

| Categoría          | Ruta                  |
| ------------------ | --------------------- |
| Mods               | `/mods`               |
| Maps               | `/maps`               |
| Shaders            | `/shaders`            |
| Resource Packs     | `/resource-packs`     |
| Texture Packs      | `/texture-packs`      |
| UI Packs           | `/ui-packs`           |
| Skins              | `/skins`              |
| Armor Trims        | `/armor-trims`        |
| Banners            | `/banners`            |
| Schematics Java    | `/schematics-java`    |
| Schematics Bedrock | `/schematics-bedrock` |

Estas categorías forman parte del tipo `ContentCategory`, por lo que el sistema puede mantener consistencia entre los datos, repositorios y componentes.

Cada categoría también posee una configuración con título y descripción.

---

# 🛠️ Tecnologías

## Frontend

### Next.js

FoxCraft utiliza **Next.js 16** con React y App Router.

```text
Next.js 16.3.0
React 19.2.8
React DOM 19.2.8
```

El proyecto utiliza rutas dinámicas, Server Components y Route Handlers.

---

### React

La interfaz está construida con React y utiliza componentes reutilizables para separar:

* navegación;
* catálogo;
* contenido;
* búsqueda;
* skins;
* UI;
* layout;
* Home.

---

### TypeScript

El proyecto utiliza TypeScript con configuración estricta:

```json
{
  "strict": true,
  "noEmit": true
}
```

También se utiliza el alias:

```text
@/*
```

para facilitar imports como:

```ts
import { Container } from "@/components/ui";
```

---

### Tailwind CSS

El sistema visual utiliza **Tailwind CSS 4**.

La configuración global define tokens propios de FoxCraft para:

* colores;
* fondos;
* superficies;
* bordes;
* estados;
* radios;
* tipografía.

---

### Lucide React

Los iconos de la interfaz utilizan `lucide-react`.

Por ejemplo:

* búsqueda;
* descargas;
* navegación;
* mapas;
* paquetes;
* skins;
* acciones.

---

### Framer Motion

`framer-motion` forma parte del stack del proyecto y está disponible para animaciones e interacciones avanzadas.

---

### Three.js / skinview3d

El sistema de visualización de skins utiliza:

```text
skinview3d
three
```

Esto permite crear un visor 3D de skins directamente sobre un `<canvas>`. El viewer configura rotación automática y una animación idle.

---

## Backend / servicios

El proyecto también incluye dependencias y estructura preparada para funcionalidades como:

* Supabase.
* JWT.
* bcrypt.
* Zod.
* React Hook Form.
* Vercel Analytics.
* Vercel Speed Insights.

Las dependencias actuales están declaradas en `package.json`.

No todas estas tecnologías implican necesariamente que exista una funcionalidad completa implementada actualmente; algunas forman parte de la infraestructura preparada para la evolución del proyecto.

---

# 🏗️ Arquitectura

FoxCraft está organizado alrededor de varias capas.

```text
UI
│
├── components
│
├── app
│
└── layouts
       │
       ▼
     lib
       │
       ▼
 repositories
       │
       ▼
      data
```

La idea principal es evitar que las páginas tengan que conocer directamente cómo están almacenados los contenidos.

Por ejemplo:

```text
Página
   ↓
ContentRepository
   ↓
Data
```

Esto permite modificar posteriormente la fuente de datos sin tener que reescribir todos los componentes de la interfaz.

---

# 📁 Estructura del proyecto

La estructura principal sigue una separación por responsabilidades:

```text
foxcraft-web1/
│
├── app/
│   ├── api/
│   │   └── skins/
│   │
│   ├── (catalog)/
│   │   └── [category]/
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           └── page.tsx
│   │
│   ├── explore/
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── catalog/
│   ├── content/
│   ├── home/
│   ├── layout/
│   ├── navigation/
│   ├── search/
│   ├── skins/
│   └── ui/
│
├── constants/
│   ├── assets.ts
│   ├── categories.ts
│   └── index.ts
│
├── data/
│   └── ...
│
├── hooks/
│   └── use-scroll.ts
│
├── lib/
│   ├── content.ts
│   ├── utils.ts
│   └── skins/
│       ├── api.ts
│       ├── crafatar.ts
│       ├── mcheads.ts
│       ├── mojang.ts
│       ├── provider.ts
│       ├── service.ts
│       ├── visage.ts
│       └── viewer.ts
│
├── repositories/
│   └── content.repository.ts
│
├── types/
│   └── content.ts
│
├── public/
│   └── ...
│
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

# 🧩 Componentes

La interfaz está dividida en componentes pequeños y reutilizables.

## Home

```text
components/home/
├── hero.tsx
├── hero-preview.tsx
├── hero-stats.tsx
├── categories.tsx
├── featured.tsx
├── latest-content.tsx
└── index.tsx
```

La página principal compone estas piezas en lugar de contener toda la interfaz en un único archivo.

---

## Catálogo

```text
components/catalog/
├── content-card.tsx
├── content-grid.tsx
├── skins/
└── schematics/
```

El `ContentGrid` decide qué componente utilizar dependiendo de la categoría del elemento.

---

## UI

Los componentes base se encuentran en:

```text
components/ui/
```

Actualmente incluyen:

* `Button`
* `Badge`
* `Container`
* `EmptyState`
* `Heading`
* `Input`
* `Section`

Esto permite mantener un lenguaje visual consistente.

El componente `Button`, por ejemplo, utiliza `class-variance-authority` para manejar variantes y tamaños.

---

# 🗃️ Sistema de contenido

Una de las partes centrales de FoxCraft es `ContentRepository`.

Los diferentes datasets se importan desde `data` y posteriormente se combinan en una colección común.

Conceptualmente:

```text
mods
maps
skins
shaders
resourcePacks
texturePacks
uiPacks
armorTrims
banners
schematicsJava
schematicsBedrock
        │
        ▼
ContentRepository
        │
        ▼
ContentItem[]
```

El repositorio agrega la categoría correspondiente a cada elemento antes de construir la colección global.

---

## Métodos del repositorio

El repositorio actualmente dispone de operaciones como:

```ts
ContentRepository.getAll()
```

Obtiene todo el contenido.

```ts
ContentRepository.getFeatured()
```

Obtiene contenido marcado como destacado.

```ts
ContentRepository.getLatest()
```

Obtiene los últimos contenidos.

```ts
ContentRepository.getBySlug(slug)
```

Obtiene un elemento específico.

```ts
ContentRepository.getByCategory(category)
```

Obtiene contenido perteneciente a una categoría.

```ts
ContentRepository.getRelated(category, slug)
```

Obtiene contenido relacionado.

```ts
ContentRepository.search(query)
```

Busca por título y descripción.

```ts
ContentRepository.getSkins()
```

Obtiene exclusivamente las skins.

Estas operaciones se encuentran centralizadas en el repositorio.

---

# 🧱 Modelo de contenido

El sistema utiliza tipos TypeScript para definir los contenidos.

Las categorías y plataformas están tipadas:

```ts
type ContentCategory =
  | "mods"
  | "maps"
  | "shaders"
  | "resource-packs"
  | "texture-packs"
  | "ui-packs"
  | "skins"
  | "armor-trims"
  | "banners"
  | "schematics-java"
  | "schematics-bedrock";
```

Las plataformas contemplan:

```ts
type ContentPlatform =
  | "java"
  | "bedrock"
  | "both";
```

Esto permite representar contenido compatible con:

* Minecraft Java;
* Minecraft Bedrock;
* ambas ediciones.

---

# 🎨 Sistema visual

FoxCraft utiliza un diseño oscuro como base.

Los principales tokens definidos actualmente incluyen:

```text
Background:
#09090b

Surface:
#111217

Surface Secondary:
#18181d

Primary:
#f97316

Secondary:
#06b6d4
```

El naranja funciona como color principal de marca y se utiliza para:

* botones;
* estados activos;
* enlaces;
* indicadores;
* hover;
* elementos destacados.

El sistema también define estados:

```text
Success
Warning
Danger
```

y distintos niveles de superficie y borde.

---

# 🦊 Sistema de skins

Las skins tienen una arquitectura independiente del resto del catálogo.

FoxCraft utiliza diferentes servicios para obtener información y representaciones de los jugadores.

### Mojang

La aplicación consulta el perfil de Minecraft mediante el username:

```text
https://api.mojang.com/users/profiles/minecraft/{username}
```

El resultado proporciona:

```text
id
name
```

y las respuestas se cachean durante una hora.

---

### Crafatar

Crafatar se utiliza para generar diferentes representaciones:

```text
Skin PNG
Body render
Avatar
```

Por ejemplo:

```text
/skins/{uuid}

/renders/body/{uuid}

/avatars/{uuid}
```

---

### MC-Heads

También existe integración con MC-Heads para obtener:

```text
Avatar
Body
Skin
```

utilizando el nombre de usuario.

---

### Visage

Visage se utiliza para renders como:

```text
Full
Bust
```

La implementación utiliza URLs basadas en UUID.

---

# 🖥️ API de skins

FoxCraft dispone de una Route Handler:

```text
GET /api/skins/[username]
```

El flujo es:

```text
Username
   │
   ▼
Mojang API
   │
   ▼
UUID
   │
   ▼
Visage
   │
   ▼
Render PNG
   │
   ▼
FoxCraft API
```

La API devuelve directamente la imagen generada.

También utiliza caché de una hora para reducir solicitudes repetidas.

---

# 🧊 Visor 3D

FoxCraft incluye infraestructura para visualizar skins en 3D.

El componente:

```text
SkinViewer
```

crea un canvas y utiliza:

```text
skinview3d
```

para representar el personaje.

Actualmente el viewer configura:

* canvas de 400 × 500;
* skin dinámica;
* rotación automática;
* velocidad de rotación;
* animación idle.

Además, cuando el componente se desmonta, el viewer se libera mediante:

```ts
viewer.dispose();
```

Esto evita mantener recursos innecesarios en memoria.

---

# 📄 Páginas de skins

Las skins poseen una presentación diferente al resto del contenido.

La página muestra:

* preview;
* nombre;
* username;
* descripción;
* modelo;
* edición;
* descarga;
* enlace al perfil.

El modelo puede representarse como:

```text
Slim
Classic
```

y las ediciones pueden ser:

```text
Java
Bedrock
Both
```

---

# 🔎 Búsqueda

La búsqueda actualmente está implementada mediante:

```text
SearchBar
      ↓
Explorer
      ↓
ContentGrid
```

Cuando el usuario escribe:

```text
SearchBar
```

envía el valor a:

```ts
handleSearch()
```

El explorador compara el texto con:

```text
item.title
item.description
```

y devuelve los elementos coincidentes.

Si no existen resultados se muestra:

```text
EmptyState
```

con un mensaje indicando que no se encontraron resultados.

---

# 📑 Paginación

Las categorías utilizan paginación.

Actualmente:

```ts
const ITEMS_PER_PAGE = 25;
```

Por lo tanto, una categoría muestra hasta 25 elementos por página.

El sistema calcula:

```text
currentPage
totalPages
safePage
start
end
```

y posteriormente utiliza `slice()` para obtener únicamente los elementos correspondientes a la página actual.

Las skins tienen un componente específico:

```text
SkinPagination
```

que proporciona:

* anterior;
* siguiente;
* páginas numeradas;
* página actual;
* elipsis cuando existen muchas páginas.

---

# 🧭 Rutas

La arquitectura utiliza rutas dinámicas de Next.js.

## Home

```text
/
```

---

## Explorador

```text
/explore
```

---

## Categoría

```text
/[category]
```

Ejemplos:

```text
/mods
/maps
/shaders
/skins
/resource-packs
```

---

## Contenido individual

```text
/[category]/[slug]
```

Ejemplo conceptual:

```text
/mods/ejemplo-mod
```

---

## API de skins

```text
/api/skins/[username]
```

---

# 🧰 Configuración de Next.js

`next.config.ts` tiene habilitado React Compiler:

```ts
const nextConfig: NextConfig = {
  reactCompiler: true,
};
```

También están configurados hosts externos para imágenes:

```text
crafatar.com
visage.surgeplay.com
```

Esto permite utilizar recursos remotos mediante `next/image`.

---

# 📦 Instalación

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar en el proyecto:

```bash
cd foxcraft-web1
```

---

## 2. Instalar dependencias

Con npm:

```bash
npm install
```

---

## 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Después abrir:

```text
http://localhost:3000
```

---

# 🧪 Scripts disponibles

El proyecto actualmente define los siguientes comandos:

### Desarrollo

```bash
npm run dev
```

Inicia Next.js en modo desarrollo.

---

### Build

```bash
npm run build
```

Genera una compilación de producción.

---

### Producción

```bash
npm run start
```

Inicia la aplicación compilada.

---

### Lint

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

Los scripts están definidos directamente en `package.json`.

---

# 🧹 Calidad del código

FoxCraft utiliza:

* ESLint.
* TypeScript strict mode.
* Prettier.
* Prettier Tailwind Plugin.
* ESLint Config Next.
* React Compiler.

La configuración de ESLint incluye las reglas recomendadas para Next.js Core Web Vitals y TypeScript.

---

# 🔐 Variables de entorno

La versión actual del código proporcionado no requiere variables de entorno para las funcionalidades principales mostradas.

Sin embargo, el proyecto incluye dependencias para servicios como Supabase y otros sistemas que pueden requerir configuración mediante `.env.local` a medida que se incorporen nuevas funcionalidades.

Si se agregan secretos o claves privadas:

```text
.env.local
```

debe utilizarse en lugar de almacenar credenciales directamente en el código fuente.

---

# 🖼️ Assets

Los recursos visuales se organizan dentro de `public/`.

El sistema centraliza las rutas importantes mediante:

```text
constants/assets.ts
```

Actualmente se contemplan recursos para:

* Logo.
* Iconos de categorías.
* Redes sociales.

Ejemplo:

```ts
ASSETS.categories.mods
ASSETS.categories.maps
ASSETS.categories.shaders
ASSETS.categories.skins
```

Esto evita tener rutas de imágenes repetidas por todo el proyecto.

---

# 🧩 Principios de arquitectura

El proyecto sigue varios principios importantes.

### Separación de responsabilidades

Las páginas se encargan principalmente de componer la aplicación.

Los componentes manejan la presentación.

Los repositorios manejan el acceso a contenido.

Los tipos definen contratos.

Las librerías contienen lógica reutilizable.

---

### Componentización

En lugar de construir páginas monolíticas, FoxCraft divide la interfaz en componentes.

Por ejemplo:

```text
Hero
HeroPreview
HeroStats
Categories
Featured
LatestContent
```

Esto facilita:

* mantenimiento;
* reutilización;
* testing futuro;
* modificaciones visuales;
* escalabilidad.

---

### Tipado fuerte

Los contenidos utilizan tipos explícitos.

Esto ayuda a detectar errores durante el desarrollo y evita depender excesivamente de objetos sin estructura.

---

### Reutilización

Elementos comunes como:

```text
Button
Badge
Heading
Container
Input
Section
```

se mantienen centralizados.

---

# 📈 Escalabilidad

La arquitectura actual permite evolucionar progresivamente desde una fuente de datos estática hacia una plataforma más completa.

El repositorio funciona como una capa intermedia:

```text
UI
 ↓
Repository
 ↓
Data source
```

Actualmente la fuente principal está organizada mediante datasets dentro de `data/`.

Esto permite que posteriormente la implementación del repositorio pueda cambiar sin obligar a rehacer todos los componentes que consumen contenido.

---

# 🛣️ Roadmap

El proyecto está siendo desarrollado progresivamente.

Algunas líneas naturales de evolución son:

* [ ] Sistema de usuarios.
* [ ] Autenticación.
* [ ] Panel de administración.
* [ ] Gestión de contenido desde una base de datos.
* [ ] Integración completa con Supabase.
* [ ] Sistema de favoritos.
* [ ] Sistema de ratings.
* [ ] Comentarios.
* [ ] Filtros avanzados.
* [ ] Ordenamiento.
* [ ] Búsqueda más avanzada.
* [ ] Estadísticas reales de descargas.
* [ ] Mejoras del visor 3D.
* [ ] Más herramientas para Minecraft.
* [ ] Optimización SEO.
* [ ] Metadata dinámica por contenido.
* [ ] Open Graph dinámico.
* [ ] Mejoras de rendimiento.
* [ ] Sistema de moderación.
* [ ] Sistema de publicación para creadores.

> El roadmap representa posibles líneas de evolución del proyecto y no implica que todas estas funcionalidades estén actualmente implementadas.

---

# ⚠️ Estado actual

FoxCraft se encuentra en una etapa activa de desarrollo.

La base frontend ya cuenta con una arquitectura funcional para:

* navegación;
* Home;
* catálogo;
* categorías;
* contenido individual;
* búsqueda;
* paginación;
* contenido destacado;
* últimos contenidos;
* skins;
* API de skins;
* integración con servicios de Minecraft;
* visor de skins;
* sistema de componentes UI;
* sistema de tipos;
* repositorio de contenido.

La fuente de contenido actual está organizada mediante datasets dentro de `data/`, mientras que `ContentRepository` centraliza el acceso a dichos datos.

---

# 🤝 Contribuciones

Las contribuciones son bienvenidas.

Antes de realizar cambios importantes se recomienda:

1. Crear una nueva rama.
2. Mantener la separación de responsabilidades.
3. Utilizar los componentes existentes siempre que sea posible.
4. Mantener TypeScript correctamente tipado.
5. Ejecutar el lint.
6. Verificar el build.
7. Mantener consistente el sistema visual.

Ejemplo:

```bash
git checkout -b feature/nueva-funcionalidad
```

Después:

```bash
npm run lint
npm run build
```

---

# 📝 Convenciones recomendadas

Para mantener el proyecto organizado:

### Componentes

Utilizar componentes pequeños y específicos.

```text
components/catalog/
components/content/
components/home/
components/search/
components/skins/
components/ui/
```

### Lógica

La lógica reutilizable debe permanecer fuera de las páginas cuando sea posible.

Por ejemplo:

```text
lib/
repositories/
hooks/
```

### Datos

Los datasets de contenido deben permanecer separados de la presentación:

```text
data/
```

### Tipos

Los contratos compartidos deben mantenerse dentro de:

```text
types/
```

---

# 🦊 Filosofía de FoxCraft

FoxCraft busca ser algo más que una colección de enlaces.

La idea es construir una plataforma moderna alrededor del ecosistema de contenido de Minecraft, donde los recursos estén:

* organizados;
* categorizados;
* visualmente presentados;
* fácilmente explorables;
* correctamente identificados;
* preparados para crecer.

La arquitectura está pensada para que el proyecto pueda evolucionar desde un catálogo inicial hacia una plataforma completa para la comunidad.

---

# 📌 Información técnica

| Elemento                | Tecnología                   |
| ----------------------- | ---------------------------- |
| Framework               | Next.js 16                   |
| UI                      | React 19                     |
| Lenguaje                | TypeScript                   |
| CSS                     | Tailwind CSS 4               |
| Iconos                  | Lucide React                 |
| Variantes UI            | Class Variance Authority     |
| Utilidades CSS          | clsx + tailwind-merge        |
| Animaciones             | Framer Motion                |
| Formularios             | React Hook Form              |
| Validación              | Zod                          |
| Markdown                | React Markdown + Remark GFM  |
| Visor 3D                | skinview3d                   |
| Render 3D               | Three.js                     |
| Minecraft Profiles      | Mojang API                   |
| Skin rendering          | Crafatar / MC-Heads / Visage |
| Backend preparado       | Supabase                     |
| Autenticación preparada | JWT / bcrypt                 |
| Calidad                 | ESLint + Prettier            |
| Analytics               | Vercel Analytics             |
| Performance             | Vercel Speed Insights        |

Las versiones exactas de las dependencias pueden consultarse en `package.json`.

---

# 📜 Licencia

La licencia definitiva del proyecto debe definirse según la estrategia de distribución de FoxCraft.

Hasta que se agregue una licencia explícita al repositorio, el código debe considerarse sujeto a los derechos de su autor y no debe asumirse automáticamente como software de uso libre.

---

# 💙 FoxCraft

**Una plataforma moderna para descubrir contenido de Minecraft.**

```text
Mods
Maps
Shaders
Resource Packs
Texture Packs
UI Packs
Skins
Armor Trims
Banners
Schematics
        ↓
    FoxCraft 🦊
```

---

## 🚧 Proyecto en desarrollo

FoxCraft continúa evolucionando.

La arquitectura actual está preparada para incorporar nuevas fuentes de datos, funcionalidades de comunidad, herramientas para Minecraft y sistemas más avanzados de gestión de contenido sin tener que reconstruir la aplicación desde cero.
