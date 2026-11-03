<?php

class DatObjetivo extends BaseDatObjetivo
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idobjetivo)
    {
        return Doctrine::getTable('DatObjetivo')->find($idobjetivo)->toArray();
    }

    public function getNomenclador($iddatonomenclador)
    {
        $query = new Doctrine_Query();
        $array = $query->select("n.iddatosnomenclador")
            ->from("DatObjetivo n")
            ->where('n.iddatosnomenclador = ?', $iddatonomenclador)
            ->offset(0)
            ->limit(20)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $array;
    }

    public function adicionarNomenclador($iddatonomenclador, $idnomenclador)
    {
        $objdatonomenclador = new DatObjetivo();
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
            = "DELETE FROM mod_planifinversiones.dat_objetivo
	   WHERE (iddatosnomenclador IN (" . $datos . ") AND idnomenclador = "
            . $idnomenclador . ")";
        $conn->execute($result);
    }

}

