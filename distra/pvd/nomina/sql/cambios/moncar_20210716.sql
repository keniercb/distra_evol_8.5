CREATE SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 147
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_asociacioncuentascontables".';

CREATE SEQUENCE mod_nomina.sec_camposreportecorreo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_camposreportecorreo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_camposreportecorreo".';

CREATE SEQUENCE mod_nomina.sec_camposreportecorreoentidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_camposreportecorreoentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_camposreportecorreoentidad".';

CREATE SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personaestructuranominacobrosypagos".';

CREATE SEQUENCE mod_nomina.sec_datelaborarpagoreferencia_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 15
  CACHE 1;

CREATE SEQUENCE mod_nomina.sec_periodosdestajo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999 START 16
  CACHE 1;

ALTER SEQUENCE mod_nomina.sec_periodosdestajo_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_nomina.sec_periodosdestajo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_periodosdestajo".';

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  DROP CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina RESTRICT;

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio0508
  DROP CONSTRAINT fk_registsalartiempservc_registrosalariotiemposervcio RESTRICT;

ALTER TABLE mod_nomina.dat_cargosocupados
  DROP CONSTRAINT fk_filaestruc_cargosocupados_idfila RESTRICT;

ALTER TABLE mod_nomina.conf_pagosporresultado
  DROP CONSTRAINT fk_tipopago_pagosporresultado RESTRICT;

ALTER TABLE mod_nomina.conf_escalaelementosalarialpersona
  DROP CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona RESTRICT;

ALTER TABLE mod_nomina.conf_escalaelementosalarial
  DROP CONSTRAINT conf_escalaelementosalarial_fk1 RESTRICT;

ALTER TABLE mod_nomina.nom_areascargos
  DROP CONSTRAINT pk_areascargos RESTRICT;

ALTER TABLE mod_nomina.conf_pagosporresultado
  DROP CONSTRAINT ak_tipopago RESTRICT;

COMMENT ON SCHEMA mod_nomina
IS 'Agrupa los datos del componente nómina. Versión 1. (RRHH)


UPDATE pg_class SET relowner = (SELECT oid FROM pg_roles WHERE rolname = ''zeolides'')
WHERE relname IN (SELECT relname FROM pg_class, pg_namespace
WHERE pg_namespace.oid = pg_class.relnamespace AND
pg_namespace.nspname = ''mod_nomina'');';

CREATE OR REPLACE FUNCTION mod_nomina.f_asociar_area_cargo_pgxr (
)
RETURNS boolean AS
$body$
DECLARE
 vr_respuesta boolean;
 cant_cargospagoporresultado numeric;
 vr_a record;
 
BEGIN
SELECT count(*) into cant_cargospagoporresultado FROM mod_nomina.conf_cargospagoporresultado;
IF(cant_cargospagoporresultado > 0) THEN
  for vr_a in (SELECT idarea, idcargo FROM mod_nomina.nom_areascargos
        WHERE idcargo in (SELECT distinct idcargo FROM mod_nomina.conf_cargospagoporresultado)) loop
    IF(vr_a.idcargo IS NOT NULL) THEN
      RAISE NOTICE 'Asignando el área: % con el cargo: % en la tabla mod_nomina.conf_cargospagoporresultado.',vr_a.idarea,vr_a.idcargo;
      UPDATE mod_nomina.conf_cargospagoporresultado
      SET idarea=vr_a.idarea
      WHERE idcargo=vr_a.idcargo and idarea is null;
      vr_respuesta := 't';
    ELSE
      RAISE NOTICE 'La tabla mod_nomina.nom_areascargos "NO" contiene datos que procesar.';
      vr_respuesta := 'f';
    END IF;
  end loop;
ELSE
RAISE NOTICE 'La tabla mod_nomina.conf_cargospagoporresultado "NO" contiene datos que procesar.';
vr_respuesta := 'f';
END IF;
return vr_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_elementossalariales_cargainicial (
)
RETURNS boolean AS
$body$
DECLARE
 v_respuesta boolean := 'f';
 v_cargoestruct record;
 v_cargoselementos numeric;
 old_sistpago numeric;
 v_insert integer := 0;
 v_exist integer := 0;
BEGIN

for v_cargoestruct in (select c.idcargo,s.salario as importe,ge.idgrupocomplejidad as idgrupoescala,
c.idtipoescala as idescalasueldocargo from mod_estructuracomp.dat_cargo as c
inner join mod_estructuracomp.nom_cargo as nc on (c.idnomcargo = nc.idnomcargo)
inner join mod_estructuracomp.nom_salario as s on (s.idsalario = c.idsalario)
inner join mod_estructuracomp.nom_grupocomplejidad as ge on (s.idgrupocomplejidad = ge.idgrupocomplejidad)
inner join mod_estructuracomp.nom_tipoescala as te on (te.idtipoescala = c.idtipoescala)) loop
IF(v_cargoestruct IS NOT NULL) THEN
SELECT idcargo INTO v_cargoselementos FROM mod_nomina.conf_elementosalarialcargo as ceac
WHERE ceac.idcargo = v_cargoestruct.idcargo;
IF (v_cargoselementos IS NULL) THEN
raise notice 'Cargo estructura: % NO existe en nomina.',v_cargoestruct.idcargo;
--Insertar
INSERT INTO mod_nomina.conf_elementosalarialcargo(
idsistemapago, idperiodopago, idgrupoescala, idsectorsalarial, idescalasueldocargo,
importe, idcargo, tiposalarioescala)
    VALUES (12, 7, v_cargoestruct.idgrupoescala, 0, v_cargoestruct.idescalasueldocargo,
            v_cargoestruct.importe, v_cargoestruct.idcargo, 0);
v_insert := v_insert+1;
ELSE
raise notice 'Cargo % CONFIGURADO en nomina.',v_cargoestruct.idcargo;
SELECT idsistemapago INTO old_sistpago FROM mod_nomina.conf_elementosalarialcargo WHERE idcargo = v_cargoestruct.idcargo;
raise notice 'Sistema de pago cambiado de % a %.',old_sistpago,12;
UPDATE mod_nomina.conf_elementosalarialcargo SET idsistemapago=12 where idcargo = v_cargoestruct.idcargo;
v_exist := v_exist+1;
END IF;
   v_respuesta := 't';
END IF;
end loop;
raise notice 'Cantidad de cargos insertados: % , cantidad existentes: % .',v_insert,v_exist;
return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.f_escalaelemetossalariales_cargainicial (
)
RETURNS boolean AS
$body$
DECLARE
 v_respuesta boolean := 'f';
 v_cargo record;
 v_importe integer :=0;
 v_elementosalarialconceptarif record;
 v_cont integer :=0;
 v_cantconcepttarif integer;
BEGIN
for v_cargo in (SELECT c.idcargo, n.denominacion, cc.idcategocup,et.idescalatarifa, et.valorescalar, et.importe, cpdes.idconfconceptospdelementossalariales
                       FROM mod_estructuracomp.nom_cargo as n
        inner join mod_estructuracomp.dat_cargo as c on (n.idnomcargo = c.idnomcargo)
        inner join mod_estructuracomp.dat_cargocivil as cc on (c.idcargo = cc.idcargo)
        inner join mod_nomina.conf_elementosalarialcargo as esc on (c.idcargo = esc.idcargo)
        inner join mod_nomina.conf_conceptospdelementossalariales as cpdes on (esc.idelementosalarialcargo = cpdes.idelementosalarialcargo)
        inner join mod_nomina.nom_conceptopdtarifa as cpdt on (cpdes.idconceptopercepciondescuento = cpdt.idconceptopercepciondescuento )
        inner join mod_nomina.nom_escalatarifa as et on (cpdt.idconceptopdtarifa = et.idconceptopdtarifa)
      where et.idescalatarifa=311and cc.idcategocup =6) loop
if(v_cargo.importe is null )then
              v_cargo.importe:=0.00;
          end if;
IF(v_cargo IS NOT NULL) THEN
   SELECT idconfconceptospdelementossalariales into v_elementosalarialconceptarif FROM mod_nomina.conf_escalaelementosalarial WHERE idconfconceptospdelementossalariales = v_cargo.idconfconceptospdelementossalariales;
   if (v_elementosalarialconceptarif is null) then

            INSERT INTO mod_nomina.conf_escalaelementosalarial(idescalatarifa, idconfconceptospdelementossalariales, importe)
            VALUES (v_cargo.idescalatarifa, v_cargo.idconfconceptospdelementossalariales, v_cargo.importe);
             v_cont:=v_cont+1;
        else
          raise notice 'YA EXISTE LA ESCALA ASOCIADA AL CONCEPTO';
        end if;
    else
  raise notice 'No hay cargos con categoria de cuadros';
end if;
end loop;
raise notice 'Cantidad de escalas: %.',v_cont;
v_respuesta := 't';
   return v_respuesta;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_nomina.ft_del_last_idp_ide (
)
RETURNS trigger AS
$body$
DECLARE
      v_cargoocupado record;
BEGIN
     IF (TG_OP = 'DELETE') THEN
-- Al eliminar de la tabla "dat_cargosocupados"
  SELECT OLD.idpersona||''||OLD.identidad AS denom, count(OLD.idpersona||''||OLD.identidad) AS cant
  INTO v_cargoocupado FROM mod_nomina.dat_cargosocupados
  WHERE (OLD.idpersona||''||OLD.identidad = idpersona||''||identidad::text)
  GROUP BY OLD.idpersona||''||OLD.identidad;
  --RAISE EXCEPTION 'denom: % , cant: %',v_cargoocupado.denom,v_cargoocupado.cant;
-- 1- Verificar si es la última ocurrencia del par "idpersona,identidad"
  IF (v_cargoocupado.cant = 1) THEN
--    1.1- V: Eliminar en "dat_retencionpersona" --FK (CASCADE)--> "his_retencionpersona"
     DELETE FROM mod_nomina.dat_retencionpersona WHERE v_cargoocupado.denom = idpersona||''||identidad::text;
--     V: Eliminar en "conf_vacacionespersona" , "dat_vacacionespersona" --FK (CASCADE)--> "his_vacacionespersona"
     DELETE FROM mod_nomina.conf_vacacionespersona WHERE v_cargoocupado.denom = idpersona||''||idestructura::text;
     DELETE FROM mod_nomina.dat_vacacionespersona WHERE v_cargoocupado.denom = idpersona||''||identidad::text;
--         V: Eliminar en "dat_registrosalariotiemposervcio"
     DELETE FROM mod_nomina.dat_registrosalariotiemposervcio WHERE v_cargoocupado.denom = idpersona||''||idestructura::text;
     RETURN OLD;
  ELSE
      RAISE NOTICE '%',v_cargoocupado.denom;
      --DELETE FROM mod_nomina.dat_cargosocupados WHERE idcargosocupados = OLD.idcargosocupados;
  END IF;
     /*
        SELECT cast(OLD.idcargosocupados as numeric) INTO v_idcargoocupado
        FROM mod_nomina.dat_cargosocupados
        WHERE NEW.idsituacionlaboral IS NULL AND OLD.idsituacionlaboral IS NOT NULL;
        PERFORM mod_nomina.f_del_elementosalarialsituacionservicio(v_idcargoocupado);
        --RAISE EXCEPTION '%',v_idcargoocupado;*/
      END IF;
      RETURN OLD;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER SEQUENCE mod_nomina.sec_afiliacionpolitica_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 13
  RESTART 4 CACHE 1
  NO CYCLE;

ALTER SEQUENCE mod_nomina.sec_conf_exportacionbancoficheroentidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999999 START 28
  RESTART 46 CACHE 1
  NO CYCLE;

COMMENT ON TABLE mod_nomina.conf_afiliacionpolitica
IS 'Almacena las afiliaciones.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.idconfafiliacion
IS 'Identificador de la tupla.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.idafiliacion
IS 'Identificador de la afiliacion.';

ALTER TABLE mod_nomina.conf_afiliacionpolitica
  ALTER COLUMN idafiliacion SET DEFAULT 0;

ALTER TABLE mod_nomina.conf_afiliacionpolitica
  ALTER COLUMN idafiliacion SET NOT NULL;

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.denominacion
IS 'Denominación de la afiliacion.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.tipospagos
IS 'Identificador de los tipos de pago.';

COMMENT ON COLUMN mod_nomina.conf_afiliacionpolitica.idformula
IS 'Identificador la formula.';

ALTER INDEX mod_nomina.pk_afiliacionpolitica
  RENAME TO pk_idconfafiliacion;

ALTER TABLE mod_nomina.conf_agrupadorareas
  ADD COLUMN identidad NUMERIC(19,0) NOT NULL;

ALTER TABLE mod_nomina.nom_areas
  ADD COLUMN multipleseleccioncargos NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_nomina.nom_areas.multipleseleccioncargos
IS 'Columna para definir si se puede asociar a las plantillas nominales cargos asociados en otras plantillas: 1-Si 0-No';

CREATE TABLE mod_nomina.conf_asociacioncuentascontables (
  idasociacioncuentascont NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_asociacioncuentascontables_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idtiponomina NUMERIC(19,0) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  cuentasdeudoras VARCHAR(255) NOT NULL,
  cuentasacreedoras TEXT,
  CONSTRAINT pk_idasociacioncuentascont PRIMARY KEY(idasociacioncuentascont)
) 
WITH (oids = false);

COMMENT ON TABLE mod_nomina.conf_asociacioncuentascontables
IS 'Almacena las asociaciones de las cuentas contables.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.idasociacioncuentascont
IS 'Identificador de la tupla.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.identidad
IS ' Identificador de la entidad.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.idtiponomina
IS ' Identificador del tipo de nomina.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.cuentasdeudoras
IS 'Identificador de la cuenta deudora.';

COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.cuentasacreedoras
IS 'Identificadores de los las cuentas acreedoras.';

CREATE TABLE mod_nomina.conf_camposreportecorreo (
  idcamporeportecorreo NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_camposreportecorreo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  idformula NUMERIC(19,0) NOT NULL,
  orden NUMERIC(19,0),
  descripcion VARCHAR(255),
  mostrarvacaciones NUMERIC(1,0),
  mostrarsnc NUMERIC(1,0),
  estotal NUMERIC(1,0),
  CONSTRAINT pk_idcamporeportecorreo PRIMARY KEY(idcamporeportecorreo)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.conf_camposreportecorreoentidad (
  idcamporeportecorreoentidad NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_camposreportecorreoentidad_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idcamporeportecorreo NUMERIC(19,0),
  CONSTRAINT pk_idcamporeportecorreoentidad PRIMARY KEY(idcamporeportecorreoentidad)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_camposreportecorreoentidad
  ALTER COLUMN idcamporeportecorreo SET STATISTICS 0;

ALTER TABLE mod_nomina.nom_causaexclusion
  ALTER COLUMN idcausaexclusion SET STATISTICS 0;

ALTER TABLE mod_nomina.nom_causaexclusion
  ALTER COLUMN denominacion SET STATISTICS 0;

ALTER TABLE mod_nomina.nom_causaexclusion
  ALTER COLUMN descripcion SET STATISTICS 0;

ALTER TABLE mod_nomina.nom_causaexclusion
  ALTER COLUMN fechainicio SET STATISTICS 0;

ALTER TABLE mod_nomina.nom_causaexclusion
  ALTER COLUMN fechafin SET STATISTICS 0;

ALTER TABLE mod_nomina.conf_exportacionbanco
  ADD COLUMN orden NUMERIC(19,0) DEFAULT 1;

ALTER TABLE mod_nomina.conf_exportacionbanco
  ALTER COLUMN idconfexportaciondbfbancoficheroentidad DROP NOT NULL;

ALTER INDEX mod_nomina.pk_exportacionbancoficheroentidad
  RENAME TO pk_confexportaciondbfbancofichero;

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ADD COLUMN cargoprincipal NUMERIC(1,0) DEFAULT 1;

COMMENT ON COLUMN mod_nomina.conf_tiporeportescertificaciones.cargoprincipal
IS 'Columna para definir si se va a gestionar las personas solo por el cargo principal o por el cargo principal y ademas el  cargo pluriempleado';

ALTER TABLE mod_nomina.dat_cargosocupados
  ALTER COLUMN idcentrocosto SET DEFAULT 0;

CREATE TABLE mod_nomina.dat_personaestructuranominacobrosypagos (
  idpersonaestructuranominacobrosypagos NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0),
  idestructuramodelodomina NUMERIC(19,0),
  iddocumentoobligacion NUMERIC(19,0),
  idcuenta NUMERIC(19,0),
  estado NUMERIC(1,0),
  importe NUMERIC(19,2),
  CONSTRAINT pk_personaestructuranominacobrosypagos PRIMARY KEY(idpersonaestructuranominacobrosypagos)
) 
WITH (oids = false);

CREATE TABLE mod_nomina.dat_elaborarpagosreferencia (
  idelaborarpagos NUMERIC(19,0) NOT NULL,
  idelaborarpagosreferenciados NUMERIC(19,0) NOT NULL,
  idelaborarpagosreferencia NUMERIC DEFAULT nextval('mod_nomina.sec_datelaborarpagoreferencia_seq'::regclass) NOT NULL,
  CONSTRAINT pk_idelaborarpagosreferencia PRIMARY KEY(idelaborarpagosreferencia)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ALTER COLUMN idestructuramodelodomina SET STATISTICS 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ALTER COLUMN idtiponomina SET STATISTICS 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ALTER COLUMN denominacion SET STATISTICS 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ALTER COLUMN idtipocampo SET STATISTICS 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ALTER COLUMN idvalormostrar SET STATISTICS 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ALTER COLUMN orden SET STATISTICS 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ALTER COLUMN textoformula TYPE VARCHAR COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN periodobusquedareferencianomina NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN comportamientocorreo NUMERIC(1,0) DEFAULT 1;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN descripcion VARCHAR(255);

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN sumapluriempleo NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD COLUMN tiporeferencia NUMERIC(1,0);

COMMENT ON COLUMN mod_nomina.conf_estructuramodelosnomina.tiporeferencia
IS '1. Referencias por rangos de fechas
2. Referencias especificas de los periodos de pago';

ALTER TABLE mod_nomina.nom_periodopago
  ADD COLUMN tipoperiodo NUMERIC(2,0) DEFAULT 0;

CREATE TABLE mod_nomina.dat_periodosdestajo (
  idperiodosdestajo NUMERIC(3,0) DEFAULT nextval('mod_nomina.sec_periodosdestajo_seq'::regclass) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  idpagoresultado NUMERIC(19,0) NOT NULL,
  fechainicio DATE NOT NULL,
  fechafin DATE,
  CONSTRAINT pk_periodosdestajo PRIMARY KEY(idperiodosdestajo)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.his_personabaja
  ALTER COLUMN tiempoacumuladoinicial DROP NOT NULL;

ALTER TABLE mod_nomina.his_personabaja
  ALTER COLUMN importeacumuladoinicial DROP NOT NULL;

ALTER TABLE mod_nomina.his_personabaja
  ALTER COLUMN idplantillanominal DROP NOT NULL;

ALTER TABLE mod_nomina.his_vacacionespersonabaja
  ALTER COLUMN ajusteimporte TYPE NUMERIC(19,2);

ALTER TABLE mod_nomina.his_vacacionespersonabaja
  ALTER COLUMN ajustetiempo TYPE NUMERIC(19,2);

ALTER TABLE mod_nomina.nom_areascargos
  ALTER COLUMN idareacargos DROP DEFAULT;

ALTER TABLE mod_nomina.nom_areascargos
  ALTER COLUMN idareacargos TYPE NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_areascargos
  ALTER COLUMN idareacargos SET DEFAULT nextval('mod_nomina.sec_areascargos_seq'::regclass);

ALTER TABLE mod_nomina.nom_areascargos
  ALTER COLUMN idcargo SET NOT NULL;

ALTER TABLE mod_nomina.nom_tipopago
  ADD COLUMN pagoxresultadosdestajo NUMERIC(1,0) DEFAULT 1;

ALTER TABLE mod_nomina.nom_tipopago
  ADD COLUMN orden NUMERIC(19,0);

ALTER TABLE mod_nomina.nom_tipopago
  ALTER COLUMN orden SET STATISTICS 0;

ALTER TABLE mod_nomina.dat_reportescertificaciones
  ADD COLUMN datos TEXT;

ALTER TABLE mod_nomina.dat_datosmodelonominaconceptos
  ALTER COLUMN iddatosmodelonominaconceptos SET STATISTICS 0;

ALTER TABLE mod_nomina.dat_datosmodelonominaconceptos
  ALTER COLUMN idestructuramodelosnomina SET STATISTICS 0;

ALTER TABLE mod_nomina.dat_datosmodelonominaconceptos
  ALTER COLUMN idconcepto SET STATISTICS 0;

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idparrafofiscal NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idclienteproveedorcobropago NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idtienecobrospagos NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idtipocobrospagos NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idtipointegracioncobrospagos NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN cuentacontable NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN liquidacobrosypagos NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_conceptoscontables
  ADD COLUMN idcampoliquidaobligacion NUMERIC(19,0);

COMMENT ON COLUMN mod_nomina.conf_conceptoscontables.idcampoliquidaobligacion
IS 'Campo de la estructura de nomina que liquida una obligacion';

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ALTER COLUMN descripcion TYPE VARCHAR COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN calculablehistoriconominasreportes NUMERIC(1,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN idexpresionmatematicahistoriconominasreportes NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones
  ADD COLUMN tiposnomina VARCHAR(500);

ALTER TABLE mod_nomina.conf_pagosporresultadofechas
  ALTER COLUMN idpagoporresultadofechas SET DEFAULT nextval('mod_nomina.sec_pagosporresultado_seq'::regclass);

ALTER TABLE mod_nomina.dat_retencionpersona
  ADD COLUMN idcuenta NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_variableglobalvalor
  ALTER COLUMN valor TYPE NUMERIC(19,2);

ALTER TABLE mod_nomina.conf_variableglobalvalor
  ALTER COLUMN valor SET STORAGE MAIN;

ALTER TABLE mod_nomina.conf_cargospagoporresultado
  ADD COLUMN idarea NUMERIC(19,0);

ALTER TABLE mod_nomina.dat_elementosreportescertificaciones
  ADD COLUMN idcargo NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ALTER COLUMN expresionmatematicaformula TYPE NUMERIC(19,0);

ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
  ADD COLUMN sumadestajo NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.conf_causasreporteausencia
  ALTER COLUMN idcausa TYPE VARCHAR COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.conf_causasreporteausencia
  ADD COLUMN horasdias NUMERIC(1,0);

ALTER TABLE mod_nomina.nom_conceptopdtarifa
  ALTER COLUMN importe TYPE VARCHAR(19) COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.nom_conceptopdtarifa
  ALTER COLUMN importe SET STORAGE EXTENDED;

ALTER TABLE mod_nomina.conf_vblesgblesregsaltmpserv
  ADD COLUMN anotaciones VARCHAR(255);

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
  ADD COLUMN registrotiponominamanual NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_nomina.dat_comprobantenomina
  ALTER COLUMN denomcuenta TYPE VARCHAR COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.dat_comprobantenomina
  ALTER COLUMN ci TYPE VARCHAR COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.dat_comprobantenomina
  ALTER COLUMN refretenciones TYPE VARCHAR COLLATE pg_catalog."default";

ALTER TABLE mod_nomina.dat_comprobantenomina
  ADD COLUMN abreviaturaret VARCHAR(100);

ALTER TABLE mod_nomina.dat_suerdoporcargoespecifico
  ALTER COLUMN idsuerdoporcargo SET STATISTICS 0;

ALTER TABLE mod_nomina.dat_suerdoporcargoespecifico
  ALTER COLUMN idsalarioespecifico SET STATISTICS 0;

ALTER TABLE mod_nomina.dat_suerdoporcargoespecifico
  ALTER COLUMN idelementosalarialcargo SET STATISTICS 0;

ALTER TABLE mod_nomina.his_vacacionespersona
  ALTER COLUMN ajusteimporte TYPE NUMERIC(19,2);

ALTER TABLE mod_nomina.his_vacacionespersona
  ALTER COLUMN ajustetiempo TYPE NUMERIC(19,2);

DROP FUNCTION mod_nomina.f_escalaelemetossalarialespersona_cargainicial();

ALTER TABLE mod_nomina.nom_areascargos
  ADD CONSTRAINT pk_idarea_cargo 
    PRIMARY KEY (idarea, idcargo) NOT DEFERRABLE;

CREATE INDEX idx_idregistsalartiempservc ON mod_nomina.dat_registrosalariotiemposervcio
  USING btree (idconfregistsalartiempservc);

ALTER TABLE mod_nomina.dat_cargosocupados
  ADD CONSTRAINT fk_filaestruc_cargosocupados_idfila FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_escalaelementosalarialpersona
  ADD CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona1 FOREIGN KEY (idconfconceptospdelementossalariales)
    REFERENCES mod_nomina.conf_conceptospdelementossalariales(idconfconceptospdelementossalariales)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_escalaelementosalarial
  ADD CONSTRAINT conf_escalaelementosalarial_fk2 FOREIGN KEY (idconfconceptospdelementossalariales)
    REFERENCES mod_nomina.conf_conceptospdelementossalariales(idconfconceptospdelementossalariales)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_nomina.conf_cargospagoporresultado
  ADD CONSTRAINT fk_idarea_idcargo FOREIGN KEY (idarea, idcargo)
    REFERENCES mod_nomina.nom_areascargos(idarea, idcargo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

DROP SEQUENCE IF EXISTS mod_nomina.sec_pagoporresultadofechas_seq;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina
  ADD CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina CHECK (((vacacionesdiasimporte = (0)::numeric) OR (vacacionesdiasimporte = (1)::numeric)) OR (vacacionesdiasimporte = (2)::numeric));

COMMENT ON CONSTRAINT chk_vacacionesdiasimporte_estructuramodelosnomina ON mod_nomina.conf_estructuramodelosnomina
IS 'Restricción sobre la(s) columna(s) "vacacionesdiasimporte".';

ALTER TABLE mod_nomina.dat_comprobantenomina
  ADD COLUMN orden NUMERIC(19,0) DEFAULT 1;