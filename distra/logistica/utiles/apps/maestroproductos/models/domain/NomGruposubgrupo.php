<?php

/**
 * @package    Activos Fijos Tangibles
 * @subpackage Nomencladores
 * @author     Jorge Luis Cuellar Mondeja
 * @version    2.0
 */
class NomGruposubgrupo extends BaseNomGruposubgrupo
{

    public function setUp()
    {

        parent:: setUp();
        $this->hasOne('NomGruposubgrupohoja', array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo'));
        $this->hasMany('NomIndicadorhoja', array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo'));
    }

    /**
     * Devolver los hijos del arbol
     * */
    public function getArbol($objParams)
    {
        $query = Doctrine_Query:: create();
        if ($objParams->idnodo != 0) {
            $query->addWhere("g.idpadre = ? and g.idgruposubgrupo <> ?", array($objParams->idnodo, $objParams->idnodo));
        } else {
            $query->addWhere("g.nivel = ?", array($objParams->nivel));
        }
        if ($objParams->denominacion) {
            $query->addWhere("g.denominacion ilike '%{$objParams->denominacion}%'");
        }
        if (strlen($objParams->codigo) > 0) {
            $query->addWhere("g.codigo ilike '$objParams->codigo%'");
        }
        $query->addSelect(
            "g.idgruposubgrupo as id,g.nivel, g.codigo||' '||g.denominacion as text, g.idtabla, g.idtablageneral,
                g.denominacion, g.codigo, g.idpadre, g.idformato, g.ordenizq, g.ordender, g.fechainicio, 
                g.fechafin, g.version, g.arridtablas as arrTablas, g.arridtablasgenerales as arrTablasGeneral"
        );
        $query->from('NomGruposubgrupo g')->orderBy('g.codigo ASC');

        if ($objParams->incluirvencidos != 2) {
            $fechacontable = date('d/m/Y');
            $query->addWhere("(g.fechainicio <= '{$fechacontable}' OR g.fehcainicio is null)");
            $query->addWhere("(g.fechafin >= '{$fechacontable}' OR g.fechafin is NULL)");
        }
        return $query->fetchArray();
    }

    /*
     * Devueleve los grupos que no tienen padres, es decir los del 1er nivel
     */

    public function dameGruposPadres($parametros)
    {
        $query = new Doctrine_Query();
        $query->select('g.idgruposubgrupo as idgrupo, g.denominacion as grupo, g.codigo as codigogrupo')
            ->from('NomGruposubgrupo g')->where('g.idgruposubgrupo = g.idpadre');
        if ($parametros->codigo) {
            $query->addWhere("g.codigo like '%{$parametros->codigo}%'");
        }
        if ($parametros->denominacion) {
            $query->addWhere("g.denominacion iLike '%{$parametros->denominacion}%'");
        }
        if ($parametros->incluirvencidos != 2) {
            $fechacontable = date('d/m/Y');
            $query->addWhere("(g.fechainicio <= '{$fechacontable}' OR g.fehcainicio is null)");
            $query->addWhere("(g.fechafin >= '{$fechacontable}' OR g.fechafin is NULL)");
        }

        $query->orderBy('g.codigo ASC');

        return $query->fetchArray();
    }

    public function verficaHoja($idgrupo)
    {
        $query = new Doctrine_Query();
        $query->select(
            'h.idgruposubgrupo NOT IN (SELECT h.NomGruposubgrupo '
            . 'FROM NomGruposubgrupo g WHERE g.idpadre = h.idgruposubgrupo)'
        )->from('NomGruposubgrupo h')->where('h.idgruposubgrupo =?', $idgrupo)->execute();
        if ($query) {
            return true;
        } else {
            return false;
        }
    }

    public function dameCantGruposPadres($parametros)
    {
        $query = new Doctrine_Query();
        $query->select('g.idgruposubgrupo as idgrupo, g.denominacion as grupo, g.codigo as codigogrupo')
            ->from('NomGruposubgrupo g')->where('g.idgruposubgrupo = g.idpadre');
        if ($parametros->codigo) {
            $query->addWhere("g.codigo like '%$parametros->codigo%'");
        }
        if ($parametros->denominacion) {
            $query->addWhere("g.denominacion iLike '%{$parametros->denominacion}%'");
        }
        if ($parametros->incluirvencidos != 2) {
            $fechacontable = date('d/m/Y');
            $query->addWhere("(g.fechainicio <= '{$fechacontable}' OR g.fehcainicio is null)");
            $query->addWhere("(g.fechafin >= '{$fechacontable}' OR g.fechafin is NULL)");
        }
        return $query->count();
    }

    public function obteneCualquierGruposHijoPorID($idpadre)
    {
        $query = Doctrine_Query:: create();
        $query->orderBy('g.codigo ASC');

        if ($idpadre != 0) {
            $query->addWhere("g.idpadre = ? AND g.idpadre != g.idgruposubgrupo", array($idpadre));
        } else {
            $query->addWhere("g.idgruposubgrupo = g.idpadre");
        }
        $result = $query->from('NomGruposubgrupo g')->leftJoin('g.NomGruposubgrupohoja sg')->fetchArray();

        return $result;
    }

    public function obtenerMiPadre($idgrupohijo)
    {
        $query = Doctrine_Query:: create();
        $result = $query->from('NomGruposubgrupo g')
            ->where(
                "(SELECT grupo.idpadre FROM NomGruposubgrupo grupo "
                . "WHERE grupo.idgruposubgrupo = $idgrupohijo) = g.idgruposubgrupo"
            )->fetchArray();

        return $result;
    }

    public function obteneCualquierGrupoPorID($idgruposubgrupo)
    {
        $query = Doctrine_Query:: create();
        if ($idgruposubgrupo != 0) {
            $query->addWhere("g.idgruposubgrupo = ?", array($idgruposubgrupo));
        } else {
            $query->addWhere("g.idgruposubgrupo = g.idpadre");
        }
        $result = $query->from('NomGruposubgrupo g')->leftJoin('g.NomGruposubgrupohoja sg')->fetchArray();
        return $result;
    }
}
