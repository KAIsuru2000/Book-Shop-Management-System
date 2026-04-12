window.addEventListener("load", () => {
    console.log("browser load Event");
    refreshInventoryTable();
});

const refreshInventoryTable = () => {
    let inventoryData = getServiceRequest("/inventory/alldata");

    let propertyList = [
        { propertyName: generateItemName, dataType: "function" },
        { propertyName: "salesprice", dataType: "decimal" },
        { propertyName: "avalablequantity", dataType: "string" },
        { propertyName: "totalquantity", dataType: "string" }
    ];

    // Dummy functions for action buttons since there is no form
    const dummyFunction = (ob, index) => {
        window.alert("Actions are disabled for Inventory view.");
    };

    fillDataIntoTable(tableInventoryBody, inventoryData, propertyList, dummyFunction, dummyFunction, dummyFunction, "");

    $('#tableInventory').DataTable();
};

const generateItemName = (dataob) => {
    return dataob.item_id.itemcode + " - " + dataob.item_id.itemname;
};
