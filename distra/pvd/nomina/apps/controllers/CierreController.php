<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

class CierreController extends ZendExt_Controller_Secure
{

    public function init() 
    {
        parent::init();
        $this->instanceModel = new CierrenominaModel();
    }

    public function cierreAction() 
    {
        $this->render();
        $this->view->idioma = $this->global->Perfil->idioma;
    }

    public function GuardarInformacion($identidad,$arrdatos,$inicio,$fin)
    {
        for ($i = 0; $i < count($arrdatos); $i++) {
            $datos['idperiodo'][$i] = $arrdatos[0]->idperiodo;
            $datos['identidad'][$i] = $arrdatos[0]->identidad;
            $datos['cuentas'][$i] = $arrdatos[$i]->cuentas;
            $datos['tipo'][$i] = $arrdatos[$i]->denominacion;
            $datos['estado'][$i] = $arrdatos[$i]->estado;
            $datos['diferencia'][$i] = $arrdatos[$i]->diferencia;
            $datos['nomina'][$i] = $arrdatos[$i]->nomina;
            $datos['contab'][$i] = $arrdatos[$i]->contab;
        }

            if (count($arrdatos) == 0) {
                $flag= false;
                $responsetext='No existe información del período.';    
            
            }else{
                $result = CierrenominaModel::adicionarInfo($datos);
                if ($result) {
                    $flag= true;
                    $responsetext=' Se ha guardado la información satisfactoriamente.';    
                }else {
                    $flag = false;
                    $responsetext = 'Ya ese período se encuentra en uso';
                }
            }

       echo json_encode(array('flag'=>$flag,'responsetext'=>$responsetext));
       
    }
       
    public function periodosPagoAction()
    {
            $identidad = $this->_getParam('identidad');    
        $den = $this->integrator->metadatos->DameEstructura($identidad);
        foreach ($den as $d) {
            $denominacion = $d->denominacion;
        }
        $objn = new CierrenominaModel();
        $arraydatos=array();
        $pagos = $objn->PeriodosPagoPorEntidad($identidad);
        for ($i = 0; $i < count($pagos); $i++) {
            $arraydatos[$i]['anyo'] = $pagos[$i]['anyo'];
            $arraydatos[$i]['identidad'] = $identidad;
            $arraydatos[$i]['fechainicioperiodo'] = $pagos[$i]['fechainicioperiodo'];
            $arraydatos[$i]['fechafinperiodo'] = $pagos[$i]['fechafinperiodo'];
            $arraydatos[$i]['idestado'] = ($pagos[$i]['estado']== 'Abierto') ? '1' : '0';
            $arraydatos[$i]['estado'] = $pagos[$i]['estado'];
            $arraydatos[$i]['periodopago'] = $pagos[$i]['periodopago'];
        }
        echo json_encode(array('datos' => $arraydatos, 'cantidad' => $i));

    }
    // cierra el periodo cuando la fecha contable del sistema sea igual a la fecha fin del periodo 
    public function cierrePeriodoAction() 
    {
        $identidad = $this->_getParam('identidad');
        $arrdatos = json_decode($this->_getParam('arrdatos', array()));
        $inicio = $this->_getParam('inicio');
        $fin = $this->_getParam('fin');
        $estado = $this->_getParam('estado');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $final=array();
        $objcierre = new CierrenominaModel();
        $idpereje = $objcierre->getIdperiodoIdejercicio($inicio,$fin);
        $idperiodo =  $idperiodo[0]['idperiodo'];
        $idejericio = $idperiodo[0]['idejercicio '];
        $respuesta = $objcierre->cerrarPeriodo($identidad,$inicio,$fin ,$arrdatos, $start,$limit,$idejericio,$idperiodo,$estado);
        if ($respuesta['flagvacio']) {
            $responsetext='No se puede realizar el cierre del día, no existe información en el período.';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        } 
        if ($respuesta['nofinmes'] ) {
             $responsetext='No se puede realizar el cierre del período, no se encuentra en el último día del período.';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        }
        if ($respuesta['flaglista']) {
            $responsetext='No se puede realizar el cierre, existen configuraciones en las listas de chequeo sin resolver';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        } 
        if ($respuesta['flagdif']) {
             $responsetext='No se puede realizar el cierre del período seleccionado, existen diferencias entre los importes de las cuentas';
             echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
             return;
        }
        if ($respuesta['success']) { 
             if ($final['success'] && !$respuesta['nofinmes'] && !$respuesta['flaglista'] && $respuesta['flagdif']) {
                    $this->GuardarInformacion($identidad,$arrdatos,$inicio,$fin);
             } 
           $final['success'] = $respuesta['success'] ;
           $final['responsetext'] = 'Se ha realizado satisfactoriamente el cierre del período de la nómina.';
           $final['fecha'] = $respuesta['fecha'] ;
           $final['nombreperiodosig'] = $respuesta['nombreperiodosig'] ;
           $final['inicioperiodosig'] = $respuesta['inicioperiodosig'] ;
           $final['finperiodosig'] = $respuesta['finperiodosig'] ;
           echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
           return;
       }     
    }
    // cierra el año cuando la fecha contable del sistema sea igual a la fecha fin del periodo 
    public function cierreEjercicioAction() 
    {
        $identidad = $this->_getParam('identidad');
        $arrdatos = json_decode($this->_getParam('arrdatos', array()));
        $inicio = $this->_getParam('inicio');
        $fin = $this->_getParam('fin');
        $estado = $this->_getParam('estado');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $final=array();
        $objcierre = new CierrenominaModel();
        $idpereje = $obj->getIdperiodoIdejercicio($inicio,$fin); 
        $idejericio = $idperiodo[0]['idejercicio '];
        $respuesta = $objcierre->cierreEjercicio($identidad,$inicio,$fin ,$arrdatos,$idejercicio,$estado);
        if ($respuesta['flagvacio']) {
            $responsetext='No se puede realizar el cierre del día, no existe información en el período.';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        } 
        if ($respuesta['flaglista']) {
            $responsetext='No se puede realizar el cierre, existen configuraciones en las listas de chequeo sin resolver';
           echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
           return;
        } 
        if ($respuesta['flagdif']) {
             $responsetext='No se puede realizar el cierre del período seleccionado, existen diferencias entre los importes de las cuentas';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        } 
        if ($respuesta['success']) {
            $final['success'] = $respuesta['success'] ;            
            $final['responsetextsucces'] = 'Se ha realizado satisfactoriamente el cierre del ejercicio de la nómina.';
            $final['fecha'] = $respuesta['fecha'] ;
            $final['nombreejesig'] = $respuesta['nombreejesig'] ;
            $final['inicioejesig'] = $respuesta['inicioejesig'] ;
            $final['finejesig'] = $respuesta['finejesig'] ;
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;    
        }
    }
    // cierra el dia  cuando la fecha contable del sistema sea menor que la fecha fin del periodo 
    public function cierreDiarioAction()
    {
        $identidad = $this->_getParam('identidad');
        $arrdatos = json_decode($this->_getParam('arrdatos', array()));
        $inicio = $this->_getParam('inicio');
        $fin = $this->_getParam('fin');
        $estado = $this->_getParam('estado');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $objcierre = new CierrenominaModel();
        $idpereje = $objcierre->getIdperiodoIdejercicio($inicio,$fin); 
        $idperiodo =  $idperiodo[0]['idperiodo'];
        $idejericio = $idperiodo[0]['idejercicio '];
        $final=array();
        $responsetext='';
        $respuesta = $objcierre->pasarDia($identidad,$inicio,$fin ,$arrdatos,$start, $limit,$idejericio,$idperiodo,$estado);
        if ($respuesta['flagvacio']) {
            $responsetext='No se puede realizar el cierre del día, no existe información en el período.';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        } 
        if ($respuesta['flagfinmes']) {
            $responsetext='No se puede realizar el cierre del día, se encuentra en el último día del período para poder realizar el cierre debe ejecutar el botón cierre período.';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        } 
        if ($respuesta['flaglista']) {
            $responsetext='No se puede realizar el cierre, existen configuraciones en las listas de chequeo sin resolver';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        } 
        if ($respuesta['flagdif']) {
            $responsetext='No se puede realizar el cierre del día, existen diferencias entre los importes de las cuentas';
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
            return;
        }
        if ($respuesta['success']) {
            $final['success'] = $respuesta['success'] ;
            $final['responsetextsucces'] = 'Se ha realizado satisfactoriamente el cierre del día de la nómina';
            $final['fecha'] = $respuesta['fecha'] ;
            $final['nombreperiodo'] = $respuesta['nombreperiodo'] ;
            $final['inicioperiodo'] = $respuesta['inicioperiodo'] ;
            $final['finperiodo'] = $respuesta['finperiodo'] ;
            echo json_encode(array('final'=>$final,'responsetext'=>$responsetext));
          return;
        }
    }

    public function exportarAction()
    {
        $identidad = $this->_getParam('identidad');
        $inicio = $this->_getParam('inicio');
        $fin = $this->_getParam('fin');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $estado = $this->_getParam('estado');
        $obj = new CierrenominaModel();
        $idpereje = $obj->getIdperiodoIdejercicio($inicio,$fin); 
        $idperiodo =  $idperiodo[0]['idperiodo'];
        $arridelabpago = $obj->ObtenerIDPAGO($identidad, $inicio, $fin, $estado);
        $cuentas = $obj->nomcuenta();
        if (count($arridelabpago)>0) {
            $datoscuentas= $obj->obtenerDatosCuentas($arridelabpago, $cuentas, $identidad, $inicio, $fin, $start, $limit, $idperiodo);
            for ($i = 0; $i < count($datoscuentas); $i++) {
                $datos[$i]['cuentas'] = $datoscuentas[$i]['cuentas'];
                $datos[$i]['contab'] = ($datoscuentas [$i]['contab'] == 0) ? '0.00' : (number_format($datoscuentas[$i]['contab']));
                $datos[$i]['estado'] = $datoscuentas[$i]['estado'];
                $datos[$i]['diferencia'] =  ($datoscuentas[$i]['contab'] > $datoscuentas [$i]['nomina']) ? number_format($datoscuentas[$i]['contab'] - $datoscuentas [$i]['nomina']) : number_format($datoscuentas[$i]['nomina'] - $datoscuentas [$i]['contab']);
                $datos[$i]['denominacion'] = $datoscuentas[$i]['denominacion'];
                $datos[$i]['nomina'] = ($datoscuentas [$i]['nomina'] == 0) ? '0.00 ': (number_format($datoscuentas[$i]['nomina']));
            }
            $idsubsistem = $this->global->Subsistema->idsubsistema;
            $fechaContable = $this->integrator->datosmaestros->fechaContableSubsistema($identidad, $idsubsistem);
            $objPeriodo= $this->integrator->datosmaestros->obtenerPeriodo($idperiodo);
            $nombreperiodo = $objPeriodo->nombre;
            $centros= $obj->validarCentrosCostoCargos($identidad, $start,$limit);
            $sinsubvac=$obj->personasSinSubmayorVacacIniciado($identidad, $start,$limit);
            $cargossinconfig=$obj->cargossinConfigElemSalarial($identidad, $start,$limit);
            $sinplantilla= $obj->personassinPlantillaNominal($identidad, $start,$limit);
            $doble= $obj->dobleCargoCentro($identidad, $start,$limit);
            $servicio= $obj->sitServicioCentro($identidad, $start,$limit);
            foreach ($arridelabpago as $key => $value) {
                $idelabpa[] =  $value['idelaborarpagos'];
            }
             $idelabpago = implode("','", $idelabpa);   
            $descreten= $obj->Personasdescuentos($idelabpago); 
            
            $datosEstructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
            $codigo =$datosEstructura[0]->codigo;
            $noment= $datosEstructura[0]->text;
            $fecha = date('d/m/Y');
            $datos = ExportarcierreModel::CrearReportePDF($codigo,$noment,$estado,$inicio,$fin,$datos,$centros,$sinsubvac,$cargossinconfig,$sinplantilla,$doble,$servicio,$nombreperiodo,$fechaContable,$fecha,$descreten);
            return true;
        }
        return false;
    }

    public function numberFormat($agNumero, $agKeepCero = false)
    {
            if ($agNumero == 0) {
                if (!$agKeepCero) {
                    return '';
                } else {
                    if ($agKeepCero) {
                        return number_format($agNumero, '2', '.', ',');
                    }
                }
            } elseif ($agNumero < 0) {
                return '(' . number_format($agNumero * -1, '2', '.', ',') . ')';
            } else {
                return number_format($agNumero, '2', '.', ',');
            }
    }
     //se obtiene las cuentas a mostrar segun el nomenclador de las cuentas del cierre
    public function obtenerDatosCuentasAction() 
    {
        $identidad = $this->_getParam('identidad'); 
        $inicio = $this->_getParam('inicio');
        $fin = $this->_getParam('fin');
        $estado = $this->_getParam('estado');  
        $idperiodo = $this->_getParam('idperiodo');
        $start = ($this->_getParam('start')) ? $this->_getParam('start') : 0;
        $limit = ($this->_getParam('limit')) ? $this->_getParam('limit') : 1000;
        $objcierre = new CierrenominaModel();
        $arridelabpa = $objcierre->ObtenerIDPAGO($identidad, $inicio, $fin, $estado); 
        $cuentas = $objcierre->nomcuenta();
        $final = [];
        if (count($arridelabpa)>0) {         
            $datoscuentas = $objcierre->obtenerDatosCuentas($arridelabpa, $cuentas, $identidad, $inicio, $fin, $start, $limit, $idperiodo);
            for ($i = 0; $i < count($datoscuentas); $i++) {
                $final[$i]['idperiodo'] = $datoscuentas[$i]['idperiodo'];
                $final[$i]['cuentas'] = $datoscuentas[$i]['cuentas'];
                $final[$i]['contab'] = ($datoscuentas [$i]['contab'] == 0) ? '0.00' : (floatval($datoscuentas[$i]['contab']));
                $final[$i]['identidad'] = $datoscuentas[$i]['identidad'];
                $final[$i]['estado'] = $datoscuentas[$i]['estado'];
                $final[$i]['diferencia'] =  ($datoscuentas[$i]['contab'] > $datoscuentas [$i]['nomina']) ? ($datoscuentas[$i]['contab'] - $datoscuentas [$i]['nomina']) : ($datoscuentas[$i]['nomina'] - $datoscuentas [$i]['contab']);
                $final[$i]['denominacion'] = $datoscuentas[$i]['denominacion'];
                $final[$i]['nomina'] = ($datoscuentas [$i]['nomina'] == 0) ? '0.00 ': (floatval($datoscuentas[$i]['nomina']));
            }
        
       }  
        echo json_encode(array('datos' => $final, 'cantidad' => count($final)));
    }

    public function PeriodoActualAction()  
    {
        $identidad = $this->_getParam('identidad');
        $inicio = $this->_getParam('inicio');
        $fin = $this->_getParam('fin');
        $estado = $this->_getParam('estado');
        $idPeriodo = $this->_getParam('idperiodo');
        $idsubsistem = $this->global->Subsistema->idsubsistema;
        $fechacontable = $this->integrator->datosmaestros->fechaContableSubsistema($identidad, $idsubsistem);
        $obj = new CierrenominaModel();
        $objPeriodo = $this->integrator->datosmaestros->obtenerPeriodo($idPeriodo);
        $nombre = $objPeriodo->nombre;
        if (!empty($objPeriodo)) {
            $flag = true;
        } else {
            $flag = false;
        }
        echo(json_encode(array('nombre' => $nombre, 'flag' => $flag, 'fechacont' => $fechacontable)));
    }

    public function CierreCorrectoAction() 
    {
        $objcierre = new CierrenominaModel();
        $datos = $objcierre->cerrarPeriodo();
        foreach ($datos as $key) {
            if ($key['flag'] == true && $key['ultimodia'] == true) {
                $correcto = true;
            } else {
                $correcto = false;
            }
        }
        echo(json_encode($correcto));
    }

    //se busca que el subsistema de nomina contenga  una configuarcion manual en la gestion de fecha asi el boton
    //de cierre diario se habilita en el cierre de la nomina

    public function buscarfechaDatosMaestrosAction()
    {
        $identidad = $this->_getParam('identidad');
        $idsubsistem = $this->global->Subsistema->idsubsistema;
        $sql = " SELECT s.incremento 
           from mod_datosmaestros.dat_fecha s 
           inner join mod_datosmaestros.dat_estructurasubsist e on s.idestructurasubsist = e.idestructurasubsist 
           where e.idestructuracomun = $identidad 
            and e.idsubsistema = $idsubsistem";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $con = $conn->fetchOne($sql);
        if ($con == 2) {
            $c = $con;
            $flag = 2;
        } else {
            $flag = 1;
        }
       
        $f = array('flag' => $flag, 'c' => $c);
        echo(json_encode($f));
    }

    public function CierreSubsistemaAction() 
    {
        $identidad = $this->_getParam('identidad');
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlsub = "SELECT de.idsubsistema FROM mod_nomina.dat_comprobantenomina de";
        $idsubsistem = $conn->fetchOne($sqlsub);

        $sql = "SELECT de.cierra FROM mod_datosmaestros.dat_estructurasubsist de
          where idestructuracomun = $identidad  and idsubsistema = $idsubsistem";
        $con = $conn->fetchOne($sql);
        if ($con == 1) {
            $c = $con;
            $flag = 1;
        } else {
            $flag = 0;
        }
        $f = array('flag' => $flag, 'c' => $c);
        echo(json_encode($f));
    }

    public function personalAction() 
    {
        $identidad = $this->_getParam('identidad');
        $inicio = $this->_getParam('inicio');
        $fin = $this->_getParam('fin');
        $estado = $this->_getParam('estado');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $listas=[];
        $objstore = new CierrenominaModel();
        $arridelabpago = $objstore->ObtenerIDPAGO($identidad, $inicio, $fin, $estado);
        if (count($arridelabpago)>0) {
         $listas = $objstore->ListasChequeo($identidad, $start,$limit,$arridelabpago);
        }
        echo json_encode(array('datos' => $listas, 'cantidad' =>count($listas)));
    }

}