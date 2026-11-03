<?php

abstract class BaseDatCampo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.dat_campo');
        $this->hasColumn(
            'idcampo', 'numeric', null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_campo')
        );
        $this->hasColumn('idconfiguracion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('campo', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('alias', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('esquema', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tabla', 'character varying', null, array('notnull' => true, 'primary' => false));
    }


}

