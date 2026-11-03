<?php

/**
 *
 */
class MovRegnumericoActivoModel extends MovRegNumericoModel
{

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
    }
    
    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings = array(
            'idgruposubgrupo'=> '_p.idgruposubgrupo',
            'nroinventario' => '_p.nroinventario',
            'depreciacionacumulada' => '_p.depreciacionacumulada',
            'vidautil' => '_p.vidautil',
            'porcientorecuperacion' => '_p.porcientorecuperacion',
            'valorcontable' => '_p.valorcontable',
            'fechaexpini' => '_p.fechaexpini',
            'fechaexpfin' => '_p.fechaexpfin',
            'fechaadq' => '_p.fechaadq',
            'tasafiscal' => '_p.tasafiscal',
            // 'garantia' => '_p.garantia',
            'idarearesp' => '_p.idarearesp',
            'idcolorprim' => '_p.idcolorprim',
            'idcolorsec' => '_p.idcolorsec',
            'valoradquisicion' => '_p.valoradquisicion',
            'idcentrocosto' => '_p.idcentrocosto',
            'idestatustecnico' => '_p.idestatustecnico',
            'idubicacion' => '_p.idubicacion',
            'idactividad' => '_p.idactividad',
            'annofabricacion' => '_p.annofabricacion',
            'idcategoria' => '_p.idcategoria',
            'idresponsable' => '_p.idresponsable',
            'importe' => '_p.importe',
            'usufructo' => '_p.usufructo',
            'recursoconsumidomax' => '_p.recursoconsumidomax',
            'fechainicialgarantia' => '_p.fechainicialgarantia',
            'fechafingarantia' => '_p.fechafingarantia',
            'cantidadrecursoconsumido' => '_p.cantidadrecursoconsumido'
        );

        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_p');
    }
    
    /**
     *
     */
    public function getMovRegNumericoActivo($alias, $select = false, $paramsWhere = array())
    {
        $query = new Doctrine_Query();
        $query->from("DatMovRegnumericoActivo {$alias}");
        $query->select("{$alias}.idmovregnumerico");

        if ($select) {
            $this->getSelectMovRegNumericoActivo($query, $alias, '');
        }

        if ($paramsWhere) {
            $this->getWhereMovRegNumericoActivo($query, $alias, $paramsWhere);
        }

        return $query;
    }

    /**
     *
     */
    
    public function getJoinMovRegNumericoActivo(
    Doctrine_Query &$query, $alias, $aliasExt, $join = 1, $select = false, $paramsWhere = array()
    )
    {
        if (!$query) {
            $query = new Doctrine_Query();
            $query->from("DatMovRegnumericoActivo {$alias}");
        } else {
            if ($join) {
                $query->innerJoin("{$aliasExt}.DatMovRegnumericoActivo {$alias}");
            } else {
                $query->leftJoin("{$aliasExt}.DatMovRegnumericoActivo {$alias}");
            }
        }

        if ($select) {
            $this->getSelectMovRegNumericoActivo($query, $alias, '');
        }

        if ($paramsWhere) {
            $this->getWhereMovRegNumericoActivo($query, $alias, $paramsWhere);
        }
    }

    /**
     *
     */
    public function getSelectMovRegNumericoActivo(Doctrine_Query &$query, $alias, $postAlias = '__')
    {
        $columnNames = Doctrine::getTable('DatMovRegnumericoActivo')->getColumnNames();
        foreach ($columnNames as $columna) {                        
            $query->addSelect("{$alias}.{$columna} AS {$columna}$postAlias");
        }
    }

    /**
     *
     */
    public function getWhereMovRegNumericoActivo(Doctrine_Query &$query, $alias, $paramsWhere = array())
    {
        ComunAFTModel::getInstance()->getFiltroGenerico($query, $alias, 'DatMovRegnumericoActivo', $paramsWhere);
    }

    /**
     *
     */
    public function crearMovRegNumericoDesdeRegNumerico($rns, $idmovimiento, $idoperacion, $idestructura)
    {   
        $collMovRecNum = new Doctrine_Collection('DatMovRegnumerico');
        $regNumActivoModel = new RegNumericoActivoModel();
        foreach ($rns as $i => $rn) {
            $query = new Doctrine_Query();
            $query->from('DatRegnumericoActivo rna'); 
            $query->leftJoin('rna.DatRegnumerico rn');
            $query->leftJoin('rn.DatMovRegnumerico mrn');
            $query->leftJoin('mrn.DatMovimientos dm');
            $query->leftJoin('dm.DatProductoLogistica p');
            $query->whereIn('rna.idregnumerico', array($rn));                          //join con nom indihoja?????????
            $query->addSelect($regNumActivoModel->getQuerySelectFields('rna'));
            (new MaestroProductoModel())->addQueryNomIndicador($query, 'p', 'i', 'ih');
            $datos = $query->fetchArray();
            $MovRegNum = new DatMovRegnumerico();
            $MovRegNum->idmovimiento = $idmovimiento;
            $MovRegNum->idregnumerico = $rn;  
            $MovRegNum->DatMovRegnumericoActivo->synchronizeWithArray($datos[0]);
            $collMovRecNum->add($MovRegNum);
        }
        return $collMovRecNum;
    }

}
