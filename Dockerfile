FROM postgres:latest

ENV POSTGRES_USER bylith
ENV POSTGRES_PASSWORD bylith
ENV POSTGRES_DB web_server

COPY init.sql /docker-entrypoint-initdb.d/
EXPOSE 5432