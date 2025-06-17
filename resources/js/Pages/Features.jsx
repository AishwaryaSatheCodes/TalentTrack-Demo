import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head, Link } from "@inertiajs/react";
import Threads from "@/blocks/Backgrounds/Threads/Threads";
import InfiniteScroll from "@/blocks/Components/InfiniteScroll/InfiniteScroll";
import { motion } from "framer-motion";

export default function Features() {
  const items = [
    { content: "Task and Project Tracking" },
    { content: "Role-based Access Control" },
    { content: "Dynamic Graphs & Charts" },
    { content: "Task Approval Workflow" },
    { content: "Skill-based Task Assignment" },
    { content: "Deadline Management" },
    { content: "Task Notes/Comments" },
    { content: "Intuitive Dashboard" },
    { content: "File Uploads" },
  ];

  return (
    <>
      <Head title="Features" />

      <div className="relative flex min-h-screen flex-col items-center justify-center dark:bg-gray-900 dark:text-gray-100">
        {/* 💫 Floating overlay on top of everything */}
        <div className="absolute z-30 top-10 w-full flex flex-col items-center text-center px-4">
          <Link href="/">
            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-gray-200" />
          </Link>

          <motion.h1
            className="text-4xl font-bold mt-4 text-violet-300"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            What are <span className="text-white">TalentTrack's</span> features?
          </motion.h1>
        </div>

        {/* 🧱 Base layer scroll container */}
        <div className="relative dark:bg-opacity-0 z-10 w-full max-w-full max-h-[600px] rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
          {/* 🔌 Background Threads confined to the container */}
          <Threads
            className="absolute top-0 left-0 w-full h-full z-0"
            amplitude={3}
            distance={0.3}
            enableMouseInteraction={true}
          />

          <InfiniteScroll
            className="left-30"
            items={items}
            width="20rem" // 💡 narrower scroll area
            isTilted={true}
            tiltDirection="left"
            autoplay={true}
            autoplaySpeed={1}
            autoplayDirection="up"
            pauseOnHover={true}
          />
        </div>
      </div>
    </>
  );
}
