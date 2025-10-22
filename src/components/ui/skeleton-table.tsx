import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable = ({ rows = 5, columns = 6 }: SkeletonTableProps) => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>

        <table className="w-full border-collapse border border-border">
          <thead className="bg-gridHeader">
            <tr className="border-b-2 border-foreground">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="p-3 border-r border-border">
                  <Skeleton className="h-3 w-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-border ${
                  rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="p-3 border-r border-border">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SkeletonReportCard = () => {
  return (
    <div className="border border-border p-4">
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-8 w-32 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
};
