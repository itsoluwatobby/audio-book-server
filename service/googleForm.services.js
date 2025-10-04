const { default: axios } = require("axios");

class GoogleFormService {
  #BaseUrl = "https://script.google.com/macros/s/AKfycbwDA7K7u_3qNSn9JO_dGc002Al2DdM5OEERuZOXRCBZw9ewbXUVnNGcsy8FuM-nUdYIPw/exec";

  async submitForm (reqBody) {
    const submissionId = await this.#getLastSubmissionId();
    console.log("Submitting user data");
    const response = await axios.post(
      this.#BaseUrl,
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
      this.#BaseUrl,
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