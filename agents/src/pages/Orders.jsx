import React, { useMemo } from 'react';

import { ordersData } from '../data/dummy';
import { Header } from '../components';
import { DataTable } from '../components/ui/DataTable';

const columns = [
  {
    id: 'image',
    header: 'Image',
    cell: ({ row }) => (
      <img
        className="rounded-xl h-16"
        src={row.original.ProductImage}
        alt={row.original.OrderItems}
      />
    ),
  },
  { accessorKey: 'OrderItems', header: 'Item' },
  { accessorKey: 'CustomerName', header: 'Customer Name' },
  {
    accessorKey: 'TotalAmount',
    header: 'Total Amount',
    cell: ({ row }) => `$${Number(row.original.TotalAmount).toFixed(2)}`,
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => (
      <button
        type="button"
        style={{ background: row.original.StatusBg }}
        className="text-white py-1 px-3 capitalize rounded-2xl text-sm"
      >
        {row.original.Status}
      </button>
    ),
  },
  { accessorKey: 'OrderID', header: 'Order ID' },
];

const Orders = () => {
  const data = useMemo(() => ordersData, []);

  return (
    <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
      <Header category="Page" title="Orders" />
      <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-sm p-4">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search orders..."
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default Orders;
