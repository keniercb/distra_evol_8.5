CREATE SEQUENCE IF NOT EXISTS public.sec_excel_vehiculo_sasa_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 999999999999999999
    CACHE 1;
ALTER SEQUENCE public.sec_excel_vehiculo_sasa_seq OWNER TO zeolides;

CREATE TABLE IF NOT EXISTS public.excel_vehiculo_sasa
(
    agencia character varying(4) COLLATE pg_catalog."default",
    codigo_cliente character varying(30) COLLATE pg_catalog."default",
    contrato character varying(255) COLLATE pg_catalog."default",
    tipo character varying(255) COLLATE pg_catalog."default",
    matricula character varying(255) COLLATE pg_catalog."default",
    marca character varying(255) COLLATE pg_catalog."default",
    modelo character varying(255) COLLATE pg_catalog."default",
    denominacion character varying COLLATE pg_catalog."default",
    vin character varying(255) COLLATE pg_catalog."default",
    count bigint,
	procesado integer DEFAULT 0,
    migrado integer DEFAULT 0,
    idtupla numeric(19,0) NOT NULL DEFAULT nextval('public.sec_excel_vehiculo_sasa_seq'::regclass)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.excel_vehiculo_sasa OWNER to zeolides;

GRANT ALL ON TABLE public.excel_vehiculo_sasa TO zeolides;

COMMENT ON COLUMN public.excel_vehiculo_sasa.migrado
    IS 'Indicador para controlar si el dato fue migrado.';

COMMENT ON COLUMN public.excel_vehiculo_sasa.idtupla
    IS 'Identificador de la tupla.';

DROP FUNCTION IF EXISTS mod_datosmaestros.f_importar_vehiculos(numeric,character varying);
CREATE OR REPLACE FUNCTION mod_datosmaestros.f_importar_vehiculos(idformat numeric, codigo_raiz character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

DECLARE

  v_record record;
  v_tipos record;--nivel 2

  v_idindicador_raizpadre numeric;
  v_idindicador_niveldos numeric;
  v_idindicador_niveltres numeric;
  v_idtipovehiculo_nuevo numeric;
  v_idtipovehiculo_insert numeric;
  v_idmodelo_insert numeric;
  v_idmodelo_nuevo numeric;
  v_idmarca_insert numeric;
  v_idmarca_nuevo numeric;
  
  v_idcliente numeric;
  
  v_orden numeric;
  
BEGIN
	
	ALTER TABLE IF EXISTS mod_datosmaestros.conf_maestropordserv DROP CONSTRAINT IF EXISTS ak_formato;
	ALTER TABLE IF EXISTS mod_datosmaestros.conf_maestropordserv
    	ADD CONSTRAINT ak_formato UNIQUE (idformato);
	
	--
	insert into mod_datosmaestros.conf_maestropordserv(idformato, gencodigo, denominacion, activo)
	values ($1, 1, 'Vehículos Equipo Reparación', 1) on conflict do nothing;
		--buscar si la raíz existe.
	select idindicador into v_idindicador_raizpadre from mod_datosmaestros.nom_indicador
	where idformato = $1 and denominacion ilike 'Equipos para reparación excel';
	
	if (v_idindicador_raizpadre is null) then
		--crear padre
		INSERT INTO mod_datosmaestros.nom_indicador(
		idarbol, ordenizq, ordender, idpais, idumedida, 
		idformato, idnaturaleza, idtabla, 
		idtablageneral,
		codigo, numeropieza, denominacion, 
		descripcion, estado, nivel, arridtablas, arridtablasgenerales,
		version, idespecialidad, tipo, fechainicio, fechafin, activo,
		precio, orden, idelementogasto, idelementogastoalt,
		idusuario, precioalternativo, idfabricante)
		(
		SELECT idarbol, ordenizq, ordender, idpais, idumedida, 
		$1 as idformato, idnaturaleza, idtabla, 
		idtablageneral, 
		$2 as codigo, numeropieza,
		'Equipos para reparación excel' as denominacion, 
		'Equipos para reparación excel' as descripcion,
		estado, nivel, arridtablas, arridtablasgenerales,
		version, idespecialidad, tipo, fechainicio, fechafin, activo,
		precio, orden, idelementogasto, idelementogastoalt,
		idusuario, precioalternativo, idfabricante 
		FROM mod_datosmaestros.nom_indicador
		WHERE denominacion ilike 'PRODUCTOS%' 
			AND idindicador = 1
		ORDER BY idindicador ASC
		)
		RETURNING idindicador into v_idindicador_raizpadre;
	else
		raise notice 'La raíz (Equipos para reparación excel) ya existe en el (Árbol de productos y servicios).';
	end if;
/*
	--formatos
	--nivel 2
	select idparteformato into v_idformato_nivel_dos from mod_datosmaestros.dat_parteformato
	where idformato = $1 --99000000020
		and nivel = 2
	order by idparteformato asc;
	
	--nivel 3 hoja
	select idparteformato into v_idformato_nivel_tres from mod_datosmaestros.dat_parteformato
	where idformato = $1 --99000000020
		and nivel = 3
	order by idparteformato asc;
*/	
	--adicionar tipos de vehículo nuevos.
		insert into mod_crmclienteproveedor.nom_tipovehiculo(denominacion, descripcion, fechainicio)
		(	select distinct (upper(left(excel.tipo, 1))||lower(substring(excel.tipo, 2, length(excel.tipo))) ) as denominacion,
							(upper(left(excel.tipo, 1))||lower(substring(excel.tipo, 2, length(excel.tipo))) ) as descripcion,
							now()::date as fechainicio
			from public.excel_vehiculo_sasa as excel 
			left join mod_crmclienteproveedor.nom_tipovehiculo as tipovehiculo on ( 
			  	--trim(replace(tipovehiculo.denominacion, 'ó','o')) 
				trim((upper(left(replace(tipovehiculo.denominacion, 'ó','o'), 1))||lower(substring(replace(tipovehiculo.denominacion, 'ó','o'), 2, length(replace(tipovehiculo.denominacion, 'ó','o')))))) 
				= trim((upper(left(excel.tipo, 1))||lower(substring(excel.tipo, 2, length(excel.tipo)))))
				)
			where tipovehiculo.idtipovehiculo is null
			group by excel.tipo,tipovehiculo.idtipovehiculo
		) on conflict do nothing;

	--nivel 2
	v_orden := 2;
	for v_tipos in (select distinct (upper(left(excel.tipo, 1))||lower(substring(excel.tipo, 2, length(excel.tipo))) ) as tipo, tipovehiculo.idtipovehiculo
					from public.excel_vehiculo_sasa as excel 
					left join mod_crmclienteproveedor.nom_tipovehiculo as tipovehiculo on ( 
							  --trim(replace(tipovehiculo.denominacion, 'ó','o')) = trim((upper(left(excel.tipo, 1))||lower(substring(excel.tipo, 2, length(excel.tipo)))))
						trim((upper(left(replace(tipovehiculo.denominacion, 'ó','o'), 1))||lower(substring(replace(tipovehiculo.denominacion, 'ó','o'), 2, length(replace(tipovehiculo.denominacion, 'ó','o')))))) 
						= trim((upper(left(excel.tipo, 1))||lower(substring(excel.tipo, 2, length(excel.tipo)))))
						)
					group by excel.tipo,tipovehiculo.idtipovehiculo) loop
		--buscar si existe el nivel 2
		select idindicador into v_idindicador_niveldos from mod_datosmaestros.nom_indicador 
		where idformato = $1 and idpadre = v_idindicador_raizpadre
			and denominacion = v_tipos.tipo and descripcion = v_tipos.tipo
			and nivel = 2;
		
		if (v_idindicador_niveldos is null) then
			--Insertar los niveles 2 según los tipos de vehículos
			insert into mod_datosmaestros.nom_indicador(
			idpadre, idarbol, idpais, idumedida, 
			idformato, 
			idnaturaleza, idtabla, idtablageneral, 
			numeropieza,
			denominacion, 
			descripcion, 
			estado,
			nivel, 
			arridtablas, arridtablasgenerales,
			version, idespecialidad, tipo, fechainicio, fechafin, activo,
			precio, orden, idelementogasto, idelementogastoalt,
			idusuario, precioalternativo, idfabricante)
			(
			select v_idindicador_raizpadre as idpadre, idarbol, idpais, idumedida, 
			$1 as idformato,
			idnaturaleza, idtabla, idtablageneral, 
			numeropieza,
			v_tipos.tipo as denominacion, 
			v_tipos.tipo as descripcion,
			estado,
			2 as nivel,
			arridtablas, arridtablasgenerales, version, idespecialidad, tipo, fechainicio, fechafin, activo,
			precio,
			v_orden as orden, --orden por árbol
			idelementogasto, idelementogastoalt, idusuario, precioalternativo, idfabricante 
			from mod_datosmaestros.nom_indicador
				where denominacion ilike 'PRODUCTOS%' 
				and idindicador = 1
			order by idindicador asc
			)
			returning idindicador into v_idindicador_niveldos;
		else
			raise notice '% ya existe como nivel 2 de la raíz (Equipos para reparación excel).',v_tipos.tipo;
		end if;
	
		v_orden := v_orden+1;
		
		--nivel 3
		--Información a cargar en nivel 3
		for v_record in ( select excel.idtupla, excel.agencia, excel.codigo_cliente, excel.contrato, contrato.idcontrato,
							excel.tipo,
						 	tipovehiculo.idtipovehiculo,
							excel.matricula, excel.marca, marca.idmarca, 
						    excel.modelo, 
						 	case when (excel.modelo is null) then -1 else modelo.idmodelo end as idmodelo,
						 	excel.denominacion, excel.vin, excel.count
						  from public.excel_vehiculo_sasa as excel
						  left join mod_datosmaestros.nom_modelo as modelo on (trim(modelo.denominacion) = trim(excel.modelo))
						  left join mod_datosmaestros.nom_marca as marca on (trim(marca.codigo) = trim(excel.marca))
						  left join mod_crmclienteproveedor.nom_tipovehiculo as tipovehiculo on ( 
							  --trim(replace(tipovehiculo.denominacion, 'ó','o')) = trim((upper(left(excel.tipo, 1))||lower(substring(excel.tipo, 2, length(excel.tipo)))))
						  		trim((upper(left(replace(tipovehiculo.denominacion, 'ó','o'), 1))||lower(substring(replace(tipovehiculo.denominacion, 'ó','o'), 2, length(replace(tipovehiculo.denominacion, 'ó','o')))))) 
								= trim((upper(left(excel.tipo, 1))||lower(substring(excel.tipo, 2, length(excel.tipo)))))
						  )
						  left join mod_crmcontratacion.dat_contrato as contrato on trim(numero) = trim(excel.contrato)
						where excel.migrado = 0 and excel.vin is not null
						 and v_tipos.idtipovehiculo = tipovehiculo.idtipovehiculo
						order by excel.idtupla
					 )loop
		
			--verificar valores nuevos
			--modelo
			if (v_record.idmodelo is null) then
				--crear el modelo
				insert into mod_datosmaestros.nom_modelo(denominacion, estado, fechainicio)
				values (v_record.modelo, 1, now()::date) returning idmodelo into v_idmodelo_nuevo;
				
				v_idmodelo_insert := v_idmodelo_nuevo;

			else
				v_idmodelo_insert := v_idmodelo_nuevo;
			end if;
			
			--marca
			if (v_record.idmarca is null) then
				insert into mod_datosmaestros.nom_marca(denominacion, estado, codigo)
				values (v_record.marca, 1, v_record.marca) returning idmarca into v_idmarca_nuevo;
				
				v_idmarca_insert := v_idmarca_nuevo;

			else
				v_idmarca_insert := v_record.idmarca;
			end if;
			
			--buscar si existe el nivel 3
			select idindicador into v_idindicador_niveltres from mod_datosmaestros.nom_indicador 
			where idformato = $1 and idpadre = v_idindicador_niveldos
				and denominacion = v_tipos.tipo and descripcion = v_tipos.tipo
				and nivel = 3 and numeropieza = v_record.vin;
			
			if (v_idindicador_niveltres is null) then
				--Insertar los niveles 3 según los tipos de vehículos
				insert into mod_datosmaestros.nom_indicador(
				idpadre, idarbol, idpais, idumedida, 
				idformato, 
				idnaturaleza, idtabla, idtablageneral, 
				numeropieza,
				denominacion, 
				descripcion, 
				estado,
				nivel, 
				arridtablas, arridtablasgenerales,
				version, idespecialidad, tipo, fechainicio, fechafin, activo,
				precio, orden, idelementogasto, idelementogastoalt,
				idusuario, precioalternativo, idfabricante)
				(
				select v_idindicador_niveldos as idpadre, idarbol, idpais, idumedida, 
				$1 as idformato,
				idnaturaleza, idtabla, idtablageneral, 
				v_record.vin as numeropieza,
				v_tipos.tipo as denominacion, 
				v_tipos.tipo as descripcion,
				estado,
				3 as nivel,
				arridtablas, arridtablasgenerales, version, idespecialidad, tipo, fechainicio, fechafin, activo,
				precio,
				v_orden as orden, --orden por árbol
				idelementogasto, idelementogastoalt, idusuario, precioalternativo, idfabricante 
				from mod_datosmaestros.nom_indicador
					where denominacion ilike 'PRODUCTOS%' 
					and idindicador = 1
				order by idindicador asc
				)
				returning idindicador into v_idindicador_niveltres;

				--insertar en nom_indicadorhoja
				insert into mod_datosmaestros.nom_indicadorhoja(
					idindicador, codigoauxiliar,
					--codigobarra, peso, largo,
					--ancho, alto, tienelote, formapresentacion, idumedidaoperativa,
					--idgruposubgrupo, 
					explotacion,
					-- almacenado,
					idmarca,
					--requieremedicion, capacidadlitros,
					idmodelo--,
					--equipo, precio, tipocontrol,
					--precioalternativo, descripcionventa, isuh, referencia
				)
				values (
						v_idindicador_niveltres, v_record.matricula,
						--?, ?, ?,
						--?, ?, ?, ?, ?,
						--?,
						1,
						--?,
						v_idmarca_insert,
						--?, ?,
						v_idmodelo_insert --,
						--?, ?, ?,
						--?, ?, ?, ?
					);

				--obtener idcliente
				select idclientesproveedores into v_idcliente from mod_datosmaestros.nom_clientesproveedor where trim(codigo) = v_record.codigo_cliente;

				--insertar en dat_indicadorcliente
				insert into mod_datosmaestros.dat_indicadorcliente(
					idindicador, idcliente, idcontrato,
					--ano, estado, 
					fechainicio, codigoaux)
				values (v_idindicador_niveltres, v_idcliente, v_record.idcontrato,
						--?, ?, 
						now()::date, v_record.matricula);

				--insertar en nom_indicadorplanif
				insert into mod_datosmaestros.nom_indicadorplanif(idindicador, nivelplanif)
				values (v_idindicador_niveltres,1);

				--marcar como procesado y migrado
				UPDATE public.excel_vehiculo_sasa SET procesado = 1, migrado = 1 WHERE idtupla = v_record.idtupla;

			else
				raise notice '% (vin: %) ya existe como nivel 3 del nivel 2 con id: % ,en la raíz (Equipos para reparación excel).',v_tipos.tipo,v_record.vin,v_idindicador_niveldos;
				--marcar como procesado y descartado
				UPDATE public.excel_vehiculo_sasa SET procesado = 1, migrado = 2 WHERE idtupla = v_record.idtupla;
			end if;
			
		end loop;
		
	end loop;
	
END;
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_importar_vehiculos(numeric,character varying) OWNER TO zeolides;
--select * from mod_datosmaestros.f_importar_vehiculos(99000000020,'602');
