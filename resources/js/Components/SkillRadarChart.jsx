import React, { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const SkillRadarChart = ({ skillRadar }) => {
  const {
    labels,
    userSkills,
    taskSkills,
    totalSkillNames,
    userSkillsAgainstTotal,
  } = skillRadar;

  const [showOnlyUserSkills, setShowOnlyUserSkills] = useState(false);

  // When toggle is ON, show fullData (user skills vs total skill list)
  const fullData = totalSkillNames.map((skill, index) => ({
    skill,
    User: userSkillsAgainstTotal[index],
  }));

  // When toggle is OFF, show comparisonData (user vs task for common skill subset)
  const mergedData = totalSkillNames.map((skill, index) => {
    const userIndex = labels.indexOf(skill);
    const taskIndex = labels.indexOf(skill);

    return {
      skill,
      User: userIndex !== -1 ? userSkills[userIndex] : 0,
      Tasks: taskIndex !== -1 ? taskSkills[taskIndex] : 0,
    };
  });

  const chartData = showOnlyUserSkills ? fullData : mergedData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-0 backdrop-blur-md bg-white/2 border border-gray-300 shadow-inner shadow-violet-500/20 rounded-2xl text-white w-[600px] h-[500px] mx-auto"
    >
      <ResponsiveContainer width="100%" height="85%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="65%"
          data={chartData}
          key={showOnlyUserSkills ? "user-only" : "user-vs-task"}
        >
          <PolarGrid />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#e5e7eb", fontSize: 10 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} />
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
              fontSize: "0.75rem",
            }}
          />

          {/* Radars */}
          <Radar
            name="User"
            dataKey="User"
            stroke="#cc9efe"
            fill="#cc9efe"
            fillOpacity={0.9}
          />
          {!showOnlyUserSkills && (
            <Radar
              name="Task Requirements"
              dataKey="Tasks"
              stroke="#c084fc"
              fill="#c084fc"
              fillOpacity={0.2}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
      {/* Toggle Button */}
      <div className="flex justify-end pr-4 mt-2">
        <label className="flex items-center space-x-2 cursor-pointer text-violet-200 text-sm">
          <input
            type="checkbox"
            checked={showOnlyUserSkills}
            onChange={() => setShowOnlyUserSkills((prev) => !prev)}
          />
          <span>Show Against All Skills</span>
        </label>
      </div>
    </motion.div>
  );
};

export default SkillRadarChart;
