 //validates email
 export const validateEmail = (emailText)=>{
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(emailText) === false) {
      return false;
    }
    else{
        return true;
    }
    
  };

//validates password
export  const validatePassword = (passwordText)=>{
    //Minimum eight characters, at least one letter and one number
    let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (reg.test(passwordText) === false) {
      return false;
    }
    else{
        return true;
    }
  }

//validates the name - only characters, 2-20 chars.
export const validateName = (name)=>{
    let reg = /^[a-z ,.'-]+$/i;
    if (name === '' || reg.test(name) === false) {
     
        return false;
    } else {
        return true;
    }
}