<?php

class DatValidacionpersona extends BaseDatValidacionpersona
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idvalidacionpersona
     *
     * @return Doctrine_Record
     */
    public function getById($idvalidacionpersona)
    {
        return Doctrine::getTable('DatValidacionpersona')->find($idvalidacionpersona);
    }
    
    public function getByIdpersona($idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('dvp.idvalidacionpersona')
                ->from('DatValidacionpersona dvp')
                ->where('dvp.idpersona = ?', $idpersona);            
            $result = $query->execute()->toArray();            
            if (!empty($result)) {
                return $result[0]['idvalidacionpersona'];
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

