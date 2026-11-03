<?php

abstract class BaseNomTiempo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.nom_tiempo');
        $this->hasColumn('idtiempo', 'numeric', null,
        array('notnull' => true, 'primary' => true,'sequence' => 'mod_logpuntoventa.sec_nomtiempo'));
       
        $this->hasColumn('denominacion', 'character varying', 255,array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidaddias', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'character varying', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'fechafin', 'date', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechainicio', 'date', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        
        
    }

    public function Setup()
    {
        parent::setUp();
    }
}
