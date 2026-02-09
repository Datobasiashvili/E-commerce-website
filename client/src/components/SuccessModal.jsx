
import "../styles/successModal.css";

export default function SuccessModal({ message, onClose }){
    return (
        <div className="modal-page">
            <div>
                <p>{message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    )
}