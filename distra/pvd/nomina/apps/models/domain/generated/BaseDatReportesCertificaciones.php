<?php

abstract class BaseDatReportesCertificaciones extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_reportescertificaciones');

        $this->hasColumn('idreportescertificaciones', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_reportescertificaciones'
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

        $this->hasColumn('descripcion', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('datos', 'text', null, array(
            'type' => 'text',
            'length' => null,
            'notnull' => false,
            'primary' => false
        ));


    }
}