import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react"; // Optional icon
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <>
      <GuestLayout>
        <Head title="Home" />

        <div>
          <div className="relative overflow-visible">
            <motion.div className="text-center mt-20 px-4" {...fadeIn}>
              <motion.h1
                className="text-4xl font-bold mb-4 text-violet-300"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Welcome to <span className="text-white">TalentTrack</span>
              </motion.h1>
              <motion.p
                className="text-lg text-gray-200 mb-8 max-w-xl mx-auto"
                {...fadeIn}
              >
                <Typewriter
                  words={[
                    "Track your projects effortlessly.",
                    "Organize subtasks like a pro.",
                    "Align skills with requirements, easily.",
                    "Manage deadlines with confidence.",
                    "Built for teams that get things done.",
                    //"In vain I have struggled. It will not do! My feelings will not be repressed.You must allow me to tell you how ardently I admire and love you. In declaring myself thus I'm fully aware that I will be going expressly against the wishes of my family, my friends, and, I hardly need add, my own better judgement. The relative situation of our families is such that any alliance between us must be regarded as a highly reprehensible connection. Indeed as a rational man I cannot but regard it as such myself, but it cannot be helped.  Almost from the earliest moments of our acquaintance I have come to feel for you a passionate admiration and regard,  which despite of my struggles, has overcome every rational objection.  And I beg you, most fervently, to relieve my suffering and consent to be my wife.",
                  ]}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={50}
                  deleteSpeed={30}
                  delaySpeed={1500}
                />
              </motion.p>
              <motion.div
                className="flex justify-center gap-4 mb-16"
                {...fadeIn}
              >
                <Link href={route("register")}>
                  <PrimaryButton>Register</PrimaryButton>
                </Link>
                <Link href={route("login")}>
                  <PrimaryButton>Log In</PrimaryButton>
                </Link>
              </motion.div>
              <motion.div
                className="flex items-center justify-center text-purple-100 gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="text-sm font-medium">
                  <Link href={route("features")}>Explore our Features</Link>
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </GuestLayout>
    </>
  );
}
