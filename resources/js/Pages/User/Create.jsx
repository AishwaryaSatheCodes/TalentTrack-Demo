import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { motion } from "framer-motion";
import Threads from "@/blocks/Backgrounds/Threads/Threads";

export default function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    email: "",
    name: "",
    password: "",
    password_confirmation: "",
    created_at: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("user.store"));
  };
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Users
          </h2>
        </div>
      }
    >
      <Head title="Users" />
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
                {/* User Name */}
                <div>
                  <InputLabel htmlFor="user_name" value="User Name" />
                  <TextInput
                    id="user_name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("name", e.target.value)}
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>
                {/* User Email */}
                <div>
                  <InputLabel htmlFor="user_email" value="User Email" />
                  <TextInput
                    id="user_email"
                    type="text"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("email", e.target.value)}
                  />
                  <InputError message={errors.email} className="mt-2" />
                </div>

                {/* User Password */}
                <div>
                  <InputLabel htmlFor="user_password" value="User Password" />
                  <TextInput
                    id="user_password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("password", e.target.value)}
                  />
                  <InputError message={errors.password} className="mt-2" />
                </div>

                {/* User Password Confirmation */}
                <div>
                  <InputLabel
                    htmlFor="user_password_confirmation"
                    value="User Password Confirmation"
                  />
                  <TextInput
                    id="user_password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mt-1 block w-full"
                    onChange={(e) =>
                      setData("password_confirmation", e.target.value)
                    }
                  />
                  <InputError
                    message={errors.password_confirmation}
                    className="mt-2"
                  />
                </div>

                <div className="mt-4 text-right">
                  <Link
                    className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                    href={route("user.index")}
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
