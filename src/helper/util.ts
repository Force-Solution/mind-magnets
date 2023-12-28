export const constructDateFromUnix = (unix:string | number): Date =>{
    let parsed:number;
    if(typeof unix === "string") parsed = parseInt(unix);
    else parsed = unix;
    return new Date(parsed);
}

export const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateEmail = (email: string) =>/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);