import { adapter, discover } from "../adapter.js";
import { watch } from "../dom.js";
import * as registry from "../registry.js";
let data = null, unwatch, unuse;
function scan() {
  if (!data || (!adapter.userSelector && !discover())) return;
  document.querySelectorAll(adapter.userSelector).forEach((el) => {
    const id = el.getAttribute(adapter.userIdAttr);
    if (!id) return;
    const list = data.users?.[id]?.badges || [];
    const key = id + ":" + list.join(",");
    if (el.dataset.ycB === key) return;
    el.dataset.ycB = key;
    el.querySelectorAll(":scope > .yc-badges").forEach((n) => n.remove());
    if (!list.length) return;
    const wrap = document.createElement("span");
    wrap.className = "yc-badges";
    wrap.style.cssText = "display:inline-flex;gap:4px;margin-left:6px;vertical-align:middle";
    for (const b of list) {
      const d = data.badges?.[b]; if (!d) continue;
      const s = document.createElement("span");
      s.textContent = d.emoji; s.title = d.label + " (Yapcord badge, not official)";
      wrap.appendChild(s);
    }
    el.appendChild(wrap);
  });
}
export default {
  id: "badges", name: "Badges", added: "2026-11-16", version: "0.1.0", enabledByDefault: true,
  description: "Shows Yapcord badges next to users. Only people running Yapcord can see them.",
  start() { unuse = registry.use((d) => { data = d; scan(); }); unwatch = watch(scan); },
  stop() {
    unwatch?.(); unuse?.(); data = null;
    document.querySelectorAll(".yc-badges").forEach((n) => n.remove());
    document.querySelectorAll("[data-yc-b]").forEach((n) => delete n.dataset.ycB);
  },
};
