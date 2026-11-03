<?php

/**
 * Created by PhpStorm.
 * User: Yoendy
 * Date: 10/01/14
 * Time: 14:49
 */
class BaseDatDocumentoOperacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_documentooperacion');
        $this->hasColumn('iddocumentooperacion', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idoperacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tipoconcepto', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

}
