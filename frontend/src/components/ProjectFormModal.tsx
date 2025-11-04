// src/components/ProjectFormModal.tsx
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { toast } from "react-toastify";
import type{ Props } from "./interfaces/commonInterface";


const ProjectFormModal = ({ isOpen, onClose, onSubmit, mode, project }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project && mode === "edit") {
      setName(project.name);
      setDescription(project.description);
      setMembers(project.members || []);
    } else {
      setName("");
      setDescription("");
      setMembers([]);
    }
  }, [project, mode, isOpen]);

  const handleAddMember = () => {
    const trimmed = memberInput.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed]);
      setMemberInput("");
    }
  };

  const handleRemoveMember = (member: string) => {
    setMembers(members.filter((m) => m !== member));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Basic validation
  if (!name.trim()) {
    toast.error("Project name is required.");
    return;
  }
  if (!description.trim()) {
    toast.error("Project description is required.");
    return;
  }
  if (members.length === 0) {
    toast.error("Please add at least one project member.");
    return;
  }

  try {
    setLoading(true);
     onSubmit({
      _id: project?._id,
      name: name.trim(),
      description: description.trim(),
      members,
    });
    onClose();
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">
        {mode === "create" ? "Create New Project" : "Update Project"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Project Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Project description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Members input */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Project Members</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter member email or name"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              type="button"
              onClick={handleAddMember}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>

          {/* Display added members */}
          <div className="flex flex-wrap mt-2 gap-2">
            {members.map((member, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
              >
                {member}
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member)}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create"
              : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;
