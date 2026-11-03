<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseNomTipoComponente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.nom_tipocomponente');
        $this->hasColumn(
            'idtipocomponente', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_metadata.sec_tipocomponente')
        );
        $this->hasColumn('tabla', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipocomponente', 'character varying', 50, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}