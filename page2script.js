// page2script.js

document.addEventListener('DOMContentLoaded', () => {
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

    // Add event listeners on menu buttons
    menuButtons.forEach((button, index) => {
        button.addEventListener('mouseenter', () => {
            currentHoverSound(); // Play sound on hover
            navigateToButton(index); // Navigate to the button on mouse enter
        });

        button.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                button.click(); // Trigger button click
                console.log(`Button ${index} clicked`);
            }
        });

        button.addEventListener('focus', () => {
            if (currentlyHoveredButton !== button) {
                button.classList.add('hovered');
                currentlyHoveredButton = button;
            }
        });

        button.addEventListener('blur', () => {
            if (!button.matches(':hover') && currentlyHoveredButton === button) {
                button.classList.remove('hovered');
            }
        });
    });

    // Global keyboard navigation
    let lastInputTime = 0; // Track the last navigation input time
    const navigationDelay = 180; // Delay in milliseconds

    document.addEventListener('keydown', (event) => {
        // Check for Backspace key to redirect to login.html
        if (event.key === "Backspace") {
            event.preventDefault(); // Prevent the default backspace behavior
            window.location.href = "login.html"; // Redirect to login.html
            return; // Exit the function
        }

        const currentTime = Date.now();
        if (currentTime - lastInputTime < navigationDelay) {
            return; // Ignore input if within delay
        }
        lastInputTime = currentTime; // Update last input time

        // Handle Navigation with Arrow, WASD, and AZERTY keys
        if (event.key === "ArrowDown" || event.key === "ArrowRight" ||
            event.key === "s" || event.key === "S" || // QWERTY down
            event.key === "d" || event.key === "D") { // QWERTY right
            event.preventDefault();
            const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
            navigateToButton(nextIndex);
        } else if (
            event.key === "ArrowUp" || event.key === "ArrowLeft" ||
            event.key === "w" || event.key === "W" || // QWERTY up
            event.key === "z" || event.key === "Z" || // AZERTY up
            event.key === "a" || event.key === "A") { // AZERTY left
            event.preventDefault();
            const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
            navigateToButton(prevIndex);
        }
    });

    // Gamepad support
    let lastGamepadInputTime = 0; // Track the last gamepad input time

    function handleGamepadInput() {
        const gamepads = navigator.getGamepads();
        if (gamepads) {
            const gamepad = gamepads[0]; // Assuming we're interested in the first connected gamepad
            if (gamepad) {
                // Joystick input (Adjust threshold as needed)
                const joystickThreshold = 0.2; // Adjust sensitivity
                const yAxis = gamepad.axes[1]; // Y-axis for vertical movement

                const currentTime = Date.now();
                if (lastGamepadInputTime + navigationDelay > currentTime) {
                    return; // Skip this frame if it's too soon after the last input
                }

                // Check joystick for up/down movement
                if (yAxis < -joystickThreshold) { // Up
                    const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
                    navigateToButton(prevIndex);
                    lastGamepadInputTime = currentTime; // Update input time
                } else if (yAxis > joystickThreshold) { // Down
                    const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
                    navigateToButton(nextIndex);
                    lastGamepadInputTime = currentTime; // Update input time
                }

                // Check if arrow keys are pressed (gamepad buttons for directional navigation)
                if (gamepad.buttons[12].pressed) { // DPAD Up
                    const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
                    navigateToButton(prevIndex);
                    lastGamepadInputTime = currentTime; // Update input time
                } else if (gamepad.buttons[13].pressed) { // DPAD Down
                    const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
                    navigateToButton(nextIndex);
                    lastGamepadInputTime = currentTime; // Update input time
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

    // Do not include any visibility change or audio unload event as this is not needed anymore
});