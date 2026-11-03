<?php

class DatControlejecdesviacion extends BaseDatControlejecdesviacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatDesviacionplandemanda',
            array('local' => 'iddesviacionplandemanda', 'foreign' => 'iddesviacionplandemanda')
        );
      

    }

   

}
