<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseConfConfiguracionfactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.conf_configuracionfactura');
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'pagoanticipado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'entregarrealordenado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'utilizarserie', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'utilizarfirma', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'comprobanteoperacion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'facturaautomatica', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'facturarprecioventa', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valorpordefecto', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cobrorecargo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'diashabiles', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'facturaspendientes', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'generafactura', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'permitirfactura', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'permitirnumerocontrol', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'anularnumerocontrol', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'factmanuales', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'factsistema', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tipofactura', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipotasa', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'facturasistema', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
	    $this->hasColumn(
            'utilizarvendedor', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
	    $this->hasColumn(
            'listarmcomercial', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
	    $this->hasColumn(
            'dirreporte', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'multimoneda', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpadrematriz', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
	$this->hasColumn(
            'preciocentral', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
	    $this->hasColumn(
            'completardistribucion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'mediaproductos', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'mediaservicios', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'formula', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'utilizarformapago', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'utilizarbeneficiario', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'utilizarnumeroref', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'utilizartasa', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
