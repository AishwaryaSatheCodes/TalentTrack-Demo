import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useInView } from "react-intersection-observer";

const COLORS = ["#9333ea", "#a855f7", "#c084fc", "#d8b4fe"];

function TaskAnalytics({
  totalTasks,
  tasksCompleted,
  tasksPending,
  tasksInProgress,
  tasksSentForApproval,
  avgCompletionTime,
}) {
  const pieData = [
    { name: "Completed", value: tasksCompleted ?? 0 },
    { name: "Pending", value: tasksPending ?? 0 },
    { name: "Sent for Approval", value: tasksSentForApproval ?? 0 },
    { name: "In Progress", value: tasksInProgress ?? 0 },
  ];

  const { ref, inView } = useInView({ threshold: 0.4 });
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (inView) {
      // Trigger chart redraw
      setShowChart(false);
      setTimeout(() => setShowChart(true), 50); // short delay forces remount
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="mt-0 backdrop-blur-md bg-white/2 border border-gray-300 shadow-inner shadow-violet-500/20 rounded-2xl text-white mx-autow-[600px] h-[500px]"
    >
      {showChart && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
              label
              isAnimationActive={true} // animate!
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "8px",
                color: "#1f2937",
              }}
              itemStyle={{ color: "#1f2937" }}
              labelStyle={{ color: "#6b7280" }}
            />
            <Legend
              wrapperStyle={{
                color: "#e5e7eb",
                fontSize: "0.9rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm sm:text-base">
          <strong className="text-violet-300">Total Tasks Assigned:</strong>{" "}
          {totalTasks ?? 0}
        </p>
        <p className="text-sm sm:text-base">
          <strong className="text-violet-300">Average Completion Time:</strong>{" "}
          {(avgCompletionTime ?? 0).toFixed(2)} hours
        </p>
      </div>
    </div>
  );
}

export default TaskAnalytics;
