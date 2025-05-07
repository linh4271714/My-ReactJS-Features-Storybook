/* eslint-disable react-hooks/exhaustive-deps */
/* tslint:disable */
import { Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getTotalDaysInMonth,
  monthItemLabels,
  monthItems,
  yearItems,
} from "./constants";
import "./style.css";

const WheelPickerComponent = ({
  containerHeight = 175,
  containerWidth = 297,
  itemHeight = 35,
}: {
  containerHeight: number;
  containerWidth: number;
  itemHeight: number;
}) => {
  const visibleItemsCount = useMemo(
    () => Math.floor(containerHeight / itemHeight),
    [containerHeight, itemHeight]
  );
  const itemOffsetsCount = useMemo(
    () => visibleItemsCount - 1 - ((visibleItemsCount - 1) % 2),
    [visibleItemsCount]
  );
  const maxScrollOffset = useMemo(
    () => (containerHeight - itemHeight) / 2,
    [containerHeight, itemHeight]
  );

  const monthItemsContRef = useRef<HTMLUListElement>(null);
  const dateItemsContRef = useRef<HTMLUListElement>(null);
  const yearItemsContRef = useRef<HTMLUListElement>(null);

  const monthRefs = useRef<HTMLLIElement[]>([]);
  const dateRefs = useRef<HTMLLIElement[]>([]);
  const yearRefs = useRef<HTMLLIElement[]>([]);

  const initValue = moment();

  const [selectedDate, setSelectedDate] = useState<number>(initValue.date());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    initValue.month() + 1 // month + 1 because months in JS start form 0 to 11
  );
  const [selectedYear, setSelectedYear] = useState<number>(initValue.year());

  const dateItems = useMemo(
    () =>
      Array.from(
        {
          length: getTotalDaysInMonth(selectedYear, selectedMonth),
        },
        (_, i) => i + 1
      ),
    [selectedYear, selectedMonth]
  );

  const nearestDateItemIndex = useRef<number>(0);
  const nearestMonthItemIndex = useRef<number>(0);
  const nearestYearItemIndex = useRef<number>(0);

  function renderDateElements(
    selectedElement: number,
    scrollTop: number | undefined,
    firstItemIndex = Math.max(selectedElement - itemOffsetsCount / 2, 0),
    lastItemIndex = Math.min(
      selectedElement + itemOffsetsCount / 2,
      dateItems.length
    )
  ) {
    if (dateRefs.current && scrollTop !== undefined) {
      dateRefs.current
        .slice(firstItemIndex, lastItemIndex + 1)
        .forEach((item: HTMLLIElement, index: number) => {
          const realIndex = index + firstItemIndex;

          // flexible ratio below
          const absScrollOffset = Math.min(
            Math.abs(scrollTop - realIndex * itemHeight) - itemHeight / 2,
            maxScrollOffset
          );
          const sin = absScrollOffset / maxScrollOffset;
          const cos = Math.sqrt(1 - sin ** 2);

          if (!item) return;

          const div = item.getElementsByTagName("div")[0];
          div.style.transform = `rotateX(${Math.asin(sin)}rad) scale(${cos})`;
          div.style.transformOrigin = "center";
        });
    }
  }

  function renderMonthElements(
    selectedElement: number,
    scrollTop: number | undefined,
    firstItemIndex = Math.max(selectedElement - itemOffsetsCount / 2, 0),
    lastItemIndex = Math.min(
      selectedElement + itemOffsetsCount / 2,
      monthItems.length
    )
  ) {
    if (monthRefs.current && scrollTop !== undefined) {
      monthRefs.current
        .slice(firstItemIndex, lastItemIndex + 1)
        .forEach((item: Element, index: number) => {
          const realIndex = index + firstItemIndex;

          // flexible ratio below
          const absScrollOffset = Math.min(
            Math.abs(scrollTop - realIndex * itemHeight) - itemHeight / 2,
            maxScrollOffset
          );
          const sin = absScrollOffset / maxScrollOffset;
          const cos = Math.sqrt(1 - sin ** 2);

          if (!item) return;

          const div = item.getElementsByTagName("div")[0];
          div.style.transform = `rotateX(${Math.asin(sin)}rad) scale(${cos})`;
          div.style.transformOrigin = "right";
        });
    }
  }

  function renderYearElements(
    selectedElement: number,
    scrollTop: number | undefined,
    firstItemIndex = Math.max(selectedElement - itemOffsetsCount / 2, 0),
    lastItemIndex = Math.min(
      selectedElement + itemOffsetsCount / 2,
      yearItems.length
    )
  ) {
    if (yearRefs.current && scrollTop !== undefined) {
      yearRefs.current
        .slice(firstItemIndex, lastItemIndex + 1)
        .forEach((item: Element, index: number) => {
          const realIndex = index + firstItemIndex;
          // flexible ratio below
          const absScrollOffset = Math.min(
            Math.abs(scrollTop - realIndex * itemHeight) - itemHeight / 2,
            maxScrollOffset
          );
          const sin = absScrollOffset / maxScrollOffset;
          const cos = Math.sqrt(1 - sin ** 2);

          if (!item) return;

          const div = item.getElementsByTagName("div")[0];
          div.style.transform = `rotateX(${Math.asin(sin)}rad) scale(${cos})`;
          div.style.transformOrigin = "left";
        });
    }
  }

  // handleMonthScroll
  useEffect(() => {
    let isAnimating = false;

    const handleMonthScroll = (event: Event) => {
      if (!isAnimating) {
        isAnimating = true;

        const scrollTop = Math.max(
          (event.target as HTMLElement)?.scrollTop || 0,
          0
        );
        const selectedElement = Math.min(
          Math.max(Math.floor(scrollTop / itemHeight), 0),
          monthItems.length - 1
        );
        renderMonthElements(selectedElement, scrollTop);

        isAnimating = false;
      }
    };

    const updateSelectedMonth = () => {
      const scrollTop = monthItemsContRef.current?.scrollTop || 0;
      const selectedElement = Math.min(
        Math.max(Math.floor(scrollTop / itemHeight), 0),
        monthItems.length - 1
      );
      setSelectedMonth(monthItems[selectedElement]);
      nearestMonthItemIndex.current = selectedElement;
    };

    monthItemsContRef.current?.addEventListener("scroll", handleMonthScroll);
    monthItemsContRef.current?.addEventListener(
      "scrollend",
      updateSelectedMonth
    );

    return () => {
      monthItemsContRef.current?.removeEventListener(
        "scroll",
        handleMonthScroll
      );
      monthItemsContRef.current?.removeEventListener(
        "scrollend",
        updateSelectedMonth
      );
    };
  }, [monthItemsContRef.current]);

  // handleDateScroll
  useEffect(() => {
    let isAnimating = false;

    const handleDateScroll = (event: Event) => {
      if (!isAnimating) {
        isAnimating = true;

        const scrollTop = Math.max(
          (event.target as HTMLElement)?.scrollTop || 0,
          0
        );
        const selectedElement = Math.min(
          Math.max(Math.floor(scrollTop / itemHeight), 0),
          dateItems.length - 1
        );

        renderDateElements(selectedElement, scrollTop);

        isAnimating = false;
      }
    };

    const updateSelectedDate = () => {
      const scrollTop = dateItemsContRef.current?.scrollTop || 0;
      const selectedElement = Math.min(
        Math.max(Math.floor(scrollTop / itemHeight), 0),
        dateItems.length - 1
      );
      setSelectedDate(dateItems[selectedElement]);
      nearestDateItemIndex.current = selectedElement;
    };

    dateItemsContRef.current?.addEventListener("scroll", handleDateScroll);
    dateItemsContRef.current?.addEventListener("scrollend", updateSelectedDate);

    return () => {
      dateItemsContRef.current?.removeEventListener("scroll", handleDateScroll);
      dateItemsContRef.current?.removeEventListener(
        "scrollend",
        updateSelectedDate
      );
    };
  }, [dateItemsContRef.current, dateItems]);

  // handleYearScroll
  useEffect(() => {
    let isAnimating = false;

    const handleYearScroll = (event: Event) => {
      if (!isAnimating) {
        isAnimating = true;

        const scrollTop = Math.max(
          (event.target as HTMLElement)?.scrollTop || 0,
          0
        );
        const selectedElement = Math.min(
          Math.max(Math.floor(scrollTop / itemHeight), 0),
          yearItems.length - 1
        );
        renderYearElements(selectedElement, scrollTop);
        isAnimating = false;
      }
    };

    const updateSelectedYear = () => {
      const scrollTop = yearItemsContRef.current?.scrollTop || 0;
      const selectedElement = Math.min(
        Math.max(Math.floor(scrollTop / itemHeight), 0),
        yearItems.length - 1
      );
      setSelectedYear(yearItems[selectedElement]);
      nearestYearItemIndex.current = selectedElement;
    };

    yearItemsContRef.current?.addEventListener("scroll", handleYearScroll);
    yearItemsContRef.current?.addEventListener("scrollend", updateSelectedYear);

    return () => {
      yearItemsContRef.current?.removeEventListener("scroll", handleYearScroll);
      yearItemsContRef.current?.removeEventListener(
        "scrollend",
        updateSelectedYear
      );
    };
  }, [yearItemsContRef.current]);

  // check init value and roll into view
  useEffect(() => {
    const initValue = moment();
    const dateIndex = dateItems.indexOf(initValue.date());
    const monthIndex = monthItems.indexOf(initValue.month() + 1);
    const yearIndex = yearItems.indexOf(initValue.year());

    if (dateIndex !== nearestDateItemIndex.current) {
      // save nearest selected date index
      nearestDateItemIndex.current = dateIndex;
      // scrool selected date into center view
      dateRefs.current[dateIndex]?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
    if (monthIndex !== nearestMonthItemIndex.current) {
      // save nearest selected month index
      nearestMonthItemIndex.current = monthIndex;
      // scrool selected month into center view
      monthRefs.current[monthIndex]?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
    if (yearIndex !== nearestYearItemIndex.current) {
      // save nearest selected year index
      nearestYearItemIndex.current = yearIndex;
      // scrool selected year into center view
      yearRefs.current[yearIndex]?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <Stack
      direction="row"
      width={`${containerWidth}px`}
      height={`${containerHeight}px`}
      className="wheel-container"
      justifyContent="space-between"
      paddingX={5}
    >
      <ul
        className="wheel-items"
        style={{
          padding: `calc((${containerHeight}px - ${itemHeight}px) / 2) 0`,
        }}
        ref={monthItemsContRef}
      >
        {monthItemLabels.map((item, index) => (
          <li
            className="wheel-item"
            key={item.value}
            ref={(node) => (monthRefs.current[index] = node as HTMLLIElement)}
            style={{
              width: `${itemHeight * 3}`,
              height: `${itemHeight}px`,
              lineHeight: `${itemHeight}px`,
            }}
          >
            <div style={{ width: `${containerWidth / 3}px` }}>{item.label}</div>
          </li>
        ))}
      </ul>
      <ul
        className="wheel-items"
        style={{
          padding: `calc((${containerHeight}px - ${itemHeight}px) / 2) 0`,
        }}
        ref={dateItemsContRef}
      >
        {dateItems.map((item, index) => (
          <li
            className="wheel-item"
            key={item}
            ref={(node) => (dateRefs.current[index] = node as HTMLLIElement)}
            style={{
              height: `${itemHeight}px`,
              lineHeight: `${itemHeight}px`,
              textAlign: "center",
            }}
          >
            <div style={{ width: `${containerWidth / 3}px` }}>{item}</div>
          </li>
        ))}
      </ul>
      <ul
        className="wheel-items"
        style={{
          padding: `calc((${containerHeight}px - ${itemHeight}px) / 2) 0`,
        }}
        ref={yearItemsContRef}
      >
        {yearItems.map((item, index) => (
          <li
            className="wheel-item"
            key={item}
            ref={(node) => (yearRefs.current[index] = node as HTMLLIElement)}
            style={{
              height: `${itemHeight}px`,
              lineHeight: `${itemHeight}px`,
              textAlign: "right",
            }}
          >
            <div style={{ width: `${containerWidth / 3}px` }}>{item}</div>
          </li>
        ))}
      </ul>
    </Stack>
  );
};

export const WheelPicker = React.memo(WheelPickerComponent);
