<?php

abstract class BaseNomTipoNomenclador extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logmetadata.nom_tiponomenclador');
        $this->hasColumn(
            'idtiponomenclador', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logmetadata.sec_nomtiponomenclador')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('propiedades', 'json', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('activo', 'numeric', 1, null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
