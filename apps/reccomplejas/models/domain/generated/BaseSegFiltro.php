<?php

abstract class BaseSegFiltro extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.seg_filtro');
        $this->hasColumn('idfiltro', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_filtro'));
        $this->hasColumn('condicion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('valor', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('valormostrar', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('logico', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idcampo', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idrol', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array ('notnull' => true,'primary' => false));
    }


}