'use client'

import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@heroui/react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FileText } from 'lucide-react'

import { InvoiceProduct } from '®types/invoice'

// Utility: Strip emojis for PDF export
function stripEmojis(text: string | null | undefined) {
    return (text || '').replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDDFF])/g,
        ''
    )
}

// Utility: Generate file name
function getFormattedFileName(extension: string) {
    const now = new Date()
    const formattedDate = now
        .toLocaleString('en-GB')
        .replace(/\//g, '-')
        .replace(/, /g, '-')
        .replace(/:/g, '-')

    return `${formattedDate}.${extension}`
}

// CSV export
function exportToCSV(headers: string[], rows: (string | number)[][]) {
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', getFormattedFileName('csv'))
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// Excel export
function exportToExcel(headers: string[], rows: (string | number)[][]) {
    const table = `
    <table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  `
    const blob = new Blob([table], {
        type: 'application/vnd.ms-excel;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', getFormattedFileName('xls'))
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// PDF/CSV/Excel Export with toast
function exportVisibleProducts(format: 'pdf' | 'csv' | 'excel', products: InvoiceProduct[]) {
    const headers = ['Model', 'Purchase', 'Qty']
    const rows = products.map((item) => [
        format === 'pdf' ? stripEmojis(item.name) : item.name,
        item.purchase_price,
        item.qty,
    ])

    const titleMap = {
        pdf: 'Exporting to PDF',
        csv: 'Exporting to CSV',
        excel: 'Exporting to Excel',
    }

    addToast({
        title: titleMap[format],
        description: 'Please wait while the file is being prepared...',
        promise: new Promise<void>((resolve, reject) => {
            try {
                if (format === 'pdf') {
                    const doc = new jsPDF('p', 'mm', 'a4')

                    autoTable(doc, {
                        head: [headers],
                        body: rows,
                        theme: 'grid',
                        headStyles: {
                            fillColor: [243, 244, 246],
                            textColor: 50,
                            halign: 'center',
                            fontStyle: 'bold',
                            valign: 'middle',
                        },
                        bodyStyles: {
                            textColor: 50,
                            fontSize: 10,
                            halign: 'center',
                            valign: 'middle',
                        },
                        styles: {
                            overflow: 'linebreak',
                            cellPadding: 4,
                            lineWidth: 0.1,
                            lineColor: [200, 200, 200],
                        },
                        columnStyles: {
                            0: { overflow: 'visible', cellWidth: 100 },
                        },
                    })

                    doc.save(getFormattedFileName('pdf'))
                } else if (format === 'csv') {
                    exportToCSV(headers, rows)
                } else {
                    exportToExcel(headers, rows)
                }
                resolve()
            } catch (error) {
                reject(error)
            }
        }),
    })
}

// WhatsApp/Clipboard Export
function exportToCopy(products: InvoiceProduct[]) {
    const lines = products.map(
        (item, index) =>
            `${index + 1}. ${stripEmojis(item.name)} - ${item.purchase_price} - Qty: ${item.qty}`
    )

    const message = ['*Model* - *Purchase* - *Qty*', ...lines].join('\n')

    addToast({
        title: 'Copying Content',
        description: 'Preparing text for clipboard...',
        promise: navigator.clipboard.writeText(message),
    })
}

// Export Dropdown Component
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
                <DropdownItem key='copy' onPress={() => exportToCopy(products)}>
                    Copy to Clipboard
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
