<?php

abstract class BaseDatActividadentidadindustrial extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifindustrial.dat_actividadentidadindustrial');
        $this->hasColumn('idactividadentidadindustrial', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planifindustrial.sec_actividadentidadindustrial'));
        $this->hasColumn('idactividadentidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nivelactividadindustrial', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0));
        $this->hasColumn('version', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 1));
        $this->hasColumn('idproduccionindustrial', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcartatecindustrialactividad', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();

//        $this->hasOne(
//                'DatAplicacioncartatec', array('local' => 'idaplicacioncartatec',
//            'foreign' => 'idaplicacioncartatec')
//        );
//        $this->hasOne(
//                'DatCartatecnologicaactividad', array('local' => 'idcartatecnologicaactividad',
//            'foreign' => 'idcartatecnologicaactividad')
//        );
    }

}
