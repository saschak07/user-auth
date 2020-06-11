const sgMail = require('@sendgrid/mail')


const sendWelcomeMessage = async(user)=> {
    try{
        await sgMail.setApiKey('abcd');
        await sgMail.send({
        to: user.email,
        from: 'hotelluxury872@gmail.com',
        subject: `Welcome ${user.name} to my first node application!!!`,
        html: '<strong>Hojapani I love you</strong>',
      })
    }catch(e){
        console.log(e)
    }
}

module.exports = sendWelcomeMessage
