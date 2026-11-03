<?php

class DatEntidadorganosatisface extends BaseDatEntidadorganosatisface {

    public function setUp() {
        parent::setUp();
        $this->hasOne('NomOrganosatisface', array('local' => 'idorganosatisface', 'foreign' => 'idorganosatisface'));
        $this->hasOne('NomFilaestruc', array('local' => 'identidad', 'foreign' => 'idfila'));
        $this->hasMany('DatEstimacion', array('local' => 'identidadorganosatisface', 'foreign' => 'identidadorganosatisface'));
    }

    public function listarRelacionEntidadOrgano($params) {
        try {
            $query = new Doctrine_Query();
            $result['resultado'] = $query->from('DatEntidadorganosatisface')
                            ->offset($params['start'] ? $params['start'] : 0)
                            ->limit($params['limit'] ? $params['limit'] : 20)
                            ->execute()->toArray();
            $result['total'] = $query->from('DatEntidadorganosatisface')
                            ->execute()->count();
            return $result;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function listarOrganoSatisface($parametros) {
        try {
            $conn = Doctrine_Manager::connection();
            $query = 'SELECT DISTINCT os.denominacion as denomorgano, os.idorganosatisface
                      FROM mod_datosmaestros.nom_organosatisface os
                      WHERE os.estado = 1 ';
            if (!empty($parametros['denomorgano']) && $parametros['busquedaOrg'] == '1') {
                $query .= ' AND upper (os.denominacion) LIKE ' . "'%" . mb_convert_case($parametros['denomorgano'], MB_CASE_UPPER, 'UTF-8') . "%'";
            }
            $resultado['total'] = count($conn->execute($query)->fetchAll(PDO::FETCH_ASSOC));
            $query .= 'LIMIT(' . $parametros['limit'] . ') OFFSET(' . $parametros['start'] . ')';
            $resultado['resultado'] = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            return $resultado;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function denominacionOrganoSatisface($idorganosatisface) {
        try {
            $conn = Doctrine_Manager::connection();
            $query = 'SELECT os.denominacion as denomorgano
                      FROM mod_datosmaestros.nom_organosatisface os
                      WHERE os.idorganosatisface = ' . $idorganosatisface;
            $denomorgano = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            return $denomorgano;
        } catch (Exception $e) {
            return 0;
        }
    }

//    public function obtenerentidadorganosatisface($identidadorganosatisface) {
//        $conn = Doctrine_Manager::connection();
//        $query = "SELECT 
//                    identidad
//                  FROM mod_planproeza.dat_entidadorganosatisface 
//                    WHERE identidadorganosatisface={$identidadorganosatisface}";
//        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
//        return $data;
//    }

    public function verificarEntidadOrganoEmpresarial($idEstructura) {
        try {
            $conn = Doctrine_Manager::connection();
            $query = 'SELECT DISTINCT edn.identidad FROM
                  mod_planificacion.dat_entidaddatosnomenclador edn
                  INNER JOIN mod_planificacion.nom_datosnomenclador dn 
                  ON (edn.iddatosnomenclador=dn.iddatosnomenclador)
                  WHERE edn.identidad = ' . $idEstructura . '     
                  AND dn.uridatosnomenclador=' . "'organoempresarial'";
            $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function eliminarRelacionEntidadOrgano($arrayIdElementosEliminar) {
        try {
            $query = Doctrine_Query::create();
            $query->delete()
                    ->from('DatEntidadorganosatisface')
                    ->whereIn('identidadorganosatisface', $arrayIdElementosEliminar)
                    ->execute();
            return 1;
        } catch (Exception $e) {
            return 0;
        }
    }

}
