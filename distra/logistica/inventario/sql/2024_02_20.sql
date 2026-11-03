ALTER TABLE IF EXISTS mod_loginventario.tmp_impproductorecepcion
    ADD PRIMARY KEY (idimpproducto);
ALTER TABLE IF EXISTS mod_loginventario.tmp_impproductorecepcionerror
    ADD COLUMN IF NOT EXISTS idimpproductorecepcion numeric(19);
ALTER TABLE IF EXISTS mod_loginventario.tmp_impproductorecepcionerror
    ADD COLUMN IF NOT EXISTS iderror numeric(4);
ALTER TABLE IF EXISTS mod_loginventario.tmp_impproductorecepcionerror
    ADD CONSTRAINT fk_tmp_idimpproducto FOREIGN KEY (idimpproductorecepcion)
    REFERENCES mod_loginventario.tmp_impproductorecepcion (idimpproducto) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

----------------------------------

CREATE OR REPLACE FUNCTION mod_loginventario.f_validadataimportarproductorecepcion(
    p_iddocumento numeric,
    p_iddeposito numeric
	)
    RETURNS integer[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_result integer[]=array[0];
v_rec record;
v_productos record;
v_iscimex record;
v_config numeric;
begin

v_config := coalesce((select cast(vg.valor as numeric) from mod_logistica.nom_variableglobal vg 
                    where vg.nombre ilike 'INSERT_IND_RECEP' limit 1),0);

delete from mod_loginventario.tmp_impproductorecepcionerror where iddocumento = p_iddocumento;

--------

with nocuentaoum as (
insert into mod_loginventario.tmp_impproductorecepcionerror(
  idimpproductorecepcion,
  iddocumento,
  codigoproducto,
  denominacionproducto,
  um,
  clasificacioncontable,
  error
) 
(select a.idimpproducto, a.iddocumento, a.codigoproducto, a.denominacionproducto, a.um, a.clasificacioncontable, 
(case when cl.idclasificacioncontable is null and um.idunidadmedida is null 
then 'No existe C.Contable ni UM' when cl.idclasificacioncontable is null then 'No existe C.Contable' else
'No existe UM' end)
from mod_loginventario.tmp_impproductorecepcion a
left join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
left join mod_datosmaestros.nom_indicadorhoja nih on (nih.idindicador = ni.idindicador or nih.codigobarra = a.codigobarra)
left join mod_datosmaestros.nom_unidadmedida um on um.abreviaturaunidadmedida like a.um
left join mod_logistica.nom_clasificacioncontable cl on cl.codigo like a.clasificacioncontable
left join mod_logistica.dat_producto dpd on dpd.idindicador = ni.idindicador and dpd.idestructura = p_iddeposito
where a.iddocumento = p_iddocumento
and dpd.idproducto is null
and 
(
  cl.idclasificacioncontable is null 
  or um.idunidadmedida is null
)
)
returning idimpproductorecepcion)
select true as tienedatos into v_rec from nocuentaoum limit 1;


if v_rec.tienedatos is not null then v_result:= v_result|| array[2]; end if;

-------

if v_config = 0 THEN
  with nonomenclador as (
    insert into mod_loginventario.tmp_impproductorecepcionerror(
      idimpproductorecepcion,
      iddocumento,
      codigoproducto,
      denominacionproducto,
      um,
      clasificacioncontable,
      error
  	)
    (
    select a.idimpproducto, p_iddocumento, a.codigoproducto, 
    a.denominacionproducto, a.um, a.clasificacioncontable, 'No existe nomenclador' 
    from mod_loginventario.tmp_impproductorecepcion a
    left join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
    where a.iddocumento = p_iddocumento and ni.idindicador is null
    )
    RETURNING iddocumento )
    select true as tienedatos into v_rec from nonomenclador limit 1;

if v_rec.tienedatos is not null then v_result:= v_result|| array[1]; end if;

else

---codigos de barras

select valor into v_iscimex
from mod_logistica.nom_variableglobal
where nombre = 'VG_ISCIMEX' and valor = 'true';

IF v_iscimex.valor is not null THEN
---codigos de barras
CREATE TEMP TABLE datos AS 
TABLE mod_loginventario.tmp_impproductorecepcion 
WITH NO DATA;

INSERT into datos
select distinct 
        a.*
        from mod_loginventario.tmp_impproductorecepcion a
        left join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
        left join mod_datosmaestros.nom_indicadorhoja nih on nih.codigobarra = a.codigobarra
        where a.iddocumento = 1000593063 and ni.idindicador is NULL and nih.idindicador is NULL 
        and (a.codigoproducto is not null or a.codigobarra is not null)
;

--codigo barra vacio
select count(*) as cantidad into v_rec
from datos
where codigobarra is null or length(codigobarra) = 0;

if v_rec.cantidad > 0 then v_result:= v_result|| array[7]; end if;

insert into mod_loginventario.tmp_impproductorecepcionerror(
  idimpproductorecepcion,
  iddocumento,
  codigoproducto,
  denominacionproducto,
  um,
  clasificacioncontable,
  error,
  iderror
) 
  select a.idimpproducto, p_iddocumento, a.codigoproducto, 
    a.denominacionproducto, a.um, a.clasificacioncontable, 'Sin codigo de barra', 7
  from datos a
  where a.codigobarra is null or length(a.codigobarra) = 0
  ;

-----------------
--tamannos no permitidos
select count(*) as cantidad into v_rec
from datos
where (codigobarra is not null or length(codigobarra) > 0)
and length(codigobarra) not in(8,12,13,14,18);

if v_rec.cantidad > 0 then v_result:= v_result|| array[8]; end if;

insert into mod_loginventario.tmp_impproductorecepcionerror(
  idimpproductorecepcion,
  iddocumento,
  codigoproducto,
  denominacionproducto,
  um,
  clasificacioncontable,
  error
) 
  select a.idimpproducto, p_iddocumento, a.codigoproducto, 
    a.denominacionproducto, a.um, a.clasificacioncontable, 'Tamaño de codigo de barra no permitido'  
  from datos a
  where (a.codigobarra is not null or length(a.codigobarra) > 0)
  and length(codigobarra) not in(8,12,13,14,18)
  ;

-----------------
--codigo chequeo correcto
select count(*) as cantidad into v_rec
from datos
where length(codigobarra) = any(array[8,12,13,14,18])
and mod_datosmaestros.f_validarcodigodebarras(codigobarra) = false;

if v_rec.cantidad > 0 then v_result:= v_result|| array[9]; end if;

insert into mod_loginventario.tmp_impproductorecepcionerror(
  idimpproductorecepcion,
  iddocumento,
  codigoproducto,
  denominacionproducto,
  um,
  clasificacioncontable,
  error
) 
  select a.idimpproducto, p_iddocumento, a.codigoproducto, 
    a.denominacionproducto, a.um, a.clasificacioncontable, 'Codigo de chequeo incorrecto del codigo de barra'  
  from datos a
  where length(codigobarra) = any(array[8,12,13,14,18])
  and mod_datosmaestros.f_validarcodigodebarras(codigobarra) = false
  ;

---------------
--codigo de barras solo numeros
select count(*) as cantidad into v_rec
from datos
where length(codigobarra) > 0
and not codigobarra ~ '^[0-9]+$'
;

if v_rec.cantidad > 0 then v_result:= v_result|| array[10]; end if;

insert into mod_loginventario.tmp_impproductorecepcionerror(
  idimpproductorecepcion,
  iddocumento,
  codigoproducto,
  denominacionproducto,
  um,
  clasificacioncontable,
  error
)
  select a.idimpproducto, p_iddocumento, a.codigoproducto, 
    a.denominacionproducto, a.um, a.clasificacioncontable, 'Solo se permiten numeros en el codigo de barra'  
  from datos a
  where length(codigobarra) > 0
  and not codigobarra ~ '^[0-9]+$'
  ;

drop TABLE datos;
end if;

end if;


return v_result;
end
$BODY$;

ALTER FUNCTION mod_loginventario.f_validadataimportarproductorecepcion(numeric, numeric)
    OWNER TO zeolides;


----------------------------

DROP FUNCTION mod_loginventario.f_importaproductorecepcion(numeric,numeric,numeric,numeric);
CREATE OR REPLACE FUNCTION mod_loginventario.f_importaproductorecepcion(
	p_idusuario numeric,
	p_idestructura numeric,
	p_iddeposito numeric,
	p_iddocumento numeric)
    RETURNS integer[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
v_recordnaturaleza record;
v_recmatriz record;
v_idmatrizprecio numeric;
v_idmatrizadd record;
v_idmatrizdual record;
v_idmatrizdualadd numeric;
v_idespecialidad numeric;
v_idprecio record;
v_record record;
/*recep*/
v_datosproducto record;
v_productos record;
v_datosmov record;
v_config numeric;
/*recep*/
v_datosaux record;
v_result integer[];
  

BEGIN
  v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                          where cue.idusuario = p_idusuario limit 1);
  
  v_result:= v_result || mod_loginventario.f_validadataimportarproductorecepcion(p_iddocumento, p_iddeposito);
  
  if v_result @> array[1] or v_result @> array[2] or v_result @> array[7] or v_result @> array[8] or v_result @> array[9] or v_result @> array[10] then return v_result; end if;

  v_config := coalesce((select cast(vg.valor as numeric) from mod_logistica.nom_variableglobal vg 
                    where vg.nombre ilike 'INSERT_IND_RECEP' limit 1),0);
                
  if v_config <> 0 then
  	  alter table mod_datosmaestros.nom_indicador
      add column auxiliar varchar(200) default NULL;
      with indicadores AS (INSERT INTO mod_datosmaestros.nom_indicador
      ( 
        numeropieza, tipo, denominacion, descripcion, idformato, idespecialidad, idelementogasto, 
        idnaturaleza, idpadre, idumedida, idarbol, fechainicio, nivel,  idusuario, auxiliar) 
      (
        select distinct 
        a.codigoproducto, 1,coalesce(a.denominacionproducto,'SIN DENOMINACION'),
        coalesce(a.descripcionproducto,'SIN DESCRIPCION'),
        s.idformato, COALESCE(v_idespecialidad,s.idespecialidad),g.idelementoobjeto,
        coalesce(nat.idnaturaleza,s.idnaturaleza),s.idindicador as idpadre,
        um.idunidadmedida,s.idindicador,now(),s.nivel,p_idusuario, a.codigobarra
        from mod_loginventario.tmp_impproductorecepcion a
        left join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
        left join mod_datosmaestros.nom_indicadorhoja nih on nih.codigobarra = a.codigobarra
        left join mod_datosmaestros.nom_unidadmedida um on um.abreviaturaunidadmedida like a.um
        left join mod_datosmaestros.nom_naturaleza nat on nat.codigo ilike a.naturaleza
        left join mod_contabilidadcosto.nom_elementogasto g on g.codigoelementoobjeto ilike a.elementogasto
        left join (select ind.idformato,ind.idindicador,ind.tipo,ind.idespecialidad,
                max(pf.nivel) as nivel,ind.idnaturaleza
            from mod_datosmaestros.nom_indicador ind 
            inner join mod_datosmaestros.dat_formato f on f.idformato = ind.idformato 
            inner join mod_datosmaestros.dat_parteformato pf on pf.idformato = f.idformato
            group by ind.idformato,ind.idindicador,ind.tipo,ind.idespecialidad
            order by ind.idindicador asc limit 1) s on s.tipo = 1
        where a.iddocumento = p_iddocumento and ni.idindicador is NULL and nih.idindicador is NULL 
        and (a.codigoproducto is not null or a.codigobarra is not null)
      ) RETURNING idindicador as idsalida, auxiliar)
      INSERT INTO mod_datosmaestros.nom_indicadorhoja
        ( 
          idindicador, almacenado, codigobarra
        )
      select idsalida, 1, auxiliar from indicadores; 
       
        UPDATE 
          mod_datosmaestros.nom_indicadorhoja idh
        SET 
          idmarca = indi.idmarca,
          idmodelo = indi.idmodelo,
          precio = indi.precio,
          tipocontrol = indi.tipocontrol,
          codigoauxiliar = indi.codigoauxiliar/*,
          codigobarra = indi.codigobarra*/
        from (select a.precio, COALESCE(a.formaalmacenamiento,1) as tipocontrol,ni.idindicador,
        nm.idmarca,nmo.idmodelo,a.codigoauxiliar, a.iddocumento, a.codigobarra
        from mod_loginventario.tmp_impproductorecepcion a
        inner join mod_datosmaestros.nom_indicador ni on (ni.numeropieza = a.codigoproducto or ni.auxiliar = a.codigobarra)
        left join mod_datosmaestros.nom_marca nm on nm.codigo ilike a.marca
        left join mod_datosmaestros.nom_modelo nmo on nmo.denominacion ilike a.modelo
        /*where nih.idindicador is null*/) indi
        where indi.iddocumento = p_iddocumento and indi.idindicador = idh.idindicador;
      --inserto en planificacion
      insert into mod_datosmaestros.nom_indicadorplanif
      (idindicador, nivelplanif)
      (select DISTINCT ni.idindicador, 1 from mod_loginventario.tmp_impproductorecepcion a
        inner join mod_datosmaestros.nom_indicador ni on (ni.numeropieza = a.codigoproducto or ni.auxiliar = a.codigobarra)
        left join mod_datosmaestros.nom_indicadorplanif nip on nip.idindicador = ni.idindicador
        where a.iddocumento = p_iddocumento and nip.idindicador is null
      );
      alter table mod_datosmaestros.nom_indicador drop column auxiliar;
  end if;
  
  
  --Trabajo con los productos del excel
  
  for v_productos in (
            	select a.precio, a.cantidad, um.idunidadmedida, coalesce(ni.idindicador, nih.idindicador) as idindicador,
                 ni.idelementogasto, nih.idmarca, nih.idmodelo, 
                cl.idclasificacioncontable, a.clasificacioncontable, a.um, a.denominacionproducto, a.codigoproducto
                from mod_loginventario.tmp_impproductorecepcion a
    			left join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
                left join mod_datosmaestros.nom_indicadorhoja nih on (nih.idindicador = ni.idindicador or nih.codigobarra = a.codigobarra)
                left join mod_datosmaestros.nom_unidadmedida um on um.abreviaturaunidadmedida like a.um
                left join mod_logistica.nom_clasificacioncontable cl on cl.codigo like a.clasificacioncontable
                where a.iddocumento = p_iddocumento
            ) loop
            	--buscar indicador para crear tarjeta si no existe
            	select dpd.* into v_datosproducto from mod_logistica.dat_producto dpd
                where dpd.idestructura = p_iddeposito and dpd.idindicador = v_productos.idindicador;
            	--insertar movimientos de la recepcion
                if v_datosproducto.idproducto is not null then
                	select mov.* into v_datosmov from mod_logistica.dat_movimiento mov
                    where mov.iddocumento = p_iddocumento and mov.idproducto = v_datosproducto.idproducto;
                	if v_datosmov.idmovimiento is null then
                    	with movimiento as (
                        INSERT INTO 
                          mod_logistica.dat_movimiento
                        (
                          iddocumento,
                          idproducto,
                          preciocontable,
                          importecontable,
                          cantidad,
                          cronologia,
                          signo,
                          idunidadmedida,
                          idelementogasto,
                          idclasificacion
                        )
                        VALUES (
                          p_iddocumento,
                          v_datosproducto.idproducto,
                          v_productos.precio,
                          0,
                          v_productos.cantidad,
                          0,
                          '+',
                          v_datosproducto.idumedida,
                          v_datosproducto.idelementogasto,
                          v_datosproducto.idclasificacioncontable
                        ) returning idmovimiento, cantidad
                        )
                        INSERT INTO 
                          mod_loginventario.dat_movrecepcion
                        (
                          idmovimiento,
                          cantidad
                        )
                        select idmovimiento, cantidad from movimiento;
                    else
                    	update mod_logistica.dat_movimiento
                        set cantidad = /*cantidad +*/ v_productos.cantidad,
                        preciocontable = (round(preciocontable*cantidad,2)+round(v_productos.precio*v_productos.cantidad,2))/(cantidad+v_productos.cantidad)
                        where idmovimiento = v_datosmov.idmovimiento;
                        
                        update mod_loginventario.dat_movrecepcion
                        set cantidad = cantidad + v_productos.cantidad
                        where idmovimiento = v_datosmov.idmovimiento;
                    end if; 
                	
                else
                 	if v_productos.idclasificacioncontable is not null and v_productos.idunidadmedida is not null then
                      with producto as (
                        INSERT INTO 
                          mod_logistica.dat_producto
                        (
                          idestructura,
                          idumedida,
                          idindicador,
                          idclasificacioncontable,
                          cronologia,
                          cantidad,
                          importe,
                          idestructuracomun,
                          idmarca,
                          idmodelo,
                          idelementogasto
                        )
                        VALUES (
                          p_iddeposito,
                          v_productos.idunidadmedida,
                          v_productos.idindicador,
                          v_productos.idclasificacioncontable,
                          0,
                          0,
                          0,
                          p_idestructura,
                          v_productos.idmarca,
                          v_productos.idmodelo,
                          v_productos.idelementogasto
                        ) returning idproducto                      
                      ), movimiento as (
                        INSERT INTO 
                            mod_logistica.dat_movimiento
                          (
                            iddocumento,
                            idproducto,
                            preciocontable,
                            importecontable,
                            cantidad,
                            cronologia,
                            signo,
                            idunidadmedida,
                            idelementogasto,
                            idclasificacion
                          )
                          select p_iddocumento, idproducto, v_productos.precio,0,
                          v_productos.cantidad, 0, '+', v_datosproducto.idumedida, v_datosproducto.idelementogasto,
                          v_datosproducto.idclasificacioncontable from producto
                          returning idmovimiento, cantidad
                      )
                      INSERT INTO 
                        mod_loginventario.dat_movrecepcion
                      (
                        idmovimiento,
                        cantidad
                      )
                      select idmovimiento, cantidad from movimiento;
                                        	
                	end if;
                end if;
            end loop;
  
delete from mod_loginventario.tmp_impproductorecepcion where iddocumento = p_iddocumento;
return v_result;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_importaproductorecepcion(numeric, numeric, numeric, numeric)
    OWNER TO zeolides;

------------------------------

CREATE OR REPLACE FUNCTION mod_loginventario.f_generar_codigo_barra_en_impproducto_recepcion(
	p_idestandarcodigobarra numeric,
	p_idestructura numeric
	)
    RETURNS table(
		codigo_msg int,
		msg text,
		codigo_barra varchar
	)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_codigo_barra varchar;
v_codigo_msg int;
v_msg text;
v_nombre_sequencia varchar;
v_inicio_fin_sequencia int[];
v_inicio_fin_codigochequeo int[];
v_es_por_estructura bool;
BEGIN

SELECT a.codigo_msg, a.msg, a.codigo_barra, a.nombre_sequencia, a.inicio_fin_sequencia, a.inicio_fin_codigochequeo, a.es_por_estructura
into v_codigo_msg, v_msg, v_codigo_barra, v_nombre_sequencia, v_inicio_fin_sequencia, v_inicio_fin_codigochequeo, v_es_por_estructura
FROM mod_datosmaestros.f_generar_codigo_barra(p_idestandarcodigobarra, p_idestructura) a;

if v_codigo_msg = -1 then
	return query
	select v_codigo_msg, v_msg, v_codigo_barra
	;
	return;
end if;

UPDATE mod_loginventario.tmp_impproductorecepcion a
	SET codigobarra = mod_datosmaestros.f_generar_codigo_barra_sequencia_codigochequeo(
			v_codigo_barra, 
			v_nombre_sequencia,
			v_inicio_fin_sequencia,
			v_inicio_fin_codigochequeo
		)
	from (
		select idimpproductorecepcion
		from mod_loginventario.tmp_impproductorecepcionerror 
		where iderror = 7
	) b
	WHERE a.idimpproducto = b.idimpproductorecepcion;

if v_inicio_fin_sequencia[1] > 0 THEN
	perform mod_datosmaestros.f_actualizar_codigo_barra_sequencia_actual(
		p_idestandarcodigobarra,
		case when v_es_por_estructura then p_idestructura else null end,
		v_nombre_sequencia
	);
end if;

return query
select v_codigo_msg, v_msg, v_codigo_barra
;
end
$BODY$;

ALTER FUNCTION mod_loginventario.f_generar_codigo_barra_en_impproducto_recepcion(numeric, numeric)
    OWNER TO zeolides;