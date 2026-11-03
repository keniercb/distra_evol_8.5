<?php
/**  
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0-0
 */
abstract class BaseHisTasa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.his_tasa');
        $this->hasColumn(
            'compra', 'decimal', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'desde', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'factordeconversion', 'decimal', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechacambio', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'hasta', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcliente', 'decimal', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'decimal', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'decimal', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'decimal', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmonedacontable', 'decimal', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtasa', 'decimal', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipotasa', 'decimal', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombretasa', 'string', 50,
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'referencia', 'string', 100,
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'venta', 'decimal', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'version', 'decimal', null,
            array('notnull' => true, 'default' => '0', 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
