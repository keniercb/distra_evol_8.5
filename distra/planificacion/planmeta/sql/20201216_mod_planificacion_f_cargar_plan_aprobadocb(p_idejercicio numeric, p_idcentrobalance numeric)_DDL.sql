CREATE OR REPLACE FUNCTION mod_planificacion.f_cargar_plan_aprobadocb (
  p_idejercicio numeric,
  p_idcentrobalance numeric
)
RETURNS numeric AS
$body$
DECLARE 
 v_identidad numeric = 0;
  
BEGIN
v_identidad = (select ed.identidad from mod_planificacion.dat_entidaddatosnomenclador ed where ed.identidaddatosnomenclador = p_idcentrobalance);

  INSERT INTO 
  mod_planificacion.dat_controldemanda
(  
  idejercicio,
  identidad,
  idindicador,
  idunidadmedida,
  viasadquisicion,
  organossatisface,
  precio,
  cantidad,
  idaprobacion
)
(SELECT          
       p_idejercicio as idejercicio,
       v_identidad as identidad,
       consInt.idindicador,
       consInt.idunidadmedida,
       consInt.viasadquisicion,
       consInt.organossatisface,
       round(consInt.precio,3) as precio,
       round(consInt.demanda,3) as cantiad,          
       4 as idaprobacion
            
   
   fROM (SELECT i.idindicador,
          p.idunidadmedida,
          p.viasadquisicion,
          p.organossatisface,          
          p.precio,
          
        -- CASE
        -- WHEN p.idaprobaciondemanda = 5 THEN
        --necesidad de plan
          ((SUM(p.cantidad + p.ajuste)) -
          --ajuste como od
          (SELECT COALESCE(SUM(cpe), 0) as cpe
            FROM mod_planificacion.dat_odcte odcte
            WHERE odcte.idindicador = i.idindicador AND odcte.idejercicio = p_idejercicio) -
          --ajuste como cb
          (SELECT COALESCE((SELECT SUM(COALESCE(coberturaparcialestimada, 0))
                              FROM mod_planificacion.dat_ajusteexistenciacb aecb
                              WHERE aecb.identidad = v_identidad
                              AND aecb.idindicador = i.idindicador AND aecb.idejercicio = p_idejercicio), 0))) --ELSE
      /* --necesidad de plan
          ((SUM(p.cantidad)) -
          --ajuste como od
          (SELECT COALESCE(SUM(cpe), 0) as cpe
            FROM mod_planificacion.dat_odcte odcte
            WHERE odcte.idindicador = i.idindicador AND odcte.idejercicio = p_idejercicio) -
          --ajuste como cb
          (SELECT COALESCE((SELECT SUM(COALESCE(coberturaparcialestimada, 0))
                              FROM mod_planificacion.dat_ajusteexistenciacb aecb
                              WHERE aecb.identidad = v_identidad
                              AND aecb.idindicador = i.idindicador AND aecb.idejercicio = p_idejercicio), 0)))
       END*/ as demanda
          
   FROM mod_planificacion.dat_planificacion p
        INNER JOIN mod_datosmaestros.nom_indicador i ON (p.idindicador =  i.idindicador)
   WHERE p.idejercicio = p_idejercicio AND
         p.idcentrobalance = p_idcentrobalance AND
      	(p.idaprobaciondemanda = 4 OR
      	 p.idaprobaciondemanda = 5)     
   GROUP BY i.idindicador,
            p.precio,
            p.idunidadmedida,
            p.viasadquisicion,
          	p.organossatisface--,
            --p.idaprobaciondemanda 
   ORDER BY i.codigo ) as consInt
   WHERE  round(consInt.demanda,3)>0);

return 1;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;