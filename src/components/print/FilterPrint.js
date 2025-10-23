import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { LogoBase64 } from "../logo";

// Register fonts
pdfMake.vfs = pdfFonts.vfs;

export const FilterPrint = (data, preview = false) => {
    if (!data || data.length === 0) {
        return { noData: true, message: "No data available to export" };
    }

    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    // Convert to 12-hour format (adjusted for IST, UTC+5:30)
    const rawTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[1]
        .split(".")[0]; // HH:MM:SS
    const [hours, minutes, seconds] = rawTime.split(":");
    const hh = parseInt(hours);
    const ampm = hh >= 12 ? "PM" : "AM";
    const formattedHour = hh % 12 || 12;
    const currentTime = `${formattedHour}:${minutes}:${seconds} ${ampm}`;

    // Document definition
    const docDefinition = {
        pageMargins: [14, 10, 14, 10], // 10mm top/bottom, 14mm left/right
        pageOrientation: "landscape", // To fit more columns
        background: { canvas: [{ type: "rect", x: 0, y: 0, w: 842, h: 595, fillColor: "#f9fbfc" }] }, // A4 landscape
        content: [
            // Header: Logo and Title
            {
                stack: [
                    {
                        image: LogoBase64,
                        width: 120,
                        height: 120,
                        alignment: "center", // centers horizontally
                    },
                ],
                margin: [0, 0, 0, 30], // 30px space below logo
            },
            {
                text: "Customer Report",
                style: "title",
                margin: [0, 20, 0, 10],
                decoration: "underline",
                decorationColor: "#0f3d3e",
            },
            // Table
            {
                table: {
                    headerRows: 1,
                    widths: [80, 120, 100, 80, 120, 80, 80], // Adjusted for 7 columns
                    body: [
                        [
                            { text: "Customer ID", style: "tableHeader" },
                            { text: "Name", style: "tableHeader" },
                            { text: "Registration Date", style: "tableHeader" },
                            { text: "Mobile", style: "tableHeader" },
                            { text: "Email", style: "tableHeader" },
                            { text: "Status", style: "tableHeader" },
                            { text: "Hold Since", style: "tableHeader" },
                        ],
                        ...data.map((row) => [
                            { text: row.customer_id || "-", style: "tableValue" },
                            { text: row.fullname || "-", style: "tableValue" },
                            { text: row.reg_date || "-", style: "tableValue" },
                            { text: row.mobile || "-", style: "tableValue" },
                            { text: row.email || "-", style: "tableValue" },
                            { text: row.status || "-", style: "tableValue" },
                            { text: row.hold_since || "-", style: "tableValue" },
                        ]),
                    ],
                },
                layout: {
                    hLineColor: "#0f3d3e",
                    vLineColor: "#0f3d3e",
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    fillColor: (rowIndex, node, columnIndex) => {
                        if (rowIndex === 0) return "#1a6b6c"; // Header row
                        const rowData = data[rowIndex - 1]; // Adjust for header row
                        return rowData.status === "HOLD"
                            ? "#fff3cd" // Soft yellow for HOLD
                            : rowData.status === "CLOSED"
                                ? "#f8d7da" // Soft red for CLOSED
                                : rowIndex % 2 === 1
                                    ? "#f8fafc" // Light gray for odd rows
                                    : null; // Transparent for even rows
                    },
                    paddingLeft: () => 8,
                    paddingRight: () => 8,
                    paddingTop: () => 5,
                    paddingBottom: () => 5,
                },
                margin: [0, 0, 0, 20],
            },
            // Footer
            {
                canvas: [{ type: "line", x1: 14, y1: 0, x2: 828, y2: 0, lineWidth: 0.5, lineColor: "#0f3d3e" }],
                margin: [0, 0, 0, 10],
            },
            {
                columns: [
                    { text: "Printed on:", style: "footerBold", width: 100 },
                    { text: `${currentDate} ${currentTime}`, style: "footerNormal" },
                ],
                margin: [14, 0, 0, 5],
            },
        ],
        styles: {
            title: {
                fontSize: 18,
                bold: true,
                color: "#0f3d3e",
                alignment: "center",
                letterSpacing: 1.2,
            },
            tableHeader: {
                fontSize: 12,
                bold: true,
                color: "#ffffff",
                fillColor: "#1a6b6c",
            },
            tableValue: {
                fontSize: 12,
                color: "#000000",
            },
            footerBold: {
                fontSize: 13,
                bold: true,
                color: "#0f3d3e",
            },
            footerNormal: {
                fontSize: 11,
                color: "#000000",
                italics: true,
            },
        },
        defaultStyle: {
            font: "Roboto",
        },
    };

    // Generate PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    if (preview) {
        pdfDoc.open();
    } else {
        pdfDoc.download("customer_report.pdf");
    }
};