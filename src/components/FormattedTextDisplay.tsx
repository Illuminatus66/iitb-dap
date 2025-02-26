import React from "react";
import { Box } from "@mui/material";

interface FormattedTextProps {
  del_details: string;
  ins_details: string;
  subs_details: string;
  correct_text: string;
}

const FormattedTextDisplay: React.FC<FormattedTextProps> = ({
  del_details,
  ins_details,
  subs_details,
  correct_text,
}) => {
  // Tokenizing correct_text
  const correctWords = correct_text
    ? correct_text.split(",").map((pair) => {
        const [index, word] = pair.split("-");
        return { index: parseInt(index) - 1, word };
      })
    : [];

  // Deleted words (strikethrough, black)
  const deletedWords = del_details
    ? Object.fromEntries(
        del_details.split(",").map((pair) => {
          const [index, actualWord] = pair.split("-");
          return [parseInt(index) - 1, actualWord];
        })
      )
    : {};

  // Splits ins_details to get the index, correct word and inserted word
  const insertedWords = ins_details
    ? Object.fromEntries(
        ins_details.split(",").map((pair) => {
          const [index, wordData] = pair.split("-");
          let [correctWord, insertedWord] = wordData.split(":");
          insertedWord =
            insertedWord === "<EOL>" ? "End of Line" : insertedWord;
          return [parseInt(index) - 1, { correctWord, insertedWord }];
        })
      )
    : {};

  // Splits subs_details to get the index, correct word and substituted word
  const substitutedWords = subs_details
    ? Object.fromEntries(
        subs_details.split(",").map((pair) => {
          const [index, wordData] = pair.split("-");
          let [correctWord, substitutedWord] = wordData.split(":");
          substitutedWord =
            substitutedWord === "<UNK>" ? "Unknown Word" : substitutedWord;
          return [parseInt(index) - 1, { correctWord, substitutedWord }];
        })
      )
    : {};

  return (
    <Box
      style={{
        width: "80%",
        height: "100%",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        fontSize: "1.1rem",
        fontFamily: "Arial, sans-serif",
        whiteSpace: 'collapse',
      }}
    >
      {correctWords.map(({ index, word }) => {
        const isInserted = insertedWords[index];
        const isSubstituted = substitutedWords[index];
        const isDeleted = deletedWords[index];

        // I just noticed that one response returned an insertion and a
        // substitution at the same index, this means we need to handle
        // more cases. This should ideally display
        // <ul>ins word</ul> ins/subs word in yellow (correct word in yellow)
        // Fortunately you cannot subs and del a word simultaneously or
        // ins something before a word that was del'd.
        return (
          <span key={index}>
            {isInserted && isSubstituted ? (
              <>
                <span
                  style={{
                    textDecoration: "underline",
                    color: "black",
                    marginRight: "5px",
                  }}
                >
                  {insertedWords[index].insertedWord}{" "}
                </span>
                <span style={{ color: "#FFC300", marginRight: "5px" }}>
                  {substitutedWords[index].substitutedWord} (<span>{word}</span>
                  )
                </span>
              </>
            ) : isInserted ? (
              <span
                style={{
                  color: "black",
                  marginRight: "5px",
                }}
              >
                <span
                  style={{
                    textDecoration: "underline",
                    color: "black",
                    marginRight: "5px",
                  }}
                >
                  {insertedWords[index].insertedWord}{" "}
                  <span style={{ textDecoration: "none", color: "black" }}>
                    {word}
                  </span>
                </span>
              </span>
            ) : isSubstituted ? (
              <span style={{ color: "#FFC300", marginRight: "5px" }}>
                {substitutedWords[index].substitutedWord} (<span>{word}</span>)
              </span>
            ) : isDeleted ? (
              <span
                style={{
                  color: "black",
                  textDecoration: "line-through",
                  marginRight: "5px",
                }}
              >
                {deletedWords[index]}
              </span>
            ) : (
              <span style={{ color: "green", marginRight: "5px" }}>{word}</span>
            )}
          </span>
        );
      })}
    </Box>
  );
};

export default FormattedTextDisplay;
