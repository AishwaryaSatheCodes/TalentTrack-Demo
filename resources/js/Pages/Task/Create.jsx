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
import axios from "axios";
import Threads from "@/blocks/Backgrounds/Threads/Threads";

export default function Create({
  auth,
  projects,
  users,
  skills,
  usersWithCompatibility,
}) {
  console.log(usersWithCompatibility);
  const { data, setData, post, errors, reset } = useForm({
    image: "",
    name: "",
    status: "",
    description: "",
    due_date: "",
    skill_ids: [],
  });

  const [compatibleUsers, setCompatibleUsers] = useState(
    usersWithCompatibility || []
  );

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("task.store"));
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

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Tasks
          </h2>
        </div>
      }
    >
      <Head title="Tasks" />

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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
              <form
                onSubmit={onSubmit}
                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
              >
                {/* Task Image */}
                <div>
                  <InputLabel htmlFor="task_image_path" value="Task Image" />
                  <TextInput
                    id="task_image_path"
                    type="file"
                    name="image"
                    className="mt-1 p-2 block w-full"
                    onChange={(e) => setData("image", e.target.files[0])}
                  />
                  <InputError message={errors.image} className="mt-2" />
                </div>

                {/* Task Project ID */}
                <div>
                  <InputLabel htmlFor="task_project_id" value="Subtask of" />
                  <SelectInput
                    name="project_id"
                    id="task_project_id"
                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                    onChange={(e) => setData("project_id", e.target.value)}
                  >
                    <option value="">Select Project ID</option>
                    {projects.data.map((project) => (
                      <option value={project.id} key={project.id}>
                        {project.id} - {project.name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.project_id} className="mt-2" />
                </div>

                {/* Task Name */}
                <div>
                  <InputLabel htmlFor="task_name" value="Task Name" />
                  <TextInput
                    id="task_name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("name", e.target.value)}
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>
                {/* Task Description */}
                <div>
                  <InputLabel
                    htmlFor="task_description"
                    value="Task Description"
                  />
                  <TextAreaInput
                    id="task_description"
                    type="text"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("description", e.target.value)}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                {/* Task Due Date */}
                <div>
                  <InputLabel htmlFor="task_due_date" value="Task Deadline" />
                  <TextInput
                    id="task_due_date"
                    type="date"
                    name="due_date"
                    value={data.due_date}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("due_date", e.target.value)}
                  />
                  <InputError message={errors.due_date} className="mt-2" />
                </div>

                {/* Task Priority */}
                <div>
                  <InputLabel htmlFor="priority" value="Task Priority" />
                  <SelectInput
                    name="priority"
                    id="task.priority"
                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                    onChange={(e) => setData("priority", e.target.value)}
                  >
                    <option value="">Select Task Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </SelectInput>
                  <InputError message={errors.task_priority} className="mt-2" />
                </div>

                {/* Task Status */}
                <div>
                  <InputLabel htmlFor="task_priority" value="Task Status" />
                  <SelectInput
                    name="status"
                    id="task.status"
                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                    onChange={(e) => setData("status", e.target.value)}
                  >
                    <option value="">Select Progress Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </SelectInput>
                  <InputError message={errors.status} className="mt-2" />
                </div>

                {/* Task Required Skills */}
                <TaskSkillsSelector
                  skills={skills.data}
                  selectedSkillIds={data.skill_ids}
                  onChange={onSkillChange}
                />

                {/* Task Assigned User */}
                <div>
                  <InputLabel htmlFor="assigned_user_id" value="Assign User" />
                  <SelectInput
                    name="assigned_user_id"
                    id="assigned_user_id"
                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                    onChange={(e) =>
                      setData("assigned_user_id", e.target.value)
                    }
                    value={data.assigned_user_id || ""}
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

                <div className="mt-4 text-right">
                  <Link
                    className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                    href={route("task.index")}
                  >
                    Cancel
                  </Link>
                  <button className="bg-violet-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-violet-600">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
