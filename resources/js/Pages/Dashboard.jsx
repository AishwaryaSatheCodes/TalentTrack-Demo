import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import Threads from "../blocks/Backgrounds/Threads/Threads";
import {
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
} from "@/constants.jsx";
import TasksOverTime from "@/Components/TasksOverTime";
import { motion } from "framer-motion";
import LeaderboardChart from "@/Components/LeaderboardChart";
import ActivityHeatmapDev from "@/Components/ActivityHeatmapDev";

export default function Dashboard({
  auth,
  newUsers,
  countNewUsers,
  devUsers,
  mgmtUsers,
  totalCompletedTasksCount,
  activeTasks,
  activityDates,
  totalUsers,
  totalProjects,
  completedTasksByUser,
  totalTasks,
  awaitApproval,
  myPendingTasks,
  myApprovalTasks,
  myCompletedTasks,
}) {
  const roles = auth?.roles || [];
  // Check Role Permissions
  const noRole = roles.length === 0;
  const isAdmin = roles.includes("admin");
  const isManagement = roles.includes("management");
  const isDevelopment = roles.includes("development") && !isManagement;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const calculateDaysSince = (approvalDate) => {
    if (!approvalDate) return "No date available";

    const today = new Date();
    const approval = new Date(approvalDate);

    if (isNaN(approval.getTime())) {
      console.error(`Invalid date format: ${approvalDate}`);
      return "Invalid date";
    }

    const differenceInTime = today - approval;
    const differenceInDays = Math.floor(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    return `${differenceInDays} days`;
  };

  const calculateDaysLeft = (dueDate) => {
    if (!dueDate) return "No due date available";

    // Normalize and parse date using Date object
    const today = new Date();
    const due = new Date(dueDate);

    // Check if it's a valid date
    if (isNaN(due.getTime())) {
      console.error(`Invalid date format: ${dueDate}`);
      return "Invalid date";
    }

    // Calculate days difference
    const differenceInTime = due - today;
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays < 0) {
      return (
        <span className="text-red-500">
          Overdue by {Math.abs(differenceInDays)} days
        </span>
      );
    }
    if (differenceInDays === 0) {
      return <span className="text-yellow-500">Due Today</span>;
    }
    return <span className="text-green-500">{differenceInDays} days left</span>;
  };

  return (
    <AuthenticatedLayout
      header={
        <motion.div {...fadeIn}>
          <h2 className="text-xl font-semibold leading-tight dark:text-gray-200 text-gray-800">
            Welcome, {auth.user.name}.
          </h2>
          <div className="flex gap-2 mt-2">
            {roles.map((role, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-semibold rounded-full text-white bg-violet-400"
              >
                {role.toUpperCase()}
              </span>
            ))}
          </div>
        </motion.div>
      }
    >
      <Head title="Dashboard" />
      <div className="relative flex min-h-screen flex-col ">
        {/* Background Threads */}
        <Threads
          className="absolute top-0 left-0 w-full h-full z-0"
          amplitude={4}
          distance={0.2}
          enableMouseInteraction={true}
        />

        <div className="relative z-10">
          {/* No Role Assigned Yet */}
          {noRole && (
            <motion.div
              className="py-12 flex justify-center items-center"
              {...fadeIn}
            >
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md text-center">
                <h3 className="text-gray-800 dark:text-gray-100 text-2xl font-semibold mb-4">
                  No Role Assigned
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The admin will assign you a role shortly. Stay tuned!
                </p>
              </div>
            </motion.div>
          )}
          {/* Administration Dashboard */}
          {isAdmin && (
            <>
              <motion.div className="py-12" {...fadeIn}>
                <motion.div
                  className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-3 gap-2"
                  {...fadeIn}
                >
                  {/* Development user Count */}
                  <motion.div
                    className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                    {...fadeIn}
                  >
                    <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                      <h3 className="text-amber-500 text-xl font-semibold">
                        Developers
                      </h3>
                      <p className="text-xl mt-4">
                        <span className="mr-2">{devUsers}</span>
                      </p>
                    </div>
                  </motion.div>
                  {/* Management User Count */}
                  <motion.div
                    className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                    {...fadeIn}
                  >
                    <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                      <h3 className="text-blue-500 text-xl font-semibold">
                        Managers
                      </h3>
                      <p className="text-xl mt-4">
                        <span className="ml-2">{mgmtUsers}</span>
                      </p>
                    </div>
                  </motion.div>
                  {/* No Roles */}
                  <motion.div
                    className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                    {...fadeIn}
                  >
                    <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                      <h3 className="text-green-500 text-xl font-semibold">
                        New Registrations
                      </h3>
                      <p className="text-xl mt-4">{countNewUsers}</p>
                    </div>
                  </motion.div>
                </motion.div>
                {/* Active Tasks and Chart Section */}
                <motion.div
                  className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8 grid grid-cols-3 gap-2"
                  {...fadeIn}
                >
                  {/* New Users Table */}
                  <motion.div
                    className="col-span-1 bg-white shadow-sm sm:rounded-lg overflow-y-auto dark:bg-gray-800 mt-8"
                    style={{
                      height: "450px",
                      maxHeight: "500px",
                      overflowY: "auto",
                    }}
                    {...fadeIn}
                  >
                    <h4 className="flex items-center justify-between text-white text-xl font-semibold bg-gray-800 p-4 rounded-t-lg">
                      New Users - No Roles
                    </h4>
                    <table className="w-full overflow-y-auto text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr>
                          <th className="px-2 py-2">ID</th>
                          <th className="px-2 py-2">Name</th>
                          <th className="px-2 py-2">Waiting Since</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newUsers.data.map((user) => (
                          <tr key={user.id}>
                            <td className="px-2 py-2">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold">
                                <Link href={route("user.show", user.id)}>
                                  {user.id}
                                </Link>
                              </span>
                            </td>
                            <td className="px-2 py-2">
                              <Link
                                className="text-white hover:underline"
                                href={route("user.show", user.id)}
                              >
                                {user.name}
                              </Link>
                            </td>
                            <td className="px-2 py-2">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
          {/* Dashboard for Managers */}
          {isManagement && (
            <motion.div className="py-12" {...fadeIn}>
              <motion.div
                className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-3 gap-2"
                {...fadeIn}
              >
                {/* Users */}
                <motion.div
                  className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                  {...fadeIn}
                >
                  <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                    <h3 className="text-amber-500 text-xl font-semibold">
                      Users
                    </h3>
                    <p className="text-xl mt-4">
                      <span className="mr-2">{totalUsers}</span>
                    </p>
                  </div>
                </motion.div>
                {/* Projects */}
                <motion.div
                  className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                  {...fadeIn}
                >
                  <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                    <h3 className="text-blue-500 text-xl font-semibold">
                      Total Projects
                    </h3>
                    <p className="text-xl mt-4">
                      <span className="ml-2">{totalProjects}</span>
                    </p>
                  </div>
                </motion.div>
                {/* Projects */}
                <motion.div
                  className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                  {...fadeIn}
                >
                  <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                    <h3 className="text-green-500 text-xl font-semibold">
                      Finished Tasks
                    </h3>
                    <p className="text-xl mt-4">
                      <span className="mr-2">{totalCompletedTasksCount}</span>/
                      <span className="mr-2">{totalTasks}</span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              {/* Active Tasks and Chart Section */}
              <motion.div
                className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8 grid grid-cols-3 gap-2"
                {...fadeIn}
              >
                {/* Active Tasks Table */}
                <motion.div
                  className="col-span-1 overflow-y-auto bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                  style={{
                    height: "450px",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                  {...fadeIn}
                >
                  <h4 className="text-white text-xl font-semibold bg-gray-800 p-4 rounded-t-lg">
                    Waiting for Approval
                  </h4>
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                      <tr>
                        <th className="px-2 py-2">ID</th>
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Priority</th>
                        <th className="px-2 py-2">Waiting Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {awaitApproval.map((task) => (
                        <tr key={task.id}>
                          <td className="px-2 py-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold">
                              <Link href={route("task.edit", task.id)}>
                                {task.id}
                              </Link>
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <Link
                              className="text-white hover:underline"
                              href={route("task.show", task.id)}
                            >
                              {task.name}
                            </Link>
                          </td>
                          <td className="px-2 py-2">
                            <span
                              className={
                                "px-2 py-1 rounded text-white text-nowrap " +
                                TASK_PRIORITY_CLASS_MAP[task.priority]
                              }
                            >
                              {TASK_PRIORITY_TEXT_MAP[task.priority]}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <td className="px-2 py-2">
                              {calculateDaysSince(task.send_for_approval_date)}
                            </td>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
                {/* Chart Section */}
                <motion.div
                  className="col-span-2 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-4"
                  {...fadeIn}
                >
                  <LeaderboardChart data={completedTasksByUser} />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
          {/* Dashboard for Developers */}
          {isDevelopment && (
            <motion.div className="py-12" {...fadeIn}>
              <motion.div
                className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-3 gap-2"
                {...fadeIn}
              >
                {/* Pending Tasks */}
                <motion.div
                  className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800/70"
                  {...fadeIn}
                >
                  <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                    <h3 className="text-amber-500 text-xl font-semibold">
                      Pending Tasks
                    </h3>
                    <p className="text-xl mt-4">
                      <span className="mr-2">{myPendingTasks}</span>
                    </p>
                  </div>
                </motion.div>
                {/* Sent for Approval Tasks */}
                <motion.div
                  className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800/70"
                  {...fadeIn}
                >
                  <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                    <h3 className="text-blue-500 text-xl font-semibold">
                      Sent for Approval
                    </h3>
                    <p className="text-xl mt-4">
                      <span className="ml-2">{myApprovalTasks}</span>
                    </p>
                  </div>
                </motion.div>
                {/* Completed Tasks */}
                <motion.div
                  className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800/70"
                  {...fadeIn}
                >
                  <div className="p-6 text-gray-900 dark:text-gray-100 text-center">
                    <h3 className="text-green-500 text-xl font-semibold">
                      Tasks Completed
                    </h3>
                    <p className="text-xl mt-4">
                      <span className="mr-2">{myCompletedTasks}</span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Active Tasks and Chart Section */}
              <motion.div
                className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-8 grid grid-cols-3 gap-2"
                {...fadeIn}
              >
                {/* Active Tasks Table */}
                <motion.div
                  className="col-span-1 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                  style={{
                    height: "450px",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                  {...fadeIn}
                >
                  <h4 className="flex items-center justify-between text-white text-xl font-semibold bg-gray-800 p-4 rounded-t-lg">
                    Active Tasks
                  </h4>
                  <table className="w-full overflow-y-auto text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                      <tr>
                        <th className="px-2 py-2">ID</th>
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Priority</th>
                        <th className="px-2 py-2">Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTasks.data.map((task) => (
                        <tr key={task.id}>
                          <td className="px-2 py-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold">
                              <Link href={route("task.edit", task.id)}>
                                {task.id}
                              </Link>
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <Link
                              className="text-white hover:underline"
                              href={route("task.show", task.id)}
                            >
                              {task.name}
                            </Link>
                          </td>
                          <td className="px-2 py-2">
                            <span
                              className={
                                "px-2 py-1 rounded text-white text-nowrap " +
                                TASK_PRIORITY_CLASS_MAP[task.priority]
                              }
                            >
                              {TASK_PRIORITY_TEXT_MAP[task.priority]}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            {calculateDaysLeft(task.due_date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
                {/* Chart Section */}
                <motion.div
                  className="bg-opacity-20 backdrop-blur-lg col-span-2 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-4"
                  {...fadeIn}
                >
                  <TasksOverTime />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
