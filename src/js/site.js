var js;
var doc;
var uniqueContent;
var udogodnienia_counter = 0;
var data;
// var status;
const rejectActive =
  '<ion-icon name="thumbs-down" id="reject" style="color: red; align: right" size="large" onclick="unmarkReject()"/>';
const rejectDeactive =
  '<ion-icon id="reject" name="thumbs-down-outline" style="color: red; align: right" size="large" onclick="markReject()"></ion-icon>';
const starActive =
  '<ion-icon name="star" id="star" style="color: gold" size="large" onclick="unmarkStar()"></ion-icon>';
const starDeactive =
  '<ion-icon id="star" name="star-outline" style="color: gold" size="large" onclick="markStar()"></ion-icon>';

function createCheckboxes(data) {
  // Znajdź element z id "form"
  const formContainer = document.getElementById("udogodnienia");

  // Utwórz nową tablicę z unikatowymi wartościami
  uniqueContent = Array.from(
    new Map(data.content.map((item) => [item.key, item])).values()
  );

  // Utwórz kontener dla wszystkich checkboxów
  const checkboxesContainer = document.createElement("div");

  b = document.getElementById("udogodnienia-button");
  b.textContent = `Udogodnienia (${uniqueContent.length})`;

  // Iteruj po tablicy z unikatowymi wartościami
  uniqueContent.forEach((item) => {
    // Utwórz checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = item.key;
    checkbox.id = item.key;
    checkbox.className = "form-check-input";

    // Utwórz label dla checkboxa
    const label = document.createElement("label");
    label.textContent = item.name;
    label.htmlFor = item.key;
    label.className = "form-check-label";

    // Utwórz kontener dla checkbox i label
    const checkboxContainer = document.createElement("div");
    checkboxContainer.style.marginRight = "10px"; // Dodaj margines między checkboxami
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    // Dodaj kontener do kontenera dla wszystkich checkboxów
    checkboxesContainer.appendChild(checkboxContainer);
  });

  // Dodaj kontener z checkboxami do elementu z id "form"
  formContainer.appendChild(checkboxesContainer);
}

function createQ() {
  const url =
    "https://api.turystyka.gov.pl/registers/open/cwoh/filters/questionnaires";
  getJSON(url)
    .then((data) => createCheckboxes(data))
    .catch((error) =>
      console.error("Błąd podczas przetwarzania danych:", error)
    );
}

async function createDetails(uid) {


  detailsPanel = document.getElementById("offcanvasRight");

  // updateCounter()

  
  // var details =
  await fillDetails(uid).then((details) => (detailsPanel.innerHTML = details));
  updateCounter();
  m = markers[uid]
  m._popup.close()
  
}

function createFilterKind(kind) {
  
  const el = document.getElementById("kind-filter");

  for (const key in kind) {
    if (kind.hasOwnProperty(key)) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = kind[key];
      el.appendChild(option);
    }
  }
}

function createFilterCategory(categories) {
  const kind_tmp = document.getElementById("kind-filter").value.slice(-3);

  const el = document.getElementById("category-filter");
  el.innerHTML = "<option selected>-</option>";

  for (const key in categories) {
    if (categories.hasOwnProperty(key) & (key.slice(-3) == kind_tmp)) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = categories[key];
      el.appendChild(option);
    }
  }
}

createFilterCategory(categories);
function createFilters(kind) {
  createQ();
  createFilterKind(kind);
}

async function fillDetails(uid) {
  let star = starDeactive;
  let reject = rejectDeactive;
  let url = "https://api.turystyka.gov.pl/registers/open/cwoh/" + uid;
  var js = await getJSON(url);
  var p = js.content;
  status = "None";
  var sav = NaN;
  try {
    sav = savedPoints.find((item) => item.uid == uid);
    status = sav.data.status;
  } catch {}
  if (status === "saved") {
    star = starActive;
  }
  if (status === "rejected") {
    reject = rejectActive;
  }
  doc = document.querySelector(`div[data-uid="${p["uid"]}"]`);
  var udogodnienia_counter = 0;
  www = p["www"];

  if (!(www == null) && (!www.toLowerCase().includes("http"))) {
    www = "https://" + www;
  }
  var coordinates = [
    p["spatialLocation"]["coordinates"][0],
    p["spatialLocation"]["coordinates"][1],
  ];
  if (!(sav == undefined) && !(sav == NaN)) {
    coordinates = [sav.data.coordinates[0], sav.data.coordinates[1]];
  }
  var html = `
  <div class="offcanvas-header">
    <h4 class="offcanvas-title" id="offcanvasRightLabel">Informacje o obiekcie</h4>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    ></button>
    <br>
  </div>
  <div class="offcanvas-body">
    <div>${star}&emsp;&emsp;${reject}</div>
    <br>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <th>Nazwa pola</th>
          <th>Wartość</th>
        </tr>
        <tr>
          <td>Nazwa obiektu</td>
          <td>${p["name"]}</td>
        </tr>
        <tr>
          <td>Rodzaj obiektu</td>
          <td>${kind[p["kind"]]}</td>
        </tr>
        <tr>
          <td>Klasa obiektu</td>
          <td>${categories[p["category"]]}</td>
        </tr>
        <tr>
          <td>Opis</td>
          <td>${p["description"]}</td>
        </tr>
        <tr>
          <td>Lokalizacja</td>
          <td>${p["location"]}</td>
        </tr>
        <tr>
          <td>Właściciel</td>
          <td>${p["ownerName"]}</td>
        </tr>
        <tr>
          <td>Adres</td>
          <td>${p["postalCode"]} ${p["city"]}<br>${p["street"]} ${
    p["streetNumber"]
  }<br>${p["voivodeship"]}</td>
        </tr>
        <tr>
          <td colspan="2">
            <center>
              <a
                href="https://www.google.com/maps?q=${coordinates[0]},${
    coordinates[1]
  }"
                target="_blank"
                class="btn btn-primary btn-sm"
              >Google Maps</a>
              <a
                href="https://pl.mapy.cz/turisticka?q=${coordinates[0]},${
    coordinates[1]
  }&source=coor&ids=1&x=${coordinates[0]}&y=${coordinates[1]}&z=19"
                target="_blank"
                class="btn btn-success btn-sm"
              >Mapy.cz</a>
            </center>
          </td>
        </tr>
        <tr>
          <td>Telefon</td>
          <td>${p["phone"]}</td>
        </tr>
        <tr>
          <td>Strona WWW</td>
          <td><a href="${www}" target="_blank">${p["www"]}</a>
          </td>
        </tr>
        <tr>
          <td>e-mail</td>
          <td>${p["email"]}</td>
        </tr>
        <tr>
          <td>Data rejestracji</td>
          <td>${p["registrationDate"]}</td>
        </tr>
        <tr>
          <td>Ilość pokoi</td>
          <td>${p["housingUnitsNumber"]}</td>
        </tr>
        <tr>
          <td>Budynek zabytkowy</td>
          <td>${p["registryMonuments"]}</td>
        </tr>
      </tbody>
    </table>
    <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Udogodnienia &emsp;<span class="badge text-bg-success"  id="udogodnienia_count">740</span>
            </button>
          </h2>
          <div
            id="collapseOne"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th>Udogodnienie</th>
                    <th>Wartość</th>
                  </tr>
                
                  ${uniqueContent
                    .map((item) => {
                      const questionnaires = p["questionnaires"];
                      const matchingQuestionnaire = questionnaires.find(
                        (q) => q.key === item.key
                      );
                      if (matchingQuestionnaire) {
                        udogodnienia_counter = udogodnienia_counter + 1;
                        return `
                        <tr>
                          <td>${matchingQuestionnaire.name}</td>
                          <td>${matchingQuestionnaire.value}</td>
                        </tr>
                      `;
                      }
                      return "";
                    })
                    .join("")}
           
                  `;

  return html;
}

function updateCounter() {
  var v =
    document.getElementsByClassName("accordion-body")[0].firstElementChild
      .firstElementChild.children.length - 1;
  document.getElementById("udogodnienia_count").textContent = `${v}`;
}

function unmarkReject() {
  reject = document.querySelector("#reject");
  reject.name = "thumbs-down-outline";
  reject.setAttribute("onclick", "markReject()");
  uid = doc.getAttribute("data-uid");
  m = markers[uid]
  m.setIcon(blueIcon)
  var indexToRemove = savedPoints.findIndex((obj) => obj.uid === uid);
  if ((indexToRemove !== -1) & (savedPoints[indexToRemove].moved === true)) {
    savedPoints[indexToRemove].status = "None";
  }
  if ((indexToRemove !== -1) & (savedPoints[indexToRemove].moved === false)) {
    savedPoints.splice(indexToRemove, 1);
  }
}

function markStar() {
  star = document.querySelector("#star");
  star.name = "star";
  star.setAttribute("onclick", "unmarkStar()");
  reject = document.querySelector("#reject");
  reject.name = "thumbs-down-outline";
  reject.setAttribute("onclick", "markReject()");
  uid = doc.getAttribute("data-uid");
  m = markers[uid]
  m.setIcon(goldIcon)
  var point = allMarkersOnTheMap.find((item) => item.uid === uid).spatialLocation.coordinates;
  var indexToRemove = savedPoints.findIndex((obj) => obj.uid === uid);

  if (indexToRemove !== -1) {
    savedPoints[indexToRemove].data.status = "saved";
  } else {
    data = { status: "saved", coordinates: point, moved: false };
    addToSaved(uid, data);
  }
}
function unmarkStar() {
  star = document.querySelector("#star");
  star.name = "star-outline";
  star.setAttribute("onclick", "markStar()");
  uid = doc.getAttribute("data-uid");
  m = markers[uid]
  m.setIcon(blueIcon)
  var indexToRemove = savedPoints.findIndex((obj) => obj.uid === uid);
  if ((indexToRemove !== -1) & (savedPoints[indexToRemove].moved === true)) {
    savedPoints[indexToRemove].status = "None";
  }
  if ((indexToRemove !== -1) & (savedPoints[indexToRemove].moved === false)) {
    savedPoints.splice(indexToRemove, 1);
  }
}

function markReject() {
  star = document.querySelector("#star");
  star.name = "star-outline";
  star.setAttribute("onclick", "markStar()");
  reject = document.querySelector("#reject");
  reject.name = "thumbs-down";
  reject.setAttribute("onclick", "unmarkReject()");
  uid = doc.getAttribute("data-uid");
  m = markers[uid]
  m.setIcon(redIcon)
  var point = allMarkersOnTheMap.find((item) => item.uid === uid).spatialLocation.coordinates;
  var indexToRemove = savedPoints.findIndex((obj) => obj.uid === uid);
  if (indexToRemove !== -1) {
    savedPoints[indexToRemove].data.status = "rejected";
  } else {
    data = { status: "rejected", coordinates: point, moved: false };
    addToSaved(uid, data);
  }
}

async function loadJSON() {
  try {
    const fileInput = document.getElementById("readFile");
    const file = fileInput.files[0]; // Pobierz pierwszy plik

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result); // Parsowanie zawartości pliku JSON
          
          savedPoints = jsonData; // Upewnij się, że savedPoints jest zdefiniowane
          savedPoints.forEach(async (p) => {
            status = p.data.status
            point = p.data.coordinates
            uid = p.uid

            if (status === "saved") {
              setPoint(point, uid, status, p);
            }
          });
        } catch (error) {
          console.error("Błąd podczas parsowania JSON:", error);
        }
      };
      reader.readAsText(file); // Odczytaj plik jako tekst
    } else {
      console.error("Nie wybrano pliku.");
    }
  } catch (error) {
    console.error("Błąd:", error);
  }
}

document.getElementById("saveButton").addEventListener("click", function () {
  // Konwertuj obiekt na JSON
  const json = JSON.stringify(savedPoints, null, 2);

  // Utwórz obiekt Blob z danymi JSON
  const blob = new Blob([json], { type: "application/json" });

  // Utwórz link do pobrania
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "savedPoints.json"; // Nazwa pliku

  // Symuluj kliknięcie w link
  document.body.appendChild(a);
  a.click();

  // Usuń link po pobraniu
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

async function addToSaved(uid, data) {
  let url = "https://api.turystyka.gov.pl/registers/open/cwoh/" + uid;
  var js = await getJSON(url);
  p = js.content;

  p.data = data;

  // Dodanie obiektu p do savedPoints
  savedPoints.push(p);
}


function getParameterByName(name) {
  const url = window.location.href;
  name = name.replace(/[$$$$]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}