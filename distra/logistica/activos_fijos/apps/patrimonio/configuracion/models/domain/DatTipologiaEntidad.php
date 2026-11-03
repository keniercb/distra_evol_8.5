<?php
/**
 * Created by JetBrains PhpStorm.
 * User: lester
 * Date: 31/07/13
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */

class DatTipologiaEntidad extends BaseDatTipologiaEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomTipologia', array('local' => 'idtipologia', 'foreign' => 'idtipologia'));
    }
}