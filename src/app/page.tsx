import { CompaniesProvider } from "@/components/CompaniesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession } from "@/lib";
import prisma from "@/lib/prisma";
import LandingActions from "@/sections/LandingActions";
import LandingTable from "@/sections/LandingTable";
import { companyFetchAction, loginAction } from "@/utils/actions";
import { itemsPerPage } from "@/utils/consts";

interface HomeI {
  searchParams: { page?: string; status: "new" | "exported"; select: number };
}

const Home = async ({ searchParams }: HomeI) => {
  const page = Number(searchParams.page) >= 1 ? Number(searchParams.page) : 1;

  const companiesData = await companyFetchAction({
    itemsPerPage,
    page: page,
    status: searchParams.status,
  });

  const companies = companiesData.map((item, index) => {
    return {
      ...item,
      checked:
        // take current page item index and add prev page ( searchParams.page -1 ) times items per page
        index + 1 + (Number(searchParams.page || 1) - 1) * itemsPerPage - 1 <
        Number(searchParams.select),
    };
  });

  interface SessionI {
    username: string;
    password: string;
    iat: number;
    exp: number;
  }

  const session: SessionI = await getSession();

  const totalRecords = await prisma.company.count();

  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-geist-sans bg-gray-100">
      {!session && (
        <form
          action={loginAction}
          className="w-full max-w-md mx-auto p-8 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
          <div className="flex flex-col gap-4">
            <Input
              name="username"
              placeholder="Username"
              required
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Submit
            </Button>
          </div>
        </form>
      )}

      {session && (
        <CompaniesProvider companies={companies}>
          <LandingActions />

          <LandingTable
            page={page}
            searchParams={searchParams}
            totalRecords={totalRecords}
          />
        </CompaniesProvider>
      )}
    </div>
  );
};

export default Home;
