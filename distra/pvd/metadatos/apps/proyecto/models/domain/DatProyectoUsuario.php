<?php

/**
 * Class DatProyectoUsuario
 */
class DatProyectoUsuario extends BaseDatProyectoUsuario
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }
}