import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { motion } from "framer-motion";
import Threads from "@/blocks/Backgrounds/Threads/Threads";

export default function Edit({ mustVerifyEmail, status, auth }) {
  return (
    <AuthenticatedLayout header={<></>}>
      <Head title="Profile" />
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
          <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-0">
            {/* Profile Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">
                Update Profile Information
              </h3>
              <UpdateProfileInformationForm
                mustVerifyEmail={mustVerifyEmail}
                status={status}
                className="max-w-xl"
              />
            </div>

            {/* Password Update */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">
                Change Password
              </h3>
              <UpdatePasswordForm className="max-w-xl" />
            </div>

            {/* Delete Account */}
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-md dark:border-red-600/30 dark:bg-red-950">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                Delete Account
              </h3>
              <DeleteUserForm className="max-w-xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
