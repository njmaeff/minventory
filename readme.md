# Spacetagram
See the app in action at [https://spacetagram.jmaeff.ca](https://spacetagram.jmaeff.ca).

## Usage
Discover astronomy photos and like your favorites. Under the "Discover" menu, view the current picture of the day. You may select a random entry by clicking the "Random" button. View your saved favorites under the "Liked" menu.

## Features

### Save Your Favorites
Save your favorite photos with browser local storage.

### Dark / Light Theme
Toggle the dark and light theme's using the palette button on the top right corner of the screen.

### View Your Favorites and Search
View your saved favorites under the "Liked" menu and use the search to find a saved choice using keywords. The search uses [React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/) under the hood with a custom search client to use results saved in memory.

Spacetagram only renders the first ten saved results to save resources. When the user reaches the bottom of the page, the app renders the following ten results.

## Extending the App

Future considerations could be persisting data to a cloud database like firebase and hooking up a Typesense node for React InstanSearch.
