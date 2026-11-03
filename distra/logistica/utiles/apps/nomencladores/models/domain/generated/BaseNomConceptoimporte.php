<?php

abstract class BaseNomConceptoimporte extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.nom_conceptoimporte');
        $this->hasColumn(
            'idconceptoimporte', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_loginventario.sec_nomconceptoimporte')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'concepto', 'character varying', 1,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'porciento', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'idmoneda', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase
