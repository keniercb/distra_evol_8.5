<?php


abstract class BasePersonasCertificacionIncremento extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_personacertificacionincremento');

        $this->hasColumn('idpersonacertificacionincremento', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_cargoscertificacionincremento'
        ));

        $this->hasColumn('idpersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('idestructura', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));
        $this->hasColumn('incremento', 'numeric', 2, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('fecha', 'date', null, array(
            'type' => 'date',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('annosserventidadincremental', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('mesesserventidadincremental', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false,
        ));
    }

    public function setUp(){

        parent::setUp();

    }
}