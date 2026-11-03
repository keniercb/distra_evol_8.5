<?php

class ConfGeneralModel extends ZendExt_Model
{

    public function ConfGeneralModel ()
    {
        parent::ZendExt_Model();
    }

    public function obtenerListadoFechas ($identidad, $idtipopago, $idperiodopago)
    {
        return ConfPeriodosTiposPago::obtenerListadoFechas($identidad, $idtipopago, $idperiodopago);
    }

    public function adicionarPeriodosPagos ($identidad, $idtipopago, $idperiodopago, $fechainicio, $fechafin)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();

        //Construyendo los periodos de fechas para el rango
        $mesinicial = explode('/', $fechainicio)[1];
        $annoinicial = explode('/', $fechainicio)[2];
        $mesfinal = explode('/', $fechafin)[1];
        $annofinal = explode('/', $fechafin)[2];
        $arrayperiodosfechas = array();
        if($idperiodopago == 7){//Tipo pago - mensual
            for($i = $annoinicial; $i <= $annofinal; $i++) {
                for($j = 1; $j <= 12; $j++) {
                    if($j >= $mesinicial && $i == $annoinicial){  //Meses a partir del inicial hasta diciembre
                        $ultimodia = $this->getUltimoDiaMes($j, $i);
                        $arrayperiodosfechas[] = $this->construirPeriodoFechas('01', $ultimodia, $j, $i);
                    }
                    if($annoinicial < $i){     //Todos los meses hasta el año final
                        $ultimodia = $this->getUltimoDiaMes($j, $i);
                        $arrayperiodosfechas[] = $this->construirPeriodoFechas('01', $ultimodia, $j, $i);
                    }

                    if($i == $annofinal && $j == $mesfinal){
                        break;
                        break;
                    }
                }
            }
        }else{
            $arrayperiodosfechas[0]['fechainicio'] = $fechainicio;
            $arrayperiodosfechas[0]['fechafin'] = $fechafin;
        }

        //Guardando el nuevo periodo para ese tipo de pago y tipo de periodo
        $arrayperiodo = ConfPeriodosTiposPago::obtenerPeriodoExistente($identidad, $idtipopago, $idperiodopago);
        if(empty($arrayperiodo)){
            //Guardando en ConfPeriodosTiposPago
            $sql = "INSERT INTO mod_nomina.conf_periodostipospago(idestructura, idperiodopago, idtipopago)
              VALUES (?,?,?) returning idperiodostipospago;";
            $r = $conn->fetchAll($sql, array($identidad, $idperiodopago, $idtipopago));
            $idperiodostipospagonuevo = $r[0]['idperiodostipospago'];
        }

        //Validando  cuando ya existe el rango de fechas
        $idperiodostipospago = (count($arrayperiodo) > 0) ? $arrayperiodo[0]['idperiodostipospago'] : -1;
        $arrayfechas = ($idperiodostipospago != -1) ? ConfDesglosePeriodos::obtenerTodasLasFechasXIdPeriodoPago($idperiodostipospago) : null;
        foreach($arrayperiodosfechas as $periodo) {
            //$objConfigDes = new ConfDesglosePeriodos();
            if(!empty($arrayfechas)){
                foreach($arrayfechas as $fecha) {
                    if($fecha['fdesde'] == $periodo['fechainicio'] && $fecha['fhasta'] == $periodo['fechafin']){
                        $sql = "DELETE FROM mod_nomina.conf_desgloseperiodos WHERE iddesgloseperiodos = ?;";
                        $conn->execute($sql, array($fecha['iddesgloseperiodos']));
                    }
                }
                if(count($arrayperiodo) > 0){//Si existe el período de pago
                    //Salvando en DatPersonaElaborarPagosCargosOcupados
                    $sql = "INSERT INTO mod_nomina.conf_desgloseperiodos(idperiodostipospago, fdesde, fhasta)
                      VALUES (?, ?, ?);";
                    $conn->execute($sql, array($idperiodostipospago, $periodo['fechainicio'], $periodo['fechafin']));
                }
            }else{//Si no existe el período de pago
                $sql = "INSERT INTO mod_nomina.conf_desgloseperiodos(idperiodostipospago, fdesde, fhasta)
                      VALUES (?, ?, ?);";
                $conn->execute($sql, array($idperiodostipospagonuevo, $periodo['fechainicio'], $periodo['fechafin']));
            }
        }
        $conn->commit();

        return count($arrayperiodosfechas);
    }

    public function getUltimoDiaMes ($mes, $anno)
    {
        return date("d", (mktime(0, 0, 0, $mes + 1, 1, $anno) - 1));
    }

    public function construirPeriodoFechas ($primerdia, $ultimodia, $mes, $anno)
    {
        $objfdesde = date_create_from_format("d/m/Y", ($primerdia . "/" . $mes . "/" . $anno));
        $arrayfechas['fechainicio'] = $objfdesde->format('d/m/Y');

        $objfdesde = date_create_from_format("d/m/Y", ($ultimodia . "/" . $mes . "/" . $anno));
        $arrayfechas['fechafin'] = $objfdesde->format('d/m/Y');
        return $arrayfechas;
    }

    public function modificarPeriodosPagos ($idperiodostipospago, $iddesgloseperiodos, $fechainicio, $fechafin)
    {
        //Validando  cuando ya existe el rango de fechas
        $contfechaexistente = 0;

        //Tratando las fechas
        $objfdesde = date_create_from_format("d/m/Y", $fechainicio);
        $fdesde = $objfdesde->format('d/m/Y');
        $objfhasta = date_create_from_format("d/m/Y", $fechafin);
        $fhasta = $objfhasta->format('d/m/Y');
        $arrayfechas = ConfDesglosePeriodos::obtenerTodasLasFechasXIdPeriodoPago($idperiodostipospago);
        foreach($arrayfechas as $fecha) {
            if($fecha['fdesde'] == $fdesde && $fecha['fhasta'] == $fhasta){
                $contfechaexistente++;
            }
        }

        if($contfechaexistente > 0){//Si existe el rango de fecha para este período de pago
            return 'EXISTE';
        }else{//Si no existe
            $obj = Doctrine::getTable('ConfDesglosePeriodos')->find($iddesgloseperiodos);
            $obj->fdesde = $fechainicio;
            $obj->fhasta = $fechafin;
            $obj->save();
            return 'MOD';
        }
    }

    public function eliminarPeriodosPagos ($idperiodostipospago, $arrayiddesgloseperiodos)
    {
        foreach($arrayiddesgloseperiodos as $v) {
            $objConfDesglosePeriodos = ConfDesglosePeriodos::obtenerFechasPeridosXIdDesglosePeriodos($v);
            $objConfDesglosePeriodos->delete();
        }

        $arrayfechasperiodos = ConfDesglosePeriodos::obtenerTodasLasFechasXIdPeriodoPago($idperiodostipospago);
        if(count($arrayfechasperiodos) == 0){
            $objConfPeriodosTiposPago = ConfPeriodosTiposPago::obtenerFechasPeridosXIdPeriodosTiposPago($idperiodostipospago);
            $objConfPeriodosTiposPago->delete();
        }
        return 'DEL';
    }
}
