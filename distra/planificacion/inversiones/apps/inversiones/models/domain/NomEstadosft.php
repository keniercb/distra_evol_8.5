<?php

class NomEstadosft extends BaseNomEstadosft {

    public function setUp() {
        parent :: setUp();
        $this->hasMany('DatTransicion', array('local' => 'idestadosft', 'foreign' => 'idestadofinal'));
        $this->hasMany('DatTransicion', array('local' => 'idestadosft', 'foreign' => 'idestadoinicial'));
    }

    public function getByid($idestadosft) {
        return Doctrine::getTable('NomEstadosft')->find($idestadosft)->toArray();
    }

    public function eliminarNomenclador($iddatonomenclador) {
        $query = Doctrine_Query::create();
        $result = $query->delete('NomEstadosft')
                ->from('NomEstadosft')
                ->where('iddatosnomenclador= ?', $iddatonomenclador)
                ->execute();
    }

    public static function devolverEstados($parametros) {
        $start = $parametros['start'];
        $limit = $parametros['limit'];
        $query = Doctrine_Query::create();
        $strSel = "ne.idestadosft,ne.denominacion,ne.descripcion";
        foreach ($parametros['filtros'] as $datos) {
            if ($datos['field'] == 'denominacion') {
                $query->addWhere('idestadosft= ?', $datos['data']['value']);
            } else if ($datos['field'] == 'descripcion') {
                $query->addWhere("upper( ne.descripcion ) LIKE '%" . strtoupper($datos['data']['value']) .
                        "%' ");
            } else if ($datos['field'] == 'uso') {
                $resulta = DatTransicion::getIdEstadosInicialesFinales();
                $idestados = array();
                $cont = 0;
                foreach ($resulta as $value) {
                    $idestados[$cont] = $value['idestadoinicial'];
                    $cont++;
                    $idestados[$cont] = $value['idestadofinal'];
                    $cont++;
                }
                if ($datos['data']['value'] == 'Si') {
                    $query->whereIn('ne.idestadosft', $idestados);
                } else {
                    $query->whereNotIn('ne.idestadosft', $idestados);
                }
            }
        }
        if (!$start && !$limit) {
            $start = 0;
            $limit = 200;
        }

        $query->from('NomEstadosft ne')
                ->offset($start)
                ->limit($limit);

        $cant = $query->select('ne.idestadosft,ne.denominacion,ne.descripcion')
                ->count();

        $res['cantidad'] = $cant;
        $res['datos'] = array();
        $res['datos'] = $query->select($strSel)
                ->fetchArray();

        return $res;
    }

    public static function insertarNuevoEstado($parametros) {
        $nomEst = new NomEstadosft();
        $nomEst->denominacion = $parametros['denominacion'];
        $nomEst->descripcion = $parametros['descripcion'];
        $nomEst->save();
        return true;
    }

    public static function setEstado($parametros) {
        $idestado = $parametros['idestado'];
        $denominacion = $parametros['denominacion'];
        $descripcion = $parametros['descripcion'];
        $sql_query = "UPDATE mod_planifinversiones.nom_estadosft
   SET denominacion='$denominacion', descripcion='$descripcion'
 WHERE idestadosft='$idestado';";

        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function deleteEstado($idestado) {

        foreach ($idestado as $value) {
            $id = $value->idestado;
            $sql_query = "DELETE FROM mod_planifinversiones.nom_estadosft
 WHERE idestadosft='$id';";
            $conn = Doctrine_Manager::connection();
            $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public static function existeEstado($nombre, $descripcion) {
        $sql_query = "Select * FROM mod_planifinversiones.nom_estadosft
 WHERE denominacion='$nombre' AND descripcion='$descripcion';";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) != 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function existeEstadoModificar($nombre, $descripcion) {
        $sql_query = "Select * FROM mod_planifinversiones.nom_estadosft
 WHERE denominacion='$nombre' AND descripcion='$descripcion'  ;";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) != 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function getIdDadoDenom($denominacion) {
        $sql_query = "SELECT idestadosft FROM mod_planifinversiones.nom_estadosft WHERE denominacion='$denominacion';";
        $conn = Doctrine_Manager::connection();
        return $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
    }

}
?>

