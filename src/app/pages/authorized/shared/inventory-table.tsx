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
import Dropdown from "./dropdown";
import { productStatus } from "../../../../constants/status";
import { NavLink, useNavigate } from "react-router";
import { ItemAction, ProductDetails } from "types/inventory";
import { useDispatch, useSelector } from "react-redux";
import { setEditProductId } from "store/slices/editProductSlice";
import { defaultInventoryColumns } from "constants/default-values";
import { setViewProductId } from "store/slices/viewProductSlice";
import { setAddProduct } from "store/slices/addProductSlice";
import ItemActionButton from "../inventory/components/item-action-button";
import { formatAmount } from "helpers";
import { RootState } from "store/store";
import ExportProductsPDFButton from "app/pages/shared/export-products";

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

type InventoryTableProps = {
  products?: ProductDetails[];
  setProductToDelete: (product: ProductDetails) => void;
  isMobile?: boolean;
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  total: number;
  status: {
    label: string;
    value: string;
  };
  setPageIndex: (val: number) => void;
  setPageSize: (val: number) => void;
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  setStatus: (val: any) => void;
  isAdmin: boolean;
};

const Table = ({
  products = [],
  setProductToDelete,
  isMobile,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  total,
  isLoading,
  globalFilter,
  setGlobalFilter,
  setStatus,
  status,
  isAdmin,
}: InventoryTableProps) => {
  const user = useSelector((state: RootState) => state.user);
  const role = user.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState(
    defaultInventoryColumns
  );

  const columnHelper = createColumnHelper<ProductDetails>();

  const renderStatusCell = (status: string, color: string, bgColor: string) => (
    <div className="w-full flex justify-center my-3">
      <div
        className={`flex flex-row justify-center text-primary-${color} items-center bg-primary-${bgColor} m-3 px-3 py-1 rounded-md text-sm`}
      >
        <div className={`w-1.5 h-1.5 bg-primary-${color} rounded-full mr-2`} />
        {status}
      </div>
    </div>
  );

  const renderStatus = (status: string) => {
    const bgColor =
      status === "available"
        ? "lightGreen"
        : status === "out_of_stock"
          ? "lightRed"
          : "lightYellow";
    const color =
      status === "available"
        ? "green"
        : status === "out_of_stock"
          ? "red"
          : "yellow";
    switch (status) {
      case "available":
        return renderStatusCell("Available", color, bgColor);

      case "out_of_stock":
        return renderStatusCell("Out of Stock", color, bgColor);

      case "low_in_stock":
        return renderStatusCell("Low in Stock", color, bgColor);

      default:
        break;
    }
  };

  const renderName = (name: string, isVariant?: boolean) => {
    return (
      <div className="max-w-[200px] line-clamp-3 my-2 flex flex-row items-center gap-1">
        {isVariant && <img src="/images/share-2.svg" alt="variant" className="h-3 w-3" />}
        {name}
      </div>
    );
  };

  const handleView = (value: ProductDetails) => {
    dispatch(setViewProductId(value?._id));
    navigate(`/${role}/view-product`);
  };

  const handleEdit = (value: ProductDetails) => {
    dispatch(setEditProductId(value?._id));
    navigate(`/${role}/edit-product`);
  };

  const handleDelete = (value: any) => {
    setProductToDelete(value);
  };

  const handleDuplicateProduct = (value: ProductDetails) => {
    dispatch(
      setAddProduct({
        ...value,
        images: value.images.map((url: any) => ({
          url: url ?? "",
          file: null,
        })),
      })
    );
    navigate(`/${role}/add-product`);
  };

  const columns = [
    columnHelper.display({
      id: "view",
      header: "",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="flex space-x-2 mx-3">
          <button onClick={() => handleView(row.original)}>
            <img
              src="/images/eye.svg"
              alt="view"
              className="h-[20px] w-[20px]"
            />
          </button>
        </div>
      ),
    }),
    columnHelper.accessor("partNumber", {
      id: "partNumber",
      header: "Part Number",
      cell: (info) => info.getValue() || "-",
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: "Name",
      cell: (info) => {
        const product = info.row.original;
        const isVariant = !!product?.parentId;
        return renderName(info.getValue(), isVariant)
      },
      sortingFn: fuzzySort,
      size: 200,
    }),
    columnHelper.accessor("price", {
      id: "price",
      header: "Price",
      cell: (info) => formatAmount(info.getValue() ?? 0),
      sortingFn: fuzzySort,
      enableResizing: false,
      enableHiding: true,
    }),
    columnHelper.accessor("quantityRemaining", {
      id: "remaining",
      header: "Remaining",
      cell: (info) => info.getValue(),
      sortingFn: fuzzySort,
      enableResizing: false,
      enableHiding: true,
    }),
    columnHelper.accessor("quantitySold", {
      id: "sold",
      header: "Sold",
      cell: (info) => info.getValue(),
      sortingFn: fuzzySort,
      enableResizing: false,
      enableHiding: true,
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      sortingFn: fuzzySort,
      cell: (info) => renderStatus(info.getValue()),
    }),
  ];

  if (isAdmin) {
    columns.push(columnHelper.display({
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      enableHiding: true,
      cell: ({ row }) => {
        const onSelect = (action: ItemAction) => {
          switch (action) {
            case "edit":
              handleEdit(row.original);
              break;
            case "duplicate":
              handleDuplicateProduct(row.original);
              break;
            case "delete":
              handleDelete(row.original);
              break;
            default:
              break;
          }
        };
        return <ItemActionButton onSelect={onSelect} />;
      },
    }),)
  }

  useEffect(() => {
    if (isMobile) {
      setColumnVisibility((columns) => ({
        ...columns,
        price: false,
        remaining: false,
        sold: false,
      }));
    } else {
      setColumnVisibility(defaultInventoryColumns);
    }
  }, [isMobile]);

  const table = useReactTable({
    data: products,
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
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-5 grow flex flex-col text-primary">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center">
        <div className="flex-1 w-full">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="w-full p-2 font-lg shadow border border-block"
            placeholder="Search..."
          />
        </div>
        <div className="flex flex-col md:flex-row justify-start md:justify-end items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
          <Dropdown
            selected={status}
            onSelect={setStatus}
            options={productStatus}
          />
          <ExportProductsPDFButton
            products={products}
            status={status}
          />
          {isAdmin && <NavLink
            to={`/${role}/add-product`}
            className="bg-primary-blue rounded-lg font-medium text-white px-3 py-2"
          >
            Add Product
          </NavLink>}
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
                            {header.id === "status" ? (
                              <div className="text-center w-full">
                                Status
                                {{
                                  asc: " 🔼",
                                  desc: " 🔽",
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            ) : (
                              <>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: " 🔼",
                                  desc: " 🔽",
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </>
                            )}
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
          )}
        </table>
        {isLoading && (
          <div className="flex items-center justify-center my-5">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
          </div>
        )}
        {!isLoading && products.length === 0 && (
          <div className="flex items-center justify-center my-5">
            <p className="text-primary font-regular text-md">
              No Products to Show
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

export default Table;
