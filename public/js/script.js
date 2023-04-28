const showPlace = document.querySelector('.results');
const formSection = document.querySelector('.form');
const searchInput = document.getElementById('searchbox');
let fetchPlaces = '';

const weatherApi = (feature, i) => {
  const placeName = document.querySelector(`.places--${i}`);
  // gettting the selected place latitude and longitude
  placeName.addEventListener('click', async () => {
    const lat = feature.center[1];
    const lon = feature.center[0];
    const coordinates = {
      lat,
      lon,
    };
    // sending coordinates to weather api
    const response = await fetch('/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coordinates),
    });

    // redirect to weather endpoint
    window.setTimeout(() => {
      location.assign('/weather');
    }, 100);
  });
};
if (searchInput) {
  searchInput.value = '';

  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  searchInput.addEventListener('input', async (e) => {
    const userInput = { input: e.target.value };

    // remove previous results from dom
    if (fetchPlaces.length > 0) {
      fetchPlaces.forEach((place) => {
        place.remove();
      });
      formSection.classList.remove('show');
    }

    // send request to api to get latitude and longitude of place
    if (e.target.value.length >= 3) {
      const result = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });

      const data = await result.json();

      // looping through response data

      data.data.features.forEach((feature, i) => {
        // creating new element(places option) for search drop down option
        const newEl = `<div class='places places--${i}'>${feature.place_name}</div>`;
        // Adding new element to result div block
        showPlace.insertAdjacentHTML('beforeend', newEl);
        weatherApi(feature, i);
      });
      formSection.classList.add('show');

      fetchPlaces = document.querySelectorAll('.places');
    }
  });
}
