export type Result<T> = Success<T> | Failure

export class Success<T> {

    public readonly result: T;

    constructor(result: T | Success<T>) {
        if(Success.isSuccess(result)) this.result = result.result;
        else this.result = result;
    }

    static isSuccess<T>(obj: any): obj is Success<T> {
        return obj != null && typeof obj === 'object' && 'result' in obj;
    }
}

export class Failure {

    public readonly error: string;

    constructor(error: string | Failure) {
        if(Failure.isFailure(error)) this.error = error.error;
        else this.error = error;
    }

    static isFailure(obj: any): obj is Failure {
        return obj != null && typeof obj === 'object' && 'error' in obj;
    }
}
