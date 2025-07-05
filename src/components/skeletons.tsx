import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TableSkeletonProps {
  columnCount: number
}

export default function TableSkeleton({ columnCount }: TableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(columnCount)].map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-6 w-full bg-gray-300" />{' '}
              {/* Aumenta la altura y cambia el color de fondo */}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {[...Array(columnCount)].map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-6 w-full bg-gray-300" />{' '}
                {/* Aumenta la altura y cambia el color de fondo */}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
