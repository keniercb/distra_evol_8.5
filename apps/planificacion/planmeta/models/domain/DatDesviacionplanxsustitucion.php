<?php

class DatDesviacionplanxsustitucion extends BaseDatDesviacionplanxsustitucion
{

    public function setUp()
    {
        parent::setUp();
       /* $this->hasOne(
            'DatPlanificacion',
            array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );*/  
		$this->hasOne(
            'DatDesviacionplan',
            array('local' => 'iddesviacionplan', 'foreign' => 'iddesviacionplan')
        );  
		
    }

    

}
