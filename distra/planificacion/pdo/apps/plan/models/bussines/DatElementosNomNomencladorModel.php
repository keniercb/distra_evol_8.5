<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatElementosNomNomencladorModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(
        DatElementosNomNomenclador $datElementosNomNomenclador
    ) {
        $datElementosNomNomenclador->save();
    }

    public function Actualizar(
        DatElementosNomNomenclador $datElementosNomNomenclador
    ) {
        $datElementosNomNomenclador->save();
    }

    public function Eliminar($datElementosNomNomenclador)
    {
        $datElementosNomNomenclador->delete();
    }

    public function existeNomencladorSegunId($idNom)
    {
        $result = DatElementosNomNomenclador::existeNomencladorSegunId($idNom);
        return $result;
    }

    public function existeNomencladorTipo5SegunId($idNom)
    {
        $result = DatElementosNomNomenclador::existeNomencladorTipo5SegunId(
            $idNom
        );
        return $result;
    }

    public function existeActividadSegunId($idElem)
    {
        $result = DatElementosNomNomenclador::existeActividadSegunId($idElem);
        return $result;
    }

    public function AdicionarRelacionNomElem(
        $datelemento, $idcategoria, $tiponomenclador
    ) {
        $elemnom = new DatElementosNomNomenclador();
        $elemnom->idelemento = $datelemento;
        $elemnom->idnomenclador = $idcategoria;
        $elemnom->tiponomenclador = $tiponomenclador;
        $elemnom->save();
        return $elemnom;
    }

    public function EliminarElemNom($idelemento)
    {
        DatElementosNomNomenclador:: EliminarElemNomActividad($idelemento);
    }

    public function ModificarRelacionNomElem(
        $datelemento, $idcategoria, $tiponomenclador
    ) {
        $idelemento = $datelemento->idelemento;
        $elemnom = Doctrine::getTable('DatElementosNomNomenclador')->findByDql(
            "idelemento = $idelemento AND tiponomenclador = $tiponomenclador"
        );
        if (isset($elemnom)) {
            $elemnom->delete();
        }
        $elemnom = $this->AdicionarRelacionNomElem(
            $datelemento, $idcategoria, $tiponomenclador
        );
        return $elemnom;
    }

    public function getIndicadores()
    {
        $indicadores = DatElementosNomNomenclador::getIndicadores();
        return $indicadores;
    }

    public function cargarRecursosSinAsociar($params)
    {
        $objElemenNom = new DatElementosNomNomenclador();
        $nomencladores = $objElemenNom->cargarRecursosSinAsociar($params);
        if (isset($nomencladores[0])) {
            $dat->total = $nomencladores[0]['total'];
            foreach ($nomencladores as $val) {
                if ($params->filtros) {
                    $ese = $params->filtros[0][data][value];
                    $resultado = strpos($val['denom'], $ese);
                    if ($resultado !== false) {
                        $dat->data []
                            = array('idcategoria'  => $val['idnomenclador'],
                            'denominacion' => $val['denominacion'],
                            'um'           => $val['um'],
                            'indicador'    => $val['indicador']);
                    }
                } else {
                    $dat->data []
                        = array('idcategoria'  => $val['idnomenclador'],
                        'denominacion' => $val['denominacion'],
                        'um'           => $val['um'],
                        'indicador'    => $val['indicador']);
                }

            }
        } else {
            $dat->data = array();
            $dat->total = 0;
        }
        return $dat;
    }

    public function cargarRecursosAsociados($params)
    {
        if ($params->estamodificando == 1) {
            $objElemenNom = new DatElementosNomNomenclador();
            $nomencladores = $objElemenNom->cargarRecursosAsociados($params);
            if($params->objeto){
                foreach ($nomencladores as $k=>$val) {
                    $result[$k]->idcategoria=$val->idnomenclador;
                    $result[$k]->denominacion=$val->denominacion;
                    $result[$k]->um=$val->um;
                    $result[$k]->cantidad= round($val->cantidad, 3);
                    $result[$k]->indicador=$val->indicador;
                }

                return $result;

            }
            if ($nomencladores != null) {
                foreach ($nomencladores as $val) {
                    if ($params->filtros) {
                        $ese = $params->filtros[0][data][value];
                        $resultado = strpos($val['denom'], $ese);
                        if ($resultado !== false) {
                            $dat->data []
                                = array('idcategoria'  => $val['idnomenclador'],
                                'denominacion' => $val['denominacion'],
                                'um'           => $val['um'],
                                'cantidad'     => round($val['cantidad'], 3),
                                'indicador'    => $val['indicador']);
                        }
                    } else {
                        $dat->data []
                            = array('idcategoria'  => $val['idnomenclador'],
                            'denominacion' => $val['denominacion'],
                            'um'           => $val['um'],
                            'cantidad'     => round($val['cantidad'], 3),
                            'indicador'    => $val['indicador']);
                    }
                }
            } else {
                $dat->data = array();
            }
        } else {
            $dat->data = array();
        }
        return $dat;
    }

}

