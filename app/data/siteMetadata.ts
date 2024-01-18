const randomBetween1And3 = Math.floor(Math.random() * 3) + 1;
const prodDomain =
  'https://bc-com-git-off-to-vercel-rem-4ce02d-benjamins-projects-ca576fe6.vercel.app';
export const siteMetadata = {
  title: 'BenjaminCharity.com',
  description:
    'Engineering leader & team builder at high-growth startups & scale-ups.',
  domain: 'www.benjamincharity.com',
  url: 'https://www.benjamincharity.com',
  image: `${prodDomain}/images/website${randomBetween1And3}.png`,
  author: 'Benjamin Charity',
  twitter: 'benjamincharity',
  github: 'benjamincharity',
  linkedin: 'benjamincharity',
  email: 'ben.charity@hey.com',
  professionalTitle:
    'Engineering leader & team builder at high-growth startups & scale-ups.',
  aboutMe:
    'My focus is on creating and refining systems that not only deliver a cohesive user experience and improved accessibility but also significantly boost the return on investment for business units focused on developing feature-rich solutions and addressing user needs.',
  logo: '/images/pwa/manifest-icon-512.png',
  logo_dark_mode: '/images/pwa/manifest-icon-512.png',
};
