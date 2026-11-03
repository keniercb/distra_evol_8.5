<?php

/**
 * @author    Jes�s Ariel Guerra L�pez
 * @version   3.0.0
 * @copyright XETID
 */
abstract class BaseDatUsuarioEstructura extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_usuario_estructura');
        $this->hasColumn(
            'idusuarioestructura', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'fechaasociacion', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'activo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'autor', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

