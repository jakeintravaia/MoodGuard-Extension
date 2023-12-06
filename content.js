// Main function that scrapes images from a webpage

function convertImagesToBase64() {
    var images = document.querySelectorAll('img');
    var base64DataArray = [];
    var promises = [];

    images.forEach(function (image) {
        // Prevent CORS issues
        image.setAttribute('crossorigin', 'anonymous');

        var promise = new Promise(function (resolve) {
            // Check if the image is already loaded (in the cache)
            if (image.complete && image.naturalWidth !== 0) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                var base64Data = canvas.toDataURL('image/jpeg');
                console.log(base64Data);
                resolve(base64Data);
            } else {
                // If the image is not in the cache, use onload event
                image.addEventListener('load', function () {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0);
                    var base64Data = canvas.toDataURL('image/jpeg');
                    console.log(base64Data);
                    resolve(base64Data);
                }, { once: true });

                // If there's an error loading the image, reject the promise
                image.addEventListener('error', function (error) {
                    console.error('Image failed to load:', error);
                    resolve(null); // Resolve with null in case of error
                });
            }
        });

        promises.push(promise);
    });

    Promise.all(promises).then(function (results) {
        base64DataArray = results.filter(data => data !== null); // Filter out null results
        console.log(base64DataArray);
        setTimeout(function () {
            chrome.runtime.sendMessage({ base64DataArray: base64DataArray });
            //alert("FUNCTION CALLED AND POST REQUEST ISSUED.");
        }, 0);
    });
}




    

$(document).ready(function () {
    convertImagesToBase64();
    
    //base64DataArray = convertImagesToBase64();
    //chrome.runtime.sendMessage({ base64DataArray: base64DataArray });
});

// Add a listener to respond to messages from popup.js

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.type === 'rescanPage') {
            convertImagesToBase64();
        }
    });







