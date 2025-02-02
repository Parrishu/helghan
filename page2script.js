document.addEventListener('DOMContentLoaded', () => {
    const menuButtons = document.querySelectorAll('.menu-button');
    const buttonContainer = document.querySelector('.button-container');
    const secondaryButtonContainer = document.querySelector('.secondary-button-container');
    const campaignButton = document.getElementById('campaignButton');
    const backToMenuButton = document.getElementById('backToMenuButton');
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
        const visibleButtonContainer = buttonContainer.style.display === 'none' ? secondaryButtonContainer : buttonContainer;
        return visibleButtonContainer.querySelectorAll('.menu-button');
    }

    function navigateToButton(nextIndex) {
        const menuButtons = updateMenuButtons();
        if (currentlyHoveredButton && currentlyHoveredButtonIndex !== nextIndex) {
            currentlyHoveredButton.classList.remove('hovered');
        }

        currentlyHoveredButtonIndex = nextIndex < 0 ? menuButtons.length - 1 : nextIndex % menuButtons.length;
        currentlyHoveredButton = menuButtons[currentlyHoveredButtonIndex];
        playHoverSound();
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
            if (button === campaignButton || button === logoutButton || button === backToMenuButton) {
                clickSound.currentTime = 0;
                clickSound.play();
            }

            if (button === campaignButton) {
                updateMenuTitle(button.textContent.toUpperCase());
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
                if (button === campaignButton || button === logoutButton || button === backToMenuButton) {
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

    secondaryButtonContainer.style.display = 'none';

    campaignButton.addEventListener('click', function () {
        buttonContainer.style.display = 'none';
        secondaryButtonContainer.style.display = 'block';
        currentlyHoveredButtonIndex = 0;

        const newMissionButton = secondaryButtonContainer.querySelector('#newMissionButton');
        if (newMissionButton) {
            if (currentlyHoveredButton) {
                currentlyHoveredButton.classList.remove('hovered');
            }
            currentlyHoveredButton = newMissionButton;
            newMissionButton.classList.add('hovered');
        }

        navigateToButton(currentlyHoveredButtonIndex);
    });

    backToMenuButton.addEventListener('click', function () {
        clickSound.currentTime = 0;
        clickSound.play();
        secondaryButtonContainer.style.display = 'none';
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

    const secondaryButtons = secondaryButtonContainer.querySelectorAll('.menu-button.secondary-button');
    secondaryButtons.forEach((button) => {
        button.addEventListener('click', function () {
            if (button.id === 'backToMenuButton') {
                clickSound.currentTime = 0;
                clickSound.play();
            }
            console.log(`Secondary button clicked: ${button.textContent}`);
        });
    });
});