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
import { type Column } from "../StoreDashboard/StoreDashboard";
function CaseTable({
  allCases,
  columns,
}: {
  allCases: CaseListItem[] | null;
  columns: Column[];
}) {
  const navigate = useNavigate();
  return (
    <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.heading}>{column.heading}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {allCases?.map((caseItem) => (
          <TableRow
            key={caseItem.id}
            onClick={() => navigate(`./cases/${caseItem.id}`)}
          >
            {columns.map((column) => (
              <TableCell key={column.heading}>
                {column.accessor(caseItem)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export default CaseTable;
