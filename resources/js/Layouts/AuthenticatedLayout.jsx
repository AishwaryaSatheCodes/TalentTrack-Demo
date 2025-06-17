import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);
  const { auth } = usePage().props;

  const user = auth?.user;
  const roles = auth?.roles || [];
  // Check Role Permissions
  const isManagement = roles.includes("management");
  const isDevelopment = roles.includes("development") && !isManagement;
  const isAdmin = roles.includes("admin");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              {/* Logo */}
              <div className="flex shrink-0 items-center">
                <Link href="/dashboard">
                  <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                </Link>
              </div>

              {/* Navigation Links */}

              {isAdmin && (
                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                  <NavLink
                    href={route("dashboard")}
                    active={route().current("dashboard")}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    href={route("user.index")}
                    active={route().current("user.index")}
                  >
                    User Management
                  </NavLink>
                  <NavLink
                    href={route("skills.index")}
                    active={route().current("skills.index")}
                  >
                    Skills
                  </NavLink>
                </div>
              )}

              {!isAdmin && (
                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                  <NavLink
                    href={route("dashboard")}
                    active={route().current("dashboard")}
                  >
                    Dashboard
                  </NavLink>

                  {/* Management Specific Links */}
                  {isManagement && (
                    <>
                      <NavLink
                        href={route("project.index")}
                        active={route().current("project.index")}
                      >
                        All Projects
                      </NavLink>
                      <NavLink
                        href={route("task.index")}
                        active={route().current("task.index")}
                      >
                        All Tasks
                      </NavLink>
                      <NavLink
                        href={route("user.index")}
                        active={route().current("user.index")}
                      >
                        Users
                      </NavLink>
                    </>
                  )}

                  {/* Development Specific Links */}
                  {isDevelopment && (
                    <>
                      <NavLink
                        href={route("task.myTasks")}
                        active={route().current("task.myTasks")}
                      >
                        My Tasks
                      </NavLink>
                      <NavLink
                        href={route("project.myProjects")}
                        active={route().current("project.myProjects")}
                      >
                        My Projects
                      </NavLink>

                      <NavLink
                        href={route("skills.index")}
                        active={route().current("skills.index")}
                      >
                        My Skills
                      </NavLink>

                      <NavLink
                        href={route("user.myTeam")}
                        active={route().current("user.myTeam")}
                      >
                        My Team
                      </NavLink>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="hidden sm:ms-6 sm:flex sm:items-center">
              <div className="relative ms-3">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-300 transition duration-150 ease-in-out hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                      >
                        {user.name}
                        <svg
                          className="-me-0.5 ms-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    <Dropdown.Link href={route("profile.edit")}>
                      Profile
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route("logout")}
                      method="post"
                      as="button"
                    >
                      Log Out
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() =>
                  setShowingNavigationDropdown(!showingNavigationDropdown)
                }
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-200 focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-500 dark:focus:text-gray-200 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={
                      !showingNavigationDropdown ? "inline-flex" : "hidden"
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={
                      showingNavigationDropdown ? "inline-flex" : "hidden"
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {header && (
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}
