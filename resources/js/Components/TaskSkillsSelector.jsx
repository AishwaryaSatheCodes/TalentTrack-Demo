// Components/TaskSkillsSelector.jsx
import React from "react";

export default function TaskSkillsSelector({
  skills,
  selectedSkillIds,
  onChange,
}) {
  console.log("Skills received:", skills);
  const toggleSkill = (id) => {
    const newSelection = selectedSkillIds.includes(id)
      ? selectedSkillIds.filter((sid) => sid !== id)
      : [...selectedSkillIds, id];

    console.log("Updated selectedSkillIds:", newSelection);
    onChange(newSelection);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Required Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <button
            key={skill.id}
            type="button"
            onClick={() => toggleSkill(skill.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedSkillIds.includes(skill.id)
                ? "bg-white/10 backdrop-blur-md border border-violet-300 shadow-inner text-white shadow-lg"
                : "text-violet-800 bg-violet-100"
            }`}
          >
            {skill.name}
          </button>
        ))}
      </div>
    </div>
  );
}
