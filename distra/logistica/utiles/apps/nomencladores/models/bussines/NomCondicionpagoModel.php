<?php

class NomCondicionpagoModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $arr = parent::buscar($obj, $arrIdsInsertados, true);
        $query = $arr['query'];
        $res = $query->fetchArray();
        $condicionpordefecto = self::getCondicionPagoPorDefecto();
        $pos = 0;
        foreach ($res as $condicion) {
            if ($condicion['idcondicionpago'] == $condicionpordefecto[0]['idcondicionpago']) {
                $res[$pos]['condicionpordefecto'] = true;
            } else {
                $res[$pos]['condicionpordefecto'] = false;
            }
            $pos++;
        }
        return array('cantidad' => $arr['cant'], 'datos' => $res);
    }

    public function getCondicionPagoPorDefecto()
    {
        $query = new Doctrine_Query();
        $query->select('ncp.idcondicionpago')
            ->from('NomCondicionpago ncp')
            ->where("ncp.pordefecto =?", 1);
        return $query->fetchArray();
    }

    public function innerJoinNomCondicionpago($query, $aliasinterno, $aliasNomCond)
    {
        return $query->addselect("{$aliasNomCond}.denominacion as nomcondicionpago")
                ->innerJoin("{$aliasinterno}.NomCondicionpago {$aliasNomCond}");
    }

    public function devolverCondicionpagoEntidad($idestructura)
    {
        $objNomCondicion = new NomCondicionpago();
        return $objNomCondicion->devolverCondicionpagoEntidad($idestructura);
    }

}
