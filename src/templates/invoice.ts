import type { Template, TemplateVars } from "./types.js";
import {
  claudeMd,
  fontsReadme,
  gitignore,
  packageJson,
  tsconfigJson,
} from "./common.js";

const indexTs = (vars: TemplateVars) => `\
import {
  minitype,
  physical,
  Q,
  H,
} from "minitype";
import { body } from "./document.js";

await minitype(
  [{ body }],
  "output.pdf",
  {
    size: "A4" as const,
    writingMode: "horizontal" as const,
    padding: physical(20, 20, 20, 20),
    block: {
      paragraph: {
        font: "SourceHanSansJP-Regular",
        size: Q(11),
        lineHeight: H(18),
        firstIndent: 0,
      },
      headings: [
        { font: "SourceHanSansJP-Bold", size: Q(18), lineHeight: H(28), firstIndent: 0 },
        { font: "SourceHanSansJP-Bold", size: Q(14), lineHeight: H(22), firstIndent: 0 },
      ],
    },
    command: {
      b: { font: "SourceHanSansJP-Bold" },
    },
    gaps: [
      ["paragraph", "paragraph", 2],
      ["fallback", "fallback", 6],
    ] as [string, string, number][],
  },
  {
    fontDir: "fonts",
  },
);
`;

const documentTs = (vars: TemplateVars) => `\
import type { Body } from "minitype";
import {
  box,
  cmyk,
  easytable,
  flexbox,
  fr,
  p,
  physical,
  Q,
  H,
  ratio,
  solid,
  vspace,
} from "minitype";

// ------
// 請求書の設定（ここを編集してください）
// ------
const invoiceConfig = {
  invoiceNumber: "INV-2024-001",
  issueDate: "${vars.year}年01月01日",
  dueDate: "${vars.year}年01月31日",

  // 発行者情報
  issuer: {
    name: "${vars.author || "発行者名"}",
    company: "会社名",
    address: "〒000-0000 東京都〇〇区〇〇",
    phone: "03-0000-0000",
    email: "contact@example.com",
    bankInfo: "〇〇銀行 〇〇支店 普通 0000000",
  },

  // 請求先情報
  recipient: {
    name: "請求先 御中",
    company: "株式会社〇〇",
    address: "〒000-0000 東京都〇〇区〇〇",
  },

  // 請求項目
  items: [
    { description: "サービス名称A", quantity: 1, unit: "式", unitPrice: 100000 },
    { description: "サービス名称B", quantity: 5, unit: "時間", unitPrice: 10000 },
    { description: "その他費用", quantity: 1, unit: "式", unitPrice: 5000 },
  ],

  taxRate: 0.1,
  notes: "お支払いは上記口座へお振込みください．振込手数料はご負担ください．",
};

// ------
// 金額計算
// ------
function formatMoney(amount: number): string {
  return "¥" + amount.toLocaleString("ja-JP");
}

const subtotal = invoiceConfig.items.reduce(
  (sum, item) => sum + item.quantity * item.unitPrice,
  0,
);
const tax = Math.floor(subtotal * invoiceConfig.taxRate);
const total = subtotal + tax;

// ------
// 請求書レイアウト
// ------
const cellStyle = {
  padding: physical(2, 3),
  border: { type: "physical" as const, bottom: solid(0.3, cmyk(0, 0, 0, 30)) },
};

const headerCellStyle = {
  padding: physical(2, 3),
  background: cmyk(0, 0, 0, 15),
  border: { type: "physical" as const, bottom: solid(0.5, cmyk(0, 0, 0, 60)) },
};

export const body: Body = [
  // ------
  // タイトル・ヘッダ
  // ------
  flexbox([
    box(
      [
        p("請求書", {
          font: "SourceHanSansJP-Bold",
          size: Q(24),
          lineHeight: H(36),
          firstIndent: 0,
        }),
        p(\`No. \${invoiceConfig.invoiceNumber}\`, { firstIndent: 0, size: Q(10), lineHeight: H(16) }),
        p(\`発行日：\${invoiceConfig.issueDate}\`, { firstIndent: 0, size: Q(10), lineHeight: H(16) }),
        p(\`支払期限：\${invoiceConfig.dueDate}\`, { firstIndent: 0, size: Q(10), lineHeight: H(16) }),
      ],
      { flexBasis: ratio(0.5) },
    ),
    box(
      [
        p(invoiceConfig.issuer.name, { align: "right" as const, firstIndent: 0, font: "SourceHanSansJP-Bold" }),
        p(invoiceConfig.issuer.company, { align: "right" as const, firstIndent: 0 }),
        p(invoiceConfig.issuer.address, { align: "right" as const, firstIndent: 0, size: Q(9), lineHeight: H(15) }),
        p(invoiceConfig.issuer.phone, { align: "right" as const, firstIndent: 0, size: Q(9), lineHeight: H(15) }),
        p(invoiceConfig.issuer.email, { align: "right" as const, firstIndent: 0, size: Q(9), lineHeight: H(15) }),
      ],
      { flexBasis: ratio(0.5) },
    ),
  ]),
  vspace(8),

  // ------
  // 請求先
  // ------
  box(
    [
      p(invoiceConfig.recipient.name, { firstIndent: 0, font: "SourceHanSansJP-Bold", size: Q(14), lineHeight: H(22) }),
      p(invoiceConfig.recipient.company, { firstIndent: 0 }),
      p(invoiceConfig.recipient.address, { firstIndent: 0, size: Q(10), lineHeight: H(17) }),
    ],
    {
      padding: physical(4, 6),
      border: { type: "physical" as const, bottom: solid(1, cmyk(0, 0, 0, 80)) },
    },
  ),
  vspace(8),

  // ------
  // 合計金額
  // ------
  box(
    [
      p("ご請求金額", { firstIndent: 0, size: Q(11), lineHeight: H(18) }),
      p(formatMoney(total), {
        firstIndent: 0,
        font: "SourceHanSansJP-Bold",
        size: Q(22),
        lineHeight: H(34),
      }),
      p(\`（消費税 \${invoiceConfig.taxRate * 100}% 込）\`, {
        firstIndent: 0,
        size: Q(9),
        lineHeight: H(15),
      }),
    ],
    {
      padding: physical(4, 8),
      background: cmyk(0, 0, 0, 5),
      border: { type: "physical" as const, bottom: solid(1.5, cmyk(0, 0, 0, 80)) },
    },
  ),
  vspace(8),

  // ------
  // 明細表
  // ------
  p("明細", { firstIndent: 0, font: "SourceHanSansJP-Bold", size: Q(12), lineHeight: H(20) }),
  vspace(3),
  easytable(
    [
      // ヘッダ行
      [
        p("品目・内容", { firstIndent: 0 }),
        p("数量", { align: "center" as const, firstIndent: 0 }),
        p("単位", { align: "center" as const, firstIndent: 0 }),
        p("単価", { align: "right" as const, firstIndent: 0 }),
        p("金額", { align: "right" as const, firstIndent: 0 }),
      ],
      // 明細行
      ...invoiceConfig.items.map((item) => [
        p(item.description, { firstIndent: 0 }),
        p(String(item.quantity), { align: "center" as const, firstIndent: 0 }),
        p(item.unit, { align: "center" as const, firstIndent: 0 }),
        p(formatMoney(item.unitPrice), { align: "right" as const, firstIndent: 0 }),
        p(formatMoney(item.quantity * item.unitPrice), { align: "right" as const, firstIndent: 0 }),
      ]),
    ],
    {
      columnWidths: [fr(1), 20, 20, 35, 40],
      horizontalBorders: (rowIndex: number, rowCount: number) => {
        if (rowIndex === 0 || rowIndex === rowCount) {
          return solid(1, cmyk(0, 0, 0, 80));
        }
        return solid(0.3, cmyk(0, 0, 0, 30));
      },
      background: (rowIndex: number) =>
        rowIndex === 0 ? cmyk(0, 0, 0, 15) : cmyk(0, 0, 0, 0),
    },
  ),
  vspace(4),

  // ------
  // 小計・税額・合計
  // ------
  flexbox([
    box([], { flexBasis: ratio(0.5) }),
    box(
      [
        easytable(
          [
            [p("小計", { firstIndent: 0 }), p(formatMoney(subtotal), { align: "right" as const, firstIndent: 0 })],
            [
              p(\`消費税（\${invoiceConfig.taxRate * 100}%）\`, { firstIndent: 0 }),
              p(formatMoney(tax), { align: "right" as const, firstIndent: 0 }),
            ],
            [
              p("合計", { firstIndent: 0, font: "SourceHanSansJP-Bold" }),
              p(formatMoney(total), { align: "right" as const, firstIndent: 0, font: "SourceHanSansJP-Bold" }),
            ],
          ],
          {
            columnWidths: [fr(1), 50],
            horizontalBorders: (rowIndex: number, rowCount: number) => {
              if (rowIndex === 0 || rowIndex === rowCount) {
                return solid(1, cmyk(0, 0, 0, 80));
              }
              return solid(0.3, cmyk(0, 0, 0, 30));
            },
          },
        ),
      ],
      { flexBasis: ratio(0.5) },
    ),
  ]),
  vspace(8),

  // ------
  // 振込先・備考
  // ------
  p("振込先", { firstIndent: 0, font: "SourceHanSansJP-Bold" }),
  p(invoiceConfig.issuer.bankInfo, { firstIndent: 0 }),
  vspace(4),
  p("備考", { firstIndent: 0, font: "SourceHanSansJP-Bold" }),
  p(invoiceConfig.notes, { firstIndent: 0 }),
];
`;

export const invoice: Template = {
  displayName: "請求書",
  description: "請求書（A4, 横組，テーブルレイアウト）",
  files: (vars) => ({
    "package.json": packageJson(vars),
    "tsconfig.json": tsconfigJson(),
    "index.ts": indexTs(vars),
    "document.ts": documentTs(vars),
    ".gitignore": gitignore(),
    "CLAUDE.md": claudeMd(vars, "invoice"),
    "fonts/README.md": fontsReadme(),
  }),
};
