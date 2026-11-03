<?php
/**
 * Created by JetBrains PhpStorm.
 * User: lester
 * Date: 31/07/13
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */

class DatDesignacionEntidad extends BaseDatDesignacionEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomDesignacion', array('local' => 'iddesignacion', 'foreign' => 'iddesignacion'));
    }
}