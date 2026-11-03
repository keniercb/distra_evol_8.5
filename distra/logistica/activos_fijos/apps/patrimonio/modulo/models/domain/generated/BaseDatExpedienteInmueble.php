<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 * */
class BaseDatExpedienteInmueble extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_expinmueble');
        $this->hasColumn('idexpinmueble', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idregimen', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('registrocontable', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('areaatencion', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'DATE',array('notnull' => false, 'primary' => false));
        
    }
}
