ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  DROP CONSTRAINT IF EXISTS conf_gruposcuentas_fk RESTRICT;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  ADD CONSTRAINT conf_gruposcuentas_fk FOREIGN KEY (idestructura)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  DROP CONSTRAINT IF EXISTS conf_gruposcuentas_fk1 RESTRICT;

delete from mod_logactivofijotangible.conf_gruposcuentas cgc
where cgc.idgruposubgrupo not in (
select gr.idgruposubgrupo from mod_datosmaestros.nom_gruposubgrupo gr
);

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  ADD CONSTRAINT conf_gruposcuentas_fk1 FOREIGN KEY (idgruposubgrupo)
    REFERENCES mod_datosmaestros.nom_gruposubgrupo(idgruposubgrupo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  DROP CONSTRAINT IF EXISTS conf_gruposcuentas_fk2 RESTRICT;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  ADD CONSTRAINT conf_gruposcuentas_fk2 FOREIGN KEY (idcuentaactivo)
    REFERENCES mod_contabilidad.nom_cuenta(idcuenta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  DROP CONSTRAINT IF EXISTS conf_gruposcuentas_fk3 RESTRICT;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  ADD CONSTRAINT conf_gruposcuentas_fk3 FOREIGN KEY (idcuentaactivoalternativa)
    REFERENCES mod_contabilidad.nom_cuenta(idcuenta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  DROP CONSTRAINT IF EXISTS conf_gruposcuentas_fk4 RESTRICT;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  ADD CONSTRAINT conf_gruposcuentas_fk4 FOREIGN KEY (idcuentadepreciacion)
    REFERENCES mod_contabilidad.nom_cuenta(idcuenta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  DROP CONSTRAINT IF EXISTS conf_gruposcuentas_fk5 RESTRICT;

ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  ADD CONSTRAINT conf_gruposcuentas_fk5 FOREIGN KEY (idcuentadepreciacionalternativa)
    REFERENCES mod_contabilidad.nom_cuenta(idcuenta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;


ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  DROP CONSTRAINT IF EXISTS conf_gruposcuentas_idx RESTRICT;


DELETE FROM mod_logactivofijotangible.conf_gruposcuentas a USING (
SELECT MIN(ctid) as ctid, idgruposubgrupo, idestructura
  FROM mod_logactivofijotangible.conf_gruposcuentas
  GROUP BY idgruposubgrupo, idestructura HAVING COUNT(*) > 1
) b
WHERE a.idgruposubgrupo = b.idgruposubgrupo and b.idestructura = a.idestructura
AND a.ctid <> b.ctid;


ALTER TABLE mod_logactivofijotangible.conf_gruposcuentas
  ADD CONSTRAINT conf_gruposcuentas_idx 
    UNIQUE (idgruposubgrupo, idestructura) NOT DEFERRABLE;