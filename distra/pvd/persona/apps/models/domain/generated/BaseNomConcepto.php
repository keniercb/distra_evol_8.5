<?php

abstract class BaseNomConcepto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaproyecto.nom_concepto');
        $this->hasColumn('cmpempleado', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('lft', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('rgt', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iconcls', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('propiedades', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idconcepto', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaproyecto.sec_concepto')
        );
    }

}