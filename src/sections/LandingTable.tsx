"use client";

import { useState } from "react";
import { useCompaniesContext } from "@/components/CompaniesContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { deleteCompanyAction } from "@/utils/actions";
import { Trash } from "lucide-react";
import { itemsPerPage } from "@/utils/consts";

interface LandingTableProps {
  page: number;
  searchParams: { page?: string; status: "new" | "exported" };
  totalRecords: number;
}

const LandingTable = ({
  page,
  searchParams,
  totalRecords,
}: LandingTableProps) => {
  const buildQueryString = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    return `?${params.toString()}`;
  };

  const { companiesState, setCompaniesState } = useCompaniesContext();
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (id: number) => {
    await deleteCompanyAction([id]);
    setCompaniesState((prevState) =>
      prevState.filter((company) => company.id !== id)
    );
    setIsDialogOpen(false);
  };

  console.log(totalRecords);

  return (
    <>
      <div className="flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-1/4">Company</TableHead>
              <TableHead className="text-center w-1/4">Email</TableHead>
              <TableHead className="text-center w-1/4">Status</TableHead>
              <TableHead className="text-center w-1/4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companiesState.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-center">
                  {item.name}
                </TableCell>
                <TableCell className="text-center">{item.email}</TableCell>
                <TableCell className="text-center">{item.status}</TableCell>
                <TableCell className="flex items-center justify-center">
                  <Checkbox
                    checked={item.checked}
                    onClick={() => {
                      setCompaniesState((prevState) =>
                        prevState.map((company) =>
                          company.id === item.id
                            ? { ...company, checked: !company.checked }
                            : company
                        )
                      );
                    }}
                    className="mr-3"
                  />
                  <Trash
                    width={20}
                    strokeWidth={1}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCompanyId(item.id);
                      setIsDialogOpen(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this company?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedCompanyId) {
                    handleDelete(selectedCompanyId);
                  }
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-auto">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={buildQueryString(page - 1)} />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink className="w-fit">{`${page} of ${Math.ceil(
                totalRecords / itemsPerPage
              )}`}</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext href={buildQueryString(page + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default LandingTable;
