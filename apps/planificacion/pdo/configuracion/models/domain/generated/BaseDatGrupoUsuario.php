<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseDatGrupoUsuario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_grupousuario');
        $this->hasColumn(
            'idgrupo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

