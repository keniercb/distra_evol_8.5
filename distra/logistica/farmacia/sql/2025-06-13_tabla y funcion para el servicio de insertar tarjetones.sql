CREATE TABLE IF NOT EXISTS mod_logfarmacia.dat_imptarjetabodega
(
    idimptarjetaapi bigint NOT NULL DEFAULT nextval('mod_logfarmacia.dat_imptarjeta_idimptarjeta_seq'::regclass),
    nronucleo numeric(19,0),
    numeroidentidad character varying(200) COLLATE pg_catalog."default",
    nombre character varying(200) COLLATE pg_catalog."default",
    snombre character varying(200) COLLATE pg_catalog."default",
    apellido character varying(200) COLLATE pg_catalog."default",
    sapellido character varying(200) COLLATE pg_catalog."default",
    direccion character varying(200) COLLATE pg_catalog."default",
    codigoproducto character varying COLLATE pg_catalog."default",
    norma numeric(19,0),
    Bodega character varying(255) COLLATE pg_catalog."default",
    oficoda character varying(150) COLLATE pg_catalog."default",
    CONSTRAINT pk_impotarjetaapi PRIMARY KEY (idimptarjetaapi)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logfarmacia.dat_imptarjeta
    OWNER to zeolides;
ALTER TABLE mod_logfarmacia.dat_imptarjetabodega
ADD COLUMN idestructura numeric(19,0);

ALTER TABLE mod_logfarmacia.dat_imptarjetabodega
ADD COLUMN fechaimportacion timestamp DEFAULT now();


CREATE SEQUENCE IF NOT EXISTS mod_logfarmacia.dat_imptarjetaapi_idimptarjeta_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE mod_logfarmacia.dat_imptarjetaapi_idimptarjeta_seq
    OWNED BY mod_logfarmacia.dat_imptarjetabodega.idimptarjetaapi;

ALTER SEQUENCE mod_logfarmacia.dat_imptarjetaapi_idimptarjeta_seq
    OWNER TO zeolides;
	
	
	CREATE OR REPLACE FUNCTION mod_logfarmacia.f_importatarjeta_bodega(
    p_idestructura numeric,
    p_idusuario numeric DEFAULT 300000000172 )
    RETURNS numeric[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_nroidentidad record;
  v_iddoc numeric;
  v_idespecialidad numeric;
  v_ejerciciorecord record;
  v_fechacontable date;
  v_cronologia numeric;
  v_datosgenerales record;
  
  v_productos record;
  v_result integer[];
  v_idtarjetadocumento NUMERIC;
  v_datosventa NUMERIC;
  v_datostarjeta NUMERIC;
  v_comprobarpaciente NUMERIC;
  v_cont NUMERIC;
  v_cont_productos NUMERIC;
  v_idindicador NUMERIC;
  v_tarjeta_creada BOOLEAN;
  v_idcuadrobasico NUMERIC;
  v_fecha_inscripcion DATE;
  v_default_provincia_id NUMERIC := 2; -- Valor por defecto para provincia
  v_default_municipio_id NUMERIC := 2; -- Valor por defecto para municipio

BEGIN
  v_cont := 0;
  v_cont_productos := 0;
  v_result := ARRAY[1];
  
  -- 1. Obtener documento tarjetaMedLog
  v_iddoc := (SELECT ddp.iddoc 
              FROM mod_datosmaestros.dat_documentoprim ddp
              INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos
              INNER JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist
              WHERE ndp.abreviatura = 'tarjetaMedLog' 
              AND des.idestructuracomun = p_idestructura 
              LIMIT 1);
    
  -- 2. Obtener especialidad del usuario
  v_idespecialidad := (SELECT cue.idespecialidad 
                       FROM mod_logistica.conf_usuarioespecialidad cue 
                       WHERE cue.idusuario = p_idusuario 
                       LIMIT 1);
    
  -- 3. Obtener ejercicio activo
  v_ejerciciorecord := mod_logistica.f_obtenerejercicioactivo(121, p_idestructura); 	
  
  -- 4. Obtener fecha contable
  v_fechacontable := (SELECT df.fecha 
                      FROM mod_datosmaestros.dat_fecha df
                      INNER JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = df.idestructurasubsist
                      WHERE des.idsubsistema = 121 
                      AND des.idestructuracomun = p_idestructura 
                      LIMIT 1);
  
  -- 5. Procesar cada número de identidad único
  FOR v_nroidentidad IN (
    SELECT DISTINCT numeroidentidad
    FROM mod_logfarmacia.dat_imptarjetabodega
  ) LOOP
    v_tarjeta_creada := FALSE;
    v_cont := v_cont + 1;
    
    -- 5.1 Obtener datos generales del paciente
    SELECT 
      a.numeroidentidad,  
      a.nombre as nombrepaciente,
      a.direccion,
      a.oficoda as cmf,
      a.Bodega as provincia,
      a.nronucleo as nofarmacia,
      a.snombre as snombrepaciente,
      a.apellido as apellidopaciente,
      a.sapellido as sapellidopaciente,
      (SELECT btrim(concat(a.nombre, ' ', a.snombre, ' ', a.apellido, ' ', a.sapellido))) as nombrecompletopaciente,
      '' as municipio,
      '' as nombremedico,
      '' as nroregistro,
      '' as policlinico,
      '' as hospital,
      '' as otrasunidades,
      NULL as fechaexpedicion,
      '' as cmfarchivado,
      '' as snombremedico,
      '' as apellidomedico,
      '' as sapellidomedico,
      '' as nombrecompletomedico,
      CASE 
        WHEN (SELECT dp.iddpt FROM mod_datosmaestros.nom_dpt dp WHERE dp.denominacion ilike a.Bodega LIMIT 1) IS NOT NULL 
        THEN (SELECT dp.iddpt FROM mod_datosmaestros.nom_dpt dp WHERE dp.denominacion ilike a.Bodega LIMIT 1)
        ELSE v_default_provincia_id
      END as idprovincia,
      v_default_municipio_id as idmunicipio
    INTO v_datosgenerales
    FROM mod_logfarmacia.dat_imptarjetabodega a
    WHERE a.numeroidentidad = v_nroidentidad.numeroidentidad
    LIMIT 1;
    
    -- 5.2 Verificar si el paciente ya existe
    SELECT vc.numeroidentidad INTO v_comprobarpaciente 
    FROM mod_logpuntoventa.dat_ventacliente vc
    WHERE vc.numeroidentidad = v_nroidentidad.numeroidentidad;
    
    -- 5.3 Crear documento y paciente si no existe
    IF (v_comprobarpaciente IS NULL) THEN
      v_cronologia := (SELECT max(dd.cronologia) FROM mod_logistica.dat_documento dd);
      
      -- Crear documento de tarjeta
      INSERT INTO mod_logistica.dat_documento(
        iddoc, idejercicio, idestructuracomun, idperiodo, estado, cronologia, idusuario,
        fechacontable, anno, numeroref, aprobadopor, nrodoc, idbloqueousuario
      )
      VALUES (
        v_iddoc, v_ejerciciorecord.idejercicioactual, p_idestructura, 
        v_ejerciciorecord.idperiodoactual, 3, v_cronologia, p_idusuario, 
        v_fechacontable, 
        date_part('year', CAST(to_char(v_fechacontable, 'DD/MM/YYYY HH24:MI') as timestamp)), 
        (COALESCE((SELECT max(dd.numeroref) 
                   FROM mod_logistica.dat_documento dd 
                   WHERE dd.iddoc = v_iddoc
                   AND dd.idejercicio = v_ejerciciorecord.idejercicioactual 
                   AND dd.idestructuracomun = p_idestructura), 0) + 1),
        p_idusuario, 
        (COALESCE((SELECT max(dd.nrodoc) 
                   FROM mod_logistica.dat_documento dd 
                   WHERE dd.iddoc = v_iddoc
                   AND dd.idejercicio = v_ejerciciorecord.idejercicioactual 
                   AND dd.idestructuracomun = p_idestructura), 0) + 1), 
        p_idusuario
      ) 
      RETURNING iddocumento INTO v_idtarjetadocumento;
      
      -- Determinar fecha de inscripción
      IF v_datosgenerales.fechaexpedicion IS NOT NULL THEN
        v_fecha_inscripcion := v_datosgenerales.fechaexpedicion::date;
      ELSE
        v_fecha_inscripcion := CURRENT_DATE;
      END IF;
      
      -- Registrar paciente con manejo explícito de tipos
      IF(v_datosgenerales.numeroidentidad IS NOT NULL) THEN
        BEGIN
          INSERT INTO mod_logpuntoventa.dat_ventacliente(
            numeroidentidad, 
            nombre, 
            direccion,
            municipio,
            provincia,
            idprovincia,
            idmunicipio,
            fechainscripcion
          )
          VALUES (
            v_datosgenerales.numeroidentidad, 
            v_datosgenerales.nombrecompletopaciente,
            COALESCE(v_datosgenerales.direccion, ''),
            v_datosgenerales.municipio,
            v_datosgenerales.provincia,
            v_datosgenerales.idprovincia,
            v_datosgenerales.idmunicipio, 
            v_fecha_inscripcion
          ) 
          RETURNING idventacliente INTO v_datosventa;
        EXCEPTION WHEN foreign_key_violation THEN
          -- Si falla por clave foránea, intentar con valores por defecto
          INSERT INTO mod_logpuntoventa.dat_ventacliente(
            numeroidentidad, 
            nombre, 
            direccion,
            municipio,
            provincia,
            idprovincia,
            idmunicipio,
            fechainscripcion
          )
          VALUES (
            v_datosgenerales.numeroidentidad, 
            v_datosgenerales.nombrecompletopaciente,
            COALESCE(v_datosgenerales.direccion, ''),
            v_datosgenerales.municipio,
            v_datosgenerales.provincia,
            v_default_provincia_id,
            v_default_municipio_id,
            v_fecha_inscripcion
          ) 
          RETURNING idventacliente INTO v_datosventa;
        END;
      END IF;

      -- Registrar tarjeta de medicamento
      IF(v_datosventa IS NOT NULL) THEN
        INSERT INTO mod_logfarmacia.dat_tarjetamedicamento(
          idtarjetamedicamento, 
          consultoriomedico, 
          area, 
          idpaciente
        )
        VALUES (
          v_idtarjetadocumento, 
          v_datosgenerales.cmf,
          v_datosgenerales.policlinico,
          v_datosventa
        ) 
        RETURNING idtarjetamedicamento INTO v_datostarjeta;
        v_tarjeta_creada := TRUE;
      ELSE
        RAISE EXCEPTION 'Al numeroidentidad: % no se le pudo registrar en dat_tarjetamedicamento por falta del registro en dat_ventacliente', v_nroidentidad.numeroidentidad;
      END IF;
    ELSE
      -- Obtener tarjeta existente
      SELECT tm.idtarjetamedicamento INTO v_datostarjeta
      FROM mod_logpuntoventa.dat_ventacliente vc
      INNER JOIN mod_logfarmacia.dat_tarjetamedicamento tm ON tm.idpaciente = vc.idventacliente
      WHERE vc.numeroidentidad = v_nroidentidad.numeroidentidad
      LIMIT 1;
    END IF;
    
    -- 5.4 Procesar TODOS los productos de esta tarjeta
    FOR v_productos IN
  SELECT 
    a.norma as dosis,
    a.codigoproducto,
    (SELECT ni.idindicador 
     FROM mod_datosmaestros.nom_indicador ni
     WHERE ni.numeropieza = a.codigoproducto
     LIMIT 1) as idindicador,
    '' as medicamento,
    '' as nombremedico,
    '' as nroregistro,
    '' as hospital,
    '' as otrasunidades,
    NULL as fechaexpedicion,
    '' as nombrecompletomedico,
    (SELECT cb.idcuadrobasico
     FROM mod_logfarmacia.conf_cuadrobasico cb
     WHERE cb.idindicador = (SELECT ni.idindicador 
                            FROM mod_datosmaestros.nom_indicador ni
                            WHERE ni.numeropieza = a.codigoproducto
                            LIMIT 1)
     LIMIT 1) as idcuadrobasico
  FROM mod_logfarmacia.dat_imptarjetabodega a
  WHERE a.numeroidentidad = v_nroidentidad.numeroidentidad
LOOP
  -- Registrar cada producto de la tarjeta
  IF v_productos.idindicador IS NOT NULL AND v_datostarjeta IS NOT NULL THEN
    INSERT INTO mod_logfarmacia.dat_productotarjetamedicamento(
      idcuadrobasico,
      idtarjetamedicamento,
      dosis,
      fechaemision,
      fechaexpiracion,
      origenprescripcion,
      especialidad,
      aprobado,
      nombremedico,
      hospital,
      otrasunidades,
      nroregistro,
      idindicador
    )
    VALUES (
      v_productos.idcuadrobasico,
      v_datostarjeta,
      COALESCE(v_productos.dosis, 0)::numeric,
      COALESCE(v_productos.fechaexpedicion::date, CURRENT_DATE),
      NULL, -- fechaexpiracion
      NULL, -- origenprescripcion
      NULL, -- especialidad
      1, -- aprobado
      NULLIF(v_productos.nombrecompletomedico, ''),
      NULLIF(v_productos.hospital, ''),
      NULLIF(v_productos.otrasunidades, ''),
      NULLIF(v_productos.nroregistro, ''),
      v_productos.idindicador
    );
     v_cont_productos := v_cont_productos + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN ARRAY[1, v_cont, v_cont_productos];
END;
$BODY$;

ALTER FUNCTION mod_logfarmacia.f_importatarjeta_bodega(numeric, numeric)
    OWNER TO zeolides;