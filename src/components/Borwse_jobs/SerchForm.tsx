import React, { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import axios from "axios";

interface Suggestions {
  jobTitles: string[];
  companies: string[];
}

interface SearchFormProps {
  onSearch: (query: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions>({
    jobTitles: [],
    companies: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      if (query) {
        debounceTimeout.current = setTimeout(async () => {
          try {
            const { data } = await axios.get(
              `/api/browse_jobs/job_SerchSuggestions?searchQuery=${query}`
            );
            setSuggestions(data);
            setShowSuggestions(true);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
          }
        }, 500);
      } else {
        setSuggestions({ jobTitles: [], companies: [] });
        setShowSuggestions(false);
      }
    },
    []
  );

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 w-full max-w-2xl mx-auto px-4 relative"
      >
        <div className="relative flex-grow">
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search for jobs..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          />
          {showSuggestions &&
            (suggestions.jobTitles.length > 0 || suggestions.companies.length > 0) && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full bg-white dark:bg-gray-700 mt-1 rounded-md shadow-lg border border-gray-200 dark:border-gray-600"
              >
                <ul className="max-h-60 overflow-auto py-1">
                  {suggestions.jobTitles.map((title, index) => (
                    <li
                      key={`title-${index}`}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-150"
                      onClick={() => selectSuggestion(title)}
                    >
                      {title}
                    </li>
                  ))}
                  {suggestions.companies.map((company, index) => (
                    <li
                      key={`company-${index}`}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-150"
                      onClick={() => selectSuggestion(company)}
                    >
                      {company}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
        <Button
          type="submit"
          className="ml-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors dark:bg-purple-700 dark:hover:bg-purple-600"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchForm;
