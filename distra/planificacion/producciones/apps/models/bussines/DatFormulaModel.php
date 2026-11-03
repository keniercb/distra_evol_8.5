<?php

class DatFormulaModel extends ZendExt_Model {

    public function getFormulasNutriModel($parametros) {
        $result = DatFormula::getFormulasNutri($parametros);
        return $result;
    }

    public function getAgrupaciones() {
        $result = DatFormula::getAgrupaciones();
        return $result;
    }

    public function adicionarFormulasNutricionales($params) {
        $result = DatFormula::adicionarFormulasNutricionales($params);
        return $result;
    }

    public function modificarFormulasNutricionalesNutricionales($params) {
        $result = DatFormula::modificarFormulasNutricionales($params);
        return $result;
    }

    public function getIndicadores($parametros) {
        $result = DatFormula::getIndicadores($parametros);
        return $result;
    }

    public function cambiarestadoFormulasNutricionales($params) {
        foreach ($params->arrayestadoformulas as $value) {
            if ($value->tipoporciento == 1 && $value->estado == 1) {
                //cambiamos el estilo
                $parametros->idformula = $value->idformula;
                $parametros->start = 0;
                $parametros->limit = 1000;
                $resultComponentes = self::listarComponentes($parametros);

                $porcientoTotal = 0;
                foreach ($resultComponentes->data as $valueComponente) {
                    if ($valueComponente['estado'] == 1) {
                        $porcientoTotal = $porcientoTotal + $valueComponente['porciento'];
                    }
                }
                if ($porcientoTotal == 100) {
                    $result = DatFormula::ActualizarEstado($value->idformula, $value->estado, $params->idusuario);
                } else {
                    $result = "negativo";
                }
            } else {
                $result = DatFormula::ActualizarEstado($value->idformula, $value->estado, $params->idusuario);
            }
        }
        return $result;
    }

    public function cambiarAsociacionFormulaActividad($parametros) {

        if ($parametros->accion == 'asociar') {
            $datosTC = DatFormula::obtenerIndTablaCaloricaDadoIdFormula($parametros->idformula);
            $ejercicio = $this->pIntegrator->planmeta->obtenerEjercicioActual();
            $idejercicioactual = $ejercicio['idejercicio'];
            foreach ($parametros->normadas as $value) {
                $parametros->idactividad = $value;
                DatFormula::crearRelacionActvFormula($parametros);
                DatFormula::eliminarRealacionNormaActividad($value);
                foreach ($datosTC as $valueInd) {
                    $parametros->idindicador = $valueInd['idindicador'];
                    $parametros->idactividad = $value;
                    $parametros->cantidadplanif = $valueInd['cantidad'];
                    $parametros->idejercicio = $idejercicioactual;
                    DatFormula::crearRealacionNormaActividad($parametros);
                }
            }
            foreach ($parametros->nonormadas as $value1) {
                $parametros->idactividad = $value1;
                DatFormula::crearRelacionActvFormula($parametros);
                foreach ($datosTC as $valueInd1) {
                    $parametros->idindicador = $valueInd1['idindicador'];
                    $parametros->idactividad = $value1;
                    $parametros->cantidadplanif = $valueInd1['cantidad'];
                    $parametros->idejercicio = $idejercicioactual;
                    DatFormula::crearRealacionNormaActividad($parametros);
                }
            }
        } else {
            $parametros->idactividad = implode(",", $parametros->actividadesdesa);
            DatFormula::eliminarRelacionActvFormula($parametros);
        }
        return true;
    }

    public function eliminarFormulasNutricionalesNutricionales($params) {
        $params->idformuladesg = implode(',', $params->idformula);
        $result = DatFormula::EliminarFormula($params);
        return $result;
    }

    public function getindicadoresTCFormula($parametros) {
        $resultado = DatFormula::getindicadoresTCFormula($parametros);
        $result->data = $resultado;
        $result->total = $resultado[0]['total'];
        return $result;
    }

    public function listarComponentes($parametros) {
        $resultado = DatFormula::listarComponentes($parametros);
        $result->data = $resultado;

        $importeTotal = 0;
        $kcaltotal = 0;
        $grasastotal = 0;
        $proteinastotal = 0;
        $carbohidratostotal = 0;
        foreach ($result->data as $key => $indicador) {
            $importeTotal += $indicador['importe'];
            $kcaltotal += $indicador['kcal'];
            $grasastotal += $indicador['grasas'];
            $proteinastotal += $indicador['proteinas'];
            $carbohidratostotal += $indicador['carbohidratos'];
        }

        $result->total = $resultado[0]['total'];
        $result->importeTotal = $importeTotal;
        $result->kcaltotal = $kcaltotal;
        $result->grasastotal = $grasastotal;
        $result->proteinastotal = $proteinastotal;
        $result->carbohidratostotal = $carbohidratostotal;
        return $result;
    }

    public function adicionarNormaAFormula($parametros) {
        $result = DatFormula::adicionarNormaAFormula($parametros);
        return $result;
    }

    public function eliminarNormaAFormula($parametros) {
        $parametros->arrayidtablacdesg = implode(',', $parametros->arrayidtablac);
        $result = DatFormula::eliminarNormaAFormula($parametros);
        return $result;
    }

    public function cargarIndicadorSalidad($parametros) {
        $result = DatFormula::cargarIndicadorSalidad($parametros);
        return $result;
    }

    public function listarActividades($parametros) {
        return DatFormula::listarActividades($parametros);
    }

    public function cargarUsuarios() {
        return DatFormula::cargarUsuarios();
    }

    public function comprobarActividad($parametros) {
        $datos->actividadesNoNormadas = [];
        $datos->normada = false;
        $cont = 0;
        $cont1 = 0;
        foreach ($parametros->idactividades as $value) {
            $result = DatFormula::comprobarActividad($value);
            if ($result[0]['count'] == 0) {
                $datos->actividadesNoNormadas[$cont] = $value;
                $cont++;
            } else {
                $datos->actividadesNormadas[$cont1] = $value;
                $datos->normada = true;
                $cont1++;
            }
        }
        return $datos;
    }

    public function mostrarAnalisiNutricional() {
        return DatFormula::mostrarAnalisiNutricional();
    }

}
