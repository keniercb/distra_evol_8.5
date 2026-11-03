--.
SET search_path = mod_estructuracomp, pg_catalog;
-- TOC entry 8143 (class 2606 OID 196997)
-- Dependencies: 1714 1714 1714
-- Name: dat_medio_pkey; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
SET search_path = mod_estructuracomp, pg_catalog;

ALTER TABLE ONLY dat_medio
    ADD CONSTRAINT dat_medio_pkey PRIMARY KEY (idmedio, idproyecto);


--
-- TOC entry 8177 (class 2606 OID 196999)
-- Dependencies: 1738 1738
-- Name: nom_estado_pkey; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_estado
    ADD CONSTRAINT nom_estado_pkey PRIMARY KEY (idestado);


--
-- TOC entry 8121 (class 2606 OID 197001)
-- Dependencies: 1706 1706 1706
-- Name: pk_cargo; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_cargo
    ADD CONSTRAINT pk_cargo PRIMARY KEY (idcargo, idproyecto);


--
-- TOC entry 8691 (class 0 OID 0)
-- Dependencies: 8121
-- Name: CONSTRAINT pk_cargo ON dat_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_cargo ON dat_cargo IS 'Identificador único para cada tupla de la tabla “dat_cargo”.';


--
-- TOC entry 8125 (class 2606 OID 197003)
-- Dependencies: 1708 1708 1708
-- Name: pk_cargomilitar; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_cargomilitar
    ADD CONSTRAINT pk_cargomilitar PRIMARY KEY (idcargo, idproyecto);


--
-- TOC entry 8692 (class 0 OID 0)
-- Dependencies: 8125
-- Name: CONSTRAINT pk_cargomilitar ON dat_cargomilitar; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_cargomilitar ON dat_cargomilitar IS 'Identificador único para cada tupla de la tabla “dat_cargomilitar”.';


--
-- TOC entry 8158 (class 2606 OID 197005)
-- Dependencies: 1725 1725
-- Name: pk_categocup; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_categocup
    ADD CONSTRAINT pk_categocup PRIMARY KEY (idcategocup);


--
-- TOC entry 8693 (class 0 OID 0)
-- Dependencies: 8158
-- Name: CONSTRAINT pk_categocup ON nom_categocup; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_categocup ON nom_categocup IS 'Identificador único para cada tupla de la tabla “nom_categocup”.';


--
-- TOC entry 8160 (class 2606 OID 197007)
-- Dependencies: 1727 1727
-- Name: pk_categoria; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_categoria
    ADD CONSTRAINT pk_categoria PRIMARY KEY (idcategoria);


--
-- TOC entry 8694 (class 0 OID 0)
-- Dependencies: 8160
-- Name: CONSTRAINT pk_categoria ON nom_categoria; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_categoria ON nom_categoria IS 'Identificador único para cada tupla de la tabla “nom_categoria”.';


--
-- TOC entry 8162 (class 2606 OID 197009)
-- Dependencies: 1728 1728
-- Name: pk_categoriamilitar; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_categoriamilitar
    ADD CONSTRAINT pk_categoriamilitar PRIMARY KEY (idcategoriamilitar);


--
-- TOC entry 8212 (class 2606 OID 259466)
-- Dependencies: 2244 2244
-- Name: pk_complemento; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY aux_complemento
    ADD CONSTRAINT pk_complemento PRIMARY KEY (idcomplemento);


--
-- TOC entry 8695 (class 0 OID 0)
-- Dependencies: 8212
-- Name: CONSTRAINT pk_complemento ON aux_complemento; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_complemento ON aux_complemento IS 'identificador unico para la tabla aux_complemento';

--
-- TOC entry 8275 (class 2606 OID 441910)
-- Dependencies: 2247 2247
-- Name: nom_firma_pkey; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: -; Tablespace: 
--

ALTER TABLE ONLY nom_firma
    ADD CONSTRAINT nom_firma_pkey PRIMARY KEY (idfirma);

--
-- TOC entry 8165 (class 2606 OID 197011)
-- Dependencies: 1730 1730
-- Name: pk_concepto; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_concepto
    ADD CONSTRAINT pk_concepto PRIMARY KEY (idconcepto);


--
-- TOC entry 8696 (class 0 OID 0)
-- Dependencies: 8165
-- Name: CONSTRAINT pk_concepto ON nom_concepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_concepto ON nom_concepto IS 'Identificador único para cada tupla de la tabla “nom_concepto”.';


--
-- TOC entry 8210 (class 2606 OID 251280)
-- Dependencies: 2243 2243
-- Name: pk_conceptocondicion; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_conceptocondicion
    ADD CONSTRAINT pk_conceptocondicion PRIMARY KEY (idconceptocondicion);


--
-- TOC entry 8697 (class 0 OID 0)
-- Dependencies: 8210
-- Name: CONSTRAINT pk_conceptocondicion ON dat_conceptocondicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_conceptocondicion ON dat_conceptocondicion IS 'Identificador único para cada tupla de la tabla “nom_conceptocondicion”.';


--
-- TOC entry 8167 (class 2606 OID 197013)
-- Dependencies: 1732 1732
-- Name: pk_conceptopropiedad; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_conceptopropiedad
    ADD CONSTRAINT pk_conceptopropiedad PRIMARY KEY (idconceptopropiedad);


--
-- TOC entry 8698 (class 0 OID 0)
-- Dependencies: 8167
-- Name: CONSTRAINT pk_conceptopropiedad ON nom_conceptopropiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_conceptopropiedad ON nom_conceptopropiedad IS 'Identificador único para cada tupla de la tabla “nom_conceptopropiedad”.';


--
-- TOC entry 8169 (class 2606 OID 197015)
-- Dependencies: 1733 1733 1733
-- Name: pk_condicion; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_condicion
    ADD CONSTRAINT pk_condicion PRIMARY KEY (idnomcargo, idgrupocomplejidad);


--
-- TOC entry 8699 (class 0 OID 0)
-- Dependencies: 8169
-- Name: CONSTRAINT pk_condicion ON nom_condicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_condicion ON nom_condicion IS 'Identificador �nico para cada tupla de la tabla �nom_condicion�.';


--
-- TOC entry 8123 (class 2606 OID 197017)
-- Dependencies: 1707 1707 1707
-- Name: pk_datcargocivil; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_cargocivil
    ADD CONSTRAINT pk_datcargocivil PRIMARY KEY (idcargo, idproyecto);


--
-- TOC entry 8700 (class 0 OID 0)
-- Dependencies: 8123
-- Name: CONSTRAINT pk_datcargocivil ON dat_cargocivil; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_datcargocivil ON dat_cargocivil IS 'Identificador único para cada tupla de la tabla “dat_cargocivil”.';


--
-- TOC entry 8173 (class 2606 OID 197019)
-- Dependencies: 1735 1735
-- Name: pk_dominio; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_dominio
    ADD CONSTRAINT pk_dominio PRIMARY KEY (iddominio);


--
-- TOC entry 8175 (class 2606 OID 197021)
-- Dependencies: 1737 1737
-- Name: pk_escalasalarial; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_escalasalarial
    ADD CONSTRAINT pk_escalasalarial PRIMARY KEY (idescalasalarial);


--
-- TOC entry 8701 (class 0 OID 0)
-- Dependencies: 8175
-- Name: CONSTRAINT pk_escalasalarial ON nom_escalasalarial; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_escalasalarial ON nom_escalasalarial IS 'Identificador único para cada tupla de la tabla “nom_escalasalarial”.';


--
-- TOC entry 8129 (class 2606 OID 197023)
-- Dependencies: 1709 1709 1709
-- Name: pk_estructura; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_estructura
    ADD CONSTRAINT pk_estructura PRIMARY KEY (idestructura, idproyecto);


--
-- TOC entry 8702 (class 0 OID 0)
-- Dependencies: 8129
-- Name: CONSTRAINT pk_estructura ON dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_estructura ON dat_estructura IS 'Identificador único para cada tupla de la tabla “dat_estructura”.';


--
-- TOC entry 8135 (class 2606 OID 197025)
-- Dependencies: 1710 1710 1710
-- Name: pk_estructuraop; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_estructuraop
    ADD CONSTRAINT pk_estructuraop PRIMARY KEY (idestructuraop, idproyecto);


--
-- TOC entry 8703 (class 0 OID 0)
-- Dependencies: 8135
-- Name: CONSTRAINT pk_estructuraop ON dat_estructuraop; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_estructuraop ON dat_estructuraop IS 'Identificador único para cada tupla de la tabla “dat_estructuraop”.';


--
-- TOC entry 8137 (class 2606 OID 197027)
-- Dependencies: 1711 1711 1711 1711
-- Name: pk_filacortada; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_filacortada
    ADD CONSTRAINT pk_filacortada PRIMARY KEY (idfila, idreferencia, idproyecto);


--
-- TOC entry 8704 (class 0 OID 0)
-- Dependencies: 8137
-- Name: CONSTRAINT pk_filacortada ON dat_filacortada; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_filacortada ON dat_filacortada IS 'Identificador único para cada tupla de la tabla “dat_filacortada”.';


--
-- TOC entry 8184 (class 2606 OID 197029)
-- Dependencies: 1740 1740
-- Name: pk_filaestruc; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_filaestruc
    ADD CONSTRAINT pk_filaestruc PRIMARY KEY (idfila);


--
-- TOC entry 8705 (class 0 OID 0)
-- Dependencies: 8184
-- Name: CONSTRAINT pk_filaestruc ON nom_filaestruc; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_filaestruc ON nom_filaestruc IS 'Identificador único para cada tupla de la tabla “nom_filaestruc”.';


--
-- TOC entry 8186 (class 2606 OID 197031)
-- Dependencies: 1742 1742
-- Name: pk_grado; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_grado
    ADD CONSTRAINT pk_grado PRIMARY KEY (idgrado);


--
-- TOC entry 8706 (class 0 OID 0)
-- Dependencies: 8186
-- Name: CONSTRAINT pk_grado ON nom_grado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_grado ON nom_grado IS 'Identificador único para cada tupla de la tabla “nom_grado”.';


--
-- TOC entry 8139 (class 2606 OID 197033)
-- Dependencies: 1712 1712
-- Name: pk_grafica; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_grafica
    ADD CONSTRAINT pk_grafica PRIMARY KEY (idgrafica);


--
-- TOC entry 8707 (class 0 OID 0)
-- Dependencies: 8139
-- Name: CONSTRAINT pk_grafica ON dat_grafica; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_grafica ON dat_grafica IS 'Identificador único para cada tupla de la tabla “dat_grafica”.';


--
-- TOC entry 8141 (class 2606 OID 197035)
-- Dependencies: 1713 1713 1713
-- Name: pk_graficausuario; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_graficausuario
    ADD CONSTRAINT pk_graficausuario PRIMARY KEY (idgrafica, idusuario);


--
-- TOC entry 8188 (class 2606 OID 197037)
-- Dependencies: 1744 1744
-- Name: pk_grupocomplejidad; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_grupocomplejidad
    ADD CONSTRAINT pk_grupocomplejidad PRIMARY KEY (idgrupocomplejidad);


--
-- TOC entry 8708 (class 0 OID 0)
-- Dependencies: 8188
-- Name: CONSTRAINT pk_grupocomplejidad ON nom_grupocomplejidad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_grupocomplejidad ON nom_grupocomplejidad IS 'Identificador único para cada tupla de la tabla “nom_grupocomplejidad”.';


--
-- TOC entry 8190 (class 2606 OID 197039)
-- Dependencies: 1746 1746
-- Name: pk_icono; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_icono
    ADD CONSTRAINT pk_icono PRIMARY KEY (idicono);


--
-- TOC entry 8204 (class 2606 OID 197041)
-- Dependencies: 1755 1755
-- Name: pk_nom_subordinacion; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_subordinacion
    ADD CONSTRAINT pk_nom_subordinacion PRIMARY KEY (idnomsubordinacion);


--
-- TOC entry 8709 (class 0 OID 0)
-- Dependencies: 8204
-- Name: CONSTRAINT pk_nom_subordinacion ON nom_subordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_nom_subordinacion ON nom_subordinacion IS 'Identificador único para cada tupla de la tabla “nom_subordinacion”.';


--
-- TOC entry 8156 (class 2606 OID 197043)
-- Dependencies: 1723 1723
-- Name: pk_nomcargocivil; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_cargo
    ADD CONSTRAINT pk_nomcargocivil PRIMARY KEY (idnomcargo);


--
-- TOC entry 8710 (class 0 OID 0)
-- Dependencies: 8156
-- Name: CONSTRAINT pk_nomcargocivil ON nom_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_nomcargocivil ON nom_cargo IS 'Identificador único para cada tupla de la tabla “nom_cargo”.';


--
-- TOC entry 8194 (class 2606 OID 197045)
-- Dependencies: 1747 1747 1747
-- Name: pk_organo; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_organo
    ADD CONSTRAINT pk_organo PRIMARY KEY (idorgano, idconcepto);


--
-- TOC entry 8711 (class 0 OID 0)
-- Dependencies: 8194
-- Name: CONSTRAINT pk_organo ON nom_organo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_organo ON nom_organo IS 'Identificador único para cada tupla de la tabla “nom_organo”.';


--
-- TOC entry 8196 (class 2606 OID 197047)
-- Dependencies: 1749 1749
-- Name: pk_preparacion; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_preparacion
    ADD CONSTRAINT pk_preparacion PRIMARY KEY (idpreparacion);


--
-- TOC entry 8712 (class 0 OID 0)
-- Dependencies: 8196
-- Name: CONSTRAINT pk_preparacion ON nom_preparacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_preparacion ON nom_preparacion IS 'Identificador único para cada tupla de la tabla “nom_preparacion”.';


--
-- TOC entry 8198 (class 2606 OID 197049)
-- Dependencies: 1750 1750
-- Name: pk_propiedad; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_propiedad
    ADD CONSTRAINT pk_propiedad PRIMARY KEY (idpropiedad);


--
-- TOC entry 8713 (class 0 OID 0)
-- Dependencies: 8198
-- Name: CONSTRAINT pk_propiedad ON nom_propiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_propiedad ON nom_propiedad IS 'Identificador único para cada tupla de la tabla “nom_propiedad”.';


--
-- TOC entry 8147 (class 2606 OID 197051)
-- Dependencies: 1716 1716
-- Name: pk_proyecto; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_proyecto
    ADD CONSTRAINT pk_proyecto PRIMARY KEY (idproyecto);


--
-- TOC entry 8714 (class 0 OID 0)
-- Dependencies: 8147
-- Name: CONSTRAINT pk_proyecto ON dat_proyecto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_proyecto ON dat_proyecto IS 'Identificador único para cada tupla de la tabla “nom_proyecto”.';


--
-- TOC entry 8149 (class 2606 OID 197053)
-- Dependencies: 1717 1717 1717 1717
-- Name: pk_proyectousuario; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_proyectousuario
    ADD CONSTRAINT pk_proyectousuario PRIMARY KEY (idproyecto, idusuario, idresponsable);


--
-- TOC entry 8715 (class 0 OID 0)
-- Dependencies: 8149
-- Name: CONSTRAINT pk_proyectousuario ON dat_proyectousuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_proyectousuario ON dat_proyectousuario IS 'Identificador único para cada tupla de la tabla “dat_proyectousuario”.';


--
-- TOC entry 8200 (class 2606 OID 197055)
-- Dependencies: 1751 1751
-- Name: pk_relacion; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_relacion
    ADD CONSTRAINT pk_relacion PRIMARY KEY (idrelacion);


--
-- TOC entry 8716 (class 0 OID 0)
-- Dependencies: 8200
-- Name: CONSTRAINT pk_relacion ON nom_relacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_relacion ON nom_relacion IS 'Identificador único para cada tupla de la tabla “nom_relacion”.';


--
-- TOC entry 8202 (class 2606 OID 197057)
-- Dependencies: 1753 1753
-- Name: pk_salario; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_salario
    ADD CONSTRAINT pk_salario PRIMARY KEY (idsalario);


--
-- TOC entry 8717 (class 0 OID 0)
-- Dependencies: 8202
-- Name: CONSTRAINT pk_salario ON nom_salario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_salario ON nom_salario IS 'Identificador único para cada tupla de la tabla “nom_salario”.';


--
-- TOC entry 8151 (class 2606 OID 197059)
-- Dependencies: 1719 1719
-- Name: pk_subordinacion; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_subordinacion
    ADD CONSTRAINT pk_subordinacion PRIMARY KEY (idsubordinacion);


--
-- TOC entry 8718 (class 0 OID 0)
-- Dependencies: 8151
-- Name: CONSTRAINT pk_subordinacion ON dat_subordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_subordinacion ON dat_subordinacion IS 'Identificador único para cada tupla de la tabla “dat_subordinacion”.';


--
-- TOC entry 8206 (class 2606 OID 197061)
-- Dependencies: 1757 1757
-- Name: pk_tipoescala; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_tipoescala
    ADD CONSTRAINT pk_tipoescala PRIMARY KEY (idtipoescala);


--
-- TOC entry 8719 (class 0 OID 0)
-- Dependencies: 8206
-- Name: CONSTRAINT pk_tipoescala ON nom_tipoescala; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_tipoescala ON nom_tipoescala IS 'Identificador único para cada tupla de la tabla “nom_escala”.';


--
-- TOC entry 8208 (class 2606 OID 197063)
-- Dependencies: 1759 1759
-- Name: pk_tipomedio; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY nom_tipomedio
    ADD CONSTRAINT pk_tipomedio PRIMARY KEY (idtipomedio);


--
-- TOC entry 8720 (class 0 OID 0)
-- Dependencies: 8208
-- Name: CONSTRAINT pk_tipomedio ON nom_tipomedio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT pk_tipomedio ON nom_tipomedio IS 'Identificador único para cada tupla de la tabla “nom_tipomedio”.';


--
-- TOC entry 8153 (class 2606 OID 197065)
-- Dependencies: 1721 1721
-- Name: pk_usuarioconcepto; Type: CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

ALTER TABLE ONLY dat_usuarioconcepto
    ADD CONSTRAINT pk_usuarioconcepto PRIMARY KEY (idusuarioconcepto);


--
-- TOC entry 8170 (class 1259 OID 197066)
-- Dependencies: 1735
-- Name: idx_dominio_dominio; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_dominio_dominio ON nom_dominio USING btree (dominio);


--
-- TOC entry 8178 (class 1259 OID 197067)
-- Dependencies: 1740
-- Name: idx_dominiofila_filaestruc; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_dominiofila_filaestruc ON nom_filaestruc USING btree (dominiofila);


--
-- TOC entry 8119 (class 1259 OID 197068)
-- Dependencies: 1706
-- Name: idx_idcargo_cargo; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idcargo_cargo ON dat_cargo USING btree (idcargo);


--
-- TOC entry 8154 (class 1259 OID 197069)
-- Dependencies: 1723
-- Name: idx_idcargociv_cargocivil; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idcargociv_cargocivil ON nom_cargo USING btree (idnomcargo);


--
-- TOC entry 8163 (class 1259 OID 197070)
-- Dependencies: 1730
-- Name: idx_idconcepto_concepto; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idconcepto_concepto ON nom_concepto USING btree (idconcepto);


--
-- TOC entry 8130 (class 1259 OID 197071)
-- Dependencies: 1710
-- Name: idx_idconcepto_estructuraop; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idconcepto_estructuraop ON dat_estructuraop USING btree (idconcepto);


--
-- TOC entry 8191 (class 1259 OID 197072)
-- Dependencies: 1747
-- Name: idx_idconcepto_organo; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idconcepto_organo ON nom_organo USING btree (idconcepto);


--
-- TOC entry 8171 (class 1259 OID 197073)
-- Dependencies: 1735
-- Name: idx_iddominio_dominio; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_iddominio_dominio ON nom_dominio USING btree (iddominio);


--
-- TOC entry 8126 (class 1259 OID 197074)
-- Dependencies: 1709
-- Name: idx_idestructura_estructura; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idestructura_estructura ON dat_estructura USING btree (idestructura);


--
-- TOC entry 8131 (class 1259 OID 197075)
-- Dependencies: 1710
-- Name: idx_idestructuraop_estructuraop; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idestructuraop_estructuraop ON dat_estructuraop USING btree (idestructuraop);


--
-- TOC entry 8179 (class 1259 OID 197076)
-- Dependencies: 1740
-- Name: idx_idfila_filaestruc; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE UNIQUE INDEX idx_idfila_filaestruc ON nom_filaestruc USING btree (idfila);


--
-- TOC entry 8144 (class 1259 OID 197077)
-- Dependencies: 1714
-- Name: idx_idnommedio_medio; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idnommedio_medio ON dat_medio USING btree (idnommedio);


--
-- TOC entry 8127 (class 1259 OID 197078)
-- Dependencies: 1709
-- Name: idx_idorgano_estructura; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idorgano_estructura ON dat_estructura USING btree (idorgano);


--
-- TOC entry 8132 (class 1259 OID 197079)
-- Dependencies: 1710
-- Name: idx_idorgano_estructuraop; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idorgano_estructuraop ON dat_estructuraop USING btree (idorgano);


--
-- TOC entry 8192 (class 1259 OID 197080)
-- Dependencies: 1747
-- Name: idx_idorgano_organo; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idorgano_organo ON nom_organo USING btree (idorgano);


--
-- TOC entry 8180 (class 1259 OID 197081)
-- Dependencies: 1740
-- Name: idx_idpadre_filaestruc; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idpadre_filaestruc ON nom_filaestruc USING btree (idpadre);


--
-- TOC entry 8145 (class 1259 OID 197082)
-- Dependencies: 1716
-- Name: idx_idproyecto_proyecto; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_idproyecto_proyecto ON dat_proyecto USING btree (idproyecto);


--
-- TOC entry 8181 (class 1259 OID 197083)
-- Dependencies: 1740
-- Name: idx_lft_filaestruc; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_lft_filaestruc ON nom_filaestruc USING btree (lft);


--
-- TOC entry 8133 (class 1259 OID 197084)
-- Dependencies: 1710 1710
-- Name: idx_organo_concepto; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_organo_concepto ON dat_estructuraop USING btree (idorgano, idconcepto);


--
-- TOC entry 8182 (class 1259 OID 197085)
-- Dependencies: 1740
-- Name: idx_rgt_filaestruc; Type: INDEX; Schema: mod_estructuracomp; Owner: zeolides; Tablespace: 
--

CREATE INDEX idx_rgt_filaestruc ON nom_filaestruc USING btree (rgt);
--
-- 