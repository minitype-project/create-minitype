import { createBibliography, type ReferenceRecord } from "@minitype/minitype";

const refRecord: ReferenceRecord = {
  r01: {
    type: "inproceedings",
    authors: ["著者名1", "著者名2"],
    title: "論文タイトル",
    booktitle: "国際会議名",
    series: "CONF '24",
    pages: [1, 10],
    year: 2024,
    publisher: "Association for Computing Machinery",
    address: "New York, NY, USA",
  },
  r02: {
    type: "article",
    authors: ["Author Name1", "Author Name2"],
    title: "Article Title",
    journal: "Journal Name",
    volume: "1",
    pages: [1, 10],
    year: 2024,
    publisher: "Publisher Name",
  },
  r03: {
    type: "webpage",
    authors: ["Author Name"],
    title: "Web Page Title",
    url: "https://example.com/",
    year: 2024,
    accessDate: "2024-01-01",
  },
};

export const { cite, bibliography } = createBibliography(refRecord);
