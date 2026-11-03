<?php

class DatEstadoce extends BaseDatEstadoce
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idestadoce)
    {
        return Doctrine::getTable('DatEstadoce')->find($idestadoce)->toArray();
    }

    public function adicionarNomenclador($iddatonomenclador, $idnomenclador)
    {
        $objdatonomenclador = new DatEstadoce();
        $objdatonomenclador->iddatosnomenclador = $iddatonomenclador;
        $objdatonomenclador->idnomenclador = $idnomenclador;
        $objdatonomenclador->save();
        return 1;
    }

    public function eliminarNomenclador($iddatonomenclador, $idnomenclador)
    {
        $datos = implode(',', $iddatonomenclador);
        $conn = Doctrine_Manager::connection();
        $result
            = "DELETE FROM mod_planifinversiones.dat_estadoce
	   WHERE (iddatosnomenclador IN (" . $datos . ") AND idnomenclador = "
            . $idnomenclador . ")";
        $conn->execute($result);
    }

}

