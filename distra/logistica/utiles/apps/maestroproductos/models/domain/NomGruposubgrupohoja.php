<?php

/**
 * @package    Activos Fijos Tangibles
 * @subpackage Nomencladores
 * @author     Jorge Luis Cuellar Mondeja
 * @version    2.0
 */
class NomGruposubgrupohoja extends BaseNomGruposubgrupohoja
{

    public function setUp()
    {
        $this->hasOne('NomGruposubgrupo', array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo'));
        parent:: setUp();
    }

    private function GetFiltro($objParams)
    {
        $objParams = (array)$objParams;
        $query = Doctrine_Query::create();
        if ($objParams['idpadre']) {
            $grupo = Doctrine::getTable('NomGruposubgrupo')->find($objParams['idpadre']);           
            $query->addWhere("g.ordenizq >= $grupo->ordenizq AND g.ordender <= $grupo->ordender AND ".
                " g.idarbol = $grupo->idarbol");
        } elseif ($objParams['ordenizq']) {
            $query->addWhere("g.ordenizq >= {$objParams['ordenizq']} AND g.ordender <= {$objParams['ordender']}");
        }
        if ($objParams['denominacion']) {
            $query->addWhere("g.denominacion ilike '%{$objParams['denominacion']}%'");
        }

        if ($objParams['codigo']) {
            $query->addWhere("g.codigo ilike '{$objParams['codigo']}%'");
        }
        if ($objParams['query']) {
            $query->addWhere(
                "g.denominacion ilike '%{$objParams['query']}%' OR g.codigo ilike '%{$objParams['query']}%'"
            );
        }

        if ($objParams['incluirvencidos'] != 2) {
            $fechacontable = date('d/m/Y');
            $query->addWhere("(g.fechainicio <= '{$fechacontable}' OR g.fechainicio is null)");
            $query->addWhere("(g.fechafin >= '{$fechacontable}' OR g.fechafin is NULL)");
        }
        LogisticaDoctrineHelper::__init()->addQueryLimits($query, $objParams);
        return $query;
    }

//
    /**
     * Devuelve todos los subgrupos con sus arreglos de idtablas para los atributos dinamicos
     * */
    public function getDatos($objParams)
    {
        $query = self::GetFiltro($objParams);
        $subgrupos = $query->select(
            "sg.idgruposubgrupo, sg.vidautil, sg.tasafiscalmin, sg.tasafiscalmax, sg.porcientorecuperacion,
                        g.denominacion as denominacion, g.codigo as codigo,
                        g.codigo||' '||g.denominacion as denominacionlarga, g.idpadre as idpadre, 
                        g.idformato as idformato, g.nivel as nivel, g.idtabla as idtabla,
                        g.idtablageneral as idtablageneral, g.arridtablas as arrTablas, 
                        g.arridtablasgenerales as arrTablasGeneral,
                        g.fechainicio as fechainicio, g.fechafin as fechafin"
        )->from('NomGruposubgrupohoja sg')->innerJoin('sg.NomGruposubgrupo g')
            ->orderBy('g.codigo ASC')->fetchArray();
        return $subgrupos;
    }

    /*
     * Devuelve la cantidad total de los subgrupos
     * */

    public function getCantDatos($objParams)
    {
        $query = self::GetFiltro($objParams);
        $query->from('NomGruposubgrupohoja sg')->innerJoin('sg.NomGruposubgrupo g');        
         $datos = $query->count();
        return $datos;
    }

    public function DameSumbgruposCombo($parametros)
    {
        $query = self::GetFiltro($parametros);

        return $query->select("g.idgruposubgrupo, g.codigo||' '||g.denominacion as denominacion")
            ->from('NomGruposubgrupo g')->innerJoin('g.NomGruposubgrupohoja sg')->orderBy('g.codigo ASC')
            ->fetchArray();
    }

    /**
     * Devuelve la denominacion de un subgrupo dado su ID
     * */
    public function getGrupoPorId($idsubgrupo)
    {
        $query = Doctrine_Query:: create();

        return $query->select(
            "sg.idgruposubgrupo,
                               sg.vidautil,
                               sg.tasafiscalmin,
                               sg.tasafiscalmax,
                               sg.porcientorecuperacion,
                               g.denominacion as denominacion,
                               g.codigo as codigo,
                               g.codigo||' '||g.denominacion as denominacionlarga,
                               g.idpadre as idpadre,
                               g.nivel as nivel,
                               g.idtabla as idtabla,
                               g.idtablageneral as idtablageneral,
                               g.arridtablas as arrTablas,
                               g.arridtablasgenerales as arrTablasGeneral"
        )->from('NomGruposubgrupohoja sg')->innerJoin('sg.NomGruposubgrupo g')
            ->where("g.idgruposubgrupo = ?", array($idsubgrupo))->fetchArray();
    }
    
    public function obtenerGruposHojas($parametros)
    {
        $parametros = (array)$parametros;

        $datos = $this->getDatos($parametros);

        unset($parametros['start']);
        unset($parametros['limit']);

        $total = $this->getCantDatos($parametros);

        return array('data' => $datos, 'total' => $total);
    }

}
