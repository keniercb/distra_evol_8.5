<?php

abstract class BaseDatPlansolicitud extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_plansolicitud');
        $this->hasColumn(
            'garantia', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idplansolicitud', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idagencia', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idproducto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpadre', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtecnico', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tipo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fallostecnicos', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'atributoidentificador', 'character varying', 50, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'falloscliente', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'prioridad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}

