// page2script.js

// Select all menu buttons
const menuButtons = document.querySelectorAll('.menu-button');

// Variable to keep track of the currently hovered button
let currentlyHoveredButton = null;

// Load the hover sound
const hoverSound = new Audio('../assets/hover.wav');

// Add the default hovered class to the first button on load
const firstButton = document.querySelector('.first-button');
firstButton.classList.add('hovered');
currentlyHoveredButton = firstButton; // Set the default hovered button

// Function to navigate to the next button
function navigateToButton(nextIndex) {
    // Remove the hover effect from the currently hovered button only if it’s not the same as the next one
    if (currentlyHoveredButton) {
        currentlyHoveredButton.classList.remove('hovered');
    }

    // Update the currently hovered button
    currentlyHoveredButton = menuButtons[nextIndex];
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

        // Allow mouse hover to change the currently hovered button
        if (currentlyHoveredButton !== button) {
            if (currentlyHoveredButton) {
                currentlyHoveredButton.classList.remove('hovered');
            }
            button.classList.add('hovered');
            currentlyHoveredButton = button;
        }
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
        // Handle blur: Do not remove the hovered class on blur
        if (!button.matches(':hover') && currentlyHoveredButton === button) {
            button.classList.remove('hovered'); // Optionally remove if not hovered
            currentlyHoveredButton = null; // Reset if we no longer have interaction
        }
    });
});

// Initial focus settings
firstButton.tabIndex = 0;
firstButton.focus();
menuButtons.forEach(button => {
    button.tabIndex = -1;
});

// Global keyboard navigation
document.addEventListener('keydown', (event) => {
    if (currentlyHoveredButton) {
        const currentIndex = Array.from(menuButtons).indexOf(currentlyHoveredButton);

        // Handle arrow keys
        if (
            event.key === "ArrowDown" || event.key === "ArrowRight" ||
            event.key === "s" || event.key === "S" ||
            event.key === "d" || event.key === "D"
        ) {
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % menuButtons.length;
            navigateToButton(nextIndex);
        } else if (
            event.key === "ArrowUp" || event.key === "ArrowLeft" ||
            event.key === "w" || event.key === "W" ||
            event.key === "a" || event.key === "A" ||
            event.key === "z" || event.key === "Z" ||
            event.key === "q" || event.key === "Q"
        ) {
            event.preventDefault();
            const prevIndex = (currentIndex - 1 + menuButtons.length) % menuButtons.length;
            navigateToButton(prevIndex);
        }
    }
});

// Gamepad support
function handleGamepadInput() {
    const gamepads = navigator.getGamepads();
    if (gamepads) {
        const gamepad = gamepads[0]; // Assuming we're interested in the first connected gamepad
        if (gamepad) {
            if (gamepad.buttons[12].pressed) { // Up
                const currentIndex = Array.from(menuButtons).indexOf(currentlyHoveredButton);
                const prevIndex = (currentIndex - 1 + menuButtons.length) % menuButtons.length;
                navigateToButton(prevIndex);
            } else if (gamepad.buttons[13].pressed) { // Down
                const currentIndex = Array.from(menuButtons).indexOf(currentlyHoveredButton);
                const nextIndex = (currentIndex + 1) % menuButtons.length;
                navigateToButton(nextIndex);
            }

            if (gamepad.buttons[1].pressed) { // Cross button on PlayStation controller
                console.log(`Button ${Array.from(menuButtons).indexOf(currentlyHoveredButton)} clicked`);
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