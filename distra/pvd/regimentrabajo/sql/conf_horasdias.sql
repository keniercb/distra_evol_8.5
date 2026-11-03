--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.19
-- Dumped by pg_dump version 9.4.19
-- Started on 2022-03-11 01:02:48 VET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 2728 (class 1259 OID 1058881)
-- Name: conf_horasdias; Type: TABLE; Schema: mod_regimentrabajo; Owner: zeolides; Tablespace: 
--

CREATE TABLE mod_regimentrabajo.conf_horasdias (
    id numeric(1,0) NOT NULL,
    horasdias numeric(2,0) NOT NULL
);


ALTER TABLE mod_regimentrabajo.conf_horasdias OWNER TO zeolides;

--
-- TOC entry 9738 (class 0 OID 0)
-- Dependencies: 2728
-- Name: COLUMN conf_horasdias.horasdias; Type: COMMENT; Schema: mod_regimentrabajo; Owner: zeolides
--

COMMENT ON COLUMN mod_regimentrabajo.conf_horasdias.horasdias IS '0-Desabilitado
1-Habilitado';


--
-- TOC entry 9732 (class 0 OID 1058881)
-- Dependencies: 2728
-- Data for Name: conf_horasdias; Type: TABLE DATA; Schema: mod_regimentrabajo; Owner: zeolides
--

COPY mod_regimentrabajo.conf_horasdias (id, horasdias) FROM stdin;
1	1
2	0
\.


--
-- TOC entry 9619 (class 2606 OID 1058885)
-- Name: conf_horasdias_pk_horasextras; Type: CONSTRAINT; Schema: mod_regimentrabajo; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY mod_regimentrabajo.conf_horasdias
    ADD CONSTRAINT conf_horasdias_pk_horasextras PRIMARY KEY (id);


-- Completed on 2022-03-11 01:02:55 VET

--
-- PostgreSQL database dump complete
--

