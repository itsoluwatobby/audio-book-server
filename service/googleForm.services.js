const { default: axios } = require("axios");
const config = require("../config/index");
const { throwConflictError } = require("../utils/throwErrors");
const helper = require("../helpers/helper");

class GoogleFormService {
  async submitForm (reqBody) {
    const submission = await this.#getLastSubmissionId();
    console.log("Submitting user data");
    const duplicate = await this.#getDuplicate(reqBody.email, reqBody.phone);
    if (duplicate) {
      return throwConflictError(`Duplicate submission__${duplicate.DeviceFingerprint}`);
    }

    const seats = this.generateSeats(reqBody.guests, submission.seats);
    reqBody.seats = helper.stringifyData(seats);
    reqBody.cardId = submission.id;
    const response = await axios.post(
      config.googleSheetBaseURL,
      { ...reqBody },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data?.data;
  }

  generateSeats(guests, prevSeats) {
    console.log("Generating seats");
    const seats = prevSeats?.split(",");
    let lastSeat = +(seats?.[seats?.length - 1] || 0);
    
    const newSeats = [];
    Array.from({ length: guests }).forEach(() => {
      lastSeat += 1;
      newSeats.push(lastSeat);
    });
    return newSeats;
  }
  
  async getUserSubmission (deviceId)  {
    console.log("Fetching user submission");
    const responseObj = await this.#fetchSubmissions();
    const data = responseObj.find((sub) => sub.DeviceFingerprint === deviceId);

    if (data) return data;
    return null;
  }
  
  async #getDuplicate (email, phoneNumber)  {
    console.log("Getting duplicate submission");
    const responseObj = await this.#fetchSubmissions();
    if (responseObj?.length) {
      const data = responseObj.find((sub) => sub.Email === email || sub.Phone === phoneNumber);
      if (data) return data;
      return null;
    }
    return null;
  }

  async #getLastSubmissionId ()  {
    console.log("Generating submission Id");
    const startingId = 301;
  
    const responseObj = await this.#fetchSubmissions();
    if (responseObj?.length) {
      const data = responseObj[responseObj?.length - 1];
      const seats = helper.jsonParseValue(data.Seats) ?? [];
      const lastId = +(seats?.[seats?.length - 1] || startingId);
  
      return{ id: lastId + 1, seats: `${lastId}` };
    }
  
    return { id: startingId, seats: `${startingId}` };
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