<?php


abstract class BaseHisCargosCertificacionIncremento extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.his_cargoscertificacionincremento');

        $this->hasColumn('idhiscargoscertificacionincremento', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_hiscargoscertificacionincremento'
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
        $this->hasColumn('fdesde', 'date', null, array(
            'type' => 'date',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
    }

    public function setUp(){

        parent::setUp();

    }
}