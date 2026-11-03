<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseDatGrupoEstructura extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_grupo_estructura');
        $this->hasColumn(
            'idgrupo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

