import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { ReplayComposition } from "./composition.jsx";
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
let root = null;
function mountReplay(containerId, replayData, staticData, fps = 60) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!root) {
    root = createRoot(container);
  }
  const durationInFrames = Math.max(1, replayData.length);
  const ReplayPlayerWithDownload = () => {
    const handleDownload = async () => {
      try {
        if (!window.websim || !window.websim.renderMedia) {
          console.error("window.websim.renderMedia is not available in this environment.");
          return;
        }
        console.log("rendering your video!", {
          durationInFrames,
          fps,
          compositionWidth: GAME_WIDTH,
          compositionHeight: GAME_HEIGHT,
          component: ReplayComposition
        });
        const result = await window.websim.renderMedia({
          component: ReplayComposition,
          inputProps: { replayData, staticData },
          durationInFrames,
          fps,
          compositionWidth: GAME_WIDTH,
          compositionHeight: GAME_HEIGHT,
          codec: "h264",
          audioCodec: "aac"
        });
        console.log("Render result:", result);
      } catch (err) {
        console.error("Render failed:", err);
        if (window.websim && window.websim.reportError) {
          window.websim.reportError({
            type: "render-error",
            message: err?.message || String(err),
            stack: err?.stack
          });
        }
      }
    };
    return /* @__PURE__ */ jsxDEV("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: ReplayComposition,
          durationInFrames,
          fps,
          compositionWidth: GAME_WIDTH,
          compositionHeight: GAME_HEIGHT,
          controls: true,
          enableDownload: false,
          showDownloadButton: false,
          numberOfSharedAudioTags: 20,
          inputProps: { replayData, staticData },
          style: { width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 67,
          columnNumber: 21
        },
        this
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 66,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "center", paddingTop: 8 }, children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: handleDownload,
          style: {
            padding: "8px 16px",
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 14,
            fontWeight: "bold",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(145deg,#007bff,#0056b3)",
            color: "#fff",
            boxShadow: "0 3px 8px rgba(0,123,255,0.5)",
            textTransform: "uppercase"
          },
          children: "Download Replay"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 84,
          columnNumber: 21
        },
        this
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 83,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 65,
      columnNumber: 13
    }, this);
  };
  root.render(
    /* @__PURE__ */ jsxDEV(ReplayPlayerWithDownload, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 109,
      columnNumber: 9
    }, this)
  );
}
function unmountReplay() {
  if (root) {
    root.unmount();
    root = null;
  }
}
export {
  mountReplay,
  unmountReplay
};
