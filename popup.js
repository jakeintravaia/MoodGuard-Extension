// Stores our negative image limit using Chrome localStorage

$(".confirm-btn").on("click", function () {
    if ($(".limit").val()) {
        localStorage.setItem("limit", $(".limit").val());
    } else {
        alert("Please enter a valid value.");
    }
});

// Sends a query to our background.js

$(".rescan-btn").on("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'rescanPage', functionName: 'convertImagesToBase64' });
    });
});

// When the document loads, parse data sent back from server via localStorage
// Update our popup values to accurately display our model results

$(document).ready(function () {
    data = JSON.parse(localStorage.getItem('extensionData'));
    $(".positive-cnt").html(data["positive"]);
    $(".negative-cnt").html(data["negative"]);
    $(".limit").val(localStorage.getItem("limit"));
});
