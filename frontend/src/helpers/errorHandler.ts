import axios from "axios";


export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Server error";
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "An unexpected error occurred";
  }
};


