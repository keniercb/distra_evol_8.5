CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_relacionarareaventacaja (
  p_idestructura numeric
)
RETURNS void AS
$body$
DECLARE
v_datos record;
v_datoscaja record;
v_idtipocaja numeric;
v_codigo numeric;
v_newcodigo numeric;
BEGIN

for v_datos in select * from mod_logpuntoventa.dat_areaventa av
					where av.idestructuracomun = p_idestructura
					and av.idareaventa not in (select idareaventa from mod_logpuntoventa.dat_caja)
loop

select tc.idtipocaja/*,tce.idtipocajaoentidad*/ into v_idtipocaja from mod_logpuntoventa.nom_tipocaja tc
--inner join mod_logpuntoventa.dat_tipocajaoentidad tce on tc.idtipocaja = tce.idtipocaja
where tc.idtipocaja not in (select c.idtipocaja from mod_logpuntoventa.dat_caja c
						   inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
						   where av.idestructuracomun = p_idestructura)
                           order by idtipocaja asc limit 1;

--v_idtipocaja = v_datoscaja.idtipocaja;

IF v_idtipocaja is not null THEN 
  INSERT INTO mod_logpuntoventa.dat_caja(
  idareaventa, idtipocaja, activo)
  VALUES (v_datos.idareaventa, v_idtipocaja, 0);
  /*if v_datoscaja.idtipocajaoentidad is null then
    INSERT INTO mod_logpuntoventa.dat_tipocajaoentidad(idtipocaja,idestructuracomun)
	VALUES (v_idtipocaja,p_idestructura);
  end if;*/
ELSE
SELECT codigo::numeric into v_codigo FROM mod_logpuntoventa.nom_tipocaja order by codigo desc limit 1; 
  /*if v_codigo < 10 THEN
      v_newcodigo = 0::varchar ||(v_codigo+1)::varchar;
  else*/
      v_newcodigo = v_codigo+1;
  --end if;
  INSERT INTO mod_logpuntoventa.nom_tipocaja(
    codigo,denominacion,fechainicio)
  VALUES (
    v_newcodigo,
    'Caja de venta '||(v_newcodigo)::varchar,
    now()
  ) returning idtipocaja into v_idtipocaja;
  
  /*INSERT INTO mod_logpuntoventa.dat_tipocajaoentidad(idtipocaja,idestructuracomun)
	VALUES (v_idtipocaja,p_idestructura);*/
  
  INSERT INTO mod_logpuntoventa.dat_caja(
  idareaventa, idtipocaja, activo)
  VALUES (v_datos.idareaventa, v_idtipocaja, 0);
END IF;

INSERT INTO mod_logpuntoventa.dat_tipocajaoentidad(idtipocaja,idestructuracomun)			
select c.idtipocaja,p_idestructura from mod_logpuntoventa.dat_caja c
inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
where av.idestructuracomun = p_idestructura and c.idtipocaja not in (select idtipocaja from mod_logpuntoventa.dat_tipocajaoentidad
where idestructuracomun = p_idestructura);		   
end loop;  
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_relacionarareaventacaja (p_idestructura numeric)
  OWNER TO postgres;