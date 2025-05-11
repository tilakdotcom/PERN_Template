import ApiErrorCode from "../../constants/apiErrorCode";
import { HttpStatusCode } from "../../constants/httpCode";

class ApiError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: ApiErrorCode,
    public success:boolean = false,
  ) {
    super(message);
  }
}


export default ApiError;