<?php

/*
 * @utor: Maricet Estevez Fresnedo
 * 
 */

class CfgPeriodo extends BaseCfgPeriodo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomPeriodo',array('local' => 'idcfgperiodo', 'foreign' => 'idcfgperiodo'));
    }

   

}
