mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11", // stylesheet location
  center: park.geometry.coordinates, // starting position [lng, lat]
  zoom: 7, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: "#5f634f" })
  .setLngLat(park.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${park.name}</h4><p>${park.address}</p>`
    )
  )
  .addTo(map);
