<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:44 PM
 */

class DatReclamaciones extends BaseDatReclamaciones
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('ReclamacionEstado', array('local' => 'idreclamacion', 'foreign' => 'idreclamacion'));
        $this->hasMany('DatIndicadorReclamacion', array('local' => 'idreclamacion', 'foreign' => 'idreclamacion'));
    }


}