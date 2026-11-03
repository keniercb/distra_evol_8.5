<?php

abstract class BaseNomTiponomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tiponomenclador');
        $this->hasColumn(
            'idtiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_actividadespecialidad')
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
        $this->hasColumn(
            'uritiponomenclador', 'varchar', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
