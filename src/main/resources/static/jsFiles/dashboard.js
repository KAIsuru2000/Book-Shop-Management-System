// Page load wuna wita dashboard statistics data fetch karala gannawa
window.addEventListener('load', () => {

    // log una userta acces thitena module pamanak penwimata adala function eka
    fillterLogUserAccessModule();
    // API endpoint ekata fetch request eka yawanawa
    fetch('/dashboard/data')
        .then(response => response.json())
        .then(data => {
            // Cards wala counts dynamic set karanawa
            document.getElementById('lowStockCount').innerText = data.lowStockCount;
            // document.getElementById('expiredQuotationsCount').innerText = data.expiredQuotationsCount;
            document.getElementById('pendingPurchaseOrdersCount').innerText = data.pendingPurchaseOrdersCount;

            // Income amount eka format karala set karanawa currency ekath ekka
            document.getElementById('todayIncome').innerText = `Rs. ${parseFloat(data.todayIncome).toFixed(2)}`;

            // Six Month Income chart vector map drawing function eka run karanawa
            drawDashboardChart(data.previousSixMonthIncome);
        })
        .catch(error => {
            console.error("Error loading dashboard data:", error);
        });
});

// Dynamic vector SVG bar chart drawing function eka dashboard eka sadaha
const drawDashboardChart = (chartData) => {
    const svg = document.getElementById('dashboardChartSvg');
    // base svg content clear karanawa loading placeholder eka remove karanna
    svg.innerHTML = "";

    // Maximum value eka hoyanawa limits scale coordinate structure filter karanna
    let maxVal = 0;
    chartData.forEach(item => {
        if (item.amount > maxVal) {
            maxVal = item.amount;
        }
    });

    // Zero check limits filter
    if (maxVal === 0) maxVal = 100000;

    // Y-axis top grid limits scale determine karagannawa rounded step values walata
    const yMax = Math.ceil(maxVal / 100000) * 100000;

    // Layout configuration variables set karanawa width vector parameters match karanna
    const width = 600;
    const height = 300;
    const paddingLeft = 80;
    const paddingRight = 40;
    const paddingTop = 30;
    const paddingBottom = 50;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    // Grid lines count set coordinates logic loop path
    const gridLinesCount = 5;
    for (let i = 0; i < gridLinesCount; i++) {
        const ratio = i / (gridLinesCount - 1);
        const yCoord = paddingTop + plotHeight * (1 - ratio);
        const valLabel = Math.round(yMax * ratio);

        // Horizontal grid rule elements line construct path
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", paddingLeft);
        line.setAttribute("y1", yCoord);
        line.setAttribute("x2", width - paddingRight);
        line.setAttribute("y2", yCoord);
        line.setAttribute("stroke", "#e9e9e9");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);

        // Y-axis grid side indicators labels text write path
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", paddingLeft - 10);
        text.setAttribute("y", yCoord + 4);
        text.setAttribute("fill", "#666");
        text.setAttribute("font-size", "10");
        text.setAttribute("text-anchor", "end");
        text.setAttribute("font-family", "sans-serif");
        text.textContent = valLabel.toLocaleString();
        svg.appendChild(text);
    }

    // Dynamic bar colors array design template matha brand colors set karanawa
    const barColors = ["#009dc5", "#2e7d32", "#00bcd4", "#ff9800", "#004658", "#ffc107"];

    // Bars space layout coordinates settings
    const barCount = chartData.length;
    const spaceBetween = 20;
    const barWidth = (plotWidth - (spaceBetween * (barCount + 1))) / barCount;

    // loops data collection to draw bar graphics
    chartData.forEach((item, idx) => {
        // height proportion metrics gannawa
        const barHeight = (item.amount / yMax) * plotHeight;

        // Coordinates positioning set
        const xCoord = paddingLeft + spaceBetween + idx * (barWidth + spaceBetween);
        const yCoord = paddingTop + plotHeight - barHeight;

        // Custom rounded corners rectangle components vectors hadanawa
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", xCoord);
        rect.setAttribute("y", yCoord);
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", barHeight);

        // Month order match index matha bar color properties assing map
        const color = barColors[idx % barColors.length];
        rect.setAttribute("fill", color);
        rect.setAttribute("rx", "4"); // rounded edges
        svg.appendChild(rect);

        // Text value labels set karanawa bar eka ihala
        if (item.amount > 0) {
            const valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            valText.setAttribute("x", xCoord + barWidth / 2);
            valText.setAttribute("y", yCoord - 5);
            valText.setAttribute("fill", "#333");
            valText.setAttribute("font-size", "9");
            valText.setAttribute("font-weight", "bold");
            valText.setAttribute("text-anchor", "middle");
            valText.setAttribute("font-family", "sans-serif");
            valText.textContent = Math.round(item.amount).toLocaleString();
            svg.appendChild(valText);
        }

        // Bottom axis description month index labels text add map
        const lblText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lblText.setAttribute("x", xCoord + barWidth / 2);
        lblText.setAttribute("y", paddingTop + plotHeight + 20);
        lblText.setAttribute("fill", "#555");
        lblText.setAttribute("font-size", "10");
        lblText.setAttribute("font-weight", "bold");
        lblText.setAttribute("text-anchor", "middle");
        lblText.setAttribute("font-family", "sans-serif");
        lblText.textContent = item.month;
        svg.appendChild(lblText);
    });

    // Main base axis bottom vector line details drawing path
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", paddingLeft);
    axisLine.setAttribute("y1", paddingTop + plotHeight);
    axisLine.setAttribute("x2", width - paddingRight);
    axisLine.setAttribute("y2", paddingTop + plotHeight);
    axisLine.setAttribute("stroke", "#555");
    axisLine.setAttribute("stroke-width", "1.5");
    svg.appendChild(axisLine);
}

// log una userta anuwa module filter wima sadaha
fillterLogUserAccessModule = () => {

    // logged user ge role eka ganna backend api ekata request ekak yawala response object eka aragannawa
    let loggedUserObj = getServiceRequest("/loggeduser/role");

    // response object eken path eka select karala role eke nama loggedUser variable ekata set karagannawa
    let loggedUser = loggedUserObj.role;

    // loggedUser variable eke thiyena nama "Cashier" da kiyala check karanawa
    if (loggedUser == "Cashier") {

        dropdownAdminis.style.display = "none";
        listItem.style.display = "none";
        dropdownSupplier.style.display = "none";

        // loggedUser variable eke thiyena nama "Manager" da kiyala check karanawa
    } else if (loggedUser == "Manager") {

        dropdownAdminis.style.display = "flex";
        listItem.style.display = "flex";
        dropdownSupplier.style.display = "flex";
    }
}
