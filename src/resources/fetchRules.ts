import axios from "axios";

export const fetchRules = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/rules');
 
    return  response.data.result;
  } catch (error) {
    console.error('Error fetching nodes:', error);
  }
};