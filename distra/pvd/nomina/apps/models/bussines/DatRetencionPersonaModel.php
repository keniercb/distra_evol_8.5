<?php

class PDFNomina extends fpdf
{
    function Footer()
    {
        $fecha = date('d-m-Y');
        $hora = date('h:i:s A');
        $this->SetFont('Arial', 'B', 4);
        $this->SetY(-30);
        $this->SetX(20);
        $this->Write(5, 'POR RECURSOS HUMANOS');
        $this->SetX(230);
        $this->Write(5, 'FECHA IMPRESION: ');
        $this->SetFont('Arial', '', 4);
        $this->Write(5, $fecha);
        $this->SetFont('Arial', 'B', 4);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'ELABORADO POR:');
        $this->SetX(230);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->SetFont('Arial', '', 4);
        $this->Write(5, $hora);
        $this->SetFont('Arial', 'B', 4);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR:');
        $this->SetFont('Arial', 'B', 6);
        $this->Ln(10);
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');
    }
}

class PDFDedApli extends fpdf
{
    function Footer()
    {
        $fecha = date('d-m-Y');
        $hora = date('h:i:s A');
        $this->SetFont('Arial', 'B', 6);
        $this->SetY(-20);
        $this->SetX(20);
        $this->Write(5, 'POR RECURSOS HUMANOS');
        $this->SetX(230);
        $this->Write(5, 'FECHA IMPRESION: ');
        $this->SetFont('Arial', '', 6);
        $this->Write(5, $fecha);
        $this->SetFont('Arial', 'B', 6);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'ELABORADO POR:');
        $this->SetX(230);
        $this->Write(5, 'HORA IMPRESION: ');
        $this->SetFont('Arial', '', 6);
        $this->Write(5, $hora);
        $this->SetFont('Arial', 'B', 6);
        $this->Ln();
        $this->SetX(20);
        $this->Write(5, 'REVISADO Y APROBADO POR:');
        $this->SetFont('Arial', 'B', 6);
        $this->Ln();
        $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');
    }
}

/**
 * Modelo de negocio para gestionar las retenciones de personas.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomEscalaTarifa, Entidad escala de tarifas de conceptos(Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class DatRetencionPersonaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function DatRetencionPersonaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las retenciones de las personas.
     *
     * @param int $idpersona Identificador de la persona.
     * @param int $identidad Identificador de la entidad.
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de retenciones.
     */
    public function obtenerListadoRetencionesPersona($idpersona, $identidad, $inicio = 0, $limite = 15)
    {
        //Retornando el listado de retenciones de persona.
        return DatRetencionPersona::obtenerListadoRetencionesByIdpersonaEntidad($idpersona, $identidad, $inicio, $limite);
    }

    public function obtenerListadoAexportarRetencionesPersona($idpersona, $identidad)
    {
        //Retornando el listado de retenciones de persona.
        return DatRetencionPersona::obtenerListadoAexportarRetencionesByIdpersonaEntidad($idpersona, $identidad);
    }

    /**
     * Obtener un listado de los datos del historico de las retenciones de las personas.
     *
     * @param int $idpersona Identificador de la persona.
     * @param int $identidad Identificador de la entidad.
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de retenciones.
     */
    public function obtenerHistoricoListadoRetencionesPersona($idpersona, $identidad, $inicio = 0, $limite = 10)
    {
        //Retornando el listado de retenciones de persona.
        return HisDatRetencionPersona::obtenerListadoHistoricoRetencionesByIdpersonaEntidad($idpersona, $identidad, $inicio, $limite);
    }

    /**
     * Obtener un cantidad total de retenciones de una persona.
     *
     * @param int $idpersona Identificador de la persona.
     * @param int $identidad Identificador de la entidad.
     * @return int Cantidad total de retenciones de una persona.
     */
    public function obtenerCantidadTotalRetencionesPersona($idpersona, $identidad)
    {
        //Retornando la cantidad total de retenciones de una persona.
        return DatRetencionPersona::obtenerCantidadTotalRetencionesPersona($idpersona, $identidad);
    }

    /**
     * Insertar una retenci�n de una persona.
     *
     * @param int $idtiporetenc Identificador del tipo de retenci�n.
     * @param int $idpersona Identificador de la persona.
     * @param int $identidad Identificador de la entidad.
     * @param int $saldoinicial Saldo inicial.
     * @param int $mensualidad Mensualidad.
     * @param int $ultmensualidad Ultima mensualidad.
     * @param string $referencia Referencia del documento.
     * @param date $fdocumento Fecha de del documento de referencia.
     * @param date $finicio Fecha de inicio de creacion de la retenci�n.
     * @param date $ffin Fecha de fin de uso de la retenci�n.
     */
    public function adicionarRetencionPersona($idtiporetenc, $idpersona, $identidad, $saldoinicial, $mensualidad, $ultmensualidad, $referencia, $fdocumento, $finicio, $ffin, $activo, $cuentacontable)
    {
        //Se crea el objeto de la retenci�n de la persona.
        $objRetencPer = new DatRetencionPersona();
        //Insertando los datos.
        $objRetencPer->idtiporetencion = $idtiporetenc;
        $objRetencPer->idpersona = $idpersona;
        $objRetencPer->identidad = $identidad;
        $objRetencPer->saldoinicial = ($saldoinicial) ? $saldoinicial : null;
        $objRetencPer->mensualidad = $mensualidad;
        $objRetencPer->ultmensualidad = ($ultmensualidad) ? $ultmensualidad : null;
        $objRetencPer->refdocumentoacredita = $referencia;
        $objRetencPer->idcuenta = (is_numeric($cuentacontable)) ? $cuentacontable : null;
        $fecha = split('/', $fdocumento);
        $objRetencPer->fechadocumento = ($fdocumento) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $fecha = split('/', $finicio);
        $objRetencPer->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $fecha = split('/', $ffin);
        $objRetencPer->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $objRetencPer->activo = $activo;
        //Guardando los datos.
        $objRetencPer->save();
    }

    /**
     * Modificar una retenci�n de una persona.
     *
     * @param int $idretencperson Identificador de la retenci�n persona.
     * @param int $idtiporetenc Identificador del tipo de retenci�n.
     * @param int $idpersona Identificador de la persona.
     * @param int $identidad Identificador de la entidad.
     * @param int $saldoinicial Saldo inicial.
     * @param int $mensualidad Mensualidad.
     * @param int $ultmensualidad Ultima mensualidad.
     * @param string $referencia Referencia del documento.
     * @param date $fdocumento Fecha de del documento de referencia.
     * @param date $finicio Fecha de inicio de creacion de la retenci�n.
     * @param date $ffin Fecha de fin de uso de la retenci�n.
     */
    public function modificarRetencionPersona($idretencperson, $idtiporetenc, $idpersona, $identidad, $saldoinicial, $mensualidad, $ultmensualidad, $referencia, $fdocumento, $finicio, $ffin, $activo, $cuentacontable)
    {
        //Obteniendo la retenci�n de la persona a modificar.
        $objRetencPer = DatRetencionPersona::obtenerObjRetencionPersonaDadoId($idretencperson);
        //Modificando los datos de la retenci�n.
        $objRetencPer->idtiporetencion = $idtiporetenc;
        $objRetencPer->idpersona = $idpersona;
        $objRetencPer->identidad = $identidad;
        $objRetencPer->saldoinicial = ($saldoinicial) ? $saldoinicial : null;
        $objRetencPer->mensualidad = $mensualidad;
        $objRetencPer->ultmensualidad = ($ultmensualidad) ? $ultmensualidad : null;
        $objRetencPer->refdocumentoacredita = $referencia;
        $objRetencPer->idcuenta = (is_numeric($cuentacontable)) ? $cuentacontable : null;
        $fecha = split('/', $fdocumento);
        $objRetencPer->fechadocumento = ($fdocumento) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $fecha = split('/', $finicio);
        $objRetencPer->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $fecha = split('/', $ffin);
        $objRetencPer->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $objRetencPer->activo = $activo;
        //Guardando los datos.
        $objRetencPer->save();
    }

    /**
     * Eliminar una retenci�n de una persona.
     *
     * @param int $idretencperson Identificador de la retenci�n de una persona.
     */
    public function eliminarRetencionPersona($idretencperson)
    {
        //Obteniendo la retenci�n de la persona a modificar.
        $datosRetencPer = HisRetencionesPersona::obtenerHistoricoSubMayorRetenciones($idretencperson, 100, 0);
        $objRetencPer = DatRetencionPersona::obtenerObjRetencionPersonaDadoId($idretencperson);
        $datos = DatRetencionPersona::obtenerDatosRetencionPersonaDadoId($idretencperson);
        $activo = $datos['activo'];
        $fechafin = $datos['fechafin'];
        if ($activo == 0 && $fechafin != null) {
            if (count($datosRetencPer) > 0) {
                $objhisretenciones = new HisDatRetencionPersona();
                $objhisretenciones->idpersona = $objRetencPer->idpersona;
                $objhisretenciones->identidad = $objRetencPer->identidad;
                $objhisretenciones->idtiporetencion = $objRetencPer->idtiporetencion;
                $objhisretenciones->saldoinicial = $objRetencPer->saldoinicial;
                $objhisretenciones->mensualidad = $objRetencPer->mensualidad;
                $objhisretenciones->ultmensualidad = $objRetencPer->ultmensualidad;
                $objhisretenciones->refdocumentoacredita = $objRetencPer->refdocumentoacredita;
                $objhisretenciones->fechadocumento = $objRetencPer->fechadocumento;
                $objhisretenciones->fechainicio = $objRetencPer->fechainicio;
                $objhisretenciones->fechafin = $objRetencPer->fechafin;
                $objhisretenciones->prioridad = $objRetencPer->prioridad;
                $objhisretenciones->save();
                $idhisdatretencionpersona = $objhisretenciones->idhisdatretencionpersona;
                foreach ($datosRetencPer as $k => $v) {
                    $objhisoperacretenciones = new HisOperacionRetencionesPersona();
                    $objhisoperacretenciones->idhisdatretencionpersona = $idhisdatretencionpersona;
                    $objhisoperacretenciones->idnomina = $v['idnomina'];
                    $objhisoperacretenciones->idcomprobanteacredita = $v['idcomprobanteacredita'];
                    $objhisoperacretenciones->idcomprobantependiente = $v['idcomprobantependiente'];
                    $objhisoperacretenciones->retenido = $v['retenido'];
                    $objhisoperacretenciones->saldodeladeudo = $v['saldodeladeudo'];
                    $objhisoperacretenciones->retencionpendiente = $v['retencionpendiente'];
                    $objhisoperacretenciones->saldodeladeudopendiente = $v['saldodeladeudopendiente'];
                    $objhisoperacretenciones->fechaoperacion = $v['fechaoperacion'];
                    $objhisoperacretenciones->fechacomprobantependiente = $v['fechacomprobantependiente'];
                    $objhisoperacretenciones->save();
                }
            }
            //Borrando la retenci�n de la persona.
            $objRetencPer->delete();
            return 1;
        } else {
            return 2;
        }
    }

    //Funcion para actualizar en el submayor de retenciones
    public function actualizarSubmayorRetenciones($personas, $retenciones, $retencionescalculadas, $identidad, $retencionesaplicadas = NULL, $ultimopagoenperiodo = 0, $idelaborarpagos = NULL)
    {
        //Recorriendo las retenciones calculadas
        foreach ($retencionescalculadas as $idco => $rc) {
            $idpersona = $personas[$idco]['idpersona'];
            $idnomina = $personas[$idco]['idnomina'];
            //Recorriendo las altas de la persona en el submayor de retenciones
            foreach ($retenciones[$idpersona]->tiporetencion as $tiporet => $ret) {
                //Si el tipo de retencion tiene saldo para salvar en el submayor
                foreach ($ret as $r) {
                    $objHisRetencionSave = new HisRetencionesPersona();
                    $retenido = 0.00;
                    $saldodeladeudo = 0.00;
                    $retencionpendiente = 0.00;
                    $saldodeladeudopendiente = 0.00;
                    $guardaroperacion = 1;
                    /*Si no se aplicó la retención en otro pago del mismo periodo, procedo a realizar la operacion en el submayor */
                    if (!isset( $retencionesaplicadas[$idpersona]->tiporetencion[$tiporet] )) {
                        $tienelimite = $r['saldolimite'];
                        $retenido = $rc[$tiporet][$r['idretencionpersona']];
                        /*Existe valor a retener por tanto no hay retencion pendiente*/
                        if ($retenido != 0.00) {
                            if (empty($r['fechaoperacion'])) {
                                $saldodeladeudo = !empty($r['saldoinicial']) ? $r['saldoinicial'] - $retenido : 0.00;
                                $saldodeladeudo = $saldodeladeudo <= 0 ? 0.00 : $saldodeladeudo;
                            } else {
                                if ($tienelimite == 1) {
                                    if ($r['saldodeladeudo'] - $retenido <= 0) {
                                        $saldodeladeudo = number_format(0, 2, '.', '');
                                    } else {
                                        $saldodeladeudo = number_format($r['saldodeladeudo'] - $retenido, 2, '.', '');
                                    }
                                } else {
                                    $saldodeladeudo = number_format(0, 2, '.', '');
                                }
                            }
                        } else {/*No existe valor a retener*/
                            /*Es el ultimo pago para aplicar retenciones y descuentos*/
                            if ($ultimopagoenperiodo > 0) {
                                $saldodeladeudo = $r['saldodeladeudo'];
                                if ($tienelimite > 1) {
                                    $retencionpendiente = $retenido;
                                    $saldodeladeudopendiente = $r['saldodeladeudopendiente'] + $retencionpendiente;
                                } else if ($r['saldoinicial'] - $r['saldodeladeudo'] <= $retenido) {
                                    $retencionpendiente = $r['saldoinicial'] - $r['saldodeladeudo'];
                                    $saldodeladeudopendiente = $r['saldodeladeudopendiente'] + $retencionpendiente;
                                } else {
                                    $retencionpendiente = $retenido;
                                    $saldodeladeudopendiente = $r['saldodeladeudopendiente'] + $retencionpendiente;
                                }
                            } else {
                                /*No es el ultimo pago en el periodo, no guardo la operacion, espero al otro pago
                                  que tenga retenciones o al ultimo
                                */
                                $guardaroperacion = -1;
                            }
                        }

                        /*Guardo la operacion en el submayor de retenciones y en retenciones aplicadas para que no se 
                         * vuelvan aplicar en el periodo*/
                        if ($guardaroperacion != -1) {
                            $objHisRetencionSave->idretencionpersona = $r['idretencionpersona'];
                            $objHisRetencionSave->idnomina = $idnomina;
                            $objHisRetencionSave->retenido = $retenido;
                            $objHisRetencionSave->fechaoperacion = date('d-m-Y');
                            $objHisRetencionSave->saldodeladeudo = $saldodeladeudo;
                            $objHisRetencionSave->retencionpendiente = $retencionpendiente;
                            $objHisRetencionSave->saldodeladeudopendiente = $saldodeladeudopendiente;
                            $objHisRetencionSave->save();
                            $objRetAplicadas = new DatRetencionesAplicadasPorPersona();
                            $objRetAplicadas->idelaborarpagos = $idelaborarpagos;
                            $objRetAplicadas->idpersona = $idpersona;
                            $objRetAplicadas->idtiporetencion = $tiporet;
                            $objRetAplicadas->save();
                        }
                    }
                }
            }
        }
    }

    //Funcion para actualizar en el submayor de retenciones
    public function exportarRetenciones($ididentidad, $idpersona, $arrayRetenciones, $arrayHisRetencionesXret)
    {
        $datospersona = $this->pIntegrator->pvd->getPrincipalesDatosPersona(array($idpersona), null, null, null, null, null);
        $objHisRetenciones = new HisRetencionesPersona();
        $datosEntidad = $objHisRetenciones->obtenerDatosEntidadDadoId($ididentidad);
        $pdf = new PDFNomina('l', 'mm', 'a4');
        $pdf->SetLeftMargin(50);
        $pdf = $this->DatosGenerales($pdf);
        $pdf = $this->crearCabezera($pdf, $datosEntidad[0]['denominacion'], 'Submayor de retenciones por persona', $datosEntidad[0]['codigo'], $datospersona->data[0]['nombre'] . ' '
            . $datospersona->data[0]['sapel'] . ' ' . $datospersona->data[0]['papel'], $datospersona->data[0]['numid']);
        $pdf = $this->crearCuerpo($pdf, $arrayRetenciones, $arrayHisRetencionesXret);
        $pdf->Output();
    }

    public function exportarPersonasRetenciones($identidad, $arrayRetenciones)
    {
        $objHisRetenciones = new HisRetencionesPersona();
        $datosEntidad = $objHisRetenciones->obtenerDatosEntidadDadoId($identidad);
        $pdf = new PDFDedApli('l', 'mm', 'letter');
        $pdf->AddPage();
        $pdf = $this->crearCabezeraListadoRetenciones($pdf, $datosEntidad, 'Listado de Personas con Retenciones', $identidad);
        $pdf = $this->crearCuerpoListadoRetenciones($pdf, $arrayRetenciones,$objHisRetenciones, $datosEntidad, 'Listado de Personas con Retenciones', $identidad);
        $pdf->Output();
    }

    public function exportarListadoDeduccionesAplicadas($ididentidad, $fechainicio, $fechafin, $arrayTipoRetenciones)
    {
        $objHisRetenciones = new HisRetencionesPersona();
        $datosEntidad = $objHisRetenciones->obtenerDatosEntidadDadoId($ididentidad);
        $arrayRetencionesXfechaYtipoRencion = null;
        foreach ($arrayTipoRetenciones as $key => $arrayRetencion) {
            $tipoRetencion = $arrayRetencion->idtiporetencion;
            $array = $objHisRetenciones->obtenerUltimaOperacionSubMayorRetenciones($ididentidad, $fechainicio, $fechafin, $tipoRetencion);
            $arrayRetencionesXfechaYtipoRencion[$key]->datos = $array;
            $arrayRetencionesXfechaYtipoRencion[$key]->datosRetencion = $arrayRetencion;
    }
        $pdf = new PDFDedApli('l', 'mm', 'a4');
        $pdf->SetLeftMargin(50);
        $pdf = $this->DatosGenerales($pdf);
        $pdf = $this->crearCabezeraDedApli($pdf, $datosEntidad[0]['denominacion'], 'Listado de Retenciones Aplicadas ', $datosEntidad[0]['codigo'], $fechainicio, $fechafin);
        $pdf = $this->crearCuerpoDedApli($pdf, $arrayRetencionesXfechaYtipoRencion);
        $pdf->Output();
    }

    //pdf
    private function dameTamanno($pdf, $palabra)
    {
        $tamannoTitulo = $pdf->GetStringWidth($palabra);
        $centro = (297 - $tamannoTitulo) / 2 + 2;
        return $centro;
    }

    public function crearCabezera($pdf, $entidad, $tituloReporte, $codigo, $desde, $hasta)
    {
        $tamannoTituloReporte = $pdf->GetStringWidth($tituloReporte);
        $centro = $this->dameTamanno($pdf, $tituloReporte);
        $pdf->Cell(297, 7, utf8_decode($tituloReporte), 0, 1, 'C');
        $pdf->Line($centro, $pdf->GetY(), $centro + $tamannoTituloReporte, $pdf->GetY());
        $pdf->Cell($pdf->GetStringWidth($entidad) + $pdf->GetStringWidth('Entidad: ') - 2, 7, utf8_decode('Entidad: ' . $entidad), 'B', 1, 'L');
        $pdf->Cell(26, 7, utf8_decode("Código: " . $codigo), 'B', 1, 'L');
        $pdf->Cell($pdf->GetStringWidth("Nombre: " . $desde), 7, utf8_decode("Nombre: " . $desde), 'B', 0, 'L');
        $pdf->SetX(250);
        $pdf->Cell(32, 7, utf8_decode("CI: " . $hasta), 'B', 1, 'L');
        $pdf->Ln();
        return $pdf;
    }

    public function crearCabezeraListadoRetenciones(&$pdf, $datosEntidad, $tituloReporte, $identidad)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(280, 7, utf8_decode($tituloReporte), 0, 1, 'C');
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->SetX(5);
        $longcodigo = $pdf->GetStringWidth($datosEntidad[0]['codigo']);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(15, 10, 'Entidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(140 - 15, 10, utf8_decode($datosEntidad[0]['denominacion']), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(130 - $longcodigo, 10, utf8_decode('Código: '), 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell($longcodigo, 10, utf8_decode($datosEntidad[0]['codigo']), 0, 1, 'L', 0);
        //1era fila
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(55, 8, utf8_decode('Tipo de Retención'), 1, 0, 'C', 0);
        $pdf->Cell(34, 8, utf8_decode('Saldo Inicial'), 1, 0, 'C', 0);
        $pdf->Cell(34, 8, utf8_decode('Mensualidad'), 1, 0, 'C', 0);
        $pdf->Cell(34, 8, utf8_decode('Referencia'), 1, 0, 'C', 0);
        $pdf->Cell(34, 8, utf8_decode('Fecha doc.'), 1, 0, 'C', 0);
        $pdf->Cell(34, 8, utf8_decode('Fecha inicio'), 1, 0, 'C', 0);
        $pdf->Cell(34, 8, utf8_decode('Saldo por Pagar'), 1, 1, 'C', 0);
        return $pdf;
    }

    public function crearCuerpoListadoRetenciones($pdf, $arrayRetenciones, $objHisRetenciones, $datosEntidad, $tituloReporte, $identidad)
    {
        $cont = 0;
        foreach ($arrayRetenciones as $key => $value) {
            if ($value['idpersona'] != $arrayRetenciones[$key+1]['idpersona']) {
                $arrayPersonas[$cont]['idpersona'] = $value['idpersona'];
                $arrayPersonas[$cont]['nombreyapellidos'] = $value['nombreyapellidos'];
            }
            $cont ++;
        }
        foreach ($arrayPersonas as $key => $personas) {
            $this->fnAdicionarPaginaListadoRetenciones($pdf, $datosEntidad, $tituloReporte, $identidad);
            $pdf->SetFillColor(230);
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->Cell(259, 5, utf8_decode($personas['nombreyapellidos']), 1, 1, 'C', 1);
            $pdf->SetFillColor(200);
            foreach ($arrayRetenciones as $key => $retencion) {
                $this->fnAdicionarPaginaListadoRetenciones($pdf, $datosEntidad, $tituloReporte, $identidad);
                //Pintando los datos
                if (($retencion['idpersona'] == $personas['idpersona'])) {
                    $saldorestante = $objHisRetenciones->obtenerSaldoRestanteRetencionesPersona($retencion['idretencionpersona']);
                    $pdf->SetFont('Arial', '', 8);
                    $pdf->Cell(55, 5, utf8_decode($retencion['tiporetencion']), 1, 0, 'C', 0);
                    $pdf->Cell(34, 5, number_format($retencion['saldoinicial'], 2, '.', ''), 1, 0, 'C', 0);
                    $pdf->Cell(34, 5, number_format($retencion['mensualidad'], 2, '.', ''), 1, 0, 'C', 0);
                    $pdf->Cell(34, 5, utf8_decode($retencion['refdocumentoacredita']), 1, 0, 'C', 0);
                    $pdf->Cell(34, 5, utf8_decode($retencion['fechadocumento']), 1, 0, 'C', 0);
                    $pdf->Cell(34, 5, utf8_decode($retencion['fechainicio']), 1, 0, 'C', 0);
                    $pdf->Cell(34, 5, number_format($saldorestante, 2, '.', ''), 1, 1, 'C', 0);
                } 
            }
            $pdf->Ln(5);
        }
        $this->fnAdicionarPaginaListadoRetenciones($pdf, $datosEntidad, $tituloReporte, $identidad);
        return $pdf;
    }

    public function fnAdicionarPaginaListadoRetenciones($pdf, $datosEntidad, $tituloReporte, $identidad)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        if ($y >= '180') {
            $pdf->AddPage();
            $this->crearCabezeraListadoRetenciones($pdf, $datosEntidad, $tituloReporte, $identidad);
        }
    }

    public function crearCabezeraDedApli($pdf, $entidad, $tituloReporte, $codigo, $desde, $hasta)
    {
        $pdf->Cell(297, 7, utf8_decode($tituloReporte), 0, 1, 'C');
        $pdf = $this->encabezados($pdf, 'Entidad: ', $entidad);
        $pdf->SetX(220);
        $pdf = $this->encabezados($pdf, 'Código: ', $codigo);
        $pdf->Ln();
        $pdf = $this->encabezados($pdf, "Fecha inicio: ", $desde);
        $pdf->SetX(220);
        $pdf = $this->encabezados($pdf, "Fecha fin: ", $hasta);
        $pdf->Ln();
        return $pdf;
    }

    private function calcularLargoTabla($indicadores)
    {
        $largo = 0;
        foreach ($indicadores as $key => $val) {
            $largo += $this->largo($indicadores[$key]->variable);
        }
        return $largo;
    }

    private function encabezados($pdf, $parteIzq, $parteDer)
    {
        $pdfTemp = $pdf;
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell($pdf->GetStringWidth($parteIzq), 7, utf8_decode($parteIzq), 0, 0, 'L');
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell($pdf->GetStringWidth($parteDer), 7, utf8_decode($parteDer), 0, 0, 'L');
        return $pdfTemp;
    }

    private function verificarQueCabe($pdf)
    {
        if ($pdf->GetY() >= 160) {
            $pdf->AddPage();
        }
        return $pdf;
    }

    private function pintarEncabezadoRetenciones($pdf, $arrayRetenciones, $centro, $espacioLibre)
    {
        $pdf = $this->verificarQueCabe($pdf);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20 + 45, 8, utf8_decode($centro), 1, 1, 'C');
        $pdf->Cell(32, 8, utf8_decode('Tipo de retención:'), 1, 0, 'L');
        $pdf->Cell(22, 8, utf8_decode('Saldo inicial:'), 1, 0, 'L');
        $pdf->Cell(25, 8, utf8_decode('Mensualidad:'), 1, 0, 'L');
        $pdf->Cell(28, 8, utf8_decode('U. mensualidad:'), 1, 0, 'L');
        $pdf->Cell(20, 8, utf8_decode('Referencia:'), 1, 0, 'L');
        $pdf->Cell(20, 8, utf8_decode('Fecha doc.:'), 1, 0, 'L');
        $pdf->Cell(22, 8, utf8_decode('Fecha inicio:'), 1, 0, 'L');
        $pdf->Cell(17, 8, utf8_decode('Fecha fin:'), 1, 1, 'L');
        //Letra del cuerpo de la tabla
        $pdf->SetFont('Arial', '', 6);
        return $pdf;
    }

    private function pintarEncabezadoHisRetenciones($pdf, $arrayRetenciones, $centro, $espacioLibre)
    {
        $pdf = $this->verificarQueCabe($pdf);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(13.602155555556, 8, utf8_decode('Nómina'), 1, 0, 'L');
        $pdf->Cell(14.073466666667, 8, utf8_decode('Retenido'), 1, 0, 'L');
        $pdf->Cell(25.368, 8, utf8_decode('Saldo del adeudo'), 1, 0, 'L');
        $pdf->Cell(32.897688888889, 8, utf8_decode('Fecha de la operación'), 1, 0, 'L');
        $pdf->Cell(31.009622222222, 8, utf8_decode('Retención pendiente'), 1, 0, 'L');
        $pdf->Cell(39.481933333333, 8, utf8_decode('Saldo del adeudo pendiente'), 1, 1, 'L');
        //Letra del cuerpo de la tabla
        $pdf->SetFont('Arial', '', 6);
        return $pdf;
    }

    private function largo($palabra)
    {
        return (strlen($palabra) == 1) ? 5 : (strlen($palabra) * 2 + 2);
    }

    private function calcularSubtotalArea($arrayRetenciones, $area)
    {
        $subtotalArea = 0;
        foreach ($arrayRetenciones as $key => $arrayRetencion) {
            if ($area == $arrayRetencion['area']) {
                $subtotalArea += $arrayRetencion['cuota'];
            }
        }
        return $subtotalArea;
    }

    public function crearCuerpo($pdf, $arrayRetenciones, $arrayHisRetencionesXret)
    {
        //para centrar la tabla
        $espacioLibre = 297 - (20 + 45);
        $tamannoletraEncabezado = 7;
        $tamannoletraNormal = 6;
        $margen = 1;
        $tamannoletraEncabezadoModificada = $tamannoletraEncabezado;
        $temX = 0;
        $temX1 = 0;
        $temX2 = 0;
        $centro = (297 - ($pdf->GetStringWidth('Tipo de retención:') + $margen + 30 + $pdf->GetStringWidth
                    ('Saldo inicial:') + $margen + 17 + $pdf->GetStringWidth('Mensualidad:') + $margen + 17 + $pdf->GetStringWidth
                    ('U. mensualidad:') + $margen + 15.8)) / 2;
        foreach ($arrayRetenciones as $key => $val) {
            $pdf->SetX($centro);
            $tamannoletraEncabezadoModificada = $tamannoletraNormal;
            $tamannoletraEncabezadoModificada1 = $tamannoletraNormal;
            $pdf = $this->verificarQueCabe($pdf);
            $pdf->SetFont('Arial', 'B', $tamannoletraEncabezado);
            $pdf->Cell($pdf->GetStringWidth('Tipo de retención:') + $margen, 8, utf8_decode('Tipo de retención:'), 'TL', 0, 'L');
            $pdf->SetFont('Arial', '', $tamannoletraEncabezadoModificada);
            while ($pdf->GetStringWidth($arrayRetenciones[$key]['tiporetencion']) > 30) {
                $tamannoletraEncabezadoModificada -= 0.2;;
                $pdf->SetFont('Arial', '', $tamannoletraEncabezadoModificada);
            }
            $pdf->Cell(30, 8, utf8_decode($arrayRetenciones[$key]['tiporetencion']), 'T', 0, 'L');
            $temX = $pdf->GetX();
            $pdf->SetFont('Arial', 'B', $tamannoletraEncabezado);
            $pdf->Cell($pdf->GetStringWidth('Saldo inicial:') + $margen, 8, utf8_decode('Saldo inicial:'), 'T', 0, 'L');
            $pdf->SetFont('Arial', '', $tamannoletraNormal);
            $pdf->Cell(17, 8, utf8_decode($arrayRetenciones[$key]['saldoinicial']), 'T', 0, 'L');
            $temX2 = $pdf->GetX();
            $pdf->SetFont('Arial', 'B', $tamannoletraEncabezado);
            $pdf->Cell($pdf->GetStringWidth('Mensualidad:') + $margen, 8, utf8_decode('Mensualidad:'), 'T', 0, 'L');
            $pdf->SetFont('Arial', '', $tamannoletraNormal);
            $temX1 = $pdf->GetX() + 17;
            $pdf->Cell(17, 8, utf8_decode($arrayRetenciones[$key]['mensualidad']), 'T', 0, 'L');
            $pdf->SetFont('Arial', 'B', $tamannoletraEncabezado);
            $pdf->Cell($pdf->GetStringWidth('U. mensualidad:') + $margen, 8, utf8_decode('U. mensualidad:'), 'T', 0, 'L');
            $pdf->SetFont('Arial', '', $tamannoletraNormal);
            $pdf->Cell(15.8, 8, utf8_decode($arrayRetenciones[$key]['ultmensualidad']), 'RT', 1, 'L');
            $pdf->SetX($centro);
            $pdf->SetFont('Arial', 'B', $tamannoletraEncabezado);
            $pdf->Cell($pdf->GetStringWidth('Referencia:') + $margen, 8, utf8_decode('Referencia:'), 'LB', 0, 'L');
            $pdf->SetFont('Arial', '', $tamannoletraNormal);
            while ($pdf->GetStringWidth($arrayRetenciones[$key]['tiporetencion']) > 30) {
                $tamannoletraEncabezadoModificada1 -= 0.2;;
                $pdf->SetFont('Arial', '', $tamannoletraEncabezadoModificada1);
            }
            $pdf->Cell(30, 8, utf8_decode($arrayRetenciones[$key]['refdocumentoacredita']), 'B', 0, 'L');
            $pdf->SetX($temX);
            $pdf->SetFont('Arial', 'B', $tamannoletraEncabezado);
            $pdf->Cell($pdf->GetStringWidth('Fecha doc.:') + $margen, 8, utf8_decode('Fecha doc.:'), 'B', 0, 'L');
            $pdf->SetFont('Arial', '', $tamannoletraNormal);
            $pdf->Cell(15, 8, utf8_decode($arrayRetenciones[$key]['fechadocumento']), 'B', 0, 'L');
            $pdf->SetX($temX2);
            $pdf->SetFont('Arial', 'B', $tamannoletraEncabezado);
            $pdf->Cell($pdf->GetStringWidth('Fecha inicio:') + $margen, 8, utf8_decode('Fecha inicio:'), 'B', 0, 'L');
            $pdf->SetFont('Arial', '', 6);
            $pdf->Cell(15, 8, utf8_decode($arrayRetenciones[$key]['fechainicio']), 'B', 0, 'L');
            $pdf->SetX($temX1);
            $pdf->SetFont('Arial', 'B', $tamannoletraEncabezado);
            $pdf->Cell($pdf->GetStringWidth('Fecha fin:') + $margen, 8, utf8_decode('Fecha fin:'), 'B', 0, 'L');
            $pdf->SetFont('Arial', '', $tamannoletraNormal);
            $pdf->Cell(23.2, 8, utf8_decode($arrayRetenciones[$key]['fechafin']), 'BR', 1, 'L');
            //Letra del cuerpo de la tabla
            $pdf->SetFont('Arial', '', $tamannoletraNormal);
            $this->verificarQueCabe($pdf);
            $pdf->SetX($centro);
            $pdf = $this->pintarEncabezadoHisRetenciones($pdf, $arrayRetenciones, 'Histórico de retenciones', $espacioLibre);
            foreach ($arrayHisRetencionesXret[$key] as $clave => $valor) {
                $this->verificarQueCabe($pdf);
                $pdf->SetX($centro);
                $pdf->Cell(13.602155555556, $tamannoletraEncabezado, utf8_decode($arrayHisRetencionesXret[$key][$clave]['numeronomina']), 1, 0, 'L');
                $pdf->Cell(14.073466666667, $tamannoletraEncabezado, utf8_decode($arrayHisRetencionesXret[$key][$clave]['retenido']), 1, 0, 'L');
                $pdf->Cell(25.368888888888, $tamannoletraEncabezado, utf8_decode($arrayHisRetencionesXret[$key][$clave]['saldodeladeudo']), 1, 0, 'L');
                $pdf->Cell(32.897688888889, $tamannoletraEncabezado, utf8_decode($arrayHisRetencionesXret[$key][$clave]['fechaoperacion']), 1, 0, 'L');
                $pdf->Cell(31.009622222222, $tamannoletraEncabezado, utf8_decode($arrayHisRetencionesXret[$key][$clave]['retencionpendiente']), 1, 0, 'L');
                $pdf->Cell(39.481933333333, $tamannoletraEncabezado, utf8_decode($arrayHisRetencionesXret[$key][$clave]['saldodeladeudopendiente']), 1, 1, 'L');
            }
        }
        return $pdf;
    }

    public function crearCuerpoDedApli($pdf, $arrayRetencionesXfechaYtipoRencion1)
    {
        $totalGeneral = 0;
        foreach ($arrayRetencionesXfechaYtipoRencion1 as $key1 => $arrayRetencionesXfechaYtipoRencion) {
            $areaTem = '';
            $retencion = $arrayRetencionesXfechaYtipoRencion->datosRetencion->denominacion;
            $pdf = $this->encabezados($pdf, 'Retención :', $retencion);
            $pdf->Ln();
            $SubtotalRetencion = 0;
            $SubtotalCuota = 0;
            foreach ($arrayRetencionesXfechaYtipoRencion->datos as $key => $arrayRetencion) {
                $area = $arrayRetencion['area'];
                $ci = $arrayRetencion['numero'];
                $cdgocontable = $arrayRetencion['cdgocontable'];
                $cuota = $arrayRetencion['cuota'];
                $nomina = $arrayRetencion['nomina'];
                $idpersona = $arrayRetencion['idpersona'];
                $SubtotalRetencion += $cuota;
                $totalGeneral += $cuota;
                if (!is_null($arrayRetencion['snombre'])) {
                    $nombrePersona = $arrayRetencion['nombre'] . ' ' . $arrayRetencion['snombre'] . ' ' . $arrayRetencion['papel'] . ' ' . $arrayRetencion['sapel'];
                } else {
                    $nombrePersona = $arrayRetencion['nombre'] . ' ' . $arrayRetencion['papel'] . ' ' . $arrayRetencion['sapel'];
                }
                if ($area != $areaTem) {
                    $pdf = $this->verificarQueCabe($pdf);
                    $areaTem = $area;
                    if ($key != 0) {
                        $this->imprimirSubtotalArea($pdf, $SubtotalCuota);
                        $SubtotalCuota = 0;
                    }
                    $pdf = $this->encabezados($pdf, 'Área: ', $area);
                    $pdf->Ln();
                    $pdf->SetFont('Arial', 'B', 10);
                    $pdf->SetX(8);
                    $pdf->Cell($pdf->GetStringWidth("Empleado: "), 7, utf8_decode("Empleado: "), 0, 0, 'L');
                    $pdf->SetX(220);
                    $pdf->Cell($pdf->GetStringWidth("Cuota "), 7, utf8_decode("Cuota "), 0, 0, 'L');
                    $pdf->SetX(240);
                    $pdf->Cell($pdf->GetStringWidth("Nómina "), 7, utf8_decode("Nómina "), 0, 0, 'L');
                    $pdf->Ln();
                }
                $SubtotalCuota += $cuota;
                if ($cuota != 0) {
                    $pdf = $this->verificarQueCabe($pdf);
                    $pdf->SetFont('Arial', '', 10);
                    $pdf->SetX(16);
                    $pdf->Cell($pdf->GetStringWidth('  '), 7, utf8_decode('  '), 0, 0, 'L');
                    $pdf->Cell($pdf->GetStringWidth($ci), 7, utf8_decode($ci), 0, 0, 'L');
                    $pdf->Cell($pdf->GetStringWidth('  '), 7, utf8_decode('  '), 0, 0, 'L');
                    $pdf->Cell($pdf->GetStringWidth($nombrePersona), 7, utf8_decode($nombrePersona), 0, 0, 'L');
                    $pdf->SetX(220);
                    $pdf->Cell($pdf->GetStringWidth($cuota), 7, utf8_decode($cuota), 0, 0, 'L');
                    $pdf->SetX(240);
                    $pdf->Cell($pdf->GetStringWidth($nomina), 7, utf8_decode($nomina), 0, 1, 'L');
                    $pdf = $this->verificarQueCabe($pdf);
                }
                if ($key == count($arrayRetencionesXfechaYtipoRencion->datos) - 1) {
                    $this->imprimirSubtotalArea($pdf, $SubtotalCuota);
                    $SubtotalCuota = 0;
                }
            }
            $pdf = $this->verificarQueCabe($pdf);
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->SetX(188);
            $pdf->Cell($pdf->GetStringWidth('Subtotal Deducción'), 7, utf8_decode("Subtotal Deducción"), 0, 0, 'L');
            $pdf->SetX(220);
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell($pdf->GetStringWidth($SubtotalRetencion), 7, utf8_decode($SubtotalRetencion), 'T', 1, 'L');
        }
        $pdf = $this->verificarQueCabe($pdf);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetX(188);
        $pdf->Cell($pdf->GetStringWidth('TOTAL GENERAL'), 7, utf8_decode("TOTAL GENERAL"), 0, 0, 'L');
        $pdf->SetX(220);
        $pdf->Cell($pdf->GetStringWidth($totalGeneral), 7, utf8_decode($totalGeneral), 'T', 1, 'L');
        return $pdf;
    }

    private function imprimirSubtotalArea($pdf, $SubtotalCuota)
    {
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetX(192);
        $pdf->Cell($pdf->GetStringWidth('Subtotal Área'), 7, utf8_decode("Subtotal Área"), 0, 0, 'L');
        $pdf->SetX(220);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell($pdf->GetStringWidth($SubtotalCuota), 7, utf8_decode($SubtotalCuota), 'T', 1, 'L');
    }

    public function DatosGenerales($pdf)
    {
        $pdf->SetTitle("SNC-225");
        $pdf->SetAuthor("Tte. Ing. Roberto León Socarrás");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);
        return $pdf;
    }

    //Todas las Retenciones Personas
    public function exportarListadoTodasRetenciones($identidad, $todasretenciones)
    {
        $objHisRetenciones = new HisRetencionesPersona();
        $datosEntidad = $objHisRetenciones->obtenerDatosEntidadDadoId($identidad);
        $listretenciones = implode(',', $todasretenciones);
        $datospersonas = $objHisRetenciones->obtenerTodasRetencionesEntidad($identidad, $listretenciones);
        $rpersonasretenciones = array();
        foreach ($datospersonas as $persona) {
            $rpersonasretenciones[$persona['denomretencion']][$persona['area']][] = $persona;
        }
        $pdf = new PDFDedApli('l', 'mm', 'letter');//216(ancho) X 279(alto)
        $pdf->AddPage();
        $pdf = $this->crearCabezeraTodasRetenciones($pdf, $identidad, $datosEntidad);
        $pdf = $this->crearCuerpoTodasRetenciones($pdf, $rpersonasretenciones);
        $pdf->Output();
    }

    public function crearCabezeraTodasRetenciones(&$pdf, $identidad, $datosEntidad)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(280, 7, utf8_decode('Listado de personas por retenciones'), 0, 1, 'C');
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        $pdf->SetX(5);
        $longcodigo = $pdf->GetStringWidth($datosEntidad[0]['codigo']);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(15, 10, 'Entidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(140 - 15, 10, utf8_decode($datosEntidad[0]['denominacion']), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(130 - $longcodigo, 10, utf8_decode('Código: '), 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell($longcodigo, 10, utf8_decode($datosEntidad[0]['codigo']), 0, 1, 'L', 0);
        $this->pintarCamposCabezera($pdf);
        return $pdf;
    }

    public function pintarCamposCabezera(&$pdf)
    {
        $pdf->SetX(5);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(10, 10, 'No.', 1, 0, 'C');
        $pdf->Cell(30, 10, 'CI', 1, 0, 'C');
        $pdf->Cell(140, 10, 'Nombre y apellidos', 1, 0, 'C');
        $pdf->Cell(30, 10, 'Saldo inicial', 1, 0, 'C');
        $pdf->Cell(30, 10, 'Mensualidad', 1, 0, 'C');
        $pdf->Cell(30, 10, 'Activo', 1, 1, 'C');
        $pdf->Ln(0.1);
        return $pdf;
    }

    public function crearCuerpoTodasRetenciones(&$pdf, $rpersonasretenciones)
    {
        $cont = 1;
        foreach ($rpersonasretenciones as $tiporetencion => $retencion) {
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Ln(0.1);
            $pdf->SetX(5);
            $pdf->SetFillColor(230);//Definiendo el color de celdas
            $pdf->Cell(270, 5, utf8_decode($tiporetencion), 0, 1, 'C', 1);
            foreach ($retencion as $idarea => $area) {
                list($ordenarea, $denomarea) = explode('-', $idarea);
                $pdf->SetFont('Arial', 'B', 10);
                $pdf->SetX(5);
                $pdf->SetFillColor(248);
                $pdf->Cell(10, 5, '', 0, 0, 'L', 1);
                $pdf->Cell(260, 5, utf8_decode($denomarea), 0, 1, 'L', 1);
                foreach ($area as $persona) {
                    $pdf->SetFont('Arial', '', 10);
                    $pdf->SetX(5);
                    $pdf->Cell(10, 5, $cont++, 0, 0, 'C');
                    $pdf->Cell(30, 5, $persona['numero'], 0, 0, 'L');
                    $pdf->Cell(140, 5, utf8_decode($persona['nombrecompleto']), 0, 0, 'L');
                    $pdf->Cell(30, 5, number_format($persona['saldoinicial'], 2, '.', ''), 0, 0, 'C');
                    $pdf->Cell(30, 5, number_format($persona['mensualidad'], 2, '.', ''), 0, 0, 'C');
                    $pdf->Cell(30, 5, ($persona['activo'] == 1) ? 'Si' : 'No', 0, 1, 'C');
                    if ($pdf->GetY() >= 180) {
                        $pdf->AddPage();
                        $this->pintarCamposCabezera($pdf);
                    }
                }
            }
        }
        return $pdf;
    }
}
