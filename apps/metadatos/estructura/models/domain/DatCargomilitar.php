<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatCargomilitar extends BaseDatCargomilitar
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomGrado', array('local' => 'idgrado', 'foreign' => 'idgrado'));
        $this->hasOne('DatCargo', array('local' => 'idcargo', 'foreign' => 'idcargo'));
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }
}