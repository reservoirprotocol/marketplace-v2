import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState, useReducer } from 'react'
import { defaultData } from './enums'

const columnHelper = createColumnHelper()

const columns = [
  // @ts-ignore
  columnHelper.accessor('rank', {
    cell: (info) => info.getValue(),
    header: () => <span>Rank</span>,
  }),
  // @ts-ignore
  columnHelper.accessor((row) => row.codeName, {
    id: 'codeName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Code Name</span>,
  }),
  // @ts-ignore
  columnHelper.accessor('volume', {
    header: () => 'Volume',
    cell: (info) => info.renderValue(),
  }),
  // @ts-ignore
  columnHelper.accessor('potentialReward', {
    header: () => <span>Potential Reward</span>,
  }),
]

export const LeaderboardTable = () => {
  const [data, setData] = useState(() => [...defaultData])
  const rerender = useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table
      style={{
        width: '100%',
        border: '2px solid green',
        padding: '20px',
        height: '100%',
        borderRadius: '10px',
      }}
    >
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr style={{ textAlign: 'center' }} key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  )
}
