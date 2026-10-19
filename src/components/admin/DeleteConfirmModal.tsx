"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-[#EAE4D8] w-full max-w-md p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#171717]">
              {title}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#EAE4D8]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-[#C4AC8D] text-xs font-semibold text-stone-700 hover:bg-[#FAF8F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
