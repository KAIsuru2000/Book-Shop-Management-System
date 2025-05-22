//browser load event
window.addEventListener("load", () => {

    console.log("browser load Event");

    // enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function for refresh table
    refreshItemTable();

    //Call refresh form function
    refreshItemForm();

})

//create function for refresh table
const refreshItemTable = () => {

    //controller wala hadapu service eka magin data array eka laba ganima
    const items = getServiceRequest("/item/alldata");

    //create display property list
    //data types
    //string => string / data / number
    //function => object / array / boolean
    displayPropertyList = [
        //function name ekak add karai call kirimak sidu nowe

        // price wala decimal point dekwima sadaha
        // dataType:decimal >> e sadaha decimal nam data type ekak thibiya yuthuya >> tablefunction js ekata gos 

        { dataType: 'string', propertyName: 'itemcode' },
        { dataType: 'string', propertyName: 'itemname' },
        { dataType: 'decimal', propertyName: 'purchaseprice' },
        { dataType: 'string', propertyName: 'profitrate' },
        { dataType: 'decimal', propertyName: 'salesprice' },
        { dataType: 'string', propertyName: 'roq' },
        { dataType: 'function', propertyName: getItemStatus },
    ];

    // call tablefill function
    fillDataIntoTable(tableItemBody, items, displayPropertyList, rowFormRefill, rowDelete, rowPrint, "#offcanvasBottom");

    //call jquerry data table
    $('#tableItem').dataTable();
}

// table ekehi status eka penwimata 
const getItemStatus = (dataob) => {
    if (dataob.itemstatus_id.name == "Available") {
        return '<i class="fa-solid fa-store fa-beat fa-xl" style="color: #00fa11;"></i>'
    }
    if (dataob.itemstatus_id.name == "Not-Available") {
        return '<i class="fa-solid fa-store-slash fa-beat fa-xl" style="color:rgb(249, 236, 1);"></i>'
    }
    if (dataob.itemstatus_id.name == "Deleted") {
        return '<i class="fa-solid fa-trash-can fa-beat fa-xl" style="color: #fa0000;"></i>'
    }

}

// define function for genarate sales price
const genarateSalesPrice = () => {
    let profitRatio = textProfitRatio.value;
    let purchasePrice = textPurchasePrice.value;
    let salesPrice = parseFloat(purchasePrice)+(parseFloat(purchasePrice) * parseFloat(profitRatio)/100);
    textSalesPrice.value = parseFloat(salesPrice).toFixed(2);

    // validation colour and binding
    prevElementSalesPrice = textSalesPrice.previousElementSibling;
    textSalesPrice.style.borderBottom = "4px solid green";
    prevElementSalesPrice.style.backgroundColor = "green";
    textSalesPrice.classList.remove("is-invalid");
    textSalesPrice.classList.add("is-valid");
    item.salesprice = textSalesPrice.value;
}

// form refill function
const rowFormRefill = (dataob, rowIndex) => {
    console.log("Update");
    console.log(dataob);



    // refill value in to element
   

    let subcategoriesByCategory = getServiceRequest('/subcategory/bycategory?categoryid=' + dataob.subcategory_id.category_id.id);
    fillDataIntoSelect(selectItemSubcategory, "Please Select subcategories..!!", subcategoriesByCategory, "name");

     selectItemCategory.value = JSON.stringify(dataob.subcategory_id.category_id);

    let brandByCategory = getServiceRequest('/brand/bycategory/' + dataob.subcategory_id.category_id.id);
    fillDataIntoSelect(selectItemBrand, "Please Select Brand..!!", brandByCategory, "name");

    selectItemBrand.value = JSON.stringify(dataob.brand_id);
    selectItemSubcategory.value = JSON.stringify(dataob.subcategory_id);
    selectItemStatus.value = JSON.stringify(dataob.itemstatus_id);
    textItemName.value = dataob.itemname;
    textROP.value = dataob.rop;
    textROQ.value = dataob.roq;
    textPurchasePrice.value = dataob.purchaseprice;
    textProfitRatio.value = dataob.profitrate;
    textSalesPrice.value = dataob.salesprice;
    textDiscountRatio.value = dataob.discountrate;
    textNote.value = dataob.note;

    //update kirima sadaha awashya object 2 sada ganima
    item = JSON.parse(JSON.stringify(dataob));
    oldItem = JSON.parse(JSON.stringify(dataob));

    console.log("item", item);
    console.log("oldItem", oldItem);

    //disable submit button
     submitButton.style.visibility = "hidden";
     updateButton.style.visibility = "visible";


}

const rowDelete = (dataob, rowIndex) => {

    console.log("Delete", dataob, rowIndex);

    // activeTableRow(tableEmployeeBody, index, "red");


    let userConfirm = window.confirm("Are you sure to delete following item...?" +
        "\n Item code : " + dataob.itemcode +
        "\n Item name : " + dataob.itemname +
        "\n Item sale price : " + dataob.salesprice
    );
    if (userConfirm) {
        // call post service
        //anthima parameter eka sadaha employeeDelete function eken pass wana name eka yodai
        let deleteResponce = getHTTPServiceRequest("/item/delete", "DELETE", dataob);

        if (deleteResponce == "OK") {
            window.alert("Delete successfully ");
            refreshItemTable();
            refreshItemForm();

        } else {
            window.alert("Delete not successfully" + deleteResponce);

        }




    }

}

const rowPrint = (dataob, rowIndex) => { }


// creat function for refersh user form
//mema function eka browser eka refresh wana thana call karai
//meya browser refresh function eka thula call karai 
const refreshItemForm = () => {

    formItem.reset();

    //create object call item
    // form ekata enter karana value mehi store we
    item = new Object();



    //validation colors iwath kirima
    setDefault([selectItemCategory, selectItemBrand, selectItemSubcategory, selectItemStatus, textItemName, textROP, textROQ, textPurchasePrice, textProfitRatio, textSalesPrice, textDiscountRatio, textNote]);

    // dynamic element refill kala yuthuya
    let brand = getServiceRequest('/brand/alldata')
    let categories = getServiceRequest('/Category/alldata');

    
    let itemStatus = getServiceRequest('/itemStatus/alldata');
    let subCategory = getServiceRequest('/subCategory/alldata');
    

    fillDataIntoSelect(selectItemBrand, "Please Select brand..!", brand, "name");
    fillDataIntoSelect(selectItemCategory, "Please Select categories..!", categories, "name");

    fillDataIntoSelect(selectItemStatus, "Please Select itemStatus..!", itemStatus, "name");
    // status eka form eka load wana wita select wi thibimata
    // selected value eka string walin ena nisa stringify kara gani
    selectItemStatus.value = JSON.stringify(itemStatus[0]);
    // ema value eka newatha object ekata set kala yuththa object format ekeni
    item.itemstatus_id = JSON.parse(selectItemStatus.value);
    // validation colour eka laba deema
    prevElementItemStatus = selectItemStatus.previousElementSibling;
    selectItemStatus.style.borderBottom = "4px solid green";
    prevElementItemStatus.style.backgroundColor = "green";
    selectItemStatus.classList.remove("is-invalid");
    selectItemStatus.classList.add("is-valid");

    fillDataIntoSelect(selectItemSubcategory, "Please Select Item Subcategory..!", subCategory, "name");
}

// item category wala id eka cach karagena
//eyata link ekak nathi nisa binding validation en netha
// ema category element eka change una pasu anonimus function ekak add kirima >> dynamic nisa ehi value eka category variable ekata aragena (ema value eka string type nisa jason parse kara ganna) >> emagin ena category object eka value eka if magin check kirima >> ema category object ekehi name eka anuwa element disable , unable kala heka
let selectCategoryElement = document.getElementById("selectItemCategory");
selectCategoryElement.addEventListener("change", () => {
    let category = JSON.parse(selectCategoryElement.value);

    // validation color laba deema
    if (selectCategoryElement.value != "") {
    prevElementItemCategory = selectItemCategory.previousElementSibling;
    selectItemCategory.style.borderBottom = "4px solid green";
    prevElementItemCategory.style.backgroundColor = "green";
    selectItemCategory.classList.remove("is-invalid");
    selectItemCategory.classList.add("is-valid");
    }else{
    prevElementItemCategory = selectItemCategory.previousElementSibling;
    selectItemCategory.style.borderBottom = "4px solid red";
    prevElementItemCategory.style.backgroundColor = "red";
    selectItemCategory.classList.add("is-invalid");
    selectItemCategory.classList.remove("is-valid");
    }
    

    if (category.name == "Book") {
        // elementId.disabled = "disabled";
    }

    if (category.name == "pen") {
        // elementId.disabled = "disabled";
    }

    //mehi name eka item input ekata set kirima
    // textItemName.value = category.name;




    // category magin sub category eka load kirima >> eya er eka magin haduna gatha yuthuya
    //steps --> 1.workbench wala query eka liwima
    //   2.ema query eka adala dao file ekata demima
    //      3.adala controller update kirima
    //      4.url ekehi test kirima
    // er ekehi subcategory ha category athara aththa many to one ekaki >> ema nisa category value ekakata sambanda subcategory value godak atha. >> ema niasa selected category ekata adala subcategory tika ganimata heki wiya yuthuya
    // e sadaha subcategorydao file ekehi qureyak liya ema output ekata subcategorycontroller thula service ekak sada ema querry ekahi out put eka genwa gatha heka >> test kala eka magin parameter ekak dunnoth controller ekai dao ekai update wei 
    // url wala test kala pasu values param pass wenawanam param pas karana krama 2ki 
    // 1.query param -url patha ekehi "?" ekan pasuwa ena name value pairs lesa yai "&" walin pasu anith value eka(categoryid=1) >> controller service ekehi value ekathula params lesa eka param ekehi nama diya yuthuya
    // 2.path param - parameter value eka patha ekama yawima >> url eke thibena thana "/" pasuwa value eka yama "/" pasu anith value eka(1)
    // inpasu query ekata gos byCatogory(Integer categoryid) lesa add kara ganima
    // inpasu ema category id eka querry ekata pass kirima
    //ema url eka magin data gena adala dropdown ekata set kala heka



    let subcategoriesByCategory = getServiceRequest('/subcategory/bycategory?categoryid=' + category.id);

    fillDataIntoSelect(selectItemSubcategory, "Please Select subcategories..!!", subcategoriesByCategory, "name");
    item.subcategory_id = null;


    // category and brand athara sambandaya dekwimaa
    //mehidee category eka magin brand eka ganimata hekiwana paridi sadai
    //given category ekata adalawa brand ganimata nam brand has category table eka haraha data ganimata sidu wei >> apa dena category id ekata samana wana brand eka association table eka thula sitiya yuthuya
    //steps --> 1.workbench wala query eka liwima
    //   2.ema query eka adala dao file ekata demima >> association table ekata entity file sadima
    //      3.adala controller update kirima
    //      4.url ekehi test kirima

    // brand table ekehi query eka liya test kirima D-23-2.25
    //association table ekata entity yak liwima
    // meya path veriable(param) akarayata sadai

    let brandByCategory = getServiceRequest('/brand/bycategory/' + category.id);

    fillDataIntoSelect(selectItemBrand, "Please Select Brand..!!", brandByCategory, "name");
    item.brand_id = null;

    spanItemNameElement = textItemName.previousElementSibling;
    spanItemBrandElement = selectItemBrand.previousElementSibling;
    spanItemSubcategoryElement = selectItemSubcategory.previousElementSibling;

        textItemName.value ="";
        textItemName.style.borderBottom = "4px solid red";
        selectItemBrand.style.borderBottom = "4px solid red";
        selectItemSubcategory.style.borderBottom = "4px solid red";
        spanItemNameElement.style.backgroundColor = "red";
        spanItemBrandElement.style.backgroundColor = "red";
        spanItemSubcategoryElement.style.backgroundColor = "red";
        textItemName.classList.add("is-invalid");
        selectItemBrand.classList.add("is-invalid");
        selectItemSubcategory.classList.add("is-invalid");
        textItemName.classList.remove("is-valid");
        selectItemBrand.classList.remove("is-valid");
        selectItemSubcategory.classList.remove("is-valid");
        item.itemname = null; //item object add to value null

});



// define function for generate item name
const generateItemName = () => {

    console.log("generateItemName", item);

    let category = item.subcategory_id.category_id;
    let brand = item.brand_id;
    let subCategory = item.subcategory_id;


    // validation wala colour eka laba deema sadaha
    spanElement = textItemName.previousElementSibling;

    if (item.brand_id != null && item.subcategory_id.name != null ){

        textItemName.value = brand.name + " " + subCategory.name;

        textItemName.style.borderBottom = "4px solid green";
        spanElement.style.backgroundColor = "green";
        textItemName.classList.remove("is-invalid");
        textItemName.classList.add("is-valid");
        item.itemname = textItemName.value; //value add to item object

    } else {

        textItemName.value ="";
        textItemName.style.borderBottom = "4px solid red";
        spanElement.style.backgroundColor = "red";
        textItemName.classList.add("is-invalid");
        textItemName.classList.remove("is-valid");
        item.itemname = null; //item object add to value null

    }
}

//define function for get item form error
//form eke ek ek property check kara values naththan msg ekak return kara ganima sdaha
const checkItemFormError = () => {
    let errors = "";

    if (item.brand_id == null) {
        errors = errors + "Please select item brand...\n";
    }
    if (item.subcategory_id == null) {
        errors = errors + "Please select item subcategory...\n";
    }
    
    if (item.itemstatus_id == null) {
        errors = errors + "Please select item status...\n";
    }
    if (item.rop == null) {
        errors = errors + "Please enter rop...\n";
    }
    if (item.roq == null) {
        errors = errors + "Please enter roq...\n";
    }
    if (item.purchaseprice == null) {
        errors = errors + "Please enter purchase price...\n";
    }
    if (item.profitrate == null) {
        errors = errors + "Please enter profit rate...\n";
    }
    if (item.salesprice == null) {
        errors = errors + "Please enter sales price...\n";
    }
    if (item.discountrate == null) {
        errors = errors + "Please enter discount rate...\n";
    }

    return errors;
}

//define function for submit item object
const submitItemForm = () => {

    console.log('Add Item', item);

    //check form error for required element
    let errors = checkItemFormError();

    //get user confurmation
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure to add following item details" +
            "\n Item name : " + item.itemname +
            "\n Item purchase price : " + item.purchaseprice +
            "\n Item sales price : " + item.salesprice
        );

        //call post service
        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/item/insert", "POST", item);
            if (postResponce == "OK") {
                window.alert("Item Added Successfully...!");
                refreshItemTable();
                refreshItemForm();
                $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas

            } else {
                window.alert("Fail to submit has following error\n" + errors + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors \n" + errors);
    }

}

//define function for check item updates
const checkItemFormUpdate = () => {

    let updates = "";

    //mulinma veriable eka thibeda balima >> item and olditem >> compair kirima sadaha value thibiya yuthuya
    if (item != null && oldItem != null) {
        if (item.subcategory_id.category_id.name != oldItem.subcategory_id.category_id.name) {
            updates = updates + "category is change...! \n";
        }
        if (item.brand_id.name != oldItem.brand_id.name) {
            updates = updates + "brand name is change...! \n";
        }
        if (item.subcategory_id.name != oldItem.subcategory_id.name) {
            updates = updates + "subcategory is change...! \n";
        }
        
        if (item.itemstatus_id.name != oldItem.itemstatus_id.name) {
            updates = updates + "item status is change...! \n";
        }
        if (item.itemname != oldItem.itemname) {
            updates = updates + "itemname is change...! \n";
        }
        if (item.rop != oldItem.rop) {
            updates = updates + "rop is change...! \n";
        }
        if (item.roq != oldItem.roq) {
            updates = updates + "roq is change...! \n";
        }
        if (item.purchaseprice != oldItem.purchaseprice) {
            updates = updates + "purchase price is change...! \n";
        }
        if (item.profitrate != oldItem.profitrate) {
            updates = updates + "profit rate is change...! \n";
        }
        if (item.salesprice != oldItem.salesprice) {
            updates = updates + "sales price is change...! \n";
        }
        if (item.discountrate != oldItem.discountrate) {
            updates = updates + "discount rate is change...! \n";
        }
        if (item.note != oldItem.note) {
            updates = updates + "note is change...! \n";
        }

    }
    return updates;

}

//define function for update item
const buttonItemUpdate = () => {

    console.log("item", item);
    console.log("oldItem", oldItem);

    //need to check form error
    let errors = checkItemFormError();

    //get user confurmation
    if (errors == "") {

        let updates = checkItemFormUpdate();
        if (updates != "") {
            let userConfirm = window.confirm("Are you sure to update following user changes \n"
                + updates

            );

            //call post service
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/item/update", "PUT", item);
                if (putResponce == "OK") {
                    window.alert("item Added Successfully...!");
                    refreshItemTable();
                    refreshItemForm();
                    $("#offcanvasBottom").offcanvas("hide"); // Close the offcanvas

                } else {
                    window.alert("Fail to update has following error\n" + putResponce);
                }
            }
        } else {
            window.alert("Nothing to updated \n" + errors);
        }




    } else {
        window.alert("Form has following error \n" + errors);
    }

}








