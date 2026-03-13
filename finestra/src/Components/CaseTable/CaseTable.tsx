import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import type { Case } from "../FilterBar/dummyCases";

function CaseTable({ allCases }: { allCases: Case[] }) {
  return (
    <Table className="table-fixed w-full">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Ordrenummer</TableHead>
          <TableHead>Type sak</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Butikk</TableHead>
          <TableHead>Sist oppdatert</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allCases.map((caseItem) => (
          <TableRow key={caseItem.id}>
            <TableCell>{caseItem.id}</TableCell>
            <TableCell>{caseItem.title}</TableCell>
            <TableCell>{caseItem.store}</TableCell>
            <TableCell>{caseItem.status}</TableCell>
            <TableCell>{caseItem.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default CaseTable;
