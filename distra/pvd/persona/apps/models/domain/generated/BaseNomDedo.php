<?php

abstract class BaseNomDedo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.nom_dedo');
        $this->hasColumn('numdedo', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('imagen', 'bytea', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('activo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'iddedo', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_nomdedo')
        );
    }

}

