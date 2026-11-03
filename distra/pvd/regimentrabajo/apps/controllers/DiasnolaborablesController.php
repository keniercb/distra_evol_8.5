<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class DiasnolaborablesController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function diasnolaborablesAction()
    {
        $this->render();
    }

    function cargarGruposRegimenAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
        $identidades = ZendExt_IoC::getInstance()->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($identidad);
        $Model = new NomGrupodescansoModel();
        $result = $Model->getGrupoDescansoByEntidadActive($this->_request->getPost('criterio'), $limit, $start,$identidades);
        $r['datos'] = $result->data;
        $r['cantidad'] = $result->quantity;
        echo(json_encode($r));
    }

    function cargarDiasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idgrupodescanso = $this->_request->getPost('idgrupodescanso');
        $idcargo = $this->_request->getPost('idcargo');
        $idpersona = $this->_request->getPost('idpersona');
        $year = $this->_request->getPost('year');
        $grupo = new NomGrupodescanso();
        $g = $grupo->getGrupoById($idgrupodescanso);
        $r['predeterminado'] = $g[0]['predeterminado'];
        $existe = ConfHabusuarios::existe($_SESSION['Zeolides']['perfil']['idusuario']);
        if(!empty($existe))
            $r['existe'] = 1;
        else
            $r['existe'] = 0;
        if($idpersona == -1){
            $Model = new ConfCalendarioModel();
            $result = $Model->getByGrupodescansoLimit($idgrupodescanso, $year, $limit, $start);
            $r['datos'] = $result;
            $r['cantidad'] = count($result);
        }
        else{
            $confCalendarioPers = new ConfCalendariopersonaModel();
            $result = $confCalendarioPers->getCalendarioByIdpersonas(array($idpersona), $year, $idcargo);
            $r['datos'] = $result;
            $r['cantidad'] = count($result);
        }
        echo(json_encode($r));
    }

    function addDiasAction()
    {
        $idgrupodescanso = $this->_request->getPost('idgrupodescanso');
        $idtipodedia = $this->_request->getPost('idtipodedia');
        $idpersona = $this->_request->getPost('idpersona');
        $idcargo = $this->_request->getPost('idcargo');
        $turnotrabajo = ($this->_request->getPost('turnotrabajo') == '') ? null : $this->_request->getPost('turnotrabajo');
        $dates = json_decode(stripslashes($this->_request->getPost('fechas')));
        $fechas = array_unique($dates);
        $calendPersona = new ConfCalendariopersonaModel();
        $modelConfCalendario = new ConfCalendarioModel();
//        $modelConfCalendario->Eliminar($fechas, array($idgrupodescanso));
        if($idpersona == -1)
        {
            $result = $modelConfCalendario->Insertar($idtipodedia, $idgrupodescanso, $fechas, $turnotrabajo);
            $planifPersona = $calendPersona->saveCalendarioPersona($idtipodedia, $idgrupodescanso, $fechas, $turnotrabajo);
        }
        else
        {
            $result = true;
            $idpersonacargo = array();
            array_push($idpersonacargo,['idpersona'=>$idpersona,'idcargo'=>$idcargo]);
            $planifPersona = $calendPersona->saveCalendarioByIdpersonas($idtipodedia, $fechas, $turnotrabajo, $idpersonacargo);
        }

        if ($this->_request->getPost('delAsistencia') == 1) {
            $AsisModel = new DatAsistenciaModel();
            $AsisModel->Eliminar(json_decode(stripslashes($this->_request->getPost('delDates'))), $idgrupodescanso);
        }
        if ($result && $planifPersona)
            $r['cod'] = 1;
        else
            if(!$result)
                $r['cod'] = 2;
            else
                $r['cod'] = 3;
        echo(json_encode($r));
    }

    function delDiasAction()
    {
        $arrfechas = json_decode(stripslashes($this->_request->getPost('seleccion')));
        $idgrupodescanso = $this->_request->getPost('idgrupodescanso');
        $idpersona = $this->_request->getPost('idpersona');
        $idcargo = $this->_request->getPost('idcargo');
        $idpersonacargo = array();
        array_push($idpersonacargo,['idpersona'=>$idpersona,'idcargo'=>$idcargo]);
        $modelConfCalendario = new ConfCalendarioModel();
        $modelCalendarioPersona = new ConfCalendariopersonaModel();
        $AsisModel = new DatAsistenciaModel();

        if($idpersona == -1){
            $result1 = $modelCalendarioPersona->deleteCalendarioPerByGrupodescanso($idgrupodescanso, $arrfechas);
            $result = $modelConfCalendario->Eliminar($arrfechas, $idgrupodescanso);
            $AsisModel->Eliminar($arrfechas, $idgrupodescanso);
        }else{
            $result1 = $modelCalendarioPersona->deleteCelendarioPerByIdpersonaAndCargo($arrfechas, $idpersonacargo);
            $AsisModel->EliminarAsistPersona($arrfechas, $idpersonacargo);
            $result = true;
        }

        if ($result && $result1)
            $r['cod'] = 1;
        else
            $r['cod'] = 3;
        echo(json_encode($r));
    }

    function cargatTipoDiasAction()
    {
        $modelNomDias = new NomTipodiaModel();
        $result = $modelNomDias->GetAll();
        $r['datos'] = $result;
        $r['cantidad'] = count($result);
        echo(json_encode($r));
    }

    function getLimitesAction()
    {
        $result = ConfHorasextras::getLimites();
        echo json_encode($result);
    }

    function setLimitesAction()
    {
        $arrIds = json_decode(stripslashes($this->_request->getPost('datos')));
        $result = true;
        foreach ($arrIds as $v) {
            $r = ConfHorasextrasModel::setLimites($v->id, $v->limite);
            if ($r == false) {
                $result = false;
            }
        }
        echo json_encode($result);
    }

    function generarPdfReporteAction()
    {
        $anno = $this->_request->get('anno');
        $finicio = "";
        $ffin = "";
        $quincena = false;
        $columnasGrid = array();
        $mes = 1;
        $confFechas = new DatPeriodomes();
        if (!empty($anno)) {
            $year = $anno;
        } else {
            $y = explode('/', date('d/m/Y'));
            $year = $y[2];
        }
        $rangoFechas = $confFechas->getPeriodo($year);
        if (!empty($rangoFechas)) {
            $quincena = false;
            foreach ($rangoFechas as $j => $a) {
                $fechainicio = explode('/', $a['fdesde']);
                $fechafin = explode('/', $a['fhasta']);
                $finicio = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
                $finicio1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
                $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);

                $columnasGrid[$mes] = Array();
                while ($finicio1 <= $ffin) {
                    $fi = explode('/', $finicio1->format('d/m/Y'));
                    array_push($columnasGrid[$mes], $fi[0] . '/' . $fi[1]);
                    date_add($finicio1, date_interval_create_from_date_string('1 day'));
                    $FIT = explode('/', $finicio1->format('d/m/Y'));
                    $finicio1 = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                }
                $mes++;
            }
            $finicio = $rangoFechas[0]['fdesde'];
            $ffin = $rangoFechas[11]['fhasta'];
            $rangos = $rangoFechas;
        }

        $confFechasQuincena = new DatPeriodoquincena();
        $rangoFechasQuincena = $confFechasQuincena->getPeriodo($year);
        $columnasGridSeg = Array();
        if (!empty($rangoFechasQuincena)) {
            $quincena = true;
            foreach ($rangoFechasQuincena AS $i => $v) {
                $fechainiciopq = explode('/', $v['fdesdeprimquincena']);
                $fechafinpq = explode('/', $v['fhastaprimquincena']);

                $fechainiciosq = explode('/', $v['fdesdesegquincena']);
                $fechafinsq = explode('/', $v['fhastasegquincena']);

                $finiciopq = date_create($fechainiciopq[2] . '-' . $fechainiciopq[1] . '-' . $fechainiciopq[0]);
                $finicio1pq = date_create($fechainiciopq[2] . '-' . $fechainiciopq[1] . '-' . $fechainiciopq[0]);
                $ffinpq = date_create($fechafinpq[2] . '-' . $fechafinpq[1] . '-' . $fechafinpq[0]);

                $finiciosq = date_create($fechainiciosq[2] . '-' . $fechainiciosq[1] . '-' . $fechainiciosq[0]);
                $finicio1sq = date_create($fechainiciosq[2] . '-' . $fechainiciosq[1] . '-' . $fechainiciosq[0]);
                $ffinsq = date_create($fechafinsq[2] . '-' . $fechafinsq[1] . '-' . $fechafinsq[0]);

                $columnasGrid[$mes] = Array();
                while ($finicio1pq <= $ffinpq) {
                    $fi = explode('/', $finicio1pq->format('d/m/Y'));
                    array_push($columnasGrid[$mes], $fi[0]);
                    date_add($finicio1pq, date_interval_create_from_date_string('1 day'));
                    $FIT1 = explode('/', $finicio1pq->format('d/m/Y'));
                    $finicio1pq = date_create($FIT1[2] . '-' . $FIT1[1] . '-' . $FIT1[0]);
                }
                $columnasGridSeg[$mes] = Array();
                while ($finicio1sq <= $ffinsq) {
                    $fi = explode('/', $finicio1sq->format('d/m/Y'));
                    array_push($columnasGridSeg[$mes], $fi[0]);
                    date_add($finicio1sq, date_interval_create_from_date_string('1 day'));
                    $FIT2 = explode('/', $finicio1sq->format('d/m/Y'));
                    $finicio1sq = date_create($FIT2[2] . '-' . $FIT2[1] . '-' . $FIT2[0]);
                }
                $mes++;
            }
            $finicio = $rangoFechasQuincena[0]['fdesdeprimquincena'];
            $ffin = $rangoFechasQuincena[11]['fhastasegquincena'];
            $rangos = $rangoFechasQuincena;
        }
        $cantdiasmeses = array();
        $cantdiasmeses = $this->getCantDiasMes($year);
        if (empty($rangoFechasQuincena) && empty($rangoFechas)) {
            $quincena = false;
            $mensual = array();
            foreach ($cantdiasmeses AS $k => $v) {
                $mensual[$k]['mes'] = $k + 1;
                $mensual[$k]['anno'] = $year;
                $mensual[$k]['fdesde'] = '01/' . $mensual[$k]['mes'] . '/' . $year;
                $mensual[$k]['fhasta'] = $v['cantdias'] . '/' . $mensual[$k]['mes'] . '/' . $year;
            }
            foreach ($mensual AS $e => $d) {
                $fechainicio = explode('/', $d['fdesde']);
                $fechafin = explode('/', $d['fhasta']);
                $finicio = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
                $finicio1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
                $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);

                $columnasGrid[$mes] = Array();
                while ($finicio1 <= $ffin) {
                    $fi = explode('/', $finicio1->format('d/m/Y'));
                    array_push($columnasGrid[$mes], $fi[0]);
                    date_add($finicio1, date_interval_create_from_date_string('1 day'));
                    $FIT3 = explode('/', $finicio1->format('d/m/Y'));
                    $finicio1 = date_create($FIT3[2] . '-' . $FIT3[1] . '-' . $FIT3[0]);
                }
                $mes++;
            }
            $finicio = $mensual[0]['fdesde'];
            $ffin = $mensual[11]['fhasta'];
            $rangos = $mensual;
        }

        $objReportePDF = new ReportepdfConfigRegimenModel();
        $objReportePDF->CrearReportePDF($finicio, $ffin, $columnasGrid, $quincena, $columnasGridSeg, $rangos);
        return true;
    }

    public function getCantDiasMes($anno)
    {
        $totalmes = Array();
        $totalmes[1]['mes'] = "Enero";
        $totalmes[2]['mes'] = "Febrero";
        $totalmes[3]['mes'] = "Marzo";
        $totalmes[4]['mes'] = "Abril";
        $totalmes[5]['mes'] = "Mayo";
        $totalmes[6]['mes'] = "Junio";
        $totalmes[7]['mes'] = "Julio";
        $totalmes[8]['mes'] = "Agosto";
        $totalmes[9]['mes'] = "Septiembre";
        $totalmes[10]['mes'] = "Octubre";
        $totalmes[11]['mes'] = "Noviembre";
        $totalmes[12]['mes'] = "Diciembre";

        $resultado = Array();
        foreach ($totalmes AS $k => $v) {
            $cantDiasMes = date('t', mktime(0, 0, 0, $k, 1, $anno));
            $aux['key'] = $k;
            $aux['mes'] = $totalmes[$k]['mes'];
            $aux['cantdias'] = $cantDiasMes;
            array_push($resultado, $aux);
        }
        return $resultado;
    }

    function getResumenAction()
    {
        $result['datos'] = ResumenRtdModel::getTotalMes($this->_request->getPost('idgrupodescanso'), $this->_request->getPost('idregimentrabajo')
            , $this->_request->getPost('anno'));
        echo json_encode($result);
    }

    function getResumenQuincenalAction()
    {
        $result['datos'] = ResumenRtdModel::getTotalQuincena($this->_request->getPost('idgrupodescanso'), $this->_request->getPost('idregimentrabajo')
            , $this->_request->getPost('anno'));
        echo json_encode($result);
    }

    function getResumenAnualAction()
    {
        $result = ResumenRtdModel::getResumenAnual($this->_request->getPost('idgrupodescanso'), $this->_request->getPost('idregimentrabajo')
            , $this->_request->getPost('anno'));
        echo json_encode($result);
    }

    function getResumenAnualQuincenalAction()
    {
        $result = ResumenRtdModel::getResumenAnualQuincenal($this->_request->getPost('idgrupodescanso'), $this->_request->getPost('idregimentrabajo')
            , $this->_request->getPost('anno'));
        echo json_encode($result);
    }

    function limpiarConfiguracionAction()
    {
        $idgrupodescanso = $this->_request->getPost('idgrupodescanso');
        $year = $this->_request->getPost('anno');
        //$idpersona = $this->_request->getPost('idpersona');
        $datAsistencia = new DatAsistencia();

        $modelConfCalendarioP = new ConfCalendariopersonaModel();
        if(!empty($idgrupodescanso) /*$idpersona == -1*/){
            $modelConfCalendario = new ConfCalendarioModel();
            $datAsistencia->DelAsistenciaByGrupoDescanso($idgrupodescanso,$year);
            $result = $modelConfCalendario->EliminarByIdgrupodescanso($idgrupodescanso,$year);
            $result1 = $modelConfCalendarioP->deleteByIdgrupodescansoYear($idgrupodescanso,$year);
        }
       /* else{
            $result = true;
            $result1 = $modelConfCalendarioP->deleteOnlyCalPersonaByIdpersYear($idpersona, $idgrupodescanso, $year);
        }*/
        if ($result && $result1)
            $r['cod'] = 1;
        else
            $r['cod'] = 3;
        $r['datos'] = array();
        echo(json_encode($r));
    }

    function getRangosFechasAction()
    {
        $anno = $this->_request->getPost('anno');
        if (!empty($anno)) {
            $year = $anno;
        } else {
            $y = explode('/', date('d/m/Y'));
            $year = $y[2];
        }
        $result['datos'] = ResumenRtdModel::getTotalMesRangos($year);
        echo json_encode($result);
    }

    function guardarPeriodosAction()
    {
        $arreglo = json_decode(stripslashes($this->_request->getPost('arreglo')));
        $modelConfCalendario = new ConfCalendarioModel();
        $result = $modelConfCalendario->guardarPeriodos($arreglo);
        if ($result)
            $r['cod'] = 1;
        else
            $r['cod'] = 3;
        echo(json_encode($r));
    }

    function delPeriodosMesAction()
    {
        $anno = $this->_request->getPost('anno');
        $DatPeriodomes = new DatPeriodomes();
        $result = $DatPeriodomes->eliminarAllPeriodo($anno);
        if ($result)
            $r['cod'] = 1;
        else
            $r['cod'] = 3;
        echo(json_encode($r));
    }

    function getRangosFechasQuincenalAction()
    {
        $anno = $this->_request->getPost('anno');
        if (!empty($anno)) {
            $year = $anno;
        } else {
            $y = explode('/', date('d/m/Y'));
            $year = $y[2];
        }

        $result['datos'] = ResumenRtdModel::getTotalRangosQuincenal($year);
        echo json_encode($result);
    }

    function guardarPeriodosQuincenalAction()
    {
        $arreglo = json_decode(stripslashes($this->_request->getPost('arreglo')));
        $modelConfCalendario = new ConfCalendarioModel();
        $result = $modelConfCalendario->guardarPeriodosQuincenal($arreglo);
        if ($result)
            $r['cod'] = 1;
        else
            $r['cod'] = 3;
        echo(json_encode($r));
    }

    function delPeriodosQuincenalAction()
    {
        $anno = $this->_request->getPost('anno');
        $DatPeriodoquin = new DatPeriodoquincena();
        $result = $DatPeriodoquin->eliminarAllPeriodo($anno);

        if ($result)
            $r['cod'] = 1;
        else
            $r['cod'] = 3;
        echo(json_encode($r));
    }

    function isPeriodoConfiguradoAction()
    {
        $result['datosq'] = DatPeriodoquincena::getPeriodo($this->_request->getPost('anno'));
        $result['datosm'] = DatPeriodomes::getPeriodo($this->_request->getPost('anno'));

        if (count($result['datosq']) > 0)
            echo "1";
        else
            if (count($result['datosm']) > 0)
                echo "2";
            else
                echo "0";
    }

    public function obtenerTurnoTrabajoAction()
    {
        $result = array();
        $obj = new NomTurnotrabajoModel();
        $turnos = $obj->GetAll();
        $r['datos'] = $turnos;
        echo(json_encode($r));
    }

    function isWeekend($date)
    {
        return (date('N', strtotime($date)) >= 6);
    }

    function guardardiasplanificarAction()
    {
        $idgrupodescanso = $this->_request->getPost('idgrupodescanso');
        $idtipodedia = $this->_request->getPost('idtipodia');
        $turnotrabajo = ($this->_request->getPost('idturnotrabajo') == '') ? null : $this->_request->getPost('idturnotrabajo');
        $diassemana = json_decode(stripslashes($this->_request->getPost('diassemana')));
        $desde = $this->_request->getPost('desde');
        $hasta = $this->_request->getPost('hasta');
        $fechainicio = explode('/', $desde);
        $fechafin = explode('/', $hasta);
        $finicio1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);
        $dates = array();
        foreach ($diassemana as $k) {
            while ($finicio1 <= $ffin) {
                $dia = intval($finicio1->format("d"));
                $mes1 = intval($finicio1->format("m"));
                $anno = intval($finicio1->format("Y"));
                $time = strtotime($mes1 . '/' . $dia . '/' . $anno);
                $newformat = date('Y-m-d', $time);

                if ((date('N', strtotime($newformat)) == $k)) {
                    array_push($dates, $finicio1->format("d") . '/' . $finicio1->format("m") . '/' . $finicio1->format("Y"));
                }
                date_add($finicio1, date_interval_create_from_date_string('1 day'));
                $FIT3 = explode('/', $finicio1->format('d/m/Y'));
                $finicio1 = date_create($FIT3[2] . '-' . $FIT3[1] . '-' . $FIT3[0]);
            }
            $finicio1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        }
        $modelConfCalendario = new ConfCalendarioModel();
        $result = $modelConfCalendario->Insertar(/*$horas,*/
            $idtipodedia, $idgrupodescanso, $dates, $turnotrabajo);
        $calendPersona = new ConfCalendariopersonaModel();
        $planifPersona = $calendPersona->saveCalendarioPersona($idtipodedia, $idgrupodescanso, $dates, $turnotrabajo);

        if ($result && $planifPersona)
            $r['cod'] = 1;
        else
            $r['cod'] = 3;
        echo(json_encode($r));
    }

    public function cargaRegimentrabajoAction(){
        $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
        $identidades = ZendExt_IoC::getInstance()->metadatos->BuscarArrIdsEstructurasHijasArbolCompleto($identidad);
        $rtModel = new NomRegimentrabajo();
        $res = $rtModel->getRegimenTrabajoByEntidadActive(null,null,0,$identidades);
        $r['datos'] = $res;
        $r['cantidad'] = count($res);
        echo(json_encode($r));
    }

    public function cargarGruposByIdRegimenAction()
    {
        $gdModel = new NomGrupodescansoModel();
        $res = $gdModel->getGrupoDescansoRegimenActive($this->_request->getPost('idregimentrabajo'));
        foreach($res->data as $k => $dat){
            $res->data[$k]['orden'] = $k;
        }
        $r['datos'] = $res->data;
        $r['cantidad'] = $res->quantity;
        echo(json_encode($r));
    }

    public function planificarTurnosRotativosAction(){
        $grupos = json_decode(stripslashes($this->_getParam('grupos')));
        $turnos= json_decode(stripslashes($this->_getParam('turnos')));
        $horainicio= json_decode(stripslashes($this->_getParam('horainicio')));
        $horafin= json_decode(stripslashes($this->_getParam('horafin')));
        $otrodia= json_decode(stripslashes($this->_getParam('otrodia')));
        $desde = $this->_getParam('fdesde');
        $hasta = $this->_getParam('fhasta');
        $rotate = $this->_getParam('rotate');
        $CCModel = new ConfCalendarioModel();
        $r = $CCModel->planificarTurnosRotativos($grupos, $turnos, $desde, $hasta, $horainicio, $horafin, $rotate,$otrodia);
        echo(json_encode($r));
    }


    public function getPersonasAction(){
        $idregimentrabajo = $this->_request->getPost('idregimentrabajo');
        $filtro = $this->_request->getPost('filtro');
        $nomRegimen = new NomRegimentrabajo();
        $DatAsistenciaModel = new DatAsistenciaModel();
        $reporte = $nomRegimen->getPersonasByRegimen($idregimentrabajo, $filtro);
        $denEntAreas = $DatAsistenciaModel->GetDenomEntAreas($reporte);
        foreach ($reporte as $ind => $persona) {
            $reporte[$ind]['denomarea'] = (is_numeric($persona['idarea'])) ? $denEntAreas[$persona['idarea']]['denominacion'] : 'Sin cargo';
            array_push($cargosPeople,$persona['idcargo']);
        }
        $r['datos'] = $reporte;
        echo(json_encode($r));
    }



}

?>
