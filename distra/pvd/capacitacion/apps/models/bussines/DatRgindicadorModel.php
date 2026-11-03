<?php 
class DatRgindicadorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getIndicadoresRecienG($idrgperiodo, $idreciengraduado, $filtro, $inicio, $limite)
    {
        try {
            $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $datos = DatRgindicador::getIndicadores($idrgperiodo, $idreciengraduado, $identidad, $filtro, $inicio,
                $limite);
            if (count($datos) > 0) {
                foreach ($datos as $f=>$ev) {
                    if (isset($ev['idvalor'])) {
                        $valor = ZendExt_IoC_Inter::getInstance()->maestro->getDenomValorByIdEscalaIdValor(
                            $ev['idescala'], $ev['idvalor']
                        );
                        $datos[$f]['valor'] = (isset($ev['idvalor'])) ? $valor : '';
                    }
                }
            } else {
                $datos = Array();
            }
            $resp->datos = $datos;
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idreciengraduado, $idindicador)
    {
        try {
            $existe = DatRgindicador::existeInd($idindicador, $idreciengraduado);
            if (count($existe) == 0) {
                $obj = new DatRgindicador();
                $obj->idreciengraduado = $idreciengraduado;
                $obj->idindicador = $idindicador;
                $obj->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function evaluar($idrgindicador, $idvalorescala, $idrgperiodo)
    {
        try {
            DatEvalrg::eliminarByIndicador($idrgindicador, $idrgperiodo);
            $obj = new DatEvalrg();
            $obj->idrgindicador = $idrgindicador;
            $obj->idrgperiodo = $idrgperiodo;
            $obj->idvalorescala = (isset($idvalorescala))?$idvalorescala:null;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idrgindicador)
    {
        try {
            $obj = DatRgindicador::getById($idrgindicador);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function getEvaluacion($idreciengraduado)
    {
        try {
            $periodos = DatRgperiodo::getPeriodosEval($idreciengraduado);
            foreach ($periodos as $p => $per) {
                foreach ($per['DatEvalrg'] as $f => $ev) {
                    if (isset($ev['idvalorescala'])) {
                        $idescala = $ev['DatRgindicador']['NomIndicadoramedir']['idescala'];
                        $valor = ZendExt_IoC_Inter::getInstance()->maestro->getDenomValorByIdEscalaIdValor(
                            $idescala, $ev['idvalorescala']
                        );
                        $periodos[$p]['DatEvalrg'][$f]['valor'] = (isset($ev['idvalorescala'])) ? $valor : '';
                        $periodos[$p]['DatEvalrg'][$f]['indicador'] =
                            $ev['DatRgindicador']['NomIndicadoramedir']['denominacion'];
                    }
                }
            }
            return $periodos;
        } catch (Exception $e) {
            return false;
        }
    }
}