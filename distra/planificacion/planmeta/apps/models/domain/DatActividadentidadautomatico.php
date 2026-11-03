<?php

class DatActividadentidadautomatico extends BaseDatActividadentidadautomatico {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatActividadentidad', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
        $this->hasOne(
                'DatRegla', array('local' => 'idregla', 'foreign' => 'idregla')
        );
    }

    public function buscarAsociacionAutomatico($idactividadentidad) {
        $query = Doctrine_Query::create();
        return $query->from('DatActividadentidadautomatico aea')
                        ->innerJoin('aea.DatRegla r')
                        ->innerJoin('r.DatNorma n')
                        ->where('aea.idactividadentidad = ?', $idactividadentidad)
                        ->execute();
    }

    public function buscarAsoc($idactividadentidad) {
        $query = Doctrine_Query::create();
        return $query
                        ->from('DatActividadentidadautomatico')
                        ->where('idactividadentidad = ?', $idactividadentidad)
                        ->execute()->getFirst();
    }

    public function buscarAsociacionAutomaticoPorEntidadYRegla($identidad, $idregla
    ) {
        $query = Doctrine_Query::create();
        return $query
                        ->from('DatActividadentidad ae')//********AQUI
                        ->innerJoin('ae.DatActividadentidadautomatico aea')
                        ->where(
                                'ae.identidad = ? AND aea.idregla = ?', array($identidad, $idregla)
                        )
                        ->execute()->getFirst();
    }

    public function buscarTodasLasAsociacionesAutomaticas($idregla) {
        $query = Doctrine_Query::create();
        return $query
                        ->from('DatActividadentidad ae')//********AQUI
                        ->leftJoin('ae.DatActividadentidadmanual aem')
                        ->innerJoin('ae.DatActividadentidadautomatico aea ')
                        ->where('aea.idregla = ?', $idregla)
                        ->execute();
    }

    static public function getNivelAutomatico($idactividaddestino, $idejercicio, $identidad) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT COALESCE(SUM((CASE
                        WHEN (n.idnorma IS NOT NULL) THEN ROUND(((ROUND(n.necesidad, 4) *(
                          COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                          aea.nivelactividadautomatico, 0) + COALESCE(ae.ajuste, 0))) /
                          r.valorcontrol) * r.nivelactividadbase, 4)
                        ELSE ROUND(((COALESCE(aem.nivelactividadmanual, 0) + COALESCE(
                          aea.nivelactividadautomatico, 0) + COALESCE(ae.ajuste, 0)) /
                          r.valorcontrol) * r.nivelactividadbase, 4)
                      END)), 0) as nivelauto
                    FROM mod_planificacion.dat_regla r                        
                         INNER JOIN mod_planificacion.nom_actividad a ON (a.idactividad =
                           r.idactividadorigen) 
                         LEFT JOIN mod_planificacion.dat_norma n ON r.idnorma = n.idnorma
                         LEFT JOIN mod_planificacion.dat_actividadentidad ae ON (a.idactividad =
                           ae.idactividad AND ae.identidad = $identidad AND ae.idejercicio = $idejercicio)
                         LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON
                           aem.idactividadentidad = ae.idactividadentidad
                         LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON
                           aea.idactividadentidad = ae.idactividadentidad
                    WHERE r.idactividaddestino = $idactividaddestino AND
                          r.idejercicio = $idejercicio AND
                          (a.idaprobacion = 3 OR
                          a.idaprobacion = 4) AND
                          a.estado = 1 ";
        $nivelautomatico = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);       
        return $nivelautomatico;
    }

}
