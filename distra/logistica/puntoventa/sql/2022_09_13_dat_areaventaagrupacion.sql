CREATE SEQUENCE mod_logpuntoventa.sec_datareaventaagrupacion_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

CREATE TABLE mod_logpuntoventa.dat_areaventaagrupacion (
  idareaventaagrupacion NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datareaventaagrupacion_seq'::regclass) NOT NULL,
  idagrupacion NUMERIC(19,0) NOT NULL,
  idareaventa NUMERIC(19,0) NOT NULL,
  fechaenviado DATE,
  idreferencia NUMERIC(10,0),
  CONSTRAINT dat_areaventaagrupacion_pkey PRIMARY KEY(idareaventaagrupacion),
  CONSTRAINT dat_areaventaagrupacion_fk FOREIGN KEY (idareaventa)
    REFERENCES mod_logpuntoventa.dat_areaventa(idareaventa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_areaventaagrupacion_fk1 FOREIGN KEY (idagrupacion)
    REFERENCES mod_logpuntoventa.dat_naturalezaagrupacion(idnaturalezaagrupacion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_areaventaagrupacion
  OWNER TO zeolides;  