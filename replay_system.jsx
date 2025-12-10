import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { AbsoluteFill, useCurrentFrame, Img, Audio, Sequence } from "remotion";
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const ReplayScene = ({ frameData, staticData }) => {
  const { player, boss, projectiles, playerProjectiles, score } = frameData;
  const { playerSkin, bossSkin, background, bossProjectileImage } = staticData;
  let bgStyle = {
    width: "100%",
    height: "100%",
    position: "absolute"
  };
  if (background === "white") {
    bgStyle.backgroundColor = "white";
  } else {
    bgStyle.backgroundImage = `url(${background})`;
    bgStyle.backgroundSize = "cover";
    bgStyle.backgroundPosition = "center";
  }
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "black",
    // Fallback
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Orbitron', sans-serif"
  }, children: [
    /* @__PURE__ */ jsxDEV("div", { style: bgStyle }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 38,
      columnNumber: 12
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      left: boss.x,
      top: boss.y,
      width: 150,
      height: 150,
      backgroundImage: `url(${bossSkin})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      animation: "none",
      // Animations handled by frames theoretically, but keeping static for replay performance
      filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))"
    } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 41,
      columnNumber: 12
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      left: player.x,
      top: player.y,
      width: 50,
      height: 50,
      backgroundImage: `url(${playerSkin})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      zIndex: 10
    } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 56,
      columnNumber: 12
    }),
    projectiles.map((p, i) => /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      left: p.x,
      top: p.y,
      width: p.width,
      height: p.height,
      backgroundImage: `url(${bossProjectileImage})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      zIndex: 5
    } }, `enemy-proj-${i}`, false, {
      fileName: "<stdin>",
      lineNumber: 71,
      columnNumber: 17
    })),
    playerProjectiles.map((p, i) => {
      const isStinkRay = p.type === "stink_ray";
      return /* @__PURE__ */ jsxDEV("div", { style: {
        position: "absolute",
        left: p.x,
        top: p.y,
        width: p.width,
        height: p.height,
        ...isStinkRay ? {
          backgroundImage: "url('/stink_ray_projectile.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        } : {
          backgroundColor: "#00ffea",
          borderRadius: 4,
          boxShadow: "0 0 8px #00ffea"
        },
        zIndex: 5
      } }, `player-proj-${i}`, false, {
        fileName: "<stdin>",
        lineNumber: 89,
        columnNumber: 20
      });
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      top: 15,
      left: 20,
      color: "white",
      fontFamily: "'Press Start 2P', cursive",
      fontSize: 22,
      textShadow: "2px 2px 0 #000",
      zIndex: 20
    }, children: [
      "Score: ",
      score
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 111,
      columnNumber: 12
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      bottom: 20,
      right: 20,
      color: "rgba(255,255,255,0.5)",
      fontSize: 14,
      fontFamily: "'Orbitron', sans-serif"
    }, children: "REPLAY MODE" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 124,
      columnNumber: 12
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 30,
    columnNumber: 9
  });
};
const ReplayComposition = ({ replayData, staticData }) => {
  const frame = useCurrentFrame();
  const index = Math.min(Math.floor(frame), replayData.length - 1);
  const currentFrameData = replayData[Math.max(0, index)];
  const audioEvents = useMemo(() => {
    const events = [];
    replayData.forEach((data, frameIndex) => {
      if (data.events && data.events.length > 0) {
        data.events.forEach((eventType) => {
          events.push({ frame: frameIndex, type: eventType });
        });
      }
    });
    return events;
  }, [replayData]);
  const SOUND_URLS = {
    shoot: "/player_shoot.mp3",
    hit: "/player_hit.mp3",
    stink_fire: "/stink_ray_fire.mp3",
    heal: "/heal_pickup.mp3",
    splash: "/player_hit.mp3",
    // Reusing hit sound for splash as per script
    shop_purchase: "/shop_purchase.mp3"
    // Just in case
  };
  if (!currentFrameData) return null;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    staticData.bgmSrc && /* @__PURE__ */ jsxDEV(Audio, { src: staticData.bgmSrc, volume: 0.25, loop: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 170,
      columnNumber: 17
    }),
    audioEvents.map((evt, i) => {
      const src = SOUND_URLS[evt.type];
      if (!src) return null;
      return /* @__PURE__ */ jsxDEV(Sequence, { from: evt.frame, durationInFrames: 60, children: /* @__PURE__ */ jsxDEV(Audio, { src, volume: 0.6 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 177,
        columnNumber: 25
      }) }, `sfx-${i}`, false, {
        fileName: "<stdin>",
        lineNumber: 176,
        columnNumber: 21
      });
    }),
    /* @__PURE__ */ jsxDEV(ReplayScene, { frameData: currentFrameData, staticData }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 181,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 168,
    columnNumber: 9
  });
};
let root = null;
function mountReplay(containerId, replayData, staticData) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!root) {
    root = createRoot(container);
  }
  const durationInFrames = Math.max(1, replayData.length);
  root.render(
    /* @__PURE__ */ jsxDEV("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxDEV(
      Player,
      {
        component: ReplayComposition,
        durationInFrames,
        fps: 60,
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
        lineNumber: 201,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 200,
      columnNumber: 9
    }, this)
  );
}
export {
  mountReplay
};
