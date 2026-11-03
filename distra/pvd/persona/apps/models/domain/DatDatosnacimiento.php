<?php

class DatDatosnacimiento extends BaseDatDatosnacimiento
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
     * @params $iddatosnacimiento
     *
     * @return Doctrine_Record
     */
    public function getById($iddatosnacimiento)
    {
        return Doctrine::getTable('DatDatosnacimiento')->find($iddatosnacimiento);
    }

    /**
     * Obtener los datos de nacimiento de la persona
     *
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getBirthdataByIdPerson(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('dn.*')
                ->from('DatDatosnacimiento dn')
                ->whereIn('dn.idpersona', $idpersona);
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantBirthdataByIdPerson(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatDatosnacimiento dn')
                ->whereIn('dn.idpersona', $idpersona);
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

