CREATE SEQUENCE IF NOT EXISTS mod_logactivofijotangible.sec_confreporteaft_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logactivofijotangible.sec_confreporteaft_seq RESTART WITH 1000000167;

DROP TABLE IF EXISTS mod_logactivofijotangible.conf_reporteaftentidad;
DROP TABLE IF EXISTS mod_logactivofijotangible.conf_reporteaft;

CREATE TABLE IF NOT EXISTS  mod_logactivofijotangible.conf_reporteaft (
  idconfreporteaft NUMERIC(19,0) DEFAULT nextval('mod_logactivofijotangible.sec_confreporteaft_seq'::regclass) NOT NULL,
  idreporte NUMERIC(19,0) NOT NULL,
  nombrecampo VARCHAR(255) NOT NULL,
  CONSTRAINT conf_reporteaft_pkey PRIMARY KEY(idconfreporteaft)
) 
WITH (oids = false);

ALTER TABLE mod_logactivofijotangible.conf_reporteaft
  OWNER TO zeolides;



/* Data for the 'mod_logactivofijotangible.conf_reporteaft' table  (Records 1 - 99) */

INSERT INTO mod_logactivofijotangible.conf_reporteaft ("idconfreporteaft", "idreporte", "nombrecampo")
VALUES 
  ('1000000057', '18', E'A'),
  ('1000000058', '18', E'Pie de firma 1'),
  ('1000000059', '18', E'Pie de firma 2'),
  ('1000000060', '19', E'A'),
  ('1000000061', '19', E'Pie de firma 1'),
  ('1000000062', '19', E'Pie de firma 2'),
  ('1000000063', '8', E'Aprobado por'),
  ('1000000064', '8', E'Solicitado por'),
  ('1000000065', '8', E'Presidente de la comisión de base'),
  ('1000000066', '8', E'Presidente de la comisión superior'),
  ('1000000067', '8', E'Miembro de la comisión de base 1'),
  ('1000000068', '8', E'Miembro de la comisión de base 2'),
  ('1000000070', '8', E'Miembro de la comisión superior 1'),
  ('1000000071', '8', E'Miembro de la comisión superior 2'),
  ('1000000073', '21', E'Aprobado por'),
  ('1000000074', '21', E'Pertenece'),
  ('1000000075', '21', E'Pie de firma 1'),
  ('1000000076', '22', E'A'),
  ('1000000077', '22', E'Año'),
  ('1000000078', '22', E'Pie de firma 1'),
  ('1000000079', '22', E'Pie de firma 2'),
  ('1000000080', '7', E'Jefe de registro de vehiculos de '),
  ('1000000081', '7', E'Aprobado por'),
  ('1000000082', '7', E'Año'),
  ('1000000083', '7', E'Reinscrito'),
  ('1000000084', '7', E'Pie de firma 1'),
  ('1000000085', '7', E'Pie de firma 2'),
  ('1000000086', '24', E'A'),
  ('1000000087', '24', E'Aprobado por'),
  ('1000000088', '24', E'Año'),
  ('1000000089', '24', E'Proviene'),
  ('1000000090', '24', E'Reinscrito'),
  ('1000000091', '24', E'Pie de firma 1'),
  ('1000000092', '24', E'Pie de firma 2'),
  ('1000000093', '1', E'Pie de firma 1'),
  ('1000000094', '1', E'Pie de firma 2'),
  ('1000000095', '1', E'Jefe de Dpto'),
  ('1000000097', '2', E'Jefe de Dpto'),
  ('1000000098', '2', E'Pie de firma 1'),
  ('1000000099', '3', E'Jefe de Dpto'),
  ('1000000100', '3', E'Pie de firma 1'),
  ('1000000102', '5', E'Autoriza'),
  ('1000000103', '5', E'Cargo'),
  ('1000000104', '6', E'Autoriza'),
  ('1000000105', '6', E'Cargo'),
  ('1000000106', '15', E'Aprobado por'),
  ('1000000107', '15', E'Solicitado por'),
  ('1000000108', '15', E'Presidente'),
  ('1000000109', '15', E'Presidente de la comisión de base'),
  ('1000000110', '15', E'Miembro comisión de base'),
  ('1000000111', '15', E'Miembro 2'),
  ('1000000112', '15', E'Miembro 1'),
  ('1000000113', '4', E'Recepcionado por'),
  ('1000000114', '4', E'Cargo del que lo recepciona'),
  ('1000000116', '4', E'Elaborado por'),
  ('1000000117', '4', E'Cargo del que lo elabora'),
  ('1000000119', '4', E'Revisado por'),
  ('1000000120', '4', E'Cargo del que lo revisa'),
  ('1000000121', '4', E'Aprobado por'),
  ('1000000122', '4', E'Cargo del que lo aprueba'),
  ('1000000124', '16', E'Aprobado por'),
  ('1000000125', '16', E'Solicitado por'),
  ('1000000126', '16', E'Revisado por'),
  ('1000000127', '16', E'Presidente de la comisión de base'),
  ('1000000128', '16', E'Presidente de la comisión superior'),
  ('1000000129', '16', E'Miembro de la comisión de base 1'),
  ('1000000130', '16', E'Miembro de la comisión de base 2'),
  ('1000000131', '16', E'Miembro de la comisión de base 3'),
  ('1000000132', '16', E'Miembro de la comisión superior 1'),
  ('1000000133', '16', E'Miembro de la comisión superior 2'),
  ('1000000134', '16', E'Miembro de la comisión superior 3'),
  ('1000000135', '8', E'Pertenece'),
  ('1000000136', '8', E'Revisado por'),
  ('1000000137', '25', E'Aprobado por'),
  ('1000000138', '25', E'Pertenece'),
  ('1000000139', '25', E'Solicitado por'),
  ('1000000140', '25', E'Presidente de la comisión de base'),
  ('1000000141', '25', E'Miembro de la comisión de base 1'),
  ('1000000142', '25', E'Cargo miembro comisión de base 1'),
  ('1000000143', '25', E'Miembro de la comisión de base 2'),
  ('1000000144', '25', E'Cargo miembro comisión de base 2'),
  ('1000000145', '25', E'Miembro de la comisión de base 3'),
  ('1000000146', '25', E'Cargo miembro comisión de base 3'),
  ('1000000147', '25', E'Presidente de la comisión superior'),
  ('1000000148', '25', E'Miembro de la comisión superior 1'),
  ('1000000149', '25', E'Miembro de la comisión superior 2'),
  ('1000000150', '25', E'Cargo solicitado por'),
  ('1000000151', '25', E'Cargo presidente comisión de base'),
  ('1000000156', '25', E'Cargo presidente comisión superior'),
  ('1000000157', '25', E'Cargo miembro comisión superior 1'),
  ('1000000158', '25', E'Cargo miembro comisión superior 2'),
  ('1000000159', '8', E'Cargo revisado por'),
  ('1000000160', '8', E'Cargo presidente comisión superior'),
  ('1000000161', '8', E'Cargo miembro comisión superior 1'),
  ('1000000162', '8', E'Cargo miembro comisión superior 2'),
  ('1000000163', '8', E'Cargo miembro comisión de base 1'),
  ('1000000164', '8', E'Cargo miembro comisión de base 2'),
  ('1000000165', '8', E'Cargo solicitado por'),
  ('1000000166', '8', E'Cargo presidente comisión de base');






  
CREATE SEQUENCE IF NOT EXISTS mod_logactivofijotangible.sec_confreporteaftentidad_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logactivofijotangible.sec_confreporteaftentidad_seq RESTART WITH 1000000423;

CREATE TABLE IF NOT EXISTS mod_logactivofijotangible.conf_reporteaftentidad (
  idconfreporteaftentidad NUMERIC(19,0) DEFAULT nextval('mod_logactivofijotangible.sec_confreporteaftentidad_seq'::regclass) NOT NULL,
  idconfreporteaft NUMERIC(19,0) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  valor VARCHAR(500),
  CONSTRAINT conf_reporteaftentidad_pkey PRIMARY KEY(idconfreporteaftentidad),
  CONSTRAINT conf_reporteaftentidad_fk FOREIGN KEY (idconfreporteaft)
    REFERENCES mod_logactivofijotangible.conf_reporteaft(idconfreporteaft)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logactivofijotangible.conf_reporteaftentidad
  OWNER TO zeolides;