<?php

class DatTransicion extends BaseDatTransicion {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatFlujotrabajo', array('local' => 'idflujotrabajo', 'foreign' => 'idflujotrabajo'));
        $this->hasOne('NomEstadosft', array('local' => 'idestadofinal', 'foreign' => 'idestadosft'));
        $this->hasOne('NomEstadosft', array('local' => 'idestadoinicial', 'foreign' => 'idestadosft'));
        $this->hasMany('DatUsuariotransicion', array('local' => 'idtransicion', 'foreign' => 'idtransicion'));
    }

    public function getByid($idtransicion) {
        return Doctrine::getTable('DatTransicion')->find($idtransicion)->toArray();
    }

    public static function devolverTransiciones($parametros, $idflujo) {

        $query = Doctrine_Query::create();
        $strSel = "t.idtransicion,t.idflujotrabajo,t.idestadoinicial,t.idestadofinal,t.inicial";
        foreach ($parametros as $datos) {
            if ($datos['field'] == 'denominacion') {
                $query->addWhere('idestadoinicial= ?', $datos['data']['value']);
            } else if ($datos['field'] == 'descripcion') {
                $query->addWhere('idestadofinal= ?', $datos['data']['value']);
            } else if ($datos['field'] == 'inicial') {
                if ($datos['data']['value'] == 'Si') {
                    $query->addWhere('inicial= ?', 1);
                } else {
                    $query->addWhere('inicial= ?', 0);
                }
            }
        }



        $query->from('DatTransicion t')->addWhere('t.idflujotrabajo=?', $idflujo)
                ->limit(20)->offset(0);
        $cant = $query->select('t.idtransicion,t.idflujotrabajo,t.idestadoinicial,t.idestadofinal,t.inicial')->
                count();

        $res['cantidad'] = $cant;
        $res['datos'] = array();
        $res['datos'] = $query->select($strSel)->fetchArray();
        return $res;
    }

    public static function devolverNombreDadoId($idestado) {

        $sql_query = "SELECT 
  nom_estadosft.denominacion
FROM 
  mod_planifinversiones.nom_estadosft
WHERE 
  nom_estadosft.idestadosft = '$idestado'";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['denominacion'];
    }

    public static function devolverIdDadoNombre($nombre) {

        $sql_query = "SELECT 
  nom_estadosft.idestadosft
FROM 
  mod_planifinversiones.nom_estadosft
WHERE 
  nom_estadosft.denominacion = '$nombre'";

        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['idestadosft'];
    }

    public static function salvar(DatTransicion &$nomTransicion) {
        try {
            $nomTransicion->save();
            return $nomTransicion->idusuariotransicion;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503)
                return '-4';
        }
        return true;
    }

    public static function setTransicion($parametros, $users) {
        $actualizarTransicion = Doctrine::getTable('DatTransicion')->find($parametros['idtransicion']);
        $actualizarTransicion->idestadoinicial = $parametros['idestadoinic'];
        $actualizarTransicion->idestadofinal = $parametros['idestadofinal'];
        $actualizarTransicion->inicial = $parametros['inicial'];
        $actualizarTransicion->idflujotrabajo = $parametros['idflujo'];
        $actualizarTransicion->save();

        $userIni = DatUsuariotransicion::getUserByidtransicion($parametros);
        foreach ($userIni as $user) {
            $userI[] = $user['idusuario'];
        }
        $userEliminar = array_diff($userI, $users);
        $userAdicionar = array_diff($users, $userI);

        $collectionUserTransAdd = new Doctrine_Collection('DatUsuariotransicion');
        foreach ($userAdicionar as $index => $iduser) {
            $objDatetapa = new DatUsuariotransicion();
            $objDatetapa->idtransicion = $parametros['idtransicion'];
            $objDatetapa->idusuario = $iduser;
            $collectionUserTransAdd[$index] = $objDatetapa;
        }
        $collectionUserTransAdd->save();

        $collectionUserTransDel = new Doctrine_Collection('DatUsuariotransicion');

        foreach ($userEliminar as $index => $iduser) {
            $objDatusuariotrans = Doctrine::getTable('DatUsuariotransicion')->findByDql("idtransicion=? AND idusuario=?", array($parametros['idtransicion'], $iduser));
            $collectionUserTransDel[$index] = $objDatusuariotrans;
        }
        $collectionUserTransDel->delete();
    }

    public static function existeTransicionn($idflujo, $idestinic, $idestfinal) {
        $sql_query = "SELECT *
  FROM mod_planifinversiones.dat_transicion WHERE idflujotrabajo = '$idflujo' AND idestadoinicial = '$idestinic' AND idestadofinal = '$idestfinal';";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) != 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function deleteTransicion($idflujo, $idtrans) {

        foreach ($idtrans as $value) {
            $idtransicion = $value->idtrans;
            $sql_query = "DELETE FROM mod_planifinversiones.dat_transicion
 WHERE idflujotrabajo='$idflujo' AND idtransicion='$idtransicion';";
            $conn = Doctrine_Manager::connection();
            $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public static function existeTransInicial($idflujo) {
        $sql_query = "SELECT *
  FROM mod_planifinversiones.dat_transicion WHERE idflujotrabajo='$idflujo' AND inicial=1;";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result) != 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function setTransicionInicial($idflujo) {
        $sql_query = "UPDATE mod_planifinversiones.dat_transicion
   SET 
       inicial=0
 WHERE idflujotrabajo='$idflujo' AND inicial=1;";
        $conn = Doctrine_Manager::connection();
        $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function esTransicionInicial($idtrans) {
        $sql_query = "SELECT idtransicion FROM mod_planifinversiones.dat_transicion   
 WHERE idtransicion='$idtrans' AND inicial=1;";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);

        if (count($result) != 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function getEstadosIniciales($idflujo) {
        $conn = Doctrine_Manager::connection();
        $sql_query2 = "SELECT dat_transicion.idtransicion FROM mod_planifinversiones.dat_transicion
WHERE dat_transicion.idflujotrabajo = '$idflujo';";
        $result->data = $conn->execute($sql_query2)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result->data) != 0) {
            $sql_query = "SELECT
         distinct (nom_estadosft.idestadosft),
          nom_estadosft.denominacion
          FROM
          mod_planifinversiones.dat_transicion,
          mod_planifinversiones.nom_estadosft
          WHERE
          dat_transicion.idestadofinal = nom_estadosft.idestadosft AND
          dat_transicion.idflujotrabajo = '$idflujo';";
            $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);

            $sql_query1 = "SELECT
         distinct (nom_estadosft.idestadosft),
          nom_estadosft.denominacion
          FROM
          mod_planifinversiones.dat_transicion,
          mod_planifinversiones.nom_estadosft
          WHERE
          dat_transicion.idestadoinicial = nom_estadosft.idestadosft AND
          dat_transicion.idflujotrabajo = '$idflujo' AND
          dat_transicion.inicial = 1;";
            $result1 = $conn->execute($sql_query1)->fetchAll(PDO::FETCH_ASSOC);
            $resultado->data = array_merge($result, $result1);
            $resultado->cant = count($resultado->data);
        } else {
            $sql_query2 = "SELECT idestadosft, denominacion
          FROM mod_planifinversiones.nom_estadosft;";
            $resultado->data = $conn->execute($sql_query2)->fetchAll(PDO::FETCH_ASSOC);
            $resultado->cant = count($resultado->data);
        }
        return $resultado;
    }

    public static function getEstadosFinales($idestado, $idflujo) {
        $conn = Doctrine_Manager::connection();
        $sql_query2 = "SELECT dat_transicion.idtransicion FROM mod_planifinversiones.dat_transicion
WHERE dat_transicion.idflujotrabajo = '$idflujo';";
        $result->data = $conn->execute($sql_query2)->fetchAll(PDO::FETCH_ASSOC);
        if (count($result->data) != 0) {
            $sql_query = "SELECT nom_estadosft.denominacion, nom_estadosft.idestadosft
FROM mod_planifinversiones.nom_estadosft WHERE nom_estadosft.idestadosft != '$idestado';";
            $resultado->data = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
            $resultado->cant = count($resultado->data);
        } else {
            $sql_query2 = "SELECT idestadosft, denominacion
          FROM mod_planifinversiones.nom_estadosft;";
            $resultado->data = $conn->execute($sql_query2)->fetchAll(PDO::FETCH_ASSOC);
            $resultado->cant = count($resultado->data);
        }
        return $resultado;
    }

    public static function getIdEstadosInicialesFinales() {
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT idestadoinicial, idestadofinal FROM mod_planifinversiones.dat_transicion;";
        $resultado = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

}

?>