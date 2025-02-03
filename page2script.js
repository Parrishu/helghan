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
                currentlyHoveredButton.classList.remove('hovered');
            }
            currentlyHoveredButton = button;
            currentlyHoveredButton.classList.add('hovered');
            currentlyHoveredButtonIndex = [...menuButtons].indexOf(button);
        });

        button.addEventListener('click', function () {
            // Play click sound for relevant buttons
            if ([campaignButton, logoutButton, backToMenuButton, backToMenuButtonAbout, aboutButton].includes(button)) {
                clickSound.currentTime = 0;
                clickSound.play();
            }

            if (button === campaignButton) {
                // Fade out specified elements
                document.querySelector('.looping-gif').classList.add('fade-out');
                document.querySelector('.right-rectangle').classList.add('fade-out');
                document.querySelector('.uright-rectangle').classList.add('fade-out');

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

                const aboutInfoButton = aboutButtonContainer.querySelector('#aboutInfoButton');
                if (aboutInfoButton) {
                    currentlyHoveredButton = aboutInfoButton;
                    aboutInfoButton.classList.add('hovered');
                }
                navigateToButton(currentlyHoveredButtonIndex); // Navigation to the first about button
            } else if (button === backToMenuButton) {
                // Go back to the main menu
                campaignButtonContainer.style.display = 'none';
                buttonContainer.style.display = 'block';
                currentlyHoveredButtonIndex = 0;
                navigateToButton(currentlyHoveredButtonIndex);
                updateMenuTitle("MAIN MENU"); // Optional: reset title when going back
            } else if (button === backToMenuButtonAbout) {
                // Go back to main menu from about menu
                aboutButtonContainer.style.display = 'none';
                buttonContainer.style.display = 'block';
                currentlyHoveredButtonIndex = 0;
                const firstButton = buttonContainer.querySelector('.first-button');

                if (currentlyHoveredButton) {
                    currentlyHoveredButton.classList.remove('hovered');
                }

                if (firstButton) {
                    currentlyHoveredButton = firstButton;
                    firstButton.classList.add('hovered');
                }
                navigateToButton(currentlyHoveredButtonIndex);
                updateMenuTitle("MAIN MENU"); // Ensure the title updates on return
            }

            console.log(`Button clicked: ${button.textContent}`);
        });

        if (button.textContent.trim() === 'MY DISCORD') {
            button.addEventListener('click', function () {
                clickSound.currentTime = 0;
                clickSound.play();
                window.open('http://discordapp.com/users/108932560100274176', '_blank');
                console.log('Navigated to MY DISCORD');
            });
        }

        button.addEventListener('keydown', (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if ([campaignButton, logoutButton, backToMenuButton, backToMenuButtonAbout, aboutButton].includes(button)) {
                    clickSound.currentTime = 0;
                    clickSound.play();
                }
                button.click();
                console.log(`Button clicked via key: ${button.textContent}`);
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

    logoutButton.addEventListener('click', function () {
        clickSound.currentTime = 0;
        clickSound.play();
        window.location.href = "login.html";
        console.log('Logged out and redirected to login.html');
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === "Backspace") {
            event.preventDefault();
            window.location.href = "login.html";
            return;
        }

        const menuButtons = updateMenuButtons();

        if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "s" || event.key === "S" || event.key === "d" || event.key === "D") {
            event.preventDefault();
            const nextIndex = (currentlyHoveredButtonIndex + 1) % menuButtons.length;
            navigateToButton(nextIndex);
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "w" || event.key === "W" || event.key === "z" || event.key === "Z" || event.key === "a" || event.key === "A" || event.key === "q" || event.key === "Q") {
            event.preventDefault();
            const prevIndex = (currentlyHoveredButtonIndex - 1 + menuButtons.length) % menuButtons.length;
            navigateToButton(prevIndex);
        } else if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            currentlyHoveredButton.click();
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

    campaignButtonContainer.style.display = 'none'; // Ensure it's hidden initially
    aboutButtonContainer.style.display = 'none'; // Ensure it's hidden initially

    // Add event listeners for about buttons to handle click events, similar to campaign buttons
    const aboutButtons = aboutButtonContainer.querySelectorAll('.menu-button.about-button');
    aboutButtons.forEach((button) => {
        button.addEventListener('click', function () {
            console.log(`About button clicked: ${button.textContent}`);
            // You can add specific logic for each about button if needed
        });
    });
});