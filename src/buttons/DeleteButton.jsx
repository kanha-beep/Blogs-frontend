import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

export default function DeleteButton() {
  const navigate = useNavigate();
  const { id } = useParams();
  // console.log("id for delete: ", id);
  const deleteBlogs = async () => {
    try {
      const res = await api.delete(`/blogs/${id}/delete`);
      console.log("delete blog: ", res?.data);
      navigate("/");
    } catch (e) {
      alert(e?.response?.data?.message);
    }
  };
  return (
    <div>
      <button className="btn btn-primary my-1" onClick={deleteBlogs}>
        Delete
      </button>
    </div>
  );
}
