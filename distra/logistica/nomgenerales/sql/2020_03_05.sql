CREATE SEQUENCE mod_datosmaestros.sec_datlineaentidad_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

CREATE SEQUENCE mod_datosmaestros.sec_nomlinea_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;


CREATE TABLE mod_datosmaestros.nom_linea (
  idlinea NUMERIC(19,0) DEFAULT nextval('mod_datosmaestros.sec_nomlinea_seq'::regclass) NOT NULL,
  denominacion VARCHAR(50),
  fechainicio DATE,
  fechafin DATE,
  estado NUMERIC(1,0) DEFAULT 1,
  CONSTRAINT nom_linea_pkey PRIMARY KEY(idlinea)
) 
WITH (oids = false);


CREATE TABLE mod_datosmaestros.dat_lineaentidad (
  idlineaentidad NUMERIC(19,0) DEFAULT nextval('mod_datosmaestros.sec_datlineaentidad_seq'::regclass) NOT NULL,
  idlinea NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT dat_lineaentidad_pkey PRIMARY KEY(idlineaentidad),
  CONSTRAINT dat_lineaentidad_fk FOREIGN KEY (idlinea)
    REFERENCES mod_datosmaestros.nom_linea(idlinea)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_lineaentidad_fk1 FOREIGN KEY (idestructuracomun)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);