<?php

/**
 * BaseDatIndicadorcentrobalance
 *
 * @ author Drisis Silvia Diaz Rodriguez
 * @ package Planificaci�n
 * @ subpackage Planificaci�n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
abstract class BaseDatIndicadorcentrobalance extends Doctrine_Record {

    /**
     * setTableDefinition
     * Describe las caracter�sticas de los atributos de la tabla en la BD
     *
     * */
    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.dat_indicadorcentrobalance');
        $this->hasColumn(
                'idindicadorcentrobalance', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_indicadorcentrobalance')
        );
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('identidaddatosnomenclador', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    //fin de la funci�n setTableDefinition
}

//fin clase DatEntidaddatosnomenclador
?>	