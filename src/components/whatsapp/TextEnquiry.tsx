export const TextEnquiry = (name: string, programs: string): string => {
  const firstname = name.split(" ")[0];
  return `Dear ${firstname},
  
Welcome to Mohan's Planet!
To start and regularize your membership for our ${programs} session,
please complete the registration form through the link below

https://www.admin-app.in/gym/TITANS/importForm

If you have any questions, don't hesitate to reach out to us on 7710049470.
We're excited to have you onboard and look forward to seeing you in the next session!


Best regards,
Mohan's Planet`;
};
