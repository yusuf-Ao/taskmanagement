
export class CustomResponse {
    
    message: string;
    data: any;
    time: Date;
    error: string;
    success: boolean;

    constructor() {
        this.data = [];
        this.success = true;
        this.message = 'success';
        this.error = null;
        this.time = new Date();
    }

}