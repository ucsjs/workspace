
export interface IFileInfo {
    name: string;
    path: string;
    filename: string;
    isDirectory: boolean;
    isFile: boolean;
    pathHash: string;
    sha256: string;
    lastModified: Date;
    ext?: string;
    mime?: string;
    hasMetadata?: boolean;
    language?: string;
}