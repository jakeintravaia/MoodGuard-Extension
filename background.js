// Listener to check if our convertImagesToBase64() function has been called
// If so, we need to send our images to our HTTP server
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.base64DataArray) {
        
        sendBase64DataToServer(message.base64DataArray);
    }
});

// This function sends a JSON string of base64 values to our HTTP server

function sendBase64DataToServer(base64DataArray) {
    var serverEndpoint = 'http:/127.0.0.1:8000/index.html'; // Change this as needed

    // Sends the POST request

    fetch(serverEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64DataArray: base64DataArray }),
    })
        .then(response => response.json())
        .then(data => {
            // Collecting our server response
            //console.log('Server response:', data);
            localStorage.setItem('extensionData', JSON.stringify(data)); // Store data in localStorage for use in popup.js
            var negLimit = localStorage.getItem("limit");

            // Check for negative image limit and alert user if we've met or surpassed it
            if (data["negative"] >= negLimit) {
                alert("Negative image limit reached! You might want to take a break for a while.");
            }
        })
        .catch(error => {
            console.error('Error sending data to the server:', error);
        });
}
