import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import SkillsForm from "@/Components/SkillsForm";
import { motion } from "framer-motion";
import Threads from "../../blocks/Backgrounds/Threads/Threads";
export default function Index({ auth, skills, userRole }) {
  const { props } = usePage();
  const success = props.flash?.success;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  // POST skill
  const handleAddSkill = (name) => {
    router.post("/skills", { name });
  };

  // DELETE skill
  const handleDeleteSkill = (id) => {
    router.delete(`/skills/${id}`);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <motion.div className="flex items-center justify-between" {...fadeIn}>
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Skills
          </h2>
        </motion.div>
      }
    >
      <Head title="Skills" />

      <div className="relative flex min-h-screen flex-col items-center">
        {/* Background Threads */}
        <Threads
          className="absolute top-0 left-0 w-full h-full z-0"
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
              className="overflow-hidden bg-white shadow-sm sm:rounded-lg"
              {...fadeIn}
            >
              <div className="p-6 text-gray-900 dark:bg-gray-700">
                <SkillsForm
                  existingSkills={skills}
                  onAddSkill={handleAddSkill}
                  onDeleteSkill={handleDeleteSkill}
                  userRole={userRole}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
