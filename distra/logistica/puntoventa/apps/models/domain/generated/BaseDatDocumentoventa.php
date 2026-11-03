<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDocumentoventa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_documentoventa');
        $this->hasColumn(
            'iddocumento', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true
            )
        );
        $this->hasColumn(
            'tipoventa', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'modopago', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'cajero', 'character varying', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fecha', 'date', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'importe', 'numeric', null, array(
                'notnull' => false, 'primary' => false
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
