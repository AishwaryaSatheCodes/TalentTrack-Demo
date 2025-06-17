import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LeaderboardChart({ data }) {
    const chartData = data.map(user => ({
        name: user.assigned_user?.name || 'Unknown',
        completedTasks: user.completed_tasks,
    }));

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Leaderboard - Task Completion</h2>
            <ResponsiveContainer width="100%" height={340} key={Math.random()}>
                <BarChart data={chartData} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    {/* Animate the bars */}
                    <Bar
                        dataKey="completedTasks"
                        radius={[0, 10, 10, 0]}
                        fill="#6366F1"
                        animationDuration={5000}
                        animationEasing="ease-out"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
