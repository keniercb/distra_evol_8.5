<?php

abstract class BaseDatReclamacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_reclamacion');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('aceptada', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('viatransporte', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idrecepcion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tiporeclamacion', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
