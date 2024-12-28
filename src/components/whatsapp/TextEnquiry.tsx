export const TextEnquiry = (name: string, programs: string): string => {
  const firstname = name.split(" ")[0];
  return `Hi ${firstname},
  
Thank you for your interest in our ${programs} class!
  
Here are our batch timings - 
*Monday, Wednesday, Friday*:
- 8:00 AM - 9:00 AM
- 8:00 PM - 9:00 PM
  
We look forward to having you join us!`;
};
