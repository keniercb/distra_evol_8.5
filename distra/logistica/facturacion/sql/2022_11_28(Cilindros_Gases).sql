ALTER TABLE mod_logfacturacion.nom_categoriaprecio
  ADD COLUMN IF NOT EXISTS exentoexterior NUMERIC(1,0) DEFAULT 0;

CREATE SEQUENCE IF NOT EXISTS mod_logfacturacion.sec_nomcilindro_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;
  
CREATE SEQUENCE IF NOT EXISTS mod_logfacturacion.sec_datcilindroentidad_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

CREATE SEQUENCE IF NOT EXISTS mod_logfacturacion.sec_datcilindrofactura_seq
  INCREMENT 1 MINVALUE 100000
  MAXVALUE 1099999999 START 100001
  CACHE 1;  
  
CREATE TABLE IF NOT EXISTS mod_logfacturacion.nom_cilindro (
  idnomcilindro NUMERIC(19,0) DEFAULT nextval('mod_logfacturacion.sec_nomcilindro_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255),
  fechainicio DATE,
  fechafin DATE,
  estado NUMERIC(1,0) DEFAULT 1,
  idumedida NUMERIC(19,0) DEFAULT 0,
  capacidad NUMERIC(25,6) DEFAULT 0,
  CONSTRAINT pk_cilindro PRIMARY KEY(idnomcilindro)
) 
WITH (oids = false);

ALTER TABLE mod_logfacturacion.nom_cilindro
  ALTER COLUMN idnomcilindro SET STATISTICS 0;

ALTER TABLE mod_logfacturacion.nom_cilindro
  ALTER COLUMN denominacion SET STATISTICS 0;

ALTER TABLE mod_logfacturacion.nom_cilindro
  ALTER COLUMN fechainicio SET STATISTICS 0;

ALTER TABLE mod_logfacturacion.nom_cilindro
  ALTER COLUMN fechafin SET STATISTICS 0;

COMMENT ON TABLE mod_logfacturacion.nom_cilindro
IS 'Tabla nomencladora que almacena los cilindros';

COMMENT ON COLUMN mod_logfacturacion.nom_cilindro.idnomcilindro
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_logfacturacion.nom_cilindro.denominacion
IS 'Almacena la denominación del cilindro.';

COMMENT ON COLUMN mod_logfacturacion.nom_cilindro.fechainicio
IS 'Almacena la fecha de inicio.';

COMMENT ON COLUMN mod_logfacturacion.nom_cilindro.fechafin
IS 'Almacena la fecha de final.';

COMMENT ON COLUMN mod_logfacturacion.nom_cilindro.estado
IS 'Estado del cilindro';

ALTER TABLE mod_logfacturacion.nom_cilindro
  OWNER TO zeolides;
  

CREATE TABLE IF NOT EXISTS mod_logfacturacion.nom_indicadorcilindro (
  idindicador NUMERIC(19,0) NOT NULL,
  idusuario NUMERIC(19,0),
  fecha DATE,
  CONSTRAINT nom_indicadorcilindro_pkey PRIMARY KEY(idindicador)
) 
WITH (oids = false);

ALTER TABLE mod_logfacturacion.nom_indicadorcilindro
  ALTER COLUMN idindicador SET STATISTICS 0;

ALTER TABLE mod_logfacturacion.nom_indicadorcilindro
  ALTER COLUMN idusuario SET STATISTICS 0;

ALTER TABLE mod_logfacturacion.nom_indicadorcilindro
  OWNER TO postgres;


CREATE TABLE IF NOT EXISTS mod_logfacturacion.dat_cilindroentidad (
  idcilindroentidad NUMERIC(19,0) DEFAULT nextval('mod_logfacturacion.sec_datcilindroentidad_seq'::regclass) NOT NULL,
  idestructuracomun NUMERIC(19,0),
  idnomcilindro NUMERIC(19,0),
  CONSTRAINT pk_cilindroentidad PRIMARY KEY(idcilindroentidad),
  CONSTRAINT fk_cilindro_cilindroentidad FOREIGN KEY (idnomcilindro)
    REFERENCES mod_logfacturacion.nom_cilindro(idnomcilindro)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_filaestruc_cilindroentidad FOREIGN KEY (idestructuracomun)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logfacturacion.dat_cilindroentidad
  ALTER COLUMN idcilindroentidad SET STATISTICS 0;

ALTER TABLE mod_logfacturacion.dat_cilindroentidad
  ALTER COLUMN idestructuracomun SET STATISTICS 0;

ALTER TABLE mod_logfacturacion.dat_cilindroentidad
  ALTER COLUMN idnomcilindro SET STATISTICS 0;

COMMENT ON TABLE mod_logfacturacion.dat_cilindroentidad
IS 'Tabla utilizada para almacenar los cilindros por entidad';

COMMENT ON COLUMN mod_logfacturacion.dat_cilindroentidad.idcilindroentidad
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_logfacturacion.dat_cilindroentidad.idestructuracomun
IS 'Llave foránea que proviene de la tabla mod_estructuracomp.nom_filaestruc.';

COMMENT ON COLUMN mod_logfacturacion.dat_cilindroentidad.idnomcilindro
IS 'Llave foránea que proviene de la tabla mod_logfacturacion.nom_cilindro.';

ALTER TABLE mod_logfacturacion.dat_cilindroentidad
  OWNER TO zeolides;

CREATE TABLE IF NOT EXISTS mod_logfacturacion.dat_cilindrofactura (
  idcilindrofactura NUMERIC(19,0) DEFAULT nextval('mod_logfacturacion.sec_datcilindrofactura_seq'::regclass) NOT NULL,
  iddocumento NUMERIC(19,0),
  idindicador NUMERIC(19,0),
  idmovimiento NUMERIC(19,0),
  idelementofactura NUMERIC(19,0),
  cantidad NUMERIC(25,6) DEFAULT 0,
  idumedida NUMERIC(19,0),
  factorconversion NUMERIC(25,6) DEFAULT 1,
  denominacion VARCHAR(150),
  idnomcilindro NUMERIC(19,0),
  capacidad NUMERIC(25,6),
  calculo NUMERIC(25,6) DEFAULT 0,
  CONSTRAINT dat_cilindrofactura_pkey PRIMARY KEY(idcilindrofactura),
  CONSTRAINT dat_cilindrofactura_fk FOREIGN KEY (iddocumento)
    REFERENCES mod_logistica.dat_documento(iddocumento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_cilindrofactura_fk1 FOREIGN KEY (idelementofactura)
    REFERENCES mod_logfacturacion.dat_elementosfactura(idelementofactura)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_cilindrofactura_fk2 FOREIGN KEY (idmovimiento)
    REFERENCES mod_logistica.dat_movimiento(idmovimiento)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_cilindrofactura_fk3 FOREIGN KEY (idnomcilindro)
    REFERENCES mod_logfacturacion.nom_cilindro(idnomcilindro)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logfacturacion.dat_cilindrofactura
  OWNER TO postgres;  
  
ALTER TYPE mod_logfacturacion.td_modelofacturaprod
  ADD ATTRIBUTE denomcilindro VARCHAR,
  ADD ATTRIBUTE cantidadcilindro NUMERIC;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modelofacturaprod (
  p_iddocumento numeric,
  p_monedacontable numeric,
  p_monedalternativa numeric
)
RETURNS SETOF mod_logfacturacion.td_modelofacturaprod AS
$body$
DECLARE

	v_rec mod_logfacturacion.td_modelofacturaprod;
    v_conf numeric;
    v_diferencia numeric;
	BEGIN    
    
    	v_conf := (select cf.listarmcomercial from mod_logfacturacion.conf_configuracionfactura cf 
        		  where cf.idestructuracomun = (select df.idestructuracomun from mod_logfacturacion.dat_docfactura df where df.idfactura = $1 limit 1) limit 1);
                  
		if v_conf = 1 then
        	for v_rec in              

            (select DISTINCT 

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2) 
            from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select (dde.preciotarifa- (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2)) * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3) from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select (dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3))* def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            (CASE WHEN dpn.tipo = 1 THEN 'Partes, Piezas o Componentes' ELSE 'Servicios Asociados' END) as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	 COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro
			
            from mod_logfacturacion.dat_elementosfactura def
            left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador		
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = def.idelementofactura
            where def.idfactura = $1)
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Servicios Asociados' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
			0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            null, null
            from mod_logfacturacion.dat_elementosfactura def 

            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad

            where def.idfactura = $1)

            union

            (select

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,
             
            (case when (
                select count(*) from mod_logfacturacion.dat_elementocategoria dec11 where dec11.idmovimiento = dm.idmovimiento
            ) = 0 then (select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) 
             else 
            (select dmm1.preciocontable from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento) end) as precio,
             
            (case when (
                select count(*) from mod_logfacturacion.dat_elementocategoria dec11 where dec11.idmovimiento = dm.idmovimiento
            ) = 0 then round((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2),2) 
             else 
            round((select dmm1.preciocontable * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),2) end) as importe, 
            /*(case when dpf.idtipoprecio is not null and coalesce((select coalesce(dmp.preciopromedio,0) from mod_logfacturacion.dat_matrizprecio dmp 
                                                                  where dmp.idestructuracomun = (select from mod_logfacturacion.dat_docfactura) 
                                                        and dmp.idindicador = ni.idindicador and dmp.idtipoprecio = dpf.idtipoprecio limit 1),0) <> 1)*/
            --(select dmm1.preciocontable from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento) as precio,

            --round((select dmm1.preciocontable * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),2) as importe,
            COALESCE((select dmm1.precioalternativo from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),0) as precioalternativo,
            COALESCE((select dmm1.precioalternativo * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Partes, Piezas o Componentes' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dm.idmovimiento as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            coalesce(dprod.cantidad,0) as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro
            
            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
            
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = dm.idmovimiento
            
            where dm.iddocumento = $1)
            union
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            (COALESCE((select sum(round(dec1.valor*dm1.cantidad,2)) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2 and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2),0)) as precio,

            (COALESCE((select sum(round(dec1.valor*dm1.cantidad,2)) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2),0)) as importe,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3),0)) as precioalternativo,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3),0)) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'y' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dcd.idcuentadesgloseprecio as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddfm.idfactura = p_iddocumento limit 1)
                ,
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                )
            ) as monedaitem, null, null          

            from mod_logfacturacion.dat_elementocategoria dec
            inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dec.idmovimiento
            inner join mod_logfacturacion.dat_cuentadesgloseprecio dcd on dcd.idcuentadesgloseprecio = dec.idcuentadesgloseprecio
            --inner join mod_logfacturacion.dat_categoriaprecioentidad dce on dce.idcategoriaprecioentidad = dcd.idcategoriaprecioentidad
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcd.idcategoriaprecio        
            where dm.iddocumento = $1)
            union
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0) as precio,

            round(COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0),2) as importe,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as precioalternativo,

            COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'Z' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            null as identificador,
            (select estado from mod_logistica.dat_documento where iddocumento = $1),
            0 as existencia,
            (
            	COALESCE(
                	(select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                    inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp11 on ddcp11.idmonedacategoria = mmo.idmoneda
                    inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                    where ddcp11.idcategoriafactura = dcp.idcategoriafactura limit 1)
                ,
                	COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        inner join mod_logfacturacion.dat_categoriapreciofactura dcp11 on dcp11.idfactura = ddfm.idfactura
                        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp11 on ddcp11.idcategoriafactura = dcp11.idcategoriafactura
                        where ddfm.idfactura = p_iddocumento and dcp11.idcategoriafactura = dcp.idcategoriafactura 
                        and ddcp11.idmonedacategoria is null limit 1)
                    ,
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                    )
                )
            ) as monedaitem,
            null, null
            

            from mod_logfacturacion.dat_categoriapreciofactura dcp
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio        
            where dcp.idfactura = $1)

            loop
                v_diferencia = 0;
                if v_rec.codigo = '-' and v_rec.identificador is not null then
                    v_diferencia := (select coalesce((
                    coalesce((select sum(round(coalesce(mm.precio*dm.cantidad,0),2)+round(coalesce(des.preciotarifa*de.cantidad,0),2)) from mod_logistica.dat_documento dd
                    left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                    left join mod_logfacturacion.dat_elementosfactura de on de.idfactura = dd.iddocumento
                    left join mod_logistica.dat_movmoneda mm on mm.idmovimiento = dm.idmovimiento and mm.idmoneda = 9900000000
                    left join mod_logfacturacion.dat_desgloselemento des on des.idelementofactura = de.idelementofactura and des.idmoneda = 9900000000
                    inner join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento or ec.idelementofactura = de.idelementofactura
                    where dd.iddocumento = $1 and ec.idcuentadesgloseprecio = v_rec.identificador),0)
                    -
                    coalesce((select sum(round(coalesce(dm.preciocontable*dm.cantidad,0),2)/*+round(coalesce(dm.preciocontable*dm.cantidad,0),2)*/)
                              +sum(round(ec.valor*dm.cantidad,2)) from mod_logistica.dat_documento dd
                    left join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
                    left join mod_logfacturacion.dat_elementosfactura de on de.idfactura = dd.iddocumento
                    left join mod_logistica.dat_movmoneda mm on mm.idmovimiento = dm.idmovimiento and mm.idmoneda = 9900000000
                    left join mod_logfacturacion.dat_desgloselemento des on des.idelementofactura = de.idelementofactura and des.idmoneda = 9900000000
                    inner join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento or ec.idelementofactura = de.idelementofactura
                    where dd.iddocumento = $1 and ec.idcuentadesgloseprecio = v_rec.identificador),0)),0));
                    
                    v_rec.precio = v_rec.precio + v_diferencia;
                    v_rec.importe = v_rec.importe + v_diferencia;
                end if;
                if v_rec.importe > 0 then
                	return next v_rec;
                end if;    
            end loop;
        else
        	for v_rec in              

            (select DISTINCT 

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            round((select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2),2) as importe,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            (CASE WHEN dpn.tipo = 1 THEN 'Partes, Piezas o Componentes' ELSE 'Servicios Asociados' END) as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                        inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                        where ddfm.idfactura = p_iddocumento limit 1)
                    ,
                        (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
                    ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro        

            from mod_logfacturacion.dat_elementosfactura def
            left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador		
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idelementofactura = def.idelementofactura
            
            where def.idfactura = $1)
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            '' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            def.idelementofactura as identificador,
            0 as estado,
            0 as existencia,
            COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
            ,
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
            ) as monedaitem, null, null
            from mod_logfacturacion.dat_elementosfactura def 

            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad

            where def.idfactura = $1)

            union

            (select

            (case when length(ni.numeropieza) = 0 or ni.numeropieza is null then ni.codigo else ni.numeropieza end) as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,

            (select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) as precio,

            round((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2),2) as importe,
            COALESCE((select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as precioalternativo,
            COALESCE((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Partes, Piezas o Componentes' as tipoindicador,
            null as nuevocodigo,
            0 as peso,
            dm.idmovimiento as identificador,
            0 as estado,
            coalesce(dprod.cantidad,0) as existencia,
            COALESCE(
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo
                inner join mod_logfacturacion.dat_docfactura ddfm on ddfm.idmoneda = mmo.idmoneda
                where ddfm.idfactura = p_iddocumento limit 1)
            ,
                (select mmo.codigoiso from mod_datosmaestros.nom_moneda mmo where mmo.idmoneda = p_monedacontable)
            ) as monedaitem,
            cf.denominacion as denomcilindro,
            cf.cantidad as cantcilindro

            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento
            
            left join mod_logfacturacion.dat_cilindrofactura cf on cf.idmovimiento = dm.idmovimiento

            where dm.iddocumento = $1)

            loop

                return next v_rec;

            end loop;
        end if;
		

	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

COMMENT ON FUNCTION mod_logfacturacion.f_modelofacturaprod(p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric)
IS 'ees';

ALTER FUNCTION mod_logfacturacion.f_modelofacturaprod (p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric)
  OWNER TO zeolides;  