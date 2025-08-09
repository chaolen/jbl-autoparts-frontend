import { compareItems, rankItem } from '@tanstack/match-sorter-utils';
import { ColumnFiltersState, createColumnHelper, FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingFn, sortingFns, useReactTable } from '@tanstack/react-table';
import DebouncedInput from 'app/pages/shared/debounced-input';
import { formatDate } from 'helpers';
import React, { useEffect, useState } from 'react';
import { useActivateUserMutation, useDeactivateUserMutation, useLazyGetUsersQuery, useSignUpMutation } from 'store/apis/userApi';
import { User } from 'types/user';
import AddUser from './components/add-user.modal';
import { FormikHelpers } from 'formik';
import toast from 'react-hot-toast';
import { userStatusStyles } from 'constants/status';
import * as Sentry from '@sentry/react';

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

const UsersPage = () => {

  const columnHelper = createColumnHelper<User>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [getUsers, { isLoading, isSuccess, data: usersResponse }] = useLazyGetUsersQuery();
  const [createUser] = useSignUpMutation();
  const [deactivateUser] = useDeactivateUserMutation()
  const [activateUser] = useActivateUserMutation()

  const users = usersResponse?.data.users || [];

  const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false);

  const refreshRecord = () => {
    getUsers({});
  };

  useEffect(() => {
    refreshRecord();
  }, []);

  const _deactivateUser = async (userId?: string) => {
    await deactivateUser(userId ?? '');
    refreshRecord();
  }

  const _activateUser = async (userId?: string) => {
    await activateUser(userId ?? '');
    refreshRecord();
  }

  const renderHeader = () => (
    <div className="flex flex-row">
      <p className="text-primary font-semibold text-4xl">Users</p>
      <button className="items-center ml-2" onClick={refreshRecord}>
        <img
          className="h-[15px] w-[15px]"
          src="/images/refresh.svg"
          alt="refresh"
        />
      </button>
    </div>
  );

  const renderStatusCell = (status: any, styles: any) => {
    return (
      <div className="w-full flex justify-center my-3">
        <div
          className={`flex flex-row justify-center ${styles.text} items-center ${styles.bg} m-3 px-3 py-1 rounded-md text-sm`}
        >
          <div className={`w-1.5 h-1.5 ${styles.dot} rounded-full mr-2`} />
          {status}
        </div>
      </div>
    );
  };

  const renderStatus = (active: boolean) => {
    if (active) {
      const styles = userStatusStyles.active;
      return renderStatusCell("Active", styles);
    }
    const styles = userStatusStyles.inactive;
    return renderStatusCell("Inactive", styles);
  };

  const columns = [
    columnHelper.display({
      id: "view",
      header: "",
      cell: ({ row }) => <div className="flex space-x-2 mx-2 my-3"></div>,
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: "Name",
      cell: (info) => <div className="my-3">{info.getValue()}</div>,
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.accessor("username", {
      id: "username",
      header: "Username",
      cell: (info) => info.getValue(),
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.accessor("role", {
      id: "role",
      header: "Role",
      cell: (info) => {
        const role = info.getValue();
        let roleValue = role;
        if (role === 'custom') {
          roleValue = info.row.original.customRole;
        }
        return <p className='capitalize'>{roleValue}</p>;
      },
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
    columnHelper.accessor("active", {
      id: "status",
      header: () => <div className="text-center w-full">Status</div>,
      cell: (info) => renderStatus(info.getValue() ?? true),
      sortingFn: fuzzySort,
      enableResizing: false,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const active = row.original.active;
        const userId = row.original._id;
        return (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => active ? _deactivateUser(userId) : _activateUser(userId)}
              className='px-2 py-1 rounded-lg bg-primary text-white text-xs'
            >
              {active ? "Deactivate" : "Activate"}
            </button>
          </div>
        )
      },
    }),
  ];

  const table = useReactTable({
    data: users,
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

  const onCreateUser = async (
    values: User,
    helpers: FormikHelpers<User>,
  ) => {
    try {
      await createUser(values);
      toast.success("User Created!");
      refreshRecord();
      helpers.resetForm();
      toggleAddUserModal();
    } catch (error) {
      console.error("User create failed:", error);
      toast.error("Failed to create user.");
      Sentry.captureException(error);
    }
  }

  const toggleAddUserModal = () => {
    setIsOpenAddUserModal(val => !val);
  }

  if (isLoading && !isSuccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
      </div>
    );
  }


  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-primary">Users Page</h1>
      <p className="mt-2 text-lg text-gray-600">Nothing to show.</p>
      <button onClick={toggleAddUserModal} className='mt-4 px-4 py-2 rounded-lg bg-primary text-white font-medium'>
        Add User?
      </button>
    </div>
  )

  const renderPageContent = () => (
    <>
      {renderHeader()}
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
              onClick={toggleAddUserModal}
              className="bg-primary-blue rounded-lg font-medium text-white px-3 py-2"
            >
              Add User
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
    <div className="flex flex-col p-5 py-4 w-full">
      {users.length === 0 ? renderEmptyState() : renderPageContent()}
      <AddUser
        isOpen={isOpenAddUserModal}
        onSubmit={onCreateUser}
        toggleModal={toggleAddUserModal}
      />
    </div>
  );
}

export default UsersPage;