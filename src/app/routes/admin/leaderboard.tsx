import { Download, FileSpreadsheet, FileText, Loader2, Trophy } from 'lucide-react'
import * as XLSX from 'xlsx-js-style'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { LeaderboardEntry } from '@/features/dashboard/types/dashboard'
import { useLeaderboardEntries } from '@/features/leaderboard/api/get-leader-board-entry'
import { formatLeaderboardName } from '@/features/leaderboard/lib/format-leaderboard-name'

type ExportRow = {
    rank: number
    name: string
    points: number
}

const EXPORT_LIMIT = 25

const getExportRows = (entries: LeaderboardEntry[]): ExportRow[] => {
    return [...entries]
        .sort((a, b) => {
            if (a.rank !== b.rank) return a.rank - b.rank
            return b.totalScore - a.totalScore
        })
        .map((entry) => ({
            rank: entry.rank,
            name: formatLeaderboardName(entry),
            points: entry.totalScore
        }))
        .slice(0, EXPORT_LIMIT)
}

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

const downloadCsv = (rows: ExportRow[]) => {
    const csv = [
        ['Rank', 'Name', 'Points'],
        ...rows.map((row) => [String(row.rank), row.name, String(row.points)])
    ]
        .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n')

    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'global-leaderboard.csv')
}

const getRankBackground = (rank: number, index: number) => {
    if (rank <= 3) return '#FFD966'
    return index % 2 === 0 ? '#EAF3FF' : '#FFFFFF'
}

const downloadStyledSpreadsheet = (rows: ExportRow[]) => {
    const worksheet = XLSX.utils.aoa_to_sheet([
        ['Rank', 'Name', 'Points'],
        ...rows.map((row) => [row.rank, row.name, row.points])
    ])

    worksheet['!cols'] = [{ wch: 12 }, { wch: 34 }, { wch: 16 }]
    worksheet['!rows'] = [{ hpt: 28 }, ...rows.map(() => ({ hpt: 24 }))]

    const border = {
        top: { style: 'thin', color: { rgb: 'D1D5DB' } },
        right: { style: 'thin', color: { rgb: 'D1D5DB' } },
        bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
        left: { style: 'thin', color: { rgb: 'D1D5DB' } }
    }

    const headerStyle = {
        font: { name: 'Manrope', sz: 16, bold: true, color: { rgb: 'FFFFFF' } },
        fill: { patternType: 'solid', fgColor: { rgb: '1F4E78' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border
    }

    const getBodyStyle = (row: ExportRow, rowIndex: number, columnIndex: number) => ({
        font: { name: 'Manrope', sz: 16, bold: row.rank <= 3 },
        fill: { patternType: 'solid', fgColor: { rgb: getRankBackground(row.rank, rowIndex).replace('#', '') } },
        alignment: {
            horizontal: columnIndex === 1 ? 'left' : 'center',
            vertical: 'center'
        },
        border
    })

    for (let columnIndex = 0; columnIndex < 3; columnIndex += 1) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: columnIndex })
        worksheet[cellAddress].s = headerStyle
    }

    rows.forEach((row, rowIndex) => {
        for (let columnIndex = 0; columnIndex < 3; columnIndex += 1) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: columnIndex })
            worksheet[cellAddress].s = getBodyStyle(row, rowIndex, columnIndex)
        }
    })

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leaderboard')
    XLSX.writeFile(workbook, 'global-leaderboard.xlsx')
}

const toPdfText = (value: string) => {
    return value
        .replace(/[^\x20-\x7E]/g, '?')
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
}

const buildPdf = (rows: ExportRow[]) => {
    const pageWidth = 612
    const pageHeight = 792
    const marginX = 54
    const startY = 720
    const lineHeight = 22
    const maxRowsPerPage = Math.floor((startY - 72) / lineHeight) - 1
    const pages: string[] = []

    for (let pageIndex = 0; pageIndex < Math.max(1, Math.ceil(rows.length / maxRowsPerPage)); pageIndex += 1) {
        const pageRows = rows.slice(pageIndex * maxRowsPerPage, (pageIndex + 1) * maxRowsPerPage)
        const lines = [
            `BT /F1 18 Tf ${marginX} 754 Td (Global Leaderboard) Tj ET`,
            `BT /F1 10 Tf ${marginX} 736 Td (Generated from current published global scores) Tj ET`,
            `BT /F1 11 Tf ${marginX} ${startY} Td (Rank) Tj ET`,
            `BT /F1 11 Tf 140 ${startY} Td (Name) Tj ET`,
            `BT /F1 11 Tf 500 ${startY} Td (Points) Tj ET`
        ]

        pageRows.forEach((row, index) => {
            const y = startY - (index + 1) * lineHeight
            lines.push(`BT /F1 10 Tf ${marginX} ${y} Td (${row.rank}) Tj ET`)
            lines.push(`BT /F1 10 Tf 140 ${y} Td (${toPdfText(row.name.slice(0, 52))}) Tj ET`)
            lines.push(`BT /F1 10 Tf 500 ${y} Td (${row.points.toLocaleString()}) Tj ET`)
        })

        lines.push(`BT /F1 9 Tf ${marginX} 38 Td (Page ${pageIndex + 1}) Tj ET`)
        pages.push(lines.join('\n'))
    }

    const objects = ['<< /Type /Catalog /Pages 2 0 R >>']
    const pageObjectIds: number[] = []
    objects.push('<< /Type /Pages /Kids [] /Count 0 >>')
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

    pages.forEach((content) => {
        const contentId = objects.length + 1
        objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
        const pageId = objects.length + 1
        pageObjectIds.push(pageId)
        objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`)
    })

    objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjectIds.length} >>`

    let pdf = '%PDF-1.4\n'
    const offsets = [0]
    objects.forEach((object, index) => {
        offsets.push(pdf.length)
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
    })

    const xrefOffset = pdf.length
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
    offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
    })
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

    return pdf
}

const downloadPdf = (rows: ExportRow[]) => {
    downloadBlob(new Blob([buildPdf(rows)], { type: 'application/pdf' }), 'global-leaderboard.pdf')
}

export default function AdminLeaderboardPage() {
    const { data: leaderboardEntries = [], isPending } = useLeaderboardEntries({})
    const rows = getExportRows(leaderboardEntries)

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Leaderboard Export</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">Download the current global leaderboard after scores are published.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending || rows.length === 0}
                        onClick={() => downloadCsv(rows)}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Download CSV
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending || rows.length === 0}
                        onClick={() => downloadStyledSpreadsheet(rows)}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Download Styled Sheet
                    </Button>
                    <Button
                        type="button"
                        disabled={isPending || rows.length === 0}
                        onClick={() => downloadPdf(rows)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Entries</p>
                            <p className="mt-1 text-3xl font-bold">{rows.length}</p>
                        </div>
                        <Trophy className="h-9 w-9 text-primary" />
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2">
                    <CardContent className="flex h-full items-center gap-3 p-6 text-sm text-muted-foreground">
                        <Download className="h-5 w-5 shrink-0 text-foreground" />
                        Exports include only the top 25 player rows with Rank, Name, and Points. Admin users are excluded from leaderboard data.
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Global Leaderboard</CardTitle>
                    <CardDescription>Preview of the data that will be included in each download.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isPending ? (
                        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading leaderboard...
                        </div>
                    ) : rows.length > 0 ? (
                        <Table className="table-fixed border-collapse border border-slate-300 font-['Manrope'] text-[16pt]">
                            <TableHeader>
                                <TableRow className="border border-slate-300 bg-[#22781f] hover:bg-[#1F4E78]">
                                    <TableHead className="w-28 border border-slate-300 text-center text-[16pt] font-bold text-white">Rank</TableHead>
                                    <TableHead className="border border-slate-300 text-[16pt] font-bold text-white">Name</TableHead>
                                    <TableHead className="w-40 border border-slate-300 text-center text-[16pt] font-bold text-white">Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow
                                        key={`${row.rank}-${row.name}`}
                                        style={{ backgroundColor: getRankBackground(row.rank, index) }}
                                        className="border border-slate-300 hover:brightness-[0.98]">
                                        <TableCell className={`border border-slate-300 text-center ${row.rank <= 3 ? 'font-bold' : 'font-semibold'}`}>
                                            #{row.rank}
                                        </TableCell>
                                        <TableCell className={`border border-slate-300 ${row.rank <= 3 ? 'font-bold' : 'font-medium'}`}>{row.name}</TableCell>
                                        <TableCell className={`border border-slate-300 text-center ${row.rank <= 3 ? 'font-bold' : 'font-semibold'}`}>
                                            {row.points.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="py-12 text-center text-sm text-muted-foreground">No leaderboard data available.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
