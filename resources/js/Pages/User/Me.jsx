import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import Threads from "@/blocks/Backgrounds/Threads/Threads";
import ActivityHeatmap from "@/Components/ActivityHeatmap";
import SkillRadarChart from "@/Components/SkillRadarChart";
import WorkloadGauge from "@/Components/WorkloadGauge";
import TaskAnalytics from "@/Components/TaskAnalytics";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Me({
  auth,
  user,
  userRoles,
  viewedUserRoles,
  userSkills,
  analytics,
  skillRadar,
  workloadGauge,
  heatmapActivity,
  userReport,
}) {
  console.log("skill radar prop", { skillRadar });

  const generatePDF = () => {
    const doc = new jsPDF();

    // Define color constants
    const lavender = "#8e44ad"; // rich lavender
    const lightViolet = "#f3e5f5"; // very light violet for table fills

    // Header
    doc.setTextColor(lavender);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      "TalentTrack - Project Insights",
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );

    doc.setFontSize(14);
    doc.setTextColor("#000"); // revert to black for normal text
    doc.text(`${userReport.name}'s Detailed Report`, 14, 30);

    // Basic Info Table
    autoTable(doc, {
      startY: 36,
      theme: "grid",
      styles: { fontSize: 11, fillColor: lightViolet },
      headStyles: { fillColor: lavender, textColor: "#fff" },
      head: [["Field", "Value"]],
      body: [
        ["User ID", userReport.id],
        ["Email", userReport.email],
        ["Email Verified At", userReport.email_verified_at],
        ["Account Created", userReport.created_at],
      ],
    });

    // Roles Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      styles: { fontSize: 11, fillColor: lightViolet },
      headStyles: { fillColor: lavender, textColor: "#fff" },
      head: [["Roles"]],
      body: userReport.roles.map((r) => [r.name]),
    });

    // Skills Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      styles: { fontSize: 11, fillColor: lightViolet },
      headStyles: { fillColor: lavender, textColor: "#fff" },
      head: [["Skills"]],
      body: userReport.skills.map((s) => [s.name]),
    });

    // Tasks Header
    const taskTableStartY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#000");
    doc.text(`${userReport.name}'s Tasks`, 14, taskTableStartY);

    // Tasks Table
    autoTable(doc, {
      startY: taskTableStartY + 6,
      head: [
        [
          "Name",
          "Due",
          "Status",
          "Priority",
          "Project",
          "Completed",
          "Files",
          "Skills Used",
        ],
      ],
      body: userReport.tasks.map((task) => [
        task.name,
        task.due_date,
        task.status,
        task.priority,
        task.project?.name || "N/A",
        task.completion_date || "N/A",
        `${task.files.length}`,
        task.skills.map((s) => s.name).join(", "),
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 1.5,
        overflow: "linebreak",
        fillColor: lightViolet,
      },
      headStyles: {
        fillColor: lavender,
        textColor: "#fff",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 20 },
        2: { cellWidth: 18 },
        3: { cellWidth: 18 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 },
        6: { cellWidth: 10 },
        7: { cellWidth: 50 },
      },
      margin: { left: 10, right: 10 },
    });

    // --- New tables start here ---

    // 1. Workload Summary Table
    const workloadStartY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(lavender);
    doc.text("Workload Summary", 14, workloadStartY - 5);

    autoTable(doc, {
      startY: workloadStartY,
      theme: "grid",
      styles: { fontSize: 11, fillColor: lightViolet },
      headStyles: { fillColor: lavender, textColor: "#fff" },
      head: [["Metric", "Value"]],
      body: [
        ["User Task Count", workloadGauge.userTaskCount.toString()],
        ["Team Average Task Count", workloadGauge.averageTaskCount.toFixed(2)],
        ["Team Max Task Count", workloadGauge.maxTaskCount.toString()],
      ],
    });

    // 2. Task Analytics Table
    const taskAnalyticsStartY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(lavender);
    doc.text("Task Analytics", 14, taskAnalyticsStartY - 5);

    autoTable(doc, {
      startY: taskAnalyticsStartY,
      theme: "grid",
      styles: { fontSize: 11, fillColor: lightViolet },
      headStyles: { fillColor: lavender, textColor: "#fff" },
      head: [["Status", "Count / Time"]],
      body: [
        ["Total Tasks", analytics.totalTasks.toString()],
        ["Completed Tasks", analytics.tasksCompleted.toString()],
        ["Pending Tasks", analytics.tasksPending.toString()],
        ["In Progress Tasks", analytics.tasksInProgress.toString()],
        ["Sent For Approval Tasks", analytics.tasksSentForApproval.toString()],
        [
          "Average Completion Time (hours)",
          analytics.avgCompletionTime
            ? analytics.avgCompletionTime.toFixed(2)
            : "N/A",
        ],
      ],
    });

    doc.save(`TalentTrack_${userReport.name}_Report.pdf`);
  };

  //------------------------------------------------
  const isAdmin = userRoles.includes("admin");
  const isDevelopment = viewedUserRoles.includes("development");
  const { data, setData, post, processing } = useForm({
    role: "",
    skill_ids: Array.isArray(user.skills)
      ? user.skills.map((skill) => skill.id)
      : [],
  });

  const handleRoleAssignment = (role) => {
    router.post(
      route("user.assignRole", { user: user.id }),
      { role },
      {
        preserveScroll: true,
      }
    );
  };

  const handleRoleDetachment = (role) => {
    router.post(
      route("user.detachRole", { user: user.id }),
      { role },
      {
        preserveScroll: true,
        onSuccess: () => {
          router.reload({ only: ["userRoles"] }); // or just reload roles
        },
      }
    );
  };

  const roleDisplayNames = {
    admin: "Admin",
    management: "Management",
    development: "Development",
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`User "${user.name}"`} />
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
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="overflow-hidden gray-800/90 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-6 text-center text-white">
              {/* User Info */}
              <div className="flex flex-col items-center gap-2 mb-6">
                {/* ID Badge */}
                <div className="flex items-center gap-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-violet-600/20 text-violet-200 rounded-full shadow-sm border border-violet-500">
                    {user.id}
                  </span>

                  <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                    {user.name}
                  </h1>
                </div>

                {/* User Roles as Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {viewedUserRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-violet-500/10 text-violet-200 border border-violet-400 rounded-full shadow-sm backdrop-blur-md"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admin Role Controls */}
              {isAdmin && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-violet-300 mb-1">
                    Role Management
                  </h2>
                  <p className="text-sm text-gray-300 mb-4 max-w-xl mx-auto">
                    Assign or revoke roles to manage {user.name}'s access and
                    capabilities within TalentTrack. Each role grants different
                    privileges.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {Object.keys(roleDisplayNames).map((role) => {
                      const hasRole = viewedUserRoles.includes(role);

                      return (
                        <button
                          key={role}
                          onClick={() =>
                            hasRole
                              ? handleRoleDetachment(role)
                              : handleRoleAssignment(role)
                          }
                          disabled={processing}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium shadow-sm transition-all duration-200 ${
                            hasRole
                              ? "bg-pink-500/10 hover:bg-pink-600/30 border-pink-400 text-pink-200"
                              : "bg-violet-500/10 hover:bg-violet-600/30 border-violet-400 text-violet-200"
                          }`}
                        >
                          {hasRole
                            ? `Revoke ${roleDisplayNames[role]}`
                            : `Assign ${roleDisplayNames[role]}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {isDevelopment && (
              <>
                {/* Skills Used */}
                {user.skills?.length > 0 && (
                  <div className="mt-6 text-left">
                    <h2 className="text-lg font-semibold text-gray-300 mb-2">
                      {user.name}'s Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 text-sm rounded-full bg-white/10 backdrop-blur-md border border-violet-300 shadow-inner text-white shadow-lg"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reports & Analytics Header */}
                <h2 className="text-3xl font-bold text-center text-violet-300 mt-12 mb-2 tracking-tight">
                  User Analytics & Insights
                </h2>
                <p className="text-center max-w-2xl mx-auto text-gray-400 text-sm mb-6">
                  Explore a comprehensive overview of{" "}
                  <span className="text-white font-medium">{user.name}</span>'s
                  task activity, workload distribution, skill application, and
                  overall productivity within the team.
                </p>

                {/* Generate Report Button */}
                <div className="flex justify-center mb-12">
                  <button
                    onClick={generatePDF}
                    className="bg-violet-500/30 hover:bg-violet-500/10 text-white font-semibold py-2 px-6 rounded-2xl shadow-md transition duration-300"
                  >
                    Generate Report
                  </button>
                </div>

                {/* Container for charts */}
                <div className="flex flex-col lg:flex-row gap-10 justify-center items-stretch px-4">
                  {/* Left side */}
                  <div className="w-full lg:w-1/2 flex flex-col gap-10">
                    {/* Workload Gauge + Text */}
                    <div className="bg-gray-900/70 border border-gray-900/70 shadow-md rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-violet-100 mb-2 text-center">
                        {user.name}'s Current Workload
                      </h3>
                      <p className="text-sm text-center text-gray-300 mb-6 leading-relaxed">
                        This gauge reflects your current number of tasks
                        relative to the team’s average. Use it to monitor over-
                        or under-assignment and ensure balanced contributions.
                      </p>
                      <WorkloadGauge
                        userTaskCount={workloadGauge.userTaskCount}
                        averageTaskCount={workloadGauge.averageTaskCount}
                        maxTaskCount={workloadGauge.maxTaskCount}
                      />
                    </div>

                    {/* Task Analytics + Text */}
                    <div className="bg-gray-900/70 border border-gray-900/70 shadow-md rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-violet-100 mb-2 text-center">
                        Task Progress Overview
                      </h3>
                      <p className="text-sm text-center text-gray-300 mb-6 leading-relaxed">
                        A breakdown of all tasks{" "}
                        <span className="text-white font-medium">
                          {user.name}
                        </span>{" "}
                        worked on — from completed to pending. This snapshot
                        helps track project momentum and identify blockers.
                      </p>
                      <TaskAnalytics
                        totalTasks={analytics.totalTasks}
                        tasksCompleted={analytics.tasksCompleted}
                        tasksPending={analytics.tasksPending}
                        tasksInProgress={analytics.tasksInProgress}
                        tasksSentForApproval={analytics.tasksSentForApproval}
                        avgCompletionTime={analytics.avgCompletionTime}
                      />
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="w-full lg:w-1/2 flex flex-col gap-10">
                    {/* Activity Heatmap + Text */}
                    <div className="bg-gray-900/70 border border-gray-900/70 shadow-md rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-violet-100 mb-2 text-center">
                        Weekly Activity Heatmap
                      </h3>
                      <p className="text-sm text-center text-gray-300 mb-6 leading-relaxed">
                        This heatmap visualizes how frequently{" "}
                        <span className="text-white font-medium">
                          {user.name}
                        </span>{" "}
                        has been active. Darker shades indicate higher activity
                        — useful for spotting engagement patterns.
                      </p>
                      <ActivityHeatmap data={heatmapActivity} />
                    </div>

                    {/* Skill Radar + Text */}
                    <div className="bg-gray-900/70 border border-gray-900/70 shadow-md rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-violet-100 mb-2 text-center">
                        Skill Utilization Radar
                      </h3>
                      <p className="text-sm text-center text-gray-300 mb-6 leading-relaxed">
                        See how assigned tasks align with{" "}
                        <span className="text-white font-medium">
                          {user.name}
                        </span>
                        's strongest skills. Identify strengths and uncover
                        opportunities for development.
                      </p>
                      <SkillRadarChart skillRadar={skillRadar} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  );
}
