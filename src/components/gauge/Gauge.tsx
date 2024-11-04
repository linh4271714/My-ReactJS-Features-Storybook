import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface IProps {
  targetValue?: number;
  fillColor?: string;
  fillShadowColor?: string;
  outlineColor?: string;
}

const Gauge = ({
  targetValue = 75,
  fillColor = "#F7931E",
  fillShadowColor = "#DF9900",
  outlineColor,
}: IProps) => {
  const [value, setValue] = useState(0);
  const [currentMarkCoor, setCurrentMarkCoor] = useState<any>({});

  const shadowProps = useMemo(() => {
    return value <= 40
      ? {
          x: "0.54041",
          y: "0.32166",
          width: "152.763",
          height: "301.205",
          filterUnits: "userSpaceOnUse",
        }
      : {};
  }, [value]);

  useEffect(() => {
    setTimeout(() => {
      if (value < targetValue) {
        setValue(value + 0.25);
      }
      if (value > targetValue) {
        setValue(value - 0.25);
      }
    }, 10);
  }, [value, targetValue]);

  useEffect(() => {
    function detectAndDrawGauge() {
      const svg = document.querySelector(".gauge");
      const outline = document.querySelector(".outline");
      const outlineBorder = document.querySelector(".outline-border");
      const fill = document.querySelector(".fill");
      const fillShadow = document.querySelector(".fill-shadow");
      const needle = document.querySelector(".needle");
      const needleShadow = document.querySelector(".needle-shadow");

      if (!svg) return;

      const rad = Math.PI / 180;
      const W = parseInt(
        window.getComputedStyle(svg, null).getPropertyValue("width")
      );
      const pad = 15;
      const r = (W - 2 * pad) / 2;
      const gaugeWidth = window.innerWidth <= 480 ? 9 : 18;
      const borderWidth = 2;
      const r2 = r - gaugeWidth;
      const rBorder = r - borderWidth;
      const needleHeight = window.innerWidth <= 480 ? 20 : 40;
      const needleAngle = 3.5;

      const ZeroMark = {
        out: `${r + pad - r * Math.sin(45 * rad)},${
          r + pad + r * Math.sin(45 * rad)
        }`,
        in: `${r + pad - r2 * Math.sin(45 * rad)},${
          r + pad + r2 * Math.sin(45 * rad)
        }`,
        border: `${r + pad - rBorder * Math.sin(45 * rad)},${
          r + pad + rBorder * Math.sin(45 * rad)
        }`,
      };

      const FullMark = {
        out: `${r + pad + r * Math.sin(45 * rad)},${
          r + pad + r * Math.sin(45 * rad)
        }`,
        in: `${r + pad + r2 * Math.sin(45 * rad)},${
          r + pad + r2 * Math.sin(45 * rad)
        }`,
        border: `${r + pad + rBorder * Math.sin(45 * rad)},${
          r + pad + rBorder * Math.sin(45 * rad)
        }`,
      };

      const getCurrentValueMarkD = () => {
        const currentDegree = value * 2.7;
        let x1, y1, x2, y2, nx1, ny1, nx2, ny2, nx3, ny3;

        if (currentDegree <= 45) {
          const currentRad = (45 - currentDegree) * rad;
          const n2Rad = (45 + needleAngle - currentDegree) * rad;
          const n3Rad = (45 - needleAngle - currentDegree) * rad;

          x1 = r + pad - r * Math.cos(currentRad);
          y1 = r + pad + r * Math.sin(currentRad);
          x2 = r + pad - r2 * Math.cos(currentRad);
          y2 = r + pad + r2 * Math.sin(currentRad);

          nx1 = r + pad - (r - needleHeight) * Math.cos(currentRad);
          ny1 = r + pad + (r - needleHeight) * Math.sin(currentRad);
          nx2 = r + pad - r * Math.cos(n2Rad);
          ny2 = r + pad + r * Math.sin(n2Rad);
          nx3 = r + pad - r * Math.cos(n3Rad);
          ny3 = r + pad + r * Math.sin(n3Rad);
        } else if (currentDegree > 45 && currentDegree <= 135) {
          const currentRad = (currentDegree - 45) * rad;
          const n2Rad = (currentDegree - 45 + needleAngle) * rad;
          const n3Rad = (currentDegree - 45 - needleAngle) * rad;

          x1 = r + pad - r * Math.cos(currentRad);
          y1 = r + pad - r * Math.sin(currentRad);
          x2 = r + pad - r2 * Math.cos(currentRad);
          y2 = r + pad - r2 * Math.sin(currentRad);

          nx1 = r + pad - (r - needleHeight) * Math.cos(currentRad);
          ny1 = r + pad - (r - needleHeight) * Math.sin(currentRad);
          nx2 = r + pad - r * Math.cos(n2Rad);
          ny2 = r + pad - r * Math.sin(n2Rad);
          nx3 = r + pad - r * Math.cos(n3Rad);
          ny3 = r + pad - r * Math.sin(n3Rad);
        } else if (currentDegree > 135 && currentDegree <= 225) {
          const currentRad = (225 - currentDegree) * rad;
          const n2Rad = (225 - currentDegree + needleAngle) * rad;
          const n3Rad = (225 - currentDegree - needleAngle) * rad;

          x1 = r + pad + r * Math.cos(currentRad);
          y1 = r + pad - r * Math.sin(currentRad);
          x2 = r + pad + r2 * Math.cos(currentRad);
          y2 = r + pad - r2 * Math.sin(currentRad);

          nx1 = r + pad + (r - needleHeight) * Math.cos(currentRad);
          ny1 = r + pad - (r - needleHeight) * Math.sin(currentRad);
          nx2 = r + pad + r * Math.cos(n2Rad);
          ny2 = r + pad - r * Math.sin(n2Rad);
          nx3 = r + pad + r * Math.cos(n3Rad);
          ny3 = r + pad - r * Math.sin(n3Rad);
        } else {
          const currentRad = (currentDegree - 225) * rad;
          const n2Rad = (currentDegree - 225 + needleAngle) * rad;
          const n3Rad = (currentDegree - 225 - needleAngle) * rad;

          x1 = r + pad + r * Math.cos(currentRad);
          y1 = r + pad + r * Math.sin(currentRad);
          x2 = r + pad + r2 * Math.cos(currentRad);
          y2 = r + pad + r2 * Math.sin(currentRad);

          nx1 = r + pad + (r - needleHeight) * Math.cos(currentRad);
          ny1 = r + pad + (r - needleHeight) * Math.sin(currentRad);
          nx2 = r + pad + r * Math.cos(n2Rad);
          ny2 = r + pad + r * Math.sin(n2Rad);
          nx3 = r + pad + r * Math.cos(n3Rad);
          ny3 = r + pad + r * Math.sin(n3Rad);
        }

        setCurrentMarkCoor({ x1, x2, y1, y2 });

        return {
          fillD:
            `M ${x1},${y1}  ` +
            `A ${r},${r} 0 ${currentDegree <= 180 ? 0 : 1},0 ${
              ZeroMark.out
            }  ` +
            `L ${ZeroMark.in}  ` +
            `A ${r - gaugeWidth},${r - gaugeWidth} 0 ${
              currentDegree <= 180 ? 0 : 1
            },1 ${x2},${y2}  ` +
            "z",
          needleP: `${nx1},${ny1} ${nx2},${ny2} ${nx3},${ny3}`,
        };
      };

      function getOutlineD() {
        const d =
          `M ${FullMark.out}  ` +
          `A ${r},${r} 0 1,0 ${ZeroMark.out}  ` +
          `L ${ZeroMark.in}  ` +
          `A ${r - gaugeWidth},${r - gaugeWidth} 0 1,1 ${FullMark.in}  ` +
          "z";
        return d;
      }

      function getOutlineBorderD() {
        const borderWidth = 2;
        const d =
          `M ${FullMark.out}  ` +
          `A ${r},${r} 0 1,0 ${ZeroMark.out}  ` +
          `L ${ZeroMark.border}  ` +
          `A ${r - borderWidth},${r - borderWidth} 0 1,1 ${FullMark.border}  ` +
          "z";
        return d;
      }

      function drawGauge() {
        const outlineD = getOutlineD();
        const outlineBorderD = getOutlineBorderD();
        const { fillD, needleP } = getCurrentValueMarkD();

        outline?.setAttribute("d", outlineD);
        outlineBorder?.setAttribute("d", outlineBorderD);
        fill?.setAttribute("d", fillD);
        fillShadow?.setAttribute("d", fillD);
        needle?.setAttribute("points", needleP);
        needleShadow?.setAttribute("points", needleP);
      }

      drawGauge();
    }
    detectAndDrawGauge();
    window.addEventListener("resize", detectAndDrawGauge);
    return () => window.removeEventListener("resize", detectAndDrawGauge);
  }, [value]);

  return (
    <Box position="relative" width="full" pt="100%" gap={0}>
      <svg
        className="gauge"
        height="full"
        width="full"
        overflow="visible"
        style={{
          position: "absolute",
          zIndex: 10,
          top: 0,
          left: 0,
        }}
      >
        <path
          className="outline"
          d=""
          fill={outlineColor || "url(#out-line)"}
          style={{ outline: "none" }}
        />
        <path className="outline-border" fill={fillColor} fillOpacity="0.4" />
        <g filter="url(#shadows)">
          <path
            className="fill-shadow"
            fill={fillShadowColor || "url(#fill-shadow)"}
          />
          <polygon className="needle-shadow" fill={fillColor} />
        </g>
        <path className="fill" d="" fill={fillColor || "url(#fill)"} />
        <polygon className="needle" fill={fillColor} />

        <defs>
          <filter
            id="shadows"
            {...shadowProps}
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="7.10382"
              result="effect1_foregroundBlur_7258_118998"
            />
          </filter>
          <linearGradient
            id="out-line"
            x1="10.501"
            y1="184"
            x2="294.001"
            y2="289"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#343235" />
            <stop offset="0.703102" stopColor="#343235" />
            <stop offset="1" stopColor="#272628" />
          </linearGradient>
          <linearGradient
            id="fill-shadow"
            x1={currentMarkCoor.x1}
            y1={currentMarkCoor.y1}
            x2="67.139"
            y2="287.609"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={fillColor} />
            <stop offset="1" stopColor={fillColor} stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="fill"
            x1={currentMarkCoor.x1}
            y1={currentMarkCoor.y1}
            x2="67.1388"
            y2="287.609"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={fillColor} />
            <stop offset="1" stopColor={fillColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
};

export default Gauge;
