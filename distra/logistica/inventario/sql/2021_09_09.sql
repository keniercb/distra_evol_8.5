--Annadiendo la columna ubicacion en la migracion de las aperturas de inventario
ALTER TABLE mod_loginventario.dat_impapertura
  ADD COLUMN ubicacion VARCHAR;

COMMENT ON COLUMN mod_loginventario.dat_impapertura.ubicacion
IS 'Ubicacion del producto en el almacen';

--Fin

--FUNCION PARA CREAR LAS UBICACIONES
CREATE OR REPLACE FUNCTION mod_loginventario.f_crearubicacionesmig (
  p_iddocumento numeric
)
RETURNS void AS
$body$
DECLARE
v_productos record;
v_datosdoc record;
v_idarea numeric;
v_idubicparent numeric;
BEGIN
    select d.idestructuracomun, dar.idarea, deu.idestructuraubicacion as idubicparent  into v_datosdoc
    from mod_logistica.dat_documento d
    join mod_logubicacion.dat_area dar on dar.idestructuracomun = d.idestructuracomun
    join mod_logubicacion.dat_estructuraubicacion deu on deu.idarea = dar.idarea and deu.idestructuraubicacion = deu.idpadre
    where d.iddocumento = $1;
    
    if v_datosdoc.idarea is null then 
    	INSERT INTO mod_logubicacion.dat_area(
          idarea,
          idestructuracomun,
          idformato
        )VALUES (
          v_datosdoc.idestructuracomun,
          null
        ) returning idarea into v_idarea;
        
        INSERT INTO mod_logubicacion.dat_estructuraubicacion(
          idarea,
          codigo,
          descripcion,
          nivel
      	) VALUES (
          v_idarea,
          '00',
          'Area 0',
          1) returning idestructuraubicacion into v_idubicparent;
    else
    	v_idarea = v_datosdoc.idarea;
        v_idubicparent = v_datosdoc.idubicparent;
    end if;

	for v_productos in (select distinct imp.ubicacion from mod_loginventario.dat_impapertura imp) LOOP        
        if (SELECT eu.idestructuraubicacion from mod_logubicacion.dat_estructuraubicacion eu
        where eu.descripcion = v_productos.ubicacion and eu.idarea = v_idarea and eu.idpadre = v_idubicparent)
    	is null then 
          INSERT INTO mod_logubicacion.dat_estructuraubicacion
          (
            idarea,
            codigo,
            descripcion,
            idpadre,
            nivel
          ) VALUES (
            v_idarea,
            ' ',
            v_productos.ubicacion,
            v_idubicparent,
            1
          );
        end if;
    end loop;

end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.f_crearubicacionesmig (p_iddocumento numeric)
  OWNER TO zeolides;

--- FIN FUNCION PARA CREAR UBICACIONES

CREATE OR REPLACE FUNCTION mod_loginventario.f_importaaperturamoncar (
  p_iddocumento numeric
)
RETURNS numeric [] AS
$body$
DECLARE
v_productos record;
v_datosdoc record;
v_datosubic record;
v_idproducto numeric;
v_datosindicador record;
v_datoslote record;
v_idmovimiento numeric;
v_idlote numeric;
v_nrolote numeric = 1;
v_result integer[];

BEGIN

/*AÑADIDO*/
--CREAR LAS UBICACIONES
PERFORM mod_loginventario.f_crearubicacionesmig($1);
--FIN CREAR LAS UBICACIONES

select d.iddocumento, d.cronologia, d.idestructuracomun, es.idestructuracomun as idestructura into v_datosdoc
from mod_logistica.dat_documento d
inner join mod_datosmaestros.dat_documentoprim dprm on dprm.iddoc = d.iddoc
inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dprm.idestructurasubsist
where d.iddocumento = $1;

v_result:= v_result || mod_loginventario.f_validadataimportaaperturamoncar($1,v_datosdoc.idestructuracomun);
if v_result @> array[2] or v_result @> array[3] or v_result @> array[4] or v_result @> array[5] or v_result @> array[6] then return v_result; end if;

for v_productos in
select distinct
a.codigoproducto,
a.minimo,
a.maximo,
sum(a.cantidad) as cantidad,
sum(coalesce(a.importe,0)) as importe,
a.fechafabricacion,
a.fechavencimiento,
sum(coalesce(a.importealt,0)) as importealt,
(select nc.idcategoria from mod_logistica.nom_categoria nc
inner join mod_logistica.dat_categoriaentidad dce on dce.idcategoria = nc.idcategoria
where nc.denominacion ilike a.categoria and dce.idestructuracomun = v_datosdoc.idestructura limit 1) as idcategoria,
(select ncc.idclasificacioncontable from mod_logistica.nom_clasificacioncontable ncc
inner join mod_logistica.dat_clasificacioncontableentidad dcce on dcce.idclasificacioncontable = ncc.idclasificacioncontable
where ncc.codigo ilike a.clasificacioncontable and dcce.idestructuracomun = v_datosdoc.idestructura
and (ncc.fechafin is null or ncc.fechafin > current_date) limit 1) as idclasificacioncontable,

coalesce((select b.idunidadmedida from mod_datosmaestros.nom_unidadmedida b
where b.abreviaturaunidadmedida ilike a.um and b.fechafin is null limit 1),ni.idumedida)  as idumedida,
ni.idindicador,ni.idpais, a.ubicacion/*AÑADIDO*/

from mod_loginventario.dat_impapertura a
inner join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
where a.iddocumento = $1


and a.codigoproducto not in (select i.numeropieza from mod_datosmaestros.nom_indicador i
inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador
where p.idestructura = v_datosdoc.idestructuracomun)

group by a.codigoproducto,a.minimo,a.maximo,a.fechafabricacion,a.fechavencimiento,a.categoria,a.clasificacioncontable,a.importealt,ni.idumedida,a.um,ni.idindicador
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
precioalternativo,
preciopromalt,
importealternativo,
importetotalalt,
idelementogasto,
existenciaalmacen,
idelementogastoalt
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
round((coalesce(v_productos.importealt, 0) / v_productos.cantidad), 6), --precioalternativo
0, --preciopromalt,
coalesce(v_productos.importealt, 0), --importealternativo,
0, --importetotalalt,
null, --idelementogasto,
v_productos.cantidad, --existenciaalmacen
null --idelementogastoalt

) returning idmovimiento into v_idmovimiento;

for v_datoslote in
  select distinct
  a.fechaproduccion,
  a.fechavencimientolote as fechavencimiento,
  a.cantidadlote,
  cp.idclientesproveedores
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
      'L-' || "varchar"(v_nrolote), --numero
      v_productos.idpais,
      date(v_datoslote.fechaproduccion), --fechafabricacion
      date(v_datoslote.fechavencimiento), --fechavencimiento
      1, --estado
      coalesce(v_datoslote.idclientesproveedores, -1) --idfabricante
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
  v_nrolote = v_nrolote + 1;

end loop;

/*AÑADIDO*/
--UBICAR PRODUCTO
	select d.idestructuracomun, dar.idarea, deu.idestructuraubicacion as idubic  into v_datosubic
    from mod_logistica.dat_documento d
    join mod_logubicacion.dat_area dar on dar.idestructuracomun = d.idestructuracomun
    join mod_logubicacion.dat_estructuraubicacion deu on deu.idarea = dar.idarea and deu.descripcion = v_productos.ubicacion
    where d.iddocumento = $1;
    if v_datosubic.idubic is not null then 
      INSERT INTO mod_logubicacion.dat_areaproducto(
        idproducto,
        idarea,
        disponible
      )
      VALUES (
        v_idproducto,
        v_datosubic.idarea,
        v_productos.cantidad
      );
      
      INSERT INTO mod_logubicacion.dat_ubicacionproducto(
        idubicacion,
        idproducto,
        cantidad
      )
      VALUES (
        v_datosubic.idubic,
        v_idproducto,
        v_productos.cantidad
      );
    end if;
--UBICAR PRODUCTO
end loop;
return v_result;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
COST 100;

ALTER FUNCTION mod_loginventario.f_importaaperturamoncar (p_iddocumento numeric)
  OWNER TO postgres;