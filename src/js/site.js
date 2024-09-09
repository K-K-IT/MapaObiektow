var uniqueContent
var udogodnienia_counter
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

function createDetails(data) {
  var dane = data["content"];
  var popup = document.querySelector(`div[data-uid="${dane["uid"]}"]`);
  // Sprawdzenie, czy element ma atrybut 'alt'
  // Sprawdzenie, czy znaleziono element
  if (popup) {
    var www = dane["www"];
    try {
      if (!www.includes("https://") & (www.length > 0)) {
        www = "https://" + dane["www"];
      }
    } catch {}

    detailsPanel = document.getElementById("offcanvasRight");

    popup.innerHTML = `<b>${dane["name"]}</b><br>
    Rodzaj obiektu: ${kind[dane["kind"]]}<br>
    Klasyfikacja obiektu: ${categories[dane["category"]]} <br>
    Adres: ${dane["city"]} ${dane["postalCode"]} <br>
    ${dane["street"]} ${dane["streetNumber"]} <br>
    Telefon: ${dane["phone"]}<br>
    WWW: <a href=${www} target="_blank">${www}</a><br>
    e-mail: ${dane["email"]}<br>
    <button
      class="button  text-bg-light btn-lg"
      data-bs-toggle="offcanvas"
      href="#offcanvasRight"
      role="button"
      aria-controls="offcanvasRight"
      onclick="updateCounter()"
    >
      Szczegóły
    </button>
    `;
    detailsPanel.innerHTML = fillDetails(data);
  } else {
    console.log("Nie znaleziono elementu div z data-uid:", uid);
  }
}

// function createFilterKind() {
//   console.log(kind)
//   const el = document.getElementById("kind-filter");
//   // Wyczyść istniejące opcje
//   for (const key in kind) {
//     if (kind.hasOwnProperty(key)) {
//       const option = document.createElement("option");
//       option.value = key;
//       option.textContent = kind[key];
//       el.appendChild(option);
//     }
//   }
// }

function createFilterKind(kind) {
  console.log(kind);
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

function fillDetails(data) {
  html = `
<div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasRightLabel">Informacje o obiekcie</h5>
        <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>      </div>
      <div class="offcanvas-body">
      <table class="table table-bordered">
        <tbody>
               
          <tr>
            <th>Nazwa pola</th>
            <th>Wartość</th>
          </tr>
             <tr>
            <td>Nazwa obiektu</td>
            <td>${data["content"]["name"]}</td>
          </tr>
          <tr>
            <td>Rodzaj obiektu</td>
            <td>${kind[data["content"]["kind"]]}</td>
          </tr>
          <tr>
            <td>Klasa obiektu</td>
            <td>${categories[data["content"]["category"]]}</td>
          </tr>

          <tr>
            <td>Opis</td>
            <td>
            ${data["content"]["description"]}
            </td>
          </tr>
          <tr>
            <td>Lokalizacja</td>
            <td>
            ${data["content"]["location"]}
            </td>
          </tr>
          <tr>
            <td>Właściciel</td>
            <td>
            ${data["content"]["ownerName"]}
            </td>          </tr>
          <tr>
            <td>Adres</td>
            <td>  ${data["content"]["postalCode"]} ${data["content"]["city"]}<br>  ${data["content"]["street"]}  ${data["content"]["streetNumber"]}<br>  ${data["content"]["voivodeship"]}</td>
          </tr>
          <tr>
            <td colspan="2">
              <center>
                <a
                  href="https://www.google.com/maps?q=${data["content"]["spatialLocation"]["coordinates"][0]},${data["content"]["spatialLocation"]["coordinates"][1]}"
                  target="_blank"
                  class="btn btn-primary btn-sm"
                  >Google Maps</a
                >
                <a
                  href="https://pl.mapy.cz/turisticka?q=${data["content"]["spatialLocation"]["coordinates"][0]},${data["content"]["spatialLocation"]["coordinates"][1]}&source=coor&ids=1&x=${data["content"]["spatialLocation"]["coordinates"][0]}&y=${data["content"]["spatialLocation"]["coordinates"][1]}&z=19"
                  

                  target="_blank"
                  class="btn btn-success btn-sm"
                  >Mapy.cz</a
                >
              </center>
            </td>
          </tr>
          <tr>
            <td>Telefon</td>
            <td> ${data["content"]["phone"]}</td>
          </tr>
          <tr>
            <td>Strona WWW</td>
            <td>
              
                  ${data["content"]["www"]}
              
            </td>
          </tr>
          <tr>
            <td>e-mail</td>
            <td>  ${data["content"]["email"]}</td>
          </tr>
          <tr>
            <td>Data rejestracji</td>
            <td>  ${data["content"]["registrationDate"]}</td>
          </tr>
          <tr>
            <td>Ilość pokoi</td>
            <td>  ${data["content"]["housingUnitsNumber"]}</td>
          </tr>
          <tr>
            <td>Budynek zabytkowy</td>
            <td>  ${data["content"]["registryMonuments"]}</td>
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
              Udogodnienia &emsp;<span class="badge text-bg-success" align="right" id="udogodnienia_count">740</span>
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
                  ${udogodnienia_counter = 0}
                  ${uniqueContent.map((item) => {
                    
                    const questionnaires = data['content']['questionnaires']
                    const matchingQuestionnaire = questionnaires.find((q) => q.key === item.key);
                    if (matchingQuestionnaire) {
                      udogodnienia_counter = udogodnienia_counter + 1
                      return `
                        <tr>
                          <td>${matchingQuestionnaire.name}</td>
                          <td>${matchingQuestionnaire.value}</td>
                        </tr>
                      `;
                      
                    }
                    return '';
                  }).join('')}
                  </div>
                  `;

  return html;
}

function updateCounter(){
  document.getElementById("udogodnienia_count").textContent = udogodnienia_counter
}