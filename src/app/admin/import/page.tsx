import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import CsvImporter from "@/components/admin/CsvImporter";

export default function AdminImportPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="CSV Bulk Product Import"
        description="Batch upload new footwear listings, parse size/colour variant matrices, and inspect pre-flight validation reports."
      />
      <CsvImporter />
    </div>
  );
}
