<?php

/**
 * Servicios asociados a los niveles estructurales.
 *
 * @copyright  XETID
 * @package    Servicios
 * @subpackage Configuración/DivisiónPolítica
 * @version    1.0
 * @author     Yoandry Morejon Borbon
 */
class NivelEstructuralService extends ZendExt_Model
{

    /**
     * Devuelve un listado de los niveles estructurales asociados a un concepto y a un nivel estructural.
     *
     * @param string $idConcepto - Concepto estructural.
     * @param int    $idNivel    - Identificador del nivel estructural.
     *
     * @return array
     */
    function listarNivelesEstructuralesHijos($idConcepto, $idNivel)
    {
        $model = new GestnivelestructuralModel();
        $result = $model->buscarConexionesarbol($idNivel, $idConcepto);
        $arrNiveles = array();
        foreach ($result as $valor) {
            $arrTemp = array();
            $arrTemp['idnivelestructural'] = $valor['idnivelestructural'];
            $arrTemp['idconceptoestructural'] = $valor['idconceptoestructural'];
            $arrTemp['idconceptonivel'] = $valor['idconceptonivel'];
            $arrTemp['text'] = $valor['text'];
            // $arrTemp['icon'] = 'perfil.dirImg' . 'adicionar.png';
            $arrTemp['uritiponivelestructural'] = $valor['NomTiponivelestructural']['uri'];
            $arrTemp['idtiponivelestructural'] = $valor['NomTiponivelestructural']['idtiponivelestructural'];
            $arrNiveles[] = $arrTemp;
        }
        return $arrNiveles;
    }

    /**
     * Devuelve los datos de un nivel estructural dado su identificador.
     *
     * @param int $idNivelEst - Identificador del nivel estructural.
     *
     * @return array
     */
    function obtenerNivelEstructuralDadoId($idNivelEst)
    {
        return NomNivelestructural::getNivelestructuralid($idNivelEst);
    }

    function obtenerNivelporURI($uri)
    {
        return NomNivelestructural::obtenerNivelporURI($uri);
    }

    /**
     * Para devolver los datos asociados a una Base legal
     *
     * @param array $arrayidbaselegal Arreglo de IDs de Bases legales
     *
     * @return array
     * @author Liv\xE1n Capote Valdés
     */
    function obtenerBaseLegalId($arrayidbaselegal)
    {
        $model = new GestnivelestructuralModel();
        return $model->obtenerBaseLegalId($arrayidbaselegal);
    }

}
