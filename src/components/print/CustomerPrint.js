import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { LogoBase64 } from "../logo";

// Register fonts
pdfMake.vfs = pdfFonts.vfs;

export const CustomerPrint = (customer, preview = false) => {
    // console.log("Generating Customer PDF with data:", customer);

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
        pageMargins: [50, 45, 50, 45], // 10mm top/bottom, 14mm left/right
        // background: { canvas: [{ type: "rect", x: 0, y: 0, w: 210, h: 297, fillColor: "#f9fbfc" }] }, // A4 size, faint background
        content: [
            // Header: Logo and Title
            // Header: Logo only with space
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
                text: "Customer Details",
                style: "title",
                margin: [0, 20, 0, 10],
                decoration: "underline",
                decorationColor: "#0f3d3e",
            },

            // Table
            {
                table: {
                    headerRows: 1,
                    widths: [120, "*"], // Wider first column
                    body: [
                        [
                            { text: "Field", style: "tableHeader" },
                            { text: "Value", style: "tableHeader" },
                        ],
                        [
                            { text: "Customer ID", style: "tableField" },
                            { text: customer.customer_id || "-", style: "tableValue" },
                        ],
                        [
                            { text: "Name", style: "tableField" },
                            { text: customer.fullname || "-", style: "tableValue" },
                        ],
                        [
                            { text: "Status", style: "tableField" },
                            { text: customer.status || "-", style: "tableValue" },
                        ],
                        [
                            { text: "Hold Since", style: "tableField" },
                            { text: customer.hold_since || "-", style: "tableValue" },
                        ],
                        [
                            { text: "Mobile", style: "tableField" },
                            { text: customer.mobile || "-", style: "tableValue" },
                        ],
                        [
                            { text: "Email", style: "tableField" },
                            { text: customer.email || "-", style: "tableValue" },
                        ],
                        [
                            { text: "Registration Date", style: "tableField" },
                            { text: customer.reg_date || "-", style: "tableValue" },
                        ],
                        [
                            { text: "Address", style: "tableField" },
                            { text: customer.address || "-", style: "tableValue" },
                        ],
                        [
                            { text: "Remarks / Notes", style: "tableField" },
                            { text: customer.note || "-", style: "tableValue" },
                        ],
                    ],
                },
                layout: {
                    hLineColor: "#0f3d3e",
                    vLineColor: "#0f3d3e",
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    fillColor: (rowIndex) => (rowIndex % 2 === 1 ? "#f8fafc" : null),
                    paddingLeft: () => 8,
                    paddingRight: () => 8,
                    paddingTop: () => 5,
                    paddingBottom: () => 5,
                },
                margin: [0, 0, 0, 20],
            },
            // Footer
            {
                canvas: [{ type: "line", x1: 14, y1: 0, x2: 196, y2: 0, lineWidth: 0.5, lineColor: "#0f3d3e" }],
                margin: [0, 0, 0, 10],
            },
            { text: "Declaration:", style: "footerBold", margin: [14, 0, 0, 5] },
            {
                text: "This is a computer-generated document. Please retain this for your records.",
                style: "footerNormal",
                margin: [14, 0, 0, 15],
            },
            {
                columns: [
                    { text: "Printing Date:", style: "footerBold", width: 100 },
                    { text: currentDate, style: "footerNormal" },
                ],
                margin: [14, 0, 0, 5],
            },
            {
                columns: [
                    { text: "Printing Time:", style: "footerBold", width: 100 },
                    { text: currentTime, style: "footerNormal" },
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
            tableField: {
                fontSize: 12,
                bold: true,
                color: "#0f3d3e",
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
        // pdfDoc.autoPrint(); // Uncomment to enable auto-print in preview mode
        pdfDoc.open();
    } else {
        pdfDoc.download(`customer_${customer.customer_id || "NA"}.pdf`);
    }
};