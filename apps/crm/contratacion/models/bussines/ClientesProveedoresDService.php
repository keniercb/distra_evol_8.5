<?php

/**
 * ClientesProveedoresDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ClientesProveedoresDService extends ZendExt_Model
{
    private $_cientesproveedoresRepository;

    public function __construct()
    {
        $this->_cientesproveedoresRepository = new ClientesProveedoresRepository();
        parent::ZendExt_Model();
    }

    public function getClientesProveedores($params)
    {
        $iddominio = $this->global->Perfil->iddominio;
        return $this->_cientesproveedoresRepository->getClientesProveedores($iddominio, $params);
    }

    public function getClienteProveedorDetalles($idclientep)
    {
        $iddominio = $this->global->Perfil->iddominio;

        return array(
            'contactos' => $this->_cientesproveedoresRepository->getContactosByIdClienteP($idclientep),
            'cuentas' => $this->_cientesproveedoresRepository->getCuentasByIdClienteP($idclientep),
            'contratos' =>  $this->_cientesproveedoresRepository->getContratosByIdClienteP($idclientep, $iddominio)
        );
    }
}