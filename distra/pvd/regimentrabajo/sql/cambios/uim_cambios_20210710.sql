CREATE SEQUENCE mod_regimentrabajo.sec_asistenciasesion_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_asistenciasesion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistenciasesion".';

CREATE SEQUENCE mod_regimentrabajo.sec_conf_calendariopersona_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_categoriacausas_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_certificados
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_estructurahorario_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999 START 18
  CACHE 1;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_estructurareloj_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999 START 1
  CACHE 1;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_estructuras_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999 START 417
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_estructuras_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_estructuras".';

CREATE SEQUENCE mod_regimentrabajo.sec_conf_estructuratempus_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999 START 49
  CACHE 1;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 5
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_fondodetiempo".';

CREATE SEQUENCE mod_regimentrabajo.sec_dat_registro_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_dat_registro_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistencia".';

CREATE SEQUENCE mod_regimentrabajo.sec_diaferiadohabilitado_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 99999999999 START 4
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_diaferiadohabilitado_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_diaferiadohabilitado".';

CREATE SEQUENCE mod_regimentrabajo.sec_horarionocturnidad_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_horarionocturnidad_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_turnotrabajo".';

CREATE SEQUENCE mod_regimentrabajo.sec_periodomes_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_periodomes_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_periodomes".';

CREATE SEQUENCE mod_regimentrabajo.sec_periodoquincena_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_periodoquincena_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_periodoquincena".';

CREATE SEQUENCE mod_regimentrabajo.sec_planvacaciones_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_planvacaciones_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_planvacaciones".';

CREATE SEQUENCE mod_regimentrabajo.sec_registromodelovac_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_registromodelovac_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_registromodelovac".';

CREATE SEQUENCE mod_regimentrabajo.sec_turnosesion_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_turnosesion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_turnosesion".';

COMMENT ON SCHEMA mod_regimentrabajo
IS 'Agrupa los datos del componente régimen de trabajo. Versión 1. (RRHH)';

CREATE TYPE mod_regimentrabajo.td_persona_tiempo_causa AS (
  idpersona NUMERIC,
  idcausa NUMERIC,
  tiempo INTERVAL(6),
  contdias NUMERIC,
  mesanteriorcertificado VARCHAR
);

CREATE TYPE mod_regimentrabajo.td_persona_tiempo_causa_cargo AS (
  idpersona NUMERIC,
  idcausa NUMERIC,
  tiempo INTERVAL(6),
  contdias NUMERIC,
  mesanteriorcertificado VARCHAR,
  idcargo NUMERIC
);

CREATE TYPE mod_regimentrabajo.td_persona_tiempo_causa_old AS (
  idpersona NUMERIC,
  idcausa NUMERIC,
  tiempo INTERVAL
);

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_actualizar_confcalendariopersona (
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
personas record;
consulta character varying;
BEGIN
r := false;
For personas in SELECT
  c.idcalendario,
  c.fecha,
  c.idtipodedia,
  c.idgrupodescanso,
  c.horas,
  c.idturnotrabajo,
  drt.idpersona,
  drt.idcargo
FROM
  mod_regimentrabajo.conf_calendario c
  INNER JOIN mod_personaext.dat_regimentrabajo drt on drt.idgrupodescanso = c.idgrupodescanso AND drt.actual = 1
WHERE drt.idcargo IS NOT NULL
loop
IF(personas.idturnotrabajo IS NULL ) 
THEN
  consulta:= 'INSERT INTO
    mod_regimentrabajo.conf_calendariopersona
  ( 
    fecha,
    idpersona,
    idtipodedia,
    idcargo   
  )
  VALUES ( 
    ''' ||personas.fecha||''',
    ' ||personas.idpersona||',
    ' ||personas.idtipodedia||',
    ' ||personas.idcargo||'
  );';
ELSE
  consulta:= 'INSERT INTO
    mod_regimentrabajo.conf_calendariopersona
  ( 
    fecha,   
    idpersona,    
    idtipodedia,
    idcargo,
    idturnotrabajo,
    horas
  )
  VALUES ( 
    ''' ||personas.fecha||''',
    ' ||personas.idpersona||',
    ' ||personas.idtipodedia||',
    ' ||personas.idcargo||',
    ' ||personas.idturnotrabajo||',
    ''' ||personas.horas||'''
  );';
END IF;
execute consulta;
r := true;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 1000000;

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_actualizar_confcalendariopersona (
  p_year_a_planificar numeric
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
personas record;
consulta character varying;
BEGIN
r := false;
For personas in SELECT
  c.idcalendario,
  c.fecha,
  c.idtipodedia,
  c.idgrupodescanso,
  c.horas,
  c.idturnotrabajo,
  drt.idpersona,
  dsl.idcargo
FROM
  mod_regimentrabajo.conf_calendario c
  INNER JOIN mod_personaext.dat_regimentrabajo drt on drt.idgrupodescanso = c.idgrupodescanso AND drt.actual = 1
  LEFT JOIN mod_persona.dat_personaentidad dpe ON drt.idpersona = dpe.idpersona AND ((dpe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= dpe.fhasta OR dpe.fhasta is null)))
  INNER JOIN mod_persona.dat_situacionlaboral dsl ON dsl.idpersonaentidad = dpe.idpersonaentidad AND ((dsl.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= dsl.fhasta OR dsl.fhasta is null) and dsl.estado = 0))
WHERE dsl.idcargo IS NOT NULL and date_part('year',c.fecha::date) = $1
loop
IF(personas.idturnotrabajo IS NULL ) 
THEN
  consulta:= 'INSERT INTO
    mod_regimentrabajo.conf_calendariopersona
  ( 
    fecha,
    idpersona,
    idtipodedia,
    idcargo   
  )
  VALUES ( 
    ''' ||personas.fecha||''',
    ' ||personas.idpersona||',
    ' ||personas.idtipodedia||',
    ' ||personas.idcargo||'
  );';
ELSE
  consulta:= 'INSERT INTO
    mod_regimentrabajo.conf_calendariopersona
  ( 
    fecha,   
    idpersona,    
    idtipodedia,
    idcargo,
    idturnotrabajo,
    horas
  )
  VALUES ( 
    ''' ||personas.fecha||''',
    ' ||personas.idpersona||',
    ' ||personas.idtipodedia||',
    ' ||personas.idcargo||',
    ' ||personas.idturnotrabajo||',
    ''' ||personas.horas||'''
  );';
END IF;
execute consulta;
r := true;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 1;

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_actualizar_trt (
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
personas record;
consulta character varying;
BEGIN
r := false;
For personas in SELECT  
  a.idasistencia, 
  a.hrsdescontadas,
  a.idpersona,
  a.fecharegistro,
  c.idturnotrabajo,
  c.horas,
  c.horas - CAST(a.hrsdescontadas as time) as TRT
FROM 
  mod_regimentrabajo.dat_asistencia a
  INNER JOIN mod_regimentrabajo.conf_calendariopersona c on a.idpersona = c.idpersona AND a.fecharegistro = c.fecha
WHERE
  a.hrsdescontadas is not null AND 
  a.hrsdescontadas <> '' AND 
  a.fdesde is null AND 
  a.fhasta is null AND
  a.fecharegistro >= CAST('01/01/2019' as date)
loop
  consulta:= 'UPDATE 
  mod_regimentrabajo.dat_asistencia  
SET   
  hrstrabajadas = '''||personas.TRT||'''
 
WHERE ( 
    idasistencia = '||personas.idasistencia||'
  );';
--raise notice '%', consulta;
execute consulta;
r := true;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 1000000;

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_cambiargrupoasistencia (
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
personas record;
consulta character varying;
BEGIN
r := false; 
For personas in SELECT rt.idpersona as idp, rt.idgrupodescanso as idg from mod_personaext.dat_regimentrabajo rt WHERE rt.actual = 1
loop
consulta:= ' UPDATE mod_regimentrabajo.dat_asistencia  
  			SET idgrupodescanso = ' ||personas.idg||' where idpersona = '||personas.idp||';';
--
--raise notice '%',consulta;
execute consulta;
r := true;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_cambiarturnoasistencia (
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
personas record;
consulta character varying;
BEGIN
r := false; 
For personas in SELECT cc.idturnotrabajo as idt, cc.idgrupodescanso as idg, cc.fecha as f from mod_regimentrabajo.conf_calendario cc WHERE cc.idtipodedia in (3, 1)
loop
if(personas.idt is not null)
THEN
consulta:= ' UPDATE mod_regimentrabajo.dat_asistencia  
  			SET idturnotrabajo = ' ||personas.idt||' where idgrupodescanso = '||personas.idg||' and fecharegistro = CAST('''||personas.f||''' AS DATE);';
--

execute consulta;
r := true;

end if;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_eliminarduplicados_confcalendariopersona (
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
persona_regimen record;
duplicados record;
v_cont numeric;

BEGIN
r := false;
/*
select concat(fecha,'-',idpersona),idcalendariopersona,idcargo from mod_regimentrabajo.conf_calendariopersona
where concat(fecha,'-',idpersona) in (SELECT
    concat(fecha,'-',idpersona)
FROM
  mod_regimentrabajo.conf_calendariopersona
  group by concat(fecha,'-',idpersona)
having count(idcalendariopersona) > 1)
order by concat(fecha,'-',idpersona),idcalendariopersona

SELECT
    fecha,
    idpersona,
  count(idcalendariopersona) 
FROM
  mod_regimentrabajo.conf_calendariopersona
  group by fecha, idpersona
having count(idcalendariopersona) > 1;
*/

DROP TABLE IF EXISTS mod_regimentrabajo.tmp_duplicadoscalendario;
CREATE TABLE mod_regimentrabajo.tmp_duplicadoscalendario
(
  fecha_persona text,
  idcalendariopersona numeric NOT NULL,
  actual numeric,
  CONSTRAINT pk_idcalenpers PRIMARY KEY (idcalendariopersona)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_regimentrabajo.tmp_duplicadoscalendario OWNER TO zeolides;

v_cont :=0;

--obtener personas con cambios en el dat_regimentrabajo

for persona_regimen in (SELECT distinct idpersona as idp_reg ,fdesde as fd_reg FROM mod_personaext.dat_regimentrabajo where actual = 1) loop
raise notice 'idp_reg: % , fd_reg: %',persona_regimen.idp_reg,persona_regimen.fd_reg;
for duplicados in (select concat(fecha,'-',idpersona) as fidp,idcalendariopersona as idcp,idcargo from mod_regimentrabajo.conf_calendariopersona
			where concat(fecha,'-',idpersona) in (select
									concat(fecha,'-',idpersona)
								from
									mod_regimentrabajo.conf_calendariopersona
								--por la persona y la fecha del regimen.
								where idpersona = persona_regimen.idp_reg
								     and fecha > persona_regimen.fd_reg
								     
								group by concat(fecha,'-',idpersona)
								having count(concat(fecha,'-',idpersona)) > 1)
		order by concat(fecha,'-',idpersona),idcalendariopersona)
loop

if (duplicados.fidp is not null) then 
raise notice ' NOT NULL fidp: %', duplicados.fidp;
else
raise notice 'nada';
end if;
--verificar si existe en temporal
SELECT count(*) into v_cont FROM mod_regimentrabajo.tmp_duplicadoscalendario WHERE fecha_persona=duplicados.fidp;

if( v_cont = 0) then
raise notice 'insertar C: % ',v_cont;
--insertar
raise notice 'INSERT 1: fecha: % , idcp: %',duplicados.fidp, duplicados.idcp;
INSERT INTO mod_regimentrabajo.tmp_duplicadoscalendario(fecha_persona, idcalendariopersona,actual) VALUES (duplicados.fidp, duplicados.idcp,1);
else
--actualizar
raise notice 'actualizar C: % ',v_cont;
raise notice 'idcp: % en fecha: %', duplicados.idcp , duplicados.fidp;
UPDATE mod_regimentrabajo.tmp_duplicadoscalendario SET actual = 0 WHERE fecha_persona = duplicados.fidp;
raise notice 'actualizar ejecutado';
raise notice 'INSERT 2: fecha: % , idcp: %',duplicados.fidp, duplicados.idcp;
INSERT INTO mod_regimentrabajo.tmp_duplicadoscalendario(fecha_persona, idcalendariopersona,actual) VALUES (duplicados.fidp, duplicados.idcp,1);

end if;
end loop;				
end loop;

--eliminar
--DELETE FROM mod_regimentrabajo.conf_calendariopersona WHERE idcalendariopersona in (select idcalendariopersona from mod_regimentrabajo.tmp_duplicadoscalendario where actual=0);

RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 1;

CREATE OR REPLACE FUNCTION mod_regimentrabajo.ft_actualizar_horas_turnotrabajo (
)
RETURNS trigger AS
$body$
DECLARE
   horas_calculadas record;
   constante character varying := '24:00:00';
BEGIN

IF (TG_OP = 'UPDATE')THEN
	SELECT ( ((fdesde ||' '|| horafin):: timestamp) - horainicio - tiempodescanso)::time as horas, idturnotrabajo INTO horas_calculadas FROM mod_regimentrabajo.nom_turnotrabajo where idturnotrabajo = OLD.idturnotrabajo;
	IF (horas_calculadas.horas='00:00:00') THEN
		UPDATE mod_regimentrabajo.nom_turnotrabajo SET horas=constante WHERE idturnotrabajo=horas_calculadas.idturnotrabajo;
	ELSE
		UPDATE mod_regimentrabajo.nom_turnotrabajo SET horas=horas_calculadas.horas WHERE idturnotrabajo=horas_calculadas.idturnotrabajo;
	END IF;
ELSIF (TG_OP = 'INSERT') THEN
	SELECT ( ((fdesde ||' '|| horafin):: timestamp) - horainicio - tiempodescanso)::time as horas, idturnotrabajo INTO horas_calculadas FROM mod_regimentrabajo.nom_turnotrabajo where idturnotrabajo = NEW.idturnotrabajo;
	IF (horas_calculadas.horas='00:00:00') THEN
		UPDATE mod_regimentrabajo.nom_turnotrabajo SET horas=constante WHERE idturnotrabajo=horas_calculadas.idturnotrabajo;
	ELSE
		UPDATE mod_regimentrabajo.nom_turnotrabajo SET horas=horas_calculadas.horas WHERE idturnotrabajo=horas_calculadas.idturnotrabajo;
	END IF;
ELSE
	RAISE NOTICE 'DELETE';
END IF;
RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 10;

CREATE OR REPLACE FUNCTION mod_regimentrabajo.ft_certificar_asistencia (
)
RETURNS trigger AS
$body$
DECLARE
    --padre_rec mod_regimentrabajo.dat_asistencia;
    sesion integer:=0;
    sesion_m record;
    sesion_t record;
    regimen_turno_persona record;
    calcular integer:=0;
BEGIN
  --Se certifica la asistencia.
  IF (NEW.certificado=1)THEN
	--verificar trabajo por sesiones
	SELECT habsesion INTO sesion FROM mod_regimentrabajo.conf_habilitarsesiones;
	--trabajo por sesiones
	IF (sesion=1) THEN
              --verificar (idcausa,fdesde,fhasta) no tengan datos
              IF( (OLD.idcausa IS NOT NULL) AND (OLD.fdesde IS NOT NULL) AND (OLD.fhasta IS NOT NULL) ) THEN
			RAISE NOTICE 'Asistencia correcta';
	      ELSE
			--verificar la asistencia por sesiones
			--asistencia de la mañana
			SELECT idasistenciasesion, idasistencia, idsesion, fechahoraentrada, fechahorasalida, idcausa, hrsdescontadas, horasextras
			INTO sesion_m FROM mod_regimentrabajo.dat_asistenciasesion WHERE idasistencia=OLD.idasistencia AND idsesion=0;

			--asistencia de la tarde
			SELECT idasistenciasesion, idasistencia, idsesion, fechahoraentrada, fechahorasalida, idcausa, hrsdescontadas, horasextras
			INTO sesion_t FROM mod_regimentrabajo.dat_asistenciasesion WHERE idasistencia=OLD.idasistencia AND idsesion=1;

			--obtener horas establecidas por el turno de trabajo
			SELECT 	turnotrabajo.horaentradaps,
				turnotrabajo.horasalidaps,
				turnotrabajo.horaentradass,
				turnotrabajo.horasalidass
			INTO regimen_turno_persona
			FROM mod_personaext.dat_regimentrabajo as regimenpersona
			INNER JOIN mod_regimentrabajo.nom_turnotrabajo as turnotrabajo USING (idturnotrabajo)
			WHERE regimenpersona.idpersona = OLD.idpersona  AND
			      (	turnotrabajo.horaentradaps IS NOT NULL
						AND
				turnotrabajo.horasalidaps IS NOT NULL
						AND
				turnotrabajo.horaentradass IS NOT NULL
						AND
				turnotrabajo.horasalidass IS NOT NULL
			       )limit 1;

			IF(regimen_turno_persona IS NOT NULL) THEN calcular:=1; ELSE calcular:=0; END IF;

			--sesión mañana
			IF ( ( (sesion_m.idcausa IS NOT NULL) AND ( (sesion_m.fechahoraentrada IS NULL) AND (sesion_m.fechahorasalida IS NULL) ) )
			                                                    OR
			         ( (sesion_m.fechahoraentrada IS NOT NULL) AND (sesion_m.fechahorasalida IS NOT NULL) )
			   ) THEN
			     --mañana justificada
			     RAISE NOTICE 'mañana justificada';
			ELSE
				IF (calcular=1)THEN
					--calcular horas primera sesión
					UPDATE mod_regimentrabajo.dat_asistenciasesion
						SET idcausa=2, hrsdescontadas=(regimen_turno_persona.horasalidaps - regimen_turno_persona.horaentradaps)
					WHERE idasistencia=OLD.idasistencia AND idsesion=0;
				END IF;
			END IF;

			--sesión tarde
			IF ( ( (sesion_t.idcausa IS NOT NULL) AND ( (sesion_t.fechahoraentrada IS NULL) AND (sesion_t.fechahorasalida IS NULL) ) )
			                                                    OR
			         ( (sesion_t.fechahoraentrada IS NOT NULL) AND (sesion_t.fechahorasalida IS NOT NULL) )
			   ) THEN
			     RAISE NOTICE 'tarde justificada';
			ELSE
				IF (calcular=1)THEN
					--calcular horas segunda sesión
					UPDATE mod_regimentrabajo.dat_asistenciasesion
						SET idcausa=2, hrsdescontadas=(regimen_turno_persona.horasalidass - regimen_turno_persona.horaentradass)
					WHERE idasistencia=OLD.idasistencia AND idsesion=1;
				END IF;
			END IF;

	      END IF;
	END IF;
  END IF;
  	      --Escribiendo en el log
              --INSERT INTO mod_regimentrabajo.tabla_log(idasistencia,por_sesion,descontar_primera,descontar_segunda,idcausa)
              --VALUES (OLD.idasistencia,sesion,(regimen_turno_persona.horasalidaps - regimen_turno_persona.horaentradaps),(regimen_turno_persona.horasalidass - regimen_turno_persona.horaentradass),2);
RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 10;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_asistenciamensual_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistenciamensual".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_calendario_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_calendario_distra".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_causasreporteausencia_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_causasreporteausencia".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_dat_asistencia_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistencia".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_dat_estructuraasistencia_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_estructuraasistencia".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_grupodescanso_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_grupodescanso".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_indicador_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_indicador".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_indicadoresporreporte_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_indicadoresporreporte".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_nom_causa_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_causa".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_regimentrabajo_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_regimentrabajo".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_reporte_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_reporte".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_rotacion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_rotacion".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_rotacionturno_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_rotacionturno".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_subordinacion_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_subordinacion".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_tipodedia_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_tipodedia".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_turnotrabajo_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_turnotrabajo".';

CREATE TABLE mod_regimentrabajo.conf_habcausa (
  id NUMERIC(19,0) NOT NULL,
  habilitado NUMERIC(1,0) NOT NULL,
  CONSTRAINT dat_habcausa_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_habcontrolacceso (
  id NUMERIC(19,0) NOT NULL,
  habilitado NUMERIC(1,0) NOT NULL,
  fuente NUMERIC(1,0),
  dirautenticacion VARCHAR(100),
  dirdatos VARCHAR(100),
  CONSTRAINT conf_habcontrolacceso_dat_habilitarhorarioentradasalida_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_regimentrabajo.conf_habcontrolacceso.fuente
IS '0-Base de datos
1-Servicio Web
2-Ninguno';

CREATE TABLE mod_regimentrabajo.conf_habilitarfinmes (
  id NUMERIC(19,0) NOT NULL,
  habilitado NUMERIC(1,0) NOT NULL,
  CONSTRAINT conf_habilitarfinmes_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_habilitarhorarioentradasalida (
  id NUMERIC(19,0) NOT NULL,
  habilitado NUMERIC(1,0) NOT NULL,
  CONSTRAINT dat_habilitarhorarioentradasalida_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_habilitarsesiones (
  idhabilitarsesion NUMERIC(19,0) NOT NULL,
  habsesion NUMERIC DEFAULT 0 NOT NULL,
  CONSTRAINT conf_habilitarsesiones_pkey PRIMARY KEY(idhabilitarsesion)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_habilitarsesiones
  ALTER COLUMN idhabilitarsesion SET STATISTICS 0;

ALTER TABLE mod_regimentrabajo.conf_habilitarsesiones
  ALTER COLUMN habsesion SET STATISTICS 0;

COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarsesiones.idhabilitarsesion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarsesiones.habsesion
IS 'habilitar trabajo por sesiones
0- No habilitado
1- habilitado';

CREATE TABLE mod_regimentrabajo.conf_habilitarsubmayorvac (
  id NUMERIC(19,0) NOT NULL,
  habilitado NUMERIC(1,0) NOT NULL,
  CONSTRAINT conf_habilitarsubmayorvac_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_horasextras (
  id NUMERIC(1,0) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  limite NUMERIC(3,0) NOT NULL,
  CONSTRAINT pk_horasextras PRIMARY KEY(id)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_regimentrabajo.conf_horasextras.limite
IS 'Limite en horas';

CREATE TABLE mod_regimentrabajo.in_tipodia (
  id NUMERIC
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.tabla_log (
  idasistencia NUMERIC(19,0) NOT NULL,
  por_sesion NUMERIC(1,0) NOT NULL,
  fecha_hora TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
  descontar_primera VARCHAR,
  descontar_segunda VARCHAR,
  idcausa NUMERIC,
  CONSTRAINT pk_log_asistencia PRIMARY KEY(idasistencia, fecha_hora)
) 
WITH (oids = false);

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas (
  p_idcausa numeric [],
  p_idpersona numeric [],
  p_idgrupodescanso numeric [],
  p_desde date,
  p_hasta date,
  p_tipodia numeric []
)
RETURNS SETOF mod_regimentrabajo.td_persona_tiempo_causa AS
$body$
DECLARE
v_causa numeric;
v_persona numeric;

v_calculo_descuento interval := '00:00:00';
v_suma_descuento interval := '00:00:00';

v_r_asistencia record;
v_resultado record;
v_in_tipodia numeric;
v_td_tiempo_causa mod_regimentrabajo.td_persona_tiempo_causa;

v_contar numeric := 0;
v_suma_dias numeric :=0;

v_mes_anterior numeric := null;
v_anno_anterior numeric := null;
v_mes_calculo VARCHAR := '';
v_certinicial_date date;

BEGIN

CREATE TEMP TABLE IF NOT EXISTS tmp_persona_tiempo_causa
(
  idcausa numeric,
  idpersona numeric,
  suma interval,
  dias numeric,
  mesyearanterior VARCHAR
)
WITH (
  OIDS=FALSE
);
ALTER TABLE tmp_persona_tiempo_causa OWNER TO zeolides;
DELETE FROM tmp_persona_tiempo_causa;

DELETE FROM mod_regimentrabajo.in_tipodia;
for v_in_tipodia in 1 .. array_length($6, 1) loop
INSERT INTO mod_regimentrabajo.in_tipodia(id) VALUES ($6[v_in_tipodia]);
end loop;

--por cada causa.
for v_causa in 1 .. array_length($1, 1) loop
  raise notice 'Causa: %',$1[v_causa];
    --por cada persona.
  for v_persona in 1 .. array_length($2, 1) loop
    raise notice 'Persona: %',$2[v_persona];
    --buscar personas implicadas con la causa en cuestiÃ³n.
    for v_r_asistencia in (select idasistencia, idpersona, idcausa, fecharegistro, fdesde, fhasta, hrsdescontadas, (hrsdescontadas::interval) as tiempo
                , certificadocontinuado as certificadocontinuado
                                from mod_regimentrabajo.dat_asistencia daf
                where idcausa = $1[v_causa] and idpersona = $2[v_persona]) loop  -- and daf.fecharegistro >= $4 and daf.fecharegistro <= $5
                                
      raise notice 'La persona ( % ) tiene registros con la causa ( % ). idasistencia: %',$2[v_persona],$1[v_causa],v_r_asistencia.idasistencia;
      if (v_r_asistencia.idasistencia is null) then
          raise notice 'v_r_asistencia.idasistencia is null';
      else
        /*if ( (v_r_asistencia.hrsdescontadas is null) or (v_r_asistencia.hrsdescontadas like '') ) then
          --ejecutar proceso con las fechas.
          raise notice 'A incluido la causa ( % ) que no posee horas descontadas',v_r_asistencia.idcausa;                    
          else*/
          --analizar las fechas del perÃ­odo
                    raise notice 'analizar las fechas';
          if ( (v_r_asistencia.fdesde is not null) and (v_r_asistencia.fhasta is not null) ) then
                    raise notice 'las 2 fechas 4: % , desde asist: % , 5: %',$4, v_r_asistencia.fdesde,$5;
            if ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde = $5)) then
              -- (0) $4 < fdesde = $5
              select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fdesde) and (c.idpersona = $2[v_persona]);
                            --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fdesde) and (c.idpersona = $2[v_persona]);
                            raise notice 'CASO DIAS: %',v_contar;
              raise notice 'CASO (0)(fdesde): %',v_calculo_descuento;
            elsif ( ($4 = v_r_asistencia.fhasta) and (v_r_asistencia.fhasta < $5) ) then
              -- (0) $4 = fhasta < $5
              select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);
              --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);
              raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (0)(fhasta): %',v_calculo_descuento;                           
            elsif ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 <= v_r_asistencia.fhasta) ) then
              -- (1) $4 < fdesde < $5 <= fhasta
              -- calcular nuevo descuento con (fdesde y $5)
              select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);
              --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);
              raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (1): %',v_calculo_descuento;
            elsif ( (v_r_asistencia.fdesde < $4) and ($4 < $5) and ($5 < v_r_asistencia.fhasta) ) then
              -- (2) fdesde < $4 < $5 < fhasta
              -- calcular nuevo descuento con ($4 y $5)
              select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);            
              --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);            
              raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (2): %',v_calculo_descuento;
            elsif ( (v_r_asistencia.fdesde < $4) and ($4 <= v_r_asistencia.fhasta) and (v_r_asistencia.fhasta < $5) ) then
              -- (3) fdesde < $4 <= fhasta < $5
              -- calcular nuevo descuento con ($4 y fhasta)
              select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);
              --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);
              raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (3): %',v_calculo_descuento;
            elsif ( (v_r_asistencia.fdesde < $4) and ($4 < v_r_asistencia.fhasta) and (v_r_asistencia.fhasta = $5) ) then
              -- (4) fdesde < $4 < fhasta = $5
              -- calcular nuevo descuento con ($4 y fhasta)
              select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);           
              --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);           
              raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (4): %',v_calculo_descuento;
            elsif ( ($4 = v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 <= v_r_asistencia.fhasta) ) then
              -- (5) $4 = fdesde < $5 <= fhasta
              -- calcular nuevo descuento con (fdesde y $5)
              select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);           
              --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);           
              raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (5): %',v_calculo_descuento;
            elsif ( ($4 = v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 > v_r_asistencia.fhasta) ) then
              -- (5.1) $4 = fdesde < $5 > fhasta
              -- calcular nuevo descuento con (fdesde y fhasta)
              select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);            
              --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
              where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);            
              raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (5.1): %',v_calculo_descuento;
            else
              -- (6) $4 < fdesde < $5 > fhasta
              if ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 > v_r_asistencia.fhasta) ) then
                select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
                where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);            
                --contar dias
                                select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
                where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);            
                raise notice 'CASO DIAS: %',v_contar;
                                raise notice 'CASO (6): %',v_calculo_descuento;             
              end if;
            end if;
            raise notice 'v_suma_descuento:= % + %',v_suma_descuento,v_calculo_descuento;           
            v_suma_descuento := v_suma_descuento + v_calculo_descuento;
                        --sumar dias contados por causa
                        raise notice 'antes ---> v_suma_dias = %',v_suma_dias;
                        v_suma_dias := v_suma_dias + v_contar;
                        raise notice 'luego ---> v_suma_dias = %',v_suma_dias;
            raise notice 'v_suma_descuento = %',v_suma_descuento;     
            v_calculo_descuento := '00:00:00';
                        v_contar := 0;
          else
            -- (2) fecharegistro ( Ej: ausente, llegada tarde)
            -- RECURSO SELECT to_date('2016-11-14 08:00:00','YY-MM-DD');
            -- raise notice 'La persona ( % ) no tiene registros con la causa ( % ) en FECHAREGISTRO',$2[v_persona],$1[v_causa];
            if ( (v_r_asistencia.fecharegistro is not null) and (v_r_asistencia.fecharegistro >= $4) and (v_r_asistencia.fecharegistro <= $5) ) then
              raise notice 'CASO (fecharegistro), v_calculo_descuento = %',v_calculo_descuento;           
              v_suma_descuento := v_suma_descuento + v_r_asistencia.tiempo;
                            v_suma_dias := count(v_r_asistencia.idasistencia);
              raise notice 'CASO (fecharegistro), v_r_asistencia.tiempo = %',v_r_asistencia.tiempo;
              raise notice 'CASO (v_suma_descuento) %',v_suma_descuento;
            else
              raise notice 'Fecha de registro fuera del perÃ­odo o no tiene dato registrado.';
            end if;
          end if;
        /*end if;*/
        raise notice 'TUPLA: persona: %, causa: %, suma: %, contdias: %',$2[v_persona],$1[v_causa],v_suma_descuento,v_suma_dias;
                
                 if(v_r_asistencia.certificadocontinuado = 1) then
                    select  MAX(da.fecharegistro) into v_certinicial_date from mod_regimentrabajo.dat_asistencia da
                                          inner join  mod_regimentrabajo.conf_certificados cert on (da.idcausa = cert.idcausa)
                                          where da.certificadocontinuado = 0 and da.idpersona = v_r_asistencia.idpersona;
                    if(v_certinicial_date is not null) then
                      if(EXTRACT(MONTH FROM v_certinicial_date) - 1 = 0) then 
                          v_mes_anterior = 12;  
                            v_anno_anterior = EXTRACT(YEAR FROM v_certinicial_date) - 1;                         
                        else
                            v_mes_anterior = EXTRACT(MONTH FROM v_certinicial_date) - 1;
                            v_anno_anterior = EXTRACT(YEAR FROM v_certinicial_date);
                        end if;
                        
                        v_mes_calculo = v_mes_anterior || '/' || v_anno_anterior ;
                        
                    end if;
                end if;
                

        INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias, v_mes_calculo);
        v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; v_td_tiempo_causa.tiempo = v_suma_descuento;
        v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00';
                v_suma_dias := 0; v_contar := 0;
        --RETURN NEXT v_td_tiempo_causa;
                v_mes_calculo := null;
      end if;
    end loop;
    raise notice 'La persona ( % ) NO TIENE registros con la causa ( % )',$2[v_persona],$1[v_causa];
      INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias);
          
    v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; 
        v_td_tiempo_causa.tiempo = v_suma_descuento;
    v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00'; 
        --reiniciar sumador de dias
        v_suma_dias := 0;
    --RETURN NEXT v_td_tiempo_causa;
  end loop;
end loop;

for v_resultado in (select idpersona as idp, idcausa as idc, sum(suma) as sumatoria, sum(dias) as cont_dias, mesyearanterior as mesyearanterior from tmp_persona_tiempo_causa group by idpersona, idcausa, mesyearanterior order by idpersona,idcausa) loop
  v_td_tiempo_causa.idpersona = v_resultado.idp; v_td_tiempo_causa.idcausa = v_resultado.idc; v_td_tiempo_causa.tiempo = v_resultado.sumatoria;
    v_td_tiempo_causa.contdias = v_resultado.cont_dias; v_td_tiempo_causa.mesanteriorcertificado = v_resultado.mesyearanterior;
  RETURN NEXT v_td_tiempo_causa;
end loop;
   
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

COMMENT ON FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas(p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric [])
IS 'SELECT * from mod_regimentrabajo.f_listadopersonastiempocausas( ''{idcausa separados por coma}'', ''{idpersona separados por coma}'', ''{idgrupodescanso separados por coma}'', fecha_i, fecha_f, idtipo);';

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas (
  p_idcausa numeric [],
  p_idpersona numeric [],
  p_idgrupodescanso numeric [],
  p_desde date,
  p_hasta date,
  p_tipodia numeric [],
  p_idcargo numeric []
)
RETURNS SETOF mod_regimentrabajo.td_persona_tiempo_causa_cargo AS
$body$
DECLARE
v_causa numeric;
v_persona numeric;
v_cargo numeric;

v_calculo_descuento interval := '00:00:00';
v_suma_descuento interval := '00:00:00';

v_r_asistencia record;
v_resultado record;
v_in_tipodia numeric;
v_td_tiempo_causa mod_regimentrabajo.td_persona_tiempo_causa_cargo;

v_contar numeric := 0;
v_suma_dias numeric :=0;

v_r_asistenciacert record;
v_mes_anterior numeric := null;
v_anno_anterior numeric := null;
v_mes_calculo VARCHAR := '';
v_certinicial_date date;

BEGIN

CREATE TEMP TABLE IF NOT EXISTS tmp_persona_tiempo_causa
(
  idcausa numeric,
  idpersona numeric,
  suma interval,
  dias numeric,
  mesyearanterior VARCHAR,
  idcargo numeric
)
WITH (
  OIDS=FALSE
);
ALTER TABLE tmp_persona_tiempo_causa OWNER TO zeolides;
DELETE FROM tmp_persona_tiempo_causa;

DELETE FROM mod_regimentrabajo.in_tipodia;
for v_in_tipodia in 1 .. array_length($6, 1) loop
INSERT INTO mod_regimentrabajo.in_tipodia(id) VALUES ($6[v_in_tipodia]);
end loop;

--por cada causa.
for v_causa in 1 .. array_length($1, 1) loop
	raise notice 'Causa: %',$1[v_causa];
    --por cada persona.
	for v_persona in 1 .. array_length($2, 1) loop
		raise notice 'Persona: %',$2[v_persona];
		--buscar personas implicadas con la causa en cuestión.
		for v_r_asistencia in (select idasistencia, idpersona, idcausa, fecharegistro, fdesde, fhasta, hrsdescontadas, (hrsdescontadas::interval) as tiempo
								, certificadocontinuado as certificadocontinuado, idcargo as idcargo
                                from mod_regimentrabajo.dat_asistencia daf
								where idcausa = $1[v_causa] and idpersona = $2[v_persona] and idcargo = $7[v_persona]) loop  -- and daf.fecharegistro >= $4 and daf.fecharegistro <= $5
                                
			raise notice 'La persona ( % ) tiene registros con la causa ( % ). idasistencia: %',$2[v_persona],$1[v_causa],v_r_asistencia.idasistencia;
			if (v_r_asistencia.idasistencia is null) then
			    raise notice 'v_r_asistencia.idasistencia is null';
			else
				/*if ( (v_r_asistencia.hrsdescontadas is null) or (v_r_asistencia.hrsdescontadas like '') ) then
					--ejecutar proceso con las fechas.
					raise notice 'A incluido la causa ( % ) que no posee horas descontadas',v_r_asistencia.idcausa;                    
			    else*/
					--analizar las fechas del período
                    raise notice 'analizar las fechas';
					if ( (v_r_asistencia.fdesde is not null) and (v_r_asistencia.fhasta is not null) ) then
                    raise notice 'las 2 fechas 4: % , desde asist: % , 5: %',$4, v_r_asistencia.fdesde,$5;
						if ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde = $5)) then
							-- (0) $4 < fdesde = $5
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fdesde) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);
                            --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fdesde) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);
                            raise notice 'CASO DIAS: %',v_contar;
							raise notice 'CASO (0)(fdesde): %',v_calculo_descuento;
						elsif ( ($4 = v_r_asistencia.fhasta) and (v_r_asistencia.fhasta < $5) ) then
							-- (0) $4 = fhasta < $5
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);
							raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (0)(fhasta): %',v_calculo_descuento;														
						elsif ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 <= v_r_asistencia.fhasta) ) then
							-- (1) $4 < fdesde < $5 <= fhasta
							-- calcular nuevo descuento con (fdesde y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);
							raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (1): %',v_calculo_descuento;
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 < $5) and ($5 < v_r_asistencia.fhasta) ) then
							-- (2) fdesde < $4 < $5 < fhasta
							-- calcular nuevo descuento con ($4 y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
							raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (2): %',v_calculo_descuento;
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 <= v_r_asistencia.fhasta) and (v_r_asistencia.fhasta < $5) ) then
							-- (3) fdesde < $4 <= fhasta < $5
							-- calcular nuevo descuento con ($4 y fhasta)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);
							raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (3): %',v_calculo_descuento;
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 < v_r_asistencia.fhasta) and (v_r_asistencia.fhasta = $5) ) then
							-- (4) fdesde < $4 < fhasta = $5
							-- calcular nuevo descuento con ($4 y fhasta)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
							raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (4): %',v_calculo_descuento;
						elsif ( ($4 = v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 <= v_r_asistencia.fhasta) ) then
							-- (5) $4 = fdesde < $5 <= fhasta
							-- calcular nuevo descuento con (fdesde y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
							raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (5): %',v_calculo_descuento;
						elsif ( ($4 = v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 > v_r_asistencia.fhasta) ) then
							-- (5.1) $4 = fdesde < $5 > fhasta
							-- calcular nuevo descuento con (fdesde y fhasta)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
							raise notice 'CASO DIAS: %',v_contar;
                            raise notice 'CASO (5.1): %',v_calculo_descuento;
						else
							-- (6) $4 < fdesde < $5 > fhasta
							if ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 > v_r_asistencia.fhasta) ) then
								select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
								where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
								--contar dias
                                select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
								where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]) and (c.idcargo = $7[v_persona]);						
								raise notice 'CASO DIAS: %',v_contar;
                                raise notice 'CASO (6): %',v_calculo_descuento;							
							end if;
						end if;
						raise notice 'v_suma_descuento:= % + %',v_suma_descuento,v_calculo_descuento;				    
						v_suma_descuento := v_suma_descuento + v_calculo_descuento;
                        --sumar dias contados por causa
                        raise notice 'antes ---> v_suma_dias = %',v_suma_dias;
                        v_suma_dias := v_suma_dias + v_contar;
                        raise notice 'luego ---> v_suma_dias = %',v_suma_dias;
						raise notice 'v_suma_descuento = %',v_suma_descuento;			
						v_calculo_descuento := '00:00:00';
                        v_contar := 0;
					else
						-- (2) fecharegistro ( Ej: ausente, llegada tarde)
						-- RECURSO SELECT to_date('2016-11-14 08:00:00','YY-MM-DD');
						-- raise notice 'La persona ( % ) no tiene registros con la causa ( % ) en FECHAREGISTRO',$2[v_persona],$1[v_causa];
						if ( (v_r_asistencia.fecharegistro is not null) and (v_r_asistencia.fecharegistro >= $4) and (v_r_asistencia.fecharegistro <= $5) ) then
							raise notice 'CASO (fecharegistro), v_calculo_descuento = %',v_calculo_descuento;				    
							v_suma_descuento := v_suma_descuento + v_r_asistencia.tiempo;
                            v_suma_dias := count(v_r_asistencia.idasistencia);
							raise notice 'CASO (fecharegistro), v_r_asistencia.tiempo = %',v_r_asistencia.tiempo;
							raise notice 'CASO (v_suma_descuento) %',v_suma_descuento;
						else
							raise notice 'Fecha de registro fuera del período o no tiene dato registrado.';
						end if;
					end if;
				/*end if;*/
				raise notice 'TUPLA: persona: %, causa: %, suma: %, contdias: %',$2[v_persona],$1[v_causa],v_suma_descuento,v_suma_dias;
                
                
                ----Esto es para los certificados continuados
               /* for v_r_asistenciacert in (select idasistencia,certificadocontinuado as certificadocontinuado
                            from mod_regimentrabajo.dat_asistencia daf
                            where idcausa = $1[v_causa] and idpersona = $2[v_persona] 
                            and daf.fecharegistro >= $4 and daf.fecharegistro <= $5) loop 
                           
                   if(v_r_asistenciacert.certificadocontinuado = 1) then
                      select  MAX(da.fecharegistro) into v_certinicial_date from mod_regimentrabajo.dat_asistencia da
                                  inner join  mod_regimentrabajo.conf_certificados cert on (da.idcausa = cert.idcausa)
                                  where da.certificadocontinuado = 0 and da.idpersona = v_r_asistencia.idpersona and da.idcargo = v_r_asistencia.idpersona;
                      if(v_certinicial_date is not null) then
                          if(EXTRACT(MONTH FROM v_certinicial_date) - 1 = 0) then 
                              v_mes_anterior = 12;  
                              v_anno_anterior = EXTRACT(YEAR FROM v_certinicial_date) - 1;                         
                          else
                              v_mes_anterior = EXTRACT(MONTH FROM v_certinicial_date) - 1;
                              v_anno_anterior = EXTRACT(YEAR FROM v_certinicial_date);
                          end if;                        
                          v_mes_calculo = v_mes_anterior || '/' || v_anno_anterior ;                        
                      end if;
                  end if;
                end loop; */
                
                if(v_r_asistencia.certificadocontinuado = 1) then
                    select  MAX(da.fecharegistro) into v_certinicial_date from mod_regimentrabajo.dat_asistencia da
                                          inner join  mod_regimentrabajo.conf_certificados cert on (da.idcausa = cert.idcausa)
                                          where da.certificadocontinuado = 0 and da.idpersona = v_r_asistencia.idpersona and da.idcargo = v_r_asistencia.idcargo;
                    if(v_certinicial_date is not null) then
                    	if(EXTRACT(MONTH FROM v_certinicial_date) - 1 = 0) then 
                        	v_mes_anterior = 12;  
                            v_anno_anterior = EXTRACT(YEAR FROM v_certinicial_date) - 1;                         
                        else
                            v_mes_anterior = EXTRACT(MONTH FROM v_certinicial_date) - 1;
                            v_anno_anterior = EXTRACT(YEAR FROM v_certinicial_date);
                        end if;
                        
                        v_mes_calculo = v_mes_anterior || '/' || v_anno_anterior ;
                        
                    end if;
                end if;
                
                ----Esto es para los certificados continuados

				INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias, v_mes_calculo,$7[v_persona]);
				v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; v_td_tiempo_causa.tiempo = v_suma_descuento;
				v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00';
                v_suma_dias := 0; v_contar := 0;
				--RETURN NEXT v_td_tiempo_causa;
                v_mes_calculo := null; v_td_tiempo_causa.idcargo = $7[v_persona];
			end if;
		end loop;
		raise notice 'La persona ( % ) NO TIENE registros con la causa ( % )',$2[v_persona],$1[v_causa];
	    INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias,$7[v_persona]);
			    
		v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; 
        v_td_tiempo_causa.tiempo = v_suma_descuento; v_td_tiempo_causa.idcargo = $7[v_persona];
		v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00'; 
        --reiniciar sumador de dias
        v_suma_dias := 0;
		--RETURN NEXT v_td_tiempo_causa;
	end loop;
end loop;

for v_resultado in (select idpersona as idp, idcausa as idc, sum(suma) as sumatoria, sum(dias) as cont_dias, mesyearanterior as mesyearanterior, idcargo as idcargo from tmp_persona_tiempo_causa group by idpersona, idcausa, mesyearanterior,idcargo order by idpersona,idcausa) loop
	v_td_tiempo_causa.idpersona = v_resultado.idp; v_td_tiempo_causa.idcausa = v_resultado.idc; v_td_tiempo_causa.tiempo = v_resultado.sumatoria;
    v_td_tiempo_causa.contdias = v_resultado.cont_dias; v_td_tiempo_causa.mesanteriorcertificado = v_resultado.mesyearanterior; v_td_tiempo_causa.idcargo = v_resultado.idcargo;
	RETURN NEXT v_td_tiempo_causa;
end loop;
   
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

COMMENT ON FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas(p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric [], p_idcargo numeric [])
IS 'SELECT * from mod_regimentrabajo.f_listadopersonastiempocausas( ''{idcausa separados por coma}'', ''{idpersona separados por coma}'', ''{idgrupodescanso separados por coma}'', fecha_i, fecha_f, idtipo);';

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_tiempocausas (
  p_idcausa numeric [],
  p_idpersona numeric [],
  p_idgrupodescanso numeric [],
  p_desde date,
  p_hasta date
)
RETURNS SETOF mod_regimentrabajo.td_persona_tiempo_causa_old AS
$body$
DECLARE
v_causa numeric;
v_persona numeric;

v_calculo_descuento interval := '00:00:00';
v_suma_descuento interval := '00:00:00';

v_r_asistencia record;
v_resultado record;

v_td_tiempo_causa mod_regimentrabajo.td_persona_tiempo_causa;

BEGIN

CREATE TEMP TABLE IF NOT EXISTS tmp_persona_tiempo_causa
(
  idcausa numeric,
  idpersona numeric,
  suma interval
)
WITH (
  OIDS=FALSE
);
ALTER TABLE tmp_persona_tiempo_causa OWNER TO zeolides;
DELETE FROM tmp_persona_tiempo_causa;

--por cada causa.
for v_causa in 1 .. array_length($1, 1) loop
	raise notice 'Causa: %',$1[v_causa];
	--por cada persona.
	for v_persona in 1 .. array_length($2, 1) loop
		raise notice 'Persona: %',$2[v_persona];
		--buscar personas implicadas con la causa en cuestión.
		for v_r_asistencia in (select idasistencia, idpersona, idcausa, fecharegistro, fdesde, fhasta, hrsdescontadas, (hrsdescontadas::interval) as tiempo
								from mod_regimentrabajo.dat_asistencia
								where idcausa = $1[v_causa] and idpersona = $2[v_persona]) loop
			raise notice 'La persona ( % ) tiene registros con la causa ( % ). idasistencia: %',$2[v_persona],$1[v_causa],v_r_asistencia.idasistencia;
			if (v_r_asistencia.idasistencia is null) then
			    raise notice 'v_r_asistencia.idasistencia is null';
			else
				raise notice 'La persona ( % ) tiene registros con la causa ( % )',$2[v_persona],$1[v_causa];
				if ( (v_r_asistencia.hrsdescontadas is null) or (v_r_asistencia.hrsdescontadas like '') ) then
					--ejecutar proceso con las fechas.
					raise notice 'A incluido la causa ( % ) que no posee horas descontadas',v_r_asistencia.idcausa;
			    else
					--analizar las fechas del período
					if ( (v_r_asistencia.fdesde is not null) and (v_r_asistencia.fhasta is not null) ) then
						if ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde = $5)) then
							-- (0) $4 < fdesde = $5
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendario c where (c.fecha = v_r_asistencia.fdesde) and (c.idgrupodescanso = $3[v_persona]);
							raise notice 'CASO (0)(fdesde): %',v_calculo_descuento;
						elsif ( ($4 = v_r_asistencia.fhasta) and (v_r_asistencia.fhasta < $5) ) then
							-- (0) $4 = fhasta < $5
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendario c where (c.fecha = v_r_asistencia.fhasta) and (c.idgrupodescanso = $3[v_persona]);
							raise notice 'CASO (0)(fhasta): %',v_calculo_descuento;														
						elsif ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 < v_r_asistencia.fhasta) ) then
							-- (1) $4 < fdesde < $5 < fhasta
							-- calcular nuevo descuento con (fdesde y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendario c where (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idgrupodescanso = $3[v_persona]);
							raise notice 'CASO (1): %',v_calculo_descuento;
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 < $5) and ($5 < v_r_asistencia.fhasta) ) then
							-- (2) fdesde < $4 < $5 < fhasta
							-- calcular nuevo descuento con ($4 y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendario c where (c.fecha >= $4) and (c.fecha <= $5) and (c.idgrupodescanso = $3[v_persona]);						
							raise notice 'CASO (2): %',v_calculo_descuento;
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 < v_r_asistencia.fhasta) and (v_r_asistencia.fhasta < $5) ) then
							-- (3) fdesde < $4 < fhasta < $5
							-- calcular nuevo descuento con ($4 y fhasta)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendario c where (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idgrupodescanso = $3[v_persona]);
							raise notice 'CASO (3): %',v_calculo_descuento;
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 < v_r_asistencia.fhasta) and (v_r_asistencia.fhasta = $5) ) then
							-- (4) fdesde < $4 < fhasta = $5
							-- calcular nuevo descuento con ($4 y fhasta)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendario c where (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idgrupodescanso = $3[v_persona]);						
							raise notice 'CASO (4): %',v_calculo_descuento;
						elsif ( ($4 = v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 < v_r_asistencia.fhasta) ) then
							-- (5) $4 = fdesde < $5 < fhasta
							-- calcular nuevo descuento con (fdesde y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendario c where (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idgrupodescanso = $3[v_persona]);						
							raise notice 'CASO (5): %',v_calculo_descuento;
						else
							-- (6) $4 < fdesde < $5 > fhasta
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendario c where (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idgrupodescanso = $3[v_persona]);						
							raise notice 'CASO (6): %',v_calculo_descuento;
						end if;
						raise notice 'v_suma_descuento:= % + %',v_suma_descuento,v_calculo_descuento;				    
						v_suma_descuento := v_suma_descuento + v_calculo_descuento;
						raise notice 'v_suma_descuento = %',v_suma_descuento;			
						v_calculo_descuento := '00:00:00';
					else
						-- (2) fecharegistro ( Ej: ausente, llegada tarde)
						-- RECURSO SELECT to_date('2016-11-14 08:00:00','YY-MM-DD');
						raise notice 'La persona ( % ) no tiene registros con la causa ( % ) en FECHAREGISTRO',$2[v_persona],$1[v_causa];
						if ( (v_r_asistencia.fecharegistro is not null) and (v_r_asistencia.fecharegistro >= $4) and (v_r_asistencia.fecharegistro <= $5) ) then
							raise notice 'CASO (fecharegistro), v_calculo_descuento = %',v_calculo_descuento;				    
							v_suma_descuento := v_suma_descuento + v_r_asistencia.tiempo;
							raise notice 'CASO (fecharegistro), v_r_asistencia.tiempo = %',v_r_asistencia.tiempo;
							raise notice 'CASO (v_suma_descuento) %',v_suma_descuento;
						else
							raise notice 'Fecha de registro fuera del período o no tiene dato registrado.';
						end if;
					end if;
				end if;
				raise notice 'TUPLA: persona: %, causa: %, suma: %',$2[v_persona],$1[v_causa],v_suma_descuento;

				INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento);
				v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; v_td_tiempo_causa.tiempo = v_suma_descuento;
				v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00';
				--RETURN NEXT v_td_tiempo_causa;
			end if;
		end loop;
		raise notice 'La persona ( % ) NO TIENE registros con la causa ( % )',$2[v_persona],$1[v_causa];
	        INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento);
			    
		v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; v_td_tiempo_causa.tiempo = v_suma_descuento;
		v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00';
		--RETURN NEXT v_td_tiempo_causa;
	end loop;
end loop;

for v_resultado in (select idpersona as idp, idcausa as idc, sum(suma) as sumatoria from tmp_persona_tiempo_causa group by idpersona, idcausa order by idpersona,idcausa) loop
	v_td_tiempo_causa.idpersona = v_resultado.idp; v_td_tiempo_causa.idcausa = v_resultado.idc; v_td_tiempo_causa.tiempo = v_resultado.sumatoria;
	RETURN NEXT v_td_tiempo_causa;
end loop;
   
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

COMMENT ON FUNCTION mod_regimentrabajo.f_tiempocausas(p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date)
IS 'SELECT * from mod_regimentrabajo.f_listadopersonastiempocausas( ''{idcausa separados por coma}'', ''{idpersona separados por coma}'', ''{idgrupodescanso separados por coma}'', fecha_i, fecha_f);';

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ADD COLUMN fdesde date;
--update
update mod_regimentrabajo.dat_asistenciamensual set fdesde = now()::date where fdesde is null;
ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ALTER COLUMN fdesde SET NOT NULL;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ADD COLUMN fhasta date;
--update
update mod_regimentrabajo.dat_asistenciamensual set fhasta = now()::date where fhasta is null;--dato no validado
ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ALTER COLUMN fhasta SET NOT NULL;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  ADD COLUMN asistencia VARCHAR;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ADD COLUMN apa varchar;
--update
update mod_regimentrabajo.dat_asistenciamensual set apa = '' where apa is null; --dato no validado
ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ALTER COLUMN apa SET NOT NULL;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ADD COLUMN idestructura NUMERIC(19,0);
--update
update mod_regimentrabajo.dat_asistenciamensual set idestructura = 1 where idestructura is null;--dato no validado
ALTER TABLE mod_regimentrabajo.dat_asistenciamensual ALTER COLUMN idestructura SET NOT NULL;

CREATE TABLE mod_regimentrabajo.conf_calendariopersona (
  idcalendariopersona NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_conf_calendariopersona_seq'::regclass) NOT NULL,
  fecha DATE NOT NULL,
  idturnotrabajo NUMERIC(19,0),
  idpersona NUMERIC(19,0) NOT NULL,
  horas TIME WITHOUT TIME ZONE,
  idtipodedia NUMERIC(19,0) NOT NULL,
  idcargo NUMERIC(19,0),
  CONSTRAINT conf_calendariopersona_pkey PRIMARY KEY(idcalendariopersona)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_calendariopersona
  ALTER COLUMN idcalendariopersona SET STATISTICS 0;

ALTER TABLE mod_regimentrabajo.conf_calendariopersona
  ALTER COLUMN fecha SET STATISTICS 0;

ALTER TABLE mod_regimentrabajo.conf_calendariopersona
  ALTER COLUMN idturnotrabajo SET STATISTICS 0;

ALTER TABLE mod_regimentrabajo.conf_calendariopersona
  ALTER COLUMN idpersona SET STATISTICS 0;

ALTER TABLE mod_regimentrabajo.conf_calendariopersona
  ALTER COLUMN horas SET STATISTICS 0;

COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idcalendariopersona
IS 'Identificador de la tabla';

COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.fecha
IS 'Fecha planificada';

COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idturnotrabajo
IS 'Identificador del turno de trabajo';

COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idpersona
IS 'Identificador de la persona';

COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.horas
IS 'Horas de trabajo en la fecha';

COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idtipodedia
IS 'Identificador de tipo de dia que se planifica';

COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idcargo
IS 'Identificador del cargo que tiene la persona en esta planificación.';

CREATE INDEX conf_calendariopersona_fecha_idx ON mod_regimentrabajo.conf_calendariopersona
  USING btree (fecha);

CREATE INDEX conf_calendariopersona_idpersona_fecha_idx ON mod_regimentrabajo.conf_calendariopersona
  USING btree (idpersona, fecha, idcargo);

CREATE INDEX conf_calendariopersona_idpersona_idx ON mod_regimentrabajo.conf_calendariopersona
  USING btree (idpersona);

CREATE UNIQUE INDEX conf_calendariopersona_unique_idpersona_fecha_idcargo_idx ON mod_regimentrabajo.conf_calendariopersona
  USING btree (idpersona, fecha, idcargo);

CREATE TABLE mod_regimentrabajo.conf_categoriacausas (
  idcategoriacausa NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_categoriacausas_seq'::regclass) NOT NULL,
  idcategoria NUMERIC(19,1) NOT NULL,
  idcausa NUMERIC(19,1) NOT NULL,
  CONSTRAINT conf_categoriacausas_pkey PRIMARY KEY(idcategoriacausa)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_certificados (
  id NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_conf_certificados'::regclass),
  idcausa NUMERIC(19,0)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_certificados
  ALTER COLUMN id SET STATISTICS 0;

ALTER TABLE mod_regimentrabajo.conf_certificados
  ALTER COLUMN idcausa SET STATISTICS 0;

CREATE TABLE mod_regimentrabajo.conf_conceptocausas (
  idconceptocausa NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_conceptocausas_seq'::regclass) NOT NULL,
  idcausa NUMERIC(19,1) NOT NULL,
  CONSTRAINT conf_conceptocausas_pkey PRIMARY KEY(idconceptocausa)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_estructurahorario (
  idestructurahorario NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_conf_estructurahorario_seq'::regclass) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_estructurahorario_pkey PRIMARY KEY(idestructurahorario)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_estructurareloj (
  idestructurareloj NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_estructurareloj_seq'::regclass) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  dirserver VARCHAR(19) NOT NULL,
  nombredb VARCHAR(19) NOT NULL,
  usuario VARCHAR(19) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  CONSTRAINT conf_estructurareloj_pkey PRIMARY KEY(idestructurareloj)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_estructuras (
  id NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_conf_estructuras_seq'::regclass) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  idpadre NUMERIC(19,0) NOT NULL,
  CONSTRAINT conf_estructuras_dat_habcausa_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_estructuratempus (
  idestructuratempus NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_conf_estructuratempus_seq'::regclass) NOT NULL,
  idestructura NUMERIC(19,0) NOT NULL,
  dirapp VARCHAR(100) NOT NULL,
  CONSTRAINT conf_estructuratempus_pkey PRIMARY KEY(idestructuratempus)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_fondodetiempo (
  id NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_fondodetiempo_seq'::regclass) NOT NULL,
  idcategoria NUMERIC(19,1) NOT NULL,
  fondodetiempo NUMERIC(19,1) NOT NULL,
  CONSTRAINT conf_fondodetiempo_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN horasextras VARCHAR(8);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN idpersonacontrola NUMERIC(19,0);

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonacontrola
IS 'Id del usuario que controla la asistencia';

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN actualizado NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.actualizado
IS '0-No actualizado desde control de acceso
1-Actualizado desde control de acceso';

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN fhabilitado NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fhabilitado
IS 'indica si el dia fue 
feriado y habilitado para la persona';

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN hferiadas VARCHAR(8);

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.hferiadas
IS 'cantidad de horas feriadas habilitadas trabajadas';

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN idcargo NUMERIC(19,0);

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idcargo
IS 'Identificador del cargo.';

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN idpersonamodifica NUMERIC(19,0);

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonamodifica
IS 'Id del usuario que modifica la asistencia';

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN certificado NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN idpersonacertifica NUMERIC(19,0);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN hrstrabajadas VARCHAR(8) DEFAULT '00:00:00'::time without time zone;

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN idgrupodescanso NUMERIC(19,0);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN idturnotrabajo NUMERIC(19,0);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN aprobado NUMERIC(1,0);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN idpersonaaprueba NUMERIC(19,0);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN certificadocontinuado NUMERIC(19,0);

--delete
delete from mod_regimentrabajo.dat_estructuraasistencia 
where idpersona not in (select idpersona from mod_persona.dat_persona);
--update
update mod_regimentrabajo.dat_estructuraasistencia set idcargo = 1 where idcargo is null;--dato no validado (las personas asociades en estejuego de datos no existen)
ALTER TABLE mod_regimentrabajo.dat_estructuraasistencia ALTER COLUMN idcargo SET NOT NULL;

CREATE TABLE mod_regimentrabajo.dat_registro (
  idregistro NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_dat_registro_seq'::regclass) NOT NULL,
  fechahoraentrada TIMESTAMP WITHOUT TIME ZONE,
  idpersona NUMERIC(19,0) NOT NULL,
  fechahorasalida TIMESTAMP WITHOUT TIME ZONE,
  fecharegistro DATE NOT NULL,
  idcargo NUMERIC(19,0),
  CONSTRAINT dat_registro_idx UNIQUE(idpersona, fecharegistro),
  CONSTRAINT dat_registro_pkey PRIMARY KEY(idregistro)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_regimentrabajo.dat_registro.idcargo
IS 'Identificador del cargo.';

CREATE INDEX dat_registro_idx_asistencia_idpersona ON mod_regimentrabajo.dat_registro
  USING btree (idpersona);

CREATE TABLE mod_regimentrabajo.dat_diaferiadohabilitado (
  iddiaferiadohabilitado NUMERIC DEFAULT nextval('mod_regimentrabajo.sec_diaferiadohabilitado_seq'::regclass) NOT NULL,
  fecha DATE NOT NULL,
  idpersona NUMERIC(19,1) NOT NULL,
  horas INTERVAL(6),
  idcargo NUMERIC(19,0),
  CONSTRAINT dat_diaferiadohabilitado_pkey PRIMARY KEY(iddiaferiadohabilitado)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.nom_horarionocturnidad (
  idhorarionocturnidad NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_horarionocturnidad_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  horainicio TIME WITHOUT TIME ZONE NOT NULL,
  horafin TIME WITHOUT TIME ZONE NOT NULL,
  CONSTRAINT nom_horarionocturnidad_pkey PRIMARY KEY(idhorarionocturnidad)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_regimentrabajo.nom_causa.eliminar
IS '1  No eliminar
0  Eliminar';

ALTER TABLE mod_regimentrabajo.nom_causa
  ALTER COLUMN eliminar SET DEFAULT 1;

ALTER TABLE mod_regimentrabajo.nom_causa
  ALTER COLUMN afectasalario SET DEFAULT NULL::numeric;

ALTER TABLE mod_regimentrabajo.nom_causa
  ALTER COLUMN afectasalario DROP NOT NULL;

ALTER TABLE mod_regimentrabajo.nom_causa
  ADD COLUMN cantincidencias NUMERIC(2,0);

COMMENT ON COLUMN mod_regimentrabajo.nom_causa.cantincidencias
IS 'Cantidad de incidencias de la causa en el periodo configurado en el sistema';

ALTER TABLE mod_regimentrabajo.nom_causa
  ADD COLUMN modifica NUMERIC(1,0) DEFAULT 0;

CREATE TABLE mod_regimentrabajo.dat_periodomes (
  idperiodomes NUMERIC DEFAULT nextval('mod_regimentrabajo.sec_periodomes_seq'::regclass) NOT NULL,
  anno NUMERIC(4,0),
  mes NUMERIC(2,0),
  fdesde DATE,
  fhasta DATE,
  CONSTRAINT dat_periodomes_pkey PRIMARY KEY(idperiodomes)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.dat_periodoquincena (
  idperiodoquincena NUMERIC DEFAULT nextval('mod_regimentrabajo.sec_periodoquincena_seq'::regclass) NOT NULL,
  anno NUMERIC(4,0),
  mes NUMERIC(2,0),
  fdesdeprimquincena DATE,
  fhastaprimquincena DATE,
  fdesdesegquincena DATE,
  fhastasegquincena DATE,
  CONSTRAINT dat_periodoquincena_pkey PRIMARY KEY(idperiodoquincena)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.dat_planvacaciones (
  idplanvacaciones NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_planvacaciones_seq'::regclass) NOT NULL,
  mes NUMERIC(2,0),
  priquincena NUMERIC(19,0),
  segquincena NUMERIC(19,0),
  idpersona NUMERIC(19,0) NOT NULL,
  anno NUMERIC(4,0) NOT NULL,
  idcargo NUMERIC(19,0),
  CONSTRAINT pk_planvacaciones PRIMARY KEY(idplanvacaciones)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.nom_regimentrabajo
  ALTER COLUMN fondotiempo TYPE NUMERIC(5,1);

ALTER TABLE mod_regimentrabajo.nom_regimentrabajo
  ADD COLUMN tipofondotiempo NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_regimentrabajo.nom_regimentrabajo.tipofondotiempo
IS 'Tipo de calculo para el fondo de tiempo:
1-tiempo laborable real del mes
2-tiempo fijo
3-promedio anual del tiempo laborable';

ALTER TABLE mod_regimentrabajo.nom_regimentrabajo
  ADD COLUMN diaslaborables NUMERIC(2,0);

COMMENT ON COLUMN mod_regimentrabajo.nom_regimentrabajo.diaslaborables
IS 'dias laborabls del regimen de trabajo';

CREATE TABLE mod_regimentrabajo.dat_registromodelovac (
  idregistromodelovac NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_registromodelovac_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idcargo NUMERIC(19,0),
  idarea NUMERIC(19,0),
  anno NUMERIC(4,0) NOT NULL,
  fecha DATE DEFAULT 'now'::text::date NOT NULL
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.nom_tipodedia
  ADD COLUMN abreviatura VARCHAR(3);

ALTER TABLE mod_regimentrabajo.nom_tipodedia
  ADD COLUMN feriado NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_regimentrabajo.nom_tipodedia.feriado
IS 'Indica si el tipo de dia es feriado o no:
0- No es feriado
1- Feriado';

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN toleranciaentrada TYPE TIME WITHOUT TIME ZONE
  using '00:00:00'::time without time zone;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN toleranciaentrada SET DEFAULT '00:00:00'::time without time zone;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN toleranciaentrada SET STORAGE PLAIN;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN toleranciasalida TYPE TIME WITHOUT TIME ZONE
  using '00:00:00'::time without time zone;
  
ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN toleranciasalida SET DEFAULT '00:00:00'::time without time zone;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN toleranciasalida SET STORAGE PLAIN;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN tiempodescanso TYPE TIME(0) WITHOUT TIME ZONE
  using '00:00:00'::time without time zone;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN tiempodescanso SET STORAGE PLAIN;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ADD COLUMN horaentradaps TIME WITHOUT TIME ZONE;

COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horaentradaps
IS 'Hora de entrada de la primera sesion de trabajo';

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ADD COLUMN horasalidaps TIME WITHOUT TIME ZONE;

COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horasalidaps
IS 'Hora de salida de la primera sesion de trabajo';

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ADD COLUMN horaentradass TIME WITHOUT TIME ZONE;

COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horaentradass
IS 'Hora de entrada de la segunda sesion de trabajo';

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ADD COLUMN horasalidass TIME WITHOUT TIME ZONE;

COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horasalidass
IS 'Hora de salida de la segunda sesion de trabajo';

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ADD COLUMN otrodia NUMERIC(1,0) DEFAULT 0;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ADD COLUMN horas VARCHAR(50);

CREATE OR REPLACE VIEW mod_regimentrabajo.vista_asistencia_mensual (
    idasistencia,
    fechahoraentrada,
    idcausa,
    fdesde,
    fhasta,
    hrsdescontadas,
    idpersona,
    fechahorasalida,
    fecharegistro,
    observacion,
    idpadre,
    horasextras,
    idpersonacontrola,
    actualizado,
    fhabilitado,
    hferiadas,
    idcargo,
    idpersonamodifica,
    certificado,
    idpersonacertifica,
    hrstrabajadas,
    idgrupodescanso,
    idturnotrabajo)
AS
 SELECT a.idasistencia,
    a.fechahoraentrada,
    a.idcausa,
    a.fdesde,
    a.fhasta,
    a.hrsdescontadas,
    a.idpersona,
    a.fechahorasalida,
    a.fecharegistro,
    a.observacion,
    a.idpadre,
    a.horasextras,
    a.idpersonacontrola,
    a.actualizado,
    a.fhabilitado,
    a.hferiadas,
    a.idcargo,
    a.idpersonamodifica,
    a.certificado,
    a.idpersonacertifica,
    a.hrstrabajadas,
    a.idgrupodescanso,
    a.idturnotrabajo
   FROM mod_regimentrabajo.dat_asistencia a
  WHERE a.fecharegistro >= '2018-09-01'::date AND a.fecharegistro <= '2018-09-30'::date;

CREATE TABLE mod_regimentrabajo.dat_asistenciasesion (
  idasistenciasesion NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_asistenciasesion_seq'::regclass) NOT NULL,
  idasistencia NUMERIC(19,0) NOT NULL,
  idsesion NUMERIC(1,0) NOT NULL,
  fechahoraentrada TIMESTAMP WITHOUT TIME ZONE,
  fechahorasalida TIMESTAMP WITHOUT TIME ZONE,
  idcausa NUMERIC(19,0),
  hrsdescontadas VARCHAR(8),
  horasextras VARCHAR(8),
  CONSTRAINT pk_asistenciasesion PRIMARY KEY(idasistenciasesion)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.idsesion
IS '0 - primera sesion
1 - segunda sesion';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.idcausa
IS 'Causa de la sesion';

ALTER TABLE mod_regimentrabajo.nom_grupodescanso
  ADD COLUMN idestructura NUMERIC(19,0);

CREATE TABLE mod_regimentrabajo.nom_turnosesion (
  idturnosesion NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_turnosesion_seq'::regclass) NOT NULL,
  idturnotrabajo NUMERIC(19,0) NOT NULL,
  idsesion NUMERIC(1,0) NOT NULL,
  horainicio TIME WITHOUT TIME ZONE,
  horafin TIME WITHOUT TIME ZONE,
  CONSTRAINT pk_turnosesion PRIMARY KEY(idturnosesion)
) 
WITH (oids = false);

ALTER TABLE mod_regimentrabajo.conf_calendario
  ALTER COLUMN horas TYPE TIME WITHOUT TIME ZONE
  using '00:00:00'::time without time zone;

ALTER TABLE mod_regimentrabajo.conf_calendario
  ALTER COLUMN horas SET STORAGE PLAIN;

ALTER TABLE mod_regimentrabajo.conf_calendario
  ADD COLUMN idturnotrabajo NUMERIC(19,0);

CREATE INDEX fki_indicador_baseporindicador_idindicador ON mod_regimentrabajo.dat_baseporindicador
  USING btree (idindicador);

CREATE INDEX idx_dat_asistencia_idturnotrabajo ON mod_regimentrabajo.dat_asistencia
  USING btree (idturnotrabajo);

CREATE INDEX idx_dat_asistencia_idpersonamodifica ON mod_regimentrabajo.dat_asistencia
  USING btree (idpersonamodifica);

CREATE INDEX idx_dat_asistencia_idpersonacontrola ON mod_regimentrabajo.dat_asistencia
  USING btree (idpersonacontrola);

CREATE INDEX idx_dat_asistencia_idpersonacertifica ON mod_regimentrabajo.dat_asistencia
  USING btree (idpersonacertifica);

CREATE INDEX idx_dat_asistencia_idpersonaaprueba ON mod_regimentrabajo.dat_asistencia
  USING btree (idpersonaaprueba);

CREATE INDEX idx_dat_asistencia_idcargo ON mod_regimentrabajo.dat_asistencia
  USING btree (idcargo);

CREATE INDEX idx_dat_asistencia_fhasta ON mod_regimentrabajo.dat_asistencia
  USING btree (fhasta);

CREATE INDEX idx_dat_asistencia_fecharegistro ON mod_regimentrabajo.dat_asistencia
  USING btree (fecharegistro);

CREATE INDEX idx_dat_asistencia_fechahorasalida ON mod_regimentrabajo.dat_asistencia
  USING btree (fechahorasalida);

CREATE INDEX idx_dat_asistencia_fdesde ON mod_regimentrabajo.dat_asistencia
  USING btree (fdesde);

CREATE INDEX idx_dat_asistencia_actualizado ON mod_regimentrabajo.dat_asistencia
  USING btree (actualizado);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD CONSTRAINT dat_asistencia_idx 
    UNIQUE (idpersona, fecharegistro) NOT DEFERRABLE;

CREATE INDEX fki_turnotrabajo_calendario ON mod_regimentrabajo.conf_calendario
  USING btree (idturnotrabajo);

ALTER TABLE mod_regimentrabajo.nom_turnosesion
  ADD CONSTRAINT fk_trunotrabajo_turnosesion_idturnotrabajo FOREIGN KEY (idturnotrabajo)
    REFERENCES mod_regimentrabajo.nom_turnotrabajo(idturnotrabajo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_planvacaciones
  ADD CONSTRAINT fk_persona_planvacaciones_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_estructuraasistencia
  ADD CONSTRAINT fk_persona_estructuraasistencia_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_diaferiadohabilitado
  ADD CONSTRAINT fk_persona_diaferiadohabilitado_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_baseporindicador
  ADD CONSTRAINT fk_indicador_baseporindicador_idindicador FOREIGN KEY (idindicador)
    REFERENCES mod_regimentrabajo.dat_indicador(idindicador)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_asistenciasesion
  ADD CONSTRAINT dat_asistenciasesion_fk FOREIGN KEY (idcausa)
    REFERENCES mod_regimentrabajo.nom_causa(idcausa)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_asistenciasesion
  ADD CONSTRAINT fk_asistencia_asistenciasesion_idasistencia FOREIGN KEY (idasistencia)
    REFERENCES mod_regimentrabajo.dat_asistencia(idasistencia)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD CONSTRAINT fk_persona_asistencia_idpersonamodifica FOREIGN KEY (idpersonamodifica)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD CONSTRAINT fk_persona_asistencia_idpersonacontrola FOREIGN KEY (idpersonacontrola)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD CONSTRAINT fk_persona_asistencia_idpersonacertifica FOREIGN KEY (idpersonacertifica)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

--delete si no existen las persona
delete from mod_regimentrabajo.dat_asistencia
where idpersona not in (select idpersona from mod_persona.dat_persona);
ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD CONSTRAINT fk_persona_asistencia_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD CONSTRAINT fk_filaestruc_asistencia_idcargo FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.conf_calendario
  ADD CONSTRAINT fk_turnotrabajo_calendario FOREIGN KEY (idturnotrabajo)
    REFERENCES mod_regimentrabajo.nom_turnotrabajo(idturnotrabajo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    DEFERRABLE
    INITIALLY DEFERRED;

CREATE TRIGGER t_cerrar_asistencia_incompleta
  AFTER UPDATE OF certificado 
  ON mod_regimentrabajo.dat_asistencia
  
FOR EACH ROW 
  WHEN (new.certificado = 1::numeric)
EXECUTE PROCEDURE mod_regimentrabajo.ft_certificar_asistencia();

COMMENT ON TRIGGER t_cerrar_asistencia_incompleta ON mod_regimentrabajo.dat_asistencia
IS 'cuando la columna certificado tome valor 1 verificar si :
en el caso de que se trabaje por sesiones(conf_habilitarsesiones)
    verificar en dat_asistencia que no tenga idcausa, desde y hasta,
    de no tener se verifica en dat_asistenciasesion que
        -no tengas en las sesiones las 2 horas o
        -no tenga causa y no tenga hora.
        -tenga causa y una hora
        -tenga una sola hora y no tenga causa
    De cumplirse alguna estas condiciones poner en cada sesion que cumpla con
    las condiciones la causa con id = 2 (no gestionable) y segun sea la sesion
        -si es la sesion 0 restar horasalidaps - horaentradaps de la tabla nom_turnotrabajo
        -si es la sesion 1 restar horasalidass - horaentradass de la tabla nom_turnotrabajo
    el turno de la persona se encuentra registrado en la tabla dat_regimentrabajo de mod_personaext';

CREATE TRIGGER t_actualizar_horas
  AFTER INSERT OR UPDATE OF horainicio, horafin, tiempodescanso 
  ON mod_regimentrabajo.nom_turnotrabajo
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_regimentrabajo.ft_actualizar_horas_turnotrabajo();

