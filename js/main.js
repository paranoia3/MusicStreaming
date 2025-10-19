// JavaScript Advanced Concepts: Track Data Object and Array
const featuredTracks = [
    { title: "Dreamer", artist: "Aurora", duration: "3:30", album: "The Gods We Can Touch", rating: 4 },
    { title: "Starlight", artist: "Muse", duration: "3:59", album: "Black Holes and Revelations", rating: 5 },
    { title: "Electric Feel", artist: "MGMT", duration: "3:49", album: "Oracular Spectacular", rating: 4 },
    { title: "Happier Than Ever", artist: "Billie Eilish", duration: "4:58", album: "Happier Than Ever", rating: 3 },
];

// Reusable function to display custom messages (replaces alert)
function showCustomMessage(message, duration = 3000) {
    const messageEl = document.getElementById('custom-message');
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.classList.add('show');

    // Set timeout to hide the message
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, duration);
}

document.addEventListener('DOMContentLoaded', () => {

    // Dynamic Greeting Implementation (Section 1. Manipulating Attributes & 2. Switch Statements)
    const greetingDisplay = document.getElementById('greeting-display');
    const nameInput = document.getElementById('user-name-input');
    const nameSubmitButton = document.getElementById('name-submit-btn');

    // Object to manage user state (Section 3. Objects and Methods)
    const userState = {
        name: localStorage.getItem('userName') || 'Ariana',
    };

    function determineGreeting() {
        const now = new Date();
        const hour = now.getHours();
        let timeOfDay;

        // Using a switch statement to control logic based on time (Section 2. Switch Statements)
        switch (true) {
            case (hour >= 5 && hour < 12):
                timeOfDay = "Morning";
                break;
            case (hour >= 12 && hour < 17):
                timeOfDay = "Afternoon";
                break;
            case (hour >= 17 && hour < 22):
                timeOfDay = "Evening";
                break;
            default:
                timeOfDay = "Night";
        }
        return `Good ${timeOfDay}, ${userState.name}!`;
    }

    // Function to update the greeting on the page
    function updateGreeting() {
        if (greetingDisplay) {
            greetingDisplay.textContent = determineGreeting();
        }
        // Also update the profile name in the navbar
        const profileNameSpans = document.querySelectorAll('.profile-name');
        profileNameSpans.forEach(span => {
            span.textContent = userState.name;
        });
    }

    if (nameInput && nameSubmitButton) {
        // Initial setup for the input field
        nameInput.value = userState.name === 'Listener' ? '' : userState.name;

        // Event listener for name submission
        nameSubmitButton.addEventListener('click', (e) => {
            e.preventDefault();
            const newName = nameInput.value.trim();
            if (newName) {
                userState.name = newName;
                localStorage.setItem('userName', newName);
                updateGreeting();
                showCustomMessage(`Greeting updated! Welcome, ${userState.name}.`);
                // Clear the input after setting
                nameInput.value = '';
            } else {
                showCustomMessage("Please enter a valid name.");
            }
        });
    }
    updateGreeting();


    // Theme Toggle (Section 1. Dynamic Style Changes)
    const themeToggleButton = document.getElementById('theme-toggle-btn');

    function loadThemePreference() {
        // Load preference from localStorage, default to 'dark'
        return localStorage.getItem('theme') || 'dark';
    }

    function saveThemePreference(theme) {
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        if (newTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggleButton.innerHTML = '<i data-feather="moon"></i>';
        } else {
            document.body.classList.remove('light-theme');
            themeToggleButton.innerHTML = '<i data-feather="sun"></i>';
        }

        // Re-render feather icons after changing the icon HTML
        feather.replace();

        saveThemePreference(newTheme);
    }

    // Apply saved theme on load
    if (loadThemePreference() === 'light') {
        document.body.classList.add('light-theme');
    }

    if (themeToggleButton) {
        // Set initial icon based on applied theme
        themeToggleButton.innerHTML = document.body.classList.contains('light-theme') ?
            '<i data-feather="moon"></i>' :
            '<i data-feather="sun"></i>';

        // Event Listener for the toggle button
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Star Rating (Section 1. Selecting and Manipulating HTML Elements & 3. Play Sounds)
    const starRatingContainers = document.querySelectorAll('.star-rating');
    const notificationSound = new Audio('https://cdn.jsdelivr.net/gh/Tonejs/Tone.js/examples/audio/pluck.mp3'); // Example sound, use Tone.js for complex sounds if needed

    starRatingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');

        // Higher-Order Function: forEach to attach event listeners
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-value'));

                // Clear all active classes
                stars.forEach(s => s.classList.remove('checked'));

                // Apply 'checked' class up to the selected star (DOM Manipulation)
                for (let i = 0; i < rating; i++) {
                    stars[i].classList.add('checked');
                }

                // Play Sound effect
                if (notificationSound) {
                    notificationSound.currentTime = 0;
                    notificationSound.play().catch(e => console.log("Sound play prevented:", e));
                }

                showCustomMessage(`You rated this track/artist ${rating} stars!`);
            });

            // Optional hover effect (purely visual)
            container.addEventListener('mouseover', (e) => {
                if (e.target.classList.contains('star')) {
                    const hoverRating = parseInt(e.target.getAttribute('data-value'));
                    stars.forEach((s, index) => {
                        s.style.color = index < hoverRating ? 'gold' : '';
                    });
                }
            });

            container.addEventListener('mouseout', () => {
                stars.forEach(s => s.style.color = '');
            });
        });
    });

    // Dynamic Track List Rendering (Section 3. Arrays and Loops & Higher-Order Functions)
    const dynamicTrackList = document.getElementById('dynamic-track-list');

    if (dynamicTrackList) {
        // Higher-Order Function: filter (example of filtering for 4+ star tracks)
        const highRatedTracks = featuredTracks.filter(track => track.rating >= 4);

        // Higher-Order Function: map to create HTML string for each track
        const trackHtml = highRatedTracks.map((track, index) => `
            <li class="list-group-item track-list-item animate-in">
                <img src="https://placehold.co/50x50/333333/FFFFFF?text=${index + 1}" class="rounded-2" alt="Track">
                <div class="track-info">
                    <div class="track-title">${track.title}</div>
                    <div class="track-artist">${track.artist}</div>
                </div>
                <div class="track-album d-none d-md-block">${track.album}</div>
                <div class="track-duration">${track.duration}</div>
            </li>
        `).join(''); // Joining the array of HTML strings into one long string

        // Inject the generated HTML into the DOM (Section 1. Modify content)
        dynamicTrackList.innerHTML = trackHtml;
    }


    // Keyboard Event Handling (Section 2. Keyboard Event Handling)
    const navItems = document.querySelectorAll('#navbarNav .nav-item a');
    let currentFocusIndex = -1;

    document.addEventListener('keydown', (e) => {
        const navLinks = Array.from(navItems);
        const navCount = navLinks.length;

        if (navCount === 0) return;

        // Check if the focus is currently within the navigation links
        const isFocusOnNav = navLinks.some(link => document.activeElement === link);

        // If focus is not on nav and user presses ArrowRight, start focus on the first item
        if (!isFocusOnNav && e.key === 'ArrowRight') {
            e.preventDefault();
            currentFocusIndex = 0;
            navLinks[currentFocusIndex].focus();
            return;
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            if (isFocusOnNav) {
                e.preventDefault();
                // Find the index of the currently focused link
                currentFocusIndex = navLinks.findIndex(link => document.activeElement === link);

                if (e.key === 'ArrowRight') {
                    currentFocusIndex = (currentFocusIndex + 1) % navCount;
                } else if (e.key === 'ArrowLeft') {
                    currentFocusIndex = (currentFocusIndex - 1 + navCount) % navCount;
                }

                navLinks[currentFocusIndex].focus();
            }
        }
    });


    // Form Validation and Submission (Contact Form - Section 2. Callbacks)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        // Callback function to handle form submission asynchronously
        const handleSubmit = function(event) {
            event.preventDefault();
            let isValid = true;

            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
                el.textContent = '';
            });
            document.querySelectorAll('.is-invalid').forEach(el => {
                el.classList.remove('is-invalid');
            });

            // Input elements for validation
            const name = document.getElementById('contact-name');
            const email = document.getElementById('contact-email');
            const subject = document.getElementById('contact-subject');
            const message = document.getElementById('contact-message');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validate fields
            if (name.value.trim() === '') { isValid = false; showError(name, 'Please enter your name.'); }
            if (email.value.trim() === '') { isValid = false; showError(email, 'Please enter your email.'); }
            else if (!emailRegex.test(email.value)) { isValid = false; showError(email, 'Please enter a valid email.'); }
            if (subject.value.trim() === '') { isValid = false; showError(subject, 'Please indicate the subject.'); }
            if (message.value.trim().length < 10) { isValid = false; showError(message, 'The message must contain at least 10 characters.'); }

            if (isValid) {
                // Simulate asynchronous data submission (e.g., fetch API)
                new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
                    .then(() => {
                        showCustomMessage('Thank you! Your message has been sent successfully.');
                        contactForm.reset();
                    })
                    .catch(error => {
                        showCustomMessage('An error occurred. Please try again later.', 5000);
                        console.error('Submission failed:', error);
                    });
            }
        };

        contactForm.addEventListener('submit', handleSubmit);
    }

    // Function for clearing contact form inputs (Section 2. Button Listener)
    const resetButton = document.querySelector('#contact-form button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', (e) => {
            e.preventDefault();

            // Clear all inputs inside the form
            contactForm.querySelectorAll('input, textarea').forEach(input => {
                input.value = '';
                input.classList.remove('is-invalid');
            });

            // Clear all error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
                el.textContent = '';
            });

            showCustomMessage('Form fields have been cleared.');
        });
    }

    function showError(inputElement, message) {
        const errorDiv = inputElement.nextElementSibling;
        inputElement.classList.add('is-invalid');
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }


    // Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.accordion-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });


    // Popup Subscription Form
    const openPopupButton = document.getElementById('open-popup-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupButton = document.getElementById('popup-close-btn');

    if (openPopupButton && popupOverlay && closePopupButton) {
        openPopupButton.addEventListener('click', (e) => {
            e.preventDefault();
            popupOverlay.style.display = 'flex';
        });

        const closePopup = () => {
            popupOverlay.style.display = 'none';
        }

        closePopupButton.addEventListener('click', closePopup);
        popupOverlay.addEventListener('click', (event) => {
            if (event.target === popupOverlay) {
                closePopup();
            }
        });

        const popupForm = document.getElementById('popup-form');
        if (popupForm) {
            popupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const popupEmail = document.getElementById('popup-email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (popupEmail.value.trim() !== '' && emailRegex.test(popupEmail.value)) {
                    // Replaced alert with custom message
                    showCustomMessage('Thanks for subscribing!');
                    closePopup();
                    popupForm.reset();
                } else {
                    showCustomMessage('Please enter a valid email to subscribe.');
                }
            });
        }
    }


    // Display Current Date and Time
    const dateTimeDisplay = document.getElementById('datetime-display');

    function updateDateTime() {
        if (dateTimeDisplay) {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            // Modified to show current time more prominently
            dateTimeDisplay.textContent = now.toLocaleTimeString('en-EN', { hour: '2-digit', minute: '2-digit'}) + ' (' + now.toLocaleDateString('en-EN', { month: 'short', day: 'numeric'}) + ')';
        }
    }
    if (dateTimeDisplay) {
        updateDateTime();
        setInterval(updateDateTime, 1000); // Update every second
    }

    // Initial feather icon replacement for the theme button
    feather.replace();
});
