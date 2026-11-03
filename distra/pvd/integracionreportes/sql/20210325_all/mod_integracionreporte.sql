--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.1
-- Dumped by pg_dump version 9.4.0
-- Started on 2021-03-25 22:19:27

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 66 (class 2615 OID 81925)
-- Name: mod_integracionreporte; Type: SCHEMA; Schema: -; Owner: zeolides
--

CREATE SCHEMA mod_integracionreporte;


ALTER SCHEMA mod_integracionreporte OWNER TO zeolides;

SET search_path = mod_integracionreporte, pg_catalog;

--
-- TOC entry 3958 (class 1259 OID 81946)
-- Name: sec_reporte_seq; Type: SEQUENCE; Schema: mod_integracionreporte; Owner: zeolides
--

CREATE SEQUENCE sec_reporte_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 1999999999999999999
    CACHE 1;


ALTER TABLE sec_reporte_seq OWNER TO zeolides;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 3959 (class 1259 OID 81948)
-- Name: dat_reporte; Type: TABLE; Schema: mod_integracionreporte; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_reporte (
    idreporte numeric(19,0) DEFAULT nextval('sec_reporte_seq'::regclass) NOT NULL,
    idconfiguracion numeric(19,0) NOT NULL,
    denreporte character varying(255) NOT NULL,
    idreportereportserver character varying(100) NOT NULL,
    descreporte character varying(255)
);


ALTER TABLE dat_reporte OWNER TO zeolides;

--
-- TOC entry 3961 (class 1259 OID 475144)
-- Name: sec_reportefiltro_seq; Type: SEQUENCE; Schema: mod_integracionreporte; Owner: postgres
--

CREATE SEQUENCE sec_reportefiltro_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 1999999999999999999
    CACHE 1;


ALTER TABLE sec_reportefiltro_seq OWNER TO postgres;

--
-- TOC entry 3962 (class 1259 OID 475146)
-- Name: dat_reportefiltro; Type: TABLE; Schema: mod_integracionreporte; Owner: postgres; Tablespace: 
--

CREATE TABLE dat_reportefiltro (
    idfiltro numeric(19,0) DEFAULT nextval('sec_reportefiltro_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    orden numeric(2,0) NOT NULL,
    anchocolumna numeric(2,0) NOT NULL,
    nombreparametro character varying(50) NOT NULL,
    tipo numeric(1,0) NOT NULL,
    javatype character varying(50),
    idreporte numeric(19,0) NOT NULL,
    denominaciontipo character varying(50) DEFAULT 'Texto'::character varying NOT NULL
);


ALTER TABLE dat_reportefiltro OWNER TO postgres;

--
-- TOC entry 13489 (class 0 OID 0)
-- Dependencies: 3962
-- Name: TABLE dat_reportefiltro; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON TABLE dat_reportefiltro IS 'Guarda el reporte filtro.';


--
-- TOC entry 13490 (class 0 OID 0)
-- Dependencies: 3962
-- Name: COLUMN dat_reportefiltro.idfiltro; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltro.idfiltro IS 'Identificador del filtro.';


--
-- TOC entry 13491 (class 0 OID 0)
-- Dependencies: 3962
-- Name: COLUMN dat_reportefiltro.denominacion; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltro.denominacion IS 'Guarda la denominación.';


--
-- TOC entry 13492 (class 0 OID 0)
-- Dependencies: 3962
-- Name: COLUMN dat_reportefiltro.orden; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltro.orden IS 'Guarda el orden que se muestran los filtros.';


--
-- TOC entry 13493 (class 0 OID 0)
-- Dependencies: 3962
-- Name: COLUMN dat_reportefiltro.anchocolumna; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltro.anchocolumna IS 'Guarda el ancho de columna.';


--
-- TOC entry 13494 (class 0 OID 0)
-- Dependencies: 3962
-- Name: COLUMN dat_reportefiltro.tipo; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltro.tipo IS 'Guarda el tipo de filtro 1-texto; 2-numerico; 3-fecha.';


--
-- TOC entry 3965 (class 1259 OID 704538)
-- Name: dat_reportefiltronomenclador; Type: TABLE; Schema: mod_integracionreporte; Owner: postgres; Tablespace: 
--

CREATE TABLE dat_reportefiltronomenclador (
    idfiltro numeric(19,0) NOT NULL,
    nomidentificador character varying(100) NOT NULL,
    nomdenominacion character varying(100) NOT NULL,
    tipofuentedatos numeric(1,0) NOT NULL,
    sentenciasql character varying(255),
    nomservicio character varying(255),
    multipleseleccion numeric(1,0) DEFAULT 0,
    paginado numeric(1,0) DEFAULT 0,
    enviarid numeric(1,0) DEFAULT 1
);


ALTER TABLE dat_reportefiltronomenclador OWNER TO postgres;

--
-- TOC entry 13495 (class 0 OID 0)
-- Dependencies: 3965
-- Name: TABLE dat_reportefiltronomenclador; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON TABLE dat_reportefiltronomenclador IS 'Guarda el reporte del filtro nomenclador.';


--
-- TOC entry 13496 (class 0 OID 0)
-- Dependencies: 3965
-- Name: COLUMN dat_reportefiltronomenclador.idfiltro; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltronomenclador.idfiltro IS 'Identificador del filtro.';


--
-- TOC entry 13497 (class 0 OID 0)
-- Dependencies: 3965
-- Name: COLUMN dat_reportefiltronomenclador.nomidentificador; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltronomenclador.nomidentificador IS 'Guarda el nombre del identificador.';


--
-- TOC entry 13498 (class 0 OID 0)
-- Dependencies: 3965
-- Name: COLUMN dat_reportefiltronomenclador.nomdenominacion; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltronomenclador.nomdenominacion IS 'Guarda el nombre de la denominación.';


--
-- TOC entry 13499 (class 0 OID 0)
-- Dependencies: 3965
-- Name: COLUMN dat_reportefiltronomenclador.tipofuentedatos; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltronomenclador.tipofuentedatos IS 'Guarda el tipo de fuente de datos.  
1- guarda una sentencia sql
0- guarda la declaración del servicio.';


--
-- TOC entry 13500 (class 0 OID 0)
-- Dependencies: 3965
-- Name: COLUMN dat_reportefiltronomenclador.enviarid; Type: COMMENT; Schema: mod_integracionreporte; Owner: postgres
--

COMMENT ON COLUMN dat_reportefiltronomenclador.enviarid IS 'Guarda la configuracion del envio del valor por parametros:
0- Envia la denominacion del nomenclador 
1- Envia el id del nomenclador';


--
-- TOC entry 3963 (class 1259 OID 475157)
-- Name: dat_reportefiltronumerico; Type: TABLE; Schema: mod_integracionreporte; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_reportefiltronumerico (
    idfiltro numeric(19,0) NOT NULL,
    valorminimo numeric(10,0),
    valormaximo numeric(10,0) NOT NULL
);


ALTER TABLE dat_reportefiltronumerico OWNER TO zeolides;

--
-- TOC entry 13501 (class 0 OID 0)
-- Dependencies: 3963
-- Name: TABLE dat_reportefiltronumerico; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON TABLE dat_reportefiltronumerico IS 'Guarda el reporte del filtro numérico.';


--
-- TOC entry 13502 (class 0 OID 0)
-- Dependencies: 3963
-- Name: COLUMN dat_reportefiltronumerico.idfiltro; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN dat_reportefiltronumerico.idfiltro IS 'Identificador del filtro.';


--
-- TOC entry 13503 (class 0 OID 0)
-- Dependencies: 3963
-- Name: COLUMN dat_reportefiltronumerico.valorminimo; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN dat_reportefiltronumerico.valorminimo IS 'Guarda el valor mínimo.';


--
-- TOC entry 13504 (class 0 OID 0)
-- Dependencies: 3963
-- Name: COLUMN dat_reportefiltronumerico.valormaximo; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN dat_reportefiltronumerico.valormaximo IS 'Guarda el valor máximo.';


--
-- TOC entry 3964 (class 1259 OID 475167)
-- Name: dat_reportefiltrotexto; Type: TABLE; Schema: mod_integracionreporte; Owner: zeolides; Tablespace: 
--

CREATE TABLE dat_reportefiltrotexto (
    idfiltro numeric(19,0) NOT NULL,
    longitudminima numeric(3,0),
    longitudmaxima numeric(3,0) NOT NULL
);


ALTER TABLE dat_reportefiltrotexto OWNER TO zeolides;

--
-- TOC entry 13505 (class 0 OID 0)
-- Dependencies: 3964
-- Name: TABLE dat_reportefiltrotexto; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON TABLE dat_reportefiltrotexto IS 'Guarda el reporte del filtro de texto.';


--
-- TOC entry 13506 (class 0 OID 0)
-- Dependencies: 3964
-- Name: COLUMN dat_reportefiltrotexto.idfiltro; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN dat_reportefiltrotexto.idfiltro IS 'Identificador del filtro.';


--
-- TOC entry 13507 (class 0 OID 0)
-- Dependencies: 3964
-- Name: COLUMN dat_reportefiltrotexto.longitudminima; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN dat_reportefiltrotexto.longitudminima IS 'Guarda la longitud mínima.';


--
-- TOC entry 13508 (class 0 OID 0)
-- Dependencies: 3964
-- Name: COLUMN dat_reportefiltrotexto.longitudmaxima; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN dat_reportefiltrotexto.longitudmaxima IS 'Guarda la longitud máxima.';


--
-- TOC entry 3956 (class 1259 OID 81928)
-- Name: sec_configuracionreporte_seq; Type: SEQUENCE; Schema: mod_integracionreporte; Owner: zeolides
--

CREATE SEQUENCE sec_configuracionreporte_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 1999999999999999999
    CACHE 1;


ALTER TABLE sec_configuracionreporte_seq OWNER TO zeolides;

--
-- TOC entry 3957 (class 1259 OID 81930)
-- Name: nom_configuracionreporte; Type: TABLE; Schema: mod_integracionreporte; Owner: zeolides; Tablespace: 
--

CREATE TABLE nom_configuracionreporte (
    idconfiguracion numeric(19,0) DEFAULT nextval('sec_configuracionreporte_seq'::regclass) NOT NULL,
    urlservidor character varying(255) NOT NULL,
    usuario character varying(100),
    apikey character varying(100),
    denconfiguracion character varying(255) NOT NULL,
    autenticarapikey numeric(1,0) DEFAULT 1,
    usuariors character varying(100),
    contrasenna character varying(255),
    idsso character varying(100)
);


ALTER TABLE nom_configuracionreporte OWNER TO zeolides;

--
-- TOC entry 13509 (class 0 OID 0)
-- Dependencies: 3957
-- Name: COLUMN nom_configuracionreporte.urlservidor; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN nom_configuracionreporte.urlservidor IS 'URL del servidor Report Server';


--
-- TOC entry 13510 (class 0 OID 0)
-- Dependencies: 3957
-- Name: COLUMN nom_configuracionreporte.usuario; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN nom_configuracionreporte.usuario IS 'Usuario para conectarse por API Key al Report Server';


--
-- TOC entry 13511 (class 0 OID 0)
-- Dependencies: 3957
-- Name: COLUMN nom_configuracionreporte.apikey; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN nom_configuracionreporte.apikey IS 'Variable creada en Report Server que permite ejecutar reportes por URL sin tener que estar autenticado';


--
-- TOC entry 13512 (class 0 OID 0)
-- Dependencies: 3957
-- Name: COLUMN nom_configuracionreporte.denconfiguracion; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN nom_configuracionreporte.denconfiguracion IS 'Denominacion de la configuracion';


--
-- TOC entry 13513 (class 0 OID 0)
-- Dependencies: 3957
-- Name: COLUMN nom_configuracionreporte.autenticarapikey; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN nom_configuracionreporte.autenticarapikey IS '0-Autenticarse por usuario/contrasenna
1-Autenticarse por api key';


--
-- TOC entry 13514 (class 0 OID 0)
-- Dependencies: 3957
-- Name: COLUMN nom_configuracionreporte.usuariors; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN nom_configuracionreporte.usuariors IS 'Usuario para autenticarse al Report Server';


--
-- TOC entry 13515 (class 0 OID 0)
-- Dependencies: 3957
-- Name: COLUMN nom_configuracionreporte.contrasenna; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN nom_configuracionreporte.contrasenna IS 'Contraseña del usuario para autenticarse al Report Server';


--
-- TOC entry 13516 (class 0 OID 0)
-- Dependencies: 3957
-- Name: COLUMN nom_configuracionreporte.idsso; Type: COMMENT; Schema: mod_integracionreporte; Owner: zeolides
--

COMMENT ON COLUMN nom_configuracionreporte.idsso IS 'Id SSO del script en el Report Server para autenticarse al servidor';


--
-- TOC entry 13359 (class 2606 OID 81953)
-- Name: dat_reporte_pkey; Type: CONSTRAINT; Schema: mod_integracionreporte; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_reporte
    ADD CONSTRAINT dat_reporte_pkey PRIMARY KEY (idreporte);


--
-- TOC entry 13357 (class 2606 OID 81937)
-- Name: nom_configuracionreporte_pkey; Type: CONSTRAINT; Schema: mod_integracionreporte; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_configuracionreporte
    ADD CONSTRAINT nom_configuracionreporte_pkey PRIMARY KEY (idconfiguracion);


--
-- TOC entry 13361 (class 2606 OID 475151)
-- Name: pk_reportefiltro; Type: CONSTRAINT; Schema: mod_integracionreporte; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY dat_reportefiltro
    ADD CONSTRAINT pk_reportefiltro PRIMARY KEY (idfiltro);


--
-- TOC entry 13367 (class 2606 OID 704547)
-- Name: pk_reportefiltronomenclador; Type: CONSTRAINT; Schema: mod_integracionreporte; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY dat_reportefiltronomenclador
    ADD CONSTRAINT pk_reportefiltronomenclador PRIMARY KEY (idfiltro);


--
-- TOC entry 13363 (class 2606 OID 475161)
-- Name: pk_reportefiltronumerico; Type: CONSTRAINT; Schema: mod_integracionreporte; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_reportefiltronumerico
    ADD CONSTRAINT pk_reportefiltronumerico PRIMARY KEY (idfiltro);


--
-- TOC entry 13365 (class 2606 OID 475171)
-- Name: pk_reportefiltrotexto; Type: CONSTRAINT; Schema: mod_integracionreporte; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_reportefiltrotexto
    ADD CONSTRAINT pk_reportefiltrotexto PRIMARY KEY (idfiltro);


--
-- TOC entry 13368 (class 2606 OID 81954)
-- Name: fk_configuracionreporte_reporte; Type: FK CONSTRAINT; Schema: mod_integracionreporte; Owner: zeolides
--

ALTER TABLE ONLY dat_reporte
    ADD CONSTRAINT fk_configuracionreporte_reporte FOREIGN KEY (idconfiguracion) REFERENCES nom_configuracionreporte(idconfiguracion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 13369 (class 2606 OID 475152)
-- Name: fk_reporte_reportefiltro; Type: FK CONSTRAINT; Schema: mod_integracionreporte; Owner: postgres
--

ALTER TABLE ONLY dat_reportefiltro
    ADD CONSTRAINT fk_reporte_reportefiltro FOREIGN KEY (idreporte) REFERENCES dat_reporte(idreporte) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 13372 (class 2606 OID 704548)
-- Name: fk_reportefiltro_reportefiltronomenclador; Type: FK CONSTRAINT; Schema: mod_integracionreporte; Owner: postgres
--

ALTER TABLE ONLY dat_reportefiltronomenclador
    ADD CONSTRAINT fk_reportefiltro_reportefiltronomenclador FOREIGN KEY (idfiltro) REFERENCES dat_reportefiltro(idfiltro) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 13370 (class 2606 OID 475162)
-- Name: fk_reportefiltro_reportefiltronumerico; Type: FK CONSTRAINT; Schema: mod_integracionreporte; Owner: zeolides
--

ALTER TABLE ONLY dat_reportefiltronumerico
    ADD CONSTRAINT fk_reportefiltro_reportefiltronumerico FOREIGN KEY (idfiltro) REFERENCES dat_reportefiltro(idfiltro) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 13371 (class 2606 OID 475172)
-- Name: fk_reportefiltro_reportefiltrotexto; Type: FK CONSTRAINT; Schema: mod_integracionreporte; Owner: zeolides
--

ALTER TABLE ONLY dat_reportefiltrotexto
    ADD CONSTRAINT fk_reportefiltro_reportefiltrotexto FOREIGN KEY (idfiltro) REFERENCES dat_reportefiltro(idfiltro) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2021-03-25 22:19:28

--
-- PostgreSQL database dump complete
--

