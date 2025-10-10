import { useNavigate } from "react-router-dom";
import "../styles/goBackBtn.css"

export default function GoBackBtn({ customNavigate }) {
    const navigate = useNavigate();

  return (
    <>
      <button onClick={() => {
        if(customNavigate) {
          navigate(customNavigate)
        } else {
          navigate(-1)
        }
      }} className="go-back-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="#000000ff"
        >
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        Go back
      </button>
    </>
  );
}
