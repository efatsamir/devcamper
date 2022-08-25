import path from 'path';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendGrid_config = {
    name: process.env.SENDGRID_USERNAME,
    email: process.env.SENDGRID_MAIL_FROM,
}


export const email_reset_password = async (user, baseURL, resetToken) => {

    //create resetURL 
    const resetURL = `${baseURL}/api/v1/auth/reset-password/${resetToken}`;
    
    // could be used in text instead of htmlToText(html)
    const message = `Forgot your password? submit a patch request with your new password & passwordConfirm
    to: ${resetURL}.n\ If you didn't forget your password, please ignore this email.`;

    const dirname = path.resolve();
    const html = pug.renderFile(`${dirname}/views/reset-password.pug`, {
      firstName: user.first_name,
      url: resetURL,
      subject: 'Password Reset'
    });
  
 
  const msg = {
    to: user.email,                
    from: sendGrid_config,
    subject: 'Password Reset',
    html,
    text: htmlToText(html)
  }


  try{
     await sgMail.send(msg);
     console.log('email sent');
  } catch(err) {
    console.error(err)
  }
}



export const email_verify_email = async (user, baseURL, jwt) => {

    //create URL 
    const URL = `${baseURL}/api/v1/auth/verify-email/${jwt}`;
    
    // could be used in text in msg instead of htmlToText(html)
    const message = `Please verify your email
    to: ${URL}.n\ If you didn't forget your password, please ignore this email.`;

    const dirname = path.resolve();
    const html = pug.renderFile(`${dirname}/views/confirm-email.pug`, {
      firstName: user.first_name,
      url: URL,
      subject: 'Verify Email'
    });
  
 
  const msg = {
    to: user.email,                
    from: sendGrid_config,
    subject: 'Verify Email',
    html,
    text: htmlToText(html)
  }


  try{
     await sgMail.send(msg);
     console.log('email sent');
  } catch(err) {
    console.error(err)
  }
}


















// class Email {
  
  
    
//   send() {

//     const options = {
//       to: user.email,                
//       from: {
//         name: process.env.SENDGRID_USERNAME,
//         email: process.env.SENDGRID_MAIL_FROM,
//       },
//       subject: sub,
//       text: 'and easy to do anywhere, even with Node.js',
//       html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//     }


//   }


//   verification_email() {
     
//   }


//   reset_password_email() {

//   }





// }
