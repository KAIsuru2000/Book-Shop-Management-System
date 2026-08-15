// Window page load wuna wita dates initialize karanawa
window.addEventListener('load', () => { // window load wuna wita execute wena event listener eka
    const today = new Date(); // Ada dawase date eka laba gannawa
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1); // Me awrudude mulma dawasa gannawa (January 1)
    
    document.getElementById('startDate').value = firstDayOfYear.toISOString().split('T')[0]; // startDate input field ekata January 1 set karanawa
    document.getElementById('endDate').value = today.toISOString().split('T')[0]; // endDate input field ekata ada dawasa set karanawa
}); // load function eka awasan wenawa

// Item wise profit report data generate karana main function eka
const generateItemWiseProfitReport = () => { // generateItemWiseProfitReport function eka patan gannawa
    const startDate = document.getElementById('startDate').value; // startDate field eke input value eka gannawa
    const endDate = document.getElementById('endDate').value; // endDate field eke input value eka gannawa

    if (!startDate || !endDate) { // date field empty da kiyala check karanawa
        window.alert("Please select both Start Date and End Date!"); // warning window message alert ekak pennanawa
        return; // function eken return wenawa
    } // validation block eka awasan wenawa

    if (new Date(startDate) > new Date(endDate)) { // start date eka end date ekata wada wadi nam check karanawa
        window.alert("Start Date cannot be greater than End Date!"); // dates galapenne nethi wita warn alert ekak denawa
        return; // execution nawathwa return wenawa
    } // validation check block eka awasan wenawa

    const url = `/itemwiseprofitreport/data?startdate=${startDate}&enddate=${endDate}`; // backend api target url string path construct karanawa
    
    fetch(url) // fetch method eka haraha api url ekata call karanawa
        .then(response => response.json()) // labunu response message body eka json convert karanawa
        .then(data => { // converted json data set eka labenawa
            const tbody = document.getElementById('tableItemWiseProfitReportBody'); // table body element eka target document object model map gannawa
            tbody.innerHTML = ""; // body eke tiyena parana table rows clear karanawa

            if (data.length === 0) { // data nethnam check karanawa
                tbody.innerHTML = `<tr><td colspan="7" class="text-center">No data found for the selected period.</td></tr>`; // empty notification row ekak set karanawa
                drawEmptyChart(); // chart area empty state graphic display function call karanawa
                return; // function execution return karanawa
            } // conditional block end

            data.forEach((item, index) => { // data items collection loop block patan gannawa
                const tr = document.createElement('tr'); // aluth table row element ekak create karanawa
                const profitClass = parseFloat(item.profit) >= 0 ? "text-success fw-bold" : "text-danger fw-bold"; // profit positive nam success, loss nam danger class select
                
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.itemcode}</td>
                    <td>${item.itemname}</td>
                    <td class="text-end">${parseFloat(item.qty).toFixed(0)}</td>
                    <td class="text-end">Rs. ${parseFloat(item.sales).toFixed(2)}</td>
                    <td class="text-end">Rs. ${parseFloat(item.cost).toFixed(2)}</td>
                    <td class="text-end ${profitClass}">Rs. ${parseFloat(item.profit).toFixed(2)}</td>
                `; // row elements variables placeholder data set fill karala set karanawa
                tbody.appendChild(tr); // row item eka table body structure drop path inject karanawa
            }); // loop block end

            drawItemWiseProfitChart(data); // dynamic vector SVG chart component generate graphic function draw call karanawa
        }) // promise response handling block end
        .catch(error => { // api call errors catch block start
            console.error("Error fetching report data:", error); // developer console browser warning print log
            window.alert("Failed to load report data!"); // standard user alert pop windows mapping
        }); // catch handling end
} // generate function end

// Chart data empty wuna wita default state draw karanna yoda gannawa
const drawEmptyChart = () => { // drawEmptyChart function declare
    const svg = document.getElementById('itemWiseProfitChartSvg'); // target chart svg element gannawa
    svg.innerHTML = `
        <text x="300" y="150" fill="#999" text-anchor="middle" font-family="sans-serif">No Chart Data</text>
    `; // default plain placeholder information label print karanawa
} // function end

// Dynamic vector SVG bar chart drawing function eka
const drawItemWiseProfitChart = (data) => { // drawItemWiseProfitChart function structure parameters dynamic
    const svg = document.getElementById('itemWiseProfitChartSvg'); // target vector canvas object mapping
    svg.innerHTML = ""; // parana drawing items okkoma clear karanawa container frame refresh

    let maxVal = 0; // maximum count limits range scale calculations variable initial value 0
    data.forEach(item => { // collections list values parse loop set
        const absProfit = Math.abs(parseFloat(item.profit)); // profit absolute value eka gannawa negative values check karanna
        if (absProfit > maxVal) { // item count maximum value ta wada wadi nam
            maxVal = absProfit; // max value update path trigger set
        } // condition end
    }); // loop check values end

    if (maxVal === 0) maxVal = 100; // quantity total scale calculation errors blocks crash safety limit

    const yMax = Math.ceil(maxVal / 100) * 100; // grid steps round configurations ganna calculations math helper
    
    const width = 600; // coordinate graphic frame outer limits horizontal width dimension
    const height = 300; // coordinate graphic frame outer limits vertical height dimension
    const paddingLeft = 70; // left scale labeling offset padding spacing coordinate
    const paddingRight = 40; // right scale border spacing coordinate
    const paddingTop = 30; // top chart label margin coordinate
    const paddingBottom = 50; // bottom label height spacer coordinate
    
    const plotWidth = width - paddingLeft - paddingRight; // inner chart draw width limits calculation
    const plotHeight = height - paddingTop - paddingBottom; // inner chart draw height limits calculation

    const gridLinesCount = 5; // horizontal grid lines rule divisions count settings
    for (let i = 0; i < gridLinesCount; i++) { // loop divisions steps logic start
        const ratio = i / (gridLinesCount - 1); // coordinates divisions percentage metric scale ratio
        const yCoord = paddingTop + plotHeight * (1 - ratio); // actual pixel coordinate calculation mapping
        const valLabel = Math.round(yMax * ratio); // labeled value count calculation integer round

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line"); // svg lines namespace resource components element map
        line.setAttribute("x1", paddingLeft); // start point horizontal coordinate
        line.setAttribute("y1", yCoord); // start point vertical coordinate
        line.setAttribute("x2", width - paddingRight); // end point horizontal coordinate
        line.setAttribute("y2", yCoord); // end point vertical coordinate
        line.setAttribute("stroke", "#e9e9e9"); // visual color gray scale mapping
        line.setAttribute("stroke-width", "1"); // stroke width coordinate scale size
        svg.appendChild(line); // line render vector canvas add trigger

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text"); // svg text namespaces labeling elements map
        text.setAttribute("x", paddingLeft - 10); // horizontal text spacing placement
        text.setAttribute("y", yCoord + 4); // centering text vertical offset alignment
        text.setAttribute("fill", "#666"); // dark font color scale mapping
        text.setAttribute("font-size", "11"); // font typography pixels size selection
        text.setAttribute("text-anchor", "end"); // text alignment side end alignment
        text.setAttribute("font-family", "sans-serif"); // system fonts layout map select
        text.textContent = valLabel.toLocaleString(); // values formatting localized text setting
        svg.appendChild(text); // labeling text vector render canvas add
    } // grid divisions loop end

    const barCount = data.length; // total bar numbers data items sizes
    const spaceBetween = 15; // horizontal gaps between adjacent bars dimension pixels
    const barWidth = (plotWidth - (spaceBetween * (barCount + 1))) / barCount; // dynamic bar size width calculations parameters

    data.forEach((item, idx) => { // items loops path rendering graphics logic
        const profitVal = parseFloat(item.profit); // profit value check block
        const barHeight = (Math.abs(profitVal) / yMax) * plotHeight; // scales calculation ratio height pixel map
        
        const xCoord = paddingLeft + spaceBetween + idx * (barWidth + spaceBetween); // coordinate pixel placement horizontal
        const yCoord = paddingTop + plotHeight - barHeight; // coordinate pixel placement vertical

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect"); // rectangle shapes svg namespaces element
        rect.setAttribute("x", xCoord); // shapes point horizontal placement
        rect.setAttribute("y", yCoord); // shapes point vertical placement
        rect.setAttribute("width", barWidth); // shapes dimensions width mapping
        rect.setAttribute("height", barHeight); // shapes dimensions height mapping
        
        const color = profitVal >= 0 ? "#4caf50" : "#f44336"; // profit eka positive nam green, loss nam red select karanawa
        rect.setAttribute("fill", color); // fills color setting
        rect.setAttribute("rx", "3"); // soft corner curves curvature properties settings
        svg.appendChild(rect); // rectangle shapes canvas add trigger

        const valText = document.createElementNS("http://www.w3.org/2000/svg", "text"); // text parameters svg namespace element
        valText.setAttribute("x", xCoord + barWidth / 2); // horizontal centered placement coordinate
        valText.setAttribute("y", yCoord - 5); // vertical top coordinate offset spacing
        valText.setAttribute("fill", "#333"); // dark gray colors scale map values
        valText.setAttribute("font-size", "10"); // sizing configuration text
        valText.setAttribute("font-weight", "bold"); // bold fonts styling formats settings
        valText.setAttribute("text-anchor", "middle"); // text alignments center parameters
        valText.setAttribute("font-family", "sans-serif"); // system layout typography set
        valText.textContent = Math.round(profitVal); // text content values assignment (rounded)
        svg.appendChild(valText); // quantity value labels add canvas rendering

        const lblText = document.createElementNS("http://www.w3.org/2000/svg", "text"); // axis labels namespaces text components
        lblText.setAttribute("x", xCoord + barWidth / 2); // horizontal placement configurations center
        lblText.setAttribute("y", paddingTop + plotHeight + 18); // bottom placement coordinate layout axis spacing
        lblText.setAttribute("fill", "#444"); // gray text scale values select
        lblText.setAttribute("font-size", "10"); // text sizes properties
        lblText.setAttribute("font-weight", "500"); // font weight formatting
        lblText.setAttribute("text-anchor", "middle"); // alignment center
        lblText.setAttribute("font-family", "sans-serif"); // system fonts layout map
        lblText.textContent = item.itemcode; // item code property value text assignment
        svg.appendChild(lblText); // axis label element dynamic inject map
    }); // looping path rendering end

    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line"); // axis base coordinate line element svg
    axisLine.setAttribute("x1", paddingLeft); // horizontal start placement
    axisLine.setAttribute("y1", paddingTop + plotHeight); // vertical placement height
    axisLine.setAttribute("x2", width - paddingRight); // horizontal end coordinate
    axisLine.setAttribute("y2", paddingTop + plotHeight); // vertical placement height
    axisLine.setAttribute("stroke", "#444"); // solid axis color mapping
    axisLine.setAttribute("stroke-width", "1.5"); // stroke size coordinate thickness properties
    svg.appendChild(axisLine); // axis line draw vector canvas inject trigger
} // chart drawing function end

// print format template document load kirima
const printItemWiseProfitReport = () => { // printItemWiseProfitReport function structure patan gannawa
    const startDate = document.getElementById('startDate').value; // startDate input values gannawa
    const endDate = document.getElementById('endDate').value; // endDate input values gannawa
    
    if (!startDate || !endDate) { // date filter data empty state check validation
        window.alert("Please generate report before printing!"); // user alert windows warning popup
        return; // execution navigate return stop path
    } // validation path end

    const tableContent = document.getElementById('tableItemWiseProfitReport').outerHTML; // results data table table block templates extract html
    const chartContent = document.getElementById('chartContainer').innerHTML; // chart svg container element properties inner xml code copy

    const printWindow = window.open(); // browser aluth document frame target context empty popup window setup
    
    const printTemplate = `
        <head>
            <title>Bright Book Shop | Item-wise Profit Report</title>
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
                    color: green !important;
                }
                .text-danger {
                    color: red !important;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="text-center my-4">
                    <h2 class="fw-bold">BRIGHT BOOK SHOP</h2>
                    <h4 class="text-secondary">Item-wise Profit Report</h4>
                    <p class="fw-semibold">Duration: ${startDate} to ${endDate}</p>
                </div>
                <hr>
                <div class="row mt-4">
                    <div class="col-8">
                        <h5 class="mb-3 fw-bold text-center">Summary Table</h5>
                        ${tableContent}
                    </div>
                    <div class="col-4">
                        <h5 class="mb-3 fw-bold text-center">Chart Visualization</h5>
                        <div id="chartContainer">
                            ${chartContent}
                        </div>
                    </div>
                </div>
            </div>
        </body>
    `; // printable page dynamic bootstrap css styling context variables setup template structure

    printWindow.document.write(printTemplate); // popup blank screen layout writing document structures stream
    
    setTimeout(() => { // delay timeout function map execution safety
        printWindow.stop(); // dynamic script running processing loading stop frame
        printWindow.print(); // print preview layouts invoke action method trigger
        printWindow.close(); // window close popup exit method trigger
    }, 1000); // 1000 milliseconds time duration interval delay settings
} // print function end
