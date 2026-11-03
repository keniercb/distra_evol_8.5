<?php

class DatNivelactividadporfechasisplaninversiones extends DatNivelactividadporfecha {

    public function listarNivelesAct($params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having) {
        $nivel = NomActividad::getNivel();
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count(*) OVER() as total,
                x.idactividad as idactividad,
       x.codigo,
       x.denominacion,
       SUM(x.nivelactividadfinal) as nivelactividad,
       SUM(x.nivelactividadbp) as nivelactividadbp,
       SUM(x.nivelactividadinv) as nivelactividadinv,
       SUM(x.nivelactividadproy) as nivelactividadproy,
       SUM(x.nivelactividadxfecha) as nivelactividadreal,
       COALESCE((SUM(x.nivelactividadfinal) - COALESCE(SUM(x.nivelactividadxfecha), 0)), 0) as nivelactividadpordesglozar
       
FROM (
      WITH basesplan AS (
                              SELECT COALESCE(sum(nivelactividad), 0) as
                                nivelactividad,
                                     idactividadentidad
                              FROM mod_planificacion.dat_nivelactividadporfecha
                              GROUP BY idactividadentidad
           ),
      inversiones AS (
                              SELECT COALESCE(sum(inf.nivelactividadinversion), 0) as nivelactividad,
                                     idactividadentidad
                              FROM
                                mod_planifinversiones.dat_inversnivelactividaddesglose
                                ind
                                   LEFT JOIN
                                     mod_planifintegracion.dat_inversnivelactividadxfecha
                                     inf ON inf.idinversnivelactividaddesglose =
                                     ind.idinversnivelactividaddesglose
                              GROUP BY idactividadentidad
           ),
           proyecto AS (
                              SELECT COALESCE(sum( enf.nivelactividad), 0) as nivelactividad,
                                     idactividadentidad
                              FROM mod_planifintegracion.dat_elementonivelactividadporfecha enf
                              GROUP BY idactividadentidad
           )
     
SELECT a.idactividad as idactividad, a.codigo, a.denominacion, 
(COALESCE(aem.nivelactividadmanual, 0) + 
COALESCE(aea.nivelactividadautomatico, 0) +
COALESCE(aep.nivelactividadproduccion, 0) + 
COALESCE(aee.nivelactividadelemento, 0) /*+ COALESCE(ae.ajuste, 0)*/ + COALESCE(SUM(aei.plan), 0)) as nivelactividadfinal, 

(COALESCE(aem.nivelactividadmanual, 0) + COALESCE(aea.nivelactividadautomatico, 0) + COALESCE(aep.nivelactividadproduccion, 0)) as nivelactividadbp, 

COALESCE(SUM(aei.plan),0) as nivelactividadinv, 

COALESCE(aee.nivelactividadelemento, 0) as nivelactividadproy, 

COALESCE(v.nivelactividad, 0)+COALESCE(i.nivelactividad, 0)+COALESCE(p.nivelactividad, 0) as nivelactividadxfecha

FROM mod_planificacion.nom_actividad a
     INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON (a.idactividad
       = aec.idactividad AND aec.idespecialidad IN ({$strEspecialidades}))
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON (
       ae.idactespcomportamiento = aec.idactespcomportamiento AND (
       ae.idejercicio = {$params['idejercicio']} or ae.idejercicio is null) AND (ae.identidad IN (
       {$strEntidades}) or ae.identidad is null))
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
       aem.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee ON (
       aee.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
       aea.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
       aep.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei ON (
       aei.idactividadentidad = ae.idactividadentidad AND aei.idejercicio = {$params['idejercicio']})
     LEFT JOIN basesplan v ON (ae.idactividadentidad = v.idactividadentidad)
     LEFT JOIN inversiones i ON (ae.idactividadentidad = i.idactividadentidad)
     LEFT JOIN proyecto p ON (ae.idactividadentidad = p.idactividadentidad)
     
             
WHERE a.nivel = {$nivel} AND
      a.idaprobacion = 4 AND
      a.estado = 1
       " . $WHERE . "
GROUP BY a.idactividad, a.codigo, a.denominacion, aea.nivelactividadautomatico,
  aem.nivelactividadmanual, aee.nivelactividadelemento,
  aep.nivelactividadproduccion, ae.ajuste, v.nivelactividad,
  aec.idactespcomportamiento,i.nivelactividad,p.nivelactividad
ORDER BY a.codigo) as x
GROUP BY x.idactividad,
         x.codigo,
         x.denominacion
 " . $Having . "
ORDER BY x.codigo $offsetLimit";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function listarDesgloseNivelesAct($params, $addWhere, $addWhereI, $addWhereP, $where) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT x.id as idnivelactividadporfecha,
       x.idactividadentidad,
       x.nivelactividad,
       x.fechainicio,
       x.fechafin,
       x.tipo
FROM ((SELECT nf.idnivelactividadporfecha as id,
        nf.idactividadentidad,
        nf.nivelactividad,
        nf.fechainicio,
        nf.fechafin,
        1 as tipo
 FROM mod_planificacion.dat_nivelactividadporfecha nf
 WHERE nf.idactividadentidad = {$params['idactividadentidad']}
     $addWhere)
 UNION
(SELECT inf.idinversnivelactividadxfecha as id,
        ind.idactividadentidad,
        inf.nivelactividadinversion as nivelactividad,
        inf.fechainicio,
        inf.fechafin,
        2 as tipo
 FROM mod_planifinversiones.dat_inversnivelactividaddesglose ind
      INNER JOIN mod_planifintegracion.dat_inversnivelactividadxfecha inf ON
        inf.idinversnivelactividaddesglose = ind.idinversnivelactividaddesglose
 WHERE ind.idactividadentidad = {$params['idactividadentidad'] }
     $addWhereI)
UNION
(
SELECT enf.idelementonivelactividadporfecha as id,
       enf.idactividadentidad,
       enf.nivelactividad,
       enf.fechainicio,
       enf.fechafin,
        3 as tipo
FROM mod_planifintegracion.dat_elementonivelactividadporfecha enf
WHERE enf.idactividadentidad = {$params['idactividadentidad']} $addWhereP)"
                . ")x  $where LIMIT {$params['limit']} OFFSET {$params['start']}";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $sqlT = "
 SELECT count(x.id) 
FROM ((
        SELECT nf.idnivelactividadporfecha as id,
               nf.idactividadentidad,
               nf.nivelactividad,
               nf.fechainicio,
               nf.fechafin,
        1 as tipo
        FROM mod_planificacion.dat_nivelactividadporfecha nf
        WHERE nf.idactividadentidad = {$params['idactividadentidad']}
            $addWhere
     )
UNION (
        SELECT inf.idinversnivelactividadxfecha as id,
               ind.idactividadentidad,
               inf.nivelactividadinversion as nivelactividad,
               inf.fechainicio,
               inf.fechafin,
        2 as tipo
        FROM mod_planifinversiones.dat_inversnivelactividaddesglose ind
             INNER JOIN mod_planifintegracion.dat_inversnivelactividadxfecha inf
               ON inf.idinversnivelactividaddesglose =
               ind.idinversnivelactividaddesglose
        WHERE ind.idactividadentidad = {$params['idactividadentidad']}
            $addWhereI
      )
UNION (
        SELECT enf.idelementonivelactividadporfecha as id,
               enf.idactividadentidad,
               enf.nivelactividad,
               enf.fechainicio,
               enf.fechafin,
        3 as tipo
        FROM mod_planifintegracion.dat_elementonivelactividadporfecha enf
        WHERE enf.idactividadentidad = {$params['idactividadentidad']}
            $addWhereP
      )) x $where";
        
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

}
