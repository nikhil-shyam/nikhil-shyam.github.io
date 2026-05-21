let tables = [];

fetch("guests.json")
  .then(response => response.json())
  .then(data => {
    tables = data;
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
      <div class="result-card">
        <div class="name">${person.name}</div>
        <div class="table">${person.table}</div>
      </div>
    `;
  });
});