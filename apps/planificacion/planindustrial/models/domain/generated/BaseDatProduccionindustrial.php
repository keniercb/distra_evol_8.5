<?php

abstract class BaseDatProduccionindustrial extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifindustrial.dat_produccionindustrial');
        $this->hasColumn(
                'idproduccionindustrial', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_planifindustrial.sec_produccionindustrial')
        );
        $this->hasColumn(
                'denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idcartatecindustrial', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'identidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idejercicio', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'valor', 'numeric', null, array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
                'idaprobacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );


//        $this->hasColumn(
//                'idusuario', 'numeric', null, array('notnull' => true, 'primary' => false)
//        );
//
//        $this->hasColumn(
//                'fechamodificacion', 'timestamp', null, array('notnull' => false, 'primary' => false)
//        );
    }

    public function Setup() {
        parent::setUp();

//        $this->hasOne(
//                'DatCartatecnologica', array('local' => 'idcartatecnologica',
//            'foreign' => 'idcartatecnologica')
//        );
//        $this->hasMany(
//                'DatActividadentidadprodcartatec', array('local' => 'idaplicacioncartatec',
//            'foreign' => 'idaplicacioncartatec')
//        );
//        $this->HasMany(
//                'DatServicio', array('local' => 'idaplicacioncartatec',
//            'foreign' => 'idaplicacioncartatec')
//        );
//        $this->HasMany(
//                'DatArrendamiento', array('local' => 'idaplicacioncartatec',
//            'foreign' => 'idaplicacioncartatec')
//        );
    }

}
