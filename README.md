# Resume

My resume is created with a cool little tool called [jsonresume](https://jsonresume.org/), which allows you to define your resume as json. It can then be rendered as pdf or html using different templates.

The awesome part is that my resume is in plaintext, and in version control. My resume is hosted on AWS S3, and deploying an update to my resume is as simple as calling `npm run deploy` on the command line.

https://resume.martinponce.com.au

# Usage

## Getting started

```
npm install
```

## Serve

```
npm run serve
```

## Build

```
npm run build
```

This will render the resume as html using the [spartan](https://github.com/phoinixi/jsonresume-theme-spartan) template at `target/index.html`

## Deploy

```
npm run deploy
```

This will upload `target/index.html` to my AWS S3 bucket. In order to authenticate, `deploy.js` assumes that [shared credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) are defined at `~/.aws/credentials`.