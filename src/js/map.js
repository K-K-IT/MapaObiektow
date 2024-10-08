var markers = []

var dane;
let savedPoints = []; // saved_tmp["saved"];

let map;

async function createMap() {
  var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  });

  var osmHOT = L.tileLayer(
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
    }
  );
  var osmHOT = L.tileLayer(
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
    }
  );

  const OpenTopoMap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  );

  var CyclOSM = L.tileLayer(
    "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  var MtbMap = L.tileLayer(
    "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS',
    }
  );

  var Esri_WorldImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );
  var wmsSrodowisko = L.tileLayer.wms("http://sdi.gdos.gov.pl/wms", {
    layers:
      "GDOS:ObszaryChronionegoKrajobrazu,GDOS:ObszarySpecjalnejOchrony,GDOS:ParkiKrajobrazowe,GDOS:ParkiNarodowe,GDOS:PomnikiPrzyrody,GDOS:Rezerwaty,GDOS:SpecjalneObszaryOchrony,GDOS:StanowiskaDokumentacyjne,GDOS:UzytkiEkologiczne,GDOS:ZespolyPrzyrodniczoKrajobrazowe",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    attribution: "© GDOŚ",
    styles: "", // Puste style, jeśli nie są wymagane
  });
  // Dodanie warstwy WMS
  var wmsRejestrZabytkow = L.tileLayer.wms(
    "http://usluga.zabytek.gov.pl/INSPIRE_IMD/service.svc/get",
    {
      layers: "Immovable_Monuments",
      format: "image/png",
      transparent: true,
      version: "1.1.1",
      attribution: "© Zabytek",
      styles: "", // Puste style, jeśli nie są wymagane
    }
  );

  var WaymarkedTrails_hiking = L.tileLayer(
    "https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  );
  var WaymarkedTrails_cycling = L.tileLayer(
    "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  );
  var baseMaps = {
    "Satelita (ESRI)": Esri_WorldImagery,
    OpenStreetMap: osm,
    "OpenStreetMap.HOT": osmHOT,
    OpenTopoMap: OpenTopoMap,
    "Rowerowa (CyclOSM)": CyclOSM,
    "Rowerowa (MtbMap)": MtbMap,
  };
  var overlayMaps = {
    "Szlaki piesze (WaymarkedTrails)": WaymarkedTrails_hiking,
    "Szlaki rowerowe (WaymarkedTrails)": WaymarkedTrails_cycling,
    "Rejestr zabytków": wmsRejestrZabytkow,
    GDOŚ: wmsSrodowisko,
  };
  map = L.map("map", { layers: [osm] }).setView(
    [54.4506593, 18.5607375125286],
    7
  );
  var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

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
  } catch {
    var details = js;
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
      <br><br>
          <div class="row">
          <div class="col">
      <button
        class="btn btn-secondary btn-sm"
        data-bs-toggle="offcanvas"
        href="#offcanvasRight"
        role="button"
        aria-controls="offcanvasRight"
        onclick="createDetails('${details["uid"]}')"
      >
        Szczegóły
      </button>
      </div>
      <div class="col">
      <button
        class="btn btn-success btn-sm"
        href="#"
        role="toggleDragging"
        onclick="enableDraggable('${details["uid"]}')"
      >
        Odblokuj
      </button>
    </div>
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
    draggable: false,
  });
  marker
    .bindPopup(L.popup({ maxWidth: 2000 }).setContent(popupContent))
    .addTo(map);
  markers[uid] = marker
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
  for (var uid in markers) {
    if (markers.hasOwnProperty(uid)) {
        map.removeLayer(markers[uid]); // Usunięcie markera z mapy
        delete markers[uid]; // Usunięcie markera z obiektu
        allMarkersOnTheMap = [];

    }
}

}

function removePoint(uid) {
  map.removeLayer(markers[uid])
  delete markers[uid]; // Usunięcie markera z obiektu
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
    addToSaved(uid, data);
  }
}
  function enableDraggable(uid){
    m = markers[uid]
    m.dragging.enable()
    btn = m.getPopup()._content.getElementsByTagName("button")[1]
    btn.textContent = "Zablokuj"

    btn.setAttribute("onclick",`disableDraggable("${uid}")`)
    btn.className = "btn btn-danger btn-sm"

  } 
  function disableDraggable(uid){
    m = markers[uid]
    m.dragging.disable()
    btn = m.getPopup()._content.getElementsByTagName("button")[1]
    btn.textContent = "Odblokuj"

    btn.setAttribute("onclick",`enableDraggable("${uid}")`)
    btn.className = "btn btn-success btn-sm"

  } 

  
