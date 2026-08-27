import { TimeEntry, TProfile } from "@/core/types/type";
import { ReactNode } from "react";




export interface Media {
  type: 'image' | 'video';
  src: string;
}





export interface DragDropFileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  type: "image" | "document";
  // label: string;
  accept: string;
  helpText: string;
}
