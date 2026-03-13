export type Store = "Hamar" | "Oslo" | "Zwolle";
export type Status = "Open" | "In Progress" | "Closed";

export interface Case {
  id: number;
  title: string;
  store: Store;
  status: Status;
  createdAt: string;
}

export const dummyCases: Case[] = [
  {
    id: 1,
    title: "Printer not working",
    store: "Hamar",
    status: "Open",
    createdAt: "2024-03-01",
  },
  {
    id: 2,
    title: "POS terminal offline",
    store: "Oslo",
    status: "Closed",
    createdAt: "2024-03-02",
  },
  {
    id: 3,
    title: "Network unstable",
    store: "Zwolle",
    status: "Open",
    createdAt: "2024-03-03",
  },
  {
    id: 4,
    title: "Scanner broken",
    store: "Hamar",
    status: "In Progress",
    createdAt: "2024-03-04",
  },
  {
    id: 5,
    title: "Login issues",
    store: "Oslo",
    status: "Open",
    createdAt: "2024-03-05",
  },
  {
    id: 6,
    title: "Receipt printer jam",
    store: "Zwolle",
    status: "Closed",
    createdAt: "2024-03-06",
  },
  {
    id: 7,
    title: "Payment terminal slow",
    store: "Hamar",
    status: "Open",
    createdAt: "2024-03-07",
  },
  {
    id: 8,
    title: "Barcode scanner lag",
    store: "Oslo",
    status: "In Progress",
    createdAt: "2024-03-08",
  },
  {
    id: 9,
    title: "WiFi unstable",
    store: "Zwolle",
    status: "Open",
    createdAt: "2024-03-09",
  },
];