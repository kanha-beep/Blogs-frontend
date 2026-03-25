import { useNavigate } from "react-router-dom";

export default function GoToHomePageButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="rounded-2xl bg-[#a8cb73] px-4 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b]"
    >
      Back to homepage
    </button>
  );
}
