import type React from "react";

interface FileListProps {
  files: string[];
  label: string;
  labelClassName?: string;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  label,
  labelClassName,
}) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-2">
      <h4
        className={
          labelClassName ||
          "text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1"
        }
      >
        {label} ({files.length})
      </h4>
      <ul className="space-y-0.5">
        {files.map((file, i) => (
          <li
            key={i}
            className="text-sm font-mono text-[var(--color-text-secondary)] truncate"
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};
