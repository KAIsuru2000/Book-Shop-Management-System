// Window page load wuna wita dates field initialize karanawa
window.addEventListener('load', () => {
    // Ada dawase date and time details laba gannawa
    const today = new Date(); // new date class instance eken ada dawasa gannawa
    // Me awrudude mulma dawasa (January 1) set karagannawa
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1); // me awrudude January 1 set karanawa
    
    // Inputs elements walata initial dates default set karanawa
    document.getElementById('startDate').value = firstDayOfYear.toISOString().split('T')[0]; // start date field value eka set karanawa
    document.getElementById('endDate').value = today.toISOString().split('T')[0]; // end date field value eka set karanawa
});

// PNL report details generate karana main function eka
const generatePnlReport = () => {
    // User select kala dates and report type elements gannawa
    const startDate = document.getElementById('startDate').value; // start date input value gannawa
    const endDate = document.getElementById('endDate').value; // end date input value gannawa
    const reportType = document.getElementById('reportType').value; // select type drop down value gannawa

    // Date fields empty da kiyala verify karala alert ekak denawa
    if (!startDate || !endDate) { // date field components null nam
        window.alert("Please select both Start Date and End Date!"); // user ta message ekak show karanawa
        return; // control exit karanawa
    }

    // Start date eka end date ekata wada wadi nam validation errors alert denawa
    if (new Date(startDate) > new Date(endDate)) { // start date value eka end date ekata wada wadi nam
        window.alert("Start Date cannot be greater than End Date!"); // warn message display karanawa
        return; // execution nawathwanawa
    }

    // Fetch request URL coordinate mapping set karanawa
    const url = `/pnlreport/data?startdate=${startDate}&enddate=${endDate}&type=${reportType}`; // endpoint url path configurations dynamically set
    
    // AJAX fetch call block eka backend api ekata yawanawa
    fetch(url) // call check response status
        .then(response => response.json()) // response data set json object ekakata parse karagannawa
        .then(data => { // parsed data data structure array details mapping
            // Table table body block layout gannawa
            const tbody = document.getElementById('tablePnlReportBody'); // table body element id reference key eka gannawa
            // Body container content clear karanawa parana elements remove karanna
            tbody.innerHTML = ""; // target inner html clear settings

            // Return data elements size check structure empty checks
            if (data.length === 0) { // array count eka 0 nam
                // Data empty row instruction cell line clear set row
                tbody.innerHTML = `<tr><td colspan="5" class="text-center">No data found for the selected period.</td></tr>`; // empty table content mapping
                // Chart layout clear structure render empty settings
                drawEmptyChart(); // drawEmptyChart function eka run karanawa
                return; // control exit points return
            }

            // Group variables setup totals set dynamically
            let totalIncome = 0; // total income sum variable
            let totalExpense = 0; // total expense sum variable
            let totalProfit = 0; // total profit sum variable

            // Return array rows map loops populate columns
            data.forEach((item, index) => { // loop index elements item mappings
                const tr = document.createElement('tr'); // new table row element context dynamic creation
                
                // Profit calculations styles set variables
                const incomeVal = parseFloat(item.income); // income string val float change
                const expenseVal = parseFloat(item.expense); // expense string val float change
                const profitVal = parseFloat(item.profit); // profit string val float change

                // Totals update
                totalIncome += incomeVal; // income total target value validation update
                totalExpense += expenseVal; // expense total target value validation update
                totalProfit += profitVal; // profit total target value validation update

                // Profit color style format css tags logic set
                let profitStyle = "text-end text-success fw-bold"; // positive values default styles
                if (profitVal < 0) { // profit value negative/loss nam
                    profitStyle = "text-end text-danger fw-bold"; // negative values loss text red colors
                }

                // Row elements cell tags details template mapping
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.label}</td>
                    <td class="text-end">Rs. ${incomeVal.toFixed(2)}</td>
                    <td class="text-end">Rs. ${expenseVal.toFixed(2)}</td>
                    <td class="${profitStyle}">Rs. ${profitVal.toFixed(2)}</td>
                `; // inner cellular layouts definitions
                tbody.appendChild(tr); // table row body container layout push
            });

            // Dynamic total calculations footer rows display template
            const totalTr = document.createElement('tr'); // total row element dynamic creation
            totalTr.className = "table-dark fw-bold"; // dark highlight styling classes assignment
            
            // profit total text style properties
            let totalProfitStyle = "text-end text-success fw-bold"; // positive dynamic total styles green
            if (totalProfit < 0) { // net profit minus/loss nam
                totalProfitStyle = "text-end text-danger fw-bold"; // negative dynamic total styles red
            }

            // Totals column row configurations
            totalTr.innerHTML = `
                <td colspan="2" class="text-center">TOTAL SUMMARY</td>
                <td class="text-end">Rs. ${totalIncome.toFixed(2)}</td>
                <td class="text-end">Rs. ${totalExpense.toFixed(2)}</td>
                <td class="${totalProfitStyle}">Rs. ${totalProfit.toFixed(2)}</td>
            `; // cell definitions for summary calculations row
            tbody.appendChild(totalTr); // table body line insert total row layout

            // Dynamic chart title change select report type descriptions
            document.getElementById('chartTitle').innerText = `${reportType} Net Profit / Loss Chart`; // chart labels update

            // SVG dynamic bar chart render method calling pass array values
            drawPnlChart(data); // drawPnlChart functions execution mapping
        })
        .catch(error => { // error callbacks configurations
            console.error("Error fetching PNL report data:", error); // console logs warning details
            window.alert("Failed to load PNL report data!"); // user warning window alerts display
        });
}

// Chart data empty wuna wita placeholder instruction design construct
const drawEmptyChart = () => {
    const svg = document.getElementById('pnlChartSvg'); // svg layout reference elements gannawa
    svg.innerHTML = `
        <text x="300" y="150" fill="#999" text-anchor="middle" font-family="sans-serif">No Chart Data</text>
    `; // inline default message text definitions rendering SVG viewport inside
}

// Dynamic vector SVG bar chart mapping generator function (with support negative values)
const drawPnlChart = (data) => {
    const svg = document.getElementById('pnlChartSvg'); // target drawing svg canvas reference gannawa
    // Parana visual shapes records remove clear canvas mapping
    svg.innerHTML = ""; // reset inner canvas

    // Limits parameters variables configurations
    let maxVal = 0; // maximum profit variable
    let minVal = 0; // minimum profit variable (loss supports negative)
    let hasLoss = false; // loss checks boolean indicator

    // Loops item values to identify coordinate limits
    data.forEach(item => { // values analyze
        const profit = parseFloat(item.profit); // parse item net profit
        if (profit > maxVal) maxVal = profit; // max value update
        if (profit < minVal) minVal = profit; // min value update
    });

    // Check if there is any negative/loss values inside array
    if (minVal < 0) { // minimum profit range minus numbers nam
        hasLoss = true; // hasLoss status variable active
    }

    // Absolute maximum calculations dynamic bounds grid steps
    let absMax = Math.max(Math.abs(maxVal), Math.abs(minVal)); // maximum boundary width scale gannawa
    if (absMax === 0) absMax = 1000; // coordinate scale crash fix check settings
    const gridLimit = Math.ceil(absMax / 1000) * 1000; // grid step bounds roundups details format

    // Set dynamic scaling boundaries
    let yMax = 0; // y-axis maximum scale variable
    let yMin = 0; // y-axis minimum scale variable
    if (hasLoss) { // loss records settings support
        yMax = gridLimit; // positive upper limit
        yMin = -gridLimit; // negative lower limit
    } else { // normal positive records setup
        yMax = gridLimit; // positive upper limit
        yMin = 0; // zero base level limit
    }

    // SVG frame coordinates configuration dimensions variables
    const width = 600; // svg predefined viewbox width settings
    const height = 300; // svg predefined viewbox height settings
    const paddingLeft = 80; // left labels spaces margin spacing
    const paddingRight = 40; // right boundaries offsets spacer
    const paddingTop = 30; // top margins offsets labels space
    const paddingBottom = 50; // bottom time period labels space
    
    const plotWidth = width - paddingLeft - paddingRight; // drawing graphics canvas horizontal widths
    const plotHeight = height - paddingTop - paddingBottom; // drawing graphics canvas vertical heights

    // Calculate baseline Y coordinate positions (where profit = 0)
    const yBaseline = paddingTop + plotHeight * (1 - (0 - yMin) / (yMax - yMin)); // math calculation for baseline vertical coordinates mapping

    // Draw Y-axis grid scale guidelines
    const gridLinesCount = 5; // grid split count limits parameters
    for (let i = 0; i < gridLinesCount; i++) { // loop details steps guidelines
        const ratio = i / (gridLinesCount - 1); // coordinate ratio mapping spacing
        const valLabel = yMin + (yMax - yMin) * ratio; // display step values calculation
        const yCoord = paddingTop + plotHeight * (1 - ratio); // grid horizontal drawing coordinates path Y

        // SVG lines elements dynamic constructor
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line"); // new vector line element
        line.setAttribute("x1", paddingLeft); // horizontal start coordinates point
        line.setAttribute("y1", yCoord); // vertical start coordinates point
        line.setAttribute("x2", width - paddingRight); // horizontal end coordinates point
        line.setAttribute("y2", yCoord); // vertical end coordinates point
        line.setAttribute("stroke", "#e9e9e9"); // light gray dashed format look styles
        line.setAttribute("stroke-width", "1"); // stroke thickness configs
        svg.appendChild(line); // lines append path canvas

        // SVG Y-axis step label description display labels settings
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text"); // new label text vector element
        text.setAttribute("x", paddingLeft - 10); // horizontal alignment anchor offsets left
        text.setAttribute("y", yCoord + 4); // vertical labels coordinate alignment offsets
        text.setAttribute("fill", "#666"); // dark font display style
        text.setAttribute("font-size", "11"); // labels text heights parameters
        text.setAttribute("text-anchor", "end"); // label description text right align
        text.setAttribute("font-family", "sans-serif"); // basic clean typeface configurations
        text.textContent = "Rs. " + Math.round(valLabel).toLocaleString(); // step values formatted numbers text set
        svg.appendChild(text); // labels text dynamic push layout
    }

    // Horizontal bars columns configurations spacings mapping
    const barCount = data.length; // total period bars count
    const spaceBetween = 15; // horizontal spacing between columns
    const barWidth = (plotWidth - (spaceBetween * (barCount + 1))) / barCount; // dynamic horizontal column width calculations

    // Populate data bars loop maps
    data.forEach((item, idx) => { // bars drawing iteration
        const profit = parseFloat(item.profit); // parse item net profit
        // Bar columns height calculations base coordinate mappings ratios
        const barHeight = (Math.abs(profit) / (yMax - yMin)) * plotHeight; // vertical bar heights calculation

        // Coordinates positions horizontal mapping layout X
        const xCoord = paddingLeft + spaceBetween + idx * (barWidth + spaceBetween); // dynamic layout horizontal coordinates point X
        
        let yCoord = yBaseline; // default start drawing point from baseline coordinate Y
        let color = "#2e7d32"; // positive profit status color green theme style

        if (profit >= 0) { // profit positive records configurations
            yCoord = yBaseline - barHeight; // coordinate Y calculation starts up from baseline
            color = "#2e7d32"; // profit theme colors green
        } else { // negative loss records configurations
            yCoord = yBaseline; // coordinate Y starts from baseline going down
            color = "#c62828"; // loss theme colors red
        }

        // SVG vector column rect elements components dynamically set
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect"); // shape rectangle element creation
        rect.setAttribute("x", xCoord); // horizontal positions
        rect.setAttribute("y", yCoord); // vertical positions coordinates
        rect.setAttribute("width", barWidth); // dynamic width
        rect.setAttribute("height", barHeight); // calculated vertical height
        rect.setAttribute("fill", color); // color set green/red
        rect.setAttribute("rx", "4"); // soft corner curve borders styles
        svg.appendChild(rect); // bar shapes layout append svg

        // Display individual labels amounts values text above or below the bar structures
        if (profit !== 0) { // display labels only when values not zero
            const valText = document.createElementNS("http://www.w3.org/2000/svg", "text"); // values amount dynamic font element
            valText.setAttribute("x", xCoord + barWidth / 2); // centered horizontal alignment columns X
            
            // vertical spacing details text coordinates positions
            if (profit >= 0) { // positive value label above the column
                valText.setAttribute("y", yCoord - 5); // vertical heights alignment coordinates offsets Y
            } else { // negative value label below the column
                valText.setAttribute("y", yCoord + barHeight + 14); // vertical heights alignment coordinates offsets Y down
            }
            
            valText.setAttribute("fill", "#333"); // text fonts colors setting
            valText.setAttribute("font-size", "10"); // text sizes configurations
            valText.setAttribute("font-weight", "bold"); // text weights bold settings
            valText.setAttribute("text-anchor", "middle"); // text alignments centering anchors
            valText.setAttribute("font-family", "sans-serif"); // clean typeface formats
            valText.textContent = Math.round(profit).toLocaleString(); // value number descriptions set
            svg.appendChild(valText); // values description elements append SVG viewports
        }

        // Bottom horizontal axis periods labels (Weeks or Months) mapping descriptions
        const lblText = document.createElementNS("http://www.w3.org/2000/svg", "text"); // horizontal timeline label dynamic element
        lblText.setAttribute("x", xCoord + barWidth / 2); // centering alignment anchor coordinates X
        lblText.setAttribute("y", paddingTop + plotHeight + 22); // timeline descriptions offset spaces Y below
        lblText.setAttribute("fill", "#444"); // timelines font color dark
        lblText.setAttribute("font-size", "10"); // text font heights sizes
        lblText.setAttribute("font-weight", "600"); // font weight settings
        lblText.setAttribute("text-anchor", "middle"); // alignment centering setups
        lblText.setAttribute("font-family", "sans-serif"); // fonts layouts
        lblText.textContent = item.label; // time text descriptions dynamic value mapping (e.g. Week 1 / Month 1)
        svg.appendChild(lblText); // period labels items append layout SVG
    });

    // Dark solid axis line drawing coordinates path across the baseline (where values is 0)
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line"); // new solid axis line component
    axisLine.setAttribute("x1", paddingLeft); // start left coordinate alignment boundary X
    axisLine.setAttribute("y1", yBaseline); // baseline Y coordinate settings
    axisLine.setAttribute("x2", width - paddingRight); // end right coordinate alignment boundary X
    axisLine.setAttribute("y2", yBaseline); // baseline Y coordinate settings
    axisLine.setAttribute("stroke", "#444"); // solid dark colors format styles
    axisLine.setAttribute("stroke-width", "1.5"); // solid line line-width settings
    svg.appendChild(axisLine); // axis line append canvas SVG
}

// Print layouts template formatting setups mapping dynamic printable reports document context
const printPnlReport = () => {
    // Inputs filter elements values gannawa
    const startDate = document.getElementById('startDate').value; // selected start date gannawa
    const endDate = document.getElementById('endDate').value; // selected end date gannawa
    const reportType = document.getElementById('reportType').value; // selected select type drop down values gannawa
    
    // Dates inputs check validations error states checks
    if (!startDate || !endDate) { // inputs null details check
        window.alert("Please generate report before printing!"); // warning alert windows
        return; // execution stops return
    }

    // Dynamic results display container structures components layouts select gannawa
    const tableContent = document.getElementById('tablePnlReport').outerHTML; // dynamic populated table inner and outer HTML gannawa
    const chartContent = document.getElementById('chartContainer').innerHTML; // dynamic svg bar charts details inner HTML gannawa

    // Aluth browser printable tab windows context frame target inline target hadanawa
    const printWindow = window.open(); // new browser window tab open reference configuration

    // HTML print preview CSS stylesheets themes templates construct layouts mapping
    const printTemplate = `
        <head>
            <title>Bright Book Shop | Loss & Profit (PNL) Report</title>
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
                .text-success {
                    color: #2e7d32 !important;
                }
                .text-danger {
                    color: #c62828 !important;
                }
            </style>
        </head>
        <body>
            <div class="container-fluid">
                <div class="text-center my-4">
                    <h2 class="fw-bold">BRIGHT BOOK SHOP</h2>
                    <h4 class="text-secondary">${reportType} Loss & Profit (PNL) Report</h4>
                    <p class="fw-semibold">Duration: ${startDate} to ${endDate}</p>
                </div>
                <hr>
                <div class="row mt-4">
                    <div class="col-7">
                        <h5 class="mb-3 fw-bold text-center">PNL Summary Table</h5>
                        ${tableContent}
                    </div>
                    <div class="col-5">
                        <h5 class="mb-3 fw-bold text-center">Net Profit / Loss Chart</h5>
                        <div id="chartContainer">
                            ${chartContent}
                        </div>
                    </div>
                </div>
            </div>
        </body>
    `; // document layout printable body format templates setups

    // Dynamic write templates strings into browser context target tab elements
    printWindow.document.write(printTemplate); // document print content load parameters mapping
    
    // Timeout delay configs executes printing layout checks maps
    setTimeout(() => { // delay controls executing methods parameters
        printWindow.stop(); // browser tab navigation stopper
        printWindow.print(); // print preview layouts popup prompt displays
        printWindow.close(); // tab close coordinates
    }, 1000); // delay threshold parameter set to 1000 ms (1 second)
}
