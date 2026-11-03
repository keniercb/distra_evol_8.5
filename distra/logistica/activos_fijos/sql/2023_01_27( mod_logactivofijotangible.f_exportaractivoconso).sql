CREATE TYPE mod_logactivofijotangible.td_exportaractivoconso AS (
  mesinicio NUMERIC(19,0),
  annoinicio NUMERIC(19,0),
  mesfin NUMERIC(19,0),
  annofin NUMERIC(19,0),
  cuenta NUMERIC(19,0),
  descripcion VARCHAR,
  saldoapertura NUMERIC(19,0),
  saldoalta NUMERIC(19,0),
  saldoaltatraspaso NUMERIC(19,0),
  saldobajas NUMERIC(19,0),
  saldobajastraspaso NUMERIC(19,0),
  saldodepreciacion NUMERIC(19,0),
  saldoreclasificacion NUMERIC(19,0),
  saldoajustes NUMERIC(19,0),
  saldofaltantesobrante NUMERIC(19,0),
  saldofinal NUMERIC(19,0),
  proximoperiodo NUMERIC(19,0)
);

ALTER TYPE mod_logactivofijotangible.td_exportaractivoconso
  OWNER TO zeolides;



CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_exportaractivoconso (
  p_idestructura numeric,
  p_fecha_inicio date,
  p_fecha_fin date,
  p_fecha_inicio_ejercicio date,
  p_fecha_fin_ejercicio date
)
RETURNS SETOF mod_logactivofijotangible.td_exportaractivoconso AS
$body$
  DECLARE
  v_rec mod_logactivofijotangible.td_exportaractivoconso;

  BEGIN

for v_rec in 
     
SELECT c.mes_inicio, 
c.anno_inicio, 
c.mes_fin, 
c.annofin, 
c.cuenta, 
c.descripcion,
c.saldo_apertura, 
c.saldoalta, 
c.saldoaltaTraspaso, 
c.saldoBajas,
c.saldoBajasTraspaso, 
c.saldoDepreciacion, 
c.saldoReclasificacion, 
c.saldoAjusteAumento - c.saldoAjusteDisminucion as saldoAjuste,
c.saldoSobrante - c.saldoFaltante as saldoFaltanteSobrante,
c.saldo_apertura + c.saldoalta + c.saldoaltaTraspaso + c.saldoBajas + c.saldoBajasTraspaso + c.saldoDepreciacion
 + c.saldoReclasificacion + c.saldoAjusteAumento -  c.saldoAjusteDisminucion + c.saldoSobrante - c.saldoFaltante as saldofinal,
c.annoProximoPeriodo

FROM
(Select DISTINCT
date_part('month',ncuenta.fechainicio) as mes_inicio,
date_part('year',ncuenta.fechainicio) as anno_inicio,
date_part('month',now()::date) as mes_fin,
date_part('year',now()::date) as annofin,
cta.concatcta as cuenta,
cta.descripcion as descripcion,
(select abs(sum(res.debitomb) - sum(res.creditomb))
        from mod_contabilidad.res_centroelem_saldo res
        INNER JOIN mod_contabilidad.dat_comprobante cmp USING(idcomprobante)
        inner join mod_contabilidad.dat_estructurae es ON res.idestructurae = es.idestructurae
        where res.idcuenta = ncuenta.idcuenta and cmp.cierreoapertura = 1 
       
       and res.fechaemision >= p_fecha_inicio and cmp.fechaemision <= p_fecha_fin_ejercicio
       and es.idestructuracomun IN(p_idestructura) 
        GROUP BY res.concatcta, res.idcuenta) as saldo_apertura,

coalesce((Select SUM(COALESCE(drna1.valorcontable,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion IN('OPER_REC_INVENTARIO',
         'OPER_UTILESHERRA',
         'OPER_COMPRA',
         'OPER_MEDIOPROPIOS',
         'OPER_AJUSTE_SOBRANTE',
         'OPER_REC_TRAS_EXTER')
         and dd1.fechacontable >= p_fecha_inicio  and est1.idestructuracomun IN(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoalta,
coalesce((Select SUM(COALESCE(drna1.valorcontable,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion IN('OPER_REC_TRAS_EXT_UH')  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun IN(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoaltaTraspaso,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_INV_BAJA',
   			'OPER_AJUSTE_FALTANTE',
   			'OPER_BAJA_DEFINITIVA' )  and dd1.fechacontable >= p_fecha_inicio
            and est1.idestructuracomun IN(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoBajas,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_TRAS_EXTER_UH' )  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in (p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoBajasTraspaso,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_DEPRECIACION' )  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoDepreciacion,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_MOD_PROPIEDAD' )  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in (p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoReclasificacion,


coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_MOD_VALOR')  and dd1.fechacontable >= p_fecha_inicio
AND est1.idestructuracomun in(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoAjusteAumento,

coalesce((Select abs(SUM(COALESCE(drna1.depreciacionacumulada,0)))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_MOD_VALOR_DIS')  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo 
),0) as saldoAjusteDisminucion,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN('OPER_AJUSTE_SOBRA_UH','OPER_AJUSTE_SOBRANTE' )  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoSobrante,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN('OPER_AJUSTE_FALTANTE','OPER_AJUSTE_FALTA_UH' ) 
 and dd1.fechacontable >= p_fecha_inicio
 and est1.idestructuracomun In (p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoFaltante,
 
CONCAT(CONCAT(date_part('year',now()::date),date_part('month',now()::date +'1 month'::interval))) as annoProximoPeriodo

From mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est on est.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
inner JOIN  mod_logactivofijotangible.dat_movregnumerico dmr on dmr.idmovimiento = dm.idmovimiento
inner JOIN  mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = dmr.idregnumerico
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON drna.idregnumerico = drn.idregnumerico
inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
inner JOIN mod_datosmaestros.nom_gruposubgrupo ngs on ngs.idgruposubgrupo = coalesce(drna.idgruposubgrupo, nih.idgruposubgrupo)
inner join mod_logactivofijotangible.conf_gruposcuentas cfggrupos on ngs.idgruposubgrupo = cfggrupos.idgruposubgrupo 
INNER join mod_contabilidad.nom_cuenta ncuenta on cfggrupos.idcuentaactivo = ncuenta.idcuenta
INNER join mod_contabilidad.nom_cuenta cta on cta.idcuenta = ncuenta.idcuentapadre


where cfggrupos.idgruposubgrupo is not null and est.idestructuracomun  IN(p_idestructura) 
group by ncuenta.idcuenta,ncuenta.concatcta,ngs.denominacion,ngs.idgruposubgrupo,cta.concatcta,cta.descripcion)c

union 

SELECT d.mes_inicio, 
d.anno_inicio, 
d.mes_fin, 
d.annofin, 
d.cuenta, 
d.descripcion,
d.saldo_apertura, 
d.saldoalta, 
d.saldoaltaTraspaso, 
d.saldoBajas,
d.saldoBajasTraspaso, 
d.saldoDepreciacion, 
d.saldoReclasificacion, 
d.saldoAjusteAumento - d.saldoAjusteDisminucion as saldoAjuste,
d.saldoSobrante - d.saldoFaltante as saldoFaltanteSobrante,
d.saldo_apertura + d.saldoalta + d.saldoaltaTraspaso + d.saldoBajas + d.saldoBajasTraspaso + d.saldoDepreciacion
 + d.saldoReclasificacion + d.saldoAjusteAumento -  d.saldoAjusteDisminucion + d.saldoSobrante - d.saldoFaltante as saldofinal,
d.annoProximoPeriodo

FROM(
Select DISTINCT
date_part('month',ncuenta.fechainicio) as mes_inicio,
date_part('year',ncuenta.fechainicio) as anno_inicio,
date_part('month',now()::date) as mes_fin,
date_part('year',now()::date) as annofin,
cta.concatcta as cuenta,
cta.descripcion as descripcion,
(select abs(sum(res.debitomb) - sum(res.creditomb))
        from mod_contabilidad.res_centroelem_saldo res
        INNER JOIN mod_contabilidad.dat_comprobante cmp USING(idcomprobante)
        inner join mod_contabilidad.dat_estructurae es ON res.idestructurae = es.idestructurae
        where res.idcuenta = ncuenta.idcuenta and cmp.cierreoapertura = 1 
       
       and res.fechaemision >= p_fecha_inicio and cmp.fechaemision <= p_fecha_fin_ejercicio
       and es.idestructuracomun IN(p_idestructura) 
        GROUP BY res.concatcta, res.idcuenta) as saldo_apertura,

coalesce((Select SUM(COALESCE(drna1.valorcontable,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion IN('OPER_REC_INVENTARIO',
         'OPER_UTILESHERRA',
         'OPER_COMPRA',
         'OPER_MEDIOPROPIOS',
         'OPER_AJUSTE_SOBRANTE',
         'OPER_REC_TRAS_EXTER')
         and dd1.fechacontable >= p_fecha_inicio  and est1.idestructuracomun IN(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoalta,
coalesce((Select SUM(COALESCE(drna1.valorcontable,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion IN('OPER_REC_TRAS_EXT_UH')  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun IN(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoaltaTraspaso,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_INV_BAJA',
   			'OPER_AJUSTE_FALTANTE',
   			'OPER_BAJA_DEFINITIVA' )  and dd1.fechacontable >= p_fecha_inicio
            and est1.idestructuracomun IN(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoBajas,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_TRAS_EXTER_UH' )  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in (p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoBajasTraspaso,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_DEPRECIACION' )  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoDepreciacion,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_MOD_PROPIEDAD' )  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in (p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoReclasificacion,


coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_MOD_VALOR')  and dd1.fechacontable >= p_fecha_inicio
AND est1.idestructuracomun in(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoAjusteAumento,

coalesce((Select abs(SUM(COALESCE(drna1.depreciacionacumulada,0)))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN( 'OPER_MOD_VALOR_DIS')  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo 
),0) as saldoAjusteDisminucion,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN('OPER_AJUSTE_SOBRA_UH','OPER_AJUSTE_SOBRANTE' )  and dd1.fechacontable >= p_fecha_inicio
and est1.idestructuracomun in(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoSobrante,

coalesce((Select SUM(COALESCE(drna1.depreciacionacumulada,0))
 From mod_logactivofijotangible.dat_regnumericoactivo drna1
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn1 ON drn1.idregnumerico = drna1.idregnumerico
 INNER JOIN mod_logactivofijotangible.dat_movregnumerico m2 ON drna1.idregnumerico = m2.idregnumerico
 inner join mod_logistica.dat_movimiento mov on mov.idmovimiento = m2.idmovimiento
inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = mov.iddocumento 
inner join mod_datosmaestros.dat_documentoprim ddp1 on ddp1.iddoc = dd1.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est1 on est1.idestructurasubsist = ddp1.idestructurasubsist
inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = dd1.idoperacion
inner join mod_logistica.dat_producto dp1 on dp1.idproducto = drn1.idproducto
inner join mod_datosmaestros.nom_indicador ni1 on ni1.idindicador = dp1.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih1 on nih1.idindicador = ni1.idindicador
where oper.codigooperacion  IN('OPER_AJUSTE_FALTANTE','OPER_AJUSTE_FALTA_UH' ) 
 and dd1.fechacontable >= p_fecha_inicio
 and est1.idestructuracomun IN(p_idestructura)
 and coalesce(drna1.idgruposubgrupo, nih1.idgruposubgrupo) = ngs.idgruposubgrupo
     
),0) as saldoFaltante,
 
CONCAT(CONCAT(date_part('year',now()::date),date_part('month',now()::date +'1 month'::interval))) as annoProximoPeriodo

From mod_logistica.dat_documento dd
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist est on est.idestructurasubsist = ddp.idestructurasubsist
inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
inner JOIN  mod_logactivofijotangible.dat_movregnumerico dmr on dmr.idmovimiento = dm.idmovimiento
inner JOIN  mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = dmr.idregnumerico
INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON drna.idregnumerico = drn.idregnumerico
inner join mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
inner JOIN mod_datosmaestros.nom_gruposubgrupo ngs on ngs.idgruposubgrupo = coalesce(drna.idgruposubgrupo, nih.idgruposubgrupo)
inner join mod_logactivofijotangible.conf_gruposcuentas cfggrupos on ngs.idgruposubgrupo = cfggrupos.idgruposubgrupo 
INNER join mod_contabilidad.nom_cuenta ncuenta on cfggrupos.idcuentadepreciacion = ncuenta.idcuenta
INNER join mod_contabilidad.nom_cuenta cta on cta.idcuenta = ncuenta.idcuentapadre


where cfggrupos.idgruposubgrupo is not null and est.idestructuracomun  IN(p_idestructura) 
group by ncuenta.idcuenta,ncuenta.concatcta,ngs.denominacion,ngs.idgruposubgrupo,cta.concatcta,cta.descripcion)d



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

ALTER FUNCTION mod_logactivofijotangible.f_exportaractivoconso (p_idestructura numeric, p_fecha_inicio date, p_fecha_fin date, p_fecha_inicio_ejercicio date, p_fecha_fin_ejercicio date)
  OWNER TO zeolides;




