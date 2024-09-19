import axios from "axios";

export const fetchConfigurations = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/configs`
    );
    return response.data.result;
  } catch (error) {
    console.error("Failed to fetch configurations:", error);
  }
};