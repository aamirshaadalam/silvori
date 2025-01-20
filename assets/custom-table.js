document.addEventListener('DOMContentLoaded', function () {
  // Find the table section
  const tableSection = document.querySelector('.custom-table-section');

  if (tableSection) {
    // Get body data
    const tableBodyData = tableSection.getAttribute('data-table-body');

    // Find the table body
    const tableBody = tableSection.querySelector('.custom-table tbody');

    if (tableBodyData && tableBody) {
      // Split rows by newline
      const rows = tableBodyData.split('\n');

      rows.forEach((row) => {
        // Skip empty rows
        if (!row.trim()) return;

        // Split cells by comma
        const cells = row.split(',');

        // Create a table row
        const tableRow = document.createElement('tr');

        // Create cells for the row
        cells.forEach((cell) => {
          const tableCell = document.createElement('td');
          tableCell.textContent = cell.trim(); // Trim whitespace
          tableRow.appendChild(tableCell);
        });

        // Append the row to the table body
        tableBody.appendChild(tableRow);
      });
    } else {
      console.error('Missing or invalid table body data.');
    }
  }
});
