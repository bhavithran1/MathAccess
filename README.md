# MathAccess React Website

MathAccess is a React/Vite website for a Malaysian education organization making advanced mathematics, olympiads, AI labs, game-based learning, conjecture generation, and quantum computing accessible to students from every background.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Production Build

```bash
npm run build
```

The build output is written to `dist/`.

## GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Create a GitHub repository, for example `MathAccess`.
2. Push this project to the `main` branch.
3. In GitHub, open repository settings.
4. Go to `Pages`.
5. Set the source to `GitHub Actions`.
6. Pushes to `main` will build and deploy automatically.

The Vite base path is configured automatically from `GITHUB_REPOSITORY` during GitHub Actions builds, so the site works on project pages such as:

```text
https://<username>.github.io/MathAccess/
```

## Routes

- `/` - main MathAccess site
- `/hackathons` - high-school hackathons
- `/olympiad-ai` - original olympiad problem engine
- `/game-worlds` - advanced math through game worlds
- `/conjecture-generator` - automated conjecture generator
- `/quantum-computing` - quantum computing questions
