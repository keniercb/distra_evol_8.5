<?php

class DatDesviacionnivelactividadxsustituciondemanda extends BaseDatDesviacionnivelactividadxsustituciondemanda
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatActividadentidad',
            array('local' => 'idactividadentidad', 'foreign' => 'idactividadentidad')
        );      
		$this->hasOne(
            'DatDesviacionnivelactividaddemanda',
            array('local' => 'iddesviacionnivelactividaddemanda', 'foreign' => 'iddesviacionnivelactividaddemanda')
        );    		
    }

    

}
