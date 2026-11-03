<?php

class NomNomenclador extends BaseNomNomenclador {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idnomenclador) {
        return Doctrine::getTable('NomNomenclador')->find($idnomenclador)->toArray();
    }

    public function getNomencladores($node, $valor) {
        $query = new Doctrine_Query ();
        if ($valor != null) {
            $query->addWhere("upper(n.nombrecampo)  LIKE '%" . strtoupper($valor) . "%'");
        }
        
        return $query->select("n.*")
                        ->from("NomNomenclador n")
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function buscarNomenclador($iddatonomenclador) {
        $query = new Doctrine_Query();
        $result = $query->from("NomNomenclador t")
                ->where('t.idnomenclador = ?', $iddatonomenclador)
                ->orderby("t.idnomenclador")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function adicionarNomenclador($nomenclador, $iddatonomenclador) {
        $conn = Doctrine_Manager::connection();
        $result = " INSERT INTO 
      " . $nomenclador[0]['esquema'] . "." . $nomenclador[0]['tabla'] . "
          ( iddatosnomenclador,idnomenclador) 
      VALUES ({$iddatonomenclador},{$nomenclador[0]['idnomenclador']})";
        $cant = $conn->execute($result);
        if ($cant) {
            return true;
        } else {
            return false;
        };
    }

    public function getNomenclador($nomenclador, $iddatonomenclador) {
        $query = "SELECT " . $nomenclador[0]['esquema'] . "." . $nomenclador[0]['tabla'] . ".iddatosnomenclador FROM  " . $nomenclador[0]['esquema'] . "." . $nomenclador[0]['tabla'] . "
               WHERE   " . $nomenclador[0]['esquema'] . "." . $nomenclador[0]['tabla'] . ".iddatosnomenclador=$iddatonomenclador ";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminarNomenclador($iddatonomenclador, $nomenclador) {
        $conn = Doctrine_Manager::connection();
        $datos = implode(',', $iddatonomenclador);
        $result = "DELETE FROM " . $nomenclador[0]['esquema'] . "." . $nomenclador[0]['tabla'] . "
	    WHERE ({$nomenclador[0]['nombreidtabla']} IN (" . $datos . ") AND idnomenclador = " . $nomenclador[0]['idnomenclador'] . ")";
        $cant = $conn->execute($result);
        if ($cant) {
            return true;
        } else {
            return false;
        }
    }

}
