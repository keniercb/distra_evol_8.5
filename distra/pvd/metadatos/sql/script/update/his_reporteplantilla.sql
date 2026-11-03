--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.4
-- Dumped by pg_dump version 9.4.4
-- Started on 2021-07-19 13:59:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = mod_estructuracomp, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 1379 (class 1259 OID 667579)
-- Name: his_reporteplantilla; Type: TABLE; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE TABLE his_reporteplantilla (
    idreporteplantilla integer NOT NULL,
    nombrereporte character varying,
    reporte bytea,
    fechavigor date,
    fechaderogacion date,
    nombreproyecto character varying,
    idestructura numeric(19,0)
);


ALTER TABLE his_reporteplantilla OWNER TO zeolides;

--
-- TOC entry 6089 (class 0 OID 0)
-- Dependencies: 1379
-- Name: COLUMN his_reporteplantilla.idestructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON COLUMN his_reporteplantilla.idestructura IS 'Identificador de la estructura al que se le hizo el reporte.';


--
-- TOC entry 1378 (class 1259 OID 667577)
-- Name: his_reporteplantilla_idreporteplantilla_seq; Type: SEQUENCE; Schema: mod_estructuracomp; Owner: zeolides
--

CREATE SEQUENCE his_reporteplantilla_idreporteplantilla_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE his_reporteplantilla_idreporteplantilla_seq OWNER TO zeolides;

--
-- TOC entry 6090 (class 0 OID 0)
-- Dependencies: 1378
-- Name: his_reporteplantilla_idreporteplantilla_seq; Type: SEQUENCE OWNED BY; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER SEQUENCE his_reporteplantilla_idreporteplantilla_seq OWNED BY his_reporteplantilla.idreporteplantilla;


--
-- TOC entry 5968 (class 2604 OID 667582)
-- Name: idreporteplantilla; Type: DEFAULT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY his_reporteplantilla ALTER COLUMN idreporteplantilla SET DEFAULT nextval('his_reporteplantilla_idreporteplantilla_seq'::regclass);


--
-- TOC entry 6084 (class 0 OID 667579)
-- Dependencies: 1379
-- Data for Name: his_reporteplantilla; Type: TABLE DATA; Schema: mod_estructuracomp; Owner: zeolides
--

INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (29, '100000104_VCHJVCB_01.14.21', NULL, '2021-01-14', '2021-01-14', 'VCHJVCB', 100000104);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (30, '100022203_VCHJVCB_01.14.21', NULL, '2021-01-14', '2021-01-14', 'VCHJVCB', 100022203);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (31, '100073090_Sdf_01.28.21', NULL, '2021-01-28', '2021-01-28', 'Sdf', 100073090);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (32, 'VCHJVCB_02.05.21', NULL, '2021-02-05', '2021-02-05', 'VCHJVCB', NULL);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (33, 'VCHJVCB_02.05.21', NULL, '2021-02-05', '2021-02-05', 'VCHJVCB', NULL);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (34, 'Sdf_02.10.21', NULL, '2021-02-10', '2021-02-10', 'Sdf', NULL);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (35, 'Sdf_02.10.21', NULL, '2021-02-10', '2021-02-10', 'Sdf', NULL);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (36, 'Sdf_03.19.21', NULL, '2021-03-19', '2021-03-19', 'Sdf', NULL);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (37, 'Sdf_03.19.21', NULL, '2021-03-19', '2021-03-19', 'Sdf', NULL);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (38, 'Sdf_03.19.21', NULL, '2021-03-19', '2021-03-19', 'Sdf', NULL);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (39, 'Sdf_03.19.21', NULL, '2021-03-19', '2021-03-19', 'Sdf', NULL);
INSERT INTO his_reporteplantilla (idreporteplantilla, nombrereporte, reporte, fechavigor, fechaderogacion, nombreproyecto, idestructura) VALUES (40, 'Sdf_03.19.21', NULL, '2021-03-19', '2021-03-19', 'Sdf', NULL);


--
-- TOC entry 6091 (class 0 OID 0)
-- Dependencies: 1378
-- Name: his_reporteplantilla_idreporteplantilla_seq; Type: SEQUENCE SET; Schema: mod_estructuracomp; Owner: zeolides
--

SELECT pg_catalog.setval('his_reporteplantilla_idreporteplantilla_seq', 40, true);


--
-- TOC entry 5970 (class 2606 OID 667587)
-- Name: his_reporteplantilla_pkey; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY his_reporteplantilla
    ADD CONSTRAINT his_reporteplantilla_pkey PRIMARY KEY (idreporteplantilla);


-- Completed on 2021-07-19 13:59:57

--
-- PostgreSQL database dump complete
--

