import React, { useState } from "react";
import { router } from "@inertiajs/react";

const SkillsForm = ({
  existingSkills = [],
  onAddSkill,
  onDeleteSkill,
  userRole,
}) => {
  const [newSkill, setNewSkill] = useState("");
  const isAdmin = userRole.includes("admin");
  const isDevelopment = userRole.includes("development");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSkill.trim() && isAdmin) {
      onAddSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  const handleToggleSkill = (skillId) => {
    console.log("Toggling skill with ID:", skillId);
    if (isDevelopment) {
      router.post(`/skills/toggle/${skillId}`);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Section Descriptions */}
      <div className="text-center space-y-4">
        {isAdmin && (
          <p className="text-sm italic text-gray-300">
            Add or delete skills for development users to select. This helps
            with assigning tasks based on developers' skillsets.
          </p>
        )}
        {isDevelopment && (
          <p className="text-sm italic text-gray-300">
            Select the skills that apply to you. This helps your manager assign
            you tasks based on your strengths.
          </p>
        )}
      </div>

      {/* Skill Badges */}
      <div className="bg-black/40 p-4 rounded-xl backdrop-blur-md flex flex-wrap gap-3 justify-center shadow-lg">
        {existingSkills.map((skill) => (
          <div
            key={skill.id}
            className={`${
              skill.attached && isDevelopment
                ? "bg-white/10 text-white backdrop-blur-md border border-violet-400 shadow-inner"
                : "bg-violet-100 text-violet-800"
            } px-3 py-1 rounded-full flex items-center space-x-2 shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105`}
          >
            <span className="text-sm font-medium">{skill.name}</span>

            {/* Admins can delete skills */}
            {isAdmin && (
              <button
                onClick={() => onDeleteSkill(skill.id)}
                className="text-violet-500 hover:text-red-500 text-sm transition-colors"
                title="Delete skill"
              >
                ×
              </button>
            )}

            {/* Development users can toggle skill attachment */}
            {isDevelopment && (
              <button
                onClick={() => handleToggleSkill(skill.id)}
                className="text-violet-500 hover:text-green-500 text-sm transition-colors"
                title="Toggle skill"
              >
                {skill.attached ? "-" : "+"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Skill Input Form (admins only) */}
      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-3 mt-6"
        >
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter a new skill"
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 shadow-sm bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white backdrop-blur-md"
          />
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition transform hover:scale-105"
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
};

export default SkillsForm;
