<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseDatEvalmodeloexpmatematica
 *
 * @author dominick
 */
class BaseDatEvalmodeloexpmatematica extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_evaluaciones.dat_evalmodeloexpmatematica');
        $this->hasColumn('idevalmodeloexpmatematica', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_evaluaciones.sec_evalmodeloexpmatematica'));
        $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idexpresionmatematica', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}