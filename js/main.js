const featuredTracks = [
    { title: "Dreamer", artist: "Aurora", duration: "3:30", album: "The Gods We Can Touch", rating: 4 },
    { title: "Starlight", artist: "Muse", duration: "3:59", album: "Black Holes and Revelations", rating: 5 },
    { title: "Electric Feel", artist: "MGMT", duration: "3:49", album: "Oracular Spectacular", rating: 4 },
    { title: "Happier Than Ever", artist: "Billie Eilish", duration: "4:58", album: "Happier Than Ever", rating: 3 },
];

function showCustomMessage(message, duration = 3000) {
    const $messageEl = $('#toast-notification');
    if (!$messageEl.length) return;

    $messageEl.text(message).fadeIn(400).delay(duration).fadeOut(400);
}

$(document).ready(function() {

    console.log("jQuery is ready!");

    const $greetingDisplay = $('#greeting-display');
    const $nameInput = $('#user-name-input');
    const $nameSubmitButton = $('#name-submit-btn');

    const userState = {
        name: localStorage.getItem('userName') || 'Ariana',
    };

    function determineGreeting() {
        const now = new Date();
        const hour = now.getHours();
        let timeOfDay;

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

    function updateGreeting() {
        if ($greetingDisplay.length) {
            $greetingDisplay.text(determineGreeting());
        }
        $('.profile-name').text(userState.name);
    }

    if ($nameInput.length && $nameSubmitButton.length) {
        $nameInput.val(userState.name === 'Listener' ? '' : userState.name);

        $nameSubmitButton.on('click', (e) => {
            e.preventDefault();
            const newName = $nameInput.val().trim();
            if (newName) {
                userState.name = newName;
                localStorage.setItem('userName', newName);
                updateGreeting();
                showCustomMessage(`Greeting updated! Welcome, ${userState.name}.`);
                $nameInput.val('');
            } else {
                showCustomMessage("Please enter a valid name.");
            }
        });
    }
    updateGreeting();

    const $themeToggleButton = $('#theme-toggle-btn');
    const $body = $('body');

    function loadThemePreference() {
        return localStorage.getItem('theme') || 'dark';
    }

    function saveThemePreference(theme) {
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const newTheme = $body.hasClass('light-theme') ? 'dark' : 'light';

        if (newTheme === 'light') {
            $body.addClass('light-theme');
            $themeToggleButton.html('<i data-feather="moon"></i>');
        } else {
            $body.removeClass('light-theme');
            $themeToggleButton.html('<i data-feather="sun"></i>');
        }
        feather.replace();
        saveThemePreference(newTheme);
    }

    if (loadThemePreference() === 'light') {
        $body.addClass('light-theme');
    }

    if ($themeToggleButton.length) {
        $themeToggleButton.html($body.hasClass('light-theme') ? '<i data-feather="moon"></i>' : '<i data-feather="sun"></i>');
        $themeToggleButton.on('click', toggleTheme);
    }

    const notificationSound = new Audio('sounds/pop-423717.mp3');

    $('.star-rating').each(function() {
        const $container = $(this);
        const $stars = $container.find('.star');

        $stars.on('click', function() {
            const $clickedStar = $(this);
            const rating = parseInt($clickedStar.data('value'));

            $stars.removeClass('checked');
            $stars.slice(0, rating).addClass('checked');

            if (notificationSound) {
                notificationSound.currentTime = 0;
                notificationSound.play().catch(e => console.log("Sound play prevented:", e));
            }
            showCustomMessage(`You rated this track/artist ${rating} stars!`);
        });

        $container.on('mouseover', '.star', function() {
            const hoverRating = parseInt($(this).data('value'));
            $stars.each(function(index) {
                $(this).css('color', index < hoverRating ? 'gold' : '');
            });
        }).on('mouseout', function() {
            $stars.css('color', '');
        });
    });

    const $dynamicTrackList = $('#dynamic-track-list');
    if ($dynamicTrackList.length) {
        const highRatedTracks = featuredTracks.filter(track => track.rating >= 4);
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
        `).join('');
        $dynamicTrackList.html(trackHtml);
    }

    const $navItems = $('#navbarNav .nav-item a');
    let currentFocusIndex = -1;

    $(document).on('keydown', (e) => {
        const navCount = $navItems.length;
        if (navCount === 0) return;

        const isFocusOnNav = $navItems.is(':focus');

        if (!isFocusOnNav && e.key === 'ArrowRight') {
            e.preventDefault();
            currentFocusIndex = 0;
            $navItems.eq(currentFocusIndex).focus();
            return;
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            if (isFocusOnNav) {
                e.preventDefault();
                currentFocusIndex = $navItems.index($(':focus'));

                if (e.key === 'ArrowRight') {
                    currentFocusIndex = (currentFocusIndex + 1) % navCount;
                } else if (e.key === 'ArrowLeft') {
                    currentFocusIndex = (currentFocusIndex - 1 + navCount) % navCount;
                }
                $navItems.eq(currentFocusIndex).focus();
            }
        }
    });

    const $contactForm = $('#contact-form');
    if ($contactForm.length) {

        $contactForm.on('submit', function(event) {
            event.preventDefault();
            let isValid = true;

            $('.error-message').hide().text('');
            $('.is-invalid').removeClass('is-invalid');

            const $name = $('#contact-name');
            const $email = $('#contact-email');
            const $subject = $('#contact-subject');
            const $message = $('#contact-message');
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

            if ($name.val().trim() === '') { isValid = false; showError($name, 'Please enter your name.'); }
            if ($email.val().trim() === '') { isValid = false; showError($email, 'Please enter your email.'); }
            else if (!emailRegex.test($email.val())) { isValid = false; showError($email, 'Please enter a valid email.'); }
            if ($subject.val().trim() === '') { isValid = false; showError($subject, 'Please indicate the subject.'); }
            if ($message.val().trim().length < 10) { isValid = false; showError($message, 'The message must contain at least 10 characters.'); }

            if (isValid) {
                const $submitBtn = $('#contact-submit-btn');
                const $btnText = $submitBtn.find('.btn-text');
                const $spinner = $submitBtn.find('.spinner-border');

                $submitBtn.prop('disabled', true);
                $btnText.text('Please wait...');
                $spinner.removeClass('d-none');

                setTimeout(() => {
                    showCustomMessage('Thank you! Your message has been sent successfully.');
                    $contactForm[0].reset();

                    $submitBtn.prop('disabled', false);
                    $btnText.text('Send message');
                    $spinner.addClass('d-none');

                }, 2000);
            }
        });
    }

    $('#contact-reset-btn').on('click', function(e) {
        e.preventDefault();
        $contactForm[0].reset();
        $('.error-message').hide().text('');
        $('.is-invalid').removeClass('is-invalid');
        showCustomMessage('Form fields have been cleared.');
    });

    function showError($inputElement, message) {
        const $errorDiv = $inputElement.next('.error-message');
        $inputElement.addClass('is-invalid');
        if ($errorDiv.length) {
            $errorDiv.text(message).show();
        }
    }

    const $settingsForm = $('#settings-form');
    if ($settingsForm.length) {
        $settingsForm.on('submit', function(event) {
            event.preventDefault();
            const $submitBtn = $('#settings-submit-btn');

            $submitBtn.prop('disabled', true).text('Saving...');

            setTimeout(() => {
                showCustomMessage('Settings saved successfully!');
                $submitBtn.prop('disabled', false).text('Save changes');
            }, 1000);
        });
    }

    $('.accordion-header').on('click', function() {
        const $item = $(this).parent('.accordion-item');
        $item.toggleClass('active');
        $('.accordion-item').not($item).removeClass('active');
    });

    const $popupOverlay = $('#popup-overlay');
    $('#open-popup-btn').on('click', function(e) {
        e.preventDefault();
        $popupOverlay.css('display', 'flex');
    });

    const closePopup = () => {
        $popupOverlay.hide();
    }

    $('#popup-close-btn').on('click', closePopup);
    $popupOverlay.on('click', function(event) {
        if (event.target === this) {
            closePopup();
        }
    });

    $('#popup-form').on('submit', function(e) {
        e.preventDefault();
        const $popupEmail = $('#popup-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if ($popupEmail.val().trim() !== '' && emailRegex.test($popupEmail.val())) {
            showCustomMessage('Thanks for subscribing!');
            closePopup();
            $(this)[0].reset();
        } else {
            showCustomMessage('Please enter a valid email to subscribe.');
        }
    });

    $('#premium-plan-btn').on('click', function() {
        showCustomMessage('Redirecting to Premium checkout...');
    });

    $('#family-plan-btn').on('click', function() {
        showCustomMessage('Redirecting to Family Plan checkout...');
    });

    const $dateTimeDisplay = $('#datetime-display');
    function updateDateTime() {
        if ($dateTimeDisplay.length) {
            const now = new Date();
            const time = now.toLocaleTimeString('en-EN', { hour: '2-digit', minute: '2-digit'});
            const date = now.toLocaleDateString('en-EN', { month: 'short', day: 'numeric'});
            $dateTimeDisplay.text(`${time} (${date})`);
        }
    }
    if ($dateTimeDisplay.length) {
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    feather.replace();

    const $searchInput = $('#search-input');
    const $categoryList = $('#category-list');
    const $autocompleteContainer = $('#autocomplete-suggestions');

    const searchSuggestions = ["Pop", "Rock", "Hip-Hop", "Indie", "Jazz", "Classical", "Electronic", "R&B"];

    if ($searchInput.length) {
        $searchInput.on('keyup', function() {
            const query = $(this).val().toLowerCase();

            $autocompleteContainer.empty();
            if (query.length > 0) {
                const filteredSuggestions = searchSuggestions.filter(item =>
                    item.toLowerCase().includes(query)
                );

                filteredSuggestions.forEach(suggestion => {
                    $autocompleteContainer.append(
                        `<a href="#" class="list-group-item list-group-item-action suggestion-item">${suggestion}</a>`
                    );
                });
                $autocompleteContainer.show();
            } else {
                $autocompleteContainer.hide();
            }

            $categoryList.find('.category-item').each(function() {
                const $item = $(this);
                const title = $item.find('.card-title').text().toLowerCase();
                if (title.includes(query)) {
                    $item.show();
                } else {
                    $item.hide();
                }
            });
        });

        $autocompleteContainer.on('click', '.suggestion-item', function(e) {
            e.preventDefault();
            const suggestionText = $(this).text();
            $searchInput.val(suggestionText).trigger('keyup');
            $autocompleteContainer.hide();
        });

        $(document).on('click', function(e) {
            if (!$(e.target).closest('#search-input, #autocomplete-suggestions').length) {
                $autocompleteContainer.hide();
            }
        });
    }

    const $faqSearchInput = $('#faq-search-input');
    if ($faqSearchInput.length) {
        $('.faq-content-searchable').each(function() {
            $(this).data('original-html', $(this).html());
        });

        $faqSearchInput.on('keyup', function() {
            const query = $(this).val().trim();

            if (query === "") {
                $('.faq-content-searchable').each(function() {
                    $(this).html($(this).data('original-html'));
                });
                return;
            }

            const regex = new RegExp(`(${query})`, 'gi');

            $('.faq-content-searchable').each(function() {
                const $content = $(this);
                const originalHtml = $content.data('original-html');

                const newHtml = originalHtml.replace(regex, '<span class="highlight">$1</span>');
                $content.html(newHtml);
            });
        });
    }

    const $scrollProgressBar = $('#scroll-progress-bar');
    if ($scrollProgressBar.length) {
        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
            const docHeight = $(document).height();
            const winHeight = $(window).height();
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
            $scrollProgressBar.css('width', scrollPercent + '%');
        });
    }

    function animateCounter($element) {
        const target = parseInt($element.data('count'), 10);
        $({ count: 0 }).animate({ count: target }, {
            duration: 1500,
            easing: 'swing',
            step: function() {
                $element.text(Math.floor(this.count));
            },
            complete: function() {
                $element.text(this.count);
            }
        });
    }

    const $counters = $('.animated-counter');
    if ($counters.length) {
        let triggered = false;
        const $statsContainer = $('.stats-container');

        const checkCountersInView = () => {
            if (triggered || !$statsContainer.length) return;

            const docViewTop = $(window).scrollTop();
            const docViewBottom = docViewTop + $(window).height();
            const elemTop = $statsContainer.offset().top;

            if (elemTop <= docViewBottom - 50) {
                $counters.each(function() {
                    animateCounter($(this));
                });
                triggered = true;
                $(window).off('scroll', checkCountersInView);
            }
        };

        $(window).on('scroll', checkCountersInView);
        checkCountersInView();
    }

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    $('#copy-name-btn').on('click', function() {
        const $button = $(this);
        const textToCopy = $('#profile-name-text').text().trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            $button.find('i').replaceWith(feather.icons['check'].toSvg({ width: 16, height: 16 }));

            const tooltip = bootstrap.Tooltip.getInstance($button[0]);
            $button.attr('data-bs-original-title', 'Copied!').tooltip('show');

            setTimeout(() => {
                $button.find('svg').replaceWith(feather.icons['copy'].toSvg({ width: 16, height: 16, class: 'copy-icon' }));
                $button.attr('data-bs-original-title', 'Copy name').tooltip('hide');
            }, 2000);

        }).catch(err => {
            console.error('Failed to copy: ', err);
            showCustomMessage('Failed to copy text.');
        });
    });

    const $lazyImages = $('.lazy-load');
    if ($lazyImages.length > 0) {

        const lazyLoadImages = () => {
            const docViewTop = $(window).scrollTop();
            const docViewBottom = docViewTop + $(window).height();

            $lazyImages.each(function() {
                const $img = $(this);
                if ($img.hasClass('loaded')) return;

                const elemTop = $img.offset().top;

                if (elemTop < (docViewBottom + 100)) {
                    const src = $img.data('src');
                    if (src) {
                        $img.attr('src', src).addClass('loaded');
                    }
                }
            });
        };

        $(window).on('scroll resize', lazyLoadImages);
        lazyLoadImages();
    }

});