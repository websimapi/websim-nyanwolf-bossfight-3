import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, Audio, Sequence } from "remotion";
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const useGameImages = (staticData) => {
  const [images, setImages] = useState(null);
  useEffect(() => {
    const loadImages = async () => {
      const imgSources = {
        player: staticData.playerSkin,
        boss: staticData.bossSkin,
        projectile_boss: staticData.bossProjectileImage,
        projectile_player: "/stink_ray_projectile.png",
        // Stink ray
        // Standard assets
        cheese: "/golden_cheese_heal.png",
        apple: "/Aple.webp",
        water_balloon: "/water_balloon.png",
        slop: "/cooltext483247959599869.gif",
        // GIF support in canvas is partial (static frame), but handled by img.src
        bg_beach: "/beach_background.png",
        bg_space: "/game_background.png",
        token: "/token.png",
        pizza_icon: "/pizza_icon.png"
      };
      const loaded = {};
      const promises = Object.entries(imgSources).map(([key, src]) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            loaded[key] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load image for replay: ${src}`);
            resolve();
          };
          img.src = src;
        });
      });
      await Promise.all(promises);
      setImages(loaded);
    };
    loadImages();
  }, [staticData]);
  return images;
};
const ReplayScene = ({ frameData, staticData }) => {
  const canvasRef = useRef(null);
  const images = useGameImages(staticData);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !images || !frameData) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.imageSmoothingEnabled = false;
    if (staticData.background === "white") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
      const bgImg = staticData.background.includes("beach") ? images.bg_beach : images.bg_space;
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
      } else {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      }
    }
    const { player, boss, projectiles, playerProjectiles, score, healItem } = frameData;
    if (healItem) {
      const img = healItem.type === "apple" ? images.apple : images.cheese;
      if (img) {
        ctx.save();
        if (healItem.type !== "apple") {
          ctx.shadowColor = "#ffd700";
          ctx.shadowBlur = 10;
        }
        ctx.drawImage(img, healItem.x, healItem.y, healItem.width, healItem.height);
        ctx.restore();
      }
    }
    if (images.boss) {
      ctx.save();
      if (staticData.bossSkin.includes("summer")) {
        ctx.filter = "drop-shadow(0 0 10px #00c6ff)";
      } else {
        ctx.filter = "drop-shadow(0 0 10px rgba(255,255,255,0.5))";
      }
      ctx.drawImage(images.boss, boss.x, boss.y, 150, 150);
      ctx.restore();
    }
    if (images.player) {
      ctx.drawImage(images.player, player.x, player.y, 50, 50);
    }
    projectiles.forEach((p) => {
      if (images.projectile_boss) {
        ctx.drawImage(images.projectile_boss, p.x, p.y, p.width, p.height);
      }
    });
    playerProjectiles.forEach((p) => {
      if (p.type === "stink_ray") {
        if (images.projectile_player) {
          ctx.drawImage(images.projectile_player, p.x, p.y, p.width, p.height);
        }
      } else {
        ctx.fillStyle = "#00ffea";
        ctx.shadowColor = "#00ffea";
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.shadowBlur = 0;
      }
    });
    ctx.font = "22px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    const drawHealthBar = (x, y, w, h, current, max, colorStart, colorEnd, label) => {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = colorStart;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      const fillW = Math.max(0, current / max * (w - 6));
      const gradient = ctx.createLinearGradient(x + 3, y, x + 3 + fillW, y);
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(x + 3, y + 3, fillW, h - 6);
      ctx.font = "9px 'Press Start 2P'";
      ctx.fillStyle = "white";
      ctx.shadowColor = "black";
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(label, x + 10, y + h / 2 + 4);
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    };
    drawHealthBar(GAME_WIDTH / 2 - 160, 15, 320, 30, boss.health, boss.maxHealth, "#00ff7f", "#ff00ff", "BOSS HEALTH");
    drawHealthBar(20, GAME_HEIGHT - 45, 220, 28, player.health, player.maxHealth, "#00ff00", "#7fff00", "PLAYER HEALTH");
    if (player.isCharging) {
      const x = 20, y = GAME_HEIGHT - 80, w = 180, h = 18;
      ctx.fillStyle = "rgba(10,20,10,0.4)";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#A8FF78";
      ctx.strokeRect(x, y, w, h);
      const fillW = Math.max(0, player.chargeLevel * (w - 4));
      ctx.fillStyle = "#6DD400";
      ctx.fillRect(x + 2, y + 2, fillW, h - 4);
      ctx.font = "7px 'Press Start 2P'";
      ctx.fillStyle = "white";
      ctx.fillText("STINK RAY", x + 8, y + h / 2 + 3);
    }
    ctx.font = "14px 'Orbitron'";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "right";
    ctx.fillText("REPLAY MODE", GAME_WIDTH - 20, GAME_HEIGHT - 20);
    ctx.textAlign = "left";
  }, [frameData, images, staticData]);
  if (!images) return null;
  return /* @__PURE__ */ jsxDEV(
    "canvas",
    {
      ref: canvasRef,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      id: "replay-canvas-target",
      style: { width: "100%", height: "100%", objectFit: "contain" }
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 218,
      columnNumber: 9
    }
  );
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
    shop_purchase: "/shop_purchase.mp3"
  };
  if (!currentFrameData) return null;
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: [
    staticData.bgmSrc && /* @__PURE__ */ jsxDEV(Audio, { src: staticData.bgmSrc, volume: 0.25, loop: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 261,
      columnNumber: 17
    }),
    audioEvents.map((evt, i) => {
      const src = SOUND_URLS[evt.type];
      if (!src) return null;
      return /* @__PURE__ */ jsxDEV(Sequence, { from: evt.frame, durationInFrames: 60, children: /* @__PURE__ */ jsxDEV(Audio, { src, volume: 0.6 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 268,
        columnNumber: 25
      }) }, `sfx-${i}`, false, {
        fileName: "<stdin>",
        lineNumber: 267,
        columnNumber: 21
      });
    }),
    /* @__PURE__ */ jsxDEV(ReplayScene, { frameData: currentFrameData, staticData }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 274,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 258,
    columnNumber: 9
  });
};
var stdin_default = ReplayComposition;
export {
  ReplayComposition,
  ReplayScene,
  stdin_default as default
};
