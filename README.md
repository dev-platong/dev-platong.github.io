# dev-platong home

Playground to try something related video tech.
Use TypeScript, Sveltekit and ShakaPlayer. Coz I want to try them.

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte);

# Install

```shell
yarn
```

ShakaPlayer's latest version (v3.2.1) includes a bug to generate definitely type. So you have to revise generated definitely type.
I prepared a code which can fix this issue but you want to know what is an issue, SEE: https://github.com/google/shaka-player/issues/1030#issuecomment-862709116

```shell
chmod +x fix_shaka_type_def.sh
./fix_shaka_type_def.sh
```

# Recomended

I'm writing codes by VSCode. If you have it, open `workspace.code-workspace`. And you can install recommended packages easily.

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
