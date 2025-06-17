import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import FileUploadForm from "@/Components/FileUploadForm";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants.jsx";
import Threads from "@/blocks/Backgrounds/Threads/Threads";

const DetailItem = ({ label, value }) => (
  <div>
    <label className="font-bold text-large text-gray-300">{label}</label>
    <p className="mt-1 text-gray-400">{value}</p>
  </div>
);

const StatusBadge = ({ text, className }) => (
  <span className={`px-3 py-1 rounded text-white ${className}`}>{text}</span>
);

export default function Show({ auth, task, userRole, files }) {
  const isDeveloper =
    userRole.includes("development") && !userRole.includes("management");

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Task \"${task.name}\"`} />

      <div className="relative flex min-h-screen flex-col">
        {/* Background Threads */}
        <Threads
          className="absolute top-5 left-0 w-full h-full z-0"
          amplitude={4}
          distance={0.2}
          enableMouseInteraction={true}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="py-12 relative z-10"
        >
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-700/70 p-6 text-center relative">
              {/* Task Image */}
              {task.image_path && (
                <img
                  src={task.image_path}
                  alt="Task"
                  className="w-full max-h-64 object-cover rounded-lg mb-4"
                />
              )}
              {/* Task ID and Name */}
              <div className="flex justify-center items-center gap-4 mb-4">
                <span className="w-12 h-12 flex items-center justify-center bg-violet-500 text-white text-lg font-bold rounded-full">
                  {task.project.id}
                </span>
                <h1 className="text-2xl font-bold text-gray-300">
                  {task.name}
                </h1>
              </div>
              {/* Task Description */}
              <p className="text-gray-400 mb-6">{task.description}</p>
              {/* Task Status */}
              <StatusBadge
                text={TASK_STATUS_TEXT_MAP[task.status]}
                className={TASK_STATUS_CLASS_MAP[task.status]}
              />
              {/* Dates Section */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <DetailItem label="Created On" value={task.created_at} />
                <DetailItem label="Due Date" value={task.due_date} />
                <DetailItem
                  label="Assigned To"
                  value={task.assignedUser?.name || "Not Assigned"}
                />
                <DetailItem
                  label="Comments"
                  value={task.comments ? task.comments : "Not Available"}
                />
              </div>
              {/* Go to Project Button */}
              <Link
                href={route("project.show", task.project.id)}
                className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center bg-violet-500 text-white rounded-full shadow transition-all hover:bg-violet-600"
                title="Go to Project"
              >
                ➔
              </Link>
              {/* Update Status Button for Developers */}
              <Link
                href={route("task.edit", task.id)}
                className="absolute bottom-4 left-4 w-12 h-12 flex items-center justify-center bg-indigo-500 text-white rounded-full shadow transition-all hover:bg-indigo-600"
                title="Update Task Status"
              >
                ✎
              </Link>
            </div>
            <div>
              {/* Skills Used */}
              {task.skills?.length > 0 && (
                <div className="mt-6 text-left">
                  <h2 className="text-lg font-semibold text-gray-300 mb-2">
                    Skills Used
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {task.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 text-sm rounded-full bg-white/10 backdrop-blur-md border border-violet-300 shadow-inner text-white shadow-lg"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* File Uploads */}
            <div>
              <FileUploadForm
                taskId={task.id}
                files={files || []}
                userRole={userRole}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
