<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseDatGrupoNomNomenclador extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_grupo_nom_nomenclador');
        $this->hasColumn(
            'idgrupo', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase

