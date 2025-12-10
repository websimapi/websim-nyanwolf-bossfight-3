import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { AbsoluteFill, useCurrentFrame, Audio, Sequence } from "remotion";
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const ReplayScene = ({ frameData, staticData }) => {
  const { player, boss, projectiles, playerProjectiles, score, healItem } = frameData;
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
    healItem && /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      left: healItem.x,
      top: healItem.y,
      width: healItem.width,
      height: healItem.height,
      backgroundImage: healItem.type === "apple" ? "url('/Aple.webp')" : "url('/golden_cheese_heal.png')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      filter: healItem.type === "apple" ? "" : "drop-shadow(0 0 8px #ffd700)",
      zIndex: 4
    } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 44,
      columnNumber: 17
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
      filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
      zIndex: 2
    } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 60,
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
      zIndex: 3
    } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 76,
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
      zIndex: 4
    } }, `enemy-proj-${i}`, false, {
      fileName: "<stdin>",
      lineNumber: 91,
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
        zIndex: 4
      } }, `player-proj-${i}`, false, {
        fileName: "<stdin>",
        lineNumber: 109,
        columnNumber: 20
      });
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      top: 15,
      left: "50%",
      transform: "translateX(-50%)",
      width: 320,
      height: 30,
      backgroundColor: "rgba(0,0,0,0.3)",
      border: "2px solid #00ff7f",
      borderRadius: 8,
      padding: 3,
      zIndex: 20,
      display: "flex",
      alignItems: "center"
    }, children: /* @__PURE__ */ jsxDEV("div", { style: { flexGrow: 1, height: "100%", backgroundColor: "#2a2a2a", borderRadius: 5, overflow: "hidden", position: "relative" }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: {
        width: `${boss.health / boss.maxHealth * 100}%`,
        height: "100%",
        background: "linear-gradient(to right, #00ff7f, #ff00ff)",
        borderRadius: 5
      } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 149,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("span", { style: {
        position: "absolute",
        left: 10,
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "'Press Start 2P', cursive",
        fontSize: 9,
        color: "#fff",
        textShadow: "1px 1px 1px #000"
      }, children: "BOSS HEALTH" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 155,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 148,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 133,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      bottom: 15,
      left: 20,
      width: 220,
      height: 28,
      backgroundColor: "rgba(0,0,0,0.3)",
      border: "2px solid #00c6ff",
      borderRadius: 8,
      padding: 3,
      zIndex: 20,
      display: "flex",
      alignItems: "center"
    }, children: /* @__PURE__ */ jsxDEV("div", { style: { flexGrow: 1, height: "100%", backgroundColor: "#2a2a2a", borderRadius: 5, overflow: "hidden", position: "relative" }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: {
        width: `${player.health / player.maxHealth * 100}%`,
        height: "100%",
        background: "linear-gradient(to right, #00ff00, #7fff00)",
        borderRadius: 5
      } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 180,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("span", { style: {
        position: "absolute",
        left: 10,
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "'Press Start 2P', cursive",
        fontSize: 9,
        color: "#fff",
        textShadow: "1px 1px 1px #000"
      }, children: "PLAYER HEALTH" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 186,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 179,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 165,
      columnNumber: 13
    }),
    player.isCharging && /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      bottom: 60,
      left: 20,
      width: 180,
      height: 18,
      backgroundColor: "rgba(10,20,10,0.4)",
      border: "2px solid #A8FF78",
      borderRadius: 5,
      padding: 2,
      zIndex: 20,
      display: "flex",
      alignItems: "center",
      boxShadow: "0 0 8px #A8FF78aa"
    }, children: /* @__PURE__ */ jsxDEV("div", { style: { flexGrow: 1, height: "100%", backgroundColor: "#1a2a1a", borderRadius: 3, overflow: "hidden", position: "relative" }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: {
        width: `${player.chargeLevel * 100}%`,
        height: "100%",
        background: "linear-gradient(to right, #6DD400, #A8FF78)",
        borderRadius: 3
      } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 213,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("span", { style: {
        position: "absolute",
        left: 8,
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "'Press Start 2P', cursive",
        fontSize: 7,
        color: "#fff",
        textShadow: "1px 1px 1px #000"
      }, children: "STINK RAY" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 219,
        columnNumber: 25
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 212,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 197,
      columnNumber: 17
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
      lineNumber: 229,
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
      lineNumber: 242,
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
      lineNumber: 288,
      columnNumber: 17
    }),
    audioEvents.map((evt, i) => {
      const src = SOUND_URLS[evt.type];
      if (!src) return null;
      return /* @__PURE__ */ jsxDEV(Sequence, { from: evt.frame, durationInFrames: 60, children: /* @__PURE__ */ jsxDEV(Audio, { src, volume: 0.6 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 295,
        columnNumber: 25
      }) }, `sfx-${i}`, false, {
        fileName: "<stdin>",
        lineNumber: 294,
        columnNumber: 21
      });
    }),
    /* @__PURE__ */ jsxDEV(ReplayScene, { frameData: currentFrameData, staticData }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 299,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 286,
    columnNumber: 9
  });
};
let root = null;
function mountReplay(containerId, replayData, staticData, fps = 60) {
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
        lineNumber: 319,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 318,
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
