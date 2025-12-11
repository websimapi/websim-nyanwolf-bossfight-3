import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { ReplayComposition } from "./replay_composition.jsx";
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
let root = null;
let playerRef = null;
function mountReplay(containerId, replayData, staticData, fps = 60, onPlayerRef) {
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
      justifyContent: "center",
      backgroundColor: "black"
    }, children: /* @__PURE__ */ jsxDEV(
      Player,
      {
        ref: (ref) => {
          playerRef = ref;
          if (onPlayerRef) onPlayerRef(ref);
        },
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
        lineNumber: 32,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 23,
      columnNumber: 9
    }, this)
  );
}
function unmountReplay() {
  if (root) {
    root.unmount();
    root = null;
    playerRef = null;
  }
}
window.downloadReplayVideo = async (filename = "nyanwolf_replay.webm") => {
  if (!playerRef) {
    console.error("No player ref found");
    return;
  }
  const canvas = document.getElementById("replay-canvas-target");
  if (!canvas) {
    alert("Rendering canvas not found. Please try playing the replay first.");
    return;
  }
  playerRef.pause();
  playerRef.seekTo(0);
  const stream = canvas.captureStream(60);
  const recordedChunks = [];
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
    videoBitsPerSecond: 5e6
    // 5Mbps for high quality
  });
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, {
      type: "video/webm"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    styleDownloadLink(a, url, filename);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };
  mediaRecorder.start();
  playerRef.play();
  const durationFrames = playerRef.getDurationInFrames();
  const fps = 60;
  const durationMs = durationFrames / fps * 1e3;
  setTimeout(() => {
    playerRef.pause();
    mediaRecorder.stop();
    playerRef.seekTo(0);
  }, durationMs + 200);
};
function styleDownloadLink(a, url, filename) {
  a.href = url;
  a.download = filename;
  a.style.display = "none";
}
export {
  mountReplay,
  unmountReplay
};
