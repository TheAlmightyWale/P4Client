import type React from "react";
import { Button } from "../button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="text-[var(--color-error)] text-center">
        <span className="text-2xl mb-2 block">⚠️</span>
        <p>{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
