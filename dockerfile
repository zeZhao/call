FROM jvtd-harbor.jvtdtest.top/jvtd/nginx:1.15
RUN mkdir -p /data/logs
RUN rm -rf /usr/share/nginx/html/*
COPY dist/ /usr/share/nginx/html/
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]