select
d.nrodoc,
cmp.numerocomprobante as numerocomprobante,
d.fechacontable as fechadoc,

COALESCE(de.denominacion, deop.denominacion) as entidad,
COALESCE(de.direccion, deop.direccion) as direccion_origen,
COALESCE(de.codigo, deop.codigo) as codigo_origen,
area.denominacion as area_origen,
op.denominacion as operacion,

i.codigo as codigoindicador,
i.numeropieza as codigo,
i.denominacion as tipo_indicador,
marca.denominacion as marca,
modelo.denominacion as modelo,

count(mrn.idmovregnumerico) as cantidad,
mrna.valorcontable + coalesce(mrna.diferenciavalor,0) as valorcontable,
coalesce(mrna.diferenciavalor,0) as diferencia,
mrna.tasafiscal as tasa,
(btrim(concat(dper.nombre, ' ', dper.snombre, ' ', dper.papel, ' ', dper.sapel))) as persona,

d.observaciones as observaciones,

-- ENVIADO A REPARAR
COALESCE(COALESCE(est_envrep.denominacion, estop_envrep.denominacion),cp_env_rep.nombre) as entidad_destino_rep,
COALESCE(COALESCE(est_envrep.codigo, estop_envrep.codigo),cp_env_rep.codigo) as codigo_destino_rep,
COALESCE(COALESCE(est_envrep.direccion, estop_envrep.direccion),cp_env_rep.direccion) as direccion_destino_rep,

-- BAJA VENTA
doc_venta_cliente.descripcion as entidad_destino_venta,
doc_venta_cliente.codigo as codigo_destino_venta,
doc_venta_cliente.direccion as direccion_destino_venta,

--ALQUILER
--USUFRUCTO
--ARRENDAMIENTO
--PRESTAMO

--TRANSFERENCIA ENTRE ENTIDADES
COALESCE(est_tranf.denominacion, estop_tranf.denominacion) as entidad_destino_tranf,
COALESCE(est_tranf.codigo, estop_tranf.codigo) as codigo_destino_tranf,
COALESCE(est_tranf.direccion, estop_tranf.direccion) as direccion_destino_tranf,

--TRASLADO INTERNO MASIVO
/*estop_movmass.denominacion*/ null as area_destino_trasmass,
estop_movmass.codigo as codigo_destino_tranf,
estop_movmass.direccion as direccion_destino_tranf,

--TRASLADO INTERNO
/*estop_hijo.denominacion */ null as area_destino_tras_inter,
estop_hijo.codigo as codigo_destino_tras_inter,
estop_hijo.direccion as codigo_destino_tras_inter,

(select nic.urllogo from mod_logistica.conf_general nic where nic.idestructura =$P{idestructura})
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

INNER JOIN mod_estructuracomp.nom_filaestruc fila on fila.idfila = $P{idestructura}
LEFT JOIN mod_estructuracomp.dat_estructura de on de.idestructura = fila.idfila and de.idproyecto = 0
LEFT JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = fila.idfila and deop.idproyecto = 0
LEFT JOIN mod_estructuracomp.dat_estructuraop area on area.idestructuraop = d.idestructuracomun and area.idproyecto = 0
--LEFT JOIN mod_estructuracomp.v_dametodasestructuras area on area.idestructura = d.idestructuracomun and area.idproyecto = 0

LEFT JOIN mod_contabilidad.dat_comprobante cmp on cmp.idcomprobante = d.idcomprobante

-- ENVIADO A REPARAR
LEFT JOIN mod_logactivofijotangible.dat_docenviadoreparar docenvrep on docenvrep.iddocenviadoreparar = d.iddocumento
LEFT JOIN mod_estructuracomp.nom_filaestruc fila_envrep on fila_envrep.idfila = docenvrep.identidaddestino
LEFT JOIN mod_estructuracomp.dat_estructura est_envrep on est_envrep.idestructura = fila_envrep.idfila and est_envrep.idproyecto = 0
LEFT JOIN mod_estructuracomp.dat_estructuraop estop_envrep on estop_envrep.idestructuraop = fila_envrep.idfila and estop_envrep.idproyecto = 0
LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp_env_rep on cp_env_rep.idclientesproveedores = docenvrep.idclientesproveedores

-- BAJA VENTA
LEFT JOIN mod_logactivofijotangible.dat_docbajaventa doc_venta on doc_venta.iddocbajaventa = d.iddocumento
LEFT JOIN mod_datosmaestros.nom_clientesproveedor doc_venta_cliente on doc_venta_cliente.idclientesproveedores = doc_venta.iddocbajaventa

--TRANSFERENCIA ENTRE ENTIDADES
LEFT JOIN mod_logactivofijotangible.dat_doctransfentidades doc_tranf on doc_tranf.iddoctranfentidades = d.iddocumento
LEFT JOIN mod_estructuracomp.nom_filaestruc fila_tranf on fila_tranf.idfila = doc_tranf.identidaddestino
LEFT JOIN mod_estructuracomp.dat_estructura est_tranf on est_tranf.idestructura = fila_tranf.idfila and est_tranf.idproyecto = 0
LEFT JOIN mod_estructuracomp.dat_estructuraop estop_tranf on estop_tranf.idestructuraop = fila_tranf.idfila and estop_tranf.idproyecto = 0

--TRASLADO INTERNO MASIVO
LEFT JOIN mod_logactivofijotangible.dat_documentoactivo doc_aft on doc_Aft.iddocumentoactivo = d.iddocumento
LEFT JOIN mod_estructuracomp.dat_estructuraop estop_movmass on estop_movmass.idestructuraop = doc_aft.idareadestino and estop_movmass.idproyecto = 0

--TRASLADO INTERNO
LEFT JOIN mod_logistica.dat_documentopadre doc_padre on doc_padre.idpadre = d.iddocumento
LEFT JOIN mod_logistica.dat_documento doc_hijo on doc_hijo.iddocumento = doc_padre.iddocumento
LEFT JOIN mod_estructuracomp.dat_estructuraop estop_hijo on estop_hijo.idestructuraop = doc_hijo.idestructuracomun and estop_hijo.idproyecto = 0

where d.iddocumento = $P{iddocumento}
group by 	d.nrodoc, cmp.numerocomprobante, d.fechacontable,de.denominacion, deop.denominacion, de.direccion, deop.direccion,
    de.codigo, deop.codigo, op.denominacion, i.codigo, i.numeropieza, i.denominacion, marca.denominacion, modelo.denominacion,
    mrna.valorcontable, mrna.diferenciavalor, mrna.tasafiscal, dper.nombre, dper.snombre, dper.papel, dper.sapel, d.observaciones,
    est_envrep.denominacion, estop_envrep.denominacion, cp_env_rep.nombre, est_envrep.codigo, estop_envrep.codigo, cp_env_rep.codigo,
    est_envrep.direccion, estop_envrep.direccion, cp_env_rep.direccion, doc_venta_cliente.descripcion, doc_venta_cliente.codigo, doc_venta_cliente.direccion,
    est_tranf.denominacion, estop_tranf.denominacion, est_tranf.codigo, estop_tranf.codigo, est_tranf.direccion, estop_tranf.direccion, estop_movmass.denominacion,
    estop_movmass.codigo, estop_movmass.direccion, estop_hijo.denominacion, estop_hijo.codigo, estop_hijo.direccion, area.denominacion
