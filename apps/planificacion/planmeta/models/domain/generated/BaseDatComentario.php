<?php

abstract class BaseDatComentario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_comentario');
        $this->hasColumn(
            'idcomentario', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_comentario')
        );
        $this->hasColumn(
            'idtipocomentario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idelemento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipodocumento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'asunto', 'character varying', 70,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechacreado', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'version', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estadorevision', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
