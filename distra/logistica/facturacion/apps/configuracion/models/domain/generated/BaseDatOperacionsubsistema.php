<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatOperacionsubsistema extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_operacionsubsistema');
        $sequence = 'mod_logfacturacion.sec_datoperacionessubsistema';
        $this->hasColumn(
            'idoperacionsubsistema',
            'numeric', null,
            array(
                'notnull'  => true, 'primary' => true,
                'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idestructura',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnomoperaciones',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idsubsistema',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cobropago',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'comprobante',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'vm',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'pagoexterior',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciocero',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcondicionpago',
            'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
