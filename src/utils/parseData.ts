import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import rescuedData from "../rescuedByAI.json";

const outputFile = path.join(process.cwd(), "companies.json");
const notIncludedOutputFile = path.join(
  process.cwd(),
  "not_included_companies.json"
);
const companyData: { [key: string]: string } = {};
const notIncludedData: { [key: string]: string } = {};

function isCompany(name: string): boolean {
  const companyIndicators = [
    "LLC",
    "LLP",
    "Inc",
    "Corp",
    "Ltd",
    "Limited",
    "Company",
    "Co",
    "Corporation",
    "COPARTNERS",
    "Incorporated",
    "Group",
    "Holdings",
    "Enterprises",
    "Solutions",
    "Services",
    "Systems",
    "Technologies",
    "International",
    "California",
    "GRAPHICS",
    "&",
    "CONSTRUCTION",
    "ELECTRIC",
    "UNION",
    "TRANSPORT",
    "CENTER",
    "BEAUTY",
    "MOTORS",
    "UNLIMITED",
    "SUPPLY",
    "ACADEMY",
    "HOSPITAL",
    "COMMUNICATIONS",
    "COMMUNITY",
    "FINANCIAL",
    "CONSULTING",
    "L.L.C",
    "L.L.C.",
    "global",
    "FARMS",
    "farm",
    "MARKETPLACE",
    "AND ",
    "SCHOOLS",
  ];
  const regex = new RegExp(`\\b(${companyIndicators.join("|")})\\b|&`, "i");

  return (
    regex.test(name) ||
    name.split(" ").length === 1 ||
    rescuedData.includes(name)
  );
}

function processCSVFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: { [key: string]: string }) => {
        const companyInfo = row["Debtor Name"];
        const email = row["Debtor Email"];

        if (companyInfo && email) {
          const companyName = companyInfo.trim();

          if (!email.endsWith(".de") && !email.endsWith(".at")) {
            if (!companyData[companyName] && isCompany(companyInfo)) {
              companyData[companyName] = email;
            } else {
              if (!notIncludedData[companyName]) {
                notIncludedData[companyName] = email;
              }
            }
          }
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });
}

async function convertCSVtoJSON(): Promise<string | void> {
  const inputFolder = path.join(process.cwd(), "src", "data");

  try {
    const files = fs
      .readdirSync(inputFolder)
      .filter((file: string) => path.extname(file) === ".csv");

    for (const file of files) {
      const filePath = path.join(inputFolder, file);
      console.log(`Processing file: ${filePath}`);
      await processCSVFile(filePath);
    }

    const result = Object.entries(companyData).map(([company, email]) => ({
      name: company.split(",")[0].trim(),
      email,
    }));

    console.log(
      "not included items => ",
      Object.entries(notIncludedData).length
    );

    const notIncludedResult = Object.entries(notIncludedData).map(
      ([company, email]) => ({
        name: company,
        email,
      })
    );

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf8");

    fs.writeFileSync(
      notIncludedOutputFile,
      JSON.stringify(notIncludedResult, null, 2),
      "utf8"
    );

    return outputFile;
  } catch (error) {
    console.error("Error processing CSV files:", error);
  }
}

export { convertCSVtoJSON };
