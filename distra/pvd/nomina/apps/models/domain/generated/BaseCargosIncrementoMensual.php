<?php


abstract class BaseCargosCertificacionIncremento extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_cargoscertificacionincremento');

        $this->hasColumn('idcargoscertificacionincremento', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_cargoscertificacionincremento'
        ));

        $this->hasColumn('idcargo', 'numeric', 19, array(
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

    }

    public function setUp(){

        parent::setUp();

    }
}