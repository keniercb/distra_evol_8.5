<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:10
 */
class DatTipoControlCalidadEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_tipocontrolcalidadentidad');
        $this->hasColumn(
            'idtipocontrolcalidadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_logproduccion.sec_dattipocontrolcalidadentidad')
        );
        $this->hasColumn(
            'idtipocontrolcalidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomTipoControlCalidad',
            array('local'   => 'idtipocontrolcalidad',
                  'foreign' => 'idtipocontrolcalidad')
        );
    }
}