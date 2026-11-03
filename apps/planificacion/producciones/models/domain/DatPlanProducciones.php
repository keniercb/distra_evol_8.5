<?php

//require_once __DIR__ . '/../../planmeta/models/domain/DatPlan.php';
class DatPlanProducciones extends DatPlan {

    public function setUp() {
        parent::setUp();
    }

    public function getPlanesEntidadNiv($identidad, $idejercicio, $identidades) {
        $conn = Doctrine_Manager::connection();
        $sql = "WITH cantdesg as ( 
            
            WITH carta AS 
(SELECT aect.idactividadentidad,
        ROUND(COALESCE(sum(aect.nivelactividadproduccion), 0), 4) as ct
 FROM mod_spouam.dat_actividadentidadprodcartatec aect
 GROUP BY aect.idactividadentidad)
 
SELECT DISTINCT m.idplan,
                       case
                         when SUM(des.nivelactivdesglosado) = 0 then 0
                         WHEN SUM(des.nivelactivdesglosado) =(ROUND(COALESCE(
                           aea.nivelactividadautomatico, 0), 4) + ROUND(COALESCE
                           (aem.nivelactividadmanual, 0), 4) + ROUND(COALESCE(
                           aep.nivelactividadproduccion, 0), 4) + ROUND(COALESCE
                           (ae.ajuste, 0), 4)+ ROUND( COALESCE(aect.ct, 0),4) ) then 1
                         WHEN SUM(des.nivelactivdesglosado) > 0 then 2
                       end as desglosada
                FROM mod_planificacion.dat_desgloseentidadnivel des
                     INNER JOIN mod_planificacion.dat_actividadentidad ae ON (
                       des.idactividadentidad = ae.idactividadentidad AND
                       ae.idejercicio = $idejercicio)
                     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                       ON (aem.idactividadentidad = ae.idactividadentidad)
                     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico
                       aea ON (aea.idactividadentidad = ae.idactividadentidad)
                     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion
                       aep ON (aep.idactividadentidad = ae.idactividadentidad)
                       LEFT JOIN carta aect ON (aect.idactividadentidad = ae.idactividadentidad)
                     INNER JOIN mod_planificacion.dat_actividadmodelo am ON
                       am.idactividad = ae.idactividad
                        INNER JOIN mod_planificacion.dat_modelo m ON(am.idmodelo=m.idmodelo)
                WHERE ae.identidad IN ($identidades) AND
                      (ae.idaprobacion = 3 OR
                      ae.idaprobacion = 4 OR
                      ae.idaprobacion = 5)
                GROUP BY des.idactividadentidad,
                         aea.nivelactividadautomatico,
                         aem.nivelactividadmanual,
                         aect.ct,
                         aep.nivelactividadproduccion,
                         ae.ajuste,
                         m.idplan
                         )
SELECT DISTINCT(p.idplan) as id,
                            p.idplan as idplan,
                            CASE
                                WHEN m.idplan is NULL THEN true
                                ELSE false
                              END as leaf,
                            p.denominacion,
                            p.codigo,
                            p.descripcion,
                            'plan' as iconCls,
                             min(COALESCE(d.desglosada, 0)) as desglosada
                      FROM mod_planificacion.dat_plan p
                      LEFT JOIN mod_planificacion.dat_modelo m ON(p.idplan=m.idplan)
                      LEFT JOIN mod_planificacion.dat_entidadmodelo em ON(m.idmodelo=em.idmodelo)
                         LEFT JOIN cantdesg d ON d.idplan = m.idplan
                      WHERE p.idplan = p.idpadre 
                      AND em.identidad=$identidad 
                      GROUP BY p.idplan,
                        m.idplan,
                        p.denominacion,
                        p.codigo,
                        p.descripcion";
        //print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function DameActFechaPorCiento($idaplicacioncartatec) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dat_actividadentidadprodcartatec.fechainicio, 
                    dat_actividadentidadprodcartatec.fechafin, 
                    dat_aplicacioncartatec.idcartatecnologica,
                    dat_cartatecnologicaactividad.porciento
                  FROM 
                    mod_spouam.dat_actividadentidadprodcartatec, 
                    mod_spouam.dat_aplicacioncartatec, 
                    mod_spouam.dat_cartatecnologicaactividad
                  WHERE 
                    dat_actividadentidadprodcartatec.idcartatecnologicaactividad = dat_cartatecnologicaactividad.idcartatecnologicaactividad AND
                    dat_aplicacioncartatec.idaplicacioncartatec = dat_actividadentidadprodcartatec.idaplicacioncartatec AND 
                    dat_cartatecnologicaactividad.porciento > 0 AND
                    dat_aplicacioncartatec.idaplicacioncartatec = $idaplicacioncartatec";
        //print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function DameIdmodIdindi($idcartatec) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idmodelo, idindicador
                    FROM mod_spouam.dat_cartatecnologica where idcartatecnologica = $idcartatec";
        //print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function DameIdCartatec($idaplicacioncartatec) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  idcartatecnologica
                FROM mod_spouam.dat_aplicacioncartatec where idaplicacioncartatec = $idaplicacioncartatec";
        //print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function DamePlanificacion($idmodelo, $idejercicio, $identidadmodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dat_planificacion.idplanificacion, 
                    dat_planificacion.idindicador, 
                    dat_planificacion.generadobasesplan, 
                    dat_planificacion.identidadmodelo, 
                    dat_planificacion.idejercicio
                  FROM 
                    mod_planificacion.dat_entidadmodelo, 
                    mod_planificacion.dat_planificacion,
                    mod_planificacionmeta.dat_003                    
                  WHERE 
                    dat_planificacion.identidadmodelo = dat_entidadmodelo.identidadmodelo AND
                    dat_planificacion.idplanificacion = dat_003.idplanificacion AND
                    dat_entidadmodelo.identidadmodelo = $identidadmodelo AND 
                    dat_entidadmodelo.idmodelo = $idmodelo AND 
                    dat_planificacion.idejercicio = $idejercicio;";
        //print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

}
