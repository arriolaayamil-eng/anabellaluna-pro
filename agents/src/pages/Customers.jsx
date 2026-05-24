import React, { useMemo } from 'react';

import { customersData } from '../data/dummy';
import { Header } from '../components';
import { DataTable } from '../components/ui/DataTable';

const columns = [
  {
    accessorKey: 'CustomerName',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          className="rounded-full w-9 h-9 object-cover"
          src={row.original.CustomerImage}
          alt={row.original.CustomerName}
        />
        <div>
          <p className="font-medium text-sm">{row.original.CustomerName}</p>
          <p className="text-xs text-gray-500">{row.original.CustomerEmail}</p>
        </div>
      </div>
    ),
  },
  { accessorKey: 'ProjectName', header: 'Project Name' },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ backgroundColor: row.original.StatusBg }}
        />
        <span className="capitalize text-sm">{row.original.Status}</span>
      </div>
    ),
  },
  { accessorKey: 'Weeks', header: 'Weeks' },
  { accessorKey: 'Budget', header: 'Budget' },
  { accessorKey: 'Location', header: 'Location' },
  { accessorKey: 'CustomerID', header: 'Customer ID' },
];

const Customers = () => {
  const data = useMemo(() => customersData, []);

  return (
    <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
      <Header category="Page" title="Customers" />
      <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-sm p-4">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search customers..."
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default Customers;
