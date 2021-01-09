
 $('.menu .item')
    .tab(); 

 

//getToken();


function getFlightOffer(amadeusAccessToken) {
    var origCity = $("#search-from").val().slice(0,3);
    var destCity = $("#search-to").val().slice(0,3);
    var depDate = $("#depart-date").val();
    var retDate = $("#return-date").val();
    //var countryCurrency = "SGD";

    $.ajax({
        type: "get",
        url: "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" + origCity +"&destinationLocationCode=" + destCity + "&departureDate=" + depDate + "&returnDate=" + retDate + "&adults=1&nonStop=false&currencyCode=AUD&max=10",
        dataType: 'json',
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + amadeusAccessToken);
        },
        success: function(json) {
            console.log(json);
            renderResult(json);
            //console.log(json.data[0].itineraries[0].segments[0].aircraft.code);
            //console.log(json.data[0].itineraries[0].segments[0].departure.iataCode);
            //console.log(json.data[0].itineraries[0].segments[0].arrival.iataCode);
        }
    });
}


function getToken() {
    var tokenUrl = "https://test.api.amadeus.com/v1/security/oauth2/token"
        // var dataTokenObj = {
        //     grant_type: "client_credentials",
        //     client_id: "Iksc8m3E4tkLZLHXkTsP8unAivjgIyQT",
        //     client_secret: "7WMdL1DuQMIPJLJr"
        // };
    var dataTokenObj = "grant_type=client_credentials&client_id=Iksc8m3E4tkLZLHXkTsP8unAivjgIyQT&client_secret=7WMdL1DuQMIPJLJr"
    $.ajax({
        type: "POST",
        url: tokenUrl,
        data: dataTokenObj,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        success: function(json) {
            console.log(json);
            getFlightOffer(json.access_token);

        },
        error: function(er) {
            console.log(er);
        }
    });
}
//START OF RENDER RESULT BY WENDY
/* function renderResult(response) {
console.log("this function is called");
var airlineCode = $("<p>");
airlineCode.attr("id", "air-code").text(response.data[0].itineraries[0].segments[0].aircraft.code);
var airOrigin = $("<p>");
airOrigin.attr("id", "air-origin").text(response.data[0].itineraries[0].segments[0].departure.iataCode);
var airDestination = $("<p>");
airDestination.attr("id", "air-depart").text(response.data[0].itineraries[0].segments[0].arrival.iataCode);
$("#flight-result").append(airlineCode, airOrigin, airDestination);  */
//var departDateTime
//var arriveDateTime
//var totalPrice  

//}
//END OF RENDER RESULT BY WENDY

//START OF RENDER RESULT BY AM

function renderResult(response) {
    $("#flight-result").empty();
    var airlineCodes = response.dictionaries.carriers;
    var dataAllFlight = response.data;
    var dataFlight = [];
    if (dataAllFlight.length >=5){
        dataFlight = dataAllFlight.slice(0,5);
    }
    else {
        dataFlight = dataAllFlight;
    }
    //var x = 0;
    dataFlight.forEach(function(data){
        //console.log(data);
        data.itineraries.forEach(function(itineraries){
            //console.log(itineraries);
            //var itineraryDiv = $("<div>").addClass("itinerary-div");
            var xy = 0;
            itineraries.segments.forEach(function(segments){
                //console.log(segments);
                var newSegmentDiv = $("<div>").addClass("segment-div")
                var airlineName = $("<p>").addClass("flight-name");/*.css("font-weight", "bold").css("font-size", "16px").css("margin-bottom", "2px");*/
                airlineName.text(airlineCodes[segments.carrierCode] + ", " + segments.carrierCode + segments.number);

                var airPortDepart = airPortName(segments.departure.iataCode);
                var newAirportDepartP = $("<p>");
                newAirportDepartP.text(airPortDepart + " Terminal " + segments.departure.terminal).addClass("airport-depart");
                
                var tDepartSegment = new Date(segments.departure.at);
                var options = { weekday: 'long'};
                var dayOfWeek = new Intl.DateTimeFormat('en-US', options).format(tDepartSegment);
                var monthOfYear = tDepartSegment.toLocaleString('default', {month: 'long'});
                var newDepartP = $("<p>").addClass("depart-date");
                newDepartP.text(tDepartSegment.getHours() + ":" + tDepartSegment.getMinutes() + " " + dayOfWeek + " " + tDepartSegment.getDate() + " " + monthOfYear);

                var airPortArrive = airPortName(segments.arrival.iataCode);
                var newAirportArriveP = $("<p>");
                newAirportArriveP.text(airPortArrive + " Terminal " + segments.arrival.terminal).addClass("airport-arrive");

                var tArriveSegment = new Date(segments.arrival.at);
                var options = { weekday: 'long'};
                var dayOfWeek = new Intl.DateTimeFormat('en-US', options).format(tArriveSegment);
                var monthOfYear = tArriveSegment.toLocaleString('default', {month: 'long'});
                var newArriveP = $("<p>").addClass("arrive-date");
                newArriveP.text(tArriveSegment.getHours() + ":" + tArriveSegment.getMinutes() + " " + dayOfWeek + " " + tArriveSegment.getDate() + " " + monthOfYear);

                var newDepartP2 = $("<p>").text("Departure:").css("font-weight", "bold").css("margin-bottom", "4px");
                var newArriveP2 = $("<p>").text("Arrival:").css("font-weight", "bold").css("margin-bottom", "4px");

                newSegmentDiv.append(airlineName).append(newDepartP2).append(newDepartP).append(newAirportDepartP).append(newArriveP2).append(newArriveP).append(newAirportArriveP);

                $("#flight-result").append(newSegmentDiv);
            })
        })
        var newHRule = $("<hr>");
        var newBr = $("<br>")
        $("#flight-result").append(newHRule).append(newBr);
    })
    
//var tripCarrier = response.data[0].itineraries[0].segments[0].carrierCode;
//console.log(airlineCodes[tripCarrier]);
//var airlineCode = $("<p>");
//airlineCode.attr("id", "air-code").text(response.data[0].itineraries[0].segments[0].aircraft.code);
//var airOrigin = $("<p>");
//airOrigin.attr("id", "air-origin").text(response.data[0].itineraries[0].segments[0].departure.iataCode);
//var airDestination = $("<p>");
//airDestination.attr("id", "air-depart").text(response.data[0].itineraries[0].segments[0].arrival.iataCode);
//$("#flight-result").append(airlineCode, airOrigin, airDestination);
//var departDateTime
//var arriveDateTime
//var totalPrice  

}

//END OF RENDER RESULT BY AM

//setListFrom
function setListFrom(airPorts) {
    $("#list-from").empty();
    for (var i = 0; i < airPorts.length; i++) {
        var newLi = $("<li>");
        newLi.text(airPorts[i]).addClass("list-filter-from");
        $("#list-from").append(newLi);

    }
    if (airPorts.Length == 0){
        setNoResultsFrom();
    }

}
//setListTo
function setListTo(airPorts) {
    $("#list-to").empty();
    for (var i = 0; i < airPorts.length; i++) {
        var newLi = $("<li>");
        newLi.text(airPorts[i]).addClass("list-filter-to");
        $("#list-to").append(newLi);

    }
    if (airPorts.Length == 0){
        setNoResultsTo();
    }

}
//setNoResultsFrom
function setNoResultsFrom() {
    var newLi = $("<li>");
    newLi.text('No results found');
    $("#list-from").append(newLi);
}

//setNoResultsTo
function setNoResultsTo() {
    var newLi = $("<li>");
    newLi.text('No results found');
    $("#list-to").append(newLi);
}

$("#search-from").on("input",function(event){
    //console.log("Handler for From input was fired");
    var valueFrom = event.target.value;
    if (valueFrom && valueFrom.trim().length > 0){
        var x = xTract(valueFrom);
        setListFrom(x);
    }
    else {
        $("#list-from").empty();
    }
})
    
$("#search-to").on("input", function(event){
    //console.log("Handler for To input was fired");
    var valueTo = event.target.value;
    if (valueTo && valueTo.trim().length > 0){
        var x = xTract(valueTo);
        setListTo(x);
    }
    else {
        $("#list-to").empty();
    }
})

$("#list-from").on("click",".list-filter-from", function(event){
    //console.log("this event was triggered.");
    $("#search-from").val($(this).text());
    $("#list-from").empty();
})

$("#list-to").on("click",".list-filter-to", function(event){
    //console.log("this event was triggered.");
    $("#search-to").val($(this).text());
    $("#list-to").empty();
})

$("#depart-date").on("change", function(){
    //console.log("Depart Date event was triggered");
    //console.log($(this).val());
})

$("#return-date").on("change", function(){
    //console.log("Return Date event was triggered");
    //console.log($(this).val());
})


//search flight event trigger

$("#flight-search-btn").on("click", function(event){
    event.preventDefault();
    getToken();
})

//validation function - created by AM



