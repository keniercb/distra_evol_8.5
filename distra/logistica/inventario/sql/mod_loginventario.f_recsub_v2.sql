DROP FUNCTION IF EXISTS mod_loginventario.f_recsub_v2(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric);
DROP TYPE IF EXISTS mod_loginventario.td_recsub_v2;

CREATE TYPE mod_loginventario.td_recsub_v2 AS (
  idindicador NUMERIC(19,0),
  codigo VARCHAR,
  codigoproveedor VARCHAR,
  denominacion VARCHAR,
  umedida VARCHAR,
  nacionalidad VARCHAR,
  idproducto NUMERIC(19,0),
  disponible NUMERIC(25,6),
  existencia NUMERIC(25,6),
  precio NUMERIC(25,6),
  precioalternativo NUMERIC(25,6),
  importetotalcup NUMERIC(25,6),
  importetotalcuc NUMERIC(25,6),
  tienelote NUMERIC(19,0),
  equipo NUMERIC(19,0),
  municion NUMERIC(19,0),
  minimo NUMERIC(19,0),
  maximo NUMERIC(19,0),
  cuentacontable VARCHAR,
  cuentaalternativa VARCHAR,
  nomcategoria VARCHAR,
  decimales NUMERIC(19,0),
  fechaminima DATE,
  fechamaxima DATE,
  deposito VARCHAR,
  codeposito VARCHAR,
  naturaleza VARCHAR,
  entidad VARCHAR,
  logo TEXT,
  estadoop VARCHAR,
  monedacontable VARCHAR,
  monedaalternativa VARCHAR,
  importecalculado NUMERIC(25,2),
  importealtcalculado NUMERIC(25,2),
  especialidad VARCHAR,
  imagenesindicador VARCHAR,
  marca VARCHAR,
  modelo VARCHAR,
  ubicacion VARCHAR,
  total NUMERIC(19,0),
  idmarca NUMERIC(19,0),
  idmodelo NUMERIC(19,0),
  numerolote VARCHAR,
  fechavencelote DATE
);

ALTER TYPE mod_loginventario.td_recsub_v2 OWNER TO zeolides;
-- FUNCTION: mod_loginventario.f_recsub(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_loginventario.f_recsub(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_loginventario.f_recsub_v2(
	p_idestructura numeric,
	p_codigo character varying,
	p_codigoproveedor character varying,
	p_denominacion character varying,
	p_idtipoproducto numeric,
	p_idnaturaleza numeric,
	p_idcategoria numeric,
	p_idclasifcontable numeric,
	p_idestructuraubic numeric,
	p_disponibilidad numeric,
	p_existencia numeric,
	p_criterio character varying,
	p_cantidadmov numeric,
	p_fechainicio date,
	p_fechafin date,
	p_idmonedacontable numeric,
	p_idmonedaalternativa numeric,
	p_idmarca numeric,
	p_idmodelo numeric,
	p_limit numeric,
	p_start numeric,
	p_criterioavan numeric)
    RETURNS SETOF mod_loginventario.td_recsub_v2
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

declare
all_rec mod_loginventario.td_recsub_v2;
begin
for all_rec in

with mov_ordenados as (
    							select
                                      dc.fechacontable,
                                      dm.iddocumento,
                                      dm.idproducto,
                                      dm.cronologia,
                                      dm.existenciaactual,
									   dm.preciopromedio,
									   dm.importetotal,
                                      count(dm.idproducto) over(partition by dm.idproducto) as totalproductos,
                                      row_number() over(partition by dm.idproducto order by dm.cronologia desc) as numerofila
                                from mod_logistica.dat_movimiento dm
                                inner join mod_logistica.dat_producto pd on (dm.idproducto = pd.idproducto)
                                inner join mod_logistica.dat_documento dc on (dc.iddocumento = dm.iddocumento)
                                where dm.signo in ('+', '-')
                                	and pd.idestructura = p_idestructura
                                    and (case when p_fechafin is not null
                                    		  then (dc.fechacontable <= p_fechafin)
                                              else true
                                         end)
								)

select
dp.idindicador,
(case when (ni.numeropieza is null or ni.numeropieza = '') then ni.codigo else ni.numeropieza END) as codigo,
ni.numeropieza as codproveedor,
ni.denominacion as denomprod,
num.abreviaturaunidadmedida as um,
np.siglas as nacionalidad,
dp.idproducto,

--nuevo
case when (p_fechafin is null)
then (dp.cantidad -(select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida
					where estado = 1 and idproducto = dp.idproducto)
	 )
else
	0 --temporal de prueba
end as disponible,

case when (p_fechafin is not null)
then ( COALESCE(mor.existenciaactual,0) )
else dp.cantidad
end as existencia,

mor.preciopromedio as preciocontable,

dp.precioalternativo as precioalternativo,
mor.importetotal as importetotalcup,
dp.importealternativo as importetotalcuc,
(case when nih.tipocontrol = 2 then 1 else 0 end) as tienelote,
(case when nih.tipocontrol = 3 then 1 else 0 end) as equipo,
(case when nih.tipocontrol = 4 then 1 else 0 end) as municion,
dp.minimo as minimo,
dp.maximo as maximo,

(select nc.concatcta from mod_contabilidad.nom_cuenta nc
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuenta = nc.idcuenta
where ncc.idclasificacioncontable = dp.idclasificacioncontable)  as cuentacontable,

(select nc.concatcta from mod_contabilidad.nom_cuenta nc
inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idcuentaalt = nc.idcuenta
where ncc.idclasificacioncontable = dp.idclasificacioncontable)  as cuentaalternativa,

nc.denominacion as categoria,
num.decimales,

null::date as fechaminima,

null::date as fechamaxima,

deop.denominacion as deposito,
deop.codigo as codeposito,
nn.denominacion as naturaleza,

((select distinct des.denominacion
from mod_estructuracomp.v_dametodasestructuras des
inner join mod_datosmaestros.dat_estructurasubsist desu on des.idestructura = desu.idestructuracomun
inner join mod_datosmaestros.dat_documentoprim ddp on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logistica.dat_documento dd on ddp.iddoc = dd.iddoc
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto limit 1)) as entidad,

(select distinct ii.urllogo
from mod_logistica.conf_general ii
inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = ii.idestructura
inner join mod_datosmaestros.dat_estructurasubsist desu on des.idestructura = desu.idestructuracomun
inner join mod_datosmaestros.dat_documentoprim ddp on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logistica.dat_documento dd on ddp.iddoc = dd.iddoc
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto limit 1) as logo,

(case when (select dea.estado from mod_estructuracomp.nom_filaestruc nf inner join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = nf.idfila
where nf.idfila = deop.idestructura) = 1
then 'abierto' else 'cerrado' end) as estadoop,

(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) as monedacontable,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaalternativa) as monedaalternativa,

round(mor.importetotal,2) as importecalculado,
round(dp.precioalternativo * dp.cantidad,2) as importealtcalculado,

ne.denespecialidad,''::character varying as imagenesindicador,
nma.denominacion as marca,
nmo.denominacion as modelo,

(SELECT COALESCE(
  array_to_string(array_agg(ruta ORDER BY ruta), ' '),
  'Sin ubicacion'
)
FROM (
  SELECT array_to_string(
           ARRAY(
             SELECT padre.descripcion
             FROM mod_logubicacion.dat_estructuraubicacion padre
             WHERE padre.parentpath OPERATOR(public.@>) e.parentpath
             ORDER BY padre.nivel
           ),
           '.'
         ) AS ruta
  FROM mod_logubicacion.dat_estructuraubicacion e
  INNER JOIN mod_logubicacion.dat_ubicacionproducto up
    ON up.idubicacion = e.idestructuraubicacion
  WHERE up.idproducto = dp.idproducto
    AND up.cantidad > 0
) AS rutas)::varchar as ubicacion,
count(*) OVER() as total,
nma.idmarca,nmo.idmodelo,
dp.numerolote,dp.fechavencelote

from mod_logistica.dat_producto dp
inner join mod_estructuracomp.v_dametodasestructuras deop on deop.idestructura = dp.idestructura
--nuevo
LEFT JOIN mov_ordenados mor on mor.idproducto = dp.idproducto and mor.numerofila = 1 and mor.cronologia > 0

left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_logistica.nom_categoria nc on nc.idcategoria = dp.idcategoria
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dp.idumedida
left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador
left join mod_datosmaestros.nom_pais np on np.idpais = ni.idpais
left join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza
left join mod_datosmaestros.nom_especialidad ne on ne.idespecialidad = ni.idespecialidad
left join mod_datosmaestros.nom_marca nma on nih.idmarca = nma.idmarca
left join mod_datosmaestros.nom_modelo nmo on nih.idmodelo = nmo.idmodelo

where dp.cronologia > 0 and dp.idestructura = p_idestructura

and (case when p_codigo is not null or p_codigoproveedor is not null or p_denominacion is not null then ((case when p_codigo is not null then ni.codigo ilike '%' || p_codigo || '%' end)
or (case when p_codigoproveedor is not null then ni.numeropieza ilike '%' || p_codigoproveedor || '%' end)
or (case when p_denominacion is not null then ni.denominacion ilike '%' || p_denominacion || '%' end)
or (case when p_denominacion is not null then dp.numerolote ilike '%' || p_denominacion || '%' end)) else true end)
and(case when p_idtipoproducto is not null then nih.tipocontrol = p_idtipoproducto else true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else true end)
and(case when p_idmarca is not null then nih.idmarca = p_idmarca else true end)
and(case when p_idmodelo is not null then nih.idmodelo = p_idmodelo else true end)
and(case when p_idcategoria is not null then nc.idcategoria = p_idcategoria else true end)
and(case when p_idclasifcontable is not null then dp.idclasificacioncontable = p_idclasifcontable else true end)
and(dp.idproducto in(select ubp.idproducto from mod_logubicacion.dat_ubicacionproducto ubp
inner join mod_logubicacion.dat_estructuraubicacion deu on deu.idestructuraubicacion = ubp.idubicacion
where deu.parentpath OPERATOR(public.<@) public.text2ltree(
    (SELECT e1.parentpath FROM mod_logubicacion.dat_estructuraubicacion e1 WHERE e1.idestructuraubicacion = p_idestructuraubic limit 1)::TEXT
   )
) or p_idestructuraubic is null)
and(case when p_disponibilidad = 1 then (dp.cantidad -(select coalesce(sum(cantidad),0)
from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = dp.idproducto)) > 0 else true end)
and(case when p_existencia = 1 then dp.cantidad > 0 else true end)
and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto
and dm.signo in ('+','-') limit 1) >= p_fechainicio) else true end)
group by dp.idindicador,ni.codigo,ni.numeropieza,ni.denominacion,num.abreviaturaunidadmedida,
np.siglas,dp.cantidad,
mor.existenciaactual,
dp.idproducto,nih.tipocontrol,
nc.denominacion,num.decimales,deop.denominacion,deop.codigo,
nn.denominacion,deop.idestructura,ne.denespecialidad,
nma.idmarca,nmo.idmodelo,nma.denominacion,nmo.denominacion,
mor.preciopromedio,dp.precioalternativo,mor.importetotal, dp.importealternativo,
dp.minimo,dp.maximo,cuentacontable,cuentaalternativa

having (case when ((p_criterioavan = 1 or p_criterioavan = 2 or p_criterioavan = 3) and p_cantidadmov is not null)
then (case when p_criterioavan = 1 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end))
       when p_criterioavan = 2 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end))
       when p_criterioavan = 3 then ((select count(dm.idmovimiento) from mod_logistica.dat_movimiento dm where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) < p_cantidadmov and (case when p_fechainicio is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) >= p_fechainicio) else true end) and (case when p_fechafin is not null then ((select distinct dd.fechacontable from mod_logistica.dat_documento dd inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento where dm.idproducto = dp.idproducto and dm.signo in ('+','-')) <= p_fechafin) else true end)) end)
else true end)
order by deposito,cuentacontable,nma.idmarca,nmo.idmodelo, ni.codigo,dp.fechavencelote ASC
offset p_start limit p_limit
loop

return next all_rec; end loop;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_recsub_v2(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;

COMMENT ON FUNCTION mod_loginventario.f_recsub_v2(numeric, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric)
    IS 'Empleada por el sistema y modificada el 2025/06/24. Suprimir los códigos comentados.';
