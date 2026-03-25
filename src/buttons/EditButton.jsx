import { useNavigate } from "react-router-dom";

export default function Edit({ id }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/${id}/edit`)}
      className="rounded-2xl border border-[#dbe6b8] bg-[#fffdf4] px-4 py-3 text-sm font-medium text-[#364331] transition hover:bg-[#f4efcf]"
    >
      Edit story
    </button>
  );
}
