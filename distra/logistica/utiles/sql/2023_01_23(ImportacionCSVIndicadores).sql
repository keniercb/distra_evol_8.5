ALTER TABLE mod_datosmaestros.nom_indicadorhoja
  ADD COLUMN referencia VARCHAR(30);

ALTER TABLE mod_datosmaestros.dat_impproducto
  ADD COLUMN referencia VARCHAR(30);
  
ALTER TABLE mod_datosmaestros.dat_impproducto
  ADD COLUMN codigobarra VARCHAR(30);
  
CREATE OR REPLACE FUNCTION mod_datosmaestros.f_importaproducto (
  p_idusuario numeric
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
v_result integer[];
  

BEGIN
v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                        where cue.idusuario = p_idusuario limit 1);
v_result:= v_result || mod_datosmaestros.f_validadataimportaproducto();
if v_result @> array[2] or v_result @> array[3] or v_result @> array[4] or v_result @> array[5] or v_result @> array[6] then return v_result; end if;

with indicadores AS (INSERT INTO mod_datosmaestros.nom_indicador
  ( 
  	numeropieza, tipo, denominacion, descripcion, idformato, idespecialidad, idelementogasto, 
  	idnaturaleza, idpadre, idumedida, idarbol, fechainicio, nivel,  idusuario) 
  (
    select distinct 
    a.codigoproducto, a.tipo,coalesce(a.descripcionproducto,'SIN DENOMINACION'),
    coalesce(a.descripcionproducto,'SIN DESCRIPCION'),
    s.idformato, COALESCE(v_idespecialidad,s.idespecialidad),g.idelementoobjeto,
    coalesce(nat.idnaturaleza,s.idnaturaleza),s.idindicador as idpadre,
    um.idunidadmedida,s.idindicador,now(),s.nivel,p_idusuario
    from mod_datosmaestros.dat_impproducto a
    left join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
    left join mod_datosmaestros.nom_unidadmedida um on um.abreviaturaunidadmedida like a.um
    left join mod_datosmaestros.nom_naturaleza nat on nat.codigo ilike a.naturaleza
    left join mod_contabilidadcosto.nom_elementogasto g on g.codigoelementoobjeto ilike a.elementogasto
    left join (select ind.idformato,ind.idindicador,ind.tipo,ind.idespecialidad,
    		max(pf.nivel) as nivel,ind.idnaturaleza
        from mod_datosmaestros.nom_indicador ind 
        inner join mod_datosmaestros.dat_formato f on f.idformato = ind.idformato 
        inner join mod_datosmaestros.dat_parteformato pf on pf.idformato = f.idformato
        group by ind.idformato,ind.idindicador,ind.tipo,ind.idespecialidad
        order by ind.idindicador asc limit 1) s on s.tipo = a.tipo
    where ni.idindicador is NULL and a.codigoproducto is not null
  ) RETURNING idindicador as idsalida)
  INSERT INTO mod_datosmaestros.nom_indicadorhoja
    ( 
      idindicador
    )
  select idsalida from indicadores;  
    UPDATE 
      mod_datosmaestros.nom_indicadorhoja idh
    SET 
      idgruposubgrupo = indi.idgruposubgrupo,
      explotacion = indi.explotacion,
      almacenado = indi.almacenado,
      idmarca = indi.idmarca,
      idmodelo = indi.idmodelo,
      precio = indi.precio,
      tipocontrol = indi.tipocontrol,
      isuh = indi.isuh,
	  codigoauxiliar = indi.codigoauxiliar,
      referencia = indi.referencia,
      codigobarra = indi.codigobarra
    from (select (case when a.utiloherramienta = 1 then 1 else 0 end) as isuh,
    a.precio, COALESCE(a.formaalmacenamiento,1) as tipocontrol,ni.idindicador,
    gs.idgruposubgrupo,nm.idmarca,nmo.idmodelo,
    (case when a.almacenamiento in (1,3) then 1 else 0 end) as almacenado,
    (case when a.almacenamiento in (2,3) then 1 else 0 end) as explotacion,
	a.codigoauxiliar, a.referencia, a.codigobarra
    from mod_datosmaestros.dat_impproducto a
    inner join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
    left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
    left join mod_datosmaestros.nom_gruposubgrupo gs on gs.denominacion ilike a.grupo
    left join mod_datosmaestros.nom_marca nm on nm.codigo ilike a.marca
    left join mod_datosmaestros.nom_modelo nmo on nmo.denominacion ilike a.modelo
    /*where nih.idindicador is null*/) indi
    where indi.idindicador = idh.idindicador;
  --inserto en planificacion
  insert into mod_datosmaestros.nom_indicadorplanif
  (idindicador, nivelplanif)
  (select DISTINCT ni.idindicador, 1 from mod_datosmaestros.dat_impproducto a
    inner join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
    left join mod_datosmaestros.nom_indicadorplanif nip on nip.idindicador = ni.idindicador
    where nip.idindicador is null
  );

  for v_recordnaturaleza in select dm.idtipoprecio, i.idnaturaleza from mod_logfacturacion.dat_matrizprecio dm
    inner join mod_logfacturacion.nom_tipoprecio ntp on ntp.idtipoprecio = dm.idtipoprecio
    inner join mod_datosmaestros.nom_indicador i on i.idindicador = dm.idindicador
      where ntp.estado = 1 and dm.idindicador in ( 
      select dm1.idindicador from mod_logfacturacion.dat_matrizprecio dm1 
      inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dm1.idindicador 
          where ni.idnaturaleza in (
          select ind.idnaturaleza from mod_datosmaestros.dat_impproducto im 
          inner join mod_datosmaestros.nom_indicador ind on ind.numeropieza = im.codigoproducto
          )
    ) and dm.preciopromedio = 1 group by dm.idtipoprecio, i.idnaturaleza
    order by i.idnaturaleza
loop

  /*select ind.idindicador into v_record from mod_datosmaestros.dat_impproducto im 
  inner join mod_datosmaestros.nom_indicador ind on ind.numeropieza = im.codigoproducto
  where ind.idnaturaleza = v_recordnaturaleza.idnaturaleza;*/
  
  --loop 
  	select max(dm.idmatrizprecio) into v_idmatrizprecio from mod_logfacturacion.dat_matrizprecio dm 
             where dm.idindicador in ( 
              select dm1.idindicador from mod_logfacturacion.dat_matrizprecio dm1 
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dm1.idindicador 
                where ni.idnaturaleza = v_recordnaturaleza.idnaturaleza
             ) and dm.preciopromedio = 1 and dm.idtipoprecio = v_recordnaturaleza.idtipoprecio;
                
    select dm.* into v_recmatriz from mod_logfacturacion.dat_matrizprecio dm where dm.idmatrizprecio = v_idmatrizprecio;
    
--raise notice 'v_record %',v_record;

	with matrizprecio AS (INSERT INTO 
        mod_logfacturacion.dat_matrizprecio
      (
        idindicador,
        idestructuracomun,
        preciopromedio,
        idtipoprecio,
        idumedida,
        bi
      )
      (select ind.idindicador,v_recmatriz.idestructuracomun,v_recmatriz.preciopromedio,
          v_recmatriz.idtipoprecio,v_recmatriz.idumedida, v_recmatriz.bi from mod_datosmaestros.dat_impproducto im 
      inner join mod_datosmaestros.nom_indicador ind on ind.numeropieza = im.codigoproducto
      where ind.idnaturaleza = v_recordnaturaleza.idnaturaleza)
      returning idmatrizprecio
    ),matrizpreciodualmonetaria as (INSERT INTO 
          mod_logfacturacion.dat_matrizpreciodualmonetaria
        (
          idmoneda,
          idmatrizprecio,
          precioventa,
          precio,
          porciento
        )
        (select s.idmoneda,mp.idmatrizprecio,0,0,s.porciento from matrizprecio mp
        inner join (select dmm.* from mod_logfacturacion.dat_matrizpreciodualmonetaria dmm
        ) s on s.idmatrizprecio = v_idmatrizprecio) 
        returning idmatrizpreciodualidadmonetaria
    )INSERT INTO mod_logfacturacion.dat_precio
      ( 
      	idcuentadesgloseprecio,	
      	idmatrizpreciodualidadmonetaria,
        valor,porciento,concepto
      )
      (select s.idcuentadesgloseprecio,mpd.idmatrizpreciodualidadmonetaria,
      s.valor,s.porciento,s.concepto from matrizpreciodualmonetaria mpd
      inner join (select p.*,dmm.idmatrizprecio from mod_logfacturacion.dat_precio p
      		inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm 
            	on dmm.idmatrizpreciodualidadmonetaria = p.idmatrizpreciodualidadmonetaria
        ) s on s.idmatrizprecio = v_idmatrizprecio);
end loop;--end loop v_recordnaturaleza
delete from mod_datosmaestros.dat_impproducto;
return v_result;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_datosmaestros.f_importaproducto (p_idusuario numeric)
  OWNER TO zeolides;