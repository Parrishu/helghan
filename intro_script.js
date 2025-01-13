const messages = [
    "System expunged.\nData loading....\nInitiating diagnostics.",
    "Have you ever had a dream, Neo, that you were so sure was real?\nWhat if you were unable to wake fromthat dream?\nHow would you know the difference between the dream world and the real world?\nAccess restricted....",
];

const outputDiv = document.getElementById('output');
let messageIndex = 0; // Track the number of messages printed

function typeMessage(message, delay) {
    let index = 0;

    const interval = setInterval(() => {
        if (index < message.length) {
            outputDiv.textContent += message[index];
            index++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                clearOutput();
            }, delay); // time to wait before clearing the output
        }
    }, 1); // Typing speed (10ms for each character)
}

function clearOutput() {
    outputDiv.textContent += "\n"; // Optional: Adds a new line before clearing
    setTimeout(() => {
        outputDiv.innerHTML = ""; // Clear the output div
        messageIndex++; // Increment the message index
        if (messageIndex < messages.length) {
            printRandomMessage();
        } else {
            redirectToLogin(); // Redirect when all messages have been shown
        }
    }, 300); // Delay for the next message to appear
}

function printRandomMessage() {
    const message = messages[messageIndex]; // Get the current message based on index
    typeMessage(message, 3); // Display each message for 1 second before clearing
}

function redirectToLogin() {
    setTimeout(() => {
        window.location.href = 'login.html'; // Redirect to login.html
    }, 1); // Add a delay before redirecting so the user can see the last message
}

// Start the first message
printRandomMessage();