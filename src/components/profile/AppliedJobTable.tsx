export const AppliedJobTable = ({
  jobs,
}: {
  jobs: { jobTitle: string; company: string; status: string; createdAt: string }[];
}) => {
  const hasStatus = jobs.length > 0 && jobs.some(job => job.status);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="py-3 px-4 text-left border-b font-medium text-gray-900 dark:text-gray-100">
              Job Title
            </th>
            <th className="py-3 px-4 text-left border-b font-medium text-gray-900 dark:text-gray-100">
              Company
            </th>
            <th className="py-3 px-4 text-left border-b font-medium text-gray-900 dark:text-gray-100">
              {hasStatus ? "Status" : "CreatedAt"}
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center py-4 text-gray-500 dark:text-gray-400"
              >
                {hasStatus ? "No applied jobs found." : "No jobs available."}
              </td>
            </tr>
          ) : (
            jobs.map((job, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="py-3 px-4 border-b text-gray-900 dark:text-gray-100">
                  {job.jobTitle}
                </td>
                <td className="py-3 px-4 border-b text-gray-900 dark:text-gray-100">
                  {job.company}
                </td>
                <td className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">
                  {job.status ? job.status : new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
