export class CustomResponse {
  message: string;
  data: any;
  time: Date;
  error: string;
  success: boolean;
  statusCode: number;

  constructor() {
    this.data = [];
    this.message = '';
    this.error = null;
    this.time = new Date();
  }
}
