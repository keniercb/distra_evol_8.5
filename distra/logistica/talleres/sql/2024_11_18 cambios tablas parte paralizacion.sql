--------------- SQL ---------------

ALTER TABLE mod_logtaller.conf_reporteparalizacion
  DROP COLUMN idestructuracomun;
  
--------------- SQL ---------------

ALTER TABLE mod_logtaller.conf_reporteparalizacion
  DROP COLUMN agrupacion;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.conf_reporteparalizacion
  DROP COLUMN orden;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportetipo
  DROP COLUMN idestructuracomun;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemodelo
  DROP COLUMN idestructuracomun;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemarca
  DROP COLUMN idestructuracomun;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportegruposubgrupo
  DROP COLUMN idestructuracomun;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.conf_reporteparalizacion
  ALTER COLUMN denominacion SET NOT NULL;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportegruposubgrupo
  ALTER COLUMN idreporteparalizacion SET NOT NULL;  
  
--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportegruposubgrupo
  ALTER COLUMN idgruposubgrupo SET NOT NULL;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemarca
  ALTER COLUMN idreporteparalizacion SET NOT NULL;  
  
--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemarca
  ALTER COLUMN idmarca SET NOT NULL;  
  
--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportetipo
  ADD CONSTRAINT dat_reportetipo_fk FOREIGN KEY (idtipo)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportetipo
  ALTER COLUMN idreporteparalizacion SET NOT NULL;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportetipo
  ALTER COLUMN idtipo SET NOT NULL;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportegruposubgrupo
  ADD CONSTRAINT dat_reportegruposubgrupo_fk FOREIGN KEY (idgruposubgrupo)
    REFERENCES mod_datosmaestros.nom_gruposubgrupo(idgruposubgrupo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemarca
  ADD CONSTRAINT dat_reportemarca_fk FOREIGN KEY (idmarca)
    REFERENCES mod_datosmaestros.nom_marca(idmarca)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemodelo
  ALTER COLUMN idreporteparalizacion SET NOT NULL;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemodelo
  ALTER COLUMN idmodelo SET NOT NULL;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemodelo
  ADD CONSTRAINT dat_reportemodelo_fk FOREIGN KEY (idmodelo)
    REFERENCES mod_datosmaestros.nom_modelo(idmodelo)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;  
	
--------------- SQL ---------------

TRUNCATE TABLE mod_logtaller.conf_reporteparalizacion CASCADE;

--------------- SQL ---------------

ALTER TABLE mod_logtaller.dat_reportemodelo
  ADD COLUMN idmarca NUMERIC(19,0) NOT NULL;
  
--------------- SQL ---------------

CREATE UNIQUE INDEX dat_reportemarca_idmarca_key ON mod_logtaller.dat_reportemarca
(idmarca);

ALTER TABLE mod_logtaller.dat_reportemodelo
  ADD CONSTRAINT dat_reportemodelo_fk1 FOREIGN KEY (idmarca)
    REFERENCES mod_logtaller.dat_reportemarca(idmarca)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

--------------- SQL ---------------

DROP TABLE mod_logtaller.dat_confusuarioparalizacion;

INSERT INTO 
  mod_logtaller.conf_reporteparalizacion
(
  idreporteparalizacion,
  denominacion,
  activo
)
VALUES (
  1000000001,
  'Todos',
  1
);

--------------- SQL ---------------

DROP FUNCTION mod_logtaller.f_parageneral(p_idreportepara numeric [], p_idestructura numeric []);

--------------- SQL ---------------

DROP FUNCTION mod_logtaller.f_paralizacionespecifica(p_idestructuracomun varchar, p_fechainicio date, p_fechafin date, p_tipomedio numeric, p_idmarca numeric, p_idmodelo numeric, p_nropedido numeric, p_diasparalizado numeric, p_sobreestadia numeric, p_entidad text, p_idagenciaag numeric, p_idestructuraag numeric, p_idestructura numeric);

--------------- SQL ---------------

DROP FUNCTION mod_logtaller.f_paralizacionespecifica_new(marca varchar [], modelo varchar [], matricula varchar, tipomedio numeric [], idconfiguracion numeric, idusuario numeric, denoconfiguracion varchar);

--------------- SQL ---------------

DROP FUNCTION mod_logtaller.f_paralizacionespecifica_new(marca varchar [], modelo varchar [], matricula varchar, grupo varchar [], tipomedio numeric [], idconfiguracion numeric, idusuario numeric, denoconfiguracion varchar);

--------------- SQL ---------------

DROP FUNCTION mod_logtaller.f_paralizaciongeneral(p_idestructuracomun varchar, p_documentoorigenbase varchar, p_tipomedio numeric, p_entidad varchar, p_fechainicio date, p_fechafin date, p_idestructura numeric);

--------------- SQL ---------------

DROP FUNCTION mod_logtaller.f_parliespecifica(p_idconfiguracion numeric [], p_idestructuras numeric [], p_idusuario numeric);	

--------------- SQL ---------------

DROP TYPE mod_logtaller.td_paraliespecifica;

--------------- SQL ---------------

DROP TYPE mod_logtaller.td_paralizacionespecifica;

--------------- SQL ---------------

DROP TYPE mod_logtaller.td_paralizaciongeneral;

