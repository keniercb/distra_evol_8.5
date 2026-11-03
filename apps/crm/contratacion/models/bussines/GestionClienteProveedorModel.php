<?php

/**
 * Clase encargada de la gestion de solicitudes del
 * comite de aprobacion
 *
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class GestionClienteProveedorModel extends ZendExt_Model
{
    private $_seguridad;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_seguridad = new SeguridadComunicationInterface();
    }

    public function obtenerIdFuncionalidad($params)
    {
        try {
            $url = $params['url'];
            $url = '/configuracion/clientesyproveedores/index.php/clientesyproveedores/clientesyproveedores';
            $resultado = $this->_seguridad->getFunctionalityByUrl($url);
            return $resultado;
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }


} 