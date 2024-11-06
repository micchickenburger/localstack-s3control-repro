#!/usr/bin/env bash
set -euo pipefail

echo "👨‍💻 Creating sites bucket..."
awslocal s3api create-bucket --bucket sites
awslocal s3api put-bucket-acl --bucket sites --acl public-read
