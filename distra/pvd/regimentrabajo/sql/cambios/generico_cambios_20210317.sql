CREATE SEQUENCE mod_regimentrabajo.sec_conf_categoriacausas_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999999
  START 53
  CACHE 1;
ALTER TABLE mod_regimentrabajo.sec_conf_categoriacausas_seq
  OWNER TO zeolides;


CREATE TABLE mod_regimentrabajo.conf_categoriacausas
(
  idcategoriacausa numeric(19,1) NOT NULL DEFAULT nextval('mod_regimentrabajo.sec_conf_categoriacausas_seq'::regclass),
  idcategoria numeric(19,1) NOT NULL,
  idcausa numeric(19,1) NOT NULL,
  CONSTRAINT conf_categoriacausas_pkey PRIMARY KEY (idcategoriacausa)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_regimentrabajo.conf_categoriacausas
  OWNER TO zeolides;

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ADD COLUMN certificadocontinuado NUMERIC(1,0);

ALTER TABLE mod_regimentrabajo.dat_asistencia
  ALTER COLUMN certificadocontinuado SET DEFAULT 0;
  
  
  CREATE SEQUENCE mod_regimentrabajo.sec_conf_certificados_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999 START 1
  CACHE 1;

CREATE TABLE mod_regimentrabajo.conf_certificados (
  id NUMERIC DEFAULT nextval('mod_regimentrabajo.sec_conf_certificados_seq'::regclass) NOT NULL, 
  idcausa NUMERIC NOT NULL, 
  CONSTRAINT conf_certificados_pkey PRIMARY KEY(id)
) WITHOUT OIDS;


DROP FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas(p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric []);

DROP TYPE mod_regimentrabajo.td_persona_tiempo_causa CASCADE;

CREATE TYPE mod_regimentrabajo.td_persona_tiempo_causa AS (
  idpersona NUMERIC,
  idcausa NUMERIC,
  tiempo INTERVAL(6),
  contdias NUMERIC,
  mesanteriorcertificado varchar
);

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
    --buscar personas implicadas con la causa en cuestión.
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
COST 100 ROWS 1000;

COMMENT ON FUNCTION mod_regimentrabajo.f_listadopersonastiempocausas(p_idcausa numeric [], p_idpersona numeric [], p_idgrupodescanso numeric [], p_desde date, p_hasta date, p_tipodia numeric [])
IS 'SELECT * from mod_regimentrabajo.f_listadopersonastiempocausas( ''{idcausa separados por coma}'', ''{idpersona separados por coma}'', ''{idgrupodescanso separados por coma}'', fecha_i, fecha_f, idtipo);';

CREATE SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_seq;

ALTER SEQUENCE mod_regimentrabajo.sec_conf_conceptocausas_seq
    OWNER TO zeolides;

CREATE TABLE mod_regimentrabajo.conf_conceptocausas
(
    idconceptocausa numeric(19,1) NOT NULL DEFAULT nextval('mod_regimentrabajo.sec_conf_conceptocausas_seq'::regclass),
    idconcepto numeric(19,1) NOT NULL,
    idcausa numeric(19,1) NOT NULL,
    CONSTRAINT conf_conceptocausas_pkey PRIMARY KEY (idconceptocausa)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE mod_regimentrabajo.conf_conceptocausas
    OWNER to zeolides;

CREATE SEQUENCE mod_regimentrabajo.sec_dat_registro_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE mod_regimentrabajo.sec_dat_registro_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_dat_registro_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_asistencia".';

CREATE TABLE mod_regimentrabajo.dat_registro
(
  idregistro numeric(19,0) NOT NULL DEFAULT nextval('mod_regimentrabajo.sec_dat_registro_seq'::regclass),
  fechahoraentrada timestamp without time zone,
  idpersona numeric(19,0) NOT NULL,
  fechahorasalida timestamp without time zone,
  fecharegistro date NOT NULL,
  idcargo numeric(19,0), -- Identificador del cargo.
  CONSTRAINT dat_registro_pkey PRIMARY KEY (idregistro),
  CONSTRAINT dat_registro_idx UNIQUE (idpersona, fecharegistro)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_regimentrabajo.dat_registro
  OWNER TO zeolides;
COMMENT ON COLUMN mod_regimentrabajo.dat_registro.idcargo IS 'Identificador del cargo.';

CREATE INDEX dat_registro_idx_asistencia_idpersona
  ON mod_regimentrabajo.dat_registro
  USING btree
  (idpersona);

CREATE SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999999999
  START 7
  CACHE 1;
ALTER TABLE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_regimentrabajo.sec_conf_fondodetiempo_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_fondodetiempo".';

CREATE TABLE mod_regimentrabajo.conf_fondodetiempo
(
  id numeric(19,1) NOT NULL DEFAULT nextval('mod_regimentrabajo.sec_conf_fondodetiempo_seq'::regclass),
  idcategoria numeric(19,1) NOT NULL,
  fondodetiempo numeric(19,1) NOT NULL,
  CONSTRAINT conf_fondodetiempo_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_regimentrabajo.conf_fondodetiempo
  OWNER TO zeolides;

ALTER TABLE mod_regimentrabajo.dat_asistencia ALTER COLUMN hrstrabajadas type character varying(8);