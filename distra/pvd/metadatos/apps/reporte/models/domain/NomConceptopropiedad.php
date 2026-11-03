<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomConceptopropiedad extends BaseNomConceptopropiedad
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomConcepto', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
        $this->hasMany('NomPropiedad', array('local' => 'idpropiedad', 'foreign' => 'idpropiedad'));
    }
}