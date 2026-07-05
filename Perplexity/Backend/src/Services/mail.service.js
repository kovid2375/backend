import nodemailer from 'nodemailer';
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:process.env.GOOGLE_USER,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
        clientId:process.env.GOOGLE_CLIENT_ID,
    }
})

transporter.verify().then(()=>{console.log("Email transporter is ready to send emails")}).catch((error)=>{console.error("Email transporter is not ready to send emails",error)})

export async function sendEmail({to,subject,text,html}){
    const mailOptions={
        from:process.env.GOOGLE_USER,
        to,
        subject,
        text,
        html
    }
    const details=await transporter.sendMail(mailOptions)
    console.log("Email sent successfully",details)
}
