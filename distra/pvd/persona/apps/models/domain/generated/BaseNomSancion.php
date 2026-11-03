<?php

abstract class BaseNomSancion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.nom_sancion');
        $this->hasColumn('unidadtiempo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tiemporehabilitacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtiposancion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idsancion', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_sancion')
        );
    }

}

