import React from "react";

interface FormattedTextProps {
  decoded_text: string;
  del_details: string;
  ins_details: string;
  subs_details: string;
}

const FormattedTextDisplay: React.FC<FormattedTextProps> = ({
  decoded_text,
  del_details,
  ins_details,
  subs_details,
}) => {
  // Tokenizing decodedText
  const words = decoded_text.split(" ");

  // Splits del_details to get the index and the deleted word
  const deletedWords = del_details
    ? Object.fromEntries(del_details.split(",").map((pair) => {
        const [index, word] = pair.split("-");
        return [parseInt(index)-1, word];
      }))
    : {};

  // Splits ins_details to get the index, correct word and inserted word
  const insertedWords = ins_details
    ? Object.fromEntries(ins_details.split(",").map((pair) => {
        const [index, wordData] = pair.split("-");
        const [correctWord, insertedWord] = wordData.split(":");
        return [parseInt(index)-1, { correctWord, insertedWord }];
      }))
    : {};

  // Splits subs_details to get the index, correct word and substituted word
  const substitutedWords = subs_details
    ? Object.fromEntries(subs_details.split(",").map((pair) => {
        const [index, wordData] = pair.split("-");
        const [correctWord, substitutedWord] = wordData.split(":");
        return [parseInt(index)-1, { correctWord, substitutedWord }];
      }))
    : {};

  return (
    <div
      style={{
        width: "80%",
        height: "25vh",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        fontSize: "1.1rem",
        fontFamily: "Arial, sans-serif",
        whiteSpace: "pre-wrap",
      }}
    >
      {words.map((word, index) => {
        const elements = [];

        // If in deletedWords, strikethrough and keep all the text in black
        if (deletedWords[index]) {
          elements.push(
            <span key={`del-${index}`} style={{ textDecoration: "line-through", color: "black", marginRight: "5px" }}>
              {deletedWords[index]}
            </span>
          );
        }

        // If in insertedWords, underline the inserted word keep all the text in black
        if (insertedWords[index]) {
          elements.push(
            <span key={`ins-${index}`} style={{ textDecoration: "underline", color: "black", marginRight: "2px" }}>
              {insertedWords[index].insertedWord}
            </span>
          );
          elements.push(
            <span key={`ins-correct-${index}`} style={{ color: "black", marginRight: "5px" }}>
              {insertedWords[index].correctWord}
            </span>
          );
          return <React.Fragment key={index}>{elements}</React.Fragment>;
        }

        // If in substituted words, put the correct word in brackets and keep all the tetxt in yellow
        if (substitutedWords[index]) {
          elements.push(
            <span key={`subs-${index}`} style={{ color: "#FFC300", marginRight: "5px" }}>
              {substitutedWords[index].substitutedWord} ({substitutedWords[index].correctWord})
            </span>
          );
          return <React.Fragment key={index}>{elements}</React.Fragment>;
        }

        // If it's a correct word, colour it green
        elements.push(
          <span key={`word-${index}`} style={{ color: "green", marginRight: "5px" }}>
            {word}
          </span>
        );

        return <React.Fragment key={index}>{elements}</React.Fragment>;
      })}
    </div>
  );
};

export default FormattedTextDisplay;
