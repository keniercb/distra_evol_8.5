<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatVentaservicio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_ventaservicio');

        $this->hasColumn(
            'idindicador', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'codigo', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'denominacion', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idventas', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'descuento', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'recargo', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'precio', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'importetotal', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'cantidaddev', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idpersona', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idventaservicio', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpuntoventa.sec_datventaservicio'
            )
        );
        
    }

    public function Setup()
    {
        parent::setUp();
    }

}
