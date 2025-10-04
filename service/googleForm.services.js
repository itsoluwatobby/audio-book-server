const { default: axios } = require("axios");
const config = require("../config/index");

class GoogleFormService {
  async submitForm (reqBody) {
    const submissionId = await this.#getLastSubmissionId();
    console.log("Submitting user data");
    const response = await axios.post(
      config.googleSheetBaseURL,
      { ...reqBody, cardId: submissionId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data?.data;
  }
  
  async getUserSubmission (deviceId)  {
    console.log("Fetching user submission");
    const responseObj = await this.#fetchSubmissions();
    const data = responseObj.find((sub) => sub.DeviceFingerprint === deviceId);

    if (data) return data;
    return null;
  }
  
  async #getLastSubmissionId ()  {
    console.log("Generating submission Id");
    const StartingId = 301;
    const responseObj = await this.#fetchSubmissions();
    if (responseObj?.length) {
      const data = responseObj[responseObj?.length - 1];
      return data.CardId + 1;
    }
    return StartingId;
  }
  
  async #fetchSubmissions() {
    const response = await axios.get(
      config.googleSheetBaseURL,
      {
        headers: { "Content-Type": "application/json" }
      },
    );
    const data = response.data;
  
    const keys = data[0];
    const body = data.slice(1);
  
    const responseObj = [];
    
    if (body?.length) {
      for (const props of body) {
        const body = {};
        keys.forEach((key, index) => {
          body[key] = props[index];
        });
        responseObj.push(body);
      }
    }
  
    return responseObj;
  }
  
  async getSubmissions () {
    console.log("Getting all submissions");
    const responseObj = await this.#fetchSubmissions()
    return responseObj;
  }
}

module.exports = new GoogleFormService();