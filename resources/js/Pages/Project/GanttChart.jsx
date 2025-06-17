import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const task = payload[0].payload;
        const today = new Date();
        const endDate = new Date(task.end);

        const daysLeft = task.status === "completed"
            ? "Completed"
            : Math.max(0, Math.ceil((endDate - today) / (24 * 60 * 60 * 1000)));

        return (
            <div className="p-2 bg-white rounded shadow-md border border-gray-300">
                <p className="text-gray-800"><strong>{task.name}</strong></p>
                <p>Progress: {task.progress}%</p>
                <p>{task.status === "completed" ? "Completed" : `Days Left: ${daysLeft} days`}</p>
            </div>
        );
    }
    return null;
};

// Custom Lavender/Violet Colors
const getStatusColor = (status) => {
    switch (status) {
        case "completed": return "#A084E8"; // Soft Violet
        case "send_for_approval": return "#B799FF"; // Lavender
        case "in_progress": return "#D2B4FC"; // Light Purple
        case "pending": return "#E5D4FF"; // Pale Lavender
        default: return "#E0E0E0"; // Grey for unknown status
    }
};

const GanttChart = ({ tasksGantt }) => {
    if (!tasksGantt || tasksGantt.length === 0) {
        return <p className="text-gray-500">No tasks available for Gantt chart visualization.</p>;
    }

    const chartData = tasksGantt.map((task) => {
        const endDate = new Date(task.end);

        return {
            id: task.id,
            name: task.name,
            progress: task.status === "completed"
                ? 100
                : task.status === "send_for_approval"
                    ? 75
                    : task.status === "in_progress"
                        ? 50
                        : 0,
            end: task.end,
            status: task.status,
        };
    });

    return (
        <div className="w-full h-96">
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    {/* X Axis as Progress in Percentage */}
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        tickFormatter={(tick) => `${tick}%`}
                    />
                    {/* Y Axis Using Task ID */}
                    <YAxis dataKey="id" type="category" />
                    <Tooltip content={<CustomTooltip />} />

                    {/* Status-Based Color Bars */}
                    <Bar
                        dataKey="progress"
                        barSize={20}
                        radius={[10, 10, 10, 10]}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                    >
                        {chartData.map((task, index) => (
                            <Cell key={`cell-${index}`} fill={getStatusColor(task.status)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GanttChart;
