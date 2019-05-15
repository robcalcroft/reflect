-- DDL generated by Postico 1.5.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE "WebUsers" (
    id integer DEFAULT nextval('"WebUsers_id_seq"'::regclass) PRIMARY KEY,
    name character varying(200) NOT NULL,
    "emailAddress" character varying(100) NOT NULL,
    password character varying(50) NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX "WebUsers_pkey" ON "WebUsers"(id int4_ops);
