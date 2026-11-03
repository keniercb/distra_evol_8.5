CREATE OR REPLACE FUNCTION mod_loginventario.f_mercanciadistribuida (
  p_idestructuraorigen numeric,
  p_idestructuradestino numeric,
  p_idestructuradeposito numeric,
  p_fdesde date,
  p_fhasta date,
  p_estado numeric,
  p_estadoejecucion numeric
)
RETURNS SETOF mod_loginventario.td_mercanciadistribuida AS
$body$
begin
return query (select distinct
v.idestructura as id_estructura_origen,
v.denominacion as v_origen, --mod_estructuracomp.v_dametodasestructuras
estcl.idestructura as id_estructura_destino,
estcl.denominacion as v_destino, --mod_estructuracomp.v_dametodasestructuras
vdep.idestructura as id_estructura_deposito,
(vdep.codigo || ' ' || vdep.denominacion) as deposito, --mod_estructuracomp.v_dametodasestructuras
d.nrodoc as num_distrib,
d.numeroref as ref_distri,
d.fechacontable as fecha,
(current_date - d.fechacontable) as diferencia,
count(ni.numeropieza)::integer as referencias,
 nnat.idnaturaleza,
 nnat.denominacion as naturaleza,
 sum( (po.cantidad*dp.precio) )as importe,
 d.observaciones,
 d.iddocumento
from mod_logistica.dat_documento d
join mod_datosmaestros.dat_documentoprim dd on d.iddoc = dd.iddoc
join mod_datosmaestros.nom_docprim ndp on dd.iddocumentos = ndp.iddocumentos and ndp.abreviatura = 'entregaLog'
join mod_datosmaestros.dat_estructurasubsist des on dd.idestructurasubsist = des.idestructurasubsist
join mod_estructuracomp.v_dametodasestructuras v on v.idestructura = des.idestructuracomun
join mod_logistica.dat_documentocliente ddocl on d.iddocumento = ddocl.iddocumento

left join mod_datosmaestros.nom_clientesproveedor ncli on ncli.idclientesproveedores = ddocl.idcliente

join mod_estructuracomp.v_dametodasestructuras estcl on (estcl.idestructura = ncli.idestructura
or estcl.idestructura = ddocl.idcliente)
join mod_logdistribucion.dat_prodorden po on po.idorden = d.iddocumento --and po.idcliente = ddocl.idcliente
join mod_logdistribucion.dat_prodordencmpto poc on po.idprodorden = poc.idprodorden
join mod_logistica.dat_producto dp on po.idproducto = dp.idproducto
join mod_estructuracomp.v_dametodasestructuras vdep on vdep.idestructura = dp.idestructura
join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
where 
--d.estado = idestado
po.idcliente = ddocl.idcliente
--filtros
and ( case when p_idestructuraorigen is not null then v.idestructura = p_idestructuraorigen else true end)
and ( case when p_idestructuradestino is not null then estcl.idestructura = p_idestructuradestino else true end)
and ( case when p_idestructuradeposito is not null then vdep.idestructura = p_idestructuradeposito else true end)
and ( case when p_idestructuradeposito is not null then vdep.idestructura = p_idestructuradeposito else true end)
--cuando vengan los dos casos el desde y el hasta,
and ( case when p_fdesde is not null and p_fhasta is not null then d.fechacontable between p_fdesde and p_fhasta else true end)
--cuando venga solo el desde y no el hasta
and ( case when p_fdesde is not null and p_fhasta is null then d.fechacontable between p_fdesde and now()::date else true end)
--cuando venga el hasta y no el desde
and ( case when p_fhasta is not null and p_fdesde is null then d.fechacontable <= p_fhasta else true end)
--filtro para el estado
and ( case when p_estado is not null then d.estado = p_estado else true end)
--filtro para estado de ejecucion
--and ( case when p_estadoejecucion is not null then estadoejecucion = p_estadoejecucion else true end)

and not (po.cantidad = 0) and estcl.idconcepto = 5 and estcl.idorgano = -2
and poc.cantidadoriginal > (poc.entregado)
group by v.idestructura, v.denominacion,
    estcl.idestructura, estcl.denominacion,
     vdep.idestructura, (vdep.codigo || ' ' || vdep.denominacion),
    d.nrodoc, d.numeroref,d.observaciones, d.fechacontable, nnat.denominacion,nnat.idnaturaleza, (current_date - d.fechacontable), d.iddocumento
order by v.idestructura, v.denominacion,
estcl.idestructura, estcl.denominacion,
vdep.idestructura, (vdep.codigo || ' ' || vdep.denominacion),
(current_date - d.fechacontable) desc);
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_loginventario.f_mercanciadistribuida (p_idestructuraorigen numeric, p_idestructuradestino numeric, p_idestructuradeposito numeric, p_fdesde date, p_fhasta date, p_estado numeric, p_estadoejecucion numeric)
  OWNER TO zeolides;