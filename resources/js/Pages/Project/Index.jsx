import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Threads from "../../blocks/Backgrounds/Threads/Threads";

import {
  PROJECT_STATUS_CLASS_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import { motion } from "framer-motion";

export default function Index({
  auth,
  projects,
  success,
  queryParams = null,
  pageType,
  archivedProjects,
}) {
  queryParams = queryParams || {};
  const myProjectPage = pageType === "myProjects";

  const showArchived = queryParams.archived == 1;

  const toggleArchived = () => {
    const newQueryParams = { ...queryParams }; // Clone queryParams to avoid direct mutation
    newQueryParams.archived = !showArchived ? 1 : 0;

    const targetUrl = myProjectPage
      ? route("project.myProjects")
      : route("project.index");

    router.get(targetUrl, newQueryParams);
  };

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    const targetUrl = myProjectPage
      ? route("project.myProjects")
      : route("project.index");
    router.get(targetUrl, queryParams);
  };

  const deleteProject = (project) => {
    if (!window.confirm("Delete this project?")) {
      return;
    }
    router.delete(route("project.destroy", project.id));
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      queryParams.sort_direction =
        queryParams.sort_direction === "asc" ? "desc" : "asc";
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    const targetUrl = myProjectPage
      ? route("project.myProjects")
      : route("project.index");
    router.get(targetUrl, queryParams);
  };

  // Animation settings
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <motion.div className="flex justify-between items-center" {...fadeIn}>
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Projects
          </h2>
          {!myProjectPage && (
            <Link
              href={route("project.create")}
              className="bg-violet-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-violet-600"
            >
              Add Project
            </Link>
          )}
        </motion.div>
      }
    >
      <Head title="Projects" />
      <div className="relative flex min-h-screen flex-col">
        {/* Background Threads */}
        <Threads
          className="absolute top-0 form left-0 w-full h-full z-0"
          amplitude={4}
          distance={0.2}
          enableMouseInteraction={true}
        />

        <motion.div className="py-12 relative z-10" {...fadeIn}>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {success && (
              <motion.div
                className="bg-violet-500 py-2 px-4 text-white rounded mb-4"
                {...fadeIn}
              >
                {success}
              </motion.div>
            )}
            <motion.div
              className="overflow-hidden bg-white dark:bg-[#ad88ca] shadow-sm sm:rounded-lg"
              {...fadeIn}
            >
              <div className="p-6 text-gray-900 dark:bg-gray-700 ">
                <motion.div className="overflow-auto" {...fadeIn}>
                  {/* Archived Toggle */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={toggleArchived}
                      className="mr-7 mt-5 flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      {/* Folder Icon */}
                      <i className="fas fa-folder mr-2"></i>
                      {showArchived
                        ? "Show Active Projects"
                        : "Show Archived Projects"}
                    </button>
                  </div>
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                      <tr className="whitespace-nowrap">
                        <TableHeading
                          name="id"
                          sort_field={queryParams.sort_field}
                          sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}
                        >
                          ID
                        </TableHeading>
                        <th className="px-3 py-3">Image</th>
                        <TableHeading
                          name="name"
                          sort_field={queryParams.sort_field}
                          sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}
                        >
                          Name
                        </TableHeading>
                        <TableHeading
                          name="status"
                          sort_field={queryParams.sort_field}
                          sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}
                        >
                          Status
                        </TableHeading>
                        <TableHeading
                          name="created_at"
                          sort_field={queryParams.sort_field}
                          sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}
                        >
                          Created At
                        </TableHeading>
                        <TableHeading
                          name="due_date"
                          sort_field={queryParams.sort_field}
                          sort_direction={queryParams.sort_direction}
                          sortChanged={sortChanged}
                        >
                          Due Date
                        </TableHeading>
                        {!myProjectPage && (
                          <th className="px-3 py-3">Created By</th>
                        )}
                        {!myProjectPage && (
                          <th colSpan="2" className="px-3 py-3">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    {/* Table Filters and Sorts */}
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                      <tr className="text-nowrap">
                        {/* ID */}
                        <th className="px-3 py-3"></th>
                        {/* Image */}
                        <th className="px-3 py-3"></th>
                        {/* Filter by Project Name */}
                        <th className="px-3 py-3">
                          <TextInput
                            className="w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                            defaultValue={queryParams.name}
                            placeholder="Project Name"
                            onBlur={(e) =>
                              searchFieldChanged("name", e.target.value)
                            }
                            onKeyPress={(e) => onKeyPress("name", e)}
                          />
                        </th>
                        {/* Sort by Project Status */}
                        <th className="px-3 py-3">
                          <SelectInput
                            className="w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                            defaultValue={queryParams.status}
                            placeholder="Status"
                            onChange={(e) =>
                              searchFieldChanged("status", e.target.value)
                            }
                          >
                            <option value="">Sort</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </SelectInput>
                        </th>
                        {/* Task Creation Date */}
                        {<th className="px-3 py-3"></th>}
                        {/* Task Deadline */}
                        <th className="px-3 py-3"></th>
                        {/* Task Created By */}
                        {/* <th className="px-3 py-3"></th> */}
                        {/* Actions */}
                        {!myProjectPage && (
                          <th
                            colSpan="2"
                            className="text-center px-3 py-3"
                          ></th>
                        )}
                      </tr>
                    </thead>
                    {!showArchived && (
                      <tbody>
                        {projects.data.map((project) => (
                          <motion.tr
                            className="bg-white dark:bg-gray-900 border-b dark:border-gray-700"
                            key={project.id}
                            {...fadeIn}
                          >
                            <td className="px-3 py-2 whitespace-nowrap">
                              {project.id}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <img
                                src={project.image_path}
                                style={{ width: 60 }}
                                alt="Project"
                              />
                            </td>
                            <th className="px-3 py-2 whitespace-nowrap hover:underline text-nowrap text-gray-100 dark:text-gray-200">
                              <Link href={route("project.show", project.id)}>
                                {project.name}
                              </Link>
                            </th>
                            <td className="px-3 py-2 min-w-[120px]">
                              <span
                                className={`whitespace-nowrap px-3 py-1 rounded text-white ${
                                  PROJECT_STATUS_CLASS_MAP[project.status]
                                }`}
                              >
                                {PROJECT_STATUS_TEXT_MAP[project.status]}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {project.created_at}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {project.due_date}
                            </td>
                            {!myProjectPage && (
                              <td className="px-3 py-2 whitespace-nowrap">
                                {project.createdBy.name}
                              </td>
                            )}
                            {!myProjectPage && (
                              <th colSpan="2" className="text-center px-3 py-2">
                                <td className="px-3 py-2 text-center">
                                  <Link
                                    href={route("project.edit", project.id)}
                                    className="font-medium text-blue-500 hover:underline"
                                  >
                                    Edit
                                  </Link>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    onClick={() => deleteProject(project)}
                                    className="font-medium text-red-500 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </th>
                            )}
                          </motion.tr>
                        ))}
                      </tbody>
                    )}
                    {/* Archived */}
                    {showArchived && (
                      <tbody>
                        {archivedProjects.data.map((project) => (
                          <motion.tr
                            className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"
                            key={project.id}
                            {...fadeIn}
                          >
                            <td className="px-3 py-2 whitespace-nowrap">
                              {project.id}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <img
                                src={project.image_path}
                                style={{ width: 60 }}
                                alt="Project"
                              />
                            </td>
                            <th className="px-3 py-2 whitespace-nowrap hover:underline text-nowrap text-gray-100 dark:text-gray-200">
                              <Link href={route("project.show", project.id)}>
                                {project.name}
                              </Link>
                            </th>
                            <td className="px-3 py-2 min-w-[120px]">
                              <span
                                className={`whitespace-nowrap px-3 py-1 rounded text-white ${
                                  PROJECT_STATUS_CLASS_MAP[project.status]
                                }`}
                              >
                                {PROJECT_STATUS_TEXT_MAP[project.status]}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {project.created_at}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {project.due_date}
                            </td>
                            {!myProjectPage && (
                              <td className="px-3 py-2 whitespace-nowrap">
                                {project.createdBy.name}
                              </td>
                            )}
                            {!myProjectPage && (
                              <td colSpan="2" className="text-center px-3 py-2">
                                <div className="flex justify-center gap-2">
                                  <Link
                                    href={route("project.edit", project.id)}
                                    className="font-medium text-blue-500 hover:underline"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => deleteProject(project)}
                                    className="font-medium text-red-500 hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            )}
                          </motion.tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </motion.div>
                <Pagination
                  links={
                    showArchived
                      ? archivedProjects.meta.links
                      : projects.meta.links
                  }
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
