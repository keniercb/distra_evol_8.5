CREATE SEQUENCE mod_regimentrabajo.sec_conf_categoriacausas_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;

CREATE SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 5
  CACHE 1;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
IS 'Secuencia empleada para autogenerar el identificador de la tabla "conf_fondodetiempo".';

ALTER TABLE mod_regimentrabajo.nom_grupodescanso
  DROP CONSTRAINT fk_regimentrabajo_grupodescanso_idregimentrabajo RESTRICT;

DROP INDEX mod_regimentrabajo.idx_asistenciamensual_idpersona;

ALTER TYPE mod_regimentrabajo.td_persona_tiempo_causa
  ADD ATTRIBUTE contdias NUMERIC;

SET check_function_bodies = FALSE;

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
COST 10;

SET check_function_bodies = TRUE;

SET check_function_bodies = FALSE;

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

SET check_function_bodies = TRUE;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_asistenciasesion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_asistenciasesion".';

COMMENT ON SEQUENCE mod_regimentrabajo.sec_calendario_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_calendario_distra".';

ALTER SEQUENCE mod_regimentrabajo.sec_conf_estructuras_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999999 START 417
  RESTART 561 CACHE 1
  NO CYCLE;

ALTER SEQUENCE mod_regimentrabajo.sec_registromodelovac_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  RESTART 4117 CACHE 1
  NO CYCLE;

COMMENT ON SEQUENCE mod_regimentrabajo.sec_turnosesion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_turnosesion".';

SET check_function_bodies = FALSE;

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
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

SET check_function_bodies = TRUE;

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

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.actualizado
IS '0-No actualizado desde control de acceso
1-Actualizado desde control de acceso';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fhabilitado
IS 'indica si el dia fue 
feriado y habilitado para la persona';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.hferiadas
IS 'cantidad de horas feriadas habilitadas trabajadas';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.certificado
IS '';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonacertifica
IS '';

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ALTER COLUMN aprobado DROP DEFAULT;

COMMENT ON COLUMN mod_regimentrabajo.nom_causa.eliminar
IS '1  No eliminar
0  Eliminar';

COMMENT ON COLUMN mod_regimentrabajo.nom_causa.cantincidencias
IS 'Cantidad de incidencias de la causa en el periodo configurado en el sistema';

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN toleranciaentrada DROP NOT NULL;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN toleranciasalida DROP NOT NULL;

ALTER TABLE mod_regimentrabajo.nom_turnotrabajo
  ALTER COLUMN tiempodescanso TYPE TIME(0) WITHOUT TIME ZONE;

CREATE TABLE mod_regimentrabajo.conf_categoriacausas (
  idcategoriacausa NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_categoriacausas_seq'::regclass) NOT NULL,
  idcategoria NUMERIC(19,1) NOT NULL,
  idcausa NUMERIC(19,1) NOT NULL,
  CONSTRAINT conf_categoriacausas_pkey PRIMARY KEY(idcategoriacausa)
) 
WITH (oids = false);

CREATE TABLE mod_regimentrabajo.conf_fondodetiempo (
  id NUMERIC(19,1) DEFAULT nextval('mod_regimentrabajo.sec_conf_fondodetiempo_seq'::regclass) NOT NULL,
  idcategoria NUMERIC(19,1) NOT NULL,
  fondodetiempo NUMERIC(19,1) NOT NULL,
  CONSTRAINT conf_fondodetiempo_pkey PRIMARY KEY(id)
) 
WITH (oids = false);

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

ALTER TABLE mod_regimentrabajo.dat_registromodelovac
  DROP COLUMN fecha;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  DROP COLUMN fecha;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  DROP COLUMN registro;

ALTER TABLE mod_regimentrabajo.dat_asistenciamensual
  DROP COLUMN idpersona;

DROP FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas_old18122018(p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric);

DROP FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas_old(p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric);

DROP FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas3(p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric []);

DROP TABLE mod_regimentrabajo.tmp_duplicadoscalendario;

DROP FUNCTION mod_regimentrabajo.f_actualizar_confcalendariopersona();

CREATE INDEX fki_indicador_baseporindicador_idindicador ON mod_regimentrabajo.dat_baseporindicador
  USING btree (idindicador);

CREATE INDEX fki_turnotrabajo_calendario ON mod_regimentrabajo.conf_calendario
  USING btree (idturnotrabajo);

ALTER TABLE mod_regimentrabajo.nom_grupodescanso
  ADD CONSTRAINT fk_regimentrabajo_grupodescanso_idregimentrabajo FOREIGN KEY (idregimentrabajo)
    REFERENCES mod_regimentrabajo.nom_regimentrabajo(idregimentrabajo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_regimentrabajo.dat_rotacionturno
  ADD CONSTRAINT fk_trunotrabajo_rotacionturno_idturnotrabajo FOREIGN KEY (idturnotrabajo)
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

-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_asistencia0tupjb (
  idasistencia NUMERIC(19,0),
  fechahoraentrada TIMESTAMP WITHOUT TIME ZONE,
  idcausa NUMERIC(19,0),
  fdesde DATE,
  fhasta DATE,
  hrsdescontadas VARCHAR(8),
  idpersona NUMERIC(19,0),
  fechahorasalida TIMESTAMP WITHOUT TIME ZONE,
  fecharegistro DATE,
  observacion VARCHAR(500),
  idpadre NUMERIC(19,0),
  horasextras VARCHAR(8),
  idpersonacontrola NUMERIC(19,0),
  actualizado NUMERIC(1,0),
  fhabilitado NUMERIC(1,0),
  hferiadas VARCHAR(8),
  idcargo NUMERIC(19,0),
  idpersonamodifica NUMERIC(19,0),
  certificado NUMERIC(1,0),
  idpersonacertifica NUMERIC(19,0),
  hrstrabajadas TIME WITHOUT TIME ZONE,
  idgrupodescanso NUMERIC(19,0),
  idturnotrabajo NUMERIC(19,0),
  aprobado NUMERIC(1,0),
  idpersonaaprueba NUMERIC(19,0)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_asistencia0tupjb (idasistencia, fechahoraentrada, idcausa, fdesde, fhasta, hrsdescontadas, idpersona, fechahorasalida, fecharegistro, observacion, idpadre, horasextras, idpersonacontrola, actualizado, fhabilitado, hferiadas, idcargo, idpersonamodifica, certificado, idpersonacertifica, hrstrabajadas, idgrupodescanso, idturnotrabajo, aprobado, idpersonaaprueba)
SELECT idasistencia, fechahoraentrada, idcausa, fdesde, fhasta, hrsdescontadas, idpersona, fechahorasalida, fecharegistro, observacion, idpadre, horasextras, idpersonacontrola, actualizado, fhabilitado, hferiadas, idcargo, idpersonamodifica, certificado, idpersonacertifica, hrstrabajadas, idgrupodescanso, idturnotrabajo, aprobado, idpersonaaprueba FROM mod_regimentrabajo.dat_asistencia;

-- Drop the source table

DROP TABLE mod_regimentrabajo.dat_asistencia;

-- Create the destination table

CREATE TABLE mod_regimentrabajo.dat_asistencia (
  idasistencia NUMERIC(19,0) DEFAULT nextval('mod_regimentrabajo.sec_dat_asistencia_seq'::regclass) NOT NULL,
  fechahoraentrada TIMESTAMP WITHOUT TIME ZONE,
  idcausa NUMERIC(19,0),
  fdesde DATE,
  fhasta DATE,
  hrsdescontadas VARCHAR(8),
  idpersona NUMERIC(19,0) NOT NULL,
  fechahorasalida TIMESTAMP WITHOUT TIME ZONE,
  fecharegistro DATE NOT NULL,
  observacion VARCHAR(500),
  idpadre NUMERIC(19,0),
  horasextras VARCHAR(8),
  idpersonacontrola NUMERIC(19,0),
  actualizado NUMERIC(1,0) DEFAULT 0,
  fhabilitado NUMERIC(1,0) DEFAULT 0,
  hferiadas VARCHAR(8),
  idcargo NUMERIC(19,0),
  idpersonamodifica NUMERIC(19,0),
  certificado NUMERIC(1,0) DEFAULT 0,
  idpersonacertifica NUMERIC(19,0),
  hrstrabajadas TIME WITHOUT TIME ZONE DEFAULT '00:00:00'::time without time zone,
  idgrupodescanso NUMERIC(19,0),
  idturnotrabajo NUMERIC(19,0),
  aprobado NUMERIC(1,0),
  idpersonaaprueba NUMERIC(19,0),
  CONSTRAINT dat_asistencia_idx UNIQUE(idpersona, fecharegistro),
  CONSTRAINT dat_asistencia_pkey PRIMARY KEY(idasistencia),
  CONSTRAINT fk_filaestruc_asistencia_idcargo FOREIGN KEY (idcargo)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_persona_asistencia_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_persona_asistencia_idpersonacertifica FOREIGN KEY (idpersonacertifica)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_persona_asistencia_idpersonacontrola FOREIGN KEY (idpersonacontrola)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_persona_asistencia_idpersonamodifica FOREIGN KEY (idpersonamodifica)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonacontrola
IS 'Id del usuario que controla la asistencia';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.actualizado
IS '0-No actualizado desde control de acceso
1-Actualizado desde control de acceso';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.fhabilitado
IS 'indica si el dia fue 
feriado y habilitado para la persona';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.hferiadas
IS 'cantidad de horas feriadas habilitadas trabajadas';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idcargo
IS 'Identificador del cargo.';

COMMENT ON COLUMN mod_regimentrabajo.dat_asistencia.idpersonamodifica
IS 'Id del usuario que modifica la asistencia';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_regimentrabajo.dat_asistencia (idasistencia, fechahoraentrada, idcausa, fdesde, fhasta, hrsdescontadas, idpersona, fechahorasalida, fecharegistro, observacion, idpadre, horasextras, idpersonacontrola, actualizado, fhabilitado, hferiadas, idcargo, idpersonamodifica, certificado, idpersonacertifica, hrstrabajadas, idgrupodescanso, idturnotrabajo, aprobado, idpersonaaprueba)
SELECT idasistencia, fechahoraentrada, idcausa, fdesde, fhasta, hrsdescontadas, idpersona, fechahorasalida, fecharegistro, observacion, idpadre, horasextras, idpersonacontrola, actualizado, fhabilitado, hferiadas, idcargo, idpersonamodifica, certificado, idpersonacertifica, hrstrabajadas, idgrupodescanso, idturnotrabajo, aprobado, idpersonaaprueba FROM dat_asistencia0tupjb;

-- Create indices, triggers and rules

CREATE INDEX idx_asistencia_idcausa ON mod_regimentrabajo.dat_asistencia
  USING btree (idcausa);

CREATE INDEX idx_asistencia_idpadre ON mod_regimentrabajo.dat_asistencia
  USING btree (idpadre);

CREATE INDEX idx_asistencia_idpersona ON mod_regimentrabajo.dat_asistencia
  USING btree (idpersona);

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

-- Restore table's permissions

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_regimentrabajo.dat_asistencia TO zeolides;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER
  ON mod_regimentrabajo.dat_asistencia TO "PUBLIC";


-- Drop the temporary table

DROP TABLE dat_asistencia0tupjb;

