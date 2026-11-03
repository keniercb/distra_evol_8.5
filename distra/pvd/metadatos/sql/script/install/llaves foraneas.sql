
SET search_path = mod_estructuracomp, pg_catalog;
--TOC entry 8219 (class 2606 OID 197110)
-- Dependencies: 8120 1706 1706 1707 1707
-- Name: fk_cargo_cargocivil; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargocivil
    ADD CONSTRAINT fk_cargo_cargocivil FOREIGN KEY (idcargo, idproyecto) REFERENCES dat_cargo(idcargo, idproyecto) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8721 (class 0 OID 0)
-- Dependencies: 8219
-- Name: CONSTRAINT fk_cargo_cargocivil ON dat_cargocivil; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_cargo_cargocivil ON dat_cargocivil IS 'Limitación referencial entre la tabla “dat_cargocivil” y la tabla “dat_cargo” mediante los atributos “idcargo” e “idproyecto”.';


--
-- TOC entry 8221 (class 2606 OID 197115)
-- Dependencies: 8120 1706 1706 1708 1708
-- Name: fk_cargo_cargomilitar; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargomilitar
    ADD CONSTRAINT fk_cargo_cargomilitar FOREIGN KEY (idcargo, idproyecto) REFERENCES dat_cargo(idcargo, idproyecto) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8722 (class 0 OID 0)
-- Dependencies: 8221
-- Name: CONSTRAINT fk_cargo_cargomilitar ON dat_cargomilitar; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_cargo_cargomilitar ON dat_cargomilitar IS 'Limitación referencial entre la tabla “dat_cargomilitar” y la tabla “dat_cargo” mediante los atributos “idcargo” e “idproyecto”.';


--
-- TOC entry 8252 (class 2606 OID 197120)
-- Dependencies: 8155 1723 1733
-- Name: fk_cargo_condicion; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_condicion
    ADD CONSTRAINT fk_cargo_condicion FOREIGN KEY (idnomcargo) REFERENCES nom_cargo(idnomcargo) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8723 (class 0 OID 0)
-- Dependencies: 8252
-- Name: CONSTRAINT fk_cargo_condicion ON nom_condicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_cargo_condicion ON nom_condicion IS 'Limitaci?n referencial entre la  tabla ?nom_cargo? y la tabla ?nom_condicion? mediante el atributo ?idnomcargo?.';


--
-- TOC entry 8218 (class 2606 OID 197125)
-- Dependencies: 8157 1725 1707
-- Name: fk_categocup_cargocivil; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargocivil
    ADD CONSTRAINT fk_categocup_cargocivil FOREIGN KEY (idcategocup) REFERENCES nom_categocup(idcategocup) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8724 (class 0 OID 0)
-- Dependencies: 8218
-- Name: CONSTRAINT fk_categocup_cargocivil ON dat_cargocivil; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_categocup_cargocivil ON dat_cargocivil IS 'Limitación referencial entre la  tabla “dat_cargocivil” y la tabla “nom_categocup” mediante el atributo “idcategocup”.';


--
-- TOC entry 8247 (class 2606 OID 197130)
-- Dependencies: 8159 1727 1725
-- Name: fk_categoria_categocup; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_categocup
    ADD CONSTRAINT fk_categoria_categocup FOREIGN KEY (idcategoria) REFERENCES nom_categoria(idcategoria) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8725 (class 0 OID 0)
-- Dependencies: 8247
-- Name: CONSTRAINT fk_categoria_categocup ON nom_categocup; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_categoria_categocup ON nom_categocup IS 'Limitación referencial entre la  tabla “nom_categoria” y la tabla “nom_categocup” mediante el atributo “idcategoria”.';


--
-- TOC entry 8250 (class 2606 OID 197135)
-- Dependencies: 8164 1730 1732
-- Name: fk_concepto_conceptoconceptopropiedad; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_conceptopropiedad
    ADD CONSTRAINT fk_concepto_conceptoconceptopropiedad FOREIGN KEY (idconcepto) REFERENCES nom_concepto(idconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8726 (class 0 OID 0)
-- Dependencies: 8250
-- Name: CONSTRAINT fk_concepto_conceptoconceptopropiedad ON nom_conceptopropiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_conceptoconceptopropiedad ON nom_conceptopropiedad IS 'Limitación referencial entre la  tabla “nom_concepto” y la tabla “nom_conceptopropiedad” mediante el atributo “idconcepto”.';


--
-- TOC entry 8228 (class 2606 OID 197140)
-- Dependencies: 8164 1730 1709
-- Name: fk_concepto_estructura; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructura
    ADD CONSTRAINT fk_concepto_estructura FOREIGN KEY (idconcepto) REFERENCES nom_concepto(idconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8727 (class 0 OID 0)
-- Dependencies: 8228
-- Name: CONSTRAINT fk_concepto_estructura ON dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_estructura ON dat_estructura IS 'Limitación referencial entre la  tabla “dat_estructura” y la tabla “nom_concepto” mediante el atributo “idconcepto”.';


--
-- TOC entry 8232 (class 2606 OID 197145)
-- Dependencies: 8164 1730 1710
-- Name: fk_concepto_estructuraop; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructuraop
    ADD CONSTRAINT fk_concepto_estructuraop FOREIGN KEY (idconcepto) REFERENCES nom_concepto(idconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8728 (class 0 OID 0)
-- Dependencies: 8232
-- Name: CONSTRAINT fk_concepto_estructuraop ON dat_estructuraop; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_estructuraop ON dat_estructuraop IS 'Limitación referencial entre la  tabla “dat_estructuraop” y la tabla “nom_concepto” mediante el atributo “idconcepto”.';


--
-- TOC entry 8257 (class 2606 OID 197150)
-- Dependencies: 8164 1730 1740
-- Name: fk_concepto_filaestruc; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_filaestruc
    ADD CONSTRAINT fk_concepto_filaestruc FOREIGN KEY (idconcepto) REFERENCES nom_concepto(idconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8729 (class 0 OID 0)
-- Dependencies: 8257
-- Name: CONSTRAINT fk_concepto_filaestruc ON nom_filaestruc; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_filaestruc ON nom_filaestruc IS 'Limitación referencial entre la  tabla “nom_concepto” y la tabla “nom_filaestruc” mediante el atributo “idconcepto”.';


--
-- TOC entry 8248 (class 2606 OID 197155)
-- Dependencies: 8189 1746 1730
-- Name: fk_concepto_icono; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_concepto
    ADD CONSTRAINT fk_concepto_icono FOREIGN KEY (idicono) REFERENCES nom_icono(idicono);


--
-- TOC entry 8730 (class 0 OID 0)
-- Dependencies: 8248
-- Name: CONSTRAINT fk_concepto_icono ON nom_concepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_icono ON nom_concepto IS 'Limitación referencial entre la  tabla “nom_concepto” y la tabla “nom_icono” mediante el atributo “idicono”.';


--
-- TOC entry 8260 (class 2606 OID 197160)
-- Dependencies: 8164 1730 1747
-- Name: fk_concepto_organo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_organo
    ADD CONSTRAINT fk_concepto_organo FOREIGN KEY (idconcepto) REFERENCES nom_concepto(idconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8731 (class 0 OID 0)
-- Dependencies: 8260
-- Name: CONSTRAINT fk_concepto_organo ON nom_organo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_organo ON nom_organo IS 'Limitación referencial entre la  tabla “nom_concepto” y la tabla “nom_organo” mediante el atributo “idconcepto”.';


--
-- TOC entry 8262 (class 2606 OID 197165)
-- Dependencies: 8164 1730 1751
-- Name: fk_concepto_relacion_idhijo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_relacion
    ADD CONSTRAINT fk_concepto_relacion_idhijo FOREIGN KEY (idhijo) REFERENCES nom_concepto(idconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8732 (class 0 OID 0)
-- Dependencies: 8262
-- Name: CONSTRAINT fk_concepto_relacion_idhijo ON nom_relacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_relacion_idhijo ON nom_relacion IS 'Limitación referencial entre la  tabla “nom_relacion” y la tabla “nom_concepto” mediante el atributo “idhijo”.';


--
-- TOC entry 8261 (class 2606 OID 197170)
-- Dependencies: 8164 1730 1751
-- Name: fk_concepto_relacion_idpadre; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_relacion
    ADD CONSTRAINT fk_concepto_relacion_idpadre FOREIGN KEY (idpadre) REFERENCES nom_concepto(idconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8733 (class 0 OID 0)
-- Dependencies: 8261
-- Name: CONSTRAINT fk_concepto_relacion_idpadre ON nom_relacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_relacion_idpadre ON nom_relacion IS 'Limitación referencial entre la  tabla “nom_relacion” y la tabla “nom_concepto” mediante el atributo “idpadre”.';


--
-- TOC entry 8245 (class 2606 OID 197175)
-- Dependencies: 8164 1730 1721
-- Name: fk_concepto_usuarioconcepto; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_usuarioconcepto
    ADD CONSTRAINT fk_concepto_usuarioconcepto FOREIGN KEY (idconcepto) REFERENCES nom_concepto(idconcepto);


--
-- TOC entry 8734 (class 0 OID 0)
-- Dependencies: 8245
-- Name: CONSTRAINT fk_concepto_usuarioconcepto ON dat_usuarioconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_concepto_usuarioconcepto ON dat_usuarioconcepto IS 'Limitación referencial entre la  tabla “nom_concepto” y la tabla “dat_usuarioconcepto” mediante el atributo “idconcepto”.';


--
-- TOC entry 8253 (class 2606 OID 197180)
-- Dependencies: 8172 1735 1735
-- Name: fk_dominio_dominio_idpadre; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_dominio
    ADD CONSTRAINT fk_dominio_dominio_idpadre FOREIGN KEY (idpadre) REFERENCES nom_dominio(iddominio) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8735 (class 0 OID 0)
-- Dependencies: 8253
-- Name: CONSTRAINT fk_dominio_dominio_idpadre ON nom_dominio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_dominio_dominio_idpadre ON nom_dominio IS 'Limitación referencial entre la  tabla nom_dominio y la tabla nom_dominio mediante el atributo iddominio. ';


--
-- TOC entry 8227 (class 2606 OID 197185)
-- Dependencies: 8176 1738 1709
-- Name: fk_estado_estructura; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructura
    ADD CONSTRAINT fk_estado_estructura FOREIGN KEY (idestado) REFERENCES nom_estado(idestado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8736 (class 0 OID 0)
-- Dependencies: 8227
-- Name: CONSTRAINT fk_estado_estructura ON dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_estado_estructura ON dat_estructura IS 'Limitación referencial entre la tabla “nom_estado” y la tabla “dat_estructura” mediante el atributo “idestado”.';


--
-- TOC entry 8226 (class 2606 OID 197190)
-- Dependencies: 8189 1746 1709
-- Name: fk_estructura_icono; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructura
    ADD CONSTRAINT fk_estructura_icono FOREIGN KEY (idicono) REFERENCES nom_icono(idicono);


--
-- TOC entry 8737 (class 0 OID 0)
-- Dependencies: 8226
-- Name: CONSTRAINT fk_estructura_icono ON dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_estructura_icono ON dat_estructura IS 'Limitación referencial entre la  tabla "dat_estructura" y la tabla "nom_icono" mediante el atributo “idicono”.';


--
-- TOC entry 8217 (class 2606 OID 197195)
-- Dependencies: 8183 1740 1706
-- Name: fk_filaestruc_cargo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargo
    ADD CONSTRAINT fk_filaestruc_cargo FOREIGN KEY (idcargo) REFERENCES nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8738 (class 0 OID 0)
-- Dependencies: 8217
-- Name: CONSTRAINT fk_filaestruc_cargo ON dat_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_filaestruc_cargo ON dat_cargo IS 'Limitación referencial entre la  tabla “dat_cargo” y la tabla “nom_filaestruc” mediante el atributo “idfila”.
';


--
-- TOC entry 8225 (class 2606 OID 197200)
-- Dependencies: 8183 1740 1709
-- Name: fk_filaestruc_estructura; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructura
    ADD CONSTRAINT fk_filaestruc_estructura FOREIGN KEY (idestructura) REFERENCES nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8739 (class 0 OID 0)
-- Dependencies: 8225
-- Name: CONSTRAINT fk_filaestruc_estructura ON dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_filaestruc_estructura ON dat_estructura IS 'Limitación referencial entre la  tabla “nom_filaestruc” y la tabla “dat_estructura” mediante el atributo “idestructura”.';


--
-- TOC entry 8231 (class 2606 OID 197205)
-- Dependencies: 8183 1740 1710
-- Name: fk_filaestruc_estructuraop; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructuraop
    ADD CONSTRAINT fk_filaestruc_estructuraop FOREIGN KEY (idestructuraop) REFERENCES nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8740 (class 0 OID 0)
-- Dependencies: 8231
-- Name: CONSTRAINT fk_filaestruc_estructuraop ON dat_estructuraop; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_filaestruc_estructuraop ON dat_estructuraop IS 'Limitación referencial entre la  tabla “dat_estructuraop” y la tabla “nom_filaestruc” mediante el atributo “idfila”.';


--
-- TOC entry 8256 (class 2606 OID 197210)
-- Dependencies: 8183 1740 1740
-- Name: fk_filaestruc_filaestruc_idpadre; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_filaestruc
    ADD CONSTRAINT fk_filaestruc_filaestruc_idpadre FOREIGN KEY (idpadre) REFERENCES nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8741 (class 0 OID 0)
-- Dependencies: 8256
-- Name: CONSTRAINT fk_filaestruc_filaestruc_idpadre ON nom_filaestruc; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_filaestruc_filaestruc_idpadre ON nom_filaestruc IS 'Limitación referencial entre la  tabla “nom_concepto” y la tabla “nom_filaestruc” mediante el atributo “idpadre”.';


--
-- TOC entry 8239 (class 2606 OID 197215)
-- Dependencies: 8183 1740 1714
-- Name: fk_filaestruc_medio; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_medio
    ADD CONSTRAINT fk_filaestruc_medio FOREIGN KEY (idmedio) REFERENCES nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8742 (class 0 OID 0)
-- Dependencies: 8239
-- Name: CONSTRAINT fk_filaestruc_medio ON dat_medio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_filaestruc_medio ON dat_medio IS 'Limitación referencial entre la  tabla “dat_medio” y la tabla “nom_filaestruc” mediante el atributo “idfila”.';


--
-- TOC entry 8243 (class 2606 OID 197220)
-- Dependencies: 8183 1740 1719
-- Name: fk_filaestruc_subordinacion_idhijo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_subordinacion
    ADD CONSTRAINT fk_filaestruc_subordinacion_idhijo FOREIGN KEY (idhijo) REFERENCES nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8743 (class 0 OID 0)
-- Dependencies: 8243
-- Name: CONSTRAINT fk_filaestruc_subordinacion_idhijo ON dat_subordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_filaestruc_subordinacion_idhijo ON dat_subordinacion IS 'Limitación referencial entre la  tabla “dat_subordinacion” y la tabla “nom_filaestruc” mediante el atributo “idhijo”.';


--
-- TOC entry 8242 (class 2606 OID 197225)
-- Dependencies: 8183 1740 1719
-- Name: fk_filaestruc_subordinacion_idpadre; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_subordinacion
    ADD CONSTRAINT fk_filaestruc_subordinacion_idpadre FOREIGN KEY (idpadre) REFERENCES nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8744 (class 0 OID 0)
-- Dependencies: 8242
-- Name: CONSTRAINT fk_filaestruc_subordinacion_idpadre ON dat_subordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_filaestruc_subordinacion_idpadre ON dat_subordinacion IS 'Limitación referencial entre la  tabla “dat_subordinacion” y la tabla “nom_filaestruc” mediante el atributo “idpadre”.';


--
-- TOC entry 8220 (class 2606 OID 197230)
-- Dependencies: 8185 1742 1708
-- Name: fk_grado_cargomilitar; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargomilitar
    ADD CONSTRAINT fk_grado_cargomilitar FOREIGN KEY (idgrado) REFERENCES nom_grado(idgrado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8745 (class 0 OID 0)
-- Dependencies: 8220
-- Name: CONSTRAINT fk_grado_cargomilitar ON dat_cargomilitar; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_grado_cargomilitar ON dat_cargomilitar IS 'Limitación referencial entre la  tabla “dat_cargomilitar” y la tabla “nom_grado” mediante el atributo “idgrado”.';


--
-- TOC entry 8259 (class 2606 OID 197235)
-- Dependencies: 8161 1728 1742
-- Name: fk_grado_categoriamilitar; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_grado
    ADD CONSTRAINT fk_grado_categoriamilitar FOREIGN KEY (idcategoriamilitar) REFERENCES nom_categoriamilitar(idcategoriamilitar);


--
-- TOC entry 8746 (class 0 OID 0)
-- Dependencies: 8259
-- Name: CONSTRAINT fk_grado_categoriamilitar ON nom_grado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_grado_categoriamilitar ON nom_grado IS 'Limitación referencial entre la  tabla “nom_grado” y la tabla “nom_categoriamilitar” mediante el atributo “idcategoriamilitar”.';


--
-- TOC entry 8258 (class 2606 OID 197240)
-- Dependencies: 8189 1746 1742
-- Name: fk_grado_icono; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_grado
    ADD CONSTRAINT fk_grado_icono FOREIGN KEY (idicono) REFERENCES nom_icono(idicono);


--
-- TOC entry 8747 (class 0 OID 0)
-- Dependencies: 8258
-- Name: CONSTRAINT fk_grado_icono ON nom_grado; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_grado_icono ON nom_grado IS 'Limitación referencial entre la  tabla “nom_grado” y la tabla “nom_icono” mediante el atributo “idicono”.';


--
-- TOC entry 8234 (class 2606 OID 197245)
-- Dependencies: 8138 1712 1713
-- Name: fk_grafica_graficausuario; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_graficausuario
    ADD CONSTRAINT fk_grafica_graficausuario FOREIGN KEY (idgrafica) REFERENCES dat_grafica(idgrafica) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8748 (class 0 OID 0)
-- Dependencies: 8234
-- Name: CONSTRAINT fk_grafica_graficausuario ON dat_graficausuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_grafica_graficausuario ON dat_graficausuario IS 'Limitación referencial entre la  tabla “dat_grafica” y la tabla “dat_graficausuario” mediante el atributo “idgrafica”.';


--
-- TOC entry 8251 (class 2606 OID 197250)
-- Dependencies: 8187 1744 1733
-- Name: fk_grupocomplejidad_condicion; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_condicion
    ADD CONSTRAINT fk_grupocomplejidad_condicion FOREIGN KEY (idgrupocomplejidad) REFERENCES nom_grupocomplejidad(idgrupocomplejidad) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8749 (class 0 OID 0)
-- Dependencies: 8251
-- Name: CONSTRAINT fk_grupocomplejidad_condicion ON nom_condicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_grupocomplejidad_condicion ON nom_condicion IS 'Limitaci?n referencial entre la  tabla ?nom_grupocomplejidad? y la tabla ?nom_condicion? mediante el atributo idgrupocomplejidad.';


--
-- TOC entry 8246 (class 2606 OID 197255)
-- Dependencies: 8187 1744 1723
-- Name: fk_grupocomplejidad_nomcargo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_cargo
    ADD CONSTRAINT fk_grupocomplejidad_nomcargo FOREIGN KEY (idgrupocomplejidad) REFERENCES nom_grupocomplejidad(idgrupocomplejidad) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8750 (class 0 OID 0)
-- Dependencies: 8246
-- Name: CONSTRAINT fk_grupocomplejidad_nomcargo ON nom_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_grupocomplejidad_nomcargo ON nom_cargo IS 'Limitación referencial entre la  tabla “nom_grupocomplejidad” y la tabla “nom_cargo” mediante el atributo “idgrupocomplejidad”.';


--
-- TOC entry 8263 (class 2606 OID 197260)
-- Dependencies: 8187 1744 1753
-- Name: fk_grupocomplejidad_salario; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_salario
    ADD CONSTRAINT fk_grupocomplejidad_salario FOREIGN KEY (idgrupocomplejidad) REFERENCES nom_grupocomplejidad(idgrupocomplejidad) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8751 (class 0 OID 0)
-- Dependencies: 8263
-- Name: CONSTRAINT fk_grupocomplejidad_salario ON nom_salario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_grupocomplejidad_salario ON nom_salario IS 'Limitación referencial entre la  tabla “nom_salario” y la tabla “nom_grupocomplejidad” mediante el atributo “idgrupocomplejidad”.';




--
-- TOC entry 8237 (class 2606 OID 197270)
-- Dependencies: 8189 1746 1714
-- Name: fk_medio_icono; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_medio
    ADD CONSTRAINT fk_medio_icono FOREIGN KEY (idicono) REFERENCES nom_icono(idicono);


--
-- TOC entry 8753 (class 0 OID 0)
-- Dependencies: 8237
-- Name: CONSTRAINT fk_medio_icono ON dat_medio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_medio_icono ON dat_medio IS 'Limitación referencial entre la  tabla "dat_medio" y la tabla "nom_icono" mediante el atributo “idicono”.';


--
-- TOC entry 8216 (class 2606 OID 197275)
-- Dependencies: 8155 1723 1706
-- Name: fk_nomcargo_datcargo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargo
    ADD CONSTRAINT fk_nomcargo_datcargo FOREIGN KEY (idnomcargo) REFERENCES nom_cargo(idnomcargo) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8754 (class 0 OID 0)
-- Dependencies: 8216
-- Name: CONSTRAINT fk_nomcargo_datcargo ON dat_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_nomcargo_datcargo ON dat_cargo IS 'Limitación referencial entre la  tabla “dat_cargo” y la tabla “nom_cargo” mediante el atributo “idnomcargo”.';


--
-- TOC entry 8265 (class 2606 OID 251281)
-- Dependencies: 8193 1747 1747 2243 2243
-- Name: fk_organo_conceptocondicion; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_conceptocondicion
    ADD CONSTRAINT fk_organo_conceptocondicion FOREIGN KEY (idorgano, idconcepto) REFERENCES nom_organo(idorgano, idconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8755 (class 0 OID 0)
-- Dependencies: 8265
-- Name: CONSTRAINT fk_organo_conceptocondicion ON dat_conceptocondicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_organo_conceptocondicion ON dat_conceptocondicion IS 'Limitación referencial entre la  tabla “nom_organo” y la tabla “nom_conceptocondicion” mediante el atributo “idorgano”';


--
-- TOC entry 8224 (class 2606 OID 197280)
-- Dependencies: 8193 1747 1747 1709 1709
-- Name: fk_organo_estructura; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructura
    ADD CONSTRAINT fk_organo_estructura FOREIGN KEY (idconcepto, idorgano) REFERENCES nom_organo(idconcepto, idorgano) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8756 (class 0 OID 0)
-- Dependencies: 8224
-- Name: CONSTRAINT fk_organo_estructura ON dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_organo_estructura ON dat_estructura IS 'Limitación referencial entre la  tabla “dat_estructura” y la tabla “nom_organo” mediante el atributo “idconcepto” y el atributo “idorgano” .';


--
-- TOC entry 8230 (class 2606 OID 197285)
-- Dependencies: 8193 1747 1747 1710 1710
-- Name: fk_organo_estructuraop; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructuraop
    ADD CONSTRAINT fk_organo_estructuraop FOREIGN KEY (idconcepto, idorgano) REFERENCES nom_organo(idconcepto, idorgano) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8757 (class 0 OID 0)
-- Dependencies: 8230
-- Name: CONSTRAINT fk_organo_estructuraop ON dat_estructuraop; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_organo_estructuraop ON dat_estructuraop IS 'Limitación referencial entre la  tabla “dat_estructuraop” y la tabla “nom_organo” mediante el atributo “idconcepto” y el atributo “idorgano”. ';


--
-- TOC entry 8215 (class 2606 OID 197290)
-- Dependencies: 8195 1749 1706
-- Name: fk_preparacion_cargo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargo
    ADD CONSTRAINT fk_preparacion_cargo FOREIGN KEY (idpreparacion) REFERENCES nom_preparacion(idpreparacion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8758 (class 0 OID 0)
-- Dependencies: 8215
-- Name: CONSTRAINT fk_preparacion_cargo ON dat_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_preparacion_cargo ON dat_cargo IS 'Limitación referencial entre la  tabla “dat_cargo” y la tabla “nom_preparacion” mediante el atributo “idpreparacion”.';


--
-- TOC entry 8249 (class 2606 OID 197295)
-- Dependencies: 8197 1750 1732
-- Name: fk_propiedad_conceptoconceptopropiedad; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_conceptopropiedad
    ADD CONSTRAINT fk_propiedad_conceptoconceptopropiedad FOREIGN KEY (idpropiedad) REFERENCES nom_propiedad(idpropiedad) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8759 (class 0 OID 0)
-- Dependencies: 8249
-- Name: CONSTRAINT fk_propiedad_conceptoconceptopropiedad ON nom_conceptopropiedad; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_propiedad_conceptoconceptopropiedad ON nom_conceptopropiedad IS 'Limitación referencial entre la  tabla “nom_propiedad” y la tabla “nom_conceptopropiedad” mediante el atributo “idpropiedad”.';


--
-- TOC entry 8214 (class 2606 OID 197300)
-- Dependencies: 8146 1716 1706
-- Name: fk_proyecto_cargo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargo
    ADD CONSTRAINT fk_proyecto_cargo FOREIGN KEY (idproyecto) REFERENCES dat_proyecto(idproyecto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8760 (class 0 OID 0)
-- Dependencies: 8214
-- Name: CONSTRAINT fk_proyecto_cargo ON dat_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_proyecto_cargo ON dat_cargo IS 'Limitación referencial entre la tabla “dat_cargo” y la tabla “nom_proyecto” mediante el atributo “idproyecto”.';


--
-- TOC entry 8223 (class 2606 OID 197305)
-- Dependencies: 8146 1716 1709
-- Name: fk_proyecto_estructura; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructura
    ADD CONSTRAINT fk_proyecto_estructura FOREIGN KEY (idproyecto) REFERENCES dat_proyecto(idproyecto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8761 (class 0 OID 0)
-- Dependencies: 8223
-- Name: CONSTRAINT fk_proyecto_estructura ON dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_proyecto_estructura ON dat_estructura IS 'Limitación referencial entre la tabla “dat_estructura” y la tabla “nom_proyecto” mediante el atributo “idproyecto”.';


--
-- TOC entry 8229 (class 2606 OID 197310)
-- Dependencies: 8146 1716 1710
-- Name: fk_proyecto_estructuraop; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructuraop
    ADD CONSTRAINT fk_proyecto_estructuraop FOREIGN KEY (idproyecto) REFERENCES dat_proyecto(idproyecto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8762 (class 0 OID 0)
-- Dependencies: 8229
-- Name: CONSTRAINT fk_proyecto_estructuraop ON dat_estructuraop; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_proyecto_estructuraop ON dat_estructuraop IS 'Limitación referencial entre la tabla “dat_estructuraop” y la tabla “nom_proyecto” mediante el atributo “idproyecto”.';


--
-- TOC entry 8233 (class 2606 OID 197315)
-- Dependencies: 8146 1716 1711
-- Name: fk_proyecto_filacortada; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_filacortada
    ADD CONSTRAINT fk_proyecto_filacortada FOREIGN KEY (idproyecto) REFERENCES dat_proyecto(idproyecto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8763 (class 0 OID 0)
-- Dependencies: 8233
-- Name: CONSTRAINT fk_proyecto_filacortada ON dat_filacortada; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_proyecto_filacortada ON dat_filacortada IS 'Limitación referencial entre la  tabla “dat_proyecto” y la tabla “dat_filacortada” mediante el atributo “idproyecto”.';


--
-- TOC entry 8236 (class 2606 OID 197320)
-- Dependencies: 8146 1716 1714
-- Name: fk_proyecto_medio; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_medio
    ADD CONSTRAINT fk_proyecto_medio FOREIGN KEY (idproyecto) REFERENCES dat_proyecto(idproyecto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8764 (class 0 OID 0)
-- Dependencies: 8236
-- Name: CONSTRAINT fk_proyecto_medio ON dat_medio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_proyecto_medio ON dat_medio IS 'Limitación referencial entre la tabla “dat_medio” y la tabla “nom_proyecto” mediante el atributo “idproyecto”.';


--
-- TOC entry 8240 (class 2606 OID 197325)
-- Dependencies: 8146 1716 1717
-- Name: fk_proyecto_proyectousuario; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_proyectousuario
    ADD CONSTRAINT fk_proyecto_proyectousuario FOREIGN KEY (idproyecto) REFERENCES dat_proyecto(idproyecto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8765 (class 0 OID 0)
-- Dependencies: 8240
-- Name: CONSTRAINT fk_proyecto_proyectousuario ON dat_proyectousuario; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_proyecto_proyectousuario ON dat_proyectousuario IS 'Limitación referencial entre la tabla “dat_proyectousuario” y la tabla “dat_proyecto” mediante el atributo “idproyecto”.';


--
-- TOC entry 8213 (class 2606 OID 197330)
-- Dependencies: 8201 1753 1706
-- Name: fk_salario_datcargo; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_cargo
    ADD CONSTRAINT fk_salario_datcargo FOREIGN KEY (idsalario) REFERENCES nom_salario(idsalario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8766 (class 0 OID 0)
-- Dependencies: 8213
-- Name: CONSTRAINT fk_salario_datcargo ON dat_cargo; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_salario_datcargo ON dat_cargo IS 'Limitación referencial entre la  tabla “dat_cargo” y la tabla “nom_salario” mediante el atributo “idsalario”.';


--
-- TOC entry 8255 (class 2606 OID 197335)
-- Dependencies: 8201 1753 1737
-- Name: fk_salario_escalasalarial; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_escalasalarial
    ADD CONSTRAINT fk_salario_escalasalarial FOREIGN KEY (idsalario) REFERENCES nom_salario(idsalario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8767 (class 0 OID 0)
-- Dependencies: 8255
-- Name: CONSTRAINT fk_salario_escalasalarial ON nom_escalasalarial; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_salario_escalasalarial ON nom_escalasalarial IS 'Limitación referencial entre la  tabla “nom_salario” y la tabla “nom_escalasalarial” mediante el atributo “idsalario”.';


--
-- TOC entry 8241 (class 2606 OID 197340)
-- Dependencies: 8203 1755 1719
-- Name: fk_subordinacion_subordinacion; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_subordinacion
    ADD CONSTRAINT fk_subordinacion_subordinacion FOREIGN KEY (idnomsubordinacion) REFERENCES nom_subordinacion(idnomsubordinacion) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8768 (class 0 OID 0)
-- Dependencies: 8241
-- Name: CONSTRAINT fk_subordinacion_subordinacion ON dat_subordinacion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_subordinacion_subordinacion ON dat_subordinacion IS 'Limitación referencial entre la  tabla “dat_subordinacion” y la tabla “nom_subordinacion” mediante el atributo “idnomsubordinacion”.';


--
-- TOC entry 8254 (class 2606 OID 197345)
-- Dependencies: 8205 1757 1737
-- Name: fk_tipoescala_escalasalarial; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY nom_escalasalarial
    ADD CONSTRAINT fk_tipoescala_escalasalarial FOREIGN KEY (idtipoescala) REFERENCES nom_tipoescala(idtipoescala) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8769 (class 0 OID 0)
-- Dependencies: 8254
-- Name: CONSTRAINT fk_tipoescala_escalasalarial ON nom_escalasalarial; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_tipoescala_escalasalarial ON nom_escalasalarial IS 'Limitación referencial entre la  tabla “nom_tipoescala” y la tabla “nom_escalasalarial” mediante el atributo “idtipoescala”.';


--
-- TOC entry 8222 (class 2606 OID 197350)
-- Dependencies: 8205 1757 1709
-- Name: fk_tipoescala_estructura; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_estructura
    ADD CONSTRAINT fk_tipoescala_estructura FOREIGN KEY (idtipoescala) REFERENCES nom_tipoescala(idtipoescala) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8770 (class 0 OID 0)
-- Dependencies: 8222
-- Name: CONSTRAINT fk_tipoescala_estructura ON dat_estructura; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_tipoescala_estructura ON dat_estructura IS 'Limitación referencial entre la tabla “nom_tipoescala” y la tabla “dat_estructura” mediante el atributo “idtipoescala”.';


--
-- TOC entry 8235 (class 2606 OID 197355)
-- Dependencies: 8207 1759 1714
-- Name: fk_tipomedio_medio; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_medio
    ADD CONSTRAINT fk_tipomedio_medio FOREIGN KEY (idtipomedio) REFERENCES nom_tipomedio(idtipomedio) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8771 (class 0 OID 0)
-- Dependencies: 8235
-- Name: CONSTRAINT fk_tipomedio_medio ON dat_medio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_tipomedio_medio ON dat_medio IS 'Limitación referencial entre la  tabla “dat_medio” y la tabla “nom_tipomedio” mediante el atributo “idtipomedio”.';

--
-- TOC entry 8264 (class 2606 OID 251302)
-- Dependencies: 8152 1721 2243
-- Name: fk_usuarioconcepto_conceptocondicion; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_conceptocondicion
    ADD CONSTRAINT fk_usuarioconcepto_conceptocondicion FOREIGN KEY (idusuarioconcepto) REFERENCES dat_usuarioconcepto(idusuarioconcepto) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 8773 (class 0 OID 0)
-- Dependencies: 8264
-- Name: CONSTRAINT fk_usuarioconcepto_conceptocondicion ON dat_conceptocondicion; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_usuarioconcepto_conceptocondicion ON dat_conceptocondicion IS 'Limitación referencial entre la  tabla “dat_usuarioconcepto” y la tabla “dat_conceptocondicion” mediante el atributo “idusuarioconcepto”.';
--
-- TOC entry 8330 (class 2606 OID 441911)
-- Dependencies: 8216 1723 2247
-- Name: nom_firma_fk; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: -
--

ALTER TABLE ONLY nom_firma
    ADD CONSTRAINT nom_firma_fk FOREIGN KEY (idnomcargo) REFERENCES nom_cargo(idnomcargo) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;
	--
-- TOC entry 8329 (class 2606 OID 441916)
-- Dependencies: 8233 1735 2247
-- Name: nom_firma_fk1; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: -
--

ALTER TABLE ONLY nom_firma
    ADD CONSTRAINT nom_firma_fk1 FOREIGN KEY (iddominio) REFERENCES nom_dominio(iddominio) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


