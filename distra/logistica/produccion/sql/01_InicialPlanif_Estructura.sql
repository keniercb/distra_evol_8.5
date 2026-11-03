--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.4
-- Dumped by pg_dump version 13.2

-- Started on 2021-08-05 14:31:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 84 (class 2615 OID 13516040)
-- Name: mod_planifindustrial; Type: SCHEMA; Schema: -; Owner: zeolides
--

CREATE SCHEMA mod_planifindustrial;


ALTER SCHEMA mod_planifindustrial OWNER TO zeolides;

--
-- TOC entry 3696 (class 1259 OID 13516043)
-- Name: sec_actividadentidadindustrial_seq; Type: SEQUENCE; Schema: mod_planifindustrial; Owner: zeolides
--

CREATE SEQUENCE mod_planifindustrial.sec_actividadentidadindustrial_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 1999999999999999999
    CACHE 1;


ALTER TABLE mod_planifindustrial.sec_actividadentidadindustrial_seq OWNER TO zeolides;

SET default_tablespace = '';

--
-- TOC entry 3699 (class 1259 OID 13516049)
-- Name: dat_actividadentidadindustrial; Type: TABLE; Schema: mod_planifindustrial; Owner: zeolides
--

CREATE TABLE mod_planifindustrial.dat_actividadentidadindustrial (
    idactividadentidadindustrial numeric(19,0) DEFAULT nextval('mod_planifindustrial.sec_actividadentidadindustrial_seq'::regclass) NOT NULL,
    idproduccionindustrial numeric(19,0) NOT NULL,
    idcartatecindustrialactividad numeric(19,0) NOT NULL,
    nivelactividadindustrial numeric(19,4) DEFAULT 0 NOT NULL,
    version numeric(19,0) DEFAULT 1 NOT NULL,
    idactividadentidad numeric(19,0) NOT NULL
);


ALTER TABLE mod_planifindustrial.dat_actividadentidadindustrial OWNER TO zeolides;

--
-- TOC entry 3698 (class 1259 OID 13516047)
-- Name: sec_cartatecindustrial_seq; Type: SEQUENCE; Schema: mod_planifindustrial; Owner: zeolides
--

CREATE SEQUENCE mod_planifindustrial.sec_cartatecindustrial_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 1999999999999999999
    CACHE 1;


ALTER TABLE mod_planifindustrial.sec_cartatecindustrial_seq OWNER TO zeolides;

--
-- TOC entry 3702 (class 1259 OID 13516064)
-- Name: dat_cartatecindustrial; Type: TABLE; Schema: mod_planifindustrial; Owner: zeolides
--

CREATE TABLE mod_planifindustrial.dat_cartatecindustrial (
    idcartatecindustrial numeric(19,0) DEFAULT nextval('mod_planifindustrial.sec_cartatecindustrial_seq'::regclass) NOT NULL,
    idindicadorsalida numeric(19,0) NOT NULL,
    idaprobacion numeric(19,0) NOT NULL,
    cantidad numeric(19,6) DEFAULT 0 NOT NULL,
    denominacion character varying(100) NOT NULL,
    descripcion character varying(255)
);


ALTER TABLE mod_planifindustrial.dat_cartatecindustrial OWNER TO zeolides;

--
-- TOC entry 3695 (class 1259 OID 13516041)
-- Name: sec_cartatecindustrialactividad_seq; Type: SEQUENCE; Schema: mod_planifindustrial; Owner: zeolides
--

CREATE SEQUENCE mod_planifindustrial.sec_cartatecindustrialactividad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 1999999999999999999
    CACHE 1;


ALTER TABLE mod_planifindustrial.sec_cartatecindustrialactividad_seq OWNER TO zeolides;

--
-- TOC entry 3701 (class 1259 OID 13516060)
-- Name: dat_cartatecindustrialactividad; Type: TABLE; Schema: mod_planifindustrial; Owner: zeolides
--

CREATE TABLE mod_planifindustrial.dat_cartatecindustrialactividad (
    idcartatecindustrialactividad numeric(19,0) DEFAULT nextval('mod_planifindustrial.sec_cartatecindustrialactividad_seq'::regclass) NOT NULL,
    idcartatecindustrial numeric(19,0) NOT NULL,
    idactividad numeric(19,0) NOT NULL
);


ALTER TABLE mod_planifindustrial.dat_cartatecindustrialactividad OWNER TO zeolides;

--
-- TOC entry 3697 (class 1259 OID 13516045)
-- Name: sec_produccionindustrial_seq; Type: SEQUENCE; Schema: mod_planifindustrial; Owner: zeolides
--

CREATE SEQUENCE mod_planifindustrial.sec_produccionindustrial_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 1999999999999999999
    CACHE 1;


ALTER TABLE mod_planifindustrial.sec_produccionindustrial_seq OWNER TO zeolides;

--
-- TOC entry 3700 (class 1259 OID 13516055)
-- Name: dat_produccionindustrial; Type: TABLE; Schema: mod_planifindustrial; Owner: zeolides
--

CREATE TABLE mod_planifindustrial.dat_produccionindustrial (
    idproduccionindustrial numeric(19,0) DEFAULT nextval('mod_planifindustrial.sec_produccionindustrial_seq'::regclass) NOT NULL,
    idcartatecindustrial numeric(19,0) NOT NULL,
    identidad numeric(19,0) NOT NULL,
    idejercicio numeric(19,0) NOT NULL,
    denominacion character varying(100) NOT NULL,
    valor numeric(19,6) DEFAULT 0 NOT NULL,
    idaprobacion numeric(19,0) NOT NULL
);


ALTER TABLE mod_planifindustrial.dat_produccionindustrial OWNER TO zeolides;

--
-- TOC entry 15899 (class 2606 OID 13516070)
-- Name: dat_actividadentidadindustrial pk_actividadentidadindustrial; Type: CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_actividadentidadindustrial
    ADD CONSTRAINT pk_actividadentidadindustrial PRIMARY KEY (idactividadentidadindustrial);


--
-- TOC entry 15905 (class 2606 OID 13516076)
-- Name: dat_cartatecindustrial pk_cartatecindustrial; Type: CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_cartatecindustrial
    ADD CONSTRAINT pk_cartatecindustrial PRIMARY KEY (idcartatecindustrial);


--
-- TOC entry 15903 (class 2606 OID 13516074)
-- Name: dat_cartatecindustrialactividad pk_cartatecindustrialactividad; Type: CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_cartatecindustrialactividad
    ADD CONSTRAINT pk_cartatecindustrialactividad PRIMARY KEY (idcartatecindustrialactividad);


--
-- TOC entry 15901 (class 2606 OID 13516072)
-- Name: dat_produccionindustrial pk_produccionindustrial; Type: CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_produccionindustrial
    ADD CONSTRAINT pk_produccionindustrial PRIMARY KEY (idproduccionindustrial);


--
-- TOC entry 15913 (class 2606 OID 13516117)
-- Name: dat_cartatecindustrialactividad fk_actividad_cartatecindustrialactividad; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_cartatecindustrialactividad
    ADD CONSTRAINT fk_actividad_cartatecindustrialactividad FOREIGN KEY (idactividad) REFERENCES mod_planificacion.nom_actividad(idactividad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 15906 (class 2606 OID 13516122)
-- Name: dat_actividadentidadindustrial fk_actividadentidad_actividadentidadindustrial; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_actividadentidadindustrial
    ADD CONSTRAINT fk_actividadentidad_actividadentidadindustrial FOREIGN KEY (idactividadentidad) REFERENCES mod_planificacion.dat_actividadentidad(idactividadentidad) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 15908 (class 2606 OID 13516077)
-- Name: dat_actividadentidadindustrial fk_actividadentidadindustrial_cartatecindustrialactividad; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_actividadentidadindustrial
    ADD CONSTRAINT fk_actividadentidadindustrial_cartatecindustrialactividad FOREIGN KEY (idcartatecindustrialactividad) REFERENCES mod_planifindustrial.dat_cartatecindustrialactividad(idcartatecindustrialactividad) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 15916 (class 2606 OID 13516107)
-- Name: dat_cartatecindustrial fk_aprobacion_cartatecindustrial; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_cartatecindustrial
    ADD CONSTRAINT fk_aprobacion_cartatecindustrial FOREIGN KEY (idaprobacion) REFERENCES mod_planificacion.nom_aprobacion(idaprobacion) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 15909 (class 2606 OID 13516127)
-- Name: dat_produccionindustrial fk_aprobacion_produccionindustrial; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_produccionindustrial
    ADD CONSTRAINT fk_aprobacion_produccionindustrial FOREIGN KEY (idaprobacion) REFERENCES mod_planificacion.nom_aprobacion(idaprobacion) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 15914 (class 2606 OID 13516092)
-- Name: dat_cartatecindustrialactividad fk_cartatecindustrial_cartatecindustrialactividad; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_cartatecindustrialactividad
    ADD CONSTRAINT fk_cartatecindustrial_cartatecindustrialactividad FOREIGN KEY (idcartatecindustrial) REFERENCES mod_planifindustrial.dat_cartatecindustrial(idcartatecindustrial) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 15912 (class 2606 OID 13516087)
-- Name: dat_produccionindustrial fk_cartatecindustrial_produccionindustrial; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_produccionindustrial
    ADD CONSTRAINT fk_cartatecindustrial_produccionindustrial FOREIGN KEY (idcartatecindustrial) REFERENCES mod_planifindustrial.dat_cartatecindustrial(idcartatecindustrial) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 15910 (class 2606 OID 13516102)
-- Name: dat_produccionindustrial fk_ejercicioplanificacion_produccionindustrial; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_produccionindustrial
    ADD CONSTRAINT fk_ejercicioplanificacion_produccionindustrial FOREIGN KEY (idejercicio) REFERENCES mod_planificacion.nom_ejercicioplanificacion(idejercicio) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 15911 (class 2606 OID 13516097)
-- Name: dat_produccionindustrial fk_filaestruc_produccionindustrial; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_produccionindustrial
    ADD CONSTRAINT fk_filaestruc_produccionindustrial FOREIGN KEY (identidad) REFERENCES mod_estructuracomp.nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 15915 (class 2606 OID 13516112)
-- Name: dat_cartatecindustrial fk_indicador_cartatecindustrial; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_cartatecindustrial
    ADD CONSTRAINT fk_indicador_cartatecindustrial FOREIGN KEY (idindicadorsalida) REFERENCES mod_datosmaestros.nom_indicador(idindicador) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 15907 (class 2606 OID 13516082)
-- Name: dat_actividadentidadindustrial fk_produccionindustrial_actividadentidadindustrial; Type: FK CONSTRAINT; Schema: mod_planifindustrial; Owner: zeolides
--

ALTER TABLE ONLY mod_planifindustrial.dat_actividadentidadindustrial
    ADD CONSTRAINT fk_produccionindustrial_actividadentidadindustrial FOREIGN KEY (idproduccionindustrial) REFERENCES mod_planifindustrial.dat_produccionindustrial(idproduccionindustrial) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 16046 (class 0 OID 0)
-- Dependencies: 84
-- Name: SCHEMA mod_planifindustrial; Type: ACL; Schema: -; Owner: zeolides
--

REVOKE ALL ON SCHEMA mod_planifindustrial FROM PUBLIC;
REVOKE ALL ON SCHEMA mod_planifindustrial FROM zeolides;
GRANT ALL ON SCHEMA mod_planifindustrial TO zeolides;


--
-- TOC entry 16047 (class 0 OID 0)
-- Dependencies: 3696
-- Name: SEQUENCE sec_actividadentidadindustrial_seq; Type: ACL; Schema: mod_planifindustrial; Owner: zeolides
--

REVOKE ALL ON SEQUENCE mod_planifindustrial.sec_actividadentidadindustrial_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE mod_planifindustrial.sec_actividadentidadindustrial_seq FROM zeolides;
GRANT ALL ON SEQUENCE mod_planifindustrial.sec_actividadentidadindustrial_seq TO zeolides;


--
-- TOC entry 16048 (class 0 OID 0)
-- Dependencies: 3699
-- Name: TABLE dat_actividadentidadindustrial; Type: ACL; Schema: mod_planifindustrial; Owner: zeolides
--

REVOKE ALL ON TABLE mod_planifindustrial.dat_actividadentidadindustrial FROM PUBLIC;
REVOKE ALL ON TABLE mod_planifindustrial.dat_actividadentidadindustrial FROM zeolides;
GRANT ALL ON TABLE mod_planifindustrial.dat_actividadentidadindustrial TO zeolides;


--
-- TOC entry 16049 (class 0 OID 0)
-- Dependencies: 3698
-- Name: SEQUENCE sec_cartatecindustrial_seq; Type: ACL; Schema: mod_planifindustrial; Owner: zeolides
--

REVOKE ALL ON SEQUENCE mod_planifindustrial.sec_cartatecindustrial_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE mod_planifindustrial.sec_cartatecindustrial_seq FROM zeolides;
GRANT ALL ON SEQUENCE mod_planifindustrial.sec_cartatecindustrial_seq TO zeolides;


--
-- TOC entry 16050 (class 0 OID 0)
-- Dependencies: 3702
-- Name: TABLE dat_cartatecindustrial; Type: ACL; Schema: mod_planifindustrial; Owner: zeolides
--

REVOKE ALL ON TABLE mod_planifindustrial.dat_cartatecindustrial FROM PUBLIC;
REVOKE ALL ON TABLE mod_planifindustrial.dat_cartatecindustrial FROM zeolides;
GRANT ALL ON TABLE mod_planifindustrial.dat_cartatecindustrial TO zeolides;


--
-- TOC entry 16051 (class 0 OID 0)
-- Dependencies: 3695
-- Name: SEQUENCE sec_cartatecindustrialactividad_seq; Type: ACL; Schema: mod_planifindustrial; Owner: zeolides
--

REVOKE ALL ON SEQUENCE mod_planifindustrial.sec_cartatecindustrialactividad_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE mod_planifindustrial.sec_cartatecindustrialactividad_seq FROM zeolides;
GRANT ALL ON SEQUENCE mod_planifindustrial.sec_cartatecindustrialactividad_seq TO zeolides;


--
-- TOC entry 16052 (class 0 OID 0)
-- Dependencies: 3701
-- Name: TABLE dat_cartatecindustrialactividad; Type: ACL; Schema: mod_planifindustrial; Owner: zeolides
--

REVOKE ALL ON TABLE mod_planifindustrial.dat_cartatecindustrialactividad FROM PUBLIC;
REVOKE ALL ON TABLE mod_planifindustrial.dat_cartatecindustrialactividad FROM zeolides;
GRANT ALL ON TABLE mod_planifindustrial.dat_cartatecindustrialactividad TO zeolides;


--
-- TOC entry 16053 (class 0 OID 0)
-- Dependencies: 3697
-- Name: SEQUENCE sec_produccionindustrial_seq; Type: ACL; Schema: mod_planifindustrial; Owner: zeolides
--

REVOKE ALL ON SEQUENCE mod_planifindustrial.sec_produccionindustrial_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE mod_planifindustrial.sec_produccionindustrial_seq FROM zeolides;
GRANT ALL ON SEQUENCE mod_planifindustrial.sec_produccionindustrial_seq TO zeolides;


--
-- TOC entry 16054 (class 0 OID 0)
-- Dependencies: 3700
-- Name: TABLE dat_produccionindustrial; Type: ACL; Schema: mod_planifindustrial; Owner: zeolides
--

REVOKE ALL ON TABLE mod_planifindustrial.dat_produccionindustrial FROM PUBLIC;
REVOKE ALL ON TABLE mod_planifindustrial.dat_produccionindustrial FROM zeolides;
GRANT ALL ON TABLE mod_planifindustrial.dat_produccionindustrial TO zeolides;


-- Completed on 2021-08-05 14:32:46

--
-- PostgreSQL database dump complete
--

