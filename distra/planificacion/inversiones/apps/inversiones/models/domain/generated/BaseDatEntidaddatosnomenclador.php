<?php

/**
 * BaseDatEntidaddatosnomenclador
 *
 * @ author Drisis Silvia Diaz Rodriguez
 * @ package Planificaci�n
 * @ subpackage Planificaci�n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
abstract class BaseDatEntidaddatosnomenclador extends Doctrine_Record {

    /**
     * setTableDefinition
     * Describe las caracter�sticas de los atributos de la tabla en la BD
     *
     * */
    public function setTableDefinition() {
        $this->setTableName('dat_entidaddatosnomenclador');
        $this->hasColumn(
                'identidaddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_planificacion.sec_entidaddatosnomenclador')
        );
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    //fin de la funci�n setTableDefinition

    /**
     * Setup
     *
     * */
    public function Setup() {
        parent::setUp();
    }

    //fin de la funci�n Setup
}

//fin de la clase BaseDatEntidaddatosnomenclador
?>