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
abstract class BaseConfFormulasAreasMontos extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_formulasareasmontos');

        $this->hasColumn('idformulaareamonto', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_formulasareasmontos'
        ));

        $this->hasColumn('idagrupadorarea', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));

        $this->hasColumn('idarea', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));

        $this->hasColumn('idformula', 'numeric', 19, array(
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