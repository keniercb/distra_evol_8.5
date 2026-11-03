CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listarmovimientosregistro (
  idregnumerico numeric,
  idarearesp varchar
)
RETURNS SETOF mod_logactivofijotangible.td_listarmovimientosregistro AS
$body$
DECLARE
v_rec mod_logactivofijotangible.td_listarmovimientosregistro;
BEGIN
for v_rec in 
SELECT DISTINCT
d.iddocumento, 
o.denominacion as documento, 
d.fechacontable, 
eo.denominacion as area, 
eu.descripcion as ubicacion, 
mra.valorcontable,
ne.denominacion as estado,
(p.nombre||(case when p.snombre is not null then ' '||p.snombre ELSE ' ' END)||' '||p.papel||' '|| p.sapel) as persona

FROM mod_logistica.dat_documento d
INNER JOIN mod_logactivofijotangible.dat_documentoactivo da on da.iddocumentoactivo = d.iddocumento
INNER JOIN mod_datosmaestros.nom_operacion o on o.idnomoperaciones = d.idoperacion
INNER JOIN mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
INNER JOIN mod_logactivofijotangible.dat_movregnumerico mr on mr.idmovimiento = m.idmovimiento
INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mra on mra.idmovregnumerico = mr.idmovregnumerico
INNER JOIN mod_logactivofijotangible.nom_estatustecnico ne on ne.idestatustecnico = mra.idestatustecnico
LEFT JOIN mod_estructuracomp.v_dametodasestructuras eo on eo.idestructura = mra.idarearesp
LEFT JOIN mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = mra.idubicacion
LEFT JOIN mod_logactivofijotangible.dat_responsable dr on dr.idresponsable = mra.idresponsable
LEFT JOIN mod_persona.dat_persona p on p.idpersona = dr.idpersona
where d.estado = 3
and mr.idregnumerico = $1
--and (mra.idarearesp = any(cast($2 as NUMERIC[])))

order by d.iddocumento desc    
loop
return next v_rec;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_listarmovimientosregistro (idregnumerico numeric, idarearesp varchar)
  OWNER TO zeolides;