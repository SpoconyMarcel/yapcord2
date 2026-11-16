export default {
  id: "customCss", name: "Custom CSS", added: "2026-11-18", version: "0.1.0", enabledByDefault: false,
  description: "Paste your own CSS to restyle the app.",
  options: [{ key: "css", type: "textarea", default: "" }],
  start(ctx) { ctx.css(ctx.option("css") || ""); },
};
