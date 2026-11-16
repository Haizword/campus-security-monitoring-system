# Campus Watch

A privacy-first, static academic demonstration of a coordinated campus security monitoring dashboard inspired by the University of Ibadan.

## What this demo includes

- An overview dashboard with fictional reports, sample trends, and aggregated zone summaries.
- A searchable incident list with status filters.
- A schematic map using invented quadrants—not actual campus geography.
- Illustrative category, daily, and zone-level charts.
- A pretend report form that changes only the current page session.
- An explanation of the privacy and edge-computing research concept.

## Important limitations

This is a front-end demonstration, not an official University of Ibadan service or an operational security system. It does not connect to campus security, emergency services, cameras, sensors, mobile devices, or a backend. All reports and analytics are fictional. A report submitted in the demo is held in browser memory and is lost on refresh.

## Run locally

Open `index.html` in a browser. The site has no build step, runtime dependencies, or third-party network requests.

## Publish with GitHub Pages

The included workflow deploys the static site to GitHub Pages when changes are pushed to the `main` or `master` branch.

1. Create a GitHub repository and add it as this repository's `origin` remote.
2. Push the `main` or `master` branch.
3. In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
4. The `Deploy to GitHub Pages` workflow will publish the site. Its deployment URL appears under the repository's **Settings → Pages** and in the workflow run summary.

No GitHub remote is configured in the current local workspace, so deployment must be connected to the intended GitHub repository first.
