# Client

## Install

### Init React App with Vite

* `npm create vite@latest client -- --template react-ts`

> Extra double-dash is needed

### Install Dependencies

```shell
npm i --save-dev @types/node
```

### Configure

* Configure `vite.config.ts` by adding `build` and `server` configurations.
* Clean up client: Update `./src/index.css`, `./src/App.css`, `./src/App.tsx`.

### Install Tailwind CSS with Vite

[Guide](https://tailwindcss.com/docs/guides/vite#react)

* Installation: `npm install -D tailwindcss postcss autoprefixer`, `npx tailwindcss init -p`.
* Configure template paths: Update `tailwind.config.js`.
* Add the Tailwind directives: Update `./src/index.css`.

### Install NextUI

[Guide](https://nextui.org/docs/frameworks/vite)

* Installation: `npm i @nextui-org/react framer-motion`.
* Tailwind CSS Setup: Update `tailwind.config.js`.
* Provider Setup: Update `main.tsx`.

### Dark Mode

[Guide](https://nextui.org/docs/customization/dark-mode)

* Install Next Themes: `npm install next-themes`

> Configuration is on the next step.

### Extensions

* Redux Toolkit: `npm install @reduxjs/toolkit`
  * React Bindings: `npm install react-redux`
  * [Guide](https://redux-toolkit.js.org/introduction/getting-started#an-existing-app)
* Redux Persist: `npm install redux-persist`
* React Router Dom: `npm install react-router-dom`
* Radix Icons: `npm install @radix-ui/react-icons`
* Install Axios: `npm install axios`

### Configure Dark Mode with NextUI

### Install shadcn/ui