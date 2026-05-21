let tables = [];

const searchInput = document.getElementById("search");
const resultDiv = document.getElementById("result");

const params = new URLSearchParams(window.location.search);
const entrance = params.get("entrance");

if (entrance === "left") {
  document
    .getElementById("left-door")
    .classList.add("active-door");
}

if (entrance === "right") {
  document
    .getElementById("right-door")
    .classList.add("active-door");
}

fetch("guests.json")
  .then(response => response.json())
  .then(data => {
    tables = data;
    displayAllTables();
  })
  .catch(error => {
    console.error("Error loading guest list:", error);
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  resultDiv.innerHTML = "";
  clearHighlightedTable();

  if (query === "") {
    displayAllTables();
    return;
  }

  if (/^\d+$/.test(query)) {
    const tableMatch = tables.find(tableObj => {
      const tableNumber = getTableNumber(tableObj.table);
      return tableNumber === query;
    });

    if (tableMatch) {
      displaySingleTable(tableMatch);
      highlightTable(tableMatch.table);
    } else {
      resultDiv.innerHTML = `
        <div class="no-results">
          No table found.
        </div>
      `;
    }

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

  if (matches.length === 1) {
    highlightTable(matches[0].table);
  }
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

function displaySingleTable(tableObj) {
  const guestList = tableObj.guests
    .map(guest => `<div>${guest}</div>`)
    .join("");

  resultDiv.innerHTML = `
    <div class="table-card">
      <div class="table-card-header">${tableObj.table}</div>
      <div class="table-card-body">
        ${guestList}
      </div>
    </div>
  `;
}

function getTableNumber(tableName) {
  return tableName.replace(/\D/g, "");
}

function highlightTable(tableName) {
  const tableNumber = getTableNumber(tableName);
  const tableCircle = document.getElementById(`table-${tableNumber}`);

  if (tableCircle) {
    tableCircle.classList.add("highlighted-table");
  }
}

function clearHighlightedTable() {
  document.querySelectorAll(".highlighted-table").forEach(table => {
    table.classList.remove("highlighted-table");
  });
}