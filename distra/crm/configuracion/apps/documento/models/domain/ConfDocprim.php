<?php

/**
 * Clase modelo de nomenclador de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Models/Domain
 * @copyright  XETID.
 * @version    1.0-0
 */
class ConfDocprim extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.conf_docprim');
        $this->hasColumn(
            'iddocprim', 'decimal', null,
            array('notnull' => true, 'sequence' => 'mod_datosmaestros.sec_confdocprim', 'primary' => true)
        );
        $this->hasColumn(
            'iddocumentos', 'decimal', null,
            array('notnull' => true)
        );
        $this->hasColumn(
            'nombre', 'string', 255, array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn('valor', 'string', 255, array('fixed' => false, 'notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne(
            'NomDocprim',
            array('local' => 'iddocumentos', 'foreign' => 'iddocumentos')
        );
        parent::setUp();
    }
}
