<?php

class ConfEstructurasubsist extends BaseConfEstructurasubsist
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function getSubsistemas($params)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->from("ConfEstructurasubsist")
                ->where("idplantilla= " . $params['idplantilla'])
                ->execute()
                ->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function deleteSubsitemas($params)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->delete('ConfEstructurasubsist')
                ->where("idplantilla= " . $params['idplantilla'])
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}
