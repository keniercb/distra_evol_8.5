<?php
class PDFMovimientonomina extends fpdf
{
    function Footer() {
    }
}
define("_ALTA", 1);
define("_BAJA", 2);
define("_MOV", 3);
class MovimientonominaModel extends ZendExt_Model
{
    private $idpersona;
    private $idestructura;
    private $ioc;

    public function movimientonominamodel() {
        $this->ioc = ZendExt_IoC::getInstance();
    }

    public function construirReporte($idcargo, $accion, $idsituacionl, $hist)
    {
        $pdf = new fpdf('L', 'mm', 'a4');
        $pdf->SetTitle("MOVIMIENTO DE NOMINAS");
        $pdf->SetLeftMargin(1);
        $pdf->SetFont('Times', 'B', 12);
        $pdffinal = $this->cabeceraReporteMovimiento($pdf, $idcargo, $accion, $idsituacionl, $hist);
        $pdffinal->Output();
    }

    private function cabeceraReporteMovimiento($pdf, $arraydatos)
    {
        foreach ($arraydatos as $objtrab) {
            $this->idestructura = $objtrab->idestructura;
            $this->idpersona = $objtrab->idpersona;
            $idcargo = $objtrab->idcargo;
            $accion = $objtrab->accion;
            $idsituacionl = $objtrab->idsl;
            $hist = $objtrab->hist;

            $pdf->AddPage();
            $genera = true;
            $contenido = Array();
            if (!empty($idsituacionl)) {
                $info = $this->getContenidoMovNomina($idsituacionl);
                $contenido = json_decode($info[0]['contenido']);
                if (count($info) > 0) {
                    $genera = false;
                    if ($hist!=1) {
                        $cambios = $this->getCambioSalarial($this->idpersona, $idcargo, $info[0]['fregistro']);
                        if (count($cambios)>0) {//actualizar info
                            $contenido = $this->actualizarDatosNomina(
                                $contenido, $idcargo, $idsituacionl
                            );
                        }
                    }

                }
            }
            // if ($genera == true) {
                $datossitlabsolicitada = $this->getSitLabById($idsituacionl);
                $nromn = $datossitlabsolicitada['nromn'];
                if ($accion == _MOV) {
                    if ($hist == 1) {
                        $sitmov = $this->getSitLabByfechayentidad($datossitlabsolicitada['fdesde'], $datossitlabsolicitada['idpersonaentidad'], 0);
                    } else {
                        $sitmov = $this->getSitLabByfechayentidad($datossitlabsolicitada['fdesde'], $datossitlabsolicitada['idpersonaentidad'], 1);

                    }
                }
                if (empty($nromn)) {
                    $identidadmn = $datossitlabsolicitada['identidad'];
                    $iduebmn = $datossitlabsolicitada['idueb'];
                    $nromnom = MovimientonominaModel::getNumeroConsecutivo((empty($iduebmn))?$identidadmn:$iduebmn);
                    $now = explode('/', date('d/m/Y'));
                    $nromn = (!empty($nromnom['nro']) && $now[2] == $nromnom['anno'])?$nromnom['nro']+1:1;
                    MovimientonominaModel::addupdNumeroConsecutivo(
                        (empty($iduebmn))?$identidadmn:$iduebmn, $nromn, $now[2], ($nromnom['nro'])?0:1
                    );

                    $objSitLab = new DatSituacionlaboral();
                    $objsit = $objSitLab->getById($idsituacionl);

                    $objsit->nromn = $nromn;
                    $objsit->save();
                }
                $idsitactual = ($hist == 1) ?$idsituacionl:$sitmov['idsituacionlaboralp'];
                $idsitnueva = ($hist == 1) ?$sitmov['idsituacionlaboralp']:$idsituacionl;
                $this->guardarContenidoMovNomina(
                    ($accion == _ALTA)?null:$idsitactual,
                    ($accion == _BAJA)?null:$idsitnueva
                );
                $info = $this->getContenidoMovNomina($idsituacionl);
                if ($info != null) {
                    $contenido = json_decode($info[0]['contenido']);
                }
            // }
            $fechaMovimientoe = explode('/', $contenido->falta);
            $diaaltae = $fechaMovimientoe[0];
            $mesaltae = $fechaMovimientoe[1];
            $annoaltae = $fechaMovimientoe[2];
            $fechaMovimiento = explode('/', $contenido->fmov);
            $diaalta = $fechaMovimiento[0];
            $mesalta = $fechaMovimiento[1];
            $annoalta = $fechaMovimiento[2];
            if ($contenido->tipomov == 3) {
                $mov = 'X';
            } else if ($contenido->tipomov == 2){
                $baja = 'X';
            } else {
                $alta = 'X';
            }
            $pdf->SetFont('Times', 'B', 12);
            //Primera fila del encabezado
            $pdf->SetX(20);
            $pdf->Cell(35, 7, "ORGANISMO:", 1, 0, 'T');
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(185, 7, utf8_decode($contenido->organismo), 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(40, 7, "MOVIMIENTO", 'TR', 0, 'C');
            $pdf->Ln(7);
            //Segunda fila
            $pdf->SetX(20);
            $pdf->Cell(35, 7, "EMPRESA:", 1, 0, 'T');
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(185, 7, utf8_decode($contenido->entidad), 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(40, 7, "DE", 'R', 0, 'C');
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->Cell(35, 7, "UNIDAD:", 'L', 0, 'T');
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(185, 7, utf8_decode($contenido->ueb), 'LR', 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(40, 7, "NOMINAS", 'R', 0, 'C');
            $pdf->Ln(7);
            //tercera fila
            $pdf->SetX(20);
            $pdf->Cell(35, 7, "EXPEDIENTE", 1, 0, 'T');
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(70, 7, $contenido->expediente, 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(95, 7, 'FECHA DE ALTA EN LA ENTIDAD', 1, 0);
            $pdf->Cell(10, 7, "D", 1, 0, 'T');
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(10, 7, "$diaaltae", 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(10, 7, "M", 1, 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(10, 7, "$mesaltae", 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(10, 7, "A", 1, 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(10, 7, "$annoaltae", 1, 0);
            $pdf->Ln(7);
            //cuarta fila
            $pdf->SetX(20);
            $pdf->Cell(0.1, 7, "", 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(35, 7, "ALTA: $alta", 0, 0, 'T');
            $pdf->Cell(35, 7, " BAJA: $baja", 0, 0, 'T');
            $pdf->Cell(35, 7, " CAMBIO: $mov", 0, 0, 'T');
            $pdf->Cell(95, 7, "FECHA EFECTIVA DEL MOVIMIENTO", 1, 0, 'T');
            $pdf->Cell(10, 7, "D", 1, 0, 'T');
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(10, 7, "$diaalta", 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(10, 7, "M", 1, 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(10, 7, "$mesalta", 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(10, 7, "A", 1, 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(10, 7, "$annoalta", 1, 0);
            $pdf->Ln(7);
            //quinta fila
            $pdf->SetFont('Times', 'B', 12);
            $pdf->SetX(20);
            $pdf->Cell(30, 7, "NOMBRE", 1, 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(55, 7, utf8_decode($contenido->nombre), 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(30, 7, "1ER APELL.", 1, 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(55, 7, utf8_decode($contenido->papel), 1, 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(30, 7, "2DO APELL.", 1, 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(60, 7, utf8_decode($contenido->sapel), 1, 0);
            //sexta fila
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(130, 7, "SITUACION ACTUAL", 1, 0, 'C');
            $pdf->Cell(130, 7, "SITUACION NUEVA", 1, 0, 'C');
            //septima fila
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->Cell(130, 7, "PUESTO DE TRABAJO", 1, 0);
            $pdf->Cell(130, 7, "PUESTO DE TRABAJO", 1, 0);
            //octava fila
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(130, 7, utf8_decode($contenido->cargoactual), 1, 0, 'C');
            $pdf->Cell(130, 7, utf8_decode($contenido->cargonueva), 1, 0, 'C');
            //novena fila
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(130, 7, "AREA DE TRABAJO Y DEPARTAMENTO", 1, 0);
            $pdf->Cell(130, 7, "AREA DE TRABAJO Y DEPARTAMENTO", 1, 0);
            //decima fila
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(130, 7, utf8_decode($contenido->areaactual), 1, 0, 'C');
            $pdf->Cell(130, 7,utf8_decode($contenido->areanueva), 1, 0, 'C');

            //tipo de contrato
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(130, 7, "TIPO DE CONTRATO", 1, 0);
            $pdf->Cell(130, 7, "TIPO DE CONTRATO", 1, 0);
            //
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(130, 7, utf8_decode($contenido->tcactual), 1, 0, 'C');
            $pdf->Cell(130, 7, utf8_decode($contenido->tcnueva), 1, 0, 'C');
            //duodecima fila
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(130, 7, "PARA USO DEL TRABAJO", 1, 0, 'C');
            $pdf->Cell(130, 7, "PARA USO DEL TRABAJO", 1, 0, 'C');
            //decimotercera fila
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->Cell(32.5, 6, "REG.SAL.", 'LR', 0);
            $pdf->Cell(32.5, 6, "HORARIO", 'LR', 0);
            $pdf->Cell(32.5, 6, "MENSUAL", 'LR', 0);
            $pdf->Cell(32.5, 6, "RENDIM.", 'LR', 0);
            $pdf->Cell(32.5, 6, "REG.SAL.", 'LR', 0);
            $pdf->Cell(32.5, 6, "HORARIO", 'LR', 0);
            $pdf->Cell(32.5, 6, "MENSUAL", 'LR', 0);
            $pdf->Cell(32.5, 6, "RENDIM.", 'LR', 0);
            $pdf->Ln(6);
            $pdf->SetX(20);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(32.5, 6, ($accion != _ALTA)?"Mensual":'', 'LR', 0);
            $pdf->Cell(32.5, 6, "", 'LR', 0);
            $pdf->Cell(32.5, 6, "", 'LR', 0);
            $pdf->Cell(32.5, 6, "", 'LR', 0);
            $pdf->Cell(32.5, 6, ($accion != _BAJA) ? "Mensual" : '', 'LR', 0);
            $pdf->Cell(32.5, 6, "", 'LR', 0);
            $pdf->Cell(32.5, 6, "", 'LR', 0);
            $pdf->Cell(32.5, 6, "", 'LR', 0);
            $pdf->Ln(6);
            $pdf->SetX(20);
            $pdf->Cell(260, 0.1, "", 1, 0);
            //DECIMOCUARTA FILA
            $pdf->Ln(0.1);
            $pdf->SetX(20);
            $y = $pdf->getY();
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(26, 7, "Salario: ".$contenido->salarioactual, 1, 0);
            $cont = 0;
            foreach ($contenido->elemsalactual as $pos=>$cn) {
                $cont++;
                if ($cont == 5) {
                    $cont = 0;
                    $pdf->Ln(7);
                    $pdf->SetX(20);
                }
                if ($pos == 3) {
                    $pdf->Cell(26, 7, "Total: " . $contenido->totalactual, 1, 0);
                    $cont = 0;
                    $pdf->Ln(7);
                    $pdf->SetX(20);
                }
                $pdf->Cell(26, 7, $cn, 1, 0);
            }
            if (count($contenido->elemsalactual)<4) {
                $pdf->Cell(26, 7, "Total: " . $contenido->totalactual, 1, 0);
            }

            $pdf->SetY($y);
            $pdf->SetX(150);
            $pdf->Cell(26, 7, "Salario: ".$contenido->salarionueva, 1, 0);
            $cont = 0;
            foreach ($contenido->elemsalnueva as $pos=>$cn) {
                $cont++;
                if ($cont == 5) {
                    $cont = 0;
                    $pdf->Ln(7);
                    $pdf->SetX(150);
                }
                if ($pos == 3) {
                    $pdf->Cell(26, 7, "Total: " . $contenido->totalnueva, 1, 0);
                    $cont = 0;
                    $pdf->Ln(7);
                    $pdf->SetX(150);
                }
                $pdf->Cell(26, 7, $cn, 1, 0);
            }
            if (count($contenido->elemsalnueva)<4) {
                $pdf->Cell(26, 7, "Total: " . $contenido->totalnueva, 1, 0);
            }

            $pdf->SetX(254);
            $pdf->Cell(26, 7, "", 'R', 0);
            //Decimosexta fila
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(35, 7, "GRUPO ESCALA ", 'LT', 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(25, 7, $contenido->grupoescalaactual, 'RT', 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(28, 7, "CATEGORIA ", 'LT', 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(42, 7, utf8_decode($contenido->categoriaactual), 'RT', 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(35, 7, "GRUPO ESCALA ", 'LT', 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(25, 7, $contenido->grupoescalanueva, 'RT', 0);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(28, 7, "CATEGORIA ", 'LT', 0);
            $pdf->SetFont('Times', '', 12);
            $pdf->Cell(42, 7, utf8_decode($contenido->categorianueva), 'RT', 0);
            //DECIMOSEPTIMA FILA
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(60, 7, "MOTIVO DE MOVIMIENTO", 1, 0);
            $pdf->SetFont('Times', '', 12);

            $pdf->Cell(200, 7, utf8_decode($contenido->motivo), 1, 0);
            //DECIMO-OCTAVA FILA
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->SetFont('Times', 'B', 12);
            $pdf->Cell(50, 7, "HECHO POR", 1, 0);
            $pdf->Cell(90, 7, "PARA USO DE TRABAJO APROB:", 1, 0);
            $pdf->Cell(80, 7, "PARA USO DE NOMINAS", 1, 0);
            $pdf->Cell(40, 7, "NUMERO", 1, 0);
            //DECIMONOVENA FILA
            $pdf->Ln(7);
            $pdf->SetX(20);
            $pdf->Cell(50, 15, "", 1, 0);
            $pdf->Cell(45, 15, "APROBADO POR:", 1, 0);
            $pdf->Cell(45, 15, "REGISTRADO POR:", 1, 0);
            $pdf->Cell(40, 15, "CONFECCIONADO", 1, 0);
            $pdf->Cell(40, 15, "REVISADO", 1, 0);

            $pdf->Cell(40, 15, $contenido->nro, 1, 0, 'C');
        }

        return $pdf;
    }

    private function ConceptosP()
    {
        try {
            $sql = "SELECT ccpd.idconcepto, cpd.abreviatura
                FROM mod_rrhhmaestro.conf_conceptosnomina as ccpd 
                INNER JOIN mod_nomina.nom_conceptopercepciondescuento AS cpd ON (ccpd.idconcepto = cpd.idconceptopercepciondescuento)";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->fetchAll($sql);
        } catch (Exception $e) {
            return Array();
        }
    }

    private function getDenomConcepto($idconcepto)
    {
        try {
            $sql = "SELECT cpd.idconceptopercepciondescuento, cpd.abreviatura
                FROM mod_nomina.nom_conceptopercepciondescuento AS cpd 
                WHERE cpd.idconceptopercepciondescuento = $idconcepto";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->fetchAll($sql)[0]['abreviatura'];
        } catch (Exception $e) {
            return [];
        }
    }

    private function getPagos($idcargov, $idcargo, $idconc, $idestructura, $idueb)
    {
        try {
            $pagoscargov = ZendExt_IoC_Inter::getInstance()->pvd->obtenerDatosPagosAdicionalesCargo(array($idcargov), $idconc);
            $pagoscargo = ZendExt_IoC_Inter::getInstance()->pvd->obtenerDatosPagosAdicionalesCargoyPersona(
                $idestructura, array($this->idpersona), $idconc
            );

            if (count($pagoscargo) == 0 && !empty($idueb) && !empty($this->idpersona)) {
                $pagoscargo = ZendExt_IoC_Inter::getInstance()->pvd->obtenerDatosPagosAdicionalesCargoyPersona(
                    $idueb, array($this->idpersona), $idconc
                );
            }
            if (count($pagoscargo) == 0 && !empty($idcargo)){
                $pagoscargo = ZendExt_IoC_Inter::getInstance()->pvd->obtenerDatosPagosAdicionalesCargo(array($idcargo), $idconc);
                $pagoscargov[$idcargo] = $pagoscargo[$idcargo];
            } else {
                $pagoscargov[$idcargo]['conceptos'] = $this->conformarElemSalRep($pagoscargo, $this->idpersona, $idconc);
            }
            return $pagoscargov;
        } catch (Exception $e) {
            return Array();
        }
    }

    private function conformarElemSalRep(&$arrElemSal, $idpersona, &$arrCS)
    {
        $arrES = Array();
        foreach ($arrCS as $c) {
            $arrES[$c]['idconceptopd'] = $c;
            if (array_key_exists($idpersona, $arrElemSal)) {
                $arrES[$c]['importe'] = round($arrElemSal[$idpersona][$c],2);

            } else {
                $arrES[$c]['importe'] = 0.00;
            }
        }
        return $arrES;
    }

    private function getPadreEntidad($identidad)
    {
        try {
            $identidad = (empty($identidad))?$this->idestructura:$identidad;
            $sql = "SELECT 
                        de.idestructura,
                        de.denominacion AS text
                    FROM mod_estructuracomp.nom_filaestruc AS nfe
                    INNER JOIN mod_estructuracomp.dat_estructura AS de ON (nfe.idfila = de.idestructura)
                    WHERE
                        parent_path operator (public.@>) (SELECT nfe_aux.parent_path FROM mod_estructuracomp.nom_filaestruc AS nfe_aux WHERE nfe_aux.idfila = $identidad)
                        AND nfe.idconcepto IN (3, 4)
                        AND de.idproyecto = 0
                    ORDER BY nfe.parent_path";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $resp = $conn->fetchAll($sql);
            return $resp;
        } catch (Exception $e) {
            return [];
        }
    }

    public function getCatOcup($idcategoria)
    {
        try {
            if (!empty($idcategoria)) {
                $sql = "SELECT *
                    FROM mod_estructuracomp.nom_categocup
                    WHERE idcategocup = $idcategoria";
                $dm = Doctrine_Manager::getInstance();
                $conn = $dm->getCurrentConnection();
                $resp = $conn->fetchAll($sql);
                return $resp[0]['abreviatura'];
            } else {
                return '';
            }
        } catch (Exception $e) {
            return '';
        }
    }

    public function getNumeroConsecutivo($identidad)
    {
        try {
            $sql = "SELECT nro, anno
                FROM mod_fuerzatrabajo.conf_nromn
                WHERE identidad = $identidad";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->fetchAll($sql)[0];
        } catch (Exception $e) {
            return '';
        }
    }

    public function addupdNumeroConsecutivo($identidad, $nro, $anno, $add)
    {
        try {
            if ($add == 1) {
                $sql = "INSERT INTO mod_fuerzatrabajo.conf_nromn(identidad, nro, anno) VALUES ($identidad, $nro, $anno)";
            } else {
                $sql =  "UPDATE mod_fuerzatrabajo.conf_nromn SET nro = $nro, anno = $anno WHERE identidad = $identidad";
            }
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->execute($sql);
        } catch (Exception $e) {
            return '';
        }
    }

    public function addContenidoMovNomina($idsituacionlaboralactual, $contenido)
    {
        try {
            $sql = "INSERT INTO mod_fuerzatrabajo.dat_movnomina(idsituacionlaboralactual, contenido) 
                    VALUES ($idsituacionlaboralactual, '$contenido')";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $resultado = $conn->prepare($sql);
            $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
            $res = $DBC->prepare($sql);
            $res->execute();
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateContenidoMovNomina($idsituacionlaboralactual, $contenido)
    {
        $sql = "DELETE FROM mod_fuerzatrabajo.dat_movnomina WHERE idsituacionlaboralactual = $idsituacionlaboralactual";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        $res->execute();
        $this->addContenidoMovNomina($idsituacionlaboralactual, $contenido);
    }

    public function getContenidoMovNomina($idsituacionlaboralactual)
    {
        try {
            $sql = "SELECT *
                FROM mod_fuerzatrabajo.dat_movnomina
                WHERE idsituacionlaboralactual = $idsituacionlaboralactual
                ORDER BY fregistro DESC";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->fetchAll($sql);
        } catch (Exception $e) {
            return '';
        }
    }

    private function getSitLabByfechayentidad($fecha, $idpersonaentidad, $sitanterior)
    {
        $query = "SELECT
                m.*
                FROM mod_persona.dat_situacionlaboral m
                WHERE m.idpersonaentidad = $idpersonaentidad";
        if ($sitanterior == 1) {
            $query .= " AND m.fdesde < '$fecha' ORDER BY m.fdesde DESC";
        } else {
            $query .= " AND m.fdesde > '$fecha' ORDER BY m.fdesde ASC";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $result = $conn->fetchAll($query);
        return $result[0];
    }

    private function getSitLabById($id)
    {
        $query = "SELECT
                (CASE WHEN dp.snombre is not null THEN dp.nombre||' '|| dp.snombre
                    ELSE dp.nombre END) AS nombre,
                 dp.papel, dp.sapel, m.fhasta, m.fdesde, dpe.fdesde as falta, m.idcargo
                , tc.denominacion as tipocontrato, m.idmotivo, ident.numero as numid, m.nromn 
                , m.estado, nc.denominacion as cargo, estueb.denominacion as ueb, m.ueb as idueb, ns.salario
                , m.idsituacionlaboralp, m.idpersonaentidad, estop.denominacion as area, co.denominacion as categoria
                , dpe.identidad AS identidad, est.denominacion as entidad, est.codigo, ngc.denominacion as grupoescala
                FROM mod_persona.dat_situacionlaboral m
                INNER JOIN mod_fuerzatrabajo.nom_tipocontrato tc ON m.idtipocontrato = tc.idtipocontrato
                INNER JOIN mod_persona.dat_personaentidad dpe ON m.idpersonaentidad =dpe.idpersonaentidad
                INNER JOIN mod_persona.dat_persona AS dp ON (dpe.idpersona = dp.idpersona)
                LEFT JOIN mod_persona.dat_docidentidad AS ident
                    ON (dp.idpersona = ident.idpersona AND ident.principal = 1
                      AND (ident.fhasta > now() OR ident.fhasta IS NULL))
                INNER JOIN mod_estructuracomp.dat_cargo dc ON (m.idcargo = dc.idcargo AND dc.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_cargocivil AS cc ON (cc.idcargo = dc.idcargo AND cc.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.nom_categocup AS co ON (co.idcategocup = cc.idcategocup)
                INNER JOIN mod_estructuracomp.nom_cargo nc ON (dc.idnomcargo = nc.idnomcargo)
                LEFT JOIN mod_estructuracomp.nom_salario AS ns ON (ns.idsalario = dc.idsalario)
                LEFT JOIN mod_estructuracomp.nom_grupocomplejidad AS ngc ON (ns.idgrupocomplejidad = ngc.idgrupocomplejidad)
                INNER JOIN mod_estructuracomp.dat_estructura AS est ON (est.idestructura = dpe.identidad)
                INNER JOIN mod_estructuracomp.dat_estructuraop AS estop ON (estop.idestructuraop = m.idarea)
                LEFT JOIN mod_estructuracomp.dat_estructuraop AS estueb ON (estueb.idestructuraop = m.ueb)
                WHERE (m.idsituacionlaboralp = $id)";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $result = $conn->fetchAll($query);
        return $result[0];
    }

    private function getCambioSalarial($idpersona, $idcargo, $fecha)
    {
        try {
            $sql = "SELECT *
                FROM mod_nomina.dat_cambiosescalaspersonacargoconceptospd
                WHERE idpersona = $idpersona AND idcargo = $idcargo AND fecha > '$fecha'
                ORDER BY fecha DESC";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->fetchAll($sql);
        } catch (Exception $e) {
            return '';
        }
    }

    private function actualizarDatosNomina($contenido, $idcargo, $idsituacionlab, $cambiosalarial, $fmodif){
        //si hay cambio salarial se representa en la sit actual los datos que tenia en la parte de sit nueva.
        $concpd = $this->ConceptosP();
        $idconc = Array();
        $datossitlabnueva = $this->getSitLabById($idsituacionlab);
        foreach ($concpd as $con) {
            array_push($idconc, $con['idconcepto']);
        }
        $datosNomina = MovimientonominaModel::getPagos(
            null, $idcargo, $idconc, $datossitlabnueva['identidad'], $datossitlabnueva['idueb']
        );
        if (count($concpd) > 0 || count($datosNomina) > 0) {
            $totalnuevo = $datossitlabnueva['salario'];
            $arrayelemsalnuevo = Array();
            foreach ($datosNomina[$datossitlabnueva['idcargo']]['conceptos'] as $pp=>$cvn) {
                $denomconcepto = $this->getDenomConcepto($cvn['idconceptopd']);
                $arrayelemsalnuevo[] = $denomconcepto.': '.$datosNomina[$datossitlabnueva['idcargo']]['conceptos'][$pp]['importe'];
                $totalnuevo += $datosNomina[$datossitlabnueva['idcargo']]['conceptos'][$pp]['importe'];
            }
        }
        if ($cambiosalarial == 1) {
            $contenido->tipomov = 3;//modificación de salario
            $contenido->motivo = '';
            $contenido->fmov = $fmodif;
            $contenido->cargoactual = $contenido->cargonueva;
            $contenido->areaactual = $contenido->areanueva;
            $contenido->tcactual = $contenido->tcnueva;
            $contenido->grupoescalaactual = $contenido->grupoescalanueva;
            $contenido->categoriaactual = $contenido->categorianueva;
            $contenido->elemsalactual = $contenido->elemsalnueva;
            $contenido->salarioactual = $contenido->salarionueva;
            $contenido->totalactual = $contenido->totalnueva;
        }
        $contenido->elemsalnueva = $arrayelemsalnuevo;
        $contenido->salarionueva = (empty($datossitlabnueva['salario']))?0:$datossitlabnueva['salario'];
        $contenido->totalnueva = $totalnuevo;

        $this->updateContenidoMovNomina($idsituacionlab, json_encode($contenido));
        return $contenido;
    }

    public function actualizarMovimientosNomina($arryCargos)
    {
        $desactualizadas = [];
        $datos = DatSituacionlaboral::getSituacioneslabDesactualizadas($arryCargos);
        foreach ($datos as $k) {
            $contenidosjson = json_decode($k['contenido'], true);
            $idcargo = $k['idcargo'];
            $salarionueva = $contenidosjson['salarionueva'];
            $datossalario = $this->obtenerSalarioEstructuraByidcargo($idcargo);
            $salarioestructura = $datossalario[0]['salario'];
            $grupoescalanueva = $datossalario[0]['denominacion'];
            if ($salarionueva != $salarioestructura) {
                $contenidonuevo = [
                    'organismo' => $contenidosjson['organismo'],
                    'entidad' => $contenidosjson['entidad'],
                    'ueb' => $contenidosjson['ueb'],
                    'expediente' => $contenidosjson['expediente'],
                    'falta' => $contenidosjson['falta'],
                    'fmov' => $contenidosjson['fmov'],
                    'tipomov' => $contenidosjson['tipomov'],
                    'nombre' => $contenidosjson['nombre'],
                    'papel' => $contenidosjson['papel'],
                    'motivo' => $contenidosjson['motivo'],
                    'nro' => $contenidosjson['nro'],
                    'cargoactual' => $contenidosjson['cargoactual'],
                    'areaactual' => $contenidosjson['areaactual'],
                    'tcactual' => $contenidosjson['tcactual'],
                    'grupoescalaactual' => $contenidosjson['grupoescalaactual'],
                    'categoriaactual' => $contenidosjson['categoriaactual'],
                    'elemsalactual' => $contenidosjson['elemsalactual'],
                    'salarioactual' => $contenidosjson['salarioactual'],
                    'totalactual' => $contenidosjson['totalactual'],
                    'cargonueva' => $contenidosjson['cargonueva'],
                    'areanueva' => $contenidosjson['areanueva'],
                    'tcnueva' => $contenidosjson['tcnueva'],
                    'grupoescalanueva' => $grupoescalanueva,
                    'categorianueva' => $contenidosjson['categorianueva'],
                    'elemsalnueva' => $contenidosjson['elemsalnueva'],
                    'salarionueva' => $salarioestructura,
                    'totalnueva' => $contenidosjson['totalnueva'],
                ];
                $k['contenido'] = json_encode($contenidonuevo);
                $desactualizadas[] = $k;
            }
            
        }

        foreach ($desactualizadas as $sit) {
            $contenido = Array();
            $contenido = json_decode($sit['contenido']);
            $idsituacionlab = $sit['idsituacionlaboralp'];
            $this->updateSoloContenidoMovNomina($idsituacionlab, json_encode($contenido));
        }
        return true;
    }

    public function obtenerSalarioEstructuraByidcargo($idcargo)
    {
        $sql = "SELECT  ns.salario, ngc.denominacion
                FROM mod_estructuracomp.dat_cargo dc
                INNER JOIN mod_estructuracomp.nom_salario ns on (dc.idsalario = ns.idsalario)
                INNER JOIN mod_estructuracomp.nom_grupocomplejidad ngc on (ns.idgrupocomplejidad = ngc.idgrupocomplejidad)
                Where dc.idsalario = ns.idsalario and idcargo = $idcargo;";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $salario = $conn->fetchAll($sql);
        return $salario;
    }

    public function updateSoloContenidoMovNomina($idsituacionlaboralactual, $contenido)
    {
        $sql = "UPDATE mod_fuerzatrabajo.dat_movnomina 
            SET contenido = $contenido
            WHERE idsituacionlaboralactual = $idsituacionlaboralactual;";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $resultado = $conn->prepare($sql);
        $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'],$resultado->getConnection()->getOptions()['username'],$resultado->getConnection()->getOptions()['password']);
        $res = $DBC->prepare($sql);
        $res->execute();
    }

    public function guardarContenidoMovNomina($idsituacionlaboralactual, $idsituacionlaboralnueva)
    {
        //try{
            if (!empty($idsituacionlaboralactual)) {
                $datossitlabactual = $this->getSitLabById($idsituacionlaboralactual);
            }
            if (!empty($idsituacionlaboralnueva)) {
                $datossitlabnueva = $this->getSitLabById($idsituacionlaboralnueva);
            }
            $padreentidad = $this->getPadreEntidad((!empty($idsituacionlaboralactual))?$datossitlabactual['identidad']:$datossitlabnueva['identidad']);
            $organismo = $padreentidad[0]['text'];
            if ($datossitlabactual['estado'] == 1 || $datossitlabactual['estado'] == 2) {
                $motivo = DatSituacionlaboral::getMotivoBajaSituacionLabById($idsituacionlaboralactual, $datossitlabactual['estado']);
                $datossitlabactual['motivo'] = $motivo[0]['motivo'];
            } else {
                $datossitlabactual['motivo'] = '';
            }
            //Datos de nómina
            $concpd = $this->ConceptosP();
            $idconc = Array();
            foreach ($concpd as $con) {
                array_push($idconc, $con['idconcepto']);
            }
            $datosNomina = MovimientonominaModel::getPagos(
                $datossitlabactual['idcargo'], $datossitlabnueva['idcargo'], $idconc,
                (!empty($idsituacionlaboralactual))? $datossitlabactual['identidad']:$datossitlabnueva['identidad'],
                (!empty($idsituacionlaboralactual))?$datossitlabactual['idueb']:$datossitlabnueva['idueb']
            );
            if (count($concpd) > 0 || count($datosNomina) > 0) {
                $totalactual = $datossitlabactual['salario'];
                $totalnuevo = $datossitlabnueva['salario'];
                $arrayelemsalactual = Array();
                $arrayelemsalnuevo = Array();
                $idcargoconceptos = (!empty($idsituacionlaboralactual))?$datossitlabactual['idcargo']:$datossitlabnueva['idcargo'];
                foreach ($datosNomina[$idcargoconceptos]['conceptos'] as $pp=>$cvn) {
                    $denomconcepto = $this->getDenomConcepto($cvn['idconceptopd']);
                    $importeact = (!empty($idsituacionlaboralactual))?$cvn['importe']:'0.00';
                    $arrayelemsalactual[] = $denomconcepto.': '.$importeact;
                    $arrayelemsalnuevo[] = $denomconcepto.': '.$datosNomina[$datossitlabnueva['idcargo']]['conceptos'][$pp]['importe'];
                    if (strpos($denomconcepto, 'CUC') === false) {
                        $totalactual += $cvn['importe'];
                        $totalnuevo += $datosNomina[$datossitlabnueva['idcargo']]['conceptos'][$pp]['importe'];
                    }
                }
            }
            //Conformar contenido json para guardar
            $contenido['organismo'] = $organismo;
            $contenido['entidad'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['entidad'].'('.$datossitlabactual['codigo'].')':
                $datossitlabnueva['entidad'].'('.$datossitlabnueva['codigo'].')';
            $contenido['ueb'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['ueb']:$datossitlabnueva['ueb'];
            $contenido['expediente'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['numid']:$datossitlabnueva['numid'];
            $contenido['falta'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['falta']:$datossitlabnueva['falta'];
            $contenido['fmov'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['fhasta']:$datossitlabnueva['fdesde'];
            if (!empty($idsituacionlaboralactual)) {
                $contenido['tipomov'] = ($datossitlabactual['estado']==2)?2:3;
            } else {
                $contenido['tipomov'] = 1;
            }
            $contenido['nombre'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['nombre']:$datossitlabnueva['nombre'];
            $contenido['papel'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['papel']:$datossitlabnueva['papel'];
            $contenido['sapel'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['sapel']:$datossitlabnueva['sapel'];
            $contenido['motivo'] = $datossitlabactual['motivo'];
            $contenido['nro'] = (!empty($idsituacionlaboralactual))?$datossitlabactual['nromn']:$datossitlabnueva['nromn'];

            $contenido['cargoactual'] = $datossitlabactual['cargo'];
            $contenido['areaactual'] = $datossitlabactual['area'];
            $contenido['tcactual'] = $datossitlabactual['tipocontrato'];
            $contenido['grupoescalaactual'] = $datossitlabactual['grupoescala'];
            $contenido['categoriaactual'] = $datossitlabactual['categoria'];
            $contenido['elemsalactual'] = $arrayelemsalactual;
            $contenido['salarioactual'] = $datossitlabactual['salario'];
            $contenido['totalactual'] = $totalactual;

            $contenido['cargonueva'] = $datossitlabnueva['cargo'];
            $contenido['areanueva'] = $datossitlabnueva['area'];
            $contenido['tcnueva'] = $datossitlabnueva['tipocontrato'];
            $contenido['grupoescalanueva'] = $datossitlabnueva['grupoescala'];
            $contenido['categorianueva'] = $datossitlabnueva['categoria'];
            $contenido['elemsalnueva'] = $arrayelemsalnuevo;
            $contenido['salarionueva'] = (empty($datossitlabnueva['salario']))?0:$datossitlabnueva['salario'];
            $contenido['totalnueva'] = $totalnuevo;
            $idsitlab = (empty($idsituacionlaboralactual))?$idsituacionlaboralnueva:$idsituacionlaboralactual;
            $this->addContenidoMovNomina($idsitlab, json_encode($contenido));

            //si es un movimiento de cargo se debe guardar 2 movimientos de nomina
            if (!empty($idsituacionlaboralactual) && !empty($idsituacionlaboralnueva)){
                $contenido['nro'] = $datossitlabnueva['nromn'];
                $contenido['ueb'] = $datossitlabnueva['idueb'];
                $this->addContenidoMovNomina($idsituacionlaboralnueva, json_encode($contenido));
            }
            return true;
       /* } catch (Exception $e) {
            return false;
        }*/
    }
}