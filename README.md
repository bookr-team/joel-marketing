# Bookr marketing site

[Deployed here](https://joel-bartlett-bookr.netlify.com/)

## Some Things I learned

- This was my first time using Bulma. I had to familiarize myself with its patterns and conventions. I often wondered if it's worth the trouble. I find the resultant HTML, bloated with utility classes and `div` tags, to be fundamentally unsatisfying. I suppose such frameworks would be very useful for rapid prototyping if one were prepared to invest the time and effort to learn them thoroughly. I like the idea of building and using my own minimal library (with a basic grid and breakpoint helpers, say) and adding to it incrementally to suit the needs of a project.
- I used Sketch to mock up some of the UI features and design the logo for our project. I found it quick and easy for working with vector images and to output SVG images.
- I learned how to integrate FontAwesome for iconography.
- I built one new JavaScript component and adapted another from a previous project. I enjoyed the process. I had to get acquainted with several APIs that were new to me. I worked with the `Date` object, `fetch()`, `setInterval()`, and learned how to create new nodes from an HTML string. I tried to make my components fully configurable and re-useable so they can be used in future projects.
- I spent the majority of my time on this project with the JavaScript code, discovering that I prefer working with logic and solving problems to styling and coming up with marketing copy.
- I got more comfortable working with `npm` to get my JS & CSS tooling set up. I was able to watch my source files for changes and trigger a command to re-compile the build files.
- I've made more than 150 commits and become more comfortable with pushing/pulling, working with branches, and with source control in general.
- I tried to document my code where it was helpful in explaining what I was trying to achieve and how to implement the components outside of the project.
- Working with my team members to solve problems has been rewarding.

## Stack

- Using Bulma CSS framework
- SASS with auto-prefixing
- Babel for ES6
- Based on `bulma-start` ([repo](https://github.com/jgthms/bulma-start))

## Usage

**Install**

`npm install`

**Run dev server**

`npm start`

**Build for deploy**

`npm run deploy`

**See all commands**

`npm run`
