<?php

class DatDesviacionnivelactividadxsustitucion extends BaseDatDesviacionnivelactividadxsustitucion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatActividadentidad',
            array('local' => 'idactividadentidad', 'foreign' => 'idactividadentidad')
        );      
		$this->hasOne(
            'DatDesviacionnivelactividad',
            array('local' => 'iddesviacionnivelactividad', 'foreign' => 'iddesviacionnivelactividad')
        );    		
    }

    

}
