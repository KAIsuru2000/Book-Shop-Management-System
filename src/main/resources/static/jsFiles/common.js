//define function for fill data into select (elementid, displaymsg, datalistname,displaypropertyname)
const fillDataIntoSelect = (parentId,message,dataList,displayProperty)=>{
    parentId.innerHTML = "";
    let optionMsgEs = document.createElement("option");
    optionMsgEs.value = "";
    optionMsgEs.selected = "selected";
    optionMsgEs.disabled = "disabled";
    optionMsgEs.innerText = message;
    parentId.appendChild(optionMsgEs);

    dataList.forEach(dataOb => {
        let option = document.createElement("option");
        option.value = JSON.stringify(dataOb);
        option.innerText = dataOb[displayProperty];
        parentId.appendChild(option);
        
    });
}

//form refresh form border color
// meya employee js wala refreshform function eka thula call kara atha 
const setDefault = (elements) => {
    elements.forEach(element => {
        element.style.borderBottom = "1px solid #ced4da";
        element.previousElementSibling.style.backgroundColor = "black";
        element.classList.remove("is-valid");
        element.classList.remove("is-invalid");
    });
    
}

// define function for get service request
const getServiceRequest = (url) => {

    let getServiceRequest = [];
    $.ajax({
        url: url , //request eka send wena url eka
        contentType: 'application/json', //data ena type eka
        type: 'GET', //get wala data request header eken pas we.ema nisa meya data ganimata pamanak yoda gani
        //request area - request header > apita pena url header eka(get) data ganna use karai
        //             - request body(post,put,delete) data yewimata yoda gani . mehi yana data apita pen ne
        async: false, //data enakan balan innawa
        success: function(response){
            console.log('Success:' , response);
            getServiceRequest = response;
        },
        error: function(error){
            console.log('Error:', url, error );
        }
    });

    return getServiceRequest;
}

// define function for post put delete service request
const getHTTPServiceRequest = (url, method, data) => {

    let getServiceRequest = [];
    $.ajax({ //A jQuery function to perform an asynchronous or synchronous HTTP request
        url: url , //The target URL of the request.
        type: method, //The HTTP method (e.g., GET, POST).
        contentType: 'application/json', //Indicates that the request data will be sent as JSON.
        data : JSON.stringify(data), //Converts the data object into a JSON string before sending it.
        async: false, //This means the browser will wait for the request to complete before continuing execution
        success: function(response){ //A callback function that executes if the request is successful. It logs the response and assigns it to getServiceRequest.
            console.log('Success:' , response);
            getServiceRequest = response;
        },
        error: function(error){ //A callback function that executes if the request fails. It logs the error details.

            console.log('Error:', url, error );
        }
    });

    return getServiceRequest; //After the AJAX call completes (synchronously), the getServiceRequest variable, now containing the server's response, is returned.
}

 

