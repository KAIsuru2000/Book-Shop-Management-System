//table ekata data fill kirana function eka
const fillDataIntoTable = (tableBodyId, dataList, propertyList, editFunction, deleteFunction, viewFunction, offcanvasId) => {

    //table eke thula athi static data tika clear kirima
    tableBodyId.innerHTML = "";


    //datalist- data array ekehi nama laba dei
    //forEach(function(currentValue, index, arr), thisValue) function - array function
    //currentValue - dataob
    //index - Optional.The index of the current element.
    dataList.forEach((dataob, index) => {
        //document gen tr ekak create kara ganima
        let tr = document.createElement("tr");
        //tr ekata dataRow nam class ekak add kara ganima
        tr.classList.add("dataRow");
        

        //index ekata td ekak sada ganima
        let tdIndex = document.createElement("td");
        //index td ekata text ekak dama ganima
        //forEach eka magin labena index eka 0 sita labena nisa eyata 1 k ekathu kara ganima
        //parseInt - string ekak integer walata convert kirima
        tdIndex.innerText = parseInt(index) + 1;
        //index eka sahitha td eka tr ekata append kirima
        tr.appendChild(tdIndex);

        //propertyList ekak magin data table ekata add kirima
        for (const property of propertyList) {
            //td ekak sedima
            let td = document.createElement("td");
            //property list eken ekak property lesa gena ehi dataType eka string nam
            if (property.dataType === "string") {
                td.innerText = dataob[property.propertyName];
            }
            
            if (property.dataType === "decimal") {
                td.innerText = parseFloat (dataob[property.propertyName]).toFixed(2);
            }

            //property list eken ekak property lesa gena ehi dataType eka function nam
            if (property.dataType === "function") {
                //innerHTML yoda gath nisa function eka thulin html code return kala heka
                //mehidi propertyName(function ekak) eka call karai
                td.innerHTML = property.propertyName(dataob);
            }
            //td eka tr ekata append kirima
            tr.appendChild(td);
        }



        // ek ek row ekata click event listener add kirima
        //mehide tr ekak click kala seema witakadima arrow function eka run we
        tr.addEventListener("click", () => {
            //button row eka display wimata yoda ganna function eka
            //tr eka argument ekak lesa mema function ekata pass we
            displayButtonRow(tr);
        });


        //tr eka table body ekata append kirima
        tableBodyId.appendChild(tr);
   


    //row eka click kala wita button row eka display wimata adala function eka
    const displayButtonRow = (clickedRow) => {
        // action-row yana class name eka athi tr thibeda balima
        let existingButtonRow = document.querySelector(".buttonrow");
        //esa thibe nam ewa iwath kirima
        if (existingButtonRow) {
            existingButtonRow.remove();

        }
        //siyaluma <tr> tika select karagena ewaye style reset kirima
        //kalin tr ekak click kara thibboth eya reset kirimata
        document.querySelectorAll("tr").forEach(row => {
            //no-hover class eka remove kirima
            row.classList.remove("no-hover");
            //reset clickRow style
            row.classList.remove("clickRow");
        });



        //hover effect iwath kirima
        clickedRow.classList.add("no-hover");
        //add clickRow style
        clickedRow.classList.add("clickRow");

        // buttons row sadaha tr ekak sada ganima
        let buttonRow = document.createElement("tr");
        //class ekak add kirima
        buttonRow.classList.add("buttonrow");
        //hover effect iwath kirima
        buttonRow.classList.add("no-hover");

        //button tika damimata td ekak sada ganima
        let buttonTd = document.createElement("td");
        //ema td eka clicked row eke athi td ganata samanawa colspan kara ganima
        buttonTd.colSpan = clickedRow.children.length;
        //button tika center kirima
        buttonTd.style.textAlign = "center";


        //edit button area start
        let buttonEdit = document.createElement("button");
        buttonEdit.className = "btn btnUpdate";
        buttonEdit.innerHTML = "<i class='fa-solid fa-file-pen'></i> Edit";
        buttonEdit.style.marginRight = "50px";

        //  modal eka open wimata
        if (offcanvasId != "") {
            buttonEdit.setAttribute("data-bs-toggle", "offcanvas");
            buttonEdit.setAttribute("data-bs-target", offcanvasId);
        }
        //button row eke td ekata button tika append kirima
        buttonTd.appendChild(buttonEdit);
        buttonEdit.onclick = () => {
            //console.log("Edit" , dataob);
            editFunction(dataob, index);
        }
        //edit button area end

        //delete button area start
        let buttonDelete = document.createElement("button");
        buttonDelete.className = "btn btnClear ms-1 me-1";
        buttonDelete.innerHTML = " <i class='fa fa-trash'></i> Delete";

        //button row eke td ekata button tika append kirima
        buttonTd.appendChild(buttonDelete);
        buttonDelete.onclick = () => {
            //console.log("Delete" , dataob);
            deleteFunction(dataob, index);
        }
        //delete button area end

        //view button area start
        let buttonView = document.createElement("button");
        buttonView.className = "btn btnView";
        buttonView.innerHTML = "<i class='fa fa-eye'></i> View";
        buttonView.style.marginLeft = "50px";

        //button row eke td ekata button tika append kirima
        buttonTd.appendChild(buttonView);
        buttonView.onclick = () => {
            //console.log("View" , dataob);
            viewFunction(dataob, index);
            
        }
        
        //view button area end



        //ema td eka button row ekata append kirima
        buttonRow.appendChild(buttonTd);

        // Insert the action row after the clicked row
        //clickedRow.parentNode - clicked kala row eka parent (tbody)
        //clickedRow.nextSibling - clicked row ekata pasuwa ena row eka 
        //element(tbody).insertBefore(insert kala yuthu element eka(actionRow) , The element to insert before>>If null>>it will be inserted at the end)  
        //mehidi table body eka thula clicked kala row ekata pasuwa ena row ekata pere actionRow eka add wei
        clickedRow.parentNode.insertBefore(buttonRow, clickedRow.nextSibling);
    };
});
};
