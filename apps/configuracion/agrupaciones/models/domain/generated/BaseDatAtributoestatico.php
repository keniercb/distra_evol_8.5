<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseDatAtributoestatico
 *
 * @author gerardo
 */
class BaseDatAtributoestatico extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.dat_atributoestatico');                                             
        $this->hasColumn('idatributo', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datatributoestatico'));
        $this->hasColumn('idagrupacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipodato', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idexpresionregular', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('longitud', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('limitesuperior', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('limiteinferior', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('decimal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precision', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nivelnomenclador', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('permitenulo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtablanomdinamico', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

