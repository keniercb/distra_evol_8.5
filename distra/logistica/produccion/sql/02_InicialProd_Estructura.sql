--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.1
-- Dumped by pg_dump version 9.4.1
-- Started on 2022-02-09 09:24:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 36 (class 2615 OID 1378026)
-- Name: mod_logproduccion; Type: SCHEMA; Schema: -; Owner: zeolides
--

CREATE SCHEMA mod_logproduccion;


ALTER SCHEMA mod_logproduccion OWNER TO zeolides;

SET search_path = mod_logproduccion, pg_catalog;

--
-- TOC entry 2527 (class 1259 OID 1389830)
-- Name: sec_confproduccion_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_confproduccion_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 1999999999
    CACHE 1;


ALTER TABLE sec_confproduccion_seq OWNER TO zeolides;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 2528 (class 1259 OID 1389832)
-- Name: conf_almacenes; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE conf_almacenes (
    identidad numeric(19,0),
    idalmacen numeric(19,0),
    idconfalmacen numeric(19,0) DEFAULT nextval('sec_confproduccion_seq'::regclass) NOT NULL,
    almacenmpm numeric(1,0) DEFAULT 0,
    almacenpt numeric(1,0) DEFAULT 0
);


ALTER TABLE conf_almacenes OWNER TO zeolides;

--
-- TOC entry 16953 (class 0 OID 0)
-- Dependencies: 2528
-- Name: COLUMN conf_almacenes.identidad; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN conf_almacenes.identidad IS 'Identificador de la entidad';


--
-- TOC entry 16954 (class 0 OID 0)
-- Dependencies: 2528
-- Name: COLUMN conf_almacenes.idalmacen; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN conf_almacenes.idalmacen IS 'Identificador del almacen';


--
-- TOC entry 16955 (class 0 OID 0)
-- Dependencies: 2528
-- Name: COLUMN conf_almacenes.almacenmpm; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN conf_almacenes.almacenmpm IS '0 => No es almacen de materias primas y materiales
1 => Es almacen de materias primas y materiales';


--
-- TOC entry 16956 (class 0 OID 0)
-- Dependencies: 2528
-- Name: COLUMN conf_almacenes.almacenpt; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN conf_almacenes.almacenpt IS '0 => No es almacen de produccion terminada
1 => Es almacen de prodiccion terminada';


--
-- TOC entry 2529 (class 1259 OID 1389838)
-- Name: conf_equipos; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE conf_equipos (
    idconfequipos numeric(19,0) DEFAULT nextval('sec_confproduccion_seq'::regclass) NOT NULL,
    identidad numeric(19,0),
    idregnumerico numeric(19,0)
);


ALTER TABLE conf_equipos OWNER TO zeolides;

--
-- TOC entry 2530 (class 1259 OID 1389842)
-- Name: sec_gasto_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_gasto_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_gasto_seq OWNER TO zeolides;

--
-- TOC entry 2531 (class 1259 OID 1389844)
-- Name: dat_gasto; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_gasto (
    idgasto numeric(19,0) DEFAULT nextval('sec_gasto_seq'::regclass) NOT NULL,
    idordenproduccion numeric(19,0),
    idtipogasto numeric(19,0),
    valor numeric(25,6) DEFAULT 0
);


ALTER TABLE dat_gasto OWNER TO zeolides;

--
-- TOC entry 2532 (class 1259 OID 1389849)
-- Name: sec_manoobra_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_manoobra_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_manoobra_seq OWNER TO zeolides;

--
-- TOC entry 2533 (class 1259 OID 1389851)
-- Name: dat_manoobra; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_manoobra (
    idmanoobra numeric(19,0) DEFAULT nextval('sec_manoobra_seq'::regclass) NOT NULL,
    idvaleproduccion numeric(19,0),
    idpersona numeric(19,0),
    cantidad numeric(25,6) DEFAULT 0
);


ALTER TABLE dat_manoobra OWNER TO zeolides;

--
-- TOC entry 2534 (class 1259 OID 1389856)
-- Name: sec_manoobraactividad_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_manoobraactividad_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_manoobraactividad_seq OWNER TO zeolides;

--
-- TOC entry 2535 (class 1259 OID 1389858)
-- Name: dat_manoobraactividad; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_manoobraactividad (
    idmanoobraactividad numeric(19,0) DEFAULT nextval('sec_manoobraactividad_seq'::regclass) NOT NULL,
    idmanoobra numeric(19,0),
    idcartatecindustrialactividad numeric(19,0),
    horas numeric(25,6) DEFAULT 0
);


ALTER TABLE dat_manoobraactividad OWNER TO zeolides;

--
-- TOC entry 2536 (class 1259 OID 1389863)
-- Name: sec_ordenmaterial_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_ordenmaterial_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_ordenmaterial_seq OWNER TO zeolides;

--
-- TOC entry 2537 (class 1259 OID 1389865)
-- Name: dat_ordenmateriales; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_ordenmateriales (
    idordenmateriales numeric(19,0) DEFAULT nextval('sec_ordenmaterial_seq'::regclass) NOT NULL,
    idordenproduccion numeric(19,0),
    idproducto numeric(19,0),
    cantidad numeric(25,6) DEFAULT 0 NOT NULL,
    solicitada numeric(25,6) DEFAULT 0 NOT NULL,
    entregada numeric(25,6) DEFAULT 0 NOT NULL
);


ALTER TABLE dat_ordenmateriales OWNER TO zeolides;

--
-- TOC entry 16957 (class 0 OID 0)
-- Dependencies: 2537
-- Name: COLUMN dat_ordenmateriales.cantidad; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN dat_ordenmateriales.cantidad IS 'Cantidad de materiales necesrios';


--
-- TOC entry 16958 (class 0 OID 0)
-- Dependencies: 2537
-- Name: COLUMN dat_ordenmateriales.solicitada; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN dat_ordenmateriales.solicitada IS 'Cantidad en Solicitudes de Entrega aprobadas';


--
-- TOC entry 16959 (class 0 OID 0)
-- Dependencies: 2537
-- Name: COLUMN dat_ordenmateriales.entregada; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN dat_ordenmateriales.entregada IS 'Cantidad en Vales de Entrega contabilizados';


--
-- TOC entry 2538 (class 1259 OID 1389869)
-- Name: dat_ordenproduccion; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_ordenproduccion (
    idordenproduccion numeric(19,0) NOT NULL,
    idcartatecnologica numeric(19,0),
    idcentrocosto numeric(19,0),
    cantidad numeric(25,6) DEFAULT 0,
    nrolote character varying(30),
    idalmacendestino numeric(19,0),
    idcliente numeric(19,0),
    idcontrato numeric(19,0),
    fechainicio date,
    fechafin date,
    cerradopor numeric(19,0),
    fechacierre date,
    idnomconcepto numeric(19,0)
);


ALTER TABLE dat_ordenproduccion OWNER TO zeolides;

--
-- TOC entry 2539 (class 1259 OID 1389873)
-- Name: sec_dattipocontrolcalidadentidad_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_dattipocontrolcalidadentidad_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_dattipocontrolcalidadentidad_seq OWNER TO zeolides;

--
-- TOC entry 2540 (class 1259 OID 1389875)
-- Name: dat_tipocontrolcalidadentidad; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_tipocontrolcalidadentidad (
    idtipocontrolcalidadentidad numeric(19,0) DEFAULT nextval('sec_dattipocontrolcalidadentidad_seq'::regclass) NOT NULL,
    idestructuracomun numeric(19,0),
    idtipocontrolcalidad numeric(19,0)
);
ALTER TABLE ONLY dat_tipocontrolcalidadentidad ALTER COLUMN idtipocontrolcalidadentidad SET STATISTICS 0;
ALTER TABLE ONLY dat_tipocontrolcalidadentidad ALTER COLUMN idestructuracomun SET STATISTICS 0;
ALTER TABLE ONLY dat_tipocontrolcalidadentidad ALTER COLUMN idtipocontrolcalidad SET STATISTICS 0;


ALTER TABLE dat_tipocontrolcalidadentidad OWNER TO zeolides;

--
-- TOC entry 16960 (class 0 OID 0)
-- Dependencies: 2540
-- Name: TABLE dat_tipocontrolcalidadentidad; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON TABLE dat_tipocontrolcalidadentidad IS 'Almacena las tipocontrolcalidad entidad ';


--
-- TOC entry 16961 (class 0 OID 0)
-- Dependencies: 2540
-- Name: COLUMN dat_tipocontrolcalidadentidad.idtipocontrolcalidadentidad; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN dat_tipocontrolcalidadentidad.idtipocontrolcalidadentidad IS 'Identificador de la tabla.';


--
-- TOC entry 16962 (class 0 OID 0)
-- Dependencies: 2540
-- Name: COLUMN dat_tipocontrolcalidadentidad.idestructuracomun; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN dat_tipocontrolcalidadentidad.idestructuracomun IS 'Identificador que proviene del esquema mod_estructuracomp.nom_filaestruc';


--
-- TOC entry 16963 (class 0 OID 0)
-- Dependencies: 2540
-- Name: COLUMN dat_tipocontrolcalidadentidad.idtipocontrolcalidad; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN dat_tipocontrolcalidadentidad.idtipocontrolcalidad IS 'Identificador que proviene del esquema mod_logproduccion.nom_tipocontrolcalidad';


--
-- TOC entry 2541 (class 1259 OID 1389879)
-- Name: sec_nomtipogasto_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_nomtipogasto_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 1999999999
    CACHE 1;


ALTER TABLE sec_nomtipogasto_seq OWNER TO zeolides;

--
-- TOC entry 2542 (class 1259 OID 1389881)
-- Name: dat_tipogastoentidad; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_tipogastoentidad (
    idtipogasto numeric(19,0),
    identidad numeric(19,0),
    idtipogastoentidad numeric(19,0) DEFAULT nextval('sec_nomtipogasto_seq'::regclass) NOT NULL
);


ALTER TABLE dat_tipogastoentidad OWNER TO zeolides;

--
-- TOC entry 2543 (class 1259 OID 1389885)
-- Name: sec_valeequipo_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_valeequipo_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_valeequipo_seq OWNER TO zeolides;

--
-- TOC entry 2544 (class 1259 OID 1389887)
-- Name: dat_valeequipos; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_valeequipos (
    idvaleequipos numeric(19,0) DEFAULT nextval('sec_valeequipo_seq'::regclass) NOT NULL,
    idvaleproduccion numeric(19,0),
    idregnumerico numeric(19,0),
    unidadesproducidas numeric(25,6),
    horastrabajo numeric(25,2)
);


ALTER TABLE dat_valeequipos OWNER TO zeolides;

--
-- TOC entry 2545 (class 1259 OID 1389891)
-- Name: sec_valematerial_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_valematerial_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_valematerial_seq OWNER TO zeolides;

--
-- TOC entry 2546 (class 1259 OID 1389893)
-- Name: dat_valemateriales; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_valemateriales (
    idmaterialesvaleproduccion numeric(19,0) DEFAULT nextval('sec_valematerial_seq'::regclass) NOT NULL,
    idvaleproduccion numeric(19,0),
    idproducto numeric(19,0),
    cantidaddemandada numeric(25,6),
    cantidad numeric(25,6)
);


ALTER TABLE dat_valemateriales OWNER TO zeolides;

--
-- TOC entry 2547 (class 1259 OID 1389897)
-- Name: dat_valeproduccion; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_valeproduccion (
    idvaleproduccion numeric(19,0) NOT NULL,
    cantidad numeric(25,6),
    idturnotrabajo numeric(19,0),
    idordenproduccion numeric(19,0)
);


ALTER TABLE dat_valeproduccion OWNER TO zeolides;

--
-- TOC entry 4646 (class 1259 OID 1421328)
-- Name: sec_valeproducto_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_valeproducto_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_valeproducto_seq OWNER TO zeolides;

--
-- TOC entry 4647 (class 1259 OID 1421330)
-- Name: dat_valeproductos; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE dat_valeproductos (
    idvaleproducto numeric(19,0) DEFAULT nextval('sec_valeproducto_seq'::regclass) NOT NULL,
    idvaleproduccion numeric(19,0) NOT NULL,
    idindicador numeric(19,0) NOT NULL,
    cantidad numeric(25,6) DEFAULT 0,
    iddeposito numeric(19,0) NOT NULL
);


ALTER TABLE dat_valeproductos OWNER TO zeolides;

--
-- TOC entry 2548 (class 1259 OID 1389900)
-- Name: sec_tipocontrolcalidad_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_tipocontrolcalidad_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_tipocontrolcalidad_seq OWNER TO zeolides;

--
-- TOC entry 2549 (class 1259 OID 1389902)
-- Name: nom_tipocontrolcalidad; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE nom_tipocontrolcalidad (
    idtipocontrolcalidad numeric(19,0) DEFAULT nextval('sec_tipocontrolcalidad_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    estado numeric(1,0) DEFAULT 1,
    fechainicio date,
    fechafin date,
    idunidadmedida numeric(19,0)
);


ALTER TABLE nom_tipocontrolcalidad OWNER TO zeolides;

--
-- TOC entry 16965 (class 0 OID 0)
-- Dependencies: 2549
-- Name: TABLE nom_tipocontrolcalidad; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON TABLE nom_tipocontrolcalidad IS 'En esta tabla se refleja los diferentes tipos de tipocontrolcalidad entre área';


--
-- TOC entry 16966 (class 0 OID 0)
-- Dependencies: 2549
-- Name: COLUMN nom_tipocontrolcalidad.idtipocontrolcalidad; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN nom_tipocontrolcalidad.idtipocontrolcalidad IS 'Identificador  único para cada tupla de la tabla nom_tipocontrolcalidad.';


--
-- TOC entry 16967 (class 0 OID 0)
-- Dependencies: 2549
-- Name: COLUMN nom_tipocontrolcalidad.denominacion; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN nom_tipocontrolcalidad.denominacion IS 'Nombre del tipo de tipocontrolcalidad.';


--
-- TOC entry 16968 (class 0 OID 0)
-- Dependencies: 2549
-- Name: COLUMN nom_tipocontrolcalidad.estado; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN nom_tipocontrolcalidad.estado IS 'Activo, inactivo.';


--
-- TOC entry 16969 (class 0 OID 0)
-- Dependencies: 2549
-- Name: COLUMN nom_tipocontrolcalidad.fechainicio; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN nom_tipocontrolcalidad.fechainicio IS 'Almacena la fecha de inicio de un producto.';


--
-- TOC entry 16970 (class 0 OID 0)
-- Dependencies: 2549
-- Name: COLUMN nom_tipocontrolcalidad.fechafin; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN nom_tipocontrolcalidad.fechafin IS 'Almacena la fecha de fin de un producto.';


--
-- TOC entry 2550 (class 1259 OID 1389907)
-- Name: nom_tipogasto; Type: TABLE; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

CREATE TABLE nom_tipogasto (
    idtipogasto numeric(19,0) DEFAULT nextval('sec_nomtipogasto_seq'::regclass) NOT NULL,
    denominacion character varying(100),
    fechainicio date,
    fechafin date,
    estado numeric(1,0)
);


ALTER TABLE nom_tipogasto OWNER TO zeolides;

--
-- TOC entry 16971 (class 0 OID 0)
-- Dependencies: 2550
-- Name: COLUMN nom_tipogasto.estado; Type: COMMENT; Schema: mod_logproduccion; Owner: zeolides
--

COMMENT ON COLUMN nom_tipogasto.estado IS '0 Inactivo 1 Activo';


--
-- TOC entry 2551 (class 1259 OID 1389911)
-- Name: sec_datelementoop_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_datelementoop_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_datelementoop_seq OWNER TO zeolides;

--
-- TOC entry 2552 (class 1259 OID 1389913)
-- Name: sec_ordenactividad_seq; Type: SEQUENCE; Schema: mod_logproduccion; Owner: zeolides
--

CREATE SEQUENCE sec_ordenactividad_seq
    START WITH 1000000000
    INCREMENT BY 1
    MINVALUE 1000000000
    MAXVALUE 9999999999
    CACHE 1;


ALTER TABLE sec_ordenactividad_seq OWNER TO zeolides;

--
-- TOC entry 2553 (class 1259 OID 1389915)
-- Name: v_obtenercliente; Type: VIEW; Schema: mod_logproduccion; Owner: zeolides
--

CREATE VIEW v_obtenercliente AS
 SELECT a.idclientesproveedores AS idcliente,
    COALESCE(
        CASE
            WHEN ((a.nombre)::text <> ''::text) THEN a.nombre
            ELSE NULL::character varying
        END, (COALESCE(
        CASE
            WHEN (btrim(concat(b.codigo, '-', b.denominacion), '-'::text) <> ''::text) THEN btrim(concat(b.codigo, '-', b.denominacion), '-'::text)
            ELSE NULL::text
        END, btrim(concat(c.nombre, ' ', c.snombre, ' ', c.papel, ' ', c.sapel))))::character varying) AS cliente,
    a.direccion
   FROM ((mod_datosmaestros.nom_clientesproveedor a
     LEFT JOIN mod_estructuracomp.dat_estructura b ON ((b.idestructura = a.idestructura)))
     LEFT JOIN mod_persona.dat_persona c ON ((c.idpersona = a.idpersona)));


ALTER TABLE v_obtenercliente OWNER TO zeolides;

--
-- TOC entry 16740 (class 2606 OID 1403275)
-- Name: conf_almacenes_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY conf_almacenes
    ADD CONSTRAINT conf_almacenes_pkey PRIMARY KEY (idconfalmacen);


--
-- TOC entry 16742 (class 2606 OID 1403277)
-- Name: conf_equipos_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY conf_equipos
    ADD CONSTRAINT conf_equipos_pkey PRIMARY KEY (idconfequipos);


--
-- TOC entry 16750 (class 2606 OID 1403279)
-- Name: dat_ordenmateriales_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_ordenmateriales
    ADD CONSTRAINT dat_ordenmateriales_pkey PRIMARY KEY (idordenmateriales);


--
-- TOC entry 16752 (class 2606 OID 1403281)
-- Name: dat_ordenproduccion_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_ordenproduccion
    ADD CONSTRAINT dat_ordenproduccion_pkey PRIMARY KEY (idordenproduccion);


--
-- TOC entry 16756 (class 2606 OID 1403283)
-- Name: dat_tipogastoentidad_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_tipogastoentidad
    ADD CONSTRAINT dat_tipogastoentidad_pkey PRIMARY KEY (idtipogastoentidad);


--
-- TOC entry 16760 (class 2606 OID 1403285)
-- Name: dat_valemateriales_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_valemateriales
    ADD CONSTRAINT dat_valemateriales_pkey PRIMARY KEY (idmaterialesvaleproduccion);


--
-- TOC entry 16762 (class 2606 OID 1403287)
-- Name: dat_valeproduccion_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_valeproduccion
    ADD CONSTRAINT dat_valeproduccion_pkey PRIMARY KEY (idvaleproduccion);


--
-- TOC entry 16768 (class 2606 OID 1421336)
-- Name: dat_valeproductos_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_valeproductos
    ADD CONSTRAINT dat_valeproductos_pkey PRIMARY KEY (idvaleproducto);


--
-- TOC entry 16766 (class 2606 OID 1403289)
-- Name: nom_tipogasto_pkey; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY nom_tipogasto
    ADD CONSTRAINT nom_tipogasto_pkey PRIMARY KEY (idtipogasto);


--
-- TOC entry 16744 (class 2606 OID 1403291)
-- Name: pk_gasto_idgasto; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_gasto
    ADD CONSTRAINT pk_gasto_idgasto PRIMARY KEY (idgasto);


--
-- TOC entry 16746 (class 2606 OID 1403293)
-- Name: pk_manoobra_idmanoobra; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_manoobra
    ADD CONSTRAINT pk_manoobra_idmanoobra PRIMARY KEY (idmanoobra);


--
-- TOC entry 16748 (class 2606 OID 1403295)
-- Name: pk_manoobraactividad_idmanoobraactividad; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_manoobraactividad
    ADD CONSTRAINT pk_manoobraactividad_idmanoobraactividad PRIMARY KEY (idmanoobraactividad);


--
-- TOC entry 16764 (class 2606 OID 1403297)
-- Name: pk_tipocontrolcalidad; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY nom_tipocontrolcalidad
    ADD CONSTRAINT pk_tipocontrolcalidad PRIMARY KEY (idtipocontrolcalidad);


--
-- TOC entry 16754 (class 2606 OID 1403299)
-- Name: pk_tipocontrolcalidadentidad; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_tipocontrolcalidadentidad
    ADD CONSTRAINT pk_tipocontrolcalidadentidad PRIMARY KEY (idtipocontrolcalidadentidad);


--
-- TOC entry 16758 (class 2606 OID 1403301)
-- Name: pk_valeequipos_idequipovaleproduccion; Type: CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides; Tablespace:
--

ALTER TABLE ONLY dat_valeequipos
    ADD CONSTRAINT pk_valeequipos_idequipovaleproduccion PRIMARY KEY (idvaleequipos);


--
-- TOC entry 16770 (class 2606 OID 1414414)
-- Name: conf_almacenes_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY conf_almacenes
    ADD CONSTRAINT conf_almacenes_fk FOREIGN KEY (identidad) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);


--
-- TOC entry 16769 (class 2606 OID 1414419)
-- Name: conf_almacenes_fk1; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY conf_almacenes
    ADD CONSTRAINT conf_almacenes_fk1 FOREIGN KEY (idalmacen) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);


--
-- TOC entry 16772 (class 2606 OID 1414424)
-- Name: conf_equipos_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY conf_equipos
    ADD CONSTRAINT conf_equipos_fk FOREIGN KEY (identidad) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);


--
-- TOC entry 16771 (class 2606 OID 1414429)
-- Name: conf_equipos_fk1; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY conf_equipos
    ADD CONSTRAINT conf_equipos_fk1 FOREIGN KEY (idregnumerico) REFERENCES mod_logactivofijotangible.dat_registronumerico(idregnumerico);


--
-- TOC entry 16780 (class 2606 OID 1414434)
-- Name: dat_ordenmateriales_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_ordenmateriales
    ADD CONSTRAINT dat_ordenmateriales_fk FOREIGN KEY (idordenproduccion) REFERENCES dat_ordenproduccion(idordenproduccion) ON DELETE CASCADE;


--
-- TOC entry 16793 (class 2606 OID 1414439)
-- Name: dat_ordenmateriales_fk1; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_valemateriales
    ADD CONSTRAINT dat_ordenmateriales_fk1 FOREIGN KEY (idproducto) REFERENCES mod_logistica.dat_producto(idproducto) MATCH FULL;


--
-- TOC entry 16779 (class 2606 OID 1414444)
-- Name: dat_ordenmateriales_fk1; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_ordenmateriales
    ADD CONSTRAINT dat_ordenmateriales_fk1 FOREIGN KEY (idproducto) REFERENCES mod_logistica.dat_producto(idproducto) MATCH FULL;


--
-- TOC entry 16781 (class 2606 OID 1414449)
-- Name: dat_ordenproduccion_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_ordenproduccion
    ADD CONSTRAINT dat_ordenproduccion_fk FOREIGN KEY (idordenproduccion) REFERENCES mod_logistica.dat_documento(iddocumento) ON DELETE CASCADE;


--
-- TOC entry 16782 (class 2606 OID 1414454)
-- Name: dat_ordenproduccion_fk1; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_ordenproduccion
    ADD CONSTRAINT dat_ordenproduccion_fk1 FOREIGN KEY (idcentrocosto) REFERENCES mod_contabilidadcosto.nom_centrocosto(idcentrogrupo);


--
-- TOC entry 16783 (class 2606 OID 1414459)
-- Name: dat_ordenproduccion_fk2; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_ordenproduccion
    ADD CONSTRAINT dat_ordenproduccion_fk2 FOREIGN KEY (idcliente) REFERENCES mod_datosmaestros.nom_clientesproveedor(idclientesproveedores);


--
-- TOC entry 16784 (class 2606 OID 1414464)
-- Name: dat_ordenproduccion_fk5; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_ordenproduccion
    ADD CONSTRAINT dat_ordenproduccion_fk5 FOREIGN KEY (idalmacendestino) REFERENCES conf_almacenes(idconfalmacen) MATCH FULL;


--
-- TOC entry 16789 (class 2606 OID 1414469)
-- Name: dat_tipogastoentidad_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_tipogastoentidad
    ADD CONSTRAINT dat_tipogastoentidad_fk FOREIGN KEY (idtipogasto) REFERENCES nom_tipogasto(idtipogasto) ON DELETE CASCADE;


--
-- TOC entry 16788 (class 2606 OID 1414474)
-- Name: dat_tipogastoentidad_fk1; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_tipogastoentidad
    ADD CONSTRAINT dat_tipogastoentidad_fk1 FOREIGN KEY (identidad) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);


--
-- TOC entry 16792 (class 2606 OID 1414479)
-- Name: dat_valemateriales_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_valemateriales
    ADD CONSTRAINT dat_valemateriales_fk FOREIGN KEY (idvaleproduccion) REFERENCES dat_valeproduccion(idvaleproduccion) ON DELETE CASCADE;


--
-- TOC entry 16794 (class 2606 OID 1414484)
-- Name: dat_valeproduccion_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_valeproduccion
    ADD CONSTRAINT dat_valeproduccion_fk FOREIGN KEY (idvaleproduccion) REFERENCES mod_logistica.dat_documento(iddocumento) ON DELETE CASCADE;


--
-- TOC entry 16797 (class 2606 OID 1421358)
-- Name: dat_valeproductos_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_valeproductos
    ADD CONSTRAINT dat_valeproductos_fk FOREIGN KEY (idindicador) REFERENCES mod_datosmaestros.nom_indicador(idindicador);


--
-- TOC entry 16796 (class 2606 OID 1421395)
-- Name: dat_valeproductos_fk1; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_valeproductos
    ADD CONSTRAINT dat_valeproductos_fk1 FOREIGN KEY (idvaleproduccion) REFERENCES mod_logistica.dat_documento(iddocumento) ON DELETE CASCADE;


--
-- TOC entry 16798 (class 2606 OID 1421348)
-- Name: dat_valeproductos_fk2; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_valeproductos
    ADD CONSTRAINT dat_valeproductos_fk2 FOREIGN KEY (iddeposito) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);


--
-- TOC entry 16787 (class 2606 OID 1414489)
-- Name: fk_filaestruc_tipocontrolcalidadentidad; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_tipocontrolcalidadentidad
    ADD CONSTRAINT fk_filaestruc_tipocontrolcalidadentidad FOREIGN KEY (idestructuracomun) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);


--
-- TOC entry 16774 (class 2606 OID 1414494)
-- Name: fk_gasto_idordenproduccion; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_gasto
    ADD CONSTRAINT fk_gasto_idordenproduccion FOREIGN KEY (idordenproduccion) REFERENCES dat_ordenproduccion(idordenproduccion) ON DELETE CASCADE;


--
-- TOC entry 16776 (class 2606 OID 1414499)
-- Name: fk_gasto_idpersona; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_manoobra
    ADD CONSTRAINT fk_gasto_idpersona FOREIGN KEY (idpersona) REFERENCES mod_persona.dat_persona(idpersona) ON DELETE CASCADE;


--
-- TOC entry 16773 (class 2606 OID 1414504)
-- Name: fk_gasto_idtipogasto; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_gasto
    ADD CONSTRAINT fk_gasto_idtipogasto FOREIGN KEY (idtipogasto) REFERENCES nom_tipocontrolcalidad(idtipocontrolcalidad) MATCH FULL ON DELETE CASCADE;


--
-- TOC entry 16775 (class 2606 OID 1414509)
-- Name: fk_manoobra_idvaleproduccion; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_manoobra
    ADD CONSTRAINT fk_manoobra_idvaleproduccion FOREIGN KEY (idvaleproduccion) REFERENCES dat_valeproduccion(idvaleproduccion) ON DELETE CASCADE;


--
-- TOC entry 16778 (class 2606 OID 1414514)
-- Name: fk_manoobraactividad_idmanoobra; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_manoobraactividad
    ADD CONSTRAINT fk_manoobraactividad_idmanoobra FOREIGN KEY (idmanoobra) REFERENCES dat_manoobra(idmanoobra) ON DELETE CASCADE;


--
-- TOC entry 16785 (class 2606 OID 1414519)
-- Name: fk_ordenproduccion_idcartatecnologica; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_ordenproduccion
    ADD CONSTRAINT fk_ordenproduccion_idcartatecnologica FOREIGN KEY (idcartatecnologica) REFERENCES mod_planifindustrial.dat_cartatecindustrial(idcartatecindustrial);


--
-- TOC entry 16786 (class 2606 OID 1414524)
-- Name: fk_tipocontrolcalidad_tipocontrolcalidadentidad; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_tipocontrolcalidadentidad
    ADD CONSTRAINT fk_tipocontrolcalidad_tipocontrolcalidadentidad FOREIGN KEY (idtipocontrolcalidad) REFERENCES nom_tipocontrolcalidad(idtipocontrolcalidad) ON DELETE CASCADE;


--
-- TOC entry 16777 (class 2606 OID 1414529)
-- Name: fk_valeactividad_idcartatecindustrialactividad; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_manoobraactividad
    ADD CONSTRAINT fk_valeactividad_idcartatecindustrialactividad FOREIGN KEY (idcartatecindustrialactividad) REFERENCES mod_planifindustrial.dat_cartatecindustrialactividad(idcartatecindustrialactividad) ON DELETE CASCADE;


--
-- TOC entry 16791 (class 2606 OID 1414534)
-- Name: fk_valeequipos_idregnumerico; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_valeequipos
    ADD CONSTRAINT fk_valeequipos_idregnumerico FOREIGN KEY (idregnumerico) REFERENCES mod_logactivofijotangible.dat_regnumericoactivo(idregnumerico) MATCH FULL ON DELETE CASCADE;


--
-- TOC entry 16790 (class 2606 OID 1414539)
-- Name: fk_valeequipos_idvaleproduccion; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY dat_valeequipos
    ADD CONSTRAINT fk_valeequipos_idvaleproduccion FOREIGN KEY (idvaleproduccion) REFERENCES dat_valeproduccion(idvaleproduccion) ON DELETE CASCADE;


--
-- TOC entry 16795 (class 2606 OID 1421318)
-- Name: nom_tipocontrolcalidad_fk; Type: FK CONSTRAINT; Schema: mod_logproduccion; Owner: zeolides
--

ALTER TABLE ONLY nom_tipocontrolcalidad
    ADD CONSTRAINT nom_tipocontrolcalidad_fk FOREIGN KEY (idunidadmedida) REFERENCES mod_datosmaestros.nom_unidadmedida(idunidadmedida);


--
-- TOC entry 16964 (class 0 OID 0)
-- Dependencies: 4646
-- Name: sec_valeproducto_seq; Type: ACL; Schema: mod_logproduccion; Owner: zeolides
--

REVOKE ALL ON SEQUENCE sec_valeproducto_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sec_valeproducto_seq FROM zeolides;
GRANT ALL ON SEQUENCE sec_valeproducto_seq TO zeolides;


-- Completed on 2022-02-09 09:24:37

--
-- PostgreSQL database dump complete
--

