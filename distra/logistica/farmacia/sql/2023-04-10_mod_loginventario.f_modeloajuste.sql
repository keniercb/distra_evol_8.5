DROP FUNCTION mod_loginventario.f_modeloajuste(p_iddocumento numeric, p_monedaalternativa numeric, p_monedacontable numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_modeloajuste (
  p_iddocumento numeric
)
RETURNS SETOF mod_loginventario.td_ajuste AS
$body$
declare
all_rec mod_loginventario.td_ajuste;
begin 
for all_rec in
SELECT distinct
(CASE WHEN dd.entidad IS NOT NULL THEN dd.entidad WHEN de.denominacion IS NOT NULL THEN de.denominacion ELSE deop.denominacion END) as entidad,
dd.estructuracompleta as deposito,
dd.nrodoc as numerodocumento,
dd.fechacontable as fechadocumento,
nop.denominacion as motivo,
dd.especialidad,
dd.observaciones,
dd.logo,
dd.documentoprimario as aliasdoc,
coalesce(dd.codigoentidad,'-',dd.codigoestructura) as reeup,
dd.idestado,
dd.numeroref,
dd.nombrepersona as nombrepersona,
dd.cargopersona as cargopersona,
dd.nombrepersonaprobar as nombrepersonaprobar,
dd.cargopersonaprobar as cargopersonaprobar,
(SELECT a.nombre
FROM mod_logistica.v_responsable a
WHERE a.idusuario = daj.contabilizadopor LIMIT 1) as nombrepersonacontab,
(SELECT a.cargo FROM mod_logistica.v_responsable a
WHERE a.idusuario = daj.contabilizadopor LIMIT 1) as cargopersonacontab

FROM mod_logistica.v_documento dd
INNER JOIN mod_loginventario.dat_ajuste daj on daj.idajuste = dd.iddocumento
INNER join mod_datosmaestros.dat_documentoprim dpr on dpr.iddoc = dd.iddoc
INNER join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = dpr.idestructurasubsist
INNER join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = des.idestructuracomun
INNER join mod_estructuracomp.nom_filaestruc nf on nf.idfila = dd.idestructuracomun
INNER join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = nf.idfila
LEFT JOIN mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = daj.idoperacion
WHERE dd.iddocumento = p_iddocumento
LIMIT 1

loop return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_modeloajuste (p_iddocumento numeric)
  OWNER TO zeolides;