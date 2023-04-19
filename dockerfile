FROM jvtd-harbor.jvtdtest.top/jvtd/nginx:1.15
RUN mkdir -p /data/logs
RUN rm -rf /usr/share/nginx/html/*
COPY dist/ /usr/share/nginx/html/
RUN rm -rf /usr/local/nginx/conf/vhost/*
COPY nginx.conf /usr/local/nginx/conf/vhost/
EXPOSE 80
CMD ["/usr/local/nginx/sbin/nginx","-g","daemon off;"]