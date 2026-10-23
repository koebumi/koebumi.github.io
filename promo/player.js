// 画面の大きさに合わせて 1920×1080 の舞台を縮め、実時間で繰り返し再生する。
// 書き出し（render.mjs）では ?render を付けて開くので、再生はしない。
// 埋め込んだページからは postMessage で { cmd: "play" | "pause" | "toggle" | "restart" | "seek", t } を送れる。
(function () {
  const stage = document.getElementById("stage");
  function fit() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `scale(${s})`;
  }
  addEventListener("resize", fit);
  fit();
  if (new URLSearchParams(location.search).has("render")) return;

  let playing = true, base = performance.now(), offset = 0;
  const now = () => (playing ? (offset + (performance.now() - base) / 1000) % window.DURATION : offset);
  function frame() {
    const t = now();
    window.renderAt(t);
    if (parent !== window) parent.postMessage({ koebumiPlayer: window.name, t, d: window.DURATION, playing }, "*");
    requestAnimationFrame(frame);
  }
  addEventListener("message", (e) => {
    const m = e.data || {};
    if (m.cmd === "pause" || (m.cmd === "toggle" && playing)) { offset = now(); playing = false; }
    else if (m.cmd === "play" || m.cmd === "toggle") { if (!playing) { base = performance.now(); playing = true; } }
    else if (m.cmd === "restart") { offset = 0; base = performance.now(); playing = true; }
    else if (m.cmd === "seek") { offset = m.t; base = performance.now(); }
  });
  requestAnimationFrame(frame);
})();
