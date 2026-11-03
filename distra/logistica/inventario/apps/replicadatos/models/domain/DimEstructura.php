<?php

class DimEstructura extends BaseDimEstructura
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('ClousureEstructura', array('local' => 'idestructura', 'foreign' => 'idhijo'));
        $this->hasOne('CubExistencia', array('local' => 'idestructura', 'foreign' => 'idestructura'));
        $this->hasOne('CubMovimiento', array('local' => 'idestructura', 'foreign' => 'idestructura'));
    }

}



