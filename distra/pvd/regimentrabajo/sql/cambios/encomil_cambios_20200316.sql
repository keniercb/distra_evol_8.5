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
COST 1;

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
COST 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_calendario_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_calendario_distra".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_estructuras_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_estructuras".';

ALTER SEQUENCE mod_regimentrabajo.sec_registromodelovac_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1 NO CYCLE;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  ADD COLUMN fdesde DATE NOT NULL;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  ADD COLUMN fhasta DATE NOT NULL;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  ADD COLUMN asistencia VARCHAR NOT NULL;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  ADD COLUMN apa VARCHAR NOT NULL;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  ADD COLUMN idestructura NUMERIC(19,0) NOT NULL;

ALTER TABLE mod_regimentrabajo.conf_calendariopersona SET WITHOUT CLUSTER;
--<ALTER TYPE>
ALTER TABLE mod_regimentrabajo.dat_asistencia ALTER COLUMN hrstrabajadas TYPE character varying USING hrstrabajadas::character varying;
UPDATE mod_regimentrabajo.dat_asistencia SET hrstrabajadas = '00:00:00'::time without time zone WHERE hrstrabajadas IS NULL;

ALTER TABLE mod_regimentrabajo.dat_asistencia ALTER COLUMN hrstrabajadas TYPE time without time zone USING hrstrabajadas::time without time zone;
UPDATE mod_regimentrabajo.dat_asistencia SET hrstrabajadas = '00:00:00'::time without time zone WHERE hrstrabajadas IS NULL;

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ALTER COLUMN hrstrabajadas SET DEFAULT '00:00:00'::time without time zone;
--</ALTER TYPE>
CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_obtenerhijos_recursivo (
  identificador numeric
)
RETURNS SETOF mod_regimentrabajo.dat_estructuraasistencia AS
$body$
DECLARE
temporal record;
BEGIN
SET search_path = 'mod_regimentrabajo';

FOR temporal IN EXECUTE 'WITH RECURSIVE temporal AS
(

SELECT x.* FROM dat_estructuraasistencia x WHERE x.idestructuraasistencia = '||identificador|| '
UNION SELECT f.* FROM dat_estructuraasistencia f 
join temporal t on t.idestructuraasistencia = f.idpadre)
SELECT * FROM temporal;' LOOP
	            -- z WHERE z.idestructuraasistencia <> '||identificador||'   		
return next temporal;
--SELECT f.* FROM dat_estructuraasistencia AS f, temporal AS t
--WHERE f.idestructuraasistencia = t.idpadre AND f.idestructuraasistencia <> f.idpadre
END LOOP;

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_obtenerpadre_recursivo (
  identificador numeric
)
RETURNS SETOF mod_regimentrabajo.dat_estructuraasistencia AS
$body$
DECLARE
temporal record;
BEGIN
SET search_path = 'mod_regimentrabajo';

FOR temporal IN EXECUTE 'WITH RECURSIVE temporal AS
(
SELECT x.* FROM dat_estructuraasistencia x WHERE x.idestructuraasistencia = '||identificador|| '
UNION SELECT f.* FROM dat_estructuraasistencia f 
join temporal t on t.idpadre = f.idestructuraasistencia
)
SELECT * FROM temporal z WHERE z.idestructuraasistencia <> '||identificador|| ';' LOOP

return next temporal;
--SELECT f.* FROM dat_estructuraasistencia AS f, temporal AS t
--WHERE f.idestructuraasistencia = t.idpadre AND f.idestructuraasistencia <> f.idpadre
END LOOP;

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;