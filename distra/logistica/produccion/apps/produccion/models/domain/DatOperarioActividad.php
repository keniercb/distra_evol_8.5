<?php

class DatOperarioActividad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        
        $this->setTableName('mod_logproduccion.dat_operarioactividad');
        $this->hasColumn(
            'idoperarioactividad', 'numeric', null,
            array('notnull' => true, 'primary' => true/*, 'sequence' => 'mod_logproduccion.sec_datoperarioactividad'*/)
        );
        $this->hasColumn('idactividad', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idordenactividad', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idresponsable', 'numeric', 19, array('notnull' => true, 'primary' => false));
       
    }

    public function setUp()
    {
        parent::setUp();
    }
}