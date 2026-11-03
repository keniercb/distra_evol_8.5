CREATE SEQUENCE mod_logpuntoventa.sec_datauditora_seq
	INCREMENT BY 1
	MINVALUE 1000
	MAXVALUE 1099999999
	START 1000
	no CYCLE;

CREATE TABLE mod_logpuntoventa.dat_cintaauditora (
	iddescarga numeric(19) DEFAULT nextval('mod_logpuntoventa.sec_datauditora_seq'::regclass) NOT NULL,
	fecha date NULL,
	idestructuracomun numeric(19) NULL,
	idareaventa numeric(19) NULL,
	idusuario numeric(19) NULL,
	identificador varchar(100) NULL,
	denominacion varchar(100) NULL,
	infoauditora text NULL,
	receiptnumber int4 NULL,
	CONSTRAINT dat_auditora_pkey PRIMARY KEY (iddescarga)
);


-- DROP FUNCTION mod_logpuntoventa.is_dateinfo(varchar);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_isdateinfo(s character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
begin
  perform s::date;
  return true;
exception when others then
  return false;
end;
$function$
;

DROP TYPE mod_logpuntoventa.td_infoauditora CASCADE;

CREATE TYPE mod_logpuntoventa.td_infoauditora AS (
	idinfo numeric,
	denominacion varchar(255),
	fecha varchar,
	hora varchar);


-- DROP FUNCTION mod_logpuntoventa.f_getinfoauditora(numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_getinfoauditora(p_iddescarga numeric)
 RETURNS SETOF mod_logpuntoventa.td_infoauditora
 LANGUAGE plpgsql
AS $function$
	DECLARE

	v_rec mod_logpuntoventa.td_infoauditora;
    v_descarga record;
    v_info record;
    v_lineinfo varchar[];
    v_infooper varchar[];
    v_stringdate varchar;
    v_stringhr varchar;
    v_isdate bool;
    v_idinfo numeric;

	BEGIN  
	v_stringdate := '-';
	v_stringhr := '-';
    v_idinfo = 0;
    select pt.* into v_descarga from mod_logpuntoventa.dat_cintaauditora pt where pt.iddescarga = p_iddescarga;
		for v_info in (
					select t.fragmento from (
							select regexp_split_to_table(v_descarga.infoauditora, '\n') as fragmento
						) t
					)
		loop
        	select array_agg(t.fragmento) into v_lineinfo from (
                        select regexp_split_to_table(v_info.fragmento, ';') as fragmento
                    ) t;
                if v_lineinfo[4] = '101' then
                    --v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocaja = v_lineinfopago[5]::numeric limit 1);
                    select array_agg(p.fragmento) into v_infooper from (
                        select regexp_split_to_table(v_lineinfo[6], ' ') as fragmento
                    ) p;
                    v_isdate := (select mod_logpuntoventa.f_isdateinfo(v_infooper[1]));
                    if v_isdate = true then
                    	v_stringdate := (v_infooper[1]::date)::varchar;
                    	v_stringhr := v_infooper[4];
                    end if;
                	v_rec.idinfo = v_idinfo;
                    v_idinfo = v_idinfo + 1;
                    v_rec.denominacion = REPLACE(v_lineinfo[6],'"','');
                    v_rec.fecha = v_stringdate;
                    v_rec.hora = v_stringhr;
                    return next v_rec;
                elseif v_lineinfo[1] = '101' then
                    v_stringdate := (v_lineinfo[4]::date)::varchar;
                    v_stringhr := v_lineinfo[5];
                	v_rec.idinfo = v_idinfo;
                    v_idinfo = v_idinfo + 1;
                    v_rec.denominacion = REPLACE(v_lineinfo[12],'"','');
                    v_rec.fecha = v_stringdate;
                    v_rec.hora = v_stringhr;
                    return next v_rec;
            
                end if;
		end loop;
	END;
$function$
;

-- DROP FUNCTION mod_logpuntoventa.f_getreceiptnumberbyinfo(text);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_getreceiptnumberbyinfo(p_info text)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_info record;
  v_lineinfo varchar[];
BEGIN
  for v_info in (
					select t.fragmento from (
							select regexp_split_to_table(p_info, '\n') as fragmento
						) t
					)
		loop
        	select array_agg(t.fragmento) into v_lineinfo from (
                        select regexp_split_to_table(v_info.fragmento, ';') as fragmento
                    ) t;
                if v_lineinfo[4] = '0' and v_lineinfo[5] = '6' then
                    --raise notice 'Linea %' ,v_lineinfo;
                    return v_lineinfo[8];	
                end if;
		end loop;
END;
$function$
;
 
-- DROP FUNCTION mod_logpuntoventa.f_getnombrecajainfo(text);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_getnombrecajainfo(p_info text)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_info record;
  v_lineinfo varchar[];
BEGIN
  for v_info in (
					select t.fragmento from (
							select regexp_split_to_table(p_info, '\n') as fragmento limit 1
						) t
					)
		loop
        	select array_agg(t.fragmento) into v_lineinfo from (
                        select regexp_split_to_table(v_info.fragmento, ';') as fragmento
                    ) t;
               return v_lineinfo[9];	
		end loop;
	return 'Sin Nombre';
END;
$function$
;
