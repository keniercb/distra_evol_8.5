<?php
/**  
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0-0
 */
abstract class BaseNomDezglozemonedas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_dezglozemoneda');
        $this->hasColumn(
            'iddezglozemonedas', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_nomdezglozemonedas')
        );
        $this->hasColumn(
            'categoria', 'numeric', 1,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion', 'character varying', 30,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valor', 'numeric', 10,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}