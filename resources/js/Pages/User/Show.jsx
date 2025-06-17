import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants.jsx";

const DetailItem = ({ label, value }) => (
    <div>
        <label className="font-bold text-large text-gray-300">{label}</label>
        <p className="mt-1 text-gray-400">{value}</p>
    </div>
);

const StatusBadge = ({ text, className }) => (
    <span className={`px-3 py-1 rounded text-white ${className}`}>{text}</span>
);

export default function Show({ auth, user, tasks, queryParams, hideUserColumn, userRoles }) {
    const isAdmin = userRoles.includes('admin');
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`User "${user.name}"`} />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="py-12"
            >
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-700 p-6 text-center">

                        {/* User ID and Name Centered */}
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <span className="w-12 h-12 flex items-center justify-center bg-violet-500 text-white text-lg font-bold rounded-full">
                                {user.id}
                            </span>
                            <h1 className="text-2xl font-bold text-gray-300">{user.name}</h1>
                        </div>

                        

                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
