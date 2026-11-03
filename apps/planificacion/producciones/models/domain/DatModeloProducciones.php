<?php
//require_once __DIR__ . '/../../planmeta/models/domain/DatModelo.php';
class DatModeloProducciones extends DatModelo {

    public function setUp() {
        parent::setUp();      
    }

    
   public function getModelosPlan($node, $identidad, $idejercicio, $identidades) {
        $conn = Doctrine_Manager::connection();
        $query = "WITH planificado AS (
                    SELECT DISTINCT em.idmodelo
                    FROM mod_planificacion.dat_planificacion p
                         INNER JOIN mod_planificacion.dat_entidadmodelo em ON (
                           em.identidadmodelo = p.identidadmodelo AND
                           p.idejercicio = $idejercicio)
                    WHERE em.identidad IN ($identidades)),
  cantdesg as (
  WITH carta AS 
(SELECT aect.idactividadentidad,
        ROUND(COALESCE(sum(aect.nivelactividadproduccion), 0), 4) as ct
 FROM mod_spouam.dat_actividadentidadprodcartatec aect
 GROUP BY aect.idactividadentidad)


SELECT am.idmodelo,
                       case
                         when SUM(des.nivelactivdesglosado) = 0 then 0
                         WHEN SUM(des.nivelactivdesglosado) =(ROUND(COALESCE(
                           aea.nivelactividadautomatico, 0), 4) + ROUND(COALESCE
                           (aem.nivelactividadmanual, 0), 4) + ROUND(COALESCE(
                           aep.nivelactividadproduccion, 0), 4) + ROUND( COALESCE(aect.ct, 0),4) + ROUND(COALESCE
                           (ae.ajuste, 0), 4)) then 1
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
                WHERE ae.identidad IN ($identidades) AND
                      (ae.idaprobacion = 3 OR
                      ae.idaprobacion = 4 OR
                      ae.idaprobacion = 5)
                GROUP BY des.idactividadentidad,
                         aea.nivelactividadautomatico,
                         aem.nivelactividadmanual,
                         aep.nivelactividadproduccion,aect.ct,
                         ae.ajuste,
                         am.idmodelo) 
                    SELECT DISTINCT m.idmodelo,
                           em.identidadmodelo,
                           m.idmodelo as id,
                           m.denominacion,
                           m.tipoplan,
                           m.descripcion,
                           m.fechaentrega,
                           m.idplan,
                           m.idtipomodelo,
                           true as leaf,
                           2 as tipo,
                           m.uriruta as ruta,
                           tm.denominacion as tipomodelo,
                           m.identidad as identidadcrea,
                           CASE
                             WHEN p.idmodelo IS NOT NULL THEN 1
                             ELSE 0
                           END as planif,
                           min(COALESCE(d.desglosada, 0)) as desglosada
                    FROM mod_planificacion.dat_modelo m
                         LEFT JOIN mod_planificacion.dat_entidadmodelo em ON (
                           m.idmodelo = em.idmodelo)
                         INNER JOIN mod_planificacion.nom_tipomodelo tm ON (
                           tm.idtipomodelo = m.idtipomodelo)
                         LEFT JOIN planificado p ON em.idmodelo = p.idmodelo
                         LEFT JOIN cantdesg d ON d.idmodelo = m.idmodelo
                    WHERE m.idplan = $node AND
                          em.identidad = $identidad  
                    GROUP BY m.idmodelo,
                             em.identidadmodelo,
                             m.denominacion,
                             m.tipoplan,
                             m.descripcion,
                             m.fechaentrega,
                             m.idplan,
                             m.idtipomodelo,
                             m.uriruta,
                             tm.denominacion,
                             m.identidad,
                             p.idmodelo";    
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }
   
}
