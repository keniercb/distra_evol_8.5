<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 * */
class BaseDatMovRegnumBuque extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_logactivofijotangible.dat_movregnumbuque'
        );
        $this->hasColumn(
            'idmovregnumbuque', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'codigo', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nombre', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'telex', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'letrallamada', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idbandera', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrooficial', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nroimo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcasaclasifc', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'velocidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fax', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'correo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'calado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'eslora', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'manga', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'muerto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'neto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'bruto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}
