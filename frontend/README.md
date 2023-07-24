# Welcome to the Front-End

## Technology used
The front-end User Interface is made using *React.js* running on *Node.js*.
This is a single-page app right now so *Create-React-App* was used to create the project.

For the Design System and UI design files go to my Figma Community account for rich component-based UI modules

# Developing for the Front-End

## Data Models
Models are slightly abstracted between front-end and back-end, since one side stores data in a database
and the other manipulates it facing the user.

At front-end, all data models are stored as objects, accurately representing ownership hierarchy
(e.g. entries belong to a quiz object)

For the Data Model interfaces, see the **src/Models/Models.tsx** TypeScript file

## Opening the project
The front-end project was made in JetBrains WebStorm and is the suggested IDE to open and edit front-end code.

## Running the project

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

# Designing for the Front-End

**language-app-recoded** is working on a design system to ensure design cohesion throughout the app.

## The Design System
### Typeface and Icon Library
- *Inter* is the current preferred typeface for text.
- *Material Symbol* is the preferred symbol typeface for symbols/icons.

### Colour Variables
**language-app-recoded** uses *Radix Colors* for accessibility, dark theming, and design consistency.
See more about the project here: https://www.radix-ui.com/colors