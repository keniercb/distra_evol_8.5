<?php

abstract class BaseNomTipodepreciacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.nom_tipodepreciacion');
        $this->hasColumn(
            'color', 'character varying', 20,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipodepreciacion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatIndicadoruamtipodepreciacion',
            array('local' => 'idtipodepreciacion',
                  'foreign' => 'idtipodepreciacion')
        );
    }

}


