import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiTrash2, FiLogOut, FiEdit3 } from "react-icons/fi";
import "./style/ConfirmModal.css";

const icons = {
  delete: <FiTrash2 />,
  logout: <FiLogOut />,
  update: <FiEdit3 />,
  warning: <FiAlertTriangle />,
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "warning", confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`modal-icon ${type}`}>
            {icons[type] || icons.warning}
          </div>
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
          <div className="modal-actions">
            <button className="modal-btn cancel-btn" onClick={onClose}>
              {cancelText}
            </button>
            <button className={`modal-btn confirm-btn ${type}`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
