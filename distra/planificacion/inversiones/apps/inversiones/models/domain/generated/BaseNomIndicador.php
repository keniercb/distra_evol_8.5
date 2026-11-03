<?php

/**
 * BaseNomIndicador
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
abstract class BaseNomIndicador extends Doctrine_Record {

    /**
     * setTableDefinition
     * Describe las características de los atributos de la tabla en la BD
     *
     * */
    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.nom_indicador');
        $this->hasColumn('idindicador', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_indicador'));
        $this->hasColumn('idpadre', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('idespecialidad', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('idarbol', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('ordenizq', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('ordender', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('idpais', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('idumedida', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('idformato', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('idnaturaleza', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('idtabla', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('idtablageneral', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('codigo', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('numeropieza', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('nivel', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('arridtablas', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('activo', 'decimal', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn('arridtablasgenerales', 'string', null, array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false));
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

//fin de la clase BaseNomIndicador
?>

