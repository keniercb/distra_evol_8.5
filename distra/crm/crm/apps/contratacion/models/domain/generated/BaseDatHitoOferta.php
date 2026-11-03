<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatHitoOferta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_hitooferta');
        $this->hasColumn('idhitooferta', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_hitooferta'));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('vigencia', 'numeric', 3, array('notnull' => false, 'primary' => false));
        $this->hasColumn('unidadtiempo', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numero', 'numeric', 3, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacreacion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaestimada', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idoferta', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarea', 'numeric', 19,array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
