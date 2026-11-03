<?php

/**
 * Created by JetBrains PhpStorm.
 * User: osmel
 * Date: 31/07/13
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */
class DatSectorRegMatricEntidad extends BaseDatSectorRegMatricEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomSectorRegMatric', array('local' => 'idsector', 'foreign' => 'idsector'));
    }

}
