<?php

abstract class BaseDatCategoria extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_categoria');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcategoriapersona', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('principal', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcategoria', 'numeric', 19, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_categoriap')
        );
    }

}