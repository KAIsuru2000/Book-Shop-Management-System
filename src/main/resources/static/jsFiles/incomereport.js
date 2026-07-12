// Window page load wuna wita dates initialize karanawa
window.addEventListener('load', () => {
    // Ada dawase date eka gannawa
    const today = new Date();
    // Me awrudude mulma dawasa gannawa (January 1)
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Inputs elements walata default dates set karanawa
    document.getElementById('startDate').value = firstDayOfYear.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
});

// Income report data generate karana main function eka
const generateIncomeReport = () => {
    // Inputs elements gannawa
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reportType = document.getElementById('reportType').value;

    // Date inputs check karanawa empty thiyeda kiyala
    if (!startDate || !endDate) {
        window.alert("Please select both Start Date and End Date!");
        return;
    }

    // Start date eka end date ekata wada wadi nam warning alert ekak denawa
    if (new Date(startDate) > new Date(endDate)) {
        window.alert("Start Date cannot be greater than End Date!");
        return;
    }

    // AJAX fetch request eka backend API ekata yawanawa data ganna
    const url = `/incomereport/data?startdate=${startDate}&enddate=${endDate}&type=${reportType}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Table table body element eka gannawa
            const tbody = document.getElementById('tableIncomeReportBody');
            // Table eke parana data clear karanawa
            tbody.innerHTML = "";

            if (data.length === 0) {
                // Data nethnam no data row ekak dapanawa
                tbody.innerHTML = `<tr><td colspan="3" class="text-center">No data found for the selected period.</td></tr>`;
                // Chart eka clear karanawa empty chart draw karala
                drawEmptyChart();
                return;
            }

            // Data list eka loop karala table ekata row set karanawa
            data.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.label}</td>
                    <td class="text-end">Rs. ${parseFloat(item.amount).toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });

            // dynamic chart title change karanawa select type matha
            document.getElementById('chartTitle').innerText = `${reportType} Income Chart`;

            // Dynamic vector SVG chart draw karana function eka call karanawa
            drawIncomeChart(data);
        })
        .catch(error => {
            console.error("Error fetching report data:", error);
            window.alert("Failed to load report data!");
        });
}

// Chart data empty wuna wita default state draw karanna yoda gannawa
const drawEmptyChart = () => {
    const svg = document.getElementById('incomeChartSvg');
    svg.innerHTML = `
        <text x="300" y="150" fill="#999" text-anchor="middle" font-family="sans-serif">No Chart Data</text>
    `;
}

// Dynamic vector SVG bar chart drawing function eka
const drawIncomeChart = (data) => {
    const svg = document.getElementById('incomeChartSvg');
    // SVG frame eka clear karanawa parana elements remove karanna
    svg.innerHTML = "";

    // Maximum amount eka hoyanawa scale limits thirnaya karanna
    let maxVal = 0;
    data.forEach(item => {
        if (item.amount > maxVal) {
            maxVal = item.amount;
        }
    });

    // value eka 0 wuna wita scaling crash wima walakwanna
    if (maxVal === 0) maxVal = 100;

    // Y-axis grid spacing limits calculate karala gannawa
    // Math.ceil use karala rounded step values gannawa
    const yMax = Math.ceil(maxVal / 1000) * 1000;
    
    // Layout and sizing variables initialize karanawa
    const width = 600;
    const height = 300;
    const paddingLeft = 70;
    const paddingRight = 40;
    const paddingTop = 30;
    const paddingBottom = 50;
    
    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    // Y-axis grid rules and labels draw karanawa
    const gridLinesCount = 5;
    for (let i = 0; i < gridLinesCount; i++) {
        const ratio = i / (gridLinesCount - 1);
        const yCoord = paddingTop + plotHeight * (1 - ratio);
        const valLabel = Math.round(yMax * ratio);

        // Grid line coordinate elements path hadanawa
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", paddingLeft);
        line.setAttribute("y1", yCoord);
        line.setAttribute("x2", width - paddingRight);
        line.setAttribute("y2", yCoord);
        line.setAttribute("stroke", "#e9e9e9");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);

        // Grid left text descriptions elements hadanawa
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", paddingLeft - 10);
        text.setAttribute("y", yCoord + 4);
        text.setAttribute("fill", "#666");
        text.setAttribute("font-size", "11");
        text.setAttribute("text-anchor", "end");
        text.setAttribute("font-family", "sans-serif");
        text.textContent = valLabel.toLocaleString();
        svg.appendChild(text);
    }

    // Bar colors array set eka
    const barColors = ["#e91e63", "#4caf50", "#9c27b0", "#ffeb3b", "#00bcd4", "#ff9800", "#3f51b5"];
    
    // Horizontal space calculate karanawa hema bar ekakatama
    const barCount = data.length;
    const spaceBetween = 15;
    const barWidth = (plotWidth - (spaceBetween * (barCount + 1))) / barCount;

    // Data loops karala bars construct karanawa
    data.forEach((item, idx) => {
        // Bar height scale ratio matha thiranaya karanawa
        const barHeight = (item.amount / yMax) * plotHeight;
        
        // coordinates position map calculate karanawa
        const xCoord = paddingLeft + spaceBetween + idx * (barWidth + spaceBetween);
        const yCoord = paddingTop + plotHeight - barHeight;

        // Custom path design support karanna vector rect elements construct karanawa
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", xCoord);
        rect.setAttribute("y", yCoord);
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", barHeight);
        
        // Loop index match karala dynamic colors design set karanawa
        const color = barColors[idx % barColors.length];
        rect.setAttribute("fill", color);
        rect.setAttribute("rx", "3"); // soft corner curvature effects
        svg.appendChild(rect);

        // Bar top label matha adala value values add karanawa text elements widihata
        if (item.amount > 0) {
            const valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            valText.setAttribute("x", xCoord + barWidth / 2);
            valText.setAttribute("y", yCoord - 5);
            valText.setAttribute("fill", "#333");
            valText.setAttribute("font-size", "10");
            valText.setAttribute("font-weight", "bold");
            valText.setAttribute("text-anchor", "middle");
            valText.setAttribute("font-family", "sans-serif");
            valText.textContent = Math.round(item.amount);
            svg.appendChild(valText);
        }

        // Bottom horizontal axis descriptions matha labels add karanawa
        const lblText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lblText.setAttribute("x", xCoord + barWidth / 2);
        lblText.setAttribute("y", paddingTop + plotHeight + 18);
        lblText.setAttribute("fill", "#444");
        lblText.setAttribute("font-size", "10");
        lblText.setAttribute("font-weight", "500");
        lblText.setAttribute("text-anchor", "middle");
        lblText.setAttribute("font-family", "sans-serif");
        lblText.textContent = item.label;
        svg.appendChild(lblText);
    });

    // axis base line coordinate line draw karanawa base scale limit ekata
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", paddingLeft);
    axisLine.setAttribute("y1", paddingTop + plotHeight);
    axisLine.setAttribute("x2", width - paddingRight);
    axisLine.setAttribute("y2", paddingTop + plotHeight);
    axisLine.setAttribute("stroke", "#444");
    axisLine.setAttribute("stroke-width", "1.5");
    svg.appendChild(axisLine);
}

// print format template document load kirima
const printIncomeReport = () => {
    // Input element values gannawa
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reportType = document.getElementById('reportType').value;
    
    // filter inputs elements match validation state logic check
    if (!startDate || !endDate) {
        window.alert("Please generate report before printing!");
        return;
    }

    // dynamic results elements structures gannawa render components list ekata
    const tableContent = document.getElementById('tableIncomeReport').outerHTML;
    const chartContent = document.getElementById('chartContainer').innerHTML;

    // Aluth browser dynamic frame path object window ekak open karanawa
    const printWindow = window.open();
    
    // Document layout body format design variables set karanawa
    const printTemplate = `
        <head>
            <title>Bright Book Shop | Income Report</title>
            <link rel='stylesheet' href='/bootstrap-5.2.3/css/bootstrap.min.css'>
            <style>
                body {
                    background-color: white;
                    color: black !important;
                    font-family: sans-serif;
                    padding: 30px;
                }
                table, th, td {
                    border: 1px solid #dee2e6 !important;
                    color: black !important;
                }
                th {
                    background-color: #f8f9fa !important;
                    color: black !important;
                }
                #chartContainer {
                    border: 1px solid #dee2e6 !important;
                    border-radius: 15px;
                    padding: 20px;
                    background-color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="text-center my-4">
                    <h2 class="fw-bold">BRIGHT BOOK SHOP</h2>
                    <h4 class="text-secondary">${reportType} Income Report</h4>
                    <p class="fw-semibold">Duration: ${startDate} to ${endDate}</p>
                </div>
                <hr>
                <div class="row mt-4">
                    <div class="col-6">
                        <h5 class="mb-3 fw-bold text-center">Income Summary Table</h5>
                        ${tableContent}
                    </div>
                    <div class="col-6">
                        <h5 class="mb-3 fw-bold text-center">Income Chart Visualization</h5>
                        <div id="chartContainer">
                            ${chartContent}
                        </div>
                    </div>
                </div>
            </div>
        </body>
    `;

    // Dynamic generated document structure data details write karanawa target render context eka lagata
    printWindow.document.write(printTemplate);
    
    // Window delay map control timeout execute setup function run
    setTimeout(() => {
        printWindow.stop();
        printWindow.print();
        printWindow.close();
    }, 1000);
}
