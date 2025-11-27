import { useEffect } from "react";

export const useVapiErrorSuppression = () => {
  useEffect(() => {
    const originalError = console.error;

    console.error = (...args) => {
      const errorString = args.join(" ");
      const suppressedErrors = [
        "Meeting has ended",
        "ejection",
        "Meeting ended due to ejection",
      ];

      if (suppressedErrors.some((err) => errorString.includes(err))) {
        return;
      }

      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);
};
