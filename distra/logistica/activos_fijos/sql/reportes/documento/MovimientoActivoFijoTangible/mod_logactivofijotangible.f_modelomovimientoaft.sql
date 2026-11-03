DROP FUNCTION IF EXISTS mod_logactivofijotangible.f_modelomovimientoaft(numeric, numeric);
DROP TYPE IF EXISTS mod_logactivofijotangible.tdr_modelomovimientoaft;

CREATE TYPE mod_logactivofijotangible.tdr_modelomovimientoaft AS
(
	entidad character varying(100),
	direccion_origen text,
	codigo_origen text,
	area_origen text,
	operacion character varying(255),
	codigoindicador character varying(255),
	codigo character varying(255),
	tipo_indicador text,
	marca character varying(255),
	modelo character varying(255),
	nroserie character varying(255),
	nroinventario character varying(255),
	valorcontable numeric(25,2),
	diferenciavalor numeric(25,2),
	valorresidual numeric(25,2),
	depreciacionacumulada numeric(25,2),
	diferenciadepreciacion numeric(25,2),
	tasa numeric(25,6),
	persona text,
	observaciones text,
	entidad_destino_rep text,
	codigo_destino_rep text,
	direccion_destino_rep text,
	entidad_destino_venta text,
	codigo_destino_venta text,
	direccion_destino_venta text,
	entidad_destino_tranf text,
	codigo_destino_tranf text,
	direccion_destino_tranf text,
	area_destino_trasmass text,
	codigo_destino_trasmass text,
	direccion_destino_trasmass text,
	area_destino_tras_inter text,
	codigo_destino_tras_inter text,
	direccion_destino_tras_inter text,
	nrodoc numeric(19,0),
	numerocomprobante numeric(19,0),
	fechadoc date,
	logo text
);

ALTER TYPE mod_logactivofijotangible.tdr_modelomovimientoaft OWNER TO zeolides;

-- FUNCTION: mod_logactivofijotangible.f_modelomovimientoaft(numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logactivofijotangible.f_modelomovimientoaft(numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_modelomovimientoaft(
	iddocumento numeric,
	idestructura numeric)
    RETURNS SETOF mod_logactivofijotangible.tdr_modelomovimientoaft 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
   v_rec mod_logactivofijotangible.tdr_modelomovimientoaft;
BEGIN
  return query 
select 
COALESCE(de.denominacion, deop.denominacion) as entidad,
COALESCE(de.direccion, deop.direccion)::TEXT as direccion_origen,
COALESCE(de.codigo, deop.codigo)::TEXT as codigo_origen,
area.denominacion::TEXT as area_origen,
op.denominacion as operacion,

i.codigo as codigoindicador,
i.numeropieza as codigo,
rna.denominacion::TEXT as tipo_indicador,
marca.denominacion as marca,
modelo.denominacion as modelo,
rn.nroserie as nroserie,
mrna.nroinventario as nroinventario,
--CASE WHEN TRUE THEN COALESCE((mrna.valorcontable + coalesce(mrna.diferenciavalor,0)), 0)::NUMERIC(25,2) ELSE NULL END AS valorcontable,
--nuevo
CASE WHEN (op.codigooperacion = 'OPER_MOD_VALOR_DIS') THEN COALESCE((mrna.valorcontable - coalesce(mrna.diferenciavalor,0)), 0)::NUMERIC(25,2) 
	 WHEN (TRUE) THEN COALESCE((mrna.valorcontable + coalesce(mrna.diferenciavalor,0)), 0)::NUMERIC(25,2) 
	ELSE NULL END AS valorcontable,
CASE WHEN TRUE THEN COALESCE((coalesce(mrna.diferenciavalor,0)), 0)::NUMERIC(25,2) ELSE NULL END AS diferenciavalor,
--nuevo
CASE WHEN TRUE THEN 
	((COALESCE((mrna.valorcontable + coalesce(mrna.diferenciavalor,0)), 0)::NUMERIC(25,2)) - (COALESCE((mrna.depreciacionacumulada + coalesce(mrna.diferenciadepreciacion,0)), 0)::NUMERIC(25,2) )
	)::NUMERIC(25,2)
ELSE NULL END AS valorresidual,
CASE WHEN TRUE THEN COALESCE((mrna.depreciacionacumulada + coalesce(mrna.diferenciadepreciacion,0)), 0)::NUMERIC(25,2) ELSE NULL END AS depreciacionacumulada,
CASE WHEN TRUE THEN COALESCE((coalesce(mrna.diferenciadepreciacion,0)), 0)::NUMERIC(25,2) ELSE NULL END AS diferenciadepreciacion,
mrna.tasafiscal as tasa,
(btrim(concat(dper.nombre, ' ', dper.snombre, ' ', dper.papel, ' ', dper.sapel))) as persona,
d.observaciones::TEXT as observaciones,
-- ENVIADO A REPARAR
COALESCE(
COALESCE(est_envrep.denominacion, estop_envrep.denominacion),
cp_env_rep.nombre)::TEXT as entidad_destino_rep,
COALESCE(
COALESCE(est_envrep.codigo, estop_envrep.codigo),
cp_env_rep.codigo)::TEXT as codigo_destino_rep,
COALESCE(
COALESCE(est_envrep.direccion, estop_envrep.direccion),
cp_env_rep.direccion)::TEXT as direccion_destino_rep,
-- BAJA VENTA
doc_venta_cliente.nombre::TEXT as entidad_destino_venta,
doc_venta_cliente.codigo::TEXT as codigo_destino_venta,
doc_venta_cliente.direccion::TEXT as direccion_destino_venta,
--ALQUILER
--USUFRUCTO
--ARRENDAMIENTO
--PRESTAMO
--TRANSFERENCIA ENTRE ENTIDADES
COALESCE(est_tranf.denominacion, estop_tranf.denominacion)::TEXT as entidad_destino_tranf,
COALESCE(est_tranf.codigo, estop_tranf.codigo)::TEXT as codigo_destino_tranf,
COALESCE(est_tranf.direccion, estop_tranf.direccion)::TEXT as direccion_destino_tranf,
--TRASLADO INTERNO MASIVO
case when (estop_movmass.denominacion is not null) then estop_movmass.denominacion::TEXT 
	else null end as area_destino_trasmass,
estop_movmass.codigo::TEXT as codigo_destino_trasmass,
estop_movmass.direccion::TEXT as direccion_destino_trasmass,
--TRASLADO INTERNO
case when ( (COALESCE(est_tranf.denominacion, estop_tranf.denominacion)::TEXT) is not null ) 
	then null else estop_hijo.denominacion::TEXT end as area_destino_tras_inter,
case when ( (COALESCE(est_tranf.denominacion, estop_tranf.denominacion)::TEXT) is not null ) 
	then null else estop_hijo.codigo::TEXT end as codigo_destino_tras_inter,
estop_hijo.direccion::TEXT as direccion_destino_tras_inter,
d.nrodoc,
cmp.numerocomprobante as numerocomprobante,
d.fechacontable as fechadoc,
(select nic.urllogo::TEXT from mod_logistica.conf_general nic where nic.idestructura = $2)
from mod_logistica.dat_documento d
inner join mod_datosmaestros.nom_operacion op on op.idnomoperaciones = d.idoperacion

inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
inner join mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = m.idmovimiento
inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = mrn.idregnumerico
inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
LEFT JOIN mod_datosmaestros.nom_marca marca on marca.idmarca = ih.idmarca
LEFT JOIN mod_datosmaestros.nom_modelo modelo on modelo.idmodelo = ih.idmodelo
LEFT JOIN mod_logactivofijotangible.dat_responsable dr ON mrna.idresponsable = dr.idresponsable
LEFT JOIN mod_persona.dat_persona dper ON dper.idpersona = dr.idpersona
INNER JOIN mod_estructuracomp.nom_filaestruc fila on fila.idfila = $2
LEFT JOIN mod_estructuracomp.dat_estructura de on de.idestructura = fila.idfila and de.idproyecto = 0
LEFT JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = fila.idfila and deop.idproyecto = 0
LEFT JOIN mod_estructuracomp.dat_estructuraop area on area.idestructuraop = d.idestructuracomun and area.idproyecto = 0
LEFT JOIN mod_contabilidad.dat_comprobante cmp on cmp.idcomprobante = d.idcomprobante
-- ENVIADO A REPARAR
LEFT JOIN mod_logactivofijotangible.dat_docenviadoreparar docenvrep on docenvrep.iddocenviadoreparar = d.iddocumento
LEFT JOIN mod_estructuracomp.nom_filaestruc fila_envrep on fila_envrep.idfila = docenvrep.identidaddestino
LEFT JOIN mod_estructuracomp.dat_estructura est_envrep on est_envrep.idestructura = fila_envrep.idfila
LEFT JOIN mod_estructuracomp.dat_estructuraop estop_envrep on estop_envrep.idestructuraop = fila_envrep.idfila
LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp_env_rep on cp_env_rep.idclientesproveedores = docenvrep.idclientesproveedores
-- BAJA VENTA
LEFT JOIN mod_logactivofijotangible.dat_docbajaventa doc_venta on doc_venta.iddocbajaventa = d.iddocumento
LEFT JOIN mod_datosmaestros.nom_clientesproveedor doc_venta_cliente on doc_venta_cliente.idclientesproveedores = idclientesproveedoresbajaventa --doc_venta.iddocbajaventa
--TRANSFERENCIA ENTRE ENTIDADES
LEFT JOIN mod_logactivofijotangible.dat_doctransfentidades doc_tranf on doc_tranf.iddoctranfentidades = d.iddocumento
LEFT JOIN mod_estructuracomp.nom_filaestruc fila_tranf on fila_tranf.idfila = doc_tranf.identidaddestino
LEFT JOIN mod_estructuracomp.dat_estructura est_tranf on est_tranf.idestructura = fila_tranf.idfila
LEFT JOIN mod_estructuracomp.dat_estructuraop estop_tranf on estop_tranf.idestructuraop = fila_tranf.idfila
--TRASLADO INTERNO MASIVO
LEFT JOIN mod_logactivofijotangible.dat_documentoactivo doc_aft on doc_Aft.iddocumentoactivo = d.iddocumento
LEFT JOIN mod_estructuracomp.dat_estructuraop estop_movmass on estop_movmass.idestructuraop = doc_aft.idareadestino
--TRASLADO INTERNO
LEFT JOIN mod_logistica.dat_documentopadre doc_padre on doc_padre.idpadre = d.iddocumento
LEFT JOIN mod_logistica.dat_documento doc_hijo on doc_hijo.iddocumento = doc_padre.iddocumento
LEFT JOIN mod_estructuracomp.dat_estructuraop estop_hijo on estop_hijo.idestructuraop = doc_hijo.idestructuracomun
where d.iddocumento = $1;
--LOOP
END;
$BODY$;

ALTER FUNCTION mod_logactivofijotangible.f_modelomovimientoaft(numeric, numeric)
    OWNER TO zeolides;
