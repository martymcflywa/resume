const fs = require("fs");
const path = require("path");
const aws = require("aws-sdk");

const root = "target";
const file = "index.html";
const filepath = path.join(root, file);

const bucket = "resume.martinponce.com.au";
const key = file;

const region = "ap-southeast-2"
const credentials = new aws.SharedIniFileCredentials({
  profile: "resume.martinponce.com.au"
});

function deploy() {
  aws.config.region = region;
  aws.config.credentials = credentials;
  fs.readFile(filepath, (err, data) => {
    if (err) throw err;
    const params = {
      Bucket: bucket,
      Key: key,
      ContentType: "text/html",
      Body: data
    };
    new aws.S3().upload(params, function(s3err, data) {
      if (s3err) throw s3err;
      console.log(`File uploaded to ${data.Location}`);
    });
  });
};

deploy();