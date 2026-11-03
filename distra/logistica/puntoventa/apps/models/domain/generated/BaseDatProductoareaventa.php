<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatProductoareaventa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_productoareaventa');
        /*$this->hasColumn(
            'idproductoareaventa', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpuntoventa.sec_datproductoareaventa'
            )
        );*/
        $this->hasColumn(
            'idproducto', 'numeric', null,
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
            'cantidadentienda', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        
    }

    public function Setup()
    {
        parent::setUp();
    }

}
