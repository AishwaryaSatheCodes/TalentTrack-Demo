import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import SelectInput from "@/Components/SelectInput";
import TaskSkillsSelector from "@/Components/TaskSkillsSelector";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Threads from "@/blocks/Backgrounds/Threads/Threads";
export default function Edit({
  auth,
  task,
  projects,
  users,
  taskStatus,
  skills,
  usersWithCompatibility,
}) {
  const approval = taskStatus === "send_for_approval";
  const [compatibleUsers, setCompatibleUsers] = useState(
    usersWithCompatibility || []
  );
  // Check if this is populated correctly
  const { data, setData, post, errors } = useForm({
    image: "",
    name: task.name || "",
    status: task.status || "",
    description: task.description || "",
    due_date: task.due_date || "",
    project_id: task.project_id || "",
    priority: task.priority || "",
    comments: task.comments || "",
    assigned_user_id: task.assigned_user_id || "",
    skill_ids: Array.isArray(task.skills)
      ? task.skills.map((skill) => skill.id)
      : [],

    _method: "PUT",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("task.update", task.id));
  };
  const onSkillChange = async (newIds) => {
    setData("skill_ids", newIds);

    if (newIds.length) {
      try {
        // Fetch users with compatibility scores for the selected skills
        const response = await axios.post(route("skills.matching-users"), {
          skill_ids: newIds,
        });

        // Here, you can merge the fetched compatible users with all users (assuming `users` is all users from the backend)
        const usersWithCompat = users.data.map((user) => {
          // Check if this user matches any of the selected skills and calculate compatibility
          const matchingUser = response.data.find(
            (compatUser) => compatUser.user.id === user.id
          );

          // Add compatibility info or set it to 0 if no match
          return {
            user,
            compatibility: matchingUser ? matchingUser.compatibility : 0,
          };
        });

        setCompatibleUsers(usersWithCompat);
      } catch (error) {
        console.error("Failed to fetch compatible users", error);
      }
    } else {
      // If no skills selected, reset compatibility for all users
      const usersWithNoSkills = users.map((user) => ({
        user,
        compatibility: 0, // Set compatibility to 0 if no skills selected
      }));

      setCompatibleUsers(usersWithNoSkills);
    }
  };

  const roleNames = auth.user.roles.map((role) => role.name);
  const isDeveloper =
    roleNames.includes("development") && !roleNames.includes("management");

  const handleSkillChange = (selectedSkillIds) => {
    setData("skill_ids", selectedSkillIds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route("tasks.update", task.id));
  };
  console.log("user data", users.data); // This will help to see the data structure

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Edit Task
        </h2>
      }
    >
      <Head title="Edit Task" />

      <div className="relative flex min-h-screen flex-col">
        {/* Background Threads */}
        <Threads
          className="absolute top-0 form left-0 w-full h-full z-0"
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
          {!isDeveloper && approval ? (
            <div className="py-12">
              <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                  <form
                    onSubmit={onSubmit}
                    className="p-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                  >
                    {/* Task Image (Only for Management) */}
                    {!isDeveloper && (
                      <div className="mb-6">
                        <InputLabel
                          htmlFor="task_image_path"
                          value="Task Image"
                        />
                        <TextInput
                          id="task_image_path"
                          type="file"
                          name="image"
                          className="mt-1 p-2 block w-full"
                          onChange={(e) => setData("image", e.target.files[0])}
                        />
                        <InputError message={errors.image} className="mt-2" />
                      </div>
                    )}
                    {/* Task Details Section */}
                    <div className="mb-6">
                      {!isDeveloper && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Task Details
                          </h3>
                          {/* Deadline can be changed. */}
                          <div className="mb-6">
                            <InputLabel
                              htmlFor="task_due_date"
                              value="Task Deadline"
                            />
                            <TextInput
                              id="task_due_date"
                              type="date"
                              name="due_date"
                              value={data.due_date}
                              className="mt-1 block w-full"
                              onChange={(e) =>
                                setData("due_date", e.target.value)
                              }
                            />
                            <InputError
                              message={errors.due_date}
                              className="mt-2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    {/* Task Settings */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Task Settings
                      </h3>
                      <div className="mb-6">
                        <InputLabel htmlFor="task_status" value="Task Status" />
                        <SelectInput
                          name="status"
                          id="task_status"
                          value={data.status}
                          className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                          onChange={(e) => setData("status", e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          {isDeveloper && (
                            <option value="send_for_approval">
                              Send for Approval
                            </option>
                          )}
                          {!isDeveloper && (
                            <option value="completed">Completed</option>
                          )}
                        </SelectInput>
                        <InputError message={errors.status} className="mt-2" />
                      </div>
                    </div>
                    <div className="mb-6">
                      <InputLabel
                        htmlFor="task_comments"
                        value="Task Comments"
                      />
                      <TextAreaInput
                        id="task_comments"
                        name="comments"
                        value={data.comments}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("comments", e.target.value)}
                      />
                      <InputError message={errors.comments} className="mt-2" />
                    </div>
                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-2">
                      <Link
                        className="bg-gray-100 py-2 px-4 text-gray-800 rounded shadow hover:bg-gray-200"
                        href={route("task.index")}
                      >
                        Cancel
                      </Link>
                      <button className="bg-violet-500 py-2 px-4 text-white rounded shadow hover:bg-violet-600">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12">
              <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                  <form
                    onSubmit={onSubmit}
                    className="p-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                  >
                    {/* Task Image (Only for Management) */}
                    {!isDeveloper && (
                      <div className="mb-6">
                        <InputLabel
                          htmlFor="task_image_path"
                          value="Task Image"
                        />
                        <TextInput
                          id="task_image_path"
                          type="file"
                          name="image"
                          className="mt-1 p-2 block w-full"
                          onChange={(e) => setData("image", e.target.files[0])}
                        />
                        <InputError message={errors.image} className="mt-2" />
                      </div>
                    )}
                    {/* Task Details Section */}
                    <div className="mb-6">
                      {!isDeveloper && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Task Details
                          </h3>
                          <div className="mb-6">
                            <InputLabel htmlFor="task_name" value="Task Name" />
                            <TextInput
                              id="task_name"
                              type="text"
                              name="name"
                              value={data.name}
                              className="mt-1 block w-full"
                              isFocused
                              onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputError
                              message={errors.name}
                              className="mt-2"
                            />
                          </div>
                          <div className="mb-6">
                            <InputLabel
                              htmlFor="task_description"
                              value="Task Description"
                            />
                            <TextAreaInput
                              id="task_description"
                              name="description"
                              value={data.description}
                              className="mt-1 block w-full"
                              onChange={(e) =>
                                setData("description", e.target.value)
                              }
                            />
                            <InputError
                              message={errors.description}
                              className="mt-2"
                            />
                          </div>
                          <div className="mb-6">
                            <InputLabel
                              htmlFor="task_due_date"
                              value="Task Deadline"
                            />
                            <TextInput
                              id="task_due_date"
                              type="date"
                              name="due_date"
                              value={data.due_date}
                              className="mt-1 block w-full"
                              onChange={(e) =>
                                setData("due_date", e.target.value)
                              }
                            />
                            <InputError
                              message={errors.due_date}
                              className="mt-2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    {/* Task Assignment */}
                    {!isDeveloper && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          Assignment
                        </h3>
                        <div className="mb-6">
                          <InputLabel
                            htmlFor="task_project_id"
                            value="Project"
                          />
                          <SelectInput
                            name="project_id"
                            id="task_project_id"
                            value={data.project_id}
                            className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                            onChange={(e) =>
                              setData("project_id", e.target.value)
                            }
                          >
                            <option value="">Select Project</option>
                            {projects.data.map((project) => (
                              <option value={project.id} key={project.id}>
                                {project.name}
                              </option>
                            ))}
                          </SelectInput>
                          <InputError
                            message={errors.project_id}
                            className="mt-2"
                          />
                        </div>
                        {!isDeveloper && (
                          <div className="mb-6">
                            <TaskSkillsSelector
                              skills={skills.data || []}
                              selectedSkillIds={data.skill_ids}
                              onChange={onSkillChange}
                            />
                            <InputError
                              message={errors.skill_ids}
                              className="mt-2"
                            />
                          </div>
                        )}
                        <div className="mb-6">
                          <InputLabel
                            htmlFor="task_assigned_user"
                            value="Assign Task to"
                          />
                          <SelectInput
                            name="assigned_user_id"
                            id="assigned_user_id"
                            value={data.assigned_user_id || ""}
                            className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                            onChange={(e) =>
                              setData("assigned_user_id", e.target.value)
                            }
                          >
                            <option value="">Select User</option>
                            {compatibleUsers.map((userWithCompat) => (
                              <option
                                key={userWithCompat.user.id}
                                value={userWithCompat.user.id}
                              >
                                {userWithCompat.user.name} -{" "}
                                {userWithCompat.compatibility > 0
                                  ? `${userWithCompat.compatibility}% Required Skills`
                                  : "No Matching Skills"}
                              </option>
                            ))}
                          </SelectInput>
                          <InputError
                            message={errors.assigned_user_id}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                    {/* Task Settings */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Task Settings
                      </h3>
                      {!isDeveloper && (
                        <div className="mb-6">
                          <InputLabel
                            htmlFor="priority"
                            value="Task Priority"
                          />
                          <SelectInput
                            name="priority"
                            id="priority"
                            value={data.priority}
                            className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                            onChange={(e) =>
                              setData("priority", e.target.value)
                            }
                          >
                            <option value="">Select Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </SelectInput>
                          <InputError
                            message={errors.priority}
                            className="mt-2"
                          />
                        </div>
                      )}
                      <div className="mb-6">
                        <InputLabel htmlFor="task_status" value="Task Status" />
                        <SelectInput
                          name="status"
                          id="task_status"
                          value={data.status}
                          className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                          onChange={(e) => setData("status", e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          {isDeveloper && (
                            <option value="send_for_approval">
                              Send for Approval
                            </option>
                          )}
                          {!isDeveloper && (
                            <option value="completed">Completed</option>
                          )}
                        </SelectInput>
                        <InputError message={errors.status} className="mt-2" />
                      </div>
                    </div>
                    <div className="mb-6">
                      <InputLabel
                        htmlFor="task_comments"
                        value="Task Comments"
                      />
                      <TextAreaInput
                        id="task_comments"
                        name="comments"
                        value={data.comments}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("comments", e.target.value)}
                      />
                      <InputError message={errors.comments} className="mt-2" />
                    </div>
                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-2">
                      <Link
                        className="bg-gray-100 py-2 px-4 text-gray-800 rounded shadow hover:bg-gray-200"
                        href={route("task.index")}
                      >
                        Cancel
                      </Link>
                      <button className="bg-violet-500 py-2 px-4 text-white rounded shadow hover:bg-violet-600">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
