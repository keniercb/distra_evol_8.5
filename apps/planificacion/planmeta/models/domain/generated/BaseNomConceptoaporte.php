<?php

abstract class BaseNomConceptoaporte extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_conceptoaporte');
     
        $this->hasColumn(
            'uriconceptoaporte', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idconceptoaporte', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_conceptoaporte')
        );
		 $this->hasColumn(
            'valor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        
    }

}


