<?php

//require_once("dompdf/dompdf_config.inc.php");

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpreportesModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }


    public function CargarReportesExistentes() {
        $arrayreportesexistentes = NomTiporeporte::ObtenerTiposDeReportesExistentes();
        if (isset($arrayreportesexistentes[0])) {
            $cont = 0;
            foreach ($arrayreportesexistentes as $reporte) {
                if ($reporte['idtiporeporte'] != 4) {
                    $arrayreportes[$cont]['idreporte'] = $reporte['idtiporeporte'];
                    $arrayreportes[$cont]['denreporte'] = $reporte['dentiporeporte'];
                    $arrayreportes[$cont]['descreporte'] = $reporte['desctiporeporte'];
                    $arrayreportes[$cont]['icon'] = $reporte['icon'];
                    $arrayreportes[$cont]['modovisual'] = $reporte['modovisual'];
                    $cont++;
                }
            }
        }
        return $arrayreportes;
    }

    public function CargarVersionesDeReporte($datos) {
        $cont = 0;
        switch ($datos->idtipo) {
            case 'nodoraiz':
                $arrayreporteestandar = NomVersionreportes::ObtenerReporteEstandar(
                                $datos->idtiporeporte
                );
                if (isset($arrayreporteestandar[0])) {
                    foreach ($arrayreporteestandar as $reporteestandar) {
                        $arrayversiones[$cont]['id'] = $reporteestandar['idversionreporte'];
                        $arrayversiones[$cont]['text'] = $reporteestandar['denversion'];
                        $arrayversiones[$cont]['draggable'] = false;
                        $arrayversiones[$cont]['leaf'] = true;
                        $arrayversiones[$cont]['estandar'] = $reporteestandar['estandar'];
                        $arrayversiones[$cont]['iconCls'] = '';
                        $arrayversiones[$cont]['partesreportes'] = NomVersionreportesNomPartesreporte::
                                ObtenerPartesVersionReporte(
                                        $reporteestandar['idversionreporte']
                        );
                        if ($datos->idtiporeporte != 5) {
                            $arrayversiones[$cont]['camposreportes'] = NomVersionreportesNomCamporeporte::
                                    ObtenerCamposVersionReporte(
                                            $reporteestandar['idversionreporte']
                            );
                        }
                        $arrayversiones[$cont]['color'] = 0;
                        $cont++;
                    }
                }
                $versionesreporte = NomVersionreportes::ObtenerVersionesReporte(
                                $datos->idusuario, $datos->idtiporeporte
                );
                if (isset($versionesreporte[0])) {
                    foreach ($versionesreporte as $versionreporte) {
                        $color = 0;
                        $arrayversiones[$cont]['id'] = $versionreporte['idversionreporte'];
                        $arrayversiones[$cont]['text'] = $versionreporte['denversion'];
                        $arrayversiones[$cont]['draggable'] = false;
                        $arrayversiones[$cont]['leaf'] = true;
                        $arrayversiones[$cont]['estandar'] = $versionreporte['estandar'];
                        $arrayversiones[$cont]['iconCls'] = '';
                        $arrayversiones[$cont]['partesreportes'] = NomVersionreportesNomPartesreporte::
                                ObtenerPartesVersionReporte(
                                        $versionreporte['idversionreporte']
                        );
                        $arrayversiones[$cont]['camposreportes'] = NomVersionreportesNomCamporeporte::
                                ObtenerCamposVersionReporte(
                                        $versionreporte['idversionreporte']
                        );
                        if ($datos->idtiporeporte == 5) {
                            $idversionreporte = $versionreporte['idversionreporte'];
                            $objversioncamporeporte = Doctrine::getTable(
                                            'NomVersionreportesNomCamporeporte'
                                    )->findByDql(
                                    "idversionreporte = '$idversionreporte' 
                                    AND idcamporeporte = '13'"
                            );
                            if (isset($objversioncamporeporte[0]->idversionreporte) && $objversioncamporeporte[0]->idversionreporte != ''
                            ) {
                                $color = 1;
                            }
                        }
                        $arrayversiones[$cont]['color'] = $color;
                        $cont++;
                    }
                }
                break;
        }
        return $arrayversiones;
    }

    public function cargarFormVersion($datos) {
        $objversionR = Doctrine::getTable('NomVersionreportes')->find(
                $datos->idversionreporte
        );
        $dat [] = array(
            'idversionreporte' => $objversionR->idversionreporte,
            'denversion' => $objversionR->denversion,
            'descversion' => $objversionR->descversion
        );
        return $dat;
    }

    public function CargarCamposConfeccionVersion($datos) {
        if ($datos->idtiporeporte == 1 || $datos->idtiporeporte == 2 || $datos->idtiporeporte == 3
        ) {
            $posicion = 0;
            $arraycampos = NomCamporeporte::ObtenerCamposParaActividades();
            if (isset($arraycampos[0])) {
                foreach ($arraycampos as $key => $campo) {
                    switch ($datos->modovisual) {
                        case 'agrupacion':
                            $posicion = $key + 2;
                            break;
                    }
                    $arraycamposexistentes[$key]['id'] = $campo['idcamporeporte'];
                    $arraycamposexistentes[$key]['text'] = $campo['dencamporeporte'];
                    $arraycamposexistentes[$key]['draggable'] = false;
                    $arraycamposexistentes[$key]['leaf'] = true;
                    $arraycamposexistentes[$key]['iconCls'] = '';
                    $arraycamposexistentes[$key]['checked'] = false;
                    $arraycamposexistentes[$key]['posicion'] = $posicion;
                }
            }
        }
        if ($datos->idtiporeporte == 4) {
            $posicion = 0;
            $arraycampos = NomCamporeporte::ObtenerCamposParaObjetivos();
            if (isset($arraycampos[0])) {
                foreach ($arraycampos as $key => $campo) {
                    switch ($datos->modovisual) {
                        case 'agrupacion':
                            $posicion = $key + 2;
                            break;
                    }
                    $arraycamposexistentes[$key]['id'] = $campo['idcamporeporte'];
                    $arraycamposexistentes[$key]['text'] = $campo['dencamporeporte'];
                    $arraycamposexistentes[$key]['draggable'] = false;
                    $arraycamposexistentes[$key]['leaf'] = true;
                    $arraycamposexistentes[$key]['iconCls'] = '';
                    $arraycamposexistentes[$key]['checked'] = false;
                }
            }
        }
        if ($datos->idtiporeporte == 5) {
            $arraycampos = NomCamporeporte::ObtenerCamposParaCalendario();
            if (isset($arraycampos[0])) {
                foreach ($arraycampos as $key => $campo) {
                    $checked = false;
                    if ($datos->idversionreporte != null) {
                        $datos->idcamporeporte = $campo['idcamporeporte'];
                        $pr = NomVersionreportes::obtenerCamposReportes($datos);
                        if (isset($pr[0])) {
                            $checked = true;
                        }
                    }
                    $arraycamposexistentes[$key]['id'] = $campo['idcamporeporte'];
                    $arraycamposexistentes[$key]['text'] = $campo['dencamporeporte'];
                    $arraycamposexistentes[$key]['draggable'] = false;
                    $arraycamposexistentes[$key]['leaf'] = true;
                    $arraycamposexistentes[$key]['iconCls'] = '';
                    $arraycamposexistentes[$key]['checked'] = $checked;
                }
            }
        }
        return $arraycamposexistentes;
    }

    public function CargarPartesConfeccionVersion($datos) {
        $arraypartes = NomPartesreporte::ObtenerPartesReporte();
        if (isset($arraypartes[0])) {
            foreach ($arraypartes as $key => $parte) {
                $checked = false;
                if ($datos->idversionreporte != null) {
                    $datos->idpartereporte = $parte['idpartereporte'];
                    $pr = NomVersionreportes::obtenerPartesReportes($datos);
                    if (isset($pr[0])) {
                        $checked = true;
                    }
                }
                $arraypartesexistentes[$key]['id'] = $parte['idpartereporte'];
                $arraypartesexistentes[$key]['text'] = $parte['denpartereporte'];
                $arraypartesexistentes[$key]['draggable'] = false;
                $arraypartesexistentes[$key]['leaf'] = true;
                $arraypartesexistentes[$key]['iconCls'] = '';
                $arraypartesexistentes[$key]['checked'] = $checked;
            }
        }
        return $arraypartesexistentes;
    }

    public function AdicionarVersionReporte($datos) {
        if ($datos->versionReporte != null) {//Si esta modificando
            $objversionreporte = Doctrine::getTable('NomVersionreportes')->find(
                    $datos->versionReporte
            );
        } else {
            $objversionreporte = new NomVersionreportes();
        }
        $objversionreporte->denversion = $datos->denversion;
        $objversionreporte->descversion = $datos->descversion;
        $objversionreporte->idautor = $datos->idusuario;
        $objversionreporte->idtiporeporte = $datos->idtiporeporte;
        $objversionreporte->estandar = 0;
        $objversionreporte->save();
        $idversionreporte = $objversionreporte->idversionreporte;
        if ($datos->versionReporte != null) {//Si esta modificando
            //Elimino todas las partes de la version
            $arrayPartes = NomVersionreportesNomPartesreporte::ObtenerPartesVersionReporte(
                            $idversionreporte
            );
            foreach ($arrayPartes as $partereporte) {
                $objparte = Doctrine::getTable(
                                'NomVersionreportesNomPartesreporte'
                        )->findByDql(
                        "idversionreporte = '$partereporte[idversionreporte]'
                    AND idpartereporte = '$partereporte[idpartereporte]'"
                );
                $objparte[0]->delete();
            }
        }
        //Adiciono todas las partes que se seleccionaron
        if (isset($datos->arraypartesreporte[0])) {
            foreach ($datos->arraypartesreporte as $parteR) {
                $objversionParte = new NomVersionreportesNomPartesreporte();
                $objversionParte->idversionreporte = $idversionreporte;
                $objversionParte->idpartereporte = $parteR->idparte;
                $objversionParte->orden = $parteR->orden;
                $objversionParte->save();
            }
        }
        if ($datos->versionReporte != null) {//Si esta modificando
            //Elimino todas los campos de la version
            $arrayCampos = NomVersionreportesNomCamporeporte::ObtenerCamposVersionReporte(
                            $idversionreporte
            );

            foreach ($arrayCampos as $camporeporte) {

                $objcampo = Doctrine::getTable(
                                'NomVersionreportesNomCamporeporte'
                        )->findByDql(
                        "idversionreporte = '$camporeporte[idversionreporte]'
                    AND idcamporeporte = '$camporeporte[idcamporeporte]'"
                );
                $objcampo[0]->delete();
            }
        }
        //Adiciono los campos seleccionados
        if (isset($datos->arraydatosreporte[0])) {
            foreach ($datos->arraydatosreporte as $key => $datosreporte) {
                $objversioncampo = new NomVersionreportesNomCamporeporte();
                $objversioncampo->idversionreporte = $idversionreporte;
                $objversioncampo->idcamporeporte = $datosreporte->idcampo;
                $objversioncampo->orden = $datosreporte->orden;
                $objversioncampo->save();
            }
        }
        $respuesta = 1;
        return $respuesta;
    }

    public function EliminarVersionReporte($datos) {
        $objversion = Doctrine::getTable('NomVersionreportes')->find(
                $datos->idversion
        );
        if ($objversion->idversionreporte) {
            $objversion->delete();
            $respuesta = 1;
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }


    public function generarActaTrabajoFip($datos) {

      $celdas = "padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					text-align:left;
					font-size: 12px;
					border-bottom: 1px solid #000;";

      $celdasright = "padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					font-weight:bold !important;
					text-align:right;
					font-size: 15px;
					border-left: 1px solid #000000;
					border-bottom: 1px solid #000;";

      $celdasleft = "padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					font-weight:bold !important;
					text-align:left;
					font-size: 15px;
					border-left: 1px solid #000000;
					border-bottom: 1px solid #000;";

      $firstceldas = "padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					font-weight:bold !important;
					text-align:center;
					font-size: 15px;
					border-left: 1px solid #000000;
					border-bottom: 1px solid #000;";

      $tituloreporte="<H2 align=center><B style ='font-size: 26px; text-align: center; font-family: 'Arial Black'; font-weight: normal;'>".$datos->titulo."</B></H2>";

      $cuerporeporte = "<table class = 'Estilo1' width='100%' border='0' align='center'>
                                  <tr>
                                    <td>$tituloreporte</td>
                                  </tr></table>";


      $cuerporeporte
        .= "<table border='1' cellspacing='0' cellpadding='1'>
                                  <TR>
                                    <TH><img width='50' height='50' src='".$datos->logo."' />
                                    <TH style='".$firstceldas."'>".$datos->titulo."
                                    <TH style='".$firstceldas."'>No:".$datos->numero."
                                  <TR>
                                    <TH style='".$celdas."'>Fecha: ".$datos->fecha."
                                    <TH style='".$celdas."'>Hora: ".$datos->hora."
                                    <TH style='".$celdas."'>Lugar: ".$datos->lugar."
                                    ";


//      *************Dirigentes****************

          $cantDir=0;
          foreach ($datos->dirigentes as $value){
            $dirigente=$value->cargo." ".$value->nombre." ".$value->apellidos;
            if($cantDir==0){
              $cuerporeporte.="<TR>
                                            <TH align='right' style='".$celdasright."'>Dirige:
                                            <TH COLSPAN='2' align='left' style='".$celdas."'>".$dirigente;
            }else{
              $cuerporeporte.="<TR>
                                            <TH>
                                            <TH COLSPAN='2' align='left' style='".$celdas."'>".$dirigente;
            }
            $cantDir++;
          }

      //      *************Asistentes****************

      $cantAsis=0;
      foreach ($datos->asistentes as $value){
        $asistente=$value->cargo." ".$value->nombre." ".$value->apellidos." (".$value->area.")";
        if($cantAsis==0){
          $cuerporeporte.="<TR>
                                            <TH align='right' style='".$celdasright."'>Asistentes:
                                            <TH COLSPAN='2' align='left' style='".$celdas."'>".$asistente;
        }else{
          $cuerporeporte.="<TR>
                                            <TH>
                                            <TH COLSPAN='2' align='left' style='".$celdas."'>".$asistente;
        }
        $cantAsis++;
      }

      $cuerporeporte.="<TR><TH align='center' COLSPAN='3' style='".$firstceldas."'>Orden del Día:";

      $cuerporeporte.="<TR><TH COLSPAN='3' align='left' style='".$celdas."'>".$datos->ordendeldia;

      $cuerporeporte.="<TR><TH align='center' COLSPAN='3' style='".$firstceldas."'>Acuerdos:";

      $cuerporeporte.="<TR>
                        <TH align='center' style='".$firstceldas."'>Denominación
                        <TH align='center' style='".$firstceldas."'>Fecha de emisión
                        <TH align='center' style='".$firstceldas."'>Fecha de cumplimiento";

      //      *************Acuerdos****************

      foreach ($datos->acuerdos as $value){
        $cuerporeporte.="<TR>
                        <TH align='center' style='".$celdas."' >".$value->denominacion."
                        <TH align='center' style='".$celdas."' >".$value->fechainicio."
                        <TH align='center' style='".$celdas."' >".$value->fechafin;
      }

      $cuerporeporte.="<TR><TH align='center' COLSPAN='3' style='".$celdasleft."'>Sin mas asuntos que tratar:";

      $cuerporeporte.="<TR>
                        <TH align='center' style='".$firstceldas."'>Cargo
                        <TH align='center' style='".$firstceldas."'>Nombre y Apellidos
                        <TH align='center' style='".$firstceldas."'>Firma";

      //      *************Pie de firma****************

      foreach ($datos->piedefirma as $value){
        $cuerporeporte.="<TR>
                        <TH align='center' style='".$celdas."'>".$value->cargo."
                        <TH align='center' style='".$celdas."'>".$value->nombre." ".$value->apellidos."
                        <TH align='center' style='".$celdas."'>".$value->piefirma;
      }




        $cuerporeporte.="</table>";


        $nombrearchivo = $datos->titulo . $datos->idopcion;
        $register = Zend_Registry::getInstance();
        $dirarchivo = $register->config->modulo_path . 'resources/descargas/'
          . $nombrearchivo;
        $dirarchivo = str_replace("apps", "web", $dirarchivo);

        $variable = "<html><head><meta http-equiv=\"Content-Type\"
                      content=\"text/html; charset=UTF-8\"></head><body>"
          .
          $cuerporeporte . "</body></html>";
        switch ($datos->idopcion) {
          case 'vp':
            return $variable;
            break;
          case '.pdf':
            $dir_www = $_SERVER ['DOCUMENT_ROOT'];
            $dir_rel_mt = '/';
            $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);
            require $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/Mpdf/mpdf.php';
            $mpdf = new mPDF('utf-8');
            $mpdf->WriteHTML($variable);
            $mpdf->Output($dirarchivo, 'F');
            return $nombrearchivo;
            break;
          default:
            $fp = fopen($dirarchivo, 'w+');
            fwrite($fp, $variable);
            fclose($fp);
            return $nombrearchivo;
        }
    }



    public function ObtenerReporte($datos) {

      $class_plan=new DatPlanPdo();
      $datos->infoplan=($datos->idplan!='')?$class_plan->Buscar($datos->idplan):array();
      $datos->anoplan = (count($datos->infoplan)>0)?explode("/", $datos->infoplan['fechainicio'])[2]:"";

      $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
                $datos->idusuariosession, $datos->idtipoelemento
        );
        $arrayestadoss = array();
        if (isset($arrayestados[0])) {
            foreach ($arrayestados as $estado) {
                $arrayestadoss[] = $estado['idestado'];
            }
        }
        $datos->arrayestados = $arrayestadoss;
        $arrayidautores = array();
        $arrayidinvolucrados = array();
        $cero = 0;
        $uno = 1;
        if (isset($datos->arrayautores[0])) {
            foreach ($datos->arrayautores as $autor) {
                $idautor = $autor->idautor;
                if ($autor->tipo == 0) {
                    $arrayusuarios = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                            $idautor
                    );
                    if (isset($arrayusuarios[0])) {
                        foreach ($arrayusuarios as $usuario) {
                            $arrayidautores[] = $usuario["idusuario"];
                        }
                    }
                } else {
                    $arrayidautores[] = $idautor;
                }
            }
        }
        if (isset($datos->arrayinvol[0])) {
            foreach ($datos->arrayinvol as $involucrado) {
                $id = $involucrado->idinvolucrado;
                if ($involucrado->tipo == 0) {
                    $id = $involucrado->idgrupo;
                }
                $arrayidinvolucrados[] = $id . $cero;
                $arrayidinvolucrados[] = $id . $uno;
                if ($involucrado->tipo == 1) {
                    $arraygrupos = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                            $id
                    );
                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayidinvolucrados[] = $grupo['idgrupo'] . $cero;
                            $arrayidinvolucrados[] = $grupo['idgrupo'] . $uno;
                        }
                    }
                }
            }
        }
        if (!$datos->idplan) {
            if (!isset($datos->arrayautores[0]) && !isset($datos->arrayinvol[0])
            ) {
                $arrayidautores[] = $datos->idusuariosession;
                $arrayidinvolucrados[] = $datos->idusuariosession . $cero;
                $arrayidinvolucrados[] = $datos->idusuariosession . $uno;
                $arraygrupos = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $datos->idusuariosession
                );
                if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                        $arrayidinvolucrados[] = $grupo['idgrupo'] . $cero;
                        $arrayidinvolucrados[] = $grupo['idgrupo'] . $uno;
                    }
                }
            }
        }
        $datos->arrayidautores = array();
        $datos->arrayidinvolucrados = array();
        $datos->arrayidautores = $arrayidautores;
        $datos->arrayidinvolucrados = $arrayidinvolucrados;

        $arrayidnom = array();
        if (isset($datos->arrayidnom[0])) {
            foreach ($datos->arrayidnom as $nomenclador) {
                $arrayidnom[] = $nomenclador->idnom;
            }
            $datos->arrayidnom = array();
        }
        $datos->arrayidnom = $arrayidnom;
        $versCampo = new NomVersionreportesNomCamporeporte();
        $versParte = new NomVersionreportesNomPartesreporte();
        switch ($datos->idtiporeporte) {
            case 1://Plan de Actividades agrupadas en ARC
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->GenerarListadoActividadesARC($datos);
                break;
            case 2://Plan de Actividades agrupadas por Objetivos
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->GenerarListadoActividadesObjetivos(
                        $datos
                );
                break;
            case 3://Listado de Actividades
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                      $datos->versionadoSelecionado ? $datos->versionadoSelecionado : $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->GenerarListadoActividades($datos);
                break;
            case 4://Listado de Objetivos
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->GenerarListadoObjetivos($datos);
                break;
            case 5://Plan Mensual
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->versionadoSelecionado//$datos->idversionreporte//
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->versionadoSelecionado//$datos->idversionreporte//
                );
                $datos->color = false;
                if (isset($datos->arraycamposreporte[0])) {
                    if ($datos->arraycamposreporte[0]['idcamporeporte'] = 13) {
                        $datos->color = true;
                    }
                }
                $cuerporeporte = $this->GenerarReportesPlanMensual($datos);
                break;
            case 6://Plan-ARC-Objetivos-Actividades
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->GenerarPlanArcObjetivoActividades(
                        $datos
                );
                break;
            case 7://Objetivos con Criterios de Medida
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                  $datos->versionadoSelecionado
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                  $datos->versionadoSelecionado
                );
                $cuerporeporte = $this->generarObjetivosCM($datos);
                break;
            case 8://Diagrama de coordinacion
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                  $datos->versionadoSelecionado
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                  $datos->versionadoSelecionado
                );
                $cuerporeporte = $this->generarDiagramaCoordinacion($datos);
                break;
            case 9://Reporte cualitativo-cuantitativo de actv por periodo
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->generarReporteCualitativoCuantitativo(
                        $datos
                );
                break;
            case 10://Reporte resumen de la planificacion por periodo
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->generarReporteResumenPlanificacion(
                        $datos
                );
                break;
            case 11://Plan Mensual v2
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->versionadoSelecionado//$datos->idversionreporte//
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->versionadoSelecionado//$datos->idversionreporte//
                );
                $datos->color = false;
                if (isset($datos->arraycamposreporte[0])) {
                    if ($datos->arraycamposreporte[0]['idcamporeporte'] = 13) {
                        $datos->color = true;
                    }
                }
                $cuerporeporte = $this->GenerarPlanMensualv2($datos);
                break;
            case 12://Objetivos - Los condenados
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte//
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte//
                );
                $cuerporeporte = $this->generarReporteObjetivos($datos);
                break;
            case 13://Plan anual
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                  $datos->versionadoSelecionado
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->generarPlanAnual($datos);
                break;
            case 14://Puntualizaciones Los condenados
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->Puntualizacion($datos);
                break;
            case 15://FIP LOS CONDENADOS

                $cuerporeporte = $this->FIP($datos);
                break;
            case 16: //
                $datos->arraypartesreporte = $versParte->ObtenerPartesVersionReporte(
                        $datos->idversionreporte
                );
                $datos->arraycamposreporte = $versCampo->ObtenerCamposVersionReporteParaRecuperaciones(
                        $datos->idversionreporte
                );
                $cuerporeporte = $this->Caracterizacion($datos);
                break;
            case 17: //grafico de coordinacion
                $cuerporeporte = $this->GraficoCoordinacion($datos);
                break;
        }
        $tituloreporte = str_replace(
                " ", "_", $datos->tituloreporte . '(' . rand(
                        0, 1000000000
                ) . ')'
        );
        $nombrearchivo = $tituloreporte . $datos->idopcion;
        $register = Zend_Registry::getInstance();
        $dirarchivo = $register->config->modulo_path . 'resources/descargas/'
                . $nombrearchivo;
        //print_r($dirarchivo);die;
        $dirarchivo = str_replace("apps/planificacion", "web/planificacion", $dirarchivo);
        //print_r($dirarchivo);die;
        $variable = "<html><head><meta http-equiv=\"Content-Type\"
                content=\"text/html; charset=UTF-8\"></head><body>"
                .
                $cuerporeporte . "</body></html>";
        switch ($datos->idopcion) {
            case 'vp':
                return $variable;
                break;
            case '.pdf':
                $dir_www = $_SERVER ['DOCUMENT_ROOT'];
                $dir_rel_mt = '/';
                $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);
                require $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/Mpdf/mpdf.php';
                $mpdf = new mPDF('c');
                $mpdf->WriteHTML($variable);
                $mpdf->Output($dirarchivo, 'F');
                return $nombrearchivo;
                break;
            default: //.xls
                $fp = fopen($dirarchivo, 'w+');
                fwrite($fp, $variable);
                fclose($fp);
                return $nombrearchivo;
        }
    }

  //Reportes Para plan mensual
  public function GenerarReportesPlanMensual($datos) {

    $arrayTareas=array();
    $datos->str_idelementos="";
    if($datos->idplan!=''){
      DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
//        print_r($arrayTareas);die;
      foreach ($arrayTareas as $value){
        $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
      }
    }

    $tabla="";
    $datos->rangotitle=null;
    $datos->tituloreporte=strtoupper($datos->tituloreporte.' de '. $datos->textomeses);
    $datos->suspendidas=1;
      switch ($datos->versionadoSelecionado){
            case 5:
              $tabla=$this->GenerarPlanMensual($datos);
              break;
            case 33:
              $tabla=$this->GenerarPlanMensualDetallado($datos);
              break;
            case 13:
              $tabla=$this->GenerarPlanMensualv2($datos);
              break;
    }
    return $tabla;
  }

    //Reportes
    public function GenerarPlanMensual($datos) {
        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";
                 }
                 p {
                   margin: 0;
                   padding:0 0 0 0;
                  }
                 </style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                  case 1: //clasificacion
                    $tablareport
                              .= "<table class='Estilo1' border='0'>
                             <tr><td>&nbsp;</td>
                             <td><div align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      .
                      $configuracionfirma->cargoaprueba . "</b></div></td>
                              <td width = '800px'><div align='right'><p style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $datos->confidencialidad . "</p></div></td></tr>";
                    $altohoja = $altohoja - 0.25;
                    break;
                  case 2: //aprobado por
                    $tablareport
                              .= "<tr><td><b style ='font-size: 12px; font-family: 'Arial Black';
                                     font-weight: normal;>APROBADO:</b></td><td align='center'>
                             <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >". $configuracionfirma->gradoaprueba . "</b></td>
                            <td>&nbsp;</td></tr>
                            <tr><td><span></span></td><td>&nbsp;</td>
                            <td><span></span></td></tr>
                            <tr><td>&nbsp;</td><td align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $configuracionfirma->nombreaprueba . "</b></td>
                            <td>&nbsp;</td></tr></table>";
                    $altohoja = $altohoja - 5.25;
                    break;
//                  case 3: //titulo
//                        $tablareport
//                                .= "<table class ='Estilo1' width= '100%'border='0' align='center'><tr>
//                                <td><div align='center'><p><b>"
//                                . $datos->tituloreporte . ' '
//                                . 'del mes ' . ' ' . $datos->textomeses
//                                . "</b></p></div></td></tr></table>";
//                        $altohoja = $altohoja - 4;
//                        break;
                    case 4: //elaborado por
                      if ($configuracionfirma->nombrelabora != '') {
                        $tablareport
                          .= " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='500' align='center'> 
                                      <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                          . $configuracionfirma->cargoelabora
                          . "</b></td></tr>";
                        $tablareport
                          .= "<tr><td><div align='center'></td>
                                <td width='500' align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                          . $configuracionfirma->gradoelabora . "</b></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='500'align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                          . $configuracionfirma->nombrelabora . "</b></td>
                                </tr></table></div>";
                      }
                        break;
                    case 5: //actividades principales
                        $arraydat = $this->ConstruirHojaActivPrinicpales(
                                $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
                        );
                        $tablareport = $arraydat["tablareport"];
                        $contadorhojas = $arraydat["contadorhojas"];
                        $existeprincp = $arraydat["principales"];
                        break;
                    case 7:
                        for (
                        $i = 1; $i <= $datos->arraydatosreporte['cantdiasmes']; $i++
                        ) {
                            if ($i < 10) {
                                $day = '0' . $i;
                                $arrayfechas[$i] = $day;
                            }
                            if ($i >= 10) {
                                $day = $i;
                                $arrayfechas[$i] = $day;
                            }

                            $datos->fechainicio = $datos->fechafin = date(
                                    'd-m-Y', mktime(
                                            00, 00, 00, $datos->valuemeses, $i, $datos->valueanno
                                    )
                            );
                            $datos->arraydatosreportes['fechainicioD'] = $datos->arraydatosreportes['fechainicioD'] = null;
                            $datos->repeticiones = 1;
                            $arrayactividadespordia = DatElementos::ObtenerActividadesReporte(
                                            $datos
                            );
                            if (isset($arrayactividadespordia[0]['idelemento'])) {
                                foreach (
                                $arrayactividadespordia as $p => $actividad
                                ) {
                                    $actividades[$i][$p]['hora'] = $actividad['horainicio'];
                                    $actividades[$i][$p]['fechainicio'] = $actividad['fechainicio'];
                                    $actividades[$i][$p]['fechafin'] = $actividad['fechafin'];
                                    $actividades[$i][$p]['titulo'] = $actividad['denelemento'];
                                    $actividades[$i][$p]['lugar'] = $actividad['lugar'];
                                    $actividades[$i][$p]['participantes'] = $actividad['participantes'];
                                    $actividades[$i][$p]['idelemento'] = "";
                                    //**Para el color en el calendario**
                                    $color = '#FFFFFF';
                                    if ($datos->color) {
                                        if ($actividad['color']) {
                                            $color = '#' . $actividad['color'];
                                        }
                                    }
                                    $actividades[$i][$p]['color'] = $color;
                                }
                            }
                        }
                        for ($index = 0; $index < count($actividades); $index++) {
                            for (
                            $index1 = 1; $index1 < count($actividades[$index]); $index1++
                            ) {
                                for (
                                $index2 = 0; $index2 < (count($actividades[$index]) - $index1); $index2++
                                ) {
                                    if (count($actividades[$index]) == 1) {
                                        break;
                                    } else {
                                        $hora_act = split(
                                                ':', $actividades[$index][$index2]['hora']
                                        );
                                        $hora_solo = (int) $hora_act[0];
                                        $min_solo = (int) $hora_act[1];
                                        $hora_act2 = split(
                                                ':', $actividades[$index][($index2 + 1)]['hora']
                                        );
                                        $hora_solo2 = (int) $hora_act2[0];
                                        $min_solo2 = (int) $hora_act2[1];
                                        if ($hora_solo > $hora_solo2) {
                                            $temp = $actividades[$index][$index2];
                                            $actividades[$index][$index2] = $actividades[$index][($index2 + 1)];
                                            $actividades[$index][($index2 + 1)] = $temp;
                                        } else {
                                            if ($hora_solo == $hora_solo2) {
                                                if ($min_solo > $min_solo2) {
                                                    $temp = $actividades[$index][$index2];
                                                    $actividades[$index][$index2] = $actividades[$index][($index2 + 1)];
                                                    $actividades[$index][($index2 + 1)] = $temp;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        $contador = 1;
                        $fechaconcurrente = date(
                                'w', mktime(
                                        00, 00, 00, $datos->valuemeses, 01, $datos->valueanno
                                )
                        );

                      if($datos->idopcion=='.pdf'){
                        $tablareport = "<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$datos->tituloreporte."</B></H3>";
                      }

                        $tablareport
                                .= " <table border='1' cellspacing='0' cellpadding='0' width='100%'>";
                        ////******  1RA fila   ******///
                        $tablareport .= "<tr>" . "<td class='Estilo1' width='14%'
                        valign='top' bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 1) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[1] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 1 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[1] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 1) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p>" . "</td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 2) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[2] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 2 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[2] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 2) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p>" . "</td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 3) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[3] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 3 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[3] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 3) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p>" . "</td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 4) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[4] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 4 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[4] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 4) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p>" . "</td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 5) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[5] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 5 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[5] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 5) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 6) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[6] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 6 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[6] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 6) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        if ($fechaconcurrente == 0) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[7] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[7] = $contador;
                            $contador++;
                        }
                        $tablareport .= $fecha . "</b></p></td></tr>";
                        ////******  2DA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' align='justify'
                        valign='top' width='14.2%' height='50'
                        bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        $fecha = '';
                        if ($fechaconcurrente == 1) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 1 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 1) {
                            $fecha = '';
                        }
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfila1[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfila1[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                //var_dump($actividades[$arraycontfila1[1]][$i]['hora']);die;
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arraycontfila1[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arraycontfila1[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfila1[1]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arraycontfila1[1]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfila1[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 2) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 2) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 2) {
                            $fecha = '';
                        }
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfila1[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfila1[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arraycontfila1[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arraycontfila1[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfila1[2]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arraycontfila1[2]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfila1[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 3) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 3) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 3) {
                            $fecha = '';
                        }
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfila1[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfila1[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arraycontfila1[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arraycontfila1[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfila1[3]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arraycontfila1[3]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfila1[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 4) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 4) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 4) {
                            $fecha = '';
                        }
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfila1[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfila1[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span  style='background:"
                                        . $actividades[$arraycontfila1[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arraycontfila1[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfila1[4]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arraycontfila1[4]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfila1[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 5) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 5) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 5) {
                            $fecha = '';
                        }
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfila1[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfila1[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span  style='background:"
                                        . $actividades[$arraycontfila1[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arraycontfila1[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfila1[5]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arraycontfila1[5]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfila1[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%'  height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 6) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 6) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 6) {
                            $fecha = '';
                        }
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfila1[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfila1[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span  style='background:"
                                        . $actividades[$arraycontfila1[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arraycontfila1[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfila1[6]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arraycontfila1[6]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfila1[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%'  height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-right:1px solid #000000;'>";
                        if ($fechaconcurrente == 0) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente == 6) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfila1[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfila1[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span  style='background:"
                                        . $actividades[$arraycontfila1[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arraycontfila1[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfila1[7]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arraycontfila1[7]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfila1[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport .= "</tr>";
                        ////******  3RA fila   ******///
                        $tablareport
                                .= "<tr>
                            <td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila2[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila2[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila2[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila2[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila2[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila2[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila2[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td></tr>";
                        ////******  4TA fila   ******///
                        $tablareport .= "<tr>" .
                                "<td class='Estilo1' align='left' valign='top'
                            width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila2[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila2[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila2[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila2[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila2[1]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila2[1]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila2[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila2[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila2[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span  style='background:"
                                        . $actividades[$arrayfechasfila2[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila2[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila2[2]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila2[2]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila2[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                        valign='top' width='14.2%' height='50'
                        bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila2[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila2[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila2[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila2[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila2[3]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila2[3]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila2[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila2[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila2[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila2[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila2[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila2[4]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila2[4]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila2[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila2[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila2[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila2[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila2[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila2[5]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila2[5]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila2[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                        valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                        style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila2[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila2[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila2[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila2[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila2[6]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila2[6]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila2[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;border-right:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila2[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila2[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila2[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila2[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila2[7]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila2[7]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila2[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport .= "</tr>";
                        ////******  5TA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila3[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila3[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila3[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila3[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila3[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila3[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila3[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td></tr>";

                        ////******  6TA fila   ******///
                        $tablareport .= "<tr>" .
                                "<td class='Estilo1' align='justify' valign='top'
                            width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila3[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila3[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila3[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila3[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila3[1]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila3[1]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila3[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila3[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila3[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila3[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila3[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila3[2]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila3[2]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila3[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila3[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila3[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila3[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila3[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila3[3]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila3[3]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila3[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila3[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila3[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila3[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila3[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila3[4]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila3[4]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila3[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila3[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila3[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila3[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila3[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila3[5]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila3[5]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila3[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila3[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila3[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila3[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila3[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila3[6]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila3[6]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila3[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }

                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                                border-right:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila3[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila3[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila3[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila3[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila3[7]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila3[7]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila3[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport .= "</tr>";
                        ////******  7MA fila   ******///
                        $tablareport .= "<tr>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila4[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila4[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila4[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila4[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila4[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila4[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila4[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td></tr>";
                        ////******  8VA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila4[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila4[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila4[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila4[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila4[1]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila4[1]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila4[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila4[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila4[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila4[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila4[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila4[2]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila4[2]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila4[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila4[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila4[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila4[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila4[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila4[3]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila4[3]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila4[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila4[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila4[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila4[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila4[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila4[4]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila4[4]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila4[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila4[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila4[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila4[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila4[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila4[5]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila4[5]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila4[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila4[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila4[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila4[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila4[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila4[6]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila4[6]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila4[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                                border-right:1px solid #000000'>";
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila4[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila4[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila4[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila4[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila4[7]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila4[7]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila4[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport .= " </tr>";
                        ////******  9NA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila5[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila5[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila5[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila5[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila5[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila5[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila5[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</td>";
                        $tablareport .= "</tr>";
                        ////******  10MA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila5[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila5[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila5[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila5[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila5[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila5[1]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila5[1]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila5[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila5[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila5[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila5[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila5[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila5[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila5[2]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila5[2]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila5[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila5[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila5[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila5[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila5[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila5[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila5[3]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila5[3]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila5[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila5[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila5[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila5[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila5[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila5[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila5[4]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila5[4]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila5[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila5[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila5[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila5[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila5[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila5[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila5[5]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila5[5]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila5[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila5[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila5[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila5[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span style='background:"
                                        . $actividades[$arrayfechasfila5[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila5[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila5[6]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila5[6]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila5[6]]
                                ) == 0)
                        ) {
                            $tablareport .= " &nbsp;</td>";
                        }
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                            border-right:1px solid #000000'>";
                        $fecha = $arrayfechasfila5[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfila5[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfila5[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<span  style='background:"
                                        . $actividades[$arrayfechasfila5[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfila5[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfila5[7]][$i]['idelemento']
                                        . " "
                                        . $actividades[$arrayfechasfila5[7]][$i]['titulo']
                                        . "</span><br>";
                            }
                            $tablareport .= "</td>";
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfila5[7]]
                                ) == 0)
                        ) {
                            $tablareport .= " &nbsp;</td>";
                        }
                        $tablareport .= "</tr>";


                        if($fecha<$datos->arraydatosreporte['cantdiasmes']){
                          //******  11NA fila   ******///
                          $tablareport
                                               .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                          $arrayfechasfila6[1] = $contador;
                          $fecha = $arrayfechas[$contador];
                          if ($fecha == '') {
                            $fecha = '&nbsp;';
                          }
                          $contador++;
                          $tablareport .= $fecha . "</b></p></td>" .
                            "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                          $arrayfechasfila6[2] = $contador;
                          $fecha = $arrayfechas[$contador];
                          if ($fecha == '') {
                            $fecha = '&nbsp;';
                          }
                          $contador++;
                          $tablareport .= $fecha . "</b></p></td>" .
                            "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                          $arrayfechasfila6[3] = $contador;
                          $fecha = $arrayfechas[$contador];
                          if ($fecha == '') {
                            $fecha = '&nbsp;';
                          }
                          $contador++;
                          $tablareport .= $fecha . "</b></p></td>" .
                            "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                          $arrayfechasfila6[4] = $contador;
                          $fecha = $arrayfechas[$contador];
                          if ($fecha == '') {
                            $fecha = '&nbsp;';
                          }
                          $contador++;
                          $tablareport .= $fecha . "</b></p></td>" .
                            "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                          $arrayfechasfila6[5] = $contador;
                          $fecha = $arrayfechas[$contador];
                          if ($fecha == '') {
                            $fecha = '&nbsp;';
                          }
                          $contador++;
                          $tablareport .= $fecha . "</b></p></td>" .
                            "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                          $arrayfechasfila6[6] = $contador;
                          $fecha = $arrayfechas[$contador];
                          if ($fecha == '') {
                            $fecha = '&nbsp;';
                          }
                          $contador++;
                          $tablareport .= $fecha . "</b></p></td>" .
                            "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                          $arrayfechasfila6[7] = $contador;
                          $fecha = $arrayfechas[$contador];
                          if ($fecha == '') {
                            $fecha = '&nbsp;';
                          }
                          $contador++;
                          $tablareport .= $fecha . "</b></p></td></tr>";
                          //******  12NA fila   ******///
                          $tablareport
                                 .= "<tr><td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                          $fecha = $arrayfechasfila6[1];
                          if (($fecha != '') && (count(
                                $actividades[$arrayfechasfila6[1]]
                              ) > 0)
                          ) {
                            $val = count($actividades[$arrayfechasfila6[1]]);
                            for ($i = 0; $i < $val; $i++) {
                              $tablareport .= "<span  style='background:"
                                . $actividades[$arrayfechasfila6[1]][$i]['color']
                                . "; color:#000000;'> "
                                . $actividades[$arrayfechasfila6[1]][$i]['hora']
                                . " "
                                . $actividades[$arrayfechasfila6[1]][$i]['titulo']
                                . "</span><br>";
                            }
                            $tablareport .= "</td>";
                          }
                          if (($fecha == '') || (count(
                                $actividades[$arrayfechasfila6[1]]
                              ) == 0)
                          ) {
                            $tablareport .= "&nbsp;</td>";
                          }
                          $tablareport
                                 .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                          $fecha = $arrayfechasfila6[2];
                          if (($fecha != '') && (count(
                                $actividades[$arrayfechasfila6[2]]
                              ) > 0)
                          ) {
                            $val = count($actividades[$arrayfechasfila6[2]]);
                            for ($i = 0; $i < $val; $i++) {
                              $tablareport .= "<span  style='background:"
                                . $actividades[$arrayfechasfila6[2]][$i]['color']
                                . "; color:#000000;'> "
                                . $actividades[$arrayfechasfila6[2]][$i]['hora']
                                . " "
                                . $actividades[$arrayfechasfila6[2]][$i]['titulo']
                                . "</span><br>";
                            }
                            $tablareport .= "</td>";
                          }
                          if (($fecha == '') || (count(
                                $actividades[$arrayfechasfila6[2]]
                              ) == 0)
                          ) {
                            $tablareport .= "&nbsp;</td>";
                          }
                          $tablareport
                                 .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                          $fecha = $arrayfechasfila6[3];
                          if (($fecha != '') && (count(
                                $actividades[$arrayfechasfila6[3]]
                              ) > 0)
                          ) {
                            $val = count($actividades[$arrayfechasfila6[3]]);
                            for ($i = 0; $i < $val; $i++) {
                              $tablareport .= "<span  style='background:"
                                . $actividades[$arrayfechasfila6[3]][$i]['color']
                                . "; color:#000000;'> "
                                . $actividades[$arrayfechasfila6[3]][$i]['hora']
                                . " "
                                . $actividades[$arrayfechasfila6[3]][$i]['titulo']
                                . "</span><br>";
                            }
                            $tablareport .= "</td>";
                          }
                          if (($fecha == '') || (count(
                                $actividades[$arrayfechasfila6[3]]
                              ) == 0)
                          ) {
                            $tablareport .= "&nbsp;</td>";
                          }
                          $tablareport
                                 .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                          $fecha = $arrayfechasfila6[4];
                          if (($fecha != '') && (count(
                                $actividades[$arrayfechasfila6[4]]
                              ) > 0)
                          ) {
                            $val = count($actividades[$arrayfechasfila6[4]]);
                            for ($i = 0; $i < $val; $i++) {
                              $tablareport .= "<span  style='background:"
                                . $actividades[$arrayfechasfila6[4]][$i]['color']
                                . "; color:#000000;'> "
                                . $actividades[$arrayfechasfila6[4]][$i]['hora']
                                . ""
                                . $actividades[$arrayfechasfila6[4]][$i]['titulo']
                                . "</span><br>";
                            }
                            $tablareport .= "</td>";
                          }
                          if (($fecha == '') || (count(
                                $actividades[$arrayfechasfila6[4]]
                              ) == 0)
                          ) {
                            $tablareport .= "&nbsp;</td>";
                          }
                          $tablareport
                                 .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                          $fecha = $arrayfechasfila6[5];
                          if (($fecha != '') && (count(
                                $actividades[$arrayfechasfila6[5]]
                              ) > 0)
                          ) {
                            $val = count($actividades[$arrayfechasfila6[5]]);
                            for ($i = 0; $i < $val; $i++) {
                              $tablareport .= "<span  style='background:"
                                . $actividades[$arrayfechasfila6[5]][$i]['color']
                                . "; color:#000000;'> "
                                . $actividades[$arrayfechasfila6[5]][$i]['hora']
                                . ""
                                . $actividades[$arrayfechasfila6[5]][$i]['titulo']
                                . "</span><br>";
                            }
                            $tablareport .= "</td>";
                          }
                          if (($fecha == '') || (count(
                                $actividades[$arrayfechasfila6[5]]
                              ) == 0)
                          ) {
                            $tablareport .= "&nbsp;</td>";
                          }
                          $tablareport
                                 .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                          $fecha = $arrayfechasfila6[6];
                          if (($fecha != '') && (count(
                                $actividades[$arrayfechasfila6[6]]
                              ) > 0)
                          ) {
                            $val = count($actividades[$arrayfechasfila6[5]]);
                            for ($i = 0; $i < $val; $i++) {
                              $tablareport .= "<span  style='background:"
                                . $actividades[$arrayfechasfila6[6]][$i]['color']
                                . "; color:#000000;'> "
                                . $actividades[$arrayfechasfila6[6]][$i]['hora']
                                . ""
                                . $actividades[$arrayfechasfila6[6]][$i]['titulo']
                                . "</span><br>";
                            }
                            $tablareport .= "</td>";
                          }
                          if (($fecha == '') || (count(
                                $actividades[$arrayfechasfila6[5]]
                              ) == 0)
                          ) {
                            $tablareport .= "&nbsp;</td>";
                          }
                          $tablareport
                                 .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                            border-right:1px solid #000000'>";
                          $fecha = $arrayfechasfila6[7];
                          if (($fecha != '') && (count(
                                $actividades[$arrayfechasfila6[7]]
                              ) > 0)
                          ) {
                            $val = count($actividades[$arrayfechasfila6[5]]);
                            for ($i = 0; $i < $val; $i++) {
                              $tablareport .= "<span style='background:"
                                . $actividades[$arrayfechasfila6[7]][$i]['color']
                                . "; color:#000000;'> "
                                . $actividades[$arrayfechasfila6[7]][$i]['hora']
                                . ""
                                . $actividades[$arrayfechasfila6[7]][$i]['titulo']
                                . "</span><br>";
                            }
                            $tablareport .= "</td>";
                          }
                          if (($fecha == '') || (count(
                                $actividades[$arrayfechasfila6[7]]
                              ) == 0)
                          ) {
                            $tablareport .= "&nbsp;</td>";
                          }
                        }


                        $tablareport .= "</tr></table>";
                        break;
                }
            }
        }
        $tablareport .= "</div></div>";
        return $tablareport;
    }

    public function GenerarPlanMensualDetallado($datos) {
    $altohoja = $datos->altohoja - 2;
    $altohojainicial = $datos->altohoja - 2;
    $anchohoja = $datos->anchohoja - 2;
    $orientacionhoja = "portrait";
    if ($datos->orientacionhoja == 1) {
      $orientacionhoja = "landscape";
    }
    $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
      . $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
      . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
    $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
      "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
    if (isset($datos->arraypartesreporte[0])) {
      $existeprincp = 0;
      $contadorhojas = 1;
      $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
        $datos->idusuariosession
      );
      $datos->arraydatosreporte = $this->DatosReporte(
        $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
      );
      foreach ($datos->arraypartesreporte as $partereporte) {
        switch ($partereporte['idpartereporte']) {
          case 1: //clasificacion
            $tablareport
                      .= "<table class='Estilo1' border='0'>
                             <tr><td>&nbsp;</td>
                             <td><div align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
              .
              $configuracionfirma->cargoaprueba . "</b></div></td>
                              <td width = '800px'><div align='right'><p style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
              . $datos->confidencialidad . "</p></div></td></tr>";
            $altohoja = $altohoja - 0.25;
            break;
          case 2: //aprobado por
            $tablareport
                      .= "<tr><td><b style ='font-size: 12px; font-family: 'Arial Black';
                                     font-weight: normal;>APROBADO:</b></td><td align='center'>
                             <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >". $configuracionfirma->gradoaprueba . "</b></td>
                            <td>&nbsp;</td></tr>
                            <tr><td><span></span></td><td>&nbsp;</td>
                            <td><span></span></td></tr>
                            <tr><td>&nbsp;</td><td align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
              . $configuracionfirma->nombreaprueba . "</b></td>
                            <td>&nbsp;</td></tr></table>";
            $altohoja = $altohoja - 5.25;
            break;
//                    case 3: //titulo
//                        $tablareport
//                                .= "<table class ='Estilo1' width= '100%'border='0' align='center'><tr>
//                                <td><div align='center'><p><b>"
//                                . $datos->tituloreporte . ' '
//                                . 'del mes ' . ' ' . $datos->textomeses
//                                . "</b></p></div></td></tr></table>";
//                        $altohoja = $altohoja - 4;
//                        break;
          case 4: //elaborado por
            if ($configuracionfirma->nombrelabora != '') {
              $tablareport
                .= " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='500' align='center'> 
                                      <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                . $configuracionfirma->cargoelabora
                . "</b></td></tr>";
              $tablareport
                .= "<tr><td><div align='center'></td>
                                <td width='500' align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                . $configuracionfirma->gradoelabora . "</b></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='500'align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                . $configuracionfirma->nombrelabora . "</b></td>
                                </tr></table></div>";
            }
            break;
          case 5: //actividades principales
            $arraydat = $this->ConstruirHojaActivPrinicpales(
              $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
            );
            $tablareport = $arraydat["tablareport"];
            $contadorhojas = $arraydat["contadorhojas"];
            $existeprincp = $arraydat["principales"];
            break;
          case 7:
            for (
              $i = 1; $i <= $datos->arraydatosreporte['cantdiasmes']; $i++
            ) {
              if ($i < 10) {
                $day = '0' . $i;
                $arrayfechas[$i] = $day;
              }
              if ($i >= 10) {
                $day = $i;
                $arrayfechas[$i] = $day;
              }

              $datos->fechainicio = $datos->fechafin = date(
                'd-m-Y', mktime(
                         00, 00, 00, $datos->valuemeses, $i, $datos->valueanno
                       )
              );
              $datos->arraydatosreportes['fechainicioD'] = $datos->arraydatosreportes['fechainicioD'] = null;
              $datos->repeticiones = 1;
              $arrayactividadespordia = DatElementos::ObtenerActividadesReporte(
                $datos
              );
              if (isset($arrayactividadespordia[0]['idelemento'])) {
                foreach (
                  $arrayactividadespordia as $p => $actividad
                ) {
                  $objreasignacionesmodel = new CmpreasignacionesModel();
                  $arrayreasignaciones = $objreasignacionesmodel->CargarReasignaciones(
                    3, $actividad['idelemento'], $datos->idusuariosession, 0, 100
                  );

                  $str_participan="";
                  if($actividad['idusuariocrea']==$datos->idusuariosession){
                    $str_participan=$destinatarios = self::ObtenerCadenaInvolucrados(
                      $actividad['idelemento']
                    );
                  }

                  $str_invol="";
                  foreach ($arrayreasignaciones['array'] as $value){
                    $str_invol.=(strlen($str_invol)==0)?$value['textoinvolucrados']:", ".$value['textoinvolucrados'];
                  }

                  $str_invol =(strlen($str_invol)==0)?"":"<i>".$str_invol."</i>";

                  $str_participan=(strlen($str_participan)==0)?$str_invol:$str_participan.",".$str_invol;

                  $actividades[$i][$p]['hora'] = $actividad['horainicio'];
                  $actividades[$i][$p]['fechainicio'] = $actividad['fechainicio'];
                  $actividades[$i][$p]['fechafin'] = $actividad['fechafin'];
                  $actividades[$i][$p]['titulo'] = $actividad['denelemento']." (".$actividad['idelemento'].")";
                  $actividades[$i][$p]['lugar'] = $actividad['lugar'];
//                  $actividades[$i][$p]['participantes'] = $actividad['participantes'];
                  $actividades[$i][$p]['participantes'] = $str_participan;

                  //**Para el color en el calendario**
                  $color = '#FFFFFF';
                  if ($datos->color) {
                    if ($actividad['color']) {
                      $color = '#' . $actividad['color'];
                    }
                  }
                  $actividades[$i][$p]['color'] = $color;
                }
              }
            }

            //print_r($actividades);die;

            for ($index = 0; $index < count($actividades); $index++) {
              for (
                $index1 = 1; $index1 < count($actividades[$index]); $index1++
              ) {
                for (
                  $index2 = 0; $index2 < (count($actividades[$index]) - $index1); $index2++
                ) {
                  if (count($actividades[$index]) == 1) {
                    break;
                  } else {
                    $hora_act = split(
                      ':', $actividades[$index][$index2]['hora']
                    );
                    $hora_solo = (int) $hora_act[0];
                    $min_solo = (int) $hora_act[1];
                    $hora_act2 = split(
                      ':', $actividades[$index][($index2 + 1)]['hora']
                    );
                    $hora_solo2 = (int) $hora_act2[0];
                    $min_solo2 = (int) $hora_act2[1];
                    if ($hora_solo > $hora_solo2) {
                      $temp = $actividades[$index][$index2];
                      $actividades[$index][$index2] = $actividades[$index][($index2 + 1)];
                      $actividades[$index][($index2 + 1)] = $temp;
                    } else {
                      if ($hora_solo == $hora_solo2) {
                        if ($min_solo > $min_solo2) {
                          $temp = $actividades[$index][$index2];
                          $actividades[$index][$index2] = $actividades[$index][($index2 + 1)];
                          $actividades[$index][($index2 + 1)] = $temp;
                        }
                      }
                    }
                  }
                }
              }
            }
            $contador = 1;
            $fechaconcurrente = date(
              'w', mktime(
                   00, 00, 00, $datos->valuemeses, 01, $datos->valueanno
                 )
            );

            if($datos->idopcion=='.pdf'){
              $tablareport = "<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$datos->tituloreporte."</B></H3>";
            }

            $tablareport
              .= " <table border='1' cellspacing='0' cellpadding='0' width='100%'>";
            ////******  1RA fila   ******///
            $tablareport .= "<tr>" . "<td class='Estilo1' width='14%'
                        valign='top' bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
            $fecha = '&nbsp;';
            if ($fechaconcurrente == 1) {
              $fecha = $arrayfechas[$contador];
              $arraycontfila1[1] = $contador;
              $contador++;
            }
            if ($fechaconcurrente < 1 && $fechaconcurrente != 0) {
              $fecha = $arrayfechas[$contador];
              $arraycontfila1[1] = $contador;
              $contador++;
            }
            if ($fechaconcurrente > 1) {
              $fecha = '&nbsp;';
            }
            $tablareport .= $fecha . "</b></p>" . "</td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Martes  ";
            $fecha = '&nbsp;';
            if ($fechaconcurrente == 2) {
              $fecha = $arrayfechas[1];
              $arraycontfila1[2] = $contador;
              $contador++;
            }
            if ($fechaconcurrente < 2 && $fechaconcurrente != 0) {
              $fecha = $arrayfechas[$contador];
              $arraycontfila1[2] = $contador;
              $contador++;
            }
            if ($fechaconcurrente > 2) {
              $fecha = '&nbsp;';
            }
            $tablareport .= $fecha . "</b></p>" . "</td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
            $fecha = '&nbsp;';
            if ($fechaconcurrente == 3) {
              $fecha = $arrayfechas[1];
              $arraycontfila1[3] = $contador;
              $contador++;
            }
            if ($fechaconcurrente < 3 && $fechaconcurrente != 0) {
              $fecha = $arrayfechas[$contador];
              $arraycontfila1[3] = $contador;
              $contador++;
            }
            if ($fechaconcurrente > 3) {
              $fecha = '&nbsp;';
            }
            $tablareport .= $fecha . "</b></p>" . "</td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
            $fecha = '&nbsp;';
            if ($fechaconcurrente == 4) {
              $fecha = $arrayfechas[1];
              $arraycontfila1[4] = $contador;
              $contador++;
            }
            if ($fechaconcurrente < 4 && $fechaconcurrente != 0) {
              $fecha = $arrayfechas[$contador];
              $arraycontfila1[4] = $contador;
              $contador++;
            }
            if ($fechaconcurrente > 4) {
              $fecha = '&nbsp;';
            }
            $tablareport .= $fecha . "</b></p>" . "</td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
            $fecha = '&nbsp;';
            if ($fechaconcurrente == 5) {
              $fecha = $arrayfechas[1];
              $arraycontfila1[5] = $contador;
              $contador++;
            }
            if ($fechaconcurrente < 5 && $fechaconcurrente != 0) {
              $fecha = $arrayfechas[$contador];
              $arraycontfila1[5] = $contador;
              $contador++;
            }
            if ($fechaconcurrente > 5) {
              $fecha = '&nbsp;';
            }
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
            $fecha = '&nbsp;';
            if ($fechaconcurrente == 6) {
              $fecha = $arrayfechas[1];
              $arraycontfila1[6] = $contador;
              $contador++;
            }
            if ($fechaconcurrente < 6 && $fechaconcurrente != 0) {
              $fecha = $arrayfechas[$contador];
              $arraycontfila1[6] = $contador;
              $contador++;
            }
            if ($fechaconcurrente > 6) {
              $fecha = '&nbsp;';
            }
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
            if ($fechaconcurrente == 0) {
              $fecha = $arrayfechas[1];
              $arraycontfila1[7] = $contador;
              $contador++;
            }
            if ($fechaconcurrente > 0) {
              $fecha = $arrayfechas[$contador];
              $arraycontfila1[7] = $contador;
              $contador++;
            }
            $tablareport .= $fecha . "</b></p></td></tr>";
            ////******  2DA fila   ******///
            $tablareport
                   .= "<tr><td class='Estilo1' align='justify'
                        valign='top' width='14.2%' height='50'
                        bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
            $fecha = '';
            if ($fechaconcurrente == 1) {
              $fecha = $arrayfechas[1];
            }
            if ($fechaconcurrente < 1 && $fechaconcurrente != 0) {
              $fecha = $arrayfechas[$contador];
            }
            if ($fechaconcurrente > 1) {
              $fecha = '';
            }
            if (($fecha != '') && (count(
                  $actividades[$arraycontfila1[1]]
                ) > 0)
            ) {
              $val = count($actividades[$arraycontfila1[1]]);
              for ($i = 0; $i < $val; $i++) {
                //var_dump($actividades[$arraycontfila1[1]][$i]['hora']);die;
                $tablareport .= "<span style='background:"
                  . $actividades[$arraycontfila1[2]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arraycontfila1[1]][$i]['hora']
                  . " "
                  . $actividades[$arraycontfila1[1]][$i]['titulo']
                  ." Lugar: ". $actividades[$arraycontfila1[1]][$i]['lugar']." Participan: ".
                  $actividades[$arraycontfila1[1]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arraycontfila1[1]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
              .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
            if ($fechaconcurrente == 2) {
              $fecha = $arrayfechas[1];
            }
            if ($fechaconcurrente < 2) {
              $fecha = $arrayfechas[$contador];
            }
            if ($fechaconcurrente > 2) {
              $fecha = '';
            }
            if (($fecha != '') && (count(
                  $actividades[$arraycontfila1[2]]
                ) > 0)
            ) {
              $val = count($actividades[$arraycontfila1[2]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arraycontfila1[2]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arraycontfila1[2]][$i]['hora']
                  . " "
                  . $actividades[$arraycontfila1[2]][$i]['titulo']
                  ." Lugar: ". $actividades[$arraycontfila1[2]][$i]['lugar']." Participan: ".
                  $actividades[$arraycontfila1[2]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arraycontfila1[2]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
              .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
            if ($fechaconcurrente == 3) {
              $fecha = $arrayfechas[1];
            }
            if ($fechaconcurrente < 3) {
              $fecha = $arrayfechas[$contador];
            }
            if ($fechaconcurrente > 3) {
              $fecha = '';
            }
            if (($fecha != '') && (count(
                  $actividades[$arraycontfila1[3]]
                ) > 0)
            ) {
              $val = count($actividades[$arraycontfila1[3]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arraycontfila1[3]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arraycontfila1[3]][$i]['hora']
                  . " "
                  . $actividades[$arraycontfila1[3]][$i]['titulo']
                  ." Lugar: ". $actividades[$arraycontfila1[3]][$i]['lugar']." Participan: ".
                    $actividades[$arraycontfila1[3]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arraycontfila1[3]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
              .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
            if ($fechaconcurrente == 4) {
              $fecha = $arrayfechas[1];
            }
            if ($fechaconcurrente < 4) {
              $fecha = $arrayfechas[$contador];
            }
            if ($fechaconcurrente > 4) {
              $fecha = '';
            }
            if (($fecha != '') && (count(
                  $actividades[$arraycontfila1[4]]
                ) > 0)
            ) {
              $val = count($actividades[$arraycontfila1[4]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arraycontfila1[4]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arraycontfila1[4]][$i]['hora']
                  . " "
                  . $actividades[$arraycontfila1[4]][$i]['titulo']
                  ." Lugar: ". $actividades[$arraycontfila1[4]][$i]['lugar']." Participan: ".
                     $actividades[$arraycontfila1[4]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arraycontfila1[4]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
              .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
            if ($fechaconcurrente == 5) {
              $fecha = $arrayfechas[1];
            }
            if ($fechaconcurrente < 5) {
              $fecha = $arrayfechas[$contador];
            }
            if ($fechaconcurrente > 5) {
              $fecha = '';
            }
            if (($fecha != '') && (count(
                  $actividades[$arraycontfila1[5]]
                ) > 0)
            ) {
              $val = count($actividades[$arraycontfila1[5]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arraycontfila1[5]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arraycontfila1[5]][$i]['hora']
                  . " "
                  . $actividades[$arraycontfila1[5]][$i]['titulo']
                  ." Lugar: ". $actividades[$arraycontfila1[5]][$i]['lugar']." Participan: ".
                  $actividades[$arraycontfila1[5]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arraycontfila1[5]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
              .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%'  height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
            if ($fechaconcurrente == 6) {
              $fecha = $arrayfechas[1];
            }
            if ($fechaconcurrente < 6) {
              $fecha = $arrayfechas[$contador];
            }
            if ($fechaconcurrente > 6) {
              $fecha = '';
            }
            if (($fecha != '') && (count(
                  $actividades[$arraycontfila1[6]]
                ) > 0)
            ) {
              $val = count($actividades[$arraycontfila1[6]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arraycontfila1[6]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arraycontfila1[6]][$i]['hora']
                  . " "
                  . $actividades[$arraycontfila1[6]][$i]['titulo']
                  ." Lugar: ". $actividades[$arraycontfila1[6]][$i]['lugar']." Participan: ".
                  $actividades[$arraycontfila1[6]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arraycontfila1[6]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
              .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%'  height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-right:1px solid #000000;'>";
            if ($fechaconcurrente == 0) {
              $fecha = $arrayfechas[1];
            }
            if ($fechaconcurrente == 6) {
              $fecha = $arrayfechas[$contador];
            }
            if (($fecha != '') && (count(
                  $actividades[$arraycontfila1[7]]
                ) > 0)
            ) {
              $val = count($actividades[$arraycontfila1[7]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arraycontfila1[7]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arraycontfila1[7]][$i]['hora']
                  . " "
                  . $actividades[$arraycontfila1[7]][$i]['titulo']
                  ." Lugar: ". $actividades[$arraycontfila1[7]][$i]['lugar']." Participan: ".
                  $actividades[$arraycontfila1[7]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arraycontfila1[7]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport .= "</tr>";
            ////******  3RA fila   ******///
            $tablareport
                                 .= "<tr>
                            <td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
            $arrayfechasfila2[1] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
            $arrayfechasfila2[2] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
            $arrayfechasfila2[3] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
            $arrayfechasfila2[4] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
            $arrayfechasfila2[5] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
            $arrayfechasfila2[6] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
            $arrayfechasfila2[7] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td></tr>";
            ////******  4TA fila   ******///
            $tablareport .= "<tr>" .
              "<td class='Estilo1' align='justify' valign='top'
                            width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila2[1];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila2[1]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila2[1]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila2[1]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila2[1]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila2[1]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila2[1]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila2[1]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila2[1]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila2[2];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila2[2]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila2[2]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila2[2]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila2[2]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila2[2]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila2[2]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila2[2]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila2[2]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                        valign='top' width='14.2%' height='50'
                        bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila2[3];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila2[3]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila2[3]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila2[3]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila2[3]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila2[3]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila2[3]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila2[3]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila2[3]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila2[4];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila2[4]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila2[4]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila2[4]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila2[4]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila2[4]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila2[4]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila2[4]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila2[4]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila2[5];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila2[5]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila2[5]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila2[5]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila2[5]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila2[5]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila2[5]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila2[5]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila2[5]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                        valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                        style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila2[6];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila2[6]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila2[6]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila2[6]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila2[6]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila2[6]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila2[6]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila2[6]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila2[6]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;border-right:1px solid #000000;'>";
            $fecha = $arrayfechasfila2[7];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila2[7]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila2[7]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila2[7]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila2[7]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila2[7]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila2[7]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila2[7]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila2[7]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport .= "</tr>";
            ////******  5TA fila   ******///
            $tablareport
                                 .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
            $arrayfechasfila3[1] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
            $arrayfechasfila3[2] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
            $arrayfechasfila3[3] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
            $arrayfechasfila3[4] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
            $arrayfechasfila3[5] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
            $arrayfechasfila3[6] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
            $arrayfechasfila3[7] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td></tr>";

            ////******  6TA fila   ******///
            $tablareport .= "<tr>" .
              "<td class='Estilo1' align='justify' valign='top'
                            width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila3[1];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila3[1]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila3[1]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila3[1]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila3[1]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila3[1]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila3[1]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila3[1]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila3[1]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila3[2];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila3[2]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila3[2]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila3[2]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila3[2]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila3[2]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila3[2]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila3[2]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila3[2]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila3[3];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila3[3]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila3[3]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila3[3]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila3[3]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila3[3]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila3[3]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila3[3]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila3[3]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila3[4];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila3[4]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila3[4]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila3[4]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila3[4]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila3[4]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila3[4]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila3[4]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila3[4]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila3[5];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila3[5]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila3[5]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila3[5]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila3[5]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila3[5]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila3[5]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila3[5]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila3[5]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila3[6];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila3[6]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila3[6]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila3[6]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila3[6]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila3[6]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila3[6]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila3[6]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila3[6]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }

            $tablareport
                   .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                                border-right:1px solid #000000;'>";
            $fecha = $arrayfechasfila3[7];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila3[7]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila3[7]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila3[7]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila3[7]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila3[7]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila3[7]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila3[7]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila3[7]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport .= "</tr>";
            ////******  7MA fila   ******///
            $tablareport .= "<tr>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
            $arrayfechasfila4[1] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
            $arrayfechasfila4[2] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
            $arrayfechasfila4[3] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
            $arrayfechasfila4[4] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
            $arrayfechasfila4[5] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
            $arrayfechasfila4[6] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
            $arrayfechasfila4[7] = $contador;
            $fecha = $arrayfechas[$contador];
            $contador++;
            $tablareport .= $fecha . "</b></p></td></tr>";
            ////******  8VA fila   ******///
            $tablareport
                   .= "<tr><td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila4[1];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila4[1]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila4[1]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila4[1]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila4[1]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila4[1]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila4[1]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila4[1]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila4[1]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila4[2];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila4[2]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila4[2]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila4[2]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila4[2]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila4[2]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila4[2]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila4[2]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila4[2]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila4[3];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila4[3]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila4[3]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila4[3]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila4[3]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila4[3]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila4[3]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila4[3]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila4[3]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila4[4];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila4[4]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila4[4]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila4[4]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila4[4]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila4[4]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila4[4]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila4[4]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila4[4]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila4[5];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila4[5]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila4[5]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila4[5]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila4[5]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila4[5]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila4[5]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila4[5]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila4[5]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
              .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila4[6]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila4[6]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila4[6]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila4[6]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila4[6]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila4[6]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila4[6]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila4[6]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
              .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                                border-right:1px solid #000000'>";
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila4[7]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila4[7]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila4[7]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila4[7]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila4[7]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila4[7]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila4[7]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila4[7]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport .= " </tr>";
            ////******  9NA fila   ******///
            $tablareport
                                 .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
            $arrayfechasfila5[1] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
            $arrayfechasfila5[2] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
            $arrayfechasfila5[3] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
            $arrayfechasfila5[4] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
            $arrayfechasfila5[5] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
            $arrayfechasfila5[6] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
            $arrayfechasfila5[7] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</td>";
            $tablareport .= "</tr>";
            ////******  10MA fila   ******///
            $tablareport
                   .= "<tr><td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila5[1];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila5[1]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila5[1]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila5[1]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila5[1]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila5[1]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila5[1]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila5[1]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila5[1]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila5[2];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila5[2]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila5[2]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila5[2]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila5[2]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila5[2]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila5[2]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila5[2]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila5[2]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila5[3];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila5[3]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila5[3]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila5[3]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila5[3]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila5[3]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila5[3]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila5[3]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila5[3]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila5[4];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila5[4]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila5[4]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila5[4]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila5[4]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila5[4]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila5[4]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila5[4]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila5[4]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila5[5];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila5[5]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila5[5]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila5[5]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila5[5]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila5[5]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila5[5]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila5[5]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila5[5]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila5[6];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila5[6]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila5[6]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila5[6]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila5[6]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila5[6]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila5[6]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila5[6]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila5[6]]
                ) == 0)
            ) {
              $tablareport .= " &nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                            border-right:1px solid #000000'>";
            $fecha = $arrayfechasfila5[7];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila5[7]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila5[7]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila5[7]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila5[7]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila5[7]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila5[7]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila5[7]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila5[7]]
                ) == 0)
            ) {
              $tablareport .= " &nbsp;</td>";
            }
            $tablareport .= "</tr>";

            if($fecha<$datos->arraydatosreporte['cantdiasmes']){
              ////******  11NA fila   ******///
            $tablareport
                                 .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
            $arrayfechasfila6[1] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
            $arrayfechasfila6[2] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
            $arrayfechasfila6[3] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
            $arrayfechasfila6[4] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
            $arrayfechasfila6[5] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
            $arrayfechasfila6[6] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td>" .
              "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
            $arrayfechasfila6[7] = $contador;
            $fecha = $arrayfechas[$contador];
            if ($fecha == '') {
              $fecha = '&nbsp;';
            }
            $contador++;
            $tablareport .= $fecha . "</b></p></td></tr>";
              //******  12NA fila   ******///
            $tablareport
                   .= "<tr><td class='Estilo1' align='left'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila6[1];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila6[1]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila6[1]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila6[1]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila6[1]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila6[1]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila6[1]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila6[1]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila6[1]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='left'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila6[2];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila6[2]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila6[2]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila6[2]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila6[2]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila6[2]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila6[2]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila6[2]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila6[2]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='left'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila6[3];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila6[3]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila6[3]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila6[3]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila6[3]][$i]['hora']
                  . " "
                  . $actividades[$arrayfechasfila6[3]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila6[3]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila6[3]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila6[3]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='left'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila6[4];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila6[4]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila6[4]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila6[4]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila6[4]][$i]['hora']
                  . ""
                  . $actividades[$arrayfechasfila6[4]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila6[4]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila6[4]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila6[4]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='left'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila6[5];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila6[5]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila6[5]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila6[5]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila6[5]][$i]['hora']
                  . ""
                  . $actividades[$arrayfechasfila6[5]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila6[5]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila6[5]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila6[5]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='left'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
            $fecha = $arrayfechasfila6[6];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila6[6]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila6[5]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila6[6]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila6[6]][$i]['hora']
                  . ""
                  . $actividades[$arrayfechasfila6[6]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila6[6]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila6[6]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila6[5]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            $tablareport
                   .= "<td class='Estilo1' align='left'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                            border-right:1px solid #000000'>";
            $fecha = $arrayfechasfila6[7];
            if (($fecha != '') && (count(
                  $actividades[$arrayfechasfila6[7]]
                ) > 0)
            ) {
              $val = count($actividades[$arrayfechasfila6[5]]);
              for ($i = 0; $i < $val; $i++) {
                $tablareport .= "<span style='background:"
                  . $actividades[$arrayfechasfila6[7]][$i]['color']
                  . "; color:#000000;'> "
                  . $actividades[$arrayfechasfila6[7]][$i]['hora']
                  . ""
                  . $actividades[$arrayfechasfila6[7]][$i]['titulo']
                  ." Lugar: ". $actividades[$arrayfechasfila6[7]][$i]['lugar']." Participan: ".
                  $actividades[$arrayfechasfila6[7]][$i]['participantes']
                  . "</span><br>";
              }
              $tablareport .= "</td>";
            }
            if (($fecha == '') || (count(
                  $actividades[$arrayfechasfila6[7]]
                ) == 0)
            ) {
              $tablareport .= "&nbsp;</td>";
            }
            }

            $tablareport .= "</tr></table>";
            break;
        }
      }
    }
    $tablareport .= "</div></div>";
    return $tablareport;
  }

    /*     * ********
      Los condenados
     * *********** */

    public function Puntualizacion($datos) {
      $datos->arraydatosreporte = $this->DatosReporte(
        $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
      );

      $arrayTareas=array();
      $datos->str_idelementos="";
      if($datos->idplan!=''){
        DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
//        print_r($arrayTareas);die;
        foreach ($arrayTareas as $value){
          $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
        }
      }

      $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte).":":"Puntualizaciones:";
      $row_title="<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>";

      $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
      $fechafinD = $datos->arraydatosreporte['fechafinD'];

      $rangoFechasReport = "<P align=center style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>";

      if ($fechainicioD != null){
        $rangoFechasReport.=("DESDE: ".str_replace('-','/', $fechainicioD));
      }

      if ($fechafinD != null){
        $rangoFechasReport.=("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HASTA: ".str_replace('-','/', $fechafinD));
      }

      $rangoFechasReport .="</P>";
      $row_title.=$rangoFechasReport;
      $tabla="";
      switch ($datos->versionadoSelecionado) {
        case 21:
          $info=self::getDatosPuntualizacion($datos);
          //print_r($info);die;
          $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte):"PUNTUALIZACIÓN DEL PLAN DE TRABAJO DE ____________";
          $tabla = " <HTML>
                    <BODY>
                         ".$row_title. "
                    <TABLE id='tabladatos' class='table' CELLSPACING='0' align=center BORDER='1' CELLPADDING='3'>
                              <TR>
                              <TD style='background:#E0E0DC;' align=center><B>No.</B></TD>
                              <TD style = 'background:#E0E0DC;' align = center ><B >
                                     ACTIVIDAD (HORA Y LUGAR) </B ></TD >
                              <TD style = 'background:#E0E0DC;' align = center ><B >
                                         FECHA PLANIFICADA </B ></TD >
                              <TD style = 'background:#E0E0DC;' align = center ><B > FECHA (HORA) PUNTUALIZADA</B ></TD >
                              <TD style = 'background:#E0E0DC;' align = center ><B > DIRIGE </B ></TD >
                              <TD style = 'background:#E0E0DC;' align = center ><B > PARTICIPANTES</B ></TD >
   
                              </TR > ";

          $row_datos="";
          $num_act=1;
          foreach ($info as $key => $value) {
            $row_datos.=' <TR> 
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $num_act.'
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['denomactividad'].' ('.$value['horainicio'].','.$value['lugar'].')
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['fechainicio'].'
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['fechainiciopuntualizacion'].' ('.$value['horainiciopuntualizacion'].')
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['dirigentepuntualizacion'].'
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['participantepuntualizacion'];
            $num_act++;
          }

          $tabla .= $row_datos;
          $tabla .= " </TABLE>
                    </BODY>
                    </HTML> ";
          break;
        case 22:
          $info=self::getDatosPuntualizacion($datos);
          //print_r($info);die;

          $row_destinatarios="<H3 align=center><B>NOMBRES Y APELLIDOS</B></H3><br/>
                               <H3 align=justify><B>LISTA DE DESTINATARIO</B></H3><br/>";

          $tabla = " <HTML>
                    <BODY>
                    ".$row_title. "
                    <TABLE id='tabladatos' class='table' CELLSPACING='0' align=center BORDER='1' CELLPADDING='3'>
                              <TR>
                              <TD style='background:#E0E0DC;' align=center><B>No.</B></TD>
                              <TD style = 'background:#E0E0DC;' align = center ><B >
                                     ACTIVIDAD (HORA Y LUGAR) </B ></TD >
                              <TD style = 'background:#E0E0DC;' align = center ><B > FECHA (HORA) PLANIFICADA</B ></TD >
                              <TD style = 'background:#E0E0DC;' align = center ><B > FECHA (HORA) PUNTUALIZADA</B ></TD >
                              </TR > ";

          $row_datos="";
          $num_act=1;
          $list_destino=1;
          foreach ($info as $key => $value) {
            $row_datos.=' <TR> 
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $num_act.'
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['denomactividad'].'
                ('.$value['horainicio'].','.$value['lugar'].')
               <br/>Dirige: '.$value['dirigentepuntualizacion'].'
               <br/>Lugar: '.$value['lugar'].'
               <br/>Participan: '.$value['participantepuntualizacion'].'
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['fechainicio'].' ('.$value['horainicio'].')
            <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['fechainiciopuntualizacion'].' ('.$value['horainiciopuntualizacion'].')';
            $destinatarios = $this->ObtenerCadenaInvolucrados(
                  $value['idactividad']
            );
            $row_destinatarios.=$list_destino.'- '.$destinatarios.'<br/>';
            $list_destino++;
            $num_act++;
          }


          $tabla .= $row_datos;
          $tabla .= " </TABLE>".$row_destinatarios."
                    </BODY>
                    </HTML> ";
          break;

        case 23:
          $info=self::getDatosPuntualizacionGobierno($datos);
//          print_r($info);die;
          $tabla = " <HTML>
                    <BODY>
                    ".$row_title. "
                    <TABLE border=1 align=center style='border-style: none;' cellpadding=1 cellspacing=0>
                              <TR>
                              <TH style='background:#E0E0DC;' align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>No.</B></FONT>
                              <TH style = 'background:#E0E0DC;' align = center rowspan='2'><FONT face=Calibri size=2 color=#000000><B >
                                     ACTIVIDADES, HORA Y LUGAR </B ></FONT>
                              <TH style = 'background:#E0E0DC;' align = center  colspan='2'><FONT face=Calibri size=2 color=#000000><B>MES</B></FONT>
                              <TH style = 'background:#E0E0DC;' align = center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> DIRIGENTE</B></FONT>
                              <TH style = 'background:#E0E0DC;' align = center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> PARTICIPANTES</B></FONT>
                              <TR>
                              <TH style = 'background:#E0E0DC;' align = center ><FONT face=Calibri size=2 color=#000000><B>Fecha y hora<br/>planificada</B></FONT>
                              <TH style = 'background:#E0E0DC;' align = center ><FONT face=Calibri size=2 color=#000000><B>Fecha y hora<br/>puntualizada</B></FONT>
                               ";

          $row_datos="";
          $num_arc=1;
          $num_act=1;
          $array_arc=array();
          $pos_arc=0;
          foreach ($info as $key => $value) {
            if(array_search($value['idarc'], $array_arc)===false){
              $array_arc[$pos_arc++]=$value['idarc'];
              $num_act=1;
              $numeracion= self::a_romano($num_arc).PHP_EOL. ". ";
              $row_datos.=' <TR>
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' colspan=\'6\'>'.
                             $numeracion.' '.$value['denarc'].'
                            <TR>
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' 
                                                                 >'.$num_act.'
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' 
                                     >'. $value['denomacti'].' ('.$value['horainicio'].' - '.$value['lugar'].') '.'
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' >'. $value['fechainicio'].' '.$value['horainicio'].' 
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' >'. $value['fechainiciopuntualizacion'].' '.$value['horainiciopuntualizacion'].'
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' >'. $value['dirigentepuntualizacion'].' 
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' >'. $value['participantepuntualizacion'];

              $num_act++;
              $num_arc++;
            }else{
              $row_datos.=' <TR>
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' 
                                                                 >'.$num_act.'
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' 
                                     >'. $value['denomacti'].' ('.$value['horainicio'].' - '.$value['lugar'].') '.'
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' >'. $value['fechainicio'].' '.$value['horainicio'].' 
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' >'. $value['fechainiciopuntualizacion'].' '.$value['horainiciopuntualizacion'].'
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' >'. $value['dirigentepuntualizacion'].' 
                             <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' >'. $value['participantepuntualizacion'];
              $num_act++;
            }
          }

          $tabla .= $row_datos;
          $tabla .= " </TABLE>
                    </BODY>
                    </HTML> ";
          break;
      }
        return $tabla;
    }

//    public function Caracterizacion($datos) {
//        $tablareport = self::TablaCaracterizacion($datos);
//        return $tablareport;
//    }

    public function Caracterizacion($datos) {
      $tabla="";
      $datos->arraydatosreporte = $this->DatosReporte(
        $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
      );

      $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
      $fechafinD = $datos->arraydatosreporte['fechafinD'];

      $datos->rangoFechasReport = "<BR/><P align=center style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>";

      if ($fechainicioD != null){
        $datos->rangoFechasReport.=("DESDE: ".str_replace('-','/', $fechainicioD));
      }

      if ($fechafinD != null){
        $datos->rangoFechasReport.=("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HASTA: ".str_replace('-','/', $fechafinD));
      }

      $datos->rangoFechasReport .="</P>";

      switch ($datos->versionadoSelecionado) {
        case 26://Modelo No.VIIi-1 (Puntualizaciones)
          $tabla=self::CaracterizacionesV1($datos);
          break;
        case 27://Modelo No.VIII-2 (Puntualizaciones)(Telefonema)
          $tabla=self::CaracterizacionesV2($datos);
          break;
        case 28://Modelo No.VIII-3
          $tabla=self::CaracterizacionesV3($datos);
          break;
        case 52://'RESUMEN DE CUMPLIMIENTO'
//          $tabla='<p style="color:#FF4500";>En desarrollo...</p><br/><IMG SRC="../../../comun/recursos/images/walking.gif">';
          $tabla=self::ResumenCumplimientoPlanTrabajo($datos);
          break;
        case 53://'INFORME RESUMEN DE PLAN DE TRABAJO'
//          $tabla='<p style="color:#FF4500";>En desarrollo...</p><br/><IMG SRC="../../../comun/recursos/images/walking.gif">';
          $tabla=self::InformeResumenPlanTrabajo($datos);
          break;
      }
      return $tabla;

    }


  public function InformeResumenPlanTrabajo($datos){

    $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte):"INFORME RESUMEN DE PLAN DE TRABAJO: ";
    $datos->repeticiones=1;
    $arrayTareas=array();
    $datos->str_idelementos="";
    if($datos->idplan!=''){
      DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
//        print_r($arrayTareas);die;
      foreach ($arrayTareas as $value){
        $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
      }
    }

    $info=DatActividades::InformeResumenPlanTrabajo($datos);
    $cant_cumplidas=0; $cant_incumplidas=0; $cant_modificadas=0; $cant_extraplan=0; $cant_total=0;

    $cumplidas="<TR>
                   <TH width=437 align=left colspan='2'><FONT face=Calibri size=2 color=#000000><B>&nbsp;&nbsp;&nbsp;CUMPLIDAS</B></FONT>";
    $incumplidas="<TR>
                   <TH width=437 align=left colspan='2'><FONT face=Calibri size=2 color=#000000><B>&nbsp;&nbsp;&nbsp;INCUMPLIDAS</B></FONT>";
    $modificadas="<TR>
                   <TH width=437 align=left colspan='2'><FONT face=Calibri size=2 color=#000000><B>&nbsp;&nbsp;&nbsp;MODIFICADAS</B></FONT>";
    $extraplan="<TR>
                   <TH width=437 align=left colspan='2'><FONT face=Calibri size=2 color=#000000><B>&nbsp;&nbsp;&nbsp;EXTRAPLAN</B></FONT>";

    foreach ($info as $key => $value) {
      $suma_paratotal=false;

      if($value['cumplidas']==1){
        $cumplidas.="<TR>
                       <TH width=437 align=left><P align=left style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$value['actividad']."</P>
                       <TH width=437 align=left>";
        $cant_cumplidas++;
        $suma_paratotal=true;
      }
      if($value['sincumplir']==1){
        $incumplidas.="<TR>
                       <TH width=437 align=left><P align=left style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$value['actividad']."</P>
                       <TH width=437 align=left>";
        $cant_incumplidas++;
        $suma_paratotal=true;
      }
      if($value['modificada']==1){
        $modificadas.="<TR>
                       <TH width=437 align=left><P align=left style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$value['actividad']."</P>
                       <TH width=437 align=left>";
        $cant_modificadas++;
        $suma_paratotal=true;
      }
      if($value['actextraplan']==1){
        $extraplan.="<TR>
                     <TH width=437 align=left><P align=left style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".$value['actividad']."</P>
                     <TH width=437 align=left>";
        $cant_extraplan++;
        $suma_paratotal=true;
      }
      if($suma_paratotal)
         $cant_total++;

    }


    $altohoja = $datos->altohoja - 2;
    $altohojainicial = $datos->altohoja - 2;
    $anchohoja = $datos->anchohoja - 2;
    $orientacionhoja = "portrait";
    if ($datos->orientacionhoja == 1) {
      $orientacionhoja = "landscape";
    }
    $tabla = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
      . $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
      . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
    $tabla .= "<div style='margin:auto;width:" . $anchohoja .
      "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";

      $existeprincp       = 0;
      $contadorhojas      = 1;
//      $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
//        $datos->idusuariosession
//      );
//
//      $tabla
//                .= "<table class='Estilo1' width='100%' border='0'>
//                            <tr><td width='10'>&nbsp;</td><td width='400'><div align='left'>" .
//        $configuracionfirma->cargoaprueba . "</div></td>
//                            <td ><div align='right'>" . $datos->confidencialidad . "</div></td></tr>";
//      $altohoja = $altohoja - 0.25;
//
//      $tabla
//                .= "<tr> <td><b>APROBADO:&nbsp;&nbsp;</b></td> <td>" . $configuracionfirma->gradoaprueba . "</td>
//                            <td>&nbsp;</td></tr>
//                            <tr><td><span></span></td><td>&nbsp;</td>
//                            <td width='16'><span></span></td></tr>
//                            <tr><td>&nbsp;</td><td>" . $configuracionfirma->nombreaprueba . "</td>
//                            <td>&nbsp;</td></tr></table>";
//      $altohoja = $altohoja - 5.25;

      $tabla
        .="<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>
        ".$datos->rangoFechasReport;

      $altohoja = $altohoja - 4;


      $tabla_contenido
                       = " <TABLE border=1  class='Estilo1' align=left style='border-style: none;' cellpadding=1 cellspacing=0 WIDTH='100%'> ";
      $tabla_contenido
                       .= " <TR>
                       <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B> 
                              RELACIONES DE TAREAS INCUMPLIDAS, MODIFICADAS Y NUEVAS </B></FONT> 
                       <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B> 
                        QUIEN LAS ORIGINO (CAUSAS)</B></FONT>";
      $tabla_contenido .= $incumplidas;
      $tabla_contenido .= $modificadas;
      $tabla_contenido .= $extraplan;
      $tabla_contenido .= "</TABLE>";
      $tabla_resumen
                       = " <TABLE border=1 class='Estilo1' align=left style='border-style: none;' cellpadding=1 cellspacing=0 WIDTH='100%'> ";
      $tabla_resumen
                       .= " <TR>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> TOTAL DE <BR/>TAREAS<BR/> PLANIFICADAS </B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center colspan='3'><FONT face=Calibri size=2 color=#000000><B> DE ELLAS </B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> NUEVAS TAREAS<br/>(EXTRA PLANES)</B></FONT>
                  <TR>
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>CUMPLIDAS</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>INCUMPLIDAS</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>MODIFICADAS</B></FONT> 
                  ";
      $tabla_resumen
                       .= " <TR>
                   <TH width=437 align=center>" . $cant_total . " 
                   <TH width=437 align=center>" . $cant_cumplidas . " 
                   <TH width=437 align=center>" . $cant_incumplidas . " 
                   <TH width=437 align=center>" . $cant_modificadas . " 
                   <TH width=437 align=center>" . $cant_extraplan .
        "</B></FONT>  ";
      $tabla_resumen .= "</TABLE>";
      $tabla .= $tabla_resumen;
      $tabla .= "<BR/><BR/><BR/><BR/><BR/><BR/>";
      $tabla .= $tabla_contenido;

      $tabla .= "<BR/><BR/><BR/><BR/><BR/><BR/>";
      $tabla .= "ANÁLISIS CUALITATIVO (VALORACIÓN)";

//      $tabla
//          .= " <table class='Estilo1' width='100%' border='0'>
//                                    <tr> <td>&nbsp;</td><td width='500'><div align='center'>" .
//          $configuracionfirma->cargoelabora . "</div></td></tr>";
//        $tabla
//          .= "<tr><td><div align='right'><b>ELABORADO:&nbsp;&nbsp;</b></td>
//                                    <td width='500'><div align='center'>" . $configuracionfirma->gradoelabora . "</div></td></tr>
//                                    <tr><td><span></span></td><td>&nbsp;</td>
//                                    <td width='16'><span></span></td></tr>
//                                    <tr><td>&nbsp;</td><td width='500'><div align='center'>" .
//          $configuracionfirma->nombrelabora . "</td>
//                                    </tr></table></div>";
//
//
//    $tabla .= "</div></div>";

    return $tabla;
  }

  public function ResumenCumplimientoPlanTrabajo($datos){
    $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte):"RESUMEN DE CUMPLIMIENTO: ";
      $datos->repeticiones=1;
      $arrayTareas=array();
      $datos->str_idelementos="";
      if($datos->idplan!=''){
        DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
//        print_r($arrayTareas);die;
        foreach ($arrayTareas as $value){
          $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
        }
      }


    $altohoja = $datos->altohoja - 2;
    $altohojainicial = $datos->altohoja - 2;
    $anchohoja = $datos->anchohoja - 2;
    $orientacionhoja = "portrait";
      if ($datos->orientacionhoja == 1) {
        $orientacionhoja = "landscape";
      }
      $tabla = "<style type='text/css'>
                     .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
        . $datos->tamanoletra . ";}
                   @page{height:" . $datos->altohoja . "cm;width:"
        . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
      $tabla .= "<div style='margin:auto;width:" . $anchohoja .
        "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";

//      $existeprincp       = 0;
//      $contadorhojas      = 1;
//      $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
//        $datos->idusuariosession
//      );

//      $tabla
//                .= "<table class='Estilo1' width='100%' border='0'>
//                                <tr><td width='10'>&nbsp;</td><td width='400'><div align='left'>" .
//        $configuracionfirma->cargoaprueba . "</div></td>
//                                <td ><div align='right'>" . $datos->confidencialidad . "</div></td></tr>";
//      $altohoja = $altohoja - 0.25;
//
//      $tabla
//                .= "<tr> <td><b>APROBADO:&nbsp;&nbsp;</b></td> <td>" . $configuracionfirma->gradoaprueba . "</td>
//                                <td>&nbsp;</td></tr>
//                                <tr><td><span></span></td><td>&nbsp;</td>
//                                <td width='16'><span></span></td></tr>
//                                <tr><td>&nbsp;</td><td>" . $configuracionfirma->nombreaprueba . "</td>
//                                <td>&nbsp;</td></tr></table>";
//      $altohoja = $altohoja - 5.25;

      $tabla
        .="<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>
            ".$datos->rangoFechasReport;

      $altohoja = $altohoja - 4;

      $tabla_resumen  =" <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0 WIDTH='100%'> ";
      $tabla_resumen .=" <TR>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> Entidades </B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center colspan='4'><FONT face=Calibri size=2 color=#000000><B> Plan de Trabajo Individual del Director de empresa </B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> Observ </B></FONT>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> Calificación a otorgar </B></FONT>
                  <TR>
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>CUMPLIDAS</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>MODIFICADAS</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>INCUMPLIDAS</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>Extras</B></FONT> 
                   
                  ";


      $info=DatActividades::ResumenCumplimientoPlanTrabajo($datos);

      foreach ($info as $key => $value) {

        $tabla_resumen.=" <TR>
                   <TH width=437 align=left><FONT face=Calibri size=2 color=#000000><B>".$value['nombrecompleto']."</B></FONT> 
                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000><B>".$value['cumplidas']."</B></FONT> 
                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000><B>".$value['modificada']."</B></FONT> 
                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000><B>".$value['sincumplir']."</B></FONT> 
                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000><B>".$value['actextraplan']."</B></FONT>
                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000></FONT>
                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000></FONT>
                     ";
      }



//     $tabla_resumen .=" <TR>
//                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> Áreas de la <BR/> Oficina Central </B></FONT>
//                  <TH width=437 bgcolor=#F2F2F2 align=center colspan='4'><FONT face=Calibri size=2 color=#000000><B> Plan de Trabajo Individual del Director, jefe <BR/> de Dpto o Grupo </B></FONT>
//                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> Observ </B></FONT>
//                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B> Calificación a otorgar </B></FONT>
//                  <TR>
//                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>CUMPLIDAS</B></FONT>
//                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>MODIFICADAS</B></FONT>
//                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>INCUMPLIDAS</B></FONT>
//                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>Extras</B></FONT>
//
//                  ";
//
//    $tabla_resumen.=" <TR>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TR>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TR>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                   <TH width=437 align=center><FONT face=Calibri size=2 color=#000000>&nbsp;</FONT>
//                     ";

      $tabla_resumen .="</TABLE>";

      $tabla .= $tabla_resumen;

      $tabla .= "<br/><br/><br/><br/><br/><br/><br/><br/><br/>_______________________<br/>
                Nombre y apellidos y firma";

//      $tabla
//        .= " <table class='Estilo1' width='100%' border='0'>
//                                        <tr> <td>&nbsp;</td><td width='500'><div align='center'>" .
//        $configuracionfirma->cargoelabora . "</div></td></tr>";
//      $tabla
//        .= "<tr><td><div align='right'><b>ELABORADO:&nbsp;&nbsp;</b></td>
//                                        <td width='500'><div align='center'>" . $configuracionfirma->gradoelabora . "</div></td></tr>
//                                        <tr><td><span></span></td><td>&nbsp;</td>
//                                        <td width='16'><span></span></td></tr>
//                                        <tr><td>&nbsp;</td><td width='500'><div align='center'>" .
//        $configuracionfirma->nombrelabora . "</td>
//                                        </tr></table></div>";
//
//
//      $tabla .= "</div></div>";

      return $tabla;
    }

  public function CaracterizacionesV1($datos){
    $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte):"GRÁFICO DE COORDINACIÓN PARA EL AÑO: ".$datos->ano;
    $tabla = "<HTML>
                  <BODY>
                  <H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>
                  ".$datos->rangoFechasReport."                  
                  <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
                  <TR>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>CAPÍTULOS</B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center colspan='2'><FONT face=Calibri size=2 color=#000000><B>TOTAL</B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center colspan='2'><FONT face=Calibri size=2 color=#000000><B>EXTERNAS</B></FONT>
                  <TH width=437 bgcolor=#F2F2F2 align=center colspan='2'><FONT face=Calibri size=2 color=#000000><B>PROPIAS</B></FONT>
                  <TR>
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT>
                  ";

    $info=DatArcDatPlan::getDatosCaracterizacionPlanRango($datos);
    $body="";
    $total_TOTAL_ACT=0;
    $total_TOTAL_TAREAS_ASEG=0;

    $total_EXTERNAS_ACT=0;
    $total_EXTERNAS_TAREAS_ASEG=0;

    $total_PROPIAS_ACT=0;
    $total_PROPIAS_TAREAS_ASEG=0;

    foreach ($info as $key => $value) {
      $total_TOTAL_ACT += $value['cantidadtotalactividades'];
      $total_TOTAL_TAREAS_ASEG += $value['cantidadtotaltareas'];

      $total_EXTERNAS_ACT+=$value['cantidadactexterna'];
      $total_EXTERNAS_TAREAS_ASEG+=$value['cantidadtareaasegexterna'];

      $total_PROPIAS_ACT+=$value['cantidadactpropia'];
      $total_PROPIAS_TAREAS_ASEG+=$value['cantidadtareaasegpropia'];

      $body.="<TR>";
      $body.=" <TH width=230 align=left style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['denarc'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadtotalactividades'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadtotaltareas'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadactexterna'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadtareaasegexterna'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadactpropia'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadtareaasegpropia'];
    }
    $body.="<TR>";
    $body.=" <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>TOTAL</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_TOTAL_ACT . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_TOTAL_TAREAS_ASEG . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_EXTERNAS_ACT . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_EXTERNAS_TAREAS_ASEG . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_PROPIAS_ACT . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_PROPIAS_TAREAS_ASEG;

    $porciento_externas=($total_EXTERNAS_ACT*100)/$total_TOTAL_ACT;
    $porciento_propias=($total_PROPIAS_ACT*100)/$total_TOTAL_ACT;

    $body.="<TR>";
    $body.=" <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;' colspan='3' ><FONT face=Calibri size=2 color=#000000><B>% DEL TOTAL</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;' colspan='2' ><FONT face=Calibri size=2 color=#000000><B>" . $porciento_externas . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;' colspan='2' ><FONT face=Calibri size=2 color=#000000><B>" . $porciento_propias . "</B></FONT>";


    $tabla .= $body;

    $tabla .= "
                              </TABLE>
                              </BODY>
                              </HTML>
                              ";

    return $tabla;
  }

  public function CaracterizacionesV2($datos){
    $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte):"Resumen de cumplimiento del plan: ";
    $tabla = "<HTML>
                  <BODY>
                  <H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>
                  ".$datos->rangoFechasReport."
                  <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
                  <TR>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>TOTAL DE TAREAS PLANIFICADAS</B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center colspan='2'><FONT face=Calibri size=2 color=#000000><B>DE ELLAS</B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>NUEVAS TAREAS (EXTRA PLANES)</B></FONT>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>POSPUESTAS SUSPENDIDAS</B></FONT>
                  <TR>
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>CUMPLIDAS</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>INCUMPLIDAS</B></FONT> 
                  ";

    $info=DatArcDatPlan::getDatosCaracterizacionCumplimiento($datos);
    $body="";
    if(count($info)>0){
      $body.="<TR>";
      $body.=" <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadtotalactividades'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadcumplidas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadsincumplir'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['pospuestaosuspendidas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadactextraplan'];

      $body.="<TR>";
      $body.=" <TH width=230 align=left style ='font-size: 12px; font-family: normal;  font-weight: normal;'>De ellas externas/ " . $info[0]['cantidadactexterna'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternascumplidas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternassimcumplir'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['externaspospuestaosuspendidas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternasactextraplan'];

      $body.="<TR>";
      $body.=" <TH width=230 align=left style ='font-size: 12px; font-family: normal;  font-weight: normal;' colspan='5'><B>ANÁLISIS CUALITATIVO:</B><br/><br/><br/>";


      $body.="<TR>";
      $body.=" <TH width=230 align=left style ='font-size: 12px; font-family: normal;  font-weight: normal;' colspan='5'>Se realiza un resumen cualitativo de las <B>principales</B> actividades
                     cumplidas destacando las deficiencias, causas de las incumplidas, suspendidas, pospuestas propias y extraplanes. <br/><br/><br/><br/>";

    }



    $tabla .= $body;

    $tabla .= "
                              </TABLE>
                              </BODY>
                              </HTML>
                              ";

    return $tabla;
  }

  public function CaracterizacionesV3($datos){
    $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte):"Resumen de puntualizaciones del plan: ".$datos->ano;
    $tabla = "<HTML>
                  <BODY>
                  <H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>
                  ".$datos->rangoFechasReport."
                  <TABLE border=1 align=left style='border-style: none;' cellpadding=1 cellspacing=0>
                  <TR>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>TOTAL DE TAREAS PLANIFICADAS</B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center colspan='2'><FONT face=Calibri size=2 color=#000000><B>DE ELLAS</B></FONT> 
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>NUEVAS TAREAS (EXTRA PLANES)</B></FONT>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>MODIFICADAS</B></FONT>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>POSPUESTAS</B></FONT>
                  <TH width=437 bgcolor=#F2F2F2 align=center rowspan='2'><FONT face=Calibri size=2 color=#000000><B>SUSPENDIDAS</B></FONT>
                  <TR>
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>CUMPLIDAS</B></FONT> 
                   <TH width=437 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>INCUMPLIDAS</B></FONT> 
                  ";

    $info=DatArcDatPlan::getDatosCaracterizacionPuntualizaciones($datos);
    $body="";
    if(count($info)>0){
      $body.="<TR>";
      $body.=" <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadtotalactividades'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadcumplidas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadsincumplir'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadactextraplan'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadmodificadas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadpospuestas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadsuspendidas'];

      $body.="<TR>";
      $body.=" <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>De ellas externas/ " . $info[0]['cantidadactexterna'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternascumplidas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternassincumplir'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternasactextraplan'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternasmodificadas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternaspospuestas'] . "
               <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $info[0]['cantidadexternassuspendidas'];

    }


    $tabla .= $body;

    $tabla .= "
                              </TABLE>
                              </BODY>
                              </HTML>
                              ";

    return $tabla;
  }


  /*     * ********
    Los condenados
   * *********** */

    public function GraficoCoordinacion($datos) {
      $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte.": ".$datos->ano):"GRÁFICO DE COORDINACIÓN: ".$datos->ano;
      $reporte=" <HTML>
                  <BODY>
                  <H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>$tituloReporte</B></H3>";
      $leyenda="";
      $tabla = " <TABLE class=\"table\" CELLSPACING=\"0\" 
                   align=center BORDER=\"1\" CELLPADDING=\"3\">
                  <TR>
                  <TH style=\"background:#E0E0DC;\" align=center><B>MESES</B> 
                  <TH style=\"background:#E0E0DC;\" align=center colspan='31'><B>Días del mes</B> 
                  ";

      switch ($datos->versionadoSelecionado) {
        case 29:
             $tabla .= '<TH style=\"background:#E0E0DC;\" align=center><B style=\"background:#E0E0DC;\" >TOTAL</B>';
             $tabla .= self::getBodyGraficoCoordinacionModelo($datos);
             $reporte .= $tabla;
            break;
        case 32:
          $tabla .= '<TH style="background:#E0E0DC;" align=center><B style=\"background:#E0E0DC;\" >OTRAS TAREAS</B>';
          $tabla .= self::getBodyGraficoCoordinacionDetallado($datos, $leyenda);
          $reporte .= $leyenda;
          $reporte .= $tabla;
          break;
      }
      $reporte .= "
                              </TABLE>
                              </BODY>
                              </HTML>
                              ";

        return $reporte;
    }

    public function getBodyGraficoCoordinacionModelo($datos){
      $body="";
      $total_act_ano=0;

      $arrayTareas=array();
      $datos->str_idelementos="";
      if($datos->idplan!=''){
        DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
//        print_r($arrayTareas);die;
        foreach ($arrayTareas as $value){
          $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
        }
      }

        //Actividades de Enero
        $datos->fini = '01/01/' . $datos->ano;
        $datos->ffin = '31/01/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Enero', 1, $total_act_ano);
        //Actividades de Febrero
        $datos->fini = '01/02/' . $datos->ano;
        $datos->ffin = '28/02/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Febrero', 2, $total_act_ano);
        //Actividades de Marzo
        $datos->fini = '01/03/' . $datos->ano;
        $datos->ffin = '31/03/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Marzo', 3, $total_act_ano);
        //Actividades de Abril
        $datos->fini = '01/04/' . $datos->ano;
        $datos->ffin = '30/04/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Abril', 4, $total_act_ano);
        //Actividades de Mayo
        $datos->fini = '01/05/' . $datos->ano;
        $datos->ffin = '31/05/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Mayo', 5, $total_act_ano);
        //Actividades de Junio
        $datos->fini = '01/06/' . $datos->ano;
        $datos->ffin = '30/06/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Junio', 6, $total_act_ano);
        //Actividades de Julio
        $datos->fini = '01/07/' . $datos->ano;
        $datos->ffin = '31/07/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Julio', 7, $total_act_ano);
        //Actividades de Agosto
        $datos->fini = '01/08/' . $datos->ano;
        $datos->ffin = '31/08/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Agosto', 8, $total_act_ano);
        //Actividades de Septiembre
        $datos->fini = '01/09/' . $datos->ano;
        $datos->ffin = '30/09/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Septiembre', 9, $total_act_ano);
        //Actividades de Octubre
        $datos->fini = '01/10/' . $datos->ano;
        $datos->ffin = '31/10/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Octubre', 10, $total_act_ano);
        //Actividades de Noviembre
        $datos->fini = '01/11/' . $datos->ano;
        $datos->ffin = '30/11/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Noviembre', 11, $total_act_ano);
        //Actividades de Diciembre
        $datos->fini = '01/12/' . $datos->ano;
        $datos->ffin = '31/12/' . $datos->ano;
        $body        .= self::rowGraficoCoordinacion($datos, 'Diciembre', 12, $total_act_ano);
        $body .= " <TR> <TH align=left style ='font-size: 12px; font-family: normal; font-weight: normal;' COLSPAN=\"32\">TOTAL";
        $body .= " <TH align=left style ='font-size: 12px; font-family: normal; font-weight: normal;'>" .
          $total_act_ano;
      return $body;
    }

    public function rowGraficoCoordinacion($datos,$mes, $num_mes, & $total_act_ano){
       $row=" <TR> <TH align=left style ='font-size: 12px; font-family: normal; font-weight: normal;' ROWSPAN=\"3\">".$mes;
       $acts=DatActividades::actsPorDiasMesReporte($datos);
       $array_aux=array();
       foreach ($acts as $key => $value) {
         if($value['mes']==$num_mes)
            $array_aux[$value['dia']]=$value['cantidad'];
       }

       /************
           Valores por dias
        ********/
      $row_datos="";
      $total_act_dias=0;
      $num_dia=1;
      while ($num_dia<=31){
        if(isset($array_aux[$num_dia])){
          $row_datos .='<TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $array_aux[$num_dia];
          $total_act_dias+=$array_aux[$num_dia];
        }else{
          $row_datos .='<TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. '';
        }
        $num_dia++;
      }

      $total_act_ano+=$total_act_dias;
       /*********************************/

      $num_dia=1;
      while ($num_dia<=31){
        $row .='<TH align=left style =\'font-size: 12px; font-family: normal; background:#E0E0DC; font-weight: normal;\'>'.self::getWeekday($datos->ano.'-'.$num_mes.'-'.$num_dia);
        $num_dia++;
      }
       $row .='<TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\' ROWSPAN="3">'. $total_act_dias;
       $row .=" <TR> ";
       $num_dia=1;
       while ($num_dia<=31){
         $row .='<TH align=left style =\'font-size: 12px; background:#E0E0DC; font-family: normal; font-weight: normal;\'>'. $num_dia;
         $num_dia++;
       }
      $row .=" <TR> ";
      $row .=$row_datos;
      return $row;
    }


    public function getBodyGraficoCoordinacionDetallado($datos, &$leyenda){
    $body="";
    $total_act_ano=0;

    $arrayTareas=array();
    $datos->str_idelementos="";
      if($datos->idplan!=''){
        DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
//        print_r($arrayTareas);die;
        foreach ($arrayTareas as $value){
          $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
        }
      }


    $array_categorias=array();

    //Actividades de Enero
    $datos->fini = '01/01/' . $datos->ano;
    $datos->ffin = '31/01/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Enero', 1, $total_act_ano, $array_categorias);

    //Actividades de Febrero
    $datos->fini = '01/02/' . $datos->ano;
    $datos->ffin = '28/02/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Febrero', 2, $total_act_ano, $array_categorias);


    //Actividades de Marzo
    $datos->fini = '01/03/' . $datos->ano;
    $datos->ffin = '31/03/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Marzo', 3, $total_act_ano, $array_categorias);

    //Actividades de Abril
    $datos->fini = '01/04/' . $datos->ano;
    $datos->ffin = '30/04/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Abril', 4, $total_act_ano, $array_categorias);

    //Actividades de Mayo
    $datos->fini = '01/05/' . $datos->ano;
    $datos->ffin = '31/05/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Mayo', 5, $total_act_ano, $array_categorias);

    //Actividades de Junio
    $datos->fini = '01/06/' . $datos->ano;
    $datos->ffin = '30/06/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Junio', 6, $total_act_ano, $array_categorias);

    //Actividades de Julio
    $datos->fini = '01/07/' . $datos->ano;
    $datos->ffin = '31/07/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Julio', 7, $total_act_ano, $array_categorias);

    //Actividades de Agosto
    $datos->fini = '01/08/' . $datos->ano;
    $datos->ffin = '31/08/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Agosto', 8, $total_act_ano, $array_categorias);

    //Actividades de Septiembre
    $datos->fini = '01/09/' . $datos->ano;
    $datos->ffin = '30/09/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Septiembre', 9, $total_act_ano, $array_categorias);

    //Actividades de Octubre
    $datos->fini = '01/10/' . $datos->ano;
    $datos->ffin = '31/10/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Octubre', 10, $total_act_ano, $array_categorias);

    //Actividades de Noviembre
    $datos->fini = '01/11/' . $datos->ano;
    $datos->ffin = '30/11/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Noviembre', 11, $total_act_ano, $array_categorias);

    //Actividades de Diciembre
    $datos->fini = '01/12/' . $datos->ano;
    $datos->ffin = '31/12/' . $datos->ano;
    $body .= self::rowGraficoCoordinacionDetallado($datos, 'Diciembre', 12, $total_act_ano, $array_categorias);

//    $body .= " <TR> <TH class='Estilo1' align='left' valign='top' width='14.2%' height='50'
//                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
//                            border-bottom:1px solid #000000;' COLSPAN=\"32\">TOTAL";
//    $body .= " <TH class='Estilo1' align='left' valign='top' width='14.2%' height='50'
//                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
//                            border-bottom:1px solid #000000;'>". $total_act_ano;

//    print_r($array_categorias);die;
      $leyenda .= '<TABLE id="tablaleyenda" align="center" class="table" BORDER="0">';
      $categ=array();
      $pos_color=0;
      foreach ($array_categorias as $key => $value) {
        if(array_search($value[1],$categ)===false && $value[0]!='#000000'){
          $categ[$pos_color++]=$value[1];
          $leyenda .= '<th class=\'Estilo1\' align=\'left\' valign=\'top\' style =\'font-size: 15px;\'>
                                             <div style="background-color: '.$value[0].'; width:15px;height:15px;"></div>
                       <th class=\'Estilo1\' align=\'left\' valign=\'top\' style =\'font-size: 15px;\'>'.
                                                  $value[1];
        }
      }
      $leyenda.='</TABLE>';

    return $body;
  }

    public function rowGraficoCoordinacionDetallado($datos,$mes, $num_mes, & $total_act_ano, & $array_categorias){
    $row=" <TR> <TH class='Estilo1' align='left' valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;' ROWSPAN=\"3\">".$mes;
    $acts=DatActividades::actsPorDiasMesReporteDetallado($datos);
    $array_aux=array();
    $existe_elemento=array();
    $pos=0;
    $total_act_dias=0;
    $poscolor=0;
    foreach ($acts as $key => $value) {
      $color=($value['color']!='')?$value['color']:'#000000';
      $array_categorias[$poscolor++]=array($color, $value['categoriaactividad']);
      if($value['mes']==$num_mes){
        if(isset($array_aux[$value['dia']])){
             $array_aux[$value['dia']].= '<br/>'. '<p style="color: '.$color.'">'.$value['denominacion'].'</p>';
        }else{
             $array_aux[$value['dia']] = '<p style="color: '.$color.'">'.$value['denominacion'].'</p>';
        }
        if(array_search($value['idactividad'],$existe_elemento)===false){
          $existe_elemento[$pos++]=$value['idactividad'];
          $total_act_dias++;
        }
      }
    }

    /************
    Valores por dias
     ********/
    $row_datos="";
    $num_dia=1;
    while ($num_dia<=31){
      if(isset($array_aux[$num_dia])){
        $row_datos .="<TH class='Estilo1' align='left' valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>". $array_aux[$num_dia];
//        $row_datos .='<TH valign=top style =\'font-size: 12px; text-align: start; width:auto;  font-family: normal; font-weight: normal;\'>'. $array_aux[$num_dia];
      }else{
        $row_datos .="<TH class='Estilo1' align='left' valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>". '';
//        $row_datos .='<TH valign=top style =\'font-size: 12px;  text-align: start; width:auto;  font-family: normal; font-weight: normal;\'>'. '';
      }
      $num_dia++;
    }

    $total_act_ano+=$total_act_dias;
    /*********************************/

    $num_dia=1;
    while ($num_dia<=31){
      $row .='<TH align=left style =\'font-size: 12px; font-family: normal; background:#E0E0DC; font-weight: normal;\'>'.self::getWeekday($datos->ano.'-'.$num_mes.'-'.$num_dia);
      $num_dia++;
    }
    $row .='<TH class=\'Estilo1\' align=\'left\' valign=\'top\' width=\'14.2%\' height=\'50\'
                                    bgcolor=\'#FFFFFF\' style=\'border-left:1px solid #000000;
                            border-bottom:1px solid #000000;\' ROWSPAN="3">'. '';
    $row .=" <TR> ";
    $num_dia=1;
    while ($num_dia<=31){
      $row .='<TH align=left style =\'font-size: 12px; background:#E0E0DC; font-family: normal; font-weight: normal;\'>'. $num_dia;
      $num_dia++;
    }
    $row .=" <TR> ";
    $row .=$row_datos;
    return $row;
  }


  public function getWeekday($date) {
    $arr_day = array (0=>'D', 1=>'L', 2=>'M', 3=>'M', 4=>'J', 5=>'V', 6=>'S');
    try{
      return $arr_day[date('w', strtotime($date))];
    }catch (Exception $e){
      return "";
    }
  }

    /*     * ********
      Los condenados
     * *********** */

    public function converRomanToInteger($num) {
      $number = new Zend_Measure_Number($num, Zend_Measure_Number::ROMAN);
      $number->convertTo (Zend_Measure_Number::DECIMAL);
      echo $number->getValue();
    }

      public function converToRoman($num) {
        $n = intval($num);
        $res = '';
        /*         * * roman_numerals array ** */
        $roman_numerals = array(
            'M' => 1000,
            'CM' => 900,
            'D' => 500,
            'CD' => 400,
            'C' => 100,
            'XC' => 90,
            'L' => 50,
            'XL' => 40,
            'X' => 10,
            'IX' => 9,
            'V' => 5,
            'IV' => 4,
            'I' => 1);
        foreach ($roman_numerals as $roman => $number) {
            /*             * * divide to get matches ** */
            $matches = intval($n / $number);
            /*             * * assign the roman char * $matches ** */
            $res .= str_repeat($roman, $matches);
            /*             * * substract from the number ** */
            $n = $n % $number;
        }
        /*         * * return the res ** */
        return $res;
    }

    public function FIP($datos) {
      $tituloReporte=($datos->tituloreporte!='')?strtoupper($datos->tituloreporte):"FIP: ";

      $datos->arraydatosreporte = $this->DatosReporte(
        $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
      );

      $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
      $fechafinD = $datos->arraydatosreporte['fechafinD'];

      $datos->rangoFechasReport = "<BR/><P align=center style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>";

      if ($fechainicioD != null){
        $datos->rangoFechasReport.=("DESDE: ".str_replace('-','/', $fechainicioD));
      }

      if ($fechafinD != null){
        $datos->rangoFechasReport.=("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HASTA: ".str_replace('-','/', $fechafinD));
      }

      $datos->rangoFechasReport .="</P>";

      $tablareport
        ="<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>
        ".$datos->rangoFechasReport;

        if ($datos->versionadoSelecionado == 24) {
            $reporteFIP = DatFip::obtenerReporteFIP1($datos);
            $tablareport .= "
                <TABLE align=center border=1 cellpadding=1 cellspacing=0>
                <TR>
                <TD width=80 align=center><FONT face=Arial size=2 color=#000000><B>No.</B></FONT></TD>
                <TD width=200 align=center><FONT face=Arial size=2 color=#000000><B>FIP/Control</B></FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>Fecha de Emisión/Doc. Origen</B></FONT></TD>
                <TD width=200 align=center><FONT face=Arial size=2 color=#000000><B>Fecha de Cumplimiento/Estado de Cumplimiento</B></FONT></TD>
                <TD width=60 align=center><FONT face=Arial size=2 color=#000000><B>Dirige</B></FONT></TD>
                <TD width=120 align=center><FONT face=Arial size=2 color=#000000><B>Emite/Descripción</B></FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000><B>Participantes</B></FONT></TD>
                <TD width=250 align=center><FONT face=Arial size=2 color=#000000><B>Involucrados</B></FONT></TD>
                <TD width=160 align=center><FONT face=Arial size=2 color=#000000><B>Fecha que se cumplió</B></FONT></TD>
                <TD width=200 align=center><FONT face=Arial size=2 color=#000000><B>Observaciones</B></FONT></TD>
                </TR>";

            foreach ($reporteFIP as $key => $value) {
                $key++;
                $tablareport .= "
                <TR>
                <TD width=80 align=center><FONT face=Arial size=2 color=#000000>" . $key . "</FONT></TD>
                <!--TD width=80 align=center><FONT face=Arial size=2 color=#000000>" . $value['numfip'] . "</FONT></TD-->
                <TD width=200 align=center><FONT face=Arial size=2 color=#000000>" . $value['fip'] . "</FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000>" . $value['fechaemision'] . "</FONT></TD>
                <TD width=200 align=center><FONT face=Arial size=2 color=#000000>" . $value['fechacumplimiento'] . "</FONT></TD>
                <TD width=60 align=center><FONT face=Arial size=2 color=#000000>" . $value['dirigente'] . "</FONT></TD>
                <TD width=120 align=center><FONT face=Arial size=2 color=#000000>" . $value['emite'] . "</FONT></TD>
                <TD width=100 align=center><FONT face=Arial size=2 color=#000000>" . $value['participantes'] . "</FONT></TD>
                <TD width=250 align=center><FONT face=Arial size=2 color=#000000>" . $value['involucrados'] . "</FONT></TD>
                <TD width=160 align=center><FONT face=Arial size=2 color=#000000>" . $value['fechacumplio'] . "</FONT></TD>
                <TD width=200 align=center><FONT face=Arial size=2 color=#000000>" . $value['observaciones'] . "</FONT></TD>
                </TR>";
            }
        } else if ($datos->versionadoSelecionado == 25) {
            $reporteFIP = DatFip::obtenerReporteFIP2($datos);
            $tablareport .= "
                        <TABLE border=1 align=center cellpadding=1 cellspacing=0>
                        <TR>
                        <TD width=50 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000>No.</FONT></TD>
                        <TD width=230 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000>ACTIVIDADES</FONT></TD>
                        <TD width=50 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000>PLAZOS</FONT></TD>
                        <TD width=200 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000>DIRIGE</FONT></TD>
                        <TD width=200 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000>PARTICIPANTES</FONT></TD>
                        </TR>";
            $cont = 1;
            $fipActual = "";
            $cont2 = 1;
            foreach ($reporteFIP as $key => $value) {
                if ($value['fip'] != $fipActual) {
                    $tablareport .= "<TR>
                        <TD width=50 bgcolor=#F2F2F2 align=left><FONT face=Calibri size=2 color=#000000>" . self::converToRoman($cont) . ".</FONT></TD>
                        <TD width=230 bgcolor=#F2F2F2 COLSPAN=4 align=left><FONT face=Calibri size=2 color=#000000>" . $value['fip'] . ".</FONT></TD>
                        </TR>";
                    $cont++;
                    $fipActual = $value['fip'];
                    $cont2 = 1;
                }else{
                  $tablareport .=" <TR>
                        <TD width=50 align=center><FONT face=Calibri size=2 color=#000000>" . $cont2 . "</FONT></TD>
                        <TD width=230 align=left><FONT face=Calibri size=2 color=#000000>" . $value['elemento'] . "</FONT></TD>
                        <TD width=50 align=center><FONT face=Calibri size=2 color=#000000>" . $value['plazo'] . "</FONT></TD>
                        <TD width=200 align=left><FONT face=Calibri size=2 color=#000000>" . $value['dirigentes'] . "</FONT></TD>
                        <TD width=200 align=left><FONT face=Calibri size=2 color=#000000>" . $value['participantes'] . "</FONT></TD>
                        </TR>";
                  $cont2++;
                }
            }
        }else if ($datos->versionadoSelecionado == 54 || $datos->versionadoSelecionado == 55) {
          $tablareport.="<TABLE border=1 align=center cellpadding=1 cellspacing=0>
                        <TR>
                        <TD width=200 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>No.</B></FONT></TD>
                        <TD width=200 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>ACUERDO</B></FONT></TD>
                        <TD width=200 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>RESPONSABLE</B></FONT></TD>";

          if($datos->versionadoSelecionado == 55){
            $tablareport.="<TD width=200 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>FECHA DE EMISIÓN</B></FONT></TD>";
          }

          $tablareport.="<TD width=200  bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>FECHA DE CUMPLIMIENTO</B></FONT></TD>
                         <TD width=200 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>CUMPLIDO/INCUMPLIDO</B></FONT></TD>
                         <TD width=200 bgcolor=#F2F2F2 align=center><FONT face=Calibri size=2 color=#000000><B>OBSERVACIONES</B></FONT></TD>
                        </TR>";
          $info=DatFip::ControldeAcuerdos($datos);
          $numero=1;
          foreach ($info as $key => $value){
             $tablareport.="<TABLE border=1 align=center cellpadding=1 cellspacing=0>
                        <TR>
                        <TD width=200 align=center><FONT face=Calibri size=2 color=#000000>".$numero."</FONT></TD>
                        <TD width=200 align=left><FONT face=Calibri size=2 color=#000000>".$value['fip']."</FONT></TD>
                        <TD width=200 align=left><FONT face=Calibri size=2 color=#000000>".$value['responsable']."</FONT></TD>";

             if($datos->versionadoSelecionado == 55){
               $tablareport.="<TD width=200 align=center><FONT face=Calibri size=2 color=#000000>".$value['fechaemision']."</FONT></TD>";
             }

            $tablareport.="<TD width=200 align=center><FONT face=Calibri size=2 color=#000000>".$value['fechacumplimiento']."</FONT></TD>
                           <TD width=200 align=center><FONT face=Calibri size=2 color=#000000>".$value['estadocumplimiento']."</FONT></TD>
                           <TD width=200 align=center><FONT face=Calibri size=2 color=#000000>".$value['descelemento']."</FONT></TD>
                        </TR>";
            $numero++;
          }

        }
        return $tablareport;
    }

    public function GenerarPlanMensualv2($datos) {
        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                  case 1: //clasificacion
                    $tablareport
                              .= "<table class='Estilo1' border='0'>
                             <tr><td>&nbsp;</td>
                             <td><div align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      .
                      $configuracionfirma->cargoaprueba . "</b></div></td>
                              <td width = '800px'><div align='right'><p style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $datos->confidencialidad . "</p></div></td></tr>";
                    $altohoja = $altohoja - 0.25;
                    break;
                  case 2: //aprobado por
                    $tablareport
                              .= "<tr><td><b style ='font-size: 12px; font-family: 'Arial Black';
                                     font-weight: normal;>APROBADO:</b></td><td align='center'>
                             <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >". $configuracionfirma->gradoaprueba . "</b></td>
                            <td>&nbsp;</td></tr>
                            <tr><td><span></span></td><td>&nbsp;</td>
                            <td><span></span></td></tr>
                            <tr><td>&nbsp;</td><td align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $configuracionfirma->nombreaprueba . "</b></td>
                            <td>&nbsp;</td></tr></table>";
                    $altohoja = $altohoja - 5.25;
                    break;
                    case 3: //titulo
//                        $tablareport
//                                .= "<table class ='Estilo1' width= '100%'border='0' align='center'><tr>
//                                <td><div align='center'><p><b>"
//                                . $datos->tituloreporte . ' '
//                                . 'del mes ' . ' ' . $datos->textomeses
//                                . "</b></p></div></td></tr></table>";
                        $altohoja = $altohoja - 4;
                        break;
                  case 4: //elaborado por
                    if ($configuracionfirma->nombrelabora != '') {
                      $tablareport
                        .= " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='500' align='center'> 
                                      <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                        . $configuracionfirma->cargoelabora
                        . "</b></td></tr>";
                      $tablareport
                        .= "<tr><td><div align='center'></td>
                                <td width='500' align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                        . $configuracionfirma->gradoelabora . "</b></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='500'align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                        . $configuracionfirma->nombrelabora . "</b></td>
                                </tr></table></div>";
                    }
                    break;
                    case 5: //actividades principales
                        $arraydat = $this->ConstruirHojaActivPrinicpales(
                                $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
                        );
                        $tablareport = $arraydat["tablareport"];
                        $contadorhojas = $arraydat["contadorhojas"];
                        $existeprincp = $arraydat["principales"];
                        break;
                    case 7:
                        for (
                        $i = 1; $i <= $datos->arraydatosreporte['cantdiasmes']; $i++
                        ) {
                            if ($i < 10) {
                                $day = '0' . $i;
                                $arrayfechas[$i] = $day;
                            }
                            if ($i >= 10) {
                                $day = $i;
                                $arrayfechas[$i] = $day;
                            }

                            $datos->fechainicio = $datos->fechafin = date(
                                    'd-m-Y', mktime(
                                            00, 00, 00, $datos->valuemeses, $i, $datos->valueanno
                                    )
                            );
                            $datos->arraydatosreportes['fechainicioD'] = $datos->arraydatosreportes['fechainicioD'] = null;
                            $datos->repeticiones = 1;
                            $arrayactividadespordia = DatElementos::ObtenerActividadesReporte(
                                            $datos
                            );
                            if (isset($arrayactividadespordia[0]['idelemento'])) {
                                foreach (
                                $arrayactividadespordia as $p => $actividad
                                ) {
                                    $actividades[$i][$p]['hora'] = $actividad['horainicio'];
                                    $actividades[$i][$p]['fechainicio'] = $actividad['fechainicio'];
                                    $actividades[$i][$p]['fechafin'] = $actividad['fechafin'];
                                    $actividades[$i][$p]['titulo'] = $actividad['denelemento'];
                                    //**Para el color en el calendario**
                                    $color = '#FFFFFF';
                                    if ($datos->color) {
                                        if ($actividad['color']) {
                                            $color = '#' . $actividad['color'];
                                        }
                                    }
                                    $actividades[$i][$p]['color'] = $color;
                                }
                            }
                        }
                        for ($index = 0; $index < count($actividades); $index++) {
                            for (
                            $index1 = 1; $index1 < count($actividades[$index]); $index1++
                            ) {
                                for (
                                $index2 = 0; $index2 < (count($actividades[$index]) - $index1); $index2++
                                ) {
                                    if (count($actividades[$index]) == 1) {
                                        break;
                                    } else {
                                        $hora_act = split(
                                                ':', $actividades[$index][$index2]['hora']
                                        );
                                        $hora_solo = (int) $hora_act[0];
                                        $min_solo = (int) $hora_act[1];
                                        $hora_act2 = split(
                                                ':', $actividades[$index][($index2 + 1)]['hora']
                                        );
                                        $hora_solo2 = (int) $hora_act2[0];
                                        $min_solo2 = (int) $hora_act2[1];
                                        if ($hora_solo > $hora_solo2) {
                                            $temp = $actividades[$index][$index2];
                                            $actividades[$index][$index2] = $actividades[$index][($index2 + 1)];
                                            $actividades[$index][($index2 + 1)] = $temp;
                                        } else {
                                            if ($hora_solo == $hora_solo2) {
                                                if ($min_solo > $min_solo2) {
                                                    $temp = $actividades[$index][$index2];
                                                    $actividades[$index][$index2] = $actividades[$index][($index2 + 1)];
                                                    $actividades[$index][($index2 + 1)] = $temp;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        $contador = 1;
                        $fechaconcurrente = date(
                                'w', mktime(
                                        00, 00, 00, $datos->valuemeses, 01, $datos->valueanno
                                )
                        );

                        if($datos->idopcion=='.pdf'){
                          $tablareport = "<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$datos->tituloreporte."</B></H3>";
                        }

                        $tablareport
                                .= " <table border='1' cellspacing='0' cellpadding='0' width='100%'>";
                        ////******  1RA fila   ******///
                        $tablareport .= "<tr>" . "<td class='Estilo1' width='14%'
                        valign='top' bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 1) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[1] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 1 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[1] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 1) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p>" . "</td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 2) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[2] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 2 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[2] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 2) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p>" . "</td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 3) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[3] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 3 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[3] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 3) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p>" . "</td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 4) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[4] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 4 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[4] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 4) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p>" . "</td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 5) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[5] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 5 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[5] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 5) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 6) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[6] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 6 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[6] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 6) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-top:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        if ($fechaconcurrente == 0) {
                            $fecha = $arrayfechas[1];
                            $arraycontfila1[7] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfila1[7] = $contador;
                            $contador++;
                        }
                        $tablareport .= $fecha . "</b></p></td></tr>";
                        ////******  2DA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' align='justify'
                        valign='top' width='14.2%' height='50'
                        bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        $fecha = '';
                        if ($fechaconcurrente == 1) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 1 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 1) {
                            $fecha = '';
                        }
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arraycontfila1[1]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 2) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 2) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 2) {
                            $fecha = '';
                        }
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arraycontfila1[2]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 3) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 3) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 3) {
                            $fecha = '';
                        }
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arraycontfila1[3]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 4) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 4) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 4) {
                            $fecha = '';
                        }
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arraycontfila1[4]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%' height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 5) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 5) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 5) {
                            $fecha = '';
                        }
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arraycontfila1[5]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%'  height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        if ($fechaconcurrente == 6) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente < 6) {
                            $fecha = $arrayfechas[$contador];
                        }
                        if ($fechaconcurrente > 6) {
                            $fecha = '';
                        }
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arraycontfila1[6]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                    valign='top' width='14.2%'  height='50'
                                    bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000; border-right:1px solid #000000;'>";
                        if ($fechaconcurrente == 0) {
                            $fecha = $arrayfechas[1];
                        }
                        if ($fechaconcurrente == 6) {
                            $fecha = $arrayfechas[$contador];
                        }
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arraycontfila1[7]], $fecha);
                        $tablareport .= "</tr>";
                        ////******  3RA fila   ******///
                        $tablareport
                                .= "<tr>
                            <td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila2[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila2[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila2[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila2[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila2[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila2[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila2[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td></tr>";
                        ////******  4TA fila   ******///
                        $tablareport .= "<tr>" .
                                "<td class='Estilo1' align='justify' valign='top'
                            width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[1];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila2[1]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[2];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila2[2]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                        valign='top' width='14.2%' height='50'
                        bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[3];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila2[3]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[4];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila2[4]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[5];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila2[5]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                        valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                        style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[6];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila2[6]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;border-right:1px solid #000000;'>";
                        $fecha = $arrayfechasfila2[7];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila2[7]], $fecha);
                        $tablareport .= "</tr>";
                        ////******  5TA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila3[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila3[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila3[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila3[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila3[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila3[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila3[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td></tr>";

                        ////******  6TA fila   ******///
                        $tablareport .= "<tr>" .
                                "<td class='Estilo1' align='justify' valign='top'
                            width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[1];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila3[1]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[2];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila3[2]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[3];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila3[3]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[4];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila3[4]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[5];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila3[5]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[6];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila3[6]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                                border-right:1px solid #000000;'>";
                        $fecha = $arrayfechasfila3[7];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila3[7]], $fecha);
                        $tablareport .= "</tr>";
                        ////******  7MA fila   ******///
                        $tablareport .= "<tr>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila4[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila4[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila4[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila4[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila4[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila4[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila4[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td></tr>";
                        ////******  8VA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[1];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila4[1]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[2];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila4[2]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[3];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila4[3]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[4];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila4[4]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[5];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila4[5]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = $arrayfechasfila4[6];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila4[6]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%'  height='50' bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                                border-right:1px solid #000000'>";
                        $fecha = $arrayfechasfila4[7];
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila4[7]], $fecha);
                        $tablareport .= " </tr>";
                        ////******  9NA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila5[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila5[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila5[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila5[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila5[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila5[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila5[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</td>";
                        $tablareport .= "</tr>";
                        ////******  10MA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila5[1];
                        $contador -= 7;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila5[1]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila5[2];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila5[2]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila5[3];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila5[3]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila5[4];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila5[4]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                                valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                                style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila5[5];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila5[5]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila5[6];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila5[6]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                            border-right:1px solid #000000'>";
                        //$fecha = $arrayfechasfila5[7];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila5[7]], $fecha);
                        $tablareport .= "</tr>";

                      if($arrayfechasfila5[7]<$datos->arraydatosreporte['cantdiasmes']){
                        ////******  11NA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Lunes  ";
                        $arrayfechasfila6[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Martes  ";
                        $arrayfechasfila6[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Mi&eacute;rcoles  ";
                        $arrayfechasfila6[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Jueves  ";
                        $arrayfechasfila6[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>Viernes  ";
                        $arrayfechasfila6[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;'><p align=\"center\"><b>S&aacute;bado  ";
                        $arrayfechasfila6[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td>" .
                                "<td class='Estilo1' width='14%' valign='top'
                            bgcolor='#E6E6E6' style='border-left:1px solid #000000;
                            border-bottom:1px solid #000000;
                            border-right:1px solid #000000;'><p align=\"center\"><b>Domingo  ";
                        $arrayfechasfila6[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= $fecha . "</b></p></td></tr>";
                        ////******  12NA fila   ******///
                        $tablareport
                                .= "<tr><td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila6[1];
                        $contador -= 7;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila6[1]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila6[2];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila6[2]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila6[3];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila6[3]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50' bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila6[4];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila6[4]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila6[5];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila6[5]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;'>";
                        //$fecha = $arrayfechasfila6[6];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila6[6]], $fecha);
                        $tablareport
                                .= "<td class='Estilo1' align='justify'
                            valign='top' width='14.2%' height='50'  bgcolor='#FFFFFF'
                            style='border-left:1px solid #000000;border-bottom:1px solid #000000;
                            border-right:1px solid #000000'>";
                        //$fecha = $arrayfechasfila6[7];
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= self::agregarHoraActvReporte($actividades[$arrayfechasfila6[7]], $fecha);
                      }

                        $tablareport .= "</tr></table>";
                        break;
                }
            }
        }
        $tablareport .= "</div></div>";
        return $tablareport;
    }

    public function agregarHoraActvReporte($arrayActividades, $fecha) {
        $arrayHoras = array(
            7 => array('hora' => '00:00 - 07:59', 'check' => 0),
            8 => array('hora' => '08:00', 'check' => 0),
            9 => array('hora' => '09:00', 'check' => 0),
            10 => array('hora' => '10:00', 'check' => 0),
            11 => array('hora' => '11:00', 'check' => 0),
            12 => array('hora' => '12:00', 'check' => 0),
            13 => array('hora' => '13:00', 'check' => 0),
            14 => array('hora' => '14:00', 'check' => 0),
            15 => array('hora' => '15:00', 'check' => 0),
            16 => array('hora' => '16:00', 'check' => 0),
            17 => array('hora' => '17:00', 'check' => 0),
            18 => array('hora' => '18:00 - 23:59', 'check' => 0),
        );
        $tablareport = '';
        $html = '';
        if (isset($arrayActividades[0])) {
            foreach ($arrayActividades as $val => $actividad) {
                $horaactv = explode(':', $actividad['hora']);
                $horaactv = intval($horaactv[0]);
                if ($horaactv < 8) {
                    if (!$arrayHoras[7]['check']) {
                        $arrayHoras[7]['check'] = 1;
                        $html = "<div class=' Estilo1' align='justify' style='background:"
                                . '#E6E6E6'
                                . ";'> "
                                . $arrayHoras[7]['hora']
                                . "&nbsp;"
                                . "</div>";
                        $arrayHoras[7]['titulohora'] = $html;
                    }
                    $html = "<span style='background:"
                            . $actividad['color']
                            . "; color:#000000;'> "
                            . $actividad['hora']
                            . " "
                            . $actividad['titulo']
                            . "</span><br>";
                    $arrayHoras[7]['html'] .= $html;
                } else if ($horaactv > 17) {
                    if (!$arrayHoras[18]['check']) {
                        $arrayHoras[18]['check'] = 1;
                        $html = "<div class=' Estilo1' align='justify' style='background:"
                                . '#E6E6E6'
                                . ";'> "
                                . $arrayHoras[18]['hora']
                                . "&nbsp;"
                                . "</div>";
                        $arrayHoras[18]['titulohora'] = $html;
                    }
                    $html = "<span style='background:"
                            . $actividad['color']
                            . "; color:#000000;'> "
                            . $actividad['hora']
                            . " "
                            . $actividad['titulo']
                            . "</span><br>";
                    $arrayHoras[18]['html'] .= $html;
                } else {
                    foreach ($arrayHoras as $value => $hora) {
                        if ($value == $horaactv) {
                            if (!$hora['check']) {
                                $arrayHoras[$value]['check'] = 1;
                                $html = "<div class=' Estilo1' align='justify' style='background:"
                                        . '#E6E6E6'
                                        . ";'> "
                                        . $hora['hora']
                                        . "&nbsp;"
                                        . "</div>";
                                $arrayHoras[$value]['titulohora'] = $html;
                            }
                            $html = "<span style='background:"
                                    . $actividad['color']
                                    . "; color:#000000;'> "
                                    . $actividad['hora']
                                    . " "
                                    . $actividad['titulo']
                                    . "</span><br>";
                            $arrayHoras[$value]['html'] .= $html;
                            //break;
                        } else {
                            if (!$hora['check']) {
                                $arrayHoras[$value]['check'] = 1;
                                $html = "<div class=' Estilo1' align='justify' style='background:"
                                        . '#E6E6E6'
                                        . ";'> "
                                        . $hora['hora']
                                        . "&nbsp;"
                                        . "</div>";
                                $arrayHoras[$value]['titulohora'] = $html;
                            }
                        }
                    }
                }
            }
        } else {
            if (!empty($fecha)) {
                foreach ($arrayHoras as $value => $hora) {
                    $html = "<div class=' Estilo1' align='justify' style='background:"
                            . '#E6E6E6'
                            . ";'> "
                            . $hora['hora']
                            . "&nbsp;"
                            . "</div>";
                    $arrayHoras[$value]['titulohora'] = $html;
                }
            }
        }
        $divempty = "<div class=' Estilo1' align='justify' style='color:#000000;'>"
                . "&nbsp;"
                . "</div><br><br><br>";
        if (empty($fecha)) {
            $tablareport = $divempty;
        } else {
            foreach ($arrayHoras as $value) {
                $tablareport .= $value['titulohora'];
                $tablareport .= (isset($value['html'])) ? $value['html'] : $divempty;
            }
        }
        $tablareport .= "</td>";
        return $tablareport;
    }

    //Reportes V5
    public function GenerarPlanMensual_old($datos) {
        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
                .  {border: 1px; border-color: #000000; border-radius: 5px; overflow: hidden;
                padding: 2px 1px 2px 5px; text-overflow: ellipsis; white-space: nowrap;}
                @page{height:" . $datos->altohoja . " cm; width:"
                . $datos->anchohoja . " cm;
                size:" . $orientacionhoja . ";}</style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //clasificacion
                        $tablareport
                                .= "<table class='Estilo1' width='100%' border='0'>
                            <tr><td width='10'>&nbsp;</td><td width='400'><div align='left'>"
                                . $configuracionfirma->cargoaprueba . "</div></td>
                            <td ><div align='right'>" . $datos->confidencialidad
                                . "</div></td></tr>";
                        $altohoja = $altohoja - 0.25;
                        break;
                    case 2: //aprobado por
                        $tablareport
                                .= "<tr> <td><b>APROBADO:&nbsp;&nbsp;</b></td> <td>"
                                . $configuracionfirma->gradoaprueba . "</td>
                            <td>&nbsp;</td></tr>
                            <tr><td><span></span></td><td>&nbsp;</td>
                            <td width='16'><span></span></td></tr>
                            <tr><td>&nbsp;</td><td>"
                                . $configuracionfirma->nombreaprueba . "</td>
                            <td>&nbsp;</td></tr></table>";
                        $altohoja = $altohoja - 5.25;
                        break;
                    case 3: //titulo
                        $tablareport
                                .= "<table class ='Estilo1' width= '100%'border='0' align='center'><tr>
                                <td><div align='center'><p><b>"
                                . strtoupper($datos->tituloreporte) . ' '
                                . 'del mes ' . ' ' . $datos->textomeses
                                . "</b></p></div></td></tr></table>";
                        $altohoja = $altohoja - 4;
                        break;
                    case 4: //elaborado por
                        if ($configuracionfirma->nombrelabora != '') {
                            $tablareport
                                    .= " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='500'><div align='center'>"
                                    . $configuracionfirma->cargoelabora
                                    . "</div></td></tr>";
                            $tablareport
                                    .= "<tr><td><div align='center'></td>
                                <td width='500'><div align='center'>"
                                    . $configuracionfirma->gradoelabora . "</div></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='500'><div align='center'>"
                                    . $configuracionfirma->nombrelabora . "</td>
                                </tr></table></div>";
                        }
                        break;
                    case 5: //actividades principales
                        $arraydat = $this->ConstruirHojaActivPrinicpales(
                                $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
                        );
                        $tablareport = $arraydat["tablareport"];
                        $contadorhojas = $arraydat["contadorhojas"];
                        $existeprincp = $arraydat["principales"];
                        break;
                    case 7:
                        for (
                        $i = 1; $i <= $datos->arraydatosreporte['cantdiasmes']; $i++
                        ) {
                            if ($i < 10) {
                                $day = '0' . $i;
                                $arrayfechas[$i] = $day; //."/".$valuemeses."/".$valueanno;
                            }
                            if ($i >= 10) {
                                $day = $i;
                                $arrayfechas[$i] = $day;
                            }
                            $datos->fechainicio = $datos->fechafin = date(
                                    'd-m-Y', mktime(
                                            00, 00, 00, $datos->valuemeses, $i, $datos->valueanno
                                    )
                            );
                            $datos->arraydatosreportes['fechainicioD'] = $datos->arraydatosreportes['fechainicioD'] = null;
                            $datos->repeticiones = 1;
                            $arrayactividadespordia = DatElementos::ObtenerActividadesReporte(
                                            $datos
                            );
                            if (isset($arrayactividadespordia[0]['idelemento'])) {
                                foreach (
                                $arrayactividadespordia as $p => $actividad
                                ) {
                                    $actividades[$i][$p]['hora'] = $actividad['horainicio'];
                                    $actividades[$i][$p]['fechainicio'] = $actividad['fechainicio'];
                                    $actividades[$i][$p]['fechafin'] = $actividad['fechafin'];
                                    $actividades[$i][$p]['titulo'] = $actividad['denelemento'];
                                    $color = '#FFFFFF';
                                    /* if ($actividad['color']) {
                                      $color = '#' . $actividad['color'];
                                      } */
                                    $actividades[$i][$p]['color'] = $color;
                                }
                            }
                        }
                        for ($index = 0; $index < count($actividades); $index++) {
                            for (
                            $indexA = 1; $indexA < count($actividades[$index]); $indexA++
                            ) {
                                for (
                                $indexE = 0; $indexE < (count($actividades[$index]) - $indexA); $indexE++
                                ) {
                                    if (count($actividades[$index]) == 1) {
                                        break;
                                    } else {
                                        $horaAct = split(
                                                ':', $actividades[$index][$indexE]['hora']
                                        );
                                        $horaSolo = (int) $horaAct[0];
                                        $minSolo = (int) $horaAct[1];
                                        $horaActA = split(
                                                ':', $actividades[$index][($indexE + 1)]['hora']
                                        );
                                        $horaSoloB = (int) $horaActA[0];
                                        $minSoloQ = (int) $horaActA[1];
                                        if ($horaSolo > $horaSoloB) {
                                            $temp = $actividades[$index][$indexE];
                                            $actividades[$index][$indexE] = $actividades[$index][($indexE + 1)];
                                            $actividades[$index][($indexE + 1)] = $temp;
                                        } else {
                                            if ($horaSolo == $horaSoloB) {
                                                if ($minSolo > $minSoloQ) {
                                                    $temp = $actividades[$index][$indexE];
                                                    $actividades[$index][$indexE] = $actividades[$index][($indexE + 1)];
                                                    $actividades[$index][($indexE + 1)] = $temp;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        $contador = 1;
                        $fecha = '';
                        $fechaconcurrente = date(
                                'w', mktime(
                                        00, 00, 00, $datos->valuemeses, 01, $datos->valueanno
                                )
                        );
                        $tablareport
                                .= "<table class='Estilo1' width='100%'
                                bordercolor='black' aling = 'center' 
                                style='margin-top:1cm;table-layout:fixed;' cellspacing='0' >"
                                . "<thead>" . "<tr style='text-align:center;'>" .
                                "<td width='14.2%' bgcolor='#CCCCCC'  
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Lunes</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Martes</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Mi&eacute;rcoles</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Jueves</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>Viernes</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-top:1px 
                                solid #000000;'><strong>S&aacute;bado</strong></td>"
                                . "<td width='14.2%' bgcolor='#CCCCCC'
                                style='border-bottom:1px solid #000000;
                                border-left:1px solid #000000;border-right:1px 
                                solid #000000;border-top:1px 
                                solid #000000;'><strong>Domingo</strong></td>"
                                . "</tr>" . "</thead><tbody>";
                        ////******  1RA fila   ******///
                        /* 1 */
                        $tablareport .= "<tr>" . "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 1) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[1] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 1 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[1] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 1) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfilaD[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfilaD[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[2]][$i]['color']
                                        . "; color:#000000;'>"
                                        . str_replace(
                                                ':', '', $actividades[$arraycontfilaD[1]][$i]['hora']
                                        )
                                        . " "
                                        . $actividades[$arraycontfilaD[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfilaD[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 2) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[2] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 2 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[2] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 2) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfilaD[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfilaD[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[2]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfilaD[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';

                        if ($fechaconcurrente == 3) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[3] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 3 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[3] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 3) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfilaD[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfilaD[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[3]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfilaD[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 4) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[4] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 4 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[4] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 4) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfilaD[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfilaD[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[4]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfilaD[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 5) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[5] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 5 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[5] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 5) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfilaD[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfilaD[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[5]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfilaD[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 6) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[6] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente < 6 && $fechaconcurrente != 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[6] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 6) {
                            $fecha = '&nbsp;';
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfilaD[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfilaD[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[6]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfilaD[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left'
                        valign='top' width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px
                        solid #000000;border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $fecha = '&nbsp;';
                        if ($fechaconcurrente == 0) {
                            $fecha = $arrayfechas[1];
                            $arraycontfilaD[7] = $contador;
                            $contador++;
                        }
                        if ($fechaconcurrente > 0) {
                            $fecha = $arrayfechas[$contador];
                            $arraycontfilaD[7] = $contador;
                            $contador++;
                        }
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arraycontfilaD[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arraycontfilaD[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arraycontfilaD[7]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arraycontfilaD[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arraycontfilaD[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arraycontfilaD[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>" . "</tr>";
                        ////******  2DA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[3]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arrayfechasfilaA[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[5]][$i]['color']
                                        . "; color:#000000;'>"
                                        . $actividades[$arrayfechasfilaA[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaA[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaA[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaA[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaA[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaA[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class=' Estilo1' align='justify' style='background:"
                                        . $actividades[$arrayfechasfilaA[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaA[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaA[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaA[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>" . "</tr>";
                        ////******  3RA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaH[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaH[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaH[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaH[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaH[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaH[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaH[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaH[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td></tr>";
                        ////******  4TA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaT[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[6]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                                width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                                border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaT[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaT[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaT[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaT[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaT[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaT[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaT[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td></tr>";
                        ////******  5TA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[6]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1'style='background:"
                                        . $actividades[$arrayfechasfilaR[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[6]]
                                ) == 0)
                        ) {
                            $tablareport .= " &nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaR[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaR[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaR[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaR[7]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaR[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaR[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaR[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaR[7]]
                                ) == 0)
                        ) {
                            $tablareport .= " &nbsp;";
                        }
                        $tablareport .= "</td></tr>";
                        ////******  6TA fila   ******///
                        /* 1 */
                        $tablareport
                                .= "<tr><td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[1] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[1];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[1]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[1]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[1]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[1]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[1]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[1]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 2 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[2] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[2];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[2]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[2]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[2]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[2]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[2]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[2]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 3 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[3] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[3];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[3]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[3]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[3]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[3]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[3]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[3]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 4 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[4] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[4];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[4]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[4]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[4]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[4]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[4]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[4]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 5 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[5] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[5];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[5]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[5]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[5]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[5]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 6 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[6] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $fecha = $arrayfechasfilaW[6];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[6]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[6]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[6]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[6]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[5]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td>";
                        /* 7 */
                        $tablareport
                                .= "<td class='Estilo1' align='left' valign='top'
                        width='14.2%' height='50' bgcolor='#FFFFFF' style='border-left:1px solid #000000;
                        border-right:1px solid #000000;border-bottom:1px solid #000000;'>";
                        $arrayfechasfilaW[7] = $contador;
                        $fecha = $arrayfechas[$contador];
                        if ($fecha == '') {
                            $fecha = '&nbsp;';
                        }
                        $contador++;
                        $tablareport .= "<p align='right' style='margin:0px' ><b>"
                                . $fecha . "</b></p>";
                        $tablareport .= "</tr>";
                        $fecha = $arrayfechasfilaW[7];
                        if (($fecha != '') && (count(
                                        $actividades[$arrayfechasfilaW[7]]
                                ) > 0)
                        ) {
                            $val = count($actividades[$arrayfechasfilaW[5]]);
                            for ($i = 0; $i < $val; $i++) {
                                $tablareport .= "<div class='  Estilo1' style='background:"
                                        . $actividades[$arrayfechasfilaW[7]][$i]['color']
                                        . "; color:#000000;'> "
                                        . $actividades[$arrayfechasfilaW[7]][$i]['hora']
                                        . " "
                                        . $actividades[$arrayfechasfilaW[7]][$i]['titulo']
                                        . "</div>";
                            }
                        }
                        if (($fecha == '') || (count(
                                        $actividades[$arrayfechasfilaW[7]]
                                ) == 0)
                        ) {
                            $tablareport .= "&nbsp;";
                        }
                        $tablareport .= "</td><tr></tbody></table>";
                        break;
                }
            }
        }
        $tablareport .= "</div></div>";
        return $tablareport;
    }

    public function GenerarListadoActividades($datos) {

      $column_car="<td with = 'auto'><div align='center'>
          <strong>CAR</strong></div></td>";
      if ($datos->versionadoSelecionado == 40) {
           $column_car="";
      }

      if ($datos->versionadoSelecionado == 40 || $datos->versionadoSelecionado == 30) {
        $datos->suspendidas=1;
        $datos->rangotitle=null;
        $datos->tituloreporte.=($datos->textomeses!="")?" ".strtoupper($datos->textomeses):"";
      }

      if($datos->versionadoSelecionado != 40 && $datos->versionadoSelecionado != 30){
        $datos->suspendidas=null;
      }




        $arrayTareas=array();
        $datos->str_idelementos="";
        if($datos->idplan!=''){
          DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
          foreach ($arrayTareas as $value){
            $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
          }
        }

        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );


            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //clasificacion
                        $tablareport
                                .= "<table class='Estilo1' border='0'>
                             <tr><td>&nbsp;</td>
                             <td><div align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                                .
                                $configuracionfirma->cargoaprueba . "</b></div></td>
                              <td width = '800px'><div align='right'><p style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                                . $datos->confidencialidad . "</p></div></td></tr>";
                        $altohoja = $altohoja - 0.25;
                        break;
                    case 2: //aprobado por
                          $tablareport
                                  .= "<tr><td><b style ='font-size: 12px; font-family: 'Arial Black';
                                     font-weight: normal;>APROBADO:</b></td><td align='center'>
                             <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >". $configuracionfirma->gradoaprueba . "</b></td>
                            <td>&nbsp;</td></tr>
                            <tr><td><span></span></td><td>&nbsp;</td>
                            <td><span></span></td></tr>
                            <tr><td>&nbsp;</td><td align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                          . $configuracionfirma->nombreaprueba . "</b></td>
                            <td>&nbsp;</td></tr></table>";
                           $altohoja = $altohoja - 5.25;
                        break;
                    case 3: //titulo
                        $todos_los_campos = "";
//                        if ($datos->versionadoSelecionado == 31) {
//                            $todos_los_campos.="<tr><td><div align='center'>
//                                <p><b>DESDE: " . $datos->arraydatosreporte['desde'] . "
//                                  &nbsp;&nbsp;&nbsp;&nbsp;HASTA: " . $datos->arraydatosreporte['hasta'] .
//                                    "</b></p></div></td></tr>";
//                            $tablareport
//                                    .= "<table class ='Estilo1' width= '100%'
//                                border='0' align='center'>
//                                <tr><td><div align='center'>
//                                <p><b>" . $datos->tituloreporte .
//                                    "</b></p></div></td></tr>" . $todos_los_campos . "</table>";
//                        }
//                        if ($datos->versionadoSelecionado == 30) {
//                            $tablareport
//                                    .= "<table class ='Estilo1' width= '100%'
//                                border='0' align='center'>
//                                <tr><td><div align='center'>
//                                <p><b>" . $datos->tituloreporte . ": " . $datos->textomeses .
//                                    "</b></p></div></td></tr>" . $todos_los_campos . "</table>";
//                        }
                        $altohoja = $altohoja - 4;
                        break;
                    case 4: //elaborado por
                        if ($configuracionfirma->nombrelabora != '') {
                            $tablareport
                                    .= " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='500' align='center'> 
                                      <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                                    . $configuracionfirma->cargoelabora
                                    . "</b></td></tr>";
                            $tablareport
                                    .= "<tr><td><div align='center'></td>
                                <td width='500' align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                                    . $configuracionfirma->gradoelabora . "</b></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='500'align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                                    . $configuracionfirma->nombrelabora . "</b></td>
                                </tr></table></div>";
                        }
                        break;
                    case 5: //actividades principales
                        $arraydat = $this->ConstruirHojaActivPrinicpales(
                                $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
                        );
                        $tablareport = $arraydat["tablareport"];
                        $contadorhojas = $arraydat["contadorhojas"];
                        $existeprincp = $arraydat["principales"];
                        break;
                    case 7:
                        //esto es temporal hasta ke se ajuste
                        //segun los campos de la version
                        $datos->widthActividad = '35%';
                        $datos->widthActividadWrite = '35%';
                        $datos->widthParticipantesWrite = '20%';
                        $datos->widthParticipantes = '16%';
                        $columnaInvolucrado = "";
                        $bordeDerechoUltimaColumna = "border-right:1px solid black;";
                        if ($datos->versionadoSelecionado == 6) {
                            $datos->coninvolucrados = 1;
                            $datos->widthActividad = '25%';
                            $datos->widthActividadWrite = '25%';
                            $datos->widthParticipantes = '25%';
                            $datos->widthParticipantesWrite = '20%';
                            $bordeDerechoUltimaColumna = "";
                            $columnaInvolucrado = "<td><div align='center'><strong>
                                        Involucrados</strong></div></td>";
                        }

                        $tabla = "<table  cellspacing='0' class='Estilo1' 
                                width='100%' border='1'> 
                                    <tr bgcolor='#CCCCCC'>
                                        <td with = 'auto'><div align='center'>
                                        <strong>No</strong></div></td>".

                                        $column_car.

                                       "<td width='600'><div align='center' ><strong>
                                        Actividades</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Fecha</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Hora</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Lugar</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Dirige</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Participa</strong></div></td>"
                                .
                                $columnaInvolucrado . "                                        
                                      </tr>";
                        if ($datos->versionadoSelecionado == 31) {
                            $tabla = "<table  cellspacing='0' class='Estilo1' 
                                width='100%' border='1'> 
                                    <tr bgcolor='#CCCCCC'>
                                        <td with = 'auto'><div align='center'>
                                        <strong>No.</strong></div></td>
                                        ".$column_car."
                                        <td width='500'><div align='center' ><strong>
                                        (*)Actividades</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Fecha</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Hora</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Lugar</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Dirige</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Participantes</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Involucrados</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Descripción</strong></div></td>
                                        <td with = 'auto'><div align='center' ><strong>
                                        Categoría</strong></div></td>
                                        <td with = 'auto'><div align='center' ><strong>
                                        Tipo</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Relaciones</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Reasignaciones</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Estado \n Aprob.</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Estado \n Cump.</strong></div></td>
                                        <td><div align='center' ><strong>
                                        %</strong></div></td>
                                        <td with = 'auto'><div align='center' ><strong>
                                        Autor</strong></div></td>
                                        <td with = 'auto'><div align='center' ><strong>
                                        Recursos</strong></div></td></tr>";
                        }

                        if ($datos->versionadoSelecionado == 30) {
                            $tabla = "<table  cellspacing='0' class='Estilo1' 
                                width='100%' border='1'> 
                                    <tr bgcolor='#CCCCCC'>
                                        <td with = 'auto'><div align='center'>
                                        <strong>No.</strong></div></td>
                                        <!--<td with = 'auto'><div align='center'>
                                        <strong>CAR</strong></div></td>-->
                                        <td width='600' ><div align='center' ><strong>
                                        Actividad (hora y lugar)</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Fecha</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Dirige</strong></div></td>
                                        <td><div align='center' ><strong>
                                        Participantes</strong></div></td>
                                        </tr>";
                        }

                        $tablareport.=$tabla;

                        $datos->repeticiones = 1;

                        $arrayidactividades = DatElementos::ObtenerActividadesReporte($datos);

                        $array_ids_repeticiones = [];

                        $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
                                $arrayidactividades, $arrayactividadesorg
                        );
                        if (isset($arrayactividadesorg['padres'])) {
                            foreach (
                            $arrayactividadesorg['padres'] as $key => $actpadre
                            ) {
                                $array_ids_repeticiones = array_merge($array_ids_repeticiones,
                                                  self::infoRepeticionesActividad($actpadre['idrepeticiones']));

                              if(array_search($actpadre['idelemento'], $array_ids_repeticiones)===false){
                                $key = $key + 1;
                                $respuesta = $this->CrearListaHtmlDeActividades(
                                  $key, $tablarep = '', $actpadre, $arrayactividadesorg, $datos, $contadorhojas
                                );
                                $tablareport .= $respuesta;
                              }
                            }
                        }
                        $tablareport .= "</table>";
                        break;
                }
            }
        }
        return $tablareport;
    }

    public function GenerarListadoActividadesARC($datos) {
        if ($datos->versionadoSelecionado == 37) {
            $datos->coninvolucrados = 1;
        }

        $arrayTareas=array();
        $datos->str_idelementos="";
        if($datos->idplan!=''){
          DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
          foreach ($arrayTareas as $value){
            $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
          }
        }

        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
				 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja .
                "cm;size:" . $orientacionhoja . ";}
				 </style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                  case 1: //clasificacion
                    $tablareport
                              .= "<table class='Estilo1' border='0'>
                             <tr><td>&nbsp;</td>
                             <td><div align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      .
                      $configuracionfirma->cargoaprueba . "</b></div></td>
                              <td width = '800px'><div align='right'><p style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $datos->confidencialidad . "</p></div></td></tr>";
                    $altohoja = $altohoja - 0.25;
                    break;
                  case 2: //aprobado por
                    $tablareport
                              .= "<tr><td><b style ='font-size: 12px; font-family: 'Arial Black';
                                     font-weight: normal;>APROBADO:</b></td><td align='center'>
                             <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >". $configuracionfirma->gradoaprueba . "</b></td>
                            <td>&nbsp;</td></tr>
                            <tr><td><span></span></td><td>&nbsp;</td>
                            <td><span></span></td></tr>
                            <tr><td>&nbsp;</td><td align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $configuracionfirma->nombreaprueba . "</b></td>
                            <td>&nbsp;</td></tr></table>";
                    $altohoja = $altohoja - 5.25;
                    break;
//                    case 3: //titulo
//                        $tablareport
//                                .= "<table class ='Estilo1' width= '100%' border='0' align='center'>
//                            <tr><td><div align='center'><p><b>"
//                                . $datos->tituloreporte .
//                                "</b></p></div></td></tr></table>";
//                        $altohoja = $altohoja - 4;
//                        break;
                case 4: //elaborado por
                  if ($configuracionfirma->nombrelabora != '') {
                    $tablareport
                      .= " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='500' align='center'> 
                                      <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $configuracionfirma->cargoelabora
                      . "</b></td></tr>";
                    $tablareport
                      .= "<tr><td><div align='center'></td>
                                <td width='500' align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $configuracionfirma->gradoelabora . "</b></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='500'align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                      . $configuracionfirma->nombrelabora . "</b></td>
                                </tr></table></div>";
                  }
                  break;
                    case 5: //actividades principales
                        $arraydat = $this->ConstruirHojaActivPrinicpales(
                                $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
                        );
                        $tablareport = $arraydat["tablareport"];
                        $contadorhojas = $arraydat["contadorhojas"];
                        $existeprincp = $arraydat["principales"];
                        break;
                    case 7:
                        $tablareport = $this->ObtenerEncabezadoReporteAgrupacion(
                                $tablareport, $datos
                        );
                        $arraydatos->idtipoelemento = 0;
                        $arraydatos->idelemento = $datos->idplan;

                        $arrayarcplan = DatArcDatPlan::ObtenerAreasPorPlanesSQL(
                                        $datos->idplan
                        );
                        $cont = 1;
                        if (isset($arrayarcplan[0])) {
                            $arrayarcplan = $this->OrganizarArcPorPadresEHijos(
                                    $arrayarcplan
                            );
                            foreach ($arrayarcplan as $arc) {
                                if ($arc['idarcp'] == null) {
                                    $tablareport .= $this->GenerarCuerpoReporteARCPlan(
                                            $cont, $arc, $arrayarcplan, $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
                                    );
                                    $cont++;
                                }
                            }
                        }
                        $obj = null;
                        $obj['idobjetivo'] = 'objetivo';
                        $obj['idpadre'] = 'null';
                        $obj['denelemento'] = 'Otras actividades vinculadas al plan';
                        $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                                $cont, $obj, $arrayobjetivosplan = array(), $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
                        );
                        $tablareport .= "</tbody>" . "</table>";
                        break;
                }
            }
        }
        $tablareport .= "</div>";
        $tablareport .= "</div>";
        return $tablareport;
    }

    public function GenerarListadoActividadesObjetivos($datos) {
        if ($datos->versionadoSelecionado == 35) {
            $datos->coninvolucrados = 1;
        }

        $arrayTareas=array();
        $datos->str_idelementos="";
        if($datos->idplan!=''){
          DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
          foreach ($arrayTareas as $value){
            $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
          }
        }

        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                .
                $datos->tamanoletra . ";}  
				 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja .
                "cm;size:" . $orientacionhoja . ";}
				 </style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );

            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //clasificacion
                        $tablareport
                                .= "<table class='Estilo1' width='100%' border='0'>
                                <tr><td width='68'>&nbsp;</td>
                                <td width='595'><div align='left'>"
                                . $configuracionfirma->cargoaprueba . "</div></td>
                                <td width='289'><div align='right'>"
                                . $datos->confidencialidad . "</div></td></tr>";
                        $altohoja = $altohoja - 0.25;
                        break;
                    case 2: //aprobado por
                        $tablareport
                                .= "<tr><td><b>APROBADO:&nbsp;&nbsp;</b></td>
                                    <td>" . $configuracionfirma->gradoaprueba .
                                "</td><td>&nbsp;</td></tr>
                                    <tr><td><span></span></td><td>&nbsp;</td>
                                    <td width='16'><span></span></td></tr>
                                    <tr><td>&nbsp;</td>
                                    <td>" . $configuracionfirma->nombreaprueba .
                                "</td><td>&nbsp;</td></tr></table>";

                        $altohoja = $altohoja - 5.25;
                        break;
//                    case 3: //titulo
//                        $tablareport
//                                .= "<table class ='Estilo1' width= '100%' border='0' align='center'>
//                                    <tr><td><div align='center'>
//                                    <p><b>" . $datos->tituloreporte . "</b></p>
//                                    </div></td></tr></table>";
//
//                        $altohoja = $altohoja - 4;
//                        break;
                    case 4: //elaborado por
                          if ($configuracionfirma->nombrelabora != '') {
                            $tablareport
                              .= " <table class='Estilo1' width='100%' border='0'>
                                      <tr> <td>&nbsp;</td><td width='500'><div align='center'>"
                              . $configuracionfirma->cargoelabora
                              . "</div></td></tr>";
                            $tablareport
                              .= "<tr><td><div align='center'></td>
                                      <td width='500'><div align='center'>"
                              . $configuracionfirma->gradoelabora . "</div></td></tr>
                                      <tr><td><span></span></td><td>&nbsp;</td>
                                      <td width='16'><span></span></td></tr>
                                      <tr><td>&nbsp;</td><td width='500'><div align='center'>"
                              . $configuracionfirma->nombrelabora . "</td>
                                      </tr></table></div>";
                          }
                        break;
                    case 5: //actividades principales
                        $arraydat = $this->ConstruirHojaActivPrinicpales(
                                $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
                        );
                        $tablareport = $arraydat["tablareport"];
                        $contadorhojas = $arraydat["contadorhojas"];
                        $existeprincp = $arraydat["principales"];
                        break;
                    case 7:
                        $tablareport = $this->ObtenerEncabezadoReporteAgrupacion(
                                $tablareport, $datos
                        );
                        $arrayobjetivosplan = DatElementosDatElementos::BuscarObjetivosAlPlan(
                                        $datos->idplan
                        );
                        /* $arrayobjetivosarcplan
                          = DatElementosDatElementos::BuscarObjetivosEnArcAlPlan(
                          $datos->idplan
                          );
                          $arrayobjetivosplan = $this->eliminarDuplicados(array_merge($arrayobjetivosplan, $arrayobjetivosarcplan)); */

                        $cont = 1;
                        if (isset($arrayobjetivosplan[0])) {
                            $arrayobjetivosplan = $this->OrganizarObjPorPadresEHijos(
                                    $arrayobjetivosplan
                            );
                            foreach ($arrayobjetivosplan as $obj) {
                                if ($obj['idpadre'] == null) {
                                    $obj['idobjetivo'] = $obj['idelemento'];
                                    $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                                            $cont, $obj, $arrayobjetivosplan, $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
                                    );
                                    $cont++;
                                }
                            }
                        }
                        $obj = null;
                        $obj['idobjetivo'] = 'objetivo';
                        $obj['idpadre'] = 'null';
                        $obj['denelemento'] = 'Otras actividades vinculadas al plan';
                        $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                                $cont, $obj, $arrayobjetivosplan, $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
                        );
                        $tablareport .= "</tbody>" . "</table>";
                        break;
                }
            }
        }
        $tablareport .= "</div>";
        return $tablareport;
    }

    public function eliminarDuplicados($array) {
        $ids = array_column($array, 'idelemento');
        $ids = array_unique($ids);
        $array = array_filter(
                $array, function ($key, $value) use ($ids) {
            return in_array($value, array_keys($ids));
        }, ARRAY_FILTER_USE_BOTH
        );
        return $array;
    }

    public function GenerarListadoObjetivos($datos) {
        $tablareport = "";
        $tablareport
                .= "<tr><td><table class='Estilo1' width='1000' align='center'>" .
                "<tr>"
                . "<td class='Estilo1' colspan='8'><div align='right'>&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp; </div></td>"
                .
                "</tr>" . "</table></td></tr>";
        $tablareport
                .= "<table class='Estilo1' width='1000'  cellspacing='1'
            bordercolor='#333333' bgcolor='#FFFFFF' style='font-size:14px ;
            font-weight:normal;' align='center'>";
        if (isset($datos->arraypartesreporte[0])) {
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //clasificacion
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='1000' >"
                                . "<tr>" .
                                "<td class='Estilo1' colspan='8'><div 
                                align='right'>&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp; </div></td>"
                                .
                                "</tr>" . "</table></td></tr>";
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='1000'
                                cellspacing='0' bordercolor='#333333' 
                                bgcolor='#FFFFFF' style='font-size:14px ;
                                font-weight:normal;'>"
                                .
                                "<tr>"
                                . "<td class='Estilo1' colspan='8'><div 
                                align='right'>"
                                . $datos->confidencialidad
                                . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;</div></td>"
                                .
                                "</tr>" . "</table></td></tr>";
                        break;
                    case 2: //aprobado por
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='1000'
                                cellspacing='0' bordercolor='#333333' 
                                bgcolor='#FFFFFF' style='font-size:14px ;
                                font-weight:normal;'>"
                                .
                                "<tr>"
                                . "<td class='Estilo1' colspan='8'><div 
                                class='Estilo1 align='right'>&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp; </div></td>"
                                .
                                "</tr>" . "</table></td></tr>";
                        $tablareport
                                .= "<tr><td><table class='Estilo1' cellspacing='0'
                                bordercolor='#333333' bgcolor='#FFFFFF' 
                                style='font-size:14px ;font-weight:normal;'>"
                                .
                                "<tr>"
                                . "<td class='Estilo1' ><div 
                                align='right'><b>APROBADO:&nbsp;&nbsp;</b></td>"
                                .
                                "<td class='Estilo1' ><div align='center'>"
                                . $configuracionfirma->cargoaprueba .
                                "</td>" . "</tr>" . "<tr>" . "<td>&nbsp;</td>" .
                                "<td class='Estilo1' ><div align='center'>"
                                . $configuracionfirma->gradoaprueba .
                                "</td>" . "</tr>" . "<tr>" . "<td>&nbsp;</td>" .
                                "<td class='Estilo1' ><div align='center'>"
                                . $configuracionfirma->nombreaprueba . "</td>"
                                . "</tr>" . "</table></td></tr>";
                        break;
                    case 3: //titulo
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='1000'
                                cellspacing='0' bordercolor='#333333' 
                                bgcolor='#FFFFFF' style='font-size:14px ;
                                font-weight:normal;'>"
                                .
                                "<tr>"
                                . "<td class='Estilo1' colspan='8'><div 
                                align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                </div></td>"
                                .
                                "</tr>" . "</table></td></tr>";
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='1000'
                                cellspacing='0' bordercolor='#333333' 
                                bgcolor='#FFFFFF' style='font-size:14px ;
                                font-weight:normal;'>"
                                .
                                "<tr>"
                                . "<td class='Estilo1' colspan='8'><div 
                                align='center'>"
                                . $datos->tituloreporte . "</div></td>" . "</tr>"
                                . "</table></td></tr>";
                        break;
                    case 4: //elaborado por
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='1000'
                                cellspacing='0' bordercolor='#333333' 
                                bgcolor='#FFFFFF' style='font-size:14px ;
                                font-weight:normal;' >"
                                .
                                "<tr>"
                                . "<td class='Estilo1' colspan='8'><div 
                                align='center'>&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp; </div></td>"
                                .
                                "</tr>" . "</table></td></tr>";
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='1000'
                                cellspacing='0' bordercolor='#333333' 
                                bgcolor='#FFFFFF' style='font-size:14px ;
                                font-weight:normal;'>"
                                .
                                "<tr>" . "<td>&nbsp;</td>" . "<td>&nbsp;</td>"
                                . "</tr>" . "<tr>" .
                                "<td class='Estilo1' width='872'><div 
                                align='right'></td>"
                                .
                                "<td class='Estilo1' width='500'><div align='center'>"
                                . $configuracionfirma->cargoelabora . "</td>"
                                . "</tr>" . "<tr>" . "<td>&nbsp;</td>" .
                                "<td class='Estilo1' width='500'><div align='center'>"
                                . $configuracionfirma->gradoelabora .
                                "</td>" . "</tr>" . "<tr>" . "<td>&nbsp;</td>" .
                                "<td class='Estilo1' width='500'><div align='center'>"
                                . $configuracionfirma->nombrelabora .
                                "</td>" . "</tr>" . "</table></td></tr>";
                        break;
                    case 7:
                        //esto es temporal hasta ke se ajuste segun los campos de la version
                        $tablareport
                                .= "<table class='Estilo1' width='1000'
                            align='center' bgcolor='#FFFFFF' cellspacing='0' 
                            style='font-size:14px ;font-weight:normal;'>";
                        //obtener todos los objetivos generados por el usuario
                        $arrayautoresobj[] = $datos->idusuariosession;
                        $objelementos = new DatElementos();
                        $arrayidobjetivos = $objelementos->CargarIdObjetivos(
                                $idobjetivo = null, $idusuario = $datos->idusuariosession, $idelementotributa = null, $denominacion = null, $fechainicio = null, $fechafin = null, $arrayautoresobj, $arrayinvolucrados = array(), $car = null, $start = null, $limit = null, $idtipoelementotributa = null, $idtipoelementotributasuperior = null, $datos->arrayestados, $busqueda = null, $arrayelementosrelacionados = array()
                        );
                        if (isset($arrayidobjetivos[0])) {
                            foreach ($arrayidobjetivos as $key => $idobj) {
                                $num = $key + 1;
                                $tablareport .= "<tr >"
                                        . "<td class='Estilo1' width='20' '>" .
                                        "<div class='Estilo1' align='left'>" . $num
                                        . "." . "</strong></div>" . "</td>" .
                                        "<td class='Estilo1'>" .
                                        "<div class='Estilo1' align='left'>"
                                        . $idobj['denelemento'] . "</strong></div>"
                                        .
                                        "</td>" . "</tr>";
                                $arraycriterios = DatCriteriomedida::GetCritDadoIdElemen(
                                                $idobj['idobjetivo']
                                );
                                if (isset($arraycriterios[0])) {
                                    $caden = $num . ".";
                                    foreach (
                                    $arraycriterios as $pos => $criterio
                                    ) {
                                        $tablareport .= "<tr >"
                                                . "<td class='Estilo1' width='20' '>"
                                                .
                                                "<div class='Estilo1' align='center'></div>"
                                                . "</td>" . "<td>" . //width='220'
                                                "<div class='Estilo1' align='left'>"
                                                . $caden . $pos . " "
                                                . $criterio['dencriterio'] .
                                                "</div>" . "</td>" . "</tr>";
                                    }
                                }
                            }
                        }
                        $tablareport .= "</table>";
                        break;
                }
            }
        }
        $tablareport
                .= "<tr><td><table class='Estilo1' width='1000' cellspacing='0'
                bordercolor='#333333' bgcolor='#FFFFFF' style='font-size:12px ;
                font-weight:normal;' align='center'>"
                .
                "<tr>"
                . "<td class='Estilo1' colspan='8'><div align='right'>&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp; </div></td>"
                .
                "</tr>" . "</table></td></tr>";
        return $tablareport;
    }

    public function GenerarPlanArcObjetivoActividades($datos) {
        if ($datos->versionadoSelecionado == 39) {
            $datos->coninvolucrados = 1;
        }

        $arrayTareas=array();
        $datos->str_idelementos="";
        if($datos->idplan!=''){
          DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
          foreach ($arrayTareas as $value){
            $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
          }
        }

        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
				 @page{height:" . $datos->altohoja . "cm; width:"
                . $datos->anchohoja .
                "cm; size:" . $orientacionhoja . ";} </style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //clasificacion
                        $tablareport
                                .= "<table class='Estilo1' width='100%' border='0'>
                                <tr><td width='68'>&nbsp;</td>
                                <td width='595'><div align='left'>"
                                . $configuracionfirma->cargoaprueba . "</div></td>
                                <td width='289'><div align='right'>"
                                . $datos->confidencialidad . "</div></td></tr>";
                        $altohoja = $altohoja - 0.25;
                        break;
                    case 2: //aprobado por
                        $tablareport
                                .= "<tr><td><b>APROBADO:&nbsp;&nbsp;</b></td><td>"
                                . $configuracionfirma->gradoaprueba . "</td>
                                <td>&nbsp;</td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td>
                                <td>" . $configuracionfirma->nombreaprueba . "</td>
                                <td>&nbsp;</td></tr></table>";
                        $altohoja = $altohoja - 5.25;
                        break;
//                    case 3: //titulo
//                        $tablareport
//                                .= "<table class ='Estilo1' width= '100%' border='0' align='center'>
//                                <tr><td><div align='center'><p><b>"
//                                . $datos->tituloreporte . "</b></p>
//                                </div></td></tr></table>";
//                        $altohoja = $altohoja - 4;
//                        break;
                    case 4://elaborado por
                        if ($configuracionfirma->nombrelabora != '') {
                            $tablareport
                                    .= " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='250'><div align='right'>"
                                    . $configuracionfirma->cargoelabora
                                    . "</div></td></tr>";
                            $tablareport
                                    .= "<tr><td><div align='right'></td>
                                <td width='250'><div align='right'>"
                                    . $configuracionfirma->gradoelabora . "</div></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='250'><div align='right'>"
                                    . $configuracionfirma->nombrelabora . "</td>
                                </tr></table></div>";
                        }
                        break;
                    case 5: //actividades principales
                        $arraydat = $this->ConstruirHojaActivPrinicpales(
                                $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
                        );
                        $tablareport = $arraydat["tablareport"];
                        $contadorhojas = $arraydat["contadorhojas"];
                        $existeprincp = $arraydat["principales"];
                        break;
                    case 7://Obtener Areas hijas y objetivos hijos del plan
                        $tablareport = $this->ObtenerEncabezadoReporteAgrupacion(
                                $tablareport, $datos
                        );
                        $arraydatos->idtipoelemento = 0;
                        $arraydatos->idelemento = $datos->idplan;
                        //Buscar areas hijas
                        $arrayarcplan = DatArcDatPlan::ObtenerAreasPorPlanesSQL(
                                        $datos->idplan
                        );
                        $cont = 1;
                        if (isset($arrayarcplan[0])) {
                            $arrayarcplan = $this->OrganizarArcPorPadresEHijos(
                                    $arrayarcplan
                            );
                            foreach ($arrayarcplan as $arc) {
                                if ($arc['idarcp'] == null) {
                                    $tablareport .= $this->GenerarCuerpoReportePlanARCObjAct(
                                            $cont, $arc, $arrayarcplan, $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
                                    );
                                    $cont++;
                                }
                            }
                        }
                        /* //Buscar objetivos hijos del plan
                          $arrayobjetivosplan
                          = DatElementosDatElementos::BuscarObjetivosAlPlan(
                          $datos->idplan
                          );
                          if (isset($arrayobjetivosplan[0])) {
                          $arrayobjetivosplan
                          = $this->OrganizarObjPorPadresEHijos(
                          $arrayobjetivosplan
                          );
                          foreach ($arrayobjetivosplan as $obj) {
                          if ($obj['idpadre'] == null) {
                          $obj['idobjetivo'] = $obj['idelemento'];
                          $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                          $cont, $obj, $arrayobjetivosplan,
                          $tablareport, $datos->idplan,
                          $cadena = '',
                          $datos->idversionreporte, $datos
                          );
                          $cont++;
                          }
                          }
                          } */

                        $obj = null;
                        $obj['idobjetivo'] = 'objetivo';
                        $obj['idpadre'] = 'null';
                        $obj['denelemento'] = 'Otras actividades vinculadas al plan';
                        $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                                $cont, $obj, $arrayobjetivosplan = array(), $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
                        );
                        $tablareport .= "</tbody>" . "</table>";

                        break;
                }
            }
        }
        $tablareport .= "</div></div>";
        return $tablareport;
    }

    public function ListadoPlanArcObjetivoActividades($datos, $row_title) {

      $arrayTareas=array();
      $datos->str_idelementos="";
      if($datos->idplan!=''){
        DatArcDatPlan::getActPlan($datos->idplan,$datos->idusuariosession,$arrayTareas);
        foreach ($arrayTareas as $value){
          $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
        }
      }

      $altohoja = $datos->altohoja - 2;
      $altohojainicial = $datos->altohoja - 2;
      $anchohoja = $datos->anchohoja - 2;
      $orientacionhoja = "portrait";
      if ($datos->orientacionhoja == 1) {
        $orientacionhoja = "landscape";
      }
      $tablareport = "<style type='text/css'>
                .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
        . $datos->tamanoletra . ";}
				 @page{height:" . $datos->altohoja . "cm; width:"
        . $datos->anchohoja .
        "cm; size:" . $orientacionhoja . ";} </style>";
      $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
        "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        $existeprincp = 0;
        $contadorhojas = 1;
        $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
          $datos->idusuariosession
        );
        $datos->arraydatosreporte = $this->DatosReporte(
          $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
        );

        $tablareport.=$row_title;

        $tablareport
                  .= "<table class='Estilo1' width='100%' border='0'>
                                <tr><td width='68'>&nbsp;</td>
                                <td width='595'><div align='left'>"
          . $configuracionfirma->cargoaprueba . "</div></td>
                                <td width='289'><div align='right'>"
          . $datos->confidencialidad . "</div></td></tr>";
        $altohoja = $altohoja - 0.25;

        $tablareport
                  .= "<tr><td><b>APROBADO:&nbsp;&nbsp;</b></td><td>"
          . $configuracionfirma->gradoaprueba . "</td>
                                <td>&nbsp;</td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td>
                                <td>" . $configuracionfirma->nombreaprueba . "</td>
                                <td>&nbsp;</td></tr></table>";
        $altohoja = $altohoja - 5.25;

        $tablareport = $this->ObtenerEncabezadoReporteAgrupacion(
          $tablareport, $datos
        );
        $arraydatos->idtipoelemento = 0;
        $arraydatos->idelemento = $datos->idplan;
        //Buscar areas hijas
        $arrayarcplan = DatArcDatPlan::ObtenerAreasPorPlanesSQL(
          $datos->idplan
        );
        $cont = 1;
        if (isset($arrayarcplan[0])) {
          $arrayarcplan = $this->OrganizarArcPorPadresEHijos(
            $arrayarcplan
          );
          foreach ($arrayarcplan as $arc) {
            if ($arc['idarcp'] == null) {
              $tablareport .= $this->GenerarCuerpoReportePlanARCObjAct(
                $cont, $arc, $arrayarcplan, $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
              );
              $cont++;
            }
          }
        }
        /* //Buscar objetivos hijos del plan
          $arrayobjetivosplan
          = DatElementosDatElementos::BuscarObjetivosAlPlan(
          $datos->idplan
          );
          if (isset($arrayobjetivosplan[0])) {
          $arrayobjetivosplan
          = $this->OrganizarObjPorPadresEHijos(
          $arrayobjetivosplan
          );
          foreach ($arrayobjetivosplan as $obj) {
          if ($obj['idpadre'] == null) {
          $obj['idobjetivo'] = $obj['idelemento'];
          $tablareport .= $this->GenerarCuerpoReporteObjPlan(
          $cont, $obj, $arrayobjetivosplan,
          $tablareport, $datos->idplan,
          $cadena = '',
          $datos->idversionreporte, $datos
          );
          $cont++;
          }
          }
          } */

        $obj = null;
        $obj['idobjetivo'] = 'objetivo';
        $obj['idpadre'] = 'null';
        $obj['denelemento'] = 'Otras actividades vinculadas al plan';
        $tablareport .= $this->GenerarCuerpoReporteObjPlan(
          $cont, $obj, $arrayobjetivosplan = array(), $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
        );
        $tablareport .= "</tbody>" . "</table>";


      $tablareport .= "</div></div>";
      return $tablareport;
    }

    public function generarObjetivosCM($datos) {
        $altohoja = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";
        $tituloReporte=($datos->tituloreporte!='')?$datos->tituloreporte.":":"Objetivos con Criterios de Medida:";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                .
                $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );

          $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
          $fechafinD = $datos->arraydatosreporte['fechafinD'];

          $rangoFechasReport = "<P align=center style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>";

          if ($fechainicioD != null){
            $rangoFechasReport.=("DESDE: ".str_replace('-','/', $fechainicioD));
          }

          if ($fechafinD != null){
            $rangoFechasReport.=("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HASTA: ".str_replace('-','/', $fechafinD));
          }

          $rangoFechasReport .="</P>";

            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //clasificacion
                        $tablareport
                                .= "<table class='Estilo1' width='100%' border='0'>
                                <tr><td width='68'>&nbsp;</td>
                                <td width='595'><div align='left'>"
                                . $configuracionfirma->cargoaprueba . "</div></td>
                                <td width='289'><div align='right'>"
                                . $datos->confidencialidad . "</div></td></tr>";
                        $altohoja = $altohoja - 0.25;
                        break;
                    case 2: //aprobado por
                        $tablareport
                                .= "<tr><td><b>APROBADO:&nbsp;&nbsp;</b></td><td>"
                                . $configuracionfirma->gradoaprueba . "</td>
                                <td>&nbsp;</td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td>
                                <td>" . $configuracionfirma->nombreaprueba . "</td>
                                <td>&nbsp;</td></tr></table>";
                        $altohoja = $altohoja - 5.25;
                        break;
                    case 3: //titulo
                        $tablareport
                        .= "<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>";
                        $tablareport
                          .= "<BR/>".$rangoFechasReport;
                        $altohoja = $altohoja - 4;
                        break;
                    case 4://elaborado por
                        if ($configuracionfirma->nombrelabora != '') {
                            $tablareport
                                    .= " <table class='Estilo1' width='100%' border='1'>
                                <tr> <td>&nbsp;</td><td width='250'><div align='right'>"
                                    . $configuracionfirma->cargoelabora
                                    . "</div></td></tr>";
                            $tablareport
                                    .= "<tr><td><div align='right'></td>
                                <td width='250'><div align='right'>"
                                    . $configuracionfirma->gradoelabora . "</div></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='250'><div align='right'>"
                                    . $configuracionfirma->nombrelabora . "</td>
                                </tr></table></div>";
                        }
                        break;
                    case 5: //Objetivos con CM
                        $tablareport .= $this->construirListadoObjCM($datos);
                        break;
                }
            }
        }
        return $tablareport;
    }

    public function construirListadoObjCM($datos) {
        $cont = 1;
        $tablareport = "<table  cellspacing='0' class='Estilo1' width='100%' border='0'>";
        $arrayObj = DatObjetivo::obtenerObjsReporte($datos);
        if (isset($arrayObj[0])) {
            foreach ($arrayObj as $obj) {
                $num = $this->ConvertirEnterosARomanos($cont);
                $tablareport
                        .= "<tr><td width='auto' nowrap='nowrap' valign='top'>
                    <p><strong>" . $num . "- " . $obj['denelemento'] .
                        "</strong></p></td></tr>";
                $cont++;
                $arrayCM = DatObjetivo::obtenerCMReporte($obj['idelemento']);
                $contCM = 1;
                if (isset($arrayCM[0])) {
                    foreach ($arrayCM as $cm) {
                        $tablareport
                                .= "<tr><td width='auto' nowrap='nowrap' valign='top'><p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                . $contCM . "- " . $cm['dencriterio'] .
                                "</p></td></tr>";
                        $contCM++;
                    }
                }
            }
        }
        $tablareport .= "</table>";
        return $tablareport;
    }

    public function generarDiagramaCoordinacion($datos) {
        $altohoja = $datos->altohoja - 2;
        $anchohoja = $datos->anchohoja - 2;
        $orientacionhoja = "portrait";

        $tituloReporte=($datos->tituloreporte!='')?$datos->tituloreporte.": ".$datos->ano:"Diagrama de coordinación: ".$datos->ano;

        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                .
                $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 3: //titulo
                      $tablareport
                        .= "<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>";
                        $altohoja = $altohoja - 4;
                        break;
                    case 5: //Objetivos con CM
                        $tablareport .= $this->construirCoordinacion($datos);
                        break;
                }
            }
        }
        return $tablareport;
    }

    public function generarReporteCualitativoCuantitativo($datos) {
        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        //$anchohoja = $datos->anchohoja - 2;
        $anchohoja = '50%';
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                ";background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //titulo reporte
                        $tablareport
                                .= "<table class ='Estilo1' width= '100%'
                                border='0' align='center'>
                                <tr><td><div align='center'>
                                <p><b>" . $datos->tituloreporte .
                                "</b></p></div></td></tr></table>";
                        $altohoja = $altohoja - 4;
                        break;
                    case 2: //titulo tabla 1
                        $anno = $datos->valueanno;
                        $mes = $datos->valuemeses;
                        $fechainicio = str_replace(
                                '-', '/', $datos->fechainicio
                        );
                        $fechafin = str_replace(
                                '-', '/', $datos->fechafin
                        );
                        $titulo = ($anno != '' && $mes != '') ? "Mes ($datos->textomeses)" : "Per&iacute;odo ($fechainicio - $fechafin)";
                        $tablareport
                                .= "<table width='100%' border='0' align='center' class='Estilo1'>
                              <tr>
                                <td><div align='justify' ><strong>Resumen Cuantitativo $titulo</strong><br></div></td>
                              </tr>";
                        $tablareport .= "</table>";
                        $altohoja = $altohoja - 0.25;
                        break;
                    case 3: //tabla 1
                        $arrayidactividades = DatElementos::ObtenerActividadesReporte($datos);
                        $datos->arrayActv = $arrayidactividades;
                        $reporte = $this->datosReporteDeActividadesPeriodo(
                                $datos
                        );
                        $tablareport
                                .= "<table  cellspacing='0' class='Estilo1'
                                width='100%' border='1'>
                                    <tr>
                                        <td with = '30%'><div align='center'>
                                        <strong>Criterio</strong></div></td>
                                        <td with = '60%'><div align='center' >
                                        <strong> Cantidad</strong></div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        Total de tareas planificadas</div></td>
                                        <td><div align='center' >$reporte->total</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        De ellas :Cumplidas</div></td>
                                        <td><div align='center' >$reporte->cumplida</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Incumplidas</div></td>
                                        <td><div align='center' >$reporte->incumplida</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Modificadas</div></td>
                                        <td><div align='center' >$reporte->modificada</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nuevas</div></td>
                                        <td><div align='center' >$reporte->nueva</div></td>
                                    </tr>
                                    ";
                        $tablareport .= "</table>";
                        break;
                    case 4: // tabla 2
                        //$datos->incidencia = 1;
                        $arrayActividades = DatElementos::ObtenerActividadesReporte($datos);
                        $datos->arrayActv = $arrayActividades;
                        $reporte = $this->datosReporteDeActividadesPeriodoDetallado(
                                $datos
                        );
                        $listaActCumplidas = $this->crearFilasHTMLActividadesIncidencia(
                                $reporte->arrayActCumplidas, 'CUMPLIDAS'
                        );
                        $listaActIncumplidas = $this->crearFilasHTMLActividadesIncidencia(
                                $reporte->arrayActIncumplidas, 'INCUMPLIDAS'
                        );
                        $listaActNuevas = $this->crearFilasHTMLActividadesIncidencia(
                                $reporte->arrayActNuevas, 'NUEVAS'
                        );
                        $listaActModificadas = $this->crearFilasHTMLActividadesIncidencia(
                                $reporte->arrayActModificadas, 'MODIFICADAS'
                        );
                        $tablareport
                                .= "<table  cellspacing='0' class='Estilo1'
                                width='100%' border='1'>
                                    <tr>
                                        <td with = '33%'><div align='center'>
                                        <strong>Actividades</strong></div></td>
                                        <td with = '33%'><div align='center' >
                                        <strong> Incidencias</strong></div></td>
                                        <td with = '33%'><div align='center' >
                                        <strong> Observaciones</strong></div></td>
                                    </tr>
                                    <tr>
                                        <th colspan='3'><div align='center' >
                                        Cumplidas: $reporte->cumplida</div></th>
                                    </tr>
                                    $listaActCumplidas
                                    <tr>
                                        <th colspan='3'><div align='center' >
                                        Incumplidas: $reporte->incumplida</div></th>
                                    </tr>
                                    $listaActIncumplidas
                                    <tr>
                                        <th colspan='3'><div align='center' >
                                        Modificadas: $reporte->modificada</div></th>
                                    </tr>
                                    $listaActModificadas
                                    <tr>
                                        <th colspan='3'><div align='center' >
                                        Nuevas: $reporte->nueva</div></th>
                                    </tr>
                                    $listaActNuevas
                                    ";
                        $tablareport .= "</table>";
                        break;
                    case 5: //titulo tabla 2
                        $anno = $datos->valueanno;
                        $mes = $datos->valuemeses;
                        $fechainicio = str_replace(
                                '-', '/', $datos->fechainicio
                        );
                        $fechafin = str_replace(
                                '-', '/', $datos->fechafin
                        );
                        $titulo = ($anno != '' && $mes != '') ? "Mes ($datos->textomeses)" : "Per&iacute;odo ($fechainicio - $fechafin)";
                        $tablareport
                                .= "<table width='100%' border='0' align='center' class='Estilo1'>
                              <tr>
                                <td><div align='justify' ><br><strong>Resumen Cualitativo $titulo</strong><br></div></td>
                              </tr>";
                        $tablareport .= "</table>";
                        $altohoja = $altohoja - 0.25;
                        break;
                    case 7:

                        break;
                }
            }
        }
        return $tablareport;
    }

    public function generarReporteResumenPlanificacion($datos) {
        $altohoja = $datos->altohoja - 2;
        $altohojainicial = $datos->altohoja - 2;
        //$anchohoja = $datos->anchohoja;
        $anchohoja = '50%';
        $orientacionhoja = "portrait";
        if ($datos->orientacionhoja == 1) {
            $orientacionhoja = "landscape";
        }
        $tablareport = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
                . $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
                . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
        $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
                ";background-color:white;padding:1cm 1cm 1cm 1cm;'>";
        if (isset($datos->arraypartesreporte[0])) {
            $existeprincp = 0;
            $contadorhojas = 1;
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                    $datos->idusuariosession
            );
            $datos->arraydatosreporte = $this->DatosReporte(
                    $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
            );
            foreach ($datos->arraypartesreporte as $partereporte) {
                switch ($partereporte['idpartereporte']) {
                    case 1: //titulo reporte
                        $anno = $datos->valueanno;
                        $mes = $datos->textomeses;
                        $tablareport
                                .= "<table class ='Estilo1' width= '100%'
                                border='0' align='center'>
                                <tr><td><div align='center'>
                                <p><b>"
                                . "Reporte resumen de la planificaci&oacute;n del mes de $mes de $anno"
                                .
                                "</b></p></div></td></tr></table>";
                        $altohoja = $altohoja - 4;
                        break;
                    case 2: //fecha emision
                        $fechaActual = date('d/m/Y');
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='100%' >"
                                . "<tr>" .
                                "<td class='Estilo1' colspan='8'><div
                                align='right'>&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp; </div></td>"
                                .
                                "</tr>" . "</table></td></tr>";
                        $tablareport
                                .= "<tr><td><table class='Estilo1' width='100%'
                                cellspacing='0' bordercolor='#333333'
                                bgcolor='#FFFFFF' style='font-size:14px ;
                                font-weight:normal;'>"
                                .
                                "<tr>"
                                . "<td class='Estilo1' colspan='8'><div
                                align='right'>"
                                . "Fecha de emisi&oacute;n: " . $fechaActual
                                . "<br><br><br></div></td>"
                                .
                                "</tr>" . "</table></td></tr>";
                        break;
                    case 3: // tabla 1
                        $tablareport
                                .= "<table width='100%' border='0' align='center' class='Estilo1'>
                              <tr>
                                <td><div align='justify'><strong>Estado general del Plan: % cumplimiento</strong><br></div></td>
                              </tr>";
                        $tablareport .= "</table>";
                        $parametros->arrayActv = DatElementos::ObtenerActividadesReporte($datos);
                        $parametros->anno = $datos->valueanno;
                        $parametros->mes = $datos->valuemeses;
                        $reporte = $this->datosReporteActividadesResumenPorMes(
                                $parametros
                        );
                        $cantActPlan = DatElementos::obtenerCantActividadesDirectasPlan(
                                        $datos->idplan
                                )[0];
                        $porcientoCumplida = round(
                                        ($reporte->cumplidas * 100) / $cantActPlan, 2
                                ) . '%';
                        $porcientoIncumplida = round(
                                        ($reporte->incumplidas * 100) / $cantActPlan, 2
                                ) . '%';
                        $porcientoEjecucion = round(
                                        ($reporte->ejecucion * 100) / $cantActPlan, 2
                                ) . '%';
                        $porcientoEjecucionEnTiempo = round(
                                        ($reporte->ejecucionentiempo * 100) / $cantActPlan, 2
                                ) . '%';
                        $porcientoEjecucionFueraTiempo = round(
                                        ($reporte->ejecucionfueratiempo * 100) / $cantActPlan, 2
                                ) . '%';
                        $porcientoEjecucionSinIniciar = round(
                                        ($reporte->sininiciar * 100) / $cantActPlan, 2
                                ) . '%';
                        $tablareport
                                .= "<table  cellspacing='0' class='Estilo1'
                                width='100%' border='1'>
                                    <tr>
                                        <td with = '30%'><div align='center'>
                                        <strong>Categor&iacute;a</strong></div></td>
                                        <td with = '30%'><div align='center' >
                                        <strong>Cantidad</strong></div></td>
                                        <td with = '30%'><div align='center' >
                                        <strong>% Plan</strong></div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        Actividades cumplidas</div></td>
                                        <td><div align='center' >$reporte->cumplidas</div></td>
                                        <td><div align='center' >$porcientoCumplida</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        Actividades incumplidas</div></td>
                                        <td><div align='center' >$reporte->incumplidas</div></td>
                                        <td><div align='center' >$porcientoIncumplida</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        Actividades en ejecuci&oacute;n </div></td>
                                        <td><div align='center' >$reporte->ejecucion</div></td>
                                        <td><div align='center' >$porcientoEjecucion</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        &nbsp;&nbsp;&nbsp;De ellas en tiempo</div></td>
                                        <td><div align='center' >$reporte->ejecucionentiempo</div></td>
                                        <td><div align='center' >$porcientoEjecucionEnTiempo</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        &nbsp;&nbsp;&nbsp;De ellas fuera de tiempo</div></td>
                                        <td><div align='center' >$reporte->ejecucionfueratiempo</div></td>
                                        <td><div align='center' >$porcientoEjecucionFueraTiempo</div></td>
                                    </tr>
                                    <tr>
                                        <td><div align='justify' >
                                        Actividades sin iniciar</div></td>
                                        <td><div align='center' >$reporte->sininiciar</div></td>
                                        <td><div align='center' >$porcientoEjecucionSinIniciar</div></td>
                                    </tr>
                                    ";
                        $tablareport .= "</table>";
                        $altohoja = $altohoja - 0.25;

                        break;
                    case 4: //

                        break;
                    case 5: //tabla 2
                        $lunes = date('d/m/Y', strtotime('last monday'));
                        $domingo = date(
                                'd/m/Y', strtotime('next sunday')
                        );
                        $tablareport
                                .= "<table width='100%' border='0' align='center' class='Estilo1'>
                              <tr>
                                <td><div align='justify' ><br><strong>Actividades incumplidas esta semana ($lunes - $domingo)</strong><br></div></td>
                              </tr>";
                        $tablareport .= "</table>";
                        $parametros->arrayActv = DatElementos::ObtenerActividadesReporte($datos);
                        $reporte = $this->datosReporteActividadesResumenPorMes(
                                $parametros
                        );
                        $listaActIncumplidasSemana = $this->crearFilasHTMLActIncumplidas(
                                $reporte->arrayActSemanaIncumplidas
                        );
                        $tablareport
                                .= "<table  cellspacing='0' class='Estilo1'
                                width='100%' border='1'>
                                    <tr>
                                        <td with = '70%'><div align='center'>
                                        <strong>Actividades</strong></div></td>
                                        <td with = '15%'><div align='center' >
                                        <strong>Fecha de inicio</strong></div></td>
                                        <td with = '15%'><div align='center' >
                                        <strong>Fecha fin</strong></div></td>
                                    </tr>
                                    $listaActIncumplidasSemana
                                    ";
                        $tablareport .= "</table>";
                        $altohoja = $altohoja - 0.25;
                        break;
                    case 7: //tabla 3
                        $mes = $datos->textomeses;
                        $tablareport
                                .= "<table width='100%' border='0' align='center' class='Estilo1'>
                              <tr>
                                <td><div align='justify' ><br><strong>Actividades incumplidas este mes ($mes)</strong><br></div></td>
                              </tr>";
                        $tablareport .= "</table>";
                        $parametros->arrayActv = DatElementos::ObtenerActividadesReporte($datos);
                        $reporte = $this->datosReporteActividadesResumenPorMes(
                                $parametros
                        );
                        $listaActIncumplidas = $this->crearFilasHTMLActIncumplidas(
                                $reporte->arrayActIncumplidas
                        );
                        $tablareport
                                .= "<table  cellspacing='0' class='Estilo1'
                                width='100%' border='1'>
                                    <tr>
                                        <td with = '70%'><div align='center'>
                                        <strong>Actividades</strong></div></td>
                                        <td with = '15%'><div align='center' >
                                        <strong>Fecha de inicio</strong></div></td>
                                        <td with = '15%'><div align='center' >
                                        <strong>Fecha fin</strong></div></td>
                                    </tr>
                                        $listaActIncumplidas

                                    ";
                        $tablareport .= "</table>";
                        $altohoja = $altohoja - 0.25;
                        break;
                }
            }
        }
        return $tablareport;
    }

    /* Funcion para el reporte Coordinacion */

    public function construirCoordinacion($datos) {
        $tablareport = "<table  cellspacing='0' class='Estilo1' width='100%' border='1'>";
        $tablareport
                .= "<tr>
            <td width='auto' valign='top'><p><strong>Meses</strong></p></td>";
        for ($i = 1; $i <= 31; $i++) {
            $tablareport
                    .= "
            <td width='auto' valign='top'><p><strong>$i</strong></p></td> ";
        }
        $tablareport
                .= "<td width='auto' valign='top'><p><strong>Observaci&oacute;n</strong></p></td>
          </tr> ";

        //Actividades de Enero
        $datos->fini = '01/01/' . $datos->ano;
        $datos->ffin = '31/01/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Enero');

        //Actividades de Febrero
        $datos->fini = '01/02/' . $datos->ano;
        $datos->ffin = '28/02/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Febrero');

        //Actividades de Marzo
        $datos->fini = '01/03/' . $datos->ano;
        $datos->ffin = '31/03/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Marzo');

        //Actividades de Abril
        $datos->fini = '01/04/' . $datos->ano;
        $datos->ffin = '30/04/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Abril');

        //Actividades de Mayo
        $datos->fini = '01/05/' . $datos->ano;
        $datos->ffin = '31/05/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Mayo');

        //Actividades de Junio
        $datos->fini = '01/06/' . $datos->ano;
        $datos->ffin = '30/06/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Junio');

        //Actividades de Julio
        $datos->fini = '01/07/' . $datos->ano;
        $datos->ffin = '31/07/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Julio');

        //Actividades de Agosto
        $datos->fini = '01/08/' . $datos->ano;
        $datos->ffin = '31/08/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Agosto');

        //Actividades de Septiembre
        $datos->fini = '01/09/' . $datos->ano;
        $datos->ffin = '30/09/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Septiembre');

        //Actividades de Octubre
        $datos->fini = '01/10/' . $datos->ano;
        $datos->ffin = '31/10/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Octubre');

        //Actividades de Noviembre
        $datos->fini = '01/11/' . $datos->ano;
        $datos->ffin = '30/11/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Noviembre');

        //Actividades de Diciembre
        $datos->fini = '01/12/' . $datos->ano;
        $datos->ffin = '31/12/' . $datos->ano;
        $tablareport
                .= self::llenarMesCoordinacion($datos, 'Diciembre');

        $tablareport .= " </table> ";

        return $tablareport;
    }

    /* Funcion para llenar cada mes del reporte Coordinacion */

    public function llenarMesCoordinacion($datos, $mes) {
        $tablareport = '';
        $acts = DatActividades::actsDadoMesReporte($datos);
        $rowspan = count($acts);
        $tablareport
                .= " <tr><td width='auto' rowspan='$rowspan' valign='top'><p>
            <strong>$mes</strong></p></td>";

        if (isset($acts[0])) {
            $tablareport
                    .= self::llenarCoordinacion($acts[0], $datos);
        } else {
            for ($i = 0; $i < 31; $i++) {
                $tablareport
                        .= "
                    <td width='auto' valign='top'><p>&nbsp;</p></td> ";
            }
        }
        $tablareport
                .= " <td width='auto' rowspan='$rowspan' valign='top'><p>&nbsp;</p></td>
          </tr>";

        for ($i = 1; $i < count($acts); $i++) {
            $tablareport .= "<tr>";
            $tablareport
                    .= self::llenarCoordinacion($acts[$i], $datos);
            $tablareport .= "</tr>";
        }
        return $tablareport;
    }

    /* Funcion para llenar fila x fila de cada mes del reporte Coordinacion */

    public function llenarCoordinacion($act, $datos) {
        $tablareport = '';
        $gestionarActs = new CmpgestionaractividadesModel();
        $primerosDias = $gestionarActs->dias_transcurridos(
                $act['fechainicio'], $datos->fini
        );
        $diasAct = $gestionarActs->dias_transcurridos(
                        $act['fechafin'], $act['fechainicio']
                ) + 1;
        $diasFinMes = $gestionarActs->dias_transcurridos(
                        $datos->ffin, $act['fechainicio']
                ) + 1;
        if ($diasAct > $diasFinMes) {
            $dias = $diasFinMes;
        } else {
            $dias = $diasAct;
        }
        $ultimosDias = $gestionarActs->dias_transcurridos(
                $datos->ffin, $act['fechafin']
        );
        if ($primerosDias > 0) {
            for ($i = 0; $i < $primerosDias; $i++) {
                $tablareport
                        .= "
                    <td width='auto' valign='top'><p>&nbsp;</p></td>  ";
            }
            $tablareport
                    .= "
            <td width='auto' colspan='{$dias}' valign='top' bgcolor='#FFFF99'>
            <p>{$act['denelemento']}</p></td> ";
            if ($ultimosDias > 0) {
                for ($i = 0; $i < $ultimosDias; $i++) {
                    $tablareport
                            .= "
                    <td width='auto' valign='top'><p>&nbsp;</p></td> ";
                }
            }
        } else {
            $diasAct = $gestionarActs->dias_transcurridos(
                            $act['fechafin'], $datos->fini
                    ) + 1;

            $diasFinMes = $gestionarActs->dias_transcurridos(
                            $datos->ffin, $datos->fini
                    ) + 1;
            if ($diasAct > $diasFinMes) {
                $dias = $diasFinMes;
            } else {
                $dias = $diasAct;
            }


            $tablareport
                    .= "
            <td width='auto' colspan='{$dias}' valign='top' bgcolor='#FFFF99'>
            <p>{$act['denelemento']}</p></td> ";
            if ($ultimosDias > 0) {
                for ($i = 0; $i < $ultimosDias; $i++) {
                    $tablareport
                            .= "
                    <td width='auto' valign='top'><p>&nbsp;</p></td> ";
                }
            }
        }
        return $tablareport;
    }

    //Fin Reportes
    public function OrganizarObjPorPadresEHijos($arrayobjetivosplan) {
        if (isset($arrayobjetivosplan[0])) {
            foreach ($arrayobjetivosplan as $key => $obj) {
                $arraypadres = DatElementosDatElementos::DameElementoPadreMismaEspecie(
                                $obj['idobjetivo']
                );
                if (isset($arraypadres[0])) {
                    $idpadre = $arraypadres[0]['idelementopadre'];
                    (!$this->buscarElemento($idpadre, $arrayobjetivosplan)) ?
                                    $idpadre = null : null;
                } else {
                    $idpadre = null;
                }
                $arrayobjetivosplan[$key]['idpadre'] = $idpadre;
            }
        }
        return $arrayobjetivosplan;
    }

    public function buscarElemento($idobj, $arrayobjetivosplan) {
        if (isset($arrayobjetivosplan[0])) {
            foreach ($arrayobjetivosplan as $key => $objetivosplan) {
                if ($objetivosplan['idelemento'] == $idobj || $objetivosplan['idobjetivo'] == $idobj
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    public function buscarElementoARC($idarcp, $arrayarcplan) {
        if (isset($arrayarcplan[0])) {
            foreach ($arrayarcplan as $key => $arc) {
                if ($arc['idarc'] == $idarcp) {
                    return true;
                }
            }
        }
        return false;
    }

    public function GenerarCuerpoReporteObjPlan(
    $cont, $obj, $arrayobjetivosplan, $tablareport, $idplan, $cadena, $idversionreporte, $datos
    ) {
        $num = $this->ConvertirEnterosARomanos($cont);
        if ($cadena != "") {
            $cadena = $cadena . '.' . $num;
        } else {
            $cadena = $num;
        }
        $colspan = 18;
        $tablareport = "<tr width='100%'>" .
                "<td class='Estilo1' align='justify' colspan='$colspan'  style='border-left:1px solid
                black;border-bottom:1px solid black;border-right:1px 
                solid black;'><b>" .
//                  $cadena . "- " .
                $obj['denelemento'] . "</b>";
        if ($obj['fechainicio'] && $obj['fechafin']) {

        }
        $tablareport .= "</tr>";
        $idobjetivo = $obj['idobjetivo'];
        if ($idobjetivo != 'objetivo') {
            $arrayactobj = DatElementos::ObtenerActividadesVinculadasObj(
                            $idobjetivo, $idplan, $datos
            );
            if (isset($arrayactobj[0])) {
                $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
                        $arrayactobj, $arrayactividadesorg
                );
                if (isset($arrayactividadesorg['padres'])) {
                    foreach (
                    $arrayactividadesorg['padres'] as $key => $actpadre
                    ) {
                        $key = $key + 1;
                        $respuesta = $this->CrearListaHtmlDeARCPlanActividades(
                                $key, $tablarep = '', $actpadre, $arrayactividadesorg, $idversionreporte, $datos
                        );
                        $tablareport .= $respuesta;
                    }
                }
            }
            $contador = 1;
            foreach ($arrayobjetivosplan as $actobj) {
                if ($actobj['idpadre'] == $obj['idobjetivo']) {
                    $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                            $contador, $actobj, $arrayobjetivosplan, $tablareport, $obj['idobjetivo'], $cadena, $idversionreporte, $datos
                    );
                    $contador++;
                }
            }
        } else {
            $arrayactplan = DatElementos::ObtenerActividadesVinculadasObj(
                            $idobjetivo, $idplan, $datos
            );
            if (isset($arrayactplan[0])) {
                $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
                        $arrayactplan, $arrayactividadesorg
                );
                if (isset($arrayactividadesorg['padres'])) {
                    foreach (
                    $arrayactividadesorg['padres'] as $key => $actpadre
                    ) {
                        $key = $key + 1;
                        $respuesta = $this->CrearListaHtmlDeARCPlanActividades(
                                $key, $tablarep = '', $actpadre, $arrayactividadesorg, $idversionreporte, $datos
                        );
                        $tablareport .= $respuesta;
                    }
                }
            }
        }
        return $tablareport;
    }

    public function OrganizarArcPorPadresEHijos($arrayarcplan) {
        if (isset($arrayarcplan[0])) {
            foreach ($arrayarcplan as $key => $arc) {
                if ($arc['idarc'] == $arc['idarcp']) {
                    $arrayarcplan[$key]['idarcp'] = null;
                } else {
                    (!$this->buscarElementoARC($arc['idarcp'], $arrayarcplan)) ?
                                    $arrayarcplan[$key]['idarcp'] = null : null;
                }
            }
        }
        return $arrayarcplan;
    }

    public function GenerarCuerpoReporteARCPlan(
    $cont, $arc, $arrayarcplan, $tablareport, $idplan, $cadena, $idversionreporte, $datos
    ) {
        $num = $this->ConvertirEnterosARomanos($cont);
        if ($cadena != "") {
            $cadena = $cadena . "." . $num;
        } else {
            $cadena = $num;
        }
        $colspan = 18;
        $tablareport = "<tr >" .
                "<td class='Estilo1' align='justify' colspan='$colspan' style='border-left:1px
                solid black;border-right:1px solid black;border-bottom:1px solid black;'><b>"
//                . $cadena . "- "
                   . $arc['denarc'] . "<b></td>" . "</tr>";
        $arrayactarcplan = DatElementos::ObtenerActividadesVinculadasARCPlan(
                        $idplan, $arc['idarc'], $datos
        );
        if (isset($arrayactarcplan[0])) {
            $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
                    $arrayactarcplan, $arrayactividadesorg
            );
            if (isset($arrayactividadesorg['padres'])) {
                foreach ($arrayactividadesorg['padres'] as $key => $actpadre) {
                    $key = $key + 1;
                    $respuesta = $this->CrearListaHtmlDeARCPlanActividades(
                            $key, $tablarep = '', $actpadre, $arrayactividadesorg, $idversionreporte, $datos
                    );
                    $tablareport .= $respuesta;
                }
            }
        }
        $contador = 1;
        foreach ($arrayarcplan as $arcplan) {
            if ($arcplan['idarcp'] == $arc['idarc']) {
                $tablareport .= $this->GenerarCuerpoReporteARCPlan(
                        $contador, $arcplan, $arrayarcplan, $tablareport, $idplan, $cadena, $idversionreporte, $datos
                );
                $contador++;
            }
        }
        return $tablareport;
    }

    public function GenerarCuerpoReportePlanARCObjAct(
    $cont, $arc, $arrayarcplan, $tablareport, $idplan, $cadena, $idversionreporte, $datos
    ) {
        $colspan = 18;
        $tablareport = "<tr>" .
                "<td class='Estilo1' colspan='$colspan' style='border-left:1px solid
                black;border-right:1px solid black;border-bottom:1px 
                solid black;'> <b>" .
//               $cadena . "- " .
                    $arc['denarc']
                . "</td> </b>"
                . "</tr>";
        if ($arc['idarc'] != 'arc') {
            //---***Busco si tiene objetivos hijos***---//
            $arrayobjetivosarc = DatArcDatPlanObjetivo::ObtenerRelacionesDadoPlanARC(
                            $idplan, $arc['idarc']
            );
            if (isset($arrayobjetivosarc[0])) {
                $arrayobjetivosarcc = $this->OrganizarObjPorPadresEHijos(
                        $arrayobjetivosarc
                );
                $conta = 0;
                foreach ($arrayobjetivosarcc as $key => $obj) {
                    if ($obj['idpadre'] == null) {
                        $tablareport .= $this->GenerarCuerpoReporteARCObjetivo(
                                $conta, $obj, $arrayobjetivosarcc, $tablareport, $idplan, '', $idversionreporte, $datos
                        );
                    }
                    $conta++;
                }
            }
            //---***Busco si tiene actividades hijas***---
            $arrayactHijas = DatArcDatPlanActividades::getArcPlanAct(
                            $datos->idplan, $arc['idarc']
            );
            if (isset($arrayactHijas[0])) {
                $arrayactHijasA = $this->OrganizarArrayPorPadresEHijos(
                        $arrayactHijas, $arrayactHijasA
                );
                if (isset($arrayactHijasA['padres'])) {
                    foreach ($arrayactHijasA['padres'] as $key => $actpadre) {
                        $key = $key + 1;
                        $respuesta = $this->CrearListaHtmlDeARCPlanActividades(
                                $key, $tablarep = '', $actpadre, $arrayactHijasA, $idversionreporte, $datos
                        );
                        $tablareport .= $respuesta;
                    }
                }
            }
            //---***Busco si tiene arc hijas***---
//            $arrayarcHijas = DatArcDatPlan::getArcHijasPorPlanes(
//                            $datos->idplan, $arc['idarc']
//            );
//            if (isset($arrayarcHijas[0])) {
//                $contHija = 1;
//                foreach ($arrayarcHijas as $arc) {
//                    $tablareport .= $this->GenerarCuerpoReportePlanARCObjAct(
//                            $contHija, $arc, $arrayarcHijas, $tablareport, $datos->idplan, $cadena, $datos->idversionreporte, $datos
//                    );
//                    $contHija++;
//                }
//            }
        }
        return $tablareport;
    }

    public function GenerarCuerpoReporteARCObjetivo(
    $cont, $obj, $arrayobjetivosplan, $tablareport, $idplan, $cadena, $idversionreporte, $datos
    ) {
        $cadena = $this->ConvertirEnterosALetras($cont);
        $colspan = 18;
        $tablareport = "<tr>" .
                "<td class='Estilo1' colspan='$colspan' style='border-bottom:1px
                solid black; border-left:1px solid black;border-right:1px 
                solid black;'>"
                . $cadena . "- " . $obj['denelemento'] . "</tr>";
        $idobjetivo = $obj['idobjetivo'];
        $arrayactobj = DatElementos::ObtenerActividadesVinculadasObj(
                        $idobjetivo, $idplan, $datos
        );
        if (isset($arrayactobj[0])) {
            $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
                    $arrayactobj, $arrayactividadesorg
            );
            if (isset($arrayactividadesorg['padres'])) {
                foreach ($arrayactividadesorg['padres'] as $key => $actpadre) {
                    $key = $key + 1;
                    $respuesta = $this->CrearListaHtmlDeARCPlanActividades(
                            $key, $tablarep = '', $actpadre, $arrayactividadesorg, $idversionreporte, $datos
                    );
                    $tablareport .= $respuesta;
                }
            }
        }
        $contador = 1;
        foreach ($arrayobjetivosplan as $actobj) {
            if ($actobj['idpadre'] == $obj['idobjetivo']) {
                $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                        $contador, $actobj, $arrayobjetivosplan, $tablareport, $obj['idobjetivo'], $cadena, $idversionreporte, $datos
                );
                $contador++;
            }
        }
        return $tablareport;
    }

    public function CrearListaHtmlDeARCPlanActividades(
    $cadenacontador, $tablareport, $actpadre, $arrayactividadesorg, $idversionreporte, $datos
    ) {
        //print_r($arrayactividadesorg);die;
        $tablareport = $this->GenerarCuerpoReporteARCPlanActividades(
                $actpadre, $cadenacontador, $idversionreporte, $datos
        );

        if (isset($arrayactividadesorg['hijos'])) {
            $cont = 1;
            foreach ($arrayactividadesorg['hijos'] as $hijo) {
                foreach ($hijo['idpadres'] as $idpadre) {
                    if ($idpadre == $actpadre['idelemento']) {
                        $cadenad = $cadenacontador;
                        $cadenad = $cadenad . '.' . $cont;
                        $cont++;
                        $tablareport .= $this->CrearListaHtmlDeARCPlanActividades(
                                $cadenad, $tablareport, $hijo, $arrayactividadesorg, $idversionreporte, $datos
                        );
                    }
                }
            }
        }
        return $tablareport;
    }

    public function CrearArrayRepeticiones($actpadre) {
        $coinciden = 0;
        $fechainicio = $actpadre['fechainicio'];
        $fechafin = $actpadre['fechafin'];
        $arrfechainicio = explode('/', $fechainicio);
        $arrfechafin = explode('/', $fechafin);
        if (($arrfechainicio[0] . $arrfechainicio[1] . $arrfechainicio[2]) * 1 == ($arrfechafin[0] .
                $arrfechafin[1] . $arrfechafin[2]) * 1
        ) {
            $coinciden = 1;
        }
        $mesinicio = $arrfechainicio[1];
        if (($arrfechainicio[1] * 1) < 10) {
            $result = explode('0', $mesinicio);
            if ($result[0]) {
                $mesinic = $result[0];
            } else {
                $mesinic = $result[1];
            }
        } else {
            $mesinic = $mesinicio;
        }
        $fechasinicio[1] = $fechasinicio[2] = $fechasinicio[3] = $fechasinicio[4] = $fechasinicio[5] = $fechasinicio[6] = $fechasinicio[7] = $fechasinicio[8] = $fechasinicio[9] = $fechasinicio[10] = $fechasinicio[11] = $fechasinicio[12] = '';
        $fechasinicio[$mesinic] = $arrfechainicio[0];
        $fechasfin[1] = $fechasfin[2] = $fechasfin[3] = $fechasfin[4] = $fechasfin[5] = $fechasfin[6] = $fechasfin[7] = $fechasfin[8] = $fechasfin[9] = $fechasfin[10] = $fechasfin[11] = $fechasfin[12] = '';
        if ($coinciden == 0) {
            $mesfinn = $arrfechafin[1];
            if (($arrfechafin[1] * 1) < 10) {
                $resulta = explode('0', $mesfinn);
                if ($resulta[0]) {
                    $mesfin = $resulta[0];
                } else {
                    $mesfin = $resulta[1];
                }
            } else {
                $mesfin = $mesfinn;
            }
            $fechasfin[$mesfin] = ' al ' . $arrfechafin[0];
            if ($arrfechainicio[1] != $arrfechafin[1]) {
                $j = $mesfin - 1;
                while ($j >= 1) {
                    if ($j >= $mesinic) {
                        $fechasfin[$j] = '-';
                    }
                    $j--;
                }
            }
        }
        $arrayfechas['fechasinicio'] = $fechasinicio;
        $arrayfechas['fechasfin'] = $fechasfin;
        return $arrayfechas;
    }

    public function GenerarCuerpoReporteARCPlanActividades(
    $actpadre, $cadenacontador, $idversionreporte, $datos
    ) {
        $tienerepeticiones = DatElementosDatElementos::EsPadredeActividad(
                        $actpadre['idelemento'], $origen = 4, $datos
        );
      $conobservaciones=true;
      switch ($datos->versionadoSelecionado){
        case 19:
          $conobservaciones=false;
          break;

      }

        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $key => $repeticion) {
                $objacthija = Doctrine::getTable('DatActividades')->find(
                        $repeticion['idelementohijo']
                );
                $act['fechainicio'] = $objacthija->fechainicio;
                $act['fechafin'] = $objacthija->fechafin;
                $arrayfechasrepeticiones[] = $this->CrearArrayRepeticiones(
                        $act
                );
            }
        }
        $arrayfechas = $this->CrearArrayRepeticiones($actpadre);
        $fechasinicio = $arrayfechas['fechasinicio'];
        $fechasfin = $arrayfechas['fechasfin'];
        $tablareport
                .= "<tr><td class='Estilo1' width='5%' style='border-bottom:1px
                solid black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='left'>&nbsp;" . $cadenacontador
                . "</div>" .
                "</td>"
                . "<td class='Estilo1' width='5%' style='border-bottom:1px 
                solid black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='left'>&nbsp;" . substr(
                        $actpadre['idelemento'], 5
                ) .
                "</div>" . "</td>"
                . "<td class='Estilo1' width='{$datos->widthActividad}' 
                style='border-bottom:1px solid black;border-left:1px 
                solid black;'>"
                .
                "<div align='justify'>" . "&nbsp;" . $actpadre['denelemento']
                . "</div>" . "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px 
                solid black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'></div>"
        ;


      $valoesfechasxmes1="".$fechasinicio[1] . $fechasfin[1] ;

        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][1]!="" || $arrayfechainicioFin['fechasfin'][1]!=""){
                $valoesfechasxmes1 .= ($valoesfechasxmes1=="")?$arrayfechainicioFin['fechasinicio'][1] . $arrayfechainicioFin['fechasfin'][1]:
                  ",".$arrayfechainicioFin['fechasinicio'][1] . $arrayfechainicioFin['fechasfin'][1]  ;
              }
            }
        }
   //     print_r($valoesfechasxmes1);die;
      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes1 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px
                solid black;border-left:1px solid black;'>"
                .
                " <div class='Estilo1' align='center'></div>";

      $valoesfechasxmes2=$fechasinicio[2] . $fechasfin[2] ;

        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][2]!="" || $arrayfechainicioFin['fechasfin'][2]!=""){
                $valoesfechasxmes2 .= ($valoesfechasxmes2=="")?$arrayfechainicioFin['fechasinicio'][2] . $arrayfechainicioFin['fechasfin'][2]:
                  ",".$arrayfechainicioFin['fechasinicio'][2] . $arrayfechainicioFin['fechasfin'][2]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes2 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px
                solid black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>" .
                "</div>";

      $valoesfechasxmes3=$fechasinicio[3] . $fechasfin[3] ;
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][3]!="" || $arrayfechainicioFin['fechasfin'][3]!=""){
                $valoesfechasxmes3 .= ($valoesfechasxmes3=="")?$arrayfechainicioFin['fechasinicio'][3] . $arrayfechainicioFin['fechasfin'][3]:
                  ",".$arrayfechainicioFin['fechasinicio'][3] . $arrayfechainicioFin['fechasfin'][3]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes3 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px
                solid black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>"  .
                "</div>";

      $valoesfechasxmes4=$fechasinicio[4] . $fechasfin[4] ;
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][4]!="" || $arrayfechainicioFin['fechasfin'][4]!=""){
                $valoesfechasxmes4 .= ($valoesfechasxmes4=="")?$arrayfechainicioFin['fechasinicio'][4] . $arrayfechainicioFin['fechasfin'][4]:
                  ",".$arrayfechainicioFin['fechasinicio'][4] . $arrayfechainicioFin['fechasfin'][4]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes4 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px
                solid black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>" .
                "</div>";


      $valoesfechasxmes5=$fechasinicio[5] . $fechasfin[5] ;

        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][5]!="" || $arrayfechainicioFin['fechasfin'][5]!=""){
                $valoesfechasxmes5 .= ($valoesfechasxmes5=="")?$arrayfechainicioFin['fechasinicio'][5] . $arrayfechainicioFin['fechasfin'][5]:
                  ",".$arrayfechainicioFin['fechasinicio'][5] . $arrayfechainicioFin['fechasfin'][5]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes5 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px solid
                black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>" .
                "</div>";

      $valoesfechasxmes6=$fechasinicio[6] . $fechasfin[6] ;
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][6]!="" || $arrayfechainicioFin['fechasfin'][6]!=""){
                $valoesfechasxmes6 .= ($valoesfechasxmes6=="")?$arrayfechainicioFin['fechasinicio'][6] . $arrayfechainicioFin['fechasfin'][6]:
                  ",".$arrayfechainicioFin['fechasinicio'][6] . $arrayfechainicioFin['fechasfin'][6]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes6 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px solid
                black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>" .
                "</div>";

      $valoesfechasxmes7=$fechasinicio[7] . $fechasfin[7] ;

        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][7]!="" || $arrayfechainicioFin['fechasfin'][7]!=""){
                $valoesfechasxmes7 .= ($valoesfechasxmes7=="")?$arrayfechainicioFin['fechasinicio'][7] . $arrayfechainicioFin['fechasfin'][7]:
                  ",".$arrayfechainicioFin['fechasinicio'][7] . $arrayfechainicioFin['fechasfin'][7]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes7 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px solid
                black; border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>" .
                "</div>";

      $valoesfechasxmes8=$fechasinicio[8] . $fechasfin[8] ;

        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][8]!="" || $arrayfechainicioFin['fechasfin'][8]!=""){
                $valoesfechasxmes8 .= ($valoesfechasxmes8=="")?$arrayfechainicioFin['fechasinicio'][8] . $arrayfechainicioFin['fechasfin'][8]:
                  ",".$arrayfechainicioFin['fechasinicio'][8] . $arrayfechainicioFin['fechasfin'][8]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes8 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px solid
                black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>" .
                "</div>";


      $valoesfechasxmes9=$fechasinicio[9] . $fechasfin[9] ;

        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][9]!="" || $arrayfechainicioFin['fechasfin'][9]!=""){
                $valoesfechasxmes9 .= ($valoesfechasxmes9=="")?$arrayfechainicioFin['fechasinicio'][9] . $arrayfechainicioFin['fechasfin'][9]:
                  ",".$arrayfechainicioFin['fechasinicio'][9] . $arrayfechainicioFin['fechasfin'][9]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes9 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px solid
                black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>" .
                "</div>";

      $valoesfechasxmes10=$fechasinicio[10] . $fechasfin[10] ;

        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][10]!="" || $arrayfechainicioFin['fechasfin'][10]!=""){
                $valoesfechasxmes10 .= ($valoesfechasxmes10=="")?$arrayfechainicioFin['fechasinicio'][10] . $arrayfechainicioFin['fechasfin'][10]:
                  ",".$arrayfechainicioFin['fechasinicio'][10] . $arrayfechainicioFin['fechasfin'][10]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes10 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px solid
                black;border-left:1px solid black;'>"
                .
                "<div class='Estilo1' align='center'>" .
                "</div>";

      $valoesfechasxmes11=$fechasinicio[11] . $fechasfin[11] ;

        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][11]!="" || $arrayfechainicioFin['fechasfin'][11]!=""){
                $valoesfechasxmes11 .= ($valoesfechasxmes11=="")?$arrayfechainicioFin['fechasinicio'][11] . $arrayfechainicioFin['fechasfin'][11]:
                  ",".$arrayfechainicioFin['fechasinicio'][11] . $arrayfechainicioFin['fechasfin'][11]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes11 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='3%' style='border-bottom:1px solid
                black;border-left:1px solid black;'>"
                .
                " <div class='Estilo1' align='center'>" .  
                "</div>";

      $valoesfechasxmes12=$fechasinicio[12] . $fechasfin[12] ;
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
              if($arrayfechainicioFin['fechasinicio'][12]!="" || $arrayfechainicioFin['fechasfin'][12]!=""){
                $valoesfechasxmes12 .= ($valoesfechasxmes12=="")?$arrayfechainicioFin['fechasinicio'][12] . $arrayfechainicioFin['fechasfin'][12]:
                  ",".$arrayfechainicioFin['fechasinicio'][12] . $arrayfechainicioFin['fechasfin'][12]  ;
              }
            }
        }

      $tablareport .= "<div class='Estilo1' align='center'>"
        . $valoesfechasxmes12 . "</div>";

        $tablareport .= "</td>" .
                "<td class='Estilo1' width='13%' style='border-bottom:1px solid 
                black;border-left:1px solid black;'>";
        if ($actpadre['dirigentes'] == null || $actpadre['dirigentes'] == "") {
            $actpadre['dirigentes'] = "";
        }
        $tablareport .= "<div class='Estilo1' align='center'>" . strip_tags(
                        $actpadre['dirigentes']
                ) .
                "</div>";
       // print_r($actpadre);die;
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objacthija = Doctrine::getTable('DatElementos')->find(
                        $repeticion['idelementohijo']
                );
                $dirigente = $objacthija->dirigente;
                if ($dirigente == null || $dirigente == "") {
                    $dirigente = "";
                }
                if ($actpadre['dirigentes'] != $dirigente) {
                    $tablareport
                            .= "<div class='Estilo1' align='center'>" . strip_tags(
                                    $dirigente
                            ) .
                            "</div>";
                }
            }
        }
        $tablareport .= "</td>" .
                "<td class='Estilo1' width='14%' style='border-bottom:1px solid 
                black;border-left:1px solid black;border-right:1px 
                solid black;'>";
        if ($actpadre['participantes'] == null || $actpadre['participantes'] == ""
        ) {
            $actpadre['participantes'] = "";
        }
        $tablareport .= "<div class='Estilo1' align='center'>" . strip_tags(
                        $actpadre['participantes']
                ) .
                "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objacthija = Doctrine::getTable('DatElementos')->find(
                        $repeticion['idelementohijo']
                );
                $participante = $objacthija->participante;
                if ($participante == null || $participante == "") {
                    $participante = "";
                }
                if ($participante != $actpadre['participantes']) {
                    $tablareport
                            .= "<div class='Estilo1' align='center'>" . strip_tags(
                                    $participante
                            ) .
                            "</div>";
                }
            }
        }
        $tablareport .= "</td>";
        if ($datos->coninvolucrados == 1) {
            $tablareport
                    .= "<td class='Estilo1' width='14%'
                style='border-bottom:1px solid black;border-right:1px 
                solid black;'>";
            $involucrados_padre = $this->ObtenerCadenaInvolucrados(
                    $actpadre['idelemento']
            );
            $tablareport
                    .= "<div class='Estilo1' align='center'>" . $involucrados_padre .
                    "</div>";
            if (isset($tienerepeticiones[0])) {
                foreach ($tienerepeticiones as $repeticion) {
                    $involucrados = $this->ObtenerCadenaInvolucrados(
                            $repeticion['idelementohijo']
                    );
                    if($involucrados_padre!=$involucrados){
                      $tablareport
                        .= "<div class='Estilo1' align='center'>"
                        . $involucrados .
                        "</div>";
                    }
                }
            }
            $tablareport .= "</td>";
        }else{
          if($conobservaciones){
            $tablareport
                                .= "<td class='Estilo1' width='14%'
                style='border-bottom:1px solid black;border-right:1px 
                solid black;'>";
            $arrayobservaciones = DatElementos::ObtenerObservacionesActividadesVinculadasObj(
              $actpadre['idelemento']
            );
            $observaciones="";
            foreach ($arrayobservaciones as $key => $obs) {
              if($key>0){
                $observaciones.="<br>".($key+1)."-".str_replace('&nbsp;', '', $obs['cuerpo']);
              }else{
                $observaciones.=($key+1)."-".str_replace('&nbsp;', '', $obs['cuerpo']);
              }
            }
            $tablareport
              .= "<div class='Estilo1'>" . $observaciones .
              "</div>";
            if (isset($tienerepeticiones[0])) {
              foreach ($tienerepeticiones as $repeticion) {
                $arrayobservaciones = DatElementos::ObtenerObservacionesActividadesVinculadasObj(
                  $repeticion['idelementohijo']
                );
                $observaciones="";
                foreach ($arrayobservaciones as $key => $obs) {
                  if($key>0){
                    $observaciones.="\\n".($key+1)."-".str_replace('&nbsp;', '', $obs['cuerpo']);
                  }else{
                    $observaciones.=($key+1)."-".str_replace('&nbsp;', '', $obs['cuerpo']);
                  }
                }
                $tablareport
                  .= "<div class='Estilo1'>"
                  . $observaciones .
                  "</div>";
              }
            }
            $tablareport .= "</td>";
          }

        }

        $tablareport .= "</tr>";
        return $tablareport;
    }

    public function ConvertirEnterosARomanos($num) {
        if ($num < 0 || $num > 9999) {
            return -1;
        }
        $rOnes = array(
            1 => "I",
            2 => "II",
            3 => "III",
            4 => "IV",
            5 => "V",
            6 => "VI",
            7 => "VII",
            8 => "VIII",
            9 => "IX");
        $rTens = array(
            1 => "X",
            2 => "XX",
            3 => "XXX",
            4 => "XL",
            5 => "L",
            6 => "LX",
            7 => "LXX",
            8 => "LXXX",
            9 => "XC");
        $rHund = array(
            1 => "C",
            2 => "CC",
            3 => "CCC",
            4 => "CD",
            5 => "D",
            6 => "DC",
            7 => "DCC",
            8 => "DCCC",
            9 => "CM");
        $rThou = array(
            1 => "M",
            2 => "MM",
            3 => "MMM",
            4 => "MMMM",
            5 => "MMMMM",
            6 => "MMMMMM",
            7 => "MMMMMMM",
            8 => "MMMMMMMM",
            9 => "MMMMMMMMM");
        $ones = $num % 10;
        $tens = ($num - $ones) % 100;
        $hundreds = ($num - $tens - $ones) % 1000;
        $thou = ($num - $hundreds - $tens - $ones) % 10000;
        $tens = $tens / 10;
        $hundreds = $hundreds / 100;
        $thou = $thou / 1000;
        if ($thou) {
            $rnum .= $rThou[$thou];
        }
        if ($hundreds) {
            $rnum .= $rHund[$hundreds];
        }
        if ($tens) {
            $rnum .= $rTens[$tens];
        }
        if ($ones) {
            $rnum .= $rOnes[$ones];
        }
        return $rnum;
    }

    public function ConvertirEnterosALetras($num) {
        $arrayasig = array(
            1 => 'a',
            2 => "b",
            3 => "c",
            4 => "d",
            5 => "e",
            6 => "f",
            7 => "g",
            8 => "h",
            9 => "i",
            10 => "j",
            11 => "k",
            12 => "l",
            13 => "m",
            14 => "n",
            15 => "o",
            16 => "p",
            17 => "q",
            18 => "r",
            18 => "s",
            20 => "t",
            21 => "u",
            22 => "v",
            23 => "ww",
            24 => "x",
            25 => "y",
            26 => 'z');
        return $arrayasig[$num];
    }

    public function OrganizarArrayPorPadresEHijos(
    $arrayactividades, $arrayactividadesorg
    ) {
        if (isset($arrayactividades[0])) {
            foreach ($arrayactividades as $actividad) {
                $tienepadenarray = 0;
                $tieneactpadre = DatElementosDatElementos::EsElementoHijo(
                                $actividad['idelemento']
                );
                if (isset($tieneactpadre[0])) {
                    foreach ($tieneactpadre as $padre) {
                        foreach ($arrayactividades as $actividadp) {
                            if ($padre['idelementopadre'] == $actividadp['idelemento']
                            ) {
                                $tienepadenarray = 1;
                                $actividad['idpadres'][] = $actividadp['idelemento'];
                            }
                        }
                    }
                }
                if ($tienepadenarray == 0) {
                    $arrayactividadesorg['padres'][] = $actividad;
                }
                if ($tienepadenarray == 1) {
                    $arrayactividadesorg['hijos'][] = $actividad;
                }
            }
        }
        return $arrayactividadesorg;
    }

    public function CrearListaHtmlDeActividades(
    $cadenacontador, $tablareport, $actpadre, $arrayactividadesorg, $datos, $contadorhojas
    ) {
        if ($datos->versionadoSelecionado == 31) {
            $tablareport = $this->GenerarCuerpoListaTodosLosCampos(
                    $actpadre, $cadenacontador, $datos, $contadorhojas
            );
        } else {
            $tablareport = $this->GenerarCuerpoLista(
                    $actpadre, $cadenacontador, $datos, $contadorhojas
            );
        }
        if (isset($arrayactividadesorg['hijos'])) {
            $cont = 1;
            foreach ($arrayactividadesorg['hijos'] as $hijo) {
                foreach ($hijo['idpadres'] as $idpadre) {
                    if ($idpadre == $actpadre['idelemento'] && $actpadre['pintado']==0) {
                        $actpadre['pintado'] = 1;
                        $cadenad = $cadenacontador;
                        $cadenad = $cadenad . '.' . $cont;
                        $cont++;
                        $tablareport .= $this->CrearListaHtmlDeActividades(
                                $cadenad, $tablareport, $hijo, $arrayactividadesorg, $datos, $contadorhojas
                        );
                    }
                }
            }
        }
        return $tablareport;
    }

    /***********
            Probando las repeticiones....
     *************/
    public function infoRepeticionesActividad($idrepeticiones){
      if($idrepeticiones==null)
        return array();
      $cant_repetiones = explode(',', trim($idrepeticiones));
      $array_repeticiones=array();
      $pos=0;
      foreach ($cant_repetiones as $value){
        $array_repeticiones[$pos++]=$value;
      }
      return $array_repeticiones;
    }

    public function GenerarCuerpoLista(
    $actividad, $cadenacontador, $datos, $contadorhojas
    ) {

        $tienerepeticiones = DatElementosDatElementos::EsPadredeActividad(
                        $actividad['idelemento'], $origen = 4, $datos
        );

        $totalrep = count($tienerepeticiones) + 1;
        $fechasiguales = 0;
        if ($actividad['fechainicio'] == $actividad['fechafin']) {
            $fechasiguales = 1;
        }
        $columnaInvolucrados = "";
        if ($datos->coninvolucrados == 1) {
            $arrayInvolucrados = $this->ObtenerCadenaInvolucrados(
                    $actividad['idelemento']
            );
            $columnaInvolucrados = "<td align='center' style='overflow : hidden; " . $estiloborderbotom .
                    "'>&nbsp;" . $arrayInvolucrados . "</td>";
        }
        $texto = strip_tags($actividad['participantes']);
        $texto = eregi_replace("<style[^>]*>.*</style>", " ", $texto);
        $texto = eregi_replace("<[^>]*>", " ", $texto);
        $texto = eregi_replace("&nbsp;", "", $texto);

        $style_suspendida_start=($actividad['suspendida']==0)?"":" <span STYLE=' align:center;  text-decoration:line-through; 
                            text-decoration-color: red;'> ";

        $style_suspendida_end=($actividad['suspendida']==0)?"":"</span>";

        if ($datos->versionadoSelecionado == 30) {
            $cuerporeporte
                    .= "<tr>
                            <td style='" . $estiloborderbotom
                    . "' rowspan='{$totalrep}' align = 'center'>" .
                    $cadenacontador . "</td>
                            <td style='" . $estiloborderbotom
                    . "' rowspan='{$totalrep}'  align = 'justify'>"
                  . $style_suspendida_start .   $actividad['denelemento']
              . ' (' . $actividad['horainicio'] . (($actividad['lugar'] != "") ? ' en ' . $actividad['lugar'] : "") . ")"
              .$style_suspendida_end."</td>";
            $cuerporeporte .= "<td style='" . $estiloborderbotom .
                    "' align = 'center'>"
                  . $style_suspendida_start  . $actividad['fechainicio'];
            if (!$fechasiguales) {
                $cuerporeporte .= "</br>hasta el</br>"
                        . $actividad['fechafin'];
            }
            $cuerporeporte .= $style_suspendida_end."</td>
                            <td align='justify' style='" . $estiloborderbotom . "' >" .
                    $style_suspendida_start. strip_tags($actividad['dirigentes']) . $style_suspendida_end ."</td>
                            <td style='" . $estiloborderbotom . "'>&nbsp;"
                    . $texto .
                    "</td></tr>";
            if (isset($tienerepeticiones[0])) {
                $totalrep = count($tienerepeticiones);
                foreach ($tienerepeticiones as $key => $repeticion) {
                    $estiloborderbotomrep = 'border-right:1px solid black;';
                    if ($key < ($totalrep - 1)) {
                        $estiloborderbotomrep = 'border-bottom:1px solid black;border-right:1px 
                            solid black;';
                    }
                    $objacthija = Doctrine::getTable('DatActividades')->find(
                            $repeticion['idelementohijo']
                    );

                  $style_suspendida_start=($objacthija->suspendida==0)?"":" <span STYLE='align:center; text-decoration:line-through; 
                            text-decoration-color: red;'> ";

                  $style_suspendida_end=($objacthija->suspendida==0)?"":"</span>";

                    $fechasrepetiguales = 0;
                    if ($objacthija->fechainicio == $objacthija->fechafin) {
                        $fechasrepetiguales = 1;
                    }
                    $fechiniciohija = split('/', $objacthija->fechainicio);
                    $fechfinhija = split('/', $objacthija->fechafin);
                    $cuerporeporte
                            .= "<td align='center' style='" . $estiloborderbotom . "' >".
                      $style_suspendida_start. $fechiniciohija[0] .
                            '/' . $fechiniciohija[1] . '/' . $fechiniciohija[2];
                    if (!$fechasrepetiguales) {
                        $cuerporeporte
                                .= "</br>hasta el</br>" . $fechfinhija[0] . '/'
                                . $fechfinhija[1] .
                                '/' . $fechfinhija[2];
                    }
                    $cuerporeporte .= $style_suspendida_end."</td><td align='justify' style='" . $estiloborderbotom .
                            "'>" . $style_suspendida_start .strip_tags($actividad['dirigentes']) .$style_suspendida_end. "</td>
                                            <td style='" . $estiloborderbotom .
                            "'>&nbsp;" . $style_suspendida_start .$texto . $style_suspendida_end ."</td></tr>";
                }
            }
        } else {

          $style_suspendida_start=($actividad['suspendida']==0)?"":" 
                  <span STYLE='align:center; text-decoration:line-through; 
                            text-decoration-color: red;'> ";

          $style_suspendida_end=($actividad['suspendida']==0)?"":"</span>";


          $column_car="<td style='" . $estiloborderbotom
            . "' rowspan='{$totalrep}' align = 'center'>" .
            $style_suspendida_start. substr($actividad['idelemento'], 5) . $style_suspendida_end ."</td>";

          if ($datos->versionadoSelecionado == 40) {
                $column_car="";
                }

            $cuerporeporte
                    .= "<tr>
                            <td style='" . $estiloborderbotom
                    . "' rowspan='{$totalrep}' align = 'center'>" .
                    $cadenacontador . "</td>
                            
                         ".$column_car."
                            
                            <td style='" . $estiloborderbotom
                    . "' rowspan='{$totalrep}'  align = 'justify'>"
                   . $style_suspendida_start . $actividad['denelemento'] . $style_suspendida_end ."</td>";

            $cuerporeporte .= "<td style='" . $estiloborderbotom .
                    "' align = 'center'>".
                   $style_suspendida_start.  $actividad['fechainicio'];
            if (!$fechasiguales) {
                $cuerporeporte .= "</br>hasta el</br>"
                        . $actividad['fechafin'];
            }
            $cuerporeporte .= $style_suspendida_end. "</td><td style='" . $estiloborderbotom .
                    "' align = 'center'>". $style_suspendida_start . str_replace(
                            "", "", $actividad['horainicio']
                    ) . '-'
                    . str_replace("", "", $actividad['horafin']) . $style_suspendida_end.
                    "</td>
                            <td align='center' style='" . $estiloborderbotom . "' >"
                   . $style_suspendida_start . $actividad['lugar'] .$style_suspendida_end.
                    "</td>
                            <td align='justify' style='" . $estiloborderbotom . "' >" .
                     $style_suspendida_start .strip_tags($actividad['dirigentes']) . $style_suspendida_end."</td>
                            <td style='" . $estiloborderbotom . "'>"
                    .$style_suspendida_start. $texto .$style_suspendida_end.
                    "</td>" . $columnaInvolucrados . "
                        </tr>";
            if (isset($tienerepeticiones[0])) {
                $totalrep = count($tienerepeticiones);
                foreach ($tienerepeticiones as $key => $repeticion) {
                    $estiloborderbotomrep = 'border-right:1px solid black;';
                    if ($key < ($totalrep - 1)) {
                        $estiloborderbotomrep = 'border-bottom:1px solid black;border-right:1px 
                            solid black;';
                    }
                    $objacthija = Doctrine::getTable('DatActividades')->find(
                            $repeticion['idelementohijo']
                    );

                  $columnaInvolucrados = "";
                  if ($datos->coninvolucrados == 1) {
                    $arrayInvolucrados = $this->ObtenerCadenaInvolucrados(
                      $objacthija->idactividad
                    );
                    $columnaInvolucrados = "<td align='center' style='overflow : hidden; " . $estiloborderbotom .
                      "'>&nbsp;" . $arrayInvolucrados . "</td>";
                  }


                  $style_suspendida_start=($objacthija->suspendida==0)?"":" <span STYLE='align:center; text-decoration:line-through; 
                            text-decoration-color: red;'> ";

                  $style_suspendida_end=($objacthija->suspendida==0)?"":"</span>";

                    $fechasrepetiguales = 0;
                    if ($objacthija->fechainicio == $objacthija->fechafin) {
                        $fechasrepetiguales = 1;
                    }
                    $fechiniciohija = split('/', $objacthija->fechainicio);
                    $fechfinhija = split('/', $objacthija->fechafin);
                    $cuerporeporte
                            .= "<td align='center' style='" . $estiloborderbotom . "' >".
                            $style_suspendida_start. $fechiniciohija[0] .
                            '/' . $fechiniciohija[1] . '/' . $fechiniciohija[2];
                    if (!$fechasrepetiguales) {
                        $cuerporeporte
                                .= "</br>hasta el</br>" . $fechfinhija[0] . '/'
                                . $fechfinhija[1] .
                                '/' . $fechfinhija[2];
                    }
                    $cuerporeporte .= $style_suspendida_end."</td><td style='" . $estiloborderbotom .
                            "' align = 'center'>" . $style_suspendida_start .str_replace(
                                    ":", "", $actividad['horainicio']
                            ) . '-'
                            . str_replace(":", "", $actividad['horafin']) . $style_suspendida_end.
                            "</td>
                                            <td align='center' style='" . $estiloborderbotom .
                            "' >" . $style_suspendida_start .$actividad['lugar'] . $style_suspendida_end ."</td>
                                            <td align='justify' style='" . $estiloborderbotom .
                            "'>" .$style_suspendida_start .strip_tags($actividad['dirigentes']) . $style_suspendida_end."</td>
                                            <td style='" . $estiloborderbotom .
                            "'>" . $style_suspendida_start.$texto . $style_suspendida_end. "</td>" . $columnaInvolucrados . "
                                        </tr>";
                }
            }
        }

        return $cuerporeporte;
    }

    public function GenerarCuerpoListaTodosLosCampos(
    $actividad, $cadenacontador, $datos, $contadorhojas
    ) {
        $tienerepeticiones = DatElementosDatElementos::EsPadredeActividad(
                        $actividad['idelemento'], $origen = 4, $datos
        );

        $idusuario = $this->global->Perfil->idusuario;

        $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
        $recursos_actividad = $objcmpgestionaractividadesmodel->BuscarRecursoActividad($actividad['idelemento']);
        $tiponomenclador = 5;

        $nomencladores = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
          $tiponomenclador, $idusuario
        );

        $style_suspendida_start=($actividad['suspendida']==0)?"":" <span STYLE=' align:center;  text-decoration:line-through; 
                            text-decoration-color: red;'> ";

        $style_suspendida_end=($actividad['suspendida']==0)?"":"</span>";

        $cadena_recursos = "";
        $cant_recursos = 0;
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                if (in_array($val['idnomenclador'], $recursos_actividad) /*&& $val['enuso'] == 1*/) {
                    if ($cant_recursos > 0) {
                        $cadena_recursos .= ',<br>';
                    }
                    $cadena_recursos.=$val['denom'];
                    $cant_recursos++;
                }
            }
        }

        $objrelacionesmodel = new CmprelacionesModel();
        $arrayrelaciones = $objrelacionesmodel->CargarRelacionesSuperioresPaginado(
                3, $actividad['idelemento'], $idusuario, 0, 0
        );

        $cadena_relaciones = "";
        $cant_relaciones = 0;
        if (isset($arrayrelaciones['contador'])) {
            foreach ($arrayrelaciones['array'] as $val) {
                $cad = explode('*', $val['denominacion']);
                if ($cant_relaciones > 0) {
                    $cadena_relaciones .= '.<br>';
                }
                switch ($cad[1]) {
                    case '50':
                        $cadena_relaciones.=($cant_relaciones + 1) . '-' . $cad[0] . '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|---' . $cad[2];
                        break;
                    default:
                        $cadena_relaciones.=($cant_relaciones + 1) . '-' . $cad[0];
                        break;
                }
                $cant_relaciones++;
            }
        }


        $objreasignacionesmodel = new CmpreasignacionesModel();
        $arrayreasignaciones = $objreasignacionesmodel->CargarReasignaciones(
                3, $actividad['idelemento'], $idusuario, 100, 0
        );
        $cadena_reasignaciones = "";
        $cant_reasignaciones = 0;
        if (isset($arrayreasignaciones['contador'])) {
            foreach ($arrayreasignaciones['array'] as $val) {
                if ($cant_reasignaciones > 0) {
                    $cadena_reasignaciones .= '.<br>';
                }
                $cadena_reasignaciones.=($cant_reasignaciones + 1) . '-' . substr($val['textoinvolucrados'], 0, strlen($val['textoinvolucrados']) - 2);
                $cant_reasignaciones++;
            }
        }

        $totalrep = count($tienerepeticiones) + 1;
        $fechasiguales = 0;
        if ($actividad['fechainicio'] == $actividad['fechafin']) {
            $fechasiguales = 1;
        }

        $arrayInvolucrados = $this->ObtenerCadenaInvolucrados(
                $actividad['idelemento']
        );
        $columnaInvolucrados = "<td style='overflow : hidden; " . $estiloborderbotom .
                "'>" . $style_suspendida_start .$arrayInvolucrados .$style_suspendida_end ."</td>";

        $texto_participantes = strip_tags($actividad['participantes']);
        $texto_participantes = eregi_replace("<style[^>]*>.*</style>", " ", $texto_participantes);
        $texto_participantes = eregi_replace("<[^>]*>", " ", $texto_participantes);
        $texto_participantes = eregi_replace("&nbsp;", "", $texto_participantes);
        $cuerporeporte
                .= "<tr>
                            <td style='" . $estiloborderbotom
                . "' rowspan='{$totalrep}' align = 'center'>" .
                $cadenacontador . "</td>
                            <td style='" . $estiloborderbotom
                . "' rowspan='{$totalrep}' align = 'center'>" .
                $style_suspendida_start.substr($actividad['idelemento'], 5) .
                   $style_suspendida_end. "</td>
                            <td style='" . $estiloborderbotom
                . "' rowspan='{$totalrep}'  align = 'justify'>" .
                $style_suspendida_start.$actividad['denelemento'].$style_suspendida_end . "</td>";

        $cuerporeporte .= "<td style='" . $estiloborderbotom .
                "' align = 'center'>"
                .$style_suspendida_start .$actividad['fechainicio'];
        if (!$fechasiguales) {
            $cuerporeporte .= "</br>hasta el</br>"
                    . $actividad['fechafin'];
        }
        $cuerporeporte .= $style_suspendida_end."</td><td style='" . $estiloborderbotom .
                "' align = 'center'>" . $style_suspendida_start .str_replace(
                        ":", "", $actividad['horainicio']
                ) . '-'
                . str_replace(":", "", $actividad['horafin']) .$style_suspendida_end.
                "</td>
                            <td style='" . $estiloborderbotom . "' >"
                . $style_suspendida_start.$actividad['lugar'] .$style_suspendida_end.
                "</td>
                            <td style='" . $estiloborderbotom . "' >" .
                 $style_suspendida_start.strip_tags($actividad['dirigentes']) .$style_suspendida_end. "</td>
                            <td style='" . $estiloborderbotom . "'>"
                .$style_suspendida_start .$texto_participantes .$style_suspendida_end.
                "</td>" . $columnaInvolucrados . "
      <td style='" . $estiloborderbotom . "' >" .
          $style_suspendida_start.strip_tags($actividad['descelemento']) .$style_suspendida_end. "</td>
      <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.strip_tags($actividad['categoria']) .$style_suspendida_end. "</td> 
       <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.strip_tags($actividad['tipoactividad']) .$style_suspendida_end. "</td>
       <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.$cadena_relaciones .$style_suspendida_end. "</td>
       <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.$cadena_reasignaciones .$style_suspendida_end. "</td> 
       <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.strip_tags($actividad['nombreestadoaprob']) .$style_suspendida_end. "</td>
       <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.strip_tags($actividad['estadocumplimiento']) .$style_suspendida_end. "</td>
       <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.strip_tags($actividad['cumplimiento']) .$style_suspendida_end. "</td> 
       <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.strip_tags($actividad['nombreautor']) .$style_suspendida_end. "</td>
       <td style='" . $estiloborderbotom . "' >" .
                $style_suspendida_start.$cadena_recursos .$style_suspendida_end. "</td>                      
                        </tr>";
        if (isset($tienerepeticiones[0])) {
            $totalrep = count($tienerepeticiones);
            foreach ($tienerepeticiones as $key => $repeticion) {
                $estiloborderbotomrep = 'border-right:1px solid black;';
                if ($key < ($totalrep - 1)) {
                    $estiloborderbotomrep = 'border-bottom:1px solid black;border-right:1px 
                            solid black;';
                }
                $objacthija = Doctrine::getTable('DatActividades')->find(
                        $repeticion['idelementohijo']
                );

                $style_suspendida_start=($objacthija->suspendida==0)?"":" <span STYLE='align:center; text-decoration:line-through; 
                              text-decoration-color: red;'> ";

                $style_suspendida_end=($objacthija->suspendida==0)?"":"</span>";

                $fechasrepetiguales = 0;
                if ($objacthija->fechainicio == $objacthija->fechafin) {
                    $fechasrepetiguales = 1;
                }
                $fechiniciohija = split('/', $objacthija->fechainicio);
                $fechfinhija = split('/', $objacthija->fechafin);
                $cuerporeporte
                        .= "<td align='center' style='" . $estiloborderbotom . "' >"
                        .$style_suspendida_start. $fechiniciohija[0] .
                        '/' . $fechiniciohija[1] . '/' . $fechiniciohija[2];
                if (!$fechasrepetiguales) {
                    $cuerporeporte
                            .= "</br>hasta el</br>" . $fechfinhija[0] . '/'
                            . $fechfinhija[1] .
                            '/' . $fechfinhija[2];
                }
                $cuerporeporte .= $style_suspendida_end."</td><td style='" . $estiloborderbotom .
                        "' align = 'center'>" . $style_suspendida_start.str_replace(
                                ":", "", $actividad['horainicio']
                        ) . '-'
                        . str_replace(":", "", $actividad['horafin']) .$style_suspendida_end.
                        "</td>
                                            <td style='" . $estiloborderbotom .
                        "' >" . $style_suspendida_start.$actividad['lugar'] .$style_suspendida_end. "</td>
                                            <td style='" . $estiloborderbotom .
                        "' >" .$style_suspendida_start .strip_tags($actividad['dirigentes']) .$style_suspendida_end. "</td>                                  
                                            <td style='" . $estiloborderbotom .
                        "'>" .$style_suspendida_start .$texto_participantes .$style_suspendida_end. "</td>" . $columnaInvolucrados . "
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.strip_tags($actividad['descelemento']) .$style_suspendida_end. "</td>
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.strip_tags($actividad['categoria']) .$style_suspendida_end. "</td>
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.strip_tags($actividad['tipoactividad']).$style_suspendida_end . "</td>
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.$cadena_relaciones .$style_suspendida_end. "</td>
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.$cadena_reasignaciones .$style_suspendida_end. "</td> 
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.strip_tags($actividad['nombreestadoaprob']) .$style_suspendida_end. "</td>
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.strip_tags($actividad['estadocumplimiento']) .$style_suspendida_end. "</td>
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.strip_tags($actividad['cumplimiento']) .$style_suspendida_end. "</td> 
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.strip_tags($actividad['nombreautor']) .$style_suspendida_end. "</td> 
          <td style='" . $estiloborderbotom . "' >" .
                        $style_suspendida_start.$cadena_recursos .$style_suspendida_end. "</td>                                        
                                        </tr>";
            }
        }
        return $cuerporeporte;
    }

    public function ObtenerCadenaInvolucrados($idelemento) {
        $cadenainvol = '';
        $arrayinvolucrados = DatElementosDatInvolucrados::
                ObtenerDatosGruposUsuariosInvolucrados($idelemento);
        if (isset($arrayinvolucrados[0])) {
            foreach ($arrayinvolucrados as $key => $involucrado) {
                if ($key > 0) {
                    $cadenainvol .= ',<br>';
                }
                if ($involucrado['DatInvolucrados']['tipoinvolucrado'] == 1) {
                    /* $cadenainvol .= $this->integrator->seguridad->nombreUsuario(
                      $involucrado['DatInvolucrados']['idusuario']
                      ); */
                    $cadenainvol .= $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                            $involucrado['DatInvolucrados']['idusuario'], 'usuario', null
                    );
                } else {
                    $grupo = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                            $involucrado['DatInvolucrados']['idgrupo']
                    );
                    $cadenainvol .= $grupo['dengrupo'];
                }
            }
        }
        return $cadenainvol;
    }

    public function DatosReporte(
    $idtiporeporte, $valuemeses, $valueanno, $fechainicio, $fechafin
    ) {
        $fechainicioD = null;
        $fechafinD = null;
        if ($idtiporeporte != 5) {
            if ($valuemeses) {
                $desde = "1/" . $valuemeses . "/" . $valueanno;
                $cantdiasmes = $this->getMonthDays($valuemeses, $valueanno);
                $hasta = $cantdiasmes . "/" . $valuemeses . "/" . $valueanno;
                $fechainicioD = date(
                        'd-m-Y', mktime(00, 00, 00, $valuemeses, 01, $valueanno)
                );
                $fechafinD = date(
                        'd-m-Y', mktime(00, 00, 00, $valuemeses, $cantdiasmes, $valueanno)
                );
            } else {
                if (!$valuemeses && $valueanno) {
                    $desde = "1/01" . "/" . $valueanno;
                    $hasta = "31/12" . "/" . $valueanno;
                    $fechainicioD = date(
                            'd-m-Y', mktime(00, 00, 00, 01, 01, $valueanno)
                    );
                    $fechafinD = date(
                            'd-m-Y', mktime(00, 00, 00, 12, 31, $valueanno)
                    );
                } else {
                    $desde = $fechainicio;
                    $hasta = $fechafin;
                    $fechainicioD = $fechainicio;
                    ;
                    $fechafinD = $fechafin;
                }
            }
        } else {
            $desde = "1/" . $valuemeses . "/" . $valueanno;
            $cantdiasmes = $this->getMonthDays($valuemeses, $valueanno);
            $hasta = $cantdiasmes . "/" . $valuemeses . "/" . $valueanno;
            $fechainicioD = date(
                    'd-m-Y', mktime(00, 00, 00, $valuemeses, 01, $valueanno)
            );
            $fechafinD = date(
                    'd-m-Y', mktime(00, 00, 00, $valuemeses, $cantdiasmes, $valueanno)
            );
        }
        $arraydatosreportes['fechainicioD'] = $fechainicioD;
        $arraydatosreportes['fechafinD'] = $fechafinD;
        $arraydatosreportes['desde'] = $desde;
        $arraydatosreportes['hasta'] = $hasta;
        $arraydatosreportes['cantdiasmes'] = $cantdiasmes;
        return $arraydatosreportes;
    }

    public function getMonthDays($month, $year) {
        //Lo hacemos a mi manera.
        return date("d", mktime(00, 00, 00, $month + 1, 00, $year));
    }

    public function ConvertirCentimetrosAPixel($valor) {
        $valor = ($valor / 0.03);
        return $valor;
    }

    public function ConstruirEncabezadoDocReportes($tablareport) {
        $tablareport
                .= "<HTML><HEAD><TITLE>Vista previa del
            reporte</TITLE></HEAD>\n<BODY>";
        return $tablareport;
    }

    public function ConstruirFooterDocReportes($tablareport) {
        $tablareport .= "\n</BODY></HTML>\n";
        return $tablareport;
    }

    public function ConstruirHoja(
    $tablareport, $datos, $margen, $anchohoja, $contadorhojas
    ) {
        $contadorhojas++;
        $arraydatos = array();
        $arraydatos["tablareport"] = $tablareport;
        $arraydatos["contadorhojas"] = $contadorhojas;
        return $arraydatos;
    }

    public function ConstruirHojaActivPrinicpales(
    $tablareport, $datos, $margen, $anchohoja, $altohojainicial, $contadorhojas
    ) {
        $arraydatos = $this->ConstruirHoja(
                $tablareport, $datos, $margen, $anchohoja, $contadorhojas
        );

        $info->arraydatosreporte = $this->DatosReporte(
          $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
        );

        $ANO="";
        if ($datos->versionadoSelecionado == 36) {
          $ANO=($datos->anoplan!="")?": ".$datos->anoplan:"_________";
        }

        $fechainicioD = $info->arraydatosreporte['fechainicioD'];
        $fechafinD = $info->arraydatosreporte['fechafinD'];

        $rangoFechasReport='';
        if($datos->rangotitle!=null){
          $rangoFechasReport = "<P align=center style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>";

          if ($fechainicioD != null){
            $rangoFechasReport.=("DESDE: ".str_replace('-','/', $fechainicioD));
          }

          if ($fechafinD != null){
            $rangoFechasReport.=("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HASTA: ".str_replace('-','/', $fechafinD));
          }

          $rangoFechasReport .="</P>";
        }

        $tablareport = $arraydatos["tablareport"];
        $contadorhojas = $arraydatos["contadorhojas"];
        $datos->repeticiones = 0;
        $existenprincp = 0;
        $arrayidactividades = DatElementos::ObtenerActividadesReporte($datos);
        //print_r($arrayidactividades);die;
        $tituloReporte=($datos->tituloreporte!='')?$datos->tituloreporte:"NO TIENE TITULO";
        $tituloReporte.=$ANO;
        $tablareport
        .= "<H2 align=center><B style ='font-size: 16px; text-align: center; font-family: 'Arial Black'; font-weight: normal;'>".$tituloReporte."</B></H2>";
        $tablareport
          .= "<BR/>".$rangoFechasReport;
        if (isset($arrayidactividades[0]['idelemento'])) {
            $tablareport
                    .= "<table width='100%' border='0' align='center' class='Estilo1'>
                              <tr>
                                <td><div align='left' ><strong>ACTIVIDADES PRINCIPALES</strong></div></td>
                              </tr>";
            $conta = 1;
            foreach ($arrayidactividades as $actividad) {
                if ($actividad['esprincipal']) {
                    $existenprincp = 1;
                    $tablareport .= "<tr><td><div align='justify' >" . $conta
                            . '. '
                            . $actividad['denelemento'] . "</div></td></tr>";
                    $conta++;
                }
            }
            $tablareport .= "</table>";
        }
        $arraydat = array();
        $arraydat["tablareport"] = $tablareport;
        $arraydat["contadorhojas"] = $contadorhojas;
        $arraydat["principales"] = $existenprincp;
        return $arraydat;
    }

    public function ConstruirHojaObj(
    $tablareport, $datos, $margen, $anchohoja, $altohojainicial, $contadorhojas, $idplan, $arrayobj
    ) {
        $arrayobjetivosarc = array();
        $objetivos = array();
        $arraydatos = $this->ConstruirHoja(
                $tablareport, $datos, $margen, $anchohoja, $contadorhojas
        );
        $tablareport = $arraydatos["tablareport"];
        $contadorhojas = $arraydatos["contadorhojas"];
        $datos->repeticiones = 0;
        $existenprincp = 0;
        foreach ($arrayobj as $key => $arc) {
            $arrayobjetivosarc[$key] = $arc['idarc'];
        }
        if (isset($arrayobjetivosarc[0])) {
            $arrayobjetivosarcA = implode("'" . ',' . "'", $arrayobjetivosarc);
            $objetivos = DatArcDatPlanObjetivo::ObtenerObjDadoPlanARC(
                            $idplan, $arrayobjetivosarcA
            );
        }
        $tablareport
                .= "<table class = 'Estilo1' width='100%' border='0' align='center'>
                              <tr>
                                <td><div align='center' class ='Estilo2'>
                                OBJETIVOS DE TRABAJO</div></td>
                              </tr>";
        $conta = 1;
        foreach ($objetivos as $key => $objetivo) {
            if ($objetivo) {
                $existenprincp = 1;
                $tablareport
                        .= "<tr><td><strong>" . $conta . "."
                        . $objetivo['denelemento']
                        .
                        "</strong></td></tr>";
                $conta++;
            }
        }
        $tablareport .= "</table>";
        $arraydat = array();
        $arraydat["tablareport"] = $tablareport;
        $arraydat["contadorhojas"] = $contadorhojas;
        $arraydat["principales"] = $existenprincp;
        return $arraydat;
    }

    public function ObtenerEncabezadoReporteAgrupacion($html, &$datos) {
        $datos->widthActividad = '32%';
        $datos->widthActividadWrite = '35%';
        $datos->widthParticipantesWrite = '38%';
        $datos->widthParticipantes = '22%';
        $columnaInvolucrado = "";
        $bordeDerechoUltimaColumna = "border-right:1px solid black;";
        if ($datos->coninvolucrados == 1) {
            $datos->widthActividad = '25%';
            $datos->widthActividadWrite = '25%';
            $datos->widthParticipantes = '15%';
            $datos->widthParticipantesWrite = '25%';
            $bordeDerechoUltimaColumna = "";
            $columnaInvolucrado = "<td class='Estilo1 class='Estilo1' width='15%'
                        rowspan='2' style='border-bottom:1px solid black;
                        border-top:1px solid black;border-left:1px solid 
                        black;border-right:1px solid black;background:#CCCCCC;'>
                        <strong>Involucrados</strong></td>";
        }else{
          $datos->widthActividad = '25%';
          $datos->widthActividadWrite = '25%';
          $datos->widthParticipantes = '15%';
          $datos->widthParticipantesWrite = '25%';
          $bordeDerechoUltimaColumna = "";
          $columnaInvolucrado = "<td class='Estilo1 class='Estilo1' width='15%'
                        rowspan='2' style='border-bottom:1px solid black;
                        border-top:1px solid black;border-left:1px solid 
                        black;border-right:1px solid black;background:#CCCCCC;'>
                        <strong>Observaciones</strong></td>";
        }

        //print_r($datos->versionadoSelecionado);die;
        switch ($datos->versionadoSelecionado){
          case 19:
            $columnaInvolucrado="";
            break;

        }



        $html
                .= "<table class='Estilo1' width='100%' bordercolor='black'
                style='margin-top:1cm;' cellspacing='0'>"
                .
                "<thead>" . "<tr style='text-align:center;'>" .
                "<td width='5%' rowspan='2' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid 
                black;background:#CCCCCC;'><strong>No.</strong></td>"
                .
                "<td width='5%' rowspan='2' style='border-bottom:1px solid
                black;border-top:1px solid black;border-left:1px solid 
                black;background:#CCCCCC;'><strong>CAR</strong></td>"
                .
                "<td width='{$datos->widthActividad}' rowspan='2' 
                style='border-bottom:1px solid black;border-top:1px solid 
                black;border-left:1px solid black;background:#CCCCCC;'><div 
                align='center'><strong>Actividades</strong></div></td>"
                .
                "<td colspan='12' width='36%' style='border-top:1px solid 
                black;border-left:1px solid black;background:#CCCCCC;'>
                <strong>Meses</strong></td>"
                .
                "<td width='13%' rowspan='2' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid 
                black;background:#CCCCCC;'><strong>Dirige</strong></td>"
                .
                "<td width='14%' rowspan='2' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;"
                .
                $bordeDerechoUltimaColumna .
                "background:#CCCCCC;'><strong>Participantes</strong></td>"
                . $columnaInvolucrado .
                "</tr>" . "<tr>"
                . "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>E</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>F</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>M</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>A</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>M</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>J</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>J</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>A</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>S</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid 
                black;border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>O</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid black;
                border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>N</strong></td>"
                .
                "<td width='3%' align='center' style='border-bottom:1px solid black;
                border-top:1px solid black;border-left:1px solid black;
                background:#CCCCCC;'><strong>D</strong></td>"
                .
                "</tr>" . "</thead>" . "<tbody>";
        return $html;
    }

    public function construirHojaReporteCualitativoCuantitativo(
    $tablareport, $datos, $margen, $anchohoja, $altohojainicial, $contadorhojas
    ) {
        $arraydatos = $this->ConstruirHoja(
                $tablareport, $datos, $margen, $anchohoja, $contadorhojas
        );
        $tablareport = $arraydatos["tablareport"];
        $contadorhojas = $arraydatos["contadorhojas"];
        $anno = $datos->valueanno;
        $mes = $datos->valuemeses;
        $fechainicio = str_replace(
                '-', '/', $datos->fechainicio
        );
        $fechafin = str_replace(
                '-', '/', $datos->fechafin
        );
        $titulo = ($anno != '' && $mes != '') ? "Mes ($datos->textomeses)" : "Per&iacute;odo ($fechainicio - $fechafin)";
        $tablareport
                .= "<table width='100%' border='0' align='center' class='Estilo1'>
                              <tr>
                                <td><div align='center' ><strong>Resumen Cuantitativo $titulo</strong></div></td>
                              </tr>";
        $tablareport .= "</table>";

        $arraydat = array();
        $arraydat["tablareport"] = $tablareport;
        $arraydat["contadorhojas"] = $contadorhojas;
        return $arraydat;
    }

    public function datosReporteDeActividadesPeriodo($datos) {
        $contIncumplida = 0;
        $contCumplida = 0;
        $contNueva = 0;
        $contModificada = 0;
        $result->total = count($datos->arrayActv);
        $fechaActual = strtotime(date('d-m-Y'));
        foreach ($datos->arrayActv as $act => $key) {
            $fechafin = strtotime(
                    date(str_replace("/", "-", $key['fechafin']))
            );
            if ($key['estadocumplimiento'] == 'Sin cumplir') {
                if ($fechafin < $fechaActual) {
                    $contIncumplida++;
                }
            }
            if ($key['estadocumplimiento'] == 'Cumplida') {
                $contCumplida++;
            }
        }
        $result->incumplida = $contIncumplida;
        $result->cumplida = $contCumplida;
        $result->nueva = $contNueva;
        $result->modificada = $contModificada;
        return $result;
    }

    public function datosReporteDeActividadesPeriodoDetallado($datos) {
        $contIncumplida = 0;
        $contCumplida = 0;
        $contNueva = 0;
        $contModificada = 0;
        $arrayActCumplidas = array();
        $arrayActIncumplidas = array();
        $arrayActModificadas = array();
        $arrayActNuevas = array();
        $arrayAct = $datos->arrayActv;
        $arrayIdActividades = array_column($arrayAct, 'idelemento');
        $arrayIdActividades = implode(",", $arrayIdActividades);
        $arrayIncidencias = DatElementos::obtenerIncidenciasActividades(
                        $arrayIdActividades
        );
        $fechaActual = strtotime(date('d-m-Y'));

        foreach ($arrayAct as $act => $key) {
            $fechafin = strtotime(
                    date(str_replace("/", "-", $key['fechafin']))
            );
            $datosIncidencia = $this->obtenerIncidenciaObservacion($key['idelemento'], $arrayIncidencias);
            $key['incidencia'] = $datosIncidencia['incidencia'];
            $key['observacion'] = $datosIncidencia['observacion'];
            if ($key['estadocumplimiento'] == 'Sin cumplir') {
                if ($fechafin < $fechaActual) {
                    $contIncumplida++;
                    array_push($arrayActIncumplidas, $key);
                }
            }
            if ($key['estadocumplimiento'] == 'Cumplida') {
                $contCumplida++;
                array_push($arrayActCumplidas, $key);
            }
        }
        $result->incumplida = $contIncumplida;
        $result->cumplida = $contCumplida;
        $result->nueva = $contNueva;
        $result->modificada = $contModificada;
        $result->arrayActIncumplidas = $arrayActIncumplidas;
        $result->arrayActCumplidas = $arrayActCumplidas;
        $result->arrayActNuevas = $arrayActModificadas;
        $result->arrayActModificadas = $arrayActNuevas;
        return $result;
    }

    public function datosReporteActividadesResumenPorMes($parametros) {
        $contIncumplida = 0;
        $contCumplida = 0;
        $contEjecucion = 0;
        $contEnTiempo = 0;
        $contFueraTiempo = 0;
        $contSinIniciar = 0;
        $arrayActIncumplidas = array();
        $arrayActSemanaIncumplidas = array();
        $lunes = strtotime('last monday');
        $domingo = strtotime('next sunday');
        $fechaActual = date('d-m-Y');
        $fechaActualArray = explode('-', $fechaActual);
        $annoActual = $fechaActualArray[2];
        $mesActual = $fechaActualArray[1];
        $fechaActual = strtotime($fechaActual);
        $condicionActSemanaIncumplida = ($annoActual == $parametros->anno && ($mesActual == $parametros->mes || $mesActual == $parametros->mes + 1 || $mesActual == $parametros->mes - 1)
                ) ? 1 : 0;
        foreach ($parametros->arrayActv as $act => $key) {
            $fechafin = strtotime(
                    date(str_replace("/", "-", $key['fechafin']))
            );
            $fechainicio = strtotime(
                    date(str_replace("/", "-", $key['fechainicio']))
            );
            if ($key['estadocumplimiento'] == 'Sin cumplir') {
                if ($fechafin < $fechaActual) {
                    $contIncumplida++;
                    array_push($arrayActIncumplidas, $key);
                    if ($condicionActSemanaIncumplida) {
                        if ($fechainicio >= $lunes && $fechafin <= $domingo) {
                            array_push($arrayActSemanaIncumplidas, $key);
                        }
                    }
                } else {
                    $contFueraTiempo++;
                }
            }
            if ($fechafin > $fechaActual) {
                $contEjecucion++;
                if ($key['estadocumplimiento'] == 'Parcialmente cumplido') {
                    $contEnTiempo++;
                }
            }
            ($fechainicio > $fechaActual) ? $contSinIniciar++ : null;
            ($key['estadocumplimiento'] == 'Cumplida') ? $contCumplida++ : null;
        }
        $result->incumplidas = $contIncumplida;
        $result->cumplidas = $contCumplida;
        $result->ejecucion = $contEjecucion;
        $result->ejecucionentiempo = $contEnTiempo;
        $result->ejecucionfueratiempo = $contFueraTiempo;
        $result->sininiciar = $contSinIniciar;
        $result->arrayActIncumplidas = $arrayActIncumplidas;
        $result->arrayActSemanaIncumplidas = $arrayActSemanaIncumplidas;
        return $result;
    }

    public function crearFilasHTMLActIncumplidas($arrayActIncumplidas) {
        $tabla = '';
        if (isset($arrayActIncumplidas[0])) {
            foreach ($arrayActIncumplidas as $act) {
                $denominacion = $act['denelemento'];
                $fechainicio = $act['fechainicio'];
                $fechafin = $act['fechafin'];
                $tabla .= "<tr><td><div align='justify' >$denominacion</div></td>";
                $tabla .= "<td><div align='center' >$fechainicio</div></td>";
                $tabla .= "<td><div align='center' >$fechafin</div></td></tr>";
            }
        } else {
            $tabla = "<tr><td><div align='justify' ><strong>NO HAY REGISTRO DE ACTIVIDADES INCUMPLIDAS</strong></div></td>";
            $tabla .= "<td><div align='center' ></div></td>";
            $tabla .= "<td><div align='center' ></div></td></tr>";
        }
        return $tabla;
    }

    public function crearFilasHTMLActividadesIncidencia($arrayActv, $tipo) {
        $tabla = '';
        if (isset($arrayActv[0])) {
            foreach ($arrayActv as $act) {
                $denominacion = $act['denelemento'];
                $incidencia = $act['incidencia'];
                $observacion = $act['observacion'];
                $tabla .= "<tr><td><div align='justify' >$denominacion</div></td>";
                $tabla .= "<td><div align='justify' >$incidencia</div></td>";
                $tabla .= "<td><div align='justify' >$observacion</div></td></tr>";
            }
        } else {
            $tabla = "<tr><td><div align='justify' ><strong>NO HAY REGISTRO DE ACTIVIDADES $tipo</strong></div></td>";
            $tabla .= "<td><div align='center' ></div></td>";
            $tabla .= "<td><div align='center' ></div></td></tr>";
        }
        return $tabla;
    }

    public function obtenerIncidenciaObservacion($idActv, $arrayIncidencias) {
        $cont = 0;
        foreach ($arrayIncidencias as $value => $key) {
            if ($key['idelemento'] == $idActv) {
                $incidencia .= $key['incidencia'] . '<br>';
                ($cont == 0) ? $observacion = $key['cuerpoobservacion'] : null;
                $cont++;
            }
        }
        $result['incidencia'] = $incidencia;
        $result['observacion'] = $observacion;
        return $result;
    }

    public function generarPlanAnual($datos) {
        switch ($datos->versionadoSelecionado) {
            case 19://Plan anual
                return $this->generarTablaPlanAnual($datos);
                break;
            case 20://Plan anual para firmar
                return $this->generarTablaPlanAnualFirma($datos);
                break;
            case 34:
                return $this-> GenerarListadoActividadesObjetivos($datos);
                break;
            case 35:
                return $this-> GenerarListadoActividadesObjetivos($datos);
                break;
            case 36:
                 return $this-> GenerarListadoActividadesARC($datos);
                 break;
            case 37:
                 return $this-> GenerarListadoActividadesARC($datos);
                 break;
            case 38:
                 return $this-> GenerarPlanArcObjetivoActividades($datos);
                 break;
            case 39:
                 return $this-> GenerarPlanArcObjetivoActividades($datos);
                 break;

        }
    }

    public function generarTablaPlanAnual($datos) {
    if ($datos->versionadoSelecionado == 10) {
      $datos->coninvolucrados = 1;
    }
    $altohoja = $datos->altohoja - 2;
    $altohojainicial = $datos->altohoja - 2;
    $anchohoja = $datos->anchohoja - 2;
    $orientacionhoja = "portrait";
    if ($datos->orientacionhoja == 1) {
      $orientacionhoja = "landscape";
    }
    $tablareport = "<style type='text/css'>
                .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
      . $datos->tamanoletra . ";}
				 @page{height:" . $datos->altohoja . "cm; width:"
      . $datos->anchohoja .
      "cm; size:" . $orientacionhoja . ";} </style>";
    $tablareport .= "<div style='margin:auto;width:" . $anchohoja .
      "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";
    if (isset($datos->arraypartesreporte[0])) {
      $existeprincp = 0;
      $contadorhojas = 1;
      $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
        $datos->idusuariosession
      );
      $datos->arraydatosreporte = $this->DatosReporte(
        $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
      );
      foreach ($datos->arraypartesreporte as $partereporte) {
        switch ($partereporte['idpartereporte']) {
          case 1: //clasificacion
            $tablareport
                      .= "<table class='Estilo1' border='0'>
                             <tr><td>&nbsp;</td>
                             <td><div align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
              .
              $configuracionfirma->cargoaprueba . "</b></div></td>
                              <td width = '800px'><div align='right'><p style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
              . $datos->confidencialidad . "</p></div></td></tr>";
            $altohoja = $altohoja - 0.25;
            break;
          case 2: //aprobado por
            $tablareport
                      .= "<tr><td><b style ='font-size: 12px; font-family: 'Arial Black';
                                     font-weight: normal;>APROBADO:</b></td><td align='center'>
                             <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >". $configuracionfirma->gradoaprueba . "</b></td>
                            <td>&nbsp;</td></tr>
                            <tr><td><span></span></td><td>&nbsp;</td>
                            <td><span></span></td></tr>
                            <tr><td>&nbsp;</td><td align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
              . $configuracionfirma->nombreaprueba . "</b></td>
                            <td>&nbsp;</td></tr></table>";
            $altohoja = $altohoja - 5.25;
            break;
//                    case 3: //titulo
//                        $tablareport
//                                .= "<table class ='Estilo1' width= '100%' border='0' align='center'>
//                                <tr><td><div align='center'><p><b>"
//                                . $datos->tituloreporte . "</b></p>
//                                </div></td></tr></table>";
//                        $altohoja = $altohoja - 4;
//                        break;
          case 4: //elaborado por
            if ($configuracionfirma->nombrelabora != '') {
              $tablareport
                .= " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='500' align='center'> 
                                      <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                . $configuracionfirma->cargoelabora
                . "</b></td></tr>";
              $tablareport
                .= "<tr><td><div align='center'></td>
                                <td width='500' align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                . $configuracionfirma->gradoelabora . "</b></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='500'align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
                . $configuracionfirma->nombrelabora . "</b></td>
                                </tr></table></div>";
            }
            break;
          case 5: //actividades principales
            $arraydat = $this->ConstruirHojaActivPrinicpales(
              $tablareport, $datos, 2, $anchohoja, $altohojainicial, $contadorhojas
            );
            $tablareport = $arraydat["tablareport"];
            $contadorhojas = $arraydat["contadorhojas"];
            $existeprincp = $arraydat["principales"];
            break;
          case 7://Obtener Areas hijas y objetivos hijos del plan
            $tablareport = $this->ObtenerEncabezadoReporteAgrupacion(
              $tablareport, $datos
            );
            $arraydatos->idtipoelemento = 0;
            $arraydatos->idelemento = $datos->idplan;
            //Buscar areas hijas
            $arrayarcplan = DatArcDatPlan::ObtenerAreasPorPlanesSQL(
              $datos->idplan
            );
            $cont = 1;
            if (isset($arrayarcplan[0])) {
              $arrayarcplan = $this->OrganizarArcPorPadresEHijos(
                $arrayarcplan
              );

//              usort($arrayarcplan, function ($a1, $a2) {
//                return ($a1['orden'] < $a2['orden']) ? -1 : 1;
//              });


              foreach ($arrayarcplan as $arc) {
//                if ($arc['idarcp'] == null) {
                  $tablareport .= $this->GenerarCuerpoReportePlanARCObjAct(
                    $cont, $arc, $arrayarcplan, $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos
                  );
                  $cont++;
//                }
              }
            }
            /* //Buscar objetivos hijos del plan
              $arrayobjetivosplan
              = DatElementosDatElementos::BuscarObjetivosAlPlan(
              $datos->idplan
              );
              if (isset($arrayobjetivosplan[0])) {
              $arrayobjetivosplan
              = $this->OrganizarObjPorPadresEHijos(
              $arrayobjetivosplan
              );
              foreach ($arrayobjetivosplan as $obj) {
              if ($obj['idpadre'] == null) {
              $obj['idobjetivo'] = $obj['idelemento'];
              $tablareport .= $this->GenerarCuerpoReporteObjPlan(
              $cont, $obj, $arrayobjetivosplan,
              $tablareport, $datos->idplan,
              $cadena = '',
              $datos->idversionreporte, $datos
              );
              $cont++;
              }
              }
              } */

            $obj = null;
            $obj['idobjetivo'] = 'objetivo';
            $obj['idpadre'] = 'null';
            $obj['denelemento'] = 'Otras actividades vinculadas al plan';
            $tablareport .= $this->GenerarCuerpoReporteObjPlan($cont, $obj, $arrayobjetivosplan = array(), $tablareport, $datos->idplan, $cadena = '', $datos->idversionreporte, $datos);
            $tablareport .= "</tbody>" . "</table>";
            break;
        }
      }
    }
    $tablareport .= "</div></div>";
    return $tablareport;
  }

    public function generarTablaPlanAnualFirma($datos) {
       $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
        $datos->idusuariosession
        );

        $tabla = "<HTML>
            <H2 width=365 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>TOTAL</B></FONT></H2>
                             <H4 align=right>Grado de reserva</H4>
               <H4 align=right>Ejemplar No.______</H4>
               <H4 align=left><FONT face=Calibri size=3 color=#000000><B>CARGO: " .$configuracionfirma->cargoaprueba. "</B></FONT></H4>
               <H4 align=left><FONT face=Calibri size=3 color=#000000><B>GRADO: " . $configuracionfirma->gradoaprueba . "</B></FONT></H4>
               <H4 width=108 align=left><FONT face=Calibri size=4 color=#000000><B>APROBADO POR: " . $configuracionfirma->nombreaprueba . "</B></FONT></H4>
               <H3 align=center>CARACTERIZACIÓN DEL PLAN________________</H3>
<TABLE border=1 align=left cellpadding=1 cellspacing=0>
<TR>
<TD width=108 ROWSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>CAPÍTULOS</B></FONT></TD>
<TD width=365 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>TOTAL</B></FONT></TD>
<TD width=365 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>EXTERNAS</B></FONT></TD>
<TD width=365 COLSPAN=2 align=center><FONT face=Calibri size=2 color=#000000><B>PROPIAS</B></FONT></TD>
</TR>
<TR>
<TD width=182 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT></TD>
<TD width=182 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT></TD>
<TD width=182 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT></TD>
<TD width=182 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT></TD>
<TD width=182 align=center><FONT face=Calibri size=2 color=#000000><B>ACTIVIDADES</B></FONT></TD>
<TD width=182 align=center><FONT face=Calibri size=2 color=#000000><B>TAREAS DE ASEGURAMIENTO</B></FONT></TD>
</TR>
<TR>";

      $info=DatArcDatPlan::getDatosCaracterizacionPlanRango($datos);
      $body="";
      $total_TOTAL_ACT=0;
      $total_TOTAL_TAREAS_ASEG=0;

      $total_EXTERNAS_ACT=0;
      $total_EXTERNAS_TAREAS_ASEG=0;

      $total_PROPIAS_ACT=0;
      $total_PROPIAS_TAREAS_ASEG=0;

      foreach ($info as $key => $value) {
        $total_TOTAL_ACT += $value['cantidadtotalactividades'];
        $total_TOTAL_TAREAS_ASEG += $value['cantidadtotaltareas'];

        $total_EXTERNAS_ACT+=$value['cantidadactexterna'];
        $total_EXTERNAS_TAREAS_ASEG+=$value['cantidadtareaasegexterna'];

        $total_PROPIAS_ACT+=$value['cantidadactpropia'];
        $total_PROPIAS_TAREAS_ASEG+=$value['cantidadtareaasegpropia'];

        $tabla.="<TR>";
        $tabla.=" <TH width=230 align=left style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['denarc'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadtotalactividades'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadtotaltareas'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadactexterna'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadtareaasegexterna'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadactpropia'] . "
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'>" . $value['cantidadtareaasegpropia'];
      }
      $tabla.="<TR>";
      $tabla.=" <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>TOTAL</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_TOTAL_ACT . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_TOTAL_TAREAS_ASEG . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_EXTERNAS_ACT . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_EXTERNAS_TAREAS_ASEG . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_PROPIAS_ACT . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;'><FONT face=Calibri size=2 color=#000000><B>" . $total_PROPIAS_TAREAS_ASEG;

      $porciento_externas=($total_EXTERNAS_ACT*100)/$total_TOTAL_ACT;
      $porciento_propias=($total_PROPIAS_ACT*100)/$total_TOTAL_ACT;

      $tabla.="<TR>";
      $tabla.=" <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;' colspan='3' ><FONT face=Calibri size=2 color=#000000><B>% DEL TOTAL</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;' colspan='2' ><FONT face=Calibri size=2 color=#000000><B>" . $porciento_externas . "</B></FONT>
         <TH width=230 align=center style ='font-size: 12px; font-family: normal;  font-weight: normal;' colspan='2' ><FONT face=Calibri size=2 color=#000000><B>" . $porciento_propias . "</B></FONT>";

      $tabla .= "</TABLE>";
      return $tabla;
    }

    //Los condenados
    public function generarReporteObjetivos($datos) {
        $datos->arraydatosreporte = $this->DatosReporte(
          $datos->idtiporeporte, $datos->valuemeses, $datos->valueanno, $datos->fechainicio, $datos->fechafin
        );
        $fechainicioD = $datos->arraydatosreporte['fechainicioD'];
        $fechafinD = $datos->arraydatosreporte['fechafinD'];

      $rangoFechasReport = "<P align=center style ='font-size: 12px; font-family: Arial; font-weight: normal; color=#000000'>";

        if ($fechainicioD != null){
          $rangoFechasReport.=("DESDE: ".str_replace('-','/', $fechainicioD));
        }

        if ($fechafinD != null){
          $rangoFechasReport.=("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HASTA: ".str_replace('-','/', $fechafinD));
        }

        $rangoFechasReport .="</P>";

        $tituloReporte=($datos->tituloreporte!='')?$datos->tituloreporte.":":"OBJETIVOS:";

        $row_title="<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".$tituloReporte."</B></H3>";
        $row_title.=$rangoFechasReport;

        /******************Todos los objetivos******************************/

      $arrayObjetivos=array();
      $datos->str_idelementos="";
      if($datos->idplan!=''){
        DatObjetivo::getObjPlan($datos->idplan,$datos->idusuariosession,$arrayObjetivos);
        foreach ($arrayObjetivos as $value){
          $datos->str_idelementos.= ($datos->str_idelementos=="")?$value:",".$value;
        }
      }

      /***
      Aprobado del reporte
       **/

      $altohoja = $datos->altohoja - 2;
      $altohojainicial = $datos->altohoja - 2;
      $anchohoja = $datos->anchohoja - 2;
      $orientacionhoja = "portrait";
      if ($datos->orientacionhoja == 1) {
        $orientacionhoja = "landscape";
      }
      $Aprobado = "<style type='text/css'>
                 .Estilo1 {font-family:" . $datos->tipoletra . "; font-size: "
        . $datos->tamanoletra . ";}
                 @page{height:" . $datos->altohoja . "cm;width:"
        . $datos->anchohoja . "cm;size:" . $orientacionhoja . ";}</style>";
      $Aprobado .= "<div style='margin:auto;width:" . $anchohoja .
        "cm;background-color:white;padding:1cm 1cm 1cm 1cm;'>";

      $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
        $datos->idusuariosession
      );

      $altohoja = $datos->altohoja - 2;

      $Aprobado
                = "<table class='Estilo1' border='0'>
                             <tr><td>&nbsp;</td>
                             <td><div align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
        .
        $configuracionfirma->cargoaprueba . "</b></div></td>
                              <td width = '800px'><div align='right'><p style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
        . $datos->confidencialidad . "</p></div></td></tr>";

      $Aprobado
        .= "<tr><td><b style ='font-size: 12px; font-family: 'Arial Black';
                                     font-weight: normal;>APROBADO:</b></td><td align='center'>
                             <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >". $configuracionfirma->gradoaprueba . "</b></td>
                            <td>&nbsp;</td></tr>
                            <tr><td><span></span></td><td>&nbsp;</td>
                            <td><span></span></td></tr>
                            <tr><td>&nbsp;</td><td align='center'><b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
      . $configuracionfirma->nombreaprueba . "</b></td>
                            <td>&nbsp;</td></tr></table>";

      $Elaborado = ($configuracionfirma->nombrelabora != '')?
          " <table class='Estilo1' width='100%' border='0'>
                                <tr> <td>&nbsp;</td><td width='500' align='center'> 
                                      <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
          . $configuracionfirma->cargoelabora
          . "</b></td></tr><tr><td><div align='center'></td>
                                <td width='500' align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
          . $configuracionfirma->gradoelabora . "</b></td></tr>
                                <tr><td><span></span></td><td>&nbsp;</td>
                                <td width='16'><span></span></td></tr>
                                <tr><td>&nbsp;</td><td width='500'align='center'> 
                                <b style ='font-size: 12px; font-family: 'Arial';
                                     font-weight: normal; >"
          . $configuracionfirma->nombrelabora . "</b></td>
                                </tr></table></div>": "";




        switch ($datos->versionadoSelecionado) {
          case 14://
            $info=self::getDatosReporteObjetivos($datos);
            //print_r($info);die;
            $tabla = " <HTML>
                    <BODY>".$row_title."
                    <TABLE align=center> ";
            $num_obj=1;
            $num_criterio=1;
            foreach ($info as $key => $value) {
              if($value['orden']==0){
                $numeracion= self::a_romano($num_obj).PHP_EOL. ". ";
                $num_obj++;
                $num_criterio=1;
                $cell_denominacion="<TD align=left >". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['objcriteriomedida'] ."</TD>";
              }else{
                $numeracion= $num_criterio. ". ";
                $num_criterio++;
                $cell_denominacion="<TD align=left >". "&nbsp;&nbsp;&nbsp;". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['objcriteriomedida'] ."</TD>";
              }
              $tabla .=  " <TR>".$cell_denominacion."</TR>";
            }

            $tabla .= " </TABLE>
                    </BODY>
                    </HTML> ";
            break;
            case 15://
                $info=self::getDatosReporteObjetivosTodosLoscampos($datos);
                $tabla = "<HTML>
                              <BODY>
                               ".$row_title."
                              
                              <TABLE id=\"tabladatos\" class=\"table\" CELLSPACING=\"0\" align=center BORDER=\"2\" CELLPADDING=\"3\">
                              <TR>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Objetivos y Criterios de medidas</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Fecha de cumplimiento</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Porciento de cumplimiento</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Dirige</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Descripcción</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Participantes</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Involucrados</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>UM</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Valor meta</B></TH>
                              <TH style=\"background:#E0E0DC;\" align=center><B>Valor real</B></TH>
                              </TR>";

                $row_datos="";
                $num_obj=1;
                $num_criterio=1;
                     foreach ($info as $key => $value) {
                       $unidad_medida=' ';
                       $objcriterio = Doctrine::getTable('DatCriteriomedida')->find(
                            $value['idelemento']
                           );
                       if (isset($objcriterio->idcriteriomedida)) {
                         $objcmpelementosmodel = new CmpgestionarelementoModel();
                         $criteriomedida = $objcriterio->ObtenerUnidadMedida(
                           $objcriterio->idumedida
                         );
                         $unidad_medida=$criteriomedida[0]['abreviaturaunidadmedida'];
                       }

                       if($value['orden']==0){
                         $numeracion= self::a_romano($num_obj).PHP_EOL. ". ";
                         $num_obj++;
                         $num_criterio=1;
                         $cell_denominacion="<TH align=left >". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['objcriteriomedida'] ."</TH>";
                       }else{
                         $numeracion= $num_criterio. ". ";
                         $num_criterio++;
                         $cell_denominacion="<TH align=left >". "&nbsp;&nbsp;&nbsp;". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['objcriteriomedida'] ."</TD>";
                       }
                       $row_datos.=" <TR>".
                             $cell_denominacion.
                    "<TH align=center  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$value['fechafin']."</TH>
                    <TH align=right  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$value['gradocumplimiento']."</TH>
                    <TH align=left  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$value['dirigente']."</TH>
                    <TH align=left  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$value['descripcion']."</TH>
                    <TH align=left  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$value['participante']."</TH>
                    <TH align=left  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$value['involucrados']."</TH>
                    <TH align=right  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$unidad_medida."</TH>
                    <TH align=right  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$value['valormeta']."</TH>
                    <TH align=right  style ='font-size: 12px; font-family: normal; font-weight: normal;'>".$value['valorreal']."</TH>
                    </TR>";
                     }

                 $tabla .= $row_datos;

                 $tabla .= "
                              </TABLE>
                              </BODY>
                              </HTML>
                              ";
                break;
            case 16://
              $info=self::getDatosReporteObjetivosTrabajoCriteriosMedida($datos);
              //print_r($info);die;
              $tabla = " <HTML>
                    <BODY>
                    ".$row_title."
                    <TABLE id=\"tabladatos\" class=\"table\" CELLSPACING=\"0\" BORDER=\"1\" align=center CELLPADDING=\"3\"> ";


              $objetivos=array();
              $key_objetivos=array();
              $indicadores=array();
              $key_indicadores=array();
              $criterioeval=array();
              $key_criterioeval=array();
              $o=0;
              foreach ($info as $key => $value) {
                if(array_search($value['idobjetivo'], $objetivos)===false){
                   $objetivos[$value['idobjetivo']]=$value;
                }
                if(array_search($value['idobjetivo'], $key_objetivos)===false)
                    $key_objetivos[$o++]=$value['idobjetivo'];
              }

//              print_r($key_objetivos);die;
              $i=0;
              $pos_ind=0;
              foreach ($key_objetivos as $key => $obj_value) {
                $aux_indicadores=array();
                foreach ($info as $key => $value) {
                  if($obj_value == $value['idobjetivo'] && array_search($value['idindicador'], $key_indicadores)===false){
                    $aux_indicadores[$pos_ind++]=$value;
                    $key_indicadores[$i++]=$value['idindicador'];
                  }
                 }
                $indicadores[$obj_value]=$aux_indicadores;
              }

//              print_r($indicadores);die;

              $k=0;
              $pos_criteval=0;
              foreach ($key_indicadores as $key => $ind_value) {
                $aux_criterioeval=array();
                foreach ($info as $key => $value) {
                  if($ind_value == $value['idindicador'] && array_search($value['idcriterioevaluacion'], $key_criterioeval)===false){
                    $aux_criterioeval[$pos_criteval++]=$value;
                    $key_criterioeval[$k++]=$value['idcriterioevaluacion'];
                  }
                }
                $criterioeval[$ind_value]=$aux_criterioeval;
              }

              $array_criteriosmedida=array();
              $key_array_criteriosmedida=array();
              $num_cm=1;
              $cm=0;
              foreach ($info as $key => $value) {
                $key_criteriomedida="".$value['idobjetivo'].$value['idindicador'].$value['idcriterioevaluacion'];
                if(array_search($key_criteriomedida, $key_array_criteriosmedida)===false){
                  $num_cm=1;
                  $array_criteriosmedida[$key_criteriomedida]=$num_cm.". ".$value['criteriomedida'];
                  $key_array_criteriosmedida[$cm++]=$key_criteriomedida;
                }else{
                  $num_cm++;
                  $array_criteriosmedida[$key_criteriomedida].="<br/>&nbsp;&nbsp;&nbsp;".$num_cm.". ".$value['criteriomedida'];
                }
              }

//              print_r($criterioeval);die;

              $row_datos="";
              $num_obj=1;

              foreach ($key_objetivos as $key => $obj) {
                $row_datos.=" <TR>";
                $numeracion= self::a_romano($num_obj).PHP_EOL. ". ";
                $num_obj++;
                $cell_denominacion="<TH align=left style=\"background:#E0E0DC;\" COLSPAN=\"2\">&nbsp;&nbsp;&nbsp;". $numeracion ."&nbsp;&nbsp;&nbsp;". $objetivos[$obj]['objetivo'];

                $cell_evaluacion_objetivo=" <TR> <TH align=left COLSPAN=\"2\">Evaluación del objetivo";
                foreach ($info as $key => $v) {
                  if($v['indicadorobjetivo']==1 && $v['idobjetivo']==$obj){
                    $cell_evaluacion_objetivo.=" <TR> 
                                    <TH align='left'; style ='font-size: 12px; font-family: normal; font-weight: normal;'>"."&nbsp;&nbsp;&nbsp;".$v['criterioev']." 
                                    <TH align='left'; style ='font-size: 12px; font-family: normal; font-weight: normal;'>"."&nbsp;&nbsp;&nbsp;".$v['criteriomedida'];
                  }
                }

                $num_ind=1;
                foreach ($indicadores[$obj] as $key => $ind) {
                  $cell_denominacion.=" <TR> <TH align=left COLSPAN=\"2\">". $num_ind ."&nbsp;&nbsp;&nbsp;". $ind['indicador'] ." (Criterio de medida)";
                  $num_ind++;
                  $cell_denominacion_criterios="";
                  foreach ($criterioeval[$ind['idindicador']] as $key => $criteval) {
                    if($criteval['indicadorobjetivo']==0){
                      $cell_denominacion_criterios.=" <TR> 
                                                 <TH align=left style ='font-size: 12px; font-family: normal; font-weight: normal;'>" ."&nbsp;&nbsp;&nbsp;". $criteval['criterioev']."
                                                 <TH align=left style ='font-size: 12px; font-family: normal; font-weight: normal;'>" ."&nbsp;&nbsp;&nbsp;".$array_criteriosmedida[$obj.$ind['idindicador'].$criteval['idcriterioevaluacion']];
                    }
                  }
                  $cell_denominacion.=$cell_denominacion_criterios;
                }

                $row_datos.=
                  $cell_denominacion.$cell_evaluacion_objetivo;

              }

              $tabla.=$row_datos;
              $tabla.="
                        </TABLE>
                        </BODY>
                        </HTML>";

                break;
            case 17://
              $info=self::getDatosReporteObjetivosActividadesAseguran($datos);
//              print_r($info);die;

              $tabla = " <HTML>
                    <BODY>
                    ".$row_title."
                    <TABLE id=\"tabladatos\" class=\"table\" CELLSPACING=\"0\" BORDER=\"1\" align=center CELLPADDING=\"3\"> ";

              $row_title=" <TR>
                                       <TH style=\"background:#E0E0DC;\" align=center><B>No.</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>ACTIVIDADES</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>PLAZOS</B>                                      
                                       <TH style=\"background:#E0E0DC;\" align=center><B>DIRIGE</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>PARTICIPANTES</B> 
                                       ";
              $tabla.=$row_title;

              $row_datos="";
              $num_obj=1;
              $num_act=1;
              foreach ($info as $key => $value) {
                $row_datos.=" <TR>";
                if($value['orden']==0){
                  $numeracion= self::a_romano($num_obj).PHP_EOL. ". ";
                  $num_obj++;
                  $num_act=1;
                  $cell_denominacion="<TH align=left COLSPAN=\"5\" style = 'font-size: 12px; font-family: normal; font-weight: normal;' >". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['actividades'];
                }else{

                  /******
                  Trabajo para las repeticiones
                   *****/

                  $tienerepeticiones = DatElementosDatElementos::EsPadredeActividad(
                    $value['idelemento'], $origen = 4, $datos
                  );

                  $rowspan=(count($tienerepeticiones)==0)?0:count($tienerepeticiones)+1;

                  $numeracion= $num_act. ". ";
                  $num_act++;
                  $cell_denominacion='
                                     <TH ROWSPAN='.$rowspan.' align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>&nbsp;&nbsp;&nbsp;'. $numeracion.'
                                     <TH ROWSPAN='.$rowspan.' align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['actividades'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['plazo'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['dirigentes'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['participantes'];

                  if (isset($tienerepeticiones[0])) {
                    foreach ($tienerepeticiones as $key => $repeticion) {
                      $row_actividad_info=DatObjetivo::getDatosActividad($repeticion['idelementohijo'])[0];
                      $cell_denominacion.='<TR>
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['plazo'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['dirigentes'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['participantes'];
                    }
                  }
                }
                $row_datos.=
                  $cell_denominacion;
              }

              $tabla.=$row_datos;
              $tabla.="
                        </TABLE>
                        </BODY>
                        </HTML>";
                break;
            case 18://
                $idarrayestados = implode(',', $datos->arrayestados);
                $datos->idestados = $idarrayestados;
                $datosObjetivos = DatElementos::objetivosFirma($datos);
                $tabla .= $Aprobado;
                $tabla .= $row_title."
                <TABLE border=0 align=center cellpadding=1 cellspacing=0>
                <TR>
                <TD width=546 COLSPAN=7 align=left>&nbsp;</TD>
                
                </TR>
                ";
                $count = 1;
                foreach ($datosObjetivos as $key => $value) {
                    $tabla.="
                <TR>
                <TD width=768 COLSPAN=7 align=left><p>" . self::a_romano($count) . ". &nbsp;&nbsp;&nbsp; " . $value['objetivo'] . "</p><BR/></TD>
                </TR>
                ";
                    $count ++;
                }
                $tabla.="
                </TABLE> <br/><br/><br/>
                
                ";

              $info=self::getDatosReporteObjetivosActividadesAseguran($datos);
//              print_r($info);die;

              $tabla .= " <TABLE id=\"tabladatos\" class=\"table\" CELLSPACING=\"0\" BORDER=\"1\" align=center CELLPADDING=\"3\"> ";

              $row_title="<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>Actividades que aseguran los objetivos de trabajo</B></H3>";

              $row_title.=" <TR>
                                       <TH style=\"background:#E0E0DC;\" align=center><B>No.</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>ACTIVIDADES</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>PLAZOS</B>                                      
                                       <TH style=\"background:#E0E0DC;\" align=center><B>DIRIGE</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>PARTICIPANTES</B> 
                                       ";

              $tabla.=$row_title;
             /**-------------------
                        Actividades que lo aseguran
             --------------------*/
              $row_datos="";
              $num_obj=1;
              $num_act=1;
              foreach ($info as $key => $value) {
                $row_datos.=" <TR>";
                if($value['orden']==0){
                  $numeracion= self::a_romano($num_obj).PHP_EOL. ". ";
                  $num_obj++;
                  $num_act=1;
                  $cell_denominacion="<TH align=left COLSPAN=\"5\" style = 'font-size: 12px; font-family: normal; font-weight: normal;' >". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['actividades'];
                }else{

                  /******
                  Trabajo para las repeticiones
                   *****/

                  $tienerepeticiones = DatElementosDatElementos::EsPadredeActividad(
                    $value['idelemento'], $origen = 4, $datos
                  );

                  $rowspan=(count($tienerepeticiones)==0)?0:count($tienerepeticiones)+1;

                  $numeracion= $num_act. ". ";
                  $num_act++;
                  $cell_denominacion='
                                     <TH ROWSPAN='.$rowspan.' align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>&nbsp;&nbsp;&nbsp;'. $numeracion.'
                                     <TH ROWSPAN='.$rowspan.' align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['actividades'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['plazo'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['dirigentes'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['participantes'];

                  if (isset($tienerepeticiones[0])) {
                    foreach ($tienerepeticiones as $key => $repeticion) {
                      $row_actividad_info=DatObjetivo::getDatosActividad($repeticion['idelementohijo'])[0];
                      $cell_denominacion.='<TR>
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['plazo'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['dirigentes'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['participantes'];
                    }
                  }
                }
                $row_datos.=
                  $cell_denominacion;
              }

              $tabla.=$row_datos;
              $tabla.="
                        </TABLE><br/><br/><br/> ";


              /**------------------  Trabajo con los indicadores-------------------**/

              $info=self::getDatosReporteObjetivosTrabajoCriteriosMedida($datos);
              //print_r($info);die;
              $tabla .= " <TABLE id=\"tabladatos\" class=\"table\" CELLSPACING=\"0\" BORDER=\"1\" align=center CELLPADDING=\"3\"> ";

              $row_title="<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>Evaluaciones de los objetivos y criterios de medida</B></H3>";

              $tabla .= $row_title;

              $objetivos=array();
              $key_objetivos=array();
              $indicadores=array();
              $key_indicadores=array();
              $criterioeval=array();
              $key_criterioeval=array();
              $o=0;
              foreach ($info as $key => $value) {
                if(array_search($value['idobjetivo'], $objetivos)===false){
                  $objetivos[$value['idobjetivo']]=$value;
                }
                if(array_search($value['idobjetivo'], $key_objetivos)===false)
                  $key_objetivos[$o++]=$value['idobjetivo'];
              }

//              print_r($key_objetivos);die;
              $i=0;
              $pos_ind=0;
              foreach ($key_objetivos as $key => $obj_value) {
                $aux_indicadores=array();
                foreach ($info as $key => $value) {
                  if($obj_value == $value['idobjetivo'] && array_search($value['idindicador'], $key_indicadores)===false){
                    $aux_indicadores[$pos_ind++]=$value;
                    $key_indicadores[$i++]=$value['idindicador'];
                  }
                }
                $indicadores[$obj_value]=$aux_indicadores;
              }

//              print_r($indicadores);die;

              $k=0;
              $pos_criteval=0;
              foreach ($key_indicadores as $key => $ind_value) {
                $aux_criterioeval=array();
                foreach ($info as $key => $value) {
                  if($ind_value == $value['idindicador'] && array_search($value['idcriterioevaluacion'], $key_criterioeval)===false){
                    $aux_criterioeval[$pos_criteval++]=$value;
                    $key_criterioeval[$k++]=$value['idcriterioevaluacion'];
                  }
                }
                $criterioeval[$ind_value]=$aux_criterioeval;
              }

              $array_criteriosmedida=array();
              $key_array_criteriosmedida=array();
              $num_cm=1;
              $cm=0;
              foreach ($info as $key => $value) {
                $key_criteriomedida="".$value['idobjetivo'].$value['idindicador'].$value['idcriterioevaluacion'];
                if(array_search($key_criteriomedida, $key_array_criteriosmedida)===false){
                  $num_cm=1;
                  $array_criteriosmedida[$key_criteriomedida]=$num_cm.". ".$value['criteriomedida'];
                  $key_array_criteriosmedida[$cm++]=$key_criteriomedida;
                }else{
                  $num_cm++;
                  $array_criteriosmedida[$key_criteriomedida].="<br/>&nbsp;&nbsp;&nbsp;".$num_cm.". ".$value['criteriomedida'];
                }
              }

              // print_r($array_criteriosmedida);

              $row_datos="";
              $num_obj=1;

              foreach ($key_objetivos as $key => $obj) {
                $row_datos.=" <TR>";
                $numeracion= self::a_romano($num_obj).PHP_EOL. ". ";
                $num_obj++;
                $cell_denominacion="<TH align=left style=\"background:#E0E0DC;\" COLSPAN=\"2\">&nbsp;&nbsp;&nbsp;". $numeracion ."&nbsp;&nbsp;&nbsp;". $objetivos[$obj]['objetivo'];

                $cell_evaluacion_objetivo=" <TR> <TH align=left COLSPAN=\"2\">Evaluación del objetivo";
                foreach ($info as $key => $v) {
                  if($v['indicadorobjetivo']==1 && $v['idobjetivo']==$obj){
                    $cell_evaluacion_objetivo.=" <TR> 
                                    <TH align='left'; style ='font-size: 12px; font-family: normal; font-weight: normal;'>"."&nbsp;&nbsp;&nbsp;".$v['criterioev']." 
                                    <TH align='left'; style ='font-size: 12px; font-family: normal; font-weight: normal;'>"."&nbsp;&nbsp;&nbsp;".$v['criteriomedida'];
                  }
                }

                $num_ind=1;
                foreach ($indicadores[$obj] as $key => $ind) {
                  $cell_denominacion.=" <TR> <TH align=left COLSPAN=\"2\">". $num_ind ."&nbsp;&nbsp;&nbsp;". $ind['indicador'] ." (Criterio de medida)";
                  $num_ind++;
                  $cell_denominacion_criterios="";
                  foreach ($criterioeval[$ind['idindicador']] as $key => $criteval) {
                    if($criteval['indicadorobjetivo']==0){
                      $cell_denominacion_criterios.=" <TR> 
                                                 <TH align=left style ='font-size: 12px; font-family: normal; font-weight: normal;'>" ."&nbsp;&nbsp;&nbsp;". $criteval['criterioev']."
                                                 <TH align=left style ='font-size: 12px; font-family: normal; font-weight: normal;'>" ."&nbsp;&nbsp;&nbsp;".$array_criteriosmedida[$obj.$ind['idindicador'].$criteval['idcriterioevaluacion']];
                    }
                  }
                  $cell_denominacion.=$cell_denominacion_criterios;
                }

                $row_datos.=
                  $cell_denominacion.$cell_evaluacion_objetivo;

              }

              $tabla.=$row_datos;
              $tabla.=" </TABLE> ";

              break;

            case 41:
              $yearOnly = ($datos->anoplan!="")?$datos->anoplan:"_________";
              $tituloReporte="OBJETIVOS DE TRABAJO DE ";
              $tituloReporte.=($datos->tituloreporte!='')?$datos->tituloreporte:"____________";
              $tituloReporte.="</BR>
                             Y PRINCIPALES ACTIVIDADES QUE LO ASEGURAN PARA EL AÑO DE PREPARACIÓN PARA LA DEFENSA ".$yearOnly;

              $row_title="<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>".
                $tituloReporte."</B></H3>";
              $info=self::getDatosReporteObjetivos($datos);
              //print_r($info);die;
              $tabla = " <HTML>
                    <br>".$Aprobado."<br/>".$row_title."
                    <TABLE width= '100%' align=left> ";
              $num_obj=1;
              $num_criterio=1;
              $arc_existentes=array();
              foreach ($info as $key => $value) {
                if(in_array($value['denarc'], $arc_existentes)){
                  if($value['orden']==0){
                    $numeracion= $num_obj;//self::a_romano($num_obj).PHP_EOL. ". ";
                    $num_obj++;
                    $num_criterio=1;
                    $cell_denominacion="<TD align=left >". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['objcriteriomedida'] ."</TD>";
                  }else{
                    $numeracion= ($num_obj-1).'.'. $num_criterio;
                    $num_criterio++;
                    $cell_denominacion="<TD align=left >". "&nbsp;&nbsp;&nbsp;". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['objcriteriomedida'] ."</TD>";
                  }
                }else{
                  $arc_existentes[count($arc_existentes)]=$value['denarc'];
                  $tabla .=  " <TR><TD align=left ><B>".  $value['denarc'] ."</B></TD></TR>";
                  if($value['orden']==0){
                    $numeracion= $num_obj;//self::a_romano($num_obj).PHP_EOL. ". ";
                    $num_obj++;
                    $num_criterio=1;
                    $cell_denominacion="<TD align=left >". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['objcriteriomedida'] ."</TD>";
                  }else{
                    $numeracion= ($num_obj-1).'.'. $num_criterio;
                    $num_criterio++;
                    $cell_denominacion="<TD align=left >". "&nbsp;&nbsp;&nbsp;". $numeracion ."&nbsp;&nbsp;&nbsp;".  $value['objcriteriomedida'] ."</TD>";
                  }
                }

                $tabla .=  " <TR>".$cell_denominacion."</TR>";
              }
              $tabla .= " </TABLE>";

              /**************************** ACTIVIDADES QUE ASEGURAN LOS OBJETIVOS DE TRABAJO ******************************************/

              $arrayArc=array();
              if($datos->idplan!=''){
                $class_ARC_Plan=new DatArcDatPlan();
                $arrayArc=$class_ARC_Plan->obtenerArcDadoPlan($datos->idplan, $datos->idusuariosession);
              }

//              print_r($info);die;

              $tabla_actividades = "<H3 align=center><B style ='font-size: 16px; font-family: 'Arial Black'; font-weight: normal; color=#000000'>
                              PRINCIPALES ACTIVIDADES QUE ASEGURAN LOS OBJETIVOS DE TRABAJO  </B></H3>
                         <TABLE class=\"table\" CELLSPACING=\"0\" BORDER=\"1\" width= '100%' align=center CELLPADDING=\"3\">
                         <TR>
                                       <TH style=\"background:#E0E0DC;\" align=center><B>No.</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>ACTIVIDADES</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>PLAZOS</B>                                      
                                       <TH style=\"background:#E0E0DC;\" align=center><B>DIRIGE</B> 
                                       <TH style=\"background:#E0E0DC;\" align=center><B>PARTICIPANTES</B> 
                                       ";

              $row_datos="";
              $class_arc=new DatArc();
              $class_plan_arc_actividades=new DatArcDatPlanActividades();

              foreach ($arrayArc as $value1){
                $array_actividades=$class_plan_arc_actividades->getArcPlanActAseguran($datos, $value1['idarc']);
                if(count($array_actividades)>0){
                  $row_datos.=" <TR>";
                  $info_arc=$class_arc->dameDatosARC($value1['idarc']);
                  $num_act=1;
                  $cell_denominacion="<TH align=left COLSPAN=\"5\" style = 'font-size: 12px; font-family: normal; font-weight: normal;' >".  $info_arc[0]['denarc'];
                  $row_datos.=
                    $cell_denominacion;

                  foreach ($array_actividades as $key => $value) {
                    /******
                    Trabajo para las repeticiones
                     *****/
                    $row_datos.=" <TR>";
                    $tienerepeticiones = DatElementosDatElementos::EsPadredeActividad(
                      $value['idactividad'], $origen = 4, $datos
                    );

                    $rowspan=(count($tienerepeticiones)==0)?0:count($tienerepeticiones)+1;

                    $numeracion= $num_act. ". ";
                    $num_act++;
                    $cell_denominacion='
                                     <TH ROWSPAN='.$rowspan.' align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>&nbsp;&nbsp;&nbsp;'. $numeracion.'
                                     <TH ROWSPAN='.$rowspan.' align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['denelemento'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['plazo'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['dirigentes'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $value['participantes'];

                    if (isset($tienerepeticiones[0])) {
                      foreach ($tienerepeticiones as $key => $repeticion) {
                        $row_actividad_info=DatObjetivo::getDatosActividad($repeticion['idelementohijo'])[0];
                        $cell_denominacion.='<TR>
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['plazo'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['dirigentes'].'
                                     <TH align=left style =\'font-size: 12px; font-family: normal; font-weight: normal;\'>'. $row_actividad_info['participantes'];
                      }
                    }
                    $row_datos.=
                      $cell_denominacion;
                  }
                }
              }


              $tabla_actividades.=$row_datos;
              $tabla_actividades.="</TABLE>";

              $tabla .= "</BR>".$tabla_actividades;


              $tabla .= $Elaborado."</BODY>
                    </HTML> ";
              break;
        }


        return $tabla;
    }


    public function getDatosReporteObjetivos($datos){
      $resultado=DatObjetivo::getDatosReporteObjetivos($datos);
      return $resultado;
    }
    public function getDatosReporteObjetivosTodosLoscampos($datos){
      $resultado=DatObjetivo::getDatosReporteObjetivos($datos);
      return $resultado;
    }
    public function getDatosReporteObjetivosActividadesAseguran($datos){
      $resultado=DatObjetivo::getDatosReporteObjetivosActividadesAseguran($datos);
      return $resultado;
    }

    public function getArcactividadesAseguran($datos){
      $resultado=DatArc::getArcactividadesAseguran($datos);
      return $resultado;
    }

    public function getDatosReporteObjetivosTrabajoCriteriosMedida($datos){
      $resultado=DatObjetivo::getDatosReporteObjetivosTrabajoCriteriosMedida($datos);
      return $resultado;
    }

  public function getDatosPuntualizacion($datos){
    $resultado=DatPuntualizacion::getDatosPuntualizacion($datos);
    return $resultado;
  }

  public function getDatosPuntualizacionGobierno($datos){
    $resultado=DatPuntualizacion::getDatosPuntualizacionGobierno($datos);
    return $resultado;
  }

  public function a_romano($integer, $upcase = true)
  {
    $table = array('M'=>1000, 'CM'=>900, 'D'=>500, 'CD'=>400, 'C'=>100,
                   'XC'=>90, 'L'=>50, 'XL'=>40, 'X'=>10, 'IX'=>9,
                   'V'=>5, 'IV'=>4, 'I'=>1);
    $return = '';
    while($integer > 0)
    {
      foreach($table as $rom=>$arb)
      {
        if($integer >= $arb)
        {
          $integer -= $arb;
          $return .= $rom;
          break;
        }
      }
    }
    return $return;
  }

}
