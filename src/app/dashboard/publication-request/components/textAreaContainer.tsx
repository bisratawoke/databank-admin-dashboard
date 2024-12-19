import React from "react";

function TextAreaContainer({
  text,
  padding = "4",
}: {
  text: string;
  padding?: string | undefined | null;
}) {
  return (
    <div className={`border border-[#D8D8D8] p-${padding}`}>
      <p className="text-[14px] text-[#8A8888]">{text}</p>
    </div>
  );
}

export default TextAreaContainer;
