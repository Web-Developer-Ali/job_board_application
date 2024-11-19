// JobTable.tsx
import { Job } from "@/types/job"; // Adjust the import path as necessary
import Image from "next/image";
import { MdMoreHoriz, MdDelete, MdVisibility, MdEdit, MdCheckCircle, MdCancel } from "react-icons/md";

interface JobTableProps {
  jobs: Job[];
  openMenuId: string | null;
  toggleMenu: (id: string) => void;
  handleView: (id: string) => void;
  handleEdit: (id: string) => void;
  handleConfirmAction: (id: string, action: "delete" | "toggle") => void;

}

const JobTable: React.FC<JobTableProps> = ({
  jobs,
  openMenuId,
  toggleMenu,
  handleView,
  handleEdit,
  handleConfirmAction,
}) => {
  return (
    <table className="min-w-full min-h-full bg-white dark:bg-gray-800 border dark:border-gray-700">
    <thead>
      <tr className="w-full text-left bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
        <th className="py-2 px-4 border-b dark:border-gray-700">
          Job Title
        </th>
        <th className="py-2 px-4 border-b dark:border-gray-700">
          Logo
        </th>
        <th className="py-2 px-4 border-b dark:border-gray-700">
          Status
        </th>
        <th className="py-2 px-4 border-b dark:border-gray-700">
          Created At
        </th>
        <th className="py-2 px-4 border-b dark:border-gray-700">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="min-h-full">
      {jobs.map((job) => (
        <tr
          key={job._id}
          className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
        >
          <td className="text-gray-900 dark:text-gray-300">
            <p className="ml-2">{job.jobTitle}</p>
          </td>
          <td className="py-2 px-4">
            <Image
              src={job.companyLogo?.secure_url}
              alt="Company Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-cover rounded-full mt-2"
            />
          </td>
          <td className="py-2 px-4">
            <span
              className={`px-2 py-1 rounded text-gray-900 dark:text-gray-200 ${
                job.live
                  ? "bg-green-100 dark:bg-green-800"
                  : "bg-red-100 dark:bg-red-800"
              }`}
            >
              {job.live ? "Live" : "Not Live"}
            </span>
          </td>
          <td className="py-2 px-4 text-gray-900 dark:text-gray-300">
            <p>{new Date(job.createdAt).toLocaleDateString()}</p>
          </td>
          <td className="py-2 px-4 flex items-center space-x-2 relative">
            <button
              onClick={() => toggleMenu(job._id)}
              className="mt-4 menu-button text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              <MdMoreHoriz size={24} />
            </button>
            {openMenuId === job._id && (
              <div className="menu absolute left-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10">
                <button
                  onClick={() => handleView(job._id)}
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <MdVisibility size={20} />
                  <span>Applicants</span>
                </button>
                <button
                  onClick={() => handleEdit(job._id)}
                  className="block w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <MdEdit size={20} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() =>
                    handleConfirmAction(job._id, "delete")
                  }
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <MdDelete size={20} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() =>
                    handleConfirmAction(job._id, "toggle")
                  }
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
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  );
};

export default JobTable;
