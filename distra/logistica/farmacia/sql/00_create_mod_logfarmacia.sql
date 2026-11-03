-- SQL Manager for PostgreSQL 6.0.1.53431
-- ---------------------------------------
-- Host      : localhost:5434
-- Database  : distra-farmacia-dev
-- Version   : PostgreSQL 9.4.1, compiled by Visual C++ build 1800, 64-bit



CREATE SCHEMA mod_logfarmacia AUTHORIZATION zeolides;
--
-- Definition for foreign data wrapper dblink_fdw (OID = 1735026) : 
--
SET check_function_bodies = false;
--
-- Definition for type td_coberturaproducto (OID = 1776118) : 
--
SET search_path = mod_logfarmacia, pg_catalog;
CREATE TYPE mod_logfarmacia.td_coberturaproducto AS (
  denominacion varchar,
  codigo varchar,
  uemb varchar,
  lineaprod varchar,
  maximo numeric(25,6),
  norma numeric,
  existencia numeric(25,6)
);
--
-- Definition for type td_cuadrobasico (OID = 1776121) : 
--
CREATE TYPE mod_logfarmacia.td_cuadrobasico AS (
  codigo varchar,
  denominacion varchar,
  tipocuadrobasico varchar,
  proveedor varchar,
  grupofarmacologico varchar,
  viaadquisicion varchar,
  clasificacionven varchar,
  prioridad numeric(10,0),
  tipodispensacion varchar
);
--
-- Definition for type td_listadodisponibilidadprod (OID = 1776124) : 
--
CREATE TYPE mod_logfarmacia.td_listadodisponibilidadprod AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  arearesp varchar,
  lineaprod varchar,
  cantidad numeric(25,6),
  preciocosto numeric(25,6),
  precioventa numeric(25,6),
  numerolote varchar(19),
  cantidadlote numeric(19,0)
);
--
-- Definition for type td_listadotarjetamedicamento (OID = 1776127) : 
--
CREATE TYPE mod_logfarmacia.td_listadotarjetamedicamento AS (
  nrodoc numeric(19,0),
  paciente varchar,
  estado varchar,
  cantidadproductos numeric(19,0),
  creadopor varchar,
  fechacontable date,
  aprobadopor varchar
);
--
-- Definition for type td_listartranferenciainterna (OID = 1776130) : 
--
CREATE TYPE mod_logfarmacia.td_listartranferenciainterna AS (
  nrodoc varchar,
  numeroref numeric(19,0),
  fechacreacion date,
  estado varchar,
  creadopor varchar,
  aprobadopor varchar,
  areaorigen varchar,
  areadestino varchar,
  tipotranferencia varchar,
  conceretenido varchar,
  denommotivo varchar,
  cantidadprod numeric(19,0),
  entidad varchar(255),
  logo varchar(255)
);
--
-- Definition for type td_modeloconsultaproductos (OID = 1776133) : 
--
CREATE TYPE mod_logfarmacia.td_modeloconsultaproductos AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  lineaprod varchar,
  preciocosto numeric(25,6),
  precioventa numeric(25,6),
  maximo numeric(25,6),
  minimo numeric(25,6),
  porfondofijo numeric(25,6),
  existencia numeric(19,0),
  retenidos numeric(19,0)
);
--
-- Definition for type td_modeloconsumoproductos (OID = 1776136) : 
--
CREATE TYPE mod_logfarmacia.td_modeloconsumoproductos AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  cantidad numeric(19,0),
  precioventa numeric(25,6),
  arearesp varchar,
  lineaprod varchar
);
--
-- Definition for type td_modeloinvproducto (OID = 1776139) : 
--
CREATE TYPE mod_logfarmacia.td_modeloinvproducto AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  existencia numeric(19,0),
  preciocosto numeric(25,6),
  precioventa numeric(25,6),
  existecia_venta numeric(25,6),
  lote varchar,
  cantidad numeric(25,6),
  fechavencimiento date,
  lineaprod varchar
);
--
-- Definition for type td_modelomaximominimo (OID = 1776142) : 
--
CREATE TYPE mod_logfarmacia.td_modelomaximominimo AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  lineaprod varchar,
  maximo numeric(25,6),
  minimo numeric(25,6),
  existencia numeric(19,0),
  arearesp varchar
);
--
-- Definition for type td_modelomovimientoproducto (OID = 1776145) : 
--
CREATE TYPE mod_logfarmacia.td_modelomovimientoproducto AS (
  codigo varchar,
  denominacion varchar,
  lineaprod varchar,
  fecha date,
  tipodoc varchar,
  numerodoc numeric(19,0),
  origen varchar,
  destino varchar,
  cantidad numeric(25,6),
  precio numeric(25,6),
  importe numeric(25,6),
  existencia numeric(25,6)
);
--
-- Definition for type td_modeloprodretenidos (OID = 1776148) : 
--
CREATE TYPE mod_logfarmacia.td_modeloprodretenidos AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  existencia numeric(19,0),
  lote varchar,
  cantidad numeric(25,6),
  fechavencimiento date,
  arearesp varchar,
  lineaprod varchar
);
--
-- Definition for type td_modelorecepproducto (OID = 1776151) : 
--
CREATE TYPE mod_logfarmacia.td_modelorecepproducto AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  cantidad numeric(19,0),
  preciocosto numeric(25,6),
  arearesp varchar,
  lineaprod varchar
);
--
-- Definition for type td_modeloreenvase (OID = 1776154) : 
--
CREATE TYPE mod_logfarmacia.td_modeloreenvase AS (
  codigodenom varchar(255),
  denominacion varchar(255),
  presentacion varchar(255),
  dosisunitaria numeric(19,0),
  numerolote numeric(19,0),
  fechavencimiento date,
  cantorigen numeric(25,0),
  dosisunitreal numeric(25,0),
  codigodenomreenvasado varchar(255),
  denomreenvasado varchar(255),
  presentreenvasado varchar(255),
  dosisunitariareenvasado numeric(19,0),
  numerolotereenvasado numeric(19,0),
  fechavencreenvasado date,
  cantdestino numeric(25,0),
  diffaltante numeric(25,0),
  difsobrante numeric(25,0),
  fecha date,
  numerodoc numeric(19,0),
  area varchar(255),
  usuario varchar(255),
  entidad varchar(255)
);
--
-- Definition for type td_modelorotacionlote (OID = 1776157) : 
--
CREATE TYPE mod_logfarmacia.td_modelorotacionlote AS (
  codigo varchar(255),
  denominacion varchar(255),
  um varchar(255),
  numerolote varchar(255),
  cantidad numeric(19,0),
  tipo numeric(1,0),
  fecha date,
  numerodoc numeric(19,0),
  areaorigen varchar(255),
  areadestino varchar(255),
  usuario varchar(255),
  entidad varchar(255)
);
--
-- Definition for type td_modelotarjetamedicamento (OID = 1776160) : 
--
CREATE TYPE mod_logfarmacia.td_modelotarjetamedicamento AS (
  paciente varchar,
  direccion varchar,
  nrodoc numeric(19,0),
  codigo varchar,
  descripcion varchar,
  origenprescripcion varchar,
  nroregistro numeric(19,0),
  especialidad varchar,
  dosis varchar,
  fechaemision date,
  fechaexpiracion date,
  idproductotarjetamedicamento numeric(19,0),
  ci numeric(20,0)
);
--
-- Definition for type td_modelotransfinterna (OID = 1776163) : 
--
CREATE TYPE mod_logfarmacia.td_modelotransfinterna AS (
  existencia numeric(19,0),
  preciocosto numeric(25,2),
  precioventa numeric(25,2),
  denomlineaprod varchar,
  codigo varchar,
  denomcodificador varchar,
  denompresentacion varchar,
  um varchar,
  cantidad numeric(19,0),
  importeventa numeric(25,2),
  importetotal numeric(25,2),
  idproducto numeric(19,0),
  nrodocumento numeric(19,0),
  areaorigen varchar(255),
  areadestino varchar(255),
  entidad varchar(255),
  importecosto numeric(25,2)
);
--
-- Definition for type td_modelotransfinternalote (OID = 1776166) : 
--
CREATE TYPE mod_logfarmacia.td_modelotransfinternalote AS (
  numero varchar,
  cantpasar numeric(19,0)
);
--
-- Definition for type td_productofaltas (OID = 1776169) : 
--
CREATE TYPE mod_logfarmacia.td_productofaltas AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  lineaprod varchar,
  maximo numeric(25,6),
  minimo numeric(25,6)
);
--
-- Definition for type td_vencimientoproducto (OID = 1776172) : 
--
CREATE TYPE mod_logfarmacia.td_vencimientoproducto AS (
  codigo varchar,
  denominacion varchar,
  uemb varchar,
  existencia numeric(25,6),
  lote varchar,
  cantidad numeric(25,6),
  fechavencimiento date,
  estado varchar,
  arearesp varchar,
  lineaprod varchar
);
--
-- Definition for function f_aprobarreenvase (OID = 1776173) : 
--
CREATE FUNCTION mod_logfarmacia.f_aprobarreenvase (
  p_iddocumento numeric,
  p_cronologia numeric = 1
)
RETURNS void
AS 
$body$
declare
v_allrecreenvase record;
v_allrecreenvasado record;
v_idproductoorigen numeric;
v_idproductodestino numeric;


v_recdata record;
v_reclote record;
v_idproducto numeric;
v_idlote numeric;
v_idmovimiento numeric;
v_idmovimientodestino numeric;
begin
select dr.idarea as deposito into v_recdata from mod_logfarmacia.dat_reenvase dr 
where dr.idreenvase = p_iddocumento;
    
for v_allrecreenvase in select mov.preciocontable as precio, dpr.idreenvase, dpr.idprodreenvase as idproducto, p.idproducto as prodorigen, dpr.cantorigen as cantidad
from mod_logfarmacia.dat_prodreenvase dpr
inner join mod_logfarmacia.dat_reenvase rem on rem.idreenvase = dpr.idreenvase
inner join mod_logistica.dat_producto p on p.idproducto = dpr.idprodreenvase and p.idestructura = v_recdata.deposito
inner join  mod_logistica.dat_movimiento mov on mov.iddocumento = rem.idreenvase
where dpr.idreenvase =  p_iddocumento
group by dpr.idreenvase, dpr.idprodreenvase, p.idproducto, mov.preciocontable 

/*
for v_allrecreenvasado in select movv.preciocontable as precio, dpree.idreenvase, dpree.idprodreenvasado as idproducto, pp.idproducto as prodorigen, dpree.cantdestino as cantidad
from mod_logfarmacia.dat_prodreenvasado dpree
inner join mod_logfarmacia.dat_reenvase remm on remm.idreenvase = dpree.idreenvase
inner join mod_logistica.dat_producto pp on pp.idproducto = dpree.idprodreenvasado and pp.idestructura = v_recdata.deposito
inner join  mod_logistica.dat_movimiento movv on movv.iddocumento = remm.idreenvase
where dpree.idreenvase = p_iddocumento
group by dpree.idreenvase, dpree.idprodreenvasado, pp.idproducto, movv.preciocontable*/ 

loop

if v_allrecreenvase.prodorigen is not null then
update mod_logistica.dat_producto set               
cantidad = v_allrecreenvase.cantidad + cantidad,
disponible = v_allrecreenvase.cantidad + disponible,              
importe = (v_allrecreenvase.cantidad + cantidad)* v_allrecreenvase.precio,              
importealternativo = (v_allrecreenvase.cantidad + cantidad) * precioalternativo           
where idproducto = v_allrecreenvase.prodorigen;
v_idproductoorigen:= v_allrecreenvase.prodorigen;

/*
if v_allrecreenvasado.proddestino is not null then
update mod_logistica.dat_producto set               
cantidad = v_allrecreenvasado.cantidad + cantidad,
disponible = v_allrecreenvasado.cantidad + disponible,              
importe = (v_allrecreenvasado.cantidad + cantidad) * v_allrecreenvasado.precio,              
importealternativo = (v_allrecreenvasado.cantidad + cantidad) * precioalternativo           
where idproducto = v_allrecreenvasado.proddestino;
v_idproductodestino:= v_allrecreenvasado.proddestino;*/

end if;
        
update mod_logistica.dat_producto set cantidad = cantidad - v_allrecreenvase.cantidad,
disponible = disponible - v_allrecreenvase.cantidad,
importe = (cantidad - v_allrecreenvase.cantidad) * v_allrecreenvase.precio,
importealternativo = (cantidad - v_allrecreenvase.cantidad) * precioalternativo
where idproducto = v_allrecreenvase.idproducto;
/*
update mod_logistica.dat_producto set cantidad = cantidad - v_allrecreenvasado.cantidad,
disponible = disponible - v_allrecreenvasado.cantidad,
importe = (cantidad - v_allrecreenvasado.cantidad) * v_allrecreenvasado.precio,
importealternativo = (cantidad - v_allrecreenvasado.cantidad) * precioalternativo
where idproducto = v_allrecreenvasado.idproducto;*/

insert into mod_logistica.dat_movimiento(iddocumento,idproducto,          
--preciocontable,
--importecontable,
cantidad,
cronologia,          
--existenciaactual,
--preciopromedio,
--importetotal,
signo
--precioalternativo,
--preciopromalt,
--importealternativo,
--importetotalalt,          
)
values (p_iddocumento,v_idproductoorigen,
--?preciocontable,
--?importecontable,
v_allrecreenvase.cantidad,
p_cronologia,
--?existenciaactual,
--?preciopromedio,
--?importetotal,
'-'
--?precioalternativo,
--?preciopromalt,
--?importealternativo,
--?importetotalalt,          
) returning idmovimiento into v_idmovimiento;  
/*
insert into mod_logistica.dat_movimiento(iddocumento,idproducto,          
--preciocontable,
--importecontable,
cantidad,
cronologia,          
--existenciaactual,
--preciopromedio,
--importetotal,
signo
--precioalternativo,
--preciopromalt,
--importealternativo,
--importetotalalt,          
)
values (p_iddocumento,v_allrecreenvasado,
--?preciocontable,
--?importecontable,
v_allrecreenvasado.cantidad,
p_cronologia,
--?existenciaactual,
--?preciopromedio,
--?importetotal,
'+'
--?precioalternativo,
--?preciopromalt,
--?importealternativo,
--?importetotalalt,          
) returning idmovimiento into v_idmovimientodestino;   */      
 

 /* for v_reclote in select dl.idlote as idloteold, dl.numero,dl.estado,dl.fechavencimiento as vencimiento, dlr1.cantorigen as cantidad,dld.idlote
    from mod_logistica.dat_lote dl inner join mod_logfarmacia.dat_lotereenvase dlr1 on dlr1.idlotereenvase = dl.idlote
    inner join mod_logfarmacia.dat_prodreenvase dpr1 on dpr1.idprodreenvase = dlr1.idprodreenvase
    left join mod_logistica.dat_lote dld on (dl.numero = dld.numero and dl.fechavencimiento = dld.fechavencimiento
     and dld.idproducto = v_idproducto)
    where dl.idproducto = v_allrec.idproducto and dpr1.idreenvase = p_iddocumento
    loop
    if v_reclote.idlote is null then
    insert into mod_logistica.dat_lote(idproducto,numero,fechavencimiento,estado,cronologia, existencia, disponible)
        values (v_idproducto, v_reclote.numero, v_reclote.vencimiento,v_reclote.estado,1,v_reclote.cantidad,v_reclote.cantidad) returning idlote into v_idlote;
    else
        update mod_logistica.dat_lote set existencia = existencia + v_reclote.cantidad, disponible = disponible + v_reclote.cantidad
        where idlote = v_reclote.idlote;
        v_idlote:= v_reclote.idlote;
    end if;
    
    UPDATE mod_logubicacion.dat_ubicacionlote 
      SET cantidad = cantidad - v_reclote.cantidad
    WHERE idlote = v_reclote.idloteold;
    
    if (select u.idubicacionlote from mod_logubicacion.dat_ubicacionlote u
         where u.idlote = v_idlote) is null then
         INSERT INTO  mod_logubicacion.dat_ubicacionlote(idubicacion,idlote,cantidad)
			VALUES (-1,v_idlote,0);
    end if;
	
    if (select u.idarealote from mod_logubicacion.dat_arealote u
         where u.idlote = v_idlote) is null then
         INSERT INTO  mod_logubicacion.dat_arealote(idarea,idlote,disponible)
			VALUES (-1,v_idlote,0);
    end if;
    
    UPDATE mod_logubicacion.dat_ubicacionlote 
      SET cantidad = cantidad + v_reclote.cantidad
    WHERE idlote = v_idlote;
    
    INSERT INTO 
      mod_logistica.dat_movlote(idlote,idmovimiento,cantidad)
        VALUES (v_idlote,v_idmovimiento,v_reclote.cantidad);
        
    INSERT INTO 
      mod_logistica.dat_movlote(idlote,idmovimiento,cantidad)
        VALUES (v_reclote.idloteold,v_idmovimientold,v_reclote.cantidad);
        
    update mod_logistica.dat_lote set existencia = existencia - v_reclote.cantidad,
        disponible = disponible - v_reclote.cantidad where idlote = v_reclote.idloteold; */
 -- end loop; 
end loop;
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_aprobartransfinterna_old (OID = 1776175) : 
--
CREATE FUNCTION mod_logfarmacia.f_aprobartransfinterna_old (
  p_iddocumento numeric,
  p_cronologia numeric = 1
)
RETURNS void
AS 
$body$
declare
v_allrec record;
v_recdata record;
v_reclote record;
v_idproducto numeric;
v_idlote numeric;
v_idmovimiento numeric;
v_idmovimientold numeric;
begin
select ti.iddeposorigen as origen, ti.iddeposdestino as destino into v_recdata from mod_logfarmacia.dat_transfinterna ti where ti.idtransfinterna = p_iddocumento;
   
for v_allrec in select pti.idproducto, p.idproducto as proddestino, po.precio, sum(til.cantpasar) as cantidad
from  mod_logfarmacia.dat_prodtransfinterna pti
inner join mod_logfarmacia.dat_transfinternalote til on til.idproducto = pti.idproducto and til.idtransfinterna = pti.idtransfinterna
inner join mod_logistica.dat_producto po on po.idproducto = pti.idproducto
left join mod_logistica.dat_producto p on p.idproducto = pti.idproducto and p.idestructura = v_recdata.destino
where pti.idtransfinterna = p_iddocumento
group by  pti.idproducto, p.idproducto, po.precio
loop

if v_allrec.proddestino is null then
  insert into mod_logistica.dat_producto(idestructura,idcategoria,idumedida,idindicador,idclasificacioncontable,cronologia,precio,cantidad,disponible,minimo,maximo,
  factorbase,importe,idestructuracomun,fechafabricacion,fechavencimiento,precioalternativo,importealternativo,propiedad,idmarca,idmodelo,esbaja)
  select v_recdata.destino,idcategoria,idumedida,idindicador,idclasificacioncontable,p_cronologia,precio, 0, 0,minimo,maximo,factorbase,
  0,idestructuracomun,fechafabricacion,fechavencimiento,precioalternativo,0,propiedad,idmarca,idmodelo,
  esbaja
  from mod_logistica.dat_producto where idproducto = v_allrec.idproducto returning idproducto into v_idproducto;
else

 update mod_logistica.dat_producto set              
  cantidad = v_allrec.cantidad + cantidad,
  disponible = v_allrec.cantidad + disponible,             
  importe = (v_allrec.cantidad + cantidad) * precio,             
  importealternativo = (v_allrec.cantidad + cantidad) * precioalternativo          
  where idproducto = v_allrec.proddestino;
  v_idproducto:= v_allrec.proddestino;
end if;
       
update mod_logistica.dat_producto set cantidad = cantidad - v_allrec.cantidad,
disponible = disponible - v_allrec.cantidad,
importe = (cantidad - v_allrec.cantidad) * precio,
importealternativo = (cantidad - v_allrec.cantidad) * precioalternativo
where idproducto = v_allrec.idproducto;

insert into mod_logistica.dat_movimiento(iddocumento,idproducto,         
preciocontable,
importecontable,
cantidad,
cronologia,         
--existenciaactual,
--preciopromedio,
--importetotal,
signo
--precioalternativo,
--preciopromalt,
--importealternativo,
--importetotalalt,         
)
values (p_iddocumento,v_idproducto,
v_allrec.precio,
v_allrec.precio * v_allrec.cantidad,
v_allrec.cantidad,
p_cronologia,
--?existenciaactual,
--?preciopromedio,
--?importetotal,
'+'
--?precioalternativo,
--?preciopromalt,
--?importealternativo,
--?importetotalalt,         
) returning idmovimiento into v_idmovimiento; 
       
insert into mod_logistica.dat_movimiento(iddocumento,idproducto,         
preciocontable,
importecontable,
cantidad,
cronologia,         
--existenciaactual,
--preciopromedio,
--importetotal,
signo
--precioalternativo,
--preciopromalt,
--importealternativo,
--importetotalalt,         
)
values (p_iddocumento,v_allrec.idproducto,
v_allrec.precio,
v_allrec.precio * v_allrec.cantidad,
v_allrec.cantidad,
p_cronologia,
--?existenciaactual,
--?preciopromedio,
--?importetotal,
'-'
--?precioalternativo,
--?preciopromalt,
--?importealternativo,
--?importetotalalt,         
) returning idmovimiento into v_idmovimientold; 

  for v_reclote in select dl.idlote as idloteold, dl.numero,dl.estado,dl.fechavencimiento as vencimiento, dtil.cantpasar as cantidad,dld.idlote
    from mod_logistica.dat_lote dl inner join mod_logfarmacia.dat_transfinternalote dtil using(idlote)
    left join mod_logistica.dat_lote dld on (dl.numero = dld.numero and dl.fechavencimiento = dld.fechavencimiento
     and dld.idproducto = v_idproducto)
    where dl.idproducto = v_allrec.idproducto and dtil.idtransfinterna = p_iddocumento
    loop
    if v_reclote.idlote is null then
        insert into mod_logistica.dat_lote(idproducto,numero,fechavencimiento,estado,cronologia, existencia, disponible)
        values (v_idproducto, v_reclote.numero, v_reclote.vencimiento,v_reclote.estado,1,0,0 /*v_reclote.cantidad,v_reclote.cantidad*/) returning idlote into v_idlote;
    else
        update mod_logistica.dat_lote set existencia = existencia + v_reclote.cantidad, disponible = disponible + v_reclote.cantidad
        where idlote = v_reclote.idlote;
        v_idlote:= v_reclote.idlote;
    end if;
   
    UPDATE mod_logubicacion.dat_ubicacionlote
      SET cantidad = cantidad - v_reclote.cantidad
    WHERE idlote = v_reclote.idloteold;
   
    if (select u.idubicacionlote from mod_logubicacion.dat_ubicacionlote u
         where u.idlote = v_idlote) is null then
         INSERT INTO  mod_logubicacion.dat_ubicacionlote(idubicacion,idlote,cantidad)
            VALUES (-1,v_idlote,0);
    end if;
   
    if (select u.idarealote from mod_logubicacion.dat_arealote u
         where u.idlote = v_idlote) is null then
         INSERT INTO  mod_logubicacion.dat_arealote(idarea,idlote,disponible)
            VALUES (-1,v_idlote,0);
    end if;
   
    UPDATE mod_logubicacion.dat_ubicacionlote
      SET cantidad = cantidad + v_reclote.cantidad
    WHERE idlote = v_idlote;
   
    INSERT INTO
      mod_logistica.dat_movlote(idlote,idmovimiento,cantidad)
        VALUES (v_idlote,v_idmovimiento,v_reclote.cantidad);
           
    INSERT INTO
      mod_logistica.dat_movlote(idlote,idmovimiento,cantidad)
        VALUES (v_reclote.idloteold,v_idmovimientold,v_reclote.cantidad);
       
   update mod_logistica.dat_lote set existencia = existencia - v_reclote.cantidad,
        disponible = disponible - v_reclote.cantidad where idlote = v_reclote.idloteold;
  end loop;
end loop;
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_coberturaproducto (OID = 1776181) : 
--
CREATE FUNCTION mod_logfarmacia.f_coberturaproducto (
  p_idestructura numeric
)
RETURNS SETOF td_coberturaproducto
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_coberturaproducto;

  BEGIN
    for v_rec in 
     
SELECT DISTINCT

c.descripcion as denominacion,
c.codigo as codigo,
u.abreviaturaunidadmedida as uemb,
lp.denominacion as lineaprod,
(

        select max(dp2.maximo)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where  dp2.idestructura in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

) as maximo,

cfgf.normabast as norma,

(
        select sum(dp2.cantidad)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.idestructura in (cfgf.idalmacen, cfgf.idareaventa)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

) as existencia


from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
inner join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod

where dp.idestructuracomun = $1 and dp.cronologia > 0
order by lp.denominacion

    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_cuadrobasico (OID = 1776182) : 
--
CREATE FUNCTION mod_logfarmacia.f_cuadrobasico (
  p_idanno numeric,
  p_activo numeric,
  p_idestructura numeric,
  p_idcodificador character varying,
  p_excluiridcodificador character varying,
  p_idcuadrobasico character varying,
  p_excluiridcuadrobasico character varying,
  p_criterio character varying,
  p_codigo character varying,
  p_denominacion character varying,
  p_idtipocuadrobasico character varying,
  p_denomproveedor character varying,
  p_idviaadquicicion character varying,
  p_idclasificacionven character varying,
  p_prioridad character varying,
  p_tienecertificado character varying,
  p_denomforma character varying,
  p_idtipodispensacion character varying,
  p_idgrupofarmacologico numeric,
  p_start numeric,
  p_limit numeric,
  p_estructurahija numeric
)
RETURNS SETOF td_cuadrobasico
AS 
$body$
declare
all_rec mod_logfarmacia.td_cuadrobasico;
v_sql varchar = '';
v_cond varchar = ' where 0 = 0 ';
v_limit varchar = '';
v_join varchar = '';
v_orderby varchar = '';
begin

v_sql = $$SELECT
dc.codigo as codigo,

dc.descripcion as denominacion,

(case
when cb.idtipocuadrobasico = 1 then 'Medicamentos'
when cb.idtipocuadrobasico = 2 then 'Productos naturales (Medicina Natural Tradicional)'
when cb.idtipocuadrobasico = 3 then 'Efectos médicos'
when cb.idtipocuadrobasico = 4 then 'Reactivos'
else null
end) as tipocuadrobasico,

ncp.nombre as proveedor,

(select array_to_string(array (select gf.denominacion  from mod_logfarmacia.nom_grupofm gf
where gf.idgrupofm in(select  cast(unnest(string_to_array(subcb.idgrupofarmacologico, ',')) as numeric)
from mod_logfarmacia.conf_cuadrobasico subcb
where subcb.idcuadrobasico = cb.idcuadrobasico)), ', ')
) as grupofarmacologico, 

(case
when cb.idviaadquicicion = 1 then 'Importado'
when cb.idviaadquicicion = 2 then 'Producción nacional'
when cb.idviaadquicicion = 3 then 'Producción local'
when cb.idviaadquicicion = 4 then 'Producción industrial'
else null
end) as viaadquisicion,

(case
when cb.idclasificacionven = 1 then 'Vitales'
when cb.idclasificacionven = 2 then 'Esenciales'
when cb.idclasificacionven = 3 then 'No esenciales'
when cb.idclasificacionven = 4 then 'Especiales'
else null
end)as clasificacionven,

cb.prioridad,

(case
when cb.idtipodispensacion = 1 then 'Receta médica'
when cb.idtipodispensacion = 2 then 'Venta Liberada'
when cb.idtipodispensacion = 3 then 'Tarjeta control'
when cb.idtipodispensacion = 4 then 'Fórmula'
when cb.idtipodispensacion = 5 then 'Usufructo'
when cb.idtipodispensacion = 6 then 'Retrovirales'
when cb.idtipodispensacion = 7 then 'Pedido'
else null
end) as tipodispensacion

FROM mod_logfarmacia.conf_cuadrobasico cb
LEFT JOIN mod_datosmaestros.dat_codificador dc ON cb.idcodificador = dc.idcodificador
LEFT JOIN mod_logfarmacia.nom_forma ff ON dc.idforma = ff.idforma
INNER JOIN mod_logfarmacia.conf_anno ca ON cb.idanno = ca.idanno
LEFT JOIN mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = idproveedor

 $$;
if $22 is not null then v_sql = v_sql || ' 
					 INNER JOIN mod_estructuracomp.dat_estructura st ON cb.idestructura = st.idestructura
                     INNER JOIN mod_estructuracomp.nom_concepto nc ON st.idconcepto = nc.idconcepto
                     INNER JOIN mod_logfarmacia.conf_tipoentidadasociada tea ON st.idorgano = tea.idtipoentidad
                     INNER JOIN mod_logfarmacia.dat_unidadsaluddispensacion usd
                        ON (tea.idtipounidadsalud = usd.idtipounidadsalud and cb.idpadre = usd.idcuadrobasico) ';end if;

if $1 is not null then v_cond = v_cond || ' and cb.idanno = ' || $1;end if;
if $2 is not null then v_cond = v_cond || ' and cb.activo = 1 ';end if;
if $3 is not null then v_cond = v_cond || ' and cb.idestructura = ' || $3;end if;
if $4 is not null then v_cond = v_cond || ' and dc.idcodificador = any(cast( ' || $$'$$ || $4 || $$'$$  ||' as numeric[])) ';end if;
if $5 is not null then v_cond = v_cond || ' and dc.idcodificador <> all(cast( ' || $$'$$ || $4 || $$'$$  ||' as numeric[])) ';end if;
if $6 is not null then v_cond = v_cond || ' and dc.idcuadrobasico = any(cast( ' || $$'$$ || $6 || $$'$$  ||' as numeric[])) ';end if;
if $7 is not null then v_cond = v_cond || ' and dc.idcuadrobasico <> all(cast( ' || $$'$$ || $7 || $$'$$  ||' as numeric[])) ';end if;
if $8 is not null then v_cond = v_cond || ' dc.codigo ilike ' || $$ '%$$ || $8 || $$%'$$ || 'OR dc.descripcion ilike ' ||$$'%$$||$8||$$%'$$;end if;
if $9 is not null then v_cond = v_cond || ' dc.codigo ilike ' || $$ '%$$ || $8 || $$%'$$;end if;
if $10 is not null then v_cond = v_cond || ' dc.descripcion ilike ' || $$ '%$$ || $10 || $$%'$$;end if;
if $11 is not null then v_cond = v_cond || ' and cb.idtipocuadrobasico = any(cast( ' || $$'$$ || $11 || $$'$$  ||' as numeric[])) ';end if;
if $12 is not null then v_cond = v_cond || ' ncp.nombre ilike ' || $$ '%$$ || $12 || $$%'$$;end if;
if $13 is not null then v_cond = v_cond || ' and cb.idviaadquicicion = any(cast( ' || $$'$$ || $13 || $$'$$  ||' as numeric[])) ';end if;
if $14 is not null then v_cond = v_cond || ' and cb.idclasificacionven = any(cast( ' || $$'$$ || $14 || $$'$$  ||' as numeric[])) ';end if;
if $15 is not null then v_cond = v_cond || ' and cb.prioridad = any(cast( ' || $$'$$ || $15 || $$'$$  ||' as numeric[])) ';end if;
if $16 is not null then v_cond = v_cond || ' and cb.tienecertificado = any(cast( ' || $$'$$ || $16 || $$'$$  ||' as numeric[])) ';end if;
if $17 is not null then v_cond = v_cond || ' ff.denominacion ilike ' || $$ '%$$ || $17 || $$%'$$;end if;
if $18 is not null then v_cond = v_cond || ' usd.idtipodispensacion = any(cast( ' || $$'$$ || $18 || $$'$$  ||' as numeric[])) ';end if;
if $19 is not null then v_cond = v_cond || ' and ' || $19 || ' in (select  cast(unnest(string_to_array(subcb.idgrupofarmacologico, ',')) 
                as numeric) FROM mod_logfarmacia.conf_cuadrobasico subcb 
                WHERE subcb.idcuadrobasico = cb.idcuadrobasico) ';end if;
                
if $20 is not null then v_limit = v_limit || ' offset = ' || $20;end if;
if $21 is not null then v_limit = v_limit || ' limit = ' || $21;end if;

v_orderby = ' order by dc.descripcion asc ';

v_sql = v_sql || v_cond || v_orderby || v_limit ;
for all_rec in EXECUTE v_sql




loop
return next all_rec;
end loop;
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_eliminarnodo (OID = 1776184) : 
--
CREATE FUNCTION mod_logfarmacia.f_eliminarnodo (
)
RETURNS trigger
AS 
$body$
DECLARE

ancho BIGINT;

BEGIN

SET search_path = mod_logfarmacia;

ancho:= old.ordender - old.ordenizq + 1;

UPDATE nom_forma SET ordenizq = ordenizq - ancho WHERE ordenizq > old.ordender and idarbol = old.idarbol;

UPDATE nom_forma SET ordender = ordender - ancho WHERE ordender > old.ordender and idarbol = old.idarbol;

RETURN old;

END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_eliminarnodogrupofm (OID = 1776185) : 
--
CREATE FUNCTION mod_logfarmacia.f_eliminarnodogrupofm (
)
RETURNS trigger
AS 
$body$
DECLARE

ancho BIGINT;

BEGIN

SET search_path = mod_logfarmacia;

ancho:= old.ordender - old.ordenizq + 1;

UPDATE nom_grupofm SET ordenizq = ordenizq - ancho WHERE ordenizq > old.ordender and idarbol = old.idarbol;

UPDATE nom_grupofm SET ordender = ordender - ancho WHERE ordender > old.ordender and idarbol = old.idarbol;

RETURN old;

END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_importarpreciosproducto (OID = 1776186) : 
--
CREATE FUNCTION mod_logfarmacia.f_importarpreciosproducto (
  p_idanno numeric,
  p_idestructura numeric
)
RETURNS void
AS 
$body$
DECLARE
  v_rec record;
  v_ind record;
  v_idnaturaleza numeric;
  v_cod numeric;
  v_idpais numeric;
  v_idindicador numeric;
  v_idcodificador numeric;
  v_idgrupo numeric;
  v_cuadobm record;
  v_clasificacion numeric;
  v_cliente numeric;
  v_viaadquisicion numeric;
  v_certificado numeric;
  v_tipounidadsalud numeric=0;
  v_tipodispensacion numeric=1;
  v_idcuadrob numeric;
  v_idunidadsaluddispensacion numeric;
  v_recp numeric;
BEGIN
  UPDATE 
    mod_logfarmacia.dat_productosimportar 
  SET 
  descripcion = replace(descripcion, ' ', ''),
  denominacion = replace(denominacion, ' ', '');
      
  UPDATE 
    mod_logfarmacia.dat_productosimportar 
  SET 
    descripcion = ltrim(descripcion),
    denominacion = ltrim(denominacion);
  
  
    --v_cod = 3520000001;
    --v_idcuadrob = 1000000001;
    select i.* into v_ind from mod_datosmaestros.nom_indicador i where i.codigo = '352';
    
    select max(i.codigo)::numeric into v_cod from mod_datosmaestros.nom_indicador i;
    
    
	for v_rec in (select distinct cod.idcodificador,cod.codigo,pp.codigo as codigonew,cod.descripcion,pp.pesounidad,
    			  i.idindicador,nc.idclientesproveedores as idcliente,pp.descripcion as descipcionnew,pp.temperatura,
    			  pp.denominacion as denominacionnew,pp.ppob as precio,pp.procedencia,pp.procedencia as lab,
                  (SELECT idcuadrobasico FROM mod_logfarmacia.conf_cuadrobasico where idanno = p_idanno and idcodificador = cod.idcodificador)
                  from mod_logfarmacia.dat_productosimportar pp
                  left join mod_datosmaestros.dat_codificador cod on pp.codigo = cod.codigo
                  left join mod_datosmaestros.nom_indicador i on i.idindicador = cod.idindicador
                  left join mod_datosmaestros.nom_clientesproveedor nc on upper(nc.nombre) = upper(pp.procedencia)
                  /*limit 105*/) loop 

    if v_rec.procedencia = 'IMPORTADO' then
    	v_idpais := null;
        else
        v_idpais = v_ind.idpais;
    end if;
    
    IF v_rec.idindicador is null then 
      v_cod = v_cod + 1;
      INSERT INTO mod_datosmaestros.nom_indicador(idpadre, idarbol, idpais, idumedida, 
              idformato, idnaturaleza, idtabla, idtablageneral, codigo, 
              denominacion, estado, nivel, idespecialidad, tipo,fechainicio, activo,precio)
      VALUES (v_ind.idpadre, v_ind.idarbol, v_idpais, v_ind.idumedida, 
              v_ind.idformato, v_ind.idnaturaleza, v_ind.idtabla, v_ind.idtablageneral, v_cod, 
              upper(v_rec.descipcionnew), 1, 2, -1, v_ind.tipo,now(), 1, 0)
      returning idindicador into v_idindicador;
      
      INSERT INTO mod_datosmaestros.nom_indicadorhoja
        (idindicador, tipocontrol) 
      VALUES 
        (v_idindicador, 2);  
                  
      INSERT INTO mod_datosmaestros.dat_codificador
      	(idindicador,idpais,idumedida,peso,temperatura,descripcion,codigo,descripcionventa)
      VALUES (v_idindicador,v_idpais,v_ind.idumedida,v_rec.pesounidad,v_rec.temperatura,
      		upper(v_rec.denominacionnew),v_rec.codigonew,substr(v_rec.denominacionnew,0,30))
      returning idcodificador into v_idcodificador;
      
      UPDATE 
        mod_logfarmacia.dat_productosimportar 
      SET 
        nuevomodificado = 1
      WHERE 
      	codigo = v_rec.codigonew;
    
    else 
    	v_idcodificador = v_rec.idcodificador;
        v_idindicador = v_rec.idindicador;
    	UPDATE 
          mod_datosmaestros.nom_indicador 
        SET 
          denominacion = upper(v_rec.descipcionnew)
        WHERE 
          idindicador = v_idindicador;
          
        UPDATE 
          mod_datosmaestros.dat_codificador 
        SET 
          peso = v_rec.pesounidad,
          temperatura = v_rec.temperatura,
          descripcion = upper(v_rec.denominacionnew),
          descripcionventa = substr(upper(v_rec.denominacionnew),0,30)
        WHERE 
          idcodificador = v_idcodificador;  
      
        UPDATE 
          mod_logfarmacia.dat_productosimportar 
        SET 
          nuevomodificado = 0
        WHERE 
          codigo = v_rec.codigonew;     
    end if;
        
    --select max(idindicador) into v_idindicador from mod_datosmaestros.nom_indicador; 

    
    --INSERT INTO mod_datosmaestros.dat_codificador
    --(idindicador,idpais,idumedida,peso,temperatura,descripcion,codigo)
    --VALUES (v_idindicador,v_idpais,v_ind.idumedida,v_rec.pesounidad,v_rec.temperatura,v_rec.descripcion,v_rec.codigo);
    
    --select max(idcodificador) into v_idcodificador from mod_datosmaestros.dat_codificador;
	--select * into v_cuadobm from mod_migracion.cuadrobm where codigo = v_rec.codigo; 
    
    --if v_cuadobm.codigo <> '' then 
      
    /*  select idgrupofm into v_idgrupo from mod_logfarmacia.nom_grupofm 
      where codigo = v_rec.sgf;--me falta buscar cuando tiene mas de un subgrupo
		--raise notice ''v_cliente %'',v_cuadobm;   
      --[1, 'Vitales'],
      --[2, 'Esenciales'],
      --[3, 'No esenciales'],
      --[4, 'Especiales']
      if v_rec.ven = 'V' then v_clasificacion = 1;
      else if v_rec.ven = 'E' then v_clasificacion = 2;
      else if v_rec.ven = 'NE' then v_clasificacion = 3;
      else if v_rec.ven = 'ESP' then v_clasificacion = 4;
      else v_clasificacion = null; end if;end if;end if;
      
      if v_rec.i = 1 then v_viaadquisicion = 1;
      else if v_rec.pn = 1 then v_viaadquisicion = 2;
      else v_viaadquisicion = null; end IF;
      end if;end if;
      
      --me falta buscar cuando tiene mas de un proveedor
      
      if v_rec.tc = '1' then v_certificado = 1;
      else if v_rec.cme = '1' then v_certificado = 2;
      else v_certificado = '3'; end if;end if;
      
      if v_rec.uei = '1' then v_tipounidadsalud = 1;
      else v_tipounidadsalud = 0; end if;
      
      if v_certificado = 1 or v_certificado = 2 then v_tipodispensacion = 3;
      else v_tipodispensacion = 1; end if;
      
      if v_rec.idtipocuadrobasico = 2 then
      	v_tipodispensacion = 2;
      end if;*/
    
      if v_rec.idcuadrobasico is null then
        INSERT INTO mod_logfarmacia.conf_cuadrobasico
        (idcodificador,idtipocuadrobasico,idgrupofarmacologico,idclasificacionven,idproveedor,
          idviaadquicicion,prioridad,tienecertificado,idanno,idestructura,precioventa)
        VALUES (v_idcodificador, 1, v_idgrupo,v_clasificacion,v_rec.idcliente,v_viaadquisicion,v_recp,
        v_certificado,p_idanno,p_idestructura/*100000540*/,v_rec.precio) returning idcuadrobasico into v_idcuadrob;
        v_idunidadsaluddispensacion = null;
      else
        UPDATE mod_logfarmacia.conf_cuadrobasico 
        SET 
          --idgrupofarmacologico = v_idgrupo,
          --idclasificacionven = v_clasificacion,
          idproveedor = v_cliente,
          --idviaadquicicion = v_viaadquisicion,
          --prioridad = v_recp,
          --tienecertificado = v_certificado,
          precioventa = v_rec.precio
        WHERE 
          idcuadrobasico = v_rec.idcuadrobasico; 
          
          v_idcuadrob = v_rec.idcuadrobasico; 
          
          SELECT 
            idunidadsaluddispensacion into v_idunidadsaluddispensacion
          FROM 
            mod_logfarmacia.dat_unidadsaluddispensacion 
          where idcuadrobasico = v_idcuadrob;
          
      end if;
      
      if v_idunidadsaluddispensacion is null then
      
        INSERT INTO mod_logfarmacia.dat_unidadsaluddispensacion
        (idtipounidadsalud,idtipodispensacion,idcuadrobasico)
        VALUES (v_tipounidadsalud,v_tipodispensacion,v_idcuadrob);
      
      else
        UPDATE mod_logfarmacia.dat_unidadsaluddispensacion 
        SET 
          idtipounidadsalud = v_tipounidadsalud,
          idtipodispensacion = v_tipodispensacion,
          idcuadrobasico = v_rec.idcuadrobasico
        WHERE 
          idunidadsaluddispensacion = v_idunidadsaluddispensacion;
          
      end if;


      /*else 
      	INSERT INTO  mod_migracion.noinsertados(codigo)
		VALUES (v_rec.codigo);
    end if;*/
    
    end loop;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_insertarnodo (OID = 1776188) : 
--
CREATE FUNCTION mod_logfarmacia.f_insertarnodo (
)
RETURNS trigger
AS 
$body$
DECLARE
v_padre record;
v_derecha bigint;
BEGIN
set search_path = mod_logfarmacia;
if new.idpadre is null then
new.idpadre:= new.idgrupofm;
new.idarbol:= new.idgrupofm;
end if;   

if new.idgrupofm != new.idpadre then
select n.idgrupofm, n.idarbol, n.idpadre, n.ordenizq, n.ordender into v_padre
from nom_grupofm n
where n.idgrupofm = new.idpadre;
new.idarbol:= v_padre.idarbol;
v_derecha:= v_padre.ordender;
update nom_grupofm set ordender = ordender + 2 where ordender >= v_derecha and new.idarbol = idarbol;
update nom_grupofm set ordenizq = ordenizq + 2 where ordenizq > v_derecha and new.idarbol = idarbol;
new.ordenizq := v_derecha;
new.ordender := v_derecha + 1;


else

v_derecha :=  max(ordender) from nom_grupofm where idarbol = new.idarbol;
if v_derecha is not null then
new.ordenizq := v_derecha + 1;
new.ordender := v_derecha + 2;
else
new.ordenizq := 1;
new.ordender := 2;
end if;	
end if;
return new;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_insertarnodoforma (OID = 1776189) : 
--
CREATE FUNCTION mod_logfarmacia.f_insertarnodoforma (
)
RETURNS trigger
AS 
$body$
DECLARE
v_padre record;
v_derecha bigint;
BEGIN
set search_path = mod_logfarmacia;
if new.idpadre is null then
new.idpadre:= new.idforma;
new.idarbol:= new.idforma;
end if;   

if new.idforma != new.idpadre then
select n.idforma, n.idarbol, n.idpadre, n.ordenizq, n.ordender into v_padre
from nom_forma n
where n.idforma = new.idpadre;
new.idarbol:= v_padre.idarbol;
v_derecha:= v_padre.ordender;
update nom_forma set ordender = ordender + 2 where ordender >= v_derecha and new.idarbol = idarbol;
update nom_forma set ordenizq = ordenizq + 2 where ordenizq > v_derecha and new.idarbol = idarbol;
new.ordenizq := v_derecha;
new.ordender := v_derecha + 1;


else

v_derecha :=  max(ordender) from nom_forma where idarbol = new.idarbol;
if v_derecha is not null then
new.ordenizq := v_derecha + 1;
new.ordender := v_derecha + 2;
else
new.ordenizq := 1;
new.ordender := 2;
end if;	
end if;
return new;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_insertarnodogrupofm (OID = 1776190) : 
--
CREATE FUNCTION mod_logfarmacia.f_insertarnodogrupofm (
)
RETURNS trigger
AS 
$body$
DECLARE
v_padre record;
v_derecha bigint;
BEGIN
set search_path = mod_logfarmacia;
if new.idpadre is null then
new.idpadre:= new.idgrupofm;
new.idarbol:= new.idgrupofm;
end if;   

if new.idgrupofm != new.idpadre then
select n.idgrupofm, n.idarbol, n.idpadre, n.ordenizq, n.ordender into v_padre
from nom_grupofm n
where n.idgrupofm = new.idpadre;
new.idarbol:= v_padre.idarbol;
v_derecha:= v_padre.ordender;
update nom_grupofm set ordender = ordender + 2 where ordender >= v_derecha and new.idarbol = idarbol;
update nom_grupofm set ordenizq = ordenizq + 2 where ordenizq > v_derecha and new.idarbol = idarbol;
new.ordenizq := v_derecha;
new.ordender := v_derecha + 1;


else

v_derecha :=  max(ordender) from nom_grupofm where idarbol = new.idarbol;
if v_derecha is not null then
new.ordenizq := v_derecha + 1;
new.ordender := v_derecha + 2;
else
new.ordenizq := 1;
new.ordender := 2;
end if;	
end if;
return new;
END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_listadodisponibilidadprod (OID = 1776191) : 
--
CREATE FUNCTION mod_logfarmacia.f_listadodisponibilidadprod (
  p_idestructura numeric,
  p_tipo numeric,
  p_criterio character varying,
  p_deposito numeric,
  p_precioventalt double precision,
  p_precioventagt double precision,
  p_precioventaeq double precision,
  p_preciocostolt double precision,
  p_preciocostogt double precision,
  p_preciocostoeq double precision,
  p_importecostolt double precision,
  p_importecostogt double precision,
  p_importecostoeq double precision,
  p_importeventalt double precision,
  p_importeventagt double precision,
  p_importeventaeq double precision,
  p_cantidadlt double precision,
  p_cantidadgt double precision,
  p_cantidadeq double precision
)
RETURNS SETOF td_listadodisponibilidadprod
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_listadodisponibilidadprod;
  v_sql varchar = '';
  v_select varchar = '';
  v_from varchar = '';
  v_group varchar = '';
  v_where varchar = '';
  
  

  BEGIN
  v_select = 'SELECT DISTINCT
c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
eo.denominacion as arearesp,
lp.denominacion as lineaprod,
sqc.cantidad as cantidad,
(

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0 
        and eo2.idestructuraop in (cfgf.idalmacen) 
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

) as preciocosto,
(COALESCE((

        select dp2.precioventa as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0 
        and eo2.idestructuraop in (cfgf.idareaventa) 
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

), dp.precioventa)) as precioventa 
';
v_from = ' from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
inner join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod
inner join (

        select sum(dp2.cantidad) as cantidad, c2.idcodificador,lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
        

        where dp2.cronologia > 0         
        and dp2.idestructura in (cfgf.idalmacen, cfgf.idareaventa)
       
        group by c2.idcodificador,lp2.idlineaprod

) sqc on sqc.idcodificador = c.idcodificador and sqc.idlineaprod = lp.idlineaprod

';
v_where = 'Where dp.idestructura in (cfgf.idalmacen, cfgf.idareaventa) and dp.idestructuracomun = '||$1;

if $3 is not null then v_where = v_where || ' and lp.denominacion ilike ' || $$'%$$ || $3 || $$%' $$; end if;

if $4 is not null then v_where = v_where || ' and dp.idestructura = ' ||$4; end if;
if $5 is not null then v_where = v_where || ' and (COALESCE((

        select dp2.precioventa as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

        ), dp.precioventa)) <' ||$5; 
        
 end if;
 if $6 is not null then v_where = v_where || ' and (COALESCE((

        select dp2.precioventa as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

        ), dp.precioventa)) >' ||$6; 
        
 end if;
 
 if $7 is not null then v_where = v_where || ' and (COALESCE((

        select dp2.precioventa as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

        ), dp.precioventa)) =' ||$7; 
        
 end if;
 if $8 is not null then v_where = v_where || ' and (

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

            ) <' ||$8; 
        
 end if;
 if $9 is not null then v_where = v_where || ' and (

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

            ) >' ||$9; 
        
 end if;
 if $10 is not null then v_where = v_where || ' and (

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

            ) =' ||$10; 
        
 end if;
 
 if $11 is not null then v_where = v_where || ' and (sqc.cantidad *
                
                (

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

            )) <' ||$11; 
        
 end if;
 
 if $12 is not null then v_where = v_where || ' and (sqc.cantidad *
                
                (

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

            )) >' ||$12; 
        
 end if;
 
 if $13 is not null then v_where = v_where || ' and (sqc.cantidad *
                
                (

        select dp2.precio as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

            )) =' ||$13; 
        
 end if;
 
  if $14 is not null then v_where = v_where || ' and (sqc.cantidad *
                
                (COALESCE((

        select dp2.precioventa as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod
 
        ), dp.precioventa))) <' ||$14; 
        
 end if;
   if $15 is not null then v_where = v_where || ' and (sqc.cantidad *
                
                (COALESCE((

        select dp2.precioventa as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

        ), dp.precioventa))) >' ||$15; 
        
 end if;
 
   if $16 is not null then v_where = v_where || ' and (sqc.cantidad *
                
                (COALESCE((

        select dp2.precioventa as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = '||$1||'
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

        ), dp.precioventa))) =' ||$16; 
        
 end if;
 
 if $17 is not null then v_where = v_where || ' and  sqc.cantidad <' ||$17; 
        
 end if;
   if $18 is not null then v_where = v_where || ' and  sqc.cantidad >' ||$18; 
        
 end if;
 
   if $19 is not null then v_where = v_where || ' and  sqc.cantidad =' ||$19; 
  end if;

v_group =' GROUP BY c.idcodificador,c.codigo,c.descripcion,u.abreviaturaunidadmedida,eo.denominacion,lp.denominacion,sqc.cantidad,dp.precioventa,lp.idlineaprod'; 
  if $2 = 2 then 
  v_select = v_select || ' ,l.numero as lote, l.existencia as cantidadlote ';
  v_from = v_from || ' inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto '; 
  v_group = v_group || ',l.numero,l.existencia ';
  end if;
  v_sql = v_select || v_from || v_where || v_group || ' 

order by eo.denominacion, lp.denominacion, c.descripcion';


    for v_rec in execute v_sql
     


    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_listadotarjetamedicamento (OID = 1776193) : 
--
CREATE FUNCTION mod_logfarmacia.f_listadotarjetamedicamento (
  p_idestructura numeric
)
RETURNS SETOF td_listadotarjetamedicamento
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_listadotarjetamedicamento;

  BEGIN
    for v_rec in 
     
SELECT DISTINCT
COALESCE(d.nrodoc,d.numeroref) as nrodc,
btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)) as paciente,
case when d.estado = 1 then 'Elaboración'
     when d.estado = 2 then 'Preparado'
     when d.estado = 3 then 'Aprobado'
     when d.estado = 4 then 'Contabilizado'
     when d.estado = 5 then 'Eliminado'
     when d.estado = 6 then 'Anulado'
     when d.estado = 7 then 'Cancelado'
     when d.estado = 8 then 'Cancelado-Duplicado'
     when d.estado = 9 then 'Cerrado'
     when d.estado = 10 then 'Propuesto a cancelar'
     when d.estado = 11 then 'Revisado'
     when d.estado = 12 then 'Conciliado'
     when d.estado = 13 then 'Pre-elaborado'
     when d.estado = 14 then 'Aprobado con prórroga'
     when d.estado = 15 then 'Prorrogar'
     else 'Sin Estado'
end as estado,
(Select count(pp.idproductotarjetamedicamento)
 FROM mod_logfarmacia.dat_productotarjetamedicamento pp
  WHERE pp.idtarjetamedicamento = tm.idtarjetamedicamento ) as cantidadproductos,
   su.nombreusuario as creadopor,
d.fechacontable,
 sua.nombreusuario as aprobadopor,
 d.numeroref,
 d.nrodoc
 FROM mod_logfarmacia.dat_tarjetamedicamento tm
                 INNER JOIN mod_logistica.dat_documento d ON tm.idtarjetamedicamento = d.iddocumento
                 INNER JOIN mod_persona.dat_persona dp ON tm.idpaciente = dp.idpersona
                 LEFT JOIN mod_persona.dat_docidentidad di ON (di.idpersona = dp.idpersona and di.principal =1)
                 LEFT JOIN mod_personaext.dat_areaatencionmedica daa ON daa.idpersona = dp.idpersona
                 LEFT JOIN mod_persona.dat_direccion dir ON dir.idpersona = dp.idpersona
                 LEFT JOIN mod_seguridad.seg_usuario su ON d.idusuario = su.idusuario
                 LEFT JOIN mod_seguridad.seg_usuario sua ON d.aprobadopor = sua.idusuario
                  WHERE (d.idestructuracomun =  $1)  AND d.estado not in (7,5,6,8) ORDER BY d.nrodoc, d.numeroref DESC

    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_listartranferenciainterna (OID = 1776194) : 
--
CREATE FUNCTION mod_logfarmacia.f_listartranferenciainterna (
  p_idestructuraop numeric,
  p_estado numeric,
  p_contabilizadopor numeric,
  p_creadopor numeric,
  p_fechainicio date,
  p_fechafin date,
  p_areaorigen numeric,
  p_areadestino numeric,
  p_tipotranferencia numeric,
  p_idestructura numeric
)
RETURNS SETOF td_listartranferenciainterna
AS 
$body$
declare
all_rec mod_logfarmacia.td_listartranferenciainterna;
begin
for all_rec in
select
d.nrodoc,
d.numeroref,
d.fechacontable,
case
when d.estado = 1 then 'Elaboración'
when d.estado = 2 then 'Preparado'
when d.estado = 3 then 'Aprobado'
else null
end as estado,
-- tm.*, 
su.nombreusuario as creadopor,
sua.nombreusuario as aprobadopor,
op.denominacion as areaorigen,
opp.denominacion as areadestino,
tt.denominacion as tipotransferencia,
cc.denominacion as conceretenido,
mot.denominacion as denommotivo,
(select count(p.idtransfinterna)
FROM mod_logfarmacia.dat_prodtransfinterna p
where p.idtransfinterna = d.iddocumento) as cantproductos,
de.denominacion as entidad,
i.urllogo
FROM mod_logfarmacia.dat_transfinterna tm
INNER JOIN mod_logistica.dat_documento d ON tm.idtransfinterna =   d.iddocumento
LEFT JOIN mod_logfarmacia.nom_tipotransfinterna tt on  tt.idtipotransfinterna = tm.idtipotransfinterna
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = d.iddoc
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos 
LEFT JOIN mod_logfarmacia.nom_conceptorete cc on cc.idconceptorete =  tm.idconcepretenido
LEFT JOIN mod_estructuracomp.nom_filaestruc f on f.idfila =  tm.iddeposorigen
LEFT JOIN mod_estructuracomp.nom_filaestruc ff on ff.idfila = tm.iddeposdestino
LEFT JOIN mod_estructuracomp.dat_estructuraop op on op.idestructuraop =   f.idfila
LEFT JOIN mod_estructuracomp.dat_estructuraop opp on opp.idestructuraop =   ff.idfila
LEFT JOIN mod_seguridad.seg_usuario su ON d.idusuario = su.idusuario
LEFT JOIN mod_seguridad.seg_usuario sua ON d.aprobadopor = sua.idusuario
LEFT JOIN mod_logfarmacia.nom_motivodevolucion mot on mot.idmotivodevolucion = tm.idmotivodevolucion
inner join mod_estructuracomp.dat_estructura de on de.idestructura = p_idestructura
left join mod_logistica.conf_general i on i.idestructura = de.idestructura
WHERE  
ndp.abreviatura = 'transferenciainternaLog'
and (case when p_idestructura is not null then d.idestructuracomun = p_idestructura else true end)
and (case when p_estado is not null then d.estado = p_estado else d.estado in(1,2,3) end)
and (case when p_creadopor is not null then su.idusuario = p_creadopor else true end)
and (case when p_contabilizadopor is not null then sua.idusuario = p_contabilizadopor else true end)

and (case when p_fechainicio is not null then d.fechacontable >= p_fechainicio else true end)
and (case when p_fechafin is not null then d.fechacontable <= p_fechafin else true end)

and (case when p_areaorigen is not null then op.idestructuraop = p_areaorigen else true end)
and (case when p_areadestino is not null then opp.idestructuraop = p_areadestino else true end)
and (case when p_tipotranferencia is not null then tt.idtipotransfinterna = p_tipotranferencia else true end)
 
ORDER BY d.iddocumento DESC 


loop
return next all_rec;
end loop;
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modeloconsultaproductos (OID = 1776195) : 
--
CREATE FUNCTION mod_logfarmacia.f_modeloconsultaproductos (
  p_idestructura numeric
)
RETURNS SETOF td_modeloconsultaproductos
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_modeloconsultaproductos;

  BEGIN
    for v_rec in 
     
SELECT DISTINCT

c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
lp.denominacion as lineaprod,
spc.precio as preciocosto,
spv.precio as precioventa,
smax.cantidad as maximo,
smin.cantidad as minimo,
cfgf.fondofijo as porfondofijo,
sexist.cantidad as existencia,
sret.cantidad as retenidos





from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun

left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod

left join (

        select max(dp2.maximo) as cantidad, c2.idcodificador, lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
      

        where
        
        eo2.idestructuraop in (cfgf.idalmacen)
        and dp2.cronologia > 0
        
        group by c2.idcodificador, lp2.idlineaprod

)smax on smax.idcodificador = c.idcodificador and smax.idlineaprod = lp.idlineaprod

left join (

        select min(dp2.minimo) as cantidad, c2.idcodificador, lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
      

        where
        
        eo2.idestructuraop in (cfgf.idalmacen)
        and dp2.cronologia > 0
        
        group by c2.idcodificador, lp2.idlineaprod

)smin on smin.idcodificador = c.idcodificador and smin.idlineaprod = lp.idlineaprod

inner join (

        select sum(dp2.cantidad) as cantidad, c2.idcodificador, lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
      

        where
        
        eo2.idestructuraop in (cfgf.idalmacen, cfgf.idareaventa)
        and dp2.cronologia > 0
        --and c2.idcodificador = 13612
        group by c2.idcodificador, lp2.idlineaprod

)sexist on sexist.idcodificador = c.idcodificador and sexist.idlineaprod = lp.idlineaprod

left join (

        select sum(dp2.cantidad) as cantidad, c2.idcodificador, lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
      

        where
        
        eo2.idestructuraop in (cfgf.idretenido)
        and dp2.cronologia > 0
        
        group by c2.idcodificador, lp2.idlineaprod

)sret on sret.idcodificador = c.idcodificador and sret.idlineaprod = lp.idlineaprod

left join (

        select dp2.precio as precio, c2.idcodificador, lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
      

        where
        
        eo2.idestructuraop in (cfgf.idalmacen)
        and dp2.cronologia > 0
        
        group by c2.idcodificador,dp2.precio, lp2.idlineaprod

)spc on spc.idcodificador = c.idcodificador and spc.idlineaprod = lp.idlineaprod

left join (

        select dp2.precioventa as precio, c2.idcodificador, lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
		inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
      

        where
        
        eo2.idestructuraop in (cfgf.idareaventa)
        and dp2.cronologia > 0
        
        group by c2.idcodificador,dp2.precioventa, lp2.idlineaprod

)spv on spv.idcodificador = c.idcodificador and spv.idlineaprod = lp.idlineaprod

where dp.idestructuracomun = $1 and dp.cronologia > 0 


order by lp.denominacion, c.descripcion
    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modeloconsumoproductos (OID = 1776196) : 
--
CREATE FUNCTION mod_logfarmacia.f_modeloconsumoproductos (
  p_idestructura numeric,
  p_fechainicio date,
  p_fechafin date
)
RETURNS SETOF td_modeloconsumoproductos
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_modeloconsumoproductos;

  BEGIN
    for v_rec in 
     
SELECT DISTINCT

c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
sqc.cantidad as cantidad,
(

        select DISTINCT dp2.precioventa as precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
        
        inner join mod_logistica.dat_movimiento mov2 on mov2.idproducto = dp2.idproducto
        inner join mod_logistica.dat_documento dc2 on dc2.iddocumento = mov2.iddocumento
        inner join mod_logfarmacia.dat_transfinterna dt2 on dt2.idtransfinterna = dc2.iddocumento
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0 
        and eo2.idestructuraop in (cfgf.idareaventa) 
        and dt2.iddeposorigen = cfgf.idalmacen and dt2.iddeposdestino = cfgf.idareaventa
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

) as precioventa,
eo.denominacion as arearesp,
lp.denominacion as lineaprod


from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod

inner join mod_logistica.dat_movimiento mov on mov.idproducto = dp.idproducto
inner join mod_logistica.dat_documento dc on dc.iddocumento = mov.iddocumento
inner join mod_logfarmacia.dat_transfinterna dt on dt.idtransfinterna = dc.iddocumento

inner join (

        select sum(mov2.cantidad) as cantidad, c2.idcodificador
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
        
        inner join mod_logistica.dat_movimiento mov2 on mov2.idproducto = dp2.idproducto
        inner join mod_logistica.dat_documento dc2 on dc2.iddocumento = mov2.iddocumento
        inner join mod_logfarmacia.dat_transfinterna dt2 on dt2.idtransfinterna = dc2.iddocumento
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0         
        and dt2.iddeposorigen = cfgf.idalmacen and dt2.iddeposdestino = cfgf.idareaventa
        and dp2.idestructura = cfgf.idalmacen
        and ((dc2.fechacontable >= $2 or $2 is null) and (dc2.fechacontable <= $3 or $3 is null))
        group by c2.idcodificador,lp2.idlineaprod

) sqc on sqc.idcodificador = c.idcodificador
where dp.idestructuracomun = $1 and dp.cronologia > 0
and eo.idestructuraop in (cfgf.idareaventa) 
and dt.iddeposorigen = cfgf.idalmacen and dt.iddeposdestino = cfgf.idareaventa
and ((dc.fechacontable >= $2 or $2 is null) and (dc.fechacontable <= $3 or $3 is null))

order by eo.denominacion,lp.denominacion,c.descripcion 

    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modeloinvproducto (OID = 1776197) : 
--
CREATE FUNCTION mod_logfarmacia.f_modeloinvproducto (
  p_idestructura numeric
)
RETURNS SETOF td_modeloinvproducto
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_modeloinvproducto;

  BEGIN
    for v_rec in 
     
SELECT DISTINCT


c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
(

        select sum(dp2.cantidad)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
        

        where dp2.cronologia > 0
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod =lp.idlineaprod
        --group by lp2.idlineaprod

) as existencia,
(

        select dp2.precio
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
        

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idalmacen) 
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod =lp.idlineaprod
        --group by lp2.idlineaprod

) as preciocosto,
(

        select dp2.precioventa
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
        

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa) 
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod =lp.idlineaprod
       -- group by lp2.idlineaprod

) as precioventa,
(

        select sum(dp2.cantidad)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
        

        where dp2.cronologia > 0
        and eo2.idestructuraop in (cfgf.idareaventa) 
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod
        --group by lp2.idlineaprod

) as existecia_venta,
l.numero as lote,
(

        select sum(l2.existencia)
        from mod_logistica.dat_producto dp2
        inner join mod_logistica.dat_lote l2 on l2.idproducto = dp2.idproducto
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
        

        where dp2.cronologia > 0
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod=lp.idlineaprod and l2.numero = l.numero

) as cantidad,
l.fechavencimiento as fechavencimiento,
lp.denominacion as lineaprod

from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun

left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod

where dp.idestructuracomun = $1 and dp.cronologia > 0 and (

        select sum(l2.existencia)
        from mod_logistica.dat_producto dp2
        inner join mod_logistica.dat_lote l2 on l2.idproducto = dp2.idproducto
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod=lp.idlineaprod and l2.numero = l.numero

) > 0

order by lp.denominacion, c.descripcion
    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modelomaximominimo (OID = 1776198) : 
--
CREATE FUNCTION mod_logfarmacia.f_modelomaximominimo (
  p_idestructura numeric
)
RETURNS SETOF td_modelomaximominimo
AS 
$body$
declare
all_rec mod_logfarmacia.td_modelomaximominimo;
begin

for all_rec in 

select DISTINCT
c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
lp.denominacion as lineaprod,
(

        select max(dp2.maximo)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

      

        where
        --dp2.idestructuracomun = 100000003 
        eo2.idestructuraop in (dp.idestructura)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod
        and dp2.cronologia > 0

) as maximo,
(

        select min(dp2.minimo)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod


        where
        --dp2.idestructuracomun = 100000003 
        eo2.idestructuraop in (dp.idestructura)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod
        and dp2.cronologia > 0

) as minimo,
(

        select sum(dp2.cantidad)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
        

        where dp2.idestructuracomun = $1 and dp2.cronologia > 0 
        and eo2.idestructuraop in (dp.idestructura)  and lp2.idlineaprod = lp.idlineaprod

) as existencia,
eo.denominacion as arearesp



from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun

left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod


where dp.idestructuracomun = $1 and dp.cronologia > 0
order by eo.denominacion, lp.denominacion


loop
return next all_rec;
end loop;
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modelomovimientoproducto (OID = 1776199) : 
--
CREATE FUNCTION mod_logfarmacia.f_modelomovimientoproducto (
  p_idestructura numeric,
  p_fechainicio date,
  p_fechafin date,
  p_idtipodoc numeric,
  p_idorigen numeric,
  p_iddestino numeric,
  p_idarea numeric,
  p_idlineaprod numeric,
  p_denominacion character varying,
  p_nrodoc numeric
)
RETURNS SETOF td_modelomovimientoproducto
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_modelomovimientoproducto;

  BEGIN
    for v_rec in 
     
SELECT DISTINCT

c.codigo as codigo,
c.descripcion as denominacion,
lp.denominacion as lineaprod,
d.fechacontable as fecha,
o.denominacion as tipodoc,
d.nrodoc as numerodoc,
(
select eop.denominacion from mod_estructuracomp.dat_estructuraop eop  
where eop.idestructuraop = dti.iddeposorigen
) as origen,
 (
select eop.denominacion from mod_estructuracomp.dat_estructuraop eop  
where eop.idestructuraop = dti.iddeposdestino
) as destino,
m.cantidad as cantidad,
m.preciocontable as precio,
m.importecontable as importe,
m.existenciaactual as existencia

from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod
inner join mod_logistica.dat_movimiento m on m.idproducto = dp.idproducto
inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
inner join mod_datosmaestros.nom_operacion o on o.idnomoperaciones = d.idoperacion
left join mod_logfarmacia.dat_transfinterna dti on dti.idtransfinterna = d.iddocumento



where dp.cronologia > 0 and d.estado = 3
and (dp.idestructuracomun = $1 OR $1 is null)
and (d.fechacontable >= $2 OR $2 is null)
and (d.fechacontable <= $3 OR $3 is null)
and (d.idoperacion = $4 OR $4 is null)
and (dti.iddeposorigen = $5 OR $5 is null)
and (dti.iddeposdestino = $6 OR $6 is null)
and (dp.idestructura = $7 OR $7 is null)
and (dp.idlineaprod = $8 OR $8 is null)
and (c.descripcion ilike '%' || $9 || '%' or $9 is null)
and (d.nrodoc = $10 OR $10 is null)

order by lp.denominacion,c.descripcion,c.codigo

    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modeloprodretenidos (OID = 1776200) : 
--
CREATE FUNCTION mod_logfarmacia.f_modeloprodretenidos (
  p_idestructura numeric
)
RETURNS SETOF td_modeloprodretenidos
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_modeloprodretenidos;

  BEGIN
    for v_rec in 
     
SELECT 
c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
sq.cantidad as existencia,
l.numero as lote,
l.existencia as cantidad,
l.fechavencimiento as fechavencimiento,
eo.denominacion as arearesp,
lp.denominacion as lineaprod


from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod
inner join (

        select sum(l2.existencia) as cantidad, c2.idcodificador,lp2.idlineaprod,l2.numero
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_logistica.dat_lote l2 on l2.idproducto = dp2.idproducto
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp2.idestructuracomun
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0 
        and eo2.idestructuraop in (cfgf.idretenido) 
        group by c2.idcodificador,lp2.idlineaprod,l2.numero

) sq on sq.idcodificador = c.idcodificador and sq.idlineaprod = lp.idlineaprod and sq.numero = l.numero
where dp.idestructuracomun = $1 and dp.cronologia > 0 and dp.idestructura in(cfgf.idretenido) 

order by eo.denominacion, lp.denominacion
    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modelorecepproducto (OID = 1776201) : 
--
CREATE FUNCTION mod_logfarmacia.f_modelorecepproducto (
  p_idestructura numeric,
  p_fechainicio date,
  p_fechafin date
)
RETURNS SETOF td_modelorecepproducto
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_modelorecepproducto;

  BEGIN
    for v_rec in 
     
SELECT

c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
sqc.cantidad as cantidad,
sqp.precio as preciocosto,
eo.denominacion as arearesp,
lp.denominacion as lineaprod


from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = $1
left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
left join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod
inner join (

        select sum(mov2.cantidad) as cantidad, c2.idcodificador, lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp2.idestructuracomun
        
        inner join mod_logistica.dat_movimiento mov2 on mov2.idproducto = dp2.idproducto
        inner join mod_logistica.dat_documento dc2 on dc2.iddocumento = mov2.iddocumento
        inner join mod_loginventario.dat_recepcion dr2 on dr2.iddocumento = dc2.iddocumento
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0  and mov2.cronologia > 0       
        and dc2.idestructuracomun = cfgf.idalmacen
        and (dc2.fechacontable >= $2 or $2 is null)
        and (dc2.fechacontable <= $3 or $3 is null)
        group by c2.idcodificador, lp2.idlineaprod

) sqc on sqc.idcodificador = c.idcodificador and sqc.idlineaprod = lp.idlineaprod
left join (

        select avg(dp2.precio) as precio, c2.idcodificador, lp2.idlineaprod
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp2.idestructuracomun
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

        where dp2.cronologia > 0 
        and eo2.idestructuraop in (cfgf.idalmacen) 
        group by c2.idcodificador, lp2.idlineaprod

) sqp on sqp.idcodificador = c.idcodificador and sqp.idlineaprod = lp.idlineaprod
where  dp.cronologia > 0
and dp.idestructura = cfgf.idalmacen 

order by lp.denominacion, c.descripcion asc

    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modeloreenvase (OID = 1776202) : 
--
CREATE FUNCTION mod_logfarmacia.f_modeloreenvase (
  p_iddocumento numeric,
  p_idestructura numeric
)
RETURNS SETOF td_modelorotacionlote
AS 
$body$
DECLARE
  v_rec mod_logfarmacia.td_modeloreenvase;
  
BEGIN

for v_rec in 
      select DISTINCT
      concat((case when ni.numeropieza is null or length(ni.numeropieza) = 0 then ni.codigo else ni.numeropieza end),'-',ni.denominacion) as codigodenom,
      ni.denominacion,
      'presentacion',--nf.denominacion as presentacion,
      dpr.dosisunitaria,--dc.capacidad as dosisunitaria,
      l.numero as nrolote,
      l.fechavencimiento,
      lr.cantorigen,
      lr.dosisunitreal,
      concat((case when nido.numeropieza is null or length(nido.numeropieza) = 0 then nido.codigo else nido.numeropieza end),'-',nido.denominacion) as codigodenomreenvasado,
      nido.denominacion as denomreenvasado,
      '',--nfdo.denominacion, --presentacionreenvasado
      lrdo.dosisunitreal,--dcdo.capacidad,--dosisunitariareenvasado
      ldo.numero, --numerolotereeenvasado
      ldo.fechavencimiento,--fechavencreenvasado
      lrdo.cantdestino as cantdestino, 
      (case when dr.cantdif < 0 then dr.cantdif else 0 end) as diffaltante,
      (case when dr.cantdif > 0 then dr.cantdif else 0 end) as difsobrante,
      dd.fechacontable as fecha,
      dd.nrodoc as numerodoc,
      de.denominacion as area,
      u.nombreusuario,
      es.denominacion as entidad

from mod_logfarmacia.dat_reenvase dr
inner join mod_logistica.dat_documento dd on dd.iddocumento = dr.idreenvase
left join mod_logfarmacia.dat_prodreenvase dpr on dpr.idreenvase = dr.idreenvase
left join mod_logfarmacia.dat_prodreenvasado dprdo on dprdo.idreenvase = dr.idreenvase
left join mod_logistica.dat_producto dpl on dpl.idproducto = dpr.idprodorigen
left join mod_logistica.dat_producto dpldo on dpldo.idproducto = dprdo.idproddestino
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpl.idindicador
left join mod_datosmaestros.nom_indicador nido on nido.idindicador = dpldo.idindicador

left join mod_logfarmacia.dat_lotereenvase lr on lr.idprodorigen = dpr.idprodorigen
left join mod_logfarmacia.dat_lotereenvase lrdo on lrdo.idprodorigen = dprdo.idprodorigen
left join mod_logistica.dat_lote l on l.idlote = lr.idlote
left join mod_logistica.dat_lote ldo on ldo.idlote = lrdo.idlote

left join mod_estructuracomp.dat_estructuraop de on de.idestructuraop = dr.idarea
left join mod_seguridad.seg_usuario u on dd.aprobadopor = u.idusuario
left join mod_estructuracomp.dat_estructura es on es.idestructura = p_idestructura

where dr.idreenvase = p_iddocumento
--order by ni.denominacion ASC
    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modelorotacionlote (OID = 1776203) : 
--
CREATE FUNCTION mod_logfarmacia.f_modelorotacionlote (
  p_idrotacion numeric,
  p_idestructura numeric
)
RETURNS SETOF td_modelorotacionlote
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_modelorotacionlote;

  BEGIN
    for v_rec in 
      select 

DISTINCT

co.codigo,
co.descripcion,
um.abreviaturaunidadmedida,
l.numero,
rpc.cantidad,
rpc.tipo,
doc.fechacontable,
doc.numeroref,
eo.denominacion as areaorigen,
ed.denominacion as areadestino,
u.nombreusuario,
es.denominacion as entidad

from mod_logfarmacia.dat_rotacionlote rl


inner join mod_logistica.dat_documento doc on doc.iddocumento = rl.idrotacionlote
inner join mod_logistica.dat_movimiento m on doc.iddocumento = m.iddocumento
inner join mod_logfarmacia.dat_rotacioncodificador rc on rc.idrotacionlote = rl.idrotacionlote
inner join mod_logfarmacia.dat_rotacionproductolote rpc on rpc.idrotacionlote = rl.idrotacionlote
inner join mod_datosmaestros.dat_codificador co on co.idcodificador = rc.idcodificador
left join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = co.idumedida
inner join mod_logistica.dat_lote  l on l.idlote = rpc.idlote
inner join mod_logistica.dat_movlote  ml on ml.idmovimiento = m.idmovimiento
inner join mod_estructuracomp.dat_estructuraop eo on eo.idestructuraop = rl.idorigen
inner join mod_estructuracomp.dat_estructuraop ed on ed.idestructuraop = rl.iddestino
left join mod_seguridad.seg_usuario u on doc.aprobadopor = u.idusuario
left join mod_estructuracomp.dat_estructura es on es.idestructura = $2

where rl.idrotacionlote = $1 
order by rpc.tipo ASC, co.descripcion ASC

    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modelotarjetamedicamento (OID = 1776204) : 
--
CREATE FUNCTION mod_logfarmacia.f_modelotarjetamedicamento (
  p_iddocumento numeric
)
RETURNS SETOF td_modelotarjetamedicamento
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_modelotarjetamedicamento;

  BEGIN
    for v_rec in 
     
SELECT DISTINCT
btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel)) as paciente,
dir.direccion,
d.nrodoc,
dc.codigo,
dc.descripcion,
pt.origenprescripcion,
pt.nroregistro,
pt.especialidad,
pt.dosis,
pt.fechaemision,
pt.fechaexpiracion,
pt.idproductotarjetamedicamento,(
select numero from mod_persona.dat_docidentidad where idpersona = dp.idpersona) as numeroc

 FROM mod_logfarmacia.dat_tarjetamedicamento tm

INNER JOIN mod_logistica.dat_documento d ON tm.idtarjetamedicamento = d.iddocumento

INNER JOIN mod_persona.dat_persona dp ON tm.idpaciente = dp.idpersona

INNER JOIN mod_persona.dat_docidentidad did on did.idpersona = did.idpersona

INNER JOIN mod_logfarmacia.dat_productotarjetamedicamento pt on pt.idtarjetamedicamento = tm.idtarjetamedicamento

INNER JOIN mod_logfarmacia.conf_cuadrobasico cb on pt.idcuadrobasico = cb.idcuadrobasico

INNER JOIN mod_datosmaestros.dat_codificador dc ON cb.idcodificador = dc.idcodificador

LEFT JOIN mod_persona.dat_docidentidad di ON (di.idpersona = dp.idpersona and di.principal =1)

LEFT JOIN mod_personaext.dat_areaatencionmedica daa ON daa.idpersona = dp.idpersona

LEFT JOIN mod_persona.dat_direccion dir ON dir.idpersona = dp.idpersona

--LEFT JOIN mod_logfarmacia.dat_entregaproducto dep on dep.idproductotarjetamedicamento = tm.i

where tm.idtarjetamedicamento = $1

order by dc.descripcion

    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modelotransfinterna (OID = 1776205) : 
--
CREATE FUNCTION mod_logfarmacia.f_modelotransfinterna (
  p_iddocumento numeric
)
RETURNS SETOF td_modelotransfinterna
AS 
$body$
declare
v_rec mod_logfarmacia.td_modelotransfinterna;

begin
for v_rec in 
select distinct
pp.cantidad as existencia,
pp.precio as preciocosto,
--pp.precioventa,
--lp.denominacion as denomlineaprod,
ni.codigo,
ni.denominacion,
--tem.denominacion as presentacion,
--nte.denominacion as uemb,

(select coalesce(sum(dtil.cantpasar),0)
from mod_logfarmacia.dat_transfinternalote dtil
where dtil.idproducto = pp.idproducto and dtil.idtransfinterna = $1) as cantidad,

/*(/*pp.precioventa **/ (select coalesce(sum(dtil.cantpasar),0)
from mod_logfarmacia.dat_transfinternalote dtil
where dtil.idproducto = pp.idproducto and dtil.idtransfinterna = p_iddocumento)) as importeventa,
*/                
(pp.precio * (select coalesce(sum(dtil.cantpasar),0)
from mod_logfarmacia.dat_transfinternalote dtil
where dtil.idproducto = pp.idproducto and dtil.idtransfinterna = $1)) as importetotal,
pp.idproducto,
d.nrodoc,
eop.denominacion as areaorigen,
eopp.denominacion as areadestino,
e.denominacion as entidad,
(pp.precio * (select coalesce(sum(dtil.cantpasar),0)
from mod_logfarmacia.dat_transfinternalote dtil
where dtil.idproducto = pp.idproducto and dtil.idtransfinterna = $1)) as importecosto
            
from mod_logistica.dat_producto pp
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = pp.idindicador
--left join mod_datosmaestros.nom_tipoenvase tem on tem.idtipoenvase = co.idpresentacion
left join mod_datosmaestros.nom_unidadmedida umm on umm.idunidadmedida = pp.idumedida
inner join mod_logfarmacia.dat_prodtransfinterna pr on pr.idproducto = pp.idproducto
inner join mod_logistica.dat_documento d on d.iddocumento = pr.idtransfinterna
inner join mod_logfarmacia.dat_transfinterna ti on d.iddocumento = ti.idtransfinterna
inner join mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = ti.iddeposorigen
inner join mod_estructuracomp.dat_estructuraop eopp on eopp.idestructuraop = ti.iddeposdestino
inner join mod_estructuracomp.dat_estructura e on e.idestructura = d.idestructuracomun
where d.iddocumento = p_iddocumento
/*group by 
--lp.denominacion,
pp.cantidad,pp.precio,ni.codigo,ni.descripcion,
--tem.denominacion,
ni.denominacion,pp.idproducto,d.nrodoc,eop.denominacion,eopp.denominacion,e.denominacion
order by 
ni.denominacion
--,co.descripcion 
asc*/
loop return next v_rec; end loop;
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_modelotransfinternalote (OID = 1776206) : 
--
CREATE FUNCTION mod_logfarmacia.f_modelotransfinternalote (
  p_iddocumento numeric,
  p_idproducto numeric
)
RETURNS SETOF td_modelotransfinternalote
AS 
$body$
declare
v_rec mod_logfarmacia.td_modelotransfinternalote;
begin
for v_rec in 
select ll.numero as nrolote, tl.cantpasar
from mod_logfarmacia.dat_transfinternalote tl
inner join mod_logistica.dat_lote ll on ll.idlote = tl.idlote
where tl.idtransfinterna = p_iddocumento and tl.idproducto = p_idproducto
loop return next v_rec; end loop;
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_productofaltas (OID = 1776207) : 
--
CREATE FUNCTION mod_logfarmacia.f_productofaltas (
  p_idestructura numeric
)
RETURNS SETOF td_productofaltas
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_productofaltas;

  BEGIN
    for v_rec in 
     
SELECT

c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
lp.denominacion as lineaprod,
(

        select max(dp2.maximo)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod

      

        where
        --dp2.idestructuracomun = 100000003 
        eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod
        and dp2.cronologia > 0

) as maximo,
(

        select min(dp2.minimo)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod


        where
        --dp2.idestructuracomun = 100000003 
        eo2.idestructuraop in (cfgf.idalmacen)
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod
        and dp2.cronologia > 0

) as minimo

from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun

left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
inner join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod

where dp.idestructuracomun = $1 and dp.cronologia > 0 

group by c.codigo,c.descripcion,u.denominacionunidadmedida,lp.denominacion,cfgf.idalmacen,cfgf.idareaventa,c.idcodificador
having (
        select sum(dp3.cantidad)
        from mod_logistica.dat_producto dp3
        inner join mod_datosmaestros.dat_codificador c3 on c3.idcodificador = dp3.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f3 on f3.idfila = dp3.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo3 on f3.idfila = eo3.idestructuraop

        where

        eo3.idestructuraop in (cfgf.idalmacen,cfgf.idareaventa)
        and c3.idcodificador = c.idcodificador
        and dp3.cronologia > 0

) = 0

order by lp.denominacion
    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_vencimientoproducto (OID = 1776208) : 
--
CREATE FUNCTION mod_logfarmacia.f_vencimientoproducto (
  p_idestructura numeric,
  p_fechasub date,
  p_fechaposiven date,
  p_fechaproxven date,
  p_criterio character varying,
  p_idestadoven1 numeric,
  p_idestadoven2 numeric,
  p_idestadoven3 numeric,
  p_idestadoven4 numeric
)
RETURNS SETOF td_vencimientoproducto
AS 
$body$
  DECLARE
  v_rec mod_logfarmacia.td_vencimientoproducto;

  BEGIN
    for v_rec in 
     
select 
c.codigo as codigo,
c.descripcion as denominacion,
u.abreviaturaunidadmedida as uemb,
(

        select sum(dp2.cantidad)
        from mod_logistica.dat_producto dp2
        inner join mod_datosmaestros.dat_codificador c2 on c2.idcodificador = dp2.idcodificador
        inner join mod_estructuracomp.nom_filaestruc f2 on f2.idfila = dp2.idestructura
        inner join mod_estructuracomp.dat_estructuraop eo2 on f2.idfila = eo2.idestructuraop
        inner join mod_logfarmacia.nom_lineaprod lp2 on lp2.idlineaprod = dp2.idlineaprod
        

        where dp2.idestructuracomun = $1 and dp2.cronologia > 0 
       -- and usdd.idtipodispensacion <> 3
        and eo2.idestructuraop in (eo.idestructuraop) 
        and c2.idcodificador = c.idcodificador and lp2.idlineaprod = lp.idlineaprod

) as existencia,
l.numero as lote,
l.existencia as cantidad,
l.fechavencimiento as fechavencimiento,
case
          when l.fechavencimiento < $2::date then 'Vencido'
          when l.fechavencimiento < $3::date then 'Posible vencimiento'
          when l.fechavencimiento < $4::date then 'Próximo a vencer'
          else 'Normal'
end as estado,
eo.denominacion as arearesp,
lp.denominacion as lineaprod


from mod_logistica.dat_producto dp
inner join mod_datosmaestros.dat_codificador c on c.idcodificador = dp.idcodificador
inner join mod_logistica.dat_lote l on l.idproducto = dp.idproducto
inner join mod_estructuracomp.nom_filaestruc f on f.idfila = dp.idestructura
inner join mod_estructuracomp.dat_estructuraop eo on f.idfila = eo.idestructuraop
inner join mod_logfarmacia.conf_generalfm cfgf on cfgf.idestructura = dp.idestructuracomun
left join mod_datosmaestros.nom_unidadmedida u on dp.idumedida = u.idunidadmedida
inner join mod_logfarmacia.nom_lineaprod lp on lp.idlineaprod = dp.idlineaprod
where dp.idestructuracomun = $1 and dp.cronologia > 0

and (l.fechavencimiento >  $4::date or $6 is null)
and (l.fechavencimiento < $4::date and l.fechavencimiento > $3::date or $7 is null)
and (l.fechavencimiento <  $3::date and l.fechavencimiento > $2::date or $8 is null)
and (l.fechavencimiento <  $2::date or $9 is null)
and (c.descripcion ilike '%' || $5 || '%' or $5 is null)

order by eo.denominacion, lp.denominacion, c.descripcion
    loop
      return next v_rec;
    end loop;
  END;
$body$
LANGUAGE plpgsql;
--
-- Definition for function ft_insertarforma (OID = 1776209) : 
--
CREATE FUNCTION mod_logfarmacia.ft_insertarforma (
)
RETURNS SETOF trigger
AS 
$body$
declare
v_padre record;
begin
if new.idforma = 0 or new.idpadre is null then
new.idpadre := new.idforma; 
new.idarbol := new.idforma; 
new.nivel := 1;     
end if;	

new.parentpath:= public.text2ltree((select mod_datosmaestros.f_crearutaltree('mod_logfarmacia.nom_forma','idforma','idpadre','parentpath',new.idforma,new.idpadre)));	

if new.idforma != new.idpadre then select idarbol, nivel into v_padre from mod_logfarmacia.nom_forma where idforma = new.idpadre;
new.idarbol := v_padre.idarbol;		
new.nivel := v_padre.nivel + 1;
else    
new.nivel := 1;
new.idarbol := new.idforma;
end if;
return new; 
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function ft_insertargrupofm (OID = 1776210) : 
--
CREATE FUNCTION mod_logfarmacia.ft_insertargrupofm (
)
RETURNS SETOF trigger
AS 
$body$
declare
v_padre record;
begin
if new.idgrupofm = 0 or new.idpadre is null then
new.idpadre := new.idgrupofm; 
new.idarbol := new.idgrupofm; 
new.nivel := 1;     
end if;	

new.parentpath:= public.text2ltree((select mod_datosmaestros.f_crearutaltree('mod_logfarmacia.nom_grupofm','idgrupofm','idpadre','parentpath',new.idgrupofm,new.idpadre)));	

if new.idgrupofm != new.idpadre then select idarbol, nivel into v_padre from mod_logfarmacia.nom_grupofm where idgrupofm = new.idpadre;
new.idarbol := v_padre.idarbol;		
new.nivel := v_padre.nivel + 1;
else    
new.nivel := 1;
new.idarbol := new.idgrupofm;
end if;
return new; 
end;
$body$
LANGUAGE plpgsql;
--
-- Definition for function f_aprobartransfinterna (OID = 3086533) : 
--
CREATE FUNCTION mod_logfarmacia.f_aprobartransfinterna (
  p_iddocumento numeric,
  p_idusuario numeric,
  p_cronologia numeric = 1
)
RETURNS void
AS 
$body$
DECLARE
  v_iddocdistribucion numeric;
  v_iddoctransferencia numeric;
  v_iddocrecepcion numeric;
  v_iddocumentodist numeric;
  v_iddocumentotransf numeric;
  v_iddocumentorecep numeric;
  v_idespecialidad numeric;
  v_proddestino record;
  v_cronologia numeric;
  
  v_idmoneda numeric;
  v_idperiodo record;
  v_fechainventario date;
  v_allrec record;
  v_recdata record;
  v_reclote record;
  v_idproducto numeric;
  v_idlote numeric;
  v_idmovimiento numeric;
  v_idmovimientold numeric;
BEGIN
-- Validar que todos los productos tengan disponible (esto es en el codigo para lanzar exception)
-- Crear el documento de distribucion a partir de la transferencia interna en estado Elaboracion (obtener el iddistribucion)
-- Crear el documento de transferencia a partir de la distribucion en estado Elaboracion (obtener el idtransferencia)
-- Crear el documento de recepcion a partir de la transferencia en estado Elaboracion (obtener el recepcion)
-- Adicionar todos los productos al documento de distribucion
	-- DatProdorden
    -- DatProdordenCmpto (todo entregago)
    -- DatProdordenlote
    -- Cantidadconprometida con estado 2
-- Adicionar todos los productos al documento de transferencia
	-- DatMovimiento
    -- DatMovimientolote
    -- XXX Rebajar lote
    -- Rebajar existencia
-- Adicionar todos los productos al documento de recepcion
	-- Crear tarjeta del producto si no existe
	-- DatMovimiento
    -- DatMovimientolote
    -- XXX Rebajar lote
    -- Rebajar existencia
    
    select ti.iddeposorigen as origen, ti.iddeposdestino as destino,d.idestructuracomun,
    d.nrodoc,d.numeroref,d.fechacontable as fecha,d.iddocumento into v_recdata 
    from mod_logfarmacia.dat_transfinterna ti 
    inner join mod_logistica.dat_documento d on d.iddocumento = ti.idtransfinterna
    where ti.idtransfinterna = p_iddocumento;
    
    v_idmoneda := (select idmoneda from mod_datosmaestros.dat_monedaentidad
    where idestructuracomun = v_recdata.idestructuracomun and tipomoneda = 0 limit 1);
                        
    v_iddocdistribucion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'entregaLog' and des.idestructuracomun = v_recdata.idestructuracomun limit 1);
    
    v_iddoctransferencia := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'transferenciaLog' and des.idestructuracomun = v_recdata.idestructuracomun limit 1);
    
    v_iddocrecepcion := (select ddp.iddoc from mod_datosmaestros.dat_documentoprim ddp
    inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
    where ndp.abreviatura = 'recepcionLog' and des.idestructuracomun = v_recdata.idestructuracomun limit 1);
     
    v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = p_idusuario limit 1);
   
    v_idperiodo = mod_logistica.f_obtenerejercicioactivo(10, v_recdata.idestructuracomun);            
                
    
    v_fechainventario := (select df.fecha from mod_datosmaestros.dat_fecha df
        inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = df.idestructurasubsist
        where des.idsubsistema = 10 and des.idestructuracomun = v_recdata.idestructuracomun limit 1);
    
    select max(d.cronologia)+1 into v_cronologia from mod_logistica.dat_documento d;    
    
    with documento AS (INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,nrodoc,idespecialidad
            )
            VALUES (
              v_iddocdistribucion, date_part('year', CAST(to_char(v_fechainventario, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechainventario,'Documento generado a partir de la Transferencia interna #'||v_recdata.nrodoc||' con fecha '||v_recdata.fecha||'.',
              0,p_idusuario,3,v_idperiodo.idejercicioactual,v_recdata.idestructuracomun, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.idestructuracomun
              ),0)+1),
              (COALESCE((
                select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocdistribucion
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.idestructuracomun
              ),0)+1),v_idespecialidad
            ) returning iddocumento,iddoc,idejercicio,idestructuracomun,nrodoc),
            distribucion as (
            INSERT INTO 
            	mod_logdistribucion.dat_orden
              (
                idorden,estadosum,idusuario
              )
              select iddocumento,2,p_idusuario from documento
              returning idorden
            ),            
            documentocliente as (
            INSERT INTO 
                mod_logistica.dat_documentocliente
              (
                iddocumento,idcliente,tipocliente
              )
              select iddocumento, v_recdata.destino,3 from documento
              RETURNING iddocumento
            )
            INSERT INTO 
              mod_logistica.dat_documentopadre
            (
              iddocumento,idpadre
            )
            select iddocumento, v_recdata.iddocumento from documentocliente
            returning iddocumento into v_iddocumentodist;
            
	with transferencia as (INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,nrodoc,idespecialidad,idoperacion
            )
            VALUES (
              v_iddoctransferencia, date_part('year', CAST(to_char(v_fechainventario, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechainventario,'Documento generado a partir de la Distribución #'||(
              select nrodoc from mod_logistica.dat_documento where iddocumento = v_iddocumentodist
              )||' con fecha '||v_fechainventario||'.',
              v_cronologia,p_idusuario,4,v_idperiodo.idejercicioactual,v_recdata.origen, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoctransferencia
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.origen
              ),0)+1),
              (COALESCE((
                select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddoctransferencia
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.origen
              ),0)+1),v_idespecialidad,null
            ) returning iddocumento,iddoc,idejercicio,observaciones),
            entrega as (INSERT INTO 
                mod_logistica.dat_entrega
              (
                iddocumento,observacion,iddestino,origen
              )
              select iddocumento, observaciones,2,1 from transferencia
              returning iddocumento),
            documentoclientetranf as (INSERT INTO
                mod_logistica.dat_documentocliente
              (
                iddocumento,idcliente,tipocliente
              )
              select iddocumento, v_recdata.destino,3 from transferencia
              returning iddocumento)  
              
            INSERT INTO 
              mod_logistica.dat_documentopadre
            (
              iddocumento,idpadre
            )
            select iddocumento, v_iddocumentodist from transferencia
            returning iddocumento into v_iddocumentotransf;
            
	with recepcion as (INSERT INTO mod_logistica.dat_documento
            (
              iddoc,anno,fechacontable,observaciones,cronologia,idusuario,estado,idejercicio,
              idestructuracomun,idperiodo,numeroref,nrodoc,idespecialidad,idoperacion
            )
            VALUES (
              v_iddocrecepcion, date_part('year', CAST(to_char(v_fechainventario, 'DD/MM/YYYY HH24:MI') as timestamp)),
              v_fechainventario,'Documento generado a partir de la Transferencia #'||(
              select nrodoc from mod_logistica.dat_documento where iddocumento = v_iddocumentotransf
              )||' con fecha '||v_fechainventario||'.',
              v_cronologia+1,p_idusuario,4,v_idperiodo.idejercicioactual,v_recdata.destino, v_idperiodo.idperiodoactual,
              (COALESCE((
                select max(dd.numeroref) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocrecepcion
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.destino
              ),0)+1),
              (COALESCE((
                select max(dd.nrodoc) from mod_logistica.dat_documento dd where dd.iddoc = v_iddocrecepcion
                and dd.idejercicio = v_idperiodo.idejercicioactual and dd.idestructuracomun = v_recdata.destino
              ),0)+1),v_idespecialidad,(select valor::numeric from mod_logistica.nom_variableglobal where nombre = 'OPRE_REC_TRANS_INT')
            ) returning iddocumento,iddoc,idejercicio,observaciones),
            docrecepcion as (INSERT INTO mod_loginventario.dat_recepcion
              (
                iddocumento,nrodocorigen,fechadocorigen,idcondicionpago
              )
              select iddocumento, (select nrodoc from mod_logistica.dat_documento where iddocumento = v_iddocumentotransf),
              (select fechacontable from mod_logistica.dat_documento where iddocumento = v_iddocumentotransf),null from recepcion
              returning iddocumento),
            documentoclienterecep as (INSERT INTO
                mod_logistica.dat_documentocliente
              (
                iddocumento,idcliente,tipocliente
              )
              select iddocumento, v_recdata.origen,3 from recepcion
              returning iddocumento)  
              
            INSERT INTO 
              mod_logistica.dat_documentopadre
            (
              iddocumento,idpadre
            )
            select iddocumento, v_iddocumentotransf from recepcion
            returning iddocumento into v_iddocumentorecep;
            
            
    for v_allrec in select pti.idproducto, p.idproducto as proddestino, po.precio,po.idumedida,
    					po.idelementogasto, po.idclasificacioncontable,po.cantidad as existencia,
    					pti.cantidad as cantidad,count(til.idtransfinternalote) as tienelote
                  from  mod_logfarmacia.dat_prodtransfinterna pti
                  inner join mod_logistica.dat_producto po on po.idproducto = pti.idproducto
                  left join mod_logistica.dat_producto p on p.idindicador = po.idindicador 
                  			and p.idestructura = v_recdata.destino
                  left join mod_logfarmacia.dat_transfinternalote til on til.idproducto = pti.idproducto 
                            and til.idtransfinterna = pti.idtransfinterna
                  where pti.idtransfinterna = p_iddocumento
                  group by  pti.idproducto, p.idproducto, po.precio, pti.cantidad,po.idumedida,
    					po.idelementogasto, po.idclasificacioncontable,po.cantidad
    loop
    	v_proddestino := v_allrec;
        
        with proorden as (
              INSERT INTO 
                mod_logdistribucion.dat_prodorden
              (
                idproducto,idcliente,cantidad,idorden
              )
              VALUES (
                v_allrec.idproducto,v_recdata.destino,v_allrec.cantidad,v_iddocumentodist
              )returning idprodorden,idproducto
            ), proordencmpto as (
                INSERT INTO 
                  mod_logdistribucion.dat_prodordencmpto
                (
                  idprodorden,enproceso,entregado,pendiente,cantidadoriginal
                )
              select idprodorden, 0, v_allrec.cantidad,0,v_allrec.cantidad from proorden
            ), prodordenlote as (
                INSERT INTO 
                  mod_logdistribucion.dat_prodordenlote
                (
                  idprodordenlote,idproducto,idlote,cantidad
                )
                SELECT pd.idprodorden,pd.idproducto,lt.idlote,lt.cantpasar from proorden pd
                inner join mod_logfarmacia.dat_transfinternalote lt on lt.idproducto = pd.idproducto
                and lt.idtransfinterna = p_iddocumento
                --where idproducto = v_allrec.idproducto and idtransfinterna = p_iddocumento            
            )
            INSERT INTO 
              mod_logistica.dat_cantidadcomprometida
            (
              iddocumento,idproducto,idcliente,cantidad,estado
            ) 
            VALUES(v_iddocumentodist,v_allrec.idproducto,v_recdata.destino,v_allrec.cantidad,2);
             
		with movimientoSalida as (
              INSERT INTO 
                mod_logistica.dat_movimiento
              (
                iddocumento,idproducto,preciocontable,importecontable,cantidad,
                cronologia,signo,idunidadmedida,idelementogasto,idclasificacion,
                existenciaactual
              )
              VALUES (
                v_iddocumentotransf,v_allrec.idproducto,v_allrec.precio,
                round(v_allrec.cantidad*v_allrec.precio,2),v_allrec.cantidad,
                (select cronologia from mod_logistica.dat_documento where iddocumento = v_iddocumentotransf),
                '-',v_allrec.idumedida,v_allrec.idelementogasto,v_allrec.idclasificacioncontable,
                v_allrec.existencia
              ) returning idmovimiento, preciocontable, idproducto, cantidad, cronologia
          ), movmoneda as (
              insert into mod_logistica.dat_movmoneda 
            (
                idmovimiento, idmoneda, precio
            )
            select idmovimiento, v_idmoneda, preciocontable from movimientoSalida
          ), movlote as (INSERT INTO 
              mod_logistica.dat_movlote
            (
              idlote,idmovimiento,cantidad,idubicacion
            )
            SELECT pl.idlote,mv.idmovimiento,pl.cantidad, -1 from movimientoSalida mv
            inner join mod_logdistribucion.dat_prodorden po on po.idproducto = mv.idproducto
            		and po.idorden = v_iddocumentodist 
            inner join mod_logdistribucion.dat_prodordenlote pl on pl.idprodordenlote = po.idprodorden
            and pl.idprodordenlote = po.idprodorden
          )
            update mod_logistica.dat_producto as dp
            set cantidad = dp.cantidad - ms.cantidad,cronologia = ms.cronologia,
            precio = (case when (dp.cantidad-ms.cantidad) > 0 
                  then (round(dp.importe - (dp.precio*ms.cantidad),2))/(dp.cantidad-ms.cantidad)  
              else 0 end),
            importe = (case when (dp.cantidad-ms.cantidad) > 0 
                    then (round(dp.importe - (dp.precio*ms.cantidad), 2) )
              else 0 end)
            from movimientoSalida ms
            where dp.idproducto = ms.idproducto;
            --falta actualizar la rebajar la existencia de los lotes
            
      if v_proddestino.proddestino is null then
      		INSERT INTO 
              mod_logistica.dat_producto
            (
              idestructura,idumedida,idindicador,idclasificacioncontable,
              cronologia,precio,cantidad,importe,idestructuracomun,
              idmarca,idmodelo,idelementogasto
            )
            SELECT v_recdata.destino, mv.idunidadmedida,p.idindicador,mv.idclasificacion,
            (select cronologia from mod_logistica.dat_documento where iddocumento = v_iddocumentorecep) as cronologia, 
            0, 0, 0, p.idestructuracomun,p.idmarca, p.idmodelo, p.idelementogasto
            FROM mod_logistica.dat_movimiento mv 
            INNER JOIN mod_logistica.dat_producto p ON p.idproducto = mv.idproducto 
            WHERE mv.iddocumento = v_iddocumentotransf
            and mv.idproducto = v_proddestino.idproducto
            returning idproducto as proddestino,precio,idumedida,idelementogasto,mv.idmovimiento,
            	idclasificacioncontable,cantidad,v_proddestino.idproducto as idproducto,cronologia
                into v_proddestino;                        
      end if;   
      
		with movimientoEntrada as (
              INSERT INTO 
                mod_logistica.dat_movimiento
              (
                iddocumento,idproducto,preciocontable,importecontable,cantidad,
                cronologia,signo,idunidadmedida,idelementogasto,idclasificacion,
                existenciaactual
              )
        	  SELECT v_iddocumentorecep,v_proddestino.proddestino,preciocontable,importecontable,cantidad, 
                (select cronologia from mod_logistica.dat_documento where iddocumento = v_iddocumentorecep),
                '+',idunidadmedida,idelementogasto,idclasificacion,0
                FROM mod_logistica.dat_movimiento WHERE iddocumento = v_iddocumentotransf
              and idproducto = v_proddestino.idproducto
              returning idmovimiento, preciocontable, idproducto, cantidad, cronologia
          ), movmoneda as (
              insert into mod_logistica.dat_movmoneda 
            (
                idmovimiento, idmoneda, precio
            )
            select idmovimiento, v_idmoneda, preciocontable from movimientoEntrada
          )--Falta adicionar el nuevo lote
          /*, movlote as (INSERT INTO 
              mod_logistica.dat_movlote
            (
              idlote,idmovimiento,cantidad,idubicacion
            )-- tengo que crear un idlote nuevo para el producto nuevo
            SELECT pl.idlote,mv.idmovimiento,pl.cantidad, -1 from movimientoEntrada mv
            inner join mod_logdistribucion.dat_prodorden po on po.idproducto = v_proddestino.idproducto
            		and po.idorden = v_iddocumentodist 
            inner join mod_logdistribucion.dat_prodordenlote pl on pl.idprodordenlote = po.idprodorden
            and pl.idprodordenlote = po.idprodorden
          )*/
            update mod_logistica.dat_producto as dp
            set cantidad = dp.cantidad + ms.cantidad,cronologia = ms.cronologia,
            precio = (round(dp.importe + (dp.precio*ms.cantidad),2))/(dp.cantidad+ms.cantidad),
            importe = (round(dp.importe + (dp.precio*ms.cantidad), 2))
            from movimientoEntrada ms
            where dp.idproducto = ms.idproducto;
       

            
    end loop; 
END;
$body$
LANGUAGE plpgsql
STRICT;
--
-- Definition for sequence sec_confanno_seq (OID = 1776211) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_confanno_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table conf_anno (OID = 1776213) : 
--
CREATE TABLE mod_logfarmacia.conf_anno (
    idanno numeric(19,0) DEFAULT nextval('sec_confanno_seq'::regclass) NOT NULL,
    denominacion varchar(50),
    estado numeric(1,0) DEFAULT 0,
    activo numeric(1,0) DEFAULT 0 NOT NULL,
    fechainicio date,
    fechafin date,
    identidad numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_confcuadrobasico_seq (OID = 1776219) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_confcuadrobasico_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table conf_cuadrobasico (OID = 1776221) : 
--
CREATE TABLE mod_logfarmacia.conf_cuadrobasico (
    idcuadrobasico numeric(19,0) DEFAULT nextval('sec_confcuadrobasico_seq'::regclass) NOT NULL,
    idindicador numeric(19,0),
    idtipocuadrobasico numeric(19,0),
    idgrupofarmacologico varchar(100),
    idclasificacionven numeric(19,0),
    idproveedor numeric(19,0),
    idviaadquicicion numeric(19,0),
    prioridad numeric(1,0),
    formulamagistral numeric(1,0),
    tienecertificado numeric(19,0),
    idanno numeric(19,0),
    idtipounidadsalud numeric(19,0),
    idtipodispensacion numeric(19,0),
    idestructura numeric(19,0),
    idpadre numeric(19,0),
    precioventa numeric(19,6),
    modocobro numeric(1,0) DEFAULT 0
)
WITH (oids = false);
--
-- Structure for table conf_cuadrobasico_new (OID = 1776226) : 
--
CREATE TABLE mod_logfarmacia.conf_cuadrobasico_new (
    idcuadrobasico numeric(19,0) DEFAULT nextval('sec_confcuadrobasico_seq'::regclass) NOT NULL,
    idcodificador numeric(19,0),
    idtipocuadrobasico numeric(19,0),
    idgrupofarmacologico varchar(100),
    idclasificacionven numeric(19,0),
    idproveedor numeric(19,0),
    idviaadquicicion numeric(19,0),
    prioridad numeric(1,0),
    formulamagistral numeric(1,0),
    tienecertificado numeric(19,0),
    idanno numeric(19,0),
    idtipounidadsalud numeric(19,0),
    idtipodispensacion numeric(19,0),
    idestructura numeric(19,0),
    idpadre numeric(19,0),
    precioventa numeric(19,6)
)
WITH (oids = false);
--
-- Definition for sequence sec_confgeneralfm_seq (OID = 1776230) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_confgeneralfm_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table conf_generalfm (OID = 1776232) : 
--
CREATE TABLE mod_logfarmacia.conf_generalfm (
    idgeneralfm numeric(19,0) DEFAULT nextval('sec_confgeneralfm_seq'::regclass) NOT NULL,
    minimo numeric(25,6),
    fondofijo numeric(25,6),
    reserva numeric(25,6),
    normabast numeric(19,0),
    minarea numeric(25,6),
    ptoreposicion numeric(1,0) DEFAULT 0,
    diaconsignado numeric(19,0),
    diaminvencido numeric(19,0),
    diamintarjeta numeric(19,0),
    diaproxvencer numeric(19,0),
    lotevencido numeric(1,0) DEFAULT 0,
    idalmacen numeric(19,0),
    idareaventa numeric(19,0),
    idreserva numeric(19,0),
    idretenido numeric(19,0),
    idalmacenusuf numeric(19,0),
    iddispensario numeric(19,0),
    idreservmob numeric(19,0),
    idestructura numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_asociartipoentidad_seq (OID = 1776238) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_asociartipoentidad_seq
    START WITH 1000000000
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table conf_tipoentidadasociada (OID = 1776240) : 
--
CREATE TABLE mod_logfarmacia.conf_tipoentidadasociada (
    idtipoentidadasociada numeric(19,0) DEFAULT nextval('sec_asociartipoentidad_seq'::regclass) NOT NULL,
    idtipoentidad numeric(19,0),
    idtipounidadsalud numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_datconceptoreteentidad_seq (OID = 1776244) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datconceptoreteentidad_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_conceptoreteentidad (OID = 1776246) : 
--
CREATE TABLE mod_logfarmacia.dat_conceptoreteentidad (
    idconceptoreteentidad numeric(19,0) DEFAULT nextval('sec_datconceptoreteentidad_seq'::regclass) NOT NULL,
    idconceptorete numeric(19,0),
    idestructuracomun numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_datconsultorioentidad_seq (OID = 1776250) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datconsultorioentidad_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_consultorioentidad (OID = 1776252) : 
--
CREATE TABLE mod_logfarmacia.dat_consultorioentidad (
    idconsultorioentidad numeric(19,0) DEFAULT nextval('sec_datconsultorioentidad_seq'::regclass),
    idestructuracomun numeric(19,0),
    idconsultorio numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_dadentregaproducto_seq (OID = 1776256) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_dadentregaproducto_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_entregaproducto (OID = 1776258) : 
--
CREATE TABLE mod_logfarmacia.dat_entregaproducto (
    identregaproducto numeric(19,0) DEFAULT nextval('sec_dadentregaproducto_seq'::regclass) NOT NULL,
    fechaentrega date,
    cantidadentregada numeric(19,4),
    entregadapor varchar(50),
    idproductotarjetamedicamento numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_datgrupofarmacuadrobasico_seq (OID = 1776262) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datgrupofarmacuadrobasico_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_grupofarmcuadrobasico (OID = 1776264) : 
--
CREATE TABLE mod_logfarmacia.dat_grupofarmcuadrobasico (
    idgrupofarmcuadrobasico numeric(19,0) DEFAULT nextval('sec_datgrupofarmacuadrobasico_seq'::regclass) NOT NULL,
    idcuadrobasico numeric(19,0),
    idgrupofm numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_datlineaprodentidad_seq (OID = 1776268) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datlineaprodentidad_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Definition for sequence sec_datlotereenvase_seq (OID = 1776274) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datlotereenvase_seq
    START WITH 1000000000
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_lotereenvase (OID = 1776276) : 
--
CREATE TABLE mod_logfarmacia.dat_lotereenvase (
    idlotereenvase numeric(19,0) DEFAULT nextval('sec_datlotereenvase_seq'::regclass) NOT NULL,
    idprodorigen numeric(19,0),
    cantorigen numeric(25,6),
    dosisunitreal numeric(25,6),
    cantdestino numeric(25,6),
    cantrealreenvasada numeric(25,6),
    diferencia numeric(25,6),
    idlote numeric(19,0) NOT NULL
)
WITH (oids = false);
--
-- Definition for sequence sec_datmotivodevolucionentidad_seq (OID = 1776280) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datmotivodevolucionentidad_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_motivodevolucionentidad (OID = 1776282) : 
--
CREATE TABLE mod_logfarmacia.dat_motivodevolucionentidad (
    idmotivodevolucionentidad numeric(19,0) DEFAULT nextval('sec_datmotivodevolucionentidad_seq'::regclass) NOT NULL,
    idmotivodevolucion numeric(19,0),
    idestructuracomun numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_datpaciente_seq (OID = 1776286) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datpaciente_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_paciente (OID = 1776288) : 
--
CREATE TABLE mod_logfarmacia.dat_paciente (
    idpaciente numeric(19,0) DEFAULT nextval('sec_datpaciente_seq'::regclass) NOT NULL,
    nombreapellidos varchar(50),
    cipaciente varchar(11) NOT NULL,
    nrocasoindice varchar(20),
    dirpaciente varchar(250),
    consultoriomedico varchar(100)
)
WITH (oids = false);
ALTER TABLE ONLY mod_logfarmacia.dat_paciente ALTER COLUMN idpaciente SET STATISTICS 0;
--
-- Definition for sequence sec_prodcalculomaxmin_seq (OID = 1776292) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_prodcalculomaxmin_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_prodcalculomaxmin (OID = 1776294) : 
--
CREATE TABLE mod_logfarmacia.dat_prodcalculomaxmin (
    idproducto numeric(19,0) NOT NULL,
    minimo numeric(25,6),
    maximo numeric(25,6),
    fechainicio date,
    fechafin date,
    fechacargo date,
    estado numeric(1,0) DEFAULT 0,
    calculado numeric(1,0) DEFAULT 0,
    idanalisis numeric(19,0),
    idprodcalculomaxmin numeric(19,0) DEFAULT nextval('sec_prodcalculomaxmin_seq'::regclass) NOT NULL,
    idcodificador numeric(19,0) NOT NULL
)
WITH (oids = false);
--
-- Definition for sequence sec_datprodreenvasado_seq (OID = 1776300) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datprodreenvasado_seq
    START WITH 1000000000
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_prodreenvasado (OID = 1776302) : 
--
CREATE TABLE mod_logfarmacia.dat_prodreenvasado (
    idprodreenvasado numeric(19,0) DEFAULT nextval('sec_datprodreenvasado_seq'::regclass) NOT NULL,
    idproddestino numeric(19,0) NOT NULL,
    cantdestino numeric(25,6),
    idreenvase numeric(19,0),
    idprodorigen numeric(19,0) NOT NULL,
    dosisunitariadestino numeric(25,6)
)
WITH (oids = false);
--
-- Definition for sequence sec_datprodreenvase_seq (OID = 1776306) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datprodreenvase_seq
    START WITH 1000000000
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_prodreenvase (OID = 1776308) : 
--
CREATE TABLE mod_logfarmacia.dat_prodreenvase (
    idprodreenvase numeric(19,0) DEFAULT nextval('sec_datprodreenvase_seq'::regclass) NOT NULL,
    cantorigen numeric(25,6),
    idreenvase numeric(19,0),
    idprodorigen numeric(19,0),
    dosisunitaria numeric(25,6)
)
WITH (oids = false);
--
-- Definition for sequence sec_dadprodtransfinterna_seq (OID = 1776312) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_dadprodtransfinterna_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_prodtransfinterna (OID = 1776314) : 
--
CREATE TABLE mod_logfarmacia.dat_prodtransfinterna (
    idprodtransfinterna numeric(19,0) DEFAULT nextval('sec_dadprodtransfinterna_seq'::regclass) NOT NULL,
    idtransfinterna numeric(19,0),
    idproducto numeric(19,0),
    cantidad numeric(25,6) DEFAULT 0
)
WITH (oids = false);
--
-- Structure for table dat_productosimportar (OID = 1776318) : 
--
CREATE TABLE mod_logfarmacia.dat_productosimportar (
    lab varchar(30),
    codigo varchar(30),
    i numeric(1,0),
    pn numeric(1,0),
    denominacion varchar(255),
    ven varchar(10),
    fcia numeric(1,0),
    fpm numeric(1,0),
    fcea numeric(1,0),
    fcn numeric(1,0),
    fah numeric(1,0),
    uei numeric(1,0),
    p numeric(1,0),
    tc numeric(1,0),
    cme numeric(1,0),
    gf varchar(20),
    sgf varchar(20),
    presentacion varchar(100),
    ppob numeric(25,6) DEFAULT 0,
    procedencia varchar(255),
    descripcion varchar(255),
    pesounidad numeric(19,6),
    temperatura varchar(100),
    nuevomodificado numeric(1,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_dadproductotarjetamedicamento_seq (OID = 1776325) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_dadproductotarjetamedicamento_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_productotarjetamedicamento (OID = 1776327) : 
--
CREATE TABLE mod_logfarmacia.dat_productotarjetamedicamento (
    idproductotarjetamedicamento numeric(19,0) DEFAULT nextval('sec_dadproductotarjetamedicamento_seq'::regclass) NOT NULL,
    idcuadrobasico numeric(19,0),
    idtarjetamedicamento numeric(19,0),
    dosis numeric(19,0),
    fechaemision date,
    fechaexpiracion date,
    origenprescripcion varchar(50),
    nroregistro numeric(19,0),
    especialidad varchar(50),
    aprobado numeric(1,0) DEFAULT 0 NOT NULL
)
WITH (oids = false);
--
-- Structure for table dat_reenvase (OID = 1776332) : 
--
CREATE TABLE mod_logfarmacia.dat_reenvase (
    idreenvase numeric(19,0) NOT NULL,
    fecha date,
    idarea numeric(19,0),
    cantdif numeric(25,6) DEFAULT 0,
    importecosto numeric(25,6),
    importeventa numeric(25,6)
)
WITH (oids = false);
--
-- Definition for sequence sec_datregistrotarjeta_seq (OID = 1776336) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datregistrotarjeta_seq
    START WITH 1000000007
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_registrotarjeta (OID = 1776338) : 
--
CREATE TABLE mod_logfarmacia.dat_registrotarjeta (
    idregistrotarjeta numeric(19,0) DEFAULT nextval('sec_datregistrotarjeta_seq'::regclass) NOT NULL,
    idtarjetamedicamento numeric(19,0) NOT NULL,
    idcodificador numeric(19,0) NOT NULL,
    fechaoperacion date,
    operacion numeric(1,0),
    idproductocambio numeric(19,0),
    dosis numeric(19,0),
    fechaemision date,
    fechaexpiracion date,
    origenprescripcion varchar(50),
    nroregistro numeric(19,0),
    especialidad numeric(50,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_datrotacioncodificador_seq (OID = 1776342) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datrotacioncodificador_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_rotacioncodificador (OID = 1776344) : 
--
CREATE TABLE mod_logfarmacia.dat_rotacioncodificador (
    idrotacioncodificador numeric(19,0) DEFAULT nextval('sec_datrotacioncodificador_seq'::regclass) NOT NULL,
    idrotacionlote numeric(19,0) NOT NULL,
    idproducto numeric(19,0) NOT NULL
)
WITH (oids = false);
--
-- Structure for table dat_rotacionlote (OID = 1776348) : 
--
CREATE TABLE mod_logfarmacia.dat_rotacionlote (
    idrotacionlote numeric(19,0) NOT NULL,
    idtiporotacion numeric(19,0) NOT NULL,
    idorigen numeric(19,0) NOT NULL,
    iddestino numeric(19,0) NOT NULL,
    cantidad numeric(19,0) DEFAULT 0 NOT NULL
)
WITH (oids = false);
--
-- Definition for sequence sec_rotacionproductolote_seq (OID = 1776352) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_rotacionproductolote_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_rotacionproductolote (OID = 1776354) : 
--
CREATE TABLE mod_logfarmacia.dat_rotacionproductolote (
    idrotacionproductolote numeric(19,0) DEFAULT nextval('sec_rotacionproductolote_seq'::regclass) NOT NULL,
    idrotacionlote numeric(19,0) NOT NULL,
    idlote numeric(19,0),
    idproductodestino numeric(19,0),
    idproducto numeric(19,0) NOT NULL,
    tipo numeric(1,0) DEFAULT 1 NOT NULL,
    cantidad numeric(19,0) DEFAULT 0 NOT NULL
)
WITH (oids = false);
--
-- Structure for table dat_tarjetamedicamento (OID = 1776360) : 
--
CREATE TABLE mod_logfarmacia.dat_tarjetamedicamento (
    idtarjetamedicamento numeric(19,0) NOT NULL,
    retrovirales numeric(1,0) DEFAULT 0 NOT NULL,
    nrocasoindice varchar(20),
    idpaciente numeric(19,0),
    consultoriomedico varchar(255),
    area varchar(255)
)
WITH (oids = false);
--
-- Definition for sequence sec_nomtiporotacionareaentidad_seq (OID = 1776367) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomtiporotacionareaentidad_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_tiporotacionareaentidad (OID = 1776369) : 
--
CREATE TABLE mod_logfarmacia.dat_tiporotacionareaentidad (
    idtiporotacionentidad numeric(19,0) DEFAULT nextval('sec_nomtiporotacionareaentidad_seq'::regclass) NOT NULL,
    idtiporotacion numeric(19,0),
    idestructuracomun numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_nomtipotransfinternaentidad_seq (OID = 1776373) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomtipotransfinternaentidad_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_tipotransfinternaentidad (OID = 1776375) : 
--
CREATE TABLE mod_logfarmacia.dat_tipotransfinternaentidad (
    idtipotransfinternaentidad numeric(19,0) DEFAULT nextval('sec_nomtipotransfinternaentidad_seq'::regclass) NOT NULL,
    idtipotransfinterna numeric(19,0),
    idestructuracomun numeric(19,0)
)
WITH (oids = false);
--
-- Structure for table dat_transfinterna (OID = 1776379) : 
--
CREATE TABLE mod_logfarmacia.dat_transfinterna (
    idtransfinterna numeric(19,0) NOT NULL,
    devolucion numeric(1,0) DEFAULT 0 NOT NULL,
    iddeposorigen numeric(19,0),
    iddeposdestino numeric(19,0),
    idconcepretenido numeric(19,0),
    idmotivodevolucion numeric(19,0),
    idtipotransfinterna numeric(19,0),
    idoperacionorigen numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_dattransfinternalote_seq (OID = 1776383) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_dattransfinternalote_seq
    START WITH 1000000000
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_transfinternalote (OID = 1776385) : 
--
CREATE TABLE mod_logfarmacia.dat_transfinternalote (
    idtransfinternalote numeric(19,0) DEFAULT nextval('sec_dattransfinternalote_seq'::regclass) NOT NULL,
    idproducto numeric(19,0),
    idtransfinterna numeric(19,0),
    idlote numeric(19,0),
    cantpasar numeric(19,0) DEFAULT 0,
    idprodtransfinterna numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_datunidadsaluddispensacion_seq (OID = 1776390) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datunidadsaluddispensacion_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table dat_unidadsaluddispensacion (OID = 1776392) : 
--
CREATE TABLE mod_logfarmacia.dat_unidadsaluddispensacion (
    idunidadsaluddispensacion numeric(19,0) DEFAULT nextval('sec_datunidadsaluddispensacion_seq'::regclass) NOT NULL,
    idtipounidadsalud numeric(19,0),
    idtipodispensacion numeric(19,0),
    idcuadrobasico numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_hisproductotarjetamedicamento_seq (OID = 1776396) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_hisproductotarjetamedicamento_seq
    START WITH 1000000000
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table his_productotarjetamedicamento (OID = 1776398) : 
--
CREATE TABLE mod_logfarmacia.his_productotarjetamedicamento (
    idhproductotarjetamedicamento numeric(19,0) DEFAULT nextval('sec_hisproductotarjetamedicamento_seq'::regclass) NOT NULL,
    idcuadrobasico numeric(19,0),
    idtarjetamedicamento numeric(19,0),
    dosis numeric(19,0),
    fechaemision date,
    fechaexpiracion date,
    origenprescripcion varchar(50),
    nroregistro numeric(19,0),
    especialidad varchar(50),
    causa numeric DEFAULT 0 NOT NULL,
    idproductotarjetamedicamento numeric(19,0) NOT NULL
)
WITH (oids = false);
--
-- Definition for sequence sec_nomconceptorete_seq (OID = 1776406) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomconceptorete_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_conceptorete (OID = 1776408) : 
--
CREATE TABLE mod_logfarmacia.nom_conceptorete (
    idconceptorete numeric(19,0) DEFAULT nextval('sec_nomconceptorete_seq'::regclass) NOT NULL,
    denominacion varchar(100),
    estado numeric(1,0) DEFAULT 1 NOT NULL,
    fechainicio date,
    fechafin date,
    codigo varchar(100)
)
WITH (oids = false);
--
-- Definition for sequence sec_nonconsultorio_seq (OID = 1776413) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nonconsultorio_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_consultorio (OID = 1776415) : 
--
CREATE TABLE mod_logfarmacia.nom_consultorio (
    idconsultorio numeric(19,0) DEFAULT nextval('sec_nonconsultorio_seq'::regclass) NOT NULL,
    codigo varchar(50),
    denominacion varchar(255),
    estado numeric(1,0),
    fechainicio date,
    fechafin date
)
WITH (oids = false);
ALTER TABLE ONLY mod_logfarmacia.nom_consultorio ALTER COLUMN codigo SET STATISTICS 0;
--
-- Definition for sequence sec_nomforma_seq (OID = 1776419) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomforma_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_forma (OID = 1776421) : 
--
CREATE TABLE mod_logfarmacia.nom_forma (
    idforma numeric(19,0) DEFAULT nextval('sec_nomforma_seq'::regclass) NOT NULL,
    codigo varchar(100),
    denominacion varchar(255),
    idpadre numeric(19,0),
    idarbol numeric(19,0),
    nivel numeric(19,0),
    estado numeric(1,0) DEFAULT 1 NOT NULL,
    fechainicio date,
    fechafin date,
    parentpath public.ltree,
    ordenizq numeric(19,0),
    ordender numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_nomgrupofm_seq (OID = 1776429) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomgrupofm_seq
    START WITH 1000000000
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_grupofm (OID = 1776431) : 
--
CREATE TABLE mod_logfarmacia.nom_grupofm (
    idgrupofm numeric(19,0) DEFAULT nextval('sec_nomgrupofm_seq'::regclass) NOT NULL,
    codigo varchar(100),
    denominacion varchar(255),
    idpadre numeric(19,0),
    idarbol numeric(19,0),
    nivel numeric(19,0),
    estado numeric(1,0) DEFAULT 1 NOT NULL,
    fechainicio date,
    fechafin date,
    parentpath public.ltree,
    ordenizq numeric(19,0),
    ordender numeric(19,0)
)
WITH (oids = false);
--
-- Definition for sequence sec_nomlineaprod_seq (OID = 1776439) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomlineaprod_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Definition for sequence sec_nommotivodevolucion_seq (OID = 1776447) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nommotivodevolucion_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_motivodevolucion (OID = 1776449) : 
--
CREATE TABLE mod_logfarmacia.nom_motivodevolucion (
    idmotivodevolucion numeric(19,0) DEFAULT nextval('sec_nommotivodevolucion_seq'::regclass) NOT NULL,
    denominacion varchar(100),
    estado numeric(1,0) DEFAULT 1 NOT NULL,
    fechainicio date,
    fechafin date,
    codigo varchar(100)
)
WITH (oids = false);
--
-- Definition for sequence sec_nomtiporotacion_seq (OID = 1776454) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomtiporotacion_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_tiporotacion (OID = 1776456) : 
--
CREATE TABLE mod_logfarmacia.nom_tiporotacion (
    idtiporotacion numeric(19,0) DEFAULT nextval('sec_nomtiporotacion_seq'::regclass) NOT NULL,
    codigo varchar(50),
    denominacion varchar(255),
    automatica numeric(1,0) DEFAULT 0,
    estado numeric(1,0) DEFAULT 1,
    fechainicio date,
    fechafin date
)
WITH (oids = true);
--
-- Definition for sequence sec_nomrotacionarea_seq (OID = 1776462) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomrotacionarea_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_tiporotacionarea (OID = 1776464) : 
--
CREATE TABLE mod_logfarmacia.nom_tiporotacionarea (
    idtiporotacionarea numeric(19,0) DEFAULT nextval('sec_nomrotacionarea_seq'::regclass) NOT NULL,
    idtiporotacion numeric(19,0) NOT NULL,
    iddeposito numeric(19,0) NOT NULL,
    fechainicio date,
    fechafin date
)
WITH (oids = false);
--
-- Definition for sequence sec_nomtipotransfinterna_seq (OID = 1776468) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomtipotransfinterna_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_tipotransfinterna (OID = 1776470) : 
--
CREATE TABLE mod_logfarmacia.nom_tipotransfinterna (
    idtipotransfinterna numeric(19,0) DEFAULT nextval('sec_nomtipotransfinterna_seq'::regclass) NOT NULL,
    codigo varchar(50),
    denominacion varchar(255),
    automatica numeric(1,0) DEFAULT 0,
    estado numeric(1,0) DEFAULT 1,
    fechainicio date,
    fechafin date,
    pordefecto numeric(1,0) DEFAULT 0
)
WITH (oids = true);
--
-- Definition for sequence sec_nomtipotransfinternaarea_seq (OID = 1776477) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_nomtipotransfinternaarea_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Structure for table nom_tipotransfinternaarea (OID = 1776479) : 
--
CREATE TABLE mod_logfarmacia.nom_tipotransfinternaarea (
    idtipotransfinternaarea numeric(19,0) DEFAULT nextval('sec_nomtipotransfinternaarea_seq'::regclass) NOT NULL,
    idtipotransfinterna numeric(19,0) NOT NULL,
    iddeposito numeric(19,0) NOT NULL,
    fechainicio date,
    fechafin date
)
WITH (oids = false);
--
-- Definition for sequence sec_dadmaxminanalisis_seq (OID = 1776483) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_dadmaxminanalisis_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Definition for sequence sec_dadtarjetamedicamento_seq (OID = 1776485) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_dadtarjetamedicamento_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Definition for sequence sec_datreenvase_seq (OID = 1776487) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_datreenvase_seq
    START WITH 1000000000
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Definition for sequence sec_hiseprodcalculomaxmin_seq (OID = 1776489) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_hiseprodcalculomaxmin_seq
    START WITH 1000000001
    INCREMENT BY 1
    MAXVALUE 1099999999
    MINVALUE 1000000000
    CACHE 1;
--
-- Definition for sequence sec_registromaxmin_seq (OID = 1776491) : 
--
CREATE SEQUENCE mod_logfarmacia.sec_registromaxmin_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 1099999999
    NO MINVALUE
    CACHE 1;
--
-- Data for table mod_logfarmacia.nom_forma (OID = 1776421) (LIMIT 0,23)
--
INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000018, '0102', 'Tabletas o comprimidos', 1000000014, NULL, NULL, 1, '2018-05-02', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000023, '0301', 'Soluciones', 1000000022, NULL, NULL, 1, '2018-05-02', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000012, '0201', 'dd', 1000000010, NULL, NULL, 1, '2018-04-11', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000008, 'C3', 'Inyecciones', 1000000001, NULL, NULL, 1, '2018-04-11', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000009, 'C4', 'Jarabes', 1000000001, NULL, NULL, 1, '2018-04-11', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000024, '04', 'GASEOSAS', 1000000024, 1000000024, 1, 1, '2018-05-02', NULL, '1000000024', 1, 4);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000025, '0401', 'Aerosoles', 1000000024, 1000000024, 2, 1, '2018-05-02', NULL, '1000000024.1000000025', 2, 3);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000026, '0302', 'Tituras', 1000000022, NULL, NULL, 1, '2018-05-02', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000027, '0303', 'Colirios', 1000000022, NULL, NULL, 1, '2018-05-02', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000028, '0304', 'Lociones', 1000000022, NULL, NULL, 1, '2018-05-02', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000029, '0305', 'Suspensiones', 1000000022, NULL, NULL, 1, '2018-05-02', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000030, '0306', 'Emulsiones', 1000000022, 1000000022, 2, 1, '2018-05-02', NULL, '1000000022.1000000030', 2, 3);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000022, '03', 'LÍQUIDAS', 1000000022, 1000000022, 1, 1, '2018-05-02', NULL, '1000000022', 1, 6);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000031, '0307', 'Extractos fluidos', 1000000022, 1000000022, 2, 1, '2018-05-02', NULL, '1000000022.1000000031', 4, 5);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000032, '0203', 'Pomadas', 1000000019, 1000000019, 2, 1, '2018-05-02', NULL, '1000000019.1000000032', 2, 3);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000044, '0105', 'Papeles', 1000000014, NULL, NULL, 1, '2018-06-15', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000033, '0103', 'Polvos', 1000000014, NULL, NULL, 1, '2018-05-02', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000034, '0104', 'Cápsulas', 1000000014, NULL, NULL, 1, '2018-05-02', NULL, NULL, NULL, NULL);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000019, '02', 'SEMISOLIDAS', 1000000019, 1000000019, 1, 1, '2018-05-02', NULL, '1000000019', 1, 6);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000020, '0202', 'Pastas', 1000000019, 1000000019, 2, 1, '2018-05-02', NULL, '1000000019.1000000020', 4, 5);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000046, '0107', 'Extractos sólidos', 1000000014, 1000000014, 2, 1, '2018-06-15', NULL, '1000000014.1000000046', 2, 3);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000014, '01', 'SOLIDAS', 1000000014, 1000000014, 1, 1, '2018-04-11', NULL, '1000000014', 1, 6);

INSERT INTO nom_forma (idforma, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000047, '0108', 'Supositorios', 1000000014, 1000000014, 2, 1, '2018-06-15', NULL, '1000000014.1000000047', 4, 5);

--
-- Data for table mod_logfarmacia.nom_grupofm (OID = 1776431) (LIMIT 0,118)
--
INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000035, '4,1', 'No específicos', 1000000003, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000003, '4', 'Antídotos y otras sustancias utilizadas en intoxicaciones, envenenamientos', 1000000003, 1000000003, 1, 1, '2018-06-01', NULL, '1000000003', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000036, '4,2', 'Específicos', 1000000003, 1000000003, 2, 1, '2018-06-01', NULL, '1000000003.1000000036', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000037, '6,1', 'Antiparasitarios', 1000000005, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000051, '12,3', 'Antihipertensivos', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000038, '6,2', 'Antibacterianos/', 1000000005, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000039, '6,3', 'Antimicóticos', 1000000005, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000005, '6', 'Antiinfecciosos: Antiparasitarios, Antibacterianos, Antituberculosos, Antileprosos, Antimicóticos, Antivirales', 1000000005, 1000000005, 1, 1, '2018-06-01', NULL, '1000000005', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000040, '6,4', 'Antivirales', 1000000005, 1000000005, 2, 1, '2018-06-01', NULL, '1000000005.1000000040', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000041, '8,1', 'Inmunosupresores', 1000000007, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000042, '8,2', 'Antineoplásicos/', 1000000007, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000043, '8,3', 'Hormonas  y antihormonas', 1000000007, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000002, '3', 'Antialérgicos', 1000000002, 1000000002, 1, 1, '2018-06-01', NULL, '1000000002', 1, 2);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000004, '5', 'Anticonvulsivos/ Antiepilépticos', 1000000004, 1000000004, 1, 1, '2018-06-01', NULL, '1000000004', 1, 2);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000006, '7', 'Antimigrañosos', 1000000006, 1000000006, 1, 1, '2018-06-01', NULL, '1000000006', 1, 2);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000008, '9', 'Antiparkinsonianos', 1000000008, 1000000008, 1, 1, '2018-06-01', NULL, '1000000008', 1, 2);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000015, '16', 'Diuréticos', 1000000015, 1000000015, 1, 1, '2018-06-01', NULL, '1000000015', 1, 2);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000019, '20', 'Relajantes musculares e inhibidores de la colinesterasa', 1000000019, 1000000019, 1, 1, '2018-06-01', NULL, '1000000019', 1, 2);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000022, '23', 'Solución de diálisis peritoneal', 1000000022, 1000000022, 1, 1, '2018-06-01', NULL, '1000000022', 1, 2);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000027, '28', 'Medicamentos que actúan en el sistema genitourinario', 1000000027, 1000000027, 1, 1, '2018-06-01', NULL, '1000000027', 1, 2);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000028, '1,1', 'Anestésicos generales', 1000000000, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000029, '1,2', 'Anestésicos locales', 1000000000, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000000, '1', 'Anestésicos, Generales, locales y coadyuvantes de la anestesia', 1000000000, 1000000000, 1, 1, '2018-06-01', NULL, '1000000000', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000030, '1,3', 'Coadyuvantes de la anestesia, medicación preoperatoria  y sedación para procedimientos de corto tiempo', 1000000000, 1000000000, 2, 1, '2018-06-01', NULL, '1000000000.1000000030', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000031, '2,1', 'Analgésicos no opiodes ', 1000000001, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000032, '2,2', 'Analgésicos opiodes ', 1000000001, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000033, '2,3', 'Antigotosos ', 1000000001, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000001, '2', 'Analgésicos, opiodes, no opiodes, antipiréticos, antiinflamatorios no esteroides, antigotosos  y antirreumáticos', 1000000001, 1000000001, 1, 1, '2018-06-01', NULL, '1000000001', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000034, '2,4', 'Agentes modificadores de los trastornos reumatoideos', 1000000001, 1000000001, 2, 1, '2018-06-01', NULL, '1000000001.1000000034', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000007, '8', 'Antineoplásicos, inmunosupresores y medicamentos utilizados en los cuidados paliativos, Hormonas, inmunomoduladores y Antieméticos ', 1000000007, 1000000007, 1, 1, '2018-06-01', NULL, '1000000007', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000044, '8,4', 'Medicamentos usados en cuidados paliativos', 1000000007, 1000000007, 2, 1, '2018-06-01', NULL, '1000000007.1000000044', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000045, '10,1', 'Antianémicos', 1000000009, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000009, '10', 'Medicamentos que afectan a la sangre Antianémicos y modificadores de la coagulación', 1000000009, 1000000009, 1, 1, '2018-06-01', NULL, '1000000009', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000046, '10,2', 'Modificadores de la coagulación', 1000000009, 1000000009, 2, 1, '2018-06-01', NULL, '1000000009.1000000046', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000047, '11,1', 'Sustitutos del plasma', 1000000010, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000010, '11', 'Productos sanguíneos y sustitutos  del plasma', 1000000010, 1000000010, 1, 1, '2018-06-01', NULL, '1000000010', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000048, '11,2', 'Fracciones plasmáticas para usos específicos', 1000000010, 1000000010, 2, 1, '2018-06-01', NULL, '1000000010.1000000048', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000049, '12,1', 'Antianginosos ', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000050, '12,2', 'Antiarrítmicos', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000052, '12,4', 'Medicamentos utilizados en la insuficiencia cardíaca Glucósidos cardíacos/', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000053, '12,5', 'Medicamentos antitrombóticos', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000054, '12,6', 'Medicamentos que reducen los lípidos', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000055, '12,7', 'Medicamentos usados en casos de choque vascular', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000056, '12,8', 'Medicamentos usados en trastornos vasculares periféricos', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000057, '12,9', 'Otros capilarotróficos', 1000000011, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000011, '12', 'Medicamentos cardiovasculares: Antianginosos, Antiarritmicos, Antihipertensivos, Medicamentos usados para la Insuficiencia cardiaca, Antitromboticos, reductores de lipidos, choque vascular, trastornos vasculares periféricos y otras afecciones cardiovascul', 1000000011, 1000000011, 1, 1, '2018-06-01', NULL, '1000000011', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000058, '12,10', 'Otros medicamentos utilizados en afecciones cardiovasculares', 1000000011, 1000000011, 2, 1, '2018-06-01', NULL, '1000000011.1000000058', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000059, '13,1', 'Antimicóticos', 1000000012, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000060, '13,2', 'Antiinfecciosos', 1000000012, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000061, '13,3', 'Antiinflamatorios y antipruriginosos', 1000000012, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000062, '13,4', 'Fármacos que alteran la diferenciación y la proliferación cutáneas', 1000000012, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000063, '13,5', 'Champúes y otras preparaciones para enfermedades del cuero cabelludo y del cabello ', 1000000012, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000064, '13,6', 'Escabicidas y pediculicidas', 1000000012, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000012, '13', 'Medicamentos dermatológicos (tópicos): Antimicóticos, Antiinfecciosos, Antiinflamatorios, champues o enfermedades del cuero cabelludo, Escabicidas y pediculicidas, otros productos dermatológicos', 1000000012, 1000000012, 1, 1, '2018-06-01', NULL, '1000000012', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000065, '13,7', 'Otros productos dermatológicos', 1000000012, 1000000012, 2, 1, '2018-06-01', NULL, '1000000012.1000000065', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000066, '14,1', 'Preparados oftálmicos ', 1000000013, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000067, '14,2', 'Sustancias de radiocontraste', 1000000013, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000013, '14', 'Sustancias de radiocontraste: Preparados oftálmicos, otros agentes para diagnósticos', 1000000013, 1000000013, 1, 1, '2018-06-01', NULL, '1000000013', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000068, '14,3', 'Otros agentes para diagnóstico/', 1000000013, 1000000013, 2, 1, '2018-06-01', NULL, '1000000013.1000000068', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000069, '15,1', 'Antisépticos', 1000000014, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000014, '15', 'Desinfectantes y antisépticos', 1000000014, 1000000014, 1, 1, '2018-06-01', NULL, '1000000014', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000070, '15,2', 'Desinfectantes ', 1000000014, 1000000014, 2, 1, '2018-06-01', NULL, '1000000014.1000000070', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000071, '17,5', 'Antiespasmódicos', 1000000016, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000072, '17,1', 'Antiácidos y otros antiulcerosos', 1000000016, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000073, '17,2', 'Antieméticos', 1000000016, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000074, '17,3', 'Antihemorroidales', 1000000016, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000075, '17,4', 'Antiinflamatorios', 1000000016, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000076, '17,6', 'Catárticos y laxantes', 1000000016, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000077, '17,7', 'Medicamentos usados en diarreas', 1000000016, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000016, '17', 'Medicamentos gastrointestinales: Antiácidos, Antiulcerosos, Antieméticos, Antihemorroidales, Antiinflamatorios, Antiespasmódicos, Catárticos y laxantes, Antidiarreicos y otros', 1000000016, 1000000016, 1, 1, '2018-06-01', NULL, '1000000016', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000078, '17,8', 'Otros', 1000000016, 1000000016, 2, 1, '2018-06-01', NULL, '1000000016.1000000078', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000079, '18,1', 'Hormonas adrenales y sustitutivos sintéticos', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000080, '18,2', 'Andrógenos y esteroides anabólicos', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000081, '18,3', 'Anticonceptivos hormonales', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000082, '18,4', 'Estrógenos', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000083, '18,5', 'Insulina y otros agentes antidiabéticos', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000084, '18,6', 'Inductores de la ovulación', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000085, '18,7', 'Progestágenos', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000086, '18,8', 'Hormonas tiroideas y sustancias antitiroideas', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000087, '18,9', 'Inhibidores de prolactina', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000088, '18,10', 'Gonadotropina', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000089, '18,11', 'Fármacos que afectan el metabolismo del hueso', 1000000017, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000017, '18', 'Hormonas, otros agentes endocrinos y anticonceptivos, fármacos que afectan el metabolismo del hueso y otras hormonas y análogos', 1000000017, 1000000017, 1, 1, '2018-06-01', NULL, '1000000017', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000090, '18,12', 'Otras hormonas', 1000000017, 1000000017, 2, 1, '2018-06-01', NULL, '1000000017.1000000090', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000091, '19,1', 'Agentes de diagnósticos', 1000000018, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000092, '19,2', 'Sueros e inmunoglobulinas', 1000000018, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000093, '19,3', 'Vacunas', 1000000018, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000094, '19,3,1', 'Inmunización general', 1000000018, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000095, '19,3,2', 'Para grupos específicos de individuos', 1000000018, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000018, '19', 'Productos inmunológicos: Agentes diagnósticos, sueros e inmunoglobulinas, Vacunas preventivas, inmunoestimulantes', 1000000018, 1000000018, 1, 1, '2018-06-01', NULL, '1000000018', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000096, '19,4', 'Inmunoestimulantes', 1000000018, 1000000018, 2, 1, '2018-06-01', NULL, '1000000018.1000000096', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000097, '21,1', 'Agentes antiinfecciosos ', 1000000020, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000098, '21,2', 'Antiinflamatorios', 1000000020, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000099, '21,3', 'Anestésicos locales', 1000000020, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000100, '21,4', 'Antiglaucomatosos y mióticos', 1000000020, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000101, '21,5', 'Midriáticos y ciclopléjicos', 1000000020, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000020, '21', 'Preparados oftalmológicas', 1000000020, 1000000020, 1, 1, '2018-06-01', NULL, '1000000020', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000102, '21,6', 'Otros', 1000000020, 1000000020, 2, 1, '2018-06-01', NULL, '1000000020.1000000102', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000103, '22,1', 'Oxitócicos', 1000000021, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000021, '22', 'Oxitócicos y antioxitócicos', 1000000021, 1000000021, 1, 1, '2018-06-01', NULL, '1000000021', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000104, '22,2', 'Antioxitócicos', 1000000021, 1000000021, 2, 1, '2018-06-01', NULL, '1000000021.1000000104', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000105, '24,1', 'Antipsicóticos', 1000000023, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000106, '24,2', 'Medicamentos para desórdenes afectivos ', 1000000023, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000107, '24,2,1', 'Desórdenes depresivos', 1000000023, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000108, '24,2,2', 'Desórdenes bipolares', 1000000023, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000109, '24,3', 'Sedantes y ansiolíticos', 1000000023, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000110, '24,4', 'Psicoestimulantes', 1000000023, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000023, '24', 'Psicofármaco', 1000000023, 1000000023, 1, 1, '2018-06-01', NULL, '1000000023', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000111, '24,5', 'Fármacos utilizados en la dependencia de sustancias', 1000000023, 1000000023, 2, 1, '2018-06-01', NULL, '1000000023.1000000111', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000112, '25,1', 'Antiasmáticos', 1000000024, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000113, '25,2', 'Antitusígenos', 1000000024, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000024, '25', 'Medicamentos que actúan en el aparato respiratorio', 1000000024, 1000000024, 1, 1, '2018-06-01', NULL, '1000000024', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000114, '25,3', 'Otros medicamentos para vías respiratorias', 1000000024, 1000000024, 2, 1, '2018-06-01', NULL, '1000000024.1000000114', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000115, '26,1', 'Orales', 1000000025, NULL, NULL, 1, '2018-06-01', NULL, NULL, NULL, NULL);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000025, '26', 'Soluciones correctoras de los trastornos hidroelectrolíticos y del equilibrio ácido básico', 1000000025, 1000000025, 1, 1, '2018-06-01', NULL, '1000000025', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000116, '26,2', 'Parenterales', 1000000025, 1000000025, 2, 1, '2018-06-01', NULL, '1000000025.1000000116', 2, 3);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000026, '27', 'Vitaminas y Nutrientes', 1000000026, 1000000026, 1, 1, '2018-06-01', NULL, '1000000026', 1, 4);

INSERT INTO nom_grupofm (idgrupofm, codigo, denominacion, idpadre, idarbol, nivel, estado, fechainicio, fechafin, parentpath, ordenizq, ordender)
VALUES (1000000117, '27,1', 'Otros nutrientes', 1000000026, 1000000026, 2, 1, '2018-06-01', NULL, '1000000026.1000000117', 2, 3);

--
-- Definition for index conf_cuadrobasico_idx1 (OID = 1776493) : 
--
CREATE INDEX conf_cuadrobasico_idx1 ON conf_cuadrobasico USING btree (idindicador);
--
-- Definition for index dat_prodreenvase_idprodorigen_key (OID = 1776494) : 
--
CREATE UNIQUE INDEX dat_prodreenvase_idprodorigen_key ON dat_prodreenvase USING btree (idprodorigen);
--
-- Definition for index dat_prodreenvasado_idproddestino_key (OID = 1776495) : 
--
CREATE UNIQUE INDEX dat_prodreenvasado_idproddestino_key ON dat_prodreenvasado USING btree (idproddestino);
--
-- Definition for index ak_rotacionlote_codificador (OID = 1776496) : 
--
ALTER TABLE ONLY dat_rotacioncodificador
    ADD CONSTRAINT ak_rotacionlote_codificador
    UNIQUE (idrotacionlote, idproducto);
--
-- Definition for index conf_cuadrobasico_new_pkey (OID = 1776498) : 
--
ALTER TABLE ONLY conf_cuadrobasico_new
    ADD CONSTRAINT conf_cuadrobasico_new_pkey
    PRIMARY KEY (idcuadrobasico);
--
-- Definition for index conf_cuadrobasico_pkey (OID = 1776500) : 
--
ALTER TABLE ONLY conf_cuadrobasico
    ADD CONSTRAINT conf_cuadrobasico_pkey
    PRIMARY KEY (idcuadrobasico);
--
-- Definition for index conf_tipoentidadasociada_idtipoentidad_key (OID = 1776502) : 
--
ALTER TABLE ONLY conf_tipoentidadasociada
    ADD CONSTRAINT conf_tipoentidadasociada_idtipoentidad_key
    UNIQUE (idtipoentidad);
--
-- Definition for index conf_tipoentidadasociada_pkey (OID = 1776504) : 
--
ALTER TABLE ONLY conf_tipoentidadasociada
    ADD CONSTRAINT conf_tipoentidadasociada_pkey
    PRIMARY KEY (idtipoentidadasociada);
--
-- Definition for index dat_entregaproducto_pkey (OID = 1776506) : 
--
ALTER TABLE ONLY dat_entregaproducto
    ADD CONSTRAINT dat_entregaproducto_pkey
    PRIMARY KEY (identregaproducto);
--
-- Definition for index dat_grupofarmcuadrobasico_pkey (OID = 1776508) : 
--
ALTER TABLE ONLY dat_grupofarmcuadrobasico
    ADD CONSTRAINT dat_grupofarmcuadrobasico_pkey
    PRIMARY KEY (idgrupofarmcuadrobasico);
--
-- Definition for index dat_idrotacioncodificador_pkey (OID = 1776510) : 
--
ALTER TABLE ONLY dat_rotacioncodificador
    ADD CONSTRAINT dat_idrotacioncodificador_pkey
    PRIMARY KEY (idrotacioncodificador);
--
-- Definition for index dat_idrotacionproductolote_pkey (OID = 1776512) : 
--
ALTER TABLE ONLY dat_rotacionproductolote
    ADD CONSTRAINT dat_idrotacionproductolote_pkey
    PRIMARY KEY (idrotacionproductolote);
--
-- Definition for index dat_paciente_pkey (OID = 1776514) : 
--
ALTER TABLE ONLY dat_paciente
    ADD CONSTRAINT dat_paciente_pkey
    PRIMARY KEY (idpaciente);
--
-- Definition for index dat_prodcalculomaxmin_pkey (OID = 1776516) : 
--
ALTER TABLE ONLY dat_prodcalculomaxmin
    ADD CONSTRAINT dat_prodcalculomaxmin_pkey
    PRIMARY KEY (idprodcalculomaxmin);
--
-- Definition for index dat_productotarjetamedicamento_historia_datproductotarjetamedic (OID = 1776518) : 
--
ALTER TABLE ONLY his_productotarjetamedicamento
    ADD CONSTRAINT dat_productotarjetamedicamento_historia_datproductotarjetamedic
    PRIMARY KEY (idhproductotarjetamedicamento);
--
-- Definition for index dat_registrotarjeta_pkey (OID = 1776520) : 
--
ALTER TABLE ONLY dat_registrotarjeta
    ADD CONSTRAINT dat_registrotarjeta_pkey
    PRIMARY KEY (idregistrotarjeta);
--
-- Definition for index dat_rotacionlote_pkey (OID = 1776522) : 
--
ALTER TABLE ONLY dat_rotacionlote
    ADD CONSTRAINT dat_rotacionlote_pkey
    PRIMARY KEY (idrotacionlote);
--
-- Definition for index dat_tarjetamedicamento_pkey (OID = 1776524) : 
--
ALTER TABLE ONLY dat_tarjetamedicamento
    ADD CONSTRAINT dat_tarjetamedicamento_pkey
    PRIMARY KEY (idtarjetamedicamento);
--
-- Definition for index dat_transfinterna_pkey (OID = 1776526) : 
--
ALTER TABLE ONLY dat_transfinterna
    ADD CONSTRAINT dat_transfinterna_pkey
    PRIMARY KEY (idtransfinterna);
--
-- Definition for index dat_unidadsaluddispensacion_pkey (OID = 1776528) : 
--
ALTER TABLE ONLY dat_unidadsaluddispensacion
    ADD CONSTRAINT dat_unidadsaluddispensacion_pkey
    PRIMARY KEY (idunidadsaluddispensacion);
--
-- Definition for index datprodtransfinterna_pkey (OID = 1776530) : 
--
ALTER TABLE ONLY dat_prodtransfinterna
    ADD CONSTRAINT datprodtransfinterna_pkey
    PRIMARY KEY (idprodtransfinterna);
--
-- Definition for index datproductotarjetamedicamento_pkey (OID = 1776532) : 
--
ALTER TABLE ONLY dat_productotarjetamedicamento
    ADD CONSTRAINT datproductotarjetamedicamento_pkey
    PRIMARY KEY (idproductotarjetamedicamento);
--
-- Definition for index nom_consultorio_pkey (OID = 1776534) : 
--
ALTER TABLE ONLY nom_consultorio
    ADD CONSTRAINT nom_consultorio_pkey
    PRIMARY KEY (idconsultorio);
--
-- Definition for index nom_motivodevolucion_pkey (OID = 1776536) : 
--
ALTER TABLE ONLY nom_motivodevolucion
    ADD CONSTRAINT nom_motivodevolucion_pkey
    PRIMARY KEY (idmotivodevolucion);
--
-- Definition for index pk_anno (OID = 1776538) : 
--
ALTER TABLE ONLY conf_anno
    ADD CONSTRAINT pk_anno
    PRIMARY KEY (idanno);
--
-- Definition for index pk_conceptorete (OID = 1776540) : 
--
ALTER TABLE ONLY nom_conceptorete
    ADD CONSTRAINT pk_conceptorete
    PRIMARY KEY (idconceptorete);
--
-- Definition for index pk_conceptoreteentidad (OID = 1776542) : 
--
ALTER TABLE ONLY dat_conceptoreteentidad
    ADD CONSTRAINT pk_conceptoreteentidad
    PRIMARY KEY (idconceptoreteentidad);
--
-- Definition for index pk_forma (OID = 1776544) : 
--
ALTER TABLE ONLY nom_forma
    ADD CONSTRAINT pk_forma
    PRIMARY KEY (idforma);
--
-- Definition for index pk_generalfm (OID = 1776546) : 
--
ALTER TABLE ONLY conf_generalfm
    ADD CONSTRAINT pk_generalfm
    PRIMARY KEY (idgeneralfm);
--
-- Definition for index pk_grupofm (OID = 1776548) : 
--
ALTER TABLE ONLY nom_grupofm
    ADD CONSTRAINT pk_grupofm
    PRIMARY KEY (idgrupofm);
--
-- Definition for index pk_lotereenvase (OID = 1776554) : 
--
ALTER TABLE ONLY dat_lotereenvase
    ADD CONSTRAINT pk_lotereenvase
    PRIMARY KEY (idlotereenvase);
--
-- Definition for index pk_prodreenvasado (OID = 1776556) : 
--
ALTER TABLE ONLY dat_prodreenvasado
    ADD CONSTRAINT pk_prodreenvasado
    PRIMARY KEY (idprodreenvasado);
--
-- Definition for index pk_prodreenvase (OID = 1776558) : 
--
ALTER TABLE ONLY dat_prodreenvase
    ADD CONSTRAINT pk_prodreenvase
    PRIMARY KEY (idprodreenvase);
--
-- Definition for index pk_reenvase (OID = 1776560) : 
--
ALTER TABLE ONLY dat_reenvase
    ADD CONSTRAINT pk_reenvase
    PRIMARY KEY (idreenvase);
--
-- Definition for index pk_tiporotacion (OID = 1776562) : 
--
ALTER TABLE ONLY nom_tiporotacion
    ADD CONSTRAINT pk_tiporotacion
    PRIMARY KEY (idtiporotacion);
--
-- Definition for index pk_tiporotacionarea (OID = 1776564) : 
--
ALTER TABLE ONLY nom_tiporotacionarea
    ADD CONSTRAINT pk_tiporotacionarea
    PRIMARY KEY (idtiporotacionarea);
--
-- Definition for index pk_tiporotacionareaentidad (OID = 1776566) : 
--
ALTER TABLE ONLY dat_tiporotacionareaentidad
    ADD CONSTRAINT pk_tiporotacionareaentidad
    PRIMARY KEY (idtiporotacionentidad);
--
-- Definition for index pk_tipotransfinterna (OID = 1776568) : 
--
ALTER TABLE ONLY nom_tipotransfinterna
    ADD CONSTRAINT pk_tipotransfinterna
    PRIMARY KEY (idtipotransfinterna);
--
-- Definition for index pk_tipotransfinternaarea (OID = 1776570) : 
--
ALTER TABLE ONLY nom_tipotransfinternaarea
    ADD CONSTRAINT pk_tipotransfinternaarea
    PRIMARY KEY (idtipotransfinternaarea);
--
-- Definition for index pk_tipotransfinternaentidad (OID = 1776572) : 
--
ALTER TABLE ONLY dat_tipotransfinternaentidad
    ADD CONSTRAINT pk_tipotransfinternaentidad
    PRIMARY KEY (idtipotransfinternaentidad);
--
-- Definition for index pk_transfinternalote (OID = 1776574) : 
--
ALTER TABLE ONLY dat_transfinternalote
    ADD CONSTRAINT pk_transfinternalote
    PRIMARY KEY (idtransfinternalote);
--
-- Definition for index conf_cuadrobasico_fk (OID = 1776576) : 
--
ALTER TABLE ONLY conf_cuadrobasico
    ADD CONSTRAINT conf_cuadrobasico_fk
    FOREIGN KEY (idpadre) REFERENCES conf_cuadrobasico(idcuadrobasico) ON DELETE CASCADE;
--
-- Definition for index conf_cuadrobasico_fk1 (OID = 1776581) : 
--
ALTER TABLE ONLY conf_cuadrobasico
    ADD CONSTRAINT conf_cuadrobasico_fk1
    FOREIGN KEY (idproveedor) REFERENCES mod_datosmaestros.nom_clientesproveedor(idclientesproveedores) ON DELETE RESTRICT;
--
-- Definition for index conf_cuadrobasico_new_fk (OID = 1776586) : 
--
ALTER TABLE ONLY conf_cuadrobasico_new
    ADD CONSTRAINT conf_cuadrobasico_new_fk
    FOREIGN KEY (idpadre) REFERENCES conf_cuadrobasico(idcuadrobasico) ON DELETE CASCADE;
--
-- Definition for index conf_cuadrobasico_new_fk1 (OID = 1776591) : 
--
ALTER TABLE ONLY conf_cuadrobasico_new
    ADD CONSTRAINT conf_cuadrobasico_new_fk1
    FOREIGN KEY (idproveedor) REFERENCES mod_datosmaestros.nom_clientesproveedor(idclientesproveedores) ON DELETE RESTRICT;
--
-- Definition for index dat_entregaproducto_fk (OID = 1776596) : 
--
ALTER TABLE ONLY dat_entregaproducto
    ADD CONSTRAINT dat_entregaproducto_fk
    FOREIGN KEY (idproductotarjetamedicamento) REFERENCES dat_productotarjetamedicamento(idproductotarjetamedicamento) ON DELETE CASCADE;
--
-- Definition for index dat_grupofarmcuadrobasico_fk (OID = 1776601) : 
--
ALTER TABLE ONLY dat_grupofarmcuadrobasico
    ADD CONSTRAINT dat_grupofarmcuadrobasico_fk
    FOREIGN KEY (idcuadrobasico) REFERENCES conf_cuadrobasico(idcuadrobasico) ON DELETE CASCADE;
--
-- Definition for index dat_grupofarmcuadrobasico_fk1 (OID = 1776606) : 
--
ALTER TABLE ONLY dat_grupofarmcuadrobasico
    ADD CONSTRAINT dat_grupofarmcuadrobasico_fk1
    FOREIGN KEY (idgrupofm) REFERENCES nom_grupofm(idgrupofm) ON DELETE RESTRICT;
--
-- Definition for index dat_prodcalculomaxmin_fk (OID = 1776611) : 
--
ALTER TABLE ONLY dat_prodcalculomaxmin
    ADD CONSTRAINT dat_prodcalculomaxmin_fk
    FOREIGN KEY (idproducto) REFERENCES mod_logistica.dat_producto(idproducto) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index dat_prodreenvase_fk (OID = 1776616) : 
--
ALTER TABLE ONLY dat_prodreenvase
    ADD CONSTRAINT dat_prodreenvase_fk
    FOREIGN KEY (idprodorigen) REFERENCES mod_logistica.dat_producto(idproducto) ON DELETE CASCADE;
--
-- Definition for index dat_prodtransfinterna_fk (OID = 1776621) : 
--
ALTER TABLE ONLY dat_prodtransfinterna
    ADD CONSTRAINT dat_prodtransfinterna_fk
    FOREIGN KEY (idtransfinterna) REFERENCES dat_transfinterna(idtransfinterna) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index dat_productotarjetamedicamento_fk (OID = 1776626) : 
--
ALTER TABLE ONLY dat_productotarjetamedicamento
    ADD CONSTRAINT dat_productotarjetamedicamento_fk
    FOREIGN KEY (idtarjetamedicamento) REFERENCES dat_tarjetamedicamento(idtarjetamedicamento) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index dat_productotarjetamedicamento_fk1 (OID = 1776631) : 
--
ALTER TABLE ONLY dat_productotarjetamedicamento
    ADD CONSTRAINT dat_productotarjetamedicamento_fk1
    FOREIGN KEY (idcuadrobasico) REFERENCES conf_cuadrobasico(idcuadrobasico) ON UPDATE RESTRICT ON DELETE RESTRICT;
--
-- Definition for index dat_registrotarjeta_fk (OID = 1776636) : 
--
ALTER TABLE ONLY dat_registrotarjeta
    ADD CONSTRAINT dat_registrotarjeta_fk
    FOREIGN KEY (idtarjetamedicamento) REFERENCES dat_tarjetamedicamento(idtarjetamedicamento) ON DELETE CASCADE;
--
-- Definition for index dat_rotacioncodificador_fk (OID = 1776641) : 
--
ALTER TABLE ONLY dat_rotacioncodificador
    ADD CONSTRAINT dat_rotacioncodificador_fk
    FOREIGN KEY (idrotacionlote) REFERENCES dat_rotacionlote(idrotacionlote) ON DELETE CASCADE;
--
-- Definition for index dat_rotacionproductolote_fk (OID = 1776646) : 
--
ALTER TABLE ONLY dat_rotacionproductolote
    ADD CONSTRAINT dat_rotacionproductolote_fk
    FOREIGN KEY (idrotacionlote) REFERENCES dat_rotacionlote(idrotacionlote) ON DELETE CASCADE;
--
-- Definition for index dat_rotacionproductolote_fk3 (OID = 1776651) : 
--
ALTER TABLE ONLY dat_rotacionproductolote
    ADD CONSTRAINT dat_rotacionproductolote_fk3
    FOREIGN KEY (idproductodestino) REFERENCES mod_logistica.dat_producto(idproducto);
--
-- Definition for index dat_tarjetamedicamento_fk (OID = 1776656) : 
--
ALTER TABLE ONLY dat_tarjetamedicamento
    ADD CONSTRAINT dat_tarjetamedicamento_fk
    FOREIGN KEY (idtarjetamedicamento) REFERENCES mod_logistica.dat_documento(iddocumento) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index dat_transfinterna_fk (OID = 1776661) : 
--
ALTER TABLE ONLY dat_transfinterna
    ADD CONSTRAINT dat_transfinterna_fk
    FOREIGN KEY (idtransfinterna) REFERENCES mod_logistica.dat_documento(iddocumento) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index dat_transfinterna_fk1 (OID = 1776666) : 
--
ALTER TABLE ONLY dat_transfinterna
    ADD CONSTRAINT dat_transfinterna_fk1
    FOREIGN KEY (iddeposorigen) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index dat_transfinterna_fk2 (OID = 1776671) : 
--
ALTER TABLE ONLY dat_transfinterna
    ADD CONSTRAINT dat_transfinterna_fk2
    FOREIGN KEY (iddeposdestino) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index dat_transfinterna_fk3 (OID = 1776676) : 
--
ALTER TABLE ONLY dat_transfinterna
    ADD CONSTRAINT dat_transfinterna_fk3
    FOREIGN KEY (idconcepretenido) REFERENCES nom_conceptorete(idconceptorete);
--
-- Definition for index dat_transfinterna_fk4 (OID = 1776681) : 
--
ALTER TABLE ONLY dat_transfinterna
    ADD CONSTRAINT dat_transfinterna_fk4
    FOREIGN KEY (idtipotransfinterna) REFERENCES nom_tipotransfinterna(idtipotransfinterna);
--
-- Definition for index dat_unidadsaluddispensacion_fk (OID = 1776686) : 
--
ALTER TABLE ONLY dat_unidadsaluddispensacion
    ADD CONSTRAINT dat_unidadsaluddispensacion_fk
    FOREIGN KEY (idcuadrobasico) REFERENCES conf_cuadrobasico(idcuadrobasico) ON DELETE CASCADE;
--
-- Definition for index datconsultorioentidad_fk (OID = 1776691) : 
--
ALTER TABLE ONLY dat_consultorioentidad
    ADD CONSTRAINT datconsultorioentidad_fk
    FOREIGN KEY (idestructuracomun) REFERENCES mod_estructuracomp.nom_filaestruc(idfila) ON DELETE RESTRICT;
--
-- Definition for index datconsultorioentidad_fk1 (OID = 1776696) : 
--
ALTER TABLE ONLY dat_consultorioentidad
    ADD CONSTRAINT datconsultorioentidad_fk1
    FOREIGN KEY (idconsultorio) REFERENCES nom_consultorio(idconsultorio) ON DELETE RESTRICT;
--
-- Definition for index fk_anno_cuadrobasico (OID = 1776701) : 
--
ALTER TABLE ONLY conf_cuadrobasico
    ADD CONSTRAINT fk_anno_cuadrobasico
    FOREIGN KEY (idanno) REFERENCES conf_anno(idanno) ON DELETE CASCADE;
--
-- Definition for index fk_anno_cuadrobasico (OID = 1776706) : 
--
ALTER TABLE ONLY conf_cuadrobasico_new
    ADD CONSTRAINT fk_anno_cuadrobasico
    FOREIGN KEY (idanno) REFERENCES conf_anno(idanno) ON DELETE CASCADE;
--
-- Definition for index fk_documento_reenvase (OID = 1776711) : 
--
ALTER TABLE ONLY dat_reenvase
    ADD CONSTRAINT fk_documento_reenvase
    FOREIGN KEY (idreenvase) REFERENCES mod_logistica.dat_documento(iddocumento) ON DELETE CASCADE;
--
-- Definition for index fk_filaestruc_conceptoreteentidad (OID = 1776716) : 
--
ALTER TABLE ONLY dat_conceptoreteentidad
    ADD CONSTRAINT fk_filaestruc_conceptoreteentidad
    FOREIGN KEY (idestructuracomun) REFERENCES mod_estructuracomp.nom_filaestruc(idfila) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index fk_filaestruc_generalfm_idalmacen (OID = 1776721) : 
--
ALTER TABLE ONLY conf_generalfm
    ADD CONSTRAINT fk_filaestruc_generalfm_idalmacen
    FOREIGN KEY (idalmacen) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_filaestruc_generalfm_idalmacenusuf (OID = 1776726) : 
--
ALTER TABLE ONLY conf_generalfm
    ADD CONSTRAINT fk_filaestruc_generalfm_idalmacenusuf
    FOREIGN KEY (idalmacenusuf) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_filaestruc_generalfm_idareaventa (OID = 1776731) : 
--
ALTER TABLE ONLY conf_generalfm
    ADD CONSTRAINT fk_filaestruc_generalfm_idareaventa
    FOREIGN KEY (idareaventa) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_filaestruc_generalfm_iddispensario (OID = 1776736) : 
--
ALTER TABLE ONLY conf_generalfm
    ADD CONSTRAINT fk_filaestruc_generalfm_iddispensario
    FOREIGN KEY (iddispensario) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_filaestruc_generalfm_idreserva (OID = 1776741) : 
--
ALTER TABLE ONLY conf_generalfm
    ADD CONSTRAINT fk_filaestruc_generalfm_idreserva
    FOREIGN KEY (idreserva) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_filaestruc_generalfm_idreservmob (OID = 1776746) : 
--
ALTER TABLE ONLY conf_generalfm
    ADD CONSTRAINT fk_filaestruc_generalfm_idreservmob
    FOREIGN KEY (idreservmob) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_filaestruc_generalfm_idretenido (OID = 1776751) : 
--
ALTER TABLE ONLY conf_generalfm
    ADD CONSTRAINT fk_filaestruc_generalfm_idretenido
    FOREIGN KEY (idretenido) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_filaestruc_tiporotacionentidad (OID = 1776761) : 
--
ALTER TABLE ONLY dat_tiporotacionareaentidad
    ADD CONSTRAINT fk_filaestruc_tiporotacionentidad
    FOREIGN KEY (idestructuracomun) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_filaestruc_tipotransfinternaentidad (OID = 1776766) : 
--
ALTER TABLE ONLY dat_tipotransfinternaentidad
    ADD CONSTRAINT fk_filaestruc_tipotransfinternaentidad
    FOREIGN KEY (idestructuracomun) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_lineaprod_conceptoreteentidad (OID = 1776771) : 
--
ALTER TABLE ONLY dat_conceptoreteentidad
    ADD CONSTRAINT fk_lineaprod_conceptoreteentidad
    FOREIGN KEY (idconceptorete) REFERENCES nom_conceptorete(idconceptorete) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index fk_lote_lotereenvase (OID = 1776781) : 
--
ALTER TABLE ONLY dat_lotereenvase
    ADD CONSTRAINT fk_lote_lotereenvase
    FOREIGN KEY (idlote) REFERENCES mod_logistica.dat_lote(idlote) ON DELETE CASCADE;
--
-- Definition for index fk_lote_transfinternalote (OID = 1776786) : 
--
ALTER TABLE ONLY dat_transfinternalote
    ADD CONSTRAINT fk_lote_transfinternalote
    FOREIGN KEY (idlote) REFERENCES mod_logistica.dat_lote(idlote) ON DELETE CASCADE;
--
-- Definition for index fk_motivodevolucion_transfinterna (OID = 1776791) : 
--
ALTER TABLE ONLY dat_transfinterna
    ADD CONSTRAINT fk_motivodevolucion_transfinterna
    FOREIGN KEY (idmotivodevolucion) REFERENCES nom_motivodevolucion(idmotivodevolucion);
--
-- Definition for index fk_prodreenvase_lotereenvase (OID = 1776796) : 
--
ALTER TABLE ONLY dat_lotereenvase
    ADD CONSTRAINT fk_prodreenvase_lotereenvase
    FOREIGN KEY (idprodorigen) REFERENCES dat_prodreenvase(idprodorigen) ON DELETE CASCADE;
--
-- Definition for index fk_prodreenvase_prodreenvasado_fk (OID = 1776801) : 
--
ALTER TABLE ONLY dat_prodreenvasado
    ADD CONSTRAINT fk_prodreenvase_prodreenvasado_fk
    FOREIGN KEY (idprodorigen) REFERENCES dat_prodreenvase(idprodorigen);
--
-- Definition for index fk_prodtransfinterna_transfinternalote (OID = 1776806) : 
--
ALTER TABLE ONLY dat_transfinternalote
    ADD CONSTRAINT fk_prodtransfinterna_transfinternalote
    FOREIGN KEY (idprodtransfinterna) REFERENCES dat_prodtransfinterna(idprodtransfinterna) ON DELETE CASCADE;
--
-- Definition for index fk_producto_prodreenvasado (OID = 1776811) : 
--
ALTER TABLE ONLY dat_prodreenvasado
    ADD CONSTRAINT fk_producto_prodreenvasado
    FOREIGN KEY (idproddestino) REFERENCES mod_logistica.dat_producto(idproducto) ON DELETE CASCADE;
--
-- Definition for index fk_producto_transfinternalote (OID = 1776816) : 
--
ALTER TABLE ONLY dat_transfinternalote
    ADD CONSTRAINT fk_producto_transfinternalote
    FOREIGN KEY (idproducto) REFERENCES mod_logistica.dat_producto(idproducto) ON DELETE CASCADE;
--
-- Definition for index fk_reenvase_prodreenvasado (OID = 1776821) : 
--
ALTER TABLE ONLY dat_prodreenvasado
    ADD CONSTRAINT fk_reenvase_prodreenvasado
    FOREIGN KEY (idreenvase) REFERENCES dat_reenvase(idreenvase) ON DELETE CASCADE;
--
-- Definition for index fk_reenvase_prodreenvase (OID = 1776826) : 
--
ALTER TABLE ONLY dat_prodreenvase
    ADD CONSTRAINT fk_reenvase_prodreenvase
    FOREIGN KEY (idreenvase) REFERENCES dat_reenvase(idreenvase) ON DELETE CASCADE;
--
-- Definition for index fk_rotacionlote_documento (OID = 1776831) : 
--
ALTER TABLE ONLY dat_rotacionlote
    ADD CONSTRAINT fk_rotacionlote_documento
    FOREIGN KEY (idrotacionlote) REFERENCES mod_logistica.dat_documento(iddocumento) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index fk_rotacionlote_tiporotacion (OID = 1776836) : 
--
ALTER TABLE ONLY dat_rotacionlote
    ADD CONSTRAINT fk_rotacionlote_tiporotacion
    FOREIGN KEY (idtiporotacion) REFERENCES nom_tiporotacion(idtiporotacion);
--
-- Definition for index fk_tipoarea_tiporotacionarea (OID = 1776841) : 
--
ALTER TABLE ONLY nom_tiporotacionarea
    ADD CONSTRAINT fk_tipoarea_tiporotacionarea
    FOREIGN KEY (iddeposito) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_tiporotacion_tiporotacionarea (OID = 1776846) : 
--
ALTER TABLE ONLY nom_tiporotacionarea
    ADD CONSTRAINT fk_tiporotacion_tiporotacionarea
    FOREIGN KEY (idtiporotacion) REFERENCES nom_tiporotacion(idtiporotacion) ON DELETE CASCADE;
--
-- Definition for index fk_tiporotacion_tiporotacionareaentidad (OID = 1776851) : 
--
ALTER TABLE ONLY dat_tiporotacionareaentidad
    ADD CONSTRAINT fk_tiporotacion_tiporotacionareaentidad
    FOREIGN KEY (idtiporotacion) REFERENCES nom_tiporotacion(idtiporotacion) ON DELETE CASCADE;
--
-- Definition for index fk_tipotransfinter_tipotransfinteraarea (OID = 1776856) : 
--
ALTER TABLE ONLY nom_tipotransfinternaarea
    ADD CONSTRAINT fk_tipotransfinter_tipotransfinteraarea
    FOREIGN KEY (idtipotransfinterna) REFERENCES nom_tipotransfinterna(idtipotransfinterna) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Definition for index fk_tipotransfinterna_tipotransfinternaarea (OID = 1776861) : 
--
ALTER TABLE ONLY nom_tipotransfinternaarea
    ADD CONSTRAINT fk_tipotransfinterna_tipotransfinternaarea
    FOREIGN KEY (iddeposito) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_tipotransfinterna_tipotransfinternaentidad (OID = 1776866) : 
--
ALTER TABLE ONLY dat_tipotransfinternaentidad
    ADD CONSTRAINT fk_tipotransfinterna_tipotransfinternaentidad
    FOREIGN KEY (idtipotransfinterna) REFERENCES nom_tipotransfinterna(idtipotransfinterna) ON DELETE CASCADE;
--
-- Definition for index dat_tarjetamedicamento_ventacliente_fk (OID = 1776871) : 
--
ALTER TABLE ONLY dat_tarjetamedicamento
    ADD CONSTRAINT dat_tarjetamedicamento_ventacliente_fk
    FOREIGN KEY (idpaciente) REFERENCES mod_logpuntoventa.dat_ventacliente(idventacliente);
--
-- Definition for index dat_prodtransfinterna_fk1 (OID = 1776881) : 
--
ALTER TABLE ONLY dat_prodtransfinterna
    ADD CONSTRAINT dat_prodtransfinterna_fk1
    FOREIGN KEY (idproducto) REFERENCES mod_logistica.dat_producto(idproducto);
--
-- Definition for index fk_rotacionlote_estructuraop_idorigen (OID = 1776886) : 
--
ALTER TABLE ONLY dat_rotacionlote
    ADD CONSTRAINT fk_rotacionlote_estructuraop_idorigen
    FOREIGN KEY (idorigen) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index fk_rotacionlote_estructuraop_iddestino (OID = 1776891) : 
--
ALTER TABLE ONLY dat_rotacionlote
    ADD CONSTRAINT fk_rotacionlote_estructuraop_iddestino
    FOREIGN KEY (iddestino) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
--
-- Definition for index conf_cuadrobasico_fk2 (OID = 1777005) : 
--
ALTER TABLE ONLY conf_cuadrobasico
    ADD CONSTRAINT conf_cuadrobasico_fk2
    FOREIGN KEY (idindicador) REFERENCES mod_datosmaestros.nom_indicador(idindicador);
--
-- Definition for index dat_transfinterna_fk5 (OID = 3102567) : 
--
ALTER TABLE ONLY dat_transfinterna
    ADD CONSTRAINT dat_transfinterna_fk5
    FOREIGN KEY (idoperacionorigen) REFERENCES mod_datosmaestros.nom_operacion(idnomoperaciones);
--
-- Definition for trigger t_eliminarnodoforma (OID = 1776896) : 
--
CREATE TRIGGER t_eliminarnodoforma
    AFTER DELETE ON nom_forma
    FOR EACH ROW
    EXECUTE PROCEDURE f_eliminarnodo ();
--
-- Definition for trigger t_eliminarnodogrupofm (OID = 1776897) : 
--
CREATE TRIGGER t_eliminarnodogrupofm
    AFTER DELETE ON nom_grupofm
    FOR EACH ROW
    EXECUTE PROCEDURE f_eliminarnodogrupofm ();
--
-- Definition for trigger t_insertarforma (OID = 1776898) : 
--
CREATE TRIGGER t_insertarforma
    BEFORE INSERT ON nom_forma
    FOR EACH ROW
    EXECUTE PROCEDURE ft_insertarforma ();
--
-- Definition for trigger t_insertargrupofm (OID = 1776899) : 
--
CREATE TRIGGER t_insertargrupofm
    BEFORE INSERT ON nom_grupofm
    FOR EACH ROW
    EXECUTE PROCEDURE ft_insertargrupofm ();
--
-- Definition for trigger t_insertarnodoforma (OID = 1776900) : 
--
CREATE TRIGGER t_insertarnodoforma
    BEFORE INSERT ON nom_forma
    FOR EACH ROW
    EXECUTE PROCEDURE f_insertarnodoforma ();
--
-- Definition for trigger t_insertarnodogrupofm (OID = 1776901) : 
--
CREATE TRIGGER t_insertarnodogrupofm
    BEFORE INSERT ON nom_grupofm
    FOR EACH ROW
    EXECUTE PROCEDURE f_insertarnodogrupofm ();
--
-- Data for sequence mod_logfarmacia.sec_confanno_seq (OID = 1776211)
--
SELECT pg_catalog.setval('sec_confanno_seq', 1000000001, true);
--
-- Data for sequence mod_logfarmacia.sec_confcuadrobasico_seq (OID = 1776219)
--
SELECT pg_catalog.setval('sec_confcuadrobasico_seq', 1000000641, true);
--
-- Data for sequence mod_logfarmacia.sec_confgeneralfm_seq (OID = 1776230)
--
SELECT pg_catalog.setval('sec_confgeneralfm_seq', 1000000001, true);
--
-- Data for sequence mod_logfarmacia.sec_asociartipoentidad_seq (OID = 1776238)
--
SELECT pg_catalog.setval('sec_asociartipoentidad_seq', 1000000000, false);
--
-- Data for sequence mod_logfarmacia.sec_datconceptoreteentidad_seq (OID = 1776244)
--
SELECT pg_catalog.setval('sec_datconceptoreteentidad_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_datconsultorioentidad_seq (OID = 1776250)
--
SELECT pg_catalog.setval('sec_datconsultorioentidad_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_dadentregaproducto_seq (OID = 1776256)
--
SELECT pg_catalog.setval('sec_dadentregaproducto_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_datgrupofarmacuadrobasico_seq (OID = 1776262)
--
SELECT pg_catalog.setval('sec_datgrupofarmacuadrobasico_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_datlineaprodentidad_seq (OID = 1776268)
--
SELECT pg_catalog.setval('sec_datlineaprodentidad_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_datlotereenvase_seq (OID = 1776274)
--
SELECT pg_catalog.setval('sec_datlotereenvase_seq', 1000000000, false);
--
-- Data for sequence mod_logfarmacia.sec_datmotivodevolucionentidad_seq (OID = 1776280)
--
SELECT pg_catalog.setval('sec_datmotivodevolucionentidad_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_datpaciente_seq (OID = 1776286)
--
SELECT pg_catalog.setval('sec_datpaciente_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_prodcalculomaxmin_seq (OID = 1776292)
--
SELECT pg_catalog.setval('sec_prodcalculomaxmin_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_datprodreenvasado_seq (OID = 1776300)
--
SELECT pg_catalog.setval('sec_datprodreenvasado_seq', 1000000000, false);
--
-- Data for sequence mod_logfarmacia.sec_datprodreenvase_seq (OID = 1776306)
--
SELECT pg_catalog.setval('sec_datprodreenvase_seq', 1000000000, false);
--
-- Data for sequence mod_logfarmacia.sec_dadprodtransfinterna_seq (OID = 1776312)
--
SELECT pg_catalog.setval('sec_dadprodtransfinterna_seq', 1000000004, true);
--
-- Data for sequence mod_logfarmacia.sec_dadproductotarjetamedicamento_seq (OID = 1776325)
--
SELECT pg_catalog.setval('sec_dadproductotarjetamedicamento_seq', 1000000007, true);
--
-- Data for sequence mod_logfarmacia.sec_datregistrotarjeta_seq (OID = 1776336)
--
SELECT pg_catalog.setval('sec_datregistrotarjeta_seq', 1000000007, false);
--
-- Data for sequence mod_logfarmacia.sec_datrotacioncodificador_seq (OID = 1776342)
--
SELECT pg_catalog.setval('sec_datrotacioncodificador_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_rotacionproductolote_seq (OID = 1776352)
--
SELECT pg_catalog.setval('sec_rotacionproductolote_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nomtiporotacionareaentidad_seq (OID = 1776367)
--
SELECT pg_catalog.setval('sec_nomtiporotacionareaentidad_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nomtipotransfinternaentidad_seq (OID = 1776373)
--
SELECT pg_catalog.setval('sec_nomtipotransfinternaentidad_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_dattransfinternalote_seq (OID = 1776383)
--
SELECT pg_catalog.setval('sec_dattransfinternalote_seq', 1000000012, true);
--
-- Data for sequence mod_logfarmacia.sec_datunidadsaluddispensacion_seq (OID = 1776390)
--
SELECT pg_catalog.setval('sec_datunidadsaluddispensacion_seq', 1000000641, true);
--
-- Data for sequence mod_logfarmacia.sec_hisproductotarjetamedicamento_seq (OID = 1776396)
--
SELECT pg_catalog.setval('sec_hisproductotarjetamedicamento_seq', 1000000000, false);
--
-- Data for sequence mod_logfarmacia.sec_nomconceptorete_seq (OID = 1776406)
--
SELECT pg_catalog.setval('sec_nomconceptorete_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nonconsultorio_seq (OID = 1776413)
--
SELECT pg_catalog.setval('sec_nonconsultorio_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nomforma_seq (OID = 1776419)
--
SELECT pg_catalog.setval('sec_nomforma_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nomgrupofm_seq (OID = 1776429)
--
SELECT pg_catalog.setval('sec_nomgrupofm_seq', 1000000000, false);
--
-- Data for sequence mod_logfarmacia.sec_nomlineaprod_seq (OID = 1776439)
--
SELECT pg_catalog.setval('sec_nomlineaprod_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nommotivodevolucion_seq (OID = 1776447)
--
SELECT pg_catalog.setval('sec_nommotivodevolucion_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nomtiporotacion_seq (OID = 1776454)
--
SELECT pg_catalog.setval('sec_nomtiporotacion_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nomrotacionarea_seq (OID = 1776462)
--
SELECT pg_catalog.setval('sec_nomrotacionarea_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_nomtipotransfinterna_seq (OID = 1776468)
--
SELECT pg_catalog.setval('sec_nomtipotransfinterna_seq', 1000000001, true);
--
-- Data for sequence mod_logfarmacia.sec_nomtipotransfinternaarea_seq (OID = 1776477)
--
SELECT pg_catalog.setval('sec_nomtipotransfinternaarea_seq', 1000000002, true);
--
-- Data for sequence mod_logfarmacia.sec_dadmaxminanalisis_seq (OID = 1776483)
--
SELECT pg_catalog.setval('sec_dadmaxminanalisis_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_dadtarjetamedicamento_seq (OID = 1776485)
--
SELECT pg_catalog.setval('sec_dadtarjetamedicamento_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_datreenvase_seq (OID = 1776487)
--
SELECT pg_catalog.setval('sec_datreenvase_seq', 1000000000, false);
--
-- Data for sequence mod_logfarmacia.sec_hiseprodcalculomaxmin_seq (OID = 1776489)
--
SELECT pg_catalog.setval('sec_hiseprodcalculomaxmin_seq', 1000000001, false);
--
-- Data for sequence mod_logfarmacia.sec_registromaxmin_seq (OID = 1776491)
--
SELECT pg_catalog.setval('sec_registromaxmin_seq', 1, false);
--
-- Comments
--
COMMENT ON COLUMN mod_logfarmacia.conf_anno.idanno IS 'identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.conf_anno.estado IS 'Estado del anno';
COMMENT ON COLUMN mod_logfarmacia.conf_anno.activo IS '1 si esta activo, 0 no esta activo';
COMMENT ON COLUMN mod_logfarmacia.conf_anno.fechainicio IS 'Fecha de inicio de la puesta en vigencia';
COMMENT ON COLUMN mod_logfarmacia.conf_anno.fechafin IS 'Fecha de fin de la puesta en vigencia';
COMMENT ON COLUMN mod_logfarmacia.conf_anno.identidad IS 'Id de la entidad que lo crea.';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idcuadrobasico IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idindicador IS 'Identicficador del codificador.';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idtipocuadrobasico IS 'Tipo de cuadro basico';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idgrupofarmacologico IS 'Id grupo farmacologico';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idclasificacionven IS 'Id clasificacion VEN';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idproveedor IS 'Identificador del proveedor';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idviaadquicicion IS 'Id via de adquicicion';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.prioridad IS 'Prioridad';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.formulamagistral IS 'Formula magistral';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.tienecertificado IS 'Tiene certificado';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idanno IS 'Anno del cuadro basico';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idestructura IS 'Identificador de la entidad que lo crea';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.idpadre IS 'Id cuadro basico padre';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico.modocobro IS 'Modo de cobro al momento de la venta 0-Cobrar, 1-Entregar gratis, 2-Entregar por donacion';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idcuadrobasico IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idcodificador IS 'Identicficador del codificador.';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idtipocuadrobasico IS 'Tipo de cuadro basico';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idgrupofarmacologico IS 'Id grupo farmacologico';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idclasificacionven IS 'Id clasificacion VEN';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idproveedor IS 'Identificador del proveedor';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idviaadquicicion IS 'Id via de adquicicion';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.prioridad IS 'Prioridad';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.formulamagistral IS 'Formula magistral';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.tienecertificado IS 'Tiene certificado';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idanno IS 'Anno del cuadro basico';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idestructura IS 'Identificador de la entidad que lo crea';
COMMENT ON COLUMN mod_logfarmacia.conf_cuadrobasico_new.idpadre IS 'Id cuadro basico padre';
COMMENT ON COLUMN mod_logfarmacia.conf_generalfm.idestructura IS 'Almacena la estructura';
COMMENT ON COLUMN mod_logfarmacia.conf_tipoentidadasociada.idtipoentidadasociada IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.conf_tipoentidadasociada.idtipoentidad IS 'idorgano';
COMMENT ON COLUMN mod_logfarmacia.conf_tipoentidadasociada.idtipounidadsalud IS 'Identificador del tipo de unidad de salud';
COMMENT ON TABLE mod_logfarmacia.dat_conceptoreteentidad IS 'Almacena el concepto retenido por entidades';
COMMENT ON COLUMN mod_logfarmacia.dat_consultorioentidad.idestructuracomun IS 'Identificador de la estructura';
COMMENT ON COLUMN mod_logfarmacia.dat_consultorioentidad.idconsultorio IS 'Identificador de nomconsultorio';
COMMENT ON COLUMN mod_logfarmacia.dat_entregaproducto.identregaproducto IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.dat_entregaproducto.fechaentrega IS 'Fecha de la entrega';
COMMENT ON COLUMN mod_logfarmacia.dat_entregaproducto.cantidadentregada IS 'cantidad entregada';
COMMENT ON COLUMN mod_logfarmacia.dat_entregaproducto.entregadapor IS 'identificador de quien entrega';
COMMENT ON COLUMN mod_logfarmacia.dat_entregaproducto.idproductotarjetamedicamento IS 'LLave foranea de dat_productotarjetamedicamento';
COMMENT ON TABLE mod_logfarmacia.dat_prodcalculomaxmin IS 'Almacena el cálculo perteneciente a los productos de farmacia';
COMMENT ON COLUMN mod_logfarmacia.dat_prodcalculomaxmin.idproducto IS 'Identificador de los productos';
COMMENT ON COLUMN mod_logfarmacia.dat_prodcalculomaxmin.estado IS '1 si esta aprobado, 0 si no esta aprobado';
COMMENT ON COLUMN mod_logfarmacia.dat_prodcalculomaxmin.calculado IS '1 si esta calculado, 0 si no esta calculado';
COMMENT ON COLUMN mod_logfarmacia.dat_prodcalculomaxmin.idprodcalculomaxmin IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.dat_prodtransfinterna.idprodtransfinterna IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.dat_prodtransfinterna.idtransfinterna IS 'Identificador de la transferancia interna';
COMMENT ON COLUMN mod_logfarmacia.dat_prodtransfinterna.idproducto IS 'Identificador del producto.';
COMMENT ON COLUMN mod_logfarmacia.dat_prodtransfinterna.cantidad IS 'Cantidad a transferir del producto';
COMMENT ON COLUMN mod_logfarmacia.dat_productosimportar.denominacion IS 'Denominacion del codificador';
COMMENT ON COLUMN mod_logfarmacia.dat_productosimportar.presentacion IS 'Columna U.Mínima de excel de encomed';
COMMENT ON COLUMN mod_logfarmacia.dat_productosimportar.ppob IS 'Columna PPOB del excel de encomed (Precio venta)';
COMMENT ON COLUMN mod_logfarmacia.dat_productosimportar.procedencia IS 'Columna Procedencia del excel de encomed';
COMMENT ON COLUMN mod_logfarmacia.dat_productosimportar.descripcion IS 'Columna Descripción(Oficial) del excel de encomed (Denominacion y descripcion del indicador)';
COMMENT ON COLUMN mod_logfarmacia.dat_productosimportar.pesounidad IS 'Columna PesoxUnidad del excel de encomed';
COMMENT ON COLUMN mod_logfarmacia.dat_productosimportar.temperatura IS 'Columna Temperatura del excel de encomed';
COMMENT ON COLUMN mod_logfarmacia.dat_productosimportar.nuevomodificado IS '0 - modificado, 1 - nuevo';
COMMENT ON COLUMN mod_logfarmacia.dat_productotarjetamedicamento.idproductotarjetamedicamento IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.dat_productotarjetamedicamento.idcuadrobasico IS 'Identificador del codificador del producto';
COMMENT ON COLUMN mod_logfarmacia.dat_productotarjetamedicamento.idtarjetamedicamento IS 'Identificador de la tarjeta de medicamento';
COMMENT ON COLUMN mod_logfarmacia.dat_productotarjetamedicamento.dosis IS 'Dosis.';
COMMENT ON COLUMN mod_logfarmacia.dat_productotarjetamedicamento.fechaemision IS 'Fecha en que se emite';
COMMENT ON COLUMN mod_logfarmacia.dat_productotarjetamedicamento.fechaexpiracion IS 'fecha en que espira';
COMMENT ON COLUMN mod_logfarmacia.dat_productotarjetamedicamento.aprobado IS '0 No aprobado, 1 Aprobado';
COMMENT ON COLUMN mod_logfarmacia.dat_registrotarjeta.idregistrotarjeta IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.dat_registrotarjeta.idtarjetamedicamento IS 'Id de la Tarjeta de medicamento';
COMMENT ON COLUMN mod_logfarmacia.dat_registrotarjeta.operacion IS '0 si es Renovación, 1 si es Cambio del tratamiento';
COMMENT ON COLUMN mod_logfarmacia.dat_registrotarjeta.idproductocambio IS 'En caso de que la operacion sea 1(ambio del tratamiento) registra que idcodificador lo sustituye.';
COMMENT ON COLUMN mod_logfarmacia.dat_registrotarjeta.dosis IS 'Dosis mensual';
COMMENT ON COLUMN mod_logfarmacia.dat_registrotarjeta.fechaemision IS 'fecha en que se emitió';
COMMENT ON COLUMN mod_logfarmacia.dat_registrotarjeta.fechaexpiracion IS 'fecha en que expira';
COMMENT ON COLUMN mod_logfarmacia.dat_registrotarjeta.origenprescripcion IS 'Origen de la prescripcion';
COMMENT ON COLUMN mod_logfarmacia.dat_rotacionlote.cantidad IS 'Cantidad de productos del documento';
COMMENT ON COLUMN mod_logfarmacia.dat_rotacionproductolote.tipo IS '1-Lotes Origen
2-Lotes Destino';
COMMENT ON COLUMN mod_logfarmacia.dat_tarjetamedicamento.retrovirales IS '1 en caso de ser verdador, 0 en caso de ser falso.';
COMMENT ON COLUMN mod_logfarmacia.dat_tarjetamedicamento.nrocasoindice IS 'Numero del caso de indice.';
COMMENT ON COLUMN mod_logfarmacia.dat_tarjetamedicamento.idpaciente IS 'Identificador del cliente';
COMMENT ON SEQUENCE mod_logfarmacia.sec_nomtiporotacionareaentidad_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla 
nom_rotacionareaentidad. ';
COMMENT ON TABLE mod_logfarmacia.dat_tiporotacionareaentidad IS 'Tabla nomencladora que almacena los tipos de rotacions que pueden llevarse 
a cabo entre las áreas de una entidad ';
COMMENT ON COLUMN mod_logfarmacia.dat_tiporotacionareaentidad.idtiporotacionentidad IS 'Identificador único para cada tupla de la tabla nom_tiporotacionentidad.';
COMMENT ON COLUMN mod_logfarmacia.dat_tiporotacionareaentidad.idtiporotacion IS 'Identificador único para cada tupla de la tabla nom_tiporotacion.';
COMMENT ON COLUMN mod_logfarmacia.dat_tiporotacionareaentidad.idestructuracomun IS 'Identificador único para cada tupla de la tabla nom_filaestruc.';
COMMENT ON SEQUENCE mod_logfarmacia.sec_nomtipotransfinternaentidad_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla 
nom_tipotransfinternaentidad. ';
COMMENT ON TABLE mod_logfarmacia.dat_tipotransfinternaentidad IS 'Tabla nomencladora que almacena los tipos de rotacions que pueden llevarse 
a cabo entre las áreas de una entidad ';
COMMENT ON COLUMN mod_logfarmacia.dat_tipotransfinternaentidad.idtipotransfinternaentidad IS 'Identificador único para cada tupla de la tabla nom_tiporotacionentidad.';
COMMENT ON COLUMN mod_logfarmacia.dat_tipotransfinternaentidad.idtipotransfinterna IS 'Identificador único para cada tupla de la tabla nom_tiporotacion.';
COMMENT ON COLUMN mod_logfarmacia.dat_tipotransfinternaentidad.idestructuracomun IS 'Identificador único para cada tupla de la tabla nom_filaestruc.';
COMMENT ON COLUMN mod_logfarmacia.dat_transfinterna.devolucion IS '1 en caso de ser una devolucion, 0 en caso de ser falso.';
COMMENT ON COLUMN mod_logfarmacia.dat_transfinterna.iddeposorigen IS 'Almacena el depósito origen.';
COMMENT ON COLUMN mod_logfarmacia.dat_transfinterna.iddeposdestino IS 'Almacena el depósito destino.';
COMMENT ON COLUMN mod_logfarmacia.dat_transfinterna.idconcepretenido IS 'Almacena el concepto de retenido';
COMMENT ON COLUMN mod_logfarmacia.dat_transfinterna.idmotivodevolucion IS 'Almacena el motivo de devolución';
COMMENT ON COLUMN mod_logfarmacia.dat_transfinterna.idtipotransfinterna IS 'Almacena el tipo de transferancia';
COMMENT ON COLUMN mod_logfarmacia.dat_transfinterna.idoperacionorigen IS 'Id de la operacion por la cual se va a generar la transferencia.';
COMMENT ON COLUMN mod_logfarmacia.dat_transfinternalote.cantpasar IS 'Almacena la cantidad a pasar';
COMMENT ON COLUMN mod_logfarmacia.dat_unidadsaluddispensacion.idunidadsaluddispensacion IS 'Identofocador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.dat_unidadsaluddispensacion.idtipodispensacion IS '[1, Receta médica], [2, Venta Liberada], [3, Tarjeta control], [4, Fórmula], [5, Usufructo], [6, Retrovirales], [7, Pedido]';
COMMENT ON COLUMN mod_logfarmacia.dat_unidadsaluddispensacion.idcuadrobasico IS 'Llave foranea cuadro basico';
COMMENT ON COLUMN mod_logfarmacia.his_productotarjetamedicamento.idhproductotarjetamedicamento IS 'Identificador de la tabla';
COMMENT ON COLUMN mod_logfarmacia.his_productotarjetamedicamento.idcuadrobasico IS 'Identificador del codificador del producto';
COMMENT ON COLUMN mod_logfarmacia.his_productotarjetamedicamento.idtarjetamedicamento IS 'Identificador de la tarjeta de medicamento';
COMMENT ON COLUMN mod_logfarmacia.his_productotarjetamedicamento.dosis IS 'Dosis.';
COMMENT ON COLUMN mod_logfarmacia.his_productotarjetamedicamento.fechaemision IS 'Fecha en que se emite';
COMMENT ON COLUMN mod_logfarmacia.his_productotarjetamedicamento.fechaexpiracion IS 'fecha en que espira';
COMMENT ON TABLE mod_logfarmacia.nom_conceptorete IS 'Almacena el concepto retenido';
COMMENT ON TABLE mod_logfarmacia.nom_forma IS 'Almacena las formas farmacéuticas';
COMMENT ON TABLE mod_logfarmacia.nom_grupofm IS 'Almacena los grupos farmacológicos';
COMMENT ON SEQUENCE mod_logfarmacia.sec_nomtiporotacion_seq IS 'Secuencia empleada para autogenerar el identificador de la 
tabla nom_rotacion. ';
COMMENT ON TABLE mod_logfarmacia.nom_tiporotacion IS 'En esta tabla se refleja los diferentes tipos de rotacion entre área';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacion.idtiporotacion IS 'Identificador  único para cada tupla de la tabla nom_tiporotacion.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacion.codigo IS 'Código del tipo de rotacion.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacion.denominacion IS 'Nombre del tipo de rotacion.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacion.automatica IS '1 si es automática y 0 no.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacion.estado IS 'Activo, inactivo.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacion.fechainicio IS 'Almacena la fecha de inicio de un producto.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacion.fechafin IS 'Almacena la fecha de fin de un producto.';
COMMENT ON SEQUENCE mod_logfarmacia.sec_nomrotacionarea_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla nom_rotacionarea. ';
COMMENT ON TABLE mod_logfarmacia.nom_tiporotacionarea IS 'Tabla para relacionar los tipos de rotacion  entre áreas y los tipos de áreas';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacionarea.idtiporotacionarea IS 'Identificador único para cada tupla de la tabla nomrotacionarea.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacionarea.idtiporotacion IS 'Identificador  único para cada tupla de la tabla nom_tiporotacion.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacionarea.iddeposito IS 'Identificador  único para cada tupla de la tabla nom_tipoarea.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacionarea.fechainicio IS 'Almacena la fecha de inicio de un producto.';
COMMENT ON COLUMN mod_logfarmacia.nom_tiporotacionarea.fechafin IS 'Almacena la fecha de fin de un producto.';
COMMENT ON SEQUENCE mod_logfarmacia.sec_nomtipotransfinterna_seq IS 'Secuencia empleada para autogenerar el identificador de la 
tabla nom_tipotransfinterna. ';
COMMENT ON TABLE mod_logfarmacia.nom_tipotransfinterna IS 'En esta tabla se refleja los diferentes tipos de transferancia interna';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinterna.idtipotransfinterna IS 'Identificador  único para cada tupla de la tabla nom_tipotransfinterna.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinterna.codigo IS 'Código del tipo de transferancia interna.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinterna.denominacion IS 'Nombre del tipo de transferancia interna.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinterna.automatica IS '1 si es automática y 0 no.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinterna.estado IS 'Activo, inactivo.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinterna.fechainicio IS 'Almacena la fecha de inicio de un producto.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinterna.fechafin IS 'Almacena la fecha de fin de un producto.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinterna.pordefecto IS 'Almacena el tipo de transferencia para reponer area de venta';
COMMENT ON SEQUENCE mod_logfarmacia.sec_nomtipotransfinternaarea_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla nom_tipotransfinternaarea. ';
COMMENT ON TABLE mod_logfarmacia.nom_tipotransfinternaarea IS 'Tabla para relacionar los tipos de transferancia interna';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinternaarea.idtipotransfinternaarea IS 'Identificador único para cada tupla de la tabla nomtipotransfinteraarea.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinternaarea.idtipotransfinterna IS 'Identificador  único para cada tupla de la tabla nom_tipotransfinterna.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinternaarea.iddeposito IS 'Identificador  único para cada tupla de la tabla dat_estructuraop.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinternaarea.fechainicio IS 'Almacena la fecha de inicio de un producto.';
COMMENT ON COLUMN mod_logfarmacia.nom_tipotransfinternaarea.fechafin IS 'Almacena la fecha de fin de un producto.';
COMMENT ON CONSTRAINT fk_tiporotacion_tiporotacionarea ON nom_tiporotacionarea IS 'Limitación referencial entre la  tabla nomtiporotacion y la tabla nom_tiporotacionarea mediante el atributo idtiporotacion';
COMMENT ON CONSTRAINT fk_tiporotacion_tiporotacionareaentidad ON dat_tiporotacionareaentidad IS 'Limitación referencial entre la  tabla nomrotacionareaentidad y la tabla nom_tipotranferencia mediante el atributo idtiporotacion.';
COMMENT ON CONSTRAINT fk_tipotransfinterna_tipotransfinternaentidad ON dat_tipotransfinternaentidad IS 'Limitación referencial entre la  tabla tipotransfinternaentidad y la tabla nom_tipotransfinterna mediante el atributo idtipotransfinterna.';
