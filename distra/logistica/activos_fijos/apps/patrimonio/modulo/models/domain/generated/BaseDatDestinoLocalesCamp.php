<?php

class BaseDatDestinoLocalesCamp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_destinolocalinnmcamp');
        $this->hasColumn('iddestinolocalinmcomp', 'numeric', 19,array('notnull' => true, 'primary' => true));     
        $this->hasColumn('idlocal', 'numeric', 19,array('notnull' => true, 'primary' => false));  
        $this->hasColumn('idregnumerico', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aream2', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('clave', 'character varying', 19, array('notnull' => false, 'primary' => false));
        
    }
}
