<?php

abstract class BaseNomTipocomponenteplanif extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planificacion.nom_tipocomponente');
        $this->hasColumn(
            'idtipocomponente', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_tipocomponente')
        );
        $this->hasColumn(
            'denominacion', 'varchar', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'varchar', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'color', 'varchar', 255,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}