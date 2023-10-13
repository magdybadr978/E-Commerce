import twilio from "twilio";


const accountSid = 'AC882a7794eabbd02a5995faecce4257f8';
const authToken = '0933f91e0a691d6b800b9f424f4f9679';
const client = twilio(accountSid, authToken);


const sendCode = async(phoneNumber,verifiyCode)=>{
  const message = await client.messages.create({
    body : `your verification code is ${verifiyCode}` ,
    from : process.env.PHONE_NUMBER,
    to : phoneNumber 
  })
  return message.errorMessage ? false : true;
}
export default sendCode