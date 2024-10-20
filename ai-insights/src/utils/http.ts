import axios from 'axios';

export const getCallList = async () => {
  try {
    const res = await axios(
      'https://0bed-14-143-179-90.ngrok-free.app/get-regular-call-records',
      {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Add the custom header
        },
      },
    );
    return res?.data; // Log the response data
  } catch (error) {
    console.error('Error fetching call records:', error);
  }
};

export const getSurveyCallList = async () => {
  try {
    const res = await axios(
      'https://0bed-14-143-179-90.ngrok-free.app/get-survey-call-records',
      {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Add the custom header
        },
      },
    );
    return res?.data; // Log the response data
  } catch (error) {
    console.error('Error fetching call records:', error);
  }
};

export const initiateSurvey = async (text) => {
  try {
    const res = await axios.post(
      'https://0bed-14-143-179-90.ngrok-free.app/initiate-survey',
      {
        prompt: text, // Pass the text as part of the request body
      },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Add the custom header
        },
      },
    );
    return res?.data; // Return the response data
  } catch (error) {
    console.error('Error initiating survey:', error);
  }
};
