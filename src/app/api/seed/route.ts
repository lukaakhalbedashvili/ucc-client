// // // /* eslint-disable @typescript-eslint/no-unused-vars */
// import { convertCSVtoJSON } from "@/utils/parseData";

import { NextResponse } from "next/server";

// import prisma from "@/lib/prisma";

export async function GET() {
  //   const jsonFilePath = await convertCSVtoJSON();
  //   async function main() {
  //     if (!jsonFilePath) return;
  //     const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
  //     const companies = JSON.parse(fileContent);
  //     console.log(companies.length);
  //     //   console.log(companies.length, "companies");
  //     // await prisma.company.deleteMany({});
  //     await prisma.company.createMany({
  //       data: companies,
  //       skipDuplicates: true,
  //     });
  //   }
  //   main()
  //     .catch((e) => {
  //       console.error("Error in main function:", e);
  //       process.exit(1);
  //     })
  //     .finally(async () => {
  //       const response = await prisma.$disconnect();
  //       console.log(response);
  //     });
  return NextResponse.json({ message: "Success" });
}
