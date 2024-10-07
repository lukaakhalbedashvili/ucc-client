"use client";

import { useCompaniesContext } from "@/components/CompaniesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  statusChangeAction,
  deleteCompanyAction,
  exportDataAction,
} from "@/utils/actions";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { convertToCSV, downloadCSV } from "@/utils/export";

const LandingActions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectInputRef = useRef<HTMLInputElement>(null);
  const exportInputRef = useRef<HTMLInputElement>(null);
  const markInputRef = useRef<"new" | "exported" | null>(null);
  const { companiesState, setCompaniesState } = useCompaniesContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectedCompanies = companiesState.filter((company) => company.checked);
  const hasSelectedCompanies = selectedCompanies.length > 0;

  const handleQueryChange = ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => {
    const currentQuery = searchParams.toString();
    const newParams = new URLSearchParams(currentQuery);
    newParams.set(key, value);
    router.push(`?${newParams.toString()}`);
  };

  const handleBulkDelete = async () => {
    const idsToDelete = selectedCompanies.map((company) => company.id);

    await deleteCompanyAction(idsToDelete);

    setCompaniesState((prevState) =>
      prevState.filter((company) => !idsToDelete.includes(company.id))
    );

    router.refresh();
    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-around">
      <div className="flex items-center">
        <h2 className="font-semibold mr-5">Mark as</h2>

        <Select
          onValueChange={async (value: "new" | "exported") =>
            (markInputRef.current = value)
          }
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exported">Exported</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="ml-2"
          onClick={async () => {
            if (markInputRef?.current) {
              await statusChangeAction(
                markInputRef?.current,
                companiesState
                  .filter((item) => item.checked)
                  .map((item2) => item2.id)
              );
              router.refresh();
            }
          }}
        >
          Mark
        </Button>
      </div>

      <div className="flex items-center">
        <h2 className="font-semibold mr-5 whitespace-nowrap">
          Filter by status
        </h2>

        <Select
          onValueChange={(value) => {
            handleQueryChange({ key: "status", value });
          }}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="exported">Exported</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-fit max-w-sm items-center space-x-2">
        <Input
          className="w-25"
          type="number"
          placeholder={searchParams.get("select") || "5"}
          ref={selectInputRef}
        />
        <Button
          type="submit"
          onClick={() =>
            selectInputRef?.current?.value &&
            handleQueryChange({
              key: "select",
              value: selectInputRef?.current?.value,
            })
          }
        >
          select
        </Button>
      </div>

      <div className="flex w-fit max-w-sm items-center space-x-2">
        <Input className="w-25" type="number" ref={exportInputRef} />
        <Button
          onClick={async () => {
            const data =
              exportInputRef?.current?.value &&
              (await exportDataAction({
                amount: Number(exportInputRef?.current?.value),
              }));

            if (data && data.length) {
              setCompaniesState((prevState) =>
                prevState.map((company) => {
                  const exportedCompany = data.find(
                    (item) => item.id === company.id
                  );
                  if (exportedCompany) {
                    return {
                      ...company,
                      status: "exported",
                    };
                  }
                  return company;
                })
              );
              const csvData = convertToCSV(data);
              downloadCSV(csvData, "exported_data");
            }
          }}
        >
          export
        </Button>
      </div>

      {hasSelectedCompanies && (
        <div className="flex items-center">
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Selected</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Are you sure you want to delete
                  the selected companies?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleBulkDelete}>
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default LandingActions;
