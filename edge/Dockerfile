FROM haproxy:2.9-alpine

# Copy HAProxy configuration and custom error pages
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
COPY errors /usr/local/etc/haproxy/errors

EXPOSE 80
CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg", "-db"]
