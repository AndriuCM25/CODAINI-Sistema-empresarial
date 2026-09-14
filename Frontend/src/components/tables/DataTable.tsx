import React from 'react';
import { motion } from 'framer-motion';
import { tc } from '../../utils/themeClasses';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-lg border ${tc.border}`}>
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-left ${tc.tableHead}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${tc.divider}`}>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.04, duration: 0.2 }}
              onClick={() => onRowClick?.(row)}
              className={`
                bg-light-surface dark:bg-codaini-navy-light
                ${onRowClick ? 'cursor-pointer' : ''}
                hover:bg-light-surface-2 dark:hover:bg-codaini-navy-lighter
                transition-colors duration-150
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`${tc.tableCell} ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : String(row[column.accessor] ?? '')}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className={`text-center py-16 ${tc.textMuted}`}>
          <p className="text-sm">No hay datos para mostrar</p>
        </div>
      )}
    </div>
  );
}

export default DataTable;
