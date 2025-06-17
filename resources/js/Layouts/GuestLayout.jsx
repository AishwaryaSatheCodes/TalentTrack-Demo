import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import Threads from "../blocks/Backgrounds/Threads/Threads";

export default function GuestLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900 dark:text-gray-100 border dark:border-gray-600">
      {/* Background Threads */}
      <Threads
        className="absolute top-0 left-0 w-full h-full z-0"
        amplitude={5}
        distance={0.3}
        enableMouseInteraction={true}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
          </Link>
        </div>
        <div className="mt-6 w-full overflow-hidden dark:bg-opacity-90 bg-white dark:bg-gray-700 dark:text-gray-100 border dark:border-gray-600 px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg ">
          {children}
        </div>
      </div>
    </div>
  );
}
