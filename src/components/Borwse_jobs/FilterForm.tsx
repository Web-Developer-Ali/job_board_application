import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
        <RadioGroup value={location} onValueChange={setLocation}>
          {filters.locations.map((loc) => (
            <div key={loc} className="flex items-center space-x-2">
              <RadioGroupItem value={loc} id={`location-${loc}`} />
              <Label htmlFor={`location-${loc}`} className="text-sm dark:text-gray-300">{loc}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )}

    {filters?.salaryRanges && (
      <div className="space-y-2">
        <h3 className="text-base font-semibold dark:text-gray-200">Salary Range</h3>
        <RadioGroup value={salary} onValueChange={setSalary}>
          {filters.salaryRanges.map((range) => (
            <div key={range} className="flex items-center space-x-2">
              <RadioGroupItem value={range} id={`salary-${range}`} />
              <Label htmlFor={`salary-${range}`} className="text-sm dark:text-gray-300">{range}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )}

    <div className="space-y-2">
      <h3 className="text-base font-semibold dark:text-gray-200">Job Type</h3>
      <RadioGroup value={type} onValueChange={setType}>
        {["Full-time", "Part-time", "Freelance", "Contract"].map((jobType) => (
          <div key={jobType} className="flex items-center space-x-2">
            <RadioGroupItem value={jobType} id={`jobType-${jobType}`} />
            <Label htmlFor={`jobType-${jobType}`} className="text-sm dark:text-gray-300">{jobType}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  </div>
);

export default FilterForm;