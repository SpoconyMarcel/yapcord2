export default {
  id: "reduceMotion", name: "Reduce Motion", added: "2026-11-20", version: "0.1.0", enabledByDefault: false,
  description: "Turns off animations and transitions.",
  start(ctx) { ctx.css("*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}"); },
};
