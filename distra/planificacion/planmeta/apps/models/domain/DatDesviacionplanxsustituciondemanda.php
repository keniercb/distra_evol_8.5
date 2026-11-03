<?php

class DatDesviacionplanxsustituciondemanda extends BaseDatDesviacionplanxsustituciondemanda
{

    public function setUp()
    {
        parent::setUp();
       /* $this->hasOne(
            'DatPlanificacion',
            array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );*/  
		$this->hasOne(
            'DatDesviacionplandemanda',
            array('local' => 'iddesviacionplandemanda', 'foreign' => 'iddesviacionplandemanda')
        );  
		
    }

    

}
