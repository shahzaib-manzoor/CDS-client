import axios from "axios";

export const fetchRules = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/rules`);
 
    return  response.data.result;
  } catch (error) {
    console.error('Error fetching nodes:', error);
  }
};