# Fancy GitHub Cards

Generate beautiful, interactive, and shareable GitHub profile and repository cards with stunning neon effects.

## Features

- 🎨 **Beautiful Design** - Modern neon-styled cards with glass effects
- 👤 **Profile Cards** - Generate cards for GitHub users
- 📦 **Repository Cards** - Generate cards for GitHub repositories
- 🏢 **Organization Cards** - Support for GitHub organizations
- 📱 **Multiple Sizes** - Social Media (1200x630) and README (500x280)
- 📋 **Export Options** - PNG, HTML, Markdown, and Scrapbox formats
- ⚡ **Fast** - Server-side rendered with Next.js

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token

### Installation

```bash
npm install
```

### Environment Variables

You have two options for managing environment variables:

#### Option 1: Using Doppler (Recommended)

1. Install [Doppler CLI](https://docs.doppler.com/docs/install-cli)
2. Login and configure your project:
   ```bash
   doppler login
   doppler setup
   ```
3. Run the dev server with Doppler:
   ```bash
   doppler run -- npm run dev
   ```

#### Option 2: Manual Setup

Create a `.env.local` file in the root directory:

```env
GITHUB_TOKEN=your_github_token_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Then run:

```bash
npm run dev
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. Enter a GitHub profile URL (e.g., `https://github.com/username`)
2. Or enter a repository URL (e.g., `https://github.com/owner/repo`)
3. Click "Generate" to create your card
4. Choose your preferred size and format
5. Download or copy the embed code

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [Satori](https://github.com/vercel/satori) - SVG Generation
- [Vercel OG](https://vercel.com/docs/functions/og-image-generation) - Image Generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Orbitron Font](https://fonts.google.com/specimen/Orbitron) - Typography

## Author

Built by **Sourav Das**

## License

MIT License
