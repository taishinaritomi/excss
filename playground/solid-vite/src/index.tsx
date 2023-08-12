import { render } from "solid-js/web";
import { App } from "./App";
const app = document.querySelector("#app");

if (app) render(() => <App />, app);
