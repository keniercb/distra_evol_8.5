<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatRelacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_relacion');
        $this->hasColumn('campodestino', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('campoorigen', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('eliminarcascada', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('actualizarcascada', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}