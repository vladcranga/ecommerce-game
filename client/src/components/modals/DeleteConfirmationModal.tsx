import Modal from 'react-modal';
import React from 'react';

// Set the app element for accessibility
Modal.setAppElement('#root');

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg border-2 border-game-accent shadow-xl w-96"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 mb-4">
          <svg
            className="w-full h-full text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-game-accent mb-4">Delete Review?</h2>
        <p className="text-gray-300 text-center mb-6">
          Are you sure you want to delete this review? This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
