--Script para actualizar la naturaleza,grupo y denominación
UPDATE 
mod_logactivofijotangible.dat_regnumericoactivo a
SET idgruposubgrupo = b.idgruposubgrupo,
    denominacion = b.denominacion,
    idnaturaleza = b.idnaturaleza
from (
  SELECT ih.idgruposubgrupo, rn.idregnumerico, i.denominacion, i.idnaturaleza
  FROM mod_logactivofijotangible.dat_registronumerico rn 
  inner join mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto 
  inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
  inner join mod_datosmaestros.nom_indicadorhoja ih ON ih.idindicador = i.idindicador
) b
WHERE 
a.idregnumerico = b.idregnumerico