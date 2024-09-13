var categories
let kind;
let category;
var allMarkersOnTheMap = []



async function getJSON(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Błąd podczas ładowania pliku JSON:", error);
      throw error; // Rzuć błąd dalej, aby można go było obsłużyć w wywołującej funkcji
    });
}

// Funkcja do tworzenia checkboxów na podstawie danych JSON

// Przykład użycia obu funkcji

async function sendCheckedValues(e) {
  // Pobierz wszystkie zaznaczone checkboxy udogodnienia
  const checkedCheckboxesUdogodnienia = document
    .getElementById("udogodnienia")
    .querySelectorAll('#udogodnienia input[type="checkbox"]:checked');

  // Pobierz wartości key z zaznaczonych checkboxów
  const checkedKeysUdogodnienia = [];
  for (let index = 0; index < checkedCheckboxesUdogodnienia.length; index++) {
    checkedKeysUdogodnienia.push(checkedCheckboxesUdogodnienia[index].value);
  }

  // Utwórz adres URL z pobranymi kluczami
  var apiUrl = `https://api.turystyka.gov.pl/registers/open/cwoh?questionnaires=${checkedKeysUdogodnienia.join(
    ","
  )}&size=99999`;
  k = document.getElementById("kind-filter").value
  if (!(k == "-")){
    apiUrl = apiUrl + `&kind=${k}`
  }
  c = document.getElementById("category-filter").value
  if (!(c == "-")){
    apiUrl = apiUrl + `&category=${c}`
  }
  v = document.getElementById("voivodeship-filter").value
  if (!(v == "Polska")){
    apiUrl = apiUrl + `&voivodeship=${v}`
  }

  try {
    // Pobierz dane z API asynchronicznie
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Tutaj możesz przetwarzać dane pobrane z API
    return data; // Zwróć dane
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
    return null; // Możesz zwrócić null lub inny wskaźnik błędu
  }
}

sendCheckedValues(event).then((data) => {
  if (data) {
    // Tutaj masz dostęp do danych
    // console.log("Dane:", data);
    // Możesz dalej pracować na danych
  }
});

function getData(url) {
  // const url1 = 'https://api.turystyka.gov.pl/registers/open/cwoh/filters/questionnaires';
  fetch(url)
    .then((res) => res.json())
    .then((out) => (data1 = out))
    .catch((err) => console.log(err));
}


function mapKind(out) {
  const dictionary = out.content.reduce((acc, item) => {
    acc[item.code] = item.value;
    return acc;
  }, {});
  return dictionary; // Zwróć utworzony słownik
}

async function getKinds() {
  try {
    const out = await getJSON("https://api.turystyka.gov.pl/administration/open/dictionaries/RCWOH/values");
    kind = mapKind(out); // Uzyskaj słownik z mapKind
    return kind
  } catch (error) {
    console.error("Błąd w getKinds:", error);
  }
}



function mapCategory(out) {
  const dictionary = out.content.reduce((acc, item) => {
    acc[item.code] = item.value;
    return acc;
  }, {});
  return dictionary; // Zwróć utworzony słownik
}

async function getCategories() {
  try {
    const out = await getJSON("https://api.turystyka.gov.pl/administration/open/dictionaries/KCWOH/values");
    categories = mapCategory(out); // Uzyskaj słownik z mapKind
    return categories
  } catch (error) {
    console.error("Błąd w getKinds:", error);
  }
}

