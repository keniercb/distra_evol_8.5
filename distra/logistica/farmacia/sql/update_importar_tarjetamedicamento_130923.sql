--dat_imptarjeta
DROP TABLE IF EXISTS mod_logfarmacia.dat_imptarjeta;
CREATE TABLE IF NOT EXISTS mod_logfarmacia.dat_imptarjeta
(
    idimptarjeta bigserial NOT NULL,
    nofarmacia numeric(19,0),
    numeroidentidad character varying(200) COLLATE pg_catalog."default",
    nombrepaciente character varying(200) COLLATE pg_catalog."default",
    snombrepaciente character varying(200) COLLATE pg_catalog."default",
    apellidopaciente character varying(200) COLLATE pg_catalog."default",
    sapellidopaciente character varying(200) COLLATE pg_catalog."default",
    direccion character varying(200) COLLATE pg_catalog."default",
    cmf numeric(255,0),
    provincia character varying(150) COLLATE pg_catalog."default",
    municipio character varying(150) COLLATE pg_catalog."default",
    codigomed character varying COLLATE pg_catalog."default",
    medicamento character varying(255) COLLATE pg_catalog."default",
    dosis numeric(19,0),
    nombremedico character varying(200) COLLATE pg_catalog."default",
    snombremedico character varying(200) COLLATE pg_catalog."default",
    apellidomedico character varying(200) COLLATE pg_catalog."default",
    sapellidomedico character varying(200) COLLATE pg_catalog."default",
    nroregistro character varying COLLATE pg_catalog."default",
    cmfarchivado numeric(19,0),
    policlinico character varying(255) COLLATE pg_catalog."default",
    hospital character varying(150) COLLATE pg_catalog."default",
    otrasunidades character varying(150) COLLATE pg_catalog."default",
    fechaexpedicion date,
    eliminado boolean NOT NULL DEFAULT false,
    producto_adicionado boolean NOT NULL DEFAULT false,
    idestructura numeric,
    num_farmac_incorrecto boolean DEFAULT false,
    producto_actualizado boolean NOT NULL DEFAULT false,
    CONSTRAINT pk_impotarjeta PRIMARY KEY (idimptarjeta)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logfarmacia.dat_imptarjeta OWNER to zeolides;
COMMENT ON COLUMN mod_logfarmacia.dat_imptarjeta.eliminado IS 'Columna para marcar los casos a descartar por falta de datos en CI y/o MEDICAMENTO.';

--log_estadisticaimptarjeta
CREATE TABLE IF NOT EXISTS mod_logfarmacia.log_estadisticaimptarjeta
(
    idestadistica bigserial NOT NULL,
    idestructura numeric(19,0),
	fechaimportacion date NOT NULL DEFAULT now()::date,
	totalregistrosexcel integer,
	registrosinsertados integer,
	registrosactualizados integer,
	registrosdescartados integer,
    CONSTRAINT pk_estadisticaimptarjeta PRIMARY KEY (idestadistica)
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS mod_logfarmacia.log_estadisticaimptarjeta OWNER to zeolides;

--log_detallesestadisticaimptarjeta
CREATE TABLE IF NOT EXISTS mod_logfarmacia.log_detallesestadisticaimptarjeta
(
    iddetalleestadistica bigserial NOT NULL,
    idestructura numeric(19,0),
    idestadistica numeric,
    numeroidentidad character varying COLLATE pg_catalog."default",
    nombrepaciente character varying(200) COLLATE pg_catalog."default",
    snombrepaciente character varying(200) COLLATE pg_catalog."default",
    apellidopaciente character varying(200) COLLATE pg_catalog."default",
    sapellidopaciente character varying(200) COLLATE pg_catalog."default",
    direccion character varying(200) COLLATE pg_catalog."default",
    cmf numeric(6,0),
    provincia character varying(150) COLLATE pg_catalog."default",
    municipio character varying(150) COLLATE pg_catalog."default",
    codigomed character varying COLLATE pg_catalog."default",
    medicamento character varying(255) COLLATE pg_catalog."default",
    dosis numeric(4,0),
    nombremedico character varying(200) COLLATE pg_catalog."default",
    snombremedico character varying(200) COLLATE pg_catalog."default",
    apellidomedico character varying(200) COLLATE pg_catalog."default",
    sapellidomedico character varying(200) COLLATE pg_catalog."default",
    nroregistro character varying COLLATE pg_catalog."default",
    cmfarchivado numeric(6,0),
    policlinico character varying(255) COLLATE pg_catalog."default",
    hospital character varying(150) COLLATE pg_catalog."default",
    otrasunidades character varying(150) COLLATE pg_catalog."default",
    fechaexpedicion date,
    motivodescarte character varying COLLATE pg_catalog."default",
    nofarmacia numeric(19,0),
    CONSTRAINT pk_detalleestadisticaimptarjeta PRIMARY KEY (iddetalleestadistica)
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logfarmacia.log_detallesestadisticaimptarjeta OWNER to zeolides;

--f_detallesestadisticaimptarjeta
CREATE OR REPLACE FUNCTION mod_logfarmacia.f_detallesestadisticaimptarjeta(
	motivo character varying,
	where_cond character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

declare
v_idtarjetamedicamentoprod numeric;
begin
EXECUTE 'insert into mod_logfarmacia.log_detallesestadisticaimptarjeta(
		numeroidentidad, nombrepaciente, snombrepaciente, nofarmacia,
		apellidopaciente, sapellidopaciente, direccion, cmf, 
		provincia, municipio, codigomed, medicamento, dosis, nombremedico,
		snombremedico, apellidomedico, sapellidomedico,	nroregistro,
		cmfarchivado, policlinico,hospital, otrasunidades, fechaexpedicion, idestructura, motivodescarte)
	(select numeroidentidad, nombrepaciente, snombrepaciente, nofarmacia,
		apellidopaciente, sapellidopaciente, direccion, cmf, 
		provincia, municipio, codigomed, medicamento, dosis, nombremedico, 
		snombremedico, apellidomedico, sapellidomedico, nroregistro, 
		cmfarchivado, policlinico, hospital, otrasunidades, fechaexpedicion, idestructura, ' 
		|| $1 || 'from mod_logfarmacia.dat_imptarjeta
		where '|| $2 ||')';

end;
$BODY$;

ALTER FUNCTION mod_logfarmacia.f_detallesestadisticaimptarjeta(character varying, character varying) OWNER TO zeolides;

--f_asignarmedicamento
CREATE OR REPLACE FUNCTION mod_logfarmacia.f_asignarmedicamento(
	idtarjetamedicamento numeric,
	fechaemision date,
	nroregistro character varying,
	nombre character varying,
	dosis numeric DEFAULT NULL::numeric,
	hospital character varying DEFAULT NULL::character varying,
	otrasunidades character varying DEFAULT NULL::character varying,
	idcuadrobasico numeric DEFAULT NULL::numeric)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

declare
v_idtarjetamedicamentoprod numeric;
begin
--Asignar nuevo medicamento al documento (tarjeta médica).
	insert into mod_logfarmacia.dat_productotarjetamedicamento(idtarjetamedicamento, fechaemision, nroregistro,
															   nombremedico, dosis, hospital, otrasunidades,idcuadrobasico)
    values ($1, $2, $3,	$4, $5, $6,	$7, $8)
	returning idproductotarjetamedicamento
    into v_idtarjetamedicamentoprod;

	return v_idtarjetamedicamentoprod;
end;
$BODY$;

ALTER FUNCTION mod_logfarmacia.f_asignarmedicamento(numeric, date, character varying, character varying, numeric, character varying, character varying, numeric) OWNER TO zeolides;

--f_creartarjeta
CREATE OR REPLACE FUNCTION mod_logfarmacia.f_creartarjeta(
	p_iddoc numeric,
	p_idejercicio numeric,
	p_idestructura numeric,
	p_idperiodo numeric,
	p_estado numeric,
	p_cronologia numeric,
	p_idusuario numeric,
	p_fechacontable date,
	p_anno numeric,
	p_numeroref numeric,
	p_cmf numeric,
	p_policlinico character varying,
	p_idventacliente numeric)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_iddocumento numeric;
v_nuevatarjetamedicamento numeric;
begin
--Crear la nueva tarjeta de medicamento como documento en el sistema.
	insert into mod_logistica.dat_documento(iddoc, idejercicio, idestructuracomun,
													idperiodo, estado, cronologia, idusuario,
        										    fechacontable, anno, numeroref, aprobadopor,
													nrodoc, idbloqueousuario)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $7, $10, $7)
	returning iddocumento
    into v_iddocumento;

	insert into mod_logfarmacia.dat_tarjetamedicamento(idtarjetamedicamento, consultoriomedico, area, idpaciente)
	values (v_iddocumento, $11, $12, $13)
	returning idtarjetamedicamento
    into v_nuevatarjetamedicamento;

	return v_nuevatarjetamedicamento;
end;
$BODY$;

ALTER FUNCTION mod_logfarmacia.f_creartarjeta(numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, numeric, numeric, numeric, character varying, numeric) OWNER TO zeolides;


--f_importatarjeta
DROP FUNCTION IF EXISTS mod_logfarmacia.f_importatarjeta(numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logfarmacia.f_importatarjeta(
	p_idestructura numeric,
	p_iddoc numeric,
	p_idoperacion numeric,
	p_idejercicio numeric,
	p_idperiodo numeric,
	p_cronologia numeric,
	p_idusuario numeric,
	p_fechacontable date,
	p_anno numeric,
	p_numeroref numeric)
    RETURNS numeric[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	v_result integer[];
	v_total integer;
	v_idestadistica numeric;
	v_cant_insert integer;
	v_cant_update integer;
	v_productos record;
	v_idtarjeta_existente numeric;
  	v_idventacliente numeric;
  	v_nuevatarjetamedicamento numeric;
    v_idtarjetamedicamentoprod numeric;
	v_medicamento numeric;
	r_datos_farmacia record;

BEGIN
	--Total de tuplas del excel
	select count(*) into v_total from mod_logfarmacia.dat_imptarjeta;

	--Creando estadística
	insert into mod_logfarmacia.log_estadisticaimptarjeta(idestructura, totalregistrosexcel)
	values (p_idestructura, v_total) returning idestadistica into v_idestadistica;

	--Marcar datos de la tabla dat_imptarjeta para la estructura
	update mod_logfarmacia.dat_imptarjeta set idestructura = p_idestructura; 
	
	--Obtener el código de la estructura (Farmacia)
	select codigo,denominacion into r_datos_farmacia from mod_estructuracomp.dat_estructuraop 
	where idestructuraop = p_idestructura limit 1;
	
	--Suprimir tuplas sin información en CI y MEDICAMENTO (POR DENOMINACION)
	update mod_logfarmacia.dat_imptarjeta set eliminado = true 
	where idimptarjeta in (select idimptarjeta from mod_logfarmacia.dat_imptarjeta
  							where (length(numeroidentidad) isnull) or (length(medicamento) isnull)
						  		or (length(nofarmacia::text) isnull));

	--Suprimir tuplas sin información en CI y MEDICAMENTO (POR CODIGO)
	/*update mod_logfarmacia.dat_imptarjeta set eliminado = true 
	where idimptarjeta in (select idimptarjeta from mod_logfarmacia.dat_imptarjeta
  							where (length(numeroidentidad) isnull) or (length(codigomed) isnull));--codigomed
	*/							

--Tarjetón con fecha de expeción más reciente
	for v_productos in
		select
		 a.idimptarjeta,
		 a.numeroidentidad,
 		 (select btrim(concat(a.nombrepaciente, ' ', a.snombrepaciente, ' ', a.apellidopaciente, ' ', a.sapellidopaciente))
         ) as nombrecompletopaciente,
         a.nombrepaciente,
		 a.snombrepaciente,
         a.apellidopaciente,
         a.sapellidopaciente,
         a.direccion,
         a.cmf,
		 dp.idpadre as idprovincia,
         a.provincia,
		 dp.iddpt as idmunicipio,
         a.municipio,
         a.medicamento,
		 --requiere cambio en el código php.
		 --a.codigomed,
		 ind.idindicador,
         a.dosis,
		 a.otrasunidades,
         a.fechaexpedicion,
         a.cmfarchivado,
         a.nofarmacia::text,	
		 (select btrim(concat(a.nombremedico, ' ', a.snombremedico, ' ', a.apellidomedico, ' ', a.sapellidomedico))
         ) as nombrecompletomedico,
		 a.nombremedico,
         a.snombremedico,
         a.apellidomedico,
         a.sapellidomedico,		 
         a.nroregistro,
         a.policlinico,
         a.hospital
		from mod_logfarmacia.dat_imptarjeta a
		--por denominacion
		inner join mod_datosmaestros.nom_indicador as ind on (trim(a.medicamento) = trim(ind.denominacion))
		--por codigo (requiere a.codigomed en mod_logfarmacia.dat_imptarjeta)
		--inner join mod_datosmaestros.nom_indicador as ind on (ind.codigo = a.codigomed /*or ind.numeropieza = a.codigomed*/)
  		left join mod_datosmaestros.nom_dpt dp on (dp.idnivelestructural = 17 and dp.denominacion ilike '%'||a.municipio||'%')
  		where (eliminado is false) 
			--Por denominación del medicamento
			--and (length(a.numeroidentidad) <> 0 and length(a.medicamento) <> 0)
			--Por codigo del medicamento
			--and (length(a.numeroidentidad) <> 0 and length(a.codigomed) <> 0)
	loop
		--Set variables
		v_medicamento:=null; v_idventacliente:=null; v_idtarjeta_existente:=null;v_idtarjetamedicamentoprod:=null;
		
		--Verificar si la farmacia tiene configurado el código en Estructura y Comp.
		if(r_datos_farmacia.codigo notnull)then
			--Verificar si la información corresponde a la farmacia.
			if(r_datos_farmacia.codigo = v_productos.nofarmacia)then
				--Buscar idcuadrobasico del medicamento
				--por codigo: v_productos.codigomed en el 1er parámetro, por denominacion: v_productos.medicamento en el 2do parámetro,
				--si desea el identificador del cuadro básico: true en el 3er parámetro.
				--select * into v_medicamento from mod_logfarmacia.f_buscarmedicamento(null, v_productos.medicamento,true);

				--Obtener el idcuadrobasico por: idindicador.
				select max(idcuadrobasico) into v_medicamento from mod_logfarmacia.conf_cuadrobasico as c
				where c.idindicador = v_productos.idindicador;

				--Obtener el idventacliente (paciente) con el numeroidentidad.
				select idventacliente into v_idventacliente from mod_logpuntoventa.dat_ventacliente 
				where numeroidentidad = v_productos.numeroidentidad;

				--Verificar si existe un paciente con el numeroidentidad.
				if (v_idventacliente notnull)then
					--Buscar el documento que tiene asociado como (tarjeta médica).
					select idtarjetamedicamento into v_idtarjeta_existente from mod_logfarmacia.dat_tarjetamedicamento as tm
					inner join mod_logistica.dat_documento as doc on (tm.idtarjetamedicamento = doc.iddocumento)
					where tm.idpaciente = v_idventacliente and doc.iddoc = p_iddoc;

					--Verificar si existe una tarjeta de medicamento para el paciente.
					if(v_idtarjeta_existente notnull)then
						--Verificar si el paciente tiene ya ese producto registrado en la (tarjeta médica).
						if( (select exists(select idproductotarjetamedicamento from mod_logfarmacia.dat_productotarjetamedicamento
											where idtarjetamedicamento = v_idtarjeta_existente and idcuadrobasico = v_medicamento 
										  )
							)
						  )then
							--El paciente ya tiene ese medicamento asociado en el documento (tarjeta médica).
							--Se le actualiza la fecha de expedición si es más reciente 
							--que la que tiene almacenada para ese medicamento.
							update mod_logfarmacia.dat_productotarjetamedicamento set fechaemision = v_productos.fechaexpedicion
							where fechaemision < v_productos.fechaexpedicion and idtarjetamedicamento = v_idtarjeta_existente 
								and idcuadrobasico = v_medicamento;
							--Marcar el producto como actualizado
							update mod_logfarmacia.dat_imptarjeta set producto_actualizado = true
							where idimptarjeta = v_productos.idimptarjeta;								
						else
							--Asignar nuevo medicamento al documento (tarjeta médica).
							select * into v_idtarjetamedicamentoprod from mod_logfarmacia.f_asignarmedicamento(
								v_idtarjeta_existente,v_productos.fechaexpedicion,v_productos.nroregistro,v_productos.nombrecompletomedico,
								v_productos.dosis,v_productos.hospital, v_productos.otrasunidades,v_medicamento);
							--Marcar el producto como registrado
							update mod_logfarmacia.dat_imptarjeta set producto_adicionado = true
							where idimptarjeta = v_productos.idimptarjeta;
						end if;
					else
						raise notice 'ERROR !!!. Detalles: paciente en el sistema sin un documento del tipo tarjeta médica creado. (mod_logfarmacia.dat_tarjetamedicamento).';
						--Crear tarjeta médica al paciente existente. (inserta en : mod_logistica.dat_documento y mod_logfarmacia.dat_tarjetamedicamento).
						select * into v_nuevatarjetamedicamento from mod_logfarmacia.f_creartarjeta(p_iddoc, p_idejercicio, p_idestructura, p_idperiodo, 3,
															  p_cronologia, p_idusuario, p_fechacontable, p_anno, p_numeroref,
															  v_productos.cmf, v_productos.policlinico, v_idventacliente);

						--Asignar medicamento a la nueva (tarjeta médica). (inserta en : mod_logfarmacia.dat_productotarjetamedicamento).
						select * into v_idtarjetamedicamentoprod from mod_logfarmacia.f_asignarmedicamento(v_nuevatarjetamedicamento,v_productos.fechaexpedicion,
																										   v_productos.nroregistro,v_productos.nombrecompletomedico,
																										   v_productos.dosis,v_productos.hospital,v_productos.otrasunidades,
																										   v_medicamento);
						--Marcar el producto como registrado.
						update mod_logfarmacia.dat_imptarjeta set producto_adicionado = true 
						where idimptarjeta = v_productos.idimptarjeta;
					end if;			
				else
					--Registrar el nuevo paciente en mod_logpuntoventa.dat_ventacliente.
					insert into mod_logpuntoventa.dat_ventacliente(numeroidentidad, nombre, 
															   idprovincia, provincia, 
															   idmunicipio, municipio,
															   direccion, fechainscripcion)
					values (v_productos.numeroidentidad, v_productos.nombrecompletopaciente,
							v_productos.idprovincia, v_productos.provincia, 
							v_productos.idmunicipio, v_productos.municipio,
							v_productos.direccion, now()::date) returning idventacliente
					into v_idventacliente;

					--Verificar registro del nuevo paciente.
					if (v_idventacliente notnull)then
						--Crear tarjeta médica. (inserta en : mod_logistica.dat_documento y mod_logfarmacia.dat_tarjetamedicamento).
						select * into v_nuevatarjetamedicamento from mod_logfarmacia.f_creartarjeta(p_iddoc, p_idejercicio, p_idestructura, p_idperiodo, 3,
															  p_cronologia, p_idusuario, p_fechacontable, p_anno, p_numeroref,
															  v_productos.cmf, v_productos.policlinico, v_idventacliente);

						--Asignar medicamento a la nueva (tarjeta médica). (inserta en : mod_logfarmacia.dat_productotarjetamedicamento).
						select * into v_idtarjetamedicamentoprod from mod_logfarmacia.f_asignarmedicamento(v_nuevatarjetamedicamento,v_productos.fechaexpedicion,
																										   v_productos.nroregistro,v_productos.nombrecompletomedico,
																										   v_productos.dosis,v_productos.hospital,v_productos.otrasunidades,
																										   v_medicamento);
						--Marcar el producto como registrado
						update mod_logfarmacia.dat_imptarjeta set producto_adicionado = true
						where idimptarjeta = v_productos.idimptarjeta;
					else
						--No se pudo insertar en mod_logpuntoventa.dat_ventacliente
						raise notice 'ERROR !!!. Detalles: no se pudo adicionar el paciente en el sistema. (mod_logfarmacia.dat_ventacliente).';		
					end if;		
				end if;
			else
				--Marcar el producto con problema en el excel con el número de la farmacia
				--en relación a la estructura por la que se está ejecutando el importar.
				update mod_logfarmacia.dat_imptarjeta set num_farmac_incorrecto = true
				where idimptarjeta = v_productos.idimptarjeta;
			end if;
		else
		-----
		raise exception 'Por favor configure el "Código" en "Gestionar Estructura" con el número de
		la farmacia en la %', r_datos_farmacia.denominacion;
		end if;

	end loop;
	
	--Cantidad de datos importados.
	select count(*) into v_cant_insert from mod_logfarmacia.dat_imptarjeta where producto_adicionado = true;
	--Cantidad de datos actualizados.
	select count(*) into v_cant_update from mod_logfarmacia.dat_imptarjeta where producto_actualizado = true;
	--Insertar detalles, los casos con problemas en el número de la farmacia.
	PERFORM mod_logfarmacia.f_detallesestadisticaimptarjeta(
		'''NoFarmacia (Diferente al de la farmacia: '||'"'||r_datos_farmacia.denominacion||'"'||')''',
		'num_farmac_incorrecto = true');
	
	--Insertar detalles, los casos que no tienen numeroidentidad y/o medicamento
	PERFORM mod_logfarmacia.f_detallesestadisticaimptarjeta(
		'''Falta en Excel (No.Farmacia, CarnédeIdentidad y/o Medicamento)''',
		'eliminado = true');
	
	--Insertar detalles, los casos que no se importaron
	--Error con el medicamento y el nomenclador
	PERFORM mod_logfarmacia.f_detallesestadisticaimptarjeta(
		'''Medicamento no encontrado''',
		'producto_adicionado = false and eliminado = false 
		and num_farmac_incorrecto = false and producto_actualizado = false');
	
	--Estadísticas de la importación.
	update mod_logfarmacia.log_estadisticaimptarjeta
	set registrosinsertados = v_cant_insert, 
	registrosactualizados = v_cant_update,
	registrosdescartados = (v_total - v_cant_insert - v_cant_update)
	where idestadistica = v_idestadistica;
	
	update mod_logfarmacia.log_detallesestadisticaimptarjeta
	set idestadistica = v_idestadistica
	where idestadistica is null;
	
	--Respuesta si existen casos descartados.
	if(  (v_cant_insert + v_cant_update) <> v_total)then
		--Existen casos descartados. (total,insertados,actualizados,descartados)
		v_result:=array[v_total]||array[v_cant_insert]||array[v_cant_update]||array[(v_total - v_cant_insert - v_cant_update)];
	end if;
	
	return v_result;	

end;
$BODY$;

ALTER FUNCTION mod_logfarmacia.f_importatarjeta(numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, numeric, numeric)
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_logfarmacia.f_importatarjeta(numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, numeric, numeric)
    IS 'Versión 2.0';
