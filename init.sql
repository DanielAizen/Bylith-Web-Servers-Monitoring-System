-- Table: web_server.ws_monitor

-- DROP TABLE IF EXISTS web_server.ws_monitor;

CREATE TABLE IF NOT EXISTS web_server.ws_monitor
(
    date_created timestamp without time zone NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
    port integer NOT NULL,
    name text COLLATE pg_catalog."default",
    http_url text COLLATE pg_catalog."default",
    status integer,
    watermark timestamp without time zone,
    CONSTRAINT ws_monitor_pkey PRIMARY KEY (date_created)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS web_server.ws_monitor
    OWNER to postgres;

GRANT ALL ON TABLE web_server.ws_monitor TO bylith;

GRANT ALL ON TABLE web_server.ws_monitor TO postgres;



-- Table: web_server.ws_health_status

-- DROP TABLE IF EXISTS web_server.ws_health_status;

CREATE TABLE IF NOT EXISTS web_server.ws_health_status
(
    id integer NOT NULL DEFAULT 'nextval('web_server.ws_health_status_id_seq'::regclass)',
    port_id integer,
    status integer,
    CONSTRAINT ws_health_status_pkey PRIMARY KEY (id),
    CONSTRAINT ws_health_status_port_id_key UNIQUE (port_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS web_server.ws_health_status
    OWNER to postgres;

GRANT ALL ON TABLE web_server.ws_health_status TO bylith;

GRANT ALL ON TABLE web_server.ws_health_status TO postgres;