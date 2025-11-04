import { useEffect } from "react";
import ReactDOM from "react-dom";
import type { ModalProps } from "./interfaces/commonInterface";

const Modal = ({
  isOpen,
  onClose,
  children,
  widthClass = "max-w-4xl w-[95%]",
  heightClass = "h-[80vh]",
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // prevent background scroll

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root") || document.body;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl p-6 z-10 overflow-hidden ${widthClass} ${heightClass}`}
        onClick={(e) => e.stopPropagation()} // prevent overlay close when clicking inside
      >
        {/* Scrollable inner container */}
        <div className="overflow-y-auto h-full pr-2">{children}</div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
