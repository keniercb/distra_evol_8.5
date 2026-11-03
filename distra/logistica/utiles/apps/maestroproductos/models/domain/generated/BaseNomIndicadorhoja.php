<?php

abstract class BaseNomIndicadorhoja extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_indicadorhoja');
        $this->hasColumn(
            'idindicador', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'primary' => true)
        );
        $this->hasColumn(
            'codigoauxiliar', 'string', null,
            array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigobarra', 'string', null,
            array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'peso', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'largo', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'ancho', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'alto', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'capacidadlitros', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tienelote', 'decimal', null,
            array(
                'type'    => 'decimal', 'fixed' => false, 'unsigned' => false,
                'notnull' => true, 'default' => '0', 'primary' => false
            )
        );
        $this->hasColumn(
            'requieremedicion', 'decimal', null,
            array(
                'type'    => 'decimal', 'fixed' => false, 'unsigned' => false,
                'notnull' => true, 'default' => '0', 'primary' => false
            )
        );
        $this->hasColumn(
            'formapresentacion', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tipocontrol', 'decimal', null,
            array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idumedidaoperativa', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idgruposubgrupo', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'explotacion', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'almacenado', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'isuh', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmarca', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmodelo', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'precio', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );        
        $this->hasColumn(
            'descripcionventa', 'string', null,
            array('type' => 'string', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
