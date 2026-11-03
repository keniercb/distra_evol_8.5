<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 04/06/2015
 * Time: 06:17 AM
 */
class DatFonetica extends BaseDatFonetica
{
    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idfonetica
     *
     * @return Doctrine_Record
     */
    public function getById($idfonetica)
    {
        return Doctrine::getTable('DatFonetica')->find($idfonetica);
    }
}