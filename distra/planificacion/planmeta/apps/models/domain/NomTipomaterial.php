<?php

class NomTipomaterial extends BaseNomTipomaterial
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatCargadocumento',
            array('local' => 'idtipomaterial', 'foreign' => 'idtipomaterial')
        );
    }

    function listarTodos()
    {
        $list = Doctrine::getTable('NomTipomaterial')->findAll(
            Doctrine::HYDRATE_ARRAY
        );
        return $list;
    }

}
