<?php

/**
 * Clase base mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatVentaorden extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_ventaorden');
        $this->hasColumn(
            'idventas', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idorden', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true
            )
        );
        $this->hasColumn(
            'nroorden', 'character varying', 100, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'pago',  'character varying', 150, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'envio', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechaorden', 'date', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'estadoorden', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'tiendavirtual', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'exportado', 'numeric', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechaexportado', 'date', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idusuarioexport', 'numeric', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idareaventaorigen', 'numeric', null, array(
                'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idreferencia', 'numeric', null, array(
                'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
