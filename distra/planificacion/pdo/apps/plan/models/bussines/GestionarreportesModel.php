<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class GestionarreportesModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function GenerarReporte(
        $idusuariosession, $valueanno, $textomeses, $valuemeses, $fechainicio,
        $fechafin, $idplan, $idreporte, $conductor, $nombreusuario,
        $encabezado, $piepagina, $principales, $confidencialidad,
        $textconfidencialidad,
        $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol, $operador,
        $arrayidnom,
        $arrayestados, $todoscrit
    ) {
        switch ($idreporte) {
            case '0':
                $reporte = $this->PlanActividadesPorAreas(
                    $idusuariosession, $valueanno, $textomeses, $valuemeses,
                    $fechainicio,
                    $fechafin, $idplan, $idreporte, $conductor, $nombreusuario,
                    $encabezado, $piepagina, $principales, $confidencialidad,
                    $textconfidencialidad,
                    $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol,
                    $operador, $arrayidnom,
                    $arrayestados, $todoscrit
                );
                break;
            case '1':
                $reporte = $this->ListadoActividades(
                    $idusuariosession, $valueanno, $textomeses, $valuemeses,
                    $fechainicio,
                    $fechafin, $idplan, $idreporte, $conductor, $nombreusuario,
                    $encabezado, $piepagina, $principales, $confidencialidad,
                    $textconfidencialidad,
                    $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol,
                    $operador, $arrayidnom,
                    $arrayestados, $todoscrit
                );
                break;
            case '2':
                $reporte = $this->ReporteMensual(
                    $idusuariosession, $valueanno, $textomeses, $valuemeses,
                    $fechainicio,
                    $fechafin, $idplan, $idreporte, $conductor, $nombreusuario,
                    $encabezado, $piepagina, $principales, $confidencialidad,
                    $textconfidencialidad,
                    $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol,
                    $operador, $arrayidnom,
                    $arrayestados, $todoscrit
                );
                break;
            case '3':
                $reporte = $this->PlanActividadesPorObjetivos(
                    $idusuariosession, $valueanno, $textomeses, $valuemeses,
                    $fechainicio,
                    $fechafin, $idplan, $idreporte, $conductor, $nombreusuario,
                    $encabezado, $piepagina, $principales, $confidencialidad,
                    $textconfidencialidad,
                    $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol,
                    $operador, $arrayidnom,
                    $arrayestados, $todoscrit
                );
                break;
        }
        return $reporte;
    }


    public function ListadoActividades(
        $idusuariosession, $valueanno, /*$textomeses,*/
        $valuemeses, $fechainicio,
        $fechafin, $idplan, $idreporte, /*$conductor, $nombreusuario,*/
        $encabezado, $piepagina, $principales, $confidencialidad,
        $textconfidencialidad,
        $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol, $operador,
        $arrayidnom,
        $arrayestados, $todoscrit
    ) {
        $arraydatosreporte = $this->DatosReporte(
            $idreporte, $valuemeses, $valueanno, $fechainicio, $fechafin
        );

        $tablareport = "";
        $tablareport .= "<tr><td><table width='1000' >" .
            "<tr>" .
            "<td colspan='8'><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp; </div></td>"
            .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<table width='1000'  cellspacing='0'
            bordercolor='#333333' bgcolor='#FFFFFF' style='font-size:12px ;
            font-weight:normal;'>";
        if ($confidencialidad == 'true') {
            $tablareport
                .= "<tr><td><table width='1000' cellspacing='0'
                    bordercolor='#333333' bgcolor='#FFFFFF' 
                    style='font-size:12px ;font-weight:normal;'>"
                .
                "<tr>" .
                "<td colspan='8'><div align='right'>" . $textconfidencialidad
                . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;</div></td>"
                .
                "</tr>" .
                "</table></td></tr>";
        }
        if ($encabezado == 'true') {
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                $idusuariosession
            );
            $tablareport
                .= "<tr><td><table border='0'style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td><div align='right'>APROBADO POR :</td>" .
                "<td><div align='center'>" . $configuracionfirma->cargoaprueba
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->gradoaprueba
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->nombreaprueba
                . "</td>" .
                "</tr>" .
                "</table></td></tr>";
        }
        $tablareport
            .= "<tr><td><table border='0'   style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<tr><td><table width='1000' border='0'style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td colspan='8'><div align='center'>" . $tituloreporte
            . "</div></td>" .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<tr><td><table border='0'style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "</table></td></tr>";
        if ($piepagina == 'true') {
            $tablareport
                .= "<tr><td><table width='1000'style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td>&nbsp;</td>" .
                "</tr>" .
                "<tr>" .
                "<td width='872'><div align='right'>CONFECCIONADO POR : </td>" .
                "<td width='288'><div align='center'>"
                . $configuracionfirma->cargoelabora . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->gradoelabora
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->nombrelabora
                . "</td>" .
                "</tr>" .
                "</table></td></tr>";
        }
        $tablareport .= "</table>";
        $tablareport .= "<tr><td><table width='1000' >" .
            "<tr>" .
            "<td colspan='8'><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp; </div></td>"
            .
            "</tr>" .
            "</table></td></tr>";
        //aki van las act principales
        $arrayidactividades = DatElementos::ObtenerActividadesReporte(
            $fechainicio, $fechafin, $arraydatosreporte['fechainicioD'],
            $arraydatosreporte['fechafinD'], $idplan, $arrayidautor,
            $arrayidinvol, $operador, $arrayidnom, $arrayestados,
            $todoscrit
        );
        if ($principales == 'true') {
            $tablareport
                .= "<table  width='1000' cellspacing='0' bordercolor='#333333'
                    bgcolor='#FFFFFF' style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "</tr>" .
                "<tr>" .
                "<td><div align='left'>ACTIVIDADES PRINCIPALES : </td>" .
                "</tr>";
            if (isset($arrayidactividades[0]['idelemento'])) {
                $conta = 1;
                foreach ($arrayidactividades as $key => $actividad) {
                    if ($actividad['esprincipal']) {
                        $tablareport .= "<tr>" .
                            "<td>" . $conta . '. ' . $actividad['denelemento']
                            . "</td>" .
                            "</tr>";
                        $conta++;
                    }
                }
            }
            $tablareport .= "</table>";
        }
        if ($rangofecha == 'true') {
            $tablareport
                .= "<table width='1000' cellspacing='0' bordercolor='#333333'
                    bgcolor='#FFFFFF' style='font-size:12px ;
                    font-weight:normal;''>"
                .
                "<tr>" .
                "<td width='919'><div align='right'>DESDE :"
                . $arraydatosreporte['desde'] . " </td>" .
                "<td width='241'><div align='center'>HASTA :"
                . $arraydatosreporte['hasta'] . " </td>" .
                "</tr>" .
                "</table>";
        }
        $tablareport
            .= "<table width='1000' bgcolor='#FFFFFF' cellspacing='0'
                style='font-size:12px ;font-weight:normal;border:1px 
                solid #000000;'>"
            .
            "<tr >" .
            "<td width='13' style='border:1px solid #000000;'>" .
            "<div align='center'><strong>No.</strong></div>" .
            "</td>" .
            "<td width='208' style='border:1px solid #000000;'>" .
            "<div align='center'><strong>Actividad</strong></div>" .
            "</td>" .
            "<td width='103' style='border:1px solid #000000;'>" .
            "<div align='center'><strong>Fecha Inicio </strong></div>" .
            "</td>" .
            "<td width='99' style='border:1px solid #000000;'>" .
            "<div align='center'><strong> Fecha fin </strong></div>" .
            "</td>" .
            "<td width='101' style='border:1px solid #000000;'>" .
            "<div align='center'><strong>Hora</strong></div>" .
            "</td>" .
            "<td width='101' style='border:1px solid #000000;'>" .
            "<div align='center'><strong>Lugar</strong></div>" .
            "</td>" .
            "<td width='136' style='border:1px solid #000000;'>" .
            "<div align='center'><strong>Dirige</strong></div>" .
            "</td>" .
            "<td width='166' style='border:1px solid #000000;'>" .
            "<div align='center'><strong>Participantes</strong></div>" .
            "</td>" .
            "</tr>";
        $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
            $arrayidactividades, &$arrayactividadesorg
        );
        if (isset($arrayactividadesorg['padres'])) {
            foreach ($arrayactividadesorg['padres'] as $key => $actpadre) {
                $key = $key + 1;
                $respuesta = $this->CrearListaHtmlDeActividades(
                    $key, $tablarep = '', $actpadre, $arrayactividadesorg
                );
                $tablareport .= $respuesta;
            }
        }
        $tablareport .= "</table>";
        $tablareport
            .= "<table width='1000' bordercolor='#333333' bgcolor='#FFFFFF'>" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>" .
            "<table width='1000' >" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>";
        return $tablareport;
    }

    public function OrganizarArrayPorPadresEHijos(
        $arrayactividades, $arrayactividadesorg
    ) {
        if (isset($arrayactividades[0])) {
            foreach (
                $arrayactividades as /* $key =>*/
                $actividad
            ) {
                $tienepadenarray = 0;
                $tieneactpadre = DatElementosDatElementos::EsElementoHijo(
                    $actividad['idelemento']
                );
                if (isset($tieneactpadre[0])) {
                    foreach ($tieneactpadre as $padre) {
                        foreach ($arrayactividades as $actividadp) {
                            if ($padre['idelementopadre']
                                == $actividadp['idelemento']
                            ) {
                                $tienepadenarray = 1;
                                $actividad['idpadres'][]
                                    = $actividadp['idelemento'];
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
        $cadenacontador, $tablareport, $actpadre, $arrayactividadesorg
    ) {
        $tablareport = $this->GenerarCuerpoLista($actpadre, $cadenacontador);
        if (isset($arrayactividadesorg['hijos'])) {
            $cont = 1;
            foreach (
                $arrayactividadesorg['hijos'] as /*$keyh =>*/
                $hijo
            ) {
                foreach ($hijo['idpadres'] as $idpadre) {
                    if ($idpadre == $actpadre['idelemento']) {
                        $cadenad = $cadenacontador;
                        $cadenad = $cadenad . '.' . $cont;
                        $cont++;
                        $tablareport .= $this->CrearListaHtmlDeActividades(
                            $cadenad, $tablareport, $hijo, $arrayactividadesorg
                        );
                    }
                }
            }
        }
        return $tablareport;
    }

    public function GenerarCuerpoLista($actividad, $cadenacontador)
    {
        $tienerepeticiones = DatElementosDatElementos::EsPadredeActividad(
            $actividad['idelemento'], $origen = 4
        );
        $fechinicio = split('-', $actividad['fechainicio']);
        $fechfin = split('-', $actividad['fechafin']);
        $cuerporeporte = "<tr style='font-size:12px ;font-weight:normal;'>" .
            "<td width='38' style='border:1px solid #000000;'>" .
            "<div align='left'>&nbsp;&nbsp;" . $cadenacontador . "</div>" .
            "</td>" .
            "<td width='183' style='border:1px solid #000000;'>" .
            "<div align='left'>" . $actividad['denelemento'] . "</div>" .
            "</td>" .
            "<td width='103' style='border:1px solid #000000;'>" .
            "<div align='center'>" . $fechinicio[2] . '-' . $fechinicio[1] . '-'
            . $fechinicio[0] . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objacthija = Doctrine::getTable('DatActividades')->find(
                    $repeticion['idelementohijo']
                );
                $fechiniciohija = split('-', $objacthija->fechainicio);
                $cuerporeporte
                    .= "<div align='center'>" . $fechiniciohija[2] . '-'
                    . $fechiniciohija[1] . '-' . $fechiniciohija[0] . "</div>";
            }
        }
        $cuerporeporte .= "</td>" .
            "<td width='99' style='border:1px solid #000000;'>" .
            "<div align='center'>" . $fechfin[2] . '-' . $fechfin[1] . '-'
            . $fechfin[0] . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objacthija = Doctrine::getTable('DatActividades')->find(
                    $repeticion['idelementohijo']
                );
                $fechafinhija = split('-', $objacthija->fechafin);
                $cuerporeporte
                    .= "<div align='center'>" . $fechafinhija[2] . '-'
                    . $fechafinhija[1] . '-' . $fechafinhija[0] . "</div>";
            }
        }
        $cuerporeporte .= "</td>" .
            "<td width='101' style='border:1px solid #000000;'>" .
            "<div align='center'>" . $actividad['horainicio'] . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objacthija = Doctrine::getTable('DatActividades')->find(
                    $repeticion['idelementohijo']
                );
                $cuerporeporte
                    .= "<div align='center'>" . $objacthija->horainicio
                    . "</div>";
            }
        }
        $cuerporeporte .= "</td>" .
            "<td width='101' style='border:1px solid #000000;'>";
        if ($actividad['lugar'] != '' && $actividad['lugar'] != null) {
            $cuerporeporte .= "<div align='center'>" . $actividad['lugar']
                . "</div>";
        } else {
            $cuerporeporte .= "<div align='center'>---</div>";
        }
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objacthija = Doctrine::getTable('DatActividades')->find(
                    $repeticion['idelementohijo']
                );
                if ($objacthija->lugar) {
                    $cuerporeporte
                        .= "<div align='center'>" . $objacthija->lugar
                        . "</div>";
                } else {
                    $cuerporeporte .= "<div align='center'>---</div>";
                }
            }
        }
        $cuerporeporte .= "</td>" .
            "<td width='136' style='border:1px solid #000000;'>";
        if ($actividad['dirigentes'] != ''
            && $actividad['dirigentes'] != null
        ) {
            $cuerporeporte .= "<div align='center'>" . $actividad['dirigentes']
                . "</div>";
        } else {
            $cuerporeporte .= "<div align='center'>---</div>";
        }
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objelemhija = Doctrine::getTable('DatElementos')->find(
                    $repeticion['idelementohijo']
                );
                if ($objelemhija->dirigente) {
                    $cuerporeporte
                        .= "<div align='center'>" . $objelemhija->dirigente
                        . "</div>";
                } else {
                    $cuerporeporte .= "<div align='center'>---</div>";
                }
            }
        }
        $cuerporeporte .= "</td>" .
            "<td width='136' style='border:1px solid #000000;'>";
        if ($actividad['participantes'] != ''
            && $actividad['participantes'] != null
        ) {
            $cuerporeporte
                .= "<div align='center'>" . $actividad['participantes']
                . "</div>";
        } else {
            $cuerporeporte .= "<div align='center'>---</div>";
        }
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objelemhija = Doctrine::getTable('DatElementos')->find(
                    $repeticion['idelementohijo']
                );
                if ($objelemhija->participante) {
                    $cuerporeporte
                        .= "<div align='center'>" . $objelemhija->participante
                        . "</div>";
                } else {
                    $cuerporeporte .= "<div align='center'>---</div>";
                }
            }
        }
        $cuerporeporte .= "</td>" .
            "</tr>";
        return $cuerporeporte;
    }


    public function ReporteMensual(
        $idusuariosession, $valueanno, /*$textomeses,*/
        $valuemeses, $fechainicio,
        $fechafin, $idplan, $idreporte, /*$conductor, $nombreusuario,*/
        $encabezado, $piepagina, $principales, $confidencialidad,
        $textconfidencialidad,
        $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol, $operador,
        $arrayidnom,
        $arrayestados, $todoscrit
    ) {
        $arraydatosreporte = $this->DatosReporte(
            $idreporte, $valuemeses, $valueanno, $fechainicio, $fechafin
        );
        $tablareport = "";
        $tablareport .= "<tr><td><table width='1000' >" .
            "<tr>" .
            "<td colspan='8'><div align='right'>&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<table width='1000'  cellspacing='0'
            bordercolor='#333333' bgcolor='#FFFFFF' 
            style='font-size:12px ;font-weight:normal;'>";
        if ($confidencialidad == 'true') {
            $tablareport
                .= "<tr><td><table width='1000' cellspacing='0'
                    bordercolor='#333333' bgcolor='#FFFFFF' 
                    style='font-size:12px ;font-weight:normal;'>"
                .
                "<tr>" .
                "<td colspan='8'><div align='right'>" . $textconfidencialidad
                . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;</div></td>"
                .
                "</tr>" .
                "</table></td></tr>";
        }
        if ($encabezado == 'true') {
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                $idusuariosession
            );
            $tablareport
                .= "<tr><td><table border='0'style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td><div align='right'>APROBADO POR :</td>" .
                "<td><div align='center'>" . $configuracionfirma->cargoaprueba
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->gradoaprueba
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->nombreaprueba
                . "</td>" .
                "</tr>" .
                "</table></td></tr>";
        }
        $tablareport
            .= "<tr><td><table border='0'   style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<tr><td><table width='1000' border='0'style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td colspan='8'><div align='center'>" . $tituloreporte
            . "</div></td>" .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<tr><td><table border='0'style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "</table></td></tr>";
        if ($piepagina == 'true') {
            $tablareport
                .= "<tr><td><table width='1000'style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td>&nbsp;</td>" .
                "</tr>" .
                "<tr>" .
                "<td width='872'><div align='right'>CONFECCIONADO POR : </td>" .
                "<td width='288'><div align='center'>"
                . $configuracionfirma->cargoelabora . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->gradoelabora
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->nombrelabora
                . "</td>" .
                "</tr>" .
                "</table></td></tr>";
        }
        $tablareport .= "</table>";
        $tablareport .= "<tr><td><table width='1000' >" .
            "<tr>" .
            "<td colspan='8'><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp; </div></td>"
            .
            "</tr>" .
            "</table></td></tr>";
        //aki van las act principales
        $arrayidactividades = DatElementos::ObtenerActividadesReporte(
            $fechainicio, $fechafin, $arraydatosreporte['fechainicioD'],
            $arraydatosreporte['fechafinD'], $idplan, $arrayidautor,
            $arrayidinvol, $operador, $arrayidnom, $arrayestados,
            $todoscrit
        );
        if ($principales == 'true') {
            $tablareport
                .= "<table  width='1000' cellspacing='0' bordercolor='#333333'
                    bgcolor='#FFFFFF' style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "</tr>" .
                "<tr>" .
                "<td><div align='left'>ACTIVIDADES PRINCIPALES : </td>" .
                "</tr>";
            if (isset($arrayidactividades[0]['idelemento'])) {
                $conta = 1;
                foreach (
                    $arrayidactividades as /*$key =>*/
                    $actividad
                ) {
                    if ($actividad['esprincipal']) {
                        $tablareport .= "<tr>" .
                            "<td>" . $conta . '. ' . $actividad['denelemento']
                            . "</td>" .
                            "</tr>";
                        $conta++;
                    }
                }
            }
            $tablareport .= "</table>";
        }
        if ($rangofecha == 'true') {
            $tablareport
                .= "<table width='1000' cellspacing='0' bordercolor='#333333'
                    bgcolor='#FFFFFF' style='font-size:12px ;
                    font-weight:normal;''>"
                .
                "<tr>" .
                "<td width='919'><div align='right'>DESDE :"
                . $arraydatosreporte['desde'] . " </td>" .
                "<td width='241'><div align='center'>HASTA :"
                . $arraydatosreporte['hasta'] . " </td>" .
                "</tr>" .
                "</table>";
        }
        $cero = 0;
        $uno = 1;
        $idinvolresp = $idusuariosession . $cero;
        $idinvolejec = $idusuariosession . $uno;
        $cont = 0;
        $arrayinvol[$cont]['idinvolucrado'] = $idinvolresp;
        $cont++;
        $arrayinvol[$cont]['idinvolucrado'] = $idinvolejec;
        $cont++;
        $arraygrupos
            = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
            $idusuariosession
        );
        if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $grupo) {
                $idgrupo = $grupo['idgrupo'];
                $idinvolresp = $idgrupo . $cero;
                $idinvolejec = $idgrupo . $uno;
                $arrayinvol[$cont]['idinvolucrado'] = $idinvolresp;
                $cont++;
                $arrayinvol[$cont]['idinvolucrado'] = $idinvolejec;
                $cont++;
            }
        }
        for ($i = 1; $i <= $arraydatosreporte['cantdiasmes']; $i++) {
            if ($i < 10) {
                $day = '0' . $i;
                $arrayfechas[$i] = $day;//."/".$valuemeses."/".$valueanno; 
            }
            if ($i >= 10) {
                $day = $i;
                $arrayfechas[$i] = $day;//."/".$valuemeses."/".$valueanno;
            }
            $fechainicio = $fechafin = date(
                'd-m-Y', mktime(00, 00, 00, $valuemeses, $i, $valueanno)
            );
            $arrayactividadespordia
                = DatElementos::/*ObtenerActividadesReportePorDias*/
            ObtenerActividadesReporte(
                $fechainicio, $fechafin, null,
                null, $idplan, $arrayidautor, $arrayidinvol, $operador,
                $arrayidnom, $arrayestados,
                $todoscrit
            );
            if (isset($arrayactividadespordia[0]['idelemento'])) {
                foreach ($arrayactividadespordia as $p => $actividad) {
                    $actividades[$i][$p]['hora']
                        = $actividad['horainicio'];//$objact->horainicio;
                    $actividades[$i][$p]['fechainicio']
                        = $actividad['fechainicio'];//$objact->fechainicio;
                    $actividades[$i][$p]['fechafin']
                        = $actividad['fechafin'];//$objact->fechafin;
                    $actividades[$i][$p]['titulo']
                        = $actividad['denelemento'];//$objelemento->denelemento;
                }
            }
        }
        $contador = 1;
        $fecha = '';
        $fechaconcurrente = date(
            'w', mktime(00, 00, 00, $valuemeses, 01, $valueanno)
        );
        $tablareport
            .= "<table width='1000' border='1' cellspacing='0'
                bordercolor='#333333' bgcolor='#FFFFFF' style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td width='262' bgcolor='#EAEAEA'><div 
                align='center'><strong>Domingo</strong></td>"
            .
            "<td width='262' bgcolor='#EAEAEA'><div 
                align='center'><strong>Lunes</strong></td>"
            .
            "<td width='262' bgcolor='#EAEAEA'><div 
                align='center'><strong>Martes</strong></td>"
            .
            "<td width='262' bgcolor='#EAEAEA'><div 
                align='center'><strong>Mi&eacute;rcoles</strong></td>"
            .
            "<td width='262' bgcolor='#EAEAEA'><div 
                align='center'><strong>Jueves</strong></td>"
            .
            "<td width='262' bgcolor='#EAEAEA'><div 
                align='center'><strong>Viernes</strong></td>"
            .
            "<td width='262' bgcolor='#EAEAEA'><div 
                align='center'><strong>S&aacute;bado</strong></td>"
            .
            "</tr>";
        $tablareport .= "<tr>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        if ($fechaconcurrente == 0) {
            $fecha = $arrayfechas[1];
            $arraycontfilaA[0] = $contador;
            $contador++;
        }
        if ($fechaconcurrente > 0) {
            $fecha = '&nbsp;';
        }
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        if ($fechaconcurrente == 1) {
            $fecha = $arrayfechas[1];
            $arraycontfilaA[1] = $contador;
            $contador++;
        }
        if ($fechaconcurrente < 1) {
            $fecha = $arrayfechas[$contador];
            $arraycontfilaA[1] = $contador;
            $contador++;
        }
        if ($fechaconcurrente > 1) {
            $fecha = '&nbsp;';
        }
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        if ($fechaconcurrente == 2) {
            $fecha = $arrayfechas[1];
            $arraycontfilaA[2] = $contador;
            $contador++;
        }
        if ($fechaconcurrente < 2) {
            $fecha = $arrayfechas[$contador];
            $arraycontfilaA[2] = $contador;
            $contador++;
        }
        if ($fechaconcurrente > 2) {
            $fecha = '&nbsp;';
        }
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        if ($fechaconcurrente == 3) {
            $fecha = $arrayfechas[1];
            $arraycontfilaA[3] = $contador;
            $contador++;
        }
        if ($fechaconcurrente < 3) {
            $fecha = $arrayfechas[$contador];
            $arraycontfilaA[3] = $contador;
            $contador++;
        }
        if ($fechaconcurrente > 3) {
            $fecha = '&nbsp;';
        }
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        if ($fechaconcurrente == 4) {
            $fecha = $arrayfechas[1];
            $arraycontfilaA[4] = $contador;
            $contador++;
        }
        if ($fechaconcurrente < 4) {
            $fecha = $arrayfechas[$contador];
            $arraycontfilaA[4] = $contador;
            $contador++;
        }
        if ($fechaconcurrente > 4) {
            $fecha = '&nbsp;';
        }
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        if ($fechaconcurrente == 5) {
            $fecha = $arrayfechas[1];
            $arraycontfilaA[5] = $contador;
            $contador++;
        }
        if ($fechaconcurrente < 5) {
            $fecha = $arrayfechas[$contador];
            $arraycontfilaA[5] = $contador;
            $contador++;
        }
        if ($fechaconcurrente > 5) {
            $fecha = '&nbsp;';
        }
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        if ($fechaconcurrente == 6) {
            $fecha = $arrayfechas[1];
            $arraycontfilaA[6] = $contador;
            $contador++;
        }
        if ($fechaconcurrente < 6) {
            $fecha = $arrayfechas[$contador];
            $arraycontfilaA[6] = $contador;
            $contador++;
        }
        if ($fechaconcurrente > 6) {
            $fecha = '&nbsp;';
        }
        $tablareport .= $fecha . "</td>" .
            "</tr>" .
            "<tr>" .
            "<td width='262'  height='50'>";
        if ($fechaconcurrente == 0) {
            $fecha = $arrayfechas[1];
            //$contador++;
        }
        if ($fechaconcurrente > 0) {
            $fecha = '';
        }
        if (($fecha != '') && (count($actividades[$arraycontfilaA[0]]) > 0)) {
            $val = count($actividades[$arraycontfilaA[0]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arraycontfilaA[0]][$i]['hora'] . " "
                    . $actividades[$arraycontfilaA[0]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '') || (count($actividades[$arraycontfilaA[0]]) == 0)) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        if ($fechaconcurrente == 1) {
            $fecha = $arrayfechas[1];
            //$contador++;
        }
        if ($fechaconcurrente < 1) {
            $fecha = $arrayfechas[$contador];
            //$contador++;
        }
        if ($fechaconcurrente > 1) {
            $fecha = '';
        }
        if (($fecha != '') && (count($actividades[$arraycontfilaA[1]]) > 0)) {
            $val = count($actividades[$arraycontfilaA[1]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arraycontfilaA[1]][$i]['hora'] . " "
                    . $actividades[$arraycontfilaA[1]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '') || (count($actividades[$arraycontfilaA[1]]) == 0)) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        if ($fechaconcurrente == 2) {
            $fecha = $arrayfechas[1];
            //$contador++;
        }
        if ($fechaconcurrente < 2) {
            $fecha = $arrayfechas[$contador];
            //$contador++;
        }
        if ($fechaconcurrente > 2) {
            $fecha = '';
        }
        if (($fecha != '') && (count($actividades[$arraycontfilaA[2]]) > 0)) {
            $val = count($actividades[$arraycontfilaA[2]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arraycontfilaA[2]][$i]['hora'] . " "
                    . $actividades[$arraycontfilaA[2]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '') || (count($actividades[$arraycontfilaA[2]]) == 0)) {
            $tablareport .= "&nbsp;</td>";
        }

        $tablareport .= "<td width='262' height='50'>";
        if ($fechaconcurrente == 3) {
            $fecha = $arrayfechas[1];
            //$contador++;
        }
        if ($fechaconcurrente < 3) {
            $fecha = $arrayfechas[$contador];
            //$contador++;
        }
        if ($fechaconcurrente > 3) {
            $fecha = '';
        }
        if (($fecha != '') && (count($actividades[$arraycontfilaA[3]]) > 0)) {
            $val = count($actividades[$arraycontfilaA[3]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arraycontfilaA[3]][$i]['hora'] . " "
                    . $actividades[$arraycontfilaA[3]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '') || (count($actividades[$arraycontfilaA[3]]) == 0)) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        if ($fechaconcurrente == 4) {
            $fecha = $arrayfechas[1];
            //$contador++;
        }
        if ($fechaconcurrente < 4) {
            $fecha = $arrayfechas[$contador];
            //$contador++;
        }
        if ($fechaconcurrente > 4) {
            $fecha = '';
        }
        if (($fecha != '') && (count($actividades[$arraycontfilaA[4]]) > 0)) {
            $val = count($actividades[$arraycontfilaA[4]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arraycontfilaA[4]][$i]['hora'] . " "
                    . $actividades[$arraycontfilaA[4]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '') || (count($actividades[$arraycontfilaA[4]]) == 0)) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        if ($fechaconcurrente == 5) {
            $fecha = $arrayfechas[1];
            //$contador++;
        }
        if ($fechaconcurrente < 5) {
            $fecha = $arrayfechas[$contador];
            //$contador++;
        }
        if ($fechaconcurrente > 5) {
            $fecha = '';
        }
        if (($fecha != '') && (count($actividades[$arraycontfilaA[5]]) > 0)) {
            $val = count($actividades[$arraycontfilaA[5]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arraycontfilaA[5]][$i]['hora'] . " "
                    . $actividades[$arraycontfilaA[5]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '') || (count($actividades[$arraycontfilaA[5]]) == 0)) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262'  height='50'>";
        if ($fechaconcurrente == 6) {
            $fecha = $arrayfechas[1];
            //$contador++;
        }
        if ($fechaconcurrente < 6) {
            $fecha = $arrayfechas[$contador];
            //$contador++;
        }
        if ($fechaconcurrente > 6) {
            $fecha = '';
        }
        if (($fecha != '') && (count($actividades[$arraycontfilaA[6]]) > 0)) {
            $val = count($actividades[$arraycontfilaA[6]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arraycontfilaA[6]][$i]['hora'] . " "
                    . $actividades[$arraycontfilaA[6]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '') || (count($actividades[$arraycontfilaA[6]]) == 0)) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= " </tr>" .
            "<tr>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaB = array();
        $arrayfechasfilaB[0] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaB[1] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaB[2] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaB[3] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaB[4] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaB[5] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaB[6] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "</tr>" .

            "<tr>" .
            "<td width='262'  height='50'>";
        $fecha = $arrayfechasfilaB[0];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaB[0]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaB[0]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaB[0]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaB[0]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaB[0]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaB[1];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaB[1]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaB[1]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaB[1]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaB[1]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaB[1]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaB[2];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaB[2]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaB[2]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaB[2]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaB[2]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaB[2]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaB[3];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaB[3]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaB[3]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaB[3]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaB[3]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaB[3]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaB[4];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaB[4]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaB[4]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaB[4]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaB[4]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaB[4]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaB[5];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaB[5]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaB[5]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaB[5]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaB[5]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaB[5]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262'  height='50'>";
        $fecha = $arrayfechasfilaB[6];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaB[6]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaB[6]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaB[6]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaB[6]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaB[6]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= " </tr>" .
            "<tr>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaC = array();
        $arrayfechasfilaC[0] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaC[1] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaC[2] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaC[3] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaC[4] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaC[5] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaC[6] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "</tr>" .

            "<tr>" .
            "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaC[0];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaC[0]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaC[0]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaC[0]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaC[0]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaC[0]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaC[1];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaC[1]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaC[1]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaC[1]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaC[1]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaC[1]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaC[2];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaC[2]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaC[2]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaC[2]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaC[2]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaC[2]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaC[3];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaC[3]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaC[3]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaC[3]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaC[3]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaC[3]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaC[4];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaC[4]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaC[4]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaC[4]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaC[4]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaC[4]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaC[5];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaC[5]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaC[5]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaC[5]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaC[5]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaC[5]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaC[6];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaC[6]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaC[6]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaC[6]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaC[6]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaC[6]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "</tr>" .
            "<tr>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaD = array();
        $arrayfechasfilaD[0] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaD[1] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaD[2] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaD[3] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaD[4] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaD[5] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaD[6] = $contador;
        $fecha = $arrayfechas[$contador];
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "</tr>" .
            "<tr>" .
            "<td width='262'  height='50'>";
        $fecha = $arrayfechasfilaD[0];

        if (($fecha != '') && (count($actividades[$arrayfechasfilaD[0]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaD[0]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaD[0]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaD[0]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaD[0]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaD[1];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaD[1]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaD[1]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaD[1]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaD[1]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaD[1]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaD[2];

        if (($fecha != '') && (count($actividades[$arrayfechasfilaD[2]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaD[2]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaD[2]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaD[2]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaD[2]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaD[3];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaD[3]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaD[3]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaD[3]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaD[3]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaD[3]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaD[4];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaD[4]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaD[4]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaD[4]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaD[4]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaD[4]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaD[5];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaD[5]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaD[5]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaD[5]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaD[5]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaD[5]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262'  height='50'>";
        if (($fecha != '') && (count($actividades[$arrayfechasfilaD[6]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaD[6]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaD[6]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaD[6]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaD[6]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= " </tr>" .
            "<tr>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaE = array();
        $arrayfechasfilaE[0] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaE[1] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaE[2] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaE[3] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaE[4] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaE[5] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .

            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaE[6] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "</tr>" .

            "<tr>" .
            "<td width='262'  height='50' >";
        $fecha = $arrayfechasfilaE[0];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaE[0]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaE[0]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaE[0]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaE[0]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaE[0]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaE[1];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaE[1]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaE[1]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaE[1]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaE[1]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaE[1]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaE[2];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaE[2]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaE[2]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaE[2]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaE[2]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaE[2]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaE[3];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaE[3]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaE[3]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaE[3]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaE[3]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaE[3]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaE[4];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaE[4]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaE[4]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaE[4]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaE[4]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaE[4]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaE[5];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaE[5]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaE[5]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaE[5]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaE[5]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaE[5]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaE[6];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaE[6]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaE[6]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaE[6]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaE[6]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaE[6]]) == 0)
        ) {
            $tablareport .= " &nbsp;</td>";
        }
        $tablareport .= "</tr>" .
            "<tr>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaF = array();
        $arrayfechasfilaF[0] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaF[1] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaF[2] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaF[3] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaF[4] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaF[5] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "<td width='262' bgcolor='#EAEAEA'><div align='right'>";
        $arrayfechasfilaF[6] = $contador;
        $fecha = $arrayfechas[$contador];
        if ($fecha == '') {
            $fecha = '&nbsp;';
        }
        $contador++;
        $tablareport .= $fecha . "</td>" .
            "</tr>" .
            "<tr>" .
            "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaF[0];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaF[0]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaF[0]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaF[0]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaF[0]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaF[0]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaF[1];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaF[1]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaF[1]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaF[1]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaF[1]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaF[1]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaF[2];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaF[2]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaF[2]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaF[2]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaF[2]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaF[2]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaF[3];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaF[3]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaF[3]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaF[3]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaF[3]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaF[3]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaF[4];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaF[4]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaF[4]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaF[4]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaF[4]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaF[4]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50' >";
        $fecha = $arrayfechasfilaF[5];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaF[5]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaF[5]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaF[5]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaF[5]][$i]['titulo']
                    . "<br> ";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaF[5]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "<td width='262' height='50'>";
        $fecha = $arrayfechasfilaF[6];
        if (($fecha != '') && (count($actividades[$arrayfechasfilaF[6]]) > 0)) {
            $val = count($actividades[$arrayfechasfilaF[5]]);
            for ($i = 0; $i < $val; $i++) {
                $tablareport
                    .= $actividades[$arrayfechasfilaF[5]][$i]['hora'] . " "
                    . $actividades[$arrayfechasfilaF[5]][$i]['titulo'] . "<br>";
            }
            $tablareport .= "</td>";
        }
        if (($fecha == '')
            || (count($actividades[$arrayfechasfilaF[5]]) == 0)
        ) {
            $tablareport .= "&nbsp;</td>";
        }
        $tablareport .= "</tr>";
        $tablareport .= "</table>";
        $tablareport
            .= "<table width='1000' bordercolor='#333333' bgcolor='#FFFFFF'>" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>" .
            "<table width='1000' >" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>";
        return $tablareport;
    }

    public function PlanActividadesPorAreas(
        $idusuariosession, $valueanno, /*$textomeses,*/
        $valuemeses, $fechainicio,
        $fechafin, $idplan, $idreporte,/* $conductor, $nombreusuario,*/
        $encabezado, $piepagina, $principales, $confidencialidad,
        $textconfidencialidad,
        $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol, $operador,
        $arrayidnom,
        $arrayestados, $todoscrit
    ) {
        $arraydatosreporte = $this->DatosReporte(
            $idreporte, $valuemeses, $valueanno, $fechainicio, $fechafin
        );
        $tablareport = "";
        $tablareport .= "<table width='1733' >" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>";
        $tablareport
            .= "<table width='1733'  cellspacing='0'
            bordercolor='#333333' bgcolor='#FFFFFF' 
            style='font-size:12px ;font-weight:normal;'>";
        if ($confidencialidad == 'true') {
            $tablareport
                .= "<tr><td><table width='1733' cellspacing='0'
                    bordercolor='#333333' bgcolor='#FFFFFF' 
                    style='font-size:12px ;font-weight:normal;'>"
                .
                "<tr>" .
                "<td colspan='8'><div align='right'>" . $textconfidencialidad
                . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;</div></td>"
                .
                "</tr>" .
                "</table></td></tr>";
        }
        if ($encabezado == 'true') {
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                $idusuariosession
            );
            $tablareport
                .= "<tr><td><table border='0'style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td><div align='right'>APROBADO POR :</td>" .
                "<td><div align='center'>" . $configuracionfirma->cargoaprueba
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->gradoaprueba
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->nombreaprueba
                . "</td>" .
                "</tr>" .
                "</table></td></tr>";
        }
        $tablareport
            .= "<tr><td><table border='0'   style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<tr><td><table width='1733' border='0'style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td colspan='8'><div align='center'>" . $tituloreporte
            . "</div></td>" .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<tr><td><table border='0'style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "</table></td></tr>";
        if ($piepagina == 'true') {
            $tablareport
                .= "<tr><td><table width='1733'style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td>&nbsp;</td>" .
                "</tr>" .
                "<tr>" .
                "<td width='872'><div align='right'>CONFECCIONADO POR : </td>" .
                "<td width='288'><div align='center'>"
                . $configuracionfirma->cargoelabora . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->gradoelabora
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->nombrelabora
                . "</td>" .
                "</tr>" .
                "</table></td></tr>";
        }
        $tablareport .= "</table>";
        $tablareport .= "<tr><td><table width='1733' >" .
            "<tr>" .
            "<td colspan='8'><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp; </div></td>"
            .
            "</tr>" .
            "</table></td></tr>";
        //aki van las act principales
        $arrayidactividades = DatElementos::ObtenerActividadesReporte(
            $fechainicio, $fechafin, $arraydatosreporte['fechainicioD'],
            $arraydatosreporte['fechafinD'], $idplan, $arrayidautor,
            $arrayidinvol, $operador, $arrayidnom, $arrayestados,
            $todoscrit
        );
        if ($principales == 'true') {
            $tablareport
                .= "<table  width='1733' cellspacing='0' bordercolor='#333333'
                    bgcolor='#FFFFFF' style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "</tr>" .
                "<tr>" .
                "<td><div align='left'>ACTIVIDADES PRINCIPALES : </td>" .
                "</tr>";
            if (isset($arrayidactividades[0]['idelemento'])) {
                $conta = 1;
                foreach ($arrayidactividades as $key => $actividad) {
                    if ($actividad['esprincipal']) {
                        $tablareport .= "<tr>" .
                            "<td>" . $conta . '. ' . $actividad['denelemento']
                            . "</td>" .
                            "</tr>";
                        $conta++;
                    }
                }
            }
            $tablareport .= "</table>";
        }
        if ($rangofecha == 'true') {
            $tablareport
                .= "<table width='1733' cellspacing='0' bordercolor='#333333'
                    bgcolor='#FFFFFF' style='font-size:12px ;
                    font-weight:normal;''>"
                .
                "<tr>" .
                "<td width='919'><div align='right'>DESDE :"
                . $arraydatosreporte['desde'] . " </td>" .
                "<td width='241'><div align='center'>HASTA :"
                . $arraydatosreporte['hasta'] . " </td>" .
                "</tr>" .
                "</table>";
        }
        $tablareport
            .= "<table width='1733'  border='1' cellspacing='0'
                bordercolor='#333333' bgcolor='#FFFFFF' 
                style='font-size:12px ;font-weight:normal;'>"
            .
            "<tr>" .
            "<td width='50' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>No</strong>.</div></td>"
            .
            "<td width='437' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>Actividades</strong></div></td>"
            .
            "<td colspan='12' bordercolor='#333333' ><div 
                align='center'><strong>Meses</strong></div></td>"
            .
            "<td width='157' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>Dirige</strong></div></td>"
            .
            "<td width='256' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>Participantes</strong></div></td>"
            .
            "<td width='280' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>Observaciones sobre<br> 
                el cumplimiento</strong></div></td>"
            .
            "</tr>" .
            "<tr>" .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>E</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>F</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>M</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>A</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>M</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>J</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>J</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>A</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>S</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>O</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>N</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>D</strong></div></td>"
            .
            "</tr>";
        $arrayarcplan = DatArcDatPlan::ObtenerAreasPorPlanesSQL($idplan);
        $cont = 1;
        if (isset($arrayarcplan[0])) {
            $arrayarcplan = $this->OrganizarArcPorPadresEHijos($arrayarcplan);
            foreach ($arrayarcplan as $key => $arc) {
                if ($arc['idarcp'] == null) {
                    $tablareport .= $this->GenerarCuerpoReporteARCPlan(
                        $cont, $arc, $arrayarcplan, $tablareport, $idplan,
                        $cadena = ''
                    );
                    $cont++;
                }
            }
        }
        $arc['idarc'] = 'arc';
        $arc['idarcp'] = 'null';
        $arc['denarc'] = 'Otras actividades vinculadas al plan';
        $tablareport .= $this->GenerarCuerpoReporteARCPlan(
            $cont, $arc, $arrayarcplan, $tablareport, $idplan, $cadena = ''
        );
        $tablareport .= "</table>";
        $tablareport
            .= "<table width='1733' bordercolor='#333333' bgcolor='#FFFFFF'>" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>" .
            "<table width='1733' >" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>";
        return $tablareport;
    }


    public function OrganizarArcPorPadresEHijos($arrayarcplan)
    {
        if (isset($arrayarcplan[0])) {
            foreach ($arrayarcplan as $key => $arc) {
                if ($arc['idarc'] == $arc['idarcp']) {
                    $arrayarcplan[$key]['idarcp'] = null;
                }
            }
        }
        return $arrayarcplan;
    }

    public function GenerarCuerpoReporteARCPlan(
        $cont, $arc, $arrayarcplan, $tablareport, $idplan, $cadena
    ) {
        $num = $this->ConvertirEnterosARomanos($cont);
        if ($cadena != "") {
            $cadena = $cadena . "." . $num;
        } else {
            $cadena = $num;
        }
        $tablareport = "<tr>" .
            "<td colspan='17' bordercolor='#333333'>" . $cadena . "- "
            . $arc['denarc'] . "</td>" .
            "</tr>";
        $arrayactarcplan = DatElementos::ObtenerActividadesVinculadasARCPlan(
            $idplan, $arc['idarc']
        );
        if (isset($arrayactarcplan[0])) {
            $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
                $arrayactarcplan, &$arrayactividadesorg
            );
            if (isset($arrayactividadesorg['padres'])) {
                foreach ($arrayactividadesorg['padres'] as $key => $actpadre) {
                    $key = $key + 1;
                    $respuesta = $this->CrearListaHtmlDeARCPlanActividades(
                        $key, $tablarep = '', $actpadre, $arrayactividadesorg
                    );
                    $tablareport .= $respuesta;
                }
            }
        }
        $contador = 1;
        foreach ($arrayarcplan as $arcplan) {
            if ($arcplan['idarcp'] == $arc['idarc']) {
                $tablareport .= $this->GenerarCuerpoReporteARCPlan(
                    $contador, $arcplan, $arrayarcplan, $tablareport, $idplan,
                    $cadena
                );
                $contador++;
            }
        }
        return $tablareport;
    }


    public function CrearListaHtmlDeARCPlanActividades(
        $cadenacontador, $tablareport, $actpadre, $arrayactividadesorg
    ) {
        $tablareport = $this->GenerarCuerpoReporteARCPlanActividades(
            $actpadre, $cadenacontador
        );
        if (isset($arrayactividadesorg['hijos'])) {
            $cont = 1;
            foreach (
                $arrayactividadesorg['hijos'] as /*$keyh =>*/
                $hijo
            ) {
                foreach ($hijo['idpadres'] as $idpadre) {
                    if ($idpadre == $actpadre['idelemento']) {
                        $cadenad = $cadenacontador;
                        $cadenad = $cadenad . '.' . $cont;
                        $cont++;
                        $tablareport .= $this->CrearListaHtmlDeARCPlanActividades(
                            $cadenad, $tablareport, $hijo, $arrayactividadesorg
                        );
                    }
                }
            }
        }
        return $tablareport;
    }

    public function GenerarCuerpoReporteARCPlanActividades(
        $actpadre, $cadenacontador
    ) {
        $tienerepeticiones = DatElementosDatElementos::EsPadredeActividad(
            $actpadre['idelemento'], $origen = 4
        );
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
        $tablareport .= "<td width='50'>" .
            "<div align='left'>&nbsp;" . $cadenacontador . "</div>" .
            "</td>" .
            "<td width='437' >" .
            "<div align='left'>" . "&nbsp;" . $actpadre['denelemento']
            . "</div>" .
            "</td>" .

            "<td width='41'cellspacing='0'>" .
            "<div align='center'>" . $fechasinicio[1] . $fechasfin[1]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][1]
                    . $arrayfechainicioFin['fechasfin'][1] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            " <div align='center'>" . $fechasinicio[2] . $fechasfin[2]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][2]
                    . $arrayfechainicioFin['fechasfin'][2] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[3] . $fechasfin[3]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][3]
                    . $arrayfechainicioFin['fechasfin'][3] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[4] . $fechasfin[4]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][4]
                    . $arrayfechainicioFin['fechasfin'][4] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[5] . $fechasfin[5]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][5]
                    . $arrayfechainicioFin['fechasfin'][5] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[6] . $fechasfin[6]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][6]
                    . $arrayfechainicioFin['fechasfin'][6] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[7] . $fechasfin[7]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][7]
                    . $arrayfechainicioFin['fechasfin'][7] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[8] . $fechasfin[8]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][8]
                    . $arrayfechainicioFin['fechasfin'][8] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[9] . $fechasfin[9]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][9]
                    . $arrayfechainicioFin['fechasfin'][9] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[10] . $fechasfin[10]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][10]
                    . $arrayfechainicioFin['fechasfin'][10] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            "<div align='center'>" . $fechasinicio[11] . $fechasfin[11]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][11]
                    . $arrayfechainicioFin['fechasfin'][11] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='41'>" .
            " <div align='center'>" . $fechasinicio[12] . $fechasfin[12]
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($arrayfechasrepeticiones as $key => $arrayfechainicioFin) {
                $tablareport .= "<div align='center'>"
                    . $arrayfechainicioFin['fechasinicio'][12]
                    . $arrayfechainicioFin['fechasfin'][12] . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='157' >";
        if ($actpadre['dirigentes'] == null || $actpadre['dirigentes'] == "") {
            $actpadre['dirigentes'] = "----";
        }
        $tablareport .= "<div align='center'>" . $actpadre['dirigentes']
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objacthija = Doctrine::getTable('DatElementos')->find(
                    $repeticion['idelementohijo']
                );
                $dirigente = $objacthija->dirigente;
                if ($dirigente == null || $dirigente == "") {
                    $dirigente = "----";
                }
                $tablareport .= "<div align='center'>" . $dirigente . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='256' >";
        if ($actpadre['participantes'] == null
            || $actpadre['participantes'] == ""
        ) {
            $actpadre['participantes'] = "----";
        }
        $tablareport .= "<div align='center'>" . $actpadre['participantes']
            . "</div>";
        if (isset($tienerepeticiones[0])) {
            foreach ($tienerepeticiones as $repeticion) {
                $objacthija = Doctrine::getTable('DatElementos')->find(
                    $repeticion['idelementohijo']
                );
                $participante = $objacthija->participante;
                if ($participante == null || $participante == "") {
                    $participante = "----";
                }
                $tablareport .= "<div align='center'>" . $participante
                    . "</div>";
            }
        }
        $tablareport .= "</td>" .
            "<td width='280' >" .
            "<div align='left'> </div>" .
            "</td>" .
            "</tr>";
        return $tablareport;
    }

    public function CrearArrayRepeticiones($actpadre)
    {
        $coinciden = 0;
        $fechainicio = $actpadre['fechainicio'];
        $fechafin = $actpadre['fechafin'];
        $arrfechainicio = explode('-', $fechainicio);
        $arrfechafin = explode('-', $fechafin);
        if (($arrfechainicio[0] . $arrfechainicio[1] . $arrfechainicio[2]) * 1
            == ($arrfechafin[0] . $arrfechafin[1] . $arrfechafin[2]) * 1
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
        $fechasinicio[1] = $fechasinicio[2]
            = $fechasinicio[3]
            = $fechasinicio[4]
            = $fechasinicio[5]
            = $fechasinicio[6]
            = $fechasinicio[7]
            = $fechasinicio[8]
            = $fechasinicio[9]
            = $fechasinicio[10] = $fechasinicio[11] = $fechasinicio[12] = '';
        $fechasinicio[$mesinic] = $arrfechainicio[2];
        $fechasfin[1] = $fechasfin[2]
            = $fechasfin[3]
            = $fechasfin[4]
            = $fechasfin[5]
            = $fechasfin[6]
            = $fechasfin[7]
            = $fechasfin[8]
            =
        $fechasfin[9] = $fechasfin[10] = $fechasfin[11] = $fechasfin[12] = '';
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
            $fechasfin[$mesfin] = '-' . $arrfechafin[2];
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


    public function getMonthDays($month, $year)
    {
        //Lo hacemos a mi manera. 
        return date("d", mktime(00, 00, 00, $month + 1, 00, $year));
    }

    public function CargarFormatos()
    {
        $dat [] = array('idextension' => 1, 'denextension' => 'Vista previa',
                        'icon'        => 'vprevia.gif');
        $dat [] = array('idextension' => 2, 'denextension' => 'Word',
                        'icon'        => 'page_word.png');
        $dat [] = array('idextension' => 3, 'denextension' => 'Excel',
                        'icon'        => 'page_excel.png');
        $dat [] = array('idextension' => 4, 'denextension' => 'Html',
                        'icon'        => 'page_code.png');
        return $dat;
    }

    public function estilos($opcion)
    {
        switch ($opcion) {
            case 0://T�tulo
                $estilo
                    = 'style="border:0px solid #000000; color:#000000; 
                        font-size:12px ;font-weight:normal;"';
                break;
            case 1://Encabezado y Pie
                $estilo
                    = 'style="border:0px solid #000000;font-size:12px ;
                        font-weight:bold;"';
                break;
            case 2://Lineas, tipo de letra del Encabezado y Pie
                $estilo
                    = 'style="border:1px solid #000000; color:#000000; 
                        font-size:10px ;font-weight:bold;"';
                break;
            case 3://Cuerpo, Lineas de las Celdas, tipo de letra
                $estilo
                    = 'style="border:1px solid #000000; color:#000000; 
                        font-size:10px ;font-weight:normal;';
                break;
        }
        return $estilo;
    }

    public function DatosReporte(
        $idreporte, $valuemeses, $valueanno, $fechainicio, $fechafin
    ) {
        $fechainicioD = null;
        $fechafinD = null;
        if ($idreporte != 2) {
            if ($valuemeses) {
                $desde = "1/" . $valuemeses . "/" . $valueanno;
                $cantdiasmes = $this->getMonthDays($valuemeses, $valueanno);
                $hasta = $cantdiasmes . "/" . $valuemeses . "/" . $valueanno;
                $fechainicioD = date(
                    'd-m-Y', mktime(00, 00, 00, $valuemeses, 01, $valueanno)
                );
                $fechafinD = date(
                    'd-m-Y',
                    mktime(00, 00, 00, $valuemeses, $cantdiasmes, $valueanno)
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
                    $fechainicioD = $fechainicio;;
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
                'd-m-Y',
                mktime(00, 00, 00, $valuemeses, $cantdiasmes, $valueanno)
            );
        }
        $arraydatosreportes['fechainicioD'] = $fechainicioD;
        $arraydatosreportes['fechafinD'] = $fechafinD;
        $arraydatosreportes['desde'] = $desde;
        $arraydatosreportes['hasta'] = $hasta;
        $arraydatosreportes['cantdiasmes'] = $cantdiasmes;
        return $arraydatosreportes;
    }

    public function ConstruirPartesReportes(
        /*$arrayvalorespartes,*/
        $parte/*, $cuerporeporte*/
    )
    {
        switch ($parte) {
            case 'CLASF':
                break;
            case 'HEAD':
                break;
            case 'ACTP':
                break;
            case 'RFECH':
                break;
        }
    }

    public function ConvertirEnterosARomanos($num)
    {
        if ($num < 0 || $num > 9999) {
            return -1;
        }
        $rOnes = array(1 => "I", 2 => "II", 3 => "III", 4 => "IV", 5 => "V",
                       6 => "VI", 7 => "VII", 8 => "VIII",
                       9 => "IX");
        $rTens = array(1 => "X", 2 => "XX", 3 => "XXX", 4 => "XL", 5 => "L",
                       6 => "LX", 7 => "LXX",
                       8 => "LXXX", 9 => "XC");
        $rHund = array(1 => "C", 2 => "CC", 3 => "CCC", 4 => "CD", 5 => "D",
                       6 => "DC", 7 => "DCC",
                       8 => "DCCC", 9 => "CM");
        $rThou = array(1 => "M", 2 => "MM", 3 => "MMM", 4 => "MMMM",
                       5 => "MMMMM", 6 => "MMMMMM",
                       7 => "MMMMMMM", 8 => "MMMMMMMM", 9 => "MMMMMMMMM");
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


    public function PlanActividadesPorObjetivos(
        $idusuariosession, $valueanno, /*$textomeses,*/
        $valuemeses, $fechainicio,
        $fechafin, $idplan, $idreporte,/* $conductor, $nombreusuario,*/
        $encabezado, $piepagina, $principales, $confidencialidad,
        $textconfidencialidad,
        $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol, $operador,
        $arrayidnom,
        $arrayestados, $todoscrit
    ) {
        $arraydatosreporte = $this->DatosReporte(
            $idreporte, $valuemeses, $valueanno, $fechainicio, $fechafin
        );
        $tablareport = "";
        $tablareport .= "<table width='1733' >" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>";
        $tablareport
            .= "<table width='1733'  cellspacing='0'
            bordercolor='#333333' bgcolor='#FFFFFF' 
            style='font-size:12px ;font-weight:normal;'>";
        if ($confidencialidad == 'true') {
            $tablareport
                .= "<tr><td><table width='1733' cellspacing='0'
                    bordercolor='#333333' bgcolor='#FFFFFF' 
                    style='font-size:12px ;font-weight:normal;'>"
                .
                "<tr>" .
                "<td colspan='8'><div align='right'>" . $textconfidencialidad
                . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;</div></td>"
                .
                "</tr>" .
                "</table></td></tr>";
        }
        if ($encabezado == 'true') {
            $configuracionfirma = Doctrine::getTable('ConfFirma')->find(
                $idusuariosession
            );
            $tablareport
                .= "<tr><td><table border='0'style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td><div align='right'>APROBADO POR :</td>" .
                "<td><div align='center'>" . $configuracionfirma->cargoaprueba
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->gradoaprueba
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->nombreaprueba
                . "</td>" .
                "</tr>" .
                "</table></td></tr>";
        }
        $tablareport
            .= "<tr><td><table border='0'   style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<tr><td><table width='1733' border='0'style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td colspan='8'><div align='center'>" . $tituloreporte
            . "</div></td>" .
            "</tr>" .
            "</table></td></tr>";
        $tablareport
            .= "<tr><td><table border='0'style='font-size:12px ;
                font-weight:normal;'>"
            .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td><div align='right'></td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "<tr>" .
            "<td>&nbsp;</td>" .
            "<td><div align='center'></td>" .
            "</tr>" .
            "</table></td></tr>";
        if ($piepagina == 'true') {
            $tablareport
                .= "<tr><td><table width='1733'style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td>&nbsp;</td>" .
                "</tr>" .
                "<tr>" .
                "<td width='872'><div align='right'>CONFECCIONADO POR : </td>" .
                "<td width='288'><div align='center'>"
                . $configuracionfirma->cargoelabora . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->gradoelabora
                . "</td>" .
                "</tr>" .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "<td><div align='center'>" . $configuracionfirma->nombrelabora
                . "</td>" .
                "</tr>" .
                "</table></td></tr>";
        }
        $tablareport .= "</table>";
        $tablareport .= "<tr><td><table width='1733' >" .
            "<tr>" .
            "<td colspan='8'><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp; </div></td>"
            .
            "</tr>" .
            "</table></td></tr>";
        //aki van las act principales
        $arrayidactividades = DatElementos::ObtenerActividadesReporte(
            $fechainicio, $fechafin, $arraydatosreporte['fechainicioD'],
            $arraydatosreporte['fechafinD'], $idplan, $arrayidautor,
            $arrayidinvol, $operador, $arrayidnom, $arrayestados,
            $todoscrit
        );
        if ($principales == 'true') {
            $tablareport
                .= "<table  width='1733' cellspacing='0' bordercolor='#333333'
                    bgcolor='#FFFFFF' style='font-size:12px ;
                    font-weight:normal;'>"
                .
                "<tr>" .
                "<td>&nbsp;</td>" .
                "</tr>" .
                "<tr>" .
                "<td><div align='left'>ACTIVIDADES PRINCIPALES : </td>" .
                "</tr>";
            if (isset($arrayidactividades[0]['idelemento'])) {
                $conta = 1;
                foreach ($arrayidactividades as $key => $actividad) {
                    if ($actividad['esprincipal']) {
                        $tablareport .= "<tr>" .
                            "<td>" . $conta . '. ' . $actividad['denelemento']
                            . "</td>" .
                            "</tr>";
                        $conta++;
                    }
                }
            }
            $tablareport .= "</table>";
        }
        if ($rangofecha == 'true') {
            $tablareport
                .= "<table width='1733' cellspacing='0' bordercolor='#333333'
                    bgcolor='#FFFFFF' style='font-size:12px ;
                    font-weight:normal;''>"
                .
                "<tr>" .
                "<td width='919'><div align='right'>DESDE :"
                . $arraydatosreporte['desde'] . " </td>" .
                "<td width='241'><div align='center'>HASTA :"
                . $arraydatosreporte['hasta'] . " </td>" .
                "</tr>" .
                "</table>";
        }
        $tablareport
            .= "<table width='1733'  border='1' cellspacing='0'
                bordercolor='#333333' bgcolor='#FFFFFF' 
                style='font-size:12px ;font-weight:normal;'>"
            .
            "<tr>" .
            "<td width='50' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>No</strong>.</div></td>"
            .
            "<td width='437' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>Actividades</strong></div></td>"
            .
            "<td colspan='12' bordercolor='#333333' ><div 
                align='center'><strong>Meses</strong></div></td>"
            .
            "<td width='157' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>Dirige</strong></div></td>"
            .
            "<td width='256' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>Participantes</strong></div></td>"
            .
            "<td width='280' rowspan='2' bordercolor='#333333' ><div 
                align='center'><strong>Observaciones sobre<br> 
                el cumplimiento</strong></div></td>"
            .
            "</tr>" .
            "<tr>" .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>E</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>F</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>M</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>A</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>M</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>J</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>J</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>A</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>S</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>O</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>N</strong></div></td>"
            .
            "<td width='41' bordercolor='#333333' ><div 
                align='center'><strong>D</strong></div></td>"
            .
            "</tr>";
        $arrayobjetivosplan
            = DatArcDatPlanObjetivo::ObtenerObjetivosPorPlanesSQL($idplan);
        $cont = 1;
        if (isset($arrayobjetivosplan[0])) {
            $arrayobjetivosplan = $this->OrganizarObjPorPadresEHijos(
                $arrayobjetivosplan
            );
            foreach ($arrayobjetivosplan as $key => $obj) {
                if ($obj['idpadre'] == null) {
                    $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                        $cont, $obj, $arrayobjetivosplan, $tablareport, $idplan,
                        $cadena = ''
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
            $cont, $obj, $arrayobjetivosplan, $tablareport, $idplan,
            $cadena = ''
        );
        $tablareport .= "</table>";
        $tablareport
            .= "<table width='1733' bordercolor='#333333' bgcolor='#FFFFFF'>" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>" .
            "<table width='1733' >" .
            "<tr>" .
            "<td ><div align='right'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div></td>"
            .
            "</tr>" .
            "</table>";
        return $tablareport;
    }

    public function OrganizarObjPorPadresEHijos($arrayobjetivosplan)
    {
        if (isset($arrayobjetivosplan[0])) {
            foreach ($arrayobjetivosplan as $key => $obj) {
                $arraypadres
                    = DatElementosDatElementos::DameElementoPadreMismaEspecie(
                    $obj['idobjetivo']
                );
                if (isset($arraypadres[0])) {
                    $idpadre = $arraypadres[0]['idelementopadre'];
                } else {
                    $idpadre = null;
                }
                $arrayobjetivosplan[$key]['idpadre'] = $idpadre;
            }
        }
        return $arrayobjetivosplan;
    }

    public function GenerarCuerpoReporteObjPlan(
        $cont, $obj, $arrayobjetivosplan, $tablareport, $idplan, $cadena = ''
    ) {
        $num = $this->ConvertirEnterosARomanos($cont);
        if ($cadena != "") {
            $cadena = $cadena . "." . $num;
        } else {
            $cadena = $num;
        }
        $tablareport = "<tr>" .
            "<td colspan='17' bordercolor='#333333'>" . $cadena . "- "
            . $obj['denelemento'];
        if ($obj['fechainicio'] && $obj['fechafin']) {
            $tablareport .= "  ( Desde " . $obj['fechainicio'] . " hasta "
                . $obj['fechafin'] . ")</td>";
        }
        $tablareport .= "</tr>";
        $idobjetivo = $obj['idobjetivo'];
        if ($idobjetivo != 'objetivo') {
            $arrayactobj = DatElementos::ObtenerActividadesVinculadasObj(
                $idobjetivo, $idplan
            );
            if (isset($arrayactobj[0])) {
                $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
                    $arrayactobj, &$arrayactividadesorg
                );
                if (isset($arrayactividadesorg['padres'])) {
                    foreach (
                        $arrayactividadesorg['padres'] as $key => $actpadre
                    ) {
                        $key = $key + 1;
                        $respuesta = $this->CrearListaHtmlDeARCPlanActividades(
                            $key, $tablarep = '', $actpadre,
                            $arrayactividadesorg
                        );
                        $tablareport .= $respuesta;
                    }
                }
            }
            $contador = 1;
            foreach ($arrayobjetivosplan as $actobj) {
                if ($actobj['idpadre'] == $obj['idobjetivo']) {
                    $tablareport .= $this->GenerarCuerpoReporteObjPlan(
                        $contador, $actobj, $arrayobjetivosplan, $tablareport,
                        $obj['idobjetivo'], $cadena
                    );
                    $contador++;
                }
            }
        } else {
            $arrayactplan = DatElementos::ObtenerActividadesVinculadasObj(
                $idobjetivo, $idplan
            );
            if (isset($arrayactplan[0])) {
                $arrayactividadesorg = $this->OrganizarArrayPorPadresEHijos(
                    $arrayactplan, &$arrayactividadesorg
                );
                if (isset($arrayactividadesorg['padres'])) {
                    foreach (
                        $arrayactividadesorg['padres'] as $key => $actpadre
                    ) {
                        $key = $key + 1;
                        $respuesta = $this->CrearListaHtmlDeARCPlanActividades(
                            $key, $tablarep = '', $actpadre,
                            $arrayactividadesorg
                        );
                        $tablareport .= $respuesta;
                    }
                }
            }
        }
        return $tablareport;
    }

}
