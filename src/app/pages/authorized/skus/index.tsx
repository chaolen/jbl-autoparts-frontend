import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  FilterFn,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  SortingFn,
} from "@tanstack/react-table";
import {
  compareItems,
  RankingInfo,
  rankItem,
} from "@tanstack/match-sorter-utils";

import React, { useCallback, useEffect, useState } from "react";
import { formatDate } from "../../../../helpers";
import AddSKUs from "../shared/add-skus";
import { useDeleteSKUMutation, useLazyGetSKUsQuery } from "store/apis/skusApi";
import { SKU } from "types/sku";
import DebouncedInput from "app/pages/shared/debounced-input";
import { useDispatch } from "react-redux";
import { setIsAddSKUsModalVisible } from "store/slices/appSlice";
import toast from "react-hot-toast";
import DeleteSKUModal from "./components/delete-sku-modal";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const SKUs = () => {
  const dispatch = useDispatch();
  const [
    trigger,
    { data: skusData, isLoading, isSuccess },
  ] = useLazyGetSKUsQuery();
  const [deleteSKU, deleteSKUState] = useDeleteSKUMutation();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [skuToDelete, setSKUToDelete] = useState<SKU | undefined>();

  const columnHelper = createColumnHelper<SKU>();

  const openAddSkuModal = () => {
    dispatch(setIsAddSKUsModalVisible(true));
  };

  useEffect(() => {
    refreshRecord();
  }, []);

  const refreshRecord = () => {
    trigger();
  };

  const handleDelete = useCallback(async () => {
    try {
      const deleteResponse = await deleteSKU(skuToDelete?._id ?? "");
      toast.success(deleteResponse.data?.message ?? "");
      setSKUToDelete(undefined);
      refreshRecord();
    } catch (error) {
      toast.error("Sorry something went wrong, please try again later");
    }
  }, [skuToDelete]);

  const columns = [
    columnHelper.display({
      id: "view",
      header: "",
      cell: ({ row }) => <div className="flex space-x-2 mx-2 my-3"></div>,
    }),
    columnHelper.accessor("sku", {
      id: "sku",
      header: "SKU",
      cell: (info) => <div className="my-3">{info.getValue()}</div>,
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: "Created Date",
      cell: (info) => formatDate(info.getValue()),
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <button onClick={() => setSKUToDelete(row.original)}>
            <img
              src="/images/trash-2.svg"
              alt="delete"
              className="h-[20px] w-[20px]"
            />
          </button>
        </div>
      ),
    }),
  ];

  const data = skusData?.data?.skus || [];
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading && !isSuccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
      </div>
    );
  }


  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-primary">SKUs Page</h1>
      <p className="mt-2 text-lg text-gray-600">Nothing to show.</p>
      <button onClick={openAddSkuModal} className='mt-4 px-4 py-2 rounded-lg bg-primary text-white font-medium'>
        Add SKUs?
      </button>
    </div>
  );

  const renderPage = () => (
    <>
      <div className="flex flex-row">
        <p className="text-primary font-semibold text-4xl">SKUs</p>
        <button className="items-center ml-2" onClick={refreshRecord}>
          <img
            className="h-[15px] w-[15px]"
            src="/images/refresh.svg"
            alt="refresh"
          />
        </button>
      </div>
      <div className="my-5 grow flex flex-col text-primary">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center">
          <div className="flex-1">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 font-lg shadow border border-block"
              placeholder="Search..."
            />
          </div>
          <div className="flex flex-col md:flex-row justify-start md:justify-end items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={openAddSkuModal}
              className="bg-primary-blue rounded-lg font-medium text-white px-3 py-2"
            >
              Add SKUs
            </button>
          </div>
        </div>
        <div className="w-full overflow-auto rounded-t-lg border mt-5">
          <table className="table-auto w-full rounded-t-lg text-primary">
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
            <tbody className="font-medium">
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className="border-b border-gray-300">
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
          </table>
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
    </>
  )

  return (
    <div className="flex flex-col p-5 py-4 max-w-screen">
      {data?.length === 0 ? renderEmptyState() : renderPage()}
      <AddSKUs refreshRecord={refreshRecord} />
      <DeleteSKUModal
        isOpen={!!skuToDelete?._id}
        onClose={() => setSKUToDelete(undefined)}
        onDelete={handleDelete}
        sku={skuToDelete}
        state={deleteSKUState}
      />
    </div>
  );
};

export default SKUs;
