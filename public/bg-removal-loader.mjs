import { removeBackground } from "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm";
window.__imglyRemoveBg = removeBackground;
window.dispatchEvent(new CustomEvent("bgremoval-ready"));
