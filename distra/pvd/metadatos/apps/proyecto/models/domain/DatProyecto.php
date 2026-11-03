<?php

/**
 * Class DatProyecto
 */
class DatProyecto extends BaseDatProyecto
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatEstructuraop', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatCargo', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatCargocivil', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatCargomilitar', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEstructura', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatMedio', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatProyectoUsuario', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }
}