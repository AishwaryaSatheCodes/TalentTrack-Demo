import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import Threads from "../../blocks/Backgrounds/Threads/Threads";
import TextInput from "@/Components/TextInput";
import { motion } from "framer-motion";

export default function Index({
  auth,
  users,
  queryParams = null,
  success,
  pageType,
  userRoles,
}) {
  queryParams = queryParams || {};
  const teamPage = pageType === "myTeam";
  const isAdmin = userRoles.includes("admin");

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    const targetUrl = teamPage ? route("user.myTeam") : route("user.index");
    router.get(targetUrl, queryParams);
  };

  const deleteUser = (user) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }
    router.delete(route("user.destroy", user.id));
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <motion.div className="flex justify-between items-center" {...fadeIn}>
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Users
          </h2>
          {!teamPage && (
            <Link
              href={route("user.create")}
              className="bg-violet-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-violet-600"
            >
              Add New User
            </Link>
          )}
        </motion.div>
      }
    >
      <Head title="Users" />

      <div className="relative flex min-h-screen flex-col">
        {/* Background Threads */}
        <Threads
          className="absolute top-0 left-0 w-full h-full z-0"
          amplitude={4}
          distance={0.2}
          enableMouseInteraction={true}
        />
        <motion.div
          className="py-12 flex justify-center items-center relative z-10"
          {...fadeIn}
        >
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
            {success && (
              <div className="bg-violet-500 py-2 px-4 text-white rounded mb-4">
                {success}
              </div>
            )}
            <div className="flex flex-col items-center gap-6">
              {/* Search Section */}
              <div className="w-full mb-6">
                <div className="flex gap-4 justify-center">
                  <TextInput
                    className="w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                    defaultValue={queryParams.name}
                    placeholder="Search by Name"
                    onBlur={(e) => searchFieldChanged("name", e.target.value)}
                    onKeyPress={(e) => onKeyPress("name", e)}
                  />
                  <TextInput
                    className="w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                    defaultValue={queryParams.email}
                    placeholder="Search by Email"
                    onBlur={(e) => searchFieldChanged("email", e.target.value)}
                    onKeyPress={(e) => onKeyPress("email", e)}
                  />
                </div>
              </div>
              {/* User Cards - All Users */}
              {!teamPage && (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  {...fadeIn}
                >
                  {users.data.map((user) => (
                    <div
                      className="bg-white dark:bg-gray-800/90 p-6 rounded-lg shadow-lg border dark:border-gray-700"
                      key={user.id}
                    >
                      <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-600">
                        {user.created_at}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        {!isAdmin ? (
                          <div className="flex gap-4">
                            <button
                              onClick={(e) => deleteUser(user)}
                              className="font-medium text-red-500 hover:text-red-600 transition-colors duration-200"
                            >
                              Terminate
                            </button>
                            <Link
                              href={route("user.show", user.id)}
                              className="font-medium text-violet-500 hover:text-violet-600 transition-colors duration-200"
                            >
                              User Analytics
                            </Link>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <button
                              onClick={(e) => deleteUser(user)}
                              className="font-medium text-red-500 hover:text-red-600 transition-colors duration-200"
                            >
                              Terminate
                            </button>
                            <Link
                              href={route("user.show", user.id)}
                              className="font-medium text-violet-500 hover:text-violet-600 transition-colors duration-200"
                            >
                              Manage User
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
              {/* User Cards - My Team */}
              {teamPage && (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  {...fadeIn}
                >
                  {users.data.map((user) => (
                    <div
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700"
                      key={user.id}
                    >
                      <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Shared Project(s):
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-600">
                        {user.shared_projects &&
                        user.shared_projects.length > 0 ? (
                          <div className="flex gap-2">
                            {user.shared_projects.map((project) => (
                              <Link
                                key={project.id}
                                href={route("project.show", project.id)}
                                className="backdrop-blur-md bg-violet-300/30 text-violet-800 dark:text-violet-200 text-sm font-medium rounded-full px-4 py-1 shadow-md hover:bg-violet-500/40 transition-all duration-200 border border-violet-300/30 dark:border-violet-500/20"
                              >
                                {project.id}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            No Shared Projects
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
            <Pagination links={users.meta.links} />
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
