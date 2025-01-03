// page2script.js

// Select all menu buttons
const menuButtons = document.querySelectorAll('.menu-button');

// Variable to keep track of the currently hovered button
let currentlyHoveredButton = null;
let currentlyHoveredButtonIndex = 0; // Index for keyboard navigation

// Load the hover sound
const hoverSound = new Audio('../assets/hover.wav');

// Add the default hovered class to the first button on load
const firstButton = document.querySelector('.first-button');
firstButton.classList.add('hovered');
currentlyHoveredButton = firstButton;
currentlyHoveredButtonIndex = 0; // Set index to the first button

// Function to navigate to a button by index
function navigateToButton(nextIndex) {
    // Remove the hover effect from the currently hovered button only if it’s not the same as the next one
    if (currentlyHoveredButton && currentlyHoveredButtonIndex !== nextIndex) {
        currentlyHoveredButton.classList.remove('hovered');
    }

    currentlyHoveredButtonIndex = nextIndex; // Update index
    currentlyHoveredButton = menuButtons[currentlyHoveredButtonIndex]; // Update currently hovered button
    currentHoverSound(); // Play hover sound
    currentlyHoveredButton.classList.add('hovered'); // Add hover effect
    currentlyHoveredButton.focus(); // Focus the next button
}

// Function to play hover sound
function currentHoverSound() {
    hoverSound.currentTime = 0; // Restart sound
    hoverSound.play(); // Play sound
}

// Adding event listeners on menu buttons
menuButtons.forEach((button, index) => {
    button.addEventListener('mouseenter', () => {
        currentHoverSound(); // Play sound on hover
        navigateToButton(index); // Navigate to the button on mouse enter
    });

    button.addEventListener('mouseleave', () => {
        // Do nothing on mouse leave; we want to keep the last hovered button active
    });

    button.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            console.log(`Button ${index} clicked`);
        }
    });

    button.addEventListener('focus', () => {
        // When button is focused, add the hover effect
        if (currentlyHoveredButton !== button) {
            button.classList.add('hovered');
            currentlyHoveredButton = button;
        }
    });

    button.addEventListener('blur', () => {
        // Handle blur: Remove hover class if not currently hovered
        if (!button.matches(':hover') && currentlyHoveredButton === button) {
            button.classList.remove('hovered');
        }
    });
});

// Global keyboard navigation
document.addEventListener('keydown', (event) => {
    // Handle Navigation with Arrow, WASD, and AZERTY keys
    if (
        event.key === "ArrowDown" || event.key === "ArrowRight" ||
        event.key === "s" || event.key === "S" || // QWERTY down
        event.key === "d" || event.key === "D" || // QWERTY right
        event.key === "d" || event.key === "D" // AZERTY right
    ) {
        event.preventDefault();
        const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
        navigateToButton(nextIndex);
    } else if (
        event.key === "ArrowUp" || event.key === "ArrowLeft" ||
        event.key === "w" || event.key === "W" || // QWERTY up
        event.key === "z" || event.key === "Z" || // AZERTY up
        event.key === "a" || event.key === "A" // AZERTY left
    ) {
        event.preventDefault();
        const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
        navigateToButton(prevIndex);
    } else if (
        event.key === "q" || event.key === "Q" // AZERTY left
    ) {
        event.preventDefault();
        const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
        navigateToButton(prevIndex);
    }
});

// Gamepad support
function handleGamepadInput() {
    const gamepads = navigator.getGamepads();
    if (gamepads) {
        const gamepad = gamepads[0]; // Assuming we're interested in the first connected gamepad
        if (gamepad) {
            if (gamepad.buttons[12].pressed) { // Up
                const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
                navigateToButton(prevIndex);
            } else if (gamepad.buttons[13].pressed) { // Down
                const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
                navigateToButton(nextIndex);
            }

            if (gamepad.buttons[1].pressed) { // Cross button on PlayStation controller
                console.log(`Button ${currentlyHoveredButtonIndex} clicked`);
            }
        }
    }
}

// Game loop to check gamepad state
function gameLoop() {
    handleGamepadInput();
    requestAnimationFrame(gameLoop); // Keep polling
}

// Start the game loop
gameLoop();

// Add a click event listener on the document
document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu-button') && currentlyHoveredButton) {
        // Keep the last hovered button "hovered"
        currentlyHoveredButton.classList.add('hovered');
    }
});