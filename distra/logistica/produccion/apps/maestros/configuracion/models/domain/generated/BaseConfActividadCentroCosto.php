<?php

/**
 * Created by PhpStorm.
 * User: Adrian
 * Date: 09-Oct-19
 * Time: 2:46 PM
 */
class BaseConfActividadCentroCosto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.conf_actividadcentrocosto');
        $this->hasColumn(
            'idactcentrocosto', 'numeric', null,
            array('primary' => true, 'sequence' => 'mod_logproduccion.sec_conf_actividadcentrocosto')
        );
        $this->hasColumn('identidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcartatecindustrial', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcentrogrupo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idalmacen', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcartatecindustrialactividad', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}