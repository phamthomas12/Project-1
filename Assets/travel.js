$('.menu .item')
    .tab();

getToken();


function getFlightOffer(amadeusAccessToken) {
    $.ajax({
        type: "get",
        url: "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2021-02-01&adults=1&nonStop=false&max=250",
        dataType: 'json',
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + amadeusAccessToken);
        },
        success: function(json) {
            console.log(json);
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