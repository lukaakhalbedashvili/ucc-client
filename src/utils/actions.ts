"use server";
import { login } from "@/lib";
import prisma from "@/lib/prisma";

const statusChangeAction = async (
  mark: "new" | "exported",
  selectedIds: number[]
) => {
  "use server";

  await prisma.company.updateMany({
    where: {
      id: {
        in: selectedIds,
      },
    },
    data: {
      status: mark,
    },
  });

  const updatedCompanies = await prisma.company.findMany({
    where: {
      id: {
        in: selectedIds,
      },
    },
  });

  return updatedCompanies;
};

const companyFetchAction = async ({
  itemsPerPage,
  page,
  status,
}: {
  itemsPerPage: number;
  page: number;
  status: "new" | "exported";
}) => {
  "use server";

  const data = await prisma.company.findMany({
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
    where: {
      status,
    },
  });

  return data;
};

const deleteCompanyAction = async (idsToDelete: number[]) => {
  await prisma.company.deleteMany({
    where: {
      id: {
        in: idsToDelete,
      },
    },
  });
};

const exportDataAction = async ({ amount }: { amount: number }) => {
  // Fetch the number of companies with status 'new' to be exported
  const companiesToExport = await prisma.company.findMany({
    take: amount,
    where: {
      status: "new",
    },
  });

  const idsToUpdate = companiesToExport.map((company) => company.id);
  const data = await statusChangeAction("exported", idsToUpdate);

  return data;
};

export async function loginAction(formData: FormData) {
  // Call your actual login logic
  await login(formData);
}

export {
  companyFetchAction,
  statusChangeAction,
  deleteCompanyAction,
  exportDataAction,
};
