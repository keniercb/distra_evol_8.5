<?php

/**
 * Created by PhpStorm.
 * User: alberto
 * Date: 06/10/2015
 * Time: 3:51
 */
class NomTransicionModel extends ZendExt_Model
{
    private $_segServiceInterface;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_segServiceInterface = new SeguridadComunicationInterface();
    }

    public function getRoles()
    {
        $result = $this->_segServiceInterface->getRoles();
        return array('data' => $result);
    }
} 