import { Response } from "express"; // Import Response type from Express
import { constants } from "../constants"; // Adjust the path to your constants file

// Define the function type
interface WrapResult {
  (res: Response, data?: any, status?: number): Response;
}

// Wrap Result function
export const wrapResult: WrapResult = (res, data, status = 200) => {
  const response = { ...constants.defaultServerResponse };

  response.message = constants.public.DONE_SUCCESSFULLY;
  response.success = true;
  response.status = status;
  if (data) response.body = data;

  return res.status(response.status).send(response);
};
