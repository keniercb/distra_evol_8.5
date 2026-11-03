ALTER TABLE IF EXISTS mod_regimentrabajo.dat_asistenciamultiplescausas
    ADD COLUMN IF NOT EXISTS fechaentrada timestamp without time zone;

ALTER TABLE IF EXISTS mod_regimentrabajo.dat_asistenciamultiplescausas
    ADD COLUMN IF NOT EXISTS fechasalida timestamp without time zone;

UPDATE mod_regimentrabajo.dat_asistenciamultiplescausas
	SET fechaentrada = (fecharegistro::text || ' ' || horaentrada::text)::timestamp, fechasalida = (fecharegistro::text || ' ' || horasalida::text)::timestamp
;

ALTER TABLE IF EXISTS mod_regimentrabajo.dat_asistenciamultiplescausas
    ALTER COLUMN fechaentrada SET NOT NULL;

ALTER TABLE IF EXISTS mod_regimentrabajo.dat_asistenciamultiplescausas
    ALTER COLUMN fechasalida SET NOT NULL;

--------

ALTER TABLE IF EXISTS mod_regimentrabajo.dat_asistencia
    ADD COLUMN IF NOT EXISTS fechahoraentrada_multicausa timestamp without time zone;

ALTER TABLE IF EXISTS mod_regimentrabajo.dat_asistencia
    ADD COLUMN IF NOT EXISTS fechahorasalida_multicausa timestamp without time zone;

-------

-- FUNCTION: mod_regimentrabajo.f_listadopersonastiempocausas(numeric[], numeric[], numeric[], date, date, numeric[])

-- DROP FUNCTION IF EXISTS mod_regimentrabajo.f_listadopersonastiempocausas(numeric[], numeric[], numeric[], date, date, numeric[]);

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
v_r_amulticausa record;
v_resultado record;
v_in_tipodia numeric;
v_td_tiempo_causa mod_regimentrabajo.td_persona_tiempo_causa1;

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
  fdesde date,
  fhasta date,
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
	--por cada persona.
	for v_persona in 1 .. array_length($2, 1) loop		
		--buscar personas implicadas con la causa en cuestión.
		for v_r_asistencia in (select idasistencia, idpersona, idcausa, fecharegistro, fdesde, fhasta, hrsdescontadas, 
								case when hrsdescontadas = '' then null::interval else (hrsdescontadas::interval) end as tiempo
        						, certificadocontinuado as certificadocontinuado
								from mod_regimentrabajo.dat_asistencia
								where idcausa = $1[v_causa] and idpersona = $2[v_persona]) loop
			if (v_r_asistencia.idasistencia is not null) then
					--analizar las fechas del período
					if ( (v_r_asistencia.fdesde is not null) and (v_r_asistencia.fhasta is not null) ) then
						if ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde = $5)) then
							-- (0) $4 < fdesde = $5
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fdesde) and (c.idpersona = $2[v_persona]);
                            --contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fdesde) and (c.idpersona = $2[v_persona]);
						elsif ( ($4 = v_r_asistencia.fhasta) and (v_r_asistencia.fhasta < $5) ) then
							-- (0) $4 = fhasta < $5
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha = v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);										
						elsif ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 <= v_r_asistencia.fhasta) ) then
							-- (1) $4 < fdesde < $5 <= fhasta
							-- calcular nuevo descuento con (fdesde y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 < $5) and ($5 < v_r_asistencia.fhasta) ) then
							-- (2) fdesde < $4 < $5 < fhasta
							-- calcular nuevo descuento con ($4 y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);						
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);						
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 <= v_r_asistencia.fhasta) and (v_r_asistencia.fhasta < $5) ) then
							-- (3) fdesde < $4 <= fhasta < $5
							-- calcular nuevo descuento con ($4 y fhasta)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);
						elsif ( (v_r_asistencia.fdesde < $4) and ($4 < v_r_asistencia.fhasta) and (v_r_asistencia.fhasta = $5) ) then
							-- (4) fdesde < $4 < fhasta = $5
							-- calcular nuevo descuento con ($4 y fhasta)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);						
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= $4) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);						
						elsif ( ($4 = v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 <= v_r_asistencia.fhasta) ) then
							-- (5) $4 = fdesde < $5 <= fhasta
							-- calcular nuevo descuento con (fdesde y $5)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);						
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= $5) and (c.idpersona = $2[v_persona]);						
						elsif ( ($4 = v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 > v_r_asistencia.fhasta) ) then
							-- (5.1) $4 = fdesde < $5 > fhasta
							-- calcular nuevo descuento con (fdesde y fhasta)
							select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);						
							--contar dias
                            select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
							where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);						
						else
							-- (6) $4 < fdesde < $5 > fhasta
							if ( ($4 < v_r_asistencia.fdesde) and (v_r_asistencia.fdesde < $5) and ($5 > v_r_asistencia.fhasta) ) then
								select sum(c.horas) into v_calculo_descuento from mod_regimentrabajo.conf_calendariopersona c 
								where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);						
								--contar dias
                                select count(idcalendariopersona) into v_contar from mod_regimentrabajo.conf_calendariopersona c 
								where (idtipodedia IN (select id from mod_regimentrabajo.in_tipodia)) and (c.fecha >= v_r_asistencia.fdesde) and (c.fecha <= v_r_asistencia.fhasta) and (c.idpersona = $2[v_persona]);						
							end if;
						end if;   
						v_suma_descuento := v_suma_descuento + v_calculo_descuento;
                        --sumar dias contados por causa
                        v_suma_dias := v_suma_dias + v_contar;		
						v_calculo_descuento := '00:00:00';
                        v_contar := 0;
					else
						-- (2) fecharegistro ( Ej: ausente, llegada tarde)
						-- RECURSO SELECT to_date('2016-11-14 08:00:00','YY-MM-DD');
						if ( (v_r_asistencia.fecharegistro is not null) and (v_r_asistencia.fecharegistro >= $4) and (v_r_asistencia.fecharegistro <= $5) ) then
							v_suma_descuento := v_suma_descuento + v_r_asistencia.tiempo;
                            v_suma_dias := count(v_r_asistencia.idasistencia);
						end if;
					end if;
                    
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
                    
                    				
				INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias, v_r_asistencia.fdesde, v_r_asistencia.fhasta, v_mes_calculo);
				v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; v_td_tiempo_causa.tiempo = v_suma_descuento;
				v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00';
                v_suma_dias := 0; v_contar := 0;
                --RETURN NEXT v_td_tiempo_causa;
                v_mes_calculo := null;
			end if;
            
		end loop;
	    INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_suma_descuento,v_suma_dias, v_r_asistencia.fdesde, v_r_asistencia.fhasta);			    
		v_td_tiempo_causa.idpersona = $2[v_persona]; v_td_tiempo_causa.idcausa = $1[v_causa]; 
        v_td_tiempo_causa.tiempo = v_suma_descuento;
		v_suma_descuento := '00:00:00'; v_calculo_descuento := '00:00:00'; 
        --reiniciar sumador de dias
        v_suma_dias := 0;

		for v_r_amulticausa in (
			select act.idasistencia, act.idpersona, amc.idcausa, act.fecharegistro, amc.fechaentrada::date as fdesde, amc.fechasalida::date as fhasta, amc.horas, 
			case when amc.horas = '' then null::interval else (amc.horas::interval) end as tiempo,
			1::numeric as dias
			from mod_regimentrabajo.dat_asistencia act
			inner join mod_regimentrabajo.dat_asistenciamultiplescausas amc on act.idasistencia = amc.idasistencia
			where amc.idcausa = $1[v_causa] and act.idpersona = $2[v_persona]
		) loop

			INSERT INTO tmp_persona_tiempo_causa VALUES ($1[v_causa],$2[v_persona],v_r_amulticausa.tiempo ,v_r_amulticausa.dias , v_r_amulticausa.fdesde, v_r_amulticausa.fhasta, null);

		end loop;
	end loop;
end loop;

for v_resultado in (select idpersona as idp, idcausa as idc, sum(suma) as sumatoria, sum(dias) as cont_dias, fdesde, fhasta, mesyearanterior as mesyearanterior
from tmp_persona_tiempo_causa where dias <> 0 group by idpersona, idcausa, fdesde, fhasta, mesyearanterior order by idpersona,idcausa) loop
	v_td_tiempo_causa.idpersona = v_resultado.idp; v_td_tiempo_causa.idcausa = v_resultado.idc; v_td_tiempo_causa.tiempo = v_resultado.sumatoria;
    v_td_tiempo_causa.contdias = v_resultado.cont_dias;v_td_tiempo_causa.fdesde = v_resultado.fdesde;v_td_tiempo_causa.fhasta = v_resultado.fhasta;
    v_td_tiempo_causa.mesanteriorcertificado = v_resultado.mesyearanterior;
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

COMMENT ON FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas(numeric[], numeric[], numeric[], date, date, numeric[])
    IS 'SELECT * from mod_regimentrabajo.f_listadopersonastiempocausas( ''{idcausa separados por coma}'', ''{idpersona separados por coma}'', ''{idgrupodescanso separados por coma}'', fecha_i, fecha_f, idtipo);';
