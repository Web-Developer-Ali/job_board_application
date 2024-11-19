// components/FilterForm.tsx
import { Input } from "@/components/ui/input";

interface FilterOptions {
  locations: string[];
  salaryRanges: string[];
  jobTypes: string[];
}

interface FilterFormProps {
  filters: FilterOptions | null;
  location: string;
  setLocation: (location: string) => void;
  salary: string;
  setSalary: (salary: string) => void;
  type: string;
  setType: (type: string) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
  filters,
  location,
  setLocation,
  salary,
  setSalary,
  type,
  setType,
  
}) => (
  <div className="space-y-6">
    {filters?.locations && (
      <div className="space-y-2">
        <h3 className="text-base font-semibold dark:text-gray-200">Location</h3>
        <div className="space-y-2">
          {filters.locations.map((loc) => (
            <label key={loc} className="flex items-center space-x-2">
              <Input
                type="radio"
                name="location"
                value={loc}
                checked={location === loc}
                onChange={(e) => setLocation(e.target.value)}
                className="w-4 h-4 dark:bg-gray-800"
              />
              <span className="dark:text-gray-300">{loc}</span>
            </label>
          ))}
        </div>
      </div>
    )}

    {filters?.salaryRanges && (
      <div className="space-y-2">
        <h3 className="text-base font-semibold dark:text-gray-200">Salary Range</h3>
        <div className="space-y-2">
          {filters.salaryRanges.map((range) => (
            <label key={range} className="flex items-center space-x-2">
              <Input
                type="radio"
                name="salary"
                value={range}
                checked={salary === range}
                onChange={(e) => setSalary(e.target.value)}
                className="w-4 h-4 dark:bg-gray-800"
              />
              <span className="dark:text-gray-300">{range}</span>
            </label>
          ))}
        </div>
      </div>
    )}

    <div className="space-y-2">
      <h3 className="text-base font-semibold dark:text-gray-200">Job Type</h3>
      <div className="space-y-2">
        {["Full-time", "Part-time", "Freelance", "Contract"].map((jobType) => (
          <label key={jobType} className="flex items-center space-x-2">
            <Input
              type="radio"
              name="jobType"
              value={jobType}
              checked={type === jobType}
              onChange={(e) => setType(e.target.value)}
              className="w-4 h-4 dark:bg-gray-800"
            />
            <span className="dark:text-gray-300">{jobType}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export default FilterForm;
