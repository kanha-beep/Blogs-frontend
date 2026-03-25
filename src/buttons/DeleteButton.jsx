import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

export default function DeleteButton() {
  const navigate = useNavigate();
  const { id } = useParams();

  const deleteBlogs = async () => {
    try {
      await api.delete(`/blogs/${id}/delete`);
      navigate("/");
    } catch (e) {
      alert(e?.response?.data?.message);
    }
  };

  return (
    <button
      className="rounded-2xl border border-[#f0d49e] bg-[#fff1cd] px-4 py-3 text-sm font-medium text-[#8b5a2b] transition hover:bg-[#fde8b7]"
      onClick={deleteBlogs}
    >
      Delete story
    </button>
  );
}
