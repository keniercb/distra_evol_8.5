<?php

/**
 * BaseDatEntidaddatosnomenclador
 *
 * @ author Drisis Silvia Diaz Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
abstract class BaseDatEntidaddatosnomenclador extends Doctrine_Record {

    /**
     * setTableDefinition
     * Describe las características de los atributos de la tabla en la BD
     *
     * */
    public function setTableDefinition() {
        $this->setTableName('dat_entidaddatosnomenclador');
        $this->hasColumn(
                'identidaddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planificacion.sec_entidaddatosnomenclador')
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'iddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    //fin de la función setTableDefinition

    /**
     * Setup
     *
     * */
    public function Setup() {
        parent::setUp();
    }

    //fin de la función Setup
}

//fin de la clase BaseDatEntidaddatosnomenclador
