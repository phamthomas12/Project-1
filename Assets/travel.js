
 $('.menu .item')
    .tab(); 


function getFlightOffer(amadeusAccessToken) {
    var origCity = $("#search-from").val().slice(0,3);
    var destCity = $("#search-to").val().slice(0,3);
    var depDate = $("#depart-date").val();
    var retDate = $("#return-date").val();

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
    dataFlight.forEach(function(data){
        data.itineraries.forEach(function(itineraries){
            itineraries.segments.forEach(function(segments){
                var newSegmentDiv = $("<div>").addClass("segment-div")
                var airlineName = $("<p>").addClass("flight-name");
                airlineName.text(airlineCodes[segments.carrierCode] + ", " + segments.carrierCode + segments.number);

                var airPortDepart = airPortName(segments.departure.iataCode);
                var newAirportDepartP = $("<p>");

                var terminalDepartText;
                if (segments.departure.hasOwnProperty('terminal')) {
                    terminalDepartText = " Terminal " + segments.departure.terminal;
                }
                else {
                    terminalDepartText = "";
                }


                newAirportDepartP.text(airPortDepart + terminalDepartText).addClass("airport-depart");
                
                var tDepartSegment = new Date(segments.departure.at);
                var options = { weekday: 'long'};
                var dayOfWeek = new Intl.DateTimeFormat('en-US', options).format(tDepartSegment);
                var monthOfYear = tDepartSegment.toLocaleString('default', {month: 'long'});
                var newDepartP = $("<p>").addClass("depart-date");
                newDepartP.text(zeroTrunc(tDepartSegment.getHours()) + ":" + zeroTrunc(tDepartSegment.getMinutes()) + " " + dayOfWeek + " " + tDepartSegment.getDate() + " " + monthOfYear);

                var airPortArrive = airPortName(segments.arrival.iataCode);
                var newAirportArriveP = $("<p>");


                var terminalArriveText;
                if (segments.arrival.hasOwnProperty('terminal')) {
                    terminalArriveText = " Terminal " + segments.arrival.terminal;
                }
                else {
                    terminalArriveText = "";
                }

                newAirportArriveP.text(airPortArrive + terminalArriveText).addClass("airport-arrive");

                var tArriveSegment = new Date(segments.arrival.at);
                var options = { weekday: 'long'};
                var dayOfWeek = new Intl.DateTimeFormat('en-US', options).format(tArriveSegment);
                var monthOfYear = tArriveSegment.toLocaleString('default', {month: 'long'});
                var newArriveP = $("<p>").addClass("arrive-date");
                newArriveP.text(zeroTrunc(tArriveSegment.getHours()) + ":" + zeroTrunc(tArriveSegment.getMinutes()) + " " + dayOfWeek + " " + tArriveSegment.getDate() + " " + monthOfYear);

                var newDepartP2 = $("<p>").text("Departure:").css("font-weight", "bold").css("margin-bottom", "4px");
                var newArriveP2 = $("<p>").text("Arrival:").css("font-weight", "bold").css("margin-bottom", "4px");

                newSegmentDiv.append(airlineName).append(newDepartP2).append(newDepartP).append(newAirportDepartP).append(newArriveP2).append(newArriveP).append(newAirportArriveP);

                $("#flight-result").append(newSegmentDiv);
            })
            var newFlightTimeP = $("<p>");
            newFlightTimeP.addClass("flight-time").text("Duration: " + itineraries.duration.slice(2));
            $("#flight-result").append(newFlightTimeP);
        })
        var newTotalP = $("<p>");
        newTotalP.addClass("total-cost").text("Total Price in AUD: " + data.price.total).css("background-color", "cyan");
        var newHRule = $("<hr>");
        var newBr = $("<br>")
        $("#flight-result").append(newTotalP).append(newHRule).append(newBr);
    })
}

//function to truncate zero for hours and minutes less than 10
function zeroTrunc (num) {
	if (num < 10) {
		return ('0' + num);
    }
else {
	return num;
    }
}

//setListFrom
function setListFrom(airPorts) {
    $("#list-from").empty();
    for (var i = 0; i < airPorts.length; i++) {
        var newLi = $("<li>");
        newLi.text(airPorts[i]).addClass("list-filter-from");
        $("#list-from").append(newLi);

    }
    if (airPorts.length == 0){
        setNoResultsFrom();
        $("#flight-search-btn").attr("disabled", "true");
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
    if (airPorts.length == 0){
        setNoResultsTo();
        $("#flight-search-btn").attr("disabled", "true");
    }

}
//setNoResultsFrom
function setNoResultsFrom() {
    var newLi = $("<li>");
    newLi.text('No match found').css("color", "red").css("font-weight", "bold");
    $("#list-from").append(newLi);
}

//setNoResultsTo
function setNoResultsTo() {
    var newLi = $("<li>");
    newLi.text('No match found').css("color", "red").css("font-weight", "bold");
    $("#list-to").append(newLi);
}

$("#search-from").on("input",function(event){
    console.log("Handler for From input was fired");
    $("#flight-search-btn").attr("disabled", false);
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
    console.log("Handler for To input was fired");
    $("#flight-search-btn").attr("disabled", false);
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


//initialize part of the logic

$("#flight-search-btn").attr("disabled", "true");



