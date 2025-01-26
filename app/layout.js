import "./Styles.css";

export const metadata = {
  title: "Booklet",
  description: "/\* What is it \*/

Booklet is a fun, lightweight showcase for your works, making people to flip through pages for a quick browse.

This template is designed especially for illustrators and branding designers, who have diverse projects with unique color palettes. It is sort of a personality test for designers, but in your color choices.

For example, [Erica Fustero](https://read.cv/ericafustero)'s works in this demo shows her vibrant color choices across her different projects! Try previewing your profile to find out what yours would look like.

/\* How it works \*/

For this template, you need one or more project or side project that have image or video attachments on your Read.cv profile.

The color for each project is extracted from the first media in that project. This could be a photo, or if it’s a video, the color is taken from the first frame.

/\* Support \*/

If you need help modifying this template, message me on Posts [(@seungmee\_lee)](https://read.cv/seungmee_lee)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
