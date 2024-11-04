import { Stack } from "@mui/material";
import useCanvas from "../../hooks/useCanvas";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  CanvasPalette,
  PaletteAction,
  PaletteColor,
  PalettePenType,
} from "../canvas";
import CursorEraserBlackImage from "./assets/cursor/eraser_black.svg";
import CursorBlackImage from "./assets/cursor/pen_black.svg";
import CursorBlueImage from "./assets/cursor/pen_blue.svg";
import CursorGreenImage from "./assets/cursor/pen_green.svg";
import CursorRedImage from "./assets/cursor/pen_red.svg";
import CursorOrangeImage from "./assets/cursor/pen_orange.svg";
import CursorYellowImage from "./assets/cursor/pen_yellow.svg";
import CursorVioletImage from "./assets/cursor/pen_violet.svg";
import CursorIndigoImage from "./assets/cursor/pen_indigo.svg";

const colorPenImagesMap = {
  red: CursorRedImage,
  orange: CursorOrangeImage,
  yellow: CursorYellowImage,
  green: CursorGreenImage,
  blue: CursorBlueImage,
  indigo: CursorIndigoImage,
  violet: CursorVioletImage,
  black: CursorBlackImage,
};

const DrawingBoard = () => {
  const defaultValues = {
    penType: "marker" as PalettePenType,
    color: "black" as PaletteColor,
    action: "draw" as PaletteAction,
    penWidth: 2,
    eraserWidth: 4,
  };

  const { watch, setValue } = useForm<typeof defaultValues>({
    defaultValues,
  });

  const [canvasContainerSize, setCanvasContainerSize] = useState<{
    width: number;
    height: number;
  }>();

  const currentPaletteValue = watch();

  const {
    ref: drawRef,
    handleMouseDown,
    handleTouchStart,
    sliceCanvas,
    isDrawing,
    clearCanvas,
    resetCanvas,
    getCanvasDataUrl,
    undo,
    redo,
    isUndoAble,
    isRedoAble,
    fillCanvas,
  } = useCanvas({
    color: currentPaletteValue.color,
    action: currentPaletteValue.action,
    penType: currentPaletteValue.penType,
    penWidth: currentPaletteValue.penWidth,
    eraserWidth: currentPaletteValue.eraserWidth,
  });

  const onPickColor = (color: PaletteColor) => {
    setValue("action", "draw");
    setValue("color", color);
  };

  const onPickPenType = (type: PalettePenType) => {
    setValue("action", "draw");
    setValue("penType", type);
  };

  const onPickEraser = () => {
    setValue("action", "erase");
  };

  useEffect(() => {
    const detectAreas = () => {
      const DrawArea = document.getElementById("pen-mode-area");
      const DrawAreaSize = DrawArea?.getBoundingClientRect();

      if (DrawAreaSize) {
        setCanvasContainerSize({
          height: DrawAreaSize.height,
          width: DrawAreaSize.width,
        });
      }
    };
    detectAreas();
    window.addEventListener("resize", detectAreas);
    return () => {
      window.removeEventListener("resize", detectAreas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="column-reverse" gap="1rem">
      <CanvasPalette
        onReset={resetCanvas}
        onRedo={redo}
        onUndo={undo}
        isUndoAble={isUndoAble}
        isRedoAble={isRedoAble}
        onPickColor={onPickColor}
        onPickEraser={onPickEraser}
        onPickPenType={onPickPenType}
        current={watch()}
        onPenWidthChange={(value: number) => setValue("penWidth", value)}
        onEraserWidthChange={(value: number) => setValue("eraserWidth", value)}
      />
      <Stack
        direction="row"
        borderRadius="1rem"
        border={`1px solid red`}
        id="pen-mode-area"
      >
        <canvas
          ref={drawRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          width={canvasContainerSize ? canvasContainerSize.width : 500}
          height={canvasContainerSize ? canvasContainerSize.height : 500}
          style={{
            zIndex: 10,
            cursor: `url(${
              currentPaletteValue.action === "erase"
                ? CursorEraserBlackImage
                : colorPenImagesMap[watch().color]
            }) 0 16, pointer`,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default DrawingBoard;
