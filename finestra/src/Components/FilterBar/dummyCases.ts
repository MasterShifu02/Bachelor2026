export type Store = "Hamar" | "Oslo" | "Zwolle";
//export type Status = "Behandlet" | "Ubehandlet" | "Under behandling";
export const statuses = [
  "Behandlet",
  "Ubehandlet",
  "Under behandling",
  "Ny" 
] as const;
export type Status = typeof statuses[number];

export interface Case {
  id: string;
  title: string;
  store: Store;
  status: Status;
  createdAt: string;
}

export const dummyCases: Case[] = [
  {
    id: "11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "Sprekk i nedre hjørne",
    store: "Hamar",
    status: "Ubehandlet",
    createdAt: "2024-03-01",
  },
  {
    id: "4683c7a5-4e1e-4b51-bdb1-107b48a1e2c2",
    title: "Ødelagt hengsel",
    store: "Oslo",
    status: "Behandlet",
    createdAt: "2024-03-02",
  },
  {
    id: "4683c7a5-4e1e-4b51-bdb1-107b48a1e2c2",
    title: "Manglende deler",
    store: "Zwolle",
    status: "Ubehandlet",
    createdAt: "2024-03-03",
  },
  {
    id: "4683c7a5-4e1e-4b51-bdb1-107b48a1e2c2",
    title: "Sprekk i treverk",
    store: "Hamar",
    status: "Under behandling",
    createdAt: "2024-03-04",
  },
  {
    id: "4cf7e82f-9a2c-4c56-8025-4b63c876f50d",
    title: "Login issues",
    store: "Oslo",
    status: "Ny",
    createdAt: "2024-03-05",
  },
  {
    id: "68673070-404d-48ec-9daa-7ca70c999042",
    title: "Receipt printer jam",
    store: "Zwolle",
    status: "Ny",
    createdAt: "2024-03-06",
  },
  {
    id: "75a0769f-6bc6-478b-b496-4e2256c270ee",
    title: "Payment terminal slow",
    store: "Hamar",
    status: "Ubehandlet",
    createdAt: "2024-03-07",
  },
  {
    id: "77296487-dbb7-42dd-bf3f-4ca783d6dd71",
    title: "Barcode scanner lag",
    store: "Oslo",
    status: "Behandlet",
    createdAt: "2024-03-08",
  },
  {
    id: "77296487-dbb7-42dd-bf3f-4ca783d6dd71",
    title: "WiFi unstable",
    store: "Zwolle",
    status: "Ny",
    createdAt: "2024-03-09",
  },
];