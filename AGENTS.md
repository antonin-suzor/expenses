# AGENTS.md

## Project overview

This is a website to help create entries in a notion database that is used for personnal accounting.
The project is deployed on Cloudflare Workers, and includes a backend to easily call the Notion API.

Languages/frameworks: TypeScript + React + TailwindCSS + DaisyUI

## Repository architecture and code guidelines

Do not use emojis anywhere unless explicitly asked to.
Keep in mind that this is meant to be used on smartphones, so build the website to be resposive.
There should be no css written outside of `src/index.css`, and everything styling-related should be made using tailwind and daisyui.

## Build and test commands

Sanity checks:

- code builds correctly: `npm run build`
- code is well-formatted: `npm run format` (running it will automatically format the code)

Even though eslint is configured for the project, you should not run it.
