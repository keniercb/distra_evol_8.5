<?php

/*
 * @utor: Maricet Estevez Fresnedo
 * 
 */

class NomPeriodo extends BaseNomPeriodo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('CfgPeriodo',array('local' => 'idcfgperiodo', 'foreign' => 'idcfgperiodo'));
    }

   

}
