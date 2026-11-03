<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatHitoContrato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_hito');
        $this->hasColumn('idhito', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_hito'));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('vigencia', 'numeric', 3, array('notnull' => false, 'primary' => false));
        $this->hasColumn('unidadtiempo', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numero', 'numeric', 3, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacreacion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaestimada', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechareplanificada', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcontrato', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarea', 'numeric', 19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('idespaciotrabajo', 'character varying', 255,array('notnull' => false, 'primary' => false));
        $this->hasColumn('idiguala', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idlineanegocio', 'numeric', 19, array('notnull' => true, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
