<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatServicioareaventa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_servicioareaventa');
        $this->hasColumn(
            'idservicio', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpuntoventa.sec_datservicioareaventa'
            )
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true
            )
        );
        $this->hasColumn(
            'preciobase', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'precio', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idareaventa', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'fecha', 'date', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'codigo', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'denominacion', 'character varying', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'descripcionventa', 'character varying', null,
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
