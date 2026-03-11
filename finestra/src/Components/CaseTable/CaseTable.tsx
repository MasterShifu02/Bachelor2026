import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
function CaseTable() {
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
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>vindusfeil</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
export default CaseTable;
