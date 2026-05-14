# Backlog Builder · SENA

Herramienta para que los grupos de aprendices del SENA construyan el Backlog de su proyecto de forma organizada, siguiendo el formato institucional establecido.

## Estructura del proyecto

```
backlog-sena/
├── index.html          # Punto de entrada principal
├── css/
│   ├── variables.css   # Paleta de colores y tokens (EDITAR AQUÍ para cambiar tema)
│   └── main.css        # Estilos de todos los componentes
├── js/
│   ├── data.js         # Datos quemados del proyecto SIGMA (reemplazar por datos reales)
│   └── app.js          # Lógica principal: render, modales, exportación
└── assets/
    └── sena-logo.svg   # Logotipo SENA
```

## Cómo personalizar los colores

Abre `css/variables.css` y edita los valores en `:root`. Todos los componentes leen de esas variables. Por ejemplo:

```css
:root {
  --sena-green:      #2d7a44;   /* color principal verde */
  --sena-green-dark: #1a5c2e;   /* verde oscuro header/sidebar */
  --bg-page:         #f4f6f8;   /* fondo de la app */
  /* ... */
}
```

## Cómo usar

1. Abrir `index.html` en un navegador (doble clic o servidor local).
2. **Pestaña Product Backlog**: editar nombre del proyecto, agregar épicas e historias.
3. **Pestaña Tareas**: seleccionar una historia y gestionar sus tareas.
4. **Descargar .xlsx**: genera el archivo con el formato institucional SENA (2 hojas).

## Funcionalidades

- Sidebar retráctil (botón ☰ en el header)
- Agregar / editar Épicas con todos los campos SENA
- Agregar / editar Historias de Usuario con criterios de aceptación, prioridad, story points, sprint, estado y responsable
- Gestión de Tareas por historia (RF / RNF), con estimación, responsable, dependencias y barra de progreso
- Exportación a .xlsx con 2 hojas: **Product Backlog** y **Tareas por historias**

## Dependencias externas (CDN)

- **Plus Jakarta Sans** — Google Fonts (tipografía principal)
- **JetBrains Mono** — Google Fonts (tipografía monoespaciada)
- **SheetJS (xlsx)** — generación de archivos Excel en el navegador

No requiere backend ni servidor especial.
