import React from "react";
import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
  PROJECT_STATUS_CLASS_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import TasksTable from "../Task/TasksTable";
import TaskStatusDonutChart from "@/Components/TaskStatusDonutChart";
import GanttChart from "./GanttChart";
import Threads from "@/blocks/Backgrounds/Threads/Threads";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const DetailItem = ({ label, value }) => (
  <div>
    <label className="font-bold text-large text-gray-300">{label}</label>
    <p className="mt-1 text-gray-400">{value}</p>
  </div>
);

const StatusBadge = ({ text, className }) => (
  <span className={`px-3 py-1 rounded text-white ${className}`}>{text}</span>
);

export default function Show({
  auth,
  project,
  tasks,
  queryParams,
  hideProjectColumn,
  userRole,
  tasksGantt,
  users,
}) {
  const isDeveloper =
    userRole.includes("development") && !userRole.includes("management");

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Project \"${project.name}\"`} />

      <div className="relative flex min-h-screen flex-col">
        {/* Background Threads */}
        <Threads
          className="absolute top-0 form left-0 w-full h-full z-0"
          amplitude={4}
          distance={0.2}
          enableMouseInteraction={true}
        />
        <motion.div
          className="py-12 relative z-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <motion.div
              className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800/70 p-6 text-center"
              variants={fadeIn}
            >
              {/* Project Image */}
              {project.image_path && (
                <img
                  src={project.image_path}
                  alt="Project"
                  className="w-full max-h-64 object-cover rounded-lg mb-4"
                />
              )}
              {/* Project ID and Name */}
              <div className="flex justify-center items-center gap-4 mb-4">
                <span className="w-12 h-12 flex items-center justify-center bg-violet-500 text-white text-lg font-bold rounded-full">
                  {project.id}
                </span>
                <h1 className="text-2xl font-bold text-gray-300">
                  {project.name}
                </h1>
              </div>
              {/* Project Description */}
              <p className="text-gray-400 mb-6">{project.description}</p>
              {/* Project Status */}
              <StatusBadge
                text={PROJECT_STATUS_TEXT_MAP[project.status]}
                className={PROJECT_STATUS_CLASS_MAP[project.status]}
              />
              {/* Dates Section */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <DetailItem label="Created On" value={project.created_at} />
                <DetailItem label="Due Date" value={project.due_date} />
              </div>
            </motion.div>
            {/* Charts Section with Translucent Background */}
            <motion.div className="py-5" variants={fadeIn}>
              <h3 className="py-2 font-bold text-lg text-gray-300">
                Progress Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="overflow-hidden bg-white bg-opacity-20 shadow-sm sm:rounded-lg dark:bg-gray-700 dark:bg-opacity-20 p-4 backdrop-blur-lg">
                  <TaskStatusDonutChart tasksGantt={tasksGantt} />
                </div>
                <div className="overflow-hidden bg-white bg-opacity-20 shadow-sm sm:rounded-lg dark:bg-gray-700 dark:bg-opacity-20 p-4 backdrop-blur-lg">
                  <GanttChart tasksGantt={tasksGantt} />
                </div>
              </div>
            </motion.div>
            {/* Users Section Aligned with TasksTable */}
            <motion.div
              className="py-5 max-w-7xl sm:px-6 lg:px-8"
              variants={fadeIn}
            >
              <h3 className="py-2 font-bold text-lg text-gray-300">
                Users Working on "{project.name}":
              </h3>
              {users?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="dark:bg-opacity-40 backdrop-blur-lg bg-white shadow-sm sm:rounded-lg dark:bg-gray-700 p-4"
                    >
                      <p className="text-gray-300 font-bold">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No users have worked on tasks in this project yet.
                </p>
              )}
            </motion.div>
            {/* Add Task Section */}
            {!isDeveloper && (
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="leading-tight pb-5">
                    <Link
                      href={route("task.create")}
                      className="bg-violet-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-violet-600"
                    >
                      Add New Task
                    </Link>
                  </div>
                  <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-700">
                    <TasksTable
                      tasks={tasks}
                      queryParams={queryParams}
                      hideProjectColumn={true}
                      userRole={userRole}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
