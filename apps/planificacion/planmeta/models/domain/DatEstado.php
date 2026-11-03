<?php

class DatEstado extends BaseDatEstado
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getNomenclador($iddatonomenclador)
    {
        $query = new Doctrine_Query();
        $array = $query->select("n.iddatosnomenclador")
            ->from("DatEstado n")
            ->where('n.iddatosnomenclador = ?', $iddatonomenclador)
            ->offset(0)
            ->limit(20)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $array;
    }

    public function getByid($idestado)
    {
        return Doctrine::getTable('DatEstado')->find($idestado)->toArray();
    }

    public function adicionarNomenclador($iddatonomenclador, $idnomenclador)
    {
        $objdatonomenclador = new DatEstado();
        $objdatonomenclador->iddatosnomenclador = $iddatonomenclador;
        $objdatonomenclador->idnomenclador = $idnomenclador;
        $objdatonomenclador->save();
        return 1;
    }

    public function eliminarNomenclador($iddatonomenclador)
    {
        $datos = implode(',', $iddatonomenclador);
        $conn = Doctrine_Manager::connection();
        $result
            = "DELETE FROM mod_planifinversiones.dat_estado
	   WHERE (iddatosnomenclador IN (" . $datos . ") AND idnomenclador = "
            . $idnomenclador . ")";
        $conn->execute($result);
    }

}

