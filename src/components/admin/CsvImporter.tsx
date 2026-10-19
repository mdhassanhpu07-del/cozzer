"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { CsvProductRow, CsvImportResult, CsvValidationError } from "@/types";
import { importProductsFromCsv } from "@/lib/data/products";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function CsvImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<CsvProductRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith(".csv")) {
        setParseError("Please select a valid .csv file.");
        return;
      }
      setFile(selected);
      setParseError(null);
      setResult(null);

      // Parse with PapaParse
      Papa.parse<CsvProductRow>(selected, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setParseError(`CSV parsing error on line ${results.errors[0].row}: ${results.errors[0].message}`);
            return;
          }
          if (results.data.length === 0) {
            setParseError("The uploaded CSV file contains no data rows.");
            return;
          }
          setParsedRows(results.data);
        },
        error: (err) => {
          setParseError(`Failed to read CSV: ${err.message}`);
        },
      });
    }
  };

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    setImporting(true);
    setParseError(null);

    try {
      const res = await importProductsFromCsv(parsedRows);
      setResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import failed";
      setParseError(msg);
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedRows([]);
    setResult(null);
    setParseError(null);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Download Template Banner */}
      <div className="bg-[#FAF8F5] border border-[#EAE4D8] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#9B7B50]" />
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171717]">
              Official COZZER CSV Import Template
            </h3>
          </div>
          <p className="text-xs text-stone-500 font-light max-w-xl leading-relaxed">
            Download our pre-structured template formatted with columns for SKU, name, category, prices, size/colour matrix, and imagery.
          </p>
        </div>

        <a
          href="/templates/cozzer_product_import_template.csv"
          download="cozzer_product_import_template.csv"
          className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#171717] border border-[#C4AC8D] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex-shrink-0"
        >
          <Download className="w-4 h-4 text-[#9B7B50]" />
          <span>Download CSV Template</span>
        </a>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-white border-2 border-dashed border-[#C4AC8D] p-8 text-center space-y-4 rounded">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#EAE4D8] flex items-center justify-center mx-auto text-[#9B7B50]">
          <Upload className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h4 className="font-serif-luxury text-lg text-[#171717]">
            Upload Footwear Catalogue CSV File
          </h4>
          <p className="text-xs text-stone-500 font-light">
            Select a UTF-8 encoded .csv file containing product listings and variant definitions.
          </p>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold cursor-pointer shadow-md transition-all">
            <FileSpreadsheet className="w-4 h-4 text-[#9B7B50]" />
            <span>Select CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {file && (
          <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#EAE4D8] px-3 py-1.5 text-xs text-stone-700">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{file.name}</span>
            <span className="text-stone-400 font-mono">({parsedRows.length} rows detected)</span>
          </div>
        )}
      </div>

      {/* Parse Error Alert */}
      {parseError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Parsed Rows Pre-flight Preview */}
      {parsedRows.length > 0 && !result && (
        <div className="bg-white border border-[#EAE4D8] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[#EAE4D8]">
            <div>
              <h3 className="font-serif-luxury text-lg font-semibold text-[#171717]">
                Pre-Flight Import Preview ({parsedRows.length} Rows)
              </h3>
              <p className="text-xs text-stone-500 font-light">
                Inspect rows before writing to the database.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-stone-600 hover:text-[#171717] px-3 py-1.5 border border-[#EAE4D8]"
              >
                Clear File
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={importing}
                className="inline-flex items-center gap-2 bg-[#171717] hover:bg-[#2A2927] text-white px-5 py-2 text-xs uppercase tracking-widest font-bold shadow-md transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-[#9B7B50]" />
                <span>{importing ? "Importing..." : `Commit Import (${parsedRows.length} Products)`}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 border border-[#EAE4D8]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#EAE4D8] text-stone-700 font-semibold uppercase text-[10px] sticky top-0">
                <tr>
                  <th className="p-2.5">Row</th>
                  <th className="p-2.5">SKU</th>
                  <th className="p-2.5">Product Name</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Price</th>
                  <th className="p-2.5">MRP</th>
                  <th className="p-2.5">Sizes</th>
                  <th className="p-2.5">Colours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D8] font-mono text-[11px]">
                {parsedRows.slice(0, 15).map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="p-2.5 text-stone-400">{idx + 1}</td>
                    <td className="p-2.5 font-bold text-[#171717]">{row.sku}</td>
                    <td className="p-2.5 font-sans font-medium text-stone-800">{row.name}</td>
                    <td className="p-2.5 font-sans text-stone-600">{row.category}</td>
                    <td className="p-2.5 text-[#171717]">₹{row.price}</td>
                    <td className="p-2.5 text-stone-400">{row.mrp ? `₹${row.mrp}` : "—"}</td>
                    <td className="p-2.5 text-stone-500 max-w-xs truncate">{row.sizes}</td>
                    <td className="p-2.5 text-stone-500 max-w-xs truncate">{row.colours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedRows.length > 15 && (
            <p className="text-[11px] text-stone-400 italic">
              Showing first 15 of {parsedRows.length} rows...
            </p>
          )}
        </div>
      )}

      {/* Import Result Summary Report */}
      {result && (
        <div className="bg-white border border-[#EAE4D8] p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D8]">
            <div className="flex items-center gap-3">
              {result.success ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="font-serif-luxury text-lg font-semibold text-[#171717]">
                  Import Execution Report
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  Successfully imported {result.importedCount} products. {result.skippedCount} rows skipped due to validation issues.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#C4AC8D] text-xs font-semibold text-[#171717] hover:bg-[#FAF8F5]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Import Another File</span>
              </button>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1.5 bg-[#171717] text-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#2A2927]"
              >
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Error Table if any */}
          {result.errors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                Validation Errors ({result.errors.length}):
              </span>
              <div className="overflow-x-auto border border-rose-200 bg-rose-50/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-rose-100/60 text-rose-900 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-2">Row</th>
                      <th className="p-2">SKU</th>
                      <th className="p-2">Column</th>
                      <th className="p-2">Error Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-200 text-rose-800 text-[11px]">
                    {result.errors.map((err, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono">{err.row}</td>
                        <td className="p-2 font-mono font-bold">{err.sku || "N/A"}</td>
                        <td className="p-2 font-mono uppercase">{err.column}</td>
                        <td className="p-2">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
