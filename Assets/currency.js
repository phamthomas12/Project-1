function exchangeCurrency() {
    var selectCurrency = $("#list-currency").val().trim();
    currencyURL = 'https://api.exchangeratesapi.io/latest?base=AUD&symbols=' + selectCurrency;


    $.ajax({
        url: currencyURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log(response.base)
        console.log(response.rates.USD)
        console.log("converted: " + response.rates[selectCurrency])
        var amount = $("#origin-currency").val();
        var convertedAmount = amount * (response.rates[selectCurrency])
        var result = $("#currency-result").text(convertedAmount.toFixed(2) + " " + selectCurrency);
        $("#currency-container").append(result);
        console.log(convertedAmount);
    })
}

$(".item").on("click", function(event) {
    $("#list-currency").val($(this).text());
})

$("#currency-convert").on("click", function(event) {
    event.preventDefault();
    exchangeCurrency();
})

//clear button
$("#currency-clear").on("click", function(event) {
    event.preventDefault();
    $("#origin-currency").val("");
    $("#currency-result").text("");
})