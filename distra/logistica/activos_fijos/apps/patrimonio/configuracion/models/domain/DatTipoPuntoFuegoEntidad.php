<?php
/**
 * Created by JetBrains PhpStorm.
 * User: lester
 * Date: 31/07/13
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */

class DatTipoPuntoFuegoEntidad extends BaseDatTipoPuntoFuegoEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomTipoPuntoFuego', array('local' => 'idpuntofuego', 'foreign' => 'idpuntofuego'));
    }
}