import api from "../api/axios";

export const login = async (
  formData: { email: string; password: string },
  role: string | null
) => {
  try {
    const response = await api.post(
      "/auth/login",
      { ...formData, role },
      { withCredentials: true } 
    );

    return response.data;
  } catch (error: any) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong" };
  }
};