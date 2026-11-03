--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.4
-- Dumped by pg_dump version 13.2

-- Started on 2021-08-05 15:12:09

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
-- TOC entry 16048 (class 0 OID 13516064)
-- Dependencies: 3702
-- Data for Name: dat_cartatecindustrial; Type: TABLE DATA; Schema: mod_planifindustrial; Owner: zeolides
--

INSERT INTO mod_planifindustrial.dat_cartatecindustrial (idcartatecindustrial, idindicadorsalida, idaprobacion, cantidad, denominacion, descripcion) VALUES (1, 41062, 4, 10.000000, 'Carta Prueba', 'Carta Prueba');
INSERT INTO mod_planifindustrial.dat_cartatecindustrial (idcartatecindustrial, idindicadorsalida, idaprobacion, cantidad, denominacion, descripcion) VALUES (2, 41130, 4, 100.000000, 'Carta jabón', 'Carta jabón');
INSERT INTO mod_planifindustrial.dat_cartatecindustrial (idcartatecindustrial, idindicadorsalida, idaprobacion, cantidad, denominacion, descripcion) VALUES (3, 41130, 1, 100.000000, 'carata espuma', 'nnh');


--
-- TOC entry 16047 (class 0 OID 13516060)
-- Dependencies: 3701
-- Data for Name: dat_cartatecindustrialactividad; Type: TABLE DATA; Schema: mod_planifindustrial; Owner: zeolides
--

INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (1, 1, 4);
INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (2, 2, 5);
INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (3, 2, 6);
INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (4, 2, 8);
INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (5, 2, 9);
INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (6, 2, 12);
INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (7, 3, 15);
INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (8, 3, 8);
INSERT INTO mod_planifindustrial.dat_cartatecindustrialactividad (idcartatecindustrialactividad, idcartatecindustrial, idactividad) VALUES (9, 3, 7);


--
-- TOC entry 16046 (class 0 OID 13516055)
-- Dependencies: 3700
-- Data for Name: dat_produccionindustrial; Type: TABLE DATA; Schema: mod_planifindustrial; Owner: zeolides
--

INSERT INTO mod_planifindustrial.dat_produccionindustrial (idproduccionindustrial, idcartatecindustrial, identidad, idejercicio, denominacion, valor, idaprobacion) VALUES (4, 2, 200531039, 1, 'Producción de jabón', 2.000000, 3);
INSERT INTO mod_planifindustrial.dat_produccionindustrial (idproduccionindustrial, idcartatecindustrial, identidad, idejercicio, denominacion, valor, idaprobacion) VALUES (6, 2, 200531039, 2, 'Plan de Producción de Jabón Rexona', 200.000000, 4);
INSERT INTO mod_planifindustrial.dat_produccionindustrial (idproduccionindustrial, idcartatecindustrial, identidad, idejercicio, denominacion, valor, idaprobacion) VALUES (7, 3, 200531039, 2, 'espuma', 4.000000, 1);


--
-- TOC entry 16045 (class 0 OID 13516049)
-- Dependencies: 3699
-- Data for Name: dat_actividadentidadindustrial; Type: TABLE DATA; Schema: mod_planifindustrial; Owner: zeolides
--

INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (3, 4, 2, 0.0200, 1, 2);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (4, 4, 3, 0.0200, 1, 3);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (5, 4, 4, 0.0200, 1, 4);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (6, 4, 5, 0.0200, 1, 5);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (7, 4, 6, 0.0200, 1, 6);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (22, 6, 2, 2.0000, 1, 9);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (23, 6, 3, 2.0000, 1, 10);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (24, 6, 4, 2.0000, 1, 8);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (25, 6, 5, 2.0000, 1, 11);
INSERT INTO mod_planifindustrial.dat_actividadentidadindustrial (idactividadentidadindustrial, idproduccionindustrial, idcartatecindustrialactividad, nivelactividadindustrial, version, idactividadentidad) VALUES (26, 6, 6, 2.0000, 1, 12);


--
-- TOC entry 16054 (class 0 OID 0)
-- Dependencies: 3696
-- Name: sec_actividadentidadindustrial_seq; Type: SEQUENCE SET; Schema: mod_planifindustrial; Owner: zeolides
--

SELECT pg_catalog.setval('mod_planifindustrial.sec_actividadentidadindustrial_seq', 29, true);


--
-- TOC entry 16055 (class 0 OID 0)
-- Dependencies: 3698
-- Name: sec_cartatecindustrial_seq; Type: SEQUENCE SET; Schema: mod_planifindustrial; Owner: zeolides
--

SELECT pg_catalog.setval('mod_planifindustrial.sec_cartatecindustrial_seq', 3, true);


--
-- TOC entry 16056 (class 0 OID 0)
-- Dependencies: 3695
-- Name: sec_cartatecindustrialactividad_seq; Type: SEQUENCE SET; Schema: mod_planifindustrial; Owner: zeolides
--

SELECT pg_catalog.setval('mod_planifindustrial.sec_cartatecindustrialactividad_seq', 9, true);


--
-- TOC entry 16057 (class 0 OID 0)
-- Dependencies: 3697
-- Name: sec_produccionindustrial_seq; Type: SEQUENCE SET; Schema: mod_planifindustrial; Owner: zeolides
--

SELECT pg_catalog.setval('mod_planifindustrial.sec_produccionindustrial_seq', 7, true);


-- Completed on 2021-08-05 15:14:22

--
-- PostgreSQL database dump complete
--

