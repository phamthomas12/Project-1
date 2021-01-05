
 $('.menu .item')
    .tab(); 

getToken();


function getFlightOffer(amadeusAccessToken) {
    var origCity = "SYD";
    var destCity = "SIN";
    //var departDate = ;
    //var returnDate = ;
    var countryCurrency = "SGD";

    $.ajax({
        type: "get",
        url: "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" + origCity +"&destinationLocationCode=" + destCity + "&departureDate=2021-02-01&adults=1&nonStop=false&currencyCode=AUD&max=10",
        dataType: 'json',
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + amadeusAccessToken);
        },
        success: function(json) {
            console.log(json);
            renderResult(json);
            console.log(json.data[0].itineraries[0].segments[0].aircraft.code);
            console.log(json.data[0].itineraries[0].segments[0].departure.iataCode);
            console.log(json.data[0].itineraries[0].segments[0].arrival.iataCode);
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
    console.log("this function is called");
var airlineCode = $("<p>");
airlineCode.attr("id", "air-code").text(response.data[0].itineraries[0].segments[0].aircraft.code);
var airOrigin = $("<p>");
airOrigin.attr("id", "air-origin").text(response.data[0].itineraries[0].segments[0].departure.iataCode);
var airDestination = $("<p>");
airDestination.attr("id", "air-depart").text(response.data[0].itineraries[0].segments[0].arrival.iataCode);
$("#flight-result").append(airlineCode, airOrigin, airDestination); 
//var departDateTime
//var arriveDateTime
//var totalPrice  
}


