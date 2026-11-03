<?php

abstract class BaseDatDependenciasactividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_dependenciasactividad');
		
        $this->hasColumn(
            'idcartatecnologicaactividadorigen', 'numeric', null,
            array('notnull'  => true, 'primary' => true)
        );  
		$this->hasColumn(
            'idcartatecnologicaactividaddestino', 'numeric', null,
            array('notnull'  => true, 'primary' => true)
        ); 		
        
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatCartatecnologica', array('local'   => 'idcartatecnologica',
                                         'foreign' => 'idcartatecnologica')
        );      
    }

}

