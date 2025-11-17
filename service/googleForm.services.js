const { throwConflictError, throwNotFoundError } = require("../utils/throwErrors");
const helper = require("../helpers/helper");
const { rsvpRepository } = require("../repository");
const axios = require("axios");
const config = require("../config/index");


class GoogleFormService {
  async #uploadToSheet(reqBody) {
    console.log("Updating google sheet as a background process");

    try {
      await axios.post(
        config.googleSheetBaseURL,
        { ...reqBody, seats: helper.stringifyData(reqBody.seats) },
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      console.log(err.message)
    }
  }

  async submitForm(reqBody, ipAddress) {
    const submission = await this.#getLastSubmissionId();
    console.log("Submitting user data");

    if (!config.AdminDeviceIds.includes(reqBody.deviceFingerprint)) {
      const duplicate = await rsvpRepository.getRsvpByQuery({ email: reqBody?.email, phone: reqBody?.phone });
      if (duplicate) {
        return throwConflictError(`Duplicate submission__${duplicate.deviceFingerprint}`);
      }
    }

    const seats = this.generateSeats(reqBody.guests, submission.seats);
    reqBody.seats = seats;
    reqBody.cardId = submission.id;

    if (ipAddress !== "unknown") {
      reqBody.ip = `${reqBody.deviceFingerprint}_${ipAddress}`;
    }
    const data = await rsvpRepository.create(reqBody);
    if (data) this.#uploadToSheet(reqBody);

    return data;
  }

  async updateInfo(id, reqBody) {
    console.log("Updating user data");
    const duplicate = await rsvpRepository.getRsvpByQuery({ _id: id });
    if (!duplicate) {
      return throwNotFoundError("Record not found");
    }
    return rsvpRepository.update(id, reqBody);
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
  
  async getUserSubmission(deviceId, ipAddress)  {
    console.log("Fetching user submission");
    const data = await rsvpRepository.findOne(deviceId, ipAddress);
    if (!data) return null;
  
    if (!data?.ip && ipAddress !== "unknown") {
      data.ip = `${deviceId}_${ipAddress}`;
      await data.save();
    }
    const { ip, ...rest } = data._doc;
    return rest;
  }

  async #getLastSubmissionId()  {
    console.log("Generating submission Id");
    const startingId = 301;
  
    const lastSubmission = await rsvpRepository.getLastSubmission();
    if (lastSubmission) {
      const seats = lastSubmission.seats;
      const lastId = +(seats?.[seats?.length - 1] || startingId);
  
      return{ id: lastId + 1, seats: `${lastId}` };
    }
  
    return { id: startingId, seats: `${startingId - 1}` };
  }

  async getSubmissions(query) {
    console.log("Getting all submissions");
    const responseObj = await rsvpRepository.find(query);

    return responseObj;
  }

  async deleteRsvp(id) {
    console.log("Deleting record");
    return rsvpRepository.deleteRsvp(id);
  }
}

module.exports = new GoogleFormService();