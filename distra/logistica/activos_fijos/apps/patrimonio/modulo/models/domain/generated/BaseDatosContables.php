<?php

class BaseDatosContables extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_datcontableinmcamp');
        $this->hasColumn('iddatcontableinmcamp', 'numeric', 19,array('notnull' => true, 'primary' => true));     
       // $this->hasColumn('idpersona', 'numeric', 19,array('notnull' => true, 'primary' => false)); 
        $this->hasColumn('idregnumerico', 'numeric', 19, array('notnull' => false, 'primary' => false));       
        $this->hasColumn('fecha', 'date', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('clave', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numero', 'character varying', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denomrespareacontable', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denomresotecnico', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', 19, array('notnull' => false, 'primary' => false));
       // $this->hasColumn('idresptecnico', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }
}
