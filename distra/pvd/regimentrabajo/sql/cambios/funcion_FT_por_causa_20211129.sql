CREATE TYPE mod_regimentrabajo.td_persona_tiempo_causa1 AS (
  idpersona NUMERIC,
  idcausa NUMERIC,
  tiempo INTERVAL(6),
  contdias NUMERIC,
  fdesde DATE,
  fhasta DATE
);

ALTER TYPE mod_regimentrabajo.td_persona_tiempo_causa1
  OWNER TO zeolides;


CREATE OR REPLACE FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas (
  p_idcausa numeric [],
  p_idpersona numeric [],
  p_idgrupodescanso numeric [],
  p_desde date,
  p_hasta date,
  p_tipodia numeric []
)
RETURNS SETOF mod_regimentrabajo.td_persona_tiempo_causa1 AS
$body$
DECLARE
v_causa numeric;
v_persona numeric;

v_calculo_descuento interval := '00:00:00';
v_suma_descuento interval := '00:00:00';

v_r_asistencia record;
v_resultado record;
v_in_tipodia numeric;
v_td_tiempo_causa mod_regimentrabajo.td_persona_tiempo_causa1;

v_contar numeric := 0;
v_suma_dias numeric :=0;

BEGIN

CREATE TEMP TABLE IF NOT EXISTS tmp_persona_tiempo_causa
(
  idcausa numeric,
  idpersona numeric,
  suma interval,
  dias numeric,
  fdesde date,
  fhasta date
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

				INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias, v_r_asistencia.fdesde, v_r_asistencia.fhasta);
				v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; v_td_tiempo_causa.tiempo = v_suma_descuento;
				v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00';
                v_suma_dias := 0; v_contar := 0;
				--RETURN NEXT v_td_tiempo_causa;
			end if;
		end loop;
		raise notice 'La persona ( % ) NO TIENE registros con la causa ( % )',$2[v_persona],$1[v_causa];
	    INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias, v_r_asistencia.fdesde, v_r_asistencia.fhasta);
			    
		v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; 
        v_td_tiempo_causa.tiempo = v_suma_descuento;
		v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00'; 
        --reiniciar sumador de dias
        v_suma_dias := 0;
		--RETURN NEXT v_td_tiempo_causa;
	end loop;
end loop;

for v_resultado in (select idpersona as idp, idcausa as idc, sum(suma) as sumatoria, sum(dias) as cont_dias, fdesde, fhasta from tmp_persona_tiempo_causa group by idpersona, idcausa, fdesde, fhasta order by idpersona,idcausa) loop
	v_td_tiempo_causa.idpersona = v_resultado.idp; v_td_tiempo_causa.idcausa = v_resultado.idc; v_td_tiempo_causa.tiempo = v_resultado.sumatoria;
    v_td_tiempo_causa.contdias = v_resultado.cont_dias;v_td_tiempo_causa.fdesde = v_resultado.fdesde;v_td_tiempo_causa.fhasta = v_resultado.fhasta;
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

ALTER FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas (p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric [])
  OWNER TO zeolides;