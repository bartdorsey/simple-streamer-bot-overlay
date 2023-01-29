const url = "ws://localhost:8080/"

// Streamerbot needs some kind of unique ID between messages so it knows who you are
const id = "04958349083490580345809"
// Create a new socket connection
const socket = new WebSocket(url);

socket.addEventListener('error', event => {
  alert('Websocket error, make sure the server is running', event);
});

// Listen for the open event, so we know the connection
// is made
socket.addEventListener('open', event => {
  console.log("Socket Open", event);
  // Now we can start listening for messages  
  socket.addEventListener('message', event => {
    const response = JSON.parse(event.data);
    console.log("Response", response);
    
    // Normal streamerbot events have an event property
    if (response.event) {
      // Check what kind of event it is
      switch (response.event.source) {
        case "Twitch":
          switch (response.event.type) {
            case "Whisper":
              // Grab the div on the page
              const whisperOverlay = document.querySelector("#whisper-overlay");
              // Update the contents of the div with the message from the whisper
              whisperOverlay.innerHTML = response.data.message.message;
          }
      }
    }  
  });
  
  // This is the streamerbot subscribe message
  const subscribeMessage = {
    "request": "Subscribe",
    "id": id,
    "events": { // List out all the events you want to listen for
      "Twitch": ["Whisper"]
    }
  }
  // Send the subscribeMessage
  socket.send(JSON.stringify(subscribeMessage));
})
