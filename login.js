document.addEventListener('DOMContentLoaded', () => {
    // Initial setup for volume
    const volumeSlider = document.querySelector('.volume-slider');
    let currentVolume = 1; // Initialize volume (1.0 = max volume)
    volumeSlider.value = currentVolume * 100; // Set the slider to the current volume (0-100)
    let previousVolume = currentVolume; // Store the previous volume level

    // Function to make the body visible
    const showBody = () => {
        document.body.classList.add('visible');
        document.body.style.opacity = 1;
    };

    // Initially hide the body
    document.body.style.opacity = 0;

    // Show body after a short delay
    setTimeout(showBody, 100);

// Play startup sound on page load
    const startupSound = new Audio('assets/startup.wav'); // Create a new Audio object
    startupSound.volume = currentVolume; // Set initial volume for startup sound

// Loop the sound when it ends
    startupSound.onended = function() {
        if (currentVolume > 0) {
            startupSound.play().catch(error => {
                console.error('Error playing startup sound:', error);
            });
        }
    };

// Start playing the sound
    startupSound.play().catch(error => {
        console.error('Error playing startup sound:', error);
    });

    // Login button to handle login logic
    const loginButton = document.querySelector('button.buttonin');
    const inputField = document.querySelector('.input-field');
    const buttonOff = document.querySelector('button.buttonoff');

    const clickAudio = document.getElementById('clickSound');
    const enterAudio = new Audio('assets/enter.wav'); // Separate sound for enter action

    function handleLogin() {
        const bigbox = document.querySelector('.bigbox');
        const loginContainer = document.querySelector('.login-container');

        if (inputField.value.toLowerCase() === "spaceman") {
            // Play enter sound upon successful login
            enterAudio.play().catch(error => {
                console.error('Error playing enter sound:', error);
            });

            bigbox.classList.add('vertical-shake', 'semi-transparent');
            loginContainer.classList.add('semi-transparent');

            setTimeout(() => {
                bigbox.classList.remove('semi-transparent');
                loginContainer.classList.remove('semi-transparent');
            }, 200);

            setTimeout(() => {
                document.body.classList.remove('visible'); // Hide body during transition
                document.body.style.opacity = 0; // Set opacity to 0 for transition
                setTimeout(() => {
                    window.location.href = "page2.html"; // Navigate to page2.html
                }, 800); // Delay for visual transition before navigation
            }, 500);
        } else {
            clickAudio.play();
            loginButton.classList.add('shake'); // Add shake effect on failure
            setTimeout(() => {
                loginButton.classList.remove('shake'); // Remove shake effect
            }, 500);
        }
    }

    // Input field operations
    inputField.addEventListener('input', function () {
        inputField.value = inputField.value.replace(/[^a-zA-Z0-9]/g, '');
        inputField.classList.toggle('hide-caret', inputField.value.length >= 8);

        if (inputField.value.length === 8) {
            loginButton.classList.add('hover');
            buttonOff.style.color = 'bright red';
        } else {
            loginButton.classList.remove('hover');
            buttonOff.style.color = 'rgba(255, 0, 0, 0.22)';
        }
    });

    loginButton.addEventListener('click', function () {
        clickAudio.play();
        handleLogin();
    });

    inputField.addEventListener('keydown', function (event) {
        if ((event.key.length === 1 && /^[a-zA-Z0-9]$/.test(event.key)) || event.key === 'Backspace') {
            const keypressAudio = document.getElementById('keypressSound');
            keypressAudio.currentTime = 0;
            keypressAudio.play();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent any default form submission
            handleLogin(); // Call login handler
        }
    });

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    if (isMobileDevice()) {
        alert("Access denied. This site is not available on mobile devices.");
    }

    const volumeButton = document.querySelector('.volume-button');

    // Adjust the volume when the slider is moved
    volumeSlider.addEventListener('input', function () {
        currentVolume = this.value / 1; // Set volume based on slider value (0-1)
        console.log('Volume changed to:', currentVolume);

        // Update volume for startup sound ONLY
        startupSound.volume = currentVolume; // Update the startup sound volume
        // Leave enterAudio volume unchanged
    });

    // Handle volume button click to toggle mute/unmute
    volumeButton.addEventListener('click', function () {
        if (currentVolume > 0) {
            previousVolume = currentVolume; // Store the current volume before muting
            currentVolume = 0; // Mute the volume
            volumeSlider.value = 0; // Update the slider position
            startupSound.volume = currentVolume; // Ensure mute applies
        } else {
            currentVolume = previousVolume; // Restore the previous volume
            volumeSlider.value = currentVolume * 1; // Update the slider position correctly
            startupSound.volume = currentVolume; // Restore startup sound volume
        }

        console.log('Current volume set to:', currentVolume);
    });

    // Show and hide the slider when hovering over the volume control
    volumeButton.addEventListener('mouseover', function () {
        volumeSlider.style.display = 'block';
    });

    volumeSlider.addEventListener('mouseover', function () {
        volumeSlider.style.display = 'block'; // Ensure the slider stays visible when hovered
    });

    volumeSlider.addEventListener('mouseout', function () {
        volumeSlider.style.display = 'none'; // Hide when not hovering over the slider
    });

    // Hide the volume slider when not in control area and button/slider are not hovered
    document.addEventListener('mouseout', function () {
        if (!volumeControlHovered) {
            volumeSlider.style.display = 'none';
        }
    });

    // Listen for the pageshow event to handle back navigation from page2.html
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            window.location.reload(); // Force refresh if navigating back from cache
        }
    });
});