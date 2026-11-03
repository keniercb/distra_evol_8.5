<?php

/**
 *
 */
class CfgOperaciondocumentoaftModel extends ZendExt_Model
{

    /**
     *
     */
    public function CfgOperaciondocumentoaftModel()
    {
        parent::ZendExt_Model();
    }

    /**
     *
     */
    public function insertar(CfgOperaciondocumentoaft $cfgOperDocActivo)
    {
        try {
            $cfgOperDocActivo->save();

            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $conn->commit();
            $conn->beginTransaction();

            return $cfgOperDocActivo->idmovproductomunic;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     *
     */
    public function actualizar(
    CfgOperaciondocumentoaft $cfgOperDocActivo
    )
    {
        try {
            $cfgOperDocActivo->save();

            return true;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     *
     */
    public function eliminar($cfgOperDocActivo)
    {
        $cfgOperDocActivo->delete();
    }

}
