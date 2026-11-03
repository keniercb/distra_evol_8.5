<?php

abstract class BaseDatControlejecdesviacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_controlejecdesviacion');
		$this->hasColumn(
            'idcontrolejecdesviacion', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_controlejecdesviacion')
        );
        $this->hasColumn(
            'iddesviacionplandemanda', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadreal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechareal', 'date', null,
            array('notnull' => true, 'primary' => false)
        ); 
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
