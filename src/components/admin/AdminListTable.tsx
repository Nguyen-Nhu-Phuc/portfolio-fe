"use client";

import { ReactNode } from "react";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => ReactNode;
  className?: string;
}

interface AdminListTableProps<T> {
  columns: AdminTableColumn<T>[];
  items: T[];
  onRowClick: (index: number) => void;
  emptyMessage?: string;
  getRowClassName?: (item: T, index: number) => string | undefined;
}

export default function AdminListTable<T>({
  columns,
  items,
  onRowClick,
  emptyMessage = "No items yet.",
  getRowClassName,
}: AdminListTableProps<T>) {
  if (items.length === 0) {
    return <p className="admin-empty">{emptyMessage}</p>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className={getRowClassName?.(item, index)}
              onClick={() => onRowClick(index)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRowClick(index);
                }
              }}
            >
              {columns.map((col) => (
                <td key={col.key} className={col.className}>
                  {col.render(item, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
