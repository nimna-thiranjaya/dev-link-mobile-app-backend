import e, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";

import Job from "./job.model";
import userService from "../user/user.service";
import jobService from "./job.service";
import constants from "../constant";

import CustomResponse from "../util/response";
import NotFoundError from "../error/error.classes/NotFoundError";

const PublishJob = async (req: Request, res: Response) => {
  const auth: any = req.auth;
  const body: any = req.body;

  //check if the organization exists
  const user: any = await userService.findById(auth._id);

  if (!user.organization) throw new NotFoundError("Organization not found!");

  const newJob = new Job(body);

  //construct the job object
  newJob.organization = user.organization._id;
  newJob.addedBy = auth._id;

  const session = await startSession();
  let createdJob: any = null;
  try {
    session.startTransaction();

    createdJob = await jobService.save(newJob, session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  CustomResponse(
    res,
    true,
    StatusCodes.CREATED,
    "Job created successfully",
    createdJob
  );
};

const GetAllJobs = async (req: Request, res: Response) => {
  const auth: any = req.auth;

  let jobs: any = null;

  if (auth.role === constants.USER.ROLES.ADMIN) {
    jobs = await jobService.findAllJobsByAddedBy(auth._id);
  } else {
    jobs = await jobService.findAllJobs();
  }

  CustomResponse(res, true, StatusCodes.OK, "Jobs fetched successfully", jobs);
};

export { PublishJob, GetAllJobs };
