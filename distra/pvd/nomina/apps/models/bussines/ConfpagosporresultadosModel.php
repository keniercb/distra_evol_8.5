<?php


class ConfpagosporresultadosModel extends ZendExt_Model
{
    public function ConfpagosporresultadosModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerConfpagosporresultados($idestructura, $start = 0, $limit = 1000)
    {
        return ConfPagosporresultado::obtenerConfpagosporresultados($idestructura, $start, $limit);
    }

    public function cantidadConfpagosporresultados($idestructura)
    {
        return ConfPagosporresultado::cantidadConfpagosporresultados($idestructura);
    }

    public function ObtenerCargosporareas($idarea, $idestructura, $idpagoporresultado)
    {
        $objConfCargoPagoxResultados = new ConfPlantillaNominalCargo();
        //Retornando los cargos por áreas
        $cont = 0;
        foreach ($idarea as $k => $v) {
            $arrayArea = ConfCargospagosporresultados::ObtenerCargosporareasPagoResultados($v, $idestructura, $idpagoporresultado);
            foreach ($arrayArea as $key => $val) {
                $arrayAreaFinal[$cont] = $val;
                $arrayAreaFinal[$cont]['denominacion'] = $this->integrator->metadatos->DameEstructura($val['idcargo'])[0]->denominacion.' - '. $objConfCargoPagoxResultados->obtenerDenomPlantillaXIdCargo($val['idcargo']);
                $cont++;
            }
        }
        return $arrayAreaFinal;
    }

    public function AddTiposdepagos($idtipopago, $idestrcutura)
    {
        $cont = 0;
        $contDenm = 0;
        $denom = array();
        foreach ($idtipopago as $k => $v) {

            $existe = ConfPagosporresultado::getByidtipopago($v['idtipopago'], $idestrcutura);

            if ($existe == 0) {
                $objConfpagosporresultados = new ConfPagosporresultado();
                $objConfpagosporresultados->idtipopago = $v['idtipopago'];
                $objConfpagosporresultados->referencia = $v['referencia'];
                $objConfpagosporresultados->estado = 1;
                $objConfpagosporresultados->identidad = $idestrcutura;
                $objConfpagosporresultados->save();
            } else {
                $idGuardar[$cont] = $v['idtipopago'];
                $cont++;
            }
        }

        if (count($idGuardar) > 0) {
            foreach ($idGuardar as $gk => $gv) {

                $denom[$contDenm] = NomTipoPago::obtenerDenominacion($gv);
                $contDenm++;
            }
        }
        return $denom;
    }

    public function Guardar($idpagoporresultado)
    {
        $objConfpagosporresultados = ConfPagosporresultado::getByid($idpagoporresultado);
        $objConfpagosporresultados->estado = 2;
        $objConfpagosporresultados->save();
        return true;
    }

    public function Desaprobar($idpagoporresultado)
    {
        $objConfpagosporresultados = ConfPagosporresultado::getByid($idpagoporresultado);
        $objConfpagosporresultados->estado = 1;
        $objConfpagosporresultados->save();
        return true;
    }

    public function DelTiposdepagos($idpagoporresultado)
    {
        foreach ($idpagoporresultado as $k => $v) {
            $objConfpagosporresultados = ConfPagosporresultado:: getByid($v['idpagoporresultado']);
            $objConfpagosporresultados->delete();
                         
            $delete = ConfIndicadorespagosporresultados::eliminarIndicadoresCampoNominaXidPagosPorResultado($v['idpagoporresultado']);
        }
        return true;
    }

    public function ObtenerCargosapagosporresultados($idestructura, $idpagoporresultado, $inicio = 0, $limite = 10)
    {
        $cont = 0;
        foreach ($idpagoporresultado as $k => $v) {
            $arrayArea = ConfCargospagosporresultados::ObtenerCargosapagosporresultados($v['idpagoporresultado'], $idestructura);
            foreach ($arrayArea as $key => $val) {
                if(!empty($this->integrator->metadatos->DameEstructura($val['idcargo'])[0]->denominacion)){
                    $arrayAreaFinal[$cont] = $val;
                    $arrayAreaFinal[$cont]['denominacion'] = $val['area'] . ' - ' . $this->integrator->metadatos->DameEstructura($val['idcargo'])[0]->denominacion;
                    $cont++;
                }
            }
        }
        return $arrayAreaFinal;
    }

    public function AddCargosapagosporresultados($idcargo, $idpagoporresultado)
    {
        foreach ($idpagoporresultado as $key => $val) {
            foreach ($idcargo as $k => $v) {
                $arraycrgospagos = ConfCargospagosporresultados::ObtenercargosdadoIdcargoyIdpago($v['idcargo'], $val['idpagoporresultado'], $v['idarea']);
                if (count($arraycrgospagos) == 0) {
                    $objConfcargospagosporresultados = new ConfCargospagosporresultados();
                    $objConfcargospagosporresultados->idcargo = $v['idcargo'];
                    $objConfcargospagosporresultados->idarea = $v['idarea'];
                    $objConfcargospagosporresultados->idpagoporresultado = $val['idpagoporresultado'];
                    $objConfcargospagosporresultados->save();
                }
            }
        }
        return true;
    }

    public function DelCargosapagosporresultados($idcargopagoresultado)
    {
        foreach ($idcargopagoresultado as $k => $v) {
            $objConfcargospagosporresultados = ConfCargospagosporresultados::getByid($v['idcargopagoresultado']);
            $objConfcargospagosporresultados->delete();
        }
        return true;
    }

    public function ObtenerIndicadorespagosporresultadosid($idpagoporresultado)
    {
        foreach ($idpagoporresultado as $k => $v) {
            $arrayIndicadores = ConfIndicadorespagosporresultados::ObtenerIndicadorespagosporresultadosid($v['idpagoporresultado']);
            if (count($arrayIndicadores) > 0) {
                foreach ($arrayIndicadores as $key => $val) {
                    $arrayIndicadores[$key]['entrada'] = ($val['idreporteentrada']) ? ConfVariablesReportesCertificaciones::
                        obtenerDenomReporteXIdVarConfReportesCert($val['idreporteentrada'])[0]['denominacion'] . ' : ' .
                        ConfVariablesReportesCertificaciones::DevolverDenomDadoid($val['idreporteentrada']) : '';

                    $arrayIndicadores[$key]['salida'] = ($val['idreportesalida']) ? ConfVariablesReportesCertificaciones::
                        obtenerDenomReporteXIdVarConfReportesCert($val['idreportesalida'])[0]['denominacion'] . ' : ' .
                        ConfVariablesReportesCertificaciones::DevolverDenomDadoid($val['idreportesalida']) : '';

                    $arrayIndicadores[$key]['denomcampoestmodnom'] = (!empty($val['idestructuramodelonomina'])) ?
                        ConfigEstructurarModelosNomina::obtenerDenomXId($val['idestructuramodelonomina']) : '';

                    $arrayIndicadores[$key]['denomtiponominacampo'] = (!empty($val['idestructuramodelonomina'])) ?
                        ConfigEstructurarModelosNomina::obtenerDenominacionTipoNomina($val['idestructuramodelonomina']) . ' : ' . $arrayIndicadores[$key]['denomcampoestmodnom'] : '';

                }
            }
        }

        return $arrayIndicadores;
    }

    public function AddIndicadorespagosporresultados($denominacion, $idpagoporresultado, $tipovalor, $idreporteentrada, $idreportesalida, $idestructuramodelonomina, $lugaresdecimales, $obligatorio, $recalculable, $resultadofinal, $sumadestajo)
    {
        $existe = ConfIndicadorespagosporresultados::findByIdOrDenom($denominacion, $idpagoporresultado[0]['idpagoporresultado']);
        if (!$existe) {
            foreach ($idpagoporresultado as $k => $v) {
                $objConfIndicadorespagosporresultados = new ConfIndicadorespagosporresultados();
                $objConfIndicadorespagosporresultados->denominacion = $denominacion;
                $objConfIndicadorespagosporresultados->idreporteentrada = ($idreporteentrada) ? $idreporteentrada : null;
                $orden = ConfIndicadorespagosporresultados::ObtenerMaxOrden($v['idpagoporresultado'])[0]['max'];
                $objConfIndicadorespagosporresultados->idreportesalida = $idreportesalida;
                $objConfIndicadorespagosporresultados->orden = $orden + 1;
                $objConfIndicadorespagosporresultados->idpagoporresultado = $v['idpagoporresultado'];
                $objConfIndicadorespagosporresultados->tipovalor = $tipovalor;
                $objConfIndicadorespagosporresultados->idestructuramodelonomina = $idestructuramodelonomina;
                $objConfIndicadorespagosporresultados->lugaresdecimales = $lugaresdecimales;
                $objConfIndicadorespagosporresultados->obligatorio = $obligatorio;
                $objConfIndicadorespagosporresultados->recalculable = $recalculable;
                $objConfIndicadorespagosporresultados->resultadofinal = $resultadofinal;
                $objConfIndicadorespagosporresultados->sumadestajo = $sumadestajo;
                $objConfIndicadorespagosporresultados->save();
            }
            return true;
        } else {
            return false;
        }
        return true;
    }

    public function ModIndicadorespagosporresultados($idindicadorespagoresultado, $denominacion, $idpagoporresultado, $tipovalor, $idreporteentrada, $idreportesalida, $idestructuramodelonomina, $lugaresdecimales, $obligatorio, $recalculable, $resultadofinal, $sumadestajo)
    {
        $existe = ConfIndicadorespagosporresultados::findByIdOrDenom($denominacion, $idpagoporresultado[0]['idpagoporresultado']);
        if (!$existe || $existe[0]['idindicadorespagoresultado'] == $idindicadorespagoresultado) {
            $objConfIndicadorespagosporresultados = ConfIndicadorespagosporresultados::getByid($idindicadorespagoresultado);
            $objConfIndicadorespagosporresultados->denominacion = $denominacion;
            $objConfIndicadorespagosporresultados->idreporteentrada = ($tipovalor == 2) ? $idreporteentrada : null;
            $objConfIndicadorespagosporresultados->idreportesalida = $idreportesalida;
            $objConfIndicadorespagosporresultados->idpagoporresultado = $idpagoporresultado[0]['idpagoporresultado'];
            $objConfIndicadorespagosporresultados->tipovalor = $tipovalor;
            $objConfIndicadorespagosporresultados->idestructuramodelonomina = $idestructuramodelonomina;
            $objConfIndicadorespagosporresultados->lugaresdecimales = $lugaresdecimales;
            $objConfIndicadorespagosporresultados->obligatorio = $obligatorio;
            $objConfIndicadorespagosporresultados->recalculable = $recalculable;
            $objConfIndicadorespagosporresultados->resultadofinal = $resultadofinal;
            $objConfIndicadorespagosporresultados->sumadestajo = $sumadestajo;
            $objConfIndicadorespagosporresultados->save();
            return true;
        } else {
            return false;
        }
    }

    public function DelIndicadorespagosporresultados($idindicadorespagoresultado)
    {
        foreach ($idindicadorespagoresultado as $k => $v) {
            $objConfIndicadorespagosporresultados = ConfIndicadorespagosporresultados:: getByid($v['idindicadorespagoresultado']);
            $Arrayorden = ConfIndicadorespagosporresultados::Ordenar($objConfIndicadorespagosporresultados->orden);
            $objConfIndicadorespagosporresultados->delete();
        }
        return true;
    }

    public function OrdenarASc($idindicadorespagoporresultado, $id)
    {
        $objConfIndicadorespagosporresultados = ConfIndicadorespagosporresultados:: getByid($idindicadorespagoporresultado);
        $Arrayorden = ConfIndicadorespagosporresultados::OrdenarASc($objConfIndicadorespagosporresultados->orden, $id);
        $valor = $objConfIndicadorespagosporresultados->orden - 1;
        $objConfIndicadorespagosporresultados->orden = $valor;
        $objConfIndicadorespagosporresultados->save();
        // $Arrayorden = ConfIndicadorespagosporresultados::OrdenarDes($valor);
        return true;
    }

    public function OrdenarDes($idindicadorespagoporresultado, $id)
    {
        $objConfIndicadorespagosporresultados = ConfIndicadorespagosporresultados:: getByid($idindicadorespagoporresultado);
        $Arrayorden = ConfIndicadorespagosporresultados::OrdenarDes($objConfIndicadorespagosporresultados->orden, $id);
        $valor = $objConfIndicadorespagosporresultados->orden + 1;
        $objConfIndicadorespagosporresultados->orden = $valor;
        $objConfIndicadorespagosporresultados->save();
        return true;
    }

    public function obtenerCamposNominas($identidad)
    {
        return ConfPagosporresultado::cargarTiposDeNominas($identidad);
    }
}