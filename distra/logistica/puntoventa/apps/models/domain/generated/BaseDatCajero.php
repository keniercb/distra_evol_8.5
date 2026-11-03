<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatCajero extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_cajero');
        $this->hasColumn(
            'idcajero', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => 'mod_logpuntoventa.sec_datcajero'
            )
        );
        $this->hasColumn(
            'activo', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'denominacion', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'pinsecreto', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'tipo', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
