<?php

abstract class BaseDatBusqueda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.dat_busqueda');
        $this->hasColumn(
            'idbusqueda', 'numeric', null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_busqueda')
        );
        $this->hasColumn('codigo', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('sqlbusqueda', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('sqltotal', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idaviso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tablasvisitadas', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('arrideventos', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('configuracion', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconfiguracion', 'character varying', null, array('notnull' => false, 'primary' => false));
    }


}

