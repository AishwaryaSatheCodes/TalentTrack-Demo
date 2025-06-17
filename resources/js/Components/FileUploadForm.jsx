import { useState } from "react";
import { router } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function FileUploadForm({ taskId, files, userRole }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const isDeveloper =
    userRole.includes("development") && !userRole.includes("management");
  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFiles.length) return alert("Please select files!");

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files[]", file));
    formData.append("task_id", taskId);

    router.post(route("task.file.upload"), formData, {
      onSuccess: () => {
        alert("Files uploaded successfully!");
        setSelectedFiles([]);
      },
    });
  };

  const handleDelete = (fileId) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    router.delete(route("task.file.delete", { file: fileId }), {
      onSuccess: () => alert("File deleted successfully!"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 dark:bg-gray-800/95 shadow-md rounded-lg p-6 mt-8"
    >
      {isDeveloper && (
        <div>
          <h3 className="text-xl font-semibold text-gray-300 mb-4">
            Upload Files
          </h3>
          <p className="text-xs italic font-semibold text-gray-500 m-2">
            Supported File Formats: .docx, .pdf, .odt, .txt, .png, .jpg, .jpeg
          </p>
          <p className="text-xs italic font-semibold text-gray-500 m-2">
            Only files upto size 2MB can be uploaded!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-600 rounded cursor-pointer bg-gray-700 text-white"
            />
            <button
              type="submit"
              className="bg-violet-500 text-white px-6 py-2 rounded hover:bg-violet-600"
            >
              Upload Files
            </button>
          </form>
        </div>
      )}

      {/* Uploaded Files Section */}
      <h3 className="text-lg font-semibold text-gray-300 mt-6">
        Uploaded Files:
      </h3>
      {files?.length ? (
        <div className="grid grid-cols-8 gap-1 mt-4">
          {files.map((file) =>
            file?.id !== undefined && file?.file_path ? (
              <div key={file.id} className="relative w-12 h-12">
                <a
                  href={`/storage/${file.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-gray-800 w-full h-full flex items-center justify-center rounded-lg hover:bg-gray-300 shadow-md"
                >
                  {file.id}
                </a>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ) : null
          )}
        </div>
      ) : (
        <p className="text-gray-500">No files uploaded yet.</p>
      )}
    </motion.div>
  );
}
