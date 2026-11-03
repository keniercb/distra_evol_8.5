<?php

class DatFormapropiedad extends BaseDatFormapropiedad {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idformapropiedad) {
        return Doctrine::getTable('DatFormapropiedad')->find($idformapropiedad)->toArray();
    }

    public function adicionarNomenclador($iddatonomenclador, $idnomenclador) {
        $objdatonomenclador = new DatFormapropiedad();
        $objdatonomenclador->iddatosnomenclador = $iddatonomenclador;
        $objdatonomenclador->idnomenclador = $idnomenclador;
        $objdatonomenclador->save();
        return 1;
    }

    public function getNomenclador($iddatonomenclador) {
        $query = new Doctrine_Query ();
        $array = $query->select("n.iddatosnomenclador")
                ->from("DatFormapropiedad n")
                ->where('n.iddatosnomenclador = ?', $iddatonomenclador)
                ->offset(0)
                ->limit(20)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $array;
    }

    public function eliminarNomenclador($iddatonomenclador) {
        $datos = implode(',', $iddatonomenclador);
        $conn = Doctrine_Manager::connection();
        $result = "DELETE FROM mod_planifinversiones.dat_formapropiedad 
	   WHERE (iddatosnomenclador IN (" . $datos . ") AND idnomenclador = " . $idnomenclador . ")";
        $conn->execute($result);
    }

}

