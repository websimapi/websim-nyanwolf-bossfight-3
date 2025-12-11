import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { ReplayComposition } from "./replay_composition.jsx";
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
let root = null;
const handleSaveReplay = (replayData, staticData) => {
  const projectData = {
    replayData,
    staticData,
    version: "1.0",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  const blob = new Blob([JSON.stringify(projectData, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nyanwolf-replay-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
function mountReplay(containerId, replayData, staticData, fps = 60) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!root) {
    root = createRoot(container);
  }
  const durationInFrames = Math.max(1, replayData.length);
  root.render(
    /* @__PURE__ */ jsxDEV("div", { style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: {
        width: "100%",
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }, children: /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: ReplayComposition,
          durationInFrames,
          fps,
          compositionWidth: GAME_WIDTH,
          compositionHeight: GAME_HEIGHT,
          controls: true,
          loop: true,
          inputProps: { replayData, staticData },
          style: { width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 59,
          columnNumber: 17
        },
        this
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 51,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: {
        padding: "10px",
        display: "flex",
        gap: "10px"
      }, children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => handleSaveReplay(replayData, staticData),
          style: {
            padding: "10px 20px",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#28a745",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
          },
          children: "Save Replay (JSON)"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 77,
          columnNumber: 18
        },
        this
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 72,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 43,
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
