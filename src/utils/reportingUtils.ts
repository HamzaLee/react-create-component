function reportError(error:Error) {
    if (error) { 
        throw error; 
    }   
}   

export { reportError } ;