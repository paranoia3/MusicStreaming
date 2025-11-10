# AITUMusic Project

This is a music streaming website project built to satisfy the final project requirements for a web development course. It features a responsive design, light/dark modes, user authentication, and integration with the Deezer API to provide dynamic music content.

## Features

* **Responsive Design:** Fully responsive layout for desktop, tablet, and mobile devices using Bootstrap 5.
* **Light/Dark Mode:** Toggle between light and dark themes with user preference saved in `localStorage`.
* **User Authentication:**
    * User Sign Up and Log In functionality.
    * User data (name, email, phone) is stored securely in `localStorage`.
    * Protected routes for profile and settings pages.
    * Dynamic navbar that updates based on authentication status.
* **Profile Page:** Displays the logged-in user's account details.
* **Form Validation:** All forms (Login, Sign Up, Contact) include comprehensive client-side validation for required fields, email format, phone format, and password complexity.
* **External API Integration (Deezer):**
    * **Home Page:** Displays the current top tracks from the Deezer API.
    * **Explore Page:** Displays the current top albums from the Deezer API.
    * **Search Page:** Allows users to search the Deezer API for tracks, artists, and albums.
* **Enhanced Functionality:**
    * **Rating System:** Users can rate artists/tracks, and their ratings are saved to `localStorage`.
    * **Search Persistence:** The user's last search query is saved to `localStorage` and repopulated on page load.
    * **Polished UI/UX:** Includes toast notifications, loading spinners, lazy-loading images, and a scroll progress bar.

## How to Run

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/paranoia3/MusicStreaming
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd aitumusic
    ```
3.  **Open `index.html`:**
    * Since this is a static website, you can simply open the `index.html` file in your web browser.
    * For the best experience (especially for API requests), it's recommended to serve the files using a simple local server. If you have Python installed:
        ```sh
        # For Python 3
        python -m http.server
        ```
      Then, open `http://localhost:8000` in your browser.
    * **IMPORTANT:** To make the API work, you must first visit [https://cors-anywhere.herokuapp.com/](https://cors-anywhere.herokuapp.com/) and click the activation button.

## Project Structure

```
/
|-- css/
|   |-- style.css         # Main stylesheet
|-- images/               # Project images (album art, logos, etc.)
|-- js/
|   |-- main.js           # Main JavaScript file with all logic
|-- index.html            # Home page
|-- explore.html          # Explore page (Top Albums)
|-- search.html           # Search page
|-- playlists.html        # Static playlists page
|-- faq.html              # FAQ page
|-- contact.html          # Contact page
|-- subscription.html     # Static subscription page
|-- login.html            # (New) Login page
|-- signup.html           # (New) Sign Up page
|-- profile.html          # (Updated) User profile page (protected)
|-- settings.html         # (Updated) User settings page (protected)
|-- README.md             # (New) This file
```