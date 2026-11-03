<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseNomAgrupacion
 *
 * @author gerardo
 */
abstract class BaseNomAgrupacion extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.nom_agrupacion');
        $this->hasColumn('idagrupacion', 'numeric', null, array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'primary' => true, secuense => 'mod_datosmaestros.sec_nomagrupacion_seq'));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}

