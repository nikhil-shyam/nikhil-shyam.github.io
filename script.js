let tables = [];

fetch("guests.json")
  .then(response => response.json())
  .then(data => {
    tables = data;
    displayAllTables();
  })
  .catch(error => {
    console.error("Error loading guest list:", error);
  });

const searchInput = document.getElementById("search");
const resultDiv = document.getElementById("result");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  resultDiv.innerHTML = "";

  if (query === "") {
    displayAllTables();
    return;
  }

  const matches = [];

  tables.forEach(tableObj => {
    tableObj.guests.forEach(guest => {
      if (guest.toLowerCase().includes(query)) {
        matches.push({
          name: guest,
          table: tableObj.table
        });
      }
    });
  });

  if (matches.length === 0) {
    resultDiv.innerHTML = `
      <div class="no-results">
        No guest found.
      </div>
    `;
    return;
  }

  matches.forEach(person => {
    resultDiv.innerHTML += `
      <div class="lookup-card">
        <div class="lookup-name">${person.name}</div>
        <div class="lookup-table">${person.table}</div>
      </div>
    `;
  });
});

function displayAllTables() {
  resultDiv.innerHTML = "";

  tables.forEach(tableObj => {
    const guestList = tableObj.guests
      .map(guest => `<div>${guest}</div>`)
      .join("");

    resultDiv.innerHTML += `
      <div class="table-card">
        <div class="table-card-header">${tableObj.table}</div>
        <div class="table-card-body">
          ${guestList}
        </div>
      </div>
    `;
  });
}