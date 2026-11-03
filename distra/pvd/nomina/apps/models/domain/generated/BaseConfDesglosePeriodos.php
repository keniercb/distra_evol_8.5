<?php

/**
 * BaseConfDesglosePeriodos
 *
 * @author Ing. Dainier Velazquez Labrada.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @copyright Xetid
 * @version 1.0
 */
abstract class BaseConfDesglosePeriodos extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.conf_desgloseperiodos');

        $this->hasColumn('iddesgloseperiodos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true
        ));

        $this->hasColumn('idperiodostipospago', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('fdesde', 'date', 19, array(
            'type' => 'date',
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('fhasta', 'date', 19, array(
            'type' => 'date',
            'notnull' => true,
            'primary' => false
        ));

    }
}