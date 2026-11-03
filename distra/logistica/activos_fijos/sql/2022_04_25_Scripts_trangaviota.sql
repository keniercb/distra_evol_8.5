DROP TYPE IF EXISTS mod_logactivofijotangible.td_listadoregistrodoc CASCADE;
CREATE TYPE mod_logactivofijotangible.td_listadoregistrodoc AS (
  idregnumerico NUMERIC(19,0),
  marca VARCHAR(255),
  nroserie VARCHAR(255),
  modelo VARCHAR(255),
  annofabricacion NUMERIC(19,0),
  nromotor1 VARCHAR(255),
  nromotor2 VARCHAR(255),
  denominacion VARCHAR(255),
  colorprim VARCHAR(255),
  colorsec VARCHAR(255),
  valoradquisicion NUMERIC(25,6),
  nromatricula VARCHAR(255),
  nrocirculacion VARCHAR(255),
  valorcontable NUMERIC(25,6),
  nroinventario VARCHAR(19),
  observaciones VARCHAR(255),
  nrobajaturautos VARCHAR(255),
  uebproc VARCHAR(255),
  destino VARCHAR(255),
  informetecnico VARCHAR(255),
  tipobaja NUMERIC(1,0),
  propuesta VARCHAR(255),
  reinscripcion VARCHAR(255)
);

ALTER TYPE mod_logactivofijotangible.td_listadoregistrodoc
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listadoregistrodoc (
  p_iddocumento numeric,
  p_iddestino numeric
)
RETURNS SETOF mod_logactivofijotangible.td_listadoregistrodoc AS
$body$
  DECLARE
  v_rec mod_logactivofijotangible.td_listadoregistrodoc;
    v_identificador varchar = '';
  v_sql1 varchar = '';
  v_select varchar = '';
  v_from varchar = '';
  BEGIN
  v_select = 'select
    drn.idregnumerico,
    na.denominacion as marca,
    drn.nroserie,
    no.denominacion as modelo,
    dmrna.annofabricacion,
    dmrnat.nromotor1,
    dmrnat.nromotor2,
    ni.denominacion as aft,
    ncprim.denominacion as colorprim,
    ncsec.denominacion as colorsec,
    dmrna.valoradquisicion,
    dmrnat.nromatricula,
    dmrnat.nrocirculacion,
    dmrna.valorcontable,
    drna.nroinventario,
    dd.observaciones,
    split_part(drna.nrobajaturautos, '||$$'/'$$||', 1) AS nrobajaturautos ';
    
    v_select = v_select || $$, (
    select  e2.denominacion as estructura
    from mod_logistica.dat_documento dd2
    inner join mod_logistica.dat_movimiento dm2 on dm2.iddocumento = dd2.iddocumento
    inner join mod_logactivofijotangible.dat_movregnumerico dmrn2 on dmrn2.idmovimiento = dm2.idmovimiento
    inner join mod_logactivofijotangible.dat_registronumerico drn2 on drn2.idregnumerico = dmrn2.idregnumerico   
    inner join mod_logactivofijotangible.dat_movregnumericoactivo dmrna2 on dmrna2.idmovregnumerico = dmrn2.idmovregnumerico
    inner JOIN mod_datosmaestros.nom_operacion nop2 on nop2.idnomoperaciones = dd2.idoperacion 
    inner join mod_estructuracomp.nom_filaestruc nft2 on nft2.idfila = dd2.idestructuracomun
    INNER JOIN mod_estructuracomp.dat_estructura e2 on e2.idestructura = nft2.idpadre
    
    where nop2.codigooperacion = 'OPER_TRASLADO_EXTER'
    and drn2.idregnumerico = drn.idregnumerico
    and dd2.estado = 3
    and dd2.cronologia > 0
    
    order by dd2.cronologia desc 
    limit 1) as uebprocedencia
    $$;
       
    v_from =' from mod_logistica.dat_documento dd
    inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
    inner join mod_logactivofijotangible.dat_movregnumerico dmrn on dmrn.idmovimiento = dm.idmovimiento
    inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = dmrn.idregnumerico
    inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = drn.idregnumerico
    inner join mod_logactivofijotangible.dat_movregnumericoactivo dmrna on dmrna.idmovregnumerico = dmrn.idmovregnumerico
    left join mod_logactivofijotangible.dat_movregnumericoactivotransp dmrnat on dmrnat.idmovregnumerico = dmrn.idmovregnumerico
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto    
    inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
    left join mod_datosmaestros.nom_marca na on na.idmarca = nih.idmarca
    left join mod_datosmaestros.nom_modelo no on no.idmodelo = nih.idmodelo
    left join mod_logactivofijotangible.nom_color ncprim on ncprim.idcolor = dmrna.idcolorprim
    left join mod_logactivofijotangible.nom_color ncsec on ncsec.idcolor = dmrna.idcolorsec
    ';
    
    if $2 is not null then
      v_from = v_from|| ' left join mod_logactivofijotangible.nom_destinofinal ndfd on ndfd.iddestinofinal='||$2;   
      v_from = v_from|| ' left join mod_logactivofijotangible.dat_destinofinalmedio ddf on ddf.idregistronumerico= drn.idregnumerico';
      v_from = v_from|| ' left join mod_logactivofijotangible.nom_lugarreinscripcion nlr on nlr.idreinscripcion = ddf.idreinscripcion';
      

      v_from = v_from|| ' left join mod_logactivofijotangible.dat_docbajaventa docbv on dd.iddocumento = docbv.iddocbajaventa';
      v_from = v_from|| ' left join mod_logactivofijotangible.dat_docpropuestabaja pdb on dd.iddocumento = pdb.iddocpropuestabaja';
      v_from = v_from|| ' left join mod_logactivofijotangible.dat_docbajadesarme docbd on dd.iddocumento = docbd.iddocbajadesarme';

      v_select = v_select || ' , ndfd.denominacion as destinofinal, COALESCE(docbv.informetecnico, docbd.informetecnico, pdb.informetecnico) as informetecnico';
      v_select = v_select || ' ,pdb.tipobaja as tipobaja';
      v_select = v_select || ' ,pdb.propuesta as propuesta';
      v_select = v_select || ' ,nlr.denominacion as reinscripcion';
    end if;
           
    if $2 is null then
      --v_from = v_from|| ' left join mod_logactivofijotangible.nom_destinofinal ndfd on ndfd.iddestinofinal='||$2;   
      v_from = v_from|| ' left join mod_logactivofijotangible.dat_destinofinalmedio ddf on ddf.idregistronumerico= drn.idregnumerico';
      v_from = v_from|| ' left join mod_logactivofijotangible.nom_lugarreinscripcion nlr on nlr.idreinscripcion = ddf.idreinscripcion';
      v_from = v_from|| ' left join mod_logactivofijotangible.nom_destinofinal ndfd2 on ndfd2.iddestinofinal= ddf.iddestinofinal';
      v_from = v_from|| ' left join mod_logactivofijotangible.dat_docbajaventa docbv on dd.iddocumento = docbv.iddocbajaventa';
      v_from = v_from|| ' left join mod_logactivofijotangible.dat_docpropuestabaja pdb on dd.iddocumento = pdb.iddocpropuestabaja';
      v_from = v_from|| ' left join mod_logactivofijotangible.dat_docbajadesarme docbd on dd.iddocumento = docbd.iddocbajadesarme';
      
      v_select = v_select || ' , ndfd2.denominacion as destinofinal, COALESCE(docbv.informetecnico, docbd.informetecnico, pdb.informetecnico) as informetecnico';
      v_select = v_select || ' ,pdb.tipobaja as tipobaja';
      v_select = v_select || ' ,pdb.propuesta as propuesta';
      v_select = v_select || ' ,nlr.denominacion as reinscripcion';
    
    end if;
    
   v_sql1 = v_select || v_from ;
   
   if $1 is not null then
   v_sql1 = v_sql1||' where dd.estado IN (2,3) and dd.iddocumento = '||$1;
   end if;
   
    for v_rec in execute v_sql1   
    
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

ALTER FUNCTION mod_logactivofijotangible.f_listadoregistrodoc (p_iddocumento numeric, p_iddestino numeric)
  OWNER TO zeolides;
  
  
CREATE SEQUENCE IF NOT EXISTS mod_logactivofijotangible.sec_nomlugarreinscipcion_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logactivofijotangible.sec_nomlugarreinscipcion_seq RESTART WITH 1000000014;  
  
CREATE TABLE IF NOT EXISTS mod_logactivofijotangible.nom_lugarreinscripcion (
  idreinscripcion NUMERIC(19,0) DEFAULT nextval('mod_logactivofijotangible.sec_nomlugarreinscipcion_seq'::regclass) NOT NULL,
  estado NUMERIC(1,0) DEFAULT 1,
  denominacion VARCHAR(255),
  fechainicio DATE,
  fechafin DATE,
  CONSTRAINT pk_lugarreinscripcion PRIMARY KEY(idreinscripcion)
) 
WITH (oids = false);

ALTER TABLE mod_logactivofijotangible.nom_lugarreinscripcion
  ALTER COLUMN idreinscripcion SET STATISTICS 0;

COMMENT ON TABLE mod_logactivofijotangible.nom_lugarreinscripcion
IS 'Tabla que almacena los datos de los destinos finales al realizar bajas.';

COMMENT ON COLUMN mod_logactivofijotangible.nom_lugarreinscripcion.idreinscripcion
IS 'Identificador del destino final.';

COMMENT ON COLUMN mod_logactivofijotangible.nom_lugarreinscripcion.estado
IS 'Activo o inactivo.';

COMMENT ON COLUMN mod_logactivofijotangible.nom_lugarreinscripcion.denominacion
IS 'Denominación del nomenclador destino final.';

COMMENT ON COLUMN mod_logactivofijotangible.nom_lugarreinscripcion.fechainicio
IS 'Fecha inicial';

COMMENT ON COLUMN mod_logactivofijotangible.nom_lugarreinscripcion.fechafin
IS 'Fecha final';

ALTER TABLE mod_logactivofijotangible.nom_lugarreinscripcion
  OWNER TO zeolides;

  
CREATE TABLE IF NOT EXISTS mod_logactivofijotangible.dat_destinofinalmedio (
  idregistronumerico NUMERIC(19,0) NOT NULL,
  iddestinofinal NUMERIC(19,0),
  idreinscripcion NUMERIC(19,0),
  CONSTRAINT dat_destinofinalmedio_pkey PRIMARY KEY(idregistronumerico),
  CONSTRAINT dat_destinofinalmedio_fk FOREIGN KEY (idregistronumerico)
    REFERENCES mod_logactivofijotangible.dat_registronumerico(idregnumerico)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_destinofinalmedio_fk1 FOREIGN KEY (iddestinofinal)
    REFERENCES mod_logactivofijotangible.nom_destinofinal(iddestinofinal)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_destinofinalmedio_fk2 FOREIGN KEY (idreinscripcion)
    REFERENCES mod_logactivofijotangible.nom_lugarreinscripcion(idreinscripcion)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logactivofijotangible.dat_destinofinalmedio.idregistronumerico
IS 'Identificador del registro numerico';

COMMENT ON COLUMN mod_logactivofijotangible.dat_destinofinalmedio.iddestinofinal
IS 'Identificador del destino final';

COMMENT ON COLUMN mod_logactivofijotangible.dat_destinofinalmedio.idreinscripcion
IS 'Identificador del lugar de reinscripcion';

ALTER TABLE mod_logactivofijotangible.dat_destinofinalmedio
  OWNER TO zeolides;
  
CREATE TABLE iF NOT EXISTS mod_logactivofijotangible.dat_docpropuestabaja (
  iddocpropuestabaja NUMERIC(19,0) NOT NULL,
  informetecnico VARCHAR,
  iddestinofinal NUMERIC(19,0),
  propuesta VARCHAR(100),
  tipobaja NUMERIC(1,0) DEFAULT 0,
  idreinscripcion NUMERIC(19,0),
  CONSTRAINT pk_docpropuestabaja PRIMARY KEY(iddocpropuestabaja),
  CONSTRAINT dat_docpropuestabaja_fk FOREIGN KEY (idreinscripcion)
    REFERENCES mod_logactivofijotangible.nom_lugarreinscripcion(idreinscripcion)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_destinofinal_docbajadesarme FOREIGN KEY (iddestinofinal)
    REFERENCES mod_logactivofijotangible.nom_destinofinal(iddestinofinal)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_documentoactivo_docpropuestabaja FOREIGN KEY (iddocpropuestabaja)
    REFERENCES mod_logactivofijotangible.dat_documentoactivo(iddocumentoactivo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logactivofijotangible.dat_docpropuestabaja.iddocpropuestabaja
IS 'Identificador de la tabla';

COMMENT ON COLUMN mod_logactivofijotangible.dat_docpropuestabaja.informetecnico
IS 'Almacena un resumen del informe';

COMMENT ON COLUMN mod_logactivofijotangible.dat_docpropuestabaja.iddestinofinal
IS 'Identificador del destino final de la baja';

COMMENT ON COLUMN mod_logactivofijotangible.dat_docpropuestabaja.propuesta
IS 'Almacena la propuesta que se hace';

COMMENT ON COLUMN mod_logactivofijotangible.dat_docpropuestabaja.tipobaja
IS '0 => Baja definitiva, 1 => Baja desarme';

ALTER TABLE mod_logactivofijotangible.dat_docpropuestabaja
  OWNER TO zeolides;


DROP TYPE IF EXISTS mod_logactivofijotangible.td_productocantdisponibleentidad CASCADE;
CREATE TYPE mod_logactivofijotangible.td_productocantdisponibleentidad AS (
  disponible NUMERIC(25,6),
  cantidad NUMERIC(25,6),
  cantidadsuma NUMERIC(25,6),
  denominacion VARCHAR,
  codigo VARCHAR,
  naturaleza VARCHAR,
  marca VARCHAR,
  marcaestado VARCHAR,
  modelo VARCHAR,
  modeloestado VARCHAR,
  cantidadtotal NUMERIC(25,6)
);

ALTER TYPE mod_logactivofijotangible.td_productocantdisponibleentidad
  OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_productocantdisponibleentidad (
  p_idestructura numeric,
  "isTransp" numeric = 0,
  "isUh" numeric = 0
)
RETURNS SETOF mod_logactivofijotangible.td_productocantdisponibleentidad AS
$body$
declare
 all_rec mod_logactivofijotangible.td_productocantdisponibleentidad;
 v_rec RECORD;
begin

create temp table tmp_registrosexistentes(
   disponible numeric(25,6),
   cantidad numeric(25,6),
   total numeric(25,6),
   denominacion varchar(255),
   codigo varchar(255),
   naturaleza varchar(255),
   marca varchar(255),
   marcaestado varchar(255),
   modelo varchar(255),
   modeloestado varchar(255),   
   idindicador numeric(19,0)
);

insert into tmp_registrosexistentes(
   disponible,
   cantidad,
   total,
   denominacion,
   codigo,
   naturaleza,
   marca,
   marcaestado,
   modelo,
   modeloestado,
   idindicador
) SELECT distinct
  0 as disponible,
  0 as cantidad,
  0 as total,

  i.denominacion as denominacion,
  i.codigo as codigo, 
  nat.denominacion as naturaleza,
  marc.denominacion as marca, 
  marc.estado as marcaestado, 
  model.denominacion as modelo, 
  model.estado as modeloestado,
  i.idindicador
  FROM mod_datosmaestros.nom_indicador i
  INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador 
  INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
  LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca 
  LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo
  INNER JOIN mod_logistica.dat_producto pd on pd.idindicador = i.idindicador 
  INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = pd.idproducto
  INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna2 ON rn.idregnumerico = rna2.idregnumerico
  
  WHERE ih.explotacion = 1
  AND pd.cronologia > 0 
  AND rna2.idestadoperacion not in(0,7, 6, 8, 9, 10)
	and pd.idestructuracomun = $1
	and (case when $2 = 0 then true else nat.idarbol = -6 end )
    and (case when $3 = 0 then ih.isuh <> 1 else ih.isuh = 1 end )
    
    
  GROUP BY i.idindicador, i.codigo, i.denominacion, nat.denominacion, marc.denominacion, model.denominacion, marc.estado, model.estado;
  
  
  
  update tmp_registrosexistentes
  set cantidad = q.cant  
  from (  
    SELECT count(rn2.idregnumerico) as cant, p.idindicador as id
    FROM mod_logactivofijotangible.dat_registronumerico rn2
    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
    
    WHERE 
    p.cronologia > 0         
    and rna.idestadoperacion not in(0,7, 6, 8, 9, 10)
	and p.idestructuracomun = $1
    group by p.idindicador
  )q where idindicador = q.id;
  
  
for all_rec in 
  select 
   t.disponible,
   t.cantidad,
   t.total,
   t.denominacion,
   t.codigo,
   t.naturaleza,
   t.marca,
   t.marcaestado,
   t.modelo,
   t.modeloestado,   
   (select sum(t2.cantidad) from tmp_registrosexistentes t2)  as cantidadtotal,
   t.idindicador 
   from tmp_registrosexistentes t  
   group by t.disponible,t.cantidad,t.total,t.denominacion,t.codigo,t.naturaleza,t.marca,t.marcaestado,t.modelo,t.modeloestado,t.idindicador 
   order by t.denominacion,t.marca,t.modelo
loop
 return next all_rec;
end loop;
drop table tmp_registrosexistentes;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_productocantdisponibleentidad (p_idestructura numeric, "isTransp" numeric, "isUh" numeric)
  OWNER TO zeolides;


CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_productocantdisponible (
  p_idestructura numeric,
  "isTransp" numeric = 0,
  "isUH" numeric = 0
)
RETURNS SETOF mod_logactivofijotangible.td_productocantdisponible AS
$body$
declare
 all_rec mod_logactivofijotangible.td_productocantdisponible;
 v_rec RECORD;
begin

create temp table tmp_registrosexistentes(
   disponible numeric(25,6),
   cantidad numeric(25,6),
   total numeric(25,6),
   denominacion varchar(255),
   codigo varchar(255),
   naturaleza varchar(255),
   marca varchar(255),
   marcaestado varchar(255),
   modelo varchar(255),
   modeloestado varchar(255),
   entidad varchar(255),
   idindicador numeric(19,0),
   --idproducto numeric(19,0),
   identidad numeric(19,0)
);

insert into tmp_registrosexistentes(
   disponible,
   cantidad,
   total,
   denominacion,
   codigo,
   naturaleza,
   marca,
   marcaestado,
   modelo,
   modeloestado,
   entidad,
   idindicador,
   --idproducto,
   identidad
) SELECT distinct
  0 as disponible,
  0 as cantidad,
  0 as total,

  i.denominacion as denominacion,
  i.codigo as codigo, 
  nat.denominacion as naturaleza,
  marc.denominacion as marca, 
  marc.estado as marcaestado, 
  model.denominacion as modelo, 
  model.estado as modeloestado,
  dep.denominacion as entidad,
  i.idindicador,
  --pd.idproducto, 
  pd.idestructuracomun as idestructura
  FROM mod_datosmaestros.nom_indicador i
  INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador 
  INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
  LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca 
  LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo
  INNER JOIN mod_logistica.dat_producto pd on pd.idindicador = i.idindicador 
  INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = pd.idproducto
  INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna2 ON rn.idregnumerico = rna2.idregnumerico
  inner join mod_estructuracomp.v_dametodasestructuras dep on dep.idestructura = pd.idestructuracomun
  
  WHERE ih.explotacion = 1
  AND pd.cronologia > 0 
  AND rna2.idestadoperacion not in(0,7, 6, 8, 9, 10)
  
  and (SELECT p.idestructura FROM mod_logistica.dat_producto p
                      INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = p.idproducto
                      WHERE p.idindicador = i.idindicador
                      AND p.cronologia > 0
                      AND p.idestructuracomun = $1
                      LIMIT 1
              ) IS NOT NULL
  and (case when $2 = 0 then true else nat.idarbol = -6 end)
  and (case when $3 = 0 then ih.isuh <> 1 else ih.isuh = 1 end)
  --and pd.idestructura = ANY(cast($1 as numeric[]))
  
  GROUP BY i.idindicador, i.codigo, i.denominacion, nat.denominacion, marc.denominacion, model.denominacion, marc.estado, model.estado, dep.denominacion, pd.idestructuracomun;
  
  update tmp_registrosexistentes
  set disponible = q.cant  
  from (  
    SELECT count(rn2.idregnumerico) as cant, p.idindicador as id, p.idestructuracomun as idestr
    FROM mod_logactivofijotangible.dat_registronumerico rn2
    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
    
    WHERE 
    p.cronologia > 0         
    and rna.idestadoperacion = 1     
    and (SELECT p.idestructura FROM mod_logistica.dat_producto p
                      INNER JOIN mod_logactivofijotangible.dat_registronumerico rn2 ON rn2.idproducto = p.idproducto
                      WHERE  p.cronologia > 0
                      AND p.idestructuracomun = $1
                      LIMIT 1
              ) IS NOT NULL
    group by p.idindicador, p.idestructuracomun
  )q where idindicador = q.id and q.idestr = identidad;
  
  update tmp_registrosexistentes
  set cantidad = q.cant  
  from (  
    SELECT count(rn2.idregnumerico) as cant, p.idindicador as id, p.idestructuracomun as idestr
    FROM mod_logactivofijotangible.dat_registronumerico rn2
    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
    
    WHERE 
    p.cronologia > 0         
    and rna.idestadoperacion not in(0,7, 6, 8, 9, 10) 
     and (SELECT p.idestructura FROM mod_logistica.dat_producto p
                      INNER JOIN mod_logactivofijotangible.dat_registronumerico rn2 ON rn2.idproducto = p.idproducto
                      WHERE  p.cronologia > 0
                      AND p.idestructuracomun = $1
                      LIMIT 1
              ) IS NOT NULL
    group by p.idindicador, p.idestructuracomun
  )q where idindicador = q.id and q.idestr = identidad;
  
  update tmp_registrosexistentes
  set total = q.cant  
  from (  
    SELECT count(rna.idregnumerico) as cant, p.idestructuracomun as idest
    FROM mod_logactivofijotangible.dat_registronumerico rn2
    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
    INNER JOIN mod_datosmaestros.nom_indicador i2 ON p.idindicador = i2.idindicador
    INNER JOIN mod_datosmaestros.nom_indicadorhoja ih2 on i2.idindicador = ih2.idindicador 
    INNER JOIN mod_datosmaestros.nom_naturaleza nat2 on nat2.idnaturaleza = i2.idnaturaleza
    LEFT JOIN mod_datosmaestros.nom_marca marc2 on ih2.idmarca = marc2.idmarca 
    LEFT JOIN mod_datosmaestros.nom_modelo model2 on ih2.idmodelo = model2.idmodelo
    
    WHERE 
    p.cronologia > 0
    and rna.idestadoperacion not in(0,7, 6, 8, 9, 10)     
     and (SELECT p.idestructura FROM mod_logistica.dat_producto p
                      INNER JOIN mod_logactivofijotangible.dat_registronumerico rn2 ON rn2.idproducto = p.idproducto
                      WHERE  p.cronologia > 0
                      AND p.idestructura = $1
                      LIMIT 1
              ) IS NOT NULL
    and (case when $2 = 0 then true else nat2.idarbol = -6 end)
	and (case when $3 = 0 then ih2.isuh <> 1 else ih2.isuh = 1 end)
    group by p.idestructuracomun
  )q where  identidad = q.idest;
  
for all_rec in 
  select 
   t.disponible,
   t.cantidad,
   t.total,
   t.denominacion,
   t.codigo,
   t.naturaleza,
   t.marca,
   t.marcaestado,
   t.modelo,
   t.modeloestado,
   t.entidad,
   (select sum(t2.cantidad) from tmp_registrosexistentes t2)  as cantidadtotal,
   t.idindicador 
   from tmp_registrosexistentes t  
   where t.denominacion is not null
   group by t.disponible,t.cantidad,t.total,t.denominacion,t.codigo,t.naturaleza,t.marca,t.marcaestado,t.modelo,t.modeloestado,t.entidad,t.idindicador 
   order by t.entidad,t.denominacion,t.marca,t.modelo
   
loop
 return next all_rec;
end loop;
drop table tmp_registrosexistentes;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_productocantdisponible (p_idestructura numeric, "isTransp" numeric, "isUH" numeric)
  OWNER TO zeolides;