import { useNavigate } from "react-router-dom";

export default function Edit({ id }) {
  console.log("id for edit: ", id);
  const navigate = useNavigate();
  return <button onClick={() => navigate(`/${id}/edit`)} className="btn btn-secondary">Edit</button>;
}
