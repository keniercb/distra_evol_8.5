CREATE OR REPLACE FUNCTION mod_loginventario.f_importaproductorecepcion (
  p_idusuario numeric,
  p_idestructura numeric,
  p_iddeposito numeric,
  p_iddocumento numeric
)
RETURNS numeric [] AS
$body$
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
v_result numeric[];
  

BEGIN
  v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                          where cue.idusuario = p_idusuario limit 1);
  v_result:= v_result /*|| mod_datosmaestros.f_validadataimportaproducto()*/;
  --if v_result @> array[2] or v_result @> array[3] or v_result @> array[4] or v_result @> array[5] or v_result @> array[6] then return v_result; end if;

  v_config := coalesce((select cast(vg.valor as numeric) from mod_logistica.nom_variableglobal vg 
                    where vg.nombre ilike 'INSERT_IND_RECEP' limit 1),0);
  delete from mod_loginventario.tmp_impproductorecepcionerror where iddocumento = p_iddocumento;                  
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
        left join mod_datosmaestros.nom_naturaleza nat on nat.codigo ilike a.naturaleza and nat.estado = 1
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
  else
  	insert into mod_loginventario.tmp_impproductorecepcionerror(
      iddocumento,
      codigoproducto,
      denominacionproducto,
      um,
      clasificacioncontable,
      error
  	)
    select p_iddocumento, a.codigoproducto, a.denominacionproducto, a.um, a.clasificacioncontable, 'No existe nomenclador' 
    from mod_loginventario.tmp_impproductorecepcion a
    left join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
    where a.iddocumento = p_iddocumento and ni.idindicador is null;
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
                left join mod_logistica.nom_clasificacioncontable cl on cl.codigo like a.clasificacioncontable and cl.facturacion = 0
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
                    else  
                    	select p.* into v_datosaux from mod_loginventario.tmp_impproductorecepcionerror p
                    	where p.iddocumento = p_iddocumento and p.codigoproducto = v_productos.codigoproducto;
                    	if v_datosaux.idproductoerror is not null then
                        	update mod_loginventario.tmp_impproductorecepcionerror
                            set error = error || (case when v_productos.idclasificacioncontable is null and v_productos.idunidadmedida is null 
                                then ', No existe C.Contable ni UM' when v_productos.idclasificacioncontable is null then ', No existe C.Contable' else
                                ', No existe UM' end)
                            where idproductoerror = v_datosaux.idproductoerror;
                        else 
                        	insert into mod_loginventario.tmp_impproductorecepcionerror(
                              iddocumento,
                              codigoproducto,
                              denominacionproducto,
                              um,
                              clasificacioncontable,
                              error
                            ) 
                            select p_iddocumento, a.codigoproducto, a.denominacionproducto, a.um, a.clasificacioncontable, 
                            (case when v_productos.idclasificacioncontable is null and v_productos.idunidadmedida is null 
                            then 'No existe C.Contable ni UM' when v_productos.idclasificacioncontable is null then 'No existe C.Contable' else
                            'No existe UM' end) 
                            from mod_loginventario.tmp_impproductorecepcion a
                            inner join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
                            where a.iddocumento = p_iddocumento and a.codigoproducto = v_productos.codigoproducto;
                        end if;
                	end if;
                end if;
            end loop;
  
delete from mod_loginventario.tmp_impproductorecepcion where iddocumento = p_iddocumento;
return v_result;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_loginventario.f_importaproductorecepcion (p_idusuario numeric, p_idestructura numeric, p_iddeposito numeric, p_iddocumento numeric)
  OWNER TO zeolides;