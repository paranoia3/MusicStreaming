document.addEventListener('DOMContentLoaded', () => {

    // --- Form Validation ---
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
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

            // Name validation
            const name = document.getElementById('contact-name');
            if (name.value.trim() === '') {
                isValid = false;
                showError(name, 'Please enter a your name.');
            }

            // Email validation
            const email = document.getElementById('contact-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                isValid = false;
                showError(email, 'Please enter a your email.');
            } else if (!emailRegex.test(email.value)) {
                isValid = false;
                showError(email, 'Please enter a valid email.');
            }

            // Subject validation
            const subject = document.getElementById('contact-subject');
            if (subject.value.trim() === '') {
                isValid = false;
                showError(subject, 'Please indicate the problem.');
            }

            // Message validation
            const message = document.getElementById('contact-message');
            if (message.value.trim().length < 10) {
                isValid = false;
                showError(message, 'The message must contain at least 10 characters.');
            }

            if (isValid) {
                // In a real application, you would send the form data to the server here.
                alert('Form submitted successfully!');
                contactForm.reset();
            }
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


    // --- Accordion ---
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


    // --- Popup Subscription Form ---
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
                    alert('Thanks for subscribing!');
                    closePopup();
                    popupForm.reset();
                } else {
                    alert('Please enter a valid email.');
                }
            });
        }
    }


    // --- Change Background Color ---
    const changeBgButton = document.getElementById('change-bg-btn');
    if (changeBgButton) {
        const colors = ['#121212', '#1a001a', '#001a1a', '#1a1a00', '#2d0000', '#002d2d'];
        let currentColorIndex = 0;

        changeBgButton.addEventListener('click', () => {
            currentColorIndex = currentColorIndex + 1;
            const newColor = colors[currentColorIndex];
            document.documentElement.style.setProperty('--background-color', newColor);
        });
    }


    // --- Display Current Date and Time ---
    const dateTimeDisplay = document.getElementById('datetime-display');

    function updateDateTime() {
        if (dateTimeDisplay) {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateTimeDisplay.textContent = now.toLocaleDateString('en-EN', options);
        }
    }
    if (dateTimeDisplay) {
        updateDateTime();
        setInterval(updateDateTime, 1000); // Update every second
    }
});
