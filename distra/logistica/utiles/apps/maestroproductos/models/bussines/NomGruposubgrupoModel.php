<?php

/**
 * NomGruposubgrupoModel
 * Modelo del Nomenclador de Grupos
 *
 * @package    Activos Fijos Tangibles
 * @subpackage Nomencladores
 * @author     Jorge Luis Cuellar Mondeja
 * @version    2.0
 */
class NomGruposubgrupoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent:: ZendExt_Model();
    }

    public function insertar($parametros)
    {
        $objGrupo = new NomGruposubgrupo();
        $objGrupo->denominacion = $parametros['denominacion'];
        $objGrupo->codigo = $parametros['codigopadre'] . $parametros['codigo'];
        $objGrupo->idpadre = ($parametros['idgrupo'] !=0)? $parametros['idgrupo']:null;
        $objGrupo->idformato = $parametros['idformato'];
        $objGrupo->nivel = $parametros['nivel'];
        $objGrupo->fechainicio = $parametros['fechainicio'];
        $objGrupo->fechafin = $parametros['fechafin'];
        $objGrupo->save();
    }

    public function actualizar($parametros)
    {
        $objGrupo = Doctrine:: getTable('NomGruposubgrupo')->find($parametros['idgrupo']);
        $objGrupo->denominacion = $parametros['denominacion'];
        $objGrupo->codigo = $parametros['codigo'];
        if($parametros['idformato'])
        $objGrupo->idformato = $parametros['idformato'];
        $objGrupo->fechainicio = $parametros['fechainicio'];
        $objGrupo->fechafin = $parametros['fechafin'];

        if ($parametros['coeficiente']) {
            $objGrupo->coeficiente = $parametros['coeficiente'];
        }
        $objGrupo->save();
    }

    public function eliminar($idgrupo)
    {
        $objGrupo = Doctrine:: getTable('NomGruposubgrupo')->find($idgrupo);

        $tablaModel = new ZendExt_Metadata_Models_TablaModel();

        if ($objGrupo->idtabla != -1) {
            $tablaModel->eliminarTabla($objGrupo->idtabla);
        }

        if ($objGrupo->idtablageneral != -1) {
            $tablaModel->eliminarTabla($objGrupo->idtablageneral);
        }

        $objGrupo->delete();
    }

    public function buscarTree($parametros)
    {
        $arrConfig = array(
            'id'           => 'idgruposubgrupo', 'tree' => 'NomGruposubgrupo',
            'code'         => 'codigo', 'description' => 'denominacion',
            'formatLength' => $parametros->formatLength
        );
        $ts = TreeSearch::getInstance();
        $ts->setConfigSearch($arrConfig);
        $parametros->query = $parametros->query;
        $tsearch = $ts->recursiveTreeSearch($parametros);

        return $tsearch;
    }

    public function obteneCualquierGruposHijoPorID($idgruposubgrupo)
    {
        return NomGruposubgrupo::obteneCualquierGruposHijoPorID($idgruposubgrupo);
    }

    public function obteneCualquierGrupoPorID($idgruposubgrupo)
    {
        return NomGruposubgrupo::obteneCualquierGrupoPorID($idgruposubgrupo);
    }

}
