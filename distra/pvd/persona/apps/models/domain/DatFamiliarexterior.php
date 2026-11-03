<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class DatFamiliarexterior extends BaseDatFamiliarexterior
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatFamiliar', array('local' => 'idfamiliar', 'foreign' => 'idfamiliar'));
    }

    public function getByid($idfamiliarresidente)
    {
        return Doctrine::getTable('DatFamiliarexterior')->find($idfamiliarresidente);
    }

    public function getFamiliarResidenteByPesona(array $idpersona, $filtro, $limit = null, $start = 0)
    {
        try {

            $select = "dd.*,p.denominacion as parentesco, np.idparentesco as idparentesco,
                np.nombre as nombre,  np.numid as numid, (CASE
                WHEN dd.fdesde <= now() and (now() <= dd.fhasta or dd.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico";
            $query = Doctrine_Query::create()
                ->select($select)
                ->from('DatFamiliarexterior dd')
                ->innerJoin('dd.DatFamiliar np')
                ->innerJoin('np.NomParentesco p')
                ->whereIn('dd.idpersona', $idpersona);
            if ($limit) {
                $query->limit($limit)->offset($start);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }

    }

    public function getCantFamiliarResidenteByPesona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatFamiliarexterior')->whereIn('idpersona', $idpersona);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


}

