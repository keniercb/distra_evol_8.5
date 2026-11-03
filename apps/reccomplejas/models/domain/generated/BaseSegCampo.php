<?php

abstract class BaseSegCampo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.seg_campo');
        $this->hasColumn('idcampo', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idrol', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idsegcampo', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_segcampo'));
    }
}