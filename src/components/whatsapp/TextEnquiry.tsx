import dateFormat from "dateformat";

export const TextEnquiry = (
  name: string,
  programs: string,
  gymId: string,
  type: string
): string => {
  const firstname = name.split(" ")[0];
  const today = dateFormat(new Date(), "dd-mmm, Y");
  return type === "admission"
    ? `Dear ${firstname},
  
Welcome to Mohan's Planet!
To start and regularize your membership for our ${programs} session,
please complete the registration form through the link below

https://www.admin-app.in/gym/${gymId}/importForm

If you have any questions, feel free to reach out to us on 7710049470.
We're excited to have you onboard and look forward to seeing you in the next session!


Best regards,
Mohan's Planet`
    : `Dear ${firstname},

Welcome to Mohan's Martial Arts & Fitness Planet! With 38 years of experience in Martial Arts and Fitness, we offer a wide range of programs for individuals of all ages. We truly appreciate your interest in our ${programs}, and we're thrilled to have you on board.

To help you experience our training firsthand, we're pleased to confirm your complimentary trial session of ${programs} on ${today} at 7:00 AM
To ensure a smooth start, please arrive 5 minutes early. Kindly bring a water bottle, a towel, and wear comfortable workout attire.  

We look forward to welcoming you to the sessions! If you have any questions, feel free to reach out to us on 7710049470.  


Best regards,
Mohan's Planet`;
};
