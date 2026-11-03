-- FUNCTION: mod_migracion_aft.f_aux_crear_documento(numeric, numeric, numeric, numeric, text, text, numeric)

-- DROP FUNCTION IF EXISTS mod_migracion_aft.f_aux_crear_documento(numeric, numeric, numeric, numeric, text, text, numeric);

CREATE OR REPLACE FUNCTION mod_migracion_aft.f_aux_crear_documento(
	idestructura_origen numeric,
	idarea_origen numeric,
	idestructura_destino numeric,
	idarea_destino numeric,
	cod_doc text,
	cod_operacion text,
	idusuario numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

DECLARE

r_datos_insertar record;
v_idespecialidad numeric;
v_iddoc numeric;
v_iddoc_mmaft_uh numeric;
--v_iddoc_uh numeric;
v_iddocumento_generado numeric;
v_idusuario_admin numeric;
v_idusuario numeric;
v_idoperacion_traslado_ext numeric;
--v_idoperacion_tras_ext_uh numeric;
v_idoperacion numeric;
v_numeroref numeric;
v_nro_doc numeric;
v_cronologia_doc numeric;
v_cronologia_mov numeric;
r_datos_movimiento record;
v_idmovimiento_generado numeric;
v_idmovregnumerico_generado numeric;
v_idregnumerico numeric;
r_sql record;

BEGIN
	--datos generales
	select sub.idestructurasubsist as idestructurasubsist, 
		extract(year from f.fecha) as anno,
		f.fecha as fechacontable,
		c.idejercicioactual as idejercicio,
		c.idperiodoactual as idperiodo
	into r_datos_insertar
    from mod_datosmaestros.dat_estructurasubsist sub
	inner join mod_datosmaestros.dat_fecha f on (f.idestructurasubsist = sub.idestructurasubsist)
	inner join mod_datosmaestros.dat_cierre c on (c.idestructurasubsist = sub.idestructurasubsist)
    where sub.idestructuracomun = $1 and sub.idsubsistema = 11;-- idestructura_origen     
	
	--sin especialidad
    select esp.idespecialidad into v_idespecialidad
    from mod_datosmaestros.nom_especialidad esp
	where esp.denespecialidad ilike 'ninguna';
	
	--iddoc "SC 101 Modelo movimiento activo fijo tangible" y iddoc "Control de útiles y herramientas en explotación"
	--'MMAFT' y '005'
	select ddp.iddoc into v_iddoc_mmaft_uh from mod_datosmaestros.nom_docprim as ndp
	inner join mod_datosmaestros.dat_documentoprim as ddp using (iddocumentos)
	where trim(upper(ndp.codigo)) like $5 /*'MMAFT'*/ and ddp.idestructurasubsist = r_datos_insertar.idestructurasubsist;
		
	--validar iddoc
	if (v_iddoc_mmaft_uh is not null) then
		/*'MMAFT' y '005'*/
		v_iddoc:=v_iddoc_mmaft_uh;	
	else
		raise exception 'Requiere un valor de iddoc válido para crear el documento. Sugerencias: codigos MMAFT y 005 para el 5to parámetro.';
	end if;
	
	--usuario administrador
	select seg.idusuario into v_idusuario_admin from mod_seguridad.seg_usuario as seg where lower(seg.nombreusuario) like 'administrador';
	
	--validar idusuario
	if ($7 is null and v_idusuario_admin is not null) then 
		v_idusuario:=v_idusuario_admin;
	elseif ($7 is not null and v_idusuario_admin is null) then 
		--verificar que $7 es un valor válido en mod_seguridad.seg_usuario
			select s.idusuario into v_idusuario_admin FROM mod_seguridad.seg_usuario as s where s.idusuario = $7;
		if (v_idusuario_admin is not null)then
			--$7 existe como valor del nomenclador
			v_idusuario:=v_idusuario_admin;
		else 
			raise exception 'Requiere un valor de idusuario válido para crear el documento.';
		end if;
	elseif ($7 is null and v_idusuario_admin is null) then
		raise exception 'Requiere un valor de idusuario válido para crear el documento. Detalles: el parámetro #7 sin especificar y 
		no se encontró un valor en mod_seguridad.seg_usuario con nombreusuario = administrador.';
	end if;
	
	--operación para activos y operación para útiles y herramientas
	--'OPER_TRASLADO_EXTER' y 'OPER_TRAS_EXTER_UH'
	select o.idnomoperaciones into v_idoperacion_traslado_ext 
	from mod_datosmaestros.nom_operacion as o
	where o.idestructuracomun = $1 and
		trim(upper(o.codigooperacion)) like $6 and
		o.idsubsistema = 11;

	--validar idoperacion
	if (v_idoperacion_traslado_ext is not null) then 
		v_idoperacion:=v_idoperacion_traslado_ext;
	else 
		raise exception 'Requiere un valor de idoperacion válido para crear el documento. 
		Sugerencias: codigooperacion OPER_TRASLADO_EXTER o OPER_TRAS_EXTER_UH para el 6to parámetro.';
	end if;
	
	--numeroref = max(numeroref)+1
	select case when (max(d.numeroref) is null) then 1 else max(d.numeroref)+1 end into v_numeroref 
	from mod_logistica.dat_documento as d
	--where d.idestructuracomun = 200532273 and d.iddoc = 101 and d.idejercicio = 990000012;
	where d.idestructuracomun = $2 and d.iddoc = v_iddoc and d.idejercicio = r_datos_insertar.idejercicio;
	
	--insertando en dat_documento
	insert into mod_logistica.dat_documento(/*iddocumento, nrodoc,*/ iddoc, anno, fechacontable, observaciones,
										cronologia, version, idusuario, idoperacion, estado, idejercicio,
										hora, idestructuracomun, aprobadopor, idperiodo, idcomprobante, 
										controlfirma, idnodo, numeroref, idespecialidad/*, iduebdestino, 
										idcentrocostotransf, firmado, qrdocumento, qrpago, idbloqueousuario, uuidflag*/)
	values (/*?, ?,*/ v_iddoc, r_datos_insertar.anno, r_datos_insertar.fechacontable, 'Documento para reflejar el traslado externo entre entidades.',
			null/*cronologia*/, null/*version*/, v_idusuario, v_idoperacion, 1 /*elaboracion*/, r_datos_insertar.idejercicio,
			null/*hora*/, $2, v_idusuario, r_datos_insertar.idperiodo, null/*idcomprobante*/,
			0, null/*idnodo*/, v_numeroref, v_idespecialidad/*, ?, 
			?, ?, ?, ?, ?, ?*/) returning iddocumento into v_iddocumento_generado;
	
	--validar v_iddocumento_generado
	if(v_iddocumento_generado is not null)then
		--insertando en dat_documentoactivo
		insert into mod_logactivofijotangible.dat_documentoactivo(iddocumentoactivo) values (v_iddocumento_generado);
		--insertando en dat_doctransfentidades
		insert into mod_logactivofijotangible.dat_doctransfentidades(iddoctranfentidades, identidaddestino)	values (v_iddocumento_generado, $3);		
	else
		raise exception 'v_iddocumento_generado es null';
	end if;
	
	--datos para el movimiento de los productos
	perform mod_migracion_aft.f_aux_crear_movimientos(v_iddocumento_generado, $2, $1, $3, $5);
	
	-- < confirmar documento >
	--insertando en his_bitacora
	insert into mod_logistica.his_bitacora(iddocumento, operacion, fecha, hora, idusuario,
										   fechacontable )
	values (v_iddocumento_generado, 'Documento confirmado', now()::date, to_char(now(), 'HH12:MI:SS')::time, v_idusuario,
			r_datos_insertar.fechacontable);
	--raise notice 'Documento confirmado: %',v_iddocumento_generado;
	--cambiar el estado del documento a 2-Preparado 
	--update mod_logistica.dat_documento set estado = 2 where iddocumento = v_iddocumento_generado;
	
	--validar cuadre almacen
	--?????
	
	-- < confirmar documento />	
	
	-- < aprobar documento >
	--cambiar el estado del documento a 3-Aprobado 
	update mod_logistica.dat_documento set estado = 3 where iddocumento = v_iddocumento_generado;
	--raise notice 'Estado aprobado: %',v_iddocumento_generado;
	
	--asignar nrodoc = max(nrodoc)+1
	select case when (max(d.nrodoc) is null) then 1 else max(d.nrodoc)+1 end as max_nrodoc into v_nro_doc from mod_logistica.dat_documento as d
	where d.estado = 3 and d.idestructuracomun = $2 and d.iddoc = v_iddoc and d.idejercicio = r_datos_insertar.idejercicio;
	
	--raise notice 'nrodoc: % para el iddocumento:% ',v_nro_doc,v_iddocumento_generado;
	
	--insertando en his_bitacora
	insert into mod_logistica.his_bitacora(iddocumento, operacion, fecha, hora, idusuario,
										   fechacontable )
	values (v_iddocumento_generado, 'Documento aprobado', now()::date, to_char(now(), 'HH12:MI:SS')::time, v_idusuario,
			r_datos_insertar.fechacontable);
	--raise notice 'Documento aprobado: %',v_iddocumento_generado;
	
	--aprobadoPoryFecha método php ??????
	
	--establecer cronología
	--cronología
	select case when (max(d.cronologia) is null ) then 1 else max(d.cronologia)+1 end as max_cronologia into v_cronologia_doc from mod_logistica.dat_documento as d
		where d.iddocumento = v_iddocumento_generado;
	
	--cambiar la cronología del documento
	update mod_logistica.dat_documento set cronologia = v_cronologia_doc, nrodoc = v_nro_doc where iddocumento = v_iddocumento_generado;
	--raise notice 'cronologia: % para el iddocumento: %',v_cronologia_doc,v_iddocumento_generado;
	v_nro_doc:=null;
	--cambiar la cronología del movimiento
	--?????
	
	--insertando en his_bitacora
	insert into mod_logistica.his_bitacora(iddocumento, operacion, fecha, hora, idusuario,
										   fechacontable )
	values (v_iddocumento_generado, 'Cronología establecida', now()::date, to_char(now(), 'HH12:MI:SS')::time, v_idusuario,
			r_datos_insertar.fechacontable);
			
	--raise notice 'Cronología establecida: %',v_iddocumento_generado;
	
	--marcar como generado el documento
	if($5 = 'MMAFT')then
		--activo
		update mod_migracion_aft.log_bitacora_cambios
		set doc_generado_activo = 1, iddocumento_activo = v_iddocumento_generado
		where origen=$1 and area_origen=$2;
		--ejecutar el cambio para el área
		for r_sql in (select sql_org_des_rn, sql_org_des_prod from mod_migracion_aft.log_bitacora_cambios
				 		where doc_generado_activo = 1 and iddocumento_activo = v_iddocumento_generado) loop
			execute r_sql.sql_org_des_rn;
			--raise notice 'cambio en registro numérico generado con v_iddocumento_generado: % para los ACTIVOS.',v_iddocumento_generado;
			execute r_sql.sql_org_des_prod;
			--raise notice 'cambio en producto generado para los ACTIVOS.';
		end loop;
		
	elsif($5 = '005')then
		--uh
		update mod_migracion_aft.log_bitacora_cambios
		set doc_generado_uh = 1, iddocumento_uh = v_iddocumento_generado
		where origen=$1 and area_origen=$2;
		--ejecutar el cambio para el área
		for r_sql in (select sql_org_des_rn, sql_org_des_prod from mod_migracion_aft.log_bitacora_cambios
				 		where doc_generado_uh = 1 and iddocumento_uh = v_iddocumento_generado) loop
			execute r_sql.sql_org_des_rn;
			--raise notice 'cambio en registro numérico generado con v_iddocumento_generado: % para los UH.',v_iddocumento_generado;
			execute r_sql.sql_org_des_prod;
			--raise notice 'cambio en producto generado para los UH.';
		end loop;		
	else
		raise notice 'AVISO!!!! Documento creado con iddocumento: %, pero con iddoc: % ',v_iddocumento_generado,v_iddoc_mmaft_uh;
	end if;
	-- < aprobar documento />
	--raise notice 'Traslado externo terminado. Detalles: mod_migracion_aft.log_bitacora_cambios.';
END;
$BODY$;

ALTER FUNCTION mod_migracion_aft.f_aux_crear_documento(numeric, numeric, numeric, numeric, text, text, numeric)
    OWNER TO zeolides;
