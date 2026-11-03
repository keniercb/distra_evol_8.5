<?php

abstract class BaseNomReceta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logalimento.nom_receta');
        $this->hasColumn(
            'idreceta', 'numeric', null,
            array(
                'notnull'  => true,
                'primary'  => true,
                'sequence' => 'mod_logalimento.sec_nomreceta'
            )
        );
        $this->hasColumn('proteinas', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('calorias', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
