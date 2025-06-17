import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#E6E6FA", "#D8BFD8", "#DA70D6", "#BA55D3", "#9370DB"];

const TaskStatusDonutChart = ({ tasksGantt }) => {
    if (!tasksGantt || tasksGantt.length === 0) {
        return <p>No tasks available for visualization.</p>;
    }

    const statusCount = tasksGantt.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {});

    const formatStatus = (status) => {
        return status
            .replace(/_/g, ' ')
            .replace(/\bsend\b/gi, 'sent')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const chartData = Object.entries(statusCount).map(([status, count]) => ({
        name: formatStatus(status),
        value: count,
    }));

    return (
        <div className="w-full h-96">
            <ResponsiveContainer key={Math.random(1, 2)}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TaskStatusDonutChart;
