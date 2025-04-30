import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileText } from 'lucide-react'

import { InvoiceProduct } from '®types/invoice'

function exportVisibleProducts(format: 'pdf' | 'csv' | 'excel', products: InvoiceProduct[]) {
    const rows = products.map((item) => [item.name, item.compatibility, item.qty])
    const headers = [['Model', 'Compatibility', 'Qty']]

    if (format === 'pdf') {
        const doc = new jsPDF()

        autoTable(doc, {
            head: headers,
            body: rows,
            theme: 'grid',
            headStyles: {
                fillColor: [243, 244, 246],
                textColor: 50,
                halign: 'center',
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: 50,
                fontSize: 10,
                halign: 'center',
            },
            styles: {
                overflow: 'linebreak',
                cellPadding: 4,
                lineWidth: 0.1,
                lineColor: [200, 200, 200],
            },
            columnStyles: {
                0: { cellWidth: 'auto', overflow: 'visible' },
            },
            margin: { top: 20 },
        })

        const now = new Date()
        const formattedDate = now.toLocaleString('en-GB').replace(/[/,: ]/g, '-')

        doc.save(`${formattedDate}.pdf`)
    }
}

type ExportDropdownProps = {
    products: InvoiceProduct[]
}

export default function Export({ products }: ExportDropdownProps) {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    isIconOnly
                    className='h-10 w-10 min-w-10 border'
                    radius='full'
                    size='sm'
                    startContent={<FileText size={20} />}
                    variant='light'
                />
            </DropdownTrigger>
            <DropdownMenu aria-label='Export Options'>
                <DropdownItem key='pdf' onPress={() => exportVisibleProducts('pdf', products)}>
                    Export as PDF
                </DropdownItem>
                <DropdownItem key='csv' onPress={() => exportVisibleProducts('csv', products)}>
                    Export as CSV
                </DropdownItem>
                <DropdownItem key='excel' onPress={() => exportVisibleProducts('excel', products)}>
                    Export as Excel
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
