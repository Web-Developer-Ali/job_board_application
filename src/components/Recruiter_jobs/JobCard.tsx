// JobCard.tsx
import { Job } from "@/types/job"; // Adjust the import path as necessary
import Image from "next/image";
import { MdCancel, MdCheckCircle, MdDelete, MdEdit, MdMoreHoriz, MdVisibility } from "react-icons/md";

interface JobCardProps {
    job: Job[];
    openMenuId: string | null;
    toggleMenu: (id: string) => void;
    handleView: (id: string) => void;
    handleEdit: (id: string) => void; // <-- Add handleEdit prop
    handleConfirmAction: (id: string, action: "delete" | "toggle") => void; // <-- Add handleConfirmAction prop
  }

const JobCard: React.FC<JobCardProps> = ({ job, openMenuId, toggleMenu, handleView , handleEdit , handleConfirmAction }) => {
  return (
    <div className="flex flex-col space-y-4">
    {job.map((job) => (
      <div
        key={job._id}
        className="border p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-lg transition duration-300"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {job.jobTitle}
          </h3>
          <button
            onClick={() => toggleMenu(job._id)}
            className="menu-button text-gray-600 dark:text-gray-300 focus:outline-none"
          >
            <MdMoreHoriz size={24} />
          </button>
        </div>
        <Image
          src={job.companyLogo.secure_url}
          alt="Company Logo"
          width={48}
          height={48}
          className="w-12 h-12 object-cover rounded-full mt-2"
        />

        <p className="mt-2 text-gray-900 dark:text-gray-300">
          Created At: {new Date(job.createdAt).toLocaleDateString()}
        </p>
        <span
          className={`mt-2 inline-block px-2 py-1 rounded text-gray-900 dark:text-gray-200 ${
            job.live
              ? "bg-green-100 dark:bg-green-800"
              : "bg-red-100 dark:bg-red-800"
          }`}
        >
          {job.live ? "Live" : "Not Live"}
        </span>
        {openMenuId === job._id && (
          <div className="menu mt-2">
            <button
              onClick={() => handleView(job._id)}
              className="block text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <MdVisibility size={20} />
              <span>Applicants</span>
            </button>
            <button
              onClick={() => handleEdit(job._id)}
              className="block text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <MdEdit size={20} />
              <span>Edi</span>
            </button>
            <button
                onClick={() => handleConfirmAction(job._id, "delete")}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <MdDelete size={20} />
                <span>Delete</span>
              </button>
            <button
              onClick={() => handleConfirmAction(job._id, "toggle")}
              className={`block text-left px-4 py-2 text-sm ${
                job.live
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              } hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2`}
            >
              {job.live ? (
                <>
                  <MdCancel size={20} />
                  <span>Mark as Not Live</span>
                </>
              ) : (
                <>
                  <MdCheckCircle size={20} />
                  <span>Mark as Live</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
  );
};

export default JobCard;
