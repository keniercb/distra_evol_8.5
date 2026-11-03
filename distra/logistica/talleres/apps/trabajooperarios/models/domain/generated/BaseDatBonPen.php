<?php

abstract class BaseDatBonPen extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_bonificacionpenalizacion');
        $this->hasColumn(
            'idbonificacionpenalizacion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_bonificacionpenalizacion')
        );
        $this->hasColumn('idtrabajooperarios', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestado', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipobonpen', 'numeric', 2, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idbonpen', 'numeric', 2, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importebase', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('bonpen', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('observacion', 'varchar', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacioncancel', 'varchar', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iduser', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusercancel', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }


    public function Setup()
    {
        parent::setUp();
    }


}
