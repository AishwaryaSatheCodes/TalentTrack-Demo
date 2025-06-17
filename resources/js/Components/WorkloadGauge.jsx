import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import { useInView } from "react-intersection-observer";

export default function WorkloadGauge({
  userTaskCount,
  averageTaskCount,
  maxTaskCount,
}) {
  const { ref, inView } = useInView({ threshold: 0.4 });
  const [showGauge, setShowGauge] = useState(false);

  useEffect(() => {
    if (inView) {
      setShowGauge(false);
      setTimeout(() => setShowGauge(true), 50);
    }
  }, [inView]);

  const safeAverage = averageTaskCount || 1;
  const gaugeValue = Math.min(userTaskCount / safeAverage, 2);
  const percentage = Math.round((userTaskCount / averageTaskCount) * 100);

  return (
    <div
      ref={ref}
      className="mt-10 backdrop-blur-md bg-white/2 border border-gray-300 shadow-inner shadow-violet-500/20 rounded-2xl p-6 w-full max-w-[320px] mx-auto text-white"
    >
      {showGauge && (
        <GaugeChart
          id="task-workload-gauge"
          nrOfLevels={20}
          colors={["#c084fc", "#8b5cf6", "#6b21a8"]}
          arcWidth={0.3}
          percent={Math.min(gaugeValue / 2, 1)}
          textColor="#ffffff"
          animate={true}
        />
      )}

      <p className="text-center mt-4 text-sm text-gray-200">
        Ongoing Tasks: <span className="font-medium">{userTaskCount}</span>
        <br />
        Team Average:{" "}
        <span className="font-medium">{averageTaskCount.toFixed(1)}</span>
        <br />
        You’re at <span className="font-bold">{percentage}%</span> of the team
        average.
      </p>
    </div>
  );
}
