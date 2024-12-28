import axios from "axios";

export const fetchBibleText = async ({
  book,
  chapter,
  translation = "cuv",
}) => {
  const response = await axios.get(
    `https://bible-api.com/${book}+${chapter}?translation=${translation}`,
  );
  return response.data;
};
