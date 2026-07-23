# AuraStore Pro — Tienda Virtual 3D

Tienda virtual de commerce electrónico con diseño futurista, checkout 3D interactivo y experiencia de compra premium.

## Características

- **Catálogo de productos** con filtrado por categoría, búsqueda en tiempo real y ordenamiento por precio/valoración
- **Carrito de compras** persistente con `localStorage`
- **Favoritos** para guardar productos deseados
- **Checkout 3D** con tarjeta interactiva que responde al movimiento del mouse
- **Múltiples métodos de pago**: Tarjeta, Web3 Wallet (crypto) y Aura Pass (biométrico)
- **Sistema de cupones** (ej: `AURA2026` — 15% de descuento)
- **Tema claro/oscuro** con toggle
- **Diseño responsive** con grid adaptativo
- **Efectos 3D** en tarjetas de producto con perspective y hover animations

## Estructura del Proyecto

```
tienda virtual/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos de la aplicación
├── js/
│   └── app.js          # Lógica de la tienda
├── productos.json      # Catálogo de 16 productos
├── categorias.json     # Categorías disponibles
├── metodos_pago.json   # Métodos de pago soportados
└── README.md
```

## Tecnologías

- **HTML5** — Estructura semántica
- **CSS3** — Variables CSS, Grid, Flexbox, animaciones 3D (`perspective`, `transform-style`, `backdrop-filter`)
- **JavaScript Vanilla** — Lógica de la tienda sin dependencias externas

## Cómo Ejecutar

Abrir el archivo `index.html` directamente en un navegador moderno (Chrome, Firefox, Edge).

```bash
# Opcionalmente con un servidor local:
npx serve .
```

## Cupón de Descuento

| Cupón    | Descuento |
|----------|-----------|
| AURA2026 | 15% OFF   |

## Categorías

- Ropa
- Calzado
- Accesorios
- Tecnología
- Deporte

## Licencia

Proyecto abierto para uso educativo y personal.
