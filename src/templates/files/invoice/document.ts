import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Body } from "minitype";
import {
  box,
  cmyk,
  easytable,
  flexbox,
  fr,
  H,
  h2,
  p,
  physical,
  Q,
  ratio,
  solid,
  vspace,
} from "minitype";
import { parse } from "yaml";

// ------
// 型定義
// ------
type InvoiceItem = {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

type InvoiceData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  issuer: {
    name: string;
    company: string;
    address: string;
    phone: string;
    email: string;
    bankInfo: string;
  };
  recipient: {
    name: string;
    address: string;
  };
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
};

// ------
// YAML データの読み込み
// ------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const invoice = parse(
  readFileSync(path.join(__dirname, "document.yaml"), "utf-8"),
) as InvoiceData;

// ------
// 金額計算
// ------
const formatMoney = (amount: number) => {
  return `¥${amount.toLocaleString("ja-JP")}`;
};

const subtotal = invoice.items.reduce(
  (sum, item) => sum + item.quantity * item.unitPrice,
  0,
);
const tax = Math.floor(subtotal * invoice.taxRate);
const total = subtotal + tax;

// ------
// レイアウト
// ------
export const body: Body = [
  // タイトル・ヘッダ
  flexbox([
    box(
      [
        p("請求書", {
          font: "SourceHanSansJP-Bold",
          size: Q(24),
          lineHeight: H(36),
        }),
        p(`No. ${invoice.invoiceNumber}`),
        p(`発行日：${invoice.issueDate}`),
        p(`支払期限：${invoice.dueDate}`),
      ],
      { flexBasis: ratio(0.5) },
    ),
    box(
      [
        p(invoice.issuer.name, {
          align: "right",
          font: "SourceHanSansJP-Bold",
        }),
        p(invoice.issuer.company, {
          align: "right",
        }),
        p(invoice.issuer.address, {
          align: "right",
        }),
        p(invoice.issuer.phone, {
          align: "right",
        }),
        p(invoice.issuer.email, {
          align: "right",
        }),
      ],
      { flexBasis: ratio(0.5) },
    ),
  ]),
  vspace(8),

  // 請求先
  h2(invoice.recipient.name),
  p(invoice.recipient.address),
  vspace(8),

  // 合計金額
  p("下記の通りご請求申し上げます。"),
  vspace(4),
  box(
    [
      h2("ご請求金額"),
      p(
        [
          [
            formatMoney(total),
            {
              type: "command",
              body: [`（消費税 ${invoice.taxRate * 100}% 込）`],
              style: {
                size: Q(12),
              },
            },
          ],
        ],
        {
          font: "SourceHanSansJP-Bold",
          size: Q(22),
          lineHeight: H(32),
        },
      ),
    ],
    {
      padding: physical(6, 8),
      background: cmyk(0, 0, 0, 5),
      border: {
        type: "physical",
        bottom: solid(1, cmyk(0, 0, 0, 80)),
      },
    },
  ),
  vspace(8),

  // 明細表
  h2("明細"),
  vspace(2),
  easytable(
    [
      // ヘッダ行
      [
        p("品目・内容", { firstIndent: 0 }),
        p("数量", { align: "center" }),
        p("単位", { align: "center" }),
        p("単価", { align: "right" }),
        p("金額", { align: "right" }),
      ],
      // 明細行
      ...invoice.items.map((item) => [
        p(item.description, {}),
        p(String(item.quantity), { align: "center" }),
        p(item.unit, { align: "center" }),
        p(formatMoney(item.unitPrice), {
          align: "right",
        }),
        p(formatMoney(item.quantity * item.unitPrice), {
          align: "right",
        }),
      ]),
    ],
    {
      columnWidths: [fr(1), 20, 20, 35, 40],
      cellPadding: physical(2, 3),
      horizontalBorders: (rowIndex: number, rowCount: number) => {
        if (rowIndex === 0 || rowIndex === rowCount) {
          return solid(0.4, cmyk(0, 0, 0, 100));
        }
        return solid(0.2, cmyk(0, 0, 0, 100));
      },
      background: (rowIndex: number) =>
        rowIndex === 0 ? cmyk(0, 0, 0, 15) : cmyk(0, 0, 0, 0),
    },
  ),
  vspace(6),

  // 小計，税額，合計
  flexbox([
    box([], { flexBasis: ratio(0.5) }),
    box(
      [
        easytable(
          [
            [
              p("小計"),
              p(formatMoney(subtotal), {
                align: "right",
              }),
            ],
            [
              p(`消費税（${invoice.taxRate * 100}%）`),
              p(formatMoney(tax), { align: "right" }),
            ],
            [
              p("合計", { font: "SourceHanSansJP-Bold" }),
              p(formatMoney(total), {
                align: "right",
                font: "SourceHanSansJP-Bold",
              }),
            ],
          ],
          {
            columnWidths: [fr(1), 50],
            cellPadding: physical(2, 3),
            horizontalBorders: (rowIndex: number, rowCount: number) => {
              if (rowIndex === 0 || rowIndex === rowCount) {
                return solid(0.4, cmyk(0, 0, 0, 100));
              }
              return solid(0.2, cmyk(0, 0, 0, 100));
            },
          },
        ),
      ],
      { flexBasis: ratio(0.5) },
    ),
  ]),
  vspace(8),

  // 振込先・備考
  h2("振込先"),
  p(invoice.issuer.bankInfo),
  vspace(4),

  h2("備考"),
  p(invoice.notes),
];
