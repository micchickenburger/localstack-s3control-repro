FROM hashicorp/terraform:latest AS terraform
FROM public.ecr.aws/lambda/nodejs:20

COPY --from=terraform /bin/terraform /usr/local/bin/terraform

WORKDIR /app
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD npm start
