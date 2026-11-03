<?php

abstract class BaseDatCategorizacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_categorizacion');
        $this->hasColumn('principal', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fratificacion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcategoria', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcategorizacion', 'numeric', 19, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_categorizacion')
        );
    }

}

