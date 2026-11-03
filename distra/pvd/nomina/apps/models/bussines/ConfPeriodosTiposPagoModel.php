<?php

class ConfPeriodosTiposPagoModel extends ZendExt_Model
{

    public function ConfPeriodoPagoModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerListadoFechas($identidad, $idtipopago, $idperiodopago)
    {
        return ConfPeriodosTiposPago::obtenerListadoFechas($identidad, $idtipopago, $idperiodopago);
    }

    public function obtenerListadoFechasArrayTipoPago($identidad, $idtipopago, $idperiodopago)
    {
        $r = array();
        $objConf = new ConfPeriodosTiposPago();
        foreach ($idtipopago as $tipopago) {
            $r[$tipopago] = $objConf->obtenerListadoFechas($identidad, $tipopago, $idperiodopago);
        }
        return $r;
    }

    public function adicionarPeriodosPagos($identidad, $idtipopago, $idperiodopago, $fechainicio, $fechafin)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $sql = "Select * FROM mod_nomina.nom_periodopago WHERE idperiodopago = ?;";
        $rperiodos = $conn->fetchAll($sql, array($idperiodopago));
        $tipoperiodo = $rperiodos[0]['tipoperiodo'];
        if (!empty($tipoperiodo)) {
            //Construyendo los periodos de fechas para el rango
            $mesinicial = explode('/', $fechainicio)[1];
            $annoinicial = explode('/', $fechainicio)[2];
            $mesfinal = explode('/', $fechafin)[1];
            $annofinal = explode('/', $fechafin)[2];
            $arrayperiodosfechas = array();
            switch ($tipoperiodo) {
                //Semanal
                case "1":
                    //return "NO-CONFIG-SEMANAL-PERIODO";
                    $arrayperiodosfechas[0]['fechainicio'] = $fechainicio;
                    $arrayperiodosfechas[0]['fechafin'] = $fechafin;
                    break;
                //Quincenal
                case "2":
                    //$arrayperiodosfechas = $this->construirPeriodoFechaMayorIgualMes($fechainicio, $fechafin, 24, "+2 weeks");
                    for ($i = $annoinicial; $i <= $annofinal; $i++) {
                        for ($j = 1; $j <= 12; $j++) {
                            if ($j >= $mesinicial && $i == $annoinicial) {  //Meses a partir del inicial hasta diciembre
                                $primerdia = "01";
                                $ultimodia = $this->getUltimoDiaPeriodo($tipoperiodo, $j, $i, $primerdia);
                                $arrayperiodosfechas[] = $this->construirPeriodoFechaMenorMes($primerdia, $ultimodia, $j, $i);
                                $primerdia = "16";
                                $ultimodia = $this->getUltimoDiaPeriodo($tipoperiodo, $j, $i, $primerdia);
                                $arrayperiodosfechas[] = $this->construirPeriodoFechaMenorMes($primerdia, $ultimodia, $j, $i);
                            }
                            if ($annoinicial < $i) {     //Todos los meses hasta el año final
                                $primerdia = "01";
                                $ultimodia = $this->getUltimoDiaPeriodo($tipoperiodo, $j, $i, $primerdia);
                                $arrayperiodosfechas[] = $this->construirPeriodoFechaMenorMes($primerdia, $ultimodia, $j, $i);
                                $primerdia = "16";
                                $ultimodia = $this->getUltimoDiaPeriodo($tipoperiodo, $j, $i, $primerdia);
                                $arrayperiodosfechas[] = $this->construirPeriodoFechaMenorMes($primerdia, $ultimodia, $j, $i);
                            }
                            if ($i == $annofinal && $j == $mesfinal) {
                                break;
                                break;
                            }
                        }
                    }
                    break;
                //Mensual
                case "3":
                    $arrayperiodosfechas = $this->construirPeriodoFechaMayorIgualMes($fechainicio, $fechafin, 12, "+1 months");
                    break;
                //Trimestral
                case "4":
                    $arrayperiodosfechas = $this->construirPeriodoFechaMayorIgualMes($fechainicio, $fechafin, 3, "+3 months");
                    break;
                //Semestral
                case "5":
                    $arrayperiodosfechas = $this->construirPeriodoFechaMayorIgualMes($fechainicio, $fechafin, 2, "+6 months");
                    break;
                //Anual
                case "6":
                    $arrayperiodosfechas = $this->construirPeriodoFechaMayorIgualMes($fechainicio, $fechafin, 1, "+12 months");
                    break;
                //Periodo Especifico
                default :
                    $arrayperiodosfechas[0]['fechainicio'] = $fechainicio;
                    $arrayperiodosfechas[0]['fechafin'] = $fechafin;
                    break;
            }

            foreach ($idtipopago as $tipopago) {
                //Guardando el nuevo periodo para ese tipo de pago y tipo de periodo
                $arrayperiodo = ConfPeriodosTiposPago::obtenerPeriodoExistente($identidad, $tipopago, $idperiodopago);
                $idperiodostipospagonuevo = $arrayperiodo[0]['idperiodostipospago'];
                if (empty($arrayperiodo)) {
                    //Guardando en ConfPeriodosTiposPago
                    $sql = "INSERT INTO mod_nomina.conf_periodostipospago(idestructura, idperiodopago, idtipopago)
              VALUES (?,?,?) returning idperiodostipospago;";
                    $r = $conn->fetchAll($sql, array($identidad, $idperiodopago, $tipopago));
                    $idperiodostipospagonuevo = $r[0]['idperiodostipospago'];

                }

                //Validando  cuando ya existe el rango de fechas
                $idperiodostipospago = (count($arrayperiodo) > 0) ? $arrayperiodo[0]['idperiodostipospago'] : -1;
                $arrayfechas = ($idperiodostipospago != -1) ? ConfDesglosePeriodos::obtenerTodasLasFechasXIdPeriodoPago($idperiodostipospago) : null;
                foreach ($arrayperiodosfechas as $periodo) {
                    //$objConfigDes = new ConfDesglosePeriodos();
                    if (!empty($arrayfechas)) {
                        foreach ($arrayfechas as $fecha) {
                            if ($fecha['fdesde'] == $periodo['fechainicio'] && $fecha['fhasta'] == $periodo['fechafin']) {
                                $sql = "DELETE FROM mod_nomina.conf_desgloseperiodos WHERE iddesgloseperiodos = ?;";
                                $conn->execute($sql, array($fecha['iddesgloseperiodos']));
                            }
                        }
                        if (count($arrayperiodo) > 0) {//Si existe el período de pago
                            //Salvando
                            $sql = "INSERT INTO mod_nomina.conf_desgloseperiodos(idperiodostipospago, fdesde, fhasta)
                      VALUES (?, ?, ?);";
                            $conn->execute($sql, array($idperiodostipospago, $periodo['fechainicio'], $periodo['fechafin']));
                        }
                    } else {//Si no existe el período de pago
                        $sql = "INSERT INTO mod_nomina.conf_desgloseperiodos(idperiodostipospago, fdesde, fhasta)
                      VALUES (?, ?, ?);";
                        $conn->execute($sql, array($idperiodostipospagonuevo, $periodo['fechainicio'], $periodo['fechafin']));
                    }
                }
            }
            $conn->commit();
            return count($arrayperiodosfechas);
        } else {
            return "NO-CONFIG-PERIODO";
        }
    }

    public function getUltimoDiaPeriodo($tipoperiodo, $mes, $anno, $diainicialperiodo = null)
    {
        $day = null;
        switch ($tipoperiodo) {
            //Semanal
            case "1":
                if ($diainicialperiodo == 1)
                    $day = 7;
                if ($diainicialperiodo == 8)
                    $day = 14;
                if ($diainicialperiodo == 15)
                    $day = 21;
                else
                    $day = date("d", (mktime(0, 0, 0, $mes + 1, 1, $anno) - 1));
                break;
            //Quincenal
            case "2":
                if ($diainicialperiodo == 1)
                    $day = 15;
                else
                    $day = date("d", (mktime(0, 0, 0, $mes + 1, 1, $anno) - 1));
                break;
            //Mensual
            case "3":
                $day = date("d", (mktime(0, 0, 0, $mes + 1, 1, $anno) - 1));
                break;
            //Trimestral
            case "4":
                $day = 1;
                break;
            //Semestral
            case "5":
                $day = 1;
                break;
            //Anual
            case "6":
                $day = 1;
                break;
            //Periodo Especifico
            default :
                $day = 1;
                break;
        }
        return $day;
    }

    public function construirPeriodoFechaMenorMes($primerdia, $ultimodia, $mes, $anno)

    {
        $objfdesde = date_create_from_format("d/m/Y", ($primerdia . "/" . $mes . "/" . $anno));
        $arrayfechas['fechainicio'] = $objfdesde->format('d/m/Y');

        $objfdesde = date_create_from_format("d/m/Y", ($ultimodia . "/" . $mes . "/" . $anno));
        $arrayfechas['fechafin'] = $objfdesde->format('d/m/Y');
        return $arrayfechas;
    }

    public function construirPeriodoFechaMayorIgualMes($fechainicio, $fechafin, $multiplo, $incrementomeses)
    {
        $arrayperiodosfechas = array();
        $annoinicial = explode('/', $fechainicio)[2];
        $annofinal = explode('/', $fechafin)[2];
        $cantidadannos = (($annofinal - $annoinicial) > 0) ? ($annofinal - $annoinicial) : 1;
        for ($i = 0; $i <= $cantidadannos * $multiplo; $i++) {
            list($diainicio, $mesinicio, $annoinicio) = explode('/', $fechainicio);
            $fecha = strtotime($incrementomeses, strtotime($annoinicio . $mesinicio . $diainicio));
            $newfechainicio = date("d/m/Y", $fecha);
            list($newdiafin, $newmesfin, $newannofin) = explode('/', $newfechainicio);
            $fecha = strtotime("-1 day", strtotime($newannofin . $newmesfin . $newdiafin));
            $newfechafin = date("d/m/Y", $fecha);
            $arrayperiodosfechas[] = array('fechainicio' => $fechainicio, 'fechafin' => $newfechafin);

            list($diafin, $mesfin, $annofin) = explode('/', $fechafin);
            if (strtotime($annofin . $mesfin . $diafin) < strtotime($newannofin . $newmesfin . $newdiafin))
                break;
            //Actualizando la nueva fecha de inicio
            $fechainicio = $newfechainicio;
        }
        return $arrayperiodosfechas;
    }

    public function modificarPeriodosPagos($idperiodostipospago, $iddesgloseperiodos, $fechainicio, $fechafin)
    {
        //Validando  cuando ya existe el rango de fechas
        $contfechaexistente = 0;

        //Tratando las fechas
        $objfdesde = date_create_from_format("d/m/Y", $fechainicio);
        $fdesde = $objfdesde->format('d/m/Y');
        $objfhasta = date_create_from_format("d/m/Y", $fechafin);
        $fhasta = $objfhasta->format('d/m/Y');
        $arrayfechas = ConfDesglosePeriodos::obtenerTodasLasFechasXIdPeriodoPago($idperiodostipospago);
        foreach ($arrayfechas as $fecha) {
            if ($fecha['fdesde'] == $fdesde && $fecha['fhasta'] == $fhasta) {
                $contfechaexistente++;
            }
        }

        if ($contfechaexistente > 0) {//Si existe el rango de fecha para este período de pago
            return 'EXISTE';
        } else {//Si no existe
            $obj = Doctrine::getTable('ConfDesglosePeriodos')->find($iddesgloseperiodos);
            $obj->fdesde = $fechainicio;
            $obj->fhasta = $fechafin;
            $obj->save();
            return 'MOD';
        }
    }

    public function eliminarPeriodosPagos($idperiodostipospago, $arrayiddesgloseperiodos)
    {
        foreach ($arrayiddesgloseperiodos as $v) {
            $objConfDesglosePeriodos = ConfDesglosePeriodos::obtenerFechasPeridosXIdDesglosePeriodos($v);
            $objConfDesglosePeriodos->delete();
        }

        $arrayfechasperiodos = ConfDesglosePeriodos::obtenerTodasLasFechasXIdPeriodoPago($idperiodostipospago);
        if (count($arrayfechasperiodos) == 0) {
            $objConfPeriodosTiposPago = ConfPeriodosTiposPago::obtenerFechasPeridosXIdPeriodosTiposPago($idperiodostipospago);
            $objConfPeriodosTiposPago->delete();
        }
        return 'DEL';
    }
}
