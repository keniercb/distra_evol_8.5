<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatProductoventa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_productoventa');
        $this->hasColumn(
            'idproducto', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'iddocumento', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'registro', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idproductoventa', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpuntoventa.sec_datproductoventa'
            )
        );
        
    }

    public function Setup()
    {
        parent::setUp();
    }

}
