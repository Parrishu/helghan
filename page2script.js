document.addEventListener('DOMContentLoaded', () => {
    const menuButtons = document.querySelectorAll('.menu-button');
    const buttonContainer = document.querySelector('.button-container');
    const campaignButtonContainer = document.querySelector('.campaign-button-container'); // Renamed
    const aboutButtonContainer = document.querySelector('.about-button-container'); // New
    const campaignButton = document.getElementById('campaignButton');
    const aboutButton = document.getElementById('aboutButton'); // New
    const backToMenuButtonAbout = document.getElementById('backToMenuButtonAbout'); // Added
    const backToMenuButton = document.getElementById('backToMenuButton'); // Existing
    const menuText = document.querySelector('.menu-text');
    const logoutButton = document.querySelector('.menu-button:last-child'); // LOG OUT button

    let currentlyHoveredButton = null;
    let currentlyHoveredButtonIndex = 0;

    // Load sound effects
    const hoverSound = new Audio('../assets/hover.wav');
    const clickSound = new Audio('../assets/keypress2.wav'); // Load click sound

    function initializeMenu() {
        const firstButton = buttonContainer.querySelector('.first-button');
        if (firstButton) {
            firstButton.classList.add('hovered');
            currentlyHoveredButton = firstButton;
            currentlyHoveredButtonIndex = 0;
        }
    }

    const elementsToFadeIn = document.querySelectorAll('body > *:not(#particles-js)');
    elementsToFadeIn.forEach(element => {
        element.classList.add('fade-in');
    });

    initializeMenu();

    function updateMenuButtons() {
        const visibleButtonContainer = buttonContainer.style.display === 'none' ? (campaignButtonContainer.style.display === 'block' ? campaignButtonContainer : aboutButtonContainer) : buttonContainer;
        const previousButtons = document.querySelectorAll('.menu-button.hovered');
        if (previousButtons.length > 0) {
            previousButtons.forEach((button) => button.classList.remove('hovered'));
        }
        return visibleButtonContainer.querySelectorAll('.menu-button');
    }

    function navigateToButton(nextIndex) {
        const menuButtons = updateMenuButtons();

        if (currentlyHoveredButton) {
            currentlyHoveredButton.classList.remove('hovered');
        }

        currentlyHoveredButtonIndex = nextIndex < 0 ? menuButtons.length - 1 : nextIndex % menuButtons.length;
        currentlyHoveredButton = menuButtons[currentlyHoveredButtonIndex];
        currentlyHoveredButton.classList.add('hovered');
        currentlyHoveredButton.focus();
    }

    function playHoverSound() {
        hoverSound.currentTime = 0;
        hoverSound.play();
    }

    function updateMenuTitle(title) {
        menuText.textContent = title;
    }

    menuButtons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
            playHoverSound();
            if (currentlyHoveredButton) {
                currentlyHoveredButton.classList.remove('hovered'); // Remove hover from currently hovered button
            }
            currentlyHoveredButton = button; // Set the currently hovered button
            currentlyHoveredButton.classList.add('hovered'); // Add hover to the new button
            currentlyHoveredButtonIndex = [...menuButtons].indexOf(button); // Update index
        });

        button.addEventListener('click', function () {
            if (button === campaignButton || button === logoutButton || button === backToMenuButton || button === backToMenuButtonAbout || button === aboutButton) {
                clickSound.currentTime = 0; // Reset the sound
                clickSound.play(); // Play click sound
            }

            if (button === campaignButton) {
                updateMenuTitle(button.textContent.toUpperCase());
                buttonContainer.style.display = 'none';
                campaignButtonContainer.style.display = 'block'; // Show campaign buttons
                currentlyHoveredButtonIndex = 0;
                navigateToButton(currentlyHoveredButtonIndex);
            } else if (button === aboutButton) {
                updateMenuTitle("ABOUT");
                buttonContainer.style.display = 'none';
                aboutButtonContainer.style.display = 'block'; // Show about buttons
                currentlyHoveredButtonIndex = 0;
                navigateToButton(currentlyHoveredButtonIndex);

                // Hide specified elements
                const gifElement = document.querySelector('.looping-gif');
                const rightRectangleElement = document.querySelector('.right-rectangle');
                const urightRectangleElement = document.querySelector('.uright-rectangle');

                // Hide elements completely
                if (gifElement) gifElement.style.display = 'none';
                if (rightRectangleElement) rightRectangleElement.style.display = 'none';
                if (urightRectangleElement) urightRectangleElement.style.display = 'none';
            }

            console.log(`Button clicked: ${button.textContent}`);
        });

        // MY DISCORD button functionality
        if (button.textContent.trim() === 'MY DISCORD') {
            button.addEventListener('click', function () {
                clickSound.currentTime = 0; // Reset the sound
                clickSound.play(); // Play click sound
                window.open('https://discordapp.com/users/108932560100274176', '_blank'); // Open link in new tab
                console.log('Navigated to MY DISCORD');
            });
        }

        // Handling keydown events for Enter and Space
        button.addEventListener('keydown', (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (button === campaignButton || button === logoutButton || button === backToMenuButton || button === backToMenuButtonAbout || button === aboutButton) {
                    clickSound.currentTime = 0; // Reset the sound
                    clickSound.play(); // Play click sound
                }
                button.click(); // Simulate button click
                console.log(`Button clicked via key: ${button.textContent}`);
            }
        });

        // Keep the hover effect on focus
        button.addEventListener('focus', () => {
            button.classList.add('hovered');
            currentlyHoveredButton = button; // Ensure the currently hovered button updates correctly
        });
    });

    // Logout button functionality
    logoutButton.addEventListener('click', function () {
        clickSound.currentTime = 0; // Reset the sound
        clickSound.play(); // Play click sound
        window.location.href = "login.html"; // Redirects to login.html
        console.log('Logged out and redirected to login.html');

        document.addEventListener('keydown', (event) => {
            if (event.key === "Backspace") {
                event.preventDefault();
                window.location.href = "login.html";
                return;
            }
        });

    })

    backToMenuButton.addEventListener('click', function () {
        clickSound.currentTime = 0; // Play the click sound
        clickSound.play(); // Play click sound
        campaignButtonContainer.style.display = 'none';
        buttonContainer.style.display = 'block';
        currentlyHoveredButtonIndex = 0;

        if (currentlyHoveredButton) {
            currentlyHoveredButton.classList.remove('hovered');
        }

        const firstButton = buttonContainer.querySelector('.first-button');
        if (firstButton) {
            currentlyHoveredButton = firstButton;
            firstButton.classList.add('hovered');
        }

        navigateToButton(currentlyHoveredButtonIndex);
        updateMenuTitle("MAIN MENU");
    });

    backToMenuButtonAbout.addEventListener('click', function () {
        clickSound.currentTime = 0; // Play the click sound
        clickSound.play(); // Play click sound
        aboutButtonContainer.style.display = 'none';
        buttonContainer.style.display = 'block';
        currentlyHoveredButtonIndex = 0;

        if (currentlyHoveredButton) {
            currentlyHoveredButton.classList.remove('hovered');
        }

        const firstButton = buttonContainer.querySelector('.first-button');
        if (firstButton) {
            currentlyHoveredButton = firstButton;
            firstButton.classList.add('hovered');
        }

        navigateToButton(currentlyHoveredButtonIndex);
        updateMenuTitle("MAIN MENU");

        // Show the hidden elements again
        const gifElement = document.querySelector('.looping-gif');
        const rightRectangleElement = document.querySelector('.right-rectangle');
        const urightRectangleElement = document.querySelector('.uright-rectangle');

        if (gifElement) gifElement.style.display = 'block'; // Show element again
        if (rightRectangleElement) rightRectangleElement.style.display = 'block'; // Show element again
        if (urightRectangleElement) urightRectangleElement.style.display = 'block'; // Show element again
    });

    document.addEventListener('keydown', (event) => {
        const menuButtons = updateMenuButtons();

        // Arrow keys and other navigation keys
        if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "s" || event.key === "S" || event.key === "d" || event.key === "D") {
            event.preventDefault();
            const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
            navigateToButton(nextIndex);
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "w" || event.key === "W" || event.key === "z" || event.key === "Z" || event.key === "a" || event.key === "A" || event.key === "q" || event.key === "Q") {
            event.preventDefault();
            const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
            navigateToButton(prevIndex);
        } else if (event.key === " ") {
            event.preventDefault();
            currentlyHoveredButton.click();
        } else if (event.key === "Enter") {
            currentlyHoveredButton.click();
        } else {
            // Ensure the hover effect stays on the currently hovered button
            if (currentlyHoveredButton) {
                currentlyHoveredButton.classList.add('hovered');
            }
        }
    });

    let lastGamepadInputTime = 0;
    const navigationDelay = 170;

    function handleGamepadInput() {
        const gamepads = navigator.getGamepads();
        if (gamepads) {
            const gamepad = gamepads[0];
            if (gamepad) {
                const joystickThreshold = 0.2;
                const yAxis = gamepad.axes[1];

                const currentTime = Date.now();
                if (lastGamepadInputTime + navigationDelay > currentTime) {
                    return;
                }

                if (yAxis < -joystickThreshold) {
                    const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
                    navigateToButton(prevIndex);
                    lastGamepadInputTime = currentTime;
                } else if (yAxis > joystickThreshold) {
                    const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
                    navigateToButton(nextIndex);
                    lastGamepadInputTime = currentTime;
                }

                if (gamepad.buttons[12].pressed) {
                    const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
                    navigateToButton(prevIndex);
                    lastGamepadInputTime = currentTime;
                } else if (gamepad.buttons[13].pressed) {
                    const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
                    navigateToButton(nextIndex);
                    lastGamepadInputTime = currentTime;
                }
            }
        }
    }

    function gameLoop() {
        handleGamepadInput();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();

    aboutButtonContainer.style.display = 'none';
    campaignButtonContainer.style.display = 'none';

    const secondaryButtons = campaignButtonContainer.querySelectorAll('.menu-button.secondary-button');
    secondaryButtons.forEach((button) => {
        button.addEventListener('click', function () {
            if (button.id === 'backToMenuButton') {
                clickSound.currentTime = 0; // Reset the sound
                clickSound.play(); // Play click sound for back to menu
            }
            console.log(`Secondary button clicked: ${button.textContent}`);
        });
    });
});