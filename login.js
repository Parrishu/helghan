// Global variable for audio instance
if (!window.startupAudio) {
    window.startupAudio = new Audio('assets/startup.wav'); // Create audio only if it doesn't exist
    window.startupAudio.loop = true; // Enable looping
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if audio is already playing
    if (localStorage.getItem('audioPlaying') === 'true') {
        window.startupAudio.currentTime = parseFloat(localStorage.getItem('audioCurrentTime')) || 0; // Resume from where it left off
        window.startupAudio.play().catch(error => {
            console.error('Error playing startup sound:', error);
        });
    } else {
        window.startupAudio.play().catch(error => {
            console.error('Error playing startup sound:', error);
        });
        localStorage.setItem('audioPlaying', 'true');
    }

    // Store the current audio time in local storage
    window.startupAudio.addEventListener('timeupdate', function () {
        localStorage.setItem('audioCurrentTime', window.startupAudio.currentTime);
    });

    // Reset audio state when it ends
    window.startupAudio.addEventListener('ended', function () {
        localStorage.setItem('audioPlaying', 'false');
    });

    // Start with the body initially hidden
    document.body.style.opacity = 0;

    // Make the body visible
    const showBody = () => {
        document.body.classList.add('visible');
        document.body.style.opacity = 1;
    };

    // Ensure opacity is shown after a short delay
    setTimeout(showBody, 100);

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

            bigbox.classList.add('vertical-shake');
            bigbox.classList.add('semi-transparent');
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

    // Ensure audio pauses when the tab is hidden, and resumes when it becomes visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.startupAudio.pause(); // Pause the audio when the tab is hidden
        } else {
            // Resume playback if audio was playing before
            if (localStorage.getItem('audioPlaying') === 'true') {
                window.startupAudio.play().catch(error => {
                    console.error('Error resuming startup sound:', error);
                });
            }
        }
    });

    // Listen for the beforeunload event to stop the audio when leaving the page
    window.addEventListener('beforeunload', () => {
        window.startupAudio.pause();
        localStorage.setItem('audioPlaying', 'false'); // Set audio playing state to false
    });

    // Listen for the pageshow event to handle back navigation from page2.html
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload(); // Force refresh if navigating back from cache
        }
    });
});