CREATE OR REPLACE FUNCTION mod_logtaller.f_listadoordentrabajo (
  p_idestructura numeric,
  p_idcliente numeric,
  p_idmedio numeric,
  p_idservicio numeric,
  p_idestado varchar,
  p_identificador varchar,
  p_idcentrocosto numeric,
  p_fechainiciocomienzo varchar,
  p_fechafincomienzo varchar,
  p_fechainiciocierre varchar,
  p_fechafincierre varchar,
  p_garantia numeric
)
RETURNS SETOF mod_logtaller.td_listadoordentrabajo AS
$body$
	DECLARE
	v_rec mod_logtaller.td_listadoordentrabajo;
	BEGIN
		for v_rec in 
SELECT distinct d.iddocumento,d.anno,
case when d.estado = 1 then 'Elaboracián'
when d.estado = 2 then 'Preparado'
when d.estado = 9 then 'Cerrado'
else null end as estado,
d.fechacontable::date,
d.nrodoc,
d.numeroref,(
 SELECT COUNT(distinct m.idmaterial)
 FROM mod_logtaller.dat_material m
 WHERE m.idordentrabajo = d.iddocumento
) as cantproductos,
d.observaciones,
ord.fechainicio as fechainicio,
ord.fechafin as fechafin,
ord.dictamentecnico as dictamentecnico,
( case when ord.garantia = 0 then 'No' else 'Si' end ) as garantia,
ord.fechacierre as fechacierre,
ord.fallascliente as fallascliente,
(coalesce(ROUND(coalesce((SELECT ROUND(SUM(coalesce(rd.costo,0)),2) FROM mod_logtaller.dat_ordenactividad rd
WHERE rd.idordentrabajo = d.iddocumento),0) +
coalesce((SELECT ROUND(SUM(coalesce(dm.importecup,0)),2) FROM mod_logtaller.dat_material dm
WHERE dm.idordentrabajo = d.iddocumento),0),2),0)) as importetotal,
 ord.cantidadreclamaciones as cantidadreclamaciones,
COALESCE(ord.atributoidentificador,'') as atributoidentificador,
 suc.nombreusuario as cerradopor,
(coalesce(ROUND(coalesce((SELECT ROUND(SUM(coalesce(rdd.importealternativo,0)),2) FROM mod_logtaller.dat_ordenactividad rdd
WHERE rdd.idordentrabajo = d.iddocumento),0) +
coalesce((SELECT ROUND(SUM(coalesce(dmm.importecuc,0)),2) FROM mod_logtaller.dat_material dmm
WHERE dmm.idordentrabajo = d.iddocumento),0),2),0)) as importealternativo,
 ( case when ord.tipo = 0 then 'Reparacion' else 'Mantenimiento' end) as tipo,
 rec.descripcion as descripcionreclamacion,
 ind.denominacion as producto,
 confAct.denominacion as servicio,
 (SELECT doc.nrodoc FROM mod_logistica.dat_documento doc WHERE doc.iddocumento = ord.iddocumentoorigen ) as nrodocorigen,
 (SELECT count(mat.idmaterial) FROM mod_logtaller.dat_material mat WHERE mat.idordentrabajo = ord.idordentrabajo and
      mat.cantidad > mat.cantidadreal) as cant_productos,
 (SELECT count(act.idordenactividad) FROM mod_logtaller.dat_ordenactividad act WHERE act.idordentrabajo = ord.idordentrabajo) as cantactvidades,
 (case when ord.fechacierre is null then EXTRACT(DAY from now()::timestamp - d.fechacontable::timestamp) else 0 end) as estadia,
 1 as solucion,
 su.nombreusuario,
(SELECT COALESCE((cp.codigo || '-' || cp.nombre),(vde.codigo || '-' || vde.denominacion))
FROM mod_datosmaestros.nom_clientesproveedor cp 
LEFT JOIN mod_estructuracomp.dat_estructura vde ON cp.idestructura = vde.idestructura
where cp.idclientesproveedores = ord.idcliente) as cliente
FROM mod_logistica.dat_documento d
INNER JOIN mod_logtaller.dat_ordentrabajo ord on d.iddocumento = ord.idordentrabajo
INNER JOIN mod_logtaller.dat_medioorden med ON ord.idordentrabajo = med.idordentrabajo
LEFT JOIN mod_datosmaestros.nom_indicador ind ON med.idindicador = ind.idindicador
LEFT JOIN mod_logtaller.dat_trabajoservicio ts ON ord.idordentrabajo = ts.idordentrabajo
LEFT JOIN mod_logtaller.conf_actividad confAct ON ts.idservicio = confAct.idactividad
LEFT JOIN mod_logtaller.dat_ordenreclamacion rec ON ord.idordentrabajo = rec.idordentrabajo
LEFT JOIN mod_datosmaestros.nom_indicadorhoja indh ON ind.idindicador = indh.idindicador
left JOIN mod_seguridad.seg_usuario su on su.idusuario = d.idusuario
LEFT JOIN mod_seguridad.seg_usuario suc on suc.idusuario = ord.cerradopor
WHERE d.idestructuracomun = p_idestructura --AND d.idespecialidad = 1
AND ( CASE WHEN p_idcliente is null THEN true ELSE ord.idcliente = p_idcliente END)
AND ( CASE WHEN p_idmedio is null THEN true ELSE ind.idindicador = p_idmedio END)
AND ( CASE WHEN p_idservicio is null THEN true ELSE confAct.idactividad = p_idservicio END)
AND ( CASE WHEN p_idestado is null THEN d.estado not in(7,5,6,8) ELSE d.estado = ANY(CAST('{' || p_idestado || '}' as NUMERIC[])) END)
AND ( CASE WHEN p_identificador is null THEN true ELSE ord.atributoidentificador ilike '@' || p_identificador || '@' END)
AND ( CASE WHEN p_idcentrocosto is null THEN true ELSE ord.idordentrabajo IN (
SELECT cc.iddocumento FROM mod_logistica.dat_documentocliente cc 
WHERE cc.idcliente = p_idcentrocosto and cc.tipocliente = 2) END)
AND ( CASE WHEN p_fechainiciocomienzo is null THEN true ELSE ord.fechainicio >= CAST( p_fechainiciocomienzo as DATE) END)
AND ( CASE WHEN p_fechafincomienzo is null THEN true ELSE ord.fechainicio <= CAST( p_fechafincomienzo as DATE) END)
AND ( CASE WHEN p_fechainiciocierre is null THEN true ELSE ord.fechacierre >= CAST( p_fechainiciocierre as DATE) END)
AND ( CASE WHEN p_fechafincierre is null THEN true ELSE ord.fechacierre <= CAST( p_fechafincierre as DATE) END)
AND ( CASE WHEN p_garantia is null THEN true ELSE ord.garantia <= p_garantia END)
ORDER BY d.iddocumento DESC
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

ALTER FUNCTION mod_logtaller.f_listadoordentrabajo (p_idestructura numeric, p_idcliente numeric, p_idmedio numeric, p_idservicio numeric, p_idestado varchar, p_identificador varchar, p_idcentrocosto numeric, p_fechainiciocomienzo varchar, p_fechafincomienzo varchar, p_fechainiciocierre varchar, p_fechafincierre varchar, p_garantia numeric)
  OWNER TO zeolides;