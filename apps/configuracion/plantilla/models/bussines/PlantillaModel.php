<?php

/**
 * Componente para gestionar las platillas
 *
 * @package    Configuración
 * @subpackage Plantilla/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 * @author     Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 */
class PlantillaModel extends ZendExt_Model
{
    private $_template;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $this->_template = new ConfPlantilla();
        parent::ZendExt_Model();
    }

    public function save($params)
    {
        try {
            $idfuncionalidad = $params['idfuncionalidad'];
            $denominacion = $params['denominacion'];
            $idplantilla = $params['idplantilla'];
            if ($idplantilla) {
                $query = "UPDATE mod_datosmaestros.conf_plantilla set idfuncionalidad = $idfuncionalidad,
                          denominacion='$denominacion') WHERE idplantilla = $idplantilla RETURNING idplantilla";
            } else {
                $query = "INSERT INTO mod_datosmaestros.conf_plantilla VALUES(DEFAULT,$idfuncionalidad,'$denominacion')
                          RETURNING idplantilla";
            }

            $conexion = $params['conexion'];
            if (!$conexion) {
                $instance = Doctrine_Manager::getInstance();
                $conexion = $instance->getCurrentConnection();
            }

            $result = $conexion->fetchAll($query);

            return array('code' => 1, 'msg' => '', 'id' => $result[0]['idplantilla']);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'id' => 0);
        }
    }

    public function load($params)
    {
        return $this->_template->load($params);
    }
}
