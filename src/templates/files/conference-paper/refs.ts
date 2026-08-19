import { createBibliography, type ReferenceRecord } from "@minitype/minitype";

const refRecord: ReferenceRecord = {
  yamada2023: {
    type: "article",
    authors: ["山田 太郎", "鈴木 花子"],
    title: "〜を用いた〜の手法",
    journal: "情報処理学会論文誌",
    volume: "XX",
    number: "X",
    pages: [1, 12],
    year: 2023,
    publisher: "情報処理学会",
  },
  tanaka2023: {
    type: "inproceedings",
    authors: ["Tanaka, J.", "Sato, K."],
    title: "〜 for 〜",
    booktitle: "ACL 2023",
    pages: [100, 110],
    year: 2023,
    publisher: "Association for Computational Linguistics",
  },
  sato2022: {
    type: "inproceedings",
    authors: ["佐藤 次郎", "田中 誠", "渡辺 美穂"],
    title: "〜に基づく〜の改善",
    booktitle: "自然言語処理学会全国大会",
    pages: [50, 55],
    year: 2022,
    publisher: "言語処理学会",
  },
  smith2022: {
    type: "inproceedings",
    authors: ["Smith, A.", "et al."],
    title: "〜 with 〜",
    booktitle: "EMNLP 2022",
    pages: [200, 215],
    year: 2022,
    publisher: "Association for Computational Linguistics",
  },
};

export const { cite, bibliography } = createBibliography(refRecord);
