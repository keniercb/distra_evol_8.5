<?php

abstract class BaseDatFuerzaacto extends Doctrine_Record
{

    public function setTableDefinition() {
        $this->setTableName('mod_planifintegracion.dat_fuerzaacto');
        $this->hasColumn('idfuerzaacto', 'numeric', null, array('notnull' => false, 'primary' => true, 'sequence' => 'mod_planifintegracion.sec_fuerzaacto'));
        $this->hasColumn('idfuerza', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idacto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('interes', 'real', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('controlinstitucional', 'real', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('controlhecho', 'real', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('factorpeso', 'real', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('factorinteres', 'real', null, array('notnull' => false, 'primary' => false));
    }
}

