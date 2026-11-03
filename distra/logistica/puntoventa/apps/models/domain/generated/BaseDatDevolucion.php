<?php

/**
 * Clase base mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0/
 */
abstract class BaseDatDevolucion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_devolucion');
        //$sequence = 'mod_logpuntoventa.sec_datdevolucion';
        $this->hasColumn(
            'iddevolucion', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true/*,
            'sequence' => $sequence*/
            )
        );
        $this->hasColumn(
            'motivodevolucion', 'varchar', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idventas', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'fecha', 'date', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'totalefectdevuelto', 'numeric', null,
            array(
            'notnull' => true, 'primary' => false
            )
        );

        $this->hasColumn(
            'tipodevolucion', 'numeric', null,
            array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idcierreventa', 'numeric', null, array(
                'notnull' => false, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
