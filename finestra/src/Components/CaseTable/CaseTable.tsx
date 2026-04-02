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
import { useNavigate } from "react-router-dom";
import { type CaseListItem } from "@/services/caseService";
function CaseTable({ allCases }: { allCases: CaseListItem[] | null }) {
  const navigate = useNavigate();
  return (
    <Table className="table-fixed w-full">
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
        {allCases?.map((caseItem) => (
          <TableRow
            key={caseItem.id}
            onClick={() => navigate(`./cases/${caseItem.id}`)}
          >
            <TableCell>{caseItem.id}</TableCell>
            <TableCell>{caseItem.damage_type}</TableCell>
            <TableCell>{caseItem.status}</TableCell>
            <TableCell>{caseItem.stores.name}</TableCell>
            <TableCell>{caseItem.updated_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default CaseTable;
