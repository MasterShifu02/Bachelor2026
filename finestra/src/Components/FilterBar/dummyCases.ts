export type Store = "Hamar" | "Oslo" | "Zwolle";
//export type Status = "Behandlet" | "Ubehandlet" | "Under behandling";
export const statuses = [
  "Behandlet",
  "Ubehandlet",
  "Under behandling" 
] as const;
export type Status = typeof statuses[number];

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
    title: "Sprekk i nedre hjørne",
    store: "Hamar",
    status: "Ubehandlet",
    createdAt: "2024-03-01",
  },
  {
    id: 2,
    title: "Ødelagt hengsel",
    store: "Oslo",
    status: "Behandlet",
    createdAt: "2024-03-02",
  },
  {
    id: 3,
    title: "Manglende deler",
    store: "Zwolle",
    status: "Ubehandlet",
    createdAt: "2024-03-03",
  },
  {
    id: 4,
    title: "Sprekk i treverk",
    store: "Hamar",
    status: "Under behandling",
    createdAt: "2024-03-04",
  },
  {
    id: 5,
    title: "Login issues",
    store: "Oslo",
    status: "Under behandling",
    createdAt: "2024-03-05",
  },
  {
    id: 6,
    title: "Receipt printer jam",
    store: "Zwolle",
    status: "Behandlet",
    createdAt: "2024-03-06",
  },
  {
    id: 7,
    title: "Payment terminal slow",
    store: "Hamar",
    status: "Ubehandlet",
    createdAt: "2024-03-07",
  },
  {
    id: 8,
    title: "Barcode scanner lag",
    store: "Oslo",
    status: "Behandlet",
    createdAt: "2024-03-08",
  },
  {
    id: 9,
    title: "WiFi unstable",
    store: "Zwolle",
    status: "Ubehandlet",
    createdAt: "2024-03-09",
  },
];