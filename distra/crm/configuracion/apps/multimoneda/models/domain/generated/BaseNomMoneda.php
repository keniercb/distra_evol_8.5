<?php
/**  
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0-0
 */
abstract class BaseNomMoneda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_moneda');
        $this->hasColumn(
            'idmoneda', 'decimal', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_nommoneda')
        );
        $this->hasColumn(
            'codigoiso', 'string', 30,
            array('fixed' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombremoneda', 'string', 30,
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'string', 3,
            array('fixed' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'organizacion', 'string', 30,
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'simbolo', 'string', 1,
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'presicion', 'decimal', 1,
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'factorredondeo', 'decimal', 19,
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpais', 'decimal', 19,
            array('fixed' => false, 'null' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
