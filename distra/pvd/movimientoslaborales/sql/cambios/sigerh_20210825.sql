CREATE SEQUENCE mod_fuerzatrabajo.sec_confcategoriasdemanda_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE mod_fuerzatrabajo.sec_confcategoriasdemanda_seq RESTART WITH 19;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_confcategoriasdemanda_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_categoriasdemanda".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_confedadjubilacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE mod_fuerzatrabajo.sec_confedadjubilacion_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_confedadjubilacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_edadjubilacion".';

CREATE SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 8
  CACHE 1;

ALTER SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq RESTART WITH 9;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_modalidadempleo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_modalidadempleo.';

CREATE SEQUENCE mod_fuerzatrabajo.sec_procesodemanda_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_fuerzatrabajo.sec_procesodemanda_seq RESTART WITH 3;

ALTER TABLE mod_fuerzatrabajo.dat_pedido
  DROP CONSTRAINT fk_tipoperiodo_pedido_idtipoperiodo RESTRICT;

COMMENT ON SCHEMA mod_fuerzatrabajo
IS 'Agrupa los datos del componente fuerza de trabajo. Versión 1. (RRHH)
1- Gestión de la demanda de la fuerza laboral.
2- Gestión de los movimiento laborales en la(s) entidad(es).';

ALTER SEQUENCE mod_fuerzatrabajo.sec_clasificacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 4
  RESTART 9 CACHE 1
  NO CYCLE;

ALTER SEQUENCE mod_fuerzatrabajo.sec_confmotivosbaja_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  RESTART 2 CACHE 1
  NO CYCLE;

ALTER SEQUENCE mod_fuerzatrabajo.sec_confniveles_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  RESTART 91 CACHE 1
  NO CYCLE;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_disponible_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_disponible".';

ALTER SEQUENCE mod_fuerzatrabajo.sec_imputable_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 2
  RESTART 6 CACHE 1
  NO CYCLE;

ALTER SEQUENCE mod_fuerzatrabajo.sec_interrupcion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 20
  RESTART 12 CACHE 1
  NO CYCLE;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_interrupto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_interrupto".';

ALTER SEQUENCE mod_fuerzatrabajo.sec_motivobaja_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 22
  RESTART 174 CACHE 1
  NO CYCLE;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_motivobaja_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivobaja".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_motivodisponibilidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivodisponibilidad".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_motivointerrupcion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivointerrupcion".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_motivomovimiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivomovimiento".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_pedido_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_pedido".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_pedidocomposicion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_pedidocomposicion".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_periodo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_periodo".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_plantillatipocontrato_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_plantillatipocontrato".';

ALTER SEQUENCE mod_fuerzatrabajo.sec_procesodisponibilidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  RESTART 3 CACHE 1
  NO CYCLE;

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_reserva_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_reserva".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_suplemento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_suplemento".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_tipocontrato_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipocontrato".';

COMMENT ON SEQUENCE mod_fuerzatrabajo.sec_tipoperiodo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoperiodo".';

ALTER SEQUENCE mod_fuerzatrabajo.sec_via_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  RESTART 2 CACHE 1
  NO CYCLE;

ALTER TABLE mod_fuerzatrabajo.conf_nromn
  ALTER COLUMN anno SET NOT NULL;

COMMENT ON TABLE mod_fuerzatrabajo.nom_conceptosalarial
IS 'Almacena los conceptos salariales.';

ALTER TABLE mod_fuerzatrabajo.nom_conceptosalarial
  ALTER COLUMN reporte_registro_trabajadores DROP DEFAULT;

ALTER TABLE mod_fuerzatrabajo.nom_conceptosalarial
  ALTER COLUMN reporte_registro_trabajadores TYPE NUMERIC(1,0);

ALTER TABLE mod_fuerzatrabajo.nom_conceptosalarial
  ALTER COLUMN reporte_registro_trabajadores SET DEFAULT 0;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.gestion
IS 'Determina si el registro es gestionable(1) o no(0).';

ALTER TABLE mod_fuerzatrabajo.nom_motivobaja
  ADD COLUMN fluctuacion NUMERIC(19,0) DEFAULT 2;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivobaja.fluctuacion
IS 'Determina si la causa de la baja influye o no en la fluctuación laboral.
1-si
0-no';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivodisponibilidad.fdesde
IS 'Fecha de entrada en vigor del motivo de disponibilidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivodisponibilidad.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivodisponibilidad.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

ALTER TABLE mod_fuerzatrabajo.nom_motivointerrupcion
  ALTER COLUMN denominacion TYPE VARCHAR(255) COLLATE pg_catalog."default";

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivointerrupcion.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivointerrupcion.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivointerrupcion.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON TABLE mod_fuerzatrabajo.nom_motivomovimiento
IS 'Almacena los motivos que conducen a movimientos de la ubicación laboral de la persona.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivomovimiento.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivomovimiento.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_motivomovimiento.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON TABLE mod_fuerzatrabajo.dat_movimientonomina
IS 'Almacena los movimientos de una persona para su cargo en la entidad, retribuyendo al módulo de nómina y retribución salarial.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.idmovimientonomina
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.identidad
IS 'Identificador de la entidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.idcargo
IS 'Identificador del cargo.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.fdesde
IS 'Fecha de inicio del movimiento.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_movimientonomina.consecutivo
IS 'Indicador consecutivo.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_procedenciasocial.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON CONSTRAINT pk_procedenciasocial ON mod_fuerzatrabajo.nom_procedenciasocial
IS 'LLave primaria para identificar la tupla.';

COMMENT ON TABLE mod_fuerzatrabajo.nom_programalaboral
IS 'Almacena los programas laborales.';

COMMENT ON TABLE mod_fuerzatrabajo.conf_suplemento
IS 'Almacena la configuración de la entidad y la plantilla del suplemento.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_suplemento.idsuplemento
IS 'Identificador del suplemento.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_suplemento.identidad
IS 'Identificador de la entidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.conf_suplemento.idplantilla
IS 'Identificador de la plantilla del suplemento.';

ALTER INDEX mod_fuerzatrabajo.pk_suplemento
  RENAME TO conf_suplemento_pkey;

COMMENT ON COLUMN mod_fuerzatrabajo.nom_tipocontrato.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_tipoperiodo.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON TABLE mod_fuerzatrabajo.conf_conceptosalarialnomina
IS 'Almacena la configuración del concepto salarial del módulo de nómina y retribución salarial.';

ALTER TABLE mod_fuerzatrabajo.conf_conceptosalarialnomina
  ALTER COLUMN idconceptosalarial SET NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_reserva.listo
IS 'Determina si la persona se encuentra lista para tomar el cargo.
0-No listo
1-Listo';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_plantillatipocontrato.idplantillatipocontrato
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.nom_periodo.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

ALTER TABLE mod_fuerzatrabajo.dat_pedido
  ADD COLUMN idprocesodemanda NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedido.idprocesodemanda
IS 'Identificador del tipo de periodo al que corresponde el pedido.';

ALTER TABLE mod_fuerzatrabajo.dat_pedido
  ADD COLUMN fcertificacion DATE;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedido.fcertificacion
IS 'Determina la fech de certificación de la demanda';

ALTER TABLE mod_fuerzatrabajo.dat_pedido
  ADD COLUMN fconsolidacion DATE;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedido.fconsolidacion
IS 'Fecha en que se realiza la consolidación';

ALTER TABLE mod_fuerzatrabajo.dat_pedido
  ADD COLUMN importado NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedido.importado
IS 'Determina si el pedido es importado o no.
1-si
0-no';

COMMENT ON TABLE mod_fuerzatrabajo.dat_pedidocomposicion
IS 'Almacena los pedidos asociados al cargo o la especialidad.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.idpedidocomposicion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.bandera
IS 'Determina si la columna idcargoespecialidad contiene: 1->idcargo 2->idespecialidad 3->idespecilizacioncargo.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.idpedido
IS 'Identificador del pedido.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.directo
IS 'Determina el tipo de mano de obra: 0-> Indirecto, 1->Directo.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.idespecialidad
IS 'Identificador de la especialidad de empleo.';

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.modificado
IS 'Determina si el pedido realizado fue modificado. 0-> No modificado, 1-> Modificado.';

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  ADD COLUMN idprovincia NUMERIC(19,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.idprovincia
IS 'Identificador de la provincia para la que se va a demandar dicho cargo.';

ALTER TABLE mod_fuerzatrabajo.dat_pedidocomposicion
  ADD COLUMN idmunicipio NUMERIC(19,0);

COMMENT ON COLUMN mod_fuerzatrabajo.dat_pedidocomposicion.idmunicipio
IS 'Identificador del municipio para el que se demanda dicho cargo.';

ALTER TABLE mod_fuerzatrabajo.dat_pedido
  DROP COLUMN idtipoperiodo;

ALTER TABLE mod_fuerzatrabajo.nom_motivobaja
  DROP COLUMN bandera;

ALTER TABLE mod_fuerzatrabajo.nom_programalaboral
  ADD CONSTRAINT pk_programalaboral 
    PRIMARY KEY (idprogramalaboral) NOT DEFERRABLE;

CREATE INDEX idx_idpadre_motivobaja ON mod_fuerzatrabajo.nom_motivobaja
  USING btree (idpadre);

COMMENT ON INDEX mod_fuerzatrabajo.idx_idpadre_motivobaja
IS 'Índice sobre la(s) columna(s) "idpadre" para agilizar la búsqueda de información.';

CREATE INDEX fki_fk_pedido_procesodemanda ON mod_fuerzatrabajo.dat_pedido
  USING btree (idprocesodemanda);

ALTER TABLE mod_fuerzatrabajo.conf_niveles
  ADD CONSTRAINT pk_idconfnivel 
    PRIMARY KEY (idconfnivel) NOT DEFERRABLE;

ALTER TABLE mod_fuerzatrabajo.nom_procedenciasocial
  ADD CONSTRAINT fk_procedenciasocial_procedenciasocial_idprocedenciasocial FOREIGN KEY (idpadre)
    REFERENCES mod_fuerzatrabajo.nom_procedenciasocial(idprocedenciasocial)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;