<?php

abstract class BaseDatDocumentopersona extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_documentopersona');
        $this->hasColumn('iddocumentopersona', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_evaluaciones.sec_documentopersona'));
        $this->hasColumn('fechacreacion', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idtipodocumento', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('valor', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('iddocumentogestordocumental', 'numeric', null, array ('notnull' => false,'primary' => false));
    }

}
