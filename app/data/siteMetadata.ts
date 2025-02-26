export const CLOUDINARY_ACCOUNT = 'da2exoho7';

export const siteMetadata = {
  title: 'BenjaminCharity.com',
  description:
    'Engineering leader & team builder at high-growth startups & scale-ups.',
  domain: 'www.benjamincharity.com',
  url:
    process.env.NODE_ENV === 'production'
      ? 'https://www.benjamincharity.com'
      : 'http://localhost:3000',
  image: `/images/pwa/apple-splash-2732-2048.jpg`,
  articleImagePath: `https://res.cloudinary.com/${CLOUDINARY_ACCOUNT}/image/upload/f_auto,q_auto,w_auto,dpr_auto,c_scale,w_2560/article-content/`,
  articleThinImagePath: `https://res.cloudinary.com/${CLOUDINARY_ACCOUNT}/image/upload/f_auto,q_auto,w_auto,dpr_auto,c_scale,w_2560,ar_3.1,c_lfill/article-content/`,
  websiteImagePath: `https://res.cloudinary.com/${CLOUDINARY_ACCOUNT}/image/upload/f_auto,q_auto,w_auto,dpr_auto,c_scale,w_2560/website/`,
  twitterImage: `/images/social.Twitter.png`,
  linkedInImage: `/images/social.LinkedIn.png`,
  author: 'Benjamin Charity',
  twitter: 'benjamincharity',
  github: 'benjamincharity',
  linkedin: 'benjamincharity',
  email: 'ben.charity@hey.com',
  professionalTitle:
    'Engineering leader & team builder at high-growth startups & scale-ups.',
  professionalTitleSplit: [
    'Engineering leader &',
    'team builder at high-growth',
    'startups & scale-ups.',
  ],
  aboutMe:
    'My focus is on creating and refining systems that not only deliver a cohesive user experience and improved accessibility but also significantly boost the return on investment for business units focused on developing feature-rich solutions and addressing user needs.',
  name: 'Benjamin Charity',
  logo: '/images/pwa/manifest-icon-512.png',
  logo_dark_mode: '/images/pwa/manifest-icon-512.png',
};
