<?php

class DatElaborarPagosModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function DatElaborarPagosModel()
    {
        parent::ZendExt_Model();
    }

    public function adicionarPeriodoPago($datos)
    {

        $obj = new DatElaborarPagos();

        $obj->estado = 1;
        $obj->identidad = $datos->identidad;
        $obj->idperiodopago = $datos->idperiodopago;
        $obj->idtipopago = $datos->idtipopago;

        if ($datos->modopago == 1) {
            $obj->fechafinperiodo = $datos->fechafinperiodo;
            $obj->fechainicioperiodo = $datos->fechainicioperiodo;
            $obj->fechapago = $datos->fechapago;
            $obj->mesanyopago = null;
        } else {
            $obj->fechafinperiodo = null;
            $obj->fechainicioperiodo = null;
            $obj->fechapago = $datos->fechapago;
            $obj->mesanyopago = $datos->mesanyopago;
        }
        $obj->save();
        return $obj->idelaborarpagos;
    }

    public function estaEnRango($start_date, $end_date, $date)
    {
        // conver to timestamp
        $start_date = strtotime($start_date);
        $end_date = strtotime($end_date);
        $date = strtotime($date);

        // check the date
        if (($date >= $start_date) && ($date <= $end_date))
            return true;
        else
            return false;
    }

    public function obtenerPeriodoPagoAbiertosXTipoPago($identidad, $idtipopago)
    {
        $periodosabiertos = DatElaborarPagos::obtenePeriodoPagoAbiertoByTipoPago($identidad, $idtipopago);

        if ($periodosabiertos > 0) {
            return true;
        } else return false;
    }

    public function estaAperturadoModeloNomina($identidad, $idtipopago)
    {
        $estaAperturado = DatElaborarPagos::estaAperturadoModeloNomina($identidad, $idtipopago);

        return $estaAperturado;
    }

    public function modificarPeriodoPago($datos)
    {

        $obj = Doctrine::getTable('DatElaborarPagos')->find($datos->idelaborarpagos);

        $obj->identidad = $datos->identidad;
        $obj->idperiodopago = $datos->idperiodopago;
        $obj->idtipopago = $datos->idtipopago;

        if ($datos->modopago == 1) {
            $obj->fechafinperiodo = $datos->fechafinperiodo;
            $obj->fechainicioperiodo = $datos->fechainicioperiodo;
            $obj->fechapago = $datos->fechapago;
            $obj->mesanyopago = null;
        } else {
            $obj->fechafinperiodo = null;
            $obj->fechainicioperiodo = null;
            $obj->fechapago = $datos->fechapago;
            $obj->mesanyopago = $datos->mesanyopago;
        }

        $obj->save();
    }

    public function concluirPeriodoPago($idelaborarpagos, $identidad)
    {
        $estadonominas = DatNomina::obteneEstadoNominas($idelaborarpagos);

        //Si las nominas estan aprobadas
        if($estadonominas == 1){
            $obj = Doctrine::getTable('DatElaborarPagos')->find($idelaborarpagos);
            $obj->estado = 2;
            $obj->save();
            return 'PERIODO-CONCLUIDO';
        }else{
            return 'NOMINAS-NO-APROBADAS';
        }

    }

    public function eliminarPeriodoPago($idelaborarpagos)
    {
        $obj = Doctrine::getTable('DatElaborarPagos')->find($idelaborarpagos);
        $obj->delete();
    }

    public function actualizarDescripcionPeriodoPago($idelaborarpagos, $descripcion)
    {
        $obj = Doctrine::getTable('DatElaborarPagos')->find($idelaborarpagos);
        $obj->descripcion = $descripcion;
        //$obj->save();
    }

    public function obtenerDependenciasPeriodos($identidad, $idtipopago, $fechainicio, $fechafin)
    {

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();

        $sql = "select ctpd.idtipopagodepencia from mod_nomina.conf_tipopagodependencia ctpd
        where ctpd.idtipopago = ?;";
        $dependencias = $conn->fetchAll($sql, array($idtipopago));

        $r = '';
        foreach ($dependencias as $tipopago) {
            $sql = "select idelaborarpagos, idtipopago from mod_nomina.dat_elaborarpagos where identidad = ? and idtipopago = ?
                    and ('{$fechainicio}'::date = fechainicioperiodo and '{$fechafin}'::date = fechafinperiodo);"; //and estado = 1
            $periodo = $conn->fetchAll($sql, array($identidad, $tipopago['idtipopagodepencia']));
            if (empty($periodo)) {
                $sql = "select denominacion from mod_nomina.nom_tipopago where idtipopago = ?;";
                $denomtipopago = $conn->fetchOne($sql, array($tipopago['idtipopagodepencia']));
                $r .= $denomtipopago . ";";
            }
        }
        $conn->commit();
        return trim($r, ";");
    }

    public function obtenerPeriodosPagoEntidadSubmayorV($identidad)
    {
        $r = DatElaborarPagos::obtenerPeriodosPagoEntidadSubmayorV($identidad);
        return $r;
    }

    public function estadoNominas($idelaborarpago)
    {
        $mg   = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select aprobada from  mod_nomina.dat_nomina where idelaborarpago = ?;";
        $r    = $conn->fetchAll($sql, array($idelaborarpago));
        return $r;
    }

}
