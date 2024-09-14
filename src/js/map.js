var dane;
let savedPoints = []; // saved_tmp["saved"];

let map;
async function createMap() {
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

function setPoint(point, uid, status, js = NaN) {
  //--------------------------------------------------
  try {
    var details = dane["content"].find((ele) => ele.uid == uid);
    console.log(details)

    
  } catch {
    var details = js;
    console.log(details)

  }

  const popupContent = document.createElement("div");
  var savedIndexToChange = savedPoints.findIndex((obj) => obj.uid === uid);
  if (savedIndexToChange !== -1) {
    point = savedPoints[savedIndexToChange].data.coordinates;
  }

  // Dodawanie własnego atrybutu
  popupContent.setAttribute("data-uid", uid);
  popupContent.setAttribute("style", "width: auto;");
  popupContent.setAttribute("status", "None");
  popupContent.className = "container";

  var icon = blueIcon;

  if (status === "saved") {
    icon = goldIcon;
  }
  if (status === "rejected") {
    icon = redIcon;
  }

  popupContent.innerHTML = `<div class="row">
  <div class="col"><b>Nazwa obiektu</b></div>
  <div class="col">${details["name"]}</div>
</div>
<div class="row">
  <div class="col">Rodzaj obiektu:</div>
  <div class="col">${kind[details["kind"]]}</div>
  </div>
  <div class="row">
    <div class="col">Klasyfikacja obiektu:</div>
    <div class="col">${categories[details["category"]]}</div>
    </div>
    <div class="row">
      <div class="col">Adres:</div>
      <div class="col">
        ${details["city"]} ${details["postalCode"]} ${details["street"]}
  
      </div>
      </div>
      <button
        class="button text-bg-light btn-lg"
        data-bs-toggle="offcanvas"
        href="#offcanvasRight"
        role="button"
        aria-controls="offcanvasRight"
        onclick="createDetails('${details["uid"]}')"
      >
        Szczegóły
      </button>
    </div>
  </div>

  `;

  var marker = L.marker(point, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 500,
    alt: uid,
    icon: icon,
    draggable: true,
  });
  marker.bindPopup(L.popup({ maxWidth: 200 }).setContent(popupContent)).addTo(map);
  // .bindPopup.addTo(map).pop.popup({ maxWidth: 500 }).setContent(popupContent)));

  // allMarkersOnTheMap.push({
  //   uid: uid,
  //   cooridnates: point,
  //   status: status,
  // });
  // marker.on("click", onMarkerClick);
  // marker.on("click()", onMarkerClick);
  marker.on("dragend", dragedMaker);
}

function showAboutModal() {
  var modal = new bootstrap.Modal(document.getElementById("aboutModal"));
  modal.show();
}
function showOptionModal() {
  var opModal = new bootstrap.Modal(document.getElementById("optionModal"));
  opModal.show();
}

function removePoints() {
  document
    .querySelectorAll(".leaflet-interactive")
    .forEach((el) => el.remove());
  document
    .querySelectorAll(".leaflet-shadow-pane")
    .forEach((el) => el.remove());
}
allMarkersOnTheMap = [];

function removePoint(uid) {
  document.querySelector(`[alt="${uid}`).remove();
  indexToRemove = allMarkersOnTheMap.findIndex((obj) => obj.uid === uid);
  if (indexToRemove !== -1) {
    allMarkersOnTheMap.splice(indexToRemove, 1);
  }
}

async function getPoints(e) {
  removePoints();
  var points = await sendCheckedValues();

  dane = points;

  if (dane["content"].length > 1999) {
    var modal = new bootstrap.Modal(document.getElementById("alertModal"));
    modal.show();
  }
  allMarkersOnTheMap = dane["content"];
  for (let index = 0; index < dane["content"].length; index++) {
    point = dane["content"][index].spatialLocation.coordinates;
    uid = dane["content"][index].uid;
    var status = "None";
    try {
      status = savedPoints.find((item) => item.uid === uid).data.status;
    } catch {}
    // popupContent.setAttribute("status", status);

    setPoint(point, uid, status);
  }
}

function showDetails(uid) {
  getJSON("https://api.turystyka.gov.pl/registers/open/cwoh/" + uid).then(
    (j) => {
      return j;
    }
  );
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

// draged
function dragedMaker() {
  point = [this.getLatLng().lat, this.getLatLng().lng];
  uid = this.options.alt;


  var savedIndexToChange = savedPoints.findIndex((obj) => obj.uid === uid);
if (savedIndexToChange !== -1) {
  savedPoints[savedIndexToChange].data.coordinates = point;
  savedPoints[savedIndexToChange].data.moved = true;
} else {
  data = {
    status: "None",
    coordinates: point,
    moved: true,
  };
  addToSaved(uid, data)
}

}
