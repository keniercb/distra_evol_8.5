<?php

abstract class BaseDatMapeo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.dat_mapeo');
        $this->hasColumn(
            'idmapeo', 'numeric', null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_mapeo')
        );
        $this->hasColumn('idcampo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('esquema', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tabla', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('persistejoin', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersistejoin', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipoconexion', 'character varying', null, array('notnull' => true, 'primary' => false));
    }


}

