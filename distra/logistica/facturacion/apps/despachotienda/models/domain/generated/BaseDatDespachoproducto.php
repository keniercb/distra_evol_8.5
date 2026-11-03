<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDespachoproducto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_despachoproducto');
        $this->hasColumn(
            'iddespachoproducto', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datdespachoproducto'
            )
        );
        $this->hasColumn(
            'iddespachotienda', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'despachado', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        
    }

    public function Setup()
    {
        parent::setUp();
    }

}
