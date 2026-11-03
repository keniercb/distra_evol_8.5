<?php

class FechaService extends ZendExt_Model {

    public function FechaService() {
        parent::ZendExt_Model();
    }

    public function FechaContableSubsistema($identidad, $idsubsistema) {
        $integrator = ZendExt_IoC::getInstance();
        $estructurasubsist = $integrator->datosmaestros->BuscarInstancia($identidad, $idsubsistema);
        $result = DatFecha::BuscarFecha($estructurasubsist->idestructurasubsist);
        $r = $result[0]['fecha'];
        $m = explode('-', $r);
        $r = $m[2] . '/' . $m[1] . '/' . $m[0];
        return $r;
    }

    public function FechaContableSubsistemaObj($identidad, $idsubsistema) {
        $integrator = ZendExt_IoC::getInstance();
        $estructurasubsist = $integrator->datosmaestros->BuscarInstancia($identidad, $idsubsistema);
        $objfecha = $this->BuscarfechaSubObj($estructurasubsist->idestructurasubsist, $idsubsistema);
        if ($objfecha->incremento == 1) {
            $fechamod = new FechaContModel();
            $resb = $fechamod->PasarfechaAutL($objfecha);
            $objfecha = $this->BuscarfechaSubObj($estructurasubsist->idestructurasubsist, $idsubsistema);
        }
        return $objfecha;
    }

    private function BuscarfechaSubObj($idestructurasubsist, $idsubsistema) {
        $result = DatFecha::BuscarFecha($idestructurasubsist);
        $standard = new ZendExt_ClassStandard();
        $objfecha = $standard->Object($result);
        $objfecha->idsubsistema = $idsubsistema;
        return $objfecha;
    }

    public function ActualizarFechaSubsistema($identidad, $idsubsistema, $fecha) {
        $aux = new FechaContModel();
        $aux->ActualizarFechaSubsistema($identidad, $idsubsistema, $fecha);
    }

    public function ActFechaContableSubsistema($identidad, $idsubsistema) {
        try {
            $integrator = ZendExt_IoC::getInstance();
            $estructurasubsist = $integrator->datosmaestros->BuscarInstancia($identidad, $idsubsistema);
            $fecha = DatFecha::BuscarFechaIdsubsistest($estructurasubsist->idestructurasubsist);
            $fechamodel = new FechaContModel();
            if ($fecha[0]['incremento'] == 2) {
                $fechaproxima = $fechamodel->ProximaFecha($fecha[0]['fecha'], 1);
                $fecharesult = $fechamodel->PasarFechaL($fecha, $fechaproxima);
                $fecha = $fechamodel->FormatearFecha($fecharesult);
                return $fecha[0] . "/" . $fecha[1] . "/" . $fecha[2];
            } else
                throw new ZendExt_Exception('CONF100', $ee);
        } catch (ZendExt_Exception $e) {
            throw $e;
        }
    }

    public function FechaCI() {
        $dir_rel_app = Zend_Registry::get('config')->uri_aplication;
        $dir_controller = $dir_rel_app . '/configuracion/fecha/index.php/gestionarfecha/gestionarfechacargainicial';
        header("Location: $dir_controller");
    }

    public function EscribirFecha() {
        try {
            $idsubsistema = array(3, 4, 5, 6, 7, 10, 11, 12, 13);
            $precedencia = array(5, 1, 2, 3, 4, 6, 7, 8, 9);
            $global = ZendExt_GlobalConcept::getInstance();
            $x = $global->Estructura->idestructura;
            $fecha = FechaModel::DevuelveFecha($x);
            $integrator = ZendExt_IoC::getInstance();

            for ($i = 0; $i < count($idsubsistema); $i++) {
                $idsubs = $integrator->datosmaestros->EncuentraIdestructurasubsist($idsubsistema[$i]);
                $fechaest = DatFecha::BuscarFecha($idsubs);
                if (!count($fechaest)) {
                    $tabla = new DatFecha();
                    $tabla->fecha = $fecha;
                    $tabla->idestructurasubsist = $idsubs;
                    $tabla->incremento = 1;
                    $tabla->fechasist = date("d-m-Y");
                    $tabla->precedencia = $precedencia[$i];
                    $tabla->save();
                    unset($tabla);
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function TieneFechaConfigurada($entidad, $subsistema) {
        $integrator = ZendExt_IoC::getInstance();
        $estructurasubsist = $integrator->datosmaestros->BuscarInstancia($entidad, $subsistema);
        $result = DatFecha::BuscarFecha($estructurasubsist->idestructurasubsist);
        if (count($result))
            return true;
        else
            return false;
    }

    public function PasarFechaAutomatica($entidad, $subsistema) {
        $fechaModel = new FechaModel();
        $estructurasubsist = $this->integrator->datosmaestros->BuscarInstancia($entidad, $subsistema);

        $fechasentidad = $fechaModel->FechasEntidad();
        $precedencias = DatFecha::BuscarPrecedencias($fechasentidad[1]);
        foreach ($fechasentidad[0] as $i => $fent) {
            if ($fent['idestructurasubsist'] == $estructurasubsist) {
                if ($fent['incremento'] == 1) {
                    $predenc = $fechaModel->DetectarPrecedentes($fent['precedencia'], $fent['fechasist'], $fent['incremento'], $fent['fecha']);
                }
            }
        }
    }

    public function TieneFechaConfContabilidad($entidad) {
        return $this->TieneFechaConf($entidad, 1);
    }

    public function TieneFechaConfCostosProcesos($entidad) {
        return $this->TieneFechaConf($entidad, 2);
    }

    public function TieneFechaConfPlanificacion($entidad) {
        return $this->TieneFechaConf($entidad, 3);
    }

    public function TieneFechaConfCapitalHumano($entidad) {
        return $this->TieneFechaConf($entidad, 4);
    }

    public function TieneFechaConfInventario($entidad) {
        return $this->TieneFechaConf($entidad, 5);
    }

    public function TieneFechaConfActivosFijos($entidad) {
        return $this->TieneFechaConf($entidad, 6);
    }

    public function TieneFechaConfFacturacion($entidad) {
        return $this->TieneFechaConf($entidad, 7);
    }

    public function TieneFechaConfCobroPago($entidad) {
        return $this->TieneFechaConf($entidad, 8);
    }

    public function TieneFechaConfConfiguracion($entidad) {
        return $this->TieneFechaConf($entidad, 9);
    }

    public function TieneFechaConfMultimoneda($entidad) {
        return $this->TieneFechaConf($entidad, 10);
    }

    public function TieneFechaConfAuditoria($entidad) {
        return $this->TieneFechaConf($entidad, 11);
    }

    public function TieneFechaConfEstructurayComposicion($entidad) {
        return $this->TieneFechaConf($entidad, 12);
    }

    public function TieneFechaConfBanco($entidad) {
        return $this->TieneFechaConf($entidad, 13);
    }

    public function TieneFechaConfCaja($entidad) {
        return $this->TieneFechaConf($entidad, 14);
    }

    public function TieneFechaConfUsuario($entidad) {
        return $this->TieneFechaConf($entidad, 15);
    }

    public function TieneFechaConfPortal($entidad) {
        return $this->TieneFechaConf($entidad, 16);
    }

}
