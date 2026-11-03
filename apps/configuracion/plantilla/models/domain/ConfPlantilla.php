<?php

/**
 * Componente para gestionar las plantillas
 *
 * @package    Configuración
 * @subpackage Plantilla/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class ConfPlantilla extends BaseConfPlantilla
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function load($params)
    {
        try {
            $instance = Doctrine_Manager::getInstance();
            $conexion = $instance->getCurrentConnection();

            $condition = $this->getConditions($params);

            $where = count($condition) ? 'WHERE ' . implode(' AND ', $condition) : '';

            $query
                = "SELECT m1.*,m2.denominacion as componente, m2.referencia FROM mod_datosmaestros.conf_plantilla m1
                      INNER JOIN mod_seguridad.dat_funcionalidad m2 ON m1.idfuncionalidad = m2.idfuncionalidad $where";

            if ($params['start'] != null && $params['limit'] != null) {
                $extra = " OFFSET " . $params['start'] . " LIMIT " . $params['limit'];
            }

            $result = $conexion->fetchAll($query . $extra);

            $query = "SELECT count(b.idplantilla) FROM ($query)b";

            $count = $conexion->fetchAll($query);
            return array('data' => $result, 'count' => $count[0]['count']);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getConditions($params)
    {
        $condition = [];

        if ($params['denominacion']) {
            $condition[] = "m1.denominacion ILIKE '%" . $params['denominacion'] . "%'";
        }

        if ($params['idfuncionalidad']) {
            $condition[] = "m1.idfuncionalidad = " . $params['idfuncionalidad'];
        }

        if ($params['componente']) {
            $condition[] = "componente ILIKE '%" . $params['componente'] . "%'";
        }

        if ($params['idplantilla']) {
            $condition[] = "m1.idplantilla = " . $params['idplantilla'];
        }
        return $condition;
    }
}
