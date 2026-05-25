import axios from 'axios';

const API_URL = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=12&mode=detailed';

export const fetchUpcomingLaunches = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching launches:", error);
    throw error;
  }
};