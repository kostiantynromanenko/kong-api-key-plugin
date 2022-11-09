FROM kong
USER root
# JavaScript:
RUN apk add --update nodejs-current npm && rm -rf /var/cache/apk/*
RUN npm install --unsafe -g kong-pdk@0.5.3
COPY . /usr/local/kong/js-plugins/api-key
# reset back the defaults
USER kong
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 8000 8443 8001 8444
STOPSIGNAL SIGQUIT
HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD kong health
CMD ["kong", "docker-start"]