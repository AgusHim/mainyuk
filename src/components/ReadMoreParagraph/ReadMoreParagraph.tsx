import React, { useState } from "react";

const ReadMoreParagraph = ({
  text,
  maxLength,
}: {
  text: string;
  maxLength: number;
}) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const displayText = isTruncated ? `${text.slice(0, maxLength)}...` : text;

  return (
    <div>
      <p>{displayText}</p>
      {text.length > maxLength && (
        <button onClick={toggleTruncate} className="text-primary font-bold">
          {isTruncated ? "Selengkapnya" : "Peringkas"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreParagraph;
