<?php

abstract class BaseDatDocumentopersonacalificador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_evaluaciones.dat_documentopersonacalificador');
        $this->hasColumn('iddocumentocalificador', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_evaluaciones.sec_documentopersonacalificador'));
        $this->hasColumn('iddocumentopersona', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idcalificador', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('iddetallesdocumento', 'numeric', null, array ('notnull' => true,'primary' => false));
    }

}
