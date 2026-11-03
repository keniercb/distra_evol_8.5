ALTER TABLE mod_logtaller.dat_cita
  ADD COLUMN documentoorigen NUMERIC(19,0);
  
  ALTER TABLE mod_logtaller.dat_cita
  ADD COLUMN iddocumentoorigen NUMERIC(19,0);

  ALTER TABLE mod_logtaller.dat_cita
  ADD COLUMN correo VARCHAR(255);

  ALTER TABLE mod_logtaller.conf_actividad
  ADD COLUMN iddocumentoorigen NUMERIC(5,0);


ALTER TABLE mod_logtaller.dat_ordentrabajo
  ADD COLUMN correocliente VARCHAR(255);

CREATE SEQUENCE mod_logtaller.sec_datresponsableactividad
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

CREATE TABLE mod_logtaller.dat_responsableactividad (
  idresponsableactividad NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_datresponsableactividad'::regclass) NOT NULL,
  idordenactividad NUMERIC(19,0),
  idactividad NUMERIC(19,0),
  idresponsable NUMERIC(19,0),
  hora NUMERIC(25,0),
  salarioporhoras NUMERIC(25,0),
  nopagar BOOLEAN DEFAULT false,
  fecha DATE,
  motivo VARCHAR(255),
  idusuario NUMERIC(19,0),
  CONSTRAINT dat_responsableactividad_pky PRIMARY KEY (idresponsableactividad),
  CONSTRAINT dat_responsableactividad_fk FOREIGN KEY (idordenactividad)
    REFERENCES mod_logtaller.dat_ordenactividad(idordenactividad)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);



