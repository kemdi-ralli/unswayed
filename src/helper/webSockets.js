import Echo from "laravel-echo";
import Pusher from "pusher-js";

export const echo = new Echo({
  broadcaster: "reverb",
  Pusher,
  key: "0n5bsxhwfgsba24s6gp9",
  // host: "http://10.10.1.2:8000",
  // wsHost: "10.10.1.2",
  // wsPort: 8080,
  // host: 'https://rallitechnologiesunswayed-bfc9a9fscgg5ace7.westus-01.azurewebsites.net',
  // wsHost: 'rallitechnologiesunswayed-bfc9a9fscgg5ace7.westus-01.azurewebsites.net',
    host: 'https://ralli.logodesignagency.co',
    wsHost: 'ralli.logodesignagency.co',
  // wsHost: '95.168.167.68',
    wsPort: 8081,
  forceTLS: false,
  // encrypted: true,
  // auth: {
  //   headers: {
  //     Authorization: `Bearer ${await getToken()}`, // If authentication is required
  //   },
  // },
});


const lok = `Underqualified: Not having the minimum skills, education, or experience required for the position.
Overqualified: Having more experience than the role requires can make an employer question if the candidate will be engaged or if they will leave for a better opportunity.
Insufficient experience: Not having enough experience to back up claims or perform the job effectively.
Cannot meet applicant salary requirements
Not considered after phone screen
Not eligible to work in U.S.
Other:`
