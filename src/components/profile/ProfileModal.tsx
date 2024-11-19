"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./Badge & Lable";
import Button from "./Button";

interface UserData {
  preferred_location: string | string[];
  skills: string[];
  previous_companies: string[];
  resumeUrl?: string;
  experience?: number;
  linkedinProfile: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: UserData) => void;
  userData: UserData;
  isRecruiter: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  onSave,
  userData,
  isRecruiter,
}: ModalProps) => {
  const [formData, setFormData] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newCompany, setNewCompany] = useState("");

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  // Function to remove a company by index
  const handleRemoveCompany = (index: number) => {
    const updatedCompanies = formData.previous_companies.filter(
      (_: string, i: number) => i !== index
    );
    setFormData({ ...formData, previous_companies: updatedCompanies });
  };

  // Function to remove a skill by index
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = formData.skills.filter(
      (_: string, i: number) => i !== index
    );
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill("");
    }
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompany.trim()) {
      setFormData({
        ...formData,
        previous_companies: [...formData.previous_companies, newCompany],
      });
      setNewCompany("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSave(formData);
      onClose();
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-full overflow-y-auto">
          {" "}
          {/* Make modal scrollable */}
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
            Edit Profile
          </h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* Linked-In */}
            <div className="mb-4">
              <Label>LinkedIn Profile</Label>
              <input
                type="url"
                name="linkedinProfile"
                value={formData.linkedinProfile || ""}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <Label>Resume</Label>
              <input
                type="url"
                name="resumeUrl"
                value={formData.resumeUrl || ""}
                onChange={handleChange}
                className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
                required
              />
            </div>
            {!isRecruiter && (
              <>
                {/* Experience */}
                <div className="mb-4">
                  <Label>Experience (Years)</Label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience || 0}
                    onChange={handleChange}
                    className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
                    required
                  />
                </div>
                {/* Preferred Location */}
                <div className="mb-4">
                  <Label>Preferred Location</Label>
                  <input
                    type="text"
                    name="preferred_location"
                    value={formData.preferred_location || ""}
                    onChange={handleChange}
                    className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
                {/* Skills */}
                <div className="mb-4">
                  <Label>Skills</Label>
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="border w-full p-2 rounded dark:bg-gray-700 dark:text-gray-300"
                      placeholder="Add new skill"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="ml-2 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md shadow-md transition duration-150 ease-in-out"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-5 mb-2">
                    {formData.skills.map((skill: string, index: number) => (
                      <li key={index} className="flex items-center mb-2">
                        <span className="flex-1 dark:text-white">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-2 text-red-500"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Previous Companies */}
                <div className="mb-4">
                  <Label>Previous Companies</Label>
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="border w-full p-2 rounded dark:bg-gray-700 dark:text-gray-300"
                      placeholder="Add new company"
                    />
                    <button
                      type="button"
                      onClick={handleAddCompany}
                      className="ml-2 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md shadow-md transition duration-150 ease-in-out"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <ul className="list-disc pl-5 mb-2">
                  {formData.previous_companies.map(
                    (company: string, index: number) => (
                      <li key={index} className="flex items-center mb-2">
                        <span className="flex-1 dark:text-white">
                          {company}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCompany(index)}
                          className="ml-2 text-red-500"
                        >
                          Remove
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </>
            )}

            <div className="flex justify-end space-x-3">
              <Button onClick={onClose}>Cancel</Button>
              <Button
                onClick={() => handleSubmit as unknown as () => void}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
