<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class DatFamiliarviaje extends BaseDatFamiliarviaje
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatFamiliar', array('local' => 'idfamiliar', 'foreign' => 'idfamiliar'));
    }

    public function getByid($idfamiliarviaje)
    {
        return   Doctrine::getTable('DatFamiliarviaje')->find($idfamiliarviaje);
    }

    public function getFamiliarViajeByPesona(array $idpersona, $filtro, $limit = null, $start = 0)
    {
        try {
            $select
                = "dd.*,np.nombre as nombre,  np.numid as numid, p.denominacion as parentesco,
                np.idparentesco as idparentesco,(CASE
                WHEN dd.fdesde <= now() and (now() <= dd.fhasta or dd.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico";
            $query = Doctrine_Query::create()
                ->select($select)
                ->from('DatFamiliarviaje dd')
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

    public function getCantFamiliarViajeByPesona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatFamiliarviaje')->whereIn('idpersona', $idpersona);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


}

