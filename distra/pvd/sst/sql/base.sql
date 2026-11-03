--
-- ACCIDENTES LABORALES
--

CREATE SCHEMA mod_sstaccidente;
ALTER SCHEMA mod_sstaccidente OWNER TO zeolides;
COMMENT ON SCHEMA mod_sstaccidente IS 'Esquema para el módulo "Seguridad y Salud en el Trabajo - Accidentes laborales"';

CREATE TYPE mod_sstaccidente.td_indicadores_anexo2 AS (
	cant_accidentados numeric,
	cant_fallecidos numeric,
	sum_importe_implicados numeric,
	sum_importe_acc_costo numeric
);
ALTER TYPE mod_sstaccidente.td_indicadores_anexo2 OWNER TO zeolides;

CREATE FUNCTION mod_sstaccidente.f_indicadores_anexo2(tipoacc numeric, categpers numeric, inictrimestre date, fintrimestre date, entidad numeric) RETURNS SETOF mod_sstaccidente.td_indicadores_anexo2
    LANGUAGE plpgsql
    AS $_$
DECLARE

v_td mod_sstaccidente.td_indicadores_anexo2;
accidentes record;

cant_acc_cv numeric;
cant_acc_fatales numeric;
sumatoria_importe numeric;
sumatoria_importe_costo numeric;

sum_cant_acc_cv numeric;
sum_cant_acc_fatales numeric;
sum_sumatoria_importe numeric;
sum_sumatoria_importe_costo numeric;

BEGIN
cant_acc_cv:=0;
cant_acc_fatales:=0;
sum_cant_acc_cv:=0;
sum_cant_acc_fatales:=0;
sum_sumatoria_importe:=0;
sum_sumatoria_importe_costo:=0;

for accidentes in (SELECT idaccidente, idtipoaccidente, fecha FROM mod_sstaccidente.dat_accidente WHERE idtipoaccidente = $1 and fecha BETWEEN $3 AND $4 and identidad = $5)
loop
--tipos de accidentes
/*
1;"Accidente de trabajo"
2;"Accidente de trayecto"
3;"Accidente equiparado"
4;"Accidente en actividades puramente militares"
*/

--categoria persona
--1 civil
--2 militar

--cant accidentados civiles
SELECT count(aimp.idpersona) into cant_acc_cv
  FROM mod_sstaccidente.dat_accidenteimplicado as aimp
  INNER JOIN mod_personaext.dat_categoria as cat using (idpersona)
  WHERE aimp.idaccidente = accidentes.idaccidente and cat.idcategoriapersona = $2;

--cant fallecidos
SELECT count(aimp.idpersona) into cant_acc_fatales
  FROM mod_sstaccidente.dat_accidenteimplicado as aimp
  INNER JOIN mod_personaext.dat_categoria as cat using (idpersona)
  WHERE aimp.idaccidente = accidentes.idaccidente and cat.idcategoriapersona = $2 and aimp.ffallecimiento is not null;

--suma de importe de implicados con subsidio
SELECT sum(implisub.importe) into sumatoria_importe
  FROM mod_sstaccidente.dat_accidenteimplicado as aimp
  INNER JOIN mod_personaext.dat_categoria as cat using (idpersona)
  INNER JOIN mod_sstaccidente.dat_implicadosubsidio as implisub on (aimp.idaccidenteimplicado = implisub.idaccidenteimplicado)
  WHERE aimp.idaccidente = accidentes.idaccidente and cat.idcategoriapersona = $2;

--suma importe del costo del accidente
SELECT sum(acosto.importe) into sumatoria_importe_costo
  FROM mod_sstaccidente.dat_accidentecosto as acosto
  WHERE acosto.idaccidente = accidentes.idaccidente;
  
raise notice 'En el accidente: % de tipo: % , 
              hay: % implicados con categoria de persona: %, 
              de ellos % fallecidos, 
              con importe de subsidio: % y 
              un costo del accidente de: % ',accidentes.idaccidente, $1, cant_acc_cv, $2,cant_acc_fatales,sumatoria_importe,sumatoria_importe_costo;

--sumar contador
sum_cant_acc_cv:=sum_cant_acc_cv+cant_acc_cv;
sum_cant_acc_fatales:=sum_cant_acc_fatales+cant_acc_fatales;

if(sumatoria_importe is not null)then
sum_sumatoria_importe:=sum_sumatoria_importe+sumatoria_importe;
else
sum_sumatoria_importe:=sum_sumatoria_importe+0;
end if;

if(sumatoria_importe_costo is not null)then
sum_sumatoria_importe_costo:=sum_sumatoria_importe_costo+sumatoria_importe_costo;
else
sum_sumatoria_importe_costo:=sum_sumatoria_importe_costo+0;
end if;

cant_acc_cv:=0;
cant_acc_fatales:=0;
sumatoria_importe:=0;
sumatoria_importe_costo:=0;

end loop;
v_td.cant_accidentados=sum_cant_acc_cv;
v_td.cant_fallecidos=sum_cant_acc_fatales;
v_td.sum_importe_implicados=sum_sumatoria_importe;
v_td.sum_importe_acc_costo=sum_sumatoria_importe_costo;
RETURN NEXT v_td;
END;
$_$;

ALTER FUNCTION mod_sstaccidente.f_indicadores_anexo2(tipoacc numeric, categpers numeric, inictrimestre date, fintrimestre date, entidad numeric) OWNER TO zeolides;

CREATE FUNCTION mod_sstaccidente.ft_causaaccidente_insertar() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	rec mod_sstaccidente.nom_causaaccidente;
BEGIN
    SET search_path =  mod_sst;
    IF (NEW.idpadre IS NULL)
    	THEN NEW.idpadre:= NEW.idcausaaccidente;
    END IF;         	
RETURN NEW;
END;
$$;

ALTER FUNCTION mod_sstaccidente.ft_causaaccidente_insertar() OWNER TO zeolides;

CREATE SEQUENCE mod_sstaccidente.sec_accidente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_accidente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_accidente_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.dat_accidente"';

CREATE SEQUENCE mod_sstaccidente.sec_agente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_agente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_agente_seq IS 'Secuencia que genera el identificador de la tabala "mod_sstaccidente.nom_agente"';

CREATE SEQUENCE mod_sstaccidente.sec_formaaccidente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_formaaccidente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_formaaccidente_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.nom_formaacciendente".';

CREATE SEQUENCE mod_sstaccidente.sec_tipoaccidente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_tipoaccidente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_tipoaccidente_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.nom_tipoaccidente".';

SET default_tablespace = '';

CREATE TABLE mod_sstaccidente.dat_accidente (
    idaccidente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_accidente_seq'::regclass) NOT NULL,
    lugar character varying(255) NOT NULL,
    idtipoaccidente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_tipoaccidente_seq'::regclass) NOT NULL,
    idformaaccidente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_formaaccidente_seq'::regclass) NOT NULL,
    idagente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_agente_seq'::regclass) NOT NULL,
    fecha date NOT NULL,
    hora character varying(5) NOT NULL,
    fregistro date DEFAULT now() NOT NULL,
    descripcion character varying(500),
    identidad numeric NOT NULL,
    equiparado numeric(1,0) DEFAULT 0 NOT NULL,
    nro character varying(15)
);
ALTER TABLE mod_sstaccidente.dat_accidente OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_accidente IS 'Almacena los datos básicos del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.idaccidente IS 'Identificador del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.lugar IS 'Lugar del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.idtipoaccidente IS 'Identificador del tipo de accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.idformaaccidente IS 'Identificador de la forma de accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.idagente IS 'Identificador del tipo de agente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.fecha IS 'Fecha en que ocurre el accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.hora IS 'Hora en que ocurre el accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.fregistro IS 'Fecha en que se registra el accidente en el sistema.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.descripcion IS 'Descripción del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.identidad IS 'Identificador de la entidad por la que se registra el accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.equiparado IS 'Determina si el accidente es de trabajo o equiparado a este.
1- Equiparado
2-No equiparado';
COMMENT ON COLUMN mod_sstaccidente.dat_accidente.nro IS 'Número del accidente. Formato No/Año. Ej. 3/2018. Este número se genera por entidades.';

CREATE SEQUENCE mod_sstaccidente.sec_accidentecausa_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_accidentecausa_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_accidentecausa_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.dat_accidentecausa"';

CREATE TABLE mod_sstaccidente.dat_accidentecausa (
    idaccidentecausa numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_accidentecausa_seq'::regclass) NOT NULL,
    idaccidente numeric(19,0) NOT NULL,
    idcausaaccidente numeric(19,0) NOT NULL,
    descripcion character varying(500),
    principal numeric(1,0) DEFAULT 0 NOT NULL
);
ALTER TABLE mod_sstaccidente.dat_accidentecausa OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_accidentecausa IS 'Almacena las causas del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecausa.idaccidentecausa IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecausa.idaccidente IS 'Identificador del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecausa.idcausaaccidente IS 'Identificador de la causa.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecausa.descripcion IS 'Descripción de la causa.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecausa.principal IS 'Determina la causa principal del accidente.';

CREATE SEQUENCE mod_sstaccidente.sec_accidentecomision_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_accidentecomision_seq OWNER TO zeolides;
CREATE TABLE mod_sstaccidente.dat_accidentecomision (
    idaccidentecomision numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_accidentecomision_seq'::regclass) NOT NULL,
    idaccidente numeric(19,0) NOT NULL,
    idcomision numeric(19,0) NOT NULL
);
ALTER TABLE mod_sstaccidente.dat_accidentecomision OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_accidentecomision IS 'Almacena las comisiones que investigan el accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecomision.idaccidentecomision IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecomision.idaccidente IS 'Identificador del accidente';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecomision.idcomision IS 'Identificador de la comisión.';

CREATE SEQUENCE mod_sstaccidente.sec_accidenteconclusiones_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_accidenteconclusiones_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_accidenteconclusiones_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.dat_accidenteconclusiones"';

CREATE TABLE mod_sstaccidente.dat_accidenteconclusiones (
    idaccidenteconclusion numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_accidenteconclusiones_seq'::regclass) NOT NULL,
    idaccidente numeric(19,0) NOT NULL,
    conclusion character varying(250) NOT NULL,
    fregistro date DEFAULT now() NOT NULL,
    idusuario numeric(19,0) NOT NULL
);
ALTER TABLE mod_sstaccidente.dat_accidenteconclusiones OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_accidenteconclusiones IS 'Almacena las conclusiones del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteconclusiones.idaccidenteconclusion IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteconclusiones.idaccidente IS 'Identificador del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteconclusiones.conclusion IS 'Conclusión del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteconclusiones.fregistro IS 'Fecha de registro de la conclusión.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteconclusiones.idusuario IS 'Identificador del usuario que registra la conclusión.';

CREATE SEQUENCE mod_sstaccidente.sec_accidentecosto_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_accidentecosto_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_accidentecosto_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.dat_accidentecosto"';

CREATE TABLE mod_sstaccidente.dat_accidentecosto (
    idaccidentecosto numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_accidentecosto_seq'::regclass) NOT NULL,
    idaccidente numeric(19,0) NOT NULL,
    denominacion character varying(250) NOT NULL,
    importe numeric(10,2) NOT NULL,
    fregistro date DEFAULT now() NOT NULL,
    idusuario numeric(19,0) NOT NULL
);
ALTER TABLE mod_sstaccidente.dat_accidentecosto OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_accidentecosto IS 'Almacena los costos del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecosto.idaccidentecosto IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecosto.idaccidente IS 'Identificador del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecosto.denominacion IS 'Denominación del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecosto.importe IS 'Costo del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecosto.fregistro IS 'Fecha en la que se registra el costo.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidentecosto.idusuario IS 'Identificador del usuario que registra el costo.';

CREATE SEQUENCE mod_sstaccidente.sec_accidenteimplicado_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_accidenteimplicado_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_accidenteimplicado_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.dat_accidenteimplicado"';

CREATE TABLE mod_sstaccidente.dat_accidenteimplicado (
    idaccidenteimplicado numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_accidenteimplicado_seq'::regclass) NOT NULL,
    idaccidente numeric(19,0) NOT NULL,
    idpersona numeric(19,0) NOT NULL,
    idtipoinvalidez numeric(19,0) NOT NULL,
    tareahabitual numeric(19,0) DEFAULT 1 NOT NULL,
    ffallecimiento date,
    descfallecido character varying(500)
);

ALTER TABLE mod_sstaccidente.dat_accidenteimplicado OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_accidenteimplicado IS 'Almacena la información de los implicados del accidente..';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteimplicado.idaccidenteimplicado IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteimplicado.idaccidente IS 'Identificador del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteimplicado.idpersona IS 'Identificador de la persona implicada';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteimplicado.idtipoinvalidez IS 'Identificador del tipo de invalides del implicado';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteimplicado.tareahabitual IS 'Determina si el implicado realizaba una tarea habitual al ocurrir el accidente. 0->No 1->Si';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteimplicado.ffallecimiento IS 'Fecha de fallecimiento del implicado en el accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenteimplicado.descfallecido IS 'Descripción del fallecimiento de la persona.';

CREATE SEQUENCE mod_sstaccidente.sec_accidenterecomendacion_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_accidenterecomendacion_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_accidenterecomendacion_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.dat_accidenterecomendaciones"''';

CREATE TABLE mod_sstaccidente.dat_accidenterecomendacion (
    idaccidenterecomendacion numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_accidenterecomendacion_seq'::regclass) NOT NULL,
    idaccidente numeric(19,0) NOT NULL,
    recomendacion character varying(250) NOT NULL,
    fregistro date DEFAULT now() NOT NULL,
    idusuario numeric(19,0) NOT NULL
);
ALTER TABLE mod_sstaccidente.dat_accidenterecomendacion OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_accidenterecomendacion IS 'Almacena las recomendaciones del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenterecomendacion.idaccidenterecomendacion IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenterecomendacion.idaccidente IS 'Identificador del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenterecomendacion.recomendacion IS 'Describe la recomendación del accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenterecomendacion.fregistro IS 'Fecha en la que se registra la recomendacion.';
COMMENT ON COLUMN mod_sstaccidente.dat_accidenterecomendacion.idusuario IS 'Identificador del usuario que registra la recomendación.';

CREATE SEQUENCE mod_sstaccidente.sec_implicadopartecuerpo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_implicadopartecuerpo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_implicadopartecuerpo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.dat_implicadopartecuerpo"';

CREATE TABLE mod_sstaccidente.dat_implicadopartecuerpo (
    idimplicadopartecuerpo numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_implicadopartecuerpo_seq'::regclass) NOT NULL,
    idaccidenteimplicado numeric(19,0) NOT NULL,
    idpartecuerpo numeric(19,0) NOT NULL,
    idnaturalezalesion numeric(19,0) NOT NULL,
    descripcion character varying(255)
);
ALTER TABLE mod_sstaccidente.dat_implicadopartecuerpo OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_implicadopartecuerpo IS 'Almacena las partes del cuerpo afectadas por cada implicado en el accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadopartecuerpo.idimplicadopartecuerpo IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadopartecuerpo.idaccidenteimplicado IS 'Identidicador del implicado.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadopartecuerpo.idpartecuerpo IS 'Identificador de la parte del cuerpo afectada en el accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadopartecuerpo.idnaturalezalesion IS 'Identificador de la naturaleza de la lesión.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadopartecuerpo.descripcion IS 'Descripción de la lesión.';

CREATE SEQUENCE mod_sstaccidente.sec_implicadosubsidio_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_implicadosubsidio_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_implicadosubsidio_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.dat_implicadosubsidio"';

CREATE TABLE mod_sstaccidente.dat_implicadosubsidio (
    idimplicadosubsidio numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_implicadosubsidio_seq'::regclass) NOT NULL,
    idaccidenteimplicado numeric(19,0) NOT NULL,
    denominacion character varying(250) NOT NULL,
    importe numeric(10,2) NOT NULL,
    fregistro date DEFAULT now() NOT NULL
);
ALTER TABLE mod_sstaccidente.dat_implicadosubsidio OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.dat_implicadosubsidio IS 'Almacena los subsidios de los implicados en el accidente.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadosubsidio.idimplicadosubsidio IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadosubsidio.idaccidenteimplicado IS 'Identidicador del implicado.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadosubsidio.denominacion IS 'Denominación del subsidio.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadosubsidio.importe IS 'Importe del subsidio.';
COMMENT ON COLUMN mod_sstaccidente.dat_implicadosubsidio.fregistro IS 'Fecha en la que se registra el subsidio.';

CREATE TABLE mod_sstaccidente.nom_agente (
    idagente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_agente_seq'::regclass) NOT NULL,
    idtipoagente numeric(19,0) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL,
    CONSTRAINT chk_agente_gestion CHECK (((gestion = (0)::numeric) OR (gestion = (1)::numeric)))
);
ALTER TABLE mod_sstaccidente.nom_agente OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.nom_agente IS 'Almacena los agentes relacionados con el accidente laboral';
COMMENT ON COLUMN mod_sstaccidente.nom_agente.idtipoagente IS 'Identificador del tipo de agente.';
COMMENT ON COLUMN mod_sstaccidente.nom_agente.denominacion IS 'Denominacion del agente.';
COMMENT ON COLUMN mod_sstaccidente.nom_agente.descripcion IS 'Descripción del agente.';
COMMENT ON COLUMN mod_sstaccidente.nom_agente.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_agente.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_agente.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstaccidente.sec_causaaccidente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_causaaccidente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_causaaccidente_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.nom_causaaccidente".';

CREATE TABLE mod_sstaccidente.nom_causaaccidente (
    idcausaaccidente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_causaaccidente_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL,
    idpadre numeric(19,0) NOT NULL
);
ALTER TABLE mod_sstaccidente.nom_causaaccidente OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.nom_causaaccidente IS 'Almacena las causas de accidente';
COMMENT ON COLUMN mod_sstaccidente.nom_causaaccidente.idcausaaccidente IS 'Identificador de la causa del accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_causaaccidente.denominacion IS 'Denominación de ña causa del accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_causaaccidente.descripcion IS 'Descripción de la causa del accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_causaaccidente.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_causaaccidente.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_causaaccidente.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE TABLE mod_sstaccidente.nom_formaaccidente (
    idformaaccidente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_formaaccidente_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstaccidente.nom_formaaccidente OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.nom_formaaccidente IS 'Almacena las formas de accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_formaaccidente.idformaaccidente IS 'Identificador de la forma de accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_formaaccidente.denominacion IS 'Denominación de la forma de accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_formaaccidente.descripcion IS 'Descripción de la forma de accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_formaaccidente.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_formaaccidente.fhasta IS 'fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_formaaccidente.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstaccidente.sec_naturalezalesion_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_naturalezalesion_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_naturalezalesion_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.nom_naturalezalesion".';

CREATE TABLE mod_sstaccidente.nom_naturalezalesion (
    idnaturalezalesion numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_naturalezalesion_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstaccidente.nom_naturalezalesion OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.nom_naturalezalesion IS 'Almacena las naturaleza de lesión.';
COMMENT ON COLUMN mod_sstaccidente.nom_naturalezalesion.idnaturalezalesion IS 'Identificador de la naturaleza de lesión.';
COMMENT ON COLUMN mod_sstaccidente.nom_naturalezalesion.denominacion IS 'Denominación de la naturaleza de lesión.';
COMMENT ON COLUMN mod_sstaccidente.nom_naturalezalesion.descripcion IS 'Descripción de la naturaleza de lesión.';
COMMENT ON COLUMN mod_sstaccidente.nom_naturalezalesion.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_naturalezalesion.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_naturalezalesion.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstaccidente.sec_partecuerpo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_partecuerpo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_partecuerpo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.nom_partecuerpo".';

CREATE TABLE mod_sstaccidente.nom_partecuerpo (
    idpartecuerpo numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_partecuerpo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstaccidente.nom_partecuerpo OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.nom_partecuerpo IS 'Almacena las partes del cuerpo';
COMMENT ON COLUMN mod_sstaccidente.nom_partecuerpo.idpartecuerpo IS 'Identificador de la parte del cuerpo.';
COMMENT ON COLUMN mod_sstaccidente.nom_partecuerpo.denominacion IS 'Denominación de la parte del cuerpo.';
COMMENT ON COLUMN mod_sstaccidente.nom_partecuerpo.descripcion IS 'Descripción de la parte de cuerpo.';
COMMENT ON COLUMN mod_sstaccidente.nom_partecuerpo.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_partecuerpo.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_partecuerpo.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE TABLE mod_sstaccidente.nom_tipoaccidente (
    idtipoaccidente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_tipoaccidente_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstaccidente.nom_tipoaccidente OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.nom_tipoaccidente IS 'Almacena los tipos de accidentes.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoaccidente.idtipoaccidente IS 'Identificador del tipo de accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoaccidente.denominacion IS 'Denominación del tipo de accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoaccidente.descripcion IS 'Descripción del tipo de accidente.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoaccidente.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoaccidente.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoaccidente.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstaccidente.sec_tipoagente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_tipoagente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_tipoagente_seq IS 'Secuancia que genera el identificador de la tabla "mod_sstaccidente.nom_tipoagente".';

CREATE TABLE mod_sstaccidente.nom_tipoagente (
    idtipoagente numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_tipoagente_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstaccidente.nom_tipoagente OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.nom_tipoagente IS 'Almacena los tipos de agente.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoagente.idtipoagente IS 'Identificador del tipo de agente.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoagente.denominacion IS 'Denominación del tipo de agente.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoagente.descripcion IS 'Descripción del tipo de agente.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoagente.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoagente.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoagente.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstaccidente.sec_tipoinvalidez_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstaccidente.sec_tipoinvalidez_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstaccidente.sec_tipoinvalidez_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstaccidente.nom_tipoinvalidez".';

CREATE TABLE mod_sstaccidente.nom_tipoinvalidez (
    idtipoinvalidez numeric(19,0) DEFAULT nextval('mod_sstaccidente.sec_tipoinvalidez_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstaccidente.nom_tipoinvalidez OWNER TO zeolides;
COMMENT ON TABLE mod_sstaccidente.nom_tipoinvalidez IS 'Almacena los tipos de invalidez';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoinvalidez.idtipoinvalidez IS 'Identificador del tipo de invalidez.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoinvalidez.denominacion IS 'Denominación del tipo de invalidez.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoinvalidez.descripcion IS 'Descripción del tipo de invalidez';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoinvalidez.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoinvalidez.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstaccidente.nom_tipoinvalidez.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

ALTER TABLE ONLY mod_sstaccidente.dat_accidente
    ADD CONSTRAINT dat_accidente_pkey PRIMARY KEY (idaccidente);

ALTER TABLE ONLY mod_sstaccidente.dat_accidentecausa
    ADD CONSTRAINT pk_accidentecausa PRIMARY KEY (idaccidentecausa);

ALTER TABLE ONLY mod_sstaccidente.dat_accidenteconclusiones
    ADD CONSTRAINT pk_accidenteconclusion PRIMARY KEY (idaccidenteconclusion);

ALTER TABLE ONLY mod_sstaccidente.dat_accidentecosto
    ADD CONSTRAINT pk_accidentecosto PRIMARY KEY (idaccidentecosto);

ALTER TABLE ONLY mod_sstaccidente.dat_accidenteimplicado
    ADD CONSTRAINT pk_accidenteimplicado PRIMARY KEY (idaccidenteimplicado);

ALTER TABLE ONLY mod_sstaccidente.dat_accidenterecomendacion
    ADD CONSTRAINT pk_accidenterecomendacion PRIMARY KEY (idaccidenterecomendacion);

ALTER TABLE ONLY mod_sstaccidente.nom_agente
    ADD CONSTRAINT pk_agente PRIMARY KEY (idagente);
COMMENT ON CONSTRAINT pk_agente ON mod_sstaccidente.nom_agente IS 'Llave primaria de la tabla "mod_sstaccidente.nom_agente".';

ALTER TABLE ONLY mod_sstaccidente.nom_causaaccidente
    ADD CONSTRAINT pk_causaaccidente PRIMARY KEY (idcausaaccidente);
COMMENT ON CONSTRAINT pk_causaaccidente ON mod_sstaccidente.nom_causaaccidente IS 'Llave primaria de la tabla "mod_sstaccidente.nom_causaaccidente".';

ALTER TABLE ONLY mod_sstaccidente.nom_formaaccidente
    ADD CONSTRAINT pk_formaaccidente PRIMARY KEY (idformaaccidente);
COMMENT ON CONSTRAINT pk_formaaccidente ON mod_sstaccidente.nom_formaaccidente IS 'Llave primaria de la tabla "mod_sstaccidente.nom_formaaccidente".';

ALTER TABLE ONLY mod_sstaccidente.dat_accidentecomision
    ADD CONSTRAINT pk_idaccidentecomision PRIMARY KEY (idaccidentecomision);

ALTER TABLE ONLY mod_sstaccidente.dat_implicadopartecuerpo
    ADD CONSTRAINT pk_idimplicadopartecuerpo PRIMARY KEY (idimplicadopartecuerpo);

ALTER TABLE ONLY mod_sstaccidente.dat_implicadosubsidio
    ADD CONSTRAINT pk_idimplicadosubsidio PRIMARY KEY (idimplicadosubsidio);

ALTER TABLE ONLY mod_sstaccidente.nom_naturalezalesion
    ADD CONSTRAINT pk_naturalezalesion PRIMARY KEY (idnaturalezalesion);
COMMENT ON CONSTRAINT pk_naturalezalesion ON mod_sstaccidente.nom_naturalezalesion IS 'Llave primaria de la tabla "mod_sstaccidente.nom_naturalezalesion".';

ALTER TABLE ONLY mod_sstaccidente.nom_partecuerpo
    ADD CONSTRAINT pk_partecuerpo PRIMARY KEY (idpartecuerpo);
COMMENT ON CONSTRAINT pk_partecuerpo ON mod_sstaccidente.nom_partecuerpo IS 'Llave primaria de la tabla "mod_sstaccidente.nom_partecuerpo".';

ALTER TABLE ONLY mod_sstaccidente.nom_tipoaccidente
    ADD CONSTRAINT pk_tipoaccidente PRIMARY KEY (idtipoaccidente);
COMMENT ON CONSTRAINT pk_tipoaccidente ON mod_sstaccidente.nom_tipoaccidente IS 'Llave primaria de la tabla "mod_sstaccidente.nom_tipoaccidente".';

ALTER TABLE ONLY mod_sstaccidente.nom_tipoagente
    ADD CONSTRAINT pk_tipoagente PRIMARY KEY (idtipoagente);
COMMENT ON CONSTRAINT pk_tipoagente ON mod_sstaccidente.nom_tipoagente IS 'Llave primaria de la tabla "mod_sstaccidente.nom_tipoagente".';

ALTER TABLE ONLY mod_sstaccidente.nom_tipoinvalidez
    ADD CONSTRAINT pk_tipoinvalidez PRIMARY KEY (idtipoinvalidez);
COMMENT ON CONSTRAINT pk_tipoinvalidez ON mod_sstaccidente.nom_tipoinvalidez IS 'Llave primaria de la tabla "mod_sstaccidente.nom_tipoinvalidez".';

ALTER TABLE ONLY mod_sstaccidente.dat_accidentecausa
    ADD CONSTRAINT uk_accidentecausa_principal UNIQUE (idaccidente, principal);

ALTER TABLE ONLY mod_sstaccidente.nom_agente
    ADD CONSTRAINT uk_agente_denominacion_idtipoagente UNIQUE (idtipoagente, denominacion);

ALTER TABLE ONLY mod_sstaccidente.nom_causaaccidente
    ADD CONSTRAINT uk_causaaccidente_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_causaaccidente_denominacion ON mod_sstaccidente.nom_causaaccidente IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstaccidente.nom_causaaccidente".';

ALTER TABLE ONLY mod_sstaccidente.nom_formaaccidente
    ADD CONSTRAINT uk_formaaccidente_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_formaaccidente_denominacion ON mod_sstaccidente.nom_formaaccidente IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstaccidente.nom_formaaccidente".';

ALTER TABLE ONLY mod_sstaccidente.nom_naturalezalesion
    ADD CONSTRAINT uk_naturalezalesion_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_naturalezalesion_denominacion ON mod_sstaccidente.nom_naturalezalesion IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstaccidente.nom_naturalezalesion".';

ALTER TABLE ONLY mod_sstaccidente.nom_partecuerpo
    ADD CONSTRAINT uk_partecuerpo_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_partecuerpo_denominacion ON mod_sstaccidente.nom_partecuerpo IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstaccidente.nom_partecuerpo".';

ALTER TABLE ONLY mod_sstaccidente.nom_tipoaccidente
    ADD CONSTRAINT uk_tipoaccidente_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_tipoaccidente_denominacion ON mod_sstaccidente.nom_tipoaccidente IS 'Llave para la unicidad del campo "denominacion" del "mod_sstaccidente.nom_tipoaccidente".';

ALTER TABLE ONLY mod_sstaccidente.nom_tipoagente
    ADD CONSTRAINT uk_tipoagente_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_tipoagente_denominacion ON mod_sstaccidente.nom_tipoagente IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstaccidente.nom_tipoagente"';

ALTER TABLE ONLY mod_sstaccidente.nom_tipoinvalidez
    ADD CONSTRAINT uk_tipoinvalidez_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_tipoinvalidez_denominacion ON mod_sstaccidente.nom_tipoinvalidez IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstaccidente.nom_tipoinvalidez".';

CREATE INDEX fki_accidente_accidentecausa_idaccidente ON mod_sstaccidente.dat_accidentecausa USING btree (idaccidente);

CREATE INDEX fki_accidente_accidentecomision_idaccidente ON mod_sstaccidente.dat_accidentecomision USING btree (idaccidente);

CREATE INDEX fki_accidente_accidenteconclusion_idaccidente ON mod_sstaccidente.dat_accidenteconclusiones USING btree (idaccidente);

CREATE INDEX fki_accidente_accidenteimplicado_idaccidente ON mod_sstaccidente.dat_accidenteimplicado USING btree (idaccidente);

CREATE INDEX fki_accidente_accidenterecomendacion_idaccidente ON mod_sstaccidente.dat_accidenterecomendacion USING btree (idaccidente);

CREATE INDEX fki_accidenteimplicado_implicadopartecuerpo_idaccidenteimplicad ON mod_sstaccidente.dat_implicadopartecuerpo USING btree (idaccidenteimplicado);

CREATE INDEX fki_causa_accidentecausa_idcausa ON mod_sstaccidente.dat_accidentecausa USING btree (idcausaaccidente);

CREATE INDEX fki_naturalezalesion_implicadopartecuerpo_idnaturalezalesion ON mod_sstaccidente.dat_implicadopartecuerpo USING btree (idnaturalezalesion);

CREATE INDEX fki_partecuerpo_implicadopartecuerpo_idpartecuerpo ON mod_sstaccidente.dat_implicadopartecuerpo USING btree (idpartecuerpo);

CREATE INDEX fki_tipoinvalidez_accidenteimplicado_idtipoinvalidez ON mod_sstaccidente.dat_accidenteimplicado USING btree (idtipoinvalidez);

CREATE TRIGGER t_insertar_causaaccidente BEFORE INSERT ON mod_sstaccidente.nom_causaaccidente FOR EACH ROW EXECUTE PROCEDURE mod_sstaccidente.ft_causaaccidente_insertar();

ALTER TABLE ONLY mod_sstaccidente.dat_accidentecausa
    ADD CONSTRAINT fk_accidente_accidentecausa_idaccidente FOREIGN KEY (idaccidente) REFERENCES mod_sstaccidente.dat_accidente(idaccidente) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_accidentecomision
    ADD CONSTRAINT fk_accidente_accidentecomision_idaccidente FOREIGN KEY (idaccidente) REFERENCES mod_sstaccidente.dat_accidente(idaccidente) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_accidenteconclusiones
    ADD CONSTRAINT fk_accidente_accidenteconclusion_idaccidente FOREIGN KEY (idaccidente) REFERENCES mod_sstaccidente.dat_accidente(idaccidente);

ALTER TABLE ONLY mod_sstaccidente.dat_accidentecosto
    ADD CONSTRAINT fk_accidente_accidentecosto_idaccidente FOREIGN KEY (idaccidente) REFERENCES mod_sstaccidente.dat_accidente(idaccidente) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_accidenteimplicado
    ADD CONSTRAINT fk_accidente_accidenteimplicado_idaccidente FOREIGN KEY (idaccidente) REFERENCES mod_sstaccidente.dat_accidente(idaccidente) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_accidenterecomendacion
    ADD CONSTRAINT fk_accidente_accidenterecomendacion_idaccidente FOREIGN KEY (idaccidente) REFERENCES mod_sstaccidente.dat_accidente(idaccidente) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_implicadopartecuerpo
    ADD CONSTRAINT fk_accidenteimplicado_implicadopartecuerpo_idaccidenteimplicado FOREIGN KEY (idaccidenteimplicado) REFERENCES mod_sstaccidente.dat_accidenteimplicado(idaccidenteimplicado) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_implicadosubsidio
    ADD CONSTRAINT fk_accidenteimplicado_implicadosubsidio_idaccidenteimplicado FOREIGN KEY (idaccidenteimplicado) REFERENCES mod_sstaccidente.dat_accidenteimplicado(idaccidenteimplicado) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_accidente
    ADD CONSTRAINT fk_agente_accidente FOREIGN KEY (idagente) REFERENCES mod_sstaccidente.nom_agente(idagente) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstaccidente.dat_accidentecausa
    ADD CONSTRAINT fk_causaaccidente_accidentecausa_idcausaaccidente FOREIGN KEY (idcausaaccidente) REFERENCES mod_sstaccidente.nom_causaaccidente(idcausaaccidente);

ALTER TABLE ONLY mod_sstaccidente.nom_causaaccidente
    ADD CONSTRAINT fk_causaaccidente_causaaccidente FOREIGN KEY (idpadre) REFERENCES mod_sstaccidente.nom_causaaccidente(idcausaaccidente) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_accidente
    ADD CONSTRAINT fk_formaaccidente_accidente FOREIGN KEY (idformaaccidente) REFERENCES mod_sstaccidente.nom_formaaccidente(idformaaccidente) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstaccidente.dat_implicadopartecuerpo
    ADD CONSTRAINT fk_naturalezalesion_implicadopartecuerpo_idnaturalezalesion FOREIGN KEY (idnaturalezalesion) REFERENCES mod_sstaccidente.nom_naturalezalesion(idnaturalezalesion);

ALTER TABLE ONLY mod_sstaccidente.dat_implicadopartecuerpo
    ADD CONSTRAINT fk_partecuerpo_implicadopartecuerpo_idpartecuerpo FOREIGN KEY (idpartecuerpo) REFERENCES mod_sstaccidente.nom_partecuerpo(idpartecuerpo);

ALTER TABLE ONLY mod_sstaccidente.dat_accidente
    ADD CONSTRAINT fk_tipoaccidente_accidente FOREIGN KEY (idtipoaccidente) REFERENCES mod_sstaccidente.nom_tipoaccidente(idtipoaccidente) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstaccidente.nom_agente
    ADD CONSTRAINT fk_tipoagente_agente FOREIGN KEY (idtipoagente) REFERENCES mod_sstaccidente.nom_tipoagente(idtipoagente) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstaccidente.dat_accidenteimplicado
    ADD CONSTRAINT fk_tipoinvalidez_accidenteimplicado_idtipoinvalidez FOREIGN KEY (idtipoinvalidez) REFERENCES mod_sstaccidente.nom_tipoinvalidez(idtipoinvalidez);

--
-- MEDIOS DE PROTECCIÓN
--

CREATE SCHEMA mod_sst;
ALTER SCHEMA mod_sst OWNER TO zeolides;

CREATE SEQUENCE mod_sst.sec_medida_seq
    START WITH 6
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_medida_seq OWNER TO zeolides;

SET default_tablespace = '';

CREATE TABLE mod_sst.dat_medida (
    idmedida numeric(19,0) DEFAULT nextval('mod_sst.sec_medida_seq'::regclass) NOT NULL,
    idriesgo numeric(19,0) NOT NULL,
    medida character varying(500) NOT NULL,
    responsable character varying(255) NOT NULL,
    fcumplimiento date
);
ALTER TABLE mod_sst.dat_medida OWNER TO zeolides;
COMMENT ON TABLE mod_sst.dat_medida IS 'Almacena los datos de las medidas para mitigar los riesgos';
COMMENT ON COLUMN mod_sst.dat_medida.idmedida IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_sst.dat_medida.idriesgo IS 'Identificador del riesgo';
COMMENT ON COLUMN mod_sst.dat_medida.medida IS 'Medida para mitigar el riesgo';
COMMENT ON COLUMN mod_sst.dat_medida.responsable IS 'Responsable de la medida';
COMMENT ON COLUMN mod_sst.dat_medida.fcumplimiento IS 'Fecha de cumplimiento de la medida';

CREATE SEQUENCE mod_sst.sec_datmedio_seq
    START WITH 17
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_datmedio_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_datmedio_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.dat_medio".';

CREATE TABLE mod_sst.dat_medio (
    iddmedio numeric(19,0) DEFAULT nextval('mod_sst.sec_datmedio_seq'::regclass) NOT NULL,
    idmedio numeric(19,0) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    cantidad numeric
);
ALTER TABLE mod_sst.dat_medio OWNER TO zeolides;

CREATE SEQUENCE mod_sst.sec_drecurso_seq
    START WITH 6
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_drecurso_seq OWNER TO zeolides;

CREATE TABLE mod_sst.dat_recurso (
    iddrecurso numeric(19,0) DEFAULT nextval('mod_sst.sec_drecurso_seq'::regclass) NOT NULL,
    idriesgo numeric(19,0) NOT NULL,
    idrecurso numeric(19,0) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date
);
ALTER TABLE mod_sst.dat_recurso OWNER TO zeolides;
COMMENT ON TABLE mod_sst.dat_recurso IS 'Almacena los datos de los recursos para mitigar los riesgos';
COMMENT ON COLUMN mod_sst.dat_recurso.iddrecurso IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_sst.dat_recurso.idriesgo IS 'Identificador del riesgo';
COMMENT ON COLUMN mod_sst.dat_recurso.idrecurso IS 'Identificador del nomenclador de recurso';
COMMENT ON COLUMN mod_sst.dat_recurso.descripcion IS 'Descripción del recurso';
COMMENT ON COLUMN mod_sst.dat_recurso.fdesde IS 'Fecha en que inicia el uso del recurso';
COMMENT ON COLUMN mod_sst.dat_recurso.fhasta IS 'Fecha en que concluye el uso del recurso';

CREATE SEQUENCE mod_sst.sec_riesgo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_riesgo_seq OWNER TO zeolides;

CREATE TABLE mod_sst.dat_riesgo (
    idriesgo numeric(19,0) DEFAULT nextval('mod_sst.sec_riesgo_seq'::regclass) NOT NULL,
    idnriesgo numeric(19,0) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    descripcion character varying(500),
    fdeteccion date DEFAULT now() NOT NULL,
    idfrecuencia numeric(19,0),
    idprobabilidad numeric(19,0) NOT NULL,
    idnivelriesgo numeric(19,0) NOT NULL
);
ALTER TABLE mod_sst.dat_riesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sst.dat_riesgo IS 'Almacena los daos de los riesgos por estructura';
COMMENT ON COLUMN mod_sst.dat_riesgo.idriesgo IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_sst.dat_riesgo.idnriesgo IS 'Identificador del riesgo';
COMMENT ON COLUMN mod_sst.dat_riesgo.idestructura IS 'Identificador de la estructura';
COMMENT ON COLUMN mod_sst.dat_riesgo.descripcion IS 'Descripción del riesgo';
COMMENT ON COLUMN mod_sst.dat_riesgo.fdeteccion IS 'Fecha de detección del riesgo';
COMMENT ON COLUMN mod_sst.dat_riesgo.idfrecuencia IS 'Identificador del estado del riesgo';
COMMENT ON COLUMN mod_sst.dat_riesgo.idprobabilidad IS 'Identificador de la probabilidad';
COMMENT ON COLUMN mod_sst.dat_riesgo.idnivelriesgo IS 'Identificador del nivel del riesgo';

CREATE SEQUENCE mod_sst.sec_accmejoramiento_seq
    START WITH 13
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_accmejoramiento_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_accmejoramiento_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_accmejoramiento".';

CREATE TABLE mod_sst.nom_accmejoramiento (
    idaccmejoramiento numeric(19,0) DEFAULT nextval('mod_sst.sec_accmejoramiento_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sst.nom_accmejoramiento OWNER TO zeolides;
COMMENT ON TABLE mod_sst.nom_accmejoramiento IS 'Almacena las acciones de mejoramiento';
COMMENT ON COLUMN mod_sst.nom_accmejoramiento.idaccmejoramiento IS 'Identificador de la accion de mejoramiento.';
COMMENT ON COLUMN mod_sst.nom_accmejoramiento.denominacion IS 'Denominación de la accion de mejoramiento.';
COMMENT ON COLUMN mod_sst.nom_accmejoramiento.descripcion IS 'Descripción de la accion de mejoramiento.';
COMMENT ON COLUMN mod_sst.nom_accmejoramiento.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_accmejoramiento.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_accmejoramiento.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sst.sec_estadoriesgo_seq
    START WITH 9
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_estadoriesgo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_estadoriesgo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_estadoriesgo".';

CREATE TABLE mod_sst.nom_estadoriesgo (
    idestadoriesgo numeric(19,0) DEFAULT nextval('mod_sst.sec_estadoriesgo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sst.nom_estadoriesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sst.nom_estadoriesgo IS 'Almacena los estados de riesgo';
COMMENT ON COLUMN mod_sst.nom_estadoriesgo.idestadoriesgo IS 'Identificador del estado de riesgo.';
COMMENT ON COLUMN mod_sst.nom_estadoriesgo.denominacion IS 'Denominación del estado de riesgo.';
COMMENT ON COLUMN mod_sst.nom_estadoriesgo.descripcion IS 'Descripción del estado de riesgo.';
COMMENT ON COLUMN mod_sst.nom_estadoriesgo.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_estadoriesgo.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_estadoriesgo.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sst.sec_nommedio_seq
    START WITH 17
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_nommedio_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_nommedio_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_medio".';

CREATE TABLE mod_sst.nom_medio (
    idmedio numeric(19,0) DEFAULT nextval('mod_sst.sec_nommedio_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sst.nom_medio OWNER TO zeolides;

CREATE SEQUENCE mod_sst.sec_nivelriesgo_seq
    START WITH 9
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_nivelriesgo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_nivelriesgo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_nivelriesgo".';

CREATE TABLE mod_sst.nom_nivelriesgo (
    idnivelriesgo numeric(19,0) DEFAULT nextval('mod_sst.sec_nivelriesgo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sst.nom_nivelriesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sst.nom_nivelriesgo IS 'Almacena los niveles de riesgo';
COMMENT ON COLUMN mod_sst.nom_nivelriesgo.idnivelriesgo IS 'Identificador del nivel de riesgo.';
COMMENT ON COLUMN mod_sst.nom_nivelriesgo.denominacion IS 'Denominación del nivel de riesgo.';
COMMENT ON COLUMN mod_sst.nom_nivelriesgo.descripcion IS 'Descripción del nivel de riesgo.';
COMMENT ON COLUMN mod_sst.nom_nivelriesgo.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_nivelriesgo.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_nivelriesgo.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sst.sec_probabilidad_seq
    START WITH 5
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_probabilidad_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_probabilidad_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_probabilidad".';

CREATE TABLE mod_sst.nom_probabilidad (
    idprobabilidad numeric(19,0) DEFAULT nextval('mod_sst.sec_probabilidad_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sst.nom_probabilidad OWNER TO zeolides;
COMMENT ON TABLE mod_sst.nom_probabilidad IS 'Almacena las probabilidades';
COMMENT ON COLUMN mod_sst.nom_probabilidad.idprobabilidad IS 'Identificador de la probabilidad.';
COMMENT ON COLUMN mod_sst.nom_probabilidad.denominacion IS 'Denominación de la probabilidad.';
COMMENT ON COLUMN mod_sst.nom_probabilidad.descripcion IS 'Descripción de la probabilidad.';
COMMENT ON COLUMN mod_sst.nom_probabilidad.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_probabilidad.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_probabilidad.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sst.sec_recurso_seq
    START WITH 9
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_recurso_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_recurso_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_recurso".';

CREATE TABLE mod_sst.nom_recurso (
    idrecurso numeric(19,0) DEFAULT nextval('mod_sst.sec_recurso_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sst.nom_recurso OWNER TO zeolides;
COMMENT ON TABLE mod_sst.nom_recurso IS 'Almacena los recursos';
COMMENT ON COLUMN mod_sst.nom_recurso.idrecurso IS 'Identificador del recurso.';
COMMENT ON COLUMN mod_sst.nom_recurso.denominacion IS 'Denominación del recurso.';
COMMENT ON COLUMN mod_sst.nom_recurso.descripcion IS 'Descripción del recurso.';
COMMENT ON COLUMN mod_sst.nom_recurso.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_recurso.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_recurso.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sst.sec_nriesgo_seq
    START WITH 5
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_nriesgo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_nriesgo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_riesgo".';

CREATE TABLE mod_sst.nom_riesgo (
    idnriesgo numeric(19,0) DEFAULT nextval('mod_sst.sec_nriesgo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sst.nom_riesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sst.nom_riesgo IS 'Almacena los riesgos';
COMMENT ON COLUMN mod_sst.nom_riesgo.idnriesgo IS 'Identificador del riesgo.';
COMMENT ON COLUMN mod_sst.nom_riesgo.denominacion IS 'Denominación del riesgo.';
COMMENT ON COLUMN mod_sst.nom_riesgo.descripcion IS 'Descripción del riesgo.';
COMMENT ON COLUMN mod_sst.nom_riesgo.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_riesgo.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sst.nom_riesgo.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sst.sec_agente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_agente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_agente_seq IS 'Secuencia que genera el identificador de la tabala "mod_sst.nom_agente"';

CREATE SEQUENCE mod_sst.sec_formaaccidente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_formaaccidente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_formaaccidente_seq IS 'Secuancia que genera el identificador de la tabla "mod_sst.nom_formaacciendente".';

CREATE SEQUENCE mod_sst.sec_tipoaccidente_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sst.sec_tipoaccidente_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sst.sec_tipoaccidente_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_tipoaccidente".';

ALTER TABLE ONLY mod_sst.dat_medida
    ADD CONSTRAINT dat_medida_pkey PRIMARY KEY (idmedida);

ALTER TABLE ONLY mod_sst.dat_medio
    ADD CONSTRAINT dat_medio_pkey PRIMARY KEY (iddmedio);

ALTER TABLE ONLY mod_sst.dat_recurso
    ADD CONSTRAINT dat_recurso_pkey PRIMARY KEY (iddrecurso);

ALTER TABLE ONLY mod_sst.dat_riesgo
    ADD CONSTRAINT dat_riesgo_pkey PRIMARY KEY (idriesgo);

ALTER TABLE ONLY mod_sst.nom_accmejoramiento
    ADD CONSTRAINT pk_accmejoramiento PRIMARY KEY (idaccmejoramiento);
COMMENT ON CONSTRAINT pk_accmejoramiento ON mod_sst.nom_accmejoramiento IS 'Llave primaria de la tabla "mod_sst.nom_accmejoramiento".';

ALTER TABLE ONLY mod_sst.nom_estadoriesgo
    ADD CONSTRAINT pk_estadoriesgo PRIMARY KEY (idestadoriesgo);
COMMENT ON CONSTRAINT pk_estadoriesgo ON mod_sst.nom_estadoriesgo IS 'Llave primaria de la tabla "mod_sst.nom_estadoriesgo".';

ALTER TABLE ONLY mod_sst.nom_nivelriesgo
    ADD CONSTRAINT pk_nivelriesgo PRIMARY KEY (idnivelriesgo);
COMMENT ON CONSTRAINT pk_nivelriesgo ON mod_sst.nom_nivelriesgo IS 'Llave primaria de la tabla "mod_sst.nom_nivelriesgo".';

ALTER TABLE ONLY mod_sst.nom_riesgo
    ADD CONSTRAINT pk_nriesgo PRIMARY KEY (idnriesgo);
COMMENT ON CONSTRAINT pk_nriesgo ON mod_sst.nom_riesgo IS 'Llave primaria de la tabla "mod_sst.nom_riesgo".';

ALTER TABLE ONLY mod_sst.nom_probabilidad
    ADD CONSTRAINT pk_probabilidad PRIMARY KEY (idprobabilidad);
COMMENT ON CONSTRAINT pk_probabilidad ON mod_sst.nom_probabilidad IS 'Llave primaria de la tabla "mod_sst.nom_probabilidad".';

ALTER TABLE ONLY mod_sst.nom_recurso
    ADD CONSTRAINT pk_recurso PRIMARY KEY (idrecurso);
COMMENT ON CONSTRAINT pk_recurso ON mod_sst.nom_recurso IS 'Llave primaria de la tabla "mod_sst.nom_recurso".';

ALTER TABLE ONLY mod_sst.nom_medio
    ADD CONSTRAINT pk_sec_nmedio_seq PRIMARY KEY (idmedio);

ALTER TABLE ONLY mod_sst.nom_accmejoramiento
    ADD CONSTRAINT uk_accmejoramiento_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_accmejoramiento_denominacion ON mod_sst.nom_accmejoramiento IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_accmejoramiento".';

ALTER TABLE ONLY mod_sst.nom_estadoriesgo
    ADD CONSTRAINT uk_estadoriesgo_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_estadoriesgo_denominacion ON mod_sst.nom_estadoriesgo IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_estadoriesgo".';

ALTER TABLE ONLY mod_sst.nom_medio
    ADD CONSTRAINT uk_medio_denominacion UNIQUE (denominacion);

ALTER TABLE ONLY mod_sst.nom_nivelriesgo
    ADD CONSTRAINT uk_nivelriesgo_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_nivelriesgo_denominacion ON mod_sst.nom_nivelriesgo IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_nivelriesgo".';

ALTER TABLE ONLY mod_sst.nom_probabilidad
    ADD CONSTRAINT uk_probabilidad_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_probabilidad_denominacion ON mod_sst.nom_probabilidad IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_probabilidad".';

ALTER TABLE ONLY mod_sst.nom_recurso
    ADD CONSTRAINT uk_recurso_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_recurso_denominacion ON mod_sst.nom_recurso IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_recurso".';

ALTER TABLE ONLY mod_sst.nom_riesgo
    ADD CONSTRAINT uk_riesgo_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_riesgo_denominacion ON mod_sst.nom_riesgo IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_riesgo".';

ALTER TABLE ONLY mod_sst.dat_riesgo
    ADD CONSTRAINT fk_estadoriesgo_riesgo FOREIGN KEY (idfrecuencia) REFERENCES mod_sst.nom_estadoriesgo(idestadoriesgo) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sst.dat_riesgo
    ADD CONSTRAINT fk_nivelriesgo_riesgo FOREIGN KEY (idnivelriesgo) REFERENCES mod_sst.nom_nivelriesgo(idnivelriesgo) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sst.dat_recurso
    ADD CONSTRAINT fk_nrecurso_drecurso FOREIGN KEY (idrecurso) REFERENCES mod_sst.nom_recurso(idrecurso) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sst.dat_riesgo
    ADD CONSTRAINT fk_nriesgo_riesgo FOREIGN KEY (idnriesgo) REFERENCES mod_sst.nom_riesgo(idnriesgo) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sst.dat_riesgo
    ADD CONSTRAINT fk_probabilidad_riesgo FOREIGN KEY (idprobabilidad) REFERENCES mod_sst.nom_probabilidad(idprobabilidad) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sst.dat_medida
    ADD CONSTRAINT fk_riesgo_medida FOREIGN KEY (idriesgo) REFERENCES mod_sst.dat_riesgo(idriesgo) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY mod_sst.dat_recurso
    ADD CONSTRAINT fk_riesgo_recurso FOREIGN KEY (idriesgo) REFERENCES mod_sst.dat_riesgo(idriesgo) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- RIESGOS LABORALES
--

CREATE SCHEMA mod_sstriesgo;
ALTER SCHEMA mod_sstriesgo OWNER TO zeolides;

CREATE SEQUENCE mod_sstriesgo.sec_gradopeligrosidad_seq
    START WITH 11
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_gradopeligrosidad_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_gradopeligrosidad_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.conf_gradopeligrosidad".';

SET default_tablespace = '';

CREATE TABLE mod_sstriesgo.conf_gradopeligrosidad (
    idgradopeligrosidad numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_gradopeligrosidad_seq'::regclass) NOT NULL,
    idexpresionmatematica numeric(19,0) NOT NULL
);
ALTER TABLE mod_sstriesgo.conf_gradopeligrosidad OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.conf_gradopeligrosidad IS 'Almacena la configuración del gradode peligrosidad.                                                          ';
COMMENT ON COLUMN mod_sstriesgo.conf_gradopeligrosidad.idgradopeligrosidad IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_sstriesgo.conf_gradopeligrosidad.idexpresionmatematica IS 'Identificador de la expresión matemática.';

CREATE SEQUENCE mod_sstriesgo.sec_magnitudriesgo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_magnitudriesgo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_magnitudriesgo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.conf_magnitudriesgo".';

CREATE TABLE mod_sstriesgo.conf_magnitudriesgo (
    idmagnitudriesgo numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_magnitudriesgo_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    idexpresionmatematica numeric(19,0) NOT NULL,
    orden numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.conf_magnitudriesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.conf_magnitudriesgo IS 'Almacena las configuraciones para determinar la magnitud del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.conf_magnitudriesgo.idmagnitudriesgo IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_sstriesgo.conf_magnitudriesgo.denominacion IS 'Denominación de la magnitud del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.conf_magnitudriesgo.idexpresionmatematica IS 'Identificador de la expresión matemática.';
COMMENT ON COLUMN mod_sstriesgo.conf_magnitudriesgo.orden IS 'Determina el orden de prioridad de la magnitud del riesgo.';

CREATE SEQUENCE mod_sstriesgo.sec_equipoaltoriesgo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_equipoaltoriesgo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_equipoaltoriesgo_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "mod_sstriesgo.dat_equipoaltoriesgo".';

CREATE TABLE mod_sstriesgo.dat_equipoaltoriesgo (
    idequipoaltoriesgo numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_equipoaltoriesgo_seq'::regclass) NOT NULL,
    idclasifequipo numeric(19,0) NOT NULL,
    denominacion character varying(255) NOT NULL,
    inventario character varying(100) NOT NULL,
    modelo character varying(255),
    idpaisfabricante numeric(19,0),
    annofabricacion numeric(4,0),
    serie character varying(255),
    presioncalculo numeric(15,5),
    presionautorizada numeric(15,5),
    capacidadcalculo numeric(15,5),
    capacidadautorizada numeric(15,5),
    ubicacion character varying(255),
    idestructura numeric(19,0) NOT NULL
);
ALTER TABLE mod_sstriesgo.dat_equipoaltoriesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_equipoaltoriesgo IS 'Almacena los equipos de alto riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.idclasifequipo IS 'Identificador de la clasificación del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.denominacion IS 'Denominación del equipo';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.inventario IS 'Número de inventario del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.modelo IS 'Tipo o modelo del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.idpaisfabricante IS 'Identificador del país fabricante del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.annofabricacion IS 'Año de fabricación del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.serie IS 'Número de serie del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.presioncalculo IS 'Presión de trabajado de cálculo (kgf/cm^2)';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.presionautorizada IS 'Presión de trabajo autorizada (kgf/cm^2)';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.capacidadcalculo IS 'Capidad de carga de cálculo (T)';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.capacidadautorizada IS 'Capacidad de carga autorizada (T)';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.ubicacion IS 'Ubicación del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_equipoaltoriesgo.idestructura IS 'Identificador de la estructura responsable o a la que pertenece el equipo de alto riesgo.';

CREATE SEQUENCE mod_sstriesgo.sec_inspeccionequipo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_inspeccionequipo_seq OWNER TO zeolides;

CREATE TABLE mod_sstriesgo.dat_inspeccionequipo (
    idinspeccionequipo numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_inspeccionequipo_seq'::regclass) NOT NULL,
    idequipoaltoriesgo numeric(19,0) NOT NULL,
    idtipoinspeccion numeric(19,0) NOT NULL,
    fplan date NOT NULL,
    finspeccion date,
    idresultadoinspeccion numeric(19,0)
);
ALTER TABLE mod_sstriesgo.dat_inspeccionequipo OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_inspeccionequipo IS 'Tabla que almacena las inspecciones realizadas a un equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_inspeccionequipo.idequipoaltoriesgo IS 'Identificador del equipo de alto riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_inspeccionequipo.idtipoinspeccion IS 'Identificador del tipo de inspección.';
COMMENT ON COLUMN mod_sstriesgo.dat_inspeccionequipo.fplan IS 'Fecha en que se planifica la inspeccion.';
COMMENT ON COLUMN mod_sstriesgo.dat_inspeccionequipo.finspeccion IS 'Fecha en que se realiza la inspección.';
COMMENT ON COLUMN mod_sstriesgo.dat_inspeccionequipo.idresultadoinspeccion IS 'Identificador del resultado de la inspección.';

CREATE SEQUENCE mod_sstriesgo.sec_medida_seq
    START WITH 13
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_medida_seq OWNER TO zeolides;

CREATE TABLE mod_sstriesgo.dat_medida (
    idmedida numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_medida_seq'::regclass) NOT NULL,
    idriesgo numeric(19,0) NOT NULL,
    medida character varying(500) NOT NULL,
    responsable character varying(255) NOT NULL,
    fcumplimiento date
);
ALTER TABLE mod_sstriesgo.dat_medida OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_medida IS 'Almacena los datos de las medidas para mitigar los riesgos';
COMMENT ON COLUMN mod_sstriesgo.dat_medida.idmedida IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_sstriesgo.dat_medida.idriesgo IS 'Identificador del riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_medida.medida IS 'Medida para mitigar el riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_medida.responsable IS 'Responsable de la medida';
COMMENT ON COLUMN mod_sstriesgo.dat_medida.fcumplimiento IS 'Fecha de cumplimiento de la medida';

CREATE SEQUENCE mod_sstriesgo.sec_observacionequipo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_observacionequipo_seq OWNER TO zeolides;

CREATE TABLE mod_sstriesgo.dat_observacionequipo (
    idobservacionequipo numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_observacionequipo_seq'::regclass) NOT NULL,
    idequipoaltoriesgo numeric(19,0) NOT NULL,
    observacion character varying(500) NOT NULL,
    fregistro date DEFAULT now() NOT NULL
);
ALTER TABLE mod_sstriesgo.dat_observacionequipo OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_observacionequipo IS 'Tabla que almacena las observaciones de los equipos.';
COMMENT ON COLUMN mod_sstriesgo.dat_observacionequipo.idobservacionequipo IS 'Identificador de la observación del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_observacionequipo.idequipoaltoriesgo IS 'Identificador del equipo de alto riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_observacionequipo.observacion IS 'Observación del equipo.';
COMMENT ON COLUMN mod_sstriesgo.dat_observacionequipo.fregistro IS 'Fecha en que se registra la observación';

CREATE SEQUENCE mod_sstriesgo.sec_rconsecuencia_seq
    START WITH 2
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_rconsecuencia_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_rconsecuencia_seq IS 'Secuencia empleada para generar el identificador de la tabla "mod_sstriesgo.dat_rconsecuencia".';

CREATE TABLE mod_sstriesgo.dat_rconsecuencia (
    idrconsecuencia numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_rconsecuencia_seq'::regclass) NOT NULL,
    idriesgo numeric(19,0) NOT NULL,
    idconsecuencia numeric(19,0) NOT NULL,
    fregistro date DEFAULT now() NOT NULL,
    observaciones character varying(255),
    principal numeric(1,0) DEFAULT 0 NOT NULL
);
ALTER TABLE mod_sstriesgo.dat_rconsecuencia OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_rconsecuencia IS 'Tabla que almacena los efectos que provoca el riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_rconsecuencia.idrconsecuencia IS 'Identificador del consecuencia que provoca el riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_rconsecuencia.idriesgo IS 'Identificador del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_rconsecuencia.idconsecuencia IS 'Identificador del consecuencia.';
COMMENT ON COLUMN mod_sstriesgo.dat_rconsecuencia.fregistro IS 'Fecha de registro';
COMMENT ON COLUMN mod_sstriesgo.dat_rconsecuencia.observaciones IS 'Determina las observaciones de las consecuencias de los riesgos.';
COMMENT ON COLUMN mod_sstriesgo.dat_rconsecuencia.principal IS 'Determina si la consecuencia es principal o no. 
1- Si 
0-No';

CREATE SEQUENCE mod_sstriesgo.sec_drecurso_seq
    START WITH 14
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_drecurso_seq OWNER TO zeolides;

CREATE TABLE mod_sstriesgo.dat_recurso (
    iddrecurso numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_drecurso_seq'::regclass) NOT NULL,
    idriesgo numeric(19,0) NOT NULL,
    idrecurso numeric(19,0) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date
);
ALTER TABLE mod_sstriesgo.dat_recurso OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_recurso IS 'Almacena los datos de los recursos para mitigar los riesgos';
COMMENT ON COLUMN mod_sstriesgo.dat_recurso.iddrecurso IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_sstriesgo.dat_recurso.idriesgo IS 'Identificador del riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_recurso.idrecurso IS 'Identificador del nomenclador de recurso';
COMMENT ON COLUMN mod_sstriesgo.dat_recurso.descripcion IS 'Descripción del recurso';
COMMENT ON COLUMN mod_sstriesgo.dat_recurso.fdesde IS 'Fecha en que inicia el uso del recurso';
COMMENT ON COLUMN mod_sstriesgo.dat_recurso.fhasta IS 'Fecha en que concluye el uso del recurso';

CREATE SEQUENCE mod_sstriesgo.sec_riesgo_seq
    START WITH 10
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_riesgo_seq OWNER TO zeolides;

CREATE TABLE mod_sstriesgo.dat_riesgo (
    idriesgo numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_riesgo_seq'::regclass) NOT NULL,
    idnriesgo numeric(19,0) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    descripcion character varying(500),
    fdeteccion date DEFAULT now() NOT NULL,
    idfrecuencia numeric(19,0) NOT NULL,
    idprobabilidad numeric(19,0) NOT NULL,
    idnivelriesgo numeric(19,0) NOT NULL,
    idsistema numeric(19,0),
    idpartesistema numeric(19,0)
);
ALTER TABLE mod_sstriesgo.dat_riesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_riesgo IS 'Almacena los daos de los riesgos por estructura';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.idriesgo IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.idnriesgo IS 'Identificador del riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.idestructura IS 'Identificador de la estructura';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.descripcion IS 'Descripción del riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.fdeteccion IS 'Fecha de detección del riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.idfrecuencia IS 'Identificador del estado del riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.idprobabilidad IS 'Identificador de la probabilidad';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.idnivelriesgo IS 'Identificador del nivel del riesgo';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.idsistema IS 'Identificador del sistema del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgo.idpartesistema IS 'Identificador de la parte del sistema.';

CREATE SEQUENCE mod_sstriesgo.sec_riesgoevento_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_riesgoevento_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_riesgoevento_seq IS 'Secuencia empleada para generar el identificador de la tabla "mod_sstriesgo.dat_riesgoevento".';

CREATE TABLE mod_sstriesgo.dat_riesgoevento (
    idriesgoevento numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_riesgoevento_seq'::regclass) NOT NULL,
    idriesgo numeric(19,0) NOT NULL,
    idevento numeric(19,0) NOT NULL,
    fregistro date DEFAULT now() NOT NULL,
    observaciones character varying(255)
);
ALTER TABLE mod_sstriesgo.dat_riesgoevento OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_riesgoevento IS 'Tabla que almacena los efectos que provoca el riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgoevento.idriesgoevento IS 'Identificador del evento que prooca el riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgoevento.idriesgo IS 'Identificador del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgoevento.idevento IS 'Identificador del evento.';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgoevento.fregistro IS 'Fecha de registro';
COMMENT ON COLUMN mod_sstriesgo.dat_riesgoevento.observaciones IS 'Determina las observaciones de los eventos de los riesgos.';

CREATE SEQUENCE mod_sstriesgo.sec_rpeligro_seq
    START WITH 3
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_rpeligro_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_rpeligro_seq IS 'Secuencia empleada para generar el identificador de la tabla "mod_sstriesgo.dat_rpeligro".';

CREATE TABLE mod_sstriesgo.dat_rpeligro (
    idrpeligro numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_rpeligro_seq'::regclass) NOT NULL,
    idriesgo numeric(19,0) NOT NULL,
    idpeligro numeric(19,0) NOT NULL,
    fregistro date DEFAULT now() NOT NULL,
    observaciones character varying(255)
);
ALTER TABLE mod_sstriesgo.dat_rpeligro OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.dat_rpeligro IS 'Tabla que almacena los efectos que provoca el riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_rpeligro.idrpeligro IS 'Identificador del idpeligro que provoca el riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_rpeligro.idriesgo IS 'Identificador del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.dat_rpeligro.idpeligro IS 'Identificador del idpeligro.';
COMMENT ON COLUMN mod_sstriesgo.dat_rpeligro.fregistro IS 'Fecha de registro';
COMMENT ON COLUMN mod_sstriesgo.dat_rpeligro.observaciones IS 'Determina las observaciones de los peligros de los riesgos.';

CREATE SEQUENCE mod_sstriesgo.sec_accmejoramiento_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_accmejoramiento_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_accmejoramiento_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_accmejoramiento".';

CREATE TABLE mod_sstriesgo.nom_accmejoramiento (
    idaccmejoramiento numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_accmejoramiento_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_accmejoramiento OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_accmejoramiento IS 'Almacena las acciones de mejoramiento';
COMMENT ON COLUMN mod_sstriesgo.nom_accmejoramiento.idaccmejoramiento IS 'Identificador de la accion de mejoramiento.';
COMMENT ON COLUMN mod_sstriesgo.nom_accmejoramiento.denominacion IS 'Denominación de la accion de mejoramiento.';
COMMENT ON COLUMN mod_sstriesgo.nom_accmejoramiento.descripcion IS 'Descripción de la accion de mejoramiento.';
COMMENT ON COLUMN mod_sstriesgo.nom_accmejoramiento.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_accmejoramiento.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_accmejoramiento.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstriesgo.sec_clasifequipo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_clasifequipo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_clasifequipo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.nom_clasifequipo".';

CREATE TABLE mod_sstriesgo.nom_clasifequipo (
    idclasifequipo numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_clasifequipo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_clasifequipo OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_clasifequipo IS 'Almacena las clasificaciones de los equipos de alto riesgo';
COMMENT ON COLUMN mod_sstriesgo.nom_clasifequipo.idclasifequipo IS 'Identificador de la clasificación de los equipos de alto riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_clasifequipo.denominacion IS 'Denominación de la clasificación de los equipos de alto riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_clasifequipo.descripcion IS 'Descripción de la clasificación de los equipos de alto riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_clasifequipo.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_clasifequipo.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_clasifequipo.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstriesgo.sec_consecuencias_seq
    START WITH 16
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_consecuencias_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_consecuencias_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.nom_consecuencia".';

CREATE TABLE mod_sstriesgo.nom_consecuencia (
    idconsecuencia numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_consecuencias_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL,
    valor numeric(3,0)
);
ALTER TABLE mod_sstriesgo.nom_consecuencia OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_consecuencia IS 'Almacena los consecuencias de riesgo';
COMMENT ON COLUMN mod_sstriesgo.nom_consecuencia.idconsecuencia IS 'Identificador de la consecuencia de riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_consecuencia.denominacion IS 'Denominación de la consecuencia del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_consecuencia.descripcion IS 'Descripción de la consecuencia del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_consecuencia.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_consecuencia.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_consecuencia.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';
COMMENT ON COLUMN mod_sstriesgo.nom_consecuencia.valor IS 'Valor que representa la consecuencia.';

CREATE SEQUENCE mod_sstriesgo.sec_evento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_evento_seq OWNER TO zeolides;
CREATE TABLE mod_sstriesgo.nom_evento (
    idevento numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_evento_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_evento OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_evento IS 'Almacena los eventos';
COMMENT ON COLUMN mod_sstriesgo.nom_evento.idevento IS 'Identificador del evento.';
COMMENT ON COLUMN mod_sstriesgo.nom_evento.denominacion IS 'Denominación del evento.';
COMMENT ON COLUMN mod_sstriesgo.nom_evento.descripcion IS 'Descripción del evento.';
COMMENT ON COLUMN mod_sstriesgo.nom_evento.fdesde IS 'Fecha en que inicia la vigencia del evento.';
COMMENT ON COLUMN mod_sstriesgo.nom_evento.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_evento.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstriesgo.sec_frecuencia_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_frecuencia_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_frecuencia_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_frecuencia".';

CREATE TABLE mod_sstriesgo.nom_frecuencia (
    idfrecuencia numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_frecuencia_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL,
    valor numeric(3,1)
);
ALTER TABLE mod_sstriesgo.nom_frecuencia OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_frecuencia IS 'Almacena los frecuencias de riesgo';
COMMENT ON COLUMN mod_sstriesgo.nom_frecuencia.idfrecuencia IS 'Identificador de la frecuencia de riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_frecuencia.denominacion IS 'Denominación de la frecuencia del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_frecuencia.descripcion IS 'Descripción de la frecuencia del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_frecuencia.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_frecuencia.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_frecuencia.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';
COMMENT ON COLUMN mod_sstriesgo.nom_frecuencia.valor IS 'Valor que representa la frecuencia.';

CREATE SEQUENCE mod_sstriesgo.sec_nivelriesgo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_nivelriesgo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_nivelriesgo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_nivelriesgo".';

CREATE TABLE mod_sstriesgo.nom_nivelriesgo (
    idnivelriesgo numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_nivelriesgo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_nivelriesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_nivelriesgo IS 'Almacena los niveles de riesgo';
COMMENT ON COLUMN mod_sstriesgo.nom_nivelriesgo.idnivelriesgo IS 'Identificador del nivel de riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_nivelriesgo.denominacion IS 'Denominación del nivel de riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_nivelriesgo.descripcion IS 'Descripción del nivel de riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_nivelriesgo.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_nivelriesgo.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_nivelriesgo.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstriesgo.sec_partesistemas_seq
    START WITH 16
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_partesistemas_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_partesistemas_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.nom_partesistema".';

CREATE TABLE mod_sstriesgo.nom_partesistema (
    idpartesistema numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_partesistemas_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL,
    idsistema numeric(19,0) NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_partesistema OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_partesistema IS 'Almacena los partesistemas de riesgo';
COMMENT ON COLUMN mod_sstriesgo.nom_partesistema.idpartesistema IS 'Identificador del partesistema de riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_partesistema.denominacion IS 'Denominación del sitema del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_partesistema.descripcion IS 'Descripción del sitema del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_partesistema.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_partesistema.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_partesistema.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';
COMMENT ON COLUMN mod_sstriesgo.nom_partesistema.idsistema IS 'Determina el sistema del cual es parte.';

CREATE SEQUENCE mod_sstriesgo.sec_peligros_seq
    START WITH 16
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_peligros_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_peligros_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.nom_peligro".';

CREATE TABLE mod_sstriesgo.nom_peligro (
    idpeligro numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_peligros_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_peligro OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_peligro IS 'Almacena los peligros de riesgo';
COMMENT ON COLUMN mod_sstriesgo.nom_peligro.idpeligro IS 'Identificador del peligro de riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_peligro.denominacion IS 'Denominación del peligro del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_peligro.descripcion IS 'Descripción del peligro del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_peligro.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_peligro.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_peligro.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstriesgo.sec_probabilidad_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_probabilidad_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_probabilidad_seq IS 'Secuencia que genera el identificador de la tabla "mod_sst.nom_probabilidad".';

CREATE TABLE mod_sstriesgo.nom_probabilidad (
    idprobabilidad numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_probabilidad_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL,
    valor numeric(3,1)
);
ALTER TABLE mod_sstriesgo.nom_probabilidad OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_probabilidad IS 'Almacena las probabilidades';
COMMENT ON COLUMN mod_sstriesgo.nom_probabilidad.idprobabilidad IS 'Identificador de la probabilidad.';
COMMENT ON COLUMN mod_sstriesgo.nom_probabilidad.denominacion IS 'Denominación de la probabilidad.';
COMMENT ON COLUMN mod_sstriesgo.nom_probabilidad.descripcion IS 'Descripción de la probabilidad.';
COMMENT ON COLUMN mod_sstriesgo.nom_probabilidad.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_probabilidad.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_probabilidad.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';
COMMENT ON COLUMN mod_sstriesgo.nom_probabilidad.valor IS 'Valor que representa la probabilidad.';

CREATE SEQUENCE mod_sstriesgo.sec_recurso_seq
    START WITH 13
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_recurso_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_recurso_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.nom_recurso".';

CREATE TABLE mod_sstriesgo.nom_recurso (
    idrecurso numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_recurso_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_recurso OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_recurso IS 'Almacena los recursos';
COMMENT ON COLUMN mod_sstriesgo.nom_recurso.idrecurso IS 'Identificador del recurso.';
COMMENT ON COLUMN mod_sstriesgo.nom_recurso.denominacion IS 'Denominación del recurso.';
COMMENT ON COLUMN mod_sstriesgo.nom_recurso.descripcion IS 'Descripción del recurso.';
COMMENT ON COLUMN mod_sstriesgo.nom_recurso.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_recurso.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_recurso.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstriesgo.sec_resultadoinspeccion_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_resultadoinspeccion_seq OWNER TO zeolides;

CREATE TABLE mod_sstriesgo.nom_resultadoinspeccion (
    idresultadoinspeccion numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_resultadoinspeccion_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL,
    CONSTRAINT ck_resultadoinspeccion_fhasta CHECK (((fhasta IS NULL) OR (fhasta >= fdesde))),
    CONSTRAINT ck_resultadoinspeccion_gestion CHECK (((gestion = (0)::numeric) OR (gestion = (1)::numeric)))
);
ALTER TABLE mod_sstriesgo.nom_resultadoinspeccion OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_resultadoinspeccion IS 'Almacena los posibles resultados de las inspecciones técnicas.
Funcionalidad: Equipos de alto riesgo industrial.';
COMMENT ON COLUMN mod_sstriesgo.nom_resultadoinspeccion.idresultadoinspeccion IS 'Identificador del resultado.';
COMMENT ON COLUMN mod_sstriesgo.nom_resultadoinspeccion.denominacion IS 'Denominación del resultado.';
COMMENT ON COLUMN mod_sstriesgo.nom_resultadoinspeccion.descripcion IS 'Descripción del resultado.';
COMMENT ON COLUMN mod_sstriesgo.nom_resultadoinspeccion.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_resultadoinspeccion.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_resultadoinspeccion.gestion IS 'Determina si el registro es gestionable. (0: No gestionable, 1: Gestionable)';
COMMENT ON CONSTRAINT ck_resultadoinspeccion_fhasta ON mod_sstriesgo.nom_resultadoinspeccion IS 'Restriccion que se establece sobre el campo "mod_sstriesgo.nom_resultadoinspeccion.fhasta".
Restricciones:
- Nulo
- Mayor o igual que el valor de "mod_sstriesgo.nom_resultadoinspeccion.fdesde"';
COMMENT ON CONSTRAINT ck_resultadoinspeccion_gestion ON mod_sstriesgo.nom_resultadoinspeccion IS 'Restricción que se establece sobre el campo "mod_sstriesgo.nom_resultadoinspeccion.gestion".
Restricciones:
- Valores posibles: 0, 1';

CREATE SEQUENCE mod_sstriesgo.sec_nriesgo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_nriesgo_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_nriesgo_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.nom_riesgo".';

CREATE TABLE mod_sstriesgo.nom_riesgo (
    idnriesgo numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_nriesgo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_riesgo OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_riesgo IS 'Almacena los riesgos';
COMMENT ON COLUMN mod_sstriesgo.nom_riesgo.idnriesgo IS 'Identificador del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_riesgo.denominacion IS 'Denominación del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_riesgo.descripcion IS 'Descripción del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_riesgo.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_riesgo.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_riesgo.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstriesgo.sec_sistemas_seq
    START WITH 16
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_sistemas_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_sistemas_seq IS 'Secuencia que genera el identificador de la tabla "mod_sstriesgo.nom_sistema".';

CREATE TABLE mod_sstriesgo.nom_sistema (
    idsistema numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_sistemas_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_sistema OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_sistema IS 'Almacena los sistemas de riesgo';
COMMENT ON COLUMN mod_sstriesgo.nom_sistema.idsistema IS 'Identificador del sistema de riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_sistema.denominacion IS 'Denominación del sitema del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_sistema.descripcion IS 'Descripción del sitema del riesgo.';
COMMENT ON COLUMN mod_sstriesgo.nom_sistema.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_sistema.fhasta IS 'Fecha en que concluye la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_sistema.gestion IS 'Indicador de gestión del registro. 1-> Gestionable, 0-> No gestionable.';

CREATE SEQUENCE mod_sstriesgo.sec_tipoinspeccion_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mod_sstriesgo.sec_tipoinspeccion_seq OWNER TO zeolides;
COMMENT ON SEQUENCE mod_sstriesgo.sec_tipoinspeccion_seq IS 'Secuencia empleada para generar el identificador de la tabla "mod_sstriesgo.nom_tipoinspeccion"';

CREATE TABLE mod_sstriesgo.nom_tipoinspeccion (
    idtipoinspeccion numeric(19,0) DEFAULT nextval('mod_sstriesgo.sec_tipoinspeccion_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    gestion numeric(1,0) DEFAULT 1 NOT NULL
);
ALTER TABLE mod_sstriesgo.nom_tipoinspeccion OWNER TO zeolides;
COMMENT ON TABLE mod_sstriesgo.nom_tipoinspeccion IS 'Tabla que almacena los tipos de inspección.';
COMMENT ON COLUMN mod_sstriesgo.nom_tipoinspeccion.idtipoinspeccion IS 'Identificador del tipo de inspección.';
COMMENT ON COLUMN mod_sstriesgo.nom_tipoinspeccion.denominacion IS 'Denominación del tipo de inspección.';
COMMENT ON COLUMN mod_sstriesgo.nom_tipoinspeccion.descripcion IS 'Descripción del tipo de inspección.';
COMMENT ON COLUMN mod_sstriesgo.nom_tipoinspeccion.fdesde IS 'Fecha en que inicia la vigencia del registro.';
COMMENT ON COLUMN mod_sstriesgo.nom_tipoinspeccion.fhasta IS 'Fecha en que conluye la vigencia del registro';
COMMENT ON COLUMN mod_sstriesgo.nom_tipoinspeccion.gestion IS 'Determina si el registro es gestionable o no.';

ALTER TABLE ONLY mod_sstriesgo.nom_accmejoramiento
    ADD CONSTRAINT pk_accmejoramiento_new PRIMARY KEY (idaccmejoramiento);
COMMENT ON CONSTRAINT pk_accmejoramiento_new ON mod_sstriesgo.nom_accmejoramiento IS 'Llave primaria de la tabla "mod_sst.nom_accmejoramiento".';

ALTER TABLE ONLY mod_sstriesgo.nom_clasifequipo
    ADD CONSTRAINT pk_clasifequipo PRIMARY KEY (idclasifequipo);
COMMENT ON CONSTRAINT pk_clasifequipo ON mod_sstriesgo.nom_clasifequipo IS 'Llave primaria de la tabla "mod_sstriesgo.nom_clasifequipo".';

ALTER TABLE ONLY mod_sstriesgo.nom_consecuencia
    ADD CONSTRAINT pk_consecuencia PRIMARY KEY (idconsecuencia);
COMMENT ON CONSTRAINT pk_consecuencia ON mod_sstriesgo.nom_consecuencia IS 'Llave primaria de la tabla "mod_sstriesgo.nom_consecuencia".';

ALTER TABLE ONLY mod_sstriesgo.dat_equipoaltoriesgo
    ADD CONSTRAINT pk_equipoaltoriesgo PRIMARY KEY (idequipoaltoriesgo);

ALTER TABLE ONLY mod_sstriesgo.nom_evento
    ADD CONSTRAINT pk_evento PRIMARY KEY (idevento);
COMMENT ON CONSTRAINT pk_evento ON mod_sstriesgo.nom_evento IS 'Llave primaria de la tabla "mod_sst.nom_evento".';

ALTER TABLE ONLY mod_sstriesgo.nom_frecuencia
    ADD CONSTRAINT pk_frecuencia PRIMARY KEY (idfrecuencia);
COMMENT ON CONSTRAINT pk_frecuencia ON mod_sstriesgo.nom_frecuencia IS 'Llave primaria de la tabla "mod_sstriesgo.nom_frecuencia".';

ALTER TABLE ONLY mod_sstriesgo.conf_gradopeligrosidad
    ADD CONSTRAINT pk_idgradopeligrosidad PRIMARY KEY (idgradopeligrosidad);

ALTER TABLE ONLY mod_sstriesgo.conf_magnitudriesgo
    ADD CONSTRAINT pk_idmagnitudriesgo PRIMARY KEY (idmagnitudriesgo);

ALTER TABLE ONLY mod_sstriesgo.dat_inspeccionequipo
    ADD CONSTRAINT pk_inspeccionequipo PRIMARY KEY (idinspeccionequipo);

ALTER TABLE ONLY mod_sstriesgo.dat_medida
    ADD CONSTRAINT pk_medida PRIMARY KEY (idmedida);

ALTER TABLE ONLY mod_sstriesgo.nom_nivelriesgo
    ADD CONSTRAINT pk_nivelriesgo_new PRIMARY KEY (idnivelriesgo);
COMMENT ON CONSTRAINT pk_nivelriesgo_new ON mod_sstriesgo.nom_nivelriesgo IS 'Llave primaria de la tabla "mod_sst.nom_nivelriesgo".';

ALTER TABLE ONLY mod_sstriesgo.nom_riesgo
    ADD CONSTRAINT pk_nriesgo_new PRIMARY KEY (idnriesgo);
COMMENT ON CONSTRAINT pk_nriesgo_new ON mod_sstriesgo.nom_riesgo IS 'Llave primaria de la tabla "mod_sst.nom_riesgo".';

ALTER TABLE ONLY mod_sstriesgo.dat_observacionequipo
    ADD CONSTRAINT pk_observacionequipo PRIMARY KEY (idobservacionequipo);

ALTER TABLE ONLY mod_sstriesgo.nom_partesistema
    ADD CONSTRAINT pk_partesistema PRIMARY KEY (idpartesistema);
COMMENT ON CONSTRAINT pk_partesistema ON mod_sstriesgo.nom_partesistema IS 'Llave primaria de la tabla "mod_sstriesgo.nom_partesistema".';

ALTER TABLE ONLY mod_sstriesgo.nom_peligro
    ADD CONSTRAINT pk_peligro PRIMARY KEY (idpeligro);
COMMENT ON CONSTRAINT pk_peligro ON mod_sstriesgo.nom_peligro IS 'Llave primaria de la tabla "mod_sstriesgo.nom_peligro".';

ALTER TABLE ONLY mod_sstriesgo.nom_probabilidad
    ADD CONSTRAINT pk_probabilidad_new PRIMARY KEY (idprobabilidad);
COMMENT ON CONSTRAINT pk_probabilidad_new ON mod_sstriesgo.nom_probabilidad IS 'Llave primaria de la tabla "mod_sst.nom_probabilidad".';

ALTER TABLE ONLY mod_sstriesgo.dat_rconsecuencia
    ADD CONSTRAINT pk_rconsecuencia PRIMARY KEY (idrconsecuencia);

ALTER TABLE ONLY mod_sstriesgo.dat_recurso
    ADD CONSTRAINT pk_recurso PRIMARY KEY (iddrecurso);

ALTER TABLE ONLY mod_sstriesgo.nom_recurso
    ADD CONSTRAINT pk_recurso_new PRIMARY KEY (idrecurso);
COMMENT ON CONSTRAINT pk_recurso_new ON mod_sstriesgo.nom_recurso IS 'Llave primaria de la tabla "mod_sst.nom_recurso".';

ALTER TABLE ONLY mod_sstriesgo.nom_resultadoinspeccion
    ADD CONSTRAINT pk_resultadoinspeccion PRIMARY KEY (idresultadoinspeccion);
COMMENT ON CONSTRAINT pk_resultadoinspeccion ON mod_sstriesgo.nom_resultadoinspeccion IS 'Llave primaria de la tabla "mod_sstriesgo.nom_resuoltadoinspeccion"';

ALTER TABLE ONLY mod_sstriesgo.dat_riesgo
    ADD CONSTRAINT pk_riesgo PRIMARY KEY (idriesgo);

ALTER TABLE ONLY mod_sstriesgo.dat_riesgoevento
    ADD CONSTRAINT pk_riesgoevento PRIMARY KEY (idriesgoevento);

ALTER TABLE ONLY mod_sstriesgo.dat_rpeligro
    ADD CONSTRAINT pk_rpeligro PRIMARY KEY (idrpeligro);

ALTER TABLE ONLY mod_sstriesgo.nom_sistema
    ADD CONSTRAINT pk_sistema PRIMARY KEY (idsistema);
COMMENT ON CONSTRAINT pk_sistema ON mod_sstriesgo.nom_sistema IS 'Llave primaria de la tabla "mod_sstriesgo.nom_sistema".';

ALTER TABLE ONLY mod_sstriesgo.nom_tipoinspeccion
    ADD CONSTRAINT pk_tipoinspeccion PRIMARY KEY (idtipoinspeccion);
COMMENT ON CONSTRAINT pk_tipoinspeccion ON mod_sstriesgo.nom_tipoinspeccion IS 'Llave primaria de la tabla "mod_sstriesgo.nom_tipoinspeccion"';

ALTER TABLE ONLY mod_sstriesgo.nom_accmejoramiento
    ADD CONSTRAINT uk_accmejoramiento_denominacion_new UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_accmejoramiento_denominacion_new ON mod_sstriesgo.nom_accmejoramiento IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_accmejoramiento".';

ALTER TABLE ONLY mod_sstriesgo.nom_clasifequipo
    ADD CONSTRAINT uk_clasifequipo_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_clasifequipo_denominacion ON mod_sstriesgo.nom_clasifequipo IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstriesgo.nom_clasifequipo".';

ALTER TABLE ONLY mod_sstriesgo.nom_consecuencia
    ADD CONSTRAINT uk_consecuencia_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_consecuencia_denominacion ON mod_sstriesgo.nom_consecuencia IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstriesgo.nom_consecuencia".';

ALTER TABLE ONLY mod_sstriesgo.nom_evento
    ADD CONSTRAINT uk_evento_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_evento_denominacion ON mod_sstriesgo.nom_evento IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_evento".';

ALTER TABLE ONLY mod_sstriesgo.nom_frecuencia
    ADD CONSTRAINT uk_frecuencia_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_frecuencia_denominacion ON mod_sstriesgo.nom_frecuencia IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstriesgo.nom_frecuencia".';

ALTER TABLE ONLY mod_sstriesgo.nom_nivelriesgo
    ADD CONSTRAINT uk_nivelriesgo_denominacion_new UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_nivelriesgo_denominacion_new ON mod_sstriesgo.nom_nivelriesgo IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_nivelriesgo".';

ALTER TABLE ONLY mod_sstriesgo.nom_partesistema
    ADD CONSTRAINT uk_partesistema_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_partesistema_denominacion ON mod_sstriesgo.nom_partesistema IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstriesgo.nom_partesistema".';

ALTER TABLE ONLY mod_sstriesgo.nom_peligro
    ADD CONSTRAINT uk_peligro_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_peligro_denominacion ON mod_sstriesgo.nom_peligro IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstriesgo.nom_peligro".';

ALTER TABLE ONLY mod_sstriesgo.nom_probabilidad
    ADD CONSTRAINT uk_probabilidad_denominacion_new UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_probabilidad_denominacion_new ON mod_sstriesgo.nom_probabilidad IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstriesgo.nom_probabilidad".';

ALTER TABLE ONLY mod_sstriesgo.nom_recurso
    ADD CONSTRAINT uk_recurso_denominacion_new UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_recurso_denominacion_new ON mod_sstriesgo.nom_recurso IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_recurso".';

ALTER TABLE ONLY mod_sstriesgo.nom_resultadoinspeccion
    ADD CONSTRAINT uk_resultadoinspeccion_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_resultadoinspeccion_denominacion ON mod_sstriesgo.nom_resultadoinspeccion IS 'Restriccion de unicidad del campo "mod_sstriesgo.nom_resultadoinspeccion.denominacion".';

ALTER TABLE ONLY mod_sstriesgo.nom_riesgo
    ADD CONSTRAINT uk_riesgo_denominacion_new UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_riesgo_denominacion_new ON mod_sstriesgo.nom_riesgo IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sst.nom_riesgo".';

ALTER TABLE ONLY mod_sstriesgo.nom_sistema
    ADD CONSTRAINT uk_sistema_denominacion UNIQUE (denominacion);
COMMENT ON CONSTRAINT uk_sistema_denominacion ON mod_sstriesgo.nom_sistema IS 'Llave para la unicidad del campo "denominacion" de la tabla "mod_sstriesgo.nom_sistema".';

CREATE INDEX fki_consecuencia_rconsecuencia_idconsecuencia ON mod_sstriesgo.dat_rconsecuencia USING btree (idconsecuencia);

CREATE INDEX fki_consecuencia_rpeligro_idpeligro ON mod_sstriesgo.dat_rpeligro USING btree (idpeligro);

CREATE INDEX fki_evento_riesgoevento_idevento ON mod_sstriesgo.dat_riesgoevento USING btree (idevento);

CREATE INDEX fki_resultinspeccion_inspeccionequipo_idresultadoinspeccion ON mod_sstriesgo.dat_inspeccionequipo USING btree (idresultadoinspeccion);

CREATE INDEX fki_riesgo_rconsecuencia_idriesgo ON mod_sstriesgo.dat_rconsecuencia USING btree (idriesgo);

CREATE INDEX fki_riesgo_riesgoevento_idriesgo ON mod_sstriesgo.dat_riesgoevento USING btree (idriesgo);

CREATE INDEX fki_riesgo_rpeligro_idriesgo ON mod_sstriesgo.dat_rpeligro USING btree (idriesgo);

ALTER TABLE ONLY mod_sstriesgo.dat_rconsecuencia
    ADD CONSTRAINT fk_consecuencia_rconsecuencia_idconsecuencia FOREIGN KEY (idconsecuencia) REFERENCES mod_sstriesgo.nom_consecuencia(idconsecuencia);

ALTER TABLE ONLY mod_sstriesgo.dat_rpeligro
    ADD CONSTRAINT fk_consecuencia_rpeligro_idpeligro FOREIGN KEY (idpeligro) REFERENCES mod_sstriesgo.nom_peligro(idpeligro);

ALTER TABLE ONLY mod_sstriesgo.dat_equipoaltoriesgo
    ADD CONSTRAINT fk_equipoaltoriesgo_clasifequipo_idclasifequipo FOREIGN KEY (idclasifequipo) REFERENCES mod_sstriesgo.nom_clasifequipo(idclasifequipo) ON UPDATE CASCADE ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_equipoaltoriesgo_clasifequipo_idclasifequipo ON mod_sstriesgo.dat_equipoaltoriesgo IS 'Relación entre las tablas "mod_sstriesgo.nom_clasifequipo" y "mod_sstriesgo.dat_equipoaltoriesgo"';

ALTER TABLE ONLY mod_sstriesgo.dat_inspeccionequipo
    ADD CONSTRAINT fk_equipoaltoriesgo_inspeccionequipo_idequipoaltoriesgo FOREIGN KEY (idequipoaltoriesgo) REFERENCES mod_sstriesgo.dat_equipoaltoriesgo(idequipoaltoriesgo) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstriesgo.dat_observacionequipo
    ADD CONSTRAINT fk_equipoaltoriesgo_observacionequipo_idequipoaltoriesgo FOREIGN KEY (idequipoaltoriesgo) REFERENCES mod_sstriesgo.dat_equipoaltoriesgo(idequipoaltoriesgo) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstriesgo.dat_riesgoevento
    ADD CONSTRAINT fk_evento_riesgoevento_idevento FOREIGN KEY (idevento) REFERENCES mod_sstriesgo.nom_evento(idevento);

ALTER TABLE ONLY mod_sstriesgo.dat_riesgo
    ADD CONSTRAINT fk_frecuencia_riesgo FOREIGN KEY (idfrecuencia) REFERENCES mod_sstriesgo.nom_frecuencia(idfrecuencia) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstriesgo.dat_riesgo
    ADD CONSTRAINT fk_nivelriesgo_riesgo FOREIGN KEY (idnivelriesgo) REFERENCES mod_sstriesgo.nom_nivelriesgo(idnivelriesgo) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstriesgo.dat_recurso
    ADD CONSTRAINT fk_nrecurso_drecurso FOREIGN KEY (idrecurso) REFERENCES mod_sstriesgo.nom_recurso(idrecurso) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstriesgo.dat_riesgo
    ADD CONSTRAINT fk_nriesgo_riesgo FOREIGN KEY (idnriesgo) REFERENCES mod_sstriesgo.nom_riesgo(idnriesgo) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstriesgo.dat_riesgo
    ADD CONSTRAINT fk_probabilidad_riesgo FOREIGN KEY (idprobabilidad) REFERENCES mod_sstriesgo.nom_probabilidad(idprobabilidad) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY mod_sstriesgo.dat_inspeccionequipo
    ADD CONSTRAINT fk_resultinspeccion_inspeccionequipo_idresultadoinspeccion FOREIGN KEY (idresultadoinspeccion) REFERENCES mod_sstriesgo.nom_resultadoinspeccion(idresultadoinspeccion);

ALTER TABLE ONLY mod_sstriesgo.dat_medida
    ADD CONSTRAINT fk_riesgo_medida FOREIGN KEY (idriesgo) REFERENCES mod_sstriesgo.dat_riesgo(idriesgo) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstriesgo.dat_rconsecuencia
    ADD CONSTRAINT fk_riesgo_rconsecuencia_idriesgo FOREIGN KEY (idriesgo) REFERENCES mod_sstriesgo.dat_riesgo(idriesgo) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstriesgo.dat_recurso
    ADD CONSTRAINT fk_riesgo_recurso FOREIGN KEY (idriesgo) REFERENCES mod_sstriesgo.dat_riesgo(idriesgo) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstriesgo.dat_riesgoevento
    ADD CONSTRAINT fk_riesgo_riesgoevento_idriesgo FOREIGN KEY (idriesgo) REFERENCES mod_sstriesgo.dat_riesgo(idriesgo) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstriesgo.dat_rpeligro
    ADD CONSTRAINT fk_riesgo_rpeligro_idriesgo FOREIGN KEY (idriesgo) REFERENCES mod_sstriesgo.dat_riesgo(idriesgo) ON DELETE CASCADE;

ALTER TABLE ONLY mod_sstriesgo.dat_inspeccionequipo
    ADD CONSTRAINT fk_tipoinspeccion_inspeccionequipo_idtipoinspeccion FOREIGN KEY (idtipoinspeccion) REFERENCES mod_sstriesgo.nom_tipoinspeccion(idtipoinspeccion) ON UPDATE CASCADE ON DELETE RESTRICT;