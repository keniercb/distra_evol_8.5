<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatCargocivil extends BaseDatCargocivil
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomCategocup', array('local' => 'idcategocup', 'foreign' => 'idcategocup'));
        $this->hasOne('DatCargo', array('local' => 'idcargo', 'foreign' => 'idcargo'));
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }
}