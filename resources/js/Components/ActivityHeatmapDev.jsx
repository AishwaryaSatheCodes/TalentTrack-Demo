import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { motion } from "framer-motion";

function aggregateDates(dateStrings) {
  const counts = {};
  dateStrings.forEach((dateTimeStr) => {
    const date = dateTimeStr.split(" ")[0];
    counts[date] = (counts[date] || 0) + 1;
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

const today = new Date();
const dayOfWeek = today.getDay();
const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - diffToMonday);

function ActivityHeatmapDev({ data }) {
  const aggregatedData = aggregateDates(data);

  return (
    <>
      <style>{`
        .color-violet-300 {
          fill: #c4b5fd !important;
        }
        .color-violet-400 {
          fill: #a78bfa !important;
        }
        .color-violet-500 {
          fill: #8b5cf6 !important;
        }
        .color-empty {
          fill: rgba(255, 255, 255, 0) !important;
          stroke: rgba(255, 255, 255, 0.18) !important;
          stroke-width: 0.4;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-fit mt-10 backdrop-blur-md bg-white/5 border border-gray-300 shadow-inner shadow-violet-500/20 rounded-2xl px-4 py-2 text-white"
      >
        <div className="w-[400px] h-[100px] overflow-x-auto">
          <CalendarHeatmap
            startDate={startOfWeek}
            endDate={today}
            numDays={7}
            values={aggregatedData}
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              if (value.count >= 5) return "color-violet-500";
              if (value.count >= 3) return "color-violet-400";
              if (value.count >= 1) return "color-violet-300";
              return "color-empty";
            }}
            transformDayElement={(rect, value) => {
              if (!value || value.count === 0) {
                return React.cloneElement(rect, {
                  fill: "transparent",
                  stroke: "none",
                  key: value?.date || Math.random(),
                });
              }
              return React.cloneElement(rect, {
                key: value?.date || Math.random(),
              });
            }}
            tooltipDataAttrs={(value) => {
              const isEmpty = !value || !value.date || value.count == null;
              return {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": isEmpty
                  ? "No activity"
                  : `${value.date}: ${value.count} activities`,
              };
            }}
          />
          <ReactTooltip
            id="heatmap-tooltip"
            className="z-50 !text-sm !rounded !bg-gray-800 !text-white"
          />
        </div>
      </motion.div>
    </>
  );
}

export default ActivityHeatmapDev;
