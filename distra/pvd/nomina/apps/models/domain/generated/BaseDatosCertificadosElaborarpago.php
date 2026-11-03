<?php

abstract class BaseDatosCertificadosElaborarpago extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_datoscertificadoselaborarpago');

        $this->hasColumn('iddatoscertificadoselaborarpago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_datoscertificadoselaborarpago'
        ));
        
        $this->hasColumn('idelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('datoscetificados', 'text', null, array(
            'type' => 'text',
            'length' => null,
            'notnull' => true,
            'primary' => false
        ));
    }
}
