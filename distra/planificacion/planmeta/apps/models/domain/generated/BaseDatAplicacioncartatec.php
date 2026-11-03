<?php

abstract class BaseDatAplicacioncartatec extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_spouam.dat_aplicacioncartatec');
        $this->hasColumn(
            'area', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'asegurado', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'estimulacion', 'numeric', null,
            array('notnull' => false, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'fecha', 'date', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'gastobancario', 'numeric', null,
            array('notnull' => false, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'idaplicacioncartatec', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_spouam.sec_aplicacioncartatec')
        );
        $this->hasColumn(
            'idcartatecnologica', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'productividadest', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'ropaycalzado', 'numeric', null,
            array('notnull' => false, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 1)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatServicio', array('local'   => 'idaplicacioncartatec',
                                 'foreign' => 'idaplicacioncartatec')
        );
        /*$this->HasMany(
            'DatArrendamiento', array('local'   => 'idaplicacioncartatec',
                                      'foreign' => 'idaplicacioncartatec')
        );*/
        $this->hasOne(
            'DatCartatecnologica', array('local'   => 'idcartatecnologica',
                                         'foreign' => 'idcartatecnologica')
        );
        $this->hasMany(
            'DatCartatecnologicaactividad',
            array('local'   => 'idaplicacioncartatec',
                  'foreign' => 'idaplicacioncartatec')
        );
        $this->HasOne(
            'NomAprobacion',
            array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
            'DatActividadentidadprodcartatec',
            array('local'   => 'idaplicacioncartatec',
                  'foreign' => 'idaplicacioncartatec')
        );
    }

}


