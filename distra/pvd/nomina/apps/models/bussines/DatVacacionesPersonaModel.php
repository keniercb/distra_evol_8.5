<?php

/**
 * Modelo de negocio para gestionar los datos generales del submayor de vacaciones.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Submayor.
 * @category Modelo de negocio
 * @uses DatVacacionesPersona, Entidad vacaciones de persona(Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class DatVacacionesPersonaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function DatVacacionesPersonaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener los datos generales de las vacaciones de una persona.
     *
     * @param int $idpersona Identificador de la persona.
     * @param int $identidad Identificador de la entidad.
     *
     * @return array de datos de las vacaciones de una persona.
     */
    public function obtenerDatosGeneralesVacacionesPersona($idpersona, $identidad)
    {
        //Retornando los datos de las vacaciones de una persona.
        return DatVacacionesPersona::obtenerDatosVacacionesPersona($idpersona, $identidad);
    }

    /**
     * Insertar datos de vacaciones a una persona.
     *
     * @param int $idpersona Identificador de la persona.
     * @param int $identidad Identificador de la entidad.
     * @param int $tiempacuminci Tiempo acumulado inicial.
     * @param int $saldoacuminci Saldo acumulado inicial.
     * @param date $finicio Fecha de inicio.
     * @param date $ffin Fecha de fin.
     */
    public function adicionarDatosVacacionesPersona($idpersona, $identidad, $tiempacuminci, $saldoacuminci, $finicio, $ffin, $idvacacionespersona)
    {

        //Se crea el objeto de los datos de vacaciones de la persona.
        $objVacPer = new DatVacacionesPersona();

        $r = $objVacPer->obtenerObjVacacionesPersonaDadoId($idvacacionespersona);

        if (!$r) {
            //Insertando los datos.
            $objVacPer->idpersona = $idpersona;
            $objVacPer->identidad = $identidad;
            $objVacPer->tiempoacumuladoinicial = $tiempacuminci;
            $objVacPer->importeacumuladoinicial = $saldoacuminci;
            $fecha = split('/', $finicio);
            $objVacPer->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
            $fecha = split('/', $ffin);
            $objVacPer->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
    
            //Guardando los datos.
            $objVacPer->save();

            return 1;
        }else {
            return 2;
        }

    }

    /**
     * Modificar datos de vacaciones a una persona.
     *
     * @param int $idvacperson Identificador de las vacaciones persona.
     * @param int $idpersona Identificador de la persona.
     * @param int $identidad Identificador de la entidad.
     * @param int $tiempacuminci Tiempo acumulado inicial.
     * @param int $saldoacuminci Saldo acumulado inicial.
     * @param date $finicio Fecha de inicio.
     * @param date $ffin Fecha de fin.
     */
    public function modificarDatosVacacionesPersona($idvacperson, $idpersona, $identidad, $tiempacuminci, $saldoacuminci, $finicio, $ffin)
    {

        //Obteniendo los datos de vacaciones de la persona a modificar.
        $objVacPer = DatVacacionesPersona::obtenerObjVacacionesPersonaDadoId($idvacperson);

        //Modificando los datos.
        $objVacPer->idpersona = $idpersona;
        $objVacPer->identidad = $identidad;
        $objVacPer->tiempoacumuladoinicial = $tiempacuminci;
        $objVacPer->importeacumuladoinicial = $saldoacuminci;
        $fecha = split('/', $finicio);
        $objVacPer->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $fecha = split('/', $ffin);
        $objVacPer->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;

        //Guardando los datos.
        $objVacPer->save();
    }

    /**
     * Eliminar una datos de vacaciones de una persona.
     *
     * @param int $idvacperson Identificador de las vacaciones persona.
     */
    public function eliminarDatosVacacionesPersona($idvacperson)
    {

        //Obteniendo los datos de vacaciones de la persona a eliminar.
        $objVacPer = DatVacacionesPersona::obtenerObjVacacionesPersonaDadoId($idvacperson);

        //Borrando los datos de vacaciones de una persona.
        $objVacPer->delete();
    }

    /**
     * Obtener las variables para la acum/liq de vacaciones.
     *
     * @return array de datos de las variables.
     */
    public function obtenerVariablesAcumLiq()
    {
        return DatVacacionesVariables::obtenerTodasVariables();
    }

    //Funcion para acumular y liquidar en el submayor

    /**
     * @author Ing. Frank Rodriguez Berroa
     * @param $idnomina
     * @param $camposregistrosalario
     */
    public function acumularLiquidarSubmayorVacaciones($idelaborarpago, $idtiponomina, $acumulaliquida, $identidad, $nominaactualizada)
    {
        //Objs de las clases
        $return = new stdClass();
        $objEstructurarModelo = new ConfigEstructurarModelosNomina();
        $objDatNominaDatos = new DatNominaDatos();
        $objDatNomina = new DatNomina();
        $objDatVacacionesPersona = new DatVacacionesPersona();

        //Si tiene nominas aprobados
        $datosnomina = $objDatNominaDatos->obtenerDatosNominaPorElaborarPago($idelaborarpago);
        if (count($datosnomina) > 0) {
            $campoacumulaliquidadias = 0;
            $campoacumulaliquidaimporte = 0;
            //Verificar si la nomina acumula o liquida
            if ($nominaactualizada == 1) {
                $campoacumulaliquidadias = $objEstructurarModelo->obtenerCampoLiquidacionDias($idtiponomina, $identidad);
                $campoacumulaliquidaimporte = $objEstructurarModelo->obtenerCampoLiquidadcionImporte($idtiponomina, $identidad);
            } else {
                $campoacumulaliquidadias = $objEstructurarModelo->obtenerCampoAcumulacionLiquidadcionDias($idtiponomina, $identidad);
                $campoacumulaliquidaimporte = $objEstructurarModelo->obtenerCampoAcumulacionLiquidadcionImporte($idtiponomina, $identidad);
            }
            //Si la nomina acumula o liquida y tiene configurado los campos
            if ($acumulaliquida != 3) {
                if ($campoacumulaliquidaimporte != null) {
                    //Validando que en submayor no exstan personas sin carga inicial
                    /*$validarcargainicial = $objDatVacacionesPersona->validarExisteCargaInicial($datosnomina, $identidad);
                    if($nominaactualizada == 0){
                        if (count($validarcargainicial->arrpersonassinvacacione) > 0) {
                            $return->codigo = 3;
                            $return->texto = 'Las siguientes personas: <b>' . $validarcargainicial->textonombre . '</b> no tienen una carga inicial en días e importe en el submayor de vacaciones.';
                            $objDatNomina->desaprobarNominas($idelaborarpago);
                            return $return;
                        }
                    }*/

                    //Recorriendo las nominas para salvar en el submayor
                    foreach ($datosnomina as $idn => $rdn) {
                        $idnomina = $rdn['idnomina'];
                        $valores = unserialize($rdn['valores']);
                        $arrAcumuladoVac = array();
                        $cont = 0;
                        $acumulada = DatNomina::obtenerNominaAcumulada($idnomina);
                        //if ($acumulada == 0) {
                        //Recorriendo los valores de las personas en las nominas para salvar en el submayor
                        foreach ($valores as $iv => $rv) {
                            $rexplode = explode('-', $rv['id']);
                            $idpersona = $rexplode[0];
                            $rpersona[0]['idpersona'] = $idpersona;
                            //Si la persona es alta en el submayor y ademas tiene carga inicial
                            //if(!array_key_exists($idpersona, $validarcargainicial->arrpersonassinaddsumbayor)){
                            //Valores de la acumulacion en dias e importe
                            $acumulacionliquidaciondias = $rv["c$campoacumulaliquidadias"];
                            $acumulacionliquidacionimporte = $rv["c$campoacumulaliquidaimporte"];
                            $vacacionespersona = $objDatVacacionesPersona->obtenerPersonasSubMayorVacaciones($identidad, $rpersona);
                            $vac = $vacacionespersona[$idpersona][0];
                            //Array para salvar
                            if ($vac->idvacacionespersona) {
                                if (($acumulacionliquidaciondias != 0 && $acumulacionliquidacionimporte != 0)) {
                                    $arrAcumuladoVac[$cont]['idpersona'] = $idpersona;
                                    $arrAcumuladoVac[$cont]['idvacacionespersona'] = $vac->idvacacionespersona;
                                    $arrAcumuladoVac[$cont]['tiempoacumulado'] = ($acumulacionliquidaciondias) ? $acumulacionliquidaciondias : 0;
                                    $arrAcumuladoVac[$cont]['importeacumulado'] = ($acumulacionliquidacionimporte) ? $acumulacionliquidacionimporte : 0;
                                    $arrAcumuladoVac[$cont]['saldoentiempo'] = $vac->tiempo;
                                    $arrAcumuladoVac[$cont]['saldoenimporte'] = $vac->importe;
                                    $arrAcumuladoVac[$cont]['tiempoacumuladoinicial'] = $vac->tiempoacumuladoinicial;
                                    $arrAcumuladoVac[$cont]['importeacumuladoinicial'] = $vac->importeacumuladoinicial;
                                    $cont++;
                                }
                            }
                            //Poniendo la nomina en estado de acumulada
                            $datNomina = Doctrine::getTable('DatNomina')->find($idnomina);
                            $datNomina->acumulada = 1;
                            $datNomina->save();
                            //}
                        }
                        //}
                        //Operacion es de acumulacion
                        $operacion = 1;
                        //Ahora, si la nomina liquida
                        if ($acumulaliquida == 1) {
                            $operacion = 1;
                        } else if ($acumulaliquida == 2) {
                            $operacion = 2;
                        }
                        if ($acumulaliquida == 4) {
                            if ($nominaactualizada == 1) {
                                $operacion = 2;
                            } else {
                                $operacion = 1;
                            }
                        }
                        $objHisVacModel = new HisVacacionesPersonaModel();
                        $objHisVacModel->Adicionar($arrAcumuladoVac, $idnomina, date('Y-m-d'), $operacion);
                    }
                    $return->codigo = 1;
                    $return->texto = 'Las nóminas fueron acumuladas/liquidadas satisfactoriamente';
                    return $return;
                } else {
                    $return->codigo = 3;
                    $return->texto = 'Las nóminas que desea acumular/liquidar no tienen configurados los campos que acumulan/liquidan en importe.';
                    $objDatNomina->desaprobarNominas($idelaborarpago);
                    return $return;
                }

            } else {
                $return->codigo = -1;
                $return->texto = 'Las nóminas ni acumulan ni liquidan vacaciones';
                return $return;
            }
            //Si no tiene nominas aprobadas
        } else {
            $return->codigo = 3;
            $return->texto = 'Las nóminas que desea acumular/liquidar no tienen datos.';
            $objDatNomina->desaprobarNominas($idelaborarpago);
            return $return;
        }
    }

    /* Realiza las operaciones de acumulación y liquidación del submayor de vacaciones */

    public function acumulacionLiquidacionVacaciones(&$personas, &$vacacionespersona, $operacion, $camposacumulanliquidan, &$valoresnomina, $periodovacaciones, $nominaactualizada = null, $autoSave = true)
    {
        $operacionsubm = $operacion;
        $tiempoMaximoAcumular = 100.00;
        // Arreglo de salida para el caso de $autoSave = false
        $hisVacacionesPersona = new stdClass();
        $hisVacacionesPersona->listado = array();
        $hisVacacionesPersona->codigo = 'OK';
        // FIXME: Estos objetos se llenaban de datos y no se utilizaban
        $v =  array('saldoentiempo' => '');
        $obj = new stdClass();

        foreach ($personas as $p) {
            /* Busco los valores que se van a acumular o liquidar */
            $valAcumLiq = array();
            foreach ($valoresnomina as $vn) {
                if ($operacion == 1 || $operacion == 2) {
                    if (($vn['idpersona'] == $p['idpersona']) && ($vn['idcargosocupados'] == $p['idcargosocupados'])) {
                        $valAcumLiq = array(1 => $vn["c" . $camposacumulanliquidan[1]['idestructuramodelodomina']], 2 => $vn["c" . $camposacumulanliquidan[2]['idestructuramodelodomina']]);
                    }
                } else if ($operacion == 4 && $nominaactualizada == 0) {
                    if (($vn['idpersona'] == $p['idpersona']) && ($vn['idcargosocupados'] == $p['idcargosocupados'])) {
                        $valAcumLiq = array(1 => $vn["c" . $camposacumulanliquidan[1]['idestructuramodelodomina']], 2 => $vn["c" . $camposacumulanliquidan[2]['idestructuramodelodomina']]);
                    }
                } else if ($operacion == 4 && $nominaactualizada == 1) {
                    if (($vn['idpersona'] == $p['idpersona']) && ($vn['idcargosocupados'] == $p['idcargosocupados'])) {
                        $valAcumLiq = array(1 => $vn["c" . $camposacumulanliquidan[3]['idestructuramodelodomina']], 2 => $vn["c" . $camposacumulanliquidan[4]['idestructuramodelodomina']]);
                    }
                }

            }
            /*Ultima operacion del submayor de la persona*/
            $personaSM = $vacacionespersona[$p['idpersona']];


            $tiempoacumulado = $valAcumLiq[1];
            $importeacumulado = $valAcumLiq[2];
            $saldoentiempo = 0.00;
            $saldoenimporte = 0.00;
            if ($operacion == 1)/* Acumulacion */ {
                //print_r('sas');die;
                if (empty($personaSM['fechaoperacion'])) {
                    $saldoentiempo = $personaSM['tiempoacumuladoinicial'] + $tiempoacumulado;
                    $saldoenimporte = $personaSM['importeacumuladoinicial'] + $importeacumulado;
                } else {
                    $saldoentiempo = $personaSM['saldoentiempo'] + $tiempoacumulado;
                    $saldoenimporte = $personaSM['saldoenimporte'] + $importeacumulado;
                    //if($p['idpersona'] == 6){print_r(array($personaSM['saldoenimporte'], $importeacumulado));die;}
                }

                /*Valido que el saldo en tiempo no se pase de lo establecido por la ley: 24 dias*/
                if ($saldoentiempo >= $tiempoMaximoAcumular) {
                    if ($v['saldoentiempo'] == $tiempoMaximoAcumular) {
                        $tiempoacumulado = 0.00;
                    } else {
                        $saldoentiempo = $tiempoMaximoAcumular;
                        $obj->tiempoacumulado = $tiempoMaximoAcumular - $personaSM['saldoentiempo'];
                    }
                }
                $operacionsubm = 1;

            } else if ($nominaactualizada == 0 && $operacion == 4)/* Acumulacion */ {
                if (empty($personaSM['fechaoperacion'])) {
                    $saldoentiempo = $personaSM['tiempoacumuladoinicial'] + $tiempoacumulado;
                    $saldoenimporte = $personaSM['importeacumuladoinicial'] + $importeacumulado;
                } else {
                    $saldoentiempo = $personaSM['saldoentiempo'] + $tiempoacumulado;
                    $saldoenimporte = $personaSM['saldoenimporte'] + $importeacumulado;
                }

                /*Valido que el saldo en tiempo no se pase de lo establecido por la ley: 24 dias*/
                if ($saldoentiempo >= $tiempoMaximoAcumular) {
                    if ($v['saldoentiempo'] == $tiempoMaximoAcumular) {
                        $tiempoacumulado = 0.00;
                    } else {
                        $saldoentiempo = $tiempoMaximoAcumular;
                        $obj->tiempoacumulado = $tiempoMaximoAcumular - $personaSM['saldoentiempo'];
                    }
                }
                $operacionsubm = 1;

            } else if ($operacion == 2)/*Liquidacion*/ {
                if (empty($personaSM['fechaoperacion'])) {
                    $saldoentiempo = $personaSM['tiempoacumuladoinicial'] - $tiempoacumulado;
                    $saldoenimporte = $personaSM['importeacumuladoinicial'] - $importeacumulado;
                } else {
                    $saldoentiempo = $personaSM['saldoentiempo'] - $tiempoacumulado;
                    $saldoenimporte = $personaSM['saldoenimporte'] - $importeacumulado;
                }
                $operacionsubm = 2;
            } else if ($nominaactualizada == 1 && $operacion == 4)/*Liquidacion*/ {
                if (empty($personaSM['fechaoperacion'])) {
                    $saldoentiempo = $personaSM['tiempoacumuladoinicial'] - $tiempoacumulado;
                    $saldoenimporte = $personaSM['importeacumuladoinicial'] - $importeacumulado;
                } else {
                    $saldoentiempo = $personaSM['saldoentiempo'] - $tiempoacumulado;
                    $saldoenimporte = $personaSM['saldoenimporte'] - $importeacumulado;
                }

                /*Valido que no se ponga negativo el saldo*/
                $saldoentiempo = $saldoentiempo > 0 ? $saldoentiempo : 0;
                $saldoenimporte = $saldoenimporte > 0 ? $saldoenimporte : 0;
                $operacionsubm = 2;
            }

            $objHSV = new HisVacacionesPersona();
            $objHSV->idnomina = $p['idnomina'];
            $objHSV->tipooperacion = $operacionsubm;
            $objHSV->fechaoperacion = date("d-m-Y");
            $objHSV->idvacacionespersona = $personaSM['idvacacionespersona'];
            $objHSV->tiempoacumulado = (!empty($tiempoacumulado)) ? $tiempoacumulado : 0;
            $objHSV->importeacumulado = (!empty($importeacumulado)) ? $importeacumulado : 0;
            $objHSV->saldoentiempo = $saldoentiempo;
            $objHSV->saldoenimporte = $saldoenimporte;
            $objHSV->periodo = $periodovacaciones;
            if($autoSave)
                $objHSV->save();
            else
                $hisVacacionesPersona->listado[] = $objHSV;
        }
        return $hisVacacionesPersona;
    }

    /* Busca dentro de los datos de la nomina los valores de los campos que acumular o liquidan en dias e importe */

    private function buscarValoresAcumLiqSubmayor(&$valoresnomina, &$camposacumulanliquidan, $idpersona, $operacion, $nominaactualizada)
    {
        /*foreach ($valoresnomina as $vn) {
            if($operacion == 1 || $operacion == 2){
                if ($vn['idpersona'] == $idpersona) {
                    return array(1 => $vn["c" . $camposacumulanliquidan[1]['idestructuramodelodomina']], 2 => $vn["c" . $camposacumulanliquidan[2]['idestructuramodelodomina']]);
                }
            }else if($operacion == 4 && $nominaactualizada == 0){
                if ($vn['idpersona'] == $idpersona) {
                    return array(1 => $vn["c" . $camposacumulanliquidan[1]['idestructuramodelodomina']], 2 => $vn["c" . $camposacumulanliquidan[2]['idestructuramodelodomina']]);
                }
            }else if($operacion == 4 && $nominaactualizada == 1){
                if ($vn['idpersona'] == $idpersona) {
                    return array(1 => $vn["c" . $camposacumulanliquidan[3]['idestructuramodelodomina']], 2 => $vn["c" . $camposacumulanliquidan[4]['idestructuramodelodomina']]);
                }
            }

        }*/
        //return array();
    }

    public function buscarCamposVacaciones($valoresnomina, $camposacumulanliquidan, $idpersona, $operacion, $nominaactualizada)
    {
        print_r($camposacumulanliquidan . '-' . $idpersona . '-' . $operacion . '-' . $nominaactualizada . '-' . $valoresnomina);
        die;
    }

    public function buscarsaldosVacacionesPersonas($identidad, $arraypersonas)
    {

        $objHisVacaciones = new HisVacacionesPersonaModel();
        $arrayvacpersonas = array();
        $cont = 0;
        //Recorriendo las personas con los dias habiles a disfrutar
        foreach ($arraypersonas as $rpersonas) {
            $diashabiles = $rpersonas['diashabiles'];
            $idpersona = $rpersonas['idpersona'];
            //Saldo en tiempo e importe de la persona en la entidad
            $diasacumulados = $objHisVacaciones->calcularDiasAcumulados($idpersona, $identidad);
            $importeacumulado = $objHisVacaciones->calcularImporteAcumulado($idpersona, $identidad);
            $arrayvacpersonas[$cont]['idpersona'] = $idpersona;
            $arrayvacpersonas[$cont]['diashabiles'] = $diashabiles;
            $arrayvacpersonas[$cont]['diasacumulados'] = $diasacumulados;
            $arrayvacpersonas[$cont]['importeacumulado'] = $importeacumulado;
            //Si le dan los dias a disfrutar se calcula el saldo en tiempo e importe
            if ($diasacumulados >= $diashabiles) {
                $arrayvacpersonas[$cont]['importecobrar'] = number_format(($importeacumulado / $diasacumulados * $diashabiles), 4, '.', '');
                $arrayvacpersonas[$cont]['saldotiempo'] = number_format($diasacumulados - $diashabiles, 4, '.', '');
                $arrayvacpersonas[$cont]['saldoimporte'] = number_format($importeacumulado - $arrayvacpersonas[$cont]['importecobrar'], 4, '.', '');
                $arrayvacpersonas[$cont]['tienesaldo'] = true;
                //Si no le dan los dias se devuelve como saldo el actual
            } else {
                $arrayvacpersonas[$cont]['importecobrar'] = 0.00;
                $arrayvacpersonas[$cont]['saldotiempo'] = $diasacumulados;
                $arrayvacpersonas[$cont]['saldoimporte'] = $importeacumulado;
                $arrayvacpersonas[$cont]['tienesaldo'] = false;
            }
            $cont++;
        }

        return $arrayvacpersonas;
    }

    /* Realiza las operaciones de acumulación y liquidación del submayor de vacaciones */

    public function validarPersonasSaldoLiquidacionVacaciones(&$personas, &$vacacionespersona, $operacion, $camposacumulanliquidan, &$valoresnomina, $periodovacaciones)
    {
        $operacionsubm = $operacion;
        $tiempoMaximoAcumular = 100.00;
        // Arreglo de salida para el caso de $autoSave = false
        $hisVacacionesPersona = new stdClass();
        $hisVacacionesPersona->listado = array();
        $hisVacacionesPersona->codigo = 'OK';
        // FIXME: Estos objetos se llenaban de datos y no se utilizaban
        $v =  array('saldoentiempo' => '');
        $obj = new stdClass();

        foreach ($personas as $p) {
            /* Busco los valores que se van a acumular o liquidar */
            $valAcumLiq = array();
            foreach ($valoresnomina as $vn) {
                if (($vn['idpersona'] == $p['idpersona']) && ($vn['idcargosocupados'] == $p['idcargosocupados'])) {
                    $valAcumLiq = array(1 => $vn["c" . $camposacumulanliquidan[1]['idestructuramodelodomina']], 2 => $vn["c" . $camposacumulanliquidan[2]['idestructuramodelodomina']]);
                }
            }
            /*Ultima operacion del submayor de la persona*/
            $personaSM = $vacacionespersona[$p['idpersona']];

            $tiempoacumulado = $valAcumLiq[1];
            $importeacumulado = $valAcumLiq[2];
            $saldoentiempo = 0.00;
            $saldoenimporte = 0.00;

            if (empty($personaSM['fechaoperacion'])) {
                $saldoentiempo = $personaSM['tiempoacumuladoinicial'] - $tiempoacumulado;
                $saldoenimporte = $personaSM['importeacumuladoinicial'] - $importeacumulado;
            } else {
                $saldoentiempo = $personaSM['saldoentiempo'] - $tiempoacumulado;
                $saldoenimporte = $personaSM['saldoenimporte'] - $importeacumulado;
            }

            //Validando que no se ponga negativo el saldo
            if ($saldoentiempo < 0 || $saldoenimporte < 0) {
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($personaSM['idpersona'], null, null, null, null, null, null);
                $r = new stdClass();
                $r->codigo = 'NO-SALDO-NEGATIVO';
                $r->persona = $persona->data[0]['nombreapellidos'];
                return $r;
            }

        }
        return 'ok';

    }

}
