<?php

abstract class BaseNomTipomodelo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_tipomodelo');
        $this->hasColumn(
            'idtipomodelo', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_tipomodelo')
        );
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'text', null,
            array('notnull' => true, 'primary' => false)
        );      
        $this->hasColumn(
            'idtabla', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmodelosmetadatos', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
          $this->hasColumn(
                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fecha', 'timestamp', null, array('default' => 'now()', 'notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


