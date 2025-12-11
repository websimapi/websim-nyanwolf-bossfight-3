import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Composition } from "remotion";
import { ReplayComposition } from "./replay_composition.jsx";
const RemotionRoot = () => {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(
    Composition,
    {
      id: "ReplayComposition",
      component: ReplayComposition,
      durationInFrames: 300,
      fps: 60,
      width: 800,
      height: 600,
      defaultProps: {
        replayData: [],
        staticData: {}
      }
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 8,
      columnNumber: 7
    }
  ) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 7,
    columnNumber: 5
  });
};
export {
  RemotionRoot
};
