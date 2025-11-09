$(document).ready(function() {

    feather.replace();

    function showCustomMessage(message, duration = 3000) {
        const $messageEl = $('#toast-notification');
        if (!$messageEl.length) return;

        $messageEl.text(message).fadeIn(400).delay(duration).fadeOut(400);
    }

    function showError($inputElement, message) {
        const $errorDiv = $inputElement.next('.error-message');
        $inputElement.addClass('is-invalid');
        if ($errorDiv.length) {
            $errorDiv.text(message).show();
        } else {
            $inputElement.next().next('.error-message').text(message).show();
        }
    }

    function clearErrors($form) {
        $form.find('.error-message').hide().text('');
        $form.find('.is-invalid').removeClass('is-invalid');
    }

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

    const currentTheme = loadThemePreference();
    if (currentTheme === 'light') {
        $body.addClass('light-theme');
        $themeToggleButton.html('<i data-feather="moon"></i>');
    } else {
        $themeToggleButton.html('<i data-feather="sun"></i>');
    }
    feather.replace();

    if ($themeToggleButton.length) {
        $themeToggleButton.on('click', toggleTheme);
    }

    const DB_KEY = 'aitumusic_users';
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    function getUsersDB() {
        return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    }

    function saveUsersDB(users) {
        localStorage.setItem(DB_KEY, JSON.stringify(users));
    }

    function updateNavbar() {
        const $authLinksContainer = $('#auth-links');
        if (!$authLinksContainer.length) return;

        if (currentUser) {
            const avatarLetter = currentUser.name.charAt(0).toUpperCase();
            $authLinksContainer.html(`
                <a href="profile.html" class="d-flex align-items-center text-decoration-none me-3 profile-link">
                    <img src="https://placehold.co/40x40/6B0F9C/FFFFFF?text=${avatarLetter}" alt="Avatar" class="rounded-circle">
                    <span class="profile-name ms-2 d-none d-lg-inline">${currentUser.name}</span>
                </a>
                <a href="settings.html" class="text-secondary me-3"><i data-feather="settings"></i></a>
                <button class="btn btn-outline-secondary btn-sm" id="logout-btn">Log Out</button>
            `);
        } else {
            $authLinksContainer.html(`
                <a href="login.html" class="btn btn-outline-secondary me-2">Log In</a>
                <a href="signup.html" class="btn btn-gradient">Sign Up</a>
            `);
        }
        feather.replace();
    }

    $(document).on('click', '#logout-btn', function() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        showCustomMessage('You have been logged out.');
        updateNavbar();
        if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('settings.html')) {
            window.location.href = 'index.html';
        }
    });

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const phoneRegex = /^\+?[7,8] ?\(?[7]\d{2}\)? ?\d{3}-?\d{2}-?\d{2}$/;
    const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    const $signupForm = $('#signup-form');
    if ($signupForm.length) {
        $signupForm.on('submit', function(event) {
            event.preventDefault();
            clearErrors($signupForm);
            let isValid = true;

            const $name = $('#signup-name');
            const $email = $('#signup-email');
            const $phone = $('#signup-phone');
            const $password = $('#signup-password');

            if ($name.val().trim() === '') {
                isValid = false;
                showError($name, 'Please enter your name.');
            }
            if ($email.val().trim() === '') {
                isValid = false;
                showError($email, 'Please enter your email.');
            } else if (!emailRegex.test($email.val())) {
                isValid = false;
                showError($email, 'Please enter a valid email.');
            }
            if ($phone.val().trim() === '') {
                isValid = false;
                showError($phone, 'Please enter your phone number.');
            } else if (!phoneRegex.test($phone.val())) {
                isValid = false;
                showError($phone, 'Please enter a valid phone number (e.g., +7 700 123-45-67).');
            }
            if ($password.val().trim() === '') {
                isValid = false;
                showError($password, 'Please enter a password.');
            } else if (!passRegex.test($password.val())) {
                isValid = false;
                showError($password, 'Password must be min. 8 characters, with 1 uppercase letter and 1 number.');
            }

            if (isValid) {
                const users = getUsersDB();
                const emailExists = users.some(user => user.email === $email.val());

                if (emailExists) {
                    showError($email, 'This email is already registered.');
                    return;
                }

                const newUser = {
                    name: $name.val(),
                    email: $email.val(),
                    phone: $phone.val(),
                    password: $password.val()
                };
                users.push(newUser);
                saveUsersDB(users);

                localStorage.setItem('currentUser', JSON.stringify(newUser));
                currentUser = newUser;

                const $submitBtn = $('#signup-submit-btn');
                $submitBtn.prop('disabled', true);
                $submitBtn.find('.btn-text').text('Signing Up...');
                $submitBtn.find('.spinner-border').removeClass('d-none');

                setTimeout(() => {
                    showCustomMessage('Sign up successful! Welcome, ' + newUser.name);
                    window.location.href = 'profile.html';
                }, 1000);
            }
        });
    }

    const $loginForm = $('#login-form');
    if ($loginForm.length) {
        $loginForm.on('submit', function(event) {
            event.preventDefault();
            clearErrors($loginForm);
            let isValid = true;

            const $email = $('#login-email');
            const $password = $('#login-password');

            if ($email.val().trim() === '') {
                isValid = false;
                showError($email, 'Please enter your email.');
            }
            if ($password.val().trim() === '') {
                isValid = false;
                showError($password, 'Please enter your password.');
            }

            if (isValid) {
                const users = getUsersDB();
                const foundUser = users.find(user => user.email === $email.val());

                if (!foundUser || foundUser.password !== $password.val()) {
                    showError($email, 'Invalid email or password.');
                    return;
                }

                localStorage.setItem('currentUser', JSON.stringify(foundUser));
                currentUser = foundUser;

                const $submitBtn = $('#login-submit-btn');
                $submitBtn.prop('disabled', true);
                $submitBtn.find('.btn-text').text('Logging In...');
                $submitBtn.find('.spinner-border').removeClass('d-none');

                setTimeout(() => {
                    showCustomMessage('Login successful! Welcome back, ' + foundUser.name);
                    window.location.href = 'profile.html';
                }, 1000);
            }
        });
    }

    const $contactForm = $('#contact-form');
    if ($contactForm.length) {
        $contactForm.on('submit', function(event) {
            event.preventDefault();
            clearErrors($contactForm);
            let isValid = true;

            const $name = $('#contact-name');
            const $email = $('#contact-email');
            const $subject = $('#contact-subject');
            const $message = $('#contact-message');

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

        $('#contact-reset-btn').on('click', function(e) {
            e.preventDefault();
            $contactForm[0].reset();
            clearErrors($contactForm);
            showCustomMessage('Form fields have been cleared.');
        });
    }

    function togglePasswordVisibility(inputId, toggleBtnId) {
        const $passwordInput = $(inputId);
        const $toggleBtn = $(toggleBtnId);

        if ($passwordInput.attr('type') === 'password') {
            $passwordInput.attr('type', 'text');
            $toggleBtn.html('<i data-feather="eye-off"></i>');
        } else {
            $passwordInput.attr('type', 'password');
            $toggleBtn.html('<i data-feather="eye"></i>');
        }
        feather.replace();
    }

    $('#toggle-login-password').on('click', function() {
        togglePasswordVisibility('#login-password', '#toggle-login-password');
    });

    $('#toggle-signup-password').on('click', function() {
        togglePasswordVisibility('#signup-password', '#toggle-signup-password');
    });

    const currentPage = window.location.pathname;

    if (currentPage.includes('profile.html') || currentPage.includes('settings.html')) {
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        if (currentPage.includes('profile.html')) {
            const $name = $('#profile-name-text');
            const $email = $('#profile-email-text');
            const $avatar = $('#profile-avatar');

            if ($name.length) {
                $name.text(currentUser.name);
                $email.text(currentUser.email);
                $avatar.attr('src', `https://placehold.co/150x150/6B0F9C/FFFFFF?text=${currentUser.name.charAt(0).toUpperCase()}`);
            }

            const $counters = $('.animated-counter');
            if ($counters.length) {
                $counters.each(function() {
                    const $element = $(this);
                    const target = parseInt($element.data('count'), 10);
                    $({ count: 0 }).animate({ count: target }, {
                        duration: 1500,
                        easing: 'swing',
                        step: function() { $element.text(Math.floor(this.count)); },
                        complete: function() { $element.text(this.count); }
                    });
                });
            }
        }

        if (currentPage.includes('settings.html')) {
            const $email = $('#settings-email');
            const $username = $('#settings-username');
            const $phone = $('#settings-phone');
            const $settingsForm = $('#settings-form');

            if ($email.length) {
                $email.val(currentUser.email);
                $username.val(currentUser.name);
                $phone.val(currentUser.phone);
            }

            $settingsForm.on('submit', function(event) {
                event.preventDefault();
                const $submitBtn = $('#settings-submit-btn');
                $submitBtn.prop('disabled', true).text('Saving...');

                const newName = $username.val();
                const newPhone = $phone.val();

                let users = getUsersDB();
                let userIndex = users.findIndex(user => user.email === currentUser.email);

                if (userIndex !== -1) {
                    users[userIndex].name = newName;
                    users[userIndex].phone = newPhone;
                    saveUsersDB(users);

                    currentUser.name = newName;
                    currentUser.phone = newPhone;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));

                    updateNavbar();
                }

                setTimeout(() => {
                    showCustomMessage('Settings saved successfully!');
                    $submitBtn.prop('disabled', false).text('Save changes');
                }, 1000);
            });
        }
    }

    const $greetingDisplay = $('#greeting-display');
    if ($greetingDisplay.length && currentUser) {
        const now = new Date();
        const hour = now.getHours();
        let timeOfDay;

        if (hour >= 5 && hour < 12) timeOfDay = "Morning";
        else if (hour >= 12 && hour < 17) timeOfDay = "Afternoon";
        else if (hour >= 17 && hour < 22) timeOfDay = "Evening";
        else timeOfDay = "Night";

        $greetingDisplay.text(`Good ${timeOfDay}, ${currentUser.name}!`);
    }

    const ratingsDB = JSON.parse(localStorage.getItem('aitumusic_ratings')) || {};

    function saveRatings() {
        localStorage.setItem('aitumusic_ratings', JSON.stringify(ratingsDB));
    }

    $('.star-rating').each(function() {
        const $container = $(this);
        const itemId = $container.data('item-id');
        const savedRating = ratingsDB[itemId];

        if (savedRating) {
            $container.find('.star').slice(0, savedRating).addClass('checked');
        }
    });

    $('.star-rating').on('click', '.star', function() {
        const $clickedStar = $(this);
        const $container = $clickedStar.closest('.star-rating');
        const rating = parseInt($clickedStar.data('value'));
        const itemId = $container.data('item-id');

        const $stars = $container.find('.star');
        $stars.removeClass('checked');
        $stars.slice(0, rating).addClass('checked');

        ratingsDB[itemId] = rating;
        saveRatings();

        showCustomMessage(`You rated this ${rating} stars!`);
    });

    $('.star-rating').on('mouseover', '.star', function() {
        const hoverRating = parseInt($(this).data('value'));
        $(this).closest('.star-rating').find('.star').each(function(index) {
            $(this).css('color', index < hoverRating ? 'gold' : '');
        });
    }).on('mouseout', function() {
        $(this).find('.star').css('color', '');
    });

    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const API_BASE_URL = 'https://api.deezer.com/';

    const $apiTrackList = $('#api-track-list');
    if ($apiTrackList.length) {
        $.ajax({
            url: `${PROXY_URL}${API_BASE_URL}chart/0/tracks`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                $('#api-track-list-loading').hide();
                if (response.data && response.data.length > 0) {
                    const tracksHtml = response.data.slice(0, 10).map(track => `
                        <li class="list-group-item track-list-item">
                            <img src="${track.album.cover_small}" class="rounded-2" alt="Track">
                            <div class="track-info">
                                <div class="track-title">${track.title}</div>
                                <div class="track-artist">${track.artist.name}</div>
                            </div>
                            <div class="track-album d-none d-md-block">${track.album.title}</div>
                            <div class="track-duration">${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}</div>
                        </li>
                    `).join('');
                    $apiTrackList.html(tracksHtml);
                } else {
                    $apiTrackList.html('<p class="text-secondary">Could not load tracks.</p>');
                }
            },
            error: function() {
                $('#api-track-list-loading').hide();
                $apiTrackList.html('<p class="text-danger">Error: Could not connect to the API. Please try again later.</p>');
            }
        });
    }

    const $apiAlbumList = $('#api-album-list');
    if ($apiAlbumList.length) {
        $.ajax({
            url: `${PROXY_URL}${API_BASE_URL}chart/0/albums`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                $('#api-album-list-loading').hide();
                if (response.data && response.data.length > 0) {
                    const albumsHtml = response.data.map(album => `
                        <div class="col api-album-card">
                            <div class="card h-100">
                                <img src="${album.cover_medium}" class="card-img-top" alt="${album.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${album.title}</h5>
                                    <p class="card-text">${album.artist.name}</p>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    $apiAlbumList.html(albumsHtml);
                } else {
                    $apiAlbumList.parent().html('<p class="text-secondary">Could not load albums.</p>');
                }
            },
            error: function() {
                $('#api-album-list-loading').hide();
                $apiAlbumList.parent().html('<p class="text-danger">Error: Could not connect to the API. Please try again later.</p>');
            }
        });
    }

    const $apiSearchForm = $('#api-search-form');
    const $searchInput = $('#search-input');
    const $searchResultsContainer = $('#api-search-results');
    const $searchLoading = $('#api-search-loading');
    const $searchPlaceholder = $('#api-search-placeholder');
    const $searchResultsHeading = $('#search-results-heading');

    function performSearch(query) {
        if (!query) return;

        $searchLoading.show();
        $searchPlaceholder.hide();
        $searchResultsContainer.empty();
        $searchResultsHeading.show().text(`Search Results for "${query}"`);
        localStorage.setItem('lastSearchQuery', query);

        $.ajax({
            url: `${PROXY_URL}${API_BASE_URL}search?q=${encodeURIComponent(query)}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                $searchLoading.hide();
                if (response.data && response.data.length > 0) {
                    const resultsHtml = response.data.map(item => `
                        <div class="col api-album-card">
                            <div class="card h-100">
                                <img src="${item.album.cover_medium}" class="card-img-top" alt="${item.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.artist.name}</p>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    $searchResultsContainer.html(resultsHtml);
                } else {
                    $searchPlaceholder.text(`No results found for "${query}".`).show();
                }
            },
            error: function() {
                $searchLoading.hide();
                $searchPlaceholder.text('Error: Could not connect to the API.').show();
            }
        });
    }

    if ($apiSearchForm.length) {
        const lastSearch = localStorage.getItem('lastSearchQuery');
        if (lastSearch) {
            $searchInput.val(lastSearch);
            performSearch(lastSearch);
        }

        $apiSearchForm.on('submit', function(event) {
            event.preventDefault();
            const query = $searchInput.val().trim();
            performSearch(query);
        });

        $('.genre-card-btn').on('click', function() {
            const genre = $(this).data('genre');
            $searchInput.val(genre);
            performSearch(genre);
            $('html, body').animate({
                scrollTop: $apiSearchForm.offset().top - 80
            }, 500);
        });
    }

    $('#premium-plan-btn').on('click', function() {
        showCustomMessage('Redirecting to Premium checkout...');
    });
    $('#family-plan-btn').on('click', function() {
        showCustomMessage('Redirecting to Family Plan checkout...');
    });

    $('.accordion-header').on('click', function() {
        const $item = $(this).parent('.accordion-item');
        $item.toggleClass('active');
        $('.accordion-item').not($item).removeClass('active');
    });

    const $faqSearchInput = $('#faq-search-input');
    if ($faqSearchInput.length) {
        $('.faq-content-searchable').each(function() {
            $(this).data('original-html', $(this).html());
        });

        $faqSearchInput.on('keyup', function() {
            const query = $(this).val().trim();
            const regex = new RegExp(`(${query})`, 'gi');

            $('.faq-content-searchable').each(function() {
                const $content = $(this);
                const originalHtml = $content.data('original-html');
                if (query === "") {
                    $content.html(originalHtml);
                } else {
                    const newHtml = originalHtml.replace(regex, '<span class="highlight">$1</span>');
                    $content.html(newHtml);
                }
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

    const $popupOverlay = $('#popup-overlay');
    $('#open-popup-btn').on('click', function(e) {
        e.preventDefault();
        $popupOverlay.css('display', 'flex');
    });

    const closePopup = () => $popupOverlay.hide();
    $('#popup-close-btn').on('click', closePopup);
    $popupOverlay.on('click', function(event) {
        if (event.target === this) closePopup();
    });
    $('#popup-form').on('submit', function(e) {
        e.preventDefault();
        const $popupEmail = $('#popup-email');
        if ($popupEmail.val().trim() !== '' && emailRegex.test($popupEmail.val())) {
            showCustomMessage('Thanks for subscribing!');
            closePopup();
            $(this)[0].reset();
        } else {
            showCustomMessage('Please enter a valid email to subscribe.');
        }
    });

    updateNavbar();

    feather.replace();

});