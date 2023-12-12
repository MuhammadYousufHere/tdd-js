import { MongooseError } from "mongoose";

/**
 * @param {*} err
 * @returns {Array|string}
 */
function mapErrors(err: any) {
  if (Array.isArray(err)) {
    return err;
  } else if (typeof err === "string") {
    return [err];
  } else if (err.message) {
    return [err.message];
  } else {
    return ["Request error"];
  }
}

// else if (err instanceof MongooseError) {
//   // return Object.values(err.errors).map((e) => e.message);
// }

export default mapErrors;
