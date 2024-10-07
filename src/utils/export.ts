const convertToCSV = (
  data: {
    name: string;
    email: string;
  }[]
) => {
  const headers = "name,email";
  const rows = data.map((row) => `${row.name},${row.email}`).join("\n"); // Join the rows with new lines

  return `${headers}\n${rows}`; // Combine headers and rows
};

const downloadCSV = (csvData: string, filename: string) => {
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up the DOM
};

export { downloadCSV, convertToCSV };
