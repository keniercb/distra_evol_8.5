<?php

class BaseDatRegistObjObraCamp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_objetoobracomp');
        $this->hasColumn('idobjetoobracomp', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idsistemaconstructivo', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('mcuadrado', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nroplantas', 'numeric', 3, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aream2', 'numeric', 25,array('notnull' => false, 'primary' => false));
        $this->hasColumn('altura', 'numeric',25,array('notnull' => false, 'primary' => false));
        
    }
}
