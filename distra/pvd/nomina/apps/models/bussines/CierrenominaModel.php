<?php

class CierrenominaModel extends ZendExt_Model
{

    public function CierrenominaModel(){
        parent::ZendExt_Model();
        //Obtener fecha fin del periodo actual---------
        //$this->idPeriodoActual = $this->integrator->datosmaestros->periodoActualSubsistema($this->idEstructura, 4);//4-Subsistema Contabilidad
        //Obtener fecha fin periodo
        //$periodoActual = $this->integrator->datosmaestros->obtenerPeriodo($this->idPeriodoActual);
        //$this->fechaFinPeriodo = $periodoActual->fin;
    }

    public function ListasChequeo($identidad, $start,$limit,$arridelabpago) {
        $centros= $this->validarCentrosCostoCargos($identidad, $start,$limit);
        $sinsubvac=$this->personasSinSubmayorVacacIniciado($identidad, $start,$limit);
        $cargossinconfig= $this->cargossinConfigElemSalarial($identidad,$start,$limit);
        $sinplantilla= $this->personassinPlantillaNominal($identidad,$start,$limit);
        $doble= $this->dobleCargoCentro($identidad,$start,$limit);// 
        $servicio= $this->sitServicioCentro($identidad,$start,$limit);
        $descreten=[];
        if (count($arridelabpago)>0) {
            foreach ($arridelabpago as $key => $value) {
                $idelabpa[] =  $value['idelaborarpagos'];
            }
             $idelabpago = implode("','", $idelabpa);   
        $descreten= $this->Personasdescuentos($idelabpago);
        }
        $lista= array_merge($centros, $sinsubvac, $cargossinconfig, $sinplantilla, $doble, $servicio,$descreten);
        return $lista;
    }
    
    public function getIdperiodoIdejercicio($inicio,$fin) {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlpagos = "SELECT idperiodo,idejercicio
        FROM  mod_datosmaestros.dat_periodocontable 
        where inicio >= '$inicio' and fin <= '$fin' ";
        $r= $conn->fetchAll($sqlpagos);
        return $r;
    }
    

    public function PeriodosPagoPorEntidad($identidad) {
        $fecha = date('d/m/Y');
        $idsubsistem = $this->global->Subsistema->idsubsistema;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlperiodo= " SELECT DISTINCT fechainicioperiodo,fechafinperiodo,estado
                    from mod_nomina.dat_elaborarpagos
                    where identidad = $identidad  group by fechainicioperiodo ,fechafinperiodo,estado
                    order by fechainicioperiodo DESC  ";
        $r = $conn->fetchAll($sqlperiodo); 

       $estado="SELECT df.fecha 
                    FROM mod_datosmaestros.dat_estructurasubsist de
                        inner join mod_datosmaestros.dat_fecha df on (df.idestructurasubsist = de.idestructurasubsist)
                        where idestructuracomun = $identidad and  idsubsistema = $idsubsistem ;";
         $est= $conn->fetchAll($estado);
        $comp=$est[0]['fecha'];
       if (count($r) > 0) {
            foreach ($r as $i => &$v) {
                $fexplode = explode('/', $v['fechainicioperiodo']);
                $v['anyo'] = $fexplode[2];
                $v['periodopago'] = $v['fechainicioperiodo'] . ' al ' . $v['fechafinperiodo'];
                $ini = $this->compara_fechasIguales($v['fechainicioperiodo'],$comp); 
                $fini= $this->compara_fechasIguales($v['fechafinperiodo'],$comp);           
                $v['estado']= ($ini = $fini == 1)?'Abierto':'Cerrado';
            }
        }
      return $r;
    }

    public function compara_fechasIguales($fechai, $fechaf)
    {
        list($diab, $mesb, $annob) = explode("/", $fechai);
        list($diac, $mesc, $annoc) = explode("/", $fechaf);
            if ($mesb - $mesc == 0) {
                $cont = 1;
                if ($annob - $annoc == 0) {
                    $cont = 3;
                } 
            } else {
            $cont = 0;
        }

        if ($cont == 3) {
            return 1;
        }
        return 0;
    }

    public function nomcuenta() 
    {
         $sql = "SELECT idcuenta , tipo FROM mod_nomina.nom_cuentascierre";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $nom= $conn->fetchAll($sql);
        foreach ($nom as $n) {
            $cuen[] = $n['idcuenta'];
        }
        $cuentas = implode("','", $cuen);
        return $cuentas;
    }

    public function storeDatos($arrdatos) 
    {
        $datos = array();
        for ($i = 0; $i < count($arrdatos); $i++) {
            $datos['idperiodo'][$i] = $arrdatos[$i]->idperiodo;
            $datos['identidad'][$i] = $arrdatos[$i]->identidad;
            $datos['cuentas'][$i] = $arrdatos[$i]->cuentas;
            $datos['tipo'][$i] = $arrdatos[$i]->denominacion;
            $datos['estado'][$i] = $arrdatos[$i]->estado;
            $datos['diferencia'][$i] = $arrdatos[$i]->diferencia;
            $datos['nomina'][$i] = $arrdatos[$i]->nomina;
            $datos['contab'][$i] = $arrdatos[$i]->contab;
        }

        $estado = array_fill(0, count($datos['estado']), 'Aprobada');
        $diferencias = array_fill(0, count($datos['diferencia']), '0');

        // EL ARRAY_DIFF es para ver si hay algun elemto diferente en los dos array en este caso no hay por lo q salta al OK
        // o sea pregunta si hay diferencia MUESTRA SI SINO OK
        $flagestado = (array_diff($estado, $datos['estado'] == ['Aprobada'])) ? '0' : '1';
        $flagdiferencia = (array_diff($diferencias, $datos['diferencia'] == 0)) ? '1' : '0';
        $fechap = $datos['fecha'][0];
        $idperiodo = $datos['idperiodo'][0];
        $objPeriodo = $this->integrator->datosmaestros->obtenerPeriodo($idperiodo);
        $nombreperiodo = $objPeriodo->nombre;
        $inicioperiodo = $objPeriodo->inicio;
        $finperiodo = $objPeriodo->fin;

        $persig = $this->integrator->datosmaestros->periodoSiguiente($idperiodo);
        $nombreperiodosig = $persig->nombre;
        $inicioperiodosig = $persig->inicio;
        $finperiodosig = $persig->fin;

        $idEjercicio = $objPeriodo->idejercicio;
        $ejACT = $this->integrator->datosmaestros->obtenerEjercicio($idEjercicio);
        $nombreeje = $ejACT[0]->nombre;
        $inicioeje = $ejACT[0]->inicio;
        $fineje = $ejACT[0]->fin;

        $ejsig = $this->integrator->datosmaestros->ejercicioSiguiente($idEjercicio);
        $sig = $this->integrator->datosmaestros->obtenerEjercicio($ejsig);
        $nombreejesig = $sig[0]->nombre;
        $inicioejesig = $sig[0]->inicio;
        $finejesig = $sig[0]->fin;
        return array('flagestado' => $flagestado, 'flagdiferencia' => $flagdiferencia, 'objPeriodo' => $objPeriodo,
            'ejACT' => $ejACT, 'sig' => $sig, 'fechap' => $fechap, 'nombreejesig' => $nombreejesig, 'inicioejesig' => $inicioejesig,
            'finejesig' => $finejesig, 'nombreeje' => $nombreeje, 'inicioeje' => $inicioeje, 'fineje' => $fineje,
            'nombreperiodo' => $nombreperiodo, 'inicioperiodo' => $inicioperiodo, 'finperiodo' => $finperiodo, 'nombreperiodosig' => $nombreperiodosig,
            'inicioperiodosig' => $inicioperiodosig, 'finperiodosig' => $finperiodosig, 'datos' => $datos);

    }

    public function EstructuraEconomica($identidad) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT idestructurae
                    FROM mod_contabilidad.dat_estructurae
                    where idestructuracomun = $identidad";
        $info = $conn->fetchAll($sql);
        return $info[0]['idestructurae'];
    }

    public function ObtenerIDPAGO($identidad, $inicio, $fin, $estado)
    {
        $esttp = ($estado == 'Cerrado') ? 2 : 1;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlpagos = "SELECT DISTINCT idelaborarpagos
                                 FROM mod_nomina.dat_elaborarpagos 
                                    where identidad = $identidad and
                                     fechainicioperiodo>= '$inicio' and 
                                      fechafinperiodo <= '$fin' ";
        $pagos= $conn->fetchAll($sqlpagos);
        return $pagos; 
    }

    public function cerrarPeriodo($identidad,$inicio,$fin ,$arrdatos, $start,$limit,$idejericio,$idperiodo,$estado) 
    {
        $arridelabpa = $this->ObtenerIDPAGO($identidad, $inicio, $fin, $estado);
        if (count($arridelabpa)>0) {
            foreach ($datospago as $datos) {
                $idelabpago[] = $datos['idelaborarpagos'];
             }
              $arridelabpago = implode("','", $idelabpago);  
         $lista= $this->ListasChequeo($identidad, $start,$limit,$arridelabpa);
        } 
        $idsubsistem = $this->global->Subsistema->idsubsistema;
        $objPeriodo= $this->integrator->datosmaestros->obtenerPeriodo($idperiodo);
        $objpersig= $this->integrator->datosmaestros->periodoSiguiente($idperiodo);
        $objejerc= $this->integrator->datosmaestros->obtenerEjercicio($idejercicio);
        $idejesig= $this->integrator->datosmaestros->ejercicioSiguiente($idejercicio);
        $objejesig= $this->integrator->datosmaestros->obtenerEjercicio($idejesig); 
        $fechaContable = $this->integrator->datosmaestros->fechaContableSubsistema($identidad, $idsubsistem);
        $store = $this->storeDatos($arrdatos);
        $flagdiferencia =$store['flagdiferencia'];
        $nombreperiodo = $objPeriodo->nombre;
        $inicioperiodo = $objPeriodo->inicio;
        $finperiodo = $objPeriodo->fin;
        $nombreperiodosig = $objpersig->nombre;
        $inicioperiodosig = $objpersig->inicio;
        $finperiodosig = $objpersig->fin;
        $nombreeje = $objejerc->nombre;
        $fineje = $objejerc->fin;
        $inicioejesig = $objejesig->inicio;
        // para saber si hay informacion en la lista de chequeo
        $flagvacio=false;
        if (count($arrdatos) == 0) {
            $flagvacio=true;
        }
        
        // para saber si se esta en fin de mes o no 
        $nofinmes = false;  
        if ($fechaContable < $fin) {
            $nofinmes = true;
        }  
        
        $flaglista=false;
        if (count($lista) > 0) {
            $flaglista=true;
        }

        $flag = false;
        if (count($objPeriodo) > 0) {
            $flag = true;
        } else {
            $flag = $this->confirmadoCerrarPeriodo($identidad, $idsubsistem, $flag, $nombreperiodo);
        }
       
        // para saber si hay diferencia en los importes
        $flagdif= false;
        if (($flagdiferencia== 1) ) {
            $flagdif= true;
        } 

        $compfecha= $this->compararFechas($fechaContable,$fin);
        $success=false;
       if ($compfecha==1 && (count($arrdatos) > 0) &&  ($flagdiferencia==0)  )  {
            $success = true;
            $fecha = "$inicioperiodosig";
            list($date, $month, $year) = explode('/', $fecha);
            $nueva = mktime(0, 0, 0, $month, $date, $year);
            $nuevafecha = date("d/m/Y", $nueva);
            $this->integrator->datosmaestros->actualizarFechaSubsistema($identidad, $idsubsistem, $nuevafecha);
        }

        return array('flagvacio' => $flagvacio,'nofinmes' => $nofinmes, 'flagdif'=> $flagdif ,'flaglista' => $flaglista,'success'=> $success, 
                    'flageje' => $flageje , 'fecha'=> $fecha, 'nombreperiodosig' => $nombreperiodosig, 'fecha13' => $fecha13, 
                     'inicio13'=> $inicio13, 'nombre13'=> $nombre13, 'fin13'=> $fin13 , 'inicioperiodosig' => $inicioperiodosig
                     ,'finperiodosig' => $finperiodosig);
    }

    public function confirmadoCerrarPeriodo($identidad, $idsubsistem, &$flag = false, $nombreperiodo)
    {
        if ($this->integrator->datosmaestros->cerrarPeriodo($identidad, $idsubsistem)) {
            $this->integrator->datosmaestros->realizarApertura($identidad, $idsubsistem);
            $flag = true;
            $this->guardarPeriodoCerrado(true);
            return $nombreperiodo;
        } else {
            return null;
        }
    }

    public function cierreEjercicio($identidad, $inicio, $fin, $arrdatos, $start,$limit,$idejercicio,$estado) 
    { 
        $arridelabpa = $this->ObtenerIDPAGO($identidad, $inicio, $fin, $estado);
        if (count($arridelabpa)>0) {
            foreach ($datospago as $datos) {
                $idelabpago[] = $datos['idelaborarpagos'];
             }
              $arridelabpago = implode("','", $idelabpago);   
            
             $lista=$this->ListasChequeo($identidad, $start,$limit,$arridelabpa);
            }
            $idsubsistem = $this->global->Subsistema->idsubsistema;

            $idejesig= $this->integrator->datosmaestros->ejercicioSiguiente($idejercicio);          
            $objejesig= $this->integrator->datosmaestros->obtenerEjercicio($idejesig); 
            $fechaContable = $this->integrator->datosmaestros->fechaContableSubsistema($identidad, $idsubsistem);
            $nombreejesig = $objejesig[0]->nombre;
            $inicioejesig = $objejesig[0]->inicio;
            $finejesig = $objejesig[0]->fin;
            $store = $this->storeDatos($arrdatos);
            $flagdiferencia = $store['flagdiferencia'];
            $fecha = "";
            $nuevafecha = "";

            $falgvacio=false;
            if (count($arrdatos)==0) {
                $falgvacio=true;
            }

            $flaglista=false;
            if (count($lista)> 0 ) {
                $flaglista=true;
            }

            $flagdif= false;
            if (($flagdiferencia== 1) ) {
                $flagdif = true;
            } 
           
            $success=false;
            if (($fechaContable== $fin) && ($fechaContable== $fineje) && ($fin== $fineje) && ($inicio==$fineje) && (count($arrdatos) > 0) && ($flagdiferencia== 0) ) {
                $success = true;
                $fecha = $inicioejesig;
                list($date, $month, $year) = explode('/', $fecha);
                $nueva = mktime(0, 0, 0, $month, $date, $year);
                $nuevafecha = date("d/m/Y", $nueva);
                $this->integrator->datosmaestros->actualizarFechaSubsistema($identidad, $idsubsistem, $nuevafecha);
            }
            
            if (count($ejACT) > 0) {
                $flag = true;
            } else {
                $ejACT = $this->confirmadoCerrarEjercicio($identidad, $idsubsistem, $flag, $nombreeje);
            }
       
        return array('flagvacio' => $falgvacio,  'flagdif' => $flagdif,'flaglista'=>$flaglista, 'success' => $success,
                    'nombreejesig' => $nombreejesig, 'inicioejesig' => $inicioejesig, 'fecha' => $fecha,
                    'finejesig' => $finejesig  );
    }

    public function confirmadoCerrarEjercicio($identidad, $idsubsistem, &$flag = false, $nombreeje) 
    {
        if ($this->integrator->datosmaestros->cerrarPeriodo($identidad, $idsubsistem)) {
            ;
            $this->integrator->datosmaestros->realizarApertura($identidad, $idsubsistem);
            $flag = true;
            return $nombreeje;
        } else {
            return null;
        }
    }

    public function pasarDia($identidad , $inicio , $fin , $arrdatos, $start,$limit,$idejericio,$idperiodo,$estado) 
    {
        $arridelabpago = $this->ObtenerIDPAGO($identidad, $inicio, $fin, $estado);
        if (count($arridelabpago)>0) {
            foreach ($arridelabpago as $datos) {
                $idelabpago[] = $datos['idelaborarpagos'];
             }
              $arridelab = implode("','", $idelabpago);   
              $lista=$this->ListasChequeo($identidad, $start,$limit,$arridelabpago);
        }
        $idsubsistem = $this->global->Subsistema->idsubsistema;
        $responseData = array();
        $fechaContable = $this->integrator->datosmaestros->fechaContableSubsistema($identidad, $idsubsistem);
        $objPeriodo= $this->integrator->datosmaestros->obtenerPeriodo($idperiodo);
        $nombreperiodo=$objPeriodo->nombre;
        $inicioperiodo=$objPeriodo->inicio;
        $finperiodo=$objPeriodo->fin;
        $store = $this->storeDatos($arrdatos);
        $flagdiferencia = $store['flagdiferencia']; 
        
        $falgvacio=false;
        if (count($arrdatos)==0) {
            $falgvacio=true;
        }

        $flaglista=false;
        if (count($lista)> 0 ) {
            $flaglista=true;
        }
       $flagdif= false;
        if (($flagdiferencia== 1)) {
            $flagdif = true;
        } 
    

        $flagfinmes= false ;
        if (($fin== $fechaContable)) {
            $flagfinmes =  true;
        }  

       
        $fecha=0;
        $success = false;
        if (($fechaContable < $fin) && (count($arrdatos) > 0) && ($flagdiferencia== 0) ) {
            list($dia, $mes, $anno) = explode('/', $fechaContable);
                $dian = $dia + 1;
                $fecha = "$dian/$mes/$anno";
                list($date, $month, $year) = explode('/', $fecha);
                $nueva = mktime(0, 0, 0, $month, $date, $year);
                $nuevafecha = date("d/m/Y", $nueva);
                $this->integrator->datosmaestros->actualizarFechaSubsistema($identidad, $idsubsistem, $nuevafecha); 
                $success = true;
            }
        
        return array('flagvacio'=>$falgvacio,'flagfinmes' => $flagfinmes,'flagdif'=>$flagdif,'flaglista'=>$flaglista,  'success' => $success, 
        'fechaContable' => $fechaContable, 'fecha' => $fecha, 'nombreperiodo'=>$nombreperiodo , 'inicioperiodo'=> $inicioperiodo , 'finperiodo' => $finperiodo);

    }
  
    public function obtenerDatosCuentas($arridelabpago, $cuentas, $identidad, $inicio, $fin, $start, $limit, $idperiodo) 
    {
        $idEstructuraE = $this->EstructuraEconomica($identidad);
       // $caja= $this->Caja($identidad,$idperiodo,$idEstructuraE);
        $mg=Doctrine_Manager::getInstance();
        $conn=$mg->getCurrentConnection();
        $resultado=[];
        if (count($arridelabpago)>0) {
            foreach ($arridelabpago as $key => $value) {
                $idelabpa[] =  $value['idelaborarpagos'];
            }
             $idelabpago = implode("','", $idelabpa);   
            $sqlestados = "SELECT DISTINCT dtn.aprobada , de.idcomprobantecancelacion,de.idcomprobanteoperaciones, ne.idestadocomprobante
            FROM mod_nomina.dat_nomina dtn
            inner join mod_nomina.dat_elaborarpagos de on (de.idelaborarpagos = dtn.idelaborarpago)
            inner join  mod_contabilidad.dat_comprobante  dc on (dc.idcomprobante = de.idcomprobanteoperaciones  )
            inner join  mod_contabilidad.nom_estadocomprobante ne on (dc.idestadocomprobante = ne.idestadocomprobante)
            WHERE  dtn.idelaborarpago IN ('$idelabpago') "; 
            $estados=$conn->fetchAll($sqlestados); 
            $prueba=0;
            $noprueba=0;
            $cert=0;
            $contab=0;
            $contabcont=0;
            foreach ($estados as $key => $value) {
            if ($value['aprobada']==1) {
                $prueba=1;
            }
            elseif ($value['aprobada']==0) {
                $noprueba=2;
            }
            elseif ($value['aprobada']==-1 && $value['idcomprobantecancelacion'] != null) {
                    $cert=3;
            }
            elseif ($value['aprobada']==-1 && $value['idcomprobanteoperaciones'] != null) {
            if ($value['idestadocomprobante'] == 8032) {
                    $contabcont=5;
            }
            else {
                $contab=4;
            }
            }
            }
            $dat=[$prueba,$noprueba,$cert,$contab, $contabcont]; 
            $datos1=[]; 
            $datos2=[]; 
            $datos3=[]; 
            $datos4=[];  
            foreach ($dat as $key => $value) {
                if ($value == 5 || $value == 1) {
                    $value=1;
                    $datos1= $this->Datos($value ,$idelabpago, $cuentas, $identidad, $inicio, $fin, $idEstructuraE);
                }
                elseif ($value == 2) {
                    $datos2= $this->Datos($value,$idelabpago, $cuentas, $identidad, $inicio, $fin, $idEstructuraE);
                }
                elseif ($value == 3) {
                    $datos3= $this->Datos($value,$idelabpago, $cuentas, $identidad, $inicio, $fin, $idEstructuraE);
                }
                elseif ($value == 4) {
                    $datos4= $this->Datos($value,$idelabpago, $cuentas, $identidad, $inicio, $fin, $idEstructuraE);
                }
            }
            $resultado = array_merge($datos1, $datos2, $datos3, $datos4);
        }
       
     
        return $resultado;
    }

    public function Datos($estado,$arridelabpago, $cuentas, $identidad, $inicio, $fin, $idEstructuraE) 
    {
        $datos=[];   
        $concontabi=0;
        $contcontab=0;
        $contcertifi=0;
        $contcertif=0;
        $contnapi=0;
        $contnap=0;
        $contap = 0;
        $mg=Doctrine_Manager::getInstance();
        $conn=$mg->getCurrentConnection();
            switch ($estado) {
                case '1':
                    $sqlaprobada = "SELECT DISTINCT dc.idcuenta, dc.concatcta as cuentas, concat(tp.denominacion, ' - ', dc.denomcuenta) as denominacion, tp.idtipopago
                                    FROM mod_nomina.nom_cuentascierre cc
                                    LEFT JOIN mod_nomina.dat_comprobantenomina dc on (dc.idcuenta = cc.idcuenta)
                                    LEFT JOIN mod_nomina.dat_elaborarpagos de on (dc.idelaborarpagos = de.idelaborarpagos)
                                    LEFT JOIN mod_nomina.dat_nomina dtn on (dc.idelaborarpagos = dtn.idelaborarpago)
                                    LEFT JOIN mod_contabilidad.res_centroelem_saldo rc on (dc.idcuenta = rc.idcuenta)
                                    LEFT JOIN mod_nomina.nom_tipopago tp on (de.idtipopago = tp.idtipopago)
                                    WHERE dc.idcuenta IN ('$cuentas')
                                        AND dc.idelaborarpagos IN ('$arridelabpago')
                                        AND rc.idestructurae = $idEstructuraE
                                    GROUP BY  dc.idcuenta,dc.concatcta, dc.denomcuenta, tp.idtipopago,
                                        tp.denominacion
                                    ORDER BY dc.idcuenta ASC";
                    $info = $conn->fetchAll($sqlaprobada); 
                    foreach ($info as $key) {
                        $final[$contap]['idperiodo'] = $idPeriodo;
                        $final[$contap]['cuentas'] = $key['cuentas'];
                        $final[$contap]['contab'] = $this->Contab($key['idcuenta'], $key['idtipopago'], $arridelabpago, $idEstructuraE);
                        $final[$contap]['identidad'] = $identidad;
                        $final[$contap]['denominacion'] = $key['denominacion'];
                        $final[$contap]['nomina'] = $this->Nomina($key['idcuenta'], $key['idtipopago'], $arridelabpago, $idEstructuraE);
                        $final[$contap]['estado'] = 'Aprobada' ;
                        $contap++;
                    }
                break;
                case '2':
                    $sqlnoaprobada="SELECT DISTINCT dt.denominacion
                                    FROM mod_nomina.dat_elaborarpagos dc 
                                    INNER JOIN mod_nomina.nom_tipopago dt ON (dc.idtipopago = dt.idtipopago)
                                        where dC.idelaborarpagos in ('$arridelabpago') ";
                    $datno = $conn->fetchAll($sqlnoaprobada); 
                    foreach ($datno as $key => $value) {
                    $final[$contnap]['idperiodo'] = $idPeriodo;
                    $final[$contnap]['cuentas'] = '';
                    $final[$contnap]['contab'] = 0;
                    $final[$contnap]['identidad'] = $identidad;
                    $final[$contnap]['denominacion'] = $value['denominacion'];
                    $final[$contnap]['nomina'] = 0;
                    $final[$contnap]['estado'] =  'Elaborada' ;
                    $contnap++;
                    }
                break;
                case '3':
                    $sqlcertificada="SELECT DISTINCT dt.denominacion
                                        FROM mod_nomina.dat_elaborarpagos dc 
                                        INNER JOIN mod_nomina.nom_tipopago dt ON (dc.idtipopago = dt.idtipopago)
                                            where dC.idelaborarpagos in ('$arridelabpago') ";
                    $datsep2 = $conn->fetchAll($sqlcertificada); 
                    foreach ($datsep2 as $key => $value) {
                      $final[$contcertif]['idperiodo'] = $idPeriodo;
                      $final[$contcertif]['cuentas'] = '';
                      $final[$contcertif]['contab'] = 0;
                      $final[$contcertif]['identidad'] = $identidad;
                      $final[$contcertif]['denominacion'] = $value['denominacion'];
                      $final[$contcertif]['nomina'] = 0;
                      $final[$contcertif]['estado'] =  'Certificada' ;
                      $contcertif++;
                    }
                break;
                case '4':
                    $sqlcontabilizado=" SELECT DISTINCT dc.idcuenta, dc.concatcta as cuentas, concat(tp.denominacion, ' - ', dc.denomcuenta) as denominacion, tp.idtipopago,dc.importe
                                        FROM mod_nomina.nom_cuentascierre cc
                                        LEFT JOIN mod_nomina.dat_comprobantenomina dc on (dc.idcuenta = cc.idcuenta)
                                        LEFT JOIN mod_nomina.dat_elaborarpagos de on (dc.idelaborarpagos = de.idelaborarpagos)
                                        LEFT JOIN mod_nomina.dat_nomina dtn on (dc.idelaborarpagos = dtn.idelaborarpago)
                                        LEFT JOIN mod_nomina.nom_tipopago tp on (de.idtipopago = tp.idtipopago)
                                        WHERE dc.idcuenta IN ('$cuentas')
                                            AND dc.idelaborarpagos IN ('$arridelabpago')
                                        GROUP BY  dc.idcuenta,dc.concatcta, dc.denomcuenta, tp.idtipopago,dc.importe
                                        ORDER BY dc.idcuenta ASC";
                    $datsepcert = $conn->fetchAll($sqlcontabilizado); 
                    foreach ($datsepcert as $key => $value) {
                    $final[$contcontab]['idperiodo'] = $idPeriodo;
                    $final[$contcontab]['cuentas'] = $value['cuentas'];
                    $final[$contcontab]['contab'] = 0;
                    $final[$contcontab]['identidad'] = $identidad;
                    $final[$contcontab]['denominacion'] = $value['denominacion'];
                    $final[$contcontab]['nomina'] = $this->Nomina($value['idcuenta'], $value['idtipopago'], $arridelabpago, $idEstructuraE);
                    $final[$contcontab]['estado'] =  'Contabilizada' ;
                    $contcontab++;
                    }
                break;
                case '5':
                    $sqlaprobada = "SELECT DISTINCT dc.idcuenta, dc.concatcta as cuentas, concat(tp.denominacion, ' - ', dc.denomcuenta) as denominacion, tp.idtipopago
                                    FROM mod_nomina.nom_cuentascierre cc
                                    LEFT JOIN mod_nomina.dat_comprobantenomina dc on (dc.idcuenta = cc.idcuenta)
                                    LEFT JOIN mod_nomina.dat_elaborarpagos de on (dc.idelaborarpagos = de.idelaborarpagos)
                                    LEFT JOIN mod_nomina.dat_nomina dtn on (dc.idelaborarpagos = dtn.idelaborarpago)
                                    LEFT JOIN mod_contabilidad.res_centroelem_saldo rc on (dc.idcuenta = rc.idcuenta)
                                    LEFT JOIN mod_nomina.nom_tipopago tp on (de.idtipopago = tp.idtipopago)
                                    WHERE dc.idcuenta IN ('$cuentas')
                                        AND dc.idelaborarpagos IN ('$arridelabpago')
                                        AND rc.idestructurae = $idEstructuraE
                                    GROUP BY  dc.idcuenta,dc.concatcta, dc.denomcuenta, tp.idtipopago,
                                        tp.denominacion
                                    ORDER BY dc.idcuenta ASC";
                    $info = $conn->fetchAll($sqlaprobada); 
                    foreach ($info as $key) {
                        $final[$contap]['idperiodo'] = $idPeriodo;
                        $final[$contap]['cuentas'] = $key['cuentas'];
                        $final[$contap]['contab'] = $this->Contab($key['idcuenta'], $key['idtipopago'], $arridelabpago, $idEstructuraE);
                        $final[$contap]['identidad'] = $identidad;
                        $final[$contap]['denominacion'] = $key['denominacion'];
                        $final[$contap]['nomina'] = $this->Nomina($key['idcuenta'], $key['idtipopago'], $arridelabpago, $idEstructuraE);
                        $final[$contap]['estado'] = 'Contabilizada' ;
                        $contap++;
                    }
                break;
            }    
      return $final;   
       
    }

    public function Contab($id, $tipopago, $arridelabpago, $idEstructuraE) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //$idEstructuraE = $this->global->EstructuraEconomica->idestructurae;
        $sqlNaturaleza = "SELECT idnaturaleza FROM mod_contabilidad.nom_cuenta  where idcuenta = $id";
        $resNaturaleza = $conn->fetchAll($sqlNaturaleza);
        //8030-Acreedora, 8031-Deudora, 8032-Mixta
        $idNaturaleza = $resNaturaleza[0]['idnaturaleza'];
        $cont = 0;
        $sql = "SELECT (case when $idNaturaleza = 8030 then  (rc.creditomb + rc.debitomb) else (rc.debitomb + rc.creditomb ) end) as saldo
                        from mod_nomina.dat_comprobantenomina dc 
                        inner join mod_contabilidad.res_centroelem_saldo rc on (dc.idcuenta = rc.idcuenta) 
                        inner join mod_nomina.dat_elaborarpagos de on (dc.idelaborarpagos = de.idelaborarpagos)
                        inner join mod_nomina.nom_cuentascierre cc on (dc.idcuenta = cc.idcuenta) 
                        inner join mod_nomina.nom_tipopago tp on (de.idtipopago = tp.idtipopago)
                        where dc.idcuenta = '$id' 
                        and de.idtipopago=('$tipopago')
                        and de.idcomprobanteoperaciones= rc.idcomprobante
                        and dc.idelaborarpagos in ('$arridelabpago')
                        and rc.idestructurae = $idEstructuraE ; ";
        $Saldo = $conn->fetchAll($sql);
        $total = $Saldo[0]['saldo'];
        return $total;
    }

    public function Nomina($id, $tipopago, $arridelabpago, $idEstructuraE) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        //$idEstructuraE = $this->global->EstructuraEconomica->idestructurae;
        $cont = 0;
        $sql = "SELECT  (case when dc.debitocredito = 1 then dc.importe else  dc.importe end) as saldo
                        from mod_nomina.dat_comprobantenomina dc 
                        inner join mod_contabilidad.res_centroelem_saldo rc on (dc.idcuenta = rc.idcuenta) 
                        inner join mod_nomina.dat_elaborarpagos de on (dc.idelaborarpagos = de.idelaborarpagos) 
                        inner join mod_nomina.nom_cuentascierre cc on (dc.idcuenta = cc.idcuenta) 
                        inner join mod_nomina.nom_tipopago tp on (de.idtipopago = tp.idtipopago)
                        where dc.idcuenta = '$id'
                        and de.idtipopago=('$tipopago')
                        and de.idcomprobanteoperaciones= rc.idcomprobante
                        and dc.idelaborarpagos in ('$arridelabpago')
                        and rc.idestructurae = $idEstructuraE ;";
        $Saldo = $conn->fetchAll($sql);
        $total = $Saldo[0]['saldo'];
        return $total;
    }

    public function SaldoNominaVac($identidad, $mes, $anno) 
    {
        $objElaborarP = new DatElaborarPagosModel();
        $objReportePDF = new ReporteSubVacacionespdfModel();
        $objvacaciones = new DatVacacionesPersona();
        $objhisvacaciones = new HisVacacionesPersona();
        $periodo = $mes . '-' . $anno;
        $acumuladovac = 0;

        //Recorriendo cada periodo de pago de la entidad *****************************************************
        $arrsaldosfinales = array();
        $personasvacaciones = $objvacaciones->obtenerPersonasHanIniciadoSubMayorVac($identidad, null);
        //while (!empty($personasvacaciones) ) {
        $arrtodasoperacionespersonas = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, $periodo);
        //Operaciones del mes anterior
        $mesanterior = (intval($mes)== 1) ? 12 : intval($mes) - 1;
        $annomesanterior = (intval($mes)== 1) ? $anno - 1 : $anno;
        $arrultimaoperacionmesanterior = $objhisvacaciones->obtenerTodasOperacionesDePeriodoSubMayor($identidad, ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior);

        //Por cada persona
        $arrdatos = $objhisvacaciones->datosPersonaDadoId($identidad);
        $arrdatpersona = array();
        foreach ($arrdatos as $p) {
            $arrdatpersona[$p['idpersona']] = $p;
        }

        //Llenando el arreglo de personas con sus operaciones por periodos
        $contpersona = 0;
        $arraypersonas = array();
        $periodobuscar = ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior;
        foreach ($personasvacaciones as $i => $valor) {
            $arraypersonas[$contpersona]['idarea'] = $arrdatpersona[$valor['idpersona']]['idarea'];
            $arraypersonas[$contpersona]['area'] = $arrdatpersona[$valor['idpersona']]['area'];

            $arraypersonas[$contpersona]['idpersona'] = $valor['idpersona'];
            $arraypersonas[$contpersona]['idvacacionespersona'] = $valor['idvacacionespersona'];

            $arraypersonas[$contpersona]['tiempoacumuladoinicial'] = round($valor['tiempoacumuladoinicial'], 2);
            $arraypersonas[$contpersona]['importeacumuladoinicial'] = round($valor['importeacumuladoinicial'], 2);

            //Operación de acumulación total en días en el período para la persona en cuestión.
            $acumulaciontotaldias = 0;
            //Operación de acumulación total en importe en el período para la persona en cuestión.
            $acumulaciontotalimporte = 0;
            //Operación de liquidación total en días en el período para la persona en cuestión.
            $liquidaciontotaldias = 0;
            //Operación de liquidación total en importe en el período para la persona en cuestión.
            $liquidaciontotalimporte = 0;
            //Ajuste total en días en el período para la persona en cuestión.
            $ajustetiempo = 0;
            //Ajuste total en importe en el período para la persona en cuestión.
            $ajusteimporte = 0;
            //Tipo de ajuste
            $tipoajuste = 0;

            $contultimoajuste = 0;
            foreach ($arrtodasoperacionespersonas as $o => $operacionespersona) {
                if ($operacionespersona['idvacacionespersona']== $valor['idvacacionespersona']) {
                    //Listando las operaciones de un a persona especifica para este periodo
                    if ($operacionespersona['tipooperacion']== 1) {
                        $acumulaciontotaldias += $operacionespersona['tiempoacumulado'];
                        $acumulaciontotalimporte += $operacionespersona['importeacumulado'];
                    } elseif ($operacionespersona['tipooperacion']== 2) {
                        $liquidaciontotaldias += $operacionespersona['tiempoacumulado'];
                        $liquidaciontotalimporte += $operacionespersona['importeacumulado'];
                    }

                    if (!empty($operacionespersona['tipoajuste']) && empty($contultimoajuste)) {
                        $ajustetiempo = $operacionespersona['ajustetiempo'];
                        $ajusteimporte = $operacionespersona['ajusteimporte'];
                        $tipoajuste = $operacionespersona['tipoajuste'];
                        $contultimoajuste++;
                    }
                }
            }

            //saldoinicial del mes anterior
            $operacionesmesanterior = array();
            $cont = 0;
            $flagoperaciones = 0;
            foreach ($arrultimaoperacionmesanterior as $o => $operacionesmesantpersona) {
                if ($operacionesmesantpersona['idvacacionespersona']== $valor['idvacacionespersona']) {
                    $operacionesmesanterior[$cont]['saldoentiempo']= $operacionesmesantpersona['saldoentiempo'];
                    $operacionesmesanterior[$cont]['saldoenimporte']= $operacionesmesantpersona['saldoenimporte'];
                    $operacionesmesanterior[$cont]['operacioncompleta']= $operacionesmesantpersona;
                    $cont++;
                    $flagoperaciones = 1;
                }
            }


            //Si la persona no tuvo ninguna operacion el mes anterior se busca el saldo de la ultima operacion q tuvo
            if ($flagoperaciones== 0) {
                //Get periodos submayor de la persona
                $periodosacumulados = HisVacacionesPersona::obtenerPeriodosAcumulados($valor['idvacacionespersona']);
                if (count($periodosacumulados) > 0) {
                    foreach ($periodosacumulados as $pacum) {
                        //Periodo mes anterior parametros
                        $rexplodepb = explode('-', $periodobuscar);
                        $periodobuscarconcat = $rexplodepb[1] . $rexplodepb[0];
                        //Periodos acumulados
                        $rexplodepa = explode('-', $pacum['periodo']);
                        $periodobuscararray = $rexplodepa[1] . $rexplodepa[0];
                        if ($periodobuscararray < $periodobuscarconcat) {
                            $hisvacacionesultimo = HisVacacionesPersona::obtenerTodoHisVacacionesPersona($pacum['idhisvacacionespersona']);
                            $operacionesmesanterior[$cont]['saldoentiempo'] = $hisvacacionesultimo[0]['saldoentiempo'];
                            $operacionesmesanterior[$cont]['saldoenimporte'] = $hisvacacionesultimo[0]['saldoenimporte'];
                            $operacionesmesanterior[$cont]['operacioncompleta'] = $hisvacacionesultimo[0];
                            $cont++;
                        }

                    }
                }
            }

            if (empty($operacionesmesanterior)) {
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $sql = "select hv.idhisvacacionespersona
                                from mod_nomina.his_vacacionespersona hv
                                where hv.idvacacionespersona = ? and hv.periodo = ?";
                $ridcomparacion = $conn->fetchAll($sql, array($valor['idvacacionespersona'], $mes . "-" . $anno));

                $sql = "select hv.*
                                from mod_nomina.his_vacacionespersona hv
                                where hv.idhisvacacionespersona < ? and hv.idvacacionespersona = ? and hv.periodo <> ? order by hv.idhisvacacionespersona DESC";
                $r = $conn->fetchAll($sql, array($ridcomparacion[0]['idhisvacacionespersona'], $valor['idvacacionespersona'], $mes . "-" . $anno));

                if (empty($r)) {
                    $arraypersonas[$contpersona]['saldotiempomesanterior'] = round($valor['tiempoacumuladoinicial'], 2);
                    $arraypersonas[$contpersona]['saldoimportemesanterior'] = round($valor['importeacumuladoinicial'], 2);
                } else {
                    $arraypersonas[$contpersona]['saldotiempomesanterior'] = round($r[0]['saldoentiempo'], 2);
                    $arraypersonas[$contpersona]['saldoimportemesanterior'] = round($r[0]['saldoenimporte'], 2);
                }

            } else {
                $arraypersonas[$contpersona]['saldotiempomesanterior'] = $operacionesmesanterior[0]['saldoentiempo'];
                $arraypersonas[$contpersona]['saldoimportemesanterior'] = $operacionesmesanterior[0]['saldoenimporte'];
            }


            //acumulado mes
            $arraypersonas[$contpersona]['tiempoacumulado'] = (!empty($acumulaciontotaldias)) ? $acumulaciontotaldias : 0.00;
            $arraypersonas[$contpersona]['importeacumulado'] = (!empty($acumulaciontotalimporte)) ? $acumulaciontotalimporte : 0.00;

            //liquidado mes
            $arraypersonas[$contpersona]['tiempoliquidado'] = (!empty($liquidaciontotaldias)) ? $liquidaciontotaldias : 0.00;
            $arraypersonas[$contpersona]['importeliquidado'] = (!empty($liquidaciontotalimporte)) ? $liquidaciontotalimporte : 0.00;

            //ajuste
            $arraypersonas[$contpersona]['ajustetiempo'] = (!empty($ajustetiempo)) ? $ajustetiempo : '';
            $arraypersonas[$contpersona]['ajusteimporte'] = (!empty($ajusteimporte)) ? $ajusteimporte : '';
            $arraypersonas[$contpersona]['tipoajuste'] = (!empty($tipoajuste)) ? $tipoajuste : 0;

            //saldo final
            $ajustetiempo = ($tipoajuste== 2) ? (-1) * $ajustetiempo : $ajustetiempo;
            $ajusteimporte = ($tipoajuste== 2) ? (-1) * $ajusteimporte : $ajusteimporte;
            $acumulaciontotaldiasmes = $acumulaciontotaldias - $liquidaciontotaldias + $ajustetiempo;
            $acumulaciontotalimportemes = $acumulaciontotalimporte - $liquidaciontotalimporte + $ajusteimporte;
            $arraypersonas[$contpersona]['saldoentiempo'] = $arraypersonas[$contpersona]['saldotiempomesanterior'] + $acumulaciontotaldiasmes;
            $arraypersonas[$contpersona]['saldoenimporte'] = $arraypersonas[$contpersona]['saldoimportemesanterior'] + $acumulaciontotalimportemes;
            $contpersona++;
        }

        //Obteniendo todas las personas bajas de la entidad que tienen operaciones en el periodo de pago
        $personasbajasperiodo = HisVacacionesPersonaBajaModel::obtenerPersonasBajasPeriodo($identidad, $mes, $anno);

        //Si la persona fue baja en este periodo y ahora es alta en la entidad, se muestran solo las operaciones de baja
        foreach ($personasbajasperiodo as $personabaja) {
            foreach ($arraypersonas as $i => $personaalta) {
                if ($personabaja['idpersona']== $personaalta['idpersona']) {
                    unset($arraypersonas[$i]);
                }
            }
        }
        $arraypersonas = array_values($arraypersonas);

        //Sumando los subtotales del saldo en tiempo y en importe por periodos --- personas ALTAS
        $sumPorCentro = array();
        foreach ($arraypersonas as $i => $persona) {
            //Saldo inicial
            $sumPorCentro['diasinicial'] += ($persona['saldotiempomesanterior'] < 0) ? 0 : $persona['saldotiempomesanterior'];
            $sumPorCentro['importeinicial'] += ($persona['saldoimportemesanterior'] < 0) ? 0 : $persona['saldoimportemesanterior'];
            //Saldo final
            $sumPorCentro['diasfinal'] += ($persona['saldoentiempo'] < 0) ? 0 : $persona['saldoentiempo'];
            $sumPorCentro['importefinal'] += ($persona['saldoenimporte'] < 0) ? 0 : $persona['saldoenimporte'];
        }

        //Sumando los subtotales del saldo en tiempo y en importe por periodos --- personas BAJAS
        foreach ($personasbajasperiodo as $b => $bajas) {
            //Saldo inicial
            $sumPorCentro['diasinicial'] += ($bajas['saldotiempomesanterior'] < 0) ? 0 : $bajas['saldotiempomesanterior'];
            $sumPorCentro['importeinicial'] += ($bajas['saldoimportemesanterior'] < 0) ? 0 : $bajas['saldoimportemesanterior'];
            //Saldo final
            $sumPorCentro['diasfinal'] += ($bajas['saldoentiempo'] < 0) ? 0 : $bajas['saldoentiempo'];
            $sumPorCentro['importefinal'] += ($bajas['saldoenimporte'] < 0) ? 0 : $bajas['saldoenimporte'];
        }
        $arrmeses = array();
        $per = '';
        //Guardando los saldos iniciales y finales por cada periodo, asi como el año y mes de cada periodo.
        $arrsaldosfinales[$anno . '-' . $mes]['diasinicial'] = $sumPorCentro['diasinicial'];
        $arrsaldosfinales[$anno . '-' . $mes]['importeinicial'] = $sumPorCentro['importeinicial'];

        $arrsaldosfinales[$anno . '-' . $mes]['diasfinal'] = $sumPorCentro['diasfinal'];
        $arrsaldosfinales[$anno . '-' . $mes]['importefinal'] = $sumPorCentro['importefinal'];

        $arrsaldosfinales[$anno . '-' . $mes]['anno'] = $anno;
        $arrsaldosfinales[$anno . '-' . $mes]['mes'] = $arrmeses[intval($mes) - 1]['denominacion'];
        $arrsaldosfinales[$anno . '-' . $mes]['fecha'] = $per;

        foreach ($arrsaldosfinales as $key) {
            $acumuladovac = $key['importefinal'];
        }
        $total = $acumuladovac;
        return $total;
    }
 
    public function adicionarInfo($datos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $pos = 0;
        $fecha = $datos['fecha'][0];
        $array_fechas = explode(" -- ", $fecha);
        $fecha_inicio = ($array_fechas[0]);
        $fecha_final = $array_fechas[1];
        $inicio = date("d/m/Y", $fecha_inicio);
        $fin = date("d/m/Y", $fecha_final);
        $verifyperiodo = "
            SELECT idcierrenomina
            FROM mod_nomina.dat_cierrenomina 
            where idperiodo = {$datos['idperiodo'][0]} and identidad =  {$datos['identidad'][0]}
        ";
        $resultverify = $conn->fetchAll($verifyperiodo);
        if (count($resultverify) > 0) {
            for ($i=0; $i < count($datos['cuentas']) ; $i++) { 
            $sqlupdate="UPDATE 
            mod_nomina.dat_cierrenomina 
          SET 
            idperiodo =  {$datos['idperiodo'][$i]},
            identidad =  {$datos['identidad'][$i]},
            cuenta =  {$datos['cuentas'][$i]},
            tipopago =  {$datos['tipo'][$i]},
            estado =  {$datos['estado'][$i]},
            importecont =  {$datos['contab'][$i]},
            importenomina =  {$datos['diferencia'][$i]},
            diferenciaimporte =  {$datos['nomina'][$i]},
          WHERE 
           idperiodo = {$datos['idperiodo'][0]} and identidad =  {$datos['identidad'][0]}";
            $result = $conn->fetchAll($sql);
            }
            $conn->commit();
            return true;
        }
        for ($i=0; $i < count($datos['cuentas']) ; $i++) { 
            $sql = "INSERT INTO 
            mod_nomina.dat_cierrenomina
        (
            idperiodo,
            identidad,
            cuenta,
            tipopago,
            estado,
            importecont,
            importenomina,
            diferenciaimporte
        )
        VALUES (
            {$datos['idperiodo'][$i]},
            {$datos['identidad'][$i]},
            {$datos['cuentas'][$i]},
            {$datos['tipo'][$i]},
            {$datos['estado'][$i]},
            {$datos['contab'][$i]},
            {$datos['diferencia'][$i]},
            {$datos['nomina'][$i]},
        );  ";
        $result = $conn->fetchAll($sql);
        }
       
        $conn->commit();
        return true;
    }

    public function validarCentrosCostoCargos($identidad,$start, $limit) 
    {
      //  $datosEstructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
       $objperB = new DatCierreNomina();
        $model = new DatCargosOcupadosModel();
        $php = new DatCierreNomina();
        $mg = Doctrine_Manager::getInstance();
       $conn = $mg->getCurrentConnection();
       $cont=0;
       $final=[];
       $sqlPersSinCC = "SELECT DISTINCT dco.idcargosocupados, dco.idpersona, dco.idcargo,
                        nc.denominacion as denomcargo,
                        doc.numero as numid,
                        dp.nombre,
                        dp.snombre,
                        dp.papel, ncc.descripcioncentrogrupo,
                        dp.sapel
                            FROM mod_nomina.dat_cargosocupados dco
                            INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = dco.idpersona)
                            INNER join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
                            left JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
                            left JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
                            left join mod_contabilidadcosto.nom_centrocosto ncc on (ncc.idcentrogrupo = dco.idcentrocosto)
                            where dco.identidad = ? and ncc.idcentrogrupo is null;";
        $personassincentcosto = $conn->fetchAll($sqlPersSinCC, array($identidad)); 
        foreach ($personassincentcosto as $i => $value) {
            $final[$cont]['orden']=1;
            $final[$cont]['denomorden']="Las siguientes personas no pertenecen a ningún centro de costo";
            $final[$cont]['nombre'] = ($value['nombre'] != null) ? $value['nombre'] . ' ' . $value['snombre'] . ' ' . $value['papel'] . ' ' . $value['sapel'] : 'No hay personas con plantilla nominal';
            $final[$cont]['denomcargo'] = ($value['idcargo'] != null) ? $value['denomcargo'] : '--';
            $final[$cont]['ci'] = ($value['numid'] != null) ? $value['numid'] : '0';
            $final[$cont]['centrocosto'] = $value['descripcioncentrogrupo'] ;
            $final[$cont]['denom']='';
            $final[$cont]['tipo']='';
            $final[$cont]['sit']='';
            $cont++;
        } 
        $c=0;
        $dat=[];
        for ($i=0; $i <count($final) ; $i++) { 
            $dat[$c]['orden']=$final[$i]['orden'].'('.count($final).')';
            $dat[$c]['denomorden']= $final[$i]['denomorden'];
            $dat[$c]['nombre'] =$final[$i]['nombre'].'  ->'. $final[$i]['ci'].'  -> '. $final[$i]['denomcargo'].'  -> '. $final[$i]['centrocosto'];
            $c++;
        }
        return $dat;
    }
     
    public function personasSinSubmayorVacacIniciado($identidad, $start, $limit)
    {
        $arrayfinal = array();
        $cont = 0;
        $datosEstructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqlALTA="SELECT idcausa FROM mod_regimentrabajo.nom_causa where denominacion LIKE '%ALTAS%';";
        $resultadoALTA = $conn->fetchAll($sqlALTA);
        $alta=$resultadoALTA[0]['idcausa']; 
        $periddat=" SELECT DISTINCT dco.idpersona,dco.idcargo,
                        nc.denominacion as denomcargo,
                        doc.numero as numid,
                        dp.nombre,
                        dp.snombre,
                        dp.papel,
                        dp.sapel,
                        ncc.descripcioncentrogrupo
                    FROM mod_nomina.dat_cargosocupados dco
                        INNER JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
                        INNER JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
                        INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = dco.idpersona)
                        INNER join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
                        INNER JOIN mod_regimentrabajo.dat_asistencia dat on (dat.idpersona = dp.idpersona)
                        INNER JOIN mod_nomina.dat_vacacionespersona dvp on (dvp.idpersona = dp.idpersona)
                        INNER JOIN mod_nomina.his_vacacionespersona hv on (hv.idvacacionespersona = dvp.idvacacionespersona)
                        LEFT JOIN  mod_contabilidadcosto.nom_centrocosto ncc ON (ncc.idcentrogrupo = dco.idcentrocosto)
                    where dco.identidad = $identidad and
                        dvp.importeacumuladoinicial = 0 and
                        dvp.tiempoacumuladoinicial =0 and
                        hv.importeacumulado = 0 and
                        hv.tiempoacumulado = 0 and
                        dco.idcentrocosto is not null and 
                        dco.idplantillanominal is not null";
            $per = $conn->fetchAll($periddat); 
            $arrayfinal = [];
            if(count($per)>0){
                foreach ($per as $i => $value) {
                    $arrayfinal[$cont]['orden']='2';
                    $arrayfinal[$cont]['denomorden']="Las siguientes personas no tienen inicializado el submayor de vacaciones";
                    $arrayfinal[$cont]['nombre'] = ($value['nombre'] != null) ? $value['nombre'] . ' ' . $value['snombre'] . ' ' . $value['papel'] . ' ' . $value['sapel'] : 'No hay personas con plantilla nominal';
                    $arrayfinal[$cont]['denomcargo'] = ($value['idcargo'] != null) ? $value['denomcargo'] : '--';
                    $arrayfinal[$cont]['ci'] = ($value['numid'] != null) ? $value['numid'] : '0';
                    $arrayfinal[$cont]['centrocosto'] = $value[$i]['descripcioncentrogrupo'] ;
                    $arrayfinal[$cont]['denom']='';
                    $arrayfinal[$cont]['tipo']='';
                    $arrayfinal[$cont]['sit']='';
                    $cont++;
                }
            } 
            $c=0;
            $dat=[];
            for ($i=0; $i <count($arrayfinal) ; $i++) { 
                $dat[$c]['orden']=$arrayfinal[$i]['orden'].'('.count($arrayfinal).')';
                $dat[$c]['denomorden']=$arrayfinal[$i]['denomorden'];
                $dat[$c]['nombre'] =$arrayfinal[$i]['nombre'].'  ->'. $arrayfinal[$i]['ci'].'  -> '. $arrayfinal[$i]['denomcargo'].'  -> '. $arrayfinal[$i]['centrocosto'];
                $c++;
            }
            return $dat;
    }
   
    public function cargossinConfigElemSalarial($identidad,$start, $limit) 
    {
        $arrEntidad = $this->integrator->metadatos->DameHijosEstructura($identidad); 
        $datosEstructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        $arrcargos =[];
        $arrcargosalario = [];
        $pos = [];
        $resultado = [];
        $prueba = [];
       for ($i=0; $i < count($arrEntidad) ; $i++) { 
           // if ($arrEntidad[$i]->nombretipo == "Órgano interno") {
                $hijos[]= $arrEntidad[$i]->id;
           // }
        }
        for ($i=0; $i < count($hijos) ; $i++) { 
                $cantidadhijos[]= $this->integrator->metadatos->DameHijosEstructura($hijos[$i]);
                $ind[]=$i;
        } 
      
        for ($i=0; $i < count($cantidadhijos); $i++) { 
            $dat = count($cantidadhijos[$i]); 
            if ($dat) { 
                for ($j = 0; $j < $dat; $j++) {  
                    if ($cantidadhijos[$i][$j]->nombretipo == 'Cargo civil') { 
                        array_push($arrcargos, $cantidadhijos[$i][$j]->id); 
                    }
                }
            }
        }
        
        $objModel = new ConfigElementoSalarialCargo();
        for ($i=0; $i <count($arrcargos) ; $i++) { 
            array_push($arrcargosalario,$objModel->obtenerElemSalCargo($arrcargos[$i]));
        }
        
        for ($i=0; $i < count($arrcargosalario) ; $i++) { 
            if (empty($arrcargosalario[$i])) {
                array_push($pos,$i);
            }
        }

        foreach ($pos as $indice) {
            array_push($prueba,$arrcargos[$indice]);
        }

     $cont=0;
     $final=[];
        foreach ($prueba as $indic) {
            for ($i=0; $i < count($cantidadhijos); $i++) { 
                for ($j=0; $j <count($cantidadhijos[$i]) ; $j++) { 
                    if($cantidadhijos[$i][$j]->id== $indic){
                    $final[$cont]['orden']='3';
                    $final[$cont]['denomorden']="Los siguientes cargos no se encuentran configurados en elementos salariales al cargo";
                    $final[$cont]['nombre'] ='';
                    $final[$cont]['denomcargo'] ='';
                    $final[$cont]['ci'] ='';
                    $final[$cont]['centrocosto'] ='';
                    $final[$cont]['denom']=$cantidadhijos[$i][$j]->denominacion;
                    $final[$cont]['tipo']=$cantidadhijos[$i][$j]->nombretipo;
                    $final[$cont]['sit'] ='';
                    $cont++;
                }
              }
            }
        }
        $c=0;
        $dat=[];
        for ($i=0; $i <count($final) ; $i++) { 
            $dat[$c]['orden']=$final[$i]['orden'].'('.count($final).')';
            $dat[$c]['denomorden']=$final[$i]['denomorden'];
            $dat[$c]['nombre'] =$final[$i]['denom'].'   -> '. $final[$i]['tipo'];
            $c++;
        }
        return $dat;
    }

    public function personassinPlantillaNominal($identidad, $start, $limit) 
    {
        $datosEstructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        $cont = 0;
        $arrayfinal = [];
        $id=[];
        $idpersona=[];
        $objperB = new DatCierreNomina();
        $model = new DatCargosOcupadosModel();
        $php = new DatCierreNomina();
        $mg = Doctrine_Manager::getInstance();
       $conn = $mg->getCurrentConnection();
       $model = new DatCargosOcupadosModel();
       $texto=	"";
       $persona=	"";
       $seguridad=	"-1";
       $modulo=	"NOMINA";
       $funcionalidad=	"GCO";
       $campocolores=	"idcargosocupados";
       $cargoprincipal=	"0";      
       $arrcargossubordinados = $this->integrator->metadatos->obtenerCargosEstructura($identidad, true);
       foreach ($arrcargossubordinados as $rcargos) {
           $arrcargos[] = $rcargos['idcargo'];
       }
       $iddominio = $this->global->Perfil->iddominio;
       $arraycategorias = new stdClass();
       $tipoestructura = $datosEstructura[0]->idtipo;
       $permiso = -1;
       $r = $objperB->BuscadorNomina($start, $limit, $texto, $identidad, $iddominio, $permiso, $campocolores, $arraycategorias, null, $tipoestructura, $arrcargos, $tipobusqueda);
       $cont=0; 
   
        foreach ($r as $i => $persona) {
             if ($persona['idplantillanominal']==-1) {
                 $per[] =  $persona['idpersona'];
                 $cont++;
             }
        }
        $id = implode("','", $per);
         $arrayfinal=[];
         $contp=0;   
        if (count($per)>0) {
            $personassinplanttilla = "SELECT DISTINCT nc.denominacion as denomcargo, doc.numero as numid, dp.nombre,
                                            dp.snombre,  dp.papel, ncc.descripcioncentrogrupo, dp.sapel
                                    FROM mod_nomina.dat_cargosocupados dco
                                    INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = dco.idpersona)
                                    INNER join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
                                    left JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
                                    left JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
                                    left join mod_contabilidadcosto.nom_centrocosto ncc on (ncc.idcentrogrupo = dco.idcentrocosto)
                                    where dco.idpersona in ('$id');";
            $personassinplant= $conn->fetchAll($personassinplanttilla); 
             
            foreach ($personassinplant as $key => $value) {
                $arrayfinal[$contp]['orden'] = '4';
                $arrayfinal[$contp]['denomorden']="Las siguientes personas no tienen plantilla nominal";
                $arrayfinal[$contp]['nombre'] = $value['nombre'] . ' ' . $value['snombre'] . ' ' . $value['papel'] . ' ' . $value['sapel']  ;
                $arrayfinal[$contp]['ci'] = $value['numid'];
                $arrayfinal[$contp]['denomcargo'] =  $value['denomcargo']  ;
                $arrayfinal[$contp]['centrocosto'] = $value['descripcioncentrogrupo'] ;
                $arrayfinal[$contp]['denom']='';
                $arrayfinal[$contp]['tipo']='';
                $arrayfinal[$contp]['sit'] ='';
                $contp++;    
            } 
        }        
        $c=0;
        $dat=[];
        for ($i=0; $i <count($arrayfinal) ; $i++) { 
            $dat[$c]['orden']=$arrayfinal[$i]['orden'].'('.count($arrayfinal).')';
            $dat[$c]['denomorden']=$arrayfinal[$i]['denomorden'];
            $dat[$c]['nombre'] =$arrayfinal[$i]['nombre'].'  ->'. $arrayfinal[$i]['ci'].'  -> '. $arrayfinal[$i]['denomcargo'].'  -> '. $arrayfinal[$i]['centrocosto'];
            $c++;
        }
        return $dat;
    }

    public function dobleCargoCentro($identidad, $start, $limit) 
    { 
        $arrayfinal = array();
        $model = new DatCargosOcupadosModel();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqld= "SELECT DISTINCT dco.idpersona,
               nc.denominacion as denomcargo,
               doc.numero as numid,
               dp.nombre,
               dp.snombre,
               dp.papel,
               dp.sapel
        FROM mod_nomina.dat_cargosocupados dco
             INNER JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
             INNER JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
             INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = dco.idpersona)
             INNER join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
        where dco.identidad = $identidad and
              dco.idcentrocosto > 0 ";
        $datper = $conn->fetchAll($sqld); 
        $cantidad= array();
        for ($i=0; $i <count($datper) ; $i++) { 
            $arrCargosOcupados[]= $model->obtenerListadoCargosOcupadosActual($datper[$i]['idpersona'], $identidad, $start, $limit);
            $cantidad[] = $model->cantidadCargosOcupadoxPersona($datper[$i]['idpersona'], $identidad);
        } 
        for ($i=0; $i <count($arrCargosOcupados) ; $i++) { 
            $idper[]= $arrCargosOcupados[$i][0]['idpersona'];
        }  
        for ($i=0;$i < count($cantidad);$i++) {
            if ($cantidad[$i] > 1) {
                $index=$i;
                    $persona[]=$idper[$index];
            
            }
        }
        $id = implode("','", $persona);
        if (count($id)>0) {
            $sqlpers="SELECT DISTINCT nc.denominacion as denomcargo,
                    doc.numero as numid,
                    dp.nombre,
                    dp.snombre,
                    dp.papel,
                    ncc.descripcioncentrogrupo,
                    dp.sapel
            FROM mod_nomina.dat_cargosocupados dco
            INNER JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
            INNER JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
            INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = dco.idpersona)
            INNER join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
            LEFT JOIN  mod_contabilidadcosto.nom_centrocosto ncc ON (ncc.idcentrogrupo = dco.idcentrocosto)
            where dco.idpersona in('$id') order by doc.numero";
            $pers = $conn->fetchAll($sqlpers);         
            $contp=0;
            $arrayfinal=[];
            foreach ($pers as $value) { 
                $arrayfinal[$contp]['orden'] = '5';
                $arrayfinal[$contp]['denomorden']="Las siguientes personas tienen dos cargos";
                $arrayfinal[$contp]['nombre'] = ($value['nombre'] != null) ? $value['nombre'] . ' ' . $value['snombre'] . ' ' . $value['papel'] . ' ' . $value['sapel'] : 'No hay personas con plantilla nominal';
                $arrayfinal[$contp]['denomcargo'] = $value['denomcargo'];                      
                $arrayfinal[$contp]['ci'] = ($value['numid'] != null) ? $value['numid'] : '0';
                $arrayfinal[$contp]['centrocosto']=$value['descripcioncentrogrupo'];
                $arrayfinal[$contp]['denom']='';
                $arrayfinal[$contp]['tipo']='';
                $arrayfinal[$contp]['sit'] ='';
                $contp++;
            }
        } 
        $c=0;
        $dat=[];
        for ($i=0; $i <count($arrayfinal) ; $i++) { 
            $dat[$c]['orden']=$arrayfinal[$i]['orden'].'('.count($arrayfinal).')';
            $dat[$c]['denomorden']=$arrayfinal[$i]['denomorden'];
            $dat[$c]['nombre'] =$arrayfinal[$i]['nombre'].'  ->'. $arrayfinal[$i]['ci'].'  ->'. $arrayfinal[$i]['denomcargo'].'  -> '. $arrayfinal[$i]['centrocosto'];
            $c++;
        }
        return $dat;
    }

    public function sitServicioCentro($identidad, $start, $limit) 
    {
       // $datosEstructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        $arrayfinal = array();
        $model = new DatCargosOcupadosModel();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sqls= "SELECT  dco.idpersona, doc.numero as numid, dp.nombre,nc.denominacion as denomcargo,
                                        dp.snombre,
                                        dp.papel,
                                        dp.sapel,
                                        ncc.descripcioncentrogrupo
                                FROM mod_nomina.dat_cargosocupados dco 
                                inner join mod_persona.dat_persona dp on (dco.idpersona=dp.idpersona)
                                INNER JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
                                INNER JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
                                INNER join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
                                LEFT JOIN  mod_contabilidadcosto.nom_centrocosto ncc ON (ncc.idcentrogrupo = dco.idcentrocosto)
                                where dco.identidad = $identidad and 
                                    dco.idcentrocosto > 0 
                                    limit {$limit}
                        offset {$start} ";
        $sit = $conn->fetchAll($sqls); 
      $datos=array();
      $arrayfinal=array();
        for ($i=0; $i < count($sit); $i++) { 
            $arrayfinal[$i]['orden'] = 6;
            $arrayfinal[$i]['nombre'] = ($sit[$i]['nombre'] != null) ? $sit[$i]['nombre'] . ' ' . $sit[$i]['snombre'] . ' ' . $sit[$i]['papel'] . ' ' . $sit[$i]['sapel'] : 'No hay personas con plantilla nominal';              
            $arrayfinal[$i]['ci'] = ($sit[$i]['numid'] != null) ? $sit[$i]['numid'] : '0';
             $arrayfinal[$i]['centrocosto'] = $sit[$i]['descripcioncentrogrupo'] ;
            $datos[] = $model->obtenerListadoCargosOcupadosActual($sit[$i]['idpersona'], $identidad, $start, $limit);            
        }
        $devuelto = array();
        $c=0;
        if(count($datos>0)){
            for ($i=0; $i <count($datos) ; $i++) { 
                if ($datos[$i][0]['idsituacionlaboral'] != null) {
                    $devuelto[$c]['orden'] = '6';
                    $devuelto[$c]['denomorden']="Las siguientes personas tienen su situacion laboral visible en asociar personas a centros de costo";
                    $devuelto[$c]['nombre'] = $arrayfinal[$i]['nombre'];
                    $devuelto[$c]['ci'] = $arrayfinal[$i]['ci'];
                    $devuelto[$c]['denomcargo'] = $datos[$i][0]['denomcargo'];
                    $devuelto[$c]['centrocosto']=$datos[$i][0]['denomccosto'];
                    $devuelto[$c]['denom']='';
                    $devuelto[$c]['tipo']='';
                    $devuelto[$c]['sit']=$datos[$i][0]['denomsituacionlaboral'] ;
                    $c++;
                } 
            }
        } 
        $c=0;
        $dat=[];
        for ($i=0; $i <count($devuelto) ; $i++) { ;
            $dat[$c]['orden']=$devuelto[$i]['orden'].'('.count($devuelto).')';
            $dat[$c]['denomorden']=$devuelto[$i]['denomorden'];
            $dat[$c]['nombre'] =$devuelto[$i]['nombre'].'  ->'. $devuelto[$i]['ci'].' ->'. $devuelto[$i]['denomcargo'].' -> '. $devuelto[$i]['centrocosto'];
            $c++;
        }
        return $dat;
    }
    
    public function Personasdescuentos($arridelabpago)
    {  
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $dat=[];
        if (count($arridelabpago)>0) {
                $sqlretencion="SELECT DISTINCT idtiporetencion FROM mod_nomina.nom_tiporetencion ";
                $ret=$conn->fetchAll($sqlretencion);
                $d=[];
                foreach ($ret as $key => $value) {
                $d[]=$value['idtiporetencion'];
                }
                $idret = implode("','", $d);
                $sqldecuentos="SELECT DISTINCT ncp.idconceptopercepciondescuento
                                FROM mod_nomina.nom_conceptopercepciondescuento ncp
                                inner join  mod_nomina.nom_tipoconceptopercepciondescuento nct on (nct.idtipoconceptopd=ncp.idtipoconceptopd)";
                $desc=$conn->fetchAll($sqldecuentos);
                $des=[];
                foreach ($desc as $key => $value) {
                $des[]=$value['idconceptopercepciondescuento'];
                }
                $idesc = implode("','", $des);
                $sql = " SELECT Distinct dco.idpersona,
                            doc.numero as numid,
                            dp.nombre,
                            nc.denominacion as denomcargo,
                            dp.snombre,
                            dp.papel,
                            dp.sapel,
                            ncc.descripcioncentrogrupo
                    FROM mod_nomina.dat_retencionesaplicadasporpersona dr
                        inner join mod_nomina.dat_descuentosaplicadosporpersona dd on (dd.idelaborarpagos = dr.idelaborarpagos)
                        inner join mod_nomina.dat_cargosocupados dco on (dco.idpersona = dr.idpersona) or (dco.idpersona = dd.idpersona)
                        inner join mod_persona.dat_persona dp on (dco.idpersona = dp.idpersona)
                        INNER JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo)
                        INNER JOIN mod_estructuracomp.nom_cargo nc on (nc.idnomcargo = dc.idnomcargo)
                        INNER join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
                        LEFT JOIN mod_contabilidadcosto.nom_centrocosto ncc ON (ncc.idcentrogrupo = dco.idcentrocosto)
                             where dr.idelaborarpagos in('$arridelabpago') and dd.idconceptopercepciondescuento in ('$idesc') and dr.idtiporetencion in ('$idret')
                             group by dco.idpersona,
                        doc.numero,
                        dp.nombre,
                        nc.denominacion,
                        dp.snombre,
                        dp.papel,
                        dp.sapel,
                        ncc.descripcioncentrogrupo,
                        dd.idconceptopercepciondescuento, dr.idtiporetencion
                        HAVING COUNT(dd.idconceptopercepciondescuento) >= 2 and count( dr.idtiporetencion)>=2";
                $r= $conn->fetchAll($sql); 
                $c=0;
                for ($i=0; $i <count($r) ; $i++) { 
                $dat[$c]['orden']= 7 ;
                $dat[$c]['denomorden']='A los siguientes trabajadores se les ha aplicado descuentos o retenciones en varios tipos de pago de un mismo período'.'('.count($r).')';
                $dat[$c]['nombre'] = $r[$i]['nombre'].''.$r[$i]['snombre'].' '.$r[$i]['papel'].' '.$r[$i]['sapel'].'  ->'. $r[$i]['numid'].' ->'. $r[$i]['denomcargo'].' -> '. $r[$i]['descripcioncentrogrupo'];
                $c++;
                }
        }
       return $dat;
    }

    public function getFondosSaldo($idestructura,$idperiodo)
    {
        return true;
    }  

    public function compararFechas($f1,$f2){
        list($dia1, $mes1, $anno1) = explode('/', $f1);
        list($dia2, $mes2, $anno2) = explode('/', $f2);
       $equal=0;
        if ($dia1 - $dia2 == 0) {
            if ($mes1 -$mes2 == 0) {
                if ($anno1 - $anno2 == 0) {
                    $equal=1;
                }
            }
        }
        return $equal;
    }
}

