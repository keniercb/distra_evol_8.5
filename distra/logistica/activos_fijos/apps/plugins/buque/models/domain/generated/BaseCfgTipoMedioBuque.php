<?php

abstract class BaseCfgTipoMedioBuque extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_tipomediobuque');
        $this->hasColumn(
            'idtipomediobuque', 'numeric', null, array('notnull' => true, 'primary' => true)
        );

        $this->hasColumn(
            'codigo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombre', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'bandera', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nrooficial', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nroimo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'casaclasific', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'velocidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'letrallamada', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'telex', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fax', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'correo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'calado', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'eslora', 'numeric', null, array('notnull' => true, 'primary' => false)
        ); $this->hasColumn(
            'manga', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'muerto', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'neto', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'bruto', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
