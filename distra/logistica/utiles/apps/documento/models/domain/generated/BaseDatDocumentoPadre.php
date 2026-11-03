<?php

class BaseDatDocumentoPadre extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_documentopadre');
        $this->hasColumn(
            'iddocumentopadre', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datdocumentopadre')
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

}
