let savedPoints = []; // saved_tmp["saved"];

let map;
function createMap() {
  map = L.map("map").setView([54.4506593, 18.5607375125286], 7);

  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  // Utwórz grupę warstw

  // Dodaj przycisk "Filtry" do mapy
  var filtersButton = L.control({ position: "topleft" });
  filtersButton.onAdd = function (map) {
    const div = L.DomUtil.create("div", "filters-button");
    div.innerHTML = `<button
        class="btn btn-secondary"
        data-bs-toggle="offcanvas"
        href="#offcanvasExample"
        role="button"
        aria-controls="offcanvasExample"
      >
        Filtry
      </button>`;

    return div;
  };
  filtersButton.addTo(map);

  // Dodaj przycisk "O mapie" do mapy
  var aboutButton = L.control({ position: "topright" });
  aboutButton.onAdd = function (map) {
    const div = L.DomUtil.create("div", "about-button");
    div.innerHTML = `
    
    <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#aboutModal" onclick="showAboutModal()">


    O mapie
  </button>`;

    return div;
  };

  aboutButton.addTo(map);

  // Dodaj przycisk "O mapie" do mapy
  var aboutButton = L.control({ position: "topright" });
  aboutButton.onAdd = function (map) {
    const div = L.DomUtil.create("div", "option-button");
    div.innerHTML = `
  
  <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#optionModal" onclick="showOptionModal()">


  Opcje
</button>`;

    return div;
  };

  aboutButton.addTo(map);
}

// <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#optionModal" onclick="showOptionModal()">

// </button>

function setPoint(point, uid,status) {
  
  const popupContent = document.createElement("div");

  popupContent.innerHTML = ``;
  // Dodawanie własnego atrybutu
  popupContent.setAttribute("data-uid", uid);
  popupContent.setAttribute("style", "width: auto;");
  popupContent.setAttribute("status", "None");

  var icon = blueIcon;

  if (status === "saved") {
    icon = goldIcon;
  }
  if (status === "rejected") {
    icon = redIcon;
  }

  var marker = L.marker(point, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 500,
    alt: uid,
    icon: icon,
  });
  marker.addTo(map).bindPopup(popupContent);
  allMarkersOnTheMap.push({
    "uid": uid,
    "cooridnates": point,
  })
  marker.on("click", onMarkerClick);

}

function showAboutModal() {
  var modal = new bootstrap.Modal(document.getElementById("aboutModal"));
  modal.show();
}
function showOptionModal() {
  var opModal = new bootstrap.Modal(document.getElementById("optionModal"));
  opModal.show();
}

function removePoints()
{  document
  .querySelectorAll(".leaflet-interactive")
  .forEach((el) => el.remove());
document
  .querySelectorAll(".leaflet-shadow-pane")
  .forEach((el) => el.remove());}
  allMarkersOnTheMap = []

  function removePoint(uid)
  {  document
    .querySelector(`[alt="${uid}`).remove()
    indexToRemove = allMarkersOnTheMap.findIndex((obj) => obj.uid === uid)
    if (indexToRemove !== -1) {
      allMarkersOnTheMap.splice(indexToRemove, 1);
    }
}
  
  
  



function getPoints(e) {
  removePoints()
  var points = sendCheckedValues();

  points.then((data) => {
    dane = data;

    if (dane["content"].length > 1999) {
      var modal = new bootstrap.Modal(document.getElementById("alertModal"));
      modal.show();
    }
    allMarkersOnTheMap = []
    for (let index = 0; index < dane["content"].length; index++) {
      point = dane["content"][index].spatialLocation.coordinates;
      uid = dane["content"][index].uid;
      var status = "None";
      try {
        status = savedPoints.find((item) => item.uid === uid).status;
      } catch {}
      // popupContent.setAttribute("status", status);
      
      setPoint(point, uid, status);
    }
  });
}

function showDetails(uid) {
  a = getJSON("https://api.turystyka.gov.pl/registers/open/cwoh/" + uid);
  return a;
}

// Funkcja do obsługi kliknięcia na marker
function onMarkerClick(e) {
  // Pobranie elementu, na który kliknięto
  const uid = e.target.options["alt"];

  // Podmiana innerHTML na nową wartość
  getJSON("https://api.turystyka.gov.pl/registers/open/cwoh/" + uid).then(
    (data) => createDetails(data)
  );
}


