import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import SelectInput from "@/Components/SelectInput";
import { motion } from "framer-motion";
import Threads from "@/blocks/Backgrounds/Threads/Threads";

export default function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    image: "",
    name: "",
    status: "",
    description: "",
    due_date: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("project.store"));
  };
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Projects
          </h2>
        </div>
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
        <motion.div
          className="py-12 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
              <form
                onSubmit={onSubmit}
                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
              >
                {/* Project Image */}
                <div>
                  <InputLabel
                    htmlFor="project_image_path"
                    value="Project Image"
                  />
                  <TextInput
                    id="project_image_path"
                    type="file"
                    name="image"
                    className="mt-1 p-2 block w-full"
                    onChange={(e) => setData("image", e.target.files[0])}
                  />
                  <InputError message={errors.image} className="mt-2" />
                </div>
                {/* Project Name */}
                <div>
                  <InputLabel htmlFor="project_name" value="Project Name" />
                  <TextInput
                    id="project_name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("name", e.target.value)}
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>
                {/* Project Description */}
                <div>
                  <InputLabel
                    htmlFor="project_description"
                    value="Project Description"
                  />
                  <TextAreaInput
                    id="project_description"
                    type="text"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("description", e.target.value)}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                {/* Project Due Date */}
                <div>
                  <InputLabel
                    htmlFor="project_due_date"
                    value="Project Deadline"
                  />
                  <TextInput
                    id="project_due_date"
                    type="date"
                    name="due_date"
                    value={data.due_date}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("due_date", e.target.value)}
                  />
                  <InputError message={errors.due_date} className="mt-2" />
                </div>

                {/* Project Status */}
                <div>
                  <InputLabel htmlFor="project_status" value="Project Status" />
                  <SelectInput
                    name="status"
                    id="project.status"
                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600"
                    onChange={(e) => setData("status", e.target.value)}
                  >
                    <option value="">Select Progress Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </SelectInput>
                  <InputError
                    message={errors.project_status}
                    className="mt-2"
                  />
                </div>

                <div className="mt-4 text-right">
                  <Link
                    className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                    href={route("project.index")}
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
