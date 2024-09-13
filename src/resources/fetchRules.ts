import axios from "axios";

export const fetchRules = async (status:string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/rules?status=${status}`);
 
    return  response.data.result;
  } catch (error) {
    console.error('Error fetching nodes:', error);
  }
};