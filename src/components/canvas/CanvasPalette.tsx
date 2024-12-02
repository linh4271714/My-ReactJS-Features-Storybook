import React, { useState } from "react";
import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material";

import IconAdjust from "./assets/IconAdjust.svg";
import IconClearAll from "./assets/IconClearAll.svg";
import IconEraser from "./assets/IconErase.svg";
import IconRedo from "./assets/IconRedo.svg";
import IconUndo from "./assets/IconUndo.svg";
import IconChecked from "./assets/IconChecked.svg";
import IconCheckedBlack from "./assets/IconCheckedBlack.svg";
import Crayon from "../drawing-board/assets/pen-types/Crayon";
import Marker from "../drawing-board/assets/pen-types/Marker";
import Brush from "../drawing-board/assets/pen-types/Brush";
//
//

const PALETTE_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "black",
] as const;

const PALETTE_ACTIONS = ["draw", "erase"] as const;

const PALETTE_PEN_TYPES = ["crayon", "marker", "brush"] as const;

//
//
//

export type PaletteColor = (typeof PALETTE_COLORS)[number];
export type PaletteAction = (typeof PALETTE_ACTIONS)[number];
export type PalettePenType = (typeof PALETTE_PEN_TYPES)[number];

interface CanvasPaletteProps {
  onReset: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  isUndoAble?: boolean;
  isRedoAble?: boolean;
  onPickColor: (color: PaletteColor) => void;
  onPickEraser: () => void;
  onPickPenType: (type: PalettePenType) => void;
  direction?: "row" | "column";
  current: {
    action: PaletteAction;
    color: PaletteColor;
    penType: PalettePenType;
    penWidth?: number;
    eraserWidth?: number;
  };
  onPenWidthChange?: (value: number) => void;
  onEraserWidthChange?: (value: number) => void;
  isDisable?: boolean;
}

//
//
//

const CanvasPalette: React.FC<CanvasPaletteProps> = ({
  onReset,
  onUndo,
  onRedo,
  onPickColor,
  onPickEraser,
  onPickPenType,
  direction = "row",
  current = {
    action: "draw",
    color: "black",
    penWidth: 2,
    eraserWidth: 4,
    penType: "marker",
  },
  onPenWidthChange,
  onEraserWidthChange,
  isUndoAble = false,
  isRedoAble = false,
  isDisable = false,
}) => {
  const [openAdjustTab, setOpenAdjustTab] = useState(false);

  return (
    <Stack divider={<Divider />} alignItems="flex-end">
      <Stack
        direction={direction}
        width={direction.includes("row") ? "fit-content" : "40px"}
        height={direction.includes("column") ? "fit-content" : "40px"}
        gap="2.5px"
        divider={
          <Divider
            orientation={direction === "row" ? "vertical" : "horizontal"}
          />
        }
      >
        <Tooltip title="Clear All" placement="top" arrow>
          <Stack
            height={40}
            width={40}
            onClick={onReset}
            alignItems="center"
            justifyContent="center"
            style={{
              cursor: isDisable ? "not-allowed" : "pointer",
              opacity: isDisable ? 0.5 : 1,
            }}
          >
            <img src={IconClearAll} alt="clear all" />
          </Stack>
        </Tooltip>
        <Tooltip title="Undo" placement="top" arrow>
          <Stack
            height={40}
            width={40}
            onClick={onUndo}
            alignItems="center"
            justifyContent="center"
            style={{
              cursor: !isUndoAble || isDisable ? "not-allowed" : "pointer",
              opacity: !isUndoAble || isDisable ? 0.5 : 1,
            }}
          >
            <img src={IconUndo} alt="undo" />
          </Stack>
        </Tooltip>
        <Tooltip title="Redo" placement="top" arrow>
          <Stack
            height={40}
            width={40}
            onClick={onRedo}
            alignItems="center"
            justifyContent="center"
            style={{
              cursor: !isRedoAble || isDisable ? "not-allowed" : "pointer",
              opacity: !isRedoAble || isDisable ? 0.5 : 1,
            }}
          >
            <img src={IconRedo} alt="redo" />
          </Stack>
        </Tooltip>
        <Tooltip title="Crayon" placement="top" arrow>
          <Stack
            height={40}
            width={40}
            onClick={() => onPickPenType("crayon")}
            alignItems="center"
            justifyContent="center"
            style={{
              cursor: "pointer",
              opacity: current.penType !== "crayon" ? 0.5 : 1,
            }}
          >
            <Crayon color={current.color} />
          </Stack>
        </Tooltip>
        <Tooltip title="Marker" placement="top" arrow>
          <Stack
            height={40}
            width={40}
            onClick={() => onPickPenType("marker")}
            alignItems="center"
            justifyContent="center"
            style={{
              cursor: "pointer",
              opacity: current.penType !== "marker" ? 0.5 : 1,
            }}
          >
            <Marker color={current.color} />
          </Stack>
        </Tooltip>
        <Tooltip title="Brush" placement="top" arrow>
          <Stack
            height={40}
            width={40}
            onClick={() => onPickPenType("brush")}
            alignItems="center"
            justifyContent="center"
            style={{
              cursor: "pointer",
              opacity: current.penType !== "brush" ? 0.5 : 1,
            }}
          >
            <Brush color={current.color} />
          </Stack>
        </Tooltip>
        <Tooltip title="Eraser" placement="top" arrow>
          <Box
            height={40}
            width={40}
            onClick={onPickEraser}
            style={{
              cursor: isDisable ? "not-allowed" : "pointer",
              opacity: isDisable ? 0.5 : current.action === "erase" ? 1 : 0.75,
            }}
          >
            <img src={IconEraser} alt="eraser" />
          </Box>
        </Tooltip>
        <Tooltip title="Adjust" placement="top" arrow>
          <Stack
            height={40}
            width={40}
            alignItems="center"
            justifyContent="center"
            position="relative"
            onClick={() => setOpenAdjustTab((old) => !old)}
            style={{
              cursor: "pointer",
              opacity: openAdjustTab ? 1 : 0.75,
            }}
          >
            <img src={IconAdjust} alt="adjust" />
          </Stack>
        </Tooltip>
      </Stack>
      {openAdjustTab && (
        <Stack gap={2} p={1}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography fontSize={14} whiteSpace="nowrap" width={90}>
              Pen Color
            </Typography>
            {PALETTE_COLORS.map((palette) => (
              <Stack
                borderRadius="50%"
                width={"18px"}
                height={"18px"}
                alignItems="center"
                justifyContent="center"
                bgcolor={palette}
                flexShrink={0}
                style={{
                  cursor: isDisable ? "not-allowed" : "pointer",
                  opacity: isDisable ? 0.5 : 1,
                }}
                onClick={() => onPickColor(palette)}
              >
                {current.action === "draw" && current.color === palette && (
                  <img
                    src={
                      ["yellow", "violet", "orange"].includes(palette)
                        ? IconCheckedBlack
                        : IconChecked
                    }
                    alt=""
                  />
                )}
              </Stack>
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography fontSize={14} whiteSpace="nowrap" width={90}>
              Pen Width
            </Typography>
            <input
              type="range"
              min={1}
              max={20}
              defaultValue={2}
              value={current.penWidth}
              onChange={(event) =>
                onPenWidthChange && onPenWidthChange(Number(event.target.value))
              }
              style={{ flexGrow: 1 }}
            />
            <input
              type="number"
              min={1}
              max={20}
              defaultValue={2}
              value={current.penWidth}
              onChange={(event) =>
                onPenWidthChange && onPenWidthChange(Number(event.target.value))
              }
              style={{
                padding: "4px 12px",
                width: "60px",
                outline: "none !important",
              }}
            ></input>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography fontSize={14} whiteSpace="nowrap" width={90}>
              Eraser Width
            </Typography>
            <input
              type="range"
              min={1}
              max={20}
              defaultValue={2}
              value={current.eraserWidth}
              onChange={(event) =>
                onEraserWidthChange &&
                onEraserWidthChange(Number(event.target.value))
              }
              style={{ flexGrow: 1 }}
            />
            <input
              type="number"
              min={1}
              max={20}
              defaultValue={2}
              value={current.eraserWidth}
              onChange={(event) =>
                onEraserWidthChange &&
                onEraserWidthChange(Number(event.target.value))
              }
              style={{
                padding: "4px 12px",
                width: "60px",
                outline: "none !important",
              }}
            ></input>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default CanvasPalette;
