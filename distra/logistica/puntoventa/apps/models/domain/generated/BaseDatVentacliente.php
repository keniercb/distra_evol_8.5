<?php

/**
 * Clase base mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatVentacliente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_ventacliente');
        $sequence = 'mod_logpuntoventa.sec_datventacliente';
        $this->hasColumn(
            'idventacliente', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'numeroidentidad', 'character varying', 20, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'nombre', 'character varying', 100, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'telefono', 'character varying', 20, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'direccion', 'character varying', 20, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'correo', 'character varying', 20, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechainscripcion', 'date', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idprovincia', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idmunicipio', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'provincia', 'character varying', 150, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'municipio', 'character varying', 150, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
