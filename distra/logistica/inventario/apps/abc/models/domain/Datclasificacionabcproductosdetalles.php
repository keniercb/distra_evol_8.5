<?php

class Datclasificacionabcproductosdetalles extends BaseDatclasificacionabcproductosdetalles
{

    public function setUp()
    {
        $this->hasMany('Confperiodosclasificacionabc', array('local' => 'idconfperiodosclasificacionabc', 'foreign' => 'idconfperiodosclasificacionabc'));
        $this->hasMany('Nomcriteriovaloracion', array('local' => 'idcriteriovaloracion', 'foreign' => 'idcriteriovaloracion'));
        parent::setUp();
    }

}
