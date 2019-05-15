-- DDL generated by Postico 1.5.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE "Boards" (
    id integer DEFAULT nextval('"Boards_id_seq"'::regclass) PRIMARY KEY,
    name character varying(100) NOT NULL,
    owner integer NOT NULL REFERENCES "WebUsers"(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    "createdAt" timestamp without time zone DEFAULT now()
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX "Boards_pkey" ON "Boards"(id int4_ops);

