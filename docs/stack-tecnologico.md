# Stack Tecnológico

## Runtime y gestión de paquetes

### Node.js (v24 LTS)
- **Qué es:** El entorno de ejecución de JavaScript fuera del navegador. Así como Python tiene su intérprete, Node.js ejecuta JavaScript/TypeScript en el servidor.
- **Para qué lo usamos:** Para correr Next.js, instalar paquetes, ejecutar scripts.
- **Instalado via:** nvm (Node Version Manager), que permite cambiar entre versiones fácilmente.

### npm (v11)
- **Qué es:** El gestor de paquetes de Node.js. Equivalente a `pip` en Python.
- **Para qué lo usamos:** Instalar dependencias (`npm install`), ejecutar scripts (`npm run dev`).
- **Archivos relacionados:**
  - `package.json` → lista de dependencias y scripts (como `requirements.txt`)
  - `package-lock.json` → versiones exactas de cada dependencia (se commitea, asegura reproducibilidad)
  - `node_modules/` → carpeta donde se instalan las dependencias (como `venv`, nunca se commitea)

---

## Lenguaje

### TypeScript (v5)
- **Qué es:** JavaScript con tipos estáticos. Similar a Python con type hints, pero los tipos se verifican en tiempo de compilación obligatoriamente.
- **Para qué lo usamos:** Todo el proyecto está en TypeScript. Previene errores en desarrollo, mejora el autocompletado del editor.
- **Archivo de configuración:** `tsconfig.json`
- **Extensiones de archivo:** `.ts` (lógica), `.tsx` (componentes con HTML/JSX)

---

## Framework principal

### Next.js (v16)
- **Qué es:** Framework fullstack basado en React. Es como Django pero para JavaScript: maneja frontend, backend (API routes), routing, y más en un solo proyecto.
- **Para qué lo usamos:** Es el corazón del proyecto. Sirve las páginas, maneja las rutas, y expone la API.
- **Conceptos clave:**
  - **App Router:** Sistema de rutas basado en carpetas. Una carpeta `src/app/pedidos/` crea automáticamente la ruta `/pedidos`.
  - **Server Components:** Componentes que se renderizan en el servidor (por defecto). Pueden acceder directo a la base de datos.
  - **Client Components:** Componentes interactivos que corren en el navegador. Se marcan con `"use client"` al inicio del archivo.
  - **API Routes:** Endpoints backend dentro del mismo proyecto (`src/app/api/...`).
- **Comandos:**
  - `npm run dev` → inicia el servidor de desarrollo (con hot reload)
  - `npm run build` → genera la versión optimizada para producción
  - `npm run start` → corre la versión de producción
- **Archivo de configuración:** `next.config.ts`

### React (v19)
- **Qué es:** Librería para construir interfaces de usuario con componentes. Next.js está construido sobre React.
- **Para qué lo usamos:** Cada pantalla (clientes, pedidos, productos) es un conjunto de componentes React.
- **Concepto principal:** Todo es un componente (función que retorna UI). Los componentes se componen entre sí como bloques de LEGO.

---

## Base de datos

### SQLite
- **Qué es:** Base de datos relacional que vive en un solo archivo. No necesita un servidor corriendo (a diferencia de PostgreSQL o MySQL).
- **Para qué lo usamos:** Almacenar clientes, pedidos, productos, pagos, etc.
- **Ventajas para este proyecto:** Cero configuración, backup = copiar un archivo, perfecto para bajo volumen.
- **Archivo:** `mimins.db` (se creará en la raíz del proyecto)

### Prisma
- **Qué es:** ORM (Object-Relational Mapping) para Node.js/TypeScript. Equivalente a SQLAlchemy o Django ORM en Python.
- **Para qué lo usamos:** Definir los modelos (Cliente, Pedido, etc.), hacer consultas a la base de datos con código TypeScript en vez de SQL crudo.
- **Ventajas:** Genera un cliente tipado automáticamente. Si el modelo tiene `nombre: string`, el editor te autocompleta y valida que uses strings.
- **Archivos relacionados:**
  - `prisma/schema.prisma` → donde se definen los modelos (como `models.py` en Django)
  - `prisma/migrations/` → historial de cambios en la base de datos
- **Comandos clave:**
  - `npx prisma migrate dev` → aplica cambios del schema a la BD
  - `npx prisma studio` → interfaz web para ver/editar datos (útil para debug)
  - `npx prisma generate` → regenera el cliente tipado después de cambiar el schema

---

## Estilos y UI

### Tailwind CSS (v4)
- **Qué es:** Framework de CSS basado en clases utilitarias. En vez de escribir CSS en archivos separados, aplicas clases directamente en el HTML.
- **Para qué lo usamos:** Estilizar toda la interfaz.
- **Ejemplo:** `<div className="bg-blue-500 text-white p-4 rounded">` → fondo azul, texto blanco, padding, bordes redondeados.
- **Ventaja:** No necesitas mantener archivos CSS separados. Todo el estilo está en el componente.

### Shadcn/ui (pendiente de instalar)
- **Qué es:** Colección de componentes UI preconstruidos (botones, tablas, formularios, modales, selects, etc.) basados en Tailwind.
- **Para qué lo usamos:** No reinventar la rueda. Necesitamos tablas, formularios, selects — shadcn los provee listos y personalizables.
- **Diferencia con otras librerías:** Los componentes se copian a tu proyecto (no es una dependencia). Puedes modificarlos libremente.

---

## Calidad de código

### ESLint (v9)
- **Qué es:** Linter para JavaScript/TypeScript. Analiza el código y detecta errores o malas prácticas.
- **Para qué lo usamos:** Mantener el código limpio y consistente.
- **Comando:** `npm run lint`
- **Archivo de configuración:** `eslint.config.mjs`

---

## Resumen de equivalencias Python → JavaScript/TypeScript

| Concepto         | Python                  | Este proyecto              |
| ---------------- | ----------------------- | -------------------------- |
| Lenguaje         | Python                  | TypeScript                 |
| Runtime          | CPython                 | Node.js                    |
| Paquetes         | pip + requirements.txt  | npm + package.json         |
| Entorno virtual  | venv                    | node_modules/              |
| Framework web    | Django / Flask           | Next.js                    |
| ORM              | SQLAlchemy / Django ORM  | Prisma                     |
| Templates/UI     | Jinja2 / Django Templates| React (JSX/TSX)           |
| Estilos          | CSS manual              | Tailwind CSS               |
| Linter           | pylint / flake8          | ESLint                     |
| Tipos            | type hints (opcional)    | TypeScript (obligatorio)   |
