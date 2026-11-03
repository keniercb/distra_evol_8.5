<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:44 PM
 */

class DatPenalizaciones extends BaseDatPenalizaciones
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('PenalizacionEstado',array('local' => 'idpenalidad', 'foreign' => 'idpenalidad')
        );
    }


}