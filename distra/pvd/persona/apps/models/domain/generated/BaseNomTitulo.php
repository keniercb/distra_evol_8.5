<?php

abstract class BaseNomTitulo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.nom_titulo');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idniveleducacional', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idespecialidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idtitulo', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_titulo')
        );
    }

}

