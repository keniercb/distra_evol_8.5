<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseConfAtributoIndicador
 *
 * @author gerardo
 */
class BaseConfAtributoIndicador extends Doctrine_Record{

    public function setTableDefinition() {
        $this->setTableName('mod_datosmaestros.conf_atributoindicador');
        $this->hasColumn('idatributoindicador', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_atributoindicador'));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idatributo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idagrupacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcampo', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

