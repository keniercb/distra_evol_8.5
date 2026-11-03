CREATE OR REPLACE FUNCTION mod_loginventario.f_obtener_preciopublico (
)
RETURNS TABLE (
  precioventa numeric,
  idindicador numeric,
  idtipoprecio numeric,
  idpadrematriz numeric,
  idestructuracomun numeric
) AS
$body$
BEGIN
return query (
select
	  mpdm.precioventa
	, mp.idindicador
	, mp.idtipoprecio
	, cf.idpadrematriz
	, cf.idestructuracomun
from mod_logfacturacion.dat_matrizpreciodualmonetaria as mpdm
inner join mod_logfacturacion.dat_matrizprecio as mp on (mp.idmatrizprecio = mpdm.idmatrizprecio)
inner join mod_logfacturacion.conf_configuracionfactura as cf on (cf.idpadrematriz = mp.idestructuracomun or cf.idestructuracomun = mp.idestructuracomun)

where 	cf.idestructuracomun = $P{idestructura}
	  	and mp.idtipoprecio = (select idtipoprecio from mod_logfacturacion.nom_tipoprecio
								where tipo = 1 									and es_publico = 1)
);
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_obtener_preciopublico ()
  OWNER TO zeolides;
