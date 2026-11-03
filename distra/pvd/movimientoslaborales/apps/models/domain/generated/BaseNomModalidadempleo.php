<?php

abstract class BaseNomModalidadempleo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.nom_modalidadempleo');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idmodalidadempleo', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_modalidadempleo')
        );
    }

}

