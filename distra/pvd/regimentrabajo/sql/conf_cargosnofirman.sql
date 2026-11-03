CREATE SEQUENCE mod_regimentrabajo.sec_conf_cargosnofirman_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_regimentrabajo.sec_conf_cargosnofirman_seq RESTART WITH 110;

CREATE TABLE mod_regimentrabajo.conf_cargosnofirman (
  idcargosnofirman NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_conf_cargosnofirman_seq'::regclass) NOT NULL,
  idcargo NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_estructuracargosnofirman_pkey PRIMARY KEY(idcargosnofirman)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_cargosnofirman
  OWNER TO postgres;
  
  

  
-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

-- Started on 2023-06-07 11:13:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 2883 (class 1259 OID 1049750)
-- Name: conf_habcargosnofirman; Type: TABLE; Schema: mod_regimentrabajo; Owner: postgres
--

CREATE TABLE mod_regimentrabajo.conf_habcargosnofirman (
    id numeric(19,0) NOT NULL,
    habilitado numeric(1,0) NOT NULL
);


ALTER TABLE mod_regimentrabajo.conf_habcargosnofirman OWNER TO postgres;

--
-- TOC entry 10955 (class 0 OID 1049750)
-- Dependencies: 2883
-- Data for Name: conf_habcargosnofirman; Type: TABLE DATA; Schema: mod_regimentrabajo; Owner: postgres
--

INSERT INTO mod_regimentrabajo.conf_habcargosnofirman VALUES (1, 1);


--
-- TOC entry 10830 (class 2606 OID 1049754)
-- Name: conf_habcargosnofirman conf_cargosnofirman_dat_habilitarhorarioentradasalida_pkey; Type: CONSTRAINT; Schema: mod_regimentrabajo; Owner: postgres
--

ALTER TABLE ONLY mod_regimentrabajo.conf_habcargosnofirman
    ADD CONSTRAINT conf_cargosnofirman_dat_habilitarhorarioentradasalida_pkey PRIMARY KEY (id);


-- Completed on 2023-06-07 11:13:22

--
-- PostgreSQL database dump complete
--
