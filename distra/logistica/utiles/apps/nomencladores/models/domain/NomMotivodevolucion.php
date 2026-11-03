<?php

/**
 * Dominio del Nomenclador de linea de productos
 *
 * @author     Alien Fernandez Fuentes
 * @package    Nomencladores
 * @subpackage Nomencladores de Quimefa
 * @copyright  UCID-ERP Cuba
 * @version    1.0
 */
class NomMotivodevolucion extends BaseNomMotivodevolucion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatMotivodevolucionEntidad',
            array('local' => 'idmotivodevolucion', 'foreign' => 'idmotivodevolucion')
        );
    }

} //fin clase
