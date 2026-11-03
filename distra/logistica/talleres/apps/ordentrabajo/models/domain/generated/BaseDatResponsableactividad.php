<?php

abstract class BaseDatResponsableactividad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_responsableactividad');
        $this->hasColumn(
            'idresponsableactividad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datresponsableactividad')
        );
        $this->hasColumn('idordenactividad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactividad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idresponsable', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hora', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('salarioporhoras', 'numeric', 25, array('notnull' => false, 'primary' => false));

        $this->hasColumn('nopagar', 'boolean', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('motivo', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

