--
-- TOC entry 8238 (class 2606 OID 197265)
-- Dependencies: 458 1714
-- Name: fk_indicador_medio; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_medio
    ADD CONSTRAINT fk_indicador_medio FOREIGN KEY (idnommedio) REFERENCES mod_datosmaestros.nom_indicador(idindicador) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- TOC entry 8752 (class 0 OID 0)
-- Dependencies: 8238
-- Name: CONSTRAINT fk_indicador_medio ON dat_medio; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_indicador_medio ON dat_medio IS 'Limitación referencial entre la  tabla “dat_medio” y la tabla “nom_indicador” mediante el atributo “idindicador”.';


--
-- TOC entry 8244 (class 2606 OID 197360)
-- Dependencies: 1614 1721
-- Name: fk_usuario_usuarioconcepto; Type: FK CONSTRAINT; Schema: mod_estructuracomp; Owner: zeolides
--

ALTER TABLE ONLY dat_usuarioconcepto
    ADD CONSTRAINT fk_usuario_usuarioconcepto FOREIGN KEY (idusuario) REFERENCES mod_seguridad.seg_usuario(idusuario) ON UPDATE CASCADE ON DELETE CASCADE;
	--
-- TOC entry 8772 (class 0 OID 0)
-- Dependencies: 8244
-- Name: CONSTRAINT fk_usuario_usuarioconcepto ON dat_usuarioconcepto; Type: COMMENT; Schema: mod_estructuracomp; Owner: zeolides
--

COMMENT ON CONSTRAINT fk_usuario_usuarioconcepto ON dat_usuarioconcepto IS 'Limitación referencial entre la  tabla “seg_usuario” y la tabla “dat_usuarioconcepto” mediante el atributo “idusuario”.';

