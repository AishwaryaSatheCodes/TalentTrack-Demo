import { Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import {
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
} from "@/constants.jsx";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";

export default function TasksTable({
  tasks,
  queryParams = null,
  hideProjectColumn = false,
  userRole,
  pageType,
}) {
  const myTaskPage = pageType === "myTasks";
  const isShowPage = pageType === "showPage";
  console.log("userRole in TasksTable:", userRole);
  queryParams = queryParams || {};
  const isDeveloper = userRole.includes("management")
    ? false
    : userRole.includes("development");

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    const targetUrl = isShowPage
      ? route("project.show")
      : myTaskPage
      ? route("task.myTasks")
      : route("task.index");
    router.get(targetUrl, queryParams);
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

  const deleteTask = (task) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }
    router.delete(route("task.destroy", task.id));
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    const targetUrl = isShowPage
      ? route("project.show")
      : myTaskPage
      ? route("task.myTasks")
      : route("task.index");
    router.get(targetUrl, queryParams);
  };

  return (
    <>
      {/* Display Section */}
      <div className="overflow-auto">
        <table className="w-full text-sm text-left rt1:text-right text-gray-500 dark:text-gray-400">
          {/* Table headings */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              {/* Sort by ID */}
              <TableHeading
                name="id"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                ID
              </TableHeading>

              {/* Display Images */}
              <th className="px-3 py-3">Image</th>

              {/* Sort by Project Name (Hide if irrelevant) */}
              {!hideProjectColumn && !myTaskPage && (
                <TableHeading
                  name="project"
                  sort_field={queryParams.sort_field}
                  sort_direction={queryParams.sort_direction}
                  sortChanged={sortChanged}
                >
                  Subtask of
                </TableHeading>
              )}

              {/* Sort by Task Name */}
              <TableHeading
                name="name"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Name
              </TableHeading>

              {/* Sort by Task Status */}
              <TableHeading
                name="status"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Status
              </TableHeading>

              {/* Sort by Task Priority */}
              <TableHeading
                name="priority"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Priority
              </TableHeading>

              {/* Sort by Date of Creation */}
              {!isDeveloper && (
                <TableHeading
                  name="created_at"
                  sort_field={queryParams.sort_field}
                  sort_direction={queryParams.sort_direction}
                  sortChanged={sortChanged}
                >
                  Created At
                </TableHeading>
              )}

              {/* Sort by Deadline */}
              <TableHeading
                name="due_date"
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Due Date
              </TableHeading>

              {/* Display Creator Name */}
              {!isDeveloper && <th className="px-3 py-3">Assigned To</th>}

              <th
                className="text-center px-3 py-3"
                colSpan={isDeveloper ? "1" : "2"}
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Filters and Sorts */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap">
              {/* ID */}
              <th className="px-3 py-3"></th>

              {/* Image */}
              <th className="px-3 py-3"></th>

              {/* Project Name */}
              {!hideProjectColumn && !myTaskPage && (
                <th className="px-3 py-3"></th>
              )}

              {/* Filter by Task Name */}
              <th className="px-3 py-3">
                <TextInput
                  className="w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                  defaultValue={queryParams.name}
                  placeholder="Task Name"
                  onBlur={(e) => searchFieldChanged("name", e.target.value)}
                  onKeyPress={(e) => onKeyPress("name", e)}
                />
              </th>

              {/* Sort by Task Status */}
              <th className="px-3 py-3">
                <SelectInput
                  className="w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                  defaultValue={queryParams.status}
                  placeholder="Task Name"
                  onChange={(e) => searchFieldChanged("status", e.target.value)}
                >
                  <option value="">Sort</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="send_for_approval">Sent for Approval</option>
                </SelectInput>
              </th>

              {/* Sort by Task Priority */}
              <th className="px-3 py-3">
                <SelectInput
                  className="w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                  defaultValue={queryParams.priority}
                  placeholder="Task Priority"
                  onChange={(e) =>
                    searchFieldChanged("priority", e.target.value)
                  }
                >
                  <option value="">Sort</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </SelectInput>
              </th>

              {/* Task Creation Date */}
              {!isDeveloper && <th className="px-3 py-3"></th>}

              {/* Task Deadline */}
              <th className="px-3 py-3"></th>

              {/* Task Created By */}
              {!isDeveloper && <th className="px-3 py-3"></th>}

              {/* Actions */}
              <th
                colSpan={isDeveloper ? "1" : "2"}
                className="text-center px-3 py-3"
              ></th>
            </tr>
          </thead>

          {/* Table Data */}
          <tbody>
            {tasks.data.map((task) => (
              <tr
                className="bg-white border-b dark:bg-gray-900/90 dark:border-gray-700/70"
                key={task.id}
              >
                {/* Task ID */}
                <td className="px-3 py-2 text-nowrap">{task.id}</td>

                {/* Task Image */}
                <td className="px-3 py-2">
                  {<img src={task.image_path} style={{ width: 60 }} />}
                </td>

                {/* Project Name */}
                {!hideProjectColumn && !myTaskPage && (
                  <td className="px-3 py-2 text-nowrap">{task.project.name}</td>
                )}

                {/* Task Name */}
                <Link href={route("task.show", task.id)}>
                  <th className="px-3 py-2 whitespace-nowrap hover:underline text-nowrap text-gray-100 dark:text-gray-200">
                    {task.name}
                  </th>
                </Link>

                {/* Task Status */}
                <td className="px-3 py-2 min-w-[120px]">
                  <span
                    className={
                      "px-3 py-1 rounded text-white text-nowrap " +
                      TASK_STATUS_CLASS_MAP[task.status]
                    }
                  >
                    {TASK_STATUS_TEXT_MAP[task.status]}
                  </span>
                </td>

                {/* Task Priority */}
                <td className="px-3 py-2 text-nowrap">
                  <span
                    className={
                      "px-3 py-1 rounded text-white text-nowrap " +
                      TASK_PRIORITY_CLASS_MAP[task.priority]
                    }
                  >
                    {TASK_PRIORITY_TEXT_MAP[task.priority]}
                  </span>
                </td>

                {/* Task Created At */}
                {!isDeveloper && (
                  <td className="px-3 py-2 text-nowrap">{task.created_at}</td>
                )}

                {/* Task Deadline */}
                <td className="px-3 py-2 text-nowrap">{task.due_date}</td>

                {/* Task Creator */}
                {!isDeveloper && (
                  <td className="px-3 py-2 text-nowrap">
                    {task.assignedUser.name}
                  </td>
                )}

                {/* Actions Data */}
                {/* If the user is a Developer, show only "Update" */}
                {isDeveloper ? (
                  <td className="px-2 py-2 text-center" colSpan="1">
                    <Link
                      href={route("task.edit", task.id)}
                      className="font-medium text-blue-500 hover:underline"
                    >
                      Update
                    </Link>
                  </td>
                ) : (
                  /* If the user is NOT a Developer, show BOTH "Edit" and "Delete" */
                  <>
                    <td className="px-2 py-2 text-center">
                      <Link
                        href={route("task.edit", task.id)}
                        className="font-medium text-blue-500 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => deleteTask(task)}
                        className="font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination links={tasks.meta.links} />
    </>
  );
}
