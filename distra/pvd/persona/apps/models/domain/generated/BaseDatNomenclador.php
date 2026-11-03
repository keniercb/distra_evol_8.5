<?php

abstract class BaseDatNomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_nomenclador');
        $this->hasColumn('visibilidad', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('xtype', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('getdata', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('imagen', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('icono', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('src', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombre', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('agrupador', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idnomenclador', 'numeric', 15, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_nomenclador')
        );
    }
}

