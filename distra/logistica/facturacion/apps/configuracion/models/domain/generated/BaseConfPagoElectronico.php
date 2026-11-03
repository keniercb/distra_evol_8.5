<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseConfPagoElectronico extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('conf_pagoelectronico');
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        
        $this->hasColumn(
            'consumerkey', 'varchar', null,
            array('notnull' => false, 'primary' => false)
        );
        
        $this->hasColumn(
            'consumersecret', 'varchar', null,
            array('notnull' => false, 'primary' => false)
        );
        
        $this->hasColumn(
            'idmoneda', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        
        $this->hasColumn(
            'codigoiso', 'varchar', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
