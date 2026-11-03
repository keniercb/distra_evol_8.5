<?php

class DatActespcomportamiento extends BaseDatActespcomportamiento {

    public function setUp() {
        parent::setUp();
    }

    public function buscarActEspDemandante($idactividad, $comportamiento, $idespecialidadDem = null, $idespecialidadCreadora = null, $comoarray = false) {
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActespcomportamiento aed');
        $queryBuscar->Where("aed.idactividad = ? ", $idactividad);
        $queryBuscar->whereIn("aed.iddatosnomenclador", $comportamiento);
        if ($idespecialidadDem != null) {
            $queryBuscar->addWhere("aed.idespecialidad = ? ", $idespecialidadDem);
        } elseif ($idespecialidadCreadora != null) {
            $queryBuscar->addWhere("aed.idespecialidad <> ? ", $idespecialidadCreadora);
        }
        if ($comoarray) {
            return $queryBuscar->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            return $queryBuscar->execute();
        }
    }

    public function esEjecutorDeLaDemanda($idespecialidad) {
        $comportamiento = DatActespcomportamiento::obtenerIdDatosNom();
        $comportamiento = $comportamiento['demandada'];

        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActespcomportamiento aed')
                ->innerJoin(
                        'aed.NomActividad act WITH act.idespecialidad = ?', $idespecialidad
                )/* donde es creadora */
                ->addWhere(
                        "aed.idespecialidad <> ? ", $idespecialidad
                )/* pero que no sea su demanda */
                ->addWhere("aed.iddatosnomenclador = ?", $comportamiento)
                ->offset(0)->limit(1);
        if ($queryBuscar->execute()->getFirst()->idactespcomportamiento != null
        ) {
            return true;
        } else {
            return false;
        }
    }

    public function obtenerProductoresDeActividades() {
        $comportamiento = DatActespcomportamiento::obtenerIdDatosNom('0');
        $comportamiento = $comportamiento['demandada'];

        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT na.idespecialidad
        FROM mod_planificacion.nom_actividad na
          INNER JOIN mod_planificacion.dat_actespcomportamiento acte
          ON (na.idactividad = acte.idactividad)
        WHERE na.idespecialidad <> acte.idespecialidad
          AND acte.iddatosnomenclador = $comportamiento ";
        return $conn->execute($query)->fetchAll();
    }

    public function buscarEspCompartidasNoRelacionada($idactividadgeneradora, $idespecialidad
    ) {
        /* Buscar todas las especialidades
         * a las que ya se compartio la actividad que genera regla
         * para luego asociarles la secuencia de actividades que genera.
         */
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActespcomportamiento aed');
        $queryBuscar->addWhere("aed.idactividad = ? ", $idactividadgeneradora);
        $queryBuscar->addWhere(
                "aed.idespecialidad <> ? ", $idespecialidad
        ); //logueada
        return $queryBuscar->execute()->toArray();
    }

    public function existeActividadconComportamiento($idactividad, $comportamiento
    ) {
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActespcomportamiento aed');
        $queryBuscar->addWhere("aed.idactividad = ? ", $idactividad);
        $queryBuscar->addWhere(
                "aed.iddatosnomenclador = ? ", $comportamiento
        ); //logueada
        return $queryBuscar->execute()->toArray();
    }

    public function buscarEspComportamiento($idactividad, $idespecialidad) {
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->from('DatActespcomportamiento aed');
        $queryBuscar->addWhere("aed.idactividad = ? ", $idactividad);
        $queryBuscar->addWhere("aed.idespecialidad = ?", $idespecialidad);
        return $queryBuscar->execute();
    }

    //Utilizado como servicio
    public function obtenerIdDatosNom($resultSinindices = false) {
        $queryBuscar = new Doctrine_Query();
        $queryBuscar->select('dn.iddatosnomenclador,dn.uridatosnomenclador')
                ->from('NomDatosnomenclador dn');
        $queryBuscar->addWhere(
                "dn.uridatosnomenclador = ? OR dn.uridatosnomenclador = ?
             OR dn.uridatosnomenclador = ?", array('propia', 'demandada', 'compartida')
        );
        $arrayResUno = $queryBuscar->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        $arrayResExit = array('demandada' => null,
            'compartida' => null,
            'compartidaautomatico' => null,
            'demandaautomatico' => null);
        $arrySinindices = array();
        foreach ($arrayResUno as $valor) {
            if ($resultSinindices == true) {
                $arrySinindices[] = $valor['iddatosnomenclador'];
            } else {
                if ($valor['uridatosnomenclador'] == 'propia') {
                    $arrayResExit['propia'] = $valor['iddatosnomenclador'];
                    $arrySinindices[] = $valor['iddatosnomenclador'];
                } else {
                    if ($valor['uridatosnomenclador'] == 'demandada'
                    ) {
                        $arrayResExit['demantante'] = $valor['iddatosnomenclador'];
                        $arrayResExit['demandada'] = $valor['iddatosnomenclador'];
                    } else {
                        if ($valor['uridatosnomenclador'] == 'compartida'
                        ) {
                            $arrayResExit['compartida'] = $valor['iddatosnomenclador'];
                        }
                    }
                }
            }
        }
        if ($resultSinindices == true) {
            return $arrySinindices;
        }
        return $arrayResExit;
    }

    public function getCompartamientos($params, $iddatosnomanclador) {
        $queryc = Doctrine_Manager::connection();

        $iddatosnomanclador = implode(',', $iddatosnomanclador);

        $sql = "SELECT 
              idactespcomportamiento,
              idactividad,
              idespecialidad,
              iddatosnomenclador
            FROM 
              mod_planificacion.dat_actespcomportamiento  WHERE  idactividad = {$params['idactividad']} AND iddatosnomenclador IN ({$iddatosnomanclador})";

        $result = $queryc->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /*     * eliminar compartimentaciones de una actividad
     * @param $idactividades
     * @param $iddatosnomenclador
     */

    public function eliminarCompartimentacion($idactividades, $idespecialidad) {
        $query = Doctrine_Manager::connection();
        $sqlEliminar = "DELETE FROM mod_planificacion.dat_actespcomportamiento 
                        WHERE idactividad IN ({$idactividades})  AND idespecialidad = {$idespecialidad}";

        $query->execute($sqlEliminar);
    }

    /** Eliminar las especialidades relacionadas
     * @param $idactividad
     * @param $esp
     * @param $iddatosnomenclador
     */
    public function eliminarRelacionConEspecialidesRestantes($idactividad, $esp, $iddatosnomenclador) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM  mod_planificacion.dat_actespcomportamiento  
                       where idactividad = {$idactividad} and  idespecialidad NOT IN({$esp})
                       And iddatosnomenclador = {$iddatosnomenclador}";
        $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /** Eliminar las relaciones de una actividad segun comportamiento
     * @param $idactividad
     * @param $iddatosnomenclador
     */
    public function eliminarRelacionConEspecialides($idactividad, $iddatosnomenclador) {
        $conn = Doctrine_Manager::connection();
        $sql = "DELETE FROM  mod_planificacion.dat_actespcomportamiento  
                       where idactividad = {$idactividad}
                       And iddatosnomenclador = {$iddatosnomenclador}";
        $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

}
