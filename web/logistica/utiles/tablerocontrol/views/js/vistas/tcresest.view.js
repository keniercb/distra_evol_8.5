Ext.ns('Ext.erp.Sources');
Ext.erp.Sourcesresest = [{
    name: 'Productos por movimientos',
    sql:  sqlmovreserva
},{
    name: 'Estado de vencimiento',
    sql: "select count(distinct p.idproducto) as cantidad,  " +
    "'Vencido' as estado from mod_logistica.dat_producto p " +
    "left join mod_logistica.dat_lote l on l.idproducto = p.idproducto  " +
    "inner join mod_logreserva.conf_cuadrobasico cb on cb.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador  " +
    "where p.cantidad > 0 and p.idestructura in (" + depositoreserva + ") " +
    "and ((case when p.fechavencimiento is not null then (case when (DATE(NOW()) > p.fechavencimiento) then 4  " +
    "when (DATE(NOW()) >= (CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico estrot1 WHERE estrot1.idindicador = p.idindicador AND estrot1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + p.fechafabricacion) AND DATE(NOW()) <= p.fechavencimiento) THEN 1 " +
    "when ((DATE_PART('YEAR', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot2.rotacion FROM mod_logreserva.conf_cuadrobasico " +
    " estrot2 WHERE estrot2.idindicador = p.idindicador AND estrot2.idestructura = " + idestructura + " limit 1)) AS " +
    " INTEGER) + p.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento " +
    " - p.fechafabricacion) * (SELECT estrot3.rotacion FROM mod_logreserva.conf_cuadrobasico estrot3 WHERE estrot3.idindicador " +
    " = p.idindicador AND estrot3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW " +
    "()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion " +
    ") * (SELECT estrot4.rotacion FROM mod_logreserva.conf_cuadrobasico estrot4 WHERE estrot4.idindicador = p.idindicador " +
    " AND estrot4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico estrot5 WHERE estrot5.idindicador = p.idindicador AND estrot5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 0) THEN 2 " +
    "end) else (case when (ih.tipocontrol <> 2) then 6 else 0 end) end) = 4  " +
    " or ((CASE WHEN l.fechavencimiento IS NOT NULL THEN (CASE WHEN (DATE(NOW()) > l.fechavencimiento) THEN 4 WHEN " +
    " (DATE(NOW()) >= (CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic1 WHERE cfcbasic1.idindicador = p.idindicador AND cfcbasic1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion) AND DATE(NOW()) <= l.fechavencimiento) THEN 1 WHEN ((DATE_PART " +
    "('YEAR', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic2.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic2 WHERE cfcbasic2.idindicador = p.idindicador AND cfcbasic2.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND( " +
    "(l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic3.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic3 " +
    " WHERE cfcbasic3.idindicador = p.idindicador AND cfcbasic3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion " +
    "), 'NOW()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion " +
    ") * (SELECT cfcbasic4.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic4 WHERE cfcbasic4.idindicador = p.idindicador AND " +
    " cfcbasic4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic5 WHERE cfcbasic5.idindicador = p.idindicador AND cfcbasic5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 0) THEN 2 END) ELSE 0 END) = 4) )  " +
    "union  " +
    "select count(distinct p.idproducto) as cantidad,  " +
    "'Listo a rotar' as estado from mod_logistica.dat_producto p " +
    "left join mod_logistica.dat_lote l on l.idproducto = p.idproducto  " +
    "inner join mod_logreserva.conf_cuadrobasico cb on cb.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador  " +
    "where p.cantidad > 0 and p.idestructura in (" + depositoreserva + ") " +
    "and ((case when p.fechavencimiento is not null then (case when (DATE(NOW()) > p.fechavencimiento) then 4  " +
    "when (DATE(NOW()) >= (CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico estrot1 WHERE estrot1.idindicador = p.idindicador AND estrot1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + p.fechafabricacion) AND DATE(NOW()) <= p.fechavencimiento) THEN 1 " +
    "when ((DATE_PART('YEAR', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot2.rotacion FROM mod_logreserva.conf_cuadrobasico " +
    " estrot2 WHERE estrot2.idindicador = p.idindicador AND estrot2.idestructura = " + idestructura + " limit 1)) AS " +
    " INTEGER) + p.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento " +
    " - p.fechafabricacion) * (SELECT estrot3.rotacion FROM mod_logreserva.conf_cuadrobasico estrot3 WHERE estrot3.idindicador " +
    " = p.idindicador AND estrot3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW " +
    "()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion " +
    ") * (SELECT estrot4.rotacion FROM mod_logreserva.conf_cuadrobasico estrot4 WHERE estrot4.idindicador = p.idindicador " +
    " AND estrot4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico estrot5 WHERE estrot5.idindicador = p.idindicador AND estrot5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 0) THEN 2 end)  " +
    "else (case when (ih.tipocontrol <> 2) then 6 else 0 end) end) = 1  " +
    " or ((CASE WHEN l.fechavencimiento IS NOT NULL THEN (CASE WHEN (DATE(NOW()) > l.fechavencimiento) THEN 4 WHEN " +
    " (DATE(NOW()) >= (CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic1 WHERE cfcbasic1.idindicador = p.idindicador AND cfcbasic1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion) AND DATE(NOW()) <= l.fechavencimiento) THEN 1 WHEN ((DATE_PART " +
    "('YEAR', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic2.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic2 WHERE cfcbasic2.idindicador = p.idindicador AND cfcbasic2.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND( " +
    "(l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic3.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic3 " +
    " WHERE cfcbasic3.idindicador = p.idindicador AND cfcbasic3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion " +
    "), 'NOW()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion " +
    ") * (SELECT cfcbasic4.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic4 WHERE cfcbasic4.idindicador = p.idindicador AND " +
    " cfcbasic4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic5 WHERE cfcbasic5.idindicador = p.idindicador AND cfcbasic5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 0) THEN 2 END) ELSE 0 END) = 1) )  " +
    "union  " +
    "select count(distinct p.idproducto) as cantidad,  " +
    "'Proximo a rotar' as estado from mod_logistica.dat_producto p " +
    "left join mod_logistica.dat_lote l on l.idproducto = p.idproducto  " +
    "inner join mod_logreserva.conf_cuadrobasico cb on cb.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador  " +
    "where p.cantidad > 0 and p.idestructura in (" + depositoreserva + ") " +
    "and ((case when p.fechavencimiento is not null then ( " +
    "case when (DATE(NOW()) > p.fechavencimiento) then 4  " +
    "when (DATE(NOW()) >= (CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico estrot1 WHERE estrot1.idindicador = p.idindicador AND estrot1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + p.fechafabricacion) AND DATE(NOW()) <= p.fechavencimiento) THEN 1 " +
    "when ((DATE_PART('YEAR', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot2.rotacion FROM mod_logreserva.conf_cuadrobasico " +
    " estrot2 WHERE estrot2.idindicador = p.idindicador AND estrot2.idestructura = " + idestructura + " limit 1)) AS " +
    " INTEGER) + p.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento " +
    " - p.fechafabricacion) * (SELECT estrot3.rotacion FROM mod_logreserva.conf_cuadrobasico estrot3 WHERE estrot3.idindicador " +
    " = p.idindicador AND estrot3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW " +
    "()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion " +
    ") * (SELECT estrot4.rotacion FROM mod_logreserva.conf_cuadrobasico estrot4 WHERE estrot4.idindicador = p.idindicador " +
    " AND estrot4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico estrot5 WHERE estrot5.idindicador = p.idindicador AND estrot5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 0) THEN 2 end)  " +
    "else (case when (ih.tipocontrol <> 2) then 6 else 0 end) end) = 2  " +
    " or ((CASE WHEN l.fechavencimiento IS NOT NULL THEN (CASE WHEN (DATE(NOW()) > l.fechavencimiento) THEN 4 WHEN " +
    " (DATE(NOW()) >= (CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic1 WHERE cfcbasic1.idindicador = p.idindicador AND cfcbasic1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion) AND DATE(NOW()) <= l.fechavencimiento) THEN 1 WHEN ((DATE_PART " +
    "('YEAR', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic2.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic2 WHERE cfcbasic2.idindicador = p.idindicador AND cfcbasic2.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND( " +
    "(l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic3.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic3 " +
    " WHERE cfcbasic3.idindicador = p.idindicador AND cfcbasic3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion " +
    "), 'NOW()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion " +
    ") * (SELECT cfcbasic4.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic4 WHERE cfcbasic4.idindicador = p.idindicador AND " +
    " cfcbasic4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic5 WHERE cfcbasic5.idindicador = p.idindicador AND cfcbasic5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 0) THEN 2 END) ELSE 0 END) = 2) )  " +
    "union  " +
    "select count(distinct p.idproducto) as cantidad,  " +
    "'Trimestre' as estado from mod_logistica.dat_producto p " +
    "left join mod_logistica.dat_lote l on l.idproducto = p.idproducto  " +
    "inner join mod_logreserva.conf_cuadrobasico cb on cb.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador  " +
    "where p.cantidad > 0 and p.idestructura in (" + depositoreserva + ") " +
    "and ((case when p.fechavencimiento is not null then (case when (DATE(NOW()) > p.fechavencimiento) then 4  " +
    "when (DATE(NOW()) >= (CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico estrot1 WHERE estrot1.idindicador = p.idindicador AND estrot1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + p.fechafabricacion) AND DATE(NOW()) <= p.fechavencimiento) THEN 1 " +
    "when ((DATE_PART('YEAR', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot2.rotacion FROM mod_logreserva.conf_cuadrobasico " +
    " estrot2 WHERE estrot2.idindicador = p.idindicador AND estrot2.idestructura = " + idestructura + " limit 1)) AS " +
    " INTEGER) + p.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento " +
    " - p.fechafabricacion) * (SELECT estrot3.rotacion FROM mod_logreserva.conf_cuadrobasico estrot3 WHERE estrot3.idindicador " +
    " = p.idindicador AND estrot3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW " +
    "()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion " +
    ") * (SELECT estrot4.rotacion FROM mod_logreserva.conf_cuadrobasico estrot4 WHERE estrot4.idindicador = p.idindicador " +
    " AND estrot4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico estrot5 WHERE estrot5.idindicador = p.idindicador AND estrot5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 0) THEN 2 end)  " +
    "else (case when (ih.tipocontrol <> 2) then 6 else 0 end) end) = 3  " +
    " or " +
    " ((CASE WHEN l.fechavencimiento IS NOT NULL THEN (CASE WHEN (DATE(NOW()) > l.fechavencimiento) THEN 4 WHEN " +
    " (DATE(NOW()) >= (CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic1 WHERE cfcbasic1.idindicador = p.idindicador AND cfcbasic1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion) AND DATE(NOW()) <= l.fechavencimiento) THEN 1 WHEN ((DATE_PART " +
    "('YEAR', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic2.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic2 WHERE cfcbasic2.idindicador = p.idindicador AND cfcbasic2.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND( " +
    "(l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic3.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic3 " +
    " WHERE cfcbasic3.idindicador = p.idindicador AND cfcbasic3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion " +
    "), 'NOW()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion " +
    ") * (SELECT cfcbasic4.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic4 WHERE cfcbasic4.idindicador = p.idindicador AND " +
    " cfcbasic4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic5 WHERE cfcbasic5.idindicador = p.idindicador AND cfcbasic5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 0) THEN 2 END) ELSE 0 END) = 3) )  " +
    "union  " +
    "select count(distinct p.idproducto) as cantidad,  " +
    "'En tiempo' as estado from mod_logistica.dat_producto p " +
    "left join mod_logistica.dat_lote l on l.idproducto = p.idproducto  " +
    "inner join mod_logreserva.conf_cuadrobasico cb on cb.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador  " +
    "where p.cantidad > 0 and p.idestructura in (" + depositoreserva + ") " +
    "and ((case when p.fechavencimiento is not null then (case when (DATE(NOW()) > p.fechavencimiento) then 4  " +
    "when (DATE(NOW()) >= (CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico estrot1 WHERE estrot1.idindicador = p.idindicador AND estrot1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + p.fechafabricacion) AND DATE(NOW()) <= p.fechavencimiento) THEN 1 " +
    "when ((DATE_PART('YEAR', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot2.rotacion FROM mod_logreserva.conf_cuadrobasico " +
    " estrot2 WHERE estrot2.idindicador = p.idindicador AND estrot2.idestructura = " + idestructura + " limit 1)) AS " +
    " INTEGER) + p.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento " +
    " - p.fechafabricacion) * (SELECT estrot3.rotacion FROM mod_logreserva.conf_cuadrobasico estrot3 WHERE estrot3.idindicador " +
    " = p.idindicador AND estrot3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW " +
    "()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion " +
    ") * (SELECT estrot4.rotacion FROM mod_logreserva.conf_cuadrobasico estrot4 WHERE estrot4.idindicador = p.idindicador " +
    " AND estrot4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico estrot5 WHERE estrot5.idindicador = p.idindicador AND estrot5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 0) THEN 2 end)  " +
    "else (case when (ih.tipocontrol <> 2) then 6 else 0 end) end) = 5  " +
    " or ((CASE WHEN l.fechavencimiento IS NOT NULL THEN (CASE WHEN (DATE(NOW()) > l.fechavencimiento) THEN 4 WHEN " +
    " (DATE(NOW()) >= (CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic1 WHERE cfcbasic1.idindicador = p.idindicador AND cfcbasic1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion) AND DATE(NOW()) <= l.fechavencimiento) THEN 1 WHEN ((DATE_PART " +
    "('YEAR', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic2.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic2 WHERE cfcbasic2.idindicador = p.idindicador AND cfcbasic2.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND( " +
    "(l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic3.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic3 " +
    " WHERE cfcbasic3.idindicador = p.idindicador AND cfcbasic3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion " +
    "), 'NOW()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion " +
    ") * (SELECT cfcbasic4.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic4 WHERE cfcbasic4.idindicador = p.idindicador AND " +
    " cfcbasic4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic5 WHERE cfcbasic5.idindicador = p.idindicador AND cfcbasic5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 0) THEN 2 END) ELSE 0 END) = 5) )  " +
    "union  " +
    "select count(distinct p.idproducto) as cantidad,  " +
    "'No vence' as estado from mod_logistica.dat_producto p " +
    "left join mod_logistica.dat_lote l on l.idproducto = p.idproducto  " +
    "inner join mod_logreserva.conf_cuadrobasico cb on cb.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador  " +
    "inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador  " +
    "where p.cantidad > 0 and p.idestructura in (" + depositoreserva + ") " +
    "and ((case when p.fechavencimiento is not null then ( " +
    "case when (DATE(NOW()) > p.fechavencimiento) then 4 when (DATE(NOW()) >= (CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico estrot1 WHERE estrot1.idindicador = p.idindicador AND estrot1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + p.fechafabricacion) AND DATE(NOW()) <= p.fechavencimiento) THEN 1 " +
    "when ((DATE_PART('YEAR', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot2.rotacion FROM mod_logreserva.conf_cuadrobasico " +
    " estrot2 WHERE estrot2.idindicador = p.idindicador AND estrot2.idestructura = " + idestructura + " limit 1)) AS " +
    " INTEGER) + p.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento " +
    " - p.fechafabricacion) * (SELECT estrot3.rotacion FROM mod_logreserva.conf_cuadrobasico estrot3 WHERE estrot3.idindicador " +
    " = p.idindicador AND estrot3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()' " +
    ")) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion " +
    ") * (SELECT estrot4.rotacion FROM mod_logreserva.conf_cuadrobasico estrot4 WHERE estrot4.idindicador = p.idindicador " +
    " AND estrot4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((p.fechavencimiento - p.fechafabricacion) * (SELECT estrot5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico estrot5 WHERE estrot5.idindicador = p.idindicador AND estrot5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + p.fechafabricacion), 'NOW()')) >= 0) THEN 2 end)  " +
    "else (case when (ih.tipocontrol <> 2) then 6 else 0 end) end) = 6  " +
    " or " +
    " ((CASE WHEN l.fechavencimiento IS NOT NULL THEN (CASE WHEN (DATE(NOW()) > l.fechavencimiento) THEN 4 WHEN " +
    " (DATE(NOW()) >= (CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic1.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic1 WHERE cfcbasic1.idindicador = p.idindicador AND cfcbasic1.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion) AND DATE(NOW()) <= l.fechavencimiento) THEN 1 WHEN ((DATE_PART " +
    "('YEAR', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic2.rotacion FROM " +
    " mod_logreserva.conf_cuadrobasico cfcbasic2 WHERE cfcbasic2.idindicador = p.idindicador AND cfcbasic2.idestructura = " + idestructura +
    " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) > 0) OR (DATE_PART('MONTH', AGE((CAST(ROUND( " +
    "(l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic3.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic3 " +
    " WHERE cfcbasic3.idindicador = p.idindicador AND cfcbasic3.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion " +
    "), 'NOW()')) > 3)) THEN 5 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion " +
    ") * (SELECT cfcbasic4.rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic4 WHERE cfcbasic4.idindicador = p.idindicador AND " +
    " cfcbasic4.idestructura = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 2) THEN " +
    " 3 WHEN (DATE_PART('MONTH', AGE((CAST(ROUND((l.fechavencimiento - l.fechafabricacion) * (SELECT cfcbasic5 " +
    ".rotacion FROM mod_logreserva.conf_cuadrobasico cfcbasic5 WHERE cfcbasic5.idindicador = p.idindicador AND cfcbasic5.idestructura " +
    " = " + idestructura + " limit 1)) AS INTEGER) + l.fechafabricacion), 'NOW()')) >= 0) THEN 2 END) ELSE 0 END) = 6) )"
},{
    name: 'Acumulacion',
    sql: "select count(distinct ppl.idindicador) as cantidad, 'No acumulados' as estado from mod_logreserva.dat_prodplanacumulacion ppl     	  " +
    "inner join mod_logreserva.dat_planacumulacion pl on pl.idplanacumulacion = ppl.idplanacumulacion 	  " +
    "where pl.estado = 3 and  pl.idejercicio = " + idejercicio + " and ppl.idestructura in (" + delegaciones + ") 	  " +
    "and ppl.idindicador not in ( 	 select p.idindicador from mod_logistica.dat_producto p 	  " +
    "inner join mod_logistica.dat_movimiento dm on dm.idproducto = p.idproducto 	  " +
    "inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento 	  " +
    "inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = dd.iddocumento       	  " +
    "inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento     	  " +
    "where dd.estado = 4 and rr.concepto in (5,6) and p.idestructuracomun in (" + hijossubordinacion + ")  " +
    "	union  " +
    "	select i.idpadre from mod_logistica.dat_producto p 	  " +
    "	inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador 	  " +
    "	inner join mod_logistica.dat_movimiento dm on dm.idproducto = p.idproducto 	  " +
    "	inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento 	  " +
    "	inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = dd.iddocumento       	  " +
    "	inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento     	  " +
    "	where dd.estado = 4 and rr.concepto in (5,6) and p.idestructuracomun in (" + hijossubordinacion + ") " +
    "	)  " +
    "union  select count(distinct ppl.idindicador) as cantidad, 'Parcialmente acumulados' as estado from mod_logreserva.dat_prodplanacumulacion ppl      	  " +
    "inner join mod_logreserva.dat_planacumulacion pl on pl.idplanacumulacion = ppl.idplanacumulacion  	 " +
    "inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = ppl.idindicador  	 " +
    "left join mod_datosmaestros.nom_indicadorhoja indh on ind.idindicador = indh.idindicador  	 " +
    " where pl.estado = 3 and pl.idejercicio = " + idejercicio + " and ppl.idestructura in (" + delegaciones + ") 	  " +
    "and ppl.idindicador in ( select p.idindicador from mod_logistica.dat_producto p 	  " +
    "inner join mod_logistica.dat_movimiento dm on dm.idproducto = p.idproducto 	  " +
    "inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento 	  " +
    "inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = dd.iddocumento       	  " +
    "inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento     	  " +
    "where dd.estado = 4 and rr.concepto in (5,6) and p.idestructuracomun in (" + hijossubordinacion + ")  " +
    "union select i.idpadre from mod_logistica.dat_producto p 	  " +
    "	inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador 	  " +
    "	inner join mod_logistica.dat_movimiento dm on dm.idproducto = p.idproducto 	  " +
    "	inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento 	  " +
    "	inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = dd.iddocumento       	  " +
    "	inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento     	  " +
    "	where dd.estado = 4 and rr.concepto in (5,6) and p.idestructuracomun in (" + hijossubordinacion + ")) 	 " +
    " and ((case when indh.idindicador is not null then (select coalesce(sum(m.cantidad),0) from mod_logistica.dat_movimiento m     	 " +
    "inner join mod_logistica.dat_documento d on m.iddocumento = d.iddocumento       	 " +
    "inner join mod_logistica.dat_producto dp on m.idproducto = dp.idproducto      	 " +
    "inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = d.iddocumento       	 " +
    "inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento       	 " +
    "where d.estado = 4 and rr.concepto in (5,6) and dp.idindicador = ppl.idindicador) else (select coalesce(sum(m.cantidad),0) from mod_logistica.dat_movimiento m     	 " +
    "inner join mod_logistica.dat_documento d on m.iddocumento = d.iddocumento       	 " +
    "inner join mod_logistica.dat_producto dp on m.idproducto = dp.idproducto      	 " +
    "inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador " +
    "inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = d.iddocumento       	 " +
    "inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento       	 " +
    "where d.estado = 4 and rr.concepto in (5,6) and i.idpadre = ppl.idindicador) end) <  (select sum(pln.cantplanificada) from mod_logreserva.dat_prodplanacumulacion pln 	 " +
    "inner join mod_logreserva.dat_planacumulacion pla on pla.idplanacumulacion = pln.idplanacumulacion 	 " +
    "where pln.idindicador = ppl.idindicador and pla.estado = 3 and pla.idejercicio = " + idejercicio + " and pln.idestructura in (" + delegaciones + ")))  " +
    "union  select count(distinct ppl.idindicador) as cantidad, 'Completamente acumulados' as estado from mod_logreserva.dat_prodplanacumulacion ppl      	  " +
    "inner join mod_logreserva.dat_planacumulacion pl on pl.idplanacumulacion = ppl.idplanacumulacion  	 " +
    "inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = ppl.idindicador  	 " +
    "left join mod_datosmaestros.nom_indicadorhoja indh on ind.idindicador = indh.idindicador  	 " +
    " where pl.estado = 3 and pl.idejercicio = " + idejercicio + " and ppl.idestructura in (" + delegaciones + ") 	  " +
    "and ppl.idindicador in ( select p.idindicador from mod_logistica.dat_producto p 	  " +
    "inner join mod_logistica.dat_movimiento dm on dm.idproducto = p.idproducto 	  " +
    "inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento 	  " +
    "inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = dd.iddocumento       	  " +
    "inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento     	  " +
    "where dd.estado = 4 and rr.concepto in (5,6) and p.idestructuracomun in (" + hijossubordinacion + ")  " +
    "union select i.idpadre from mod_logistica.dat_producto p 	  " +
    "	inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador 	  " +
    "	inner join mod_logistica.dat_movimiento dm on dm.idproducto = p.idproducto 	  " +
    "	inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento 	  " +
    "	inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = dd.iddocumento       	  " +
    "	inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento     	  " +
    "	where dd.estado = 4 and rr.concepto in (5,6) and p.idestructuracomun in (" + hijossubordinacion + ")) 	 " +
    " and ((case when indh.idindicador is not null then (select coalesce(sum(m.cantidad),0) from mod_logistica.dat_movimiento m     	 " +
    "inner join mod_logistica.dat_documento d on m.iddocumento = d.iddocumento       	 " +
    "inner join mod_logistica.dat_producto dp on m.idproducto = dp.idproducto      	 " +
    "inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = d.iddocumento       	 " +
    "inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento       	 " +
    "where d.estado = 4 and rr.concepto in (5,6) and dp.idindicador = ppl.idindicador) else (select coalesce(sum(m.cantidad),0) from mod_logistica.dat_movimiento m     	 " +
    "inner join mod_logistica.dat_documento d on m.iddocumento = d.iddocumento       	 " +
    "inner join mod_logistica.dat_producto dp on m.idproducto = dp.idproducto      	 " +
    "inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador " +
    "inner join mod_loginventario.dat_recepcion ifr on ifr.iddocumento = d.iddocumento       	 " +
    "inner join mod_logreserva.dat_recepcionreserva rr on ifr.iddocumento = rr.iddocumento       	 " +
    "where d.estado = 4 and rr.concepto in (5,6) and i.idpadre = ppl.idindicador) end) =  (select sum(pln.cantplanificada) from mod_logreserva.dat_prodplanacumulacion pln 	 " +
    "inner join mod_logreserva.dat_planacumulacion pla on pla.idplanacumulacion = pln.idplanacumulacion 	 " +
    "where pln.idindicador = ppl.idindicador and pla.estado = 3 and pla.idejercicio = " + idejercicio + " and pln.idestructura in (" + delegaciones + ")))"
}
];
Ext.ns('Ext.erp.tcresest');
Ext.erp.tcresest.cf = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        this.title = config.title ? config.title : '';
        Ext.erp.tcresest.cf.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcresest.cf.superclass.initComponent.call(this);

        this.initDashboard();
    },
    initDashboard: function(){
        this.DashboardPanel.addChart({
            title: this.title,
            allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
            chartType: 'column',
            legend: {
                layout: 'vertical',
                floating: true,
                align: 'right',
                verticalAlign: 'top',
                borderWidth: 1,
                symbolRadius: 2,
                x: 0,
                y: 35,
                itemHoverStyle: {
                    color: '#FF0000'
                }
            }
        }, Ext.erp.Sourcesresest[0], {
            x: {
                label: 'Documento',
                source: 'documento'
            },
            y: {
                label: 'Cantidad productos',
                source: 'cantidad'
            }
         },[{
            name: 'Cantidad productos',
            source: 'cantidad'
        }],[{
            name: 'Documento',
            source: 'documento'
        }],{
        Documento:[
        {
            name: 'Facturas elaboracion',
            source: 'elaboracion'
        },{
            name: 'Facturas preparadas',
            source: 'preparado'
         },
         {
            name: 'Facturas canceladas',
            source: 'cancelado'
        },{
            name: 'Facturas contabilizadas',
            source: 'contabilizado'
        }
    ]});
    }
});

Ext.erp.tcresest.co = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        this.title = config.title ? config.title : '';
        Ext.erp.tcresest.co.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcresest.co.superclass.initComponent.call(this);

        this.initDashboard();
    },
    initDashboard: function () {
        this.DashboardPanel.addChart({
         title: this.title,
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'column',
            legend: {
                layout: 'vertical',
                floating: true,
                align: 'right',
                verticalAlign: 'top',
                borderWidth: 1,
                symbolRadius: 2,
                x: 0,
                y: 35,
                itemHoverStyle: {
                    color: '#FF0000'
                }
            }
         }, Ext.erp.Sourcesresest[1], {
         x: {
         label: 'Estado',
         source: 'estado'
         },
         y: {
         label: 'Cantidad producto',
         source: 'cantidad'
         }
         },[{
         name: 'Cantidad producto',
         source: 'cantidad'
         }],[{
         name: 'Estado',
         source: 'estado'
         }],{
         Documento:[
         {
         name: 'Facturas elaboracion',
         source: 'elaboracion'
         },{
         name: 'Facturas preparadas',
         source: 'preparado'
         },
         {
         name: 'Facturas aprobadas',
         source: 'aprobado'
         }
         ]});
    }
});

Ext.erp.tcresest.cn = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        this.title = config.title ? config.title : '';
        Ext.erp.tcresest.cn.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        this.layout = this.layout ? this.layout : 'border';
        this.region = this.region ? this.region : 'center';
        this.DashboardPanel = new Ax.Charts.Views.DashboardPanel();
        this.items = [this.DashboardPanel];
        Ext.erp.tcresest.cn.superclass.initComponent.call(this);

        this.initDashboard();
    },
    initDashboard: function () {
         this.DashboardPanel.addChart({
         title: this.title,
         allowTypes: ['line', 'column', 'pie', 'spline', 'area'],
         chartType: 'column',
             legend: {
                 layout: 'vertical',
                 floating: true,
                 align: 'right',
                 verticalAlign: 'top',
                 borderWidth: 1,
                 symbolRadius: 2,
                 x: 0,
                 y: 35,
                 itemHoverStyle: {
                     color: '#FF0000'
                 }
             }
         }, Ext.erp.Sourcesresest[2], {
         x: {
         label: 'Acumulaci\xf3n',
         source: 'estado'
         },
         y: {
         label: 'Cantidad de productos',
         source: 'cantidad'
         }
         },[{
         name: 'Cantidad de productos',
         source: 'cantidad'
         }],[{
         name: 'Acumulaci\xf3n',
         source: 'estado'
         }],{
         Documento:[
         {
         name: 'Facturas elaboracion',
         source: 'elaboracion'
         },{
         name: 'Facturas preparadas',
         source: 'preparado'
         },
         {
         name: 'Facturas contabilizadas',
         source: 'contabilizado'
         },{
         name: 'Facturas canceladas',
         source: 'cancelado'
         }

         ]});
    }
});