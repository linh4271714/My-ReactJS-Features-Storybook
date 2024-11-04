import React, { useState } from "react";

import { imageDataToBlob } from "../utils/dataConverter";
import hexToRgba from "hex-to-rgba";

const PEN_TYPE = ["crayon", "marker", "brush"] as const;
export type PenType = (typeof PEN_TYPE)[number];
interface SliceCanvasProps {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

interface UseCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  color?: string;
  penType?: PenType;
  action?: "draw" | "erase";
  initialCanvas?: string | ImageData;
  penWidth?: number;
  eraserWidth?: number;
  initCanvasActionHistory?: CanvasAction[];
  onCanvasActionHistoryChange?: (value: CanvasAction[]) => void;
  initCurrentActionIndex?: number;
  onCurrentActionIndexChange?: (value: number) => void;
}

export type CanvasAction = {
  type: "draw" | "erase";
  imageData: ImageData;
};

export const changeCanvasImage = (
  image: ImageData | string | undefined,
  ref:
    | React.RefObject<HTMLCanvasElement>
    | React.ForwardedRef<HTMLCanvasElement>
    | any
) => {
  if (!ref) {
    return;
  }

  const canvas = ref.current;
  const context = getCanvasContext(ref);
  if (!context || !canvas) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!image) {
    return;
  }
  if (typeof image === "string") {
    const img = new Image();
    img.onload = function () {
      context.drawImage(img, 0, 0);
    };
    img.src = image;
  } else {
    context.putImageData(image, 0, 0);
  }
};

export const getCanvasContext = (
  canvasRef:
    | React.RefObject<HTMLCanvasElement>
    | React.ForwardedRef<HTMLCanvasElement>
): CanvasRenderingContext2D | null => {
  if (canvasRef && typeof canvasRef === "object" && canvasRef.current) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }
    return canvas.getContext("2d");
  }
  return null;
};

export const PALETTE_COLORS_HEX: any = {
  red: "#ff0000",
  orange: "#ffa500",
  yellow: "#ffff00",
  green: "#008000",
  blue: "#0000ff",
  indigo: "#4b0082",
  violet: "#ee82ee",
  black: "#000000",
};

let lastX: number | null = null;
let lastY: number | null = null;

const drawCrayonLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  penWidth: number,
  context: CanvasRenderingContext2D
) => {
  context.strokeStyle = color;
  context.lineWidth = penWidth;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();

  // Chalk Effect
  const length = Math.round(
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) / (5 / penWidth)
  );

  const xUnit = (x2 - x1) / length;
  const yUnit = (y2 - y1) / length;
  for (let i = 0; i < length; i++) {
    const xCurrent = x1 + i * xUnit;
    const yCurrent = y1 + i * yUnit;
    const xRandom = xCurrent + (Math.random() - 0.5) * penWidth * 1.2;
    const yRandom = yCurrent + (Math.random() - 0.5) * penWidth * 1.2;
    context.clearRect(
      xRandom,
      yRandom,
      Math.random() * 2 + 2,
      Math.random() + 1
    );
  }
};

const drawBrushLine = (
  color: string,
  penWidth: number,
  context: CanvasRenderingContext2D
) => {
  console.log(color, hexToRgba(color, "0.05"));

  context.strokeStyle = hexToRgba(PALETTE_COLORS_HEX[color], "0.05");
  context.lineWidth = penWidth + 10;
  context.lineJoin = "round";
  context.lineCap = "round";
};

const drawMarkerLine = (
  color: string,
  penWidth: number,
  context: CanvasRenderingContext2D
) => {
  context.strokeStyle = color;
  context.lineWidth = penWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
};

const useCanvas = ({
  initialCanvas,
  color = "black",
  action = "draw",
  penType = "marker",
  penWidth = 5,
  eraserWidth = 10,
  initCanvasActionHistory,
  onCanvasActionHistoryChange,
  initCurrentActionIndex,
  onCurrentActionIndexChange,
}: UseCanvasProps = {}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [canvasActionHistory, setCanvasActionHistory] = useState<
    CanvasAction[]
  >([]);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(-1);
  const [isDrawing, setIsDrawing] = React.useState(true);
  const [updateInit, setUpdateInit] = useState(false);

  /**
   *
   */

  const handleStylePen = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    penWidth: number,
    context: CanvasRenderingContext2D,
    penType?: PenType
  ) => {
    switch (penType) {
      case "crayon":
        return drawCrayonLine(x1, y1, x2, y2, color, penWidth, context);

      case "marker":
        return drawMarkerLine(color, penWidth, context);

      case "brush":
        return drawBrushLine(color, penWidth, context);

      default:
        return drawMarkerLine(color, penWidth, context);
    }
  };

  /**
   *
   */
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = getCanvasContext(canvasRef);
    if (!context || !canvas) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasActionHistory([]);
    setCurrentActionIndex(-1);
  };

  /**
   *
   */
  const getCanvasImageData = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext(canvasRef);
    if (!canvas || !ctx) return;
    return ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  };

  /**
   *
   */
  const getCanvasDataUrl = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return canvas.toDataURL();
  };

  /**
   *
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = getCanvasContext(canvasRef);
    if (!context || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);

    lastX = x;
    lastY = y;

    const draw = (mouseEvent: MouseEvent) => {
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      if (lastX !== null && lastY !== null) {
        handleStylePen(lastX, lastY, x, y, color, penWidth, context, penType);

        // Update previous position
      }
      lastX = x;
      lastY = y;
      context.lineTo(x, y);
      context.stroke();
    };

    const erase = (mouseEvent: MouseEvent) => {
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      context.clearRect(
        x - penWidth / 2 - 2,
        y - penWidth / 2 - 2,
        eraserWidth + 2,
        eraserWidth + 2
      );
    };

    const stopAction = () => {
      lastX = null;
      lastY = null;
      const currentCanvasActionHistory = [...canvasActionHistory].slice(
        0,
        Number(currentActionIndex) + 1
      );
      const currentImageData = getCanvasImageData();
      if (currentImageData) {
        currentCanvasActionHistory.push({
          type: action,
          imageData: currentImageData,
        });
      }
      setCanvasActionHistory(currentCanvasActionHistory);
      setCurrentActionIndex((old: number) => old + 1);
      window.removeEventListener("mousemove", action === "draw" ? draw : erase);
      window.removeEventListener("mouseup", stopAction);
      setIsDrawing(false);
    };

    window.addEventListener("mousemove", action === "draw" ? draw : erase, {
      passive: false,
    });
    window.addEventListener("mouseup", stopAction, { passive: false });
  };

  /**
   *
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = getCanvasContext(canvasRef);
    if (!context || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);

    lastX = x;
    lastY = y;

    const draw = (touchEvent: TouchEvent) => {
      const x = touchEvent.touches[0].clientX - rect.left;
      const y = touchEvent.touches[0].clientY - rect.top;
      if (lastX !== null && lastY !== null) {
        context.beginPath();
        handleStylePen(lastX, lastY, x, y, color, penWidth, context, penType);
        const midX = (lastX + x) / 2;
        const midY = (lastY + y) / 2;
        context.moveTo(lastX, lastY);
        context.quadraticCurveTo(lastX, lastY, midX, midY);
      }
      lastX = x;
      lastY = y;
      context.lineTo(x, y);
      context.stroke();
    };

    const erase = (touchEvent: TouchEvent) => {
      const x = touchEvent.touches[0].clientX - rect.left;
      const y = touchEvent.touches[0].clientY - rect.top;
      context.clearRect(
        x - penWidth / 2 - 2,
        y - penWidth / 2 - 2,
        eraserWidth + 2,
        eraserWidth + 2
      );
    };

    const stopAction = () => {
      lastX = null;
      lastY = null;
      const currentCanvasActionHistory = [...canvasActionHistory].slice(
        0,
        Number(currentActionIndex) + 1
      );
      const currentImageData = getCanvasImageData();
      if (currentImageData) {
        currentCanvasActionHistory.push({
          type: action,
          imageData: currentImageData,
        });
      }
      setCanvasActionHistory(currentCanvasActionHistory);
      setCurrentActionIndex((old: number) => old + 1);
      window.removeEventListener("touchmove", action === "draw" ? draw : erase);
      window.removeEventListener("touchend", stopAction);
      setIsDrawing(false);
    };

    window.addEventListener("touchmove", action === "draw" ? draw : erase, {
      passive: false,
    });
    window.addEventListener("touchend", stopAction, { passive: false });
  };

  /**
   *
   */
  const sliceCanvas = async ({ sx, sy, sw, sh }: SliceCanvasProps) => {
    const canvas = canvasRef.current;
    const context = getCanvasContext(canvasRef);
    if (!context || !canvas) {
      return;
    }

    const imageData = context.getImageData(sx, sy, sw, sh);
    const blob = await imageDataToBlob(imageData);
    return blob;
  };

  /**
   *
   */
  const clearCanvas = ({ sx, sy, sw, sh }: SliceCanvasProps) => {
    const canvas = canvasRef.current;
    const context = getCanvasContext(canvasRef);
    if (!context || !canvas) {
      return;
    }
    context.clearRect(sx, sy, sw, sh);
  };

  /**
   *
   */
  const retryCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext(canvasRef);
    if (!canvas || !ctx) return;
    const actionToUndo: CanvasAction = canvasActionHistory[0];
    ctx.putImageData(actionToUndo.imageData, 0, 0);
    setCurrentActionIndex(0);
  };

  /**
   *
   */
  const fillCanvas = (data: ImageData | string) => {
    const canvas = canvasRef.current;
    const context = getCanvasContext(canvasRef);
    if (!context || !canvas) {
      return;
    }
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (typeof data === "string") {
      const img = new Image();
      img.src = data;
      img.onload = function () {
        context.drawImage(img, 0, 0);
      };
    } else {
      context.putImageData(data, 0, 0);
    }
  };

  /**
   *
   */
  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext(canvasRef);
    if (!canvas || !ctx) return;
    if (currentActionIndex > 0) {
      const actionToUndo: CanvasAction =
        canvasActionHistory[currentActionIndex - 1];
      ctx.putImageData(actionToUndo.imageData, 0, 0);
    } else if (currentActionIndex === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setCurrentActionIndex((old: number) => old - 1);
  };

  /**
   *
   */
  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext(canvasRef);
    const actionToRedo: CanvasAction =
      canvasActionHistory[Number(currentActionIndex) + 1];
    if (!canvas || !ctx || !actionToRedo) return;

    ctx.putImageData(actionToRedo.imageData, 0, 0);
    setCurrentActionIndex((old: number) => old + 1);
  };

  /**
   *
   */
  const isCanvasCleared = (): boolean => {
    const context = getCanvasContext(canvasRef);
    if (!context || !canvasRef.current) return true;

    if (canvasRef.current.width === 0 || canvasRef.current.height === 0) {
      return false;
    }

    const imageData = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const pixels = imageData.data;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] !== 0) {
        return false;
      }
    }

    return true;
  };

  //
  //
  //

  React.useEffect(() => {
    changeCanvasImage(initialCanvas, canvasRef);
  }, [initialCanvas]);

  React.useEffect(() => {
    onCanvasActionHistoryChange &&
      onCanvasActionHistoryChange(canvasActionHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasActionHistory]);

  React.useEffect(() => {
    onCurrentActionIndexChange &&
      onCurrentActionIndexChange(currentActionIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActionIndex]);

  React.useEffect(() => {
    if (
      !updateInit &&
      initCanvasActionHistory !== undefined &&
      initCanvasActionHistory.length > 0 &&
      initCurrentActionIndex !== undefined &&
      initCurrentActionIndex !== -1
    ) {
      setCanvasActionHistory(initCanvasActionHistory);
      setCurrentActionIndex(initCurrentActionIndex);
      setUpdateInit(true);
    }
  }, [updateInit, initCanvasActionHistory, initCurrentActionIndex]);

  //
  //
  //

  const canvasImage = canvasRef.current?.toDataURL();
  const isUndoAble = canvasActionHistory.length > 0 && currentActionIndex >= 0;
  const isRedoAble =
    canvasActionHistory.length > 0 &&
    currentActionIndex < canvasActionHistory.length - 1;

  //
  //
  //

  return {
    handleMouseDown,
    handleTouchStart,
    ref: canvasRef,
    resetCanvas,
    sliceCanvas,
    clearCanvas,
    retryCanvas,
    isDrawing,
    canvasImage,
    getCanvasImageData,
    getCanvasDataUrl,
    isUndoAble,
    isRedoAble,
    undo,
    redo,
    canvasActionHistory,
    fillCanvas,
    isCanvasCleared,
  };
};

export default useCanvas;
