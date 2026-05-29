let tables = [];
let routes = {};

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

fetch("routes.json")
  .then(response => response.json())
  .then(data => {
    routes = data;
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  resultDiv.innerHTML = "";
  clearHighlightedTable();
  // clearRouteLine();

  if (query === "") {
    displayAllTables();
    return;
  }

  const normalizedQuery = query
    .replace(/^table\s*/i, "")
    .trim();

  const tableMatch = tables.find(tableObj => {
    const tableId = getTableId(tableObj.table).toLowerCase();
    return tableId === normalizedQuery.toLowerCase();
  });

  if (tableMatch) {
    displaySingleTable(tableMatch);
    highlightTable(tableMatch.table);
    // drawRouteToTable(tableMatch.table);
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
    // drawRouteToTable(matches[0].table);
  }
});

document.querySelectorAll(".nav-button").forEach(button => {
  button.addEventListener("click", () => {
    const pageId = button.dataset.page;

    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active-page");
    });

    document.getElementById(pageId).classList.add("active-page");
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

function getTableId(tableName) {
  return tableName.replace(/^Table\s*/i, "").trim();
}

function highlightTable(tableName) {
  const tableId = getTableId(tableName);
  const tableCircle = document.getElementById(`table-${tableId}`);

  if (tableCircle) {
    tableCircle.classList.add("highlighted-table");
  }
}

function clearHighlightedTable() {
  document.querySelectorAll(".highlighted-table").forEach(table => {
    table.classList.remove("highlighted-table");
  });
}

function clearRouteLine() {
  const routeLine = document.getElementById("route-line");

  if (routeLine) {
    routeLine.setAttribute("points", "");
  }
}

function drawRouteToTable(tableName) {
  const routeLine = document.getElementById("route-line");
  if (!routeLine) return;

  const tableId = getTableId(tableName);
  const side = entrance === "right" ? "right" : "left";

  const route = routes[tableId]?.[side];

  if (!route) {
    routeLine.setAttribute("points", "");
    return;
  }

  routeLine.setAttribute(
    "points",
    route.map(point => point.join(",")).join(" ")
  );
}