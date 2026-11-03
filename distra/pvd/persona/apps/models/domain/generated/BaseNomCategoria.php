<?php

abstract class BaseNomCategoria extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.nom_categoria');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipocategoria', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcategoria', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_categoria')
        );
    }
}
