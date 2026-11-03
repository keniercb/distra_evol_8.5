INSERT INTO 
  mod_logistica.nom_variableglobal
(
  nombre,
  valor
)
VALUES (
  'farmacia',
  '0'
);

DROP TABLE mod_logfarmacia.dat_lineaprodentidad;
DROP TABLE mod_logfarmacia.nom_lineaprod;

CREATE OR REPLACE FUNCTION mod_loginventario.f_validadataimportaapertura (
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
from mod_loginventario.dat_impapertura a
where a.iddocumento = p_iddocumento
and a.codigoproducto in (select i.codigo from mod_datosmaestros.nom_indicador i inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador
where p.idestructura = p_idestructuracomun)
group by a.codigoproducto;

if v_rec.codigoproducto is not null then
v_result:= v_result|| array[1];

update mod_loginventario.dat_impapertura a set errorfecha = (coalesce(a.errorfecha, '') || ' 5')
where a.iddocumento = p_iddocumento
and a.codigoproducto in (select i.codigo from mod_datosmaestros.nom_indicador i inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador
where p.idestructura = p_idestructuracomun);
end if;

--Para lotes sin fecha de producción
/*select a.codigoproducto into v_rec
from mod_loginventario.dat_impapertura a
where a.iddocumento = p_iddocumento
and a.codigoproducto is not null and a.cantidadlote > 0 and a.fechaproduccion is null
group by a.codigoproducto;

if v_rec.codigoproducto is not null then v_result:= v_result|| array[2]; end if;*/

--Para productos sin lotes duplicados
select a.categoria,a.codigoproducto into v_rec
from mod_loginventario.dat_impapertura a
where a.iddocumento = p_iddocumento
and a.codigoproducto is not null and (a.cantidadlote = 0 or a.cantidadlote is null) and a.fechaproduccion is null and a.fechavencimientolote is null
group by a.categoria,a.codigoproducto
having count(*) > 1
order by a.categoria,a.codigoproducto;

if v_rec.codigoproducto is not null then v_result:= v_result|| array[3]; end if;

--Código producto nulos
select a.codigoproducto, a.iddocumento into v_rec from mod_loginventario.dat_impapertura a where a.codigoproducto is null and a.iddocumento = $1;

if v_rec.iddocumento is not null then v_result:= v_result|| array[4]; end if;

--Para saber si la fecha de produccion es mayor que vencimiento
select a.iddocumento into v_rec from mod_loginventario.dat_impapertura a
where a.iddocumento = p_iddocumento
and ((a.fechafabricacion > a.fechavencimiento and a.fechafabricacion is not null and a.fechavencimiento is not null) or (a.fechaproduccion > a.fechavencimientolote and a.fechaproduccion is not null and  a.fechavencimientolote is not null));

if v_rec.iddocumento is not null then v_result:= v_result|| array[5]; end if;

--Para saber si la fecha de produccion es mayor que la fecha actual
select a.iddocumento into v_rec from mod_loginventario.dat_impapertura a
where a.iddocumento = p_iddocumento
and ((a.fechafabricacion > current_date and a.fechafabricacion is not null) or (a.fechaproduccion > current_date and a.fechaproduccion is not null));

if v_rec.iddocumento is not null then v_result:= v_result|| array[6]; end if;

return v_result;
end
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.f_validadataimportaapertura (p_iddocumento numeric, p_idestructuracomun numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_loginventario.f_importaapertura (
  p_iddocumento numeric
)
RETURNS numeric [] AS
$body$
DECLARE
v_productos record;
v_datosdoc record;
v_idproducto numeric;
v_datosindicador record;
v_datoslote record;
v_idmovimiento numeric;
v_idlote numeric;
--v_nrolote numeric = 1;
v_result integer[];

BEGIN

select d.iddocumento, d.cronologia, d.idestructuracomun, es.idestructuracomun as idestructura into v_datosdoc 
from mod_logistica.dat_documento d 
inner join mod_datosmaestros.dat_documentoprim dprm on dprm.iddoc = d.iddoc
inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dprm.idestructurasubsist
where d.iddocumento = $1;

v_result:= v_result || mod_loginventario.f_validadataimportaapertura($1,v_datosdoc.idestructuracomun);
if v_result @> array[2] or v_result @> array[3] or v_result @> array[4] or v_result @> array[5] or v_result @> array[6] then return v_result; end if;

for v_productos in 
select distinct a.codigoproducto,ni.idindicador,
COALESCE(a.minimo,0) as minimo,
coalesce(a.maximo,0) as maximo,
sum(coalesce(a.cantidad,0)) as cantidad,
sum(coalesce(a.importe,0)) as importe,
a.fechafabricacion,a.fechavencimiento,
nc.idcategoria as idcategoria,ni.idpais,
ncc.idclasificacioncontable as idclasificacioncontable,
coalesce(b.idunidadmedida,ni.idumedida) as idumedida,
nat.idnaturaleza
from mod_loginventario.dat_impapertura a
inner join mod_datosmaestros.nom_indicador ni on (ni.codigo = a.codigoproducto or ni.numeropieza = a.codigoproducto)
left join mod_datosmaestros.nom_unidadmedida b on b.abreviaturaunidadmedida = a.um and b.fechafin is null
left join mod_logistica.nom_clasificacioncontable ncc on ncc.codigo ilike a.clasificacioncontable and (ncc.fechafin is null or ncc.fechafin > current_date)
left join mod_logistica.nom_categoria nc on nc.denominacion ilike a.categoria
left join mod_datosmaestros.nom_naturaleza nat on nat.denominacion ilike a.naturaleza
where a.iddocumento = $1
and a.codigoproducto not in (select i.codigo from mod_datosmaestros.nom_indicador i 
inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador 
where p.idestructura = v_datosdoc.idestructuracomun)
group by a.codigoproducto,ni.idindicador,a.minimo,a.maximo,a.fechafabricacion,a.fechavencimiento,
nc.idcategoria,a.categoria,ncc.idclasificacioncontable,b.idunidadmedida,ni.idumedida,ni.idpais,nat.idnaturaleza
loop
insert into mod_logistica.dat_producto 
(idestructura,idcategoria,idumedida,idindicador,idclasificacioncontable,cronologia,precio,cantidad,minimo,maximo,factorbase,importe,
idestructuracomun,fechafabricacion,fechavencimiento,precioalternativo,importealternativo
)
values (v_datosdoc.idestructuracomun, --deposito
v_productos.idcategoria,v_productos.idumedida,v_productos.idindicador,v_productos.idclasificacioncontable,0,
0,--coalesce(v_productos.precio, round((coalesce(v_productos.importe, 0) / v_productos.cantidad), 6)),
0,coalesce(v_productos.minimo, 0), --minimo
coalesce(v_productos.maximo, 1000), --maximo
1, --factorbase
0, --v_productos.importe,
v_datosdoc.idestructura, --entidad
date(v_productos.fechafabricacion), --fechafabricacion,
date(v_productos.fechavencimiento), --fechavencimiento,
0,--coalesce(v_productos.precioalt, round((coalesce(v_productos.importealt, 0) / v_productos.cantidad), 6)), --precioalternativo,
0 --importealternativo
) returning idproducto into v_idproducto;


UPDATE 
  mod_datosmaestros.nom_indicador 
SET 
  idnaturaleza = v_productos.idnaturaleza
WHERE 
  idindicador = v_productos.idindicador
  and idnaturaleza is null;


insert into mod_logistica.dat_movimiento
(
--idmovimiento,
idmoneda,
iddocumento,
idproducto,
recargodescuento,
tienedualidad,
preciocontable,
importecontable,
cantidad,
cronologia,
diferencia,
existenciaactual,
preciopromedio,
importetotal,
signo,
idunidadmedida,
factorconversion,
idelementogasto,
existenciaalmacen
)
values (
null,
v_datosdoc.iddocumento,
v_idproducto,
0, --recargodescuento
0, --tienedualidad
round((coalesce(v_productos.importe, 0) / v_productos.cantidad), 6), --precio
v_productos.importe,
v_productos.cantidad,
0, --cronologia
null, --diferencia
0,
0, 
0,
'+', --signo,
v_productos.idumedida,
1, --factorconversion,
null, --idelementogasto,
v_productos.cantidad --existenciaalmacen
          
) returning idmovimiento into v_idmovimiento;

for v_datoslote in 
  select distinct
  a.fechaproduccion,
  a.fechavencimientolote as fechavencimiento,
  a.cantidadlote,
  cp.idclientesproveedores,
  a.nrolote
  from mod_loginventario.dat_impapertura a
  left join mod_datosmaestros.nom_clientesproveedor cp on cp.codigocontable = a.codigofabricante
  where a.iddocumento = $1 and a.codigoproducto = v_productos.codigoproducto and a.cantidadlote > 0
loop
  insert into mod_logistica.dat_lote
  (
      idproducto,
      numero,
      idpais,
      fechafabricacion,
      fechavencimiento,                
      estado,
      idfabricante
  )
  values (
      v_idproducto,
      v_datoslote.nrolote, --numero
      v_productos.idpais,
      date(v_datoslote.fechaproduccion), --fechafabricacion
      date(v_datoslote.fechavencimiento), --fechavencimiento
      1, --estado
      coalesce(v_datoslote.idclientesproveedores, null) --idfabricante
  ) returning idlote into v_idlote;   
                        
  insert into mod_logistica.dat_movlote
  (
      idlote,
      idmovimiento,
      cantidad,
      idubicacion     
  )
  values (
      v_idlote,
      v_idmovimiento,
      v_datoslote.cantidadlote,
      -1 -- ?idubicacion
  );                          
  --v_nrolote = v_nrolote + 1;
                    
end loop;
end loop;
return v_result;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.f_importaapertura (p_iddocumento numeric)
  OWNER TO zeolides;