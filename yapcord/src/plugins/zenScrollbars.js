export default {
  id: "zenScrollbars", name: "Zen Scrollbars", added: "2026-11-19", version: "0.1.0", enabledByDefault: false,
  description: "Hides scrollbars for a cleaner look.",
  start(ctx) { ctx.css("*::-webkit-scrollbar{display:none!important}*{scrollbar-width:none!important}"); },
};
