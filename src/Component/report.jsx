import React, { useState } from 'react';
import { reportIssue } from '../api';


const ReportModal = ({ isOpen, onClose, fileId }) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Reset any previous errors
    setError('');

    if (!selectedIssue) {
      setError("Please select an issue type.");
      return;
    }

    try {
      const response = await reportIssue(fileId, selectedIssue, details);
      if (response.data) {
        alert("Issue reported successfully!");
        onClose(); // ✅ Close modal after success
      } else {
        setError('Failed to report the issue. Please try again.');
      }
    } catch (error) {
      console.error("Error reporting issue", error);
      setError(error?.response?.data?.message || "Failed to report the issue. Please try again.");
    }

    setSelectedIssue('');
    setDetails('');
  };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md relative animate-slide-down">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">Report File</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
            <select
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Select an issue</option>
              <option value="Incorrect File">Incorrect File</option>
              <option value="Misleading Title">Misleading Title</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Copyright Violation">Copyright Violation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain the issue in detail..."
              rows="4"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
