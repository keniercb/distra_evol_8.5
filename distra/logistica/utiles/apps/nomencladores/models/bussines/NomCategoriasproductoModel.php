<?php

class NomCategoriasproductoModel extends NomencladoresModel
{

    //put your code here
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $arr = parent::buscar($obj, $arrIdsInsertados, true);
        $query = $arr['query'];
        $res = $query->fetchArray();
        $categoriapordefecto = self::getCategoriaPorDefecto();
        $pos = 0;
        foreach ($res as $categorias) {
            if ($categorias['idcategoria'] == $categoriapordefecto[0]['idcategoria']) {
                $res[$pos]['categoriapordefecto'] = true;
            } else {
                $res[$pos]['categoriapordefecto'] = false;
            }
            $pos++;
        }
        return array('cantidad' => $arr['cant'], 'datos' => $res);
    }

    public function getCategoriaPorDefecto()
    {
        $query = new Doctrine_Query();
        $query->select('nc.idcategoria')
            ->from('NomCategoriasproducto nc')
            ->where("nc.pordefecto =?", 1);
        return $query->fetchArray();
    }

    public function innerJoinNomCategoria($query, $aliasinterno, $aliasNomCat)
    {
        return $query->addselect("{$aliasNomCat}.denominacion as nomcategoria")
                ->leftJoin("{$aliasinterno}.NomCategoriasproducto {$aliasNomCat}");
    }

}
