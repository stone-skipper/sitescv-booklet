import "./Styles.css";

export const metadata = {
  title: "Booklet",
  description: `/* What is it */
Booklet is a fun, lightweight showcase of your works. Make people flip through pages to quickly browse your projects. On a desktop, it's hover, and on a mobile, it turns into a swipe. 

This template is developed for illustrators and branding designers in particular, who have diverse projects with unique color palettes. It is also sort of a personality test for designers, but in your color choices. Try previewing your profile to find out your color palettes across your projects. 

For example, Erica Fustero's works in this demo shows her vibrant color choices across her different projects.  



/* How it works */
For this template, you need one or more project or side project that have image or video attachments on your [Read.cv](http://read.cv/) profile. 

The color for each project is extracted from the first media in that project. It can be from a photo, or if it's a video, it'll be from the first frame of the video. 



/* Support */
If you need help modifying this template, message me on Posts (@seungmee_lee)`,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
