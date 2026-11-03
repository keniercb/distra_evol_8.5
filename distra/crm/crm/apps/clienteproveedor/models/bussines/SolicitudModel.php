<?php

/**
 *
 *
 * @author         Ing. Lisvany Alonso Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/Clientes/Models/Bussines
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class SolicitudModel extends ZendExt_Model
{
    private $_solicitud;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $this->_solicitud = new DatSolicitud();
        parent::ZendExt_Model();
    }

    public function getSolicitudes($params)
    {
        try {
            $result = $this->_solicitud->getByParams($params);
            return array_merge(array('sucess' => true), $result);
        } catch (Exception $e) {
            return array("code" => $e->getCode(), "msg" => $e->getMessage(), "success" => false);
        }
    }

    public function setEstadoSolicitud($params)
    {
        try {
            $solicitud = Doctrine::getTable('DatSolicitud')->find($params['idsolicitud']);
            if ($solicitud) {
                $solicitud->estado = $params['estado'];
                $solicitud->save();
                return array('code' => 1, 'success' => true);
            }
            return array('code' => 2, 'success' => false);
        } catch (Exception $e) {
            return array("code" => $e->getCode(), "msg" => $e->getMessage(), "success" => false);
        }
    }
}
