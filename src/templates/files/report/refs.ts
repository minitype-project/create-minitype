import { createBibliography, type ReferenceRecord } from "@minitype/minitype";

const refRecord: ReferenceRecord = {
  example2024: {
    type: "article",
    authors: ["〇〇 〇〇"],
    title: "〜に関する研究",
    journal: "〇〇学会論文誌",
    volume: "XX",
    number: "X",
    pages: [1, 10],
    year: 2024,
    publisher: "〇〇学会",
  },
  reference2023: {
    type: "inproceedings",
    authors: ["〇〇 〇〇", "〇〇 〇〇"],
    title: "〜の提案",
    booktitle: "〇〇学会全国大会",
    pages: [1, 5],
    year: 2023,
    publisher: "〇〇学会",
  },
};

export const { cite, bibliography } = createBibliography(refRecord);
