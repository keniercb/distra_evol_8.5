<?php

class AsistenciaController extends ZendExt_Controller_Secure
{
    protected $configSesiones;

    function init()
    {
        parent::init();
        $habSesiones = new ConfHabilitarsesiones();
        $confSesion = $habSesiones->getHabilitarsesiones();
        $this->configSesiones = $confSesion[0]['habsesion'];
    }

    function asistenciaAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->fecha = date('d/m/Y');
        $this->render();
    }

    function getpersonasasistenciaAction()
    {
        ini_set("max_memory_limit","1024M");
        ini_set("max_execution_time",300);

        $turno = null;
        if($this->_request->getPost('fechat') != -1){
            $turno['fechat'] = $this->_request->getPost('fechat');
            $turno['idgrupodescanso'] = $this->_request->getPost('idgrupodescanso');
            $turno['idturnotrabajo'] = $this->_request->getPost('idturnotrabajo');
        }
        
        $model = new DatEstructuraasistenciaModel();
        $asistenciamodel = new DatAsistenciaModel();
        $datasistencia = new DatAsistencia();
        $arrPersonas = array();
        $personasunicas = array();
        $cargos = array();
        $otrodia = 0;
        $tienetempus = false;
        $tienereloj = false;

        $idscert = array();
        $arraypersonas = array();
        $domaincert = new ConfHabcertificados();
        $certificados = $domaincert->getHabilitarcausacertificados();
        foreach ($certificados as $c){
            array_push($idscert,$c['idcausa']);
        }
        $r['certificados'] = $idscert;

        if($_SESSION['Zeolides']['perfil']['idpersona'] != null){
            $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array
            ($_SESSION['Zeolides']['perfil']['idpersona']), null, null, null, null, null, null,'false','true','false','true');
            if(is_numeric($person->data[0]['idcargo']))
            {
                $personas = ZendExt_IoC_Inter::getInstance()->maestro->getControledByDominioEstructuraPersonaPluriempleo(
                    2, $_SESSION['Zeolides']['entidad']->idestructura, $_SESSION['Zeolides']['perfil']['idpersona']
                );

                if($personas != null){
                    $arrayAllIdAreas = array();
                    foreach ($personas as $persona) {
                        if(!$model->existepers($persona['idpersona'], $arraypersonas))
                            array_push($arraypersonas, $persona);
                        if(!empty($persona['idarea'])){
                            array_push($arrayAllIdAreas, $persona['idarea']);
                        }
                    }
                    $arrayIdAreas = array_unique($arrayAllIdAreas);
                    $areas = ZendExt_IoC::getInstance()->metadatos->ObtenerDatosEstructuraPorArrayID($arrayIdAreas);
                    $denareas = array();
                    foreach($areas as $area)
                    {
                        $denareas[$area[0]->idestructura] = $area[0]->denominacion;
                    }
                    $asist = $model->getPersonasByCargoPadre( $this->_request->getPost('fecha'),$arraypersonas,
                        $_SESSION['Zeolides']['perfil']['idpersona'],$this->configSesiones,$turno);
                    if(is_numeric($asist))
                    {
                        $r['cod'] = $asist;
                        $r['datos'] = array();
                        $r['sesiones'] = $this->configSesiones;
                        echo(json_encode($r));
                    }
                    else{
                        $arrPersonas = $asist['data'];

                        foreach ($arrPersonas as $key => $value) {
                            array_push($cargos,$value['idcargo']);
                            $fech = $value['fecharegistro'];
                            $arrPersonas[$key]['idcategoria'] = $value['idpadrecategoria'];
                            $confCalendarioPersona = new ConfCalendariopersona();
                            $calendario = $confCalendarioPersona->getCalendarioPersona($fech,$fech,$value['idpersona']);
                            if ($value['idgrupodescanso'] != null) {
                                //$calendario = $model->getCalendarioByFecha($fech, $value['idgrupodescanso']);
                                if(count($calendario) == 0 || $calendario[0]['trabajo'] == 0)
                                {
                                    $fecha = $fech;
                                    $f1 = explode('/', $fecha);
                                    $f2 = date_create($f1[2] . '/' . $f1[1] . '/' . $f1[0]);
                                    $fechiniturno = date_add($f2, date_interval_create_from_date_string('-1 days'))->format("d/m/Y");
                                    $FIT = explode('/', $f2->format('d/m/Y'));
                                    $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                                    //$caltmp =  $model->getCalendarioByFecha($fechiniturno, $value['idgrupodescanso']);
                                    $caltmp =  $confCalendarioPersona->getCalendarioPersona($fechiniturno,$fechiniturno,$value['idpersona']);
                                    if($caltmp[0]['otrodia'] == 1){
                                        $calendario = $caltmp;
                                    }
                                }
                                $diaferiadohab = $asistenciamodel->GetDiaFeriadoHabilitado($value['idpersona'],$fech);
                                if(count($calendario) > 0 && ($calendario[0]['trabajo'] == 1 || count($diaferiadohab) > 0)){
                                        $arrPersonas[$key]['presente'] = 1;
                                }else{
                                    $arrPersonas[$key]['presente'] = 0;
                                }
                            }
                            if (empty($arrPersonas[$key]['idarea'])) {
                                $arrPersonas[$key]['denomarea'] = 'Sin cargo';
                            }
                            else{
                                $arrPersonas[$key]['denomarea'] = $denareas[$arrPersonas[$key]['idarea']];
                            }

                            if($calendario[0]['otrodia'] == 1) {
                                $otrodia = 1;
                                $arrPersonas[$key]['otrodia'] = 1;
                            }else{
                                $arrPersonas[$key]['otrodia'] = 0;
                            }
                            $v = explode(' ', $value['fechahoraentrada']);
                            $k = explode(':', $v[1]);
                            $arrPersonas[$key]['fechahoraentrada'] = (!empty($v[1]))?$k[0].':'.$k[1]:null;
                            if(empty($v[0]) && (empty($value['fdesde'])))
                                $arrPersonas[$key]['fechaentrada'] = $fech;
                            else
                                $arrPersonas[$key]['fechaentrada'] = $v[0];

                            $a = explode(' ', $value['fechahorasalida']);
                            $j = explode(':', $a[1]);
                            $arrPersonas[$key]['fechahorasalida'] = (!empty($a[1]))?$j[0].':'.$j[1]:null;
                            $arrPersonas[$key]['fechasalida'] = $a[0];
                            if($value['hrsdescontadas'] == 'null')
                                $arrPersonas[$key]['hrsdescontadas'] = '';
                            if($value['horasextras'] == 'null')
                                $arrPersonas[$key]['horasextras'] = '';

                            if(($calendario[0]['trabajo'] == 1 || count($diaferiadohab) > 0) && $calendario[0]['otrodia'] == 0){
                                $fechainicioturno = $value['fecharegistro'];
                                $fechafinturno = $value['fecharegistro'];
                            }else{
                                if(($calendario[0]['trabajo'] == 1 || count($diaferiadohab) > 0) && $calendario[0]['otrodia'] == 1){
                                    $f1 = explode('/',$value['fecharegistro']);
                                    $f2 = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
                                    $fechsalturno = date_add($f2, date_interval_create_from_date_string('1 day'));
                                    $FIT = explode('/', $f2->format('d/m/Y'));
                                    $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                                    $fechafinturno = $fechsalturno->format('d/m/Y');
                                    $fechainicioturno = $value['fecharegistro'];
                                } else{
                                    $f1 = explode('/',$value['fecharegistro']);
                                    $f2 = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
                                    $fechiniturno = date_add($f2, date_interval_create_from_date_string('-1 days'));
                                    $FIT = explode('/', $f2->format('d/m/Y'));
                                    $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                                    //$dia1 = $model->getCalendarioByFecha($fechiniturno->format('Y-m-d'), $value['idgrupodescanso']);
                                    $dia1 = $confCalendarioPersona->getCalendarioPersona($fechiniturno->format('Y-m-d'),$fechiniturno->format('Y-m-d'),$value['idpersona']);
                                    if($dia1[0]['trabajo'] == 1 && $dia1[0]['otrodia'] == 1)
                                        $fechainicioturno = $fechiniturno->format('d/m/Y');
                                    $calendario = $dia1;
                                    $fechafinturno = $value['fecharegistro'];
                                }
                            }
                            $horatt = $datasistencia->getHorarioByPersona($value['idpersona'], $fechainicioturno);
                            $arrPersonas[$key]['horainicio'] = $horatt['horainicio'];
                            $arrPersonas[$key]['horafin'] = $horatt['horafin'];
                            $arrPersonas[$key]['horas'] = $horatt['horas'];

                          /*  if(!empty($value['fdesde']) && !empty($value['fhasta']) && $value['fecharegistro'] !=  $this->_request->getPost('fecha'))
                            {
                                $arrPersonas[$key]['turno'] = $value['denomturno'];
                                $arrPersonas[$key]['inicioturno'] = "";
                                $arrPersonas[$key]['finturno'] = "";
                            }else{*/
                                $inicioturno = $fechainicioturno.'-'.$horatt['horainicio'];
                                $finturno = $fechafinturno.'-'.$horatt['horafin'];
                                if($calendario[0]['trabajo'] == 1 && $calendario[0]['otrodia'] == 0){
                                    if(!empty($horatt['horainicio']))
                                        $arrPersonas[$key]['turno'] = $horatt['horainicio'].'--'.$horatt['horafin'];
                                }else{
                                    if(!empty($horatt['horainicio']))
                                        $arrPersonas[$key]['turno'] = $inicioturno.'----'.$finturno;
                                }
                                $arrPersonas[$key]['inicioturno'] = $horatt['horainicio'];
                                $arrPersonas[$key]['hfinturno'] = $horatt['horafin'];
                                $arrPersonas[$key]['finiturno'] = $fechainicioturno;
                                $arrPersonas[$key]['finturno'] = $fechafinturno;
                                $arrPersonas[$key]['tdescanso'] = $horatt['tdescanso'];
                                $arrPersonas[$key]['horarioalmuerzo'] = $horatt['horarioalmuerzo'];
                           // }
                            $arrPersonas[$key]['regimen'] = $horatt['regimen'];
                            $arrPersonas[$key]['grupo'] = $horatt['grupo'];
                            $arrPersonas[$key]['turno_denom'] = $horatt['turno'];

                            $ConfEstructurahorario = new ConfEstructurahorario();
                            $estructuras = $ConfEstructurahorario->getEstructurahorario();
                            if (count($estructuras) > 0) {
                                $existe = $ConfEstructurahorario->getByIdEstructura($_SESSION['Zeolides']['entidad']->idestructura);
                            } else {
                                $existe = array(0 => true);
                            }
                            //Tempus
//                            $ConfEstructuratempus = new ConfEstructuratempus();
//                            $estructurastempus = $ConfEstructuratempus->getEstructuratempus();
//                            if (count($estructurastempus) > 0) {
//                                $existetempus = $ConfEstructuratempus->getByIdEstructura($_SESSION['Zeolides']['entidad']->idestructura);
//                            } else {
//                                $existetempus = array(0 => true);
//                            }
//                            if(count($existetempus)>0){
//                                $tienetempus = true;
//                            }
//                            //Reloj ANVIZ
//                            $ConfEstructurareloj = new ConfEstructurareloj();
//                            $estructurasreloj = $ConfEstructurareloj->getEstructurareloj();
//                            if (count($estructurasreloj) > 0) {
//                                $existereloj = $ConfEstructurareloj->getByIdEstructura($_SESSION['Zeolides']['entidad']->idestructura);
//                            } else {
//                                $existereloj = array(0 => true);
//                            }
//                            if(count($existereloj)>0){
//                                $tienereloj = true;
//                            }



                            /*Poniendo las hrs perdidas o las hrs trabajadas fijas cuando el FT es fijo y se trabaja el mes completo*/
                            $regimen = NomRegimentrabajo::getDenomRegimenById($value['idregimentrabajo']);
                           if($regimen[0]['tipofondotiempo'] == 3 && !empty($value['idcausa']) && !empty($value['fdesde']) && !empty($value['fhasta'])){
                               $f = explode('/',$this->_request->getPost('fecha'));
                               $cantDiasMes = date('t', mktime(0, 0, 0, $f[1], 1, $f[2]));
                               $nomGrupodescanso = new NomGrupodescanso();
                               $confHabgrupospredeterminados = new ConfHabgrupospredeterminados();
                               $existegrupo = $confHabgrupospredeterminados->existe($value['idgrupodescanso']);
                               $grupopredeterminado = $nomGrupodescanso->getGrupoPredeterminado();
                               if(!empty($grupopredeterminado) && count($existegrupo) != 0){
                                   $calendariotrabajo = ConfCalendario::getHrsCalendario('01/'.$f[1].'/'.$f[2], $cantDiasMes.'/'.$f[1].'/'.$f[2], $grupopredeterminado[0]['idgrupodescanso']);
                               }else{
                                   $calendariotrabajo = $confCalendarioPersona->getHorasCalendarioPersona('01/'.$f[1].'/'.$f[2], $cantDiasMes.'/'.$f[1].'/'.$f[2], $value['idpersona']);
                               }
                               if($calendariotrabajo[0]['sum'] == $value['hrsdescontadas'].':00'){
                                   $arrPersonas[$key]['hrsdescontadas'] = $regimen[0]['fondotiempo'];
                               }else if($calendariotrabajo[0]['sum'] == $value['hrstrabajadas'].':00'){
                                   $arrPersonas[$key]['hrstrabajadas'] = $regimen[0]['fondotiempo'];
                               }
                           }
                            /*Poniendo las hrs perdidas o las hrs trabajadas fijas cuando el FT es fijo y se trabaja el mes completo*/
                            if($value['idcausa'] == -1){
                                $arrPersonas[$key]['denominacion'] = 'MÚLTIPLES CAUSAS';
                                $arrPersonas[$key]['idcausa'] = -1;
                            }
                        }

                        $habcontrolaccesomodel = new ConfHabcontrolaccesoModel();
                        $controlacceso = $habcontrolaccesomodel->getHabilitarcontrolacceso();

                        foreach($controlacceso as $v)
                        {
                            if($v['habilitadoca'] == 1){
                                $tipoca = $v['idca'];
                            }
                        }
//
//                        if(($controlacceso[0]['habilitadoca'] == 1 && $tienetempus == true && $tienereloj == true) || $controlacceso[1]['habilitadoca'] == 1 ){
//                            $habilitado = 1;
//                        }else{
//                            $habilitado = 0;
//                        }

//                        $r['habca'] = $habilitado;
//                        $r['tipoca'] = $controlacceso[0]['idca'];
                        $r['tipoca'] = $tipoca;
                        $r['sesiones'] = $this->configSesiones;
                        $r['otrodia'] = $otrodia;

                        $persResult = array();
                        foreach($arrPersonas as $arrPer)
                        {
                            array_push($persResult,$arrPer);
                        }
//                        $cargosunicos = array_unique($cargos);
//                        $persResult = $asistenciamodel->ordenarInfoByCargo($cargosunicos, $arrPersonas);

                        if (is_array($arrPersonas)) {
                            $r['datos'] = $persResult;
                        } else {
                            if ($arrPersonas == 4) {
                                $resultado['codigo'] = 4;
                                $r['datos'] = $resultado;
                            } else {
                                $r['cod'] = 3;
                            }
                        }
                        if (count($asist['sinRegimen']) > 0)
                            $r['sinregimen'] = $asist['sinRegimen'];
                        if (count($asist['sincalendario']) > 0)
                            $r['sincalendario'] = $asist['sincalendario'];
                        echo(json_encode($r));
                    }
                }else{
                    $r['cod'] = 3;
                    $r['datos'] = array();
                    $r['sesiones'] = $this->configSesiones;
                    $r['otrodia'] = $otrodia;
                    echo(json_encode($r));
                }
            }
            else
            {
                $r['cod'] = 7;
                $r['datos'] = array();
                $r['sesiones'] = $this->configSesiones;
                $r['otrodia'] = $otrodia;
                echo(json_encode($r));
            }
        }else{
            $r['cod'] = 8;
            $r['datos'] = array();
            $r['sesiones'] = $this->configSesiones;
            $r['otrodia'] = $otrodia;
            echo(json_encode($r));
        }
    }

    function obtenerTurnoTrabajoAction(){
        $fecha = $this->_request->getPost('fecha');
        $result = array();
        $datAsistencia = new DatAsistencia();
        if($_SESSION['Zeolides']['perfil']['idpersona'] != null){
            $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array
            ($_SESSION['Zeolides']['perfil']['idpersona']), null, null, null, null, null, null,'false','true','false','true');
            if(is_numeric($person->data[0]['idcargo']))
            {
                $personas = ZendExt_IoC_Inter::getInstance()->maestro->getControledByDominioEstructuraPersonaPluriempleo(
                    2, $_SESSION['Zeolides']['entidad']->idestructura, $_SESSION['Zeolides']['perfil']['idpersona']
                );
                if(count($personas)>0){
                    $idturnos = array();
                    foreach ($personas as $per => $peop) {
                        $horario =  $datAsistencia->getHorarioByPersona($peop['idpersona'], $fecha);
                        if($horario != null && !array_key_exists($fecha.$horario['idturnotrabajo'], $idturnos)){
                            $idturnos[$fecha.$horario['idturnotrabajo']] = $horario['idturnotrabajo'];
                            $turno = array('idturnotrabajop'=> $per,'idturnotrabajo'=> $horario['idturnotrabajo'], 'denominacion'=>$fecha." - ".$horario['horainicio'].' - '.$horario['horafin'], 'fecha' => $fecha, 'idgrupodescanso' => $horario['idgrupodescanso']);
                            $result[] = $turno;
                        }
                        $fechaayer = $this->restarDiaAFecha($fecha);
                        $horario =  $datAsistencia->getHorarioByPersona($peop['idpersona'], $fechaayer->format("d/m/Y"));
                        if($horario != null && $horario['otrodia']){
                            if(!array_key_exists($fechaayer->format("d/m/Y").$horario['idturnotrabajo'], $idturnos)){
                                $idturnos[$fechaayer->format("d/m/Y").$horario['idturnotrabajo']] = $horario['idturnotrabajo'];
                                $turno = array('idturnotrabajop'=> $per,'idturnotrabajo'=> $horario['idturnotrabajo'], 'denominacion'=>$fechaayer->format("d/m/Y")." - ".$horario['horainicio'].' - '.$horario['horafin'], 'fecha' => $fechaayer->format("d/m/Y"), 'idgrupodescanso' => $horario['idgrupodescanso']);
                                $result[] = $turno;
                            }
                        }
                    }
                }
            }
        }
        $r['datos'] = $result;
        echo(json_encode($r));
    }

    /**
     * @Comment Se le pasa la fehca en el formato dd/mm/YY
     * @param $fecha
     * @return DateTime
     */
    private function restarDiaAFecha($fecha){
        $f1 = explode('/',$fecha);
        $f2 = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
        date_add($f2, date_interval_create_from_date_string('-1 days'));
        $FIT = explode('/', $f2->format('d/m/Y'));
        return $f2 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
    }

    function cargacausasausenciaAction()
    {
        $obj = new NomCausaModel();
        $arreglo = array();
        if($this->configSesiones == 1)
        {
            if($this->_request->getPost('node') > 0)
            {
                $arreglo = $obj->GetByLimithijosAsistBySesiones($this->_request->getPost('node'));
            }
            else
            {
                if($this->_request->getPost('idcategoria') == -1)
                {
                    $arreglo = $obj->GetByLimitAsistBySesiones();

                }
                else
                {
                    $cantcausa = $obj->getcantCausasByCategoriaBySesiones($this->_request->getPost('idcategoria'));
                    if ($cantcausa != 0) {
                        $arreglo = $obj->GetCausasByCategoriaBySesiones($this->_request->getPost('idcategoria'));
                    } else {
                        $arreglo = $obj->GetByLimitAsistBySesiones();
                    }
                }
            }
        }else{
            if($this->_request->getPost('node') > 0)
            {
                $arreglo = $obj->GetByLimithijosAsist($this->_request->getPost('node'));
            }
            else
            {
                if($this->_request->getPost('idcategoria') == -1)
                {
                    $arreglo = $obj->GetByLimitAsist();
                }
                else
                {
                    $cantcausa = $obj->getcantCausasByCategoria($this->_request->getPost('idcategoria'));
                    if ($cantcausa != 0) {
                        $arreglo = $obj->GetCausasByCategoria($this->_request->getPost('idcategoria'));
                    } else {
                        $arreglo = $obj->GetByLimitAsist();
                    }
                }
            }
        }
        foreach ($arreglo as $key => $val) {
                $arreglo[$key]['id'] = $val['idcausa'];
                $arreglo[$key]['text'] = $val['denominacion'];
        }
        echo(json_encode($arreglo));
    }

    function cargacausasausenciasesionesAction()
    {
        $obj = new NomCausaModel();
        $arreglo = array();
        if($this->_request->getPost('node') > 0)
        {
            $arreglo = $obj->GetByLimithijosAsistSesiones($this->_request->getPost('node'));
        }
        else
        {
            if($this->_request->getPost('idcategoria') == -1)
            {
                $arreglo = $obj->GetByLimitAsistSesiones();
            }
            else
            {
                $cantcausa = $obj->getcantCausasByCategoriaSesiones($this->_request->getPost('idcategoria'));
                if ($cantcausa != 0) {
                    $arreglo = $obj->GetCausasByCategoriaSesiones($this->_request->getPost('idcategoria'));
                } else {
                    $arreglo = $obj->GetByLimitAsistSesiones();
                }
            }
        }
        foreach ($arreglo as $key => $val) {
            $arreglo[$key]['id'] = $val['idcausa'];
            $arreglo[$key]['text'] = $val['denominacion'];
        }
        echo(json_encode($arreglo));
    }

    function actualizardatosAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $idspersonas = json_decode(stripslashes($this->_request->getPost('idspersonas')));
        $datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $model = new DatAsistenciaModel();
        //$model->registrarAcceso('64092302670',null,0);
        $result = $model->upddatos($this->_getParam('fechacontrol'),$idspersonas,$datos);
        if ($result['msg'] == 2)
            $r['cod'] = 2;
        elseif($result['msg'] == 3)
            $r['cod'] = 3;
        elseif($result['msg'] == 4)
            $r['cod'] = 4;
        else
            $r['cod'] = 1;
        echo(json_encode($r));
    }

    function guardarasistenciaAction()
    {
        $idpersonas = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $idasistencia = json_decode(stripslashes($this->_request->getPost('idasistencia')));
        $hrsdescontadas = json_decode(stripslashes($this->_request->getPost('hrsdescontadas')));
        $idcausa = json_decode(stripslashes($this->_request->getPost('idcausa')));
        $fdesde = json_decode(stripslashes($this->_request->getPost('fdesde')));
        $fhasta = json_decode(stripslashes($this->_request->getPost('fhasta')));
        $fecharegistro = $this->_request->getPost('fecharegistro');
        $observacion = json_decode(stripslashes($this->_request->getPost('observacion')));
        $otrodia = json_decode(stripslashes($this->_request->getPost('otrodia')));
        $certificadocontinuado = json_decode(stripslashes($this->_request->getPost('certificadocontinuado')));

        $turno = null;
        if($this->_request->getPost('fechat') != null){
            $turno['fechat'] = json_decode($this->_request->getPost('fechat'));
            $turno['idgrupodescanso'] = json_decode($this->_request->getPost('idgrupodescanso'));
            $turno['idturnotrabajo'] = json_decode($this->_request->getPost('idturnotrabajo'));
        }
        $model = new DatAsistenciaModel();
        if($this->configSesiones == 1)
        {
            $fechahoraentradaps = json_decode(stripslashes($this->_request->getPost('horaentradaps')));
            $fechahorasalidaps = json_decode(stripslashes($this->_request->getPost('horasalidaps')));
            $fechahoraentradass = json_decode(stripslashes($this->_request->getPost('horaentradass')));
            $fechahorasalidass = json_decode(stripslashes($this->_request->getPost('horasalidass')));
            $idcausaps = json_decode(stripslashes($this->_request->getPost('idcausaps')));
            $idcausass = json_decode(stripslashes($this->_request->getPost('idcausass')));

            $result = $model->InsertarWithSesions($idasistencia, $idpersonas,$hrsdescontadas, $idcausa, $fdesde, $fhasta, $fecharegistro, $observacion,
                                                  $fechahoraentradass,$fechahorasalidass, $fechahoraentradaps, $fechahorasalidaps,$idcausaps, $idcausass,
                                                  false);
        }
        else
        {
            $fechaentrada = json_decode(stripslashes($this->_request->getPost('fechaentrada')));
            $fechahoraentrada = json_decode(stripslashes($this->_request->getPost('horaentrada')));
            $fechasalida = json_decode(stripslashes($this->_request->getPost('fechasalida')));
            $fechahorasalida = json_decode(stripslashes($this->_request->getPost('horasalida')));

                $result = $model->Insertar($idasistencia, $idpersonas, $fechahoraentrada, $fechahorasalida, $hrsdescontadas, $idcausa, $fdesde, $fhasta,
                    $fecharegistro, $observacion,false,$fechaentrada,$fechasalida,false,$certificadocontinuado);
        }

        if ($result['succes'])
            $r['cod'] = 1;
        else
            $r['cod'] = 3;

        if($result['msg'] == 1){
            $r['msg'] = 3;
            $r['personas'] = $result['personas'];
            $r['vacacum'] = $result['vacacum'];
        }
        if($result['msg'] == 2){
            $r['msg'] = 2;
            $r['personassindiascausa'] = $result['personassindiascausa'];
            $r['causa'] = $result['causainc'];
        }

        echo(json_encode($r));
    }

    function existeAsistenciaPeriodoAction()
    {
        $idpersonas = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $idasistencia = json_decode(stripslashes($this->_request->getPost('idasistencia')));
        $fdesde = json_decode(stripslashes($this->_request->getPost('fdesde')));
        $fhasta = json_decode(stripslashes($this->_request->getPost('fhasta')));
        $DatAsistenciaModel = new DatAsistenciaModel();
        $asist = $DatAsistenciaModel->existeAsistenciaPeriodo($idasistencia, $idpersonas, $fdesde, $fhasta);
        if(!empty($asist)){
            $r['msg'] = 1;
            $r['personasconasist'] = implode(' ', $asist);
        }else{
            $r['msg'] = 0;
            $r['personasconasist'] = array();
        }
        echo(json_encode($r));
    }

    function getResumenAction()
    {
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($this->_request->getPost('idestructura'),$iddominio,false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in]=$cargoest['idcargo'];
        }
        $PersonCargo = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array(), null, null, 0,null, $cargosPeople, null);

        foreach ($PersonCargo->data as $person) {
            array_push($idpersonas, $person['idpersona']);
        }
        $model = new DatAsistenciaModel();
        $arrResumen = $model->getResumen($this->_request->getPost('idestructura'),
            null, $this->_request->getPost('fecha'),
            $idpersonas, $this->_request->getPost('start'), $this->_request->getPost('limit'));
        if(count($arrResumen['datos']) == 0){
            $r['datos'] = array();
            $r['resumen'] = array();
            $r['cantidad'] = 0;
            $r['cod'] = 3;
        }else{
            $r['datos'] = $arrResumen['datos'];
            $r['resumen'] = $arrResumen['resumen'];
            $r['cantidad'] = count($arrResumen['cantidad']);
        }
        echo(json_encode($r));
    }

    function certificarAction()
    {
        $model = new DatAsistenciaModel();
        $fecha = $this->_request->getPost('fechacontrol');
        $idspersonas = array();
        $persnocert = array();
        $idsasistencia = array();
        $idspersonas = json_decode(stripslashes($this->_request->getPost('idspersonas')));
        $asistencia = new DatAsistencia();
        $asistencia = $asistencia->GetReporteAsist($idspersonas, null, null, $fecha, 0, null);

        foreach ($asistencia as $i => $per) {
           if($per['certificado'] == 0){
               if (((!empty($per['fechahoraentrada']) && !empty($per['fechahorasalida']))
                   || (!empty($per['fechahoraentrada']) && !empty($per['fechahorasalida']) && !empty($per['idcausa']))
                   || (empty($per['fechahoraentrada']) && empty($per['fechahorasalida']) && !empty($per['idcausa'])) || $per['feriado'] == 1)/*(!empty($per['fechahoraentrada']) && !empty($per['fechahorasalida'])) || (!empty($per['idcausa']))*/
               ){
                   $idsasistencia[] = $per['idasistencia'];
               }else{
                   $persnocert[] = $per['nombreapellidos'];
                   $cod = 4;
               }
           }else{
               $cod = 3;
           }
        }
        if(count($idsasistencia)>0){
            $result = $model->CertificarAsist($idsasistencia,$_SESSION['Zeolides']['perfil']['idpersona']);
        }

        if($cod == 4){
            $r['persnocert'] = $persnocert;
            $r['cod'] = 4;
        }else if($cod == 3){
            $r['cod'] = 3;
        }else if ($result == 1) {
            $r['cod'] = $result;
            /* else {
                $r['cod'] = 3;
                $r['mess'] = $result;
            }*/
        }
        echo(json_encode($r));
    }

    function quitarcertificacionAction()
    {
        $model = new DatAsistencia();
        $fecha = $this->_request->getPost('fechacontrol');
        $idasistencia = array();
        $idasistencia = json_decode(stripslashes($this->_request->getPost('idasistencia')));
        $result = $model->QuitarCertificacionAsist($idasistencia);
        if ($result == 1) {
            $r['cod'] = $result;
        } /*else {
            $r['cod'] = 3;
            $r['mess'] = $result;
        }*/
        echo(json_encode($r));
    }

    function eliminarasistenciaAction()
    {
        $model = new DatAsistencia();
        $fecha = $this->_request->getPost('fechacontrol');
        $idasistencia = json_decode(stripslashes($this->_request->getPost('idasistencia')));
        $result = $model->EliminarAsistencia($idasistencia,$fecha);
        DatAsistenciamultiplescausas::deleteAsistenciaByPerson($idasistencia);
        if ($result == 1) {
            $r['cod'] = $result;
        } /*else {
            $r['cod'] = 3;
            $r['mess'] = $result;
        }*/
        echo(json_encode($r));
    }

    function getMultiplesCausasAction()
    {
        $idpersona = $this->_request->getPost('idpersona');
        $fecharegistro = $this->_request->getPost('fecha');
        $idAsistenciaMultiplesCausas = $this->_request->getPost('idAsistenciaMultiplesCausas');

        $DatAsistenciamultiplescausas = new DatAsistenciamultiplescausas();
        $result = $DatAsistenciamultiplescausas->getmultiplescausasbypersona($idpersona,$fecharegistro);
        foreach ($result as $i => $c) {
            $horaentrada = explode(':', $c['horaentrada']);
            $horasalida = explode(':', $c['horasalida']);
            $horas = explode(':', $c['horas']);
            $result[$i]['horaentradamc'] = $horaentrada[0].':'.$horaentrada[1];
            $result[$i]['horasalidamc'] = $horasalida[0].':'.$horasalida[1];
            $result[$i]['horas'] = $c['horas'];
            $causa = NomCausa::GetCausasById($c['idcausa']);
            $result[$i]['denomcausa'] = $causa[0]['denominacion'];
            $result[$i]['afectasalario'] = $causa[0]['afectasalario'];

            if ($idAsistenciaMultiplesCausas == $result[$i]['idasistenciamultiplescausas']) {
                unset($result[$i]);
            }
        }
        $r['datos'] = array_values($result);
        $r['cont'] = count($result);
        echo(json_encode($r));
    }
    
    function getUltimaHoraAction(){        
        $idpersona = $this->_request->getPost('idpersona');
        $fecharegistro = $this->_request->getPost('fecha');
        
        $DatAsistenciamultiplescausas = new DatAsistenciamultiplescausas();
        $r = $DatAsistenciamultiplescausas->getUltimaHora($idpersona, $fecharegistro);
        $r = $r[0]['ultimahora'];
        
        echo(json_encode($r));
    }
    

    function adicionarMultiplesCausasAction()
    {
        // $existe = (new DatAsistenciamultiplescausas())->Existe($this->_request->getPost ('idpersona'),$this->_request->getPost ('idcausa'),
        //     $this->_request->getPost ('fecharegistro'),$this->_request->getPost ('horaentrada'),$this->_request->getPost ('horasalida'));
        
        // if (count($existe) > 0) {
        //     $r['cod'] =3;
        //     echo (json_encode ($r));
        //     return;
        // }

        // $horatt = (new DatAsistencia())->getHorarioByPersona($this->_request->getPost ('idpersona'), $this->_request->getPost ('fecharegistro'));
        
        // $a = explode(' ', $this->_request->getPost('horaentrada'));
        // $b = explode(' ', $this->_request->getPost('horasalida'));

        // $fechaEntrada = new DateTime($this->_request->getPost('horaentrada'));
        // $fechaSalida = new DateTime($this->_request->getPost('horasalida'));
        
        // $obj = new DatAsistenciamultiplescausas();
        // $obj->idpersona = $this->_request->getPost ('idpersona');
        // $obj->idcausa = $this->_request->getPost ('idcausa');
        // $obj->fecharegistro = $this->_request->getPost ('fecharegistro');
        // $obj->horaentrada = $a[1];
        // $obj->horasalida = $b[1];
        // $obj->fechaentrada = $fechaEntrada->format('Y-m-d H:i:s');
        // $obj->fechasalida = $fechaSalida->format('Y-m-d H:i:s');

        // $fregistroarr = explode('/', $this->_request->getPost ('fecharegistro'));
        // $Halmuerzo = explode(':', $horatt['horarioalmuerzo']);
        // $TDesc = explode(':', $horatt['tdescanso']);
        // // $horaentrada = explode(':', $this->_request->getPost ('horaentrada'));
        // // $horasalida = explode(':', $this->_request->getPost ('horasalidaOtroDia'));
        // // $horaentradareal = new DateTime(date('Y-m-d H:i:s', mktime($horaentrada[0], $horaentrada[1], 0, $fregistroarr[1], $fregistroarr[0], $fregistroarr[2]))); //Construccion del DateTime de la hora inicial
        // // $horasalidareal = new DateTime(date('Y-m-d H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fregistroarr[1], $fregistroarr[0], $fregistroarr[2]))); //Construccion del DateTime de la hora inicial
        // // $horaalmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        // // $horadescanso = new DateTime(date('H:i', mktime($TDesc[0], $TDesc[1], $TDesc[2], 1, 1, 2000)));
        // // $hrsperdidas = date_diff($horasalidareal, $horaentradareal);
        // // $hrsperdidasaux = new DateTime(date('H:i', mktime($hrsperdidas->h, $hrsperdidas->i, $hrsperdidas->s, 1, 1, 2000)));
        // // $horadescanso = new DateTime(date('H:i', mktime($TDesc[0], $TDesc[1], $TDesc[2], 1, 1, 2000)));

        // // if($horaentradareal < $horaalmuerzo && $horasalidareal > $horaalmuerzo){
        // //     $hrsperdidas = date_diff($hrsperdidasaux, $horadescanso);            }
        // // if(strlen($hrsperdidas->i) == 1 && strlen($hrsperdidas->h) == 1){
        // //     $horas = '0'.$hrsperdidas->h.':0'.$hrsperdidas->i;}
        // // else if(strlen($hrsperdidas->i) == 1){
        // //     $horas = $hrsperdidas->h.':0'.$hrsperdidas->i;}
        // // else if(strlen($hrsperdidas->h) == 1){
        // //     $horas = '0'.$hrsperdidas->h.':'.$hrsperdidas->i;}
        // // else $horas = $hrsperdidas->h.':'.$hrsperdidas->i;

        // $fechaEntradaAlmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        // $fechaSalidaAlmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0] + $TDesc[0], $Halmuerzo[1] + $TDesc[1], $Halmuerzo[2] + $TDesc[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        // // print_r($fechaEntrada->format('Y-m-d H:i:s'));die;
        
        // $duracionAfectacion = $fechaSalida->getTimestamp() - $fechaEntrada->getTimestamp();

        // $tiempoDescanso = 0;
        // $solapeInicio = max($fechaEntrada, $fechaEntradaAlmuerzo);
        // $solapeFin = min($fechaSalida, $fechaSalidaAlmuerzo);
        
        // if ($solapeInicio < $solapeFin) {
        //     $tiempoDescanso += $solapeFin->getTimestamp() - $solapeInicio->getTimestamp();
        // }

        // $hora = ($duracionAfectacion - $tiempoDescanso) / 3600;

        // $horas = floor($hora);
        // $minutos = ($hora - $horas) * 60;

        // $horaFormateada = sprintf('%02d:%02d', $horas, $minutos);

        // $sumHoras = DatAsistenciamultiplescausas::sumHorasMultiplesCausasByIdsAsist($this->_request->getPost ('idasistencia'))[0]['sum'];


        // if (self::tiempoASegundos($horaFormateada) + self::tiempoASegundos($sumHoras) > self::tiempoASegundos($horatt['horas'])) {
        //     $r['cod'] =4;
        //     echo (json_encode ($r));
        //     return;
        // }

        // $obj->horas = $horaFormateada;
        // $obj->observaciones = $this->_request->getPost ('observaciones');
        // $obj->idasistencia = $this->_request->getPost ('idasistencia');
        // $obj->save();
        // $this->actualizarAsistencia($this->_request->getPost ('idasistencia'), $this->_request->getPost ('idcausa'),$horatt,$horaFormateada,'add');
        // $r['cod'] =1;
        // echo (json_encode ($r));
        $res = DatAsistensiaMultiplesCausasModel::AddModMultiplesCausas($this->_request->getPost(), 'add');
        echo (json_encode ($res));
    }


    function existeMultiplescausasAction(){
        $habmultiplescausas = (new ConfHabilitarmultiplescausas())->gethabilitarmultiplescausas();
        if($habmultiplescausas[0]['habilitadomc'] == 1)
            $r = 1;
        else
            $r = 0;
        echo (json_encode ($r));
    }

    function modificarMultiplesCausasAction()
    {
        // $obj = Doctrine::getTable('DatAsistenciamultiplescausas')->find($this->_request->getPost('idasistenciamultiplescausas'));
        // $obj->idpersona = $this->_request->getPost ('idpersona');
        // $obj->idcausa = $this->_request->getPost ('idcausa');
        // $obj->fecharegistro = $this->_request->getPost ('fecharegistro');
        // $obj->horaentrada = $this->_request->getPost ('horaentrada');
        // $obj->horasalida = $this->_request->getPost ('horasalida');

        // $horatt = (new DatAsistencia())->getHorarioByPersona($this->_request->getPost ('idpersona'), $this->_request->getPost ('fecharegistro'));
        // $fregistroarr = explode('/', $this->_request->getPost ('fecharegistro'));
        // $horaentrada = explode(':', $this->_request->getPost ('horaentrada'));
        // $horasalida = explode(':', $this->_request->getPost ('horasalida'));
        // $Halmuerzo = explode(':', $horatt['horarioalmuerzo']);
        // $TDesc = explode(':', $horatt['tdescanso']);
        // $horaentradareal = new DateTime(date('Y-m-d H:i:s', mktime($horaentrada[0], $horaentrada[1], 0, $fregistroarr[1], $fregistroarr[0], $fregistroarr[2]))); //Construccion del DateTime de la hora inicial
        // $horasalidareal = new DateTime(date('Y-m-d H:i:s', mktime($horasalida[0], $horasalida[1], 0, $fregistroarr[1], $fregistroarr[0], $fregistroarr[2]))); //Construccion del DateTime de la hora inicial
        // $horaalmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        // $horadescanso = new DateTime(date('H:i', mktime($TDesc[0], $TDesc[1], $TDesc[2], 1, 1, 2000)));
        // $hrsperdidas = date_diff($horasalidareal, $horaentradareal);
        // $hrsperdidasaux = new DateTime(date('H:i', mktime($hrsperdidas->h, $hrsperdidas->i, $hrsperdidas->s, 1, 1, 2000)));
        // $horadescanso = new DateTime(date('H:i', mktime($TDesc[0], $TDesc[1], $TDesc[2], 1, 1, 2000)));
        
        // if($horaentradareal < $horaalmuerzo && $horasalidareal > $horaalmuerzo){
        //     $hrsperdidas = date_diff($hrsperdidasaux, $horadescanso);        }
        // if(strlen($hrsperdidas->i) == 1 && strlen($hrsperdidas->h) == 1){
        //     $horas = '0'.$hrsperdidas->h.':0'.$hrsperdidas->i;}
        // else if(strlen($hrsperdidas->i) == 1){
        //     $horas = $hrsperdidas->h.':0'.$hrsperdidas->i;}
        // else if(strlen($hrsperdidas->h) == 1){
        //     $horas = '0'.$hrsperdidas->h.':'.$hrsperdidas->i;}
        // else $horas = $hrsperdidas->h.':'.$hrsperdidas->i;
        // $obj->horas = $horas;
        // $obj->observaciones = $this->_request->getPost ('observaciones');
        // $obj->idasistencia = $this->_request->getPost ('idasistencia');
        // $obj->save();
        // $this->actualizarAsistencia($this->_request->getPost ('idasistencia'),$this->_request->getPost ('idcausa'),$horatt,$horas,'upd');          
        // $r['cod'] = 1;
        // echo (json_encode ($r));
        $res = DatAsistensiaMultiplesCausasModel::AddModMultiplesCausas($this->_request->getPost(), 'upd');
        echo (json_encode ($res));
    }

    function eliminarMultiplesCausasAction()
    {
        $resp =  $this->Eliminar($this->_request->getPost ('idasistenciamultiplescausas'));
        $horatt = (new DatAsistencia())->getHorarioByPersona($this->_request->getPost ('idpersona'), $this->_request->getPost ('fecharegistro'));
        
        $fregistroarr = explode('/', $this->_request->getPost ('fecharegistro'));

        $horaEntradaTurno = $horatt['horaentradaps'];
        $horaSalidaTurno = $horatt['horasalidass'];

        $Het = explode(':', $horaEntradaTurno);
        $horaEntradaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));

        $Het = explode(':', $horaSalidaTurno);
        
        if ($horatt['otrodia'] == 1) {
            $horaSalidaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0] + 1, $fregistroarr[2])));
        } else {
            $horaSalidaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        }
        
        DatAsistensiaMultiplesCausasModel::actualizarAsistencia(
            $this->_request->getPost('idasistencia')
        );
        
        // $asist = (new DatAsistenciamultiplescausas())->getAsistenciasMultiplesCausas($this->_request->getPost('idasistencia'));
        // $horasdescontadas = 0;
        // foreach ($asist as $a){
        //     $causa = (new NomCausa())->GetCausasById($a['idcausa']);
        //     if($causa[0]['afectasalario']){
        //         $sumHoras = (new DatAsistenciamultiplescausas())->sumHorasMultiplesCausasByIdsAsist($this->_request->getPost ('idasistencia'))[0]['sum'];
        //     }
        // }
        // $horasdescontadas = ($sumHoras == 0)?'':$sumHoras;
        // $horastrabajadas = (new DatAsistenciaModel())->RestOnlyTime($horatt['horas'], $horasdescontadas);
        // $horasdescontadasaux = explode(':', $horasdescontadas);
        // $horastrabajadasaux = explode(':', $horastrabajadas);
        // $hrsdescontadas = $horasdescontadasaux[0].':'.$horasdescontadasaux[1];
        // $hrstrabajadas = $horastrabajadasaux[0].':'.$horastrabajadasaux[1];
        // $hrsdescontadas = ($sumHoras == 0)?'':$hrsdescontadas;
        // (new DatAsistencia())->UpdateAsistenciaByPerson($this->_request->getPost ('idasistencia'), $hrsdescontadas,$hrstrabajadas);
        if ($resp == false) {
            $m->codMsg = 3;
            echo json_encode($m);
        } else {
            $m->codMsg = 1;
            echo json_encode($m);
        }
    }

    public function Eliminar($idasistenciamultiplescausas)
    {
        $obj = Doctrine:: getTable('DatAsistenciamultiplescausas')->find($idasistenciamultiplescausas);
        try {
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    // function actualizarAsistencia($idasistencia,$idcausa,$horatt,$horas,$accion)
    // {
    //     $asistencia = (new DatAsistencia())->getAsistenciaByPerson($idasistencia);
    //     $causa = (new NomCausa())->GetCausasById($idcausa);
    //     $horasdescontadas = null;
    //     //if($causa[0]['afectasalario']){
    //         $sumHoras = (new DatAsistenciamultiplescausas())->SumHorasByCausa($idasistencia);
    //         $horasdescontadas = ($sumHoras[0]['sum'] <= $horatt['horas'])?$sumHoras[0]['sum']:$horatt['horas'];
    //         if(empty($horasdescontadas))
    //             $horasdescontadas = '00:00:00';
    //         $horastrabajadas = (new DatAsistenciaModel())->RestOnlyTime($horatt['horas'], $horasdescontadas);
    //         $horasdescontadasaux = explode(':', $horasdescontadas);
    //         $horastrabajadasaux = explode(':', $horastrabajadas);
    //         $hrsdescontadas = $horasdescontadasaux[0].':'.$horasdescontadasaux[1];
    //         $hrstrabajadas = $horastrabajadasaux[0].':'.$horastrabajadasaux[1];
    //         (new DatAsistencia())->UpdateAsistenciaByPerson($idasistencia, $hrsdescontadas,$hrstrabajadas);
    //     //}
    // }

    public function generarArregloHorasAction()
    {
        // Obtener parámetros
        $horaInicio = $this->_request->getPost('horainicio', '08:00:00');
        $horaFin = $this->_request->getPost('horafin', '17:00:00');
        $intervaloMinutos = 15; // Intervalo fijo de 15 minutos
        
        // Validar formato HH:MM:SS
        if (!preg_match('/^(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/', $horaInicio) || 
            !preg_match('/^(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/', $horaFin)) {
            echo Zend_Json::encode([
                'success' => false,
                'message' => 'Formato de hora inválido. Use HH:MM:SS (24 horas)'
            ]);
            return;
        }

        // Convertir a segundos
        list($hIni, $mIni, $sIni) = explode(':', $horaInicio);
        list($hFin, $mFin, $sFin) = explode(':', $horaFin);
        
        $segundosInicio = $hIni * 3600 + $mIni * 60 + $sIni;
        $segundosFin = $hFin * 3600 + $mFin * 60 + $sFin;

        // Si horaInicio es igual a horaFin, generar 24 horas a partir de horaInicio
        $rangoCompleto = false;
        if ($horaInicio == $horaFin) {
            $segundosFin = $segundosInicio + 86400; // 24 horas después
            $rangoCompleto = true;
        }
        // Si la hora final es anterior a la inicial (sin ser iguales), sumar 24 horas
        elseif ($segundosFin < $segundosInicio) {
            $segundosFin += 86400;
        }

        $horas = array();
        $segundosActual = $segundosInicio;
        $id = 1; // Contador para el ID

        while ($segundosActual <= $segundosFin) {
            $horasFormato = floor($segundosActual / 3600) % 24;
            $minutosFormato = floor(($segundosActual % 3600) / 60);
            $segundosFormato = $segundosActual % 60;
            
            $horaFormateada = sprintf("%02d:%02d:%02d", $horasFormato, $minutosFormato, $segundosFormato);
            
            // Añadir al array con ID
            $horas[] = array(
                'id' => $id++,
                'hora' => $horaFormateada,
                'valor' => $horaFormateada,
                'texto' => substr($horaFormateada, 0, 5), // Muestra solo HH:MM
                'es_dia_siguiente' => ($segundosActual >= ($segundosInicio + 86400)) // Marca horas del día siguiente
            );
            
            $segundosActual += $intervaloMinutos * 60;
            
            // Limitar a exactamente 24 horas si es rango completo
            if ($rangoCompleto && ($segundosActual - $segundosInicio) >= 86400) {
                break;
            }
        }

        // Retornar respuesta JSON
        echo Zend_Json::encode(array(
            'success' => true,
            'datos' => $horas,
            'cantidad' => count($horas),
            'rango_completo' => $rangoCompleto,
            'hora_inicio' => $horaInicio
        ));
    }

}

?>