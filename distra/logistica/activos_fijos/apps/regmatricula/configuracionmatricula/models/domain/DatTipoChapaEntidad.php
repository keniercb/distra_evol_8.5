<?php

/**
 * Created by JetBrains PhpStorm.
 * User: osmel
 * Date: 31/07/13
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */
class DatTipoChapaEntidad extends BaseDatTipoChapaEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomTipoChapa', array('local' => 'idtipochapa', 'foreign' => 'idtipochapa'));
    }

}
