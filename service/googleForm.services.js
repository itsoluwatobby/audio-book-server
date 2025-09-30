const { default: axios } = require("axios");

class GoogleFormService {
  #BaseUrl = "https://script.google.com/macros/s/AKfycbwDA7K7u_3qNSn9JO_dGc002Al2DdM5OEERuZOXRCBZw9ewbXUVnNGcsy8FuM-nUdYIPw/exec";

  async submitForm (reqBody) {
    console.log("Submitting user data");
    const response = await axios.post(
      this.#BaseUrl,
      reqBody,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data;
  }
  
  async getUserSubmission (deviceId)  {
    console.log("Fetching user submission");
    const responseObj = await this.#fetchSubmissions();
    const data = responseObj.find((sub) => sub.DeviceFingerprint === deviceId);

    if (data) return data;
    return null;
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
        responseObj.push(
          {
            [keys[0]]: props[0],
            [keys[1]]: props[1],
            [keys[2]]: props[2],
            [keys[3]]: props[3],
            [keys[4]]: props[4],
            [keys[5]]: props[5],
            [keys[6]]: props[6],
            [keys[7]]: props[7],
          }
        );
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