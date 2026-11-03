<?php

abstract class BaseHisReportesCertificaciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.his_reportecertificacion');

        $this->hasColumn('idreportecertificacion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_reportecertificacion'
        ));

		$this->hasColumn('idconfreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('fechainicio', 'date', 19, array(
            'type' => 'date',
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('fechafin', 'date', 19, array(
            'type' => 'date',
            'notnull' => false,
            'primary' => false
        ));
        
		$this->hasColumn('estado', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false,
            'default' => '1'
        ));
        
        $this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('idusuario', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
    }
}