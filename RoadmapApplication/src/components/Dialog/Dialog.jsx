// dialog.jsx
import './Dialog.css';

const CustomDialog = ({ isOpen, onAcknowledge }) => {
    if (!isOpen) return null;

    return (
        <div className="custom-dialog-backdrop">
            <div className="custom-dialog-content">
                <p>A roadmap has been reset, please acknowledge this.</p>
                <button onClick={onAcknowledge}>Okay</button>
            </div>
        </div>
    );
};

export default CustomDialog;
