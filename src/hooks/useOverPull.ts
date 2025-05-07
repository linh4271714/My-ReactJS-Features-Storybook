import { useEffect } from "react";

interface IProps {
  pullDownCallback?: () => void;
  pullUpCallback?: () => void;
}

const useOverPull = ({ pullDownCallback, pullUpCallback }: IProps) => {
  useEffect(() => {
    var pStart = { x: 0, y: 0 };
    var pStop = { x: 0, y: 0 };

    const swipeStart = (e: TouchEvent | any) => {
      if (typeof e["targetTouches"] !== "undefined") {
        var touch = e.targetTouches[0];
        pStart.x = touch.screenX;
        pStart.y = touch.screenY;
      } else {
        pStart.x = e.screenX;
        pStart.y = e.screenY;
      }
    };

    const swipeEnd = (e: TouchEvent | any) => {
      if (typeof e["changedTouches"] !== "undefined") {
        var touch = e.changedTouches[0];
        pStop.x = touch.screenX;
        pStop.y = touch.screenY;
      } else {
        pStop.x = e.screenX;
        pStop.y = e.screenY;
      }

      swipeCheck();
    };

    function swipeCheck() {
      var changeY = pStart.y - pStop.y;
      var changeX = pStart.x - pStop.x;
      if (isPullOverDown(changeY, changeX) && pullDownCallback) {
        pullDownCallback();
      }
      if (isPullOverUp(changeY, changeX) && pullUpCallback) {
        pullUpCallback();
      }
    }

    const isPullOverDown = (dY: number, dX: number) => {
      return (
        dY < 0 &&
        ((Math.abs(dX) <= 100 && Math.abs(dY) >= 300) ||
          (Math.abs(dX) / Math.abs(dY) <= 0.3 && dY >= 60))
      );
    };

    const isPullOverUp = (dY: number, dX: number) => {
      return (
        dX < 0 &&
        ((Math.abs(dX) <= 100 && Math.abs(dY) >= 300) ||
          (Math.abs(dX) / Math.abs(dY) <= 0.3 && dY >= 60))
      );
    };

    document.addEventListener("touchstart", (e) => swipeStart(e), false);
    document.addEventListener("touchend", (e) => swipeEnd(e), false);
    return () => {
      document.removeEventListener("touchstart", (e) => swipeStart(e), false);
      document.removeEventListener("touchend", (e) => swipeEnd(e), false);
    };
  }, []);
};

export default useOverPull;
