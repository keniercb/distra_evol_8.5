CREATE SEQUENCE mod_logdistribucion.sec_imppedido_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logdistribucion.sec_imppedido_seq RESTART WITH 1001328026;

//dat_imppedido

CREATE TABLE mod_logdistribucion.dat_imppedido (
  idimppedido NUMERIC(19,0) DEFAULT nextval('mod_logdistribucion.sec_imppedido_seq'::regclass) NOT NULL,
  iddocumento NUMERIC(19,0),
  nombrecliente VARCHAR(255),
  codigoproducto VARCHAR(255),
  descripcionproducto VARCHAR(255),
  clasificacioncontable VARCHAR(255),
  um VARCHAR,
  cantidad NUMERIC(15,0),
  precio NUMERIC(15,0),
  importe NUMERIC(15,0),
  fechavencimiento DATE,
  errorfecha VARCHAR(255),
  nro NUMERIC(19,0),
  CONSTRAINT dat_imppedido_pkey PRIMARY KEY(idimppedido)
) 
WITH (oids = false);

ALTER TABLE mod_logdistribucion.dat_imppedido
  OWNER TO zeolides;

//f_validadataimportapedido

CREATE OR REPLACE FUNCTION mod_logdistribucion.f_validadataimportapedido (
  p_iddocumento numeric,
  p_idestructuracomun numeric
)
RETURNS integer [] AS
$body$
declare
v_result integer[]:=array[0];
v_rec record;
begin

--Para saber si tiene tarjeta creada
select a.codigoproducto into v_rec
from mod_logdistribucion.dat_imppedido a
where a.iddocumento = p_iddocumento
and a.codigoproducto in (select i.codigo from mod_datosmaestros.nom_indicador i inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador
where p.idestructura = p_idestructuracomun)
group by a.codigoproducto;

if v_rec.codigoproducto is not null then
v_result:= v_result|| array[1];

update mod_logdistribucion.dat_imppedido a set errorfecha = (coalesce(a.errorfecha, '') || ' 5')
where a.iddocumento = p_iddocumento
and a.codigoproducto in (select i.codigo from mod_datosmaestros.nom_indicador i inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador
where p.idestructura = p_idestructuracomun);
end if;
--Para productos  duplicados
select a.codigoproducto into v_rec
from mod_logdistribucion.dat_imppedido a
where a.iddocumento = p_iddocumento
and a.codigoproducto is not null and a.fechavencimiento is not null
group by a.codigoproducto
having count(*) > 1
order by a.codigoproducto;

if v_rec.codigoproducto is not null then v_result:= v_result|| array[3]; end if;

--Código producto nulos
select a.codigoproducto, a.iddocumento into v_rec from mod_logdistribucion.dat_imppedido a where a.codigoproducto is null and a.iddocumento = $1;

if v_rec.iddocumento is not null then v_result:= v_result|| array[4]; end if;

--Para saber si la fecha de vencimiento es menor que la fecha actual
select a.iddocumento into v_rec from mod_logdistribucion.dat_imppedido a
where a.iddocumento = p_iddocumento
and ((a.fechavencimiento < current_date and a.fechavencimiento is not null));

if v_rec.iddocumento is not null then v_result:= v_result|| array[6]; end if;

return v_result;
end
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logdistribucion.f_validadataimportapedido (p_iddocumento numeric, p_idestructuracomun numeric)
  OWNER TO zeolides;

//f_importapedido

CREATE OR REPLACE FUNCTION mod_logdistribucion.f_importapedido (
  p_iddocumento numeric
)
RETURNS numeric [] AS
$body$
DECLARE
v_productos record;
v_datosdoc record;
v_idproducto numeric;
v_datosindicador record;
v_idmovimiento numeric;
v_idproductopedido numeric;
v_result integer[];


BEGIN

select d.iddocumento, d.cronologia, d.idestructuracomun, es.idestructuracomun as idestructura into v_datosdoc 
from mod_logistica.dat_documento d 
inner join mod_datosmaestros.dat_documentoprim dprm on dprm.iddoc = d.iddoc
inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dprm.idestructurasubsist
where d.iddocumento = $1;

v_result:= v_result || mod_logdistribucion.f_validadataimportapedido($1,v_datosdoc.idestructuracomun);
if v_result @> array[2] or v_result @> array[3] or v_result @> array[4] or v_result @> array[5] or v_result @> array[6] then return v_result; end if;

for v_productos in 
select distinct 
a.codigoproducto,
sum(a.cantidad) as cantidad,
sum(coalesce(a.importe,0)) as importe,
a.fechavencimiento,
(select ncc.idclasificacioncontable from mod_logistica.nom_clasificacioncontable ncc 
inner join mod_logistica.dat_clasificacioncontableentidad dcce on dcce.idclasificacioncontable = ncc.idclasificacioncontable
where ncc.codigo ilike a.clasificacioncontable and dcce.idestructuracomun = v_datosdoc.idestructura
and (ncc.fechafin is null or ncc.fechafin > current_date) limit 1) as idclasificacioncontable,

coalesce((select b.idunidadmedida from mod_datosmaestros.nom_unidadmedida b
where b.abreviaturaunidadmedida ilike a.um and b.fechafin is null limit 1),ni.idumedida)  as idumedida,
ni.idindicador


from mod_logdistribucion.dat_imppedido a
inner join mod_datosmaestros.nom_indicador ni on ni.codigo = a.codigoproducto
where a.iddocumento = $1


and a.codigoproducto not in (select i.codigo from mod_datosmaestros.nom_indicador i 
inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador 
where p.idestructura = v_datosdoc.idestructuracomun)

group by a.codigoproducto,a.fechavencimiento,a.clasificacioncontable,ni.idumedida,a.um,ni.idindicador
loop
insert into mod_logistica.dat_producto
(idestructura,idcategoria,idumedida,idindicador,idclasificacioncontable,cronologia,precio,cantidad,minimo,maximo,factorbase,importe,
idestructuracomun,fechafabricacion,fechavencimiento,precioalternativo,importealternativo
)
values (v_datosdoc.idestructuracomun, --deposito
null,v_productos.idumedida,v_productos.idindicador,v_productos.idclasificacioncontable,0,
0,--coalesce(v_productos.precio, round((coalesce(v_productos.importe, 0) / v_productos.cantidad), 6)),
0,0, --minimo
1000, --maximo
1, --factorbase
0, --v_productos.importe,
v_datosdoc.idestructura, --entidad
null, --fechafabricacion,
date(v_productos.fechavencimiento), --fechavencimiento,
0,--coalesce(v_productos.precioalt, round((coalesce(v_productos.importealt, 0) / v_productos.cantidad), 6)), --precioalternativo,
0 --importealternativo
) returning idproducto into v_idproducto;
               
insert into mod_logdistribucion.dat_productopedido
( 
--idproductopedido,
idpedido,
idproducto,
cantidad
)
values (
v_datosdoc.iddocumento,
v_productos.idindicador,
v_productos.cantidad

) returning idproductopedido into v_idproductopedido;   

end loop;
return v_result;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logdistribucion.f_importapedido (p_iddocumento numeric)
  OWNER TO zeolides;


