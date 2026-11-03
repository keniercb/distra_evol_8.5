<?php

abstract class BaseDatCartatecindustrialactividad extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifindustrial.dat_cartatecindustrialactividad');
        $this->hasColumn('idcartatecindustrialactividad', 'numeric', null, array('notnull' => true, 'primary' => true,
            'secuence' => 'mod_planifindustrial.sec_cartatecindustrialactividad'));
        $this->hasColumn('idcartatecindustrial', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idactividad', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
//        $this->hasOne(
//                'DatCartatecnologica', array('local' => 'idcartatecnologica',
//            'foreign' => 'idcartatecnologica')
//        );
    }

}
