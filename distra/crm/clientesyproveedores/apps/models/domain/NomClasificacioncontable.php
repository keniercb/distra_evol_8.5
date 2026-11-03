<?php

/**
 * Clase modelo para datos de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Models/Domain
 * @copyright  XETID.
 * @version    1.0-0
 */
class NomClasificacioncontable extends BaseNomClasificacioncontable {

    /**
     * Inicializa el padre
     */
    public function setUp() {
        $this->hasOne('NomClienteproveedor', array('local' => 'idclasificacioncontable', 'foreign' => 'idclasificacioncontable'));
        parent::setUp();
    }

    public static function cargarclasificacioncont() {
        $q = Doctrine_Query::create();
        $result = $q->from("NomClasificacioncontable")
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
        $resultado = array('datos' => $result);
        return $resultado;
    }
}
