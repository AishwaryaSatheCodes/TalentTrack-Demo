import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const TasksOverTime = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("/task/completed-over-time")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks data:", error);
      });
  }, []);

  return (
    <div className="w-full h-96">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">
        Tasks Completed Over Time
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6366F1"
            strokeWidth={2}
            isAnimationActive={true}
            animationEasing="ease-in-out"
            dot={({ cx, cy, index }) => (
              <circle
                cx={cx}
                cy={cy}
                r={4}
                fill="#6366F1"
                stroke="#fff"
                strokeWidth={1}
                style={{
                  animation: `fadeInUp 0.5s ease ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              />
            )}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksOverTime;
