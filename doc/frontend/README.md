
Tehnologije:
- React
- Tailwind

> INFO: VSC ima "Tailwind IntelliSense" ekstenziju.

# Prvobitno

```
npm install
```

> INFO: Nemoj pokretati `npm audit fix --force`

# React

Pokretanje React servera (iz `root/React/`):

```
npm start
```

## Arhitektura

Glavne komponente React servera:

- `function App` (`App.js`), kao "main"
- Ruter (`App.js`), rutira korisnika na stranice po potrebi

Link na biblioteku rutera je [ovdje, `react-router-dom`](https://www.npmjs.com/package/react-router-dom) (DOM je Document Object Model, HTML stranica kao objekat, tj. stablo).

## Workflow jedne stranice

- Ako treba, radi se `fetch` (GET/POST)
    - `body` sadrži JSON koji se šalje

# Tailwind

- [Cheatsheet 1](https://www.creative-tim.com/twcomponents/cheatsheet)
- [Cheatsheet 2](https://nerdcave.com/tailwind-cheat-sheet)
- [Dokumentacija (Gledaj "scrolltab" lijevo)](https://tailwindcss.com/docs/installation/using-vite)

`index.css` sadrži korisnička CSS pravila koja se često koriste.

