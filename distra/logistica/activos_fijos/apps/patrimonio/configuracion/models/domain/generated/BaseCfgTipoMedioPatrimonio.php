<?php

abstract class BaseCfgTipoMedioPatrimonio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.conf_tipomediopatrimonio');
        $this->hasColumn(
            'idtipomediopatrimonio', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'desctipomedio', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'numinventario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'numserie', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'colorprim', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'colorsec', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valorcontable', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechaadq', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechaexpini', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechaexpfin', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ubicacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'annofabricacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'garantia', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'actual', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'actividad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
            'categoria', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'responsable', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'puntofuego', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadrecursoconsumido', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
