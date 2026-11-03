<?php

class DatBusquedausuario extends BaseDatBusquedausuario
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasOne('DatBusqueda', array('local' => 'idbusqueda', 'foreign' => 'idbusqueda'));
    }

    public function getDatBusquedaUsuario($idbusquedausuario)
    {
        $temp = Doctrine::getTable('DatBusquedausuario')->find($idbusquedausuario);
        return $temp;
    }

    public function getBusquedabyusuario($idusuario, $idbusqueda)
    {
        $q = new Doctrine_Query();
        $result = $q
            ->from('DatBusquedausuario')
            ->where("idusuario = ? and idbusqueda = ?", array($idusuario, $idbusqueda))
            ->execute()
            ->toArray();
        return $result;
    }

}