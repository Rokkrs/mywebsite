# iOS Engineer Portfolio

A modern, minimalist portfolio website for iOS Engineers, built with Astro and styled with the Brutal theme.

## 🚀 Tech Stack

- **[Astro](https://astro.build/)** - The web framework for content-driven websites
- **[UnoCSS](https://uno.antfu.me/)** - Instant On-demand Atomic CSS Engine
- **[Brutal UI](https://github.com/eliancodes/brutal)** - Neobrutalism UI components
- **TypeScript** - For type safety

## 🎨 Features

- ⚡️ Lightning fast performance
- 📱 Fully responsive design
- 🎨 Neobrutalism design aesthetic
- 🔧 Easy to customize
- 📦 Zero JavaScript by default
- 🎯 SEO optimized

## 🛠️ Project Structure

```
/
├── public/
│   ├── fonts/          # Custom fonts from Brutal theme
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── generic/    # Reusable components
│   │   └── layout/     # Layout components (Header, Footer, etc.)
│   ├── layouts/
│   │   └── Default.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.ts
├── uno.config.ts
└── package.json
```

## 🏃‍♂️ Getting Started

### Installation

Install dependencies using pnpm (recommended):

```bash
pnpm install
```

Or use npm:

```bash
npm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The site will be available at `http://localhost:4321`

### Building for Production

Create a production build:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## ✏️ Customization

### Update Your Information

1. **Navigation & Social Links** - Edit `src/components/layout/BaseNavigation.astro`
2. **Projects** - Update the `projects` array in `src/pages/index.astro`
3. **Skills** - Update the `skills` array in `src/pages/index.astro`
4. **Contact Information** - Update the contact section in `src/pages/index.astro`

### Styling

The project uses the Brutal theme's neobrutalism design system. Main styling can be customized in:

- `src/styles/global.css` - Global styles and CSS variables
- `uno.config.ts` - UnoCSS configuration

### Colors

The Brutal theme uses a simple color system defined in `global.css`:

- `--primary`: White (#FFFFFF)
- `--secondary`: Black (#000000)

You can customize these in the `:root` selector in `global.css`.

## 📝 License

This project uses the Brutal theme by [Elian Van Cutsem](https://www.elian.codes/).

## 🙏 Credits

- **Brutal Theme** - [eliancodes/brutal](https://github.com/eliancodes/brutal)
- **Astro** - [astro.build](https://astro.build/)
- **UnoCSS** - [uno.antfu.me](https://uno.antfu.me/)

