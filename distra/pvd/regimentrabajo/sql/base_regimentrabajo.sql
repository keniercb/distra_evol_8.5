--<Schema>
-- Created By : ScriptSplitGenerador
-- Code: http://10.12.170.129:9880/ch_regimentrabajo/trunk/lineabase
-- Only Schema
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
CREATE SCHEMA mod_regimentrabajo;
COMMENT ON SCHEMA mod_regimentrabajo IS 'Agrupa los datos del componente régimen de trabajo. Versión 1. (RRHH)';
SET search_path = mod_regimentrabajo, pg_catalog;
CREATE TYPE td_persona_tiempo_causa AS (
	idpersona numeric,
	idcausa numeric,
	tiempo interval,
	contdias numeric
);
CREATE TYPE td_persona_tiempo_causa_old AS (
	idpersona numeric,
	idcausa numeric,
	tiempo interval
);
CREATE FUNCTION f_actualizar_confcalendariopersona() RETURNS boolean
    LANGUAGE plpgsql COST 1000000
    AS $$
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
$$;
CREATE FUNCTION f_actualizar_confcalendariopersona(p_year_a_planificar numeric) RETURNS boolean
    LANGUAGE plpgsql COST 1
    AS $_$
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
$_$;
CREATE FUNCTION f_actualizar_trt() RETURNS boolean
    LANGUAGE plpgsql COST 1000000
    AS $$
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
execute consulta;
r := true;
end loop;
RETURN r;
END;
$$;
CREATE FUNCTION f_cambiargrupoasistencia() RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
execute consulta;
r := true;
end loop;
RETURN r;
END;
$$;
CREATE FUNCTION f_cambiarturnoasistencia() RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
execute consulta;
r := true;
end if;
end loop;
RETURN r;
END;
$$;
CREATE FUNCTION f_eliminarduplicados_confcalendariopersona() RETURNS boolean
    LANGUAGE plpgsql COST 1
    AS $$
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
v_cont :=0;
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
SELECT count(*) into v_cont FROM mod_regimentrabajo.tmp_duplicadoscalendario WHERE fecha_persona=duplicados.fidp;
if( v_cont = 0) then
raise notice 'insertar C: % ',v_cont;
raise notice 'INSERT 1: fecha: % , idcp: %',duplicados.fidp, duplicados.idcp;
INSERT INTO mod_regimentrabajo.tmp_duplicadoscalendario(fecha_persona, idcalendariopersona,actual) VALUES (duplicados.fidp, duplicados.idcp,1);
else
raise notice 'actualizar C: % ',v_cont;
raise notice 'idcp: % en fecha: %', duplicados.idcp , duplicados.fidp;
UPDATE mod_regimentrabajo.tmp_duplicadoscalendario SET actual = 0 WHERE fecha_persona = duplicados.fidp;
raise notice 'actualizar ejecutado';
raise notice 'INSERT 2: fecha: % , idcp: %',duplicados.fidp, duplicados.idcp;
INSERT INTO mod_regimentrabajo.tmp_duplicadoscalendario(fecha_persona, idcalendariopersona,actual) VALUES (duplicados.fidp, duplicados.idcp,1);
end if;
end loop;				
end loop;
RETURN r;
END;
$$;
CREATE FUNCTION f_listadopersonastiempocausas(p_idcausa numeric[], p_idpersona numeric[], p_idgrupodescanso numeric[], p_desde date, p_hasta date, p_tipodia numeric[]) RETURNS SETOF td_persona_tiempo_causa
    LANGUAGE plpgsql
    AS $_$
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
BEGIN
CREATE TEMP TABLE IF NOT EXISTS tmp_persona_tiempo_causa
(
  idcausa numeric,
  idpersona numeric,
  suma interval,
  dias numeric
)
WITH (
  OIDS=FALSE
);
DELETE FROM tmp_persona_tiempo_causa;
DELETE FROM mod_regimentrabajo.in_tipodia;
for v_in_tipodia in 1 .. array_length($6, 1) loop
INSERT INTO mod_regimentrabajo.in_tipodia(id) VALUES ($6[v_in_tipodia]);
end loop;
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
							raise notice 'Fecha de registro fuera del período o no tiene dato registrado.';
						end if;
					end if;
				/*end if;*/
				raise notice 'TUPLA: persona: %, causa: %, suma: %, contdias: %',$2[v_persona],$1[v_causa],v_suma_descuento,v_suma_dias;
				INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias);
				v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; v_td_tiempo_causa.tiempo = v_suma_descuento;
				v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00';
                v_suma_dias := 0; v_contar := 0;
				--RETURN NEXT v_td_tiempo_causa;
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
for v_resultado in (select idpersona as idp, idcausa as idc, sum(suma) as sumatoria, sum(dias) as cont_dias from tmp_persona_tiempo_causa group by idpersona, idcausa order by idpersona,idcausa) loop
	v_td_tiempo_causa.idpersona = v_resultado.idp; v_td_tiempo_causa.idcausa = v_resultado.idc; v_td_tiempo_causa.tiempo = v_resultado.sumatoria;
    v_td_tiempo_causa.contdias = v_resultado.cont_dias;
	RETURN NEXT v_td_tiempo_causa;
end loop;
   
END;
$_$;
COMMENT ON FUNCTION f_listadopersonastiempocausas(p_idcausa numeric[], p_idpersona numeric[], p_idgrupodescanso numeric[], p_desde date, p_hasta date, p_tipodia numeric[]) IS 'SELECT * from mod_regimentrabajo.f_listadopersonastiempocausas( ''{idcausa separados por coma}'', ''{idpersona separados por coma}'', ''{idgrupodescanso separados por coma}'', fecha_i, fecha_f, idtipo);';
CREATE SEQUENCE sec_dat_estructuraasistencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_dat_estructuraasistencia_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_estructuraasistencia".';
SET default_tablespace = '';
SET default_with_oids = false;
CREATE TABLE dat_estructuraasistencia (
    idestructuraasistencia numeric(19,0) DEFAULT nextval('sec_dat_estructuraasistencia_seq'::regclass) NOT NULL,
    idpadre numeric(19,0) NOT NULL,
    idpersona numeric(19,0),
    idcargo numeric(19,0) NOT NULL
);
CREATE FUNCTION f_obtenerhijos_recursivo(identificador numeric) RETURNS SETOF dat_estructuraasistencia
    LANGUAGE plpgsql
    AS $$
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
END LOOP;
END;
$$;
CREATE FUNCTION f_obtenerpadre_recursivo(identificador numeric) RETURNS SETOF dat_estructuraasistencia
    LANGUAGE plpgsql
    AS $$
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
END LOOP;
END;
$$;
CREATE FUNCTION f_tiempocausas(p_idcausa numeric[], p_idpersona numeric[], p_idgrupodescanso numeric[], p_desde date, p_hasta date) RETURNS SETOF td_persona_tiempo_causa_old
    LANGUAGE plpgsql
    AS $_$
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
DELETE FROM tmp_persona_tiempo_causa;
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
$_$;
COMMENT ON FUNCTION f_tiempocausas(p_idcausa numeric[], p_idpersona numeric[], p_idgrupodescanso numeric[], p_desde date, p_hasta date) IS 'SELECT * from mod_regimentrabajo.f_listadopersonastiempocausas( ''{idcausa separados por coma}'', ''{idpersona separados por coma}'', ''{idgrupodescanso separados por coma}'', fecha_i, fecha_f);';
CREATE FUNCTION ft_actualizar_horas_turnotrabajo() RETURNS trigger
    LANGUAGE plpgsql COST 10
    AS $$
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
$$;
CREATE FUNCTION ft_insertar_causa() RETURNS trigger
    LANGUAGE plpgsql COST 10
    AS $$
DECLARE
    padre_rec mod_regimentrabajo.nom_causa;
BEGIN
  IF (NEW.idpadre is null)THEN
  	 NEW.idpadre:= NEW.idcausa;
  END IF;
RETURN NEW;
END;
$$;
CREATE FUNCTION ft_insertar_estructuraasistencia() RETURNS trigger
    LANGUAGE plpgsql COST 10
    AS $$
DECLARE
    padre_rec mod_regimentrabajo.dat_estructuraasistencia;
BEGIN
  IF (NEW.idpadre is null)THEN
  	 NEW.idpadre:= NEW.idestructuraasistencia;
  END IF;
RETURN NEW;
END;
$$;
CREATE SEQUENCE sec_calendario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_calendario_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_calendario_distra".';
CREATE TABLE conf_calendario (
    idcalendario numeric(19,0) DEFAULT nextval('sec_calendario_seq'::regclass) NOT NULL,
    fecha date NOT NULL,
    descripcion character varying(500),
    idtipodedia numeric(3,0) NOT NULL,
    idgrupodescanso numeric(19,0) NOT NULL,
    horas time without time zone,
    idturnotrabajo numeric(19,0)
);
COMMENT ON TABLE conf_calendario IS 'Almacena los días del calendario que no son laborables según un grupo de descanso determinado.';
COMMENT ON COLUMN conf_calendario.idcalendario IS 'Identificador de la tabla.';
COMMENT ON COLUMN conf_calendario.fecha IS 'Fecha del día no laborable.';
COMMENT ON COLUMN conf_calendario.descripcion IS 'Descripción que justifica la selección de la fecha como no laborable.';
COMMENT ON COLUMN conf_calendario.idtipodedia IS 'Identificador del tipo de día.';
COMMENT ON COLUMN conf_calendario.idgrupodescanso IS 'Identificador del grupo de descanso.';
CREATE SEQUENCE sec_conf_calendariopersona_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE conf_calendariopersona (
    idcalendariopersona numeric(19,0) DEFAULT nextval('sec_conf_calendariopersona_seq'::regclass) NOT NULL,
    fecha date NOT NULL,
    idturnotrabajo numeric(19,0),
    idpersona numeric(19,0) NOT NULL,
    horas time without time zone,
    idtipodedia numeric(19,0) NOT NULL,
    idcargo numeric(19,0)
);
COMMENT ON COLUMN conf_calendariopersona.idcalendariopersona IS 'Identificador de la tabla';
COMMENT ON COLUMN conf_calendariopersona.fecha IS 'Fecha planificada';
COMMENT ON COLUMN conf_calendariopersona.idturnotrabajo IS 'Identificador del turno de trabajo';
COMMENT ON COLUMN conf_calendariopersona.idpersona IS 'Identificador de la persona';
COMMENT ON COLUMN conf_calendariopersona.horas IS 'Horas de trabajo en la fecha';
COMMENT ON COLUMN conf_calendariopersona.idtipodedia IS 'Identificador de tipo de dia que se planifica';
COMMENT ON COLUMN conf_calendariopersona.idcargo IS 'Identificador del cargo que tiene la persona en esta planificación.';
CREATE SEQUENCE sec_conf_estructurahorario_seq
    START WITH 18
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999999
    CACHE 1;
CREATE TABLE conf_estructurahorario (
    idestructurahorario numeric(19,0) DEFAULT nextval('sec_conf_estructurahorario_seq'::regclass) NOT NULL,
    idestructura numeric(19,0) NOT NULL
);
CREATE SEQUENCE sec_conf_estructurareloj_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999999
    CACHE 1;
CREATE TABLE conf_estructurareloj (
    idestructurareloj numeric(19,1) DEFAULT nextval('sec_conf_estructurareloj_seq'::regclass) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    dirserver character varying(19) NOT NULL,
    nombredb character varying(19) NOT NULL,
    usuario character varying(19) NOT NULL,
    contrasena character varying(255) NOT NULL
);
CREATE SEQUENCE sec_conf_estructuras_seq
    START WITH 417
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_conf_estructuras_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_estructuras".';
CREATE TABLE conf_estructuras (
    id numeric(19,0) DEFAULT nextval('sec_conf_estructuras_seq'::regclass) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    idpadre numeric(19,0) NOT NULL
);
CREATE SEQUENCE sec_conf_estructuratempus_seq
    START WITH 49
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 9999999999999
    CACHE 1;
CREATE TABLE conf_estructuratempus (
    idestructuratempus numeric(19,0) DEFAULT nextval('sec_conf_estructuratempus_seq'::regclass) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    dirapp character varying(100) NOT NULL
);
CREATE TABLE conf_habcausa (
    id numeric(19,0) NOT NULL,
    habilitado numeric(1,0) NOT NULL
);
CREATE TABLE conf_habcontrolacceso (
    id numeric(19,0) NOT NULL,
    habilitado numeric(1,0) NOT NULL,
    fuente numeric(1,0),
    dirautenticacion character varying(100),
    dirdatos character varying(100)
);
COMMENT ON COLUMN conf_habcontrolacceso.fuente IS '0-Base de datos
1-Servicio Web
2-Ninguno';
CREATE TABLE conf_habilitarfinmes (
    id numeric(19,0) NOT NULL,
    habilitado numeric(1,0) NOT NULL
);
CREATE TABLE conf_habilitarhorarioentradasalida (
    id numeric(19,0) NOT NULL,
    habilitado numeric(1,0) NOT NULL
);
CREATE TABLE conf_habilitarsubmayorvac (
    id numeric(19,0) NOT NULL,
    habilitado numeric(1,0) NOT NULL
);
CREATE TABLE conf_horasextras (
    id numeric(1,0) NOT NULL,
    denominacion character varying(255) NOT NULL,
    limite numeric(3,0) NOT NULL
);
COMMENT ON COLUMN conf_horasextras.limite IS 'Limite en horas';
CREATE SEQUENCE sec_dat_asistencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_dat_asistencia_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistencia".';
CREATE TABLE dat_asistencia (
    idasistencia numeric(19,0) DEFAULT nextval('sec_dat_asistencia_seq'::regclass) NOT NULL,
    fechahoraentrada timestamp without time zone,
    idcausa numeric(19,0),
    fdesde date,
    fhasta date,
    hrsdescontadas character varying(8),
    idpersona numeric(19,0) NOT NULL,
    fechahorasalida timestamp without time zone,
    fecharegistro date NOT NULL,
    observacion character varying(500),
    idpadre numeric(19,0),
    horasextras character varying(8),
    idpersonacontrola numeric(19,0),
    actualizado numeric(1,0) DEFAULT 0,
    fhabilitado numeric(1,0) DEFAULT 0,
    hferiadas character varying(8),
    idcargo numeric(19,0),
    idpersonamodifica numeric(19,0),
    certificado numeric(1,0) DEFAULT 0,
    idpersonacertifica numeric(19,0),
    hrstrabajadas time without time zone DEFAULT '00:00:00'::time without time zone,
    idgrupodescanso numeric(19,0),
    idturnotrabajo numeric(19,0),
    aprobado numeric(1,0),
    idpersonaaprueba numeric(19,0)
);
COMMENT ON COLUMN dat_asistencia.idpersonacontrola IS 'Id del usuario que controla la asistencia';
COMMENT ON COLUMN dat_asistencia.actualizado IS '0-No actualizado desde control de acceso
1-Actualizado desde control de acceso';
COMMENT ON COLUMN dat_asistencia.fhabilitado IS 'indica si el dia fue 
feriado y habilitado para la persona';
COMMENT ON COLUMN dat_asistencia.hferiadas IS 'cantidad de horas feriadas habilitadas trabajadas';
COMMENT ON COLUMN dat_asistencia.idcargo IS 'Identificador del cargo.';
COMMENT ON COLUMN dat_asistencia.idpersonamodifica IS 'Id del usuario que modifica la asistencia';
CREATE SEQUENCE sec_asistenciamensual_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_asistenciamensual_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistenciamensual".';
CREATE TABLE dat_asistenciamensual (
    idasistenciamensual numeric(19,0) NOT NULL DEFAULT nextval('mod_regimentrabajo.sec_asistenciamensual_seq'::regclass),
    fdesde date NOT NULL,
    fhasta date NOT NULL,
    asistencia character varying COLLATE pg_catalog."default",
    apa character varying COLLATE pg_catalog."default" NOT NULL,
    idestructura numeric(19,0) NOT NULL,
);
CREATE TABLE dat_baseporindicador (
    idindicadorbase numeric(19,0) NOT NULL,
    idindicador numeric(19,0) NOT NULL
);
CREATE TABLE dat_causaindicador (
    idcausa numeric(19,0) NOT NULL,
    idindicador numeric(19,0) NOT NULL
);
CREATE SEQUENCE sec_causasreporteausencia_seq
    START WITH 135
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_causasreporteausencia_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_causasreporteausencia".';
CREATE TABLE dat_causasreporteausencia (
    idcausasreporteausencia numeric(19,0) DEFAULT nextval('sec_causasreporteausencia_seq'::regclass) NOT NULL,
    idcausa numeric(19,0) NOT NULL,
    idvariablesconfreportescertificaciones numeric(19,0) NOT NULL
);
CREATE SEQUENCE sec_diaferiadohabilitado_seq
    START WITH 4
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_diaferiadohabilitado_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_diaferiadohabilitado".';
CREATE TABLE dat_diaferiadohabilitado (
    iddiaferiadohabilitado numeric DEFAULT nextval('sec_diaferiadohabilitado_seq'::regclass) NOT NULL,
    fecha date NOT NULL,
    idpersona numeric(19,1) NOT NULL,
    horas interval(6)
);
CREATE SEQUENCE sec_indicador_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_indicador_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_indicador".';
CREATE TABLE dat_indicador (
    idindicador numeric(19,0) DEFAULT nextval('sec_indicador_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    unidadmedida character varying,
    idexpresionmatematica numeric,
    gestionable numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON COLUMN dat_indicador.gestionable IS '0-no gestionable
1-gestionable';
CREATE SEQUENCE sec_indicadoresporreporte_seq
    START WITH 8
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_indicadoresporreporte_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_indicadoresporreporte".';
CREATE TABLE dat_indicadoresporreporte (
    idindicadorporreporte numeric(19,0) DEFAULT nextval('sec_indicadoresporreporte_seq'::regclass) NOT NULL,
    orden numeric(19,0),
    idreporte numeric(19,0) NOT NULL,
    idindicador numeric(19,0),
    idcausa numeric(19,0)
);
CREATE SEQUENCE sec_periodomes_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_periodomes_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_periodomes".';
CREATE TABLE dat_periodomes (
    idperiodomes numeric DEFAULT nextval('sec_periodomes_seq'::regclass) NOT NULL,
    anno numeric(4,0),
    mes numeric(2,0),
    fdesde date,
    fhasta date
);
CREATE SEQUENCE sec_periodoquincena_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_periodoquincena_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_periodoquincena".';
CREATE TABLE dat_periodoquincena (
    idperiodoquincena numeric DEFAULT nextval('sec_periodoquincena_seq'::regclass) NOT NULL,
    anno numeric(4,0),
    mes numeric(2,0),
    fdesdeprimquincena date,
    fhastaprimquincena date,
    fdesdesegquincena date,
    fhastasegquincena date
);
CREATE SEQUENCE sec_planvacaciones_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_planvacaciones_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_planvacaciones".';
CREATE TABLE dat_planvacaciones (
    idplanvacaciones numeric(19,0) DEFAULT nextval('sec_planvacaciones_seq'::regclass) NOT NULL,
    mes numeric(2,0),
    priquincena numeric(19,0),
    segquincena numeric(19,0),
    idpersona numeric(19,0) NOT NULL,
    anno numeric(4,0) NOT NULL
);
CREATE SEQUENCE sec_registromodelovac_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_registromodelovac_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_registromodelovac".';
CREATE TABLE dat_registromodelovac (
    idregistromodelovac numeric(19,0) DEFAULT nextval('sec_registromodelovac_seq'::regclass) NOT NULL,
    idpersona numeric(19,0) NOT NULL,
    idcargo numeric(19,0),
    idarea numeric(19,0),
    anno numeric(4,0) NOT NULL
);
CREATE SEQUENCE sec_rotacionturno_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_rotacionturno_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_rotacionturno".';
CREATE TABLE dat_rotacionturno (
    idrotacionturno numeric(19,0) DEFAULT nextval('sec_rotacionturno_seq'::regclass) NOT NULL,
    cantdias numeric(19,0) NOT NULL,
    idrotacion numeric(19,0) NOT NULL,
    idturnotrabajo numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_rotacionturno IS 'Almacena los trunos comprendidos en un período de rotación.';
COMMENT ON COLUMN dat_rotacionturno.idrotacionturno IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_rotacionturno.cantdias IS 'Cantidad de días';
COMMENT ON COLUMN dat_rotacionturno.idrotacion IS 'Identificador de la rotación.';
COMMENT ON COLUMN dat_rotacionturno.idturnotrabajo IS 'Identificador del turno de trabajo.';
CREATE SEQUENCE sec_subordinacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_subordinacion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_subordinacion".';
CREATE TABLE dat_subordinacion (
    idsubordinacion numeric(19,0) DEFAULT nextval('sec_subordinacion_seq'::regclass) NOT NULL,
    idpersona numeric(19,0) NOT NULL,
    idestructuraasistencia numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_subordinacion IS 'Almacena las subordinaciones.';
COMMENT ON COLUMN dat_subordinacion.idsubordinacion IS 'Identificador de la tupla.';
COMMENT ON COLUMN dat_subordinacion.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN dat_subordinacion.idestructuraasistencia IS 'Identificador de la estructura de asistencia.';
CREATE TABLE in_tipodia (
    id numeric
);
CREATE SEQUENCE sec_nom_causa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_nom_causa_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_causa".';
CREATE TABLE nom_causa (
    idcausa numeric(19,0) DEFAULT nextval('sec_nom_causa_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion text,
    fdesde date,
    fhasta date,
    abreviatura character varying(10),
    tieneentradasalida numeric(1,0),
    tieneperiodo numeric(1,0),
    color character varying(7) DEFAULT '#ffffff'::character varying,
    idcategoria numeric(19,0) DEFAULT NULL::numeric,
    descuenta numeric(1,0) DEFAULT NULL::numeric,
    eliminar numeric DEFAULT 1,
    idpadre numeric(19,0),
    afectasalario numeric(1,0) DEFAULT NULL::numeric,
    cantincidencias numeric(2,0),
    modifica numeric(1,0) DEFAULT 0
);
COMMENT ON COLUMN nom_causa.descuenta IS 'Indicador para conocer las causas que generan descuento.';
COMMENT ON COLUMN nom_causa.eliminar IS '1  No eliminar
0  Eliminar';
COMMENT ON COLUMN nom_causa.cantincidencias IS 'Cantidad de incidencias de la causa en el periodo configurado en el sistema';
CREATE SEQUENCE sec_grupodescanso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_grupodescanso_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_grupodescanso".';
CREATE TABLE nom_grupodescanso (
    idgrupodescanso numeric(19,0) DEFAULT nextval('sec_grupodescanso_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    idregimentrabajo numeric(19,0) NOT NULL,
    idestructura numeric(19,0)
);
COMMENT ON TABLE nom_grupodescanso IS 'Almacena los grupos de descanso según un régimen de trabajo determinado.';
COMMENT ON COLUMN nom_grupodescanso.idgrupodescanso IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_grupodescanso.denominacion IS 'Denominación del grupo de descanso.';
COMMENT ON COLUMN nom_grupodescanso.descripcion IS 'Descripción del grupo de descanso.';
COMMENT ON COLUMN nom_grupodescanso.fdesde IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN nom_grupodescanso.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_grupodescanso.idregimentrabajo IS 'Identificador del régimen de trabajo.';
CREATE SEQUENCE sec_horarionocturnidad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_horarionocturnidad_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_turnotrabajo".';
CREATE TABLE nom_horarionocturnidad (
    idhorarionocturnidad numeric(19,0) DEFAULT nextval('sec_horarionocturnidad_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    horainicio time without time zone NOT NULL,
    horafin time without time zone NOT NULL
);
CREATE SEQUENCE sec_regimentrabajo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_regimentrabajo_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_regimentrabajo".';
CREATE TABLE nom_regimentrabajo (
    idregimentrabajo numeric(19,0) DEFAULT nextval('sec_regimentrabajo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date,
    horastrabajo numeric(2,0) NOT NULL,
    tipoft numeric(1,0) DEFAULT 1,
    fondotiempo numeric(5,1),
    tipofondotiempo numeric(1,0) DEFAULT 0
);
COMMENT ON TABLE nom_regimentrabajo IS 'Almacena los regímenes de trabajo.';
COMMENT ON COLUMN nom_regimentrabajo.idregimentrabajo IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_regimentrabajo.denominacion IS 'Denominación del régimen de trabajo.';
COMMENT ON COLUMN nom_regimentrabajo.descripcion IS 'Descripción del régimen de trabajo.';
COMMENT ON COLUMN nom_regimentrabajo.fdesde IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN nom_regimentrabajo.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_regimentrabajo.tipoft IS 'Tipo de calculo para el fondo de tiempo:
1-tiempo laborable real del mes
2-tiempo fijo
3-promedio anual del tiempo laborable';
COMMENT ON COLUMN nom_regimentrabajo.fondotiempo IS 'fondo de tiempo del regimen de trabajo';
COMMENT ON COLUMN nom_regimentrabajo.tipofondotiempo IS 'Tipo de calculo para el fondo de tiempo:
1-tiempo laborable real del mes
2-tiempo fijo
3-promedio anual del tiempo laborable';
CREATE SEQUENCE sec_reporte_seq
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_reporte_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_reporte".';
CREATE TABLE nom_reporte (
    idreporte numeric(19,0) DEFAULT nextval('sec_reporte_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying,
    fdesde date DEFAULT now() NOT NULL,
    fhasta date
);
CREATE SEQUENCE sec_rotacion_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_rotacion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_rotacion".';
CREATE TABLE nom_rotacion (
    idrotacion numeric(19,0) DEFAULT nextval('sec_rotacion_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    fdesde date DEFAULT now() NOT NULL,
    fhasta date
);
COMMENT ON TABLE nom_rotacion IS 'Almacena las rotaciones a emplear por los trunos de trabajo.';
COMMENT ON COLUMN nom_rotacion.idrotacion IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_rotacion.denominacion IS 'Denominación de la rotación.';
COMMENT ON COLUMN nom_rotacion.descripcion IS 'Descripción de la rotación.';
COMMENT ON COLUMN nom_rotacion.fdesde IS 'Fecha que establece la disponibilidad de la rotación.';
COMMENT ON COLUMN nom_rotacion.fhasta IS 'Fecha que enmarca el período de validez de la rotación.';
CREATE SEQUENCE sec_tipodedia_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999
    CACHE 1;
COMMENT ON SEQUENCE sec_tipodedia_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_tipodedia".';
CREATE TABLE nom_tipodedia (
    idtipodedia numeric(3,0) DEFAULT nextval('sec_tipodedia_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    descripcion character varying(500),
    color character varying(7) DEFAULT '#000000'::character varying NOT NULL,
    fdesde date DEFAULT now(),
    fhasta date,
    trabajo numeric(1,0) DEFAULT 0 NOT NULL,
    abreviatura character varying(3),
    feriado numeric(1,0) DEFAULT 0
);
COMMENT ON TABLE nom_tipodedia IS 'Almacena los tipos de días de un calendario.';
COMMENT ON COLUMN nom_tipodedia.idtipodedia IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_tipodedia.denominacion IS 'Denominación del tipo de día.';
COMMENT ON COLUMN nom_tipodedia.descripcion IS 'Descripción del tipo de día.';
COMMENT ON COLUMN nom_tipodedia.color IS 'Color para representar visualmente el tipo de día.';
COMMENT ON COLUMN nom_tipodedia.fdesde IS 'Fecha de entrada en vigor del valor nomenclado.';
COMMENT ON COLUMN nom_tipodedia.fhasta IS 'Fecha en que concluye la vigencia del valor nomenclado.';
COMMENT ON COLUMN nom_tipodedia.feriado IS 'Indica si el tipo de dia es feriado o no:
0- No es feriado
1- Feriado';
CREATE SEQUENCE sec_turnotrabajo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
COMMENT ON SEQUENCE sec_turnotrabajo_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_turnotrabajo".';
CREATE TABLE nom_turnotrabajo (
    idturnotrabajo numeric(19,0) DEFAULT nextval('sec_turnotrabajo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    descripcion character varying,
    fdesde date NOT NULL,
    fhasta date,
    horainicio time without time zone,
    horafin time without time zone,
    toleranciaentrada time without time zone DEFAULT '00:00:00'::time without time zone,
    toleranciasalida time without time zone DEFAULT '00:00:00'::time without time zone,
    horarioalmuerzo time without time zone,
    tiempodescanso time(0) without time zone,
    horaentradaps time without time zone,
    horasalidaps time without time zone,
    horaentradass time without time zone,
    horasalidass time without time zone,
    otrodia numeric(1,0) DEFAULT 0,
    horas character varying(50)
);
COMMENT ON COLUMN nom_turnotrabajo.horaentradaps IS 'Hora de entrada de la primera sesión de trabajo';
COMMENT ON COLUMN nom_turnotrabajo.horasalidaps IS 'Hora de salida de la primera sesión de trabajo';
COMMENT ON COLUMN nom_turnotrabajo.horaentradass IS 'Hora de entrada de la segunda sesión de trabajo';
COMMENT ON COLUMN nom_turnotrabajo.horasalidass IS 'Hora de salida de la segunda sesión de trabajo';
--<Update 16/08/2021>
CREATE SEQUENCE mod_regimentrabajo.sec_asistenciasesion_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_asistenciasesion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistenciasesion".';
CREATE SEQUENCE mod_regimentrabajo.sec_conf_categoriacausas_seq 
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_categoriacausas_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_categoriacausas".';
CREATE SEQUENCE mod_regimentrabajo.sec_conf_certificados
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_certificados IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_certificados".';
CREATE SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_conceptocausas".';
CREATE SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 5
  CACHE 1;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_fondodetiempo".';
CREATE SEQUENCE mod_regimentrabajo.sec_dat_registro_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_dat_registro_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_registro".';
CREATE SEQUENCE mod_regimentrabajo.sec_turnosesion_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_turnosesion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_turnosesion".';
ALTER TYPE mod_regimentrabajo.td_persona_tiempo_causa
  ALTER ATTRIBUTE tiempo TYPE INTERVAL(6),
  ADD ATTRIBUTE mesanteriorcertificado VARCHAR;
CREATE TYPE mod_regimentrabajo.td_persona_tiempo_causa_cargo AS (
  idpersona NUMERIC,
  idcausa NUMERIC,
  tiempo INTERVAL(6),
  contdias NUMERIC,
  mesanteriorcertificado VARCHAR,
  idcargo NUMERIC
);
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
ALTER FUNCTION mod_regimentrabajo.f_actualizar_trt () OWNER TO zeolides;
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
ALTER FUNCTION mod_regimentrabajo.f_cambiargrupoasistencia () OWNER TO zeolides;
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
ALTER FUNCTION mod_regimentrabajo.f_cambiarturnoasistencia () OWNER TO zeolides;
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
ALTER FUNCTION mod_regimentrabajo.f_eliminarduplicados_confcalendariopersona () OWNER TO zeolides;
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
/*
CREATE TABLE mod_regimentrabajo.tabla_log
(
    idasistencia numeric(19,0) NOT NULL,
    por_sesion numeric(1,0) NOT NULL,
    fecha_hora timestamp without time zone NOT NULL DEFAULT now(),
    descontar_primera character varying COLLATE pg_catalog."default",
    descontar_segunda character varying COLLATE pg_catalog."default",
    idcausa numeric,
    CONSTRAINT pk_log_asistencia PRIMARY KEY (idasistencia, fecha_hora)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE mod_regimentrabajo.tabla_log
    OWNER to zeolides;
*/

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
ALTER FUNCTION mod_regimentrabajo.ft_certificar_asistencia () OWNER TO zeolides;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_asistenciamensual_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistenciamensual".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_calendario_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_calendario".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_causasreporteausencia_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_causasreporteausencia".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_calendariopersona_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_calendariopersona".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_estructurahorario_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_estructurahorario".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_estructurareloj_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_estructurareloj".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_estructuras_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_estructuras".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_estructuratempus_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_estructuratempus".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_dat_asistencia_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_asistencia".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_dat_estructuraasistencia_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_estructuraasistencia".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_diaferiadohabilitado_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_diaferiadohabilitado".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_grupodescanso_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_grupodescanso".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_horarionocturnidad_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_horarionocturnidad".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_indicador_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_indicador".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_indicadoresporreporte_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_indicadoresporreporte".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_nom_causa_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_causa".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_periodomes_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_periodomes".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_periodoquincena_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_periodoquincena".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_planvacaciones_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_planvacaciones".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_regimentrabajo_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_regimentrabajo".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_registromodelovac_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_registromodelovac".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_reporte_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_reporte".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_rotacion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_rotacion".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_rotacionturno_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_rotacionturno".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_subordinacion_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "dat_subordinacion".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_tipodedia_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_tipodedia".';
COMMENT ON SEQUENCE mod_regimentrabajo.sec_turnotrabajo_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_turnotrabajo".';
COMMENT ON TABLE mod_regimentrabajo.conf_habcausa IS 'Almacena la configuración de las causas habilitadas.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habcausa.id IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habcausa.habilitado IS 'Indicador de habilitación de la causa. 0- No habilitado. 1- Habilitado.';
COMMENT ON TABLE mod_regimentrabajo.conf_habcontrolacceso IS 'Almacena la configuración sobre el control de acceso con datos y elementos de chequeo de autenticación.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habcontrolacceso.id IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habcontrolacceso.habilitado IS 'Indicador de habilitación de las acciones funcionales del control de acceso. 0- No habilitado. 1- Habilitado.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habcontrolacceso.fuente IS 'Indicador de la fuente empleada para realizar a acción de controlar el acceso. 0-Base de datos. 1-Servicio Web. 2-Ninguno.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habcontrolacceso.dirautenticacion IS 'Dirección para la autenticación.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habcontrolacceso.dirdatos IS 'Dirección para los datos.';
COMMENT ON TABLE mod_regimentrabajo.conf_habilitarfinmes IS 'Almacena la configuración sobre el calendario anual específicamente sobre el último día del mes.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarfinmes.id IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarfinmes.habilitado IS 'Indicador de habilitación del fin de mes. 0- No habilitado. 1- Habilitado.';
COMMENT ON TABLE mod_regimentrabajo.conf_habilitarhorarioentradasalida IS 'Almacena la configuración de habilitación sobre el horario de entrada y de salida de la entidad.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarhorarioentradasalida.id IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarhorarioentradasalida.habilitado IS 'Indicador de habilitación del horario de entrada y salida. 0- No habilitado. 1- Habilitado.';
CREATE TABLE mod_regimentrabajo.conf_habilitarsesiones (
  idhabilitarsesion NUMERIC(19,0) NOT NULL,
  habsesion NUMERIC DEFAULT 0 NOT NULL,
  CONSTRAINT conf_habilitarsesiones_pkey PRIMARY KEY(idhabilitarsesion)
) 
WITH (oids = false);
ALTER TABLE mod_regimentrabajo.conf_habilitarsesiones ALTER COLUMN idhabilitarsesion SET STATISTICS 0;
ALTER TABLE mod_regimentrabajo.conf_habilitarsesiones ALTER COLUMN habsesion SET STATISTICS 0;
COMMENT ON TABLE mod_regimentrabajo.conf_habilitarsesiones IS 'Almacena la configuración sobre la habilitación del trabajo por sesiones del día laborable.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarsesiones.idhabilitarsesion IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarsesiones.habsesion IS 'Indicador de habilitación del trabajo por sesiones. 0- No habilitado. 1- Habilitado.';
COMMENT ON TABLE mod_regimentrabajo.conf_habilitarsubmayorvac IS 'Almacena la configuración para la habilitación del submayor de vacaciones del trabajador.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarsubmayorvac.id IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_habilitarsubmayorvac.habilitado IS 'Indicador de habilitación sobre el sub-mayor de vacaciones. 0- No habilitado. 1- Habilitado.';
COMMENT ON TABLE mod_regimentrabajo.conf_horasextras IS 'Almacena la configuración sobre el establecimiento del límite de horas extras a pagar al trabajador por la entidad contratante.';
COMMENT ON COLUMN mod_regimentrabajo.conf_horasextras.id IS 'Identificador de la tabla.';
ALTER TABLE mod_regimentrabajo.conf_horasextras ALTER COLUMN id TYPE NUMERIC(19,0);
COMMENT ON COLUMN mod_regimentrabajo.conf_horasextras.denominacion IS 'Denominación de la configuración.';
COMMENT ON COLUMN mod_regimentrabajo.conf_horasextras.limite IS 'Definición del límite en horas.';
COMMENT ON TABLE mod_regimentrabajo.in_tipodia IS 'Almacena una configuración persistente de los tipos de día que son verificados durante la ejecución de la función (mod_regimentrabajo.f_listadopersonastiempocausas).';
COMMENT ON COLUMN mod_regimentrabajo.in_tipodia.id IS 'Indentificador perteneciente al nomenclador que define los tipos de días operables en el sistema. So uso es exclusivo en la implementación de una función definida en el módulo.';
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
ALTER FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas (p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric [])
  OWNER TO zeolides;
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
ALTER FUNCTION mod_regimentrabajo.f_tiempocausas (p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date) OWNER TO zeolides;
COMMENT ON TABLE mod_regimentrabajo.dat_asistenciamensual IS 'Almacena la asistencia del trabajador a la entidad por meses.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciamensual.idasistenciamensual IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciamensual.fdesde IS 'Fecha de inicio del registro de la asistencia mensual del trabajador de la entidad.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciamensual.fhasta IS 'Fecha de cierre del registro de la asistencia mensual del trabajador de la entidad.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciamensual.asistencia IS 'Refleja la asistencia.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciamensual.apa IS 'Define el APA.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciamensual.idestructura IS 'Identificador de la estructura.';
COMMENT ON TABLE mod_regimentrabajo.conf_calendariopersona IS 'Almacena la configuración de la persona y su calendario de asistencia.';
COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idcalendariopersona IS 'Identificador de la tabla.';
ALTER TABLE mod_regimentrabajo.conf_calendariopersona ALTER COLUMN idcalendariopersona SET STATISTICS 0;
COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.fecha IS 'Fecha planificada.';
ALTER TABLE mod_regimentrabajo.conf_calendariopersona ALTER COLUMN fecha SET STATISTICS 0;
COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idturnotrabajo IS 'Identificador del turno de trabajo.';
ALTER TABLE mod_regimentrabajo.conf_calendariopersona ALTER COLUMN idturnotrabajo SET STATISTICS 0;
COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idpersona IS 'Identificador de la persona.';
ALTER TABLE mod_regimentrabajo.conf_calendariopersona ALTER COLUMN idpersona SET STATISTICS 0;
COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.horas IS 'Horas de trabajo en la fecha.';
ALTER TABLE mod_regimentrabajo.conf_calendariopersona ALTER COLUMN horas SET STATISTICS 0;
COMMENT ON COLUMN mod_regimentrabajo.conf_calendariopersona.idtipodedia IS 'Identificador del tipo de día que se planifica.';
CREATE TABLE mod_regimentrabajo.conf_categoriacausas (
  idcategoriacausa NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_categoriacausas_seq'::regclass) NOT NULL,
  idcategoria NUMERIC(19,1) NOT NULL,
  idcausa NUMERIC(19,1) NOT NULL,
  CONSTRAINT conf_categoriacausas_pkey PRIMARY KEY(idcategoriacausa)
) 
WITH (oids = false);
COMMENT ON TABLE mod_regimentrabajo.conf_categoriacausas IS 'Almacena la configuración de las categorías y las causas.';
COMMENT ON COLUMN mod_regimentrabajo.conf_categoriacausas.idcategoriacausa IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_categoriacausas.idcategoria IS 'Identificador de la categoría.';
COMMENT ON COLUMN mod_regimentrabajo.conf_categoriacausas.idcausa IS 'Identificador de la causa.';
CREATE TABLE mod_regimentrabajo.conf_certificados (
  id NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_conf_certificados'::regclass),
  idcausa NUMERIC(19,0)
) 
WITH (oids = false);
ALTER TABLE mod_regimentrabajo.conf_certificados ALTER COLUMN id SET STATISTICS 0;
ALTER TABLE mod_regimentrabajo.conf_certificados ALTER COLUMN idcausa SET STATISTICS 0;
COMMENT ON TABLE mod_regimentrabajo.conf_certificados IS 'Almacena la configuración para las causas.';
COMMENT ON COLUMN mod_regimentrabajo.conf_certificados.id IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_certificados.idcausa IS 'Identificador de la causa.';
CREATE TABLE mod_regimentrabajo.conf_conceptocausas (
  idconceptocausa NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_conceptocausas_seq'::regclass) NOT NULL,
  idcausa NUMERIC(19,1) NOT NULL,
  CONSTRAINT conf_conceptocausas_pkey PRIMARY KEY(idconceptocausa)
) 
WITH (oids = false);
COMMENT ON TABLE mod_regimentrabajo.conf_conceptocausas IS 'Almacena la configuración para las causas por concepto.';
COMMENT ON COLUMN mod_regimentrabajo.conf_conceptocausas.idconceptocausa IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_conceptocausas.idcausa IS 'Identificador de la causa.';
COMMENT ON TABLE mod_regimentrabajo.conf_estructurahorario IS 'Almacena la configuración de la estrutura con acceso por horarios.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructurahorario.idestructurahorario IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructurahorario.idestructura IS 'Identificador de la estructura.';
COMMENT ON TABLE mod_regimentrabajo.conf_estructurareloj IS 'Almacena la configuración para la estructura que se le configura acceso por aplicación de reloj controlador de acceso.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructurareloj.idestructurareloj IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructurareloj.idestructura IS 'Identificador de la estructura.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructurareloj.dirserver IS 'Dirección del servidor configurado.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructurareloj.nombredb IS 'Nombre de la base de datos alojada en el servidor configurado.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructurareloj.usuario IS 'Usuario de acceso a la base de datos del servidor configurado.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructurareloj.contrasena IS 'Contraseña del usuario configurado.';
COMMENT ON TABLE mod_regimentrabajo.conf_estructuras IS 'Almacena la configuración gerárquica de la estructura.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructuras.id IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructuras.idestructura IS 'Identificador de la estructura.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructuras.idpadre IS 'Identificador en rol de agrupador.';
COMMENT ON TABLE mod_regimentrabajo.conf_estructuratempus IS 'Almacena la configuración de la estructura y la aplicación reloj controladora de asistencia (TEMPUS).';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructuratempus.idestructuratempus IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructuratempus.idestructura IS 'Identificador de la estructura.';
COMMENT ON COLUMN mod_regimentrabajo.conf_estructuratempus.dirapp IS 'Dirección de acceso a la aplicación (TEMPUS).';
CREATE TABLE mod_regimentrabajo.conf_fondodetiempo (
  id NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_fondodetiempo_seq'::regclass) NOT NULL,
  idcategoria NUMERIC(19,1) NOT NULL,
  fondodetiempo NUMERIC(19,1) NOT NULL,
  CONSTRAINT conf_fondodetiempo_pkey PRIMARY KEY(id)
) 
WITH (oids = false);
COMMENT ON TABLE mod_regimentrabajo.conf_fondodetiempo IS 'Almacena la configuración de la categoría y su fondo de tiempo.';
COMMENT ON COLUMN mod_regimentrabajo.conf_fondodetiempo.id IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.conf_fondodetiempo.idcategoria IS 'Identificador de la categoría.';
COMMENT ON COLUMN mod_regimentrabajo.conf_fondodetiempo.fondodetiempo IS 'Aloja el valor referente al fondo de tiempo.';
COMMENT ON TABLE mod_regimentrabajo.dat_asistencia IS 'Alamecena todo lo referencte al registro de asistencia del trabajador controlado por el departamento de recursos humanos de la entidad.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idasistencia IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fechahoraentrada IS 'Fecha y hora en la que se registra la entrada a la entidad por el trabajador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idcausa IS 'Identificador de la causa.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fdesde IS 'Fecha de inicio del registro de la asistencia, o fecha que relaciona la justificación o afectación del tiempo si se emplea una causa de período.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fhasta IS 'Fecha de cierre del registro de la asistencia, o fecha que relaciona el final de la justificación o afectación del tiempo, si se emplea una causa de período.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.hrsdescontadas IS 'Indicador de tiempo en horas, con relación a la acción de descuento monetario para cuando se genere la nómina salarial.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fechahorasalida IS 'Fecha y hora de salida.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fecharegistro IS 'Fecha en la que se registra la asistencia.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.observacion IS 'Detalles a considerar por el empleador con relación al registro de la asistencia a la entidad por parte del empleado.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpadre IS 'Identificador de agrupación.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.horasextras IS 'Define en formato de tiempo, las horas trabajadas de manera extra, según el régimen de trabajo al que pertenece el trabajador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonacontrola IS 'Identificador de la persona (usuario) que controla la asistencia.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.actualizado IS 'Indicador sobre el estado del registro asistencial. 0-No actualizado desde control de acceso. 1-Actualizado desde control de acceso.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fhabilitado IS 'Indicador para conocer si el día fue feriado y habilitado para el trabajador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.hferiadas IS 'Indicador de cantidad de horas feriadas, habilitadas y trabajadas.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonamodifica IS 'Identificador de la persona (usuario) que modifica la asistencia.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.certificado IS 'Indicador sobre el registro para su certificación.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonacertifica IS 'Identificador de la persona (usuario) que tiene la autoridad de certificar la asistencia.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.hrstrabajadas IS 'Indicador en formato de tiempo, de las horas trabajadas en relación al registro de asistencia controlado.';
ALTER TABLE mod_regimentrabajo.dat_asistencia ALTER COLUMN hrstrabajadas DROP DEFAULT;
ALTER TABLE mod_regimentrabajo.dat_asistencia ALTER COLUMN hrstrabajadas TYPE VARCHAR(8) COLLATE pg_catalog."default";
ALTER TABLE mod_regimentrabajo.dat_asistencia ALTER COLUMN hrstrabajadas SET DEFAULT '00:00:00'::time without time zone;
ALTER TABLE mod_regimentrabajo.dat_asistencia ALTER COLUMN hrstrabajadas SET STORAGE EXTENDED;
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idgrupodescanso IS 'Identificador del grupo de  descanso.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idturnotrabajo IS 'Identificador del turno de trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.aprobado IS 'Indicador para la reflejar el estado de aprobación del registro asistencial.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonaaprueba IS 'Identificador de la persona (usuario), que cuenta con los privilegios de aprobar el registro asistencial.';
ALTER TABLE mod_regimentrabajo.dat_asistencia ADD COLUMN certificadocontinuado NUMERIC(19,0);
COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.certificadocontinuado IS 'Indicador del certificado continuado.';
COMMENT ON TABLE mod_regimentrabajo.dat_estructuraasistencia IS 'Almacena la relación entre la persona controlador de la asistencia a determinados ocupantes de los cargos incluidos en la gerarquía conformada.';
COMMENT ON COLUMN mod_regimentrabajo.dat_estructuraasistencia.idestructuraasistencia IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_estructuraasistencia.idpadre IS 'Identificador de una estructura de asistencia agrupadora, en condición de jerarquía.';
COMMENT ON COLUMN mod_regimentrabajo.dat_estructuraasistencia.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN mod_regimentrabajo.dat_estructuraasistencia.idcargo IS 'Identificador del cargo.';
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
COMMENT ON TABLE mod_regimentrabajo.dat_registro IS 'Almacena los registros por cada persona y cargo.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registro.idregistro IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registro.fechahoraentrada IS 'Fecha y hora de entrada contenida por el registro.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registro.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registro.fechahorasalida IS 'Fecha y hora de salida contenida en el registro.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registro.fecharegistro IS 'Fecha del registro.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registro.idcargo IS 'Identificador del cargo.';
COMMENT ON TABLE mod_regimentrabajo.dat_diaferiadohabilitado IS 'Almacena los días configurados como feriados pero habilitados al trabajador como laborable, para contemplar luego en su retribución salarial.';
COMMENT ON COLUMN mod_regimentrabajo.dat_diaferiadohabilitado.iddiaferiadohabilitado IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_diaferiadohabilitado.fecha IS 'Fecha que se configura como feriada.';
COMMENT ON COLUMN mod_regimentrabajo.dat_diaferiadohabilitado.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN mod_regimentrabajo.dat_diaferiadohabilitado.horas IS 'Horas a contemplar en el salario del trabajador, por laborar en una fecha feriada.';
ALTER TABLE mod_regimentrabajo.dat_diaferiadohabilitado ADD COLUMN idcargo NUMERIC(19,0);
COMMENT ON COLUMN mod_regimentrabajo.dat_diaferiadohabilitado.idcargo IS 'Identificador del cargo.';
COMMENT ON TABLE mod_regimentrabajo.nom_horarionocturnidad IS 'Almacena los horarios de nocturnidad.';
COMMENT ON COLUMN mod_regimentrabajo.nom_horarionocturnidad.idhorarionocturnidad IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.nom_horarionocturnidad.denominacion IS 'Denominación del horario de nocturnidad.';
COMMENT ON COLUMN mod_regimentrabajo.nom_horarionocturnidad.horainicio IS 'Hora en la que inicia.';
COMMENT ON COLUMN mod_regimentrabajo.nom_horarionocturnidad.horafin IS 'Hora en la que concluye.';
COMMENT ON TABLE mod_regimentrabajo.dat_indicador IS 'Almacena los indicadores.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicador.idindicador IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicador.denominacion IS 'Denominación del indicador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicador.descripcion IS 'Descripción del indicador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicador.fdesde IS 'Fecha en la que inicia la vigencia.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicador.fhasta IS 'Fecha en la que concluye la vigencia del indicador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicador.unidadmedida IS 'Unidad de medida a emplear por el indicador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicador.idexpresionmatematica IS 'Identificador de la expresión matemática.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicador.gestionable IS 'Indicador para la gestión. 0-no gestionable. 1-gestionable.';
COMMENT ON TABLE mod_regimentrabajo.nom_causa IS 'Almacena las causas.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.idcausa IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.denominacion IS 'Denominación de la causa.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.descripcion IS 'Descripción de la causa.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.fdesde IS 'Fecha a partir de la cual está vigente la causa en el sistema.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.fhasta IS 'Fecha en la que concluye la vigencia de la causa en la gestión del sistema.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.abreviatura IS 'Descripción breve para la identificación de la causa.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.tieneentradasalida IS 'Indicador sobre la causa para reflejar si requiere o no de registros de entrada y salida por parte del trabajador.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.tieneperiodo IS 'Indicador sobre la causa para identificar si abarca un período de tiempo finito.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.color IS 'Característica visual aplicable al ojo humano, con el fin de resaltar la presencia de registros con causas asociadas.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.idcategoria IS 'Identificador de la categoría.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.eliminar IS 'Indicador sobre la acción de eliminación. 1-No eliminar. 0- Eliminar.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.idpadre IS 'Identificador de una causa agrupador, en condición de jerarquía.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.afectasalario IS 'Indicador sobre la causa, con el fin de realizar ajustes o no sobre el salario del trabajador, generado por el módulo de nómina y retribución salarial.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.cantincidencias IS 'Cantidad de incidencias de la causa en el período configurado en el sistema.';
COMMENT ON COLUMN mod_regimentrabajo.nom_causa.modifica IS 'Indicador sobre la causa para saber si modifica o no.';
COMMENT ON TABLE mod_regimentrabajo.dat_periodomes IS 'Almacena los períodos de cada mes y año.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodomes.idperiodomes IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodomes.anno IS 'Indicador del año.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodomes.mes IS 'Indicador del mes.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodomes.fdesde IS 'Fecha de inicio del período mensual.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodomes.fhasta IS 'Fecha de culminación del período mensual.';
COMMENT ON TABLE mod_regimentrabajo.dat_periodoquincena IS 'Almacena los períodos quincenales de cada mes y año.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodoquincena.idperiodoquincena IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodoquincena.anno IS 'Indicador del año.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodoquincena.mes IS 'Indicador del mes.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodoquincena.fdesdeprimquincena IS 'Fecha de inicio de la primera quincena, contenida en el período.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodoquincena.fhastaprimquincena IS 'Fecha de culminación de la primera quincena, contenida en el período.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodoquincena.fdesdesegquincena IS 'Fecha de inicio de la segunda quincena, contenida en el período.';
COMMENT ON COLUMN mod_regimentrabajo.dat_periodoquincena.fhastasegquincena IS 'Fecha de culminación de la segunda quincena, contenida en el período.';
COMMENT ON TABLE mod_regimentrabajo.dat_planvacaciones IS 'Almacena la planificación personal de las vacaciones detallando las características al año, mes e incluso quincena.';
COMMENT ON COLUMN mod_regimentrabajo.dat_planvacaciones.idplanvacaciones IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_planvacaciones.mes IS 'Indicador del mes.';
COMMENT ON COLUMN mod_regimentrabajo.dat_planvacaciones.priquincena IS 'Indicador de la primera quincena.';
COMMENT ON COLUMN mod_regimentrabajo.dat_planvacaciones.segquincena IS 'Indicador de la segunda quincena.';
COMMENT ON COLUMN mod_regimentrabajo.dat_planvacaciones.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN mod_regimentrabajo.dat_planvacaciones.anno IS 'Indicador del año.';
ALTER TABLE mod_regimentrabajo.dat_planvacaciones ADD COLUMN idcargo NUMERIC(19,0);
COMMENT ON COLUMN mod_regimentrabajo.dat_planvacaciones.idcargo IS 'Identificador del cargo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_regimentrabajo.horastrabajo IS 'Tiempo reflejado en horas relacionadas al trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_regimentrabajo.tipoft IS 'Tipo de cálculo para el fondo de tiempo: 1-tiempo laborable real del mes. 2-tiempo fijo. 3-promedio anual del tiempo laborable.';
COMMENT ON COLUMN mod_regimentrabajo.nom_regimentrabajo.fondotiempo IS 'Fondo de tiempo del régimen de trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_regimentrabajo.tipofondotiempo IS 'Tipo de cálculo para el fondo de tiempo: 1-tiempo laborable real del mes. 2-tiempo fijo. 3-promedio anual del tiempo laborable.';
ALTER TABLE mod_regimentrabajo.nom_regimentrabajo ADD COLUMN diaslaborables NUMERIC(2,0);
COMMENT ON COLUMN mod_regimentrabajo.nom_regimentrabajo.diaslaborables IS 'Días laborables del régimen de trabajo.';
COMMENT ON TABLE mod_regimentrabajo.dat_registromodelovac IS 'Almacena los registros de modelo de vacaciones con los datos de la parsona, su ubicación en la entidad y cargo ocupado, además del año y la fecha de emisión.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registromodelovac.idregistromodelovac IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registromodelovac.idpersona IS 'Identificador de la persona.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registromodelovac.idcargo IS 'Identificador del cargo.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registromodelovac.idarea IS 'Identificador del área.';
COMMENT ON COLUMN mod_regimentrabajo.dat_registromodelovac.anno IS 'Año para el registro del modelo de vacaciones.';
ALTER TABLE mod_regimentrabajo.dat_registromodelovac ADD COLUMN fecha DATE DEFAULT 'now'::text::date NOT NULL;
COMMENT ON COLUMN mod_regimentrabajo.dat_registromodelovac.fecha IS 'Fecha del registro del modelo de vacaciones.'
COMMENT ON TABLE mod_regimentrabajo.nom_reporte IS 'Almacena los reportes.';
COMMENT ON COLUMN mod_regimentrabajo.nom_reporte.idreporte IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.nom_reporte.denominacion IS 'Denominación del reporte.';
COMMENT ON COLUMN mod_regimentrabajo.nom_reporte.descripcion IS 'Descripción del reporte.';
COMMENT ON COLUMN mod_regimentrabajo.nom_reporte.fdesde IS 'Fecha de creación del reporte.';
COMMENT ON COLUMN mod_regimentrabajo.nom_reporte.fhasta IS 'Fecha de culminación de la vigencia del reporte. Limitando la gestión de su información en el sistema.';
COMMENT ON COLUMN mod_regimentrabajo.nom_tipodedia.trabajo IS 'Indicador para saber si es un día de trabajo en la entidad.';
COMMENT ON COLUMN mod_regimentrabajo.nom_tipodedia.abreviatura IS 'Indentificador textual abreviado. Por lo general se usan siglas sugerentes.';
COMMENT ON COLUMN mod_regimentrabajo.nom_tipodedia.feriado IS 'Indica si el tipo de día es feriado o no: 0- No es feriado. 1- Feriado.';
COMMENT ON TABLE mod_regimentrabajo.nom_turnotrabajo IS 'Almacena los turnos de trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.idturnotrabajo IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.denominacion IS 'Denominación del turno.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.descripcion IS 'Descripción detallada sobre el truno.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.fdesde IS 'Fecha de inicio de la jornada laboral del truno.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.fhasta IS 'Fecha de conclusión de la jornada laboral del truno.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horainicio IS 'Hora en que inicia la jornada laboral del turno.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horafin IS 'Hora en que culmina la jornada laboral del turno.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.toleranciaentrada IS 'Valor permisible al trabajador sobre el inicio del turno laboral.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.toleranciasalida IS 'Valor permisible al trabajador sobre la culminación del turno laboral.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horarioalmuerzo IS 'Detalla el horario establecido durante el truno de trabajo para efectuar el almuerzo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.tiempodescanso IS 'Detalla el horario establecido durante el truno de trabajo para efectuar el descanso en función de la actividad ejecutada.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horaentradaps IS 'Hora de entrada de la primera sesión de trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horasalidaps IS 'Hora de salida de la primera sesión de trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horaentradass IS 'Hora de entrada de la segunda sesión de trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horasalidass IS 'Hora de salida de la segunda sesión de trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.otrodia IS 'Indicador sobre la abarcación de un tiempo compredido por el inicio del turno en el día corriente, y culminación en un horario correspondiente al día siguiente.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnotrabajo.horas IS 'Cantidad de horas.';
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
PARALLEL UNSAFE
COST 100 ROWS 1000;
ALTER FUNCTION mod_regimentrabajo.f_obtenerhijos_recursivo (identificador numeric) OWNER TO zeolides;
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
PARALLEL UNSAFE
COST 100 ROWS 1000;
ALTER FUNCTION mod_regimentrabajo.f_obtenerpadre_recursivo (identificador numeric) OWNER TO zeolides;
COMMENT ON TABLE mod_regimentrabajo.dat_baseporindicador IS 'Almacena los indicadores base.';
COMMENT ON COLUMN mod_regimentrabajo.dat_baseporindicador.idindicadorbase IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_baseporindicador.idindicador IS 'Identificador de la tupla. (indicador).';
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
COMMENT ON TABLE mod_regimentrabajo.dat_asistenciasesion IS 'Almacena la asistencia del trabajador conforme a la configuración de su trabajo por sesiones.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.idasistenciasesion IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.idasistencia IS 'Identificador de la asistencia.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.idsesion IS 'Indicador de la sesión. 0-primera sesión. 1-segunda sesión.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.fechahoraentrada IS 'Fecha y hora de entrada generada como registro de la asistencia por sesiones.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.fechahorasalida IS 'Fecha y hora de salida generada como registro de la asistencia por sesiones.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.idcausa IS 'Identificador de la causa.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.hrsdescontadas IS 'Define en formato de tiempo, las horas a descontar si la causa lo requiere.';
COMMENT ON COLUMN mod_regimentrabajo.dat_asistenciasesion.horasextras IS 'Indicador de horas laboradas fuera del período establecido por la sesión correspondiente y contempladas como extra-laborales, que pueden llegar a ser retribuidas parcial o tatal, en el salario del trabajador.';
COMMENT ON TABLE mod_regimentrabajo.dat_causaindicador IS 'Almacena las causas por indicador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_causaindicador.idcausa IS 'Identificador de la tupla. (causa).';
COMMENT ON COLUMN mod_regimentrabajo.dat_causaindicador.idindicador IS 'Identificador de la tupla. (indicador).';
COMMENT ON TABLE mod_regimentrabajo.dat_causasreporteausencia IS 'Almacena las causas incluidas en el reporte de ausencias del trabajador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_causasreporteausencia.idcausasreporteausencia IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_causasreporteausencia.idcausa IS 'Identificador de la causa.';
COMMENT ON COLUMN mod_regimentrabajo.dat_causasreporteausencia.idvariablesconfreportescertificaciones IS 'Identificador de la variable de configuración de los reportes y certificaciones, establecidas en el módulo de nómina y retribución salarial.';
COMMENT ON COLUMN mod_regimentrabajo.nom_grupodescanso.idestructura IS 'Identificador de la estructura.';
COMMENT ON TABLE mod_regimentrabajo.dat_indicadoresporreporte IS 'Almacena los indicadores asociados a los reportes.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicadoresporreporte.idindicadorporreporte IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicadoresporreporte.orden IS 'Orden de visualización.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicadoresporreporte.idreporte IS 'Identificador del reporte.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicadoresporreporte.idindicador IS 'Identificador del indicador.';
COMMENT ON COLUMN mod_regimentrabajo.dat_indicadoresporreporte.idcausa IS 'Identificador de la causa.';
COMMENT ON COLUMN mod_regimentrabajo.dat_rotacionturno.cantdias IS 'Cantidad de días.';
CREATE TABLE mod_regimentrabajo.nom_turnosesion (
  idturnosesion NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_turnosesion_seq'::regclass) NOT NULL,
  idturnotrabajo NUMERIC(19,0) NOT NULL,
  idsesion NUMERIC(1,0) NOT NULL,
  horainicio TIME WITHOUT TIME ZONE,
  horafin TIME WITHOUT TIME ZONE,
  CONSTRAINT pk_turnosesion PRIMARY KEY(idturnosesion)
) 
WITH (oids = false);
COMMENT ON TABLE mod_regimentrabajo.nom_turnosesion IS 'Almacena la asociación de los turnos de trabajo y la sesión del día que le corresponde.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnosesion.idturnosesion IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnosesion.idturnotrabajo IS 'Identificador del turno de trabajo.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnosesion.idsesion IS 'Identificador de la sesión.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnosesion.horainicio IS 'Indica la hora en que inicia la jornada del turno.';
COMMENT ON COLUMN mod_regimentrabajo.nom_turnosesion.horafin IS 'Indica la hora en que concluye la jornada del turno.';
COMMENT ON COLUMN mod_regimentrabajo.conf_calendario.horas IS 'Horas.';
COMMENT ON COLUMN mod_regimentrabajo.conf_calendario.idturnotrabajo IS 'Identificador del turno de trabajo.';
--</Update>
--</Schema>

--<Data>
-- Created By : ScriptSplitGenerador
-- Code: http://10.12.170.129:9880/ch_regimentrabajo/trunk/lineabase
-- Only Data
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = mod_regimentrabajo, pg_catalog;
INSERT INTO conf_habcausa (id, habilitado) VALUES (1, 1);
INSERT INTO conf_habcausa (id, habilitado) VALUES (2, 1);
INSERT INTO conf_habcausa (id, habilitado) VALUES (3, 1);
INSERT INTO conf_habcausa (id, habilitado) VALUES (4, 1);
INSERT INTO conf_habcontrolacceso (id, habilitado, fuente, dirautenticacion, dirdatos) VALUES (2, 0, 2, NULL, NULL);
INSERT INTO conf_habcontrolacceso (id, habilitado, fuente, dirautenticacion, dirdatos) VALUES (3, 0, 2, NULL, NULL);
INSERT INTO conf_habcontrolacceso (id, habilitado, fuente, dirautenticacion, dirdatos) VALUES (1, 0, 2, NULL, NULL);
INSERT INTO conf_habilitarfinmes (id, habilitado) VALUES (1, 0);
INSERT INTO conf_habilitarhorarioentradasalida (id, habilitado) VALUES (1, 0);
INSERT INTO conf_habilitarsesiones (idhabilitarsesion, habsesion) VALUES (1, 0);
INSERT INTO conf_habilitarsubmayorvac (id, habilitado) VALUES (1, 0);
INSERT INTO conf_horasextras (id, denominacion, limite) VALUES (1, 'Límite diario', 2);
INSERT INTO conf_horasextras (id, denominacion, limite) VALUES (2, 'Límite mensual', 40);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (5, 'SALIDA ANTICIPADA', NULL, '2020-02-24', NULL, 'SA', 1, 0, '#666666', NULL, 1, 0, 5, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (6, 'LLEGADA TARDE/SALIDA ANTICIPADA', NULL, '2020-02-24', NULL, 'T/SA', 1, 0, '#666664', NULL, 1, 0, 6, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (660, 'SUSPENCIÓN DEL VÿNCULO LABORAL', 'Para licencias no retribuidas por: Viaje al exterior por asuntos personales, responsabilidad de familiares, contruir o reparar la vivienda.', '2020-02-24', NULL, 'SVL', 1, 1, '#FF0000', NULL, 0, 1, 660, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (1, 'AUSENTE', NULL, '2020-02-24', NULL, 'AUS', 0, 0, '#000000', NULL, 0, 0, 1, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (4, 'VACACIONES', NULL, '2020-02-24', NULL, 'VAC', 0, 1, '#99CCFF', NULL, 0, 0, 4, 1, NULL, 0);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (3, 'LLEGADA TARDE', NULL, '2020-02-24', NULL, 'T', 1, 0, '#339966', NULL, 1, 0, 3, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (612, 'DONACIONES DE SANGRE', NULL, '2020-02-24', NULL, 'DS', 1, 0, '#FF6600', NULL, 0, 1, 612, 0, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (610, 'PRISIÓN PREVENTIVA', NULL, '2020-02-24', NULL, 'PP', 0, 1, '#333333', NULL, 0, 1, 610, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (614, 'ENFERMEDAD O ACCIDENTE COMÚN', NULL, '2020-02-24', NULL, 'EC', 0, 1, '#008000', NULL, 0, 1, 614, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (624, 'ALTAS', NULL, '2020-02-24', NULL, 'AL', 0, 1, '#33CCCC', NULL, 0, 1, 624, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (615, 'ENFERMEDAD PROFESIONAL O ACCIDENTE DE TRABAJO', NULL, '2020-02-24', NULL, 'EP', 0, 1, '#008080', NULL, 0, 1, 615, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (627, 'CHEQUEO MÉDICO', NULL, '2020-02-24', NULL, 'CHM', 0, 1, '#969696', NULL, 0, 1, 627, 0, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (626, 'TRABAJANDO FUERA', NULL, '2020-02-24', NULL, 'TF', 1, 1, '#800080', NULL, 0, 1, 626, 0, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (625, 'BAJA', NULL, '2020-02-24', NULL, 'BA', 0, 1, '#3366FF', NULL, 0, 1, 625, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (642, 'CURSO', NULL, '2020-02-24', NULL, 'CUR', 1, 1, '#FFCC00', NULL, 0, 1, 642, 1, 5, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (641, 'AUTORIZADO', NULL, '2020-02-24', NULL, 'AUT', 1, 1, '#0000FF', NULL, 1, 1, 641, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (640, 'TURNO MÉDICO', NULL, '2020-02-24', NULL, 'TM', 1, 1, '#808000', NULL, 0, 1, 640, 0, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (633, 'ATENCIÓN TOPES DE COLLANTE', NULL, '2020-02-24', NULL, 'AT', 0, 1, '#FF99CC', NULL, 0, 1, 633, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (655, 'OBLIGACIONES', NULL, '2020-02-24', NULL, 'O', 1, 1, '#993366', NULL, 0, 1, 655, 0, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (653, 'DESCANSO  DE GUARDIA', NULL, '2020-02-24', NULL, 'DG', 0, 0, '#800000', NULL, 0, 1, 653, 0, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (650, 'LICENCIA NO RETRIBUIDA', NULL, '2020-02-24', NULL, 'LNR', 0, 1, '#FF9900', NULL, 0, 1, 650, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (659, 'SUSPENSO DE SERVICIO', NULL, '2020-02-24', NULL, 'SS', 0, 1, '#99CC00', NULL, 0, 1, 659, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (658, 'SUSPENSO DE FUNCIONES', NULL, '2020-02-24', NULL, 'SF', 0, 1, '#993300', NULL, 0, 1, 658, 1, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (657, 'COMISIÓN DE SERVICIO', NULL, '2020-02-24', NULL, 'CS', 0, 1, '#333399', NULL, 0, 1, 657, 0, NULL, 1);
INSERT INTO nom_causa (idcausa, denominacion, descripcion, fdesde, fhasta, abreviatura, tieneentradasalida, tieneperiodo, color, idcategoria, descuenta, eliminar, idpadre, afectasalario, cantincidencias, modifica) VALUES (656, 'LICENCIA RETRIBUIDA', NULL, '2020-02-24', NULL, 'LR', 0, 1, '#FFFFFF', NULL, 0, 1, 656, 1, 2, 1);
INSERT INTO nom_grupodescanso (idgrupodescanso, denominacion, descripcion, fdesde, fhasta, idregimentrabajo, idestructura) VALUES (2, 'Grupo 1', NULL, '2020-02-24', NULL, 2, NULL);
INSERT INTO nom_horarionocturnidad (idhorarionocturnidad, denominacion, horainicio, horafin) VALUES (6, '7pm-11pm', '19:00:00', '23:00:00');
INSERT INTO nom_horarionocturnidad (idhorarionocturnidad, denominacion, horainicio, horafin) VALUES (7, '11pm-7am', '23:00:00', '07:00:00');
INSERT INTO nom_regimentrabajo (idregimentrabajo, denominacion, descripcion, fdesde, fhasta, horastrabajo, tipoft, fondotiempo, tipofondotiempo) VALUES (2, 'Régimen 8h', NULL, '2020-02-24', NULL, 8, 1, 0.0, 1);
INSERT INTO nom_tipodedia (idtipodedia, denominacion, descripcion, color, fdesde, fhasta, trabajo, abreviatura, feriado) VALUES (1, 'Feriado', NULL, '#008000', '2020-02-24', NULL, 0, 'FER', 1);
INSERT INTO nom_tipodedia (idtipodedia, denominacion, descripcion, color, fdesde, fhasta, trabajo, abreviatura, feriado) VALUES (3, 'Laborable', NULL, '#3366FF', '2020-02-24', NULL, 1, 'LAB', 0);
INSERT INTO nom_tipodedia (idtipodedia, denominacion, descripcion, color, fdesde, fhasta, trabajo, abreviatura, feriado) VALUES (2, 'Festivo', NULL, '#FF00FF', '2020-02-24', NULL, 0, 'FES', 0);
INSERT INTO nom_tipodedia (idtipodedia, denominacion, descripcion, color, fdesde, fhasta, trabajo, abreviatura, feriado) VALUES (4, 'No laborable', NULL, '#FF6600', '2020-02-24', NULL, 0, 'NLA', 0);
INSERT INTO nom_tipodedia (idtipodedia, denominacion, descripcion, color, fdesde, fhasta, trabajo, abreviatura, feriado) VALUES (12, 'Trabajo Extraordinario', NULL, '#800080', '2020-02-24', NULL, 1, 'FLA', 0);
INSERT INTO nom_tipodedia (idtipodedia, denominacion, descripcion, color, fdesde, fhasta, trabajo, abreviatura, feriado) VALUES (8, 'Irregular', NULL, '#CC99FF', '2020-02-24', NULL, 1, 'IRR', 0);
INSERT INTO nom_tipodedia (idtipodedia, denominacion, descripcion, color, fdesde, fhasta, trabajo, abreviatura, feriado) VALUES (13, 'Receso laboral', NULL, '#003300', '2020-02-24', NULL, 0, 'RL', 0);
INSERT INTO nom_turnotrabajo (idturnotrabajo, denominacion, descripcion, fdesde, fhasta, horainicio, horafin, toleranciaentrada, toleranciasalida, horarioalmuerzo, tiempodescanso, horaentradaps, horasalidaps, horaentradass, horasalidass, otrodia, horas) VALUES (6, 'Turno de 8 horas', NULL, '2020-02-24', NULL, '08:00:00', '17:00:00', '00:00:00', '00:00:00', '12:00:00', '01:00:00', NULL, NULL, NULL, NULL, 0, NULL);
INSERT INTO nom_turnotrabajo (idturnotrabajo, denominacion, descripcion, fdesde, fhasta, horainicio, horafin, toleranciaentrada, toleranciasalida, horarioalmuerzo, tiempodescanso, horaentradaps, horasalidaps, horaentradass, horasalidass, otrodia, horas) VALUES (9, 'Turno de 12 horas 7pm - 7am', NULL, '2020-02-24', NULL, '19:00:00', '07:00:00', '00:00:00', '00:00:00', '23:00:00', '01:00:00', NULL, NULL, NULL, NULL, 1, NULL);
INSERT INTO nom_turnotrabajo (idturnotrabajo, denominacion, descripcion, fdesde, fhasta, horainicio, horafin, toleranciaentrada, toleranciasalida, horarioalmuerzo, tiempodescanso, horaentradaps, horasalidaps, horaentradass, horasalidass, otrodia, horas) VALUES (8, 'Turno de 12 horas 7am - 7pm', NULL, '2020-02-24', NULL, '07:00:00', '19:00:00', '00:00:00', '00:00:00', '12:00:00', '01:00:00', NULL, NULL, NULL, NULL, 0, NULL);
INSERT INTO nom_turnotrabajo (idturnotrabajo, denominacion, descripcion, fdesde, fhasta, horainicio, horafin, toleranciaentrada, toleranciasalida, horarioalmuerzo, tiempodescanso, horaentradaps, horasalidaps, horaentradass, horasalidass, otrodia, horas) VALUES (5, 'Turno de 24 horas', NULL, '2020-02-24', NULL, '08:00:00', '08:00:00', '00:00:00', '00:00:00', '12:00:00', '01:00:00', NULL, NULL, NULL, NULL, 1, NULL);
INSERT INTO nom_turnotrabajo (idturnotrabajo, denominacion, descripcion, fdesde, fhasta, horainicio, horafin, toleranciaentrada, toleranciasalida, horarioalmuerzo, tiempodescanso, horaentradaps, horasalidaps, horaentradass, horasalidass, otrodia, horas) VALUES (7, 'Turno de 8 a 5:30', NULL, '2020-02-24', NULL, '08:00:00', '17:30:00', '00:00:00', '00:00:00', '12:00:00', '01:00:00', NULL, NULL, NULL, NULL, 0, NULL);
SELECT pg_catalog.setval('sec_asistenciamensual_seq', 0, true);
SELECT pg_catalog.setval('sec_asistenciasesion_seq', 1, true);
SELECT pg_catalog.setval('sec_calendario_seq', 1, true);
SELECT pg_catalog.setval('sec_causasreporteausencia_seq', 1, true);
SELECT pg_catalog.setval('sec_conf_calendariopersona_seq', 1, true);
SELECT pg_catalog.setval('sec_conf_estructurahorario_seq', 1, true);
SELECT pg_catalog.setval('sec_conf_estructurareloj_seq', 1, true);
SELECT pg_catalog.setval('sec_conf_estructuras_seq', 1, true);
SELECT pg_catalog.setval('sec_conf_estructuratempus_seq', 1, true);
SELECT pg_catalog.setval('sec_dat_asistencia_seq', 1, true);
SELECT pg_catalog.setval('sec_dat_estructuraasistencia_seq', 1, true);
SELECT pg_catalog.setval('sec_diaferiadohabilitado_seq', 1, true);
SELECT pg_catalog.setval('sec_grupodescanso_seq', 2, true);
SELECT pg_catalog.setval('sec_horarionocturnidad_seq', 7, true);
SELECT pg_catalog.setval('sec_indicador_seq', 1, true);
SELECT pg_catalog.setval('sec_indicadoresporreporte_seq', 1, true);
SELECT pg_catalog.setval('sec_nom_causa_seq', 660, true);
SELECT pg_catalog.setval('sec_periodomes_seq', 0, true);
SELECT pg_catalog.setval('sec_periodoquincena_seq', 0, true);
SELECT pg_catalog.setval('sec_planvacaciones_seq', 0, true);
SELECT pg_catalog.setval('sec_regimentrabajo_seq', 2, true);
SELECT pg_catalog.setval('sec_registromodelovac_seq', 0, true);
SELECT pg_catalog.setval('sec_reporte_seq', 1, true);
SELECT pg_catalog.setval('sec_rotacion_seq', 0, true);
SELECT pg_catalog.setval('sec_rotacionturno_seq', 0, true);
SELECT pg_catalog.setval('sec_subordinacion_seq', 1, true);
SELECT pg_catalog.setval('sec_tipodedia_seq', 13, true);
SELECT pg_catalog.setval('sec_turnosesion_seq', 1, true);
SELECT pg_catalog.setval('sec_turnotrabajo_seq', 9, true);
--</Data>

--<Restrictions>
-- Created By : ScriptSplitGenerador
-- Code: http://10.12.170.129:9880/ch_regimentrabajo/trunk/lineabase
-- Only Restrictions
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = mod_regimentrabajo, pg_catalog;
ALTER TABLE ONLY dat_indicadoresporreporte
    ADD CONSTRAINT ak_reporte_orden UNIQUE (idreporte, orden);
ALTER TABLE ONLY conf_calendariopersona
    ADD CONSTRAINT conf_calendariopersona_pkey PRIMARY KEY (idcalendariopersona);
ALTER TABLE ONLY conf_estructurahorario
    ADD CONSTRAINT conf_estructurahorario_pkey PRIMARY KEY (idestructurahorario);
ALTER TABLE ONLY conf_estructurareloj
    ADD CONSTRAINT conf_estructurareloj_pkey PRIMARY KEY (idestructurareloj);
ALTER TABLE ONLY conf_estructuras
    ADD CONSTRAINT conf_estructuras_dat_habcausa_pkey PRIMARY KEY (id);
ALTER TABLE ONLY conf_estructuratempus
    ADD CONSTRAINT conf_estructuratempus_pkey PRIMARY KEY (idestructuratempus);
ALTER TABLE ONLY conf_habcontrolacceso
    ADD CONSTRAINT conf_habcontrolacceso_dat_habilitarhorarioentradasalida_pkey PRIMARY KEY (id);
ALTER TABLE ONLY conf_habilitarfinmes
    ADD CONSTRAINT conf_habilitarfinmes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY conf_habilitarsesiones
    ADD CONSTRAINT conf_habilitarsesiones_pkey PRIMARY KEY (idhabilitarsesion);
ALTER TABLE ONLY conf_habilitarsubmayorvac
    ADD CONSTRAINT conf_habilitarsubmayorvac_pkey PRIMARY KEY (id);
ALTER TABLE ONLY dat_asistencia
    ADD CONSTRAINT dat_asistencia_idx UNIQUE (idpersona, fecharegistro);
ALTER TABLE ONLY dat_asistencia
    ADD CONSTRAINT dat_asistencia_pkey PRIMARY KEY (idasistencia);
ALTER TABLE ONLY dat_diaferiadohabilitado
    ADD CONSTRAINT dat_diaferiadohabilitado_pkey PRIMARY KEY (iddiaferiadohabilitado);
ALTER TABLE ONLY dat_estructuraasistencia
    ADD CONSTRAINT dat_estructuraasistencia_pkey PRIMARY KEY (idestructuraasistencia);
ALTER TABLE ONLY conf_habcausa
    ADD CONSTRAINT dat_habcausa_pkey PRIMARY KEY (id);
ALTER TABLE ONLY conf_habilitarhorarioentradasalida
    ADD CONSTRAINT dat_habilitarhorarioentradasalida_pkey PRIMARY KEY (id);
ALTER TABLE ONLY dat_periodomes
    ADD CONSTRAINT dat_periodomes_pkey PRIMARY KEY (idperiodomes);
ALTER TABLE ONLY dat_periodoquincena
    ADD CONSTRAINT dat_periodoquincena_pkey PRIMARY KEY (idperiodoquincena);
ALTER TABLE ONLY nom_horarionocturnidad
    ADD CONSTRAINT nom_horarionocturnidad_pkey PRIMARY KEY (idhorarionocturnidad);
ALTER TABLE ONLY nom_turnotrabajo
    ADD CONSTRAINT nom_turnotrabajo_pkey PRIMARY KEY (idturnotrabajo);
ALTER TABLE ONLY dat_asistenciamensual
    ADD CONSTRAINT pk_asistenciamensual PRIMARY KEY (idasistenciamensual);
ALTER TABLE ONLY dat_asistenciasesion
    ADD CONSTRAINT pk_asistenciasesion PRIMARY KEY (idasistenciasesion);
ALTER TABLE ONLY dat_baseporindicador
    ADD CONSTRAINT pk_baseporindicador PRIMARY KEY (idindicadorbase, idindicador);
ALTER TABLE ONLY conf_calendario
    ADD CONSTRAINT pk_calendario PRIMARY KEY (idcalendario);
ALTER TABLE ONLY nom_causa
    ADD CONSTRAINT pk_causa PRIMARY KEY (idcausa);
ALTER TABLE ONLY dat_causaindicador
    ADD CONSTRAINT pk_causaindicador PRIMARY KEY (idcausa, idindicador);
ALTER TABLE ONLY dat_causasreporteausencia
    ADD CONSTRAINT pk_causasreporteausencia PRIMARY KEY (idcausasreporteausencia);
ALTER TABLE ONLY nom_grupodescanso
    ADD CONSTRAINT pk_grupodescanso PRIMARY KEY (idgrupodescanso);
ALTER TABLE ONLY conf_horasextras
    ADD CONSTRAINT pk_horasextras PRIMARY KEY (id);
ALTER TABLE ONLY dat_indicador
    ADD CONSTRAINT pk_indicador PRIMARY KEY (idindicador);
ALTER TABLE ONLY dat_indicadoresporreporte
    ADD CONSTRAINT pk_indicadoresporreporte PRIMARY KEY (idindicadorporreporte);
ALTER TABLE ONLY dat_planvacaciones
    ADD CONSTRAINT pk_planvacaciones PRIMARY KEY (idplanvacaciones);
ALTER TABLE ONLY nom_regimentrabajo
    ADD CONSTRAINT pk_regimentrabajo PRIMARY KEY (idregimentrabajo);
ALTER TABLE ONLY nom_reporte
    ADD CONSTRAINT pk_reporte PRIMARY KEY (idreporte);
ALTER TABLE ONLY nom_rotacion
    ADD CONSTRAINT pk_rotacion PRIMARY KEY (idrotacion);
ALTER TABLE ONLY dat_rotacionturno
    ADD CONSTRAINT pk_rotacionturno PRIMARY KEY (idrotacionturno);
ALTER TABLE ONLY dat_subordinacion
    ADD CONSTRAINT pk_subordinacion PRIMARY KEY (idsubordinacion);
ALTER TABLE ONLY nom_tipodedia
    ADD CONSTRAINT pk_tipodedia PRIMARY KEY (idtipodedia);
ALTER TABLE ONLY nom_turnosesion
    ADD CONSTRAINT pk_turnosesion PRIMARY KEY (idturnosesion);
CREATE INDEX conf_calendariopersona_fecha_idx ON conf_calendariopersona USING btree (fecha);
CREATE INDEX conf_calendariopersona_idpersona_fecha_idx ON conf_calendariopersona USING btree (idpersona, fecha, idcargo);
CREATE INDEX conf_calendariopersona_idpersona_idx ON conf_calendariopersona USING btree (idpersona);
CREATE UNIQUE INDEX conf_calendariopersona_unique_idpersona_fecha_idcargo_idx ON conf_calendariopersona USING btree (idpersona, fecha, idcargo);
CREATE INDEX fki_causa_causa_idpadre ON nom_causa USING btree (idpadre);
CREATE INDEX fki_idicador_causaindicador ON dat_causaindicador USING btree (idindicador);
CREATE INDEX fki_indicador_baseporindicador_idindicador ON dat_baseporindicador USING btree (idindicador);
CREATE INDEX fki_rotacion_rotacionturno_idrotacion ON dat_rotacionturno USING btree (idrotacion);
CREATE INDEX fki_trunotrabajo_rotacionturno_idturnotrabajo ON dat_rotacionturno USING btree (idturnotrabajo);
CREATE INDEX fki_turnotrabajo_calendario ON conf_calendario USING btree (idturnotrabajo);
CREATE INDEX idx_asistencia_idcausa ON dat_asistencia USING btree (idcausa);
CREATE INDEX idx_asistencia_idpadre ON dat_asistencia USING btree (idpadre);
CREATE INDEX idx_asistencia_idpersona ON dat_asistencia USING btree (idpersona);
CREATE INDEX idx_calendario_idestructuraasistencia ON conf_calendario USING btree (idgrupodescanso);
CREATE INDEX idx_causasreporteausencia_idcausa ON dat_causasreporteausencia USING btree (idcausa);
CREATE INDEX idx_estructuraasistencia_idcargo ON dat_estructuraasistencia USING btree (idcargo);
CREATE INDEX idx_estructuraasistencia_idpersona ON dat_estructuraasistencia USING btree (idpersona);
CREATE INDEX idx_subordinacion_idestructuraasistencia ON dat_subordinacion USING btree (idestructuraasistencia);
CREATE INDEX idx_subordinacion_idpersona ON dat_subordinacion USING btree (idpersona);
CREATE TRIGGER t_actualizar_horas AFTER INSERT OR UPDATE OF horainicio, horafin, tiempodescanso ON nom_turnotrabajo FOR EACH ROW EXECUTE PROCEDURE ft_actualizar_horas_turnotrabajo();
CREATE TRIGGER t_cerrar_asistencia_incompleta AFTER UPDATE OF certificado ON dat_asistencia FOR EACH ROW WHEN ((new.certificado = (1)::numeric)) EXECUTE PROCEDURE ft_certificar_asistencia();
COMMENT ON TRIGGER t_cerrar_asistencia_incompleta ON dat_asistencia IS 'cuando la columna certificado tome valor 1 verificar si :
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
CREATE TRIGGER t_insertar BEFORE INSERT ON dat_estructuraasistencia FOR EACH ROW EXECUTE PROCEDURE ft_insertar_estructuraasistencia();
CREATE TRIGGER t_insertar BEFORE INSERT ON nom_causa FOR EACH ROW EXECUTE PROCEDURE ft_insertar_causa();
ALTER TABLE ONLY dat_asistenciasesion
    ADD CONSTRAINT dat_asistenciasesion_fk FOREIGN KEY (idcausa) REFERENCES nom_causa(idcausa) ON UPDATE CASCADE;
ALTER TABLE ONLY dat_asistenciasesion
    ADD CONSTRAINT fk_asistencia_asistenciasesion_idasistencia FOREIGN KEY (idasistencia) REFERENCES dat_asistencia(idasistencia) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_causa
    ADD CONSTRAINT fk_causa_causa_idpadre FOREIGN KEY (idpadre) REFERENCES nom_causa(idcausa) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_causaindicador
    ADD CONSTRAINT fk_causa_causaindicador FOREIGN KEY (idcausa) REFERENCES nom_causa(idcausa) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_causasreporteausencia
    ADD CONSTRAINT fk_causa_causasreporteausencia_idcausa FOREIGN KEY (idcausa) REFERENCES nom_causa(idcausa) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_indicadoresporreporte
    ADD CONSTRAINT fk_causa_indicadoresporreporte_idcausa FOREIGN KEY (idcausa) REFERENCES nom_causa(idcausa) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY conf_calendario
    ADD CONSTRAINT fk_grupodescanso_calendario FOREIGN KEY (idgrupodescanso) REFERENCES nom_grupodescanso(idgrupodescanso) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_estructuraasistencia
    ADD CONSTRAINT fk_idestructuraasistencia_idpadre FOREIGN KEY (idpadre) REFERENCES dat_estructuraasistencia(idestructuraasistencia) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_causaindicador
    ADD CONSTRAINT fk_idicador_causaindicador FOREIGN KEY (idindicador) REFERENCES dat_indicador(idindicador) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_baseporindicador
    ADD CONSTRAINT fk_indicador_baseporindicador_idindicador FOREIGN KEY (idindicador) REFERENCES dat_indicador(idindicador) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_indicadoresporreporte
    ADD CONSTRAINT fk_indicador_indicadoresporreporte_idindicador FOREIGN KEY (idindicador) REFERENCES dat_indicador(idindicador) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_grupodescanso
    ADD CONSTRAINT fk_regimentrabajo_grupodescanso_idregimentrabajo FOREIGN KEY (idregimentrabajo) REFERENCES nom_regimentrabajo(idregimentrabajo) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_indicadoresporreporte
    ADD CONSTRAINT fk_reporte_indicadoresporreporte_idreporte FOREIGN KEY (idreporte) REFERENCES nom_reporte(idreporte) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_rotacionturno
    ADD CONSTRAINT fk_rotacion_rotacionturno_idrotacion FOREIGN KEY (idrotacion) REFERENCES nom_rotacion(idrotacion) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY conf_calendario
    ADD CONSTRAINT fk_tipodedia_calendario FOREIGN KEY (idtipodedia) REFERENCES nom_tipodedia(idtipodedia) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_rotacionturno
    ADD CONSTRAINT fk_trunotrabajo_rotacionturno_idturnotrabajo FOREIGN KEY (idturnotrabajo) REFERENCES nom_turnotrabajo(idturnotrabajo) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY nom_turnosesion
    ADD CONSTRAINT fk_trunotrabajo_turnosesion_idturnotrabajo FOREIGN KEY (idturnotrabajo) REFERENCES nom_turnotrabajo(idturnotrabajo) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY conf_calendario
    ADD CONSTRAINT fk_turnotrabajo_calendario FOREIGN KEY (idturnotrabajo) REFERENCES nom_turnotrabajo(idturnotrabajo) ON UPDATE CASCADE ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;
--<Update 16/08/2021>
CREATE INDEX idx_dat_asistencia_idturnotrabajo ON mod_regimentrabajo.dat_asistencia USING btree (idturnotrabajo);
CREATE INDEX idx_dat_asistencia_idpersonamodifica ON mod_regimentrabajo.dat_asistencia USING btree (idpersonamodifica);
CREATE INDEX idx_dat_asistencia_idpersonacontrola ON mod_regimentrabajo.dat_asistencia USING btree (idpersonacontrola);
CREATE INDEX idx_dat_asistencia_idpersonacertifica ON mod_regimentrabajo.dat_asistencia USING btree (idpersonacertifica);
CREATE INDEX idx_dat_asistencia_idpersonaaprueba ON mod_regimentrabajo.dat_asistencia USING btree (idpersonaaprueba);
CREATE INDEX idx_dat_asistencia_idcargo ON mod_regimentrabajo.dat_asistencia USING btree (idcargo);
CREATE INDEX idx_dat_asistencia_fhasta ON mod_regimentrabajo.dat_asistencia USING btree (fhasta);
CREATE INDEX idx_dat_asistencia_fecharegistro ON mod_regimentrabajo.dat_asistencia USING btree (fecharegistro);
CREATE INDEX idx_dat_asistencia_fechahorasalida ON mod_regimentrabajo.dat_asistencia USING btree (fechahorasalida);
CREATE INDEX idx_dat_asistencia_fdesde ON mod_regimentrabajo.dat_asistencia USING btree (fdesde);
CREATE INDEX idx_dat_asistencia_actualizado ON mod_regimentrabajo.dat_asistencia USING btree (actualizado);
CREATE INDEX dat_registro_idx_asistencia_idpersona ON mod_regimentrabajo.dat_registro USING btree (idpersona);
--<Update>
--</Restrictions>
--<Dependents>
ALTER TABLE ONLY dat_asistencia
    ADD CONSTRAINT fk_persona_asistencia_idpersona FOREIGN KEY (idpersona) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_asistencia
    ADD CONSTRAINT fk_persona_asistencia_idpersonacertifica FOREIGN KEY (idpersonacertifica) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY dat_asistencia
    ADD CONSTRAINT fk_persona_asistencia_idpersonacontrola FOREIGN KEY (idpersonacontrola) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY dat_asistencia
    ADD CONSTRAINT fk_persona_asistencia_idpersonamodifica FOREIGN KEY (idpersonamodifica) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY dat_diaferiadohabilitado
    ADD CONSTRAINT fk_persona_diaferiadohabilitado_idpersona FOREIGN KEY (idpersona) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_estructuraasistencia
    ADD CONSTRAINT fk_persona_estructuraasistencia_idpersona FOREIGN KEY (idpersona) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_planvacaciones
    ADD CONSTRAINT fk_persona_planvacaciones_idpersona FOREIGN KEY (idpersona) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_subordinacion
    ADD CONSTRAINT fk_persona_subordinacion_idpersona FOREIGN KEY (idpersona) REFERENCES mod_persona.dat_persona(idpersona) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY dat_asistencia
    ADD CONSTRAINT fk_filaestruc_asistencia_idcargo FOREIGN KEY (idcargo) REFERENCES mod_estructuracomp.nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE SET NULL;
--</Dependents>