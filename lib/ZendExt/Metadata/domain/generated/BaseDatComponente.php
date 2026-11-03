<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatComponente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_componente');
        $this->hasColumn('idcampo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcomponente', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_metadata.sec_componente')
        );
        $this->hasColumn('etiqueta', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipocomponente', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}