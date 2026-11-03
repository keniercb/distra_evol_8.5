-- FUNCTION: mod_logfacturacion.f_valoresmatrizprecio(numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logfacturacion.f_valoresmatrizprecio(numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_valoresmatrizprecio(
	estructura numeric,
	tipoprecio numeric,
	moneda1 numeric,
	moneda2 numeric,
	base1 numeric,
	base2 numeric,
	tipo numeric,
	p_idmatrizprecio numeric,
	p_idnaturaleza numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
v_rec record;
v_matrizp record;
v_idmatrizprecio numeric;
v_matrizdualidad record;
v_idmatrizpreciodual numeric;
v_precio record;
BEGIN
---------------------------------------------------------------------------
if p_idnaturaleza is not null then
	update mod_logfacturacion.dat_matrizprecio
    set preciopromedio = (select dm.preciopromedio from mod_logfacturacion.dat_matrizprecio dm where dm.idmatrizprecio = $8),
    bi = (select dm.bi from mod_logfacturacion.dat_matrizprecio dm where dm.idmatrizprecio = $8),
    idumedida = (select dm.idumedida from mod_logfacturacion.dat_matrizprecio dm where dm.idmatrizprecio = $8)
    where idtipoprecio = $2 and idindicador in (select dmp.idindicador from mod_logfacturacion.dat_matrizprecio dmp
    inner join mod_datosmaestros.nom_indicador i on i.idindicador = dmp.idindicador
    inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
     where dmp.idmatrizprecio <> $8 and dmp.idtipoprecio = $2 and dmp.idestructuracomun = $1 and i.tipo = $7 and (case when $7 = 1 then 
  (i.idnaturaleza = p_idnaturaleza) 
    else 
    (ih.codigoauxiliar = (select cc.codigo from mod_logistica.nom_clasificacioncontable cc where cc.idclasificacioncontable = p_idnaturaleza)) end));
end if;

INSERT INTO mod_logfacturacion.dat_matrizprecio
(idindicador,idestructuracomun,idtipoprecio,preciopromedio,bi,idumedida)
select i.idindicador,$1,$2,(select dm.preciopromedio from mod_logfacturacion.dat_matrizprecio dm where dm.idmatrizprecio = $8),
(select dm.bi from mod_logfacturacion.dat_matrizprecio dm where dm.idmatrizprecio = $8),
(select dm.idumedida from mod_logfacturacion.dat_matrizprecio dm where dm.idmatrizprecio = $8) from mod_datosmaestros.nom_indicador i 
inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
where i.idindicador not in (select idindicador from mod_logfacturacion.dat_matrizprecio where idtipoprecio = $2
and idestructuracomun = $1 /*and idindicador <> (select dmm.idindicador
from mod_logfacturacion.dat_matrizprecio dmm where dmm.idmatrizprecio = $8 limit 1)*/) and i.tipo = $7 
and (case when $7 = 1 then 
  (i.idnaturaleza = p_idnaturaleza or p_idnaturaleza is null) 
    else 
    (ih.codigoauxiliar = (select cc.codigo from mod_logistica.nom_clasificacioncontable cc where cc.idclasificacioncontable = p_idnaturaleza) or p_idnaturaleza is null) end);
---------------------------------------------------------------------------

--SELECT * FROM mod_migracion.f_valoresmatrizprecio2($1, $2, $3, $4, $5, $6);

END;
$BODY$;

ALTER FUNCTION mod_logfacturacion.f_valoresmatrizprecio(numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;

	
-- FUNCTION: mod_logfacturacion.f_valoresmatrizprecio3(numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logfacturacion.f_valoresmatrizprecio3(numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_valoresmatrizprecio3(
	estructura numeric,
	tipoprecio numeric,
	moneda1 numeric,
	moneda2 numeric,
	base1 numeric,
	base2 numeric,
	tipo numeric,
	p_idnaturaleza numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
v_rec record;
v_matrizp record;
v_idmatrizprecio numeric;
v_matrizdualidad record;
v_idmatrizpreciodual numeric;
v_precio record;
BEGIN

---------------------------------------------------------------------------
if p_idnaturaleza is not null then
	update mod_logfacturacion.dat_precio as dp
    set valor = COALESCE((select p.valor from mod_logfacturacion.dat_precio as p where p.idmatrizpreciodualidadmonetaria = $5
    	and p.idcuentadesgloseprecio = g.idcuentadesgloseprecio),0),
    porciento = (select p.porciento from mod_logfacturacion.dat_precio as p where p.idmatrizpreciodualidadmonetaria = $5
    	and p.idcuentadesgloseprecio = g.idcuentadesgloseprecio),
    concepto = (select p.concepto from mod_logfacturacion.dat_precio as p where p.idmatrizpreciodualidadmonetaria = $5
    	and p.idcuentadesgloseprecio = g.idcuentadesgloseprecio)
    from mod_logfacturacion.dat_matrizpreciodualmonetaria as dual
    inner join mod_logfacturacion.dat_precio p on p.idmatrizpreciodualidadmonetaria = dual.idmatrizpreciodualidadmonetaria
    inner join mod_logfacturacion.dat_cuentadesgloseprecio g on g.idcuentadesgloseprecio = p.idcuentadesgloseprecio and g.idtipoprecio = $2
--    inner join mod_logfacturacion.dat_categoriaprecioentidad ct on g.idcategoriaprecioentidad = ct.idcategoriaprecioentidad and g.idtipoprecio = $2
    inner join mod_logfacturacion.dat_matrizprecio m on m.idmatrizprecio = dual.idmatrizprecio and m.idestructuracomun = $1 and m.idtipoprecio = $2
    inner join mod_datosmaestros.nom_indicador i on i.idindicador = m.idindicador and i.tipo = $7
    inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
    where dual.idmatrizpreciodualidadmonetaria = dp.idmatrizpreciodualidadmonetaria and dual.idmoneda = $3 --and ct.idestructuracomun = $1 
    and p.idprecio = dp.idprecio and (case when $7 = 1 then 
  (i.idnaturaleza = p_idnaturaleza) 
    else 
    (ih.codigoauxiliar = (select cc.codigo from mod_logistica.nom_clasificacioncontable cc where cc.idclasificacioncontable = p_idnaturaleza)) end);
    
    update mod_logfacturacion.dat_precio as dp
    set valor = COALESCE((select p.valor from mod_logfacturacion.dat_precio as p where p.idmatrizpreciodualidadmonetaria = $6
    	and p.idcuentadesgloseprecio = g.idcuentadesgloseprecio),0),
    porciento = (select p.porciento from mod_logfacturacion.dat_precio as p where p.idmatrizpreciodualidadmonetaria = $6
    	and p.idcuentadesgloseprecio = g.idcuentadesgloseprecio),
    concepto = (select p.concepto from mod_logfacturacion.dat_precio as p where p.idmatrizpreciodualidadmonetaria = $6
    	and p.idcuentadesgloseprecio = g.idcuentadesgloseprecio)
    from mod_logfacturacion.dat_matrizpreciodualmonetaria as dual
        inner join mod_logfacturacion.dat_precio p on p.idmatrizpreciodualidadmonetaria = dual.idmatrizpreciodualidadmonetaria
    inner join mod_logfacturacion.dat_cuentadesgloseprecio g on g.idcuentadesgloseprecio = p.idcuentadesgloseprecio
    inner join mod_logfacturacion.dat_categoriaprecioentidad ct on g.idcategoriaprecioentidad = ct.idcategoriaprecioentidad and g.idtipoprecio = $2
    inner join mod_logfacturacion.dat_matrizprecio m on m.idmatrizprecio = dual.idmatrizprecio and m.idestructuracomun = $1 and m.idtipoprecio = $2
    inner join mod_datosmaestros.nom_indicador i on i.idindicador = m.idindicador and i.tipo = $7
    inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
    where dual.idmatrizpreciodualidadmonetaria = dp.idmatrizpreciodualidadmonetaria and dual.idmoneda = $4 and ct.idestructuracomun = $1 
    and p.idprecio = dp.idprecio and (case when $7 = 1 then 
  (i.idnaturaleza = p_idnaturaleza) 
    else 
    (ih.codigoauxiliar = (select cc.codigo from mod_logistica.nom_clasificacioncontable cc where cc.idclasificacioncontable = p_idnaturaleza)) end);
    
end if;

INSERT INTO mod_logfacturacion.dat_precio
(idmatrizpreciodualidadmonetaria,idcuentadesgloseprecio,valor,porciento,concepto)  
select dual.idmatrizpreciodualidadmonetaria,g.idcuentadesgloseprecio,
(
select pp.valor from mod_logfacturacion.dat_precio pp where pp.idmatrizpreciodualidadmonetaria = $5 and pp.idcuentadesgloseprecio in (
	select dcdp.idcuentadesgloseprecio from mod_logfacturacion.dat_cuentadesgloseprecio dcdp 
    --inner join mod_logfacturacion.dat_categoriaprecioentidad dcpe on dcpe.idcategoriaprecioentidad = dcdp.idcategoriaprecioentidad
    where dcdp.idcategoriaprecio = ncat.idcategoriaprecio and dcdp.idtipoprecio = $2
    )
),(
select pp.porciento from mod_logfacturacion.dat_precio pp where pp.idmatrizpreciodualidadmonetaria = $5 and pp.idcuentadesgloseprecio in (
	select dcdp.idcuentadesgloseprecio from mod_logfacturacion.dat_cuentadesgloseprecio dcdp 
    --inner join mod_logfacturacion.dat_categoriaprecioentidad dcpe on dcpe.idcategoriaprecioentidad = dcdp.idcategoriaprecioentidad
    where dcdp.idcategoriaprecio = ncat.idcategoriaprecio and dcdp.idtipoprecio = $2
    )
),(
select pp.concepto from mod_logfacturacion.dat_precio pp where pp.idmatrizpreciodualidadmonetaria = $5 and pp.idcuentadesgloseprecio in (
	select dcdp.idcuentadesgloseprecio from mod_logfacturacion.dat_cuentadesgloseprecio dcdp 
    --inner join mod_logfacturacion.dat_categoriaprecioentidad dcpe on dcpe.idcategoriaprecioentidad = dcdp.idcategoriaprecioentidad
    where dcdp.idcategoriaprecio = ncat.idcategoriaprecio and dcdp.idtipoprecio = $2
    )
)
from mod_datosmaestros.nom_indicador i
inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
inner join mod_logfacturacion.dat_matrizprecio m on m.idindicador = i.idindicador and m.idtipoprecio = $2
and m.idestructuracomun = $1 and (case when $7 = 1 then 
  (i.idnaturaleza = p_idnaturaleza or p_idnaturaleza is null) 
    else 
    (ih.codigoauxiliar = (select cc.codigo from mod_logistica.nom_clasificacioncontable cc where cc.idclasificacioncontable = p_idnaturaleza) or p_idnaturaleza is null) end)
inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dual on dual.idmatrizprecio = m.idmatrizprecio and dual.idmoneda = $3
--inner join mod_logfacturacion.dat_categoriaprecioentidad ct on ct.idestructuracomun = $1
inner join mod_logfacturacion.dat_cuentadesgloseprecio g on /*g.idcategoriaprecioentidad = ct.idcategoriaprecioentidad and*/ g.idtipoprecio = $2
inner join mod_logfacturacion.nom_categoriaprecio ncat on ncat.idcategoriaprecio = g.idcategoriaprecio
inner join mod_logfacturacion.dat_precio p on p.idcuentadesgloseprecio = g.idcuentadesgloseprecio 
and p.idmatrizpreciodualidadmonetaria = $5
where dual.idmatrizpreciodualidadmonetaria not in (select idmatrizpreciodualidadmonetaria from mod_logfacturacion.dat_precio
where idmatrizpreciodualidadmonetaria = dual.idmatrizpreciodualidadmonetaria 
and idcuentadesgloseprecio = g.idcuentadesgloseprecio) and i.tipo = $7;
if $4 <> -1 then
INSERT INTO mod_logfacturacion.dat_precio
(idmatrizpreciodualidadmonetaria,idcuentadesgloseprecio,valor,porciento,concepto)  
select dual.idmatrizpreciodualidadmonetaria,g.idcuentadesgloseprecio,
(
select pp.valor from mod_logfacturacion.dat_precio pp where pp.idmatrizpreciodualidadmonetaria = $6 and pp.idcuentadesgloseprecio in (
	select dcdp.idcuentadesgloseprecio from mod_logfacturacion.dat_cuentadesgloseprecio dcdp 
    inner join mod_logfacturacion.dat_categoriaprecioentidad dcpe on dcpe.idcategoriaprecioentidad = dcdp.idcategoriaprecioentidad
    where dcpe.idcategoriaprecio = ncat.idcategoriaprecio and dcdp.idtipoprecio = $2
    )
),(
select pp.porciento from mod_logfacturacion.dat_precio pp where pp.idmatrizpreciodualidadmonetaria = $6 and pp.idcuentadesgloseprecio in (
	select dcdp.idcuentadesgloseprecio from mod_logfacturacion.dat_cuentadesgloseprecio dcdp 
    inner join mod_logfacturacion.dat_categoriaprecioentidad dcpe on dcpe.idcategoriaprecioentidad = dcdp.idcategoriaprecioentidad
    where dcpe.idcategoriaprecio = ncat.idcategoriaprecio and dcdp.idtipoprecio = $2
    )
),(
select pp.concepto from mod_logfacturacion.dat_precio pp where pp.idmatrizpreciodualidadmonetaria = $6 and pp.idcuentadesgloseprecio in (
	select dcdp.idcuentadesgloseprecio from mod_logfacturacion.dat_cuentadesgloseprecio dcdp 
    inner join mod_logfacturacion.dat_categoriaprecioentidad dcpe on dcpe.idcategoriaprecioentidad = dcdp.idcategoriaprecioentidad
    where dcpe.idcategoriaprecio = ncat.idcategoriaprecio and dcdp.idtipoprecio = $2
    )
)
from mod_datosmaestros.nom_indicador i
inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador 
inner join mod_logfacturacion.dat_matrizprecio m on m.idindicador = i.idindicador and m.idtipoprecio = $2
and m.idestructuracomun = $1 and (case when $7 = 1 then 
  (i.idnaturaleza = p_idnaturaleza or p_idnaturaleza is null) 
    else 
    (ih.codigoauxiliar = (select cc.codigo from mod_logistica.nom_clasificacioncontable cc where cc.idclasificacioncontable = p_idnaturaleza) or p_idnaturaleza is null) end)
inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dual on dual.idmatrizprecio = m.idmatrizprecio and dual.idmoneda = $4
inner join mod_logfacturacion.dat_categoriaprecioentidad ct on ct.idestructuracomun = $1
inner join mod_logfacturacion.nom_categoriaprecio ncat on ncat.idcategoriaprecio = ct.idcategoriaprecio
inner join mod_logfacturacion.dat_cuentadesgloseprecio g on g.idcategoriaprecioentidad = ct.idcategoriaprecioentidad and g.idtipoprecio = $2
left join mod_logfacturacion.dat_precio p on p.idcuentadesgloseprecio = g.idcuentadesgloseprecio 
and p.idmatrizpreciodualidadmonetaria = $6
where dual.idmatrizpreciodualidadmonetaria not in (select idmatrizpreciodualidadmonetaria from mod_logfacturacion.dat_precio
where idmatrizpreciodualidadmonetaria = dual.idmatrizpreciodualidadmonetaria 
and idcuentadesgloseprecio = g.idcuentadesgloseprecio) and i.tipo = $7;
end if;
---------------------------------------------------------------------------

END;
$BODY$;

ALTER FUNCTION mod_logfacturacion.f_valoresmatrizprecio3(numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric)
    OWNER TO zeolides;
