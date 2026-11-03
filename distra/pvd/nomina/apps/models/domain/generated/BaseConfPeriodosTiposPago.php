<?php

/**
 * BaseConfPeriodosTiposPago
 *
 * @author Ing. Dainier Velazquez Labrada.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @copyright Xetid
 * @version 1.0
 */
abstract class BaseConfPeriodosTiposPago extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_periodostipospago');

        $this->hasColumn('idperiodostipospago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_periodostipospago'
        ));

        $this->hasColumn('idperiodopago', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false,

        ));

        $this->hasColumn('idtipopago', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false,

        ));

        $this->hasColumn('idestructura', 'numeric', 3, array(
            'type' => 'numeric',
            'length' => 3,
            'notnull' => true,
            'primary' => false,

        ));
    }

    public function setUp(){
        parent::setUp();
        $this->hasMany('ConfDesglosePeriodos', array(
            'local' => 'idperiodostipospago',
            'foreign' => 'idperiodostipospago'
        ));
    }
}