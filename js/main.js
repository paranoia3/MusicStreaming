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
    }
}

function clearErrors($form) {
    $form.find('.error-message').hide().text('');
    $form.find('.is-invalid').removeClass('is-invalid');
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


$(document).ready(function() {
    console.log("jQuery is ready!");

    feather.replace();

    const DEEZER_API_URL = "https://api.deezer.com";
    const $body = $('body');
    const $greetingDisplay = $('#greeting-display');

    function getLoggedInUser() {
        const userJson = localStorage.getItem('loggedInUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    function getAllUsers() {
        const usersJson = localStorage.getItem('users');
        return usersJson ? JSON.parse(usersJson) : [];
    }

    function saveAllUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function updateNavbar() {
        const user = getLoggedInUser();
        const $authLinks = $('#auth-links');
        if (!$authLinks.length) return;

        let authHtml = '';
        if (user) {
            const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'A';
            authHtml = `
                <a href="profile.html" class="d-flex align-items-center text-decoration-none me-3 profile-link">
                  <img src="https://placehold.co/40x40/6B0F9C/FFFFFF?text=${avatarLetter}" alt="Avatar" class="rounded-circle">
                  <span class="profile-name ms-2 d-none d-lg-inline">${user.name}</span>
                </a>
                <a href="settings.html" class="text-secondary me-3" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Settings">
                    <i data-feather="settings"></i>
                </a>
                <button class="btn btn-outline-secondary btn-sm" id="logout-btn">Log Out</button>
            `;
        } else {
            authHtml = `
                <a href="login.html" class="btn btn-outline-secondary me-2">Log In</a>
                <a href="signup.html" class="btn btn-gradient">Sign Up</a>
            `;
        }
        $authLinks.html(authHtml);
        if (user) {
            $('#logout-btn').on('click', handleLogout);
        }
        feather.replace();
    }

    function handleLogout() {
        localStorage.removeItem('loggedInUser');
        showCustomMessage('You have been logged out.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    function checkAuth() {
        const user = getLoggedInUser();
        const currentPage = window.location.pathname.split('/').pop();
        const protectedPages = ['profile.html', 'settings.html'];

        if (!user && protectedPages.includes(currentPage)) {
            showCustomMessage('You must be logged in to view this page. Redirecting...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else if (user && (currentPage === 'login.html' || currentPage === 'signup.html')) {
            showCustomMessage('You are already logged in. Redirecting to profile...');
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        const $form = $('#login-form');
        clearErrors($form);

        const email = $('#login-email').val().trim();
        const password = $('#login-password').val().trim();
        let isValid = true;

        if (email === '') {
            showError($('#login-email'), 'Please enter your email.');
            isValid = false;
        }
        if (password === '') {
            showError($('#login-password'), 'Please enter your password.');
            isValid = false;
        }
        if (!isValid) return;

        const users = getAllUsers();
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
            showCustomMessage(`Welcome back, ${foundUser.name}!`);
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        } else {
            showCustomMessage('Invalid email or password.');
            showError($('#login-email'), 'Invalid credentials.');
            showError($('#login-password'), 'Invalid credentials.');
        }
    }

    function handleSignUp(event) {
        event.preventDefault();
        const $form = $('#signup-form');
        clearErrors($form);

        const name = $('#signup-name').val().trim();
        const email = $('#signup-email').val().trim();
        const phone = $('#signup-phone').val().trim();
        const password = $('#signup-password').val().trim();
        const confirmPassword = $('#signup-confirm-password').val().trim();

        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (name === '') {
            showError($('#signup-name'), 'Please enter your full name.');
            isValid = false;
        }

        if (email === '') {
            showError($('#signup-email'), 'Please enter your email.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError($('#signup-email'), 'Please enter a valid email format.');
            isValid = false;
        } else {
            const users = getAllUsers();
            if (users.find(user => user.email === email)) {
                showError($('#signup-email'), 'This email is already registered.');
                isValid = false;
            }
        }

        if (phone === '') {
            showError($('#signup-phone'), 'Please enter your phone number.');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError($('#signup-phone'), 'Please enter a valid phone number (e.g., +15555555555).');
            isValid = false;
        }

        if (password === '') {
            showError($('#signup-password'), 'Please create a password.');
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            showError($('#signup-password'), 'Password must be at least 8 characters long and include one uppercase letter and one number.');
            isValid = false;
        }

        if (confirmPassword === '') {
            showError($('#signup-confirm-password'), 'Please confirm your password.');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError($('#signup-confirm-password'), 'Passwords do not match.');
            isValid = false;
        }

        if (!isValid) return;

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            phone: phone,
            password: password
        };

        const users = getAllUsers();
        users.push(newUser);
        saveAllUsers(users);

        localStorage.setItem('loggedInUser', JSON.stringify(newUser));

        showCustomMessage('Account created successfully! Welcome!');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }

    $('#login-form').on('submit', handleLogin);
    $('#signup-form').on('submit', handleSignUp);

    function initProfilePage() {
        const user = getLoggedInUser();
        if (!user) return;

        $('#profile-name-text').text(user.name);
        $('#profile-email-text').text(user.email);
        const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'A';
        $('#profile-avatar').attr('src', `https://placehold.co/150x150/6B0F9C/FFFFFF?text=${avatarLetter}`);
    }

    function initSettingsPage() {
        const user = getLoggedInUser();
        if (!user) return;

        $('#settings-email').val(user.email);
        $('#settings-username').val(user.name);
        $('#settings-phone').val(user.phone);

        $('#settings-form').on('submit', function(event) {
            event.preventDefault();
            const $submitBtn = $('#settings-submit-btn');
            $submitBtn.prop('disabled', true).text('Saving...');

            const newName = $('#settings-username').val().trim();
            const newPhone = $('#settings-phone').val().trim();

            let users = getAllUsers();
            let userIndex = users.findIndex(u => u.id === user.id);

            if (userIndex !== -1) {
                users[userIndex].name = newName;
                users[userIndex].phone = newPhone;
                saveAllUsers(users);

                user.name = newName;
                user.phone = newPhone;
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                setTimeout(() => {
                    showCustomMessage('Settings saved successfully!');
                    $submitBtn.prop('disabled', false).text('Save changes');
                    updateNavbar();
                }, 1000);
            } else {
                setTimeout(() => {
                    showCustomMessage('Error: Could not find user to update.');
                    $submitBtn.prop('disabled', false).text('Save changes');
                }, 1000);
            }
        });
    }

    function initGreeting() {
        const user = getLoggedInUser();
        if ($greetingDisplay.length) {
            const now = new Date();
            const hour = now.getHours();
            let timeOfDay;

            if (hour >= 5 && hour < 12) timeOfDay = "Morning";
            else if (hour >= 12 && hour < 17) timeOfDay = "Afternoon";
            else if (hour >= 17 && hour < 22) timeOfDay = "Evening";
            else timeOfDay = "Night";

            const name = user ? user.name : 'Music Lover';
            $greetingDisplay.text(`Good ${timeOfDay}, ${name}!`);
        }
    }

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
            $('#theme-toggle-btn').html('<i data-feather="moon"></i>');
        } else {
            $body.removeClass('light-theme');
            $('#theme-toggle-btn').html('<i data-feather="sun"></i>');
        }
        feather.replace();
        saveThemePreference(newTheme);
    }

    if (loadThemePreference() === 'light') {
        $body.addClass('light-theme');
    }
    $('#theme-toggle-btn').html($body.hasClass('light-theme') ? '<i data-feather="moon"></i>' : '<i data-feather="sun"></i>');
    feather.replace();
    $('#theme-toggle-btn').on('click', toggleTheme);

    function getRatings() {
        const ratingsJson = localStorage.getItem('userRatings');
        return ratingsJson ? JSON.parse(ratingsJson) : {};
    }

    function saveRating(itemId, rating) {
        const ratings = getRatings();
        ratings[itemId] = rating;
        localStorage.setItem('userRatings', JSON.stringify(ratings));
    }

    function loadSavedRatings() {
        const ratings = getRatings();
        $('.star-rating').each(function() {
            const $container = $(this);
            const itemId = $container.data('item-id');
            if (ratings[itemId]) {
                const rating = ratings[itemId];
                const $stars = $container.find('.star');
                $stars.removeClass('checked');
                $stars.slice(0, rating).addClass('checked');
            }
        });
    }

    $('.star-rating').each(function() {
        const $container = $(this);
        const $stars = $container.find('.star');
        const itemId = $container.data('item-id');

        $stars.on('click', function() {
            const $clickedStar = $(this);
            const rating = parseInt($clickedStar.data('value'));

            if (!getLoggedInUser()) {
                showCustomMessage('Please log in to save your rating.');
                return;
            }

            $stars.removeClass('checked');
            $stars.slice(0, rating).addClass('checked');

            saveRating(itemId, rating);
            showCustomMessage(`You rated this ${rating} stars!`);
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

        $('#contact-reset-btn').on('click', function(e) {
            e.preventDefault();
            $contactForm[0].reset();
            clearErrors($contactForm);
            showCustomMessage('Form fields have been cleared.');
        });
    }

    function fetchDeezerTopTracks() {
        const $list = $('#api-track-list');
        const $loading = $('#api-track-list-loading');
        if (!$list.length) return;

        $.ajax({
            url: `${DEEZER_API_URL}/chart/0/tracks?output=jsonp`,
            dataType: 'jsonp',
            success: function(response) {
                $loading.hide();
                if (response.data && response.data.length > 0) {
                    const tracksHtml = response.data.slice(0, 10).map((track, index) => `
                        <li class="list-group-item track-list-item api-track-item">
                            <img src="${track.album.cover_small}" class="rounded-2" alt="${track.album.title}">
                            <div class="track-info">
                                <div class="track-title">${track.title}</div>
                                <div class="track-artist">${track.artist.name}</div>
                            </div>
                            <div class="track-album d-none d-md-block">${track.album.title}</div>
                            <div class="track-duration">${formatDuration(track.duration)}</div>
                        </li>
                    `).join('');
                    $list.html(tracksHtml);
                } else {
                    $list.html('<li class="list-group-item text-secondary">Could not load top tracks.</li>');
                }
            },
            error: function() {
                $loading.hide();
                $list.html('<li class="list-group-item text-danger">Error fetching tracks from Deezer.</li>');
            }
        });
    }

    function fetchDeezerTopAlbums() {
        const $list = $('#api-album-list');
        const $loading = $('#api-album-list-loading');
        if (!$list.length) return;

        $.ajax({
            url: `${DEEZER_API_URL}/chart/0/albums?output=jsonp`,
            dataType: 'jsonp',
            success: function(response) {
                $loading.hide();
                if (response.data && response.data.length > 0) {
                    const albumsHtml = response.data.slice(0, 12).map(album => `
                        <div class="col">
                            <div class="card h-100 api-album-card">
                                <img src="${album.cover_medium}" class="card-img-top" alt="${album.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${album.title}</h5>
                                    <p class="card-text">${album.artist.name}</p>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    $list.html(albumsHtml);
                } else {
                    $loading.show().html('<p class="text-secondary">Could not load top albums.</p>');
                }
            },
            error: function() {
                $loading.show().html('<p class="text-danger">Error fetching albums from Deezer.</p>');
            }
        });
    }

    function handleApiSearch(event) {
        event.preventDefault();
        const query = $('#search-input').val().trim();
        if (query === '') {
            showCustomMessage('Please enter a search term.');
            return;
        }

        localStorage.setItem('lastSearchQuery', query);

        const $results = $('#api-search-results');
        const $loading = $('#api-search-loading');
        const $placeholder = $('#api-search-placeholder');
        const $heading = $('#search-results-heading');

        $results.empty();
        $placeholder.hide();
        $loading.show();
        $heading.text(`Search results for "${query}"`).show();

        $.ajax({
            url: `${DEEZER_API_URL}/search?q=${encodeURIComponent(query)}&output=jsonp`,
            dataType: 'jsonp',
            success: function(response) {
                $loading.hide();
                if (response.data && response.data.length > 0) {
                    const resultsHtml = response.data.slice(0, 18).map(track => `
                        <div class="col">
                            <div class="card h-100 api-album-card">
                                <img src="${track.album.cover_medium}" class="card-img-top" alt="${track.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${track.title}</h5>
                                    <p class="card-text">${track.artist.name}</p>
                                    <small class="text-secondary d-block">${track.album.title}</small>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    $results.html(resultsHtml);
                } else {
                    $placeholder.text(`No results found for "${query}".`).show();
                }
            },
            error: function() {
                $loading.hide();
                $placeholder.text('Error searching. Please try again.').show();
            }
        });
    }

    $('#api-search-form').on('submit', handleApiSearch);

    function fetchTracksByGenre(genre) {
        if (!genre) return;

        const $results = $('#api-search-results');
        const $loading = $('#api-search-loading');
        const $placeholder = $('#api-search-placeholder');
        const $heading = $('#search-results-heading');

        $results.empty();
        $placeholder.hide();
        $loading.show();
        $heading.text(`Top ${genre} Tracks`).show();

        $('html, body').animate({
            scrollTop: $heading.offset().top - 80
        }, 500);

        const searchUrl = `${DEEZER_API_URL}/search?q=genre:"${encodeURIComponent(genre)}"&output=jsonp`;

        $.ajax({
            url: searchUrl,
            dataType: 'jsonp',
            success: function(response) {
                $loading.hide();
                if (response.data && response.data.length > 0) {
                    const resultsHtml = response.data.slice(0, 18).map(track => `
                        <div class="col">
                            <div class="card h-100 api-album-card">
                                <img src="${track.album.cover_medium}" class="card-img-top" alt="${track.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${track.title}</h5>
                                    <p class="card-text">${track.artist.name}</p>
                                    <small class="text-secondary d-block">${track.album.title}</small>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    $results.html(resultsHtml);
                } else {
                    $placeholder.text(`No results found for genre "${genre}".`).show();
                }
            },
            error: function() {
                $loading.hide();
                $placeholder.text('Error fetching genre tracks. Please try again.').show();
            }
        });
    }

    $('#category-list').on('click', '.genre-card-btn', function() {
        const genre = $(this).data('genre');
        fetchTracksByGenre(genre);
    });

    function loadLastSearch() {
        const $searchInput = $('#search-input');
        if ($searchInput.length) {
            const lastSearch = localStorage.getItem('lastSearchQuery');
            if (lastSearch) {
                $searchInput.val(lastSearch);
            }
        }
    }

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
            step: function() { $element.text(Math.floor(this.count)); },
            complete: function() { $element.text(this.count); }
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
                $counters.each(function() { animateCounter($(this)); });
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

    updateNavbar();

    checkAuth();

    initGreeting();
    initProfilePage();
    initSettingsPage();
    loadSavedRatings();
    loadLastSearch();

    fetchDeezerTopTracks();
    fetchDeezerTopAlbums();
});