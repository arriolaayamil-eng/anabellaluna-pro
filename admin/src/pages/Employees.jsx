import React, { useMemo } from 'react';
import { GrLocation } from 'react-icons/gr';

import { employeesData } from '../data/dummy';
import { Header } from '../components';
import { DataTable } from '../components/ui/DataTable';

const columns = [
  {
    id: 'employee',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          className="rounded-full w-10 h-10 object-cover"
          src={row.original.EmployeeImage}
          alt={row.original.Name}
        />
        <p className="font-medium text-sm">{row.original.Name}</p>
      </div>
    ),
  },
  { accessorKey: 'Title', header: 'Designation' },
  {
    id: 'country',
    header: 'Country',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <GrLocation />
        <span>{row.original.Country}</span>
      </div>
    ),
  },
  { accessorKey: 'HireDate', header: 'Hire Date' },
  { accessorKey: 'ReportsTo', header: 'Reports To' },
  { accessorKey: 'EmployeeID', header: 'Employee ID' },
];

const Employees = () => {
  const data = useMemo(() => employeesData, []);

  return (
    <div className="min-h-screen px-6 lg:px-8 pt-4 pb-6 bg-gray-50 dark:bg-main-dark-bg">
      <Header category="Page" title="Employees" />
      <div className="bg-white dark:bg-secondary-dark-bg rounded-xl shadow-sm p-4">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search employees..."
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default Employees;
