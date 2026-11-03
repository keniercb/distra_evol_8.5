<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class DatFamiliarresidente extends BaseDatFamiliarresidente
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatFamiliar', array('local' => 'idfamiliar', 'foreign' => 'idfamiliar'));
        $this->hasOne('NomNacionalidad', array('local' => 'idnacionalidad', 'foreign' => 'idnacionalidad'));
    }

    public function getByid($idfamiliarresidente)
    {
        return Doctrine::getTable('DatFamiliarresidente')->find($idfamiliarresidente);
    }

    public function getFamiliarRelacionesByPesona(array $idpersona, $filtro, $limit = null, $start = 0)
    {
        try {

            $select = "dd.*,p.denominacion as nacionalidad, p.bandera as bandera,pa.denominacion as parentesco,
            np.idparentesco as idparentesco,
                np.nombre as nombre,  np.numid as numid, (CASE
                WHEN dd.fdesde <= now() and (now() <= dd.fhasta or dd.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico";
            $query = Doctrine_Query::create()
                ->select($select)
                ->from('DatFamiliarresidente dd')
                ->innerJoin('dd.DatFamiliar np')
                ->innerJoin('dd.NomNacionalidad p')
                ->innerJoin('np.NomParentesco pa')
                ->whereIn('dd.idpersona', $idpersona);
            if ($limit) {
                $query->limit($limit)->offset($start);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }

    }

    public function getCantFamiliarRelacionesByPesona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatFamiliarresidente')->whereIn('idpersona', $idpersona);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


}

