import constants from "../constant";
import Appointment from "./appointment.model";

const save = async (appointment: any, session: any) => {
  if (session) {
    return await appointment.save({ session });
  } else {
    return await appointment.save();
  }
};

const findAllByOrgAndDateAndTimeSlot = async (
  organizationId: any,
  date: any,
  timeSlot: any
) => {
  return await Appointment.find({
    organization: organizationId,
    appointmentDate: date,
    appointmentTime: timeSlot,
    status: {
      $in: [
        constants.WELLKNOWNSTATUS.PENDING,
        constants.WELLKNOWNSTATUS.APPROVE,
      ],
    },
  });
};

const findAllByOrgAndDate = (organization: any, date: any) => {
  return Appointment.find({
    organization,
    appointmentDate: date,
    status: {
      $in: [
        constants.WELLKNOWNSTATUS.PENDING,
        constants.WELLKNOWNSTATUS.APPROVE,
      ],
    },
  });
};

const findAllByAddedBy = (addedBy: any) => {
  return Appointment.find({
    addedBy,
    status: {
      $in: [
        constants.WELLKNOWNSTATUS.PENDING,
        constants.WELLKNOWNSTATUS.APPROVE,
        constants.WELLKNOWNSTATUS.DISABLED,
      ],
    },
  }).populate("organization", "-createdAt -updatedAt -status");
};

const findAllByOrg = (organization: any) => {
  return Appointment.find({
    organization,
    status: {
      $in: [
        constants.WELLKNOWNSTATUS.PENDING,
        constants.WELLKNOWNSTATUS.APPROVE,
        constants.WELLKNOWNSTATUS.DISABLED,
      ],
    },
  })
    .populate("addedBy", "-createdAt -updatedAt -status")
    .populate("organization", "-createdAt -updatedAt -status");
};

const findById = (id: any) => {
  return Appointment.findOne({
    _id: id,
    status: {
      $in: [
        constants.WELLKNOWNSTATUS.PENDING,
        constants.WELLKNOWNSTATUS.APPROVE,
        constants.WELLKNOWNSTATUS.DISABLED,
      ],
    },
  });
};

export default {
  save,
  findAllByOrgAndDateAndTimeSlot,
  findAllByOrgAndDate,
  findAllByAddedBy,
  findAllByOrg,
  findById,
};
