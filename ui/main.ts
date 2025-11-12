import { createApp } from "vue";
import App from "./app.vue";

const app = createApp(App);

const rootDom = document.createElement("div");
rootDom.setAttribute("id", "root");
document.body.appendChild(rootDom);

app.mount(rootDom);
