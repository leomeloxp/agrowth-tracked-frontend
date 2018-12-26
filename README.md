# Web App

This repository holds the code for the web application (front-end code + server rendering logic) for our project, currently titled CCN. It uses NextJS, React, Styled Components, Typescript and Apollo client, please review their respective documentation if you want to learn more about what each part does and how it can help us improve our development experience.

## Development

Before you start coding (or if a new package has been added to the project) run:

```sh
npm install
```

To start a development server run:

```sh
npm run dev
```

### Adding new functionality or features to the front-end

NextJS is a framework for building universal React apps, ie apps that make use of both, front-end and backend logic. It handles, amongst other things, the routing between pages, server side rendering React (improving performance and SEO scores). Some of the files in this project contain some kind of boilerplate or configuration code to ensure that NextJS functions correctly, most files though will be regular React components, holding the business logic and UI we need, all files should have some kind of documentation in them so check them out if you need guidance or understanding of the code.

The basic file structure of our application is as follows:

- `src` is where all of our custom code resides and it currently follows Next's default structure, ie:
  - `components` are where individual React components resides.
  - `lib` contains first party modules used to enhance the application's features, so far this include initialising Apollo and some set up files used to provide a way for Next to use it within the application.
  - `pages` is where our individual pages sit. Files that begin with an underscore(`_app.js`, `_document.js`) have some kind of NextJS built in fucntionality override or customisation, changing their contents will rarely going to be needed. All other files will be compiled as pages of our website.
  - `graphql` custom folder containing Apollo (GraphQL) Client related code.
  - `utils` JS helper function and scripts that don't really fit anywhere else.

## Building

If you would like to generate a production build you can run `npm run build`.
