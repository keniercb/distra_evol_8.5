<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
class DatFamiliarsancionado extends BaseDatFamiliarsancionado
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatFamiliar', array('local' => 'idfamiliar', 'foreign' => 'idfamiliar'));
        $this->hasOne('NomMotivosancion', array('local' => 'idmotivosancion', 'foreign' => 'idmotivosancion'));
        $this->hasOne('NomSancion', array('local' => 'idsancion', 'foreign' => 'idsancion'));
    }

    public function getByid($idfamiliarsancionado)
    {
        return Doctrine::getTable('DatFamiliarsancionado')->find($idfamiliarsancionado);
    }

    public function getFamiliarSancionadoByPesona(array $idpersona, $filtro, $limit = null, $start = 0)
    {
        try {

            $select = "dd.*,pa.denominacion as parentesco,ms.denominacion as motivo, ns.denominacion as sancion,
            np.idparentesco as idparentesco,
                np.nombre as nombre,  np.numid as numid, (CASE
                WHEN dd.fdesde <= now() and (now() <= dd.fhasta or dd.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico";
            $query = Doctrine_Query::create()
                ->select($select)
                ->from('DatFamiliarsancionado dd')
                ->innerJoin('dd.DatFamiliar np')
                ->innerJoin('dd.NomMotivosancion ms')
                ->innerJoin('dd.NomSancion ns')
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

    public function getCantFamiliarSancionadoByPesona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatFamiliarsancionado')->whereIn('idpersona', $idpersona);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

