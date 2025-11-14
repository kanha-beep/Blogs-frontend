import { useNavigate } from "react-router-dom";

export default function GoToHomePageButton() {
  const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate("/")} className="btn btn-primary">Go to Home Page</button>
    </div>
  );
}
