import React from "react";
import { useNavigate } from "react-router-dom";
import GoToHomePageButton from "../buttons/GoToHomePageButton.jsx";
export default function AllButtons() {
  const navigate = useNavigate();
  const css = "btn btn-primary";
  return (
    <div>
      <GoToHomePageButton navigate={navigate} css={css} />
    </div>
  );
}
