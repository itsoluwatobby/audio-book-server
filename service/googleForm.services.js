const { throwConflictError, throwNotFoundError } = require("../utils/throwErrors");
const helper = require("../helpers/helper");
const { rsvpRepository } = require("../repository");
const { RSVP } = require("../models");


class GoogleFormService {
  async submitForm(reqBody) {
    const submission = await this.#getLastSubmissionId();
    console.log("Submitting user data");
    const duplicate = await rsvpRepository.getRsvpByQuery({ email: reqBody?.email, phone: reqBody?.phone });
    if (duplicate) {
      return throwConflictError(`Duplicate submission__${duplicate.deviceFingerprint}`);
    }

    const seats = this.generateSeats(reqBody.guests, submission.seats);
    reqBody.seats = seats;
    reqBody.cardId = submission.id;
    return rsvpRepository.create(reqBody);
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
  
  async getUserSubmission(deviceId)  {
    console.log("Fetching user submission");
    const data = await rsvpRepository.findOne(deviceId);
    if (!data) return null;
    return data;
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
  
    return { id: startingId, seats: `${startingId}` };
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