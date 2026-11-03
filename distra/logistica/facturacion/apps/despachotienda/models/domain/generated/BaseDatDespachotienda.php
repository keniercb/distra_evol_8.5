<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDespachotienda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_despachotienda');
        $this->hasColumn(
            'iddespachotienda', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datdespachotienda'
            )
        );
        $this->hasColumn(
            'nroreferencia', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fecha', 'date', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'iddeposito', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idusuario', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'idaprobado', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'estado', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'nrodespacho', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        
    }

    public function Setup()
    {
        parent::setUp();
    }

}
