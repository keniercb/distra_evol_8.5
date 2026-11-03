<?php

class NomDedoModel extends ZendExt_Model
{
    private $_objDomain;

    public function __construct()
    {
        $this->_objDomain = new NomDedo();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCmbFingres()
    {
        try {
            return $this->_objDomain->getCmbFingres();
        } catch (Exception $e) {
            throw $e;
        }
    }

}

