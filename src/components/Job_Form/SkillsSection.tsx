// SkillsSection.tsx
interface SkillsSectionProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
}

export default function SkillsSection({
  skills,
  setSkills,
}: SkillsSectionProps) {
  const handleAddSkill = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const skill = event.currentTarget.value.trim();
      if (skill && !skills.includes(skill)) {
        setSkills([...skills, skill]);
        event.currentTarget.value = "";
      }
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="skills mt-4">
      <input
        type="text"
        id="skills"
        className="appearance-none block w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 dark:border-gray-700 rounded py-2 px-4"
        placeholder="Enter skills and press Enter"
        onKeyDown={handleAddSkill}
      />
      <ul className="flex flex-wrap mt-2">
        {skills.map((skill, index) => (
          <li key={index} className="mr-2 mb-2">
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
              {skill}
              <button
                className="ml-1 text-red-500"
                onClick={() => handleRemoveSkill(index)}
              >
                &times;
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
