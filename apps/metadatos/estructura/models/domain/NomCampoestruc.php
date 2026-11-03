<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomCampoestruc extends BaseNomCampoestruc
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomConcepto', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
    }
}