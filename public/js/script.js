const showPlace = document.querySelector('.results');
const formEl = document.querySelector('.form');
const searchType = document.getElementById('placefinder');

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
    // const data = await response.json();
    // redirect to weather endpoint
    window.setTimeout(() => {
      location.assign('/weather');
    }, 100);
  });
};
if (searchType) {
  searchType.value = '';
  searchType.dispatchEvent(new Event('input', { bubbles: true }));
  searchType.addEventListener('input', async (e) => {
    const placeEl = document.querySelectorAll('.places');
    const userInput = { input: e.target.value };

    // remove previous results from dom
    if (placeEl) {
      formEl.classList.remove('show');
      placeEl.forEach((place) => {
        place.remove();
      });
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
      formEl.classList.add('show');
    }
  });
}
