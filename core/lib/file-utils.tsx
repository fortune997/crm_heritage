import React from "react"
import { FileText, FileImage, FileArchive, FileCode, File } from "lucide-react"

export function fileTypeIcon(type: string) {
    switch (type.toLowerCase()) {
        case "pdf":
            return <FileText className="w-6 h-6 text-primary" />
    case "jpg":
        case "jpeg":
        case "png":
        case "gif":
            return <FileImage className="w-6 h-6 text-primary" />
    case "zip":
        case "rar":
            return <FileArchive className="w-6 h-6 text-primary" />
    case "js":
        case "ts":
        case "jsx":
        case "tsx":
        case "html":
        case "css":
            return <FileCode className="w-6 h-6 text-primary" />
    case "doc":
        case "docx":
            return <FileText className="w-6 h-6 text-primary" />
    default:
            return <File className="w-6 h-6 text-primary" />
  }
}

