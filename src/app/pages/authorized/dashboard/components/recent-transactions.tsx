import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  FilterFn,
  getSortedRowModel,
  sortingFns,
  SortingFn,
} from "@tanstack/react-table";
import {
  compareItems,
  RankingInfo,
  rankItem,
} from "@tanstack/match-sorter-utils";

import React, { useEffect, useState } from "react";
import {
  statusStyles,
  transactionStatus,
} from "../../../../../constants/status";
import { formatAmount, formatDate } from "../../../../../helpers";
import { defaultTransactionsColumns } from "constants/default-values";
import { Transaction } from "types/transaction";
import ExportTransactionsPDFButton from "app/pages/shared/transactions-export-document";

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="flex">
      <div className="flex flex-row border-secondary-light border rounded-md items-center px-2">
        <img
          src="/images/search.svg"
          alt="search"
          className="h-[15px] w-[15px] mr-2"
        />
        <input
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="form-input rounded px-2 py-1.5 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}

type RecentTransactionsTableProps = {
  isMobile?: boolean;
  transactions?: Transaction[];
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  total: number;
  setPageIndex: (val: number) => void;
  setPageSize: (val: number) => void;
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  viewTransactionDetails: (val: Transaction) => void;
};

const RecentTransactionsTable = ({
  isMobile,
  globalFilter,
  isLoading,
  pageIndex,
  pageSize,
  setGlobalFilter,
  setPageIndex,
  setPageSize,
  total,
  transactions = [],
  viewTransactionDetails,
}: RecentTransactionsTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState(defaultTransactionsColumns);

  const columnHelper = createColumnHelper<Transaction>();

  const renderStatusCell = (status: any, styles: any) => {
    return (
      <div className="w-full flex justify-center my-3">
        <div
          className={`flex flex-row justify-center ${styles.text} items-center ${styles.bg} m-3 px-3 py-1 rounded-md text-sm max-mobile:text-xs`}
        >
          <div className={`w-1.5 h-1.5 ${styles.dot} rounded-full mr-2`} />
          {status}
        </div>
      </div>
    );
  };

  const renderStatus = (status: string) => {
    const styles = statusStyles[status];
    switch (status) {
      case "completed":
        return renderStatusCell("Completed", styles);

      case "cancelled":
        return renderStatusCell("Cancelled", styles);

      case "returned":
        return renderStatusCell("Returned", styles);

      case "reserved":
        return renderStatusCell("Reserved", styles);

      default:
        break;
    }
  };

  const getTotalItems = (txn: Transaction) => {
    return txn?.items?.reduce((total, item) => total + Number(item.count), 0)
  }

  const getUserName = (txn: any, key: string) => {
    if (txn[key]) {
      return txn[key].name
    }
    return '-';
  }

  const columns = [
    columnHelper.accessor("invoiceId", {
      id: "invoiceId",
      header: () => <p className="ml-2">ID</p>,
      cell: (info) => <p className="ml-2">{info.getValue()}</p>,
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.accessor("items", {
      id: "items",
      header: "Items",
      cell: (info) => getTotalItems(info.row.original),
      sortingFn: fuzzySort,
      enableResizing: false,
      filterFn: "includesString",
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: () => <p className="text-center">Date</p>,
      cell: (info) => <p className="text-center">{formatDate(info.getValue())}</p>,
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.accessor("partsman", {
      id: "partsman",
      header: "Partsman",
      cell: (info) => getUserName(info.row.original, 'partsman'),
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.accessor("cashier", {
      id: "cashier",
      header: "Cashier",
      cell: (info) => getUserName(info.row.original, 'cashier'),
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => <div className="text-center w-full">Status</div>,
      sortingFn: fuzzySort,
      cell: (info) => renderStatus(info.getValue()),
      filterFn: "includesString",
    }),
    columnHelper.accessor("total", {
      id: "total",
      header: () => "Total",
      sortingFn: fuzzySort,
      cell: (info) => formatAmount(info.getValue()),
      filterFn: "includesString",
    }),
  ];

  useEffect(() => {
    if (isMobile) {
      setColumnVisibility((columns) => ({
        ...columns,
        view: false,
        customer: false,
        payment_method: false,
        date: false,
        actions: false,
      }));
    } else {
      setColumnVisibility(defaultTransactionsColumns);
    }
  }, [isMobile]);

  const table = useReactTable({
    data: transactions,
    columns,
    pageCount: Math.ceil(total / pageSize),
    manualPagination: true,
    manualFiltering: true,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const onFilterStatus = (status: any) => {
    setSelectedStatus(status);
    const statusColumn = table.getColumn("status");
    statusColumn?.setFilterValue(status.value);
  };

  const [selectedStatus, setSelectedStatus] = useState(transactionStatus[0]);

  return (
    <div className="my-5 grow flex flex-col text-primary">
      <div className="flex flex-row">
        <div className="flex-1">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 font-lg shadow border border-block"
            placeholder="Search..."
          />
        </div>
        <div className="justify-end items-end">
          {/* <button className="px-4 py-2 rounded-lg bg-secondary-medium text-black font-medium mx-3">
            Download PDF
          </button> */}
          <ExportTransactionsPDFButton />
        </div>
      </div>
      <div className="w-full overflow-auto rounded-t-lg border mt-5">
        <table className="table-auto w-full rounded-t-lg text-primary max-mobile:text-xs">
          <thead className="bg-secondary-medium border-b border-gray-400 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-left text-primary-light py-2"
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          {!isLoading && (
            <tbody className="font-medium">
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} onClick={() => viewTransactionDetails(row.original)} className="border-b border-gray-300 cursor-pointer">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
        {isLoading && (
          <div className="flex items-center justify-center my-5">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
          </div>
        )}
        {!isLoading && transactions.length === 0 && (
          <div className="flex items-center justify-center my-5">
            <p className="text-primary font-regular text-md">
              No Transactions to Show
            </p>
          </div>
        )}
      </div>
      <div className="h-2" />
      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;
