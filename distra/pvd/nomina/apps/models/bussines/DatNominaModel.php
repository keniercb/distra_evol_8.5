<?php

//include_once('../../comun/clases/Mipdf.php');

/***
 * Class Mipdf
 * @Autor Tte.Ing. Roberto León Socarrás
 */
class Mipdf extends fpdf
{

    private $arrayEncabezado;
    private $arrayDatos;
    private $agrupador;
    private $tamannoLetraContenido;
    private $tamannoLetraEncabezado;
    private $ajusteancho;
    private $ajustepos;
    private $arraytamannosencabezados;
    private $arrayposicionencabezados;
    private $ancho;
    private $largo;
    private $anchoTabla;
    public $identidad;

    function __construct($arrayDatos, $arrayEncabezado, $orientation = 'L', $unit = 'mm', $format = 'A4')
    {
        parent::fpdf($orientation, $unit, $format);
        $this->arrayDatos = $arrayDatos;
        $this->arrayEncabezado = $arrayEncabezado;
        $this->tamannoLetraContenido = 10;
        $this->tamannoLetraEncabezado = 12;
        $this->ajusteancho = 0;
        $this->ajustepos = 0;
        $this->anchoTabla = 0;
        $this->arraytamannosencabezados = array();
        $this->arrayposicionencabezados = array();
        $this->SetX(-1);
        $this->ancho = $this->GetX() + 1;
        $this->SetX(0);
        $this->SetY(-1);
        $this->largo = $this->GetY() + 1;
        $this->SetY(0);
        $this->guardarAnchosColumnas();
    }

    function fnSetDatosPiePagina($datospiepagina)
    {
        $this->datospiepagina = $datospiepagina;
    }

    function fnGetDatosPiePagina()
    {
        return $this->datospiepagina;
    }

    /**
     * @param mixed $arrayEncabezado
     */
    public function setArrayEncabezado($arrayEncabezado)
    {
        $this->arrayEncabezado = $arrayEncabezado;
    }

    /**
     * @return mixed
     */
    public function getArrayEncabezado()
    {
        return $this->arrayEncabezado;
    }

    /**
     * @return mixed
     */
    public function getAgrupador()
    {
        return $this->agrupador;
    }

    /**
     * @param mixed $agrupador
     */
    public function setAgrupador($agrupador)
    {
        $this->agrupador = $agrupador;
    }

    /**
     * @return int
     */
    public function getAjusteancho()
    {
        return $this->ajusteancho;
    }

    /**
     * @param int $ajusteancho
     */
    public function setAjusteancho($ajusteancho)
    {
        $this->ajusteancho = $ajusteancho;
    }

    /**
     * @return int
     */
    public function getAjustepos()
    {
        return $this->ajustepos;
    }

    /**
     * @param int $ajustepos
     */
    public function setAjustepos($ajustepos)
    {
        $this->ajustepos = $ajustepos;
    }

    /**
     * @return array
     */
    public function getArraytamannosencabezados()
    {
        return $this->arraytamannosencabezados;
    }

    /**
     * @param array $arraytamannosencabezados
     */
    public function setArraytamannosencabezados($arraytamannosencabezados)
    {
        $this->arraytamannosencabezados = $arraytamannosencabezados;
    }

    /**
     * @return array
     */
    public function getArrayposicionencabezados()
    {
        return $this->arrayposicionencabezados;
    }

    /**
     * @param array $arrayposicionencabezados
     */
    public function setArrayposicionencabezados($arrayposicionencabezados)
    {
        $this->arrayposicionencabezados = $arrayposicionencabezados;
    }

    /**
     * @return mixed
     */
    public function getAncho()
    {
        return $this->ancho;
    }

    /**
     * @param mixed $ancho
     */
    public function setAncho($ancho)
    {
        $this->ancho = $ancho;
    }

    /**
     * @return mixed
     */
    public function getLargo()
    {
        return $this->largo;
    }

    /**
     * @param mixed $largo
     */
    public function setLargo($largo)
    {
        $this->largo = $largo;
    }

    /**
     * @return int
     */
    public function getAnchoTabla()
    {
        return $this->anchoTabla;
    }

    /**
     * @param int $anchoTabla
     */
    public function setAnchoTabla($anchoTabla)
    {
        $this->anchoTabla = $anchoTabla;
    }


    /**
     * @param mixed $arrayDatos
     */
    public function setArrayDatos($arrayDatos)
    {
        $this->arrayDatos = $arrayDatos;
    }

    /**
     * @return mixed
     */
    public function getArrayDatos()
    {
        return $this->arrayDatos;
    }

    /**
     * @param mixed $tamannoLetraEncabezado
     */
    public function setTamannoLetraEncabezado($tamannoLetraEncabezado)
    {
        $this->tamannoLetraEncabezado = $tamannoLetraEncabezado;
    }

    /**
     * @return mixed
     */
    public function getTamannoLetraEncabezado()
    {
        return $this->tamannoLetraEncabezado;
    }

    /**
     * @param mixed $tamannoLetraContenido
     */
    public function setTamannoLetraContenido($tamannoLetraContenido)
    {
        $this->tamannoLetraContenido = $tamannoLetraContenido;
    }

    /**
     * @return mixed
     */
    public function getTamannoLetraContenido()
    {
        return $this->tamannoLetraContenido;
    }

    /*function Footer()
    {
      $fecha = date('d-m-Y');
      $hora  = date('h:i:s A');

      $this->SetFont('Arial', 'B', 4);
      $this->SetY(-30);
      $this->SetX(20);
      $this->Write(5, 'POR RECURSOS HUMANOS');
//      $this->SetX(135);
//      $this->Write(5, 'POR EL AREA CONTABLE');
      $this->SetX(230);
      $this->Write(5, 'FECHA IMPRESION: ');
      $this->SetFont('Arial', '', 4);
      $this->Write(5, $fecha);
      $this->SetFont('Arial', 'B', 4);
      $this->Ln();
      $this->SetX(20);
      $this->Write(5, 'ELABORADO POR:');
//      $this->SetX(135);
//      $this->Write(5, 'REVISADO POR:');
      $this->SetX(230);
      $this->Write(5, 'HORA IMPRESION: ');
      $this->SetFont('Arial', '', 4);
      $this->Write(5, $hora);
      $this->SetFont('Arial', 'B', 4);
      $this->Ln();
      $this->SetX(20);
      $this->Write(5, 'REVISADO Y APROBADO POR:');
//      $this->SetX(135);
//      $this->Write(5, 'CONTABILIZADO POR:');
      $this->SetFont('Arial', 'B', 6);
      $this->Ln(10);
      $this->Cell(0, 5, ' ' . $this->PageNo(), 0, 0, 'C');


    }*/

    function Footer()
    {
        $objReportepdfModel = new ReportepdfModel();
        $datospiepagina = $this->fnGetDatosPiePagina();
        //print_r($datospiepagina);die;
        $arrayposicionescolumnas = $objReportepdfModel->fnAjustarTextosEjeX($this->ancho, 2);
        $this->SetY(-35);
        $contcolumnas = 0;
        $this->SetFont('Arial', '', 6);
        $this->SetTextColor(0, 0, 22);
        foreach ($datospiepagina as $firma) {
            $posision = ($contcolumnas % 2 == 0) ? $arrayposicionescolumnas[0] - 50 : $arrayposicionescolumnas[1] - 20;
            ($contcolumnas % 2 == 0) ? $this->Ln() : '';
            $this->SetX($posision);
            $this->Write(8, utf8_decode($firma['piefirma'] . ': ' . $firma['nombre'] . ' ______________'));
            $contcolumnas++;
        }

        $this->Ln(10);
        $this->Cell($this->ancho, 5, ' ' . $this->PageNo(), 0, 0, 'C');
    }

    public function pintarEncabezado()
    {

        $this->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
        $posmediotabla = ($this->ancho - $this->anchoTabla) / 2;
        foreach ($this->arrayEncabezado as $clave => $texto) {
            $anchoCelda = $this->arraytamannosencabezados[$clave];
            $posCelda = $this->arrayposicionencabezados[$clave] + $posmediotabla;
            $this->pintarCelda($texto, $anchoCelda, $posCelda, 'L', true, 0, 0, 200);
        }
        $this->SetFont('Arial', '', $this->tamannoLetraContenido);
        $this->Ln();

    }

    public function establecerLogo()
    {
        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($arrEstruct[0]->logo)) {
            $this->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }

        //$register = Zend_Registry::getInstance();
        //$direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        //$pdf->Image($direccion, 5, 5, 22, 10);

    }

    public function crearCabezera($tituloReporte, $entidad, $codigo)
    {
        $this->establecerLogo();

        $this->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
        $poscodigo = -($this->GetStringWidth($codigo) + $this->GetStringWidth("Código: ") + 2);
        $this->pintarCelda($tituloReporte, $this->ancho, 0, 'C', false, 0);
        $this->Ln(15);
        $this->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
        $this->pintarCelda("Entidad: ", false, 0, 'L', false, 0);
        $this->SetFont('Arial', '', $this->tamannoLetraEncabezado);
        $this->pintarCelda($entidad, false, 0, 'L', false, 0);
        $this->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
        $this->pintarCelda("Código: ", false, $poscodigo, 'L', false, 0);
        $this->SetFont('Arial', '', $this->tamannoLetraEncabezado);
        $this->pintarCelda($codigo, $this->ancho, 'final', 'L', false, 1);
        $this->Ln();
    }

    private function dameAgrupador()
    {
        return array_keys($this->arrayDatos[0])[count(array_keys($this->arrayDatos[0])) - 1];
    }

    private function adicionarPagina()
    {
        if ($this->GetY() >= ($this->largo - 40)) {
            $this->AddPage();
            $this->pintarEncabezado();
        }
    }

    public function pintarContenido()
    {
        $posmediotabla = ($this->ancho - $this->anchoTabla) / 2;
        $cant = count(array_keys($this->arrayEncabezado));
        // print_r($cant);die;
        $datos = $this->arrayDatos;
        $agrupador = $this->dameAgrupador();

        $copiaagrupador = $datos[0][$agrupador];

        $this->pintarEncabezado();

        $this->pintarCelda($this->arrayDatos[0][$agrupador], $this->anchoTabla, $posmediotabla + 1, 'C', false, 1, 0, 240);

        foreach ($datos as $clave => $valor) {
            if ($valor[$agrupador] != $copiaagrupador) {
                $this->pintarCelda($valor[$agrupador], $this->anchoTabla, $posmediotabla + 1, 'C', false, 1, 0, 240);
            }
            $i = 0;
            foreach ($valor as $c => $texto) {
                if ($i == $cant) {
                    continue;
                } else {
                    $anchoCelda = $this->arraytamannosencabezados[$i];
                    $posCelda = $this->arrayposicionencabezados[$i] + $posmediotabla;
                    $this->pintarCelda($texto, $anchoCelda, $posCelda, 'L', false, 0, 1);
                    $i++;

                }

            }

            $this->Ln();

            $copiaagrupador = $valor[$agrupador];
        }
    }

    private function guardarAnchosColumnas()
    {
        $pos = 1;
        $clavesDatos = array_keys($this->arrayDatos[0]);
        $cant = count(array_keys($this->arrayEncabezado));
        // print_r($cant);die;

        foreach ($this->arrayEncabezado as $clave => $valor) {
            $this->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
            $largoinicialEncabezado = $this->GetStringWidth($valor) + 2;
            $mayor = -9999999999;
            foreach ($this->arrayDatos as $key => $val) {
                if ($key == $cant) {
                    continue;
                } else {
                    //print_r($val[$clavesDatos[$clave]]);echo'<br/>';
                    $this->SetFont('Arial', '', $this->tamannoLetraContenido);
                    $largo = $this->GetStringWidth($val[$clavesDatos[$clave]]);

                    if ($largo > $mayor) {
                        $mayor = $largo;
                    }
                }

            }
            if ($largoinicialEncabezado >= $mayor) {
                $this->arraytamannosencabezados[$clave] = $largoinicialEncabezado + 1.5;

            } else {
                $this->arraytamannosencabezados[$clave] = $mayor + 1.5;
            }
            $this->anchoTabla += $this->arraytamannosencabezados[$clave];
            $this->arrayposicionencabezados[$clave] = $pos;
            $pos += $this->arraytamannosencabezados[$clave];

        }
        // print_r($this->arraytamannosencabezados);  die;
        $this->SetFont('Arial', '', $this->tamannoLetraContenido);
        return $this->arraytamannosencabezados;
    }

    public function DatosGenerales($titulo, $autor)
    {
        $this->SetTitle($titulo);
        $this->SetAuthor($autor);
        $this->SetLeftMargin(2);
        $this->AddPage();
        $this->SetFont('Arial', 'B', 12);
    }

    public function pintarCelda($texto, $ancho = false, $posicion = 0, $alineacion = 'L', $encabezado = false, $saltodelinea = 0, $border = 0, $color = 0, $m = '')

    {

        $posicion = ($posicion) ? $posicion : $this->GetX();
        if ($posicion == 'medio') {
            $anchotexto = $this->GetStringWidth($texto);
            $posicion = ($this->ancho + $anchotexto) / 2;
        }
        if ($posicion == 'final') {
            $anchotexto = $this->GetStringWidth($texto);
            $posicion = ($this->ancho - $anchotexto) - 3;
        }
        $ancho = ($ancho) ? $ancho : $this->GetStringWidth($texto);


        $tamannoletra = ($encabezado) ? $this->tamannoLetraEncabezado : $this->tamannoLetraContenido;
        $color = ($color == 0) ? 0 : $color;
        $llevaColor = ($color == 0) ? 0 : 1;
        $this->SetFillColor($color);

        $this->SetX($posicion - $this->ajustepos);
        $this->adicionarPagina();
        $this->SetX($posicion - $this->ajustepos);
        if ($encabezado) {
            $this->Cell($ancho - $this->ajusteancho, $tamannoletra / 2 + 2, utf8_decode($texto), $border, $saltodelinea, $alineacion, $llevaColor);
        } else {
            $this->Cell($ancho - $this->ajusteancho, $tamannoletra / 2 + 2, utf8_decode($texto), $border, $saltodelinea, $alineacion, $llevaColor);
        }
    }


}

/** Include PHPExcel */
class DatNominaModel extends ZendExt_Model
{
    /**
     * Constructor de la clase.
     * @autor Ing. Frank Rodriguez Berroa
     */
    public function DatNominaModel()
    {
        parent::ZendExt_Model();
        //$dir = $_SERVER ['DOCUMENT_ROOT'];
        //$apps = str_replace('/web', '/', $dir);
        //require_once($apps . 'apps/pvd/comun/recursos/tcpdf/config/lang/eng.php');
        //require_once($apps . 'apps/pvd/comun/recursos/tcpdf/tcpdf.php');
        //$idpersona = $idp;
    }

    /**
     *  Adiciona las nominas que se generan por periodo de pago
     * */
    public function adicionarNominas($datos)
    {
        //print_r($datos);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $pos = 0;
        $objNomina = new DatNomina();

        $c = $objNomina->obtenerCantidadNominas();

        $coleccion = new Doctrine_Collection('DatNomina');
        foreach ($datos as $i => $v) {
            $coleccion[$pos]->idelaborarpago = $v['idelaborarpago'];
            $coleccion[$pos]->idplantillanominal = $v['idplantillanominal'];
            $coleccion[$pos]->idconfmodelonomina = $v['idconfmodelonomina'];
            $coleccion[$pos]->cajacajero = $v['cajacajero'];
            $coleccion[$pos]->aprobada = $v['aprobada'];
            $pos++;
            $coleccion[$pos - 1]->numeronomina = $c + $pos;
        }
        $coleccion->save();
        $conn->commit();
        return true;
    }

    /**
     * Funcionalidad para generar reportes exel y pdf en phpexel.
     *
     * @Autor Teniente Ing. Frank Rodríguez Berroa
     *
     * @param int $id .
     *
     * @return $objPHPExcel    Reporte en Exel con los datos de la contabilizacion de los subtotales.
     **/
    public function exportarResultadoNominal($id, $idtipopago)
    {
        $objDatosNominas = new DatNominaDatos();
        $objPlantillaNominal = new ConfPlantillaNominal();
        $objPlantillaNominalCargo = new ConfPlantillaNominalCargo();
        //AQUI EMPIEZA EL CODIGO DE LA PAGINA DE LA NOMINA GENERAL
        $arrDatosNominas = $objDatosNominas->obtenerDatosNominaPlantillaPorElaborarPago($id);
        if (count($arrDatosNominas) > 0) {
            $arrCentros = array();
            foreach ($arrDatosNominas as $k => $v) {
                $denominacionplantilla = $objPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
                $arrValores = unserialize($v['valores']);
                $arrcolumna = unserialize($v['campos']);
                $arrIdsPersonas = array();
                $arrIdsCargosOcup = array();
                foreach ($arrValores as $i => $p) {
                    $a = explode('-', $p['id']);
                    $arrIdsPersonas[] = $a[0];
                    $arrIdsCargosOcup[] = $a[1];
                }
                //Busco las vacaciones de las personas
                $sqlVac = "select dvp.idpersona, hvp.tiempoacumulado, hvp.importeacumulado  from mod_nomina.dat_vacacionespersona dvp
										inner join mod_nomina.his_vacacionespersona hvp on (hvp.idvacacionespersona = dvp.idvacacionespersona)
										where hvp.idnomina = ? and (dvp.fechafin is null or dvp.fechafin >= now()) and dvp.idpersona in (" . implode(',', $arrIdsPersonas) . ");";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrVacPersonas = $conn->fetchAll($sqlVac, array($v['idnomina']));
                //Incluyo las vacaciones de la persona
                foreach ($arrValores as $i => &$p) {
                    $a = explode('-', $p['id']);
                    $tiene = 2;
                    foreach ($arrVacPersonas as $j => $vac) {
                        if ($a[0] == $vac['idpersona']) {
                            $tiene = 1;
                            break;
                        }
                    }
                    if ($tiene == 2) {
                    }
                }
                //Busco los cargos que tienen las personas
                $sqlCargos = "select idpersona||'-'||idcargosocupados as id, idcargo from mod_nomina.dat_cargosocupados where idcargosocupados in (" . implode(',', $arrIdsCargosOcup) . ");";
                $arrCargosPersonas = $conn->fetchAll($sqlCargos);
                //Conformo el array por centros productivos = centros de costos
                $contadorpersona = 0;
                foreach ($arrValores as $i => &$p) {
                    foreach ($arrCargosPersonas as $j => $carPer) {
                        $contadorpersona++;
                        if ($carPer['id'] == $p['id']) {
                            $arrCentros[$v['idplantillanominal']]->centro = $denominacionplantilla;
                            $arrCentros[$v['idplantillanominal']]->personas[] = $p;
                        }
                    }
                }
            }
        }
        //Creando el objeto de phpexel
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Contabilizar subtotales');
        //Poniéndole 15 de ancho a la dimensión de las columnas desde la A - Final
        for ($l = 0; $l <= count($arrcolumna); $l++) {
            $columna = ($l < 27) ? chr($l + 64) : 'A' . chr($l + 38);
            $objPHPExcel->getActiveSheet()->getColumnDimension($columna)->setWidth(15);
        }
        //Poniéndole 30 de ancho a la dimensión de la columna B(Nombre y Apellidos)
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(40);
        $objPHPExcel->getActiveSheet()->getRowDimension(2)->setRowHeight(40);
        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );
        //Pintando las denominaciones de los campos
        $letra = 1;
        $letraconvertida = "";
        $postbd = 0;
        $contadorcamposnomina = count($arrcolumna);
        $cantidadCamposString = 1;
        foreach ($arrcolumna as $x => $camposnomina) {
            $cantidadCamposString += ($camposnomina['tipocampo'] == 1) ? 1 : 0;
            if ($camposnomina['denominacion'] == "T.B.D") {
                $postbd = $x;
            }
            $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
            //Concatenando 1 y 2 desde A hasta UltimoCampo para escribir los campos
            $objPHPExcel->getActiveSheet()->mergeCells('' . $letraconvertida . '1:' . $letraconvertida . '2');
            $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . '1', $camposnomina['denominacion'] . '');
            //Dandole formato 'center'
            $this->fnAlinearTexto($objPHPExcel, $letraconvertida . '1', 'center', 'center', 0);
            //Dandole borders
            $this->fnPintarBordes($objPHPExcel, $letraconvertida . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraconvertida . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraconvertida . '2', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraconvertida . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $letra++;
        }
        //Variables a usar con las personas
        $sum = 0;
        $numero = 3;
        $letraaux = 1;
        $contador = 0;
        $letracondicion = $letra - 1;
        $arrfilassubtotales = array();
        $objPHPExcel->getActiveSheet()->freezePane('A3');
        foreach ($arrCentros as $i => $centro) {
            //Concatenando para escribir el nombre de los centros
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':' . $letraconvertida . '' . $numero . '');
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $numero . '', $centro->centro . '');
            //Dandole formato 'bold' a las divisiones
            $this->fnFuenteTexto($objPHPExcel, 'A' . $numero, 'Arial', 12);
            //Dandole borders
            for ($w = 1; $w <= $letracondicion; $w++) {
                $letraaux = ($w < 27) ? chr($w + 64) : 'A' . chr($w + 38);
                $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'top', PHPExcel_Style_Border::BORDER_THIN);
                if ($w == $letracondicion) {
                    $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'right', PHPExcel_Style_Border::BORDER_THIN);
                }
            }
            $numero++;
            $inicioceldaspersona = $numero;
            $arraySubtotalesXCamposMilitares = array();
            $arraySubtotalesXCamposCiviles = array();
            foreach ($centro->personas as $j => $persona) {
                $arrpersonabuscarcategoria = explode('-', $persona[id]);
                $idpersonabuscarcategoria = $arrpersonabuscarcategoria[0];
                //Buscar la categoria de la persona
                $sqlCat = "select ncp.denominacion as denom from mod_personaext.dat_categoria dc
                inner join mod_personaext.nom_categoriapersona ncp on (ncp.idcategoriapersona = dc.idcategoriapersona)
                where dc.idpersona = ?;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $categoriapersona = $conn->fetchAll($sqlCat, array($idpersonabuscarcategoria));
                $arrDatospersona = array_values($persona);
                $contmilitar = 0;
                $contcivil = 0;
                //Sumando los subtotales de los conceptos para los militares y civiles
                for ($a = 4; $a < count($arrDatospersona); $a++) {
                    $arraySubtotalesXCamposMilitares[$contmilitar] += ($categoriapersona[0]['denom'] == "Militar") ? $arrDatospersona[$a] : 0;
                    $arraySubtotalesXCamposCiviles[$contcivil] += ($categoriapersona[0]['denom'] != "Militar") ? $arrDatospersona[$a] : 0;
                    $contmilitar++;
                    $contcivil++;
                }
            }
            //Imprimiendo los valores de los campos de los militares.
            //Pintando los borders y dándole formato .00 a los valores de los campos de las personas militares
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $numero . '', 'Militares');
            $contmilitar = 0;
            for ($q = $cantidadCamposString; $q <= count($arrcolumna); $q++) {
                $columna = ($q < 27) ? chr($q + 64) : 'A' . chr($q + 38);
                $datocampo = $arraySubtotalesXCamposMilitares[$contmilitar];
                $objPHPExcel->getActiveSheet()->setCellValue($columna . $numero . '', $datocampo);
                //Dandole formato 'center'
                $this->fnAlinearTexto($objPHPExcel, $columna . $numero, 'center', 'center', 0);
                $contmilitar++;
            }
            for ($w = 1; $w <= $letracondicion; $w++) {
                $letraaux = ($w < 27) ? chr($w + 64) : 'A' . chr($w + 38);
                $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'left', PHPExcel_Style_Border::BORDER_THIN);
                //Formato .00
                $this->fnFormatoNumeros($objPHPExcel, $letraaux . $numero);
                if ($w == $letracondicion) {
                    $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'right', PHPExcel_Style_Border::BORDER_THIN);
                }
            }
            $numero++;

            //Imprimiendo los valores de los campos de los civiles.
            //Pintando los borders y dándole formato .00 a los valores de los campos de las personas civiles
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $numero . '', 'Civiles');
            $contcivil = 0;
            for ($q = $cantidadCamposString; $q <= count($arrcolumna); $q++) {
                $columna = ($q < 27) ? chr($q + 64) : 'A' . chr($q + 38);
                $datocampo = $arraySubtotalesXCamposCiviles[$contcivil];
                $objPHPExcel->getActiveSheet()->setCellValue($columna . $numero . '', $datocampo);
                //Dandole formato 'center'
                $this->fnAlinearTexto($objPHPExcel, $columna . $numero, 'center', 'center', 0);
                $contcivil++;
            }
            for ($w = 1; $w <= $letracondicion; $w++) {
                $letraaux = ($w < 27) ? chr($w + 64) : 'A' . chr($w + 38);
                $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'left', PHPExcel_Style_Border::BORDER_THIN);
                //Formato .00
                $this->fnFormatoNumeros($objPHPExcel, $letraaux . $numero);
                if ($w == $letracondicion) {
                    $this->fnPintarBordes($objPHPExcel, $letraaux . $numero, 'right', PHPExcel_Style_Border::BORDER_THIN);
                }
            }
            $numero++;

            //Imprimiendo los subtotales de los valores de los campos de los militares y civiles.
            //Pintando los borders y dándole formato .00 a los valores de los campos de los subtotales
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':' . chr($cantidadCamposString - 1 + 64) . $numero);
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $numero . '', 'Sub Total');
            //Dandole formato 'bold' a la palabra "Sub Total"
            $this->fnFuenteTexto($objPHPExcel, 'A' . $numero, 'Arial');
            //Dandole formato 'center' a la palabra "Sub Total"
            $this->fnAlinearTexto($objPHPExcel, 'A' . $numero, 'center', '', 0);
            //Dandole borders
            for ($g = 1; $g <= $letracondicion; $g++) {
                $letraactual = ($g < 27) ? chr($g + 64) : 'A' . chr($g + 38);
                $this->fnPintarBordes($objPHPExcel, $letraactual . $numero, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnFuenteTexto($objPHPExcel, $letraactual . $numero, 'Arial');
                $this->fnFormatoNumeros($objPHPExcel, $letraactual . $numero);
                //Dandole formato 'center' a la palabra "Sub Total"
                $this->fnAlinearTexto($objPHPExcel, 'A' . $numero, 'center', '', 0);
            }
            $letrad = $cantidadCamposString;
            for ($l = $letrad; $l <= $letracondicion; $l++) {
                $possumatotal = ($l < 27) ? chr($l + 64) : 'A' . chr($l + 38);
                $objPHPExcel->getActiveSheet()->setCellValue($possumatotal . $numero . '', '=SUM(' . $possumatotal . '' . $inicioceldaspersona . ':' . $possumatotal . '' . ($numero - 1) . ')');
                //Dandole formato 'center'
                $this->fnAlinearTexto($objPHPExcel, $possumatotal . $numero, 'center', 'center', 0);
            }
            $arrfilassubtotales[$contador] = $numero;
            $contador++;
            $numero++;
        }
        //      Aqui va el codigo para calcular el subtotal general haciendo uso de
        //		@$arrfilassubtotales: Arreglo con los numeros de las filas donde se encuentran los subtotales por centros de costo
        $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':' . chr($cantidadCamposString - 1 + 64) . $numero);
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $numero, 'Total General');

        //Dandole formato 'center' a la palabra Total General
        $this->fnAlinearTexto($objPHPExcel, 'A' . $numero, 'center', '', 0);
        //Dandole formato 'bold' a la palabra Total General
        $this->fnFuenteTexto($objPHPExcel, 'A' . $numero, 'Arial');
        //Dandole border 'buttoms' a la celda 'Total General'
        for ($tot = 1; $tot < $cantidadCamposString; $tot++) {
            $this->fnPintarBordes($objPHPExcel, chr($tot + 64) . $numero, 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, chr($tot + 64) . $numero, 'top', PHPExcel_Style_Border::BORDER_MEDIUM);
        }
        $this->fnPintarBordes($objPHPExcel, chr($cantidadCamposString - 1 + 64) . $numero, 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
        $valormonetario = 0;
        for ($t = $cantidadCamposString; $t <= $letracondicion; $t++) {
            $letraacumulada = ($t < 27) ? chr($t + 64) : 'A' . chr($t + 38);
            for ($y = 0; $y < count($arrfilassubtotales); $y++) {
                $posicion = $arrfilassubtotales[$y];
                $valormonetario += $objPHPExcel->getActiveSheet()->getCell('' . $letraacumulada . '' . $posicion)->getCalculatedValue();
            }
            $objPHPExcel->getActiveSheet()->setCellValue('' . $letraacumulada . '' . $numero . '', '' . $valormonetario);
            $this->fnPintarBordes($objPHPExcel, $letraacumulada . $numero, 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, $letraacumulada . $numero, 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, $letraacumulada . $numero, 'top', PHPExcel_Style_Border::BORDER_MEDIUM);
            //Dandole formato 'center'
            $this->fnAlinearTexto($objPHPExcel, $letraacumulada . $numero, 'center', 'center', 0);
            $contcivil++;
            //Dandole bold al Total General
            //Dandole formato 'bold' a la palabra Total General
            $this->fnFuenteTexto($objPHPExcel, $letraacumulada . $numero, 'Arial');
            $this->fnFormatoNumeros($objPHPExcel, $letraacumulada . $numero);
            $valormonetario = 0;
        }
        //Imprimiendo el EXEL
        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Contabilización de los subtotales.xls" ');
        header('Cache-Control: max-age=0');
//        $objPHPExcel->getSecurity()->setLockWindows(true);
//        $objPHPExcel->getSecurity()->setLockStructure(true);
//        $objPHPExcel->getSecurity()->setWorkbookPassword("PHPExcel");
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        ini_restore("max_execution_time");
        ini_restore("max_input_time");
        ini_restore("memory_limit");
    }

    public function CrearPlanilla()
    {
        $this->pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, A4, true, 'UTF-8', false);

        // set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('Boris A.');
        $this->pdf->SetTitle('TCPDF Example 002');
        $this->pdf->SetSubject('TCPDF Tutorial');
        $this->pdf->SetKeywords('TCPDF, PDF, example, test, guide');

        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

        // set default monospaced font
        // $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        //set margins
        // $this->pdf->SetMargins(10, 5, 5, 10);
        //set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        //set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        //set some language-dependent strings
        $this->pdf->setLanguageArray($l);

        //set margins
        //set margins
        $this->pdf->SetMargins(10, PDF_MARGIN_TOP, 8);
        $this->pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $this->pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

        // ---------------------------------------------------------
        // set font
        $this->pdf->SetFont('Times', 'B', 40);
    }

    public function Guardar()
    {
        $this->pdf->Output('Planilla.pdf', 'F');
    }

    /*
     * @author 1er Tte. Ing Frank Rodriguez Berroa
     * @año  2015
     * @method Metodo para contabilizar las nominas y generar el comprobante de operaciones. Esta echo de forma dinamica teniendo en cuenta que si en 'mod_rrhhmaestro.dat_modulo'
     *         el modulo de nomina en el campo apertura tiene valor 1 significa que todas las cuentas q se pongan en el comprobante tienen q tener un idcuenta en el clasificador
     *         sino se pintan los pases del comprobante y las sustituciones (centros de costo y elementos de gasto, personas, etc...) no tienen un idcuenta asociado para  hacer el
     *         procesamiento mas optimo. En el caso de los pases que no tengan idcuenta esos comprobantes no podran ser posteados pero son elaborados con el objetivo de exportarlos
     *         y contabilizarlos en otros sistemas contables, no en distra.
     * */
    public function loadDataComprobante($idelaborarpagos, $idtipopago, $tipocomprobante, $arraypersonasidcargosocupago)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $DomainNomina = new DatNomina();
        $datosNomina = new DatNominaDatos();
        //Validando que si el modulo de nomina fija obligaciones en cobros y pagos la responsabilidad material halla sido fijada desde el submayor de vacaciones
        $sql = "select cobroypago from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $cobrosypagos = $conn->fetchOne($sql);
        if ($cobrosypagos == 1) {
            //Validando que las responsabilidades materiales hayan sido fijadas en cobros y pagos como cuentas por cobrar
            $arrpersonasretenciones = DatRetencionPersona::obtenerListadoRetencionesSinComprobante($idestructura);
            //Si hay responsabilidades materiales sin haberse fijado desde el submayor de retenciones
            if(count($arrpersonasretenciones) > 0){
                $failed->text = "RESPONSABILIDAD-MATERIAL-NO-FIJADA-COBROS-PAGOS";
                return $failed;
            } else {
                //Validando que las retenciones en el nomenclador de retenciones tengan cuentas contables
                $retsincuentas = NomTipoRetencion::obtenerRetencionesSinCuentasContables();
                if (count($retsincuentas) > 0) {
                    $nombrep = '';
                    foreach ($retsincuentas as $ret){
                        if($nombrep == ''){
                            $nombrep = $ret['denominacion'];
                        }else{
                            $nombrep = $nombrep .', '. $ret['denominacion'];
                        }
                    }
                    $failed->text = "NOM-RETENCIONES-SIN-CUENTAS-CONTABLES";
                    $failed->retenciones = $nombrep;
                    return $failed;
                }else{
                    //Validando que los conceptos contable que generan impuestos y obligaciones con el presupuesto del estado tengan cuentas contables asociadas en la entidad
                    $objConfConceptosContables = new ConfigConceptosContables();
                    $arrconceptoscont = $objConfConceptosContables->obtenerTodosListadoConfigConceptosContablesEntidad($idestructura);
                    if(count($arrconceptoscont)>0){
                        $flagcc = 0;$denomcc = '';
                        foreach ($arrconceptoscont as $ccont){
                            //Validando que exista la cuenta del cliente y proveedor y la de la persona
                            $idcuentaclienteproveedor = $ccont['idclienteproveedorcobropago'];
                            if($idcuentaclienteproveedor){
                                $dcuentacc = $this->integrator->contabilidad->obtenerCuentaPorId($idcuentaclienteproveedor);
                                if(!$dcuentacc->idcuenta){
                                    $flagcc = 1;
                                    if($denomcc == ''){
                                        $denomcc =  $ccont['denominacion'];
                                    }else{
                                        $denomcc =  $denomcc.' ,'.$ccont['denominacion'];
                                    }

                                }
                            }
                            $idcuentapersona = $ccont['cuentacontable'];
                            if($idcuentapersona){
                                $dcuentap = $this->integrator->contabilidad->obtenerCuentaPorId($idcuentapersona);
                                if(!$dcuentap->idcuenta){
                                    $flagcc = 1;
                                    if($denomcc == ''){
                                        $denomcc =  $ccont['denominacion'];
                                    }else{
                                        $denomcc =  $denomcc.' ,'.$ccont['denominacion'];
                                    }

                                }
                            }
                        }
                        if($flagcc == 1){
                            $failed->text = "CONCEPTOS-CONTABLES-SIN-CUENTAS-CONTABLES";
                            $failed->conceptocontable = $denomcc;
                            return $failed;
                        }else {
                            //Si la Nomina es de Reintegro se valida que no hallan personas con mas importe que el saldo de la cuenta por cobrar
                            $idtiponomina = ConfigModeloNomina::obtenerIdTiposNominaporTipoPago($idelaborarpagos);
                            $reintegro = NomTipoNomina::obtenerReintegroNomina($idtiponomina[0]['idtiponomina']);
                            //Si hay un Campo de acreditacion del salario
                            $camposalario = ConfigEstructurarModelosNomina::obtenerCampoADevengarEntidad($idelaborarpagos, 1, $idestructura);
                            if($reintegro == 1){
                                if($camposalario){
                                    $mg = Doctrine_Manager::getInstance();
                                    $conn = $mg->getCurrentConnection();
                                    //Validando que si es una Nomina de Reintegros no se liquide mas Importe que el saldo que tiene la Cuenta por pagar al trabajador
                                    $valnomina = DatNominaDatos::obtenerValoresNominaPorElaborarPago($idelaborarpagos);
                                    $datosn = unserialize($valnomina);
                                    //Recorriando las personas de la Nomina
                                    $arraymensajes = array();
                                    foreach ($datosn as $dn){
                                        $idpersona = explode('-', $dn['id'])[0];
                                        $datosreintegrop = DatReintegros::obtenerDatosPersona($idpersona, $idestructura);
                                        $iddocumentoobligacion = $datosreintegrop[0]['iddocumentoobligacion'];
                                        if($iddocumentoobligacion){
                                            $importepersonanomina = $dn["c$camposalario"];
                                            //Importe de la Cuenta por pagar
                                            $datoscuentaxcobrar = $this->integrator->copa->obtenerDuoPorIds(array($iddocumentoobligacion));
                                            $pendienteliquidar = $datoscuentaxcobrar[0]['importemb'] - $datoscuentaxcobrar[0]['liquidadomb'];
                                            //Si a la persona se le esta liquidando mas por nomina que el saldo de la cuenta por cobrar
                                            if($importepersonanomina > $pendienteliquidar){
                                                $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		        where                                           dp.idpersona = ?;";
                                                $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($idpersona));
                                                $nombrepersona = $arrdatpersona[0]['nombre'].' '.$arrdatpersona[0]['snombre'].' '.$arrdatpersona[0]['papel'].' '.$arrdatpersona[0]['sapel'];
                                                $mensaje = "La persona<b>: $nombrepersona  </b> tiene un importe en la Nómina de Reintegro de <b>: $importepersonanomina </b> y la Cuenta por Cobrar tiene un saldo pendiente de <b>: $pendienteliquidar. </b>";
                                                $arraymensajes[] = $mensaje;
                                            }

                                        }

                                    }
                                    if(count($arraymensajes)>0){
                                        $mensajefinal = implode('.', $arraymensajes);//print_r($mensajefinal);die;
                                        $failed->text = "PERSONA-NOMINA-REINTEGRO-CON-MAS-SALDO-CUENTA-POR-PAGAR";
                                        $failed->mensaje = $arraymensajes;
                                        return $failed;
                                    }
                                }else{
                                    $failed->text = "NOMINA-REINTEGRO-SIN-CAMPO-CONCEPTO-SALARIO";
                                    return $failed;
                                }
                            }

                        }
                    }
                }
            }
        }
        //Obtengo los datos de las nominas q estoy contabilizando
        $arrayDatNomina = $datosNomina->obtenerDatosNominaPorElaborarPago($idelaborarpagos);
        
        //Busco los datos de los campos que contabilizan en esta nomina
        $sqlCamposContabilizan = "select cc.*, cce.obligacion,cc.idestructuramodelodomina, eg.idelementosgasto from mod_nomina.conf_conceptoscontables cc
									inner join mod_nomina.conf_conceptoscontablesentidad cce on (cce.idconceptocontable = cc.idconceptoscontables)
									left join mod_nomina.dat_conceptoscontableselementosgasto eg on (eg.idconceptoscontables = cc.idconceptoscontables)
									inner join mod_nomina.conf_estructuramodelosnomina estr on (estr.idestructuramodelodomina = cc.idestructuramodelodomina)
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = estr.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									where elp.idelaborarpagos = ? and elp.idtipopago = ? and cce.idestructura = $idestructura ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $datoscampos = $conn->fetchAll($sqlCamposContabilizan, array($idelaborarpagos, $idtipopago));
        

        //Buscando en las nóminas los montos totales por conceptos
        $contc = 0;
        $contcseg = 0;
        $arrayc = array();
        $arrayconceptossinelemgasto = array();
        $arraydatospersona = array();
        $objDatConceptosMontoElaborarPago = new DatConceptosMontoElaborarPago();
        //Concateno los datos de las personas de la nomina
        foreach ($arrayDatNomina as $n => $arrdatper) {
            $arrayaux = unserialize($arrdatper['valores']);
            $arraydatospersona = array_merge($arraydatospersona, $arrayaux);
        }
        $arrayccobligacion = array();
        foreach ($datoscampos as $cdc => $dcampos) {
            if ($dcampos['obligacion']) {
                $arrayccobligacion[$dcampos['idconceptoscontables']] = $dcampos['obligacion'];
            }
            //$datoscampos[$cdc]['montoconcepto'] = $montoconcepto;
            
            if ($dcampos['idelementosgasto'] != null) {
                //Array con los totales de los conceptos que tienen elementos de gasto
                $arrayc[$contc]['idconceptoscontables'] = $dcampos['idconceptoscontables'];
                $arrayc[$contc]['denominacion'] = $dcampos['denominacion'];
                $arrayc[$contc]['idestructuramodelodomina'] = $dcampos['idestructuramodelodomina'];
                $arrayc[$contc]['idelementosgasto'] = $dcampos['idelementosgasto'];
                $arrayc[$contc]['montoxconcepto'] = $this->calcularMontoxConceptos($idelaborarpagos, $dcampos['idestructuramodelodomina'], $tipocomprobante, $arraypersonasidcargosocupago, $arraydatospersona);
                $contc++;
            }
            //Array con los totales de los conceptos que no tienen elementos de gasto
            $arrayconceptossinelemgasto[$contcseg]['idconceptoscontables'] = $dcampos['idconceptoscontables'];
            $arrayconceptossinelemgasto[$contcseg]['idestructuramodelodomina'] = $dcampos['idestructuramodelodomina'];
            $arrayconceptossinelemgasto[$contcseg]['denominacion'] = $dcampos['denominacion'];
            $arrayconceptossinelemgasto[$contcseg]['idelementosgasto'] = $dcampos['idelementosgasto'];
            $arrayconceptossinelemgasto[$contcseg]['montoxconcepto'] = $this->calcularMontoxConceptos($idelaborarpagos, $dcampos['idestructuramodelodomina'], $tipocomprobante, $arraypersonasidcargosocupago, $arraydatospersona);
            $rdesglosecc = $objDatConceptosMontoElaborarPago->obtenerDesgloseConceptoCentrosCosto($idelaborarpagos, $dcampos['idestructuramodelodomina']);
            $arrayconceptossinelemgasto[$contcseg]['desglosecc'] = unserialize($rdesglosecc);
            $contcseg++;
        }
        
        //Si es un comprobante de operaciones o uno de cancelacion se busca la operacion de contabilizacion, sino se coje la operacion ce cobroy y pagos
        //Pido la operacion de este tipo de nomina
        if ($tipocomprobante == 3) {
            $sqlOperacion = "select  nomtn.operacioncontablecuentasporcobrar, nm.idmoneda, nomtn.denominacion from mod_nomina.nom_tiponomina nomtn
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = nomtn.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									left join mod_datosmaestros.nom_moneda nm on (nm.codigo = nomtn.tipomoneda)
									where elp.idelaborarpagos = ? and elp.idtipopago = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $datosOperacion = $conn->fetchAll($sqlOperacion, array($idelaborarpagos, $idtipopago));
        } else {
            $sqlOperacion = "select  nomtn.operacioncontable, nm.idmoneda, nomtn.denominacion from mod_nomina.nom_tiponomina nomtn
									inner join mod_nomina.conf_modelonomina mod on (mod.idtiponomina = nomtn.idtiponomina)
									inner join mod_nomina.dat_elaborarpagos elp on (elp.idtipopago = mod.idtipopago)
									left join mod_datosmaestros.nom_moneda nm on (nm.codigo = nomtn.tipomoneda)
									where elp.idelaborarpagos = ? and elp.idtipopago = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $datosOperacion = $conn->fetchAll($sqlOperacion, array($idelaborarpagos, $idtipopago));
            
        }

        $denomtiponomina = $datosOperacion[0]['denominacion'];

        $operacion = array();
        $monedanomina = $datosOperacion[0]['idmoneda'];
        if (($tipocomprobante == 3) ? $datosOperacion[0]['operacioncontablecuentasporcobrar'] : $datosOperacion[0]['operacioncontable'] != '') {
            $operacion = $this->integrator->datosmaestros->obtenerOperaciones(null, null, null, ($tipocomprobante == 3) ? $datosOperacion[0]['operacioncontablecuentasporcobrar'] : $datosOperacion[0]['operacioncontable']);
        } else {
            $failed->text = "NO-OPERACION-NOMENCLADOR-TIPONOMINA";
            return $failed;
        }
        //Busco los datos del modelo
        //$idmodelo = $operacion['data'][0]['idmodelo'];
        $idmodelo = $operacion[0]['idmodelo'];
        $modeloContable = $this->integrator->datosmaestros->getModeloContab($idmodelo);
        //$codigomodelocontable = $this->integrator->datosmaestros->getModeloxId($idmodelo);
        $fechainicioperiodo = DatElaborarPagos::obtenerFechaInicioPeriodoPago($idelaborarpagos);
        
        $rfecha = explode('/', $fechainicioperiodo);
        $codigomodelo = $codigomodelocontable . $rfecha[1];
        if (count($modeloContable) > 0) {
            
            //Validando que el modelo tenga sustituciones de centros de costo elementos de gasto o centros de costo personas
            $validation = $this->verificarModelo($modeloContable);
            $objccelementosgasto = array();
            $objccpersonas = array();
            if ($validation->flagcceg == 1 || $validation->flagccpcc == 1 || $validation->flagcc == 1) {
                //Personas organizadas por centros de costo con los conceptos q tienen elementos del gasto sumados
                $objccelementosgasto = $this->organizarPersonasxCentrosCosto($arraydatospersona, $arrayconceptossinelemgasto, $tipocomprobante, $arraypersonasidcargosocupago);
           
            }
            //Obtener si el modulo de nomina en 'rrhh_maestro.dat_modulo' necesita que todas las cuentas del comprobane existan en el clasificador de cuenta
            $sql = "select apertura from mod_rrhhmaestro.dat_modulo where identificador ilike 'nomina';";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $apertura = $conn->fetchOne($sql);
            //Recorriendo el modelo contable
            $objContable = null;
            $contobjContable = 0;

            foreach ($modeloContable as $imod => $modelo) {
                $montocuenta = 0;
                //Buscando la obligacion de pago
                //Recorro el array de centros de costo para calcular el importe de los elementos del gasto
                if (count($modelo['valor']) > 0) {
                    $obligacion = '';
                    //Si los valores contables del modelo es un array
                    if (is_array($modelo['valor']['valor'])) {
                        foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                            //Concepto contable
                            if ($obligacion == '') {
                                if ($arrayccobligacion[$rmvv]) {
                                    $obligacion = $arrayccobligacion[$rmvv];
                                }
                            } else {
                                if ($arrayccobligacion[$rmvv]) {
                                    $obligacion = $obligacion . ', ' . $arrayccobligacion[$rmvv];
                                }
                            }

                        }
                    } else {
                        $obligacion = $arrayccobligacion[$modelo['valor']['valor']];
                    }
                }
                //Si es una cuenta fija
                if ($modelo['tipocuenta'] == 'fija') {
                    //Recorriendo los valores contables. Estos valores son los conceptos de la nomina
                    $totalconceptospago = 0;
                    //Si la cuenta tiene sustituciones
                    if (isset($modelo['sustituciones'])) {
                        // print_r($modeloContable);die;
                        foreach ($modelo['sustituciones'] as $isust => $rsust) {
                            // print_r($rsust);die;
                            //Si la sustitucion es un centro de costo y le siguen los elementos del gasto
                            if (($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust - 1]['identificador'] == 'idelementoobjeto') || ($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust + 1]['identificador'] == 'idelementoobjeto')) {
                                $montocuenta = 0;
                                $contadorcc = 0;
                                $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                $objContable[$contobjContable]->obligacion = $obligacion;
                                $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                //Se verifica si existen personas sin centros de costo en la nomina
                                $personasnocontabilizan = $this->buscarPersonasNoContabilizan($arrayDatNomina);
                                // print_r($modelo);die;
                                if ($personasnocontabilizan->flag == 1) {
                                    $nombressincc = "";
                                    //Si existen personas sin centros de costo
                                    if (count($personasnocontabilizan->arraypersonas) > 0) {
                                        foreach ($personasnocontabilizan->arraypersonas as $ip => $pncc) {
                                            $nombressincc = $pncc . ", " . $nombressincc;
                                        }
                                        $failed->text = "HAY-PERSONAS-SIN-CENTROS-COSTO";
                                        $failed->elements = $nombressincc;
                                        return $failed;
                                    }
                                }

                                //print_r($objContable);die;
                                //Recorro el array de centros de costo para calcular el importe de los elementos del gasto
                                if (count($modelo['valor']) > 0) {
                                    //Si los valores contables del modelo es un array

                                    if (is_array($modelo['valor']['valor'])) {

                                        foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                            foreach ($objccelementosgasto as $ival => $val) {
                                                $idelementogasto = $val->idelementosgasto;
                                                $datoselem = $this->integrator->contabilidad_costos->obtenerElementoObjetoPorId($idelementogasto);
                                                $idconceptocontable = $val->idconceptoscontables;
                                                if ($rmvv == $idconceptocontable) {
                                                    foreach ($rsust['valores'] as $icc => $rcc) {
                                                        $valorconceptocc = $this->buscarDatosCentroCosto($rcc, $idelementogasto, $val->desgloseimporte, $imod, $datoselem['concat'], $rsust['identificador'], $isust);

                                                        if (count($valorconceptocc->datoscc) > 0) {
                                                            //Asignando los centros de costo
                                                            $montocuenta = $montocuenta + number_format($valorconceptocc->montocc, 2, '.', '');
                                                            $objContable[$contobjContable]->datoscc[$contadorcc] = $valorconceptocc->datoscc;
                                                            $contadorcc++;
                                                            /*if($idelementogasto = 990000000141 && $imod == 0){print_r($objContable);die;}*/
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        //Si el valor contable no es un array
                                    } else {

                                        foreach ($objccelementosgasto as $ival => $val) {
                                            $idelementogasto = $val->idelementosgasto;
                                            //Datos del elemento del gasto
                                            $datoselem = $this->integrator->contabilidad_costos->obtenerElementoObjetoPorId($idelementogasto);


                                            $idconceptocontable = $val->idconceptoscontables;

                                            if ($modelo['valor']['valor'] == $idconceptocontable) {
                                                //print_r($rsust['valores'] );die;
                                                foreach ($rsust['valores'] as $icc => $rcc) {
                                                    $valorconceptocc = $this->buscarDatosCentroCosto($rcc, $idelementogasto, $val->desgloseimporte, $imod, $datoselem['concat'], $rsust['identificador'], $isust);

                                                    if (count($valorconceptocc->datoscc) > 0) {

                                                        //Asignando los centros de costo
                                                        $montocuenta = $montocuenta + number_format($valorconceptocc->montocc, 2, '.', '');
                                                        $objContable[$contobjContable]->datoscc[$contadorcc] = $valorconceptocc->datoscc;
                                                        $contadorcc++;
                                                        /*if($idelementogasto = 990000000141 && $imod == 0){print_r($objContable);die;}*/
                                                    }
                                                }
                                            }
                                        }
                                    }

                                } else {
                                    $failed->text = "NO-MODELO-VALORES";
                                    return $failed;
                                }
                                //Si la sustitucion es a nivel de centros de costo y personas
                            } else if (($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust + 1]['identificador'] == 'idpersonacdgocontable') || ($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust - 1]['identificador'] == 'idpersonacdgocontable')) {
                                $montocuenta = 0;
                                $contadorcc = 0;
                                $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                $objContable[$contobjContable]->obligacion = $obligacion;
                                $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                //Se verifica si existen personas sin centros de costo en la nomina
                                $personasnocontabilizan = $this->buscarPersonasNoContabilizan($arrayDatNomina);
                                // print_r($modelo);die;
                                if ($personasnocontabilizan->flag == 1) {
                                    $nombressincc = "";
                                    //Si existen personas sin centros de costo
                                    if (count($personasnocontabilizan->arraypersonas) > 0) {
                                        foreach ($personasnocontabilizan->arraypersonas as $ip => $pncc) {
                                            $nombressincc = $pncc . ", " . $nombressincc;
                                        }
                                        $failed->text = "HAY-PERSONAS-SIN-CENTROS-COSTO";
                                        $failed->elements = $nombressincc;
                                        return $failed;
                                    }
                                }
                                //Recorro el array de centros de costo para calcular el importe de los elementos del gasto
                                if (count($modelo['valor']) > 0) {
                                    //Si los valores contables del modelo es un array

                                    if (is_array($modelo['valor']['valor'])) {

                                        foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                            foreach ($objccelementosgasto as $ival => $val) {
                                                $idconceptocontable = $val->idconceptoscontables;
                                                if ($rmvv == $idconceptocontable) {
                                                    foreach ($rsust['valores'] as $icc => $rcc) {
                                                        $valorconceptocc = $this->buscarDatosCentroCostoPersona($idestructura, $rcc, $idconceptocontable, $val->idestructuramodelodomina, $val->desgloseimporte);
                                                        if (count($valorconceptocc->datoscc) > 0) {

                                                            //Asignando los centros de costo
                                                            $montocuenta = $montocuenta + number_format($valorconceptocc->montocc, 2, '.', '');
                                                            $objContable[$contobjContable]->datosccpersona[$contadorcc] = $valorconceptocc->datoscc;
                                                            $contadorcc++;
                                                            /*if($idelementogasto = 990000000141 && $imod == 0){print_r($objContable);die;}*/
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        //Si el valor contable no es un array
                                    } else {
                                        foreach ($objccelementosgasto as $ival => $val) {
                                            $idconceptocontable = $val->idconceptoscontables;
                                            if ($modelo['valor']['valor'] == $idconceptocontable) {
                                                //print_r($rsust['valores'] );die;
                                                foreach ($rsust['valores'] as $icc => $rcc) {
                                                    $valorconceptocc = $this->buscarDatosCentroCostoPersona($idestructura, $rcc, $idconceptocontable, $val->idestructuramodelodomina, $val->desgloseimporte);
                                                    if (count($valorconceptocc->datoscc) > 0) {//print_r($valorconceptocc);die;
                                                        //Asignando los centros de costo
                                                        $montocuenta = $montocuenta + number_format($valorconceptocc->montocc, 2, '.', '');
                                                        $objContable[$contobjContable]->datosccpersona[$contadorcc] = $valorconceptocc->datoscc;
                                                        //$contobjContable++;
                                                        $contadorcc++;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                } else {
                                    $failed->text = "NO-MODELO-VALORES";
                                    return $failed;
                                }


                                //Si la sustitucion es a centros de costo solamente
                            } else if (($rsust['identificador'] == 'idcentrogrupo' && !$modelo['sustituciones'][$isust + 1]) || ($rsust['identificador'] == 'idcentrogrupo' && !$modelo['sustituciones'][$isust - 1])) {
                                $montocuenta = 0;
                                $contadorcc = 0;
                                $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                $objContable[$contobjContable]->obligacion = $obligacion;
                                $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                //Se verifica si existen personas sin centros de costo en la nomina
                                $personasnocontabilizan = $this->buscarPersonasNoContabilizan($arrayDatNomina);
                                // print_r($modelo);die;
                                if ($personasnocontabilizan->flag == 1) {
                                    $nombressincc = "";
                                    //Si existen personas sin centros de costo
                                    if (count($personasnocontabilizan->arraypersonas) > 0) {
                                        foreach ($personasnocontabilizan->arraypersonas as $ip => $pncc) {
                                            $nombressincc = $pncc . ", " . $nombressincc;
                                        }
                                        $failed->text = "HAY-PERSONAS-SIN-CENTROS-COSTO";
                                        $failed->elements = $nombressincc;
                                        return $failed;
                                    }
                                }
                                //Recorro el array de centros de costo para calcular el importe de los elementos del gasto
                                if (count($modelo['valor']) > 0) {
                                    //Si los valores contables del modelo es un array

                                    if (is_array($modelo['valor']['valor'])) {

                                        foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                            foreach ($objccelementosgasto as $ival => $val) {
                                                $idconceptocontable = $val->idconceptoscontables;
                                                if ($rmvv == $idconceptocontable) {
                                                    foreach ($rsust['valores'] as $icc => $rcc) {
                                                        $valorconceptocc = $this->buscarDatosCentroCostoPersona($idestructura, $rcc, $idconceptocontable, $val->idestructuramodelodomina, $val->desgloseimporte);
                                                        if (count($valorconceptocc->datoscc) > 0) {

                                                            //Asignando los centros de costo
                                                            $montocuenta = $montocuenta + number_format($valorconceptocc->montocc, 2, '.', '');
                                                            $objContable[$contobjContable]->datoscentcost[$contadorcc] = $valorconceptocc->datoscc;
                                                            $contadorcc++;
                                                            /*if($idelementogasto = 990000000141 && $imod == 0){print_r($objContable);die;}*/
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        //Si el valor contable no es un array
                                    } else {
                                        foreach ($objccelementosgasto as $ival => $val) {
                                            $idconceptocontable = $val->idconceptoscontables;
                                            if ($modelo['valor']['valor'] == $idconceptocontable) {
                                                //print_r($rsust['valores'] );die;
                                                foreach ($rsust['valores'] as $icc => $rcc) {
                                                    $valorconceptocc = $this->buscarDatosCentroCostoPersona($idestructura, $rcc, $idconceptocontable, $val->idestructuramodelodomina, $val->desgloseimporte);
                                                    if (count($valorconceptocc->datoscc) > 0) {//print_r($valorconceptocc);die;
                                                        //Asignando los centros de costo
                                                        $montocuenta = $montocuenta + number_format($valorconceptocc->montocc, 2, '.', '');
                                                        $objContable[$contobjContable]->datoscentcost[$contadorcc] = $valorconceptocc->datoscc;
                                                        $contadorcc++;
                                                    }
                                                }
                                            }
                                        }//print_r($objContable);die;
                                    }//print_r($objContable[$contobjContable]);die;

                                } else {
                                    $failed->text = "NO-MODELO-VALORES";
                                    return $failed;
                                }


                                //Si la sustitucion es a nivel de personas
                            } else if ($rsust['identificador'] == 'idpersonacdgocontable' && count($modelo['sustituciones']) == 1) {
                                //Buscando el concepto que contabiliza
                                $confconceptocontable = new ConfigConceptosContables();
                                //Si los valores contables del modelo es un array
                                if (is_array($modelo['valor']['valor'])) {
                                    foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                        //Obteniendo el campo de la nomina para aperturar por personas
                                        $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($rmvv);
                                        $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                        //Personas que tienen codigo contable, o que no tienen
                                        $objpersonacontabilizan = $this->obtenerPersonasContabilizanConcepto($arrayDatNomina, $camponomina, $idestructura);
                                        if ($objpersonacontabilizan->failed == 'NO-PERSONAS-COD-CONTABLE') {
                                            return $objpersonacontabilizan;
                                        } else {
                                            //Armamando el concat con la cuenta y el numero contable
                                            foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                                //Datos de la cuenta del modelo
                                                $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                                $concatcuenta = $datacuenta->concatcta . '.' . $rpcont['cdgocontable'];
                                                //Si el comprobante tiene que tener aperturadas las cuentas de las personas
                                                if ($apertura == 1) {
                                                    $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                                    if ($cuentacontabiliza->idcuenta == '') {
                                                        $failed->text = "NO-CUENTA-CONCAT";
                                                        $failed->concat = $concatcuenta;
                                                        return $failed;
                                                    }
                                                }
                                                //Llenando el obj con los datos de las cuentas
                                                //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                                //$objContable[$contobjContable]->cuentacontable = null;
                                                $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                                $objContable[$contobjContable]->concat = $concatcuenta;
                                                $objContable[$contobjContable]->persona = true;
                                                $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                                $objContable[$contobjContable]->ci = $rpcont['ci'];
                                                $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                                $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                                $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                                $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                                $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                                $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                                $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                                $objContable[$contobjContable]->obligacion = $obligacion;
                                                $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                                $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                                $objContable[$contobjContable]->datoscc = array();
                                                $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                                $contobjContable++;
                                            }
                                        }
                                    }
                                    //Si los valores contables no son un array
                                } else {
                                    //Obteniendo el campo de la nomina para aperturar por personas
                                    $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($modelo['valor']['valor']);
                                    $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                    //Personas que tienen codigo contable, o que no tienen
                                    $objpersonacontabilizan = $this->obtenerPersonasContabilizanConcepto($arrayDatNomina, $camponomina, $idestructura);
                                    if ($objpersonacontabilizan->failed == 'NO-PERSONAS-COD-CONTABLE') {
                                        return $objpersonacontabilizan;
                                    } else {
                                        //Armamando el concat con la cuenta y el numero contable
                                        foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                            //Datos de la cuenta del modelo
                                            $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                            $concatcuenta = $datacuenta->concatcta . '.' . $rpcont['cdgocontable'];
                                            //Si el comprobante tiene que tener aperturadas las cuentas de las personas
                                            if ($apertura == 1) {
                                                $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                                if ($cuentacontabiliza->idcuenta == '') {
                                                    $failed->text = "NO-CUENTA-CONCAT";
                                                    $failed->concat = $concatcuenta;
                                                    return $failed;
                                                }
                                            }
                                            //Llenando el obj con los datos de las cuentas
                                            //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                            //$objContable[$contobjContable]->cuentacontable = null;
                                            $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                            $objContable[$contobjContable]->concat = $concatcuenta;
                                            $objContable[$contobjContable]->persona = true;
                                            $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                            $objContable[$contobjContable]->ci = $rpcont['ci'];
                                            $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                            $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                            $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                            $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                            $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                            $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                            $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                            $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                            $objContable[$contobjContable]->obligacion = $obligacion;
                                            $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                            $objContable[$contobjContable]->datoscc = array();
                                            $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                            $contobjContable++;
                                        }
                                    }

                                }
                                
                                //Si es un sustitucion por personas y despues viene un codigo fijo
                            } else if ($rsust['identificador'] == 'idpersonacdgocontable' && $modelo['sustituciones'][$isust + 1]['tipo'] == 'refestatica') {
                                //Buscando el concepto que contabiliza
                                $confconceptocontable = new ConfigConceptosContables();
                                //Si los valores contables del modelo es un array
                                if (is_array($modelo['valor']['valor'])) {
                                    foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                        //Obteniendo el campo de la nomina para aperturar por personas
                                        $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($rmvv);
                                        $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                        //Personas que tienen codigo contable, o que no tienen
                                        $objpersonacontabilizan = $this->obtenerPersonasContabilizanConcepto($arrayDatNomina, $camponomina, $idestructura);
                                        if ($objpersonacontabilizan->failed == 'NO-PERSONAS-COD-CONTABLE') {
                                            return $objpersonacontabilizan;
                                        } else {
                                            //Armamando el concat con la cuenta y el numero contable
                                            foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                                //Datos de la cuenta del modelo
                                                $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                                $concatcuenta = $datacuenta->concatcta . '.' . $rpcont['cdgocontable'] . '.' . $modelo['sustituciones'][$isust + 1]['valor'];
                                                //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                                if ($apertura == 1) {
                                                    $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                                    if ($cuentacontabiliza->idcuenta == '') {
                                                        $failed->text = "NO-CUENTA-CONCAT";
                                                        $failed->concat = $concatcuenta;
                                                        return $failed;
                                                    }
                                                }

                                                //Llenando el obj con los datos de las cuentas
                                                //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                                $objContable[$contobjContable]->cuentacontable = null;
                                                $objContable[$contobjContable]->concat = $concatcuenta;
                                                $objContable[$contobjContable]->persona = true;
                                                $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                                $objContable[$contobjContable]->ci = $rpcont['ci'];
                                                $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                                $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                                $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                                $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                                $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                                $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                                $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                                $objContable[$contobjContable]->obligacion = $obligacion;
                                                $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                                $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                                $objContable[$contobjContable]->datoscc = array();
                                                $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                                $contobjContable++;
                                            }
                                        }
                                    }
                                    //Si los valores contables no son un array
                                } else {
                                    //Obteniendo el campo de la nomina para aperturar por personas
                                    $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($modelo['valor']['valor']);
                                    $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                    //Personas que tienen codigo contable, o que no tienen
                                    $objpersonacontabilizan = $this->obtenerPersonasContabilizanConcepto($arrayDatNomina, $camponomina, $idestructura);
                                    if ($objpersonacontabilizan->failed == 'NO-PERSONAS-COD-CONTABLE') {
                                        return $objpersonacontabilizan;
                                    } else {
                                        //Armamando el concat con la cuenta y el numero contable
                                        foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                            //Datos de la cuenta del modelo
                                            $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                            $concatcuenta = $datacuenta->concatcta . '.' . $rpcont['cdgocontable'] . '.' . $modelo['sustituciones'][$isust + 1]['valor'];
                                            //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                            if ($apertura == 1) {
                                                $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                                if ($cuentacontabiliza->idcuenta == '') {
                                                    $failed->text = "NO-CUENTA-CONCAT";
                                                    $failed->concat = $concatcuenta;
                                                    return $failed;
                                                }
                                            }
                                            //Llenando el obj con los datos de las cuentas
                                            //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                            $objContable[$contobjContable]->cuentacontable = null;
                                            $objContable[$contobjContable]->concat = $concatcuenta;
                                            $objContable[$contobjContable]->persona = true;
                                            $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                            $objContable[$contobjContable]->ci = $rpcont['ci'];
                                            $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                            $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                            $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                            $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                            $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                            $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                            $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                            $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                            $objContable[$contobjContable]->obligacion = $obligacion;
                                            $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                            $objContable[$contobjContable]->datoscc = array();
                                            $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                            $contobjContable++;
                                        }
                                    }

                                }
                                //Si es una sustitucion por personas y antes viene un codigo fijo
                            } else if ($rsust['identificador'] == 'idpersonacdgocontable' && $modelo['sustituciones'][$isust - 1]['tipo'] == 'refestatica') {
                                //Buscando el concepto que contabiliza
                                $confconceptocontable = new ConfigConceptosContables();
                                //Si los valores contables del modelo es un array
                                if (is_array($modelo['valor']['valor'])) {
                                    foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                        //Obteniendo el campo de la nomina para aperturar por personas
                                        $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($rmvv);
                                        $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                        //Personas que tienen codigo contable, o que no tienen
                                        $objpersonacontabilizan = $this->obtenerPersonasContabilizanConcepto($arrayDatNomina, $camponomina, $idestructura);
                                        if ($objpersonacontabilizan->failed == 'NO-PERSONAS-COD-CONTABLE') {
                                            return $objpersonacontabilizan;
                                        } else {
                                            //Armamando el concat con la cuenta y el numero contable
                                            foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                                //Datos de la cuenta del modelo
                                                $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                                $concatcuenta = $datacuenta->concatcta . '.' . $modelo['sustituciones'][$isust - 1]['valor'] . '.' . $rpcont['cdgocontable'];
                                                //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                                if ($apertura == 1) {
                                                    $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                                    if ($cuentacontabiliza->idcuenta == '') {
                                                        $failed->text = "NO-CUENTA-CONCAT";
                                                        $failed->concat = $concatcuenta;
                                                        return $failed;
                                                    }
                                                }
                                                //Llenando el obj con los datos de las cuentas
                                                //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                                $objContable[$contobjContable]->cuentacontable = null;
                                                $objContable[$contobjContable]->concat = $concatcuenta;
                                                $objContable[$contobjContable]->persona = true;
                                                $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                                $objContable[$contobjContable]->ci = $rpcont['ci'];
                                                $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                                $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                                $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                                $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                                $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                                $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                                $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                                $objContable[$contobjContable]->obligacion = $obligacion;
                                                $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                                $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                                $objContable[$contobjContable]->datoscc = array();
                                                $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                                $contobjContable++;
                                            }
                                        }
                                    }
                                    //Si los valores contables no son un array
                                } else {
                                    //Obteniendo el campo de la nomina para aperturar por personas
                                    $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($modelo['valor']['valor']);
                                    $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                    //Personas que tienen codigo contable, o que no tienen
                                    $objpersonacontabilizan = $this->obtenerPersonasContabilizanConcepto($arrayDatNomina, $camponomina, $idestructura);
                                    if ($objpersonacontabilizan->failed == 'NO-PERSONAS-COD-CONTABLE') {
                                        return $objpersonacontabilizan;
                                    } else {
                                        //Armamando el concat con la cuenta y el numero contable
                                        foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                            //Datos de la cuenta del modelo
                                            $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                            $concatcuenta = $datacuenta->concatcta . '.' . $modelo['sustituciones'][$isust - 1]['valor'] . '.' . $rpcont['cdgocontable'];
                                            //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                            if ($apertura == 1) {
                                                $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                                if ($cuentacontabiliza->idcuenta == '') {
                                                    $failed->text = "NO-CUENTA-CONCAT";
                                                    $failed->concat = $concatcuenta;
                                                    return $failed;
                                                }
                                            }
                                            //Llenando el obj con los datos de las cuentas
                                            //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                            $objContable[$contobjContable]->cuentacontable = null;
                                            $objContable[$contobjContable]->concat = $concatcuenta;
                                            $objContable[$contobjContable]->persona = true;
                                            $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                            $objContable[$contobjContable]->ci = $rpcont['ci'];
                                            $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                            $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                            $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                            $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                            $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                            $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                            $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                            $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                            $objContable[$contobjContable]->obligacion = $obligacion;
                                            $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                            $objContable[$contobjContable]->datoscc = array();
                                            $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                            $contobjContable++;
                                        }
                                    }

                                }
                                //Si es una sustitucion dinamica por personas sin aperturar la cuenta en codigos contables BICSA (1)
                            } else if ($modelo['sustituciones'][$isust]['tipo'] == 'refestatica' && $modelo['sustituciones'][$isust]['valor'] == 'Personas') {
                                //print_r($modelo);die;
                                //Buscando el concepto que contabiliza
                                $confconceptocontable = new ConfigConceptosContables();
                                //Si los valores contables del modelo es un array
                                if (is_array($modelo['valor']['valor'])) {
                                    foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                        //Obteniendo el campo de la nomina para aperturar por personas
                                        $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($rmvv);
                                        $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                        //Personas que tienen codigo contable, o que no tienen
                                        $objpersonacontabilizan = $this->obtenerPersonasContabilizanConceptoSinCodContable($arrayDatNomina, $camponomina, $idestructura);
                                        //Armamando el concat con la cuenta y el numero contable
                                        $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                        $concatcuenta = $datacuenta->concatcta;
                                        //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                        if ($apertura == 1) {
                                            $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                            if ($cuentacontabiliza->idcuenta == '') {
                                                $failed->text = "NO-CUENTA-CONCAT";
                                                $failed->concat = $concatcuenta;
                                                return $failed;
                                            }
                                        }
                                        foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                            //Datos de la cuenta del modelo
                                            //Llenando el obj con los datos de las cuentas
                                            //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                            $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                            $objContable[$contobjContable]->concat = $concatcuenta;
                                            $objContable[$contobjContable]->persona = true;
                                            $objContable[$contobjContable]->personasnocodcontable = true;
                                            $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                            $objContable[$contobjContable]->ci = $rpcont['ci'];
                                            $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                            $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                            $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                            $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                            $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                            $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                            $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                            $objContable[$contobjContable]->obligacion = $obligacion;
                                            $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
											$objContable[$contobjContable]->denomconcepto = $datosconceptosconctables[0]['denominacion'];
                                            $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                            $objContable[$contobjContable]->datoscc = array();
                                            $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                            $contobjContable++;
                                        }

                                    }
                                    //Si los valores contables no son un array
                                } else {
                                    //Obteniendo el campo de la nomina para aperturar por personas
                                    $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($modelo['valor']['valor']);
                                    $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                    //Personas que tienen codigo contable, o que no tienen
                                    $objpersonacontabilizan = $this->obtenerPersonasContabilizanConceptoSinCodContable($arrayDatNomina, $camponomina, $idestructura);
                                    //Armamando el concat con la cuenta y el numero contable
                                    $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                    $concatcuenta = $datacuenta->concatcta;
                                    //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                    if ($apertura == 1) {
                                        $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);//print_r();die;
                                        if ($cuentacontabiliza->idcuenta == '') {
                                            $failed->text = "NO-CUENTA-CONCAT";
                                            $failed->concat = $concatcuenta;
                                            return $failed;
                                        }
                                    }
                                    foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                        //Datos de la cuenta del modelo
                                        //Llenando el obj con los datos de las cuentas
                                        //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                        $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                        $objContable[$contobjContable]->concat = $concatcuenta;
                                        $objContable[$contobjContable]->persona = true;
                                        $objContable[$contobjContable]->personasnocodcontable = true;
                                        $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                        $objContable[$contobjContable]->ci = $rpcont['ci'];
                                        $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                        $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                        $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                        $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                        $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                        $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                        $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
										$objContable[$contobjContable]->denomconcepto = $datosconceptosconctables[0]['denominacion'];
                                        $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                        $objContable[$contobjContable]->obligacion = $obligacion;
                                        $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                        $objContable[$contobjContable]->datoscc = array();
                                        $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                        $contobjContable++;
                                    }

                                }
                            //Si es una sustitucion dinamica por personas sin aperturar la cuenta en codigos contables BICSA (2)
                            }else if ($modelo['sustituciones'][$isust]['tipo'] == 'refestatica' && $modelo['sustituciones'][$isust]['valor'] == 'PersonasCuenta') {
                                //print_r($modelo);die;
                                //Buscando el concepto que contabiliza
                                $confconceptocontable = new ConfigConceptosContables();
                                //Si los valores contables del modelo es un array
                                if (is_array($modelo['valor']['valor'])) {
                                    foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                        //Obteniendo el campo de la nomina para aperturar por personas
                                        $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($rmvv);
                                        $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                        //Personas que tienen codigo contable, o que no tienen
                                        $objpersonacontabilizan = $this->obtenerPersonasContabilizanConceptoSinCodContable($arrayDatNomina, $camponomina, $idestructura);
                                        //Armamando el concat con la cuenta y el numero contable
                                        /*$datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                        $concatcuenta = $datacuenta->concatcta;
                                        //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                        if ($apertura == 1) {
                                            $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                            if ($cuentacontabiliza->idcuenta == '') {
                                                $failed->text = "NO-CUENTA-CONCAT";
                                                $failed->concat = $concatcuenta;
                                                return $failed;
                                            }
                                        }*/
                                        foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                            //Datos de la cuenta del modelo
                                            $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                            $concatcuenta = $datacuenta->concatcta . $rpcont['cdgocontable'];
                                            //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                            /*if ($apertura == 1) {
                                                $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                                if ($cuentacontabiliza->idcuenta == '') {
                                                    $failed->text = "NO-CUENTA-CONCAT";
                                                    $failed->concat = $concatcuenta;
                                                    return $failed;
                                                }
                                            }*/
                                            //Datos de la cuenta del modelo
                                            //Llenando el obj con los datos de las cuentas
                                            //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                            $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                            $objContable[$contobjContable]->concat = $concatcuenta;
                                            $objContable[$contobjContable]->persona = true;
                                            $objContable[$contobjContable]->personasnocodcontable = true;
                                            $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                            $objContable[$contobjContable]->ci = $rpcont['ci'];
                                            $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                            $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                            $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                            $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                            $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                            $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                            $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                            $objContable[$contobjContable]->obligacion = $obligacion;
                                            $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                            $objContable[$contobjContable]->denomconcepto = $datosconceptosconctables[0]['denominacion'];
                                            $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                            $objContable[$contobjContable]->datoscc = array();
                                            $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                            $contobjContable++;
                                        }

                                    }
                                    //Si los valores contables no son un array
                                } else {
                                    //Obteniendo el campo de la nomina para aperturar por personas
                                    $datosconceptosconctables = $confconceptocontable->obtenerListadoTodosConfigConceptosContablesxIdConf($modelo['valor']['valor']);
                                    $camponomina = $datosconceptosconctables[0]['idestructuramodelodomina'];
                                    //Personas que tienen codigo contable, o que no tienen
                                    $objpersonacontabilizan = $this->obtenerPersonasContabilizanConceptoSinCodContable($arrayDatNomina, $camponomina, $idestructura);
                                    //Armamando el concat con la cuenta y el numero contable
                                    $datacuenta = $this->integrator->contabilidad->obtenerCuentaPorId($modelo['cuenta']);
                                    $concatcuenta = $datacuenta->concatcta;
                                    //Si el comprobante tiene que tener aperturadas las cuentas de la persona
                                    if ($apertura == 1) {
                                        $cuentacontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);//print_r();die;
                                        if ($cuentacontabiliza->idcuenta == '') {
                                            $failed->text = "NO-CUENTA-CONCAT";
                                            $failed->concat = $concatcuenta;
                                            return $failed;
                                        }
                                    }
                                    foreach ($objpersonacontabilizan->array as $ipcont => $rpcont) {
                                        //Datos de la cuenta del modelo
                                        //Llenando el obj con los datos de las cuentas
                                        //$objContable[$contobjContable]->cuentacontable = $cuentacontabiliza->idcuenta;
                                        $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                                        $objContable[$contobjContable]->concat = $concatcuenta;
                                        $objContable[$contobjContable]->persona = true;
                                        $objContable[$contobjContable]->personasnocodcontable = true;
                                        $objContable[$contobjContable]->idpersona = $rpcont['idpersona'];
                                        $objContable[$contobjContable]->ci = $rpcont['ci'];
                                        $objContable[$contobjContable]->nombreyapellidos = $rpcont['nombreapellido'];
                                        $objContable[$contobjContable]->direccion = $rpcont['direccion'];
                                        $objContable[$contobjContable]->refretenciones = $rpcont['refretenciones'];
                                        $objContable[$contobjContable]->abreviaturaret = $rpcont['abreviaturaret'];
                                        $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                        $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                        $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                        $objContable[$contobjContable]->denomconcepto = $datosconceptosconctables[0]['denominacion'];
                                        $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                        $objContable[$contobjContable]->obligacion = $obligacion;
                                        $objContable[$contobjContable]->idcentrocosto = $rpcont['idcentrocosto'];
                                        $objContable[$contobjContable]->datoscc = array();
                                        $objContable[$contobjContable]->montocuenta = number_format($rpcont['importe'], 2, '.', '');
                                        $contobjContable++;
                                    }

                                }
                            }

                        }
                        //Asignandole el mosnto total de la cuenta que tiene centros de costo y elementos del gasto
                        $objContable[$contobjContable]->montocuenta = number_format($montocuenta, 2, '.', '');
                        $contobjContable++;
                        //Este codigo se quedo desactualizado porque se hizo con la intencion de que las cuentas de gasto salieran por cuentas dinamicas en el modelo de contabilizacion teniendo en
                        //cuenta que un centro de costo hiba a estar en una unica cuenta. En la practica eso no es asi por lo que esto no se esta usando pero se quedo el codigo para futuras eventualidades
                    } else {
                        $objContable[$contobjContable]->cuentacontable = $modelo['cuenta'];
                        $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                        $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                        $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                        $objContable[$contobjContable]->obligacion = $obligacion;
                        $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                        //Si la cuenta no tiene centros de costo entonces se le calcula el monto total del concepto de la cuenta
                        if (count($modelo['valor']) > 0) {
                            //Si los valores contables del modelo es un array
                            if (is_array($modelo['valor']['valor'])) {

                                $denomconcepto = '';
								foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                    $arrayccc = array();
                                    foreach ($arrayconceptossinelemgasto as $cseg => $rcseg) {
                                        if ($rcseg['idconceptoscontables'] == $rmvv) {
                                            $montocuenta = number_format($rcseg['montoxconcepto'], 2, '.', '') + $montocuenta;
                                            //Concatenando el desglose del concepto en centros de costo
                                            array_merge($arrayccc, $rcseg['desglosecc']);
											$denomconcepto = $rcseg['denominacion']. ' ' .$denomconcepto;
                                        }
                                    }
                                    $objContable[$contobjContable]->datoscc = array();
                                    $objContable[$contobjContable]->degloseconceptocc = $arrayccc;
									$objContable[$contobjContable]->denomconcepto = $denomconcepto;
                                    $objContable[$contobjContable]->montocuenta = number_format($montocuenta, 2, '.', '');
                                }
                                //Si el valor contable es un numero
                            } else {
                                $arrayccc = array();
								$denomconcepto = '';
                                foreach ($arrayconceptossinelemgasto as $cseg => $rcseg) {
                                    if ($rcseg['idconceptoscontables'] == $modelo['valor']['valor']) {
                                        $montocuenta = number_format($rcseg['montoxconcepto'], 2, '.', '');
                                        $arrayccc = $rcseg['desglosecc'];
										$denomconcepto = $rcseg['denominacion']. ' ' .$denomconcepto; 
										
                                    }
                                }
                                $objContable[$contobjContable]->datoscc = array();
                                $objContable[$contobjContable]->degloseconceptocc = $arrayccc;
                                $objContable[$contobjContable]->denomconcepto = $denomconcepto;
                                $objContable[$contobjContable]->montocuenta = number_format($montocuenta, 2, '.', '');

                            }
                            $contobjContable++;
                        } else {
                            $failed->text = "NO-MODELO-VALORES";
                            return $failed;
                        }


                    }
                    //Si la cuenta es dinamica
                } else {
                    //Recorro el array de centros de costo para calcular el importe de los elementos del gasto
                    if (count($modelo['valor']) > 0) {
                        //Se verifica si existen personas sin centros de costo en la nomina
                        $personasnocontabilizan = $this->buscarPersonasNoContabilizan($arrayDatNomina);
                        //print_r("sas");die;
                        if ($personasnocontabilizan->flag == 1) {
                            $nombressincc = "";
                            //Si existen personas sin centros de costo
                            if (count($personasnocontabilizan->arraypersonas) > 0) {
                                foreach ($personasnocontabilizan->arraypersonas as $ip => $pncc) {
                                    $nombressincc = $pncc . ", " . $nombressincc;
                                }
                                $failed->text = "HAY-PERSONAS-SIN-CENTROS-COSTO";
                                $failed->elements = $nombressincc;
                                return $failed;
                            }
                        }
                        $tipocontabilizacion = 1;
                        if (is_array($modelo['sustituciones'])) {
                            if ($modelo['sustituciones'][0]['identificador'] == 'idelementoobjeto') {
                                $tipocontabilizacion = -1;
                            } else {
                                $tipocontabilizacion = 1;
                            }

                        }
                        //Si los valores contables del modelo es un array
                        if (is_array($modelo['valor']['valor'])) {
                            foreach ($modelo['valor']['valor'] as $imvv => $rmvv) {
                                foreach ($objccelementosgasto as $ival => $val) {
                                    $idelementogasto = $val->idelementosgasto;
                                    $idconceptocontable = $val->idconceptoscontables;
                                    //Datos del elemento del gasto
                                    $datoselem = $this->integrator->contabilidad_costos->obtenerElementoObjetoPorId($idelementogasto);
                                    if ($rmvv == $idconceptocontable) {
                                        foreach ($val->desgloseimporte as $ivd => $rvdi) {
                                            //Datos del centro costo
                                            $sqlCountCC = "select * from  mod_contabilidadcosto.nom_centrocosto centrocosto
		                                             where centrocosto.idcentrogrupo=?;";
                                            $mg = Doctrine_Manager::getInstance();
                                            $conn = $mg->getCurrentConnection();
                                            //$datoscc = $conn->fetchAll($sqlCountCC, array($rvdi->centroscosto));
                                            $datoscc = $conn->fetchAll($sqlCountCC, array($rvdi->centroscosto));
                                            //Datos del id cuenta
                                            $cuentaxcentrocosto = $this->integrator->contabilidad_costos->obtenerCuentasGastoPorCentros($rvdi->centroscosto);
                                            if ($cuentaxcentrocosto['idcuenta'] == '') {
                                                $failed->text = "NO-CUENTA-CENTROCOSTO";
                                                $failed->cc = $datoscc[0]['descripcioncentrogrupo'];
                                                return $failed;
                                            }
                                            //Datos de la cuenta
                                            $datacuentacc = $this->integrator->contabilidad->obtenerCuentaPorId($cuentaxcentrocosto['idcuenta']);
                                            $concatcuenta = $datacuentacc->concatcta;
                                            // print_r($datacuentacc);die;
                                            $concatcentrocosto = "";
                                            $concatelementogasto = $rvdi->importeconcepto;
                                            if ($datoscc[0]['concatpadre'] == '') {
                                                $concatcentrocosto = $datoscc[0]['codigocentrogrupo'];
                                            } else {
                                                $concatcentrocosto = $datoscc[0]['concatpadre'] . $datoscc[0]['codigocentrogrupo'];
                                            }
                                            $concatcontabiliza = '';
                                            //Buscando el codigo del elemento del gasto
                                            if ($tipocontabilizacion == 1) {
                                                $concatcontabiliza = $concatcuenta . '.' . $concatcentrocosto . '.' . $datoselem['codigoelementoobjeto'];
                                            } else {
                                                $concatcontabiliza = $concatcuenta . '.' . $datoselem['codigoelementoobjeto'] . '.' . $concatcentrocosto;
                                            }
                                            //print_r($concatcontabiliza);die;
                                            $cuentagastocontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcontabiliza);
                                            if ($cuentagastocontabiliza->idcuenta == '') {
                                                $failed->text = "NO-CUENTA-CONCAT";
                                                $failed->concat = $concatcontabiliza;
                                                return $failed;
                                            }
                                            //Llenando el obj con los datos de las aprturas de las cuentas hasta elementos del gasto
                                            $objContable[$contobjContable]->cuentacontable = $cuentagastocontabiliza->idcuenta;
                                            $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                            $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                            $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                            $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                            $objContable[$contobjContable]->obligacion = $obligacion;
                                            $objContable[$contobjContable]->datoscc = array();
                                            $objContable[$contobjContable]->montocuenta = number_format($rvdi->importeconcepto, 2, '.', '');
                                            $contobjContable++;
                                        }
                                    }
                                }
                            }
                            //Si tiene un solo valor contable
                        } else {
                            foreach ($objccelementosgasto as $ival => $val) {
                                $idelementogasto = $val->idelementosgasto;
                                $idconceptocontable = $val->idconceptoscontables;
                                //Datos del elemento del gasto
                                $datoselem = $this->integrator->contabilidad_costos->obtenerElementoObjetoPorId($idelementogasto);
                                if ($modelo['valor']['valor'] == $idconceptocontable) {
                                    foreach ($val->desgloseimporte as $ivd => $rvdi) {
                                        $sqlCountCC = "select * from  mod_contabilidadcosto.nom_centrocosto centrocosto
		                                             where centrocosto.idcentrogrupo=?;";
                                        $mg = Doctrine_Manager::getInstance();
                                        $conn = $mg->getCurrentConnection();
                                        //$datoscc = $conn->fetchAll($sqlCountCC, array($rvdi->centroscosto));
                                        $datoscc = $conn->fetchAll($sqlCountCC, array($rvdi->centroscosto));

                                        //die;
                                        //Datos del id cuenta
                                        $cuentaxcentrocosto = $this->integrator->contabilidad_costos->obtenerCuentasGastoPorCentros($rvdi->centroscosto);
                                        if (count($cuentaxcentrocosto) == 0) {
                                            $failed->text = "NO-CUENTA-CENTROCOSTO";
                                            $failed->cc = $datoscc[0]['descripcioncentrogrupo'];
                                            return $failed;
                                        }
                                        //Datos de la cuenta
                                        $datacuentacc = $this->integrator->contabilidad->obtenerCuentaPorId($cuentaxcentrocosto['idcuenta']);
                                        $concatcuenta = $datacuentacc->concatcta;
                                        // print_r($datacuentacc);die;
                                        $concatcentrocosto = "";
                                        $concatelementogasto = $rvdi->importeconcepto;
                                        if ($datoscc[0]['concatpadre'] == '') {
                                            $concatcentrocosto = $datoscc[0]['codigocentrogrupo'];
                                        } else {
                                            $concatcentrocosto = $datoscc[0]['concatpadre'] . $datoscc[0]['codigocentrogrupo'];
                                        }
                                        $concatcontabiliza = '';
                                        //Buscando el codigo del elemento del gasto
                                        if ($tipocontabilizacion == 1) {
                                            $concatcontabiliza = $concatcuenta . '.' . $concatcentrocosto . '.' . $datoselem['codigoelementoobjeto'];
                                        } else {
                                            $concatcontabiliza = $concatcuenta . '.' . $datoselem['codigoelementoobjeto'] . '.' . $concatcentrocosto;
                                        }

                                        $cuentagastocontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcontabiliza);
                                        if ($cuentagastocontabiliza->idcuenta == '') {
                                            $failed->text = "NO-CUENTA-CONCAT";
                                            $failed->concat = $concatcontabiliza;
                                            return $failed;
                                        }
                                        //Llenando el obj con los datos de las aprturas de las cuentas hasta elementos del gasto
                                        $objContable[$contobjContable]->cuentacontable = $cuentagastocontabiliza->idcuenta;
                                        $objContable[$contobjContable]->idmodelo = $modelo['idmodelo'];
                                        $objContable[$contobjContable]->creditodebito = $modelo['creditodebito'];
                                        $objContable[$contobjContable]->tipocuenta = $modelo['tipocuenta'];
                                        $objContable[$contobjContable]->porciento = $modelo['valor']['porciento'];
                                        $objContable[$contobjContable]->obligacion = $obligacion;
                                        $objContable[$contobjContable]->datoscc = array();
                                        $objContable[$contobjContable]->montocuenta = number_format($rvdi->importeconcepto, 2, '.', '');
                                        $contobjContable++;
                                    }
                                }
                            }
                        }
                    } else {
                        $failed->text = "NO-MODELO-VALORES";
                        return $failed;
                    }
                }

            }
            

            if (count($objContable) > 0) {
                //Borrando el comprobante temporal de la integracion por ficheros con otros sistemas contables
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $sqlDeleteComprobante = "DELETE FROM mod_nomina.dat_comprobantenomina WHERE idelaborarpagos = ?;";
                $conn->execute($sqlDeleteComprobante, array($idelaborarpagos));
                //AQUI EMPIEZA EL CODIGO DEL COMPROBANTE
                $idsubsistema = $this->global->Subsistema->idsubsistema;
                //Si el sistema postea comprobantes la fecha contable es la de datos maestros sino es la fecha actual
                if ($apertura == 1) {
                    $fechacontable = $this->integrator->datosmaestros->fechaContableSubsistema($idestructura, $idsubsistema);
                }else{
                    $fechacontable = Date('d/m/Y');
                }
                //Datos de contabilidad y datosmaestros
                $monedaContable = $this->integrator->datosmaestros->buscarMonedaContable();
                $idmoneda = $this->integrator->datosmaestros->buscarIdMonedaEntidad($monedaContable->idmoneda, $idestructura);
                //$tasaObj = $this->integrator->datosmaestros->buscarTasaActual($idmoneda);
                $tasaObj = $this->integrator->datosmaestros->getTasaByMonedas($monedaContable->idmoneda, $monedanomina, null);

                $moneda = $monedaContable->codigoiso;
                $idtasa = $tasaObj[0]['idtasa'];
                $compra = $tasaObj[0]['compra'];
                $factordeconversion = $tasaObj[0]['factordeconversion'];
                $arraydatosopcc = $this->integrator->datosmaestros->obtenerOperaciones(null, null, null, $datosOperacion[0]['operacioncontable']);
                //Obj final
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();
                $contdataAnotacion = 0;
                $dataAnotacion = new stdClass();
                $arrayComprobanteCentCosto = array();
                $contceco = 0;
                //Comprobante
                $objComprobante = new stdClass(); //se crea un objeto que representa el comprobante
                $objComprobante->detalle = ($denomtiponomina)?('Contabilización de '.$denomtiponomina):("Contabilización de las nóminas");
                $objComprobante->observacion = ($denomtiponomina)?('Contabilización de '.$denomtiponomina):("Contabilización de las nóminas");
                $objComprobante->fechaContable = $fechacontable; //Aquí va la fecha contable del subsistema
                $objComprobante->idsubsistema = $idsubsistema; //Aquí va el id del subsistema
                $objComprobante->idtipocomprobante = 3; //Comprobante tipo operaciones
				foreach ($objContable as $icop => $rcop) {
					$obligacion = $rcop->obligacion;
                    $dataCuenta = $this->integrator->contabilidad->obtenerCuentaPorId($rcop->cuentacontable);
                    //Centros de costo y elementos de gasto
                    if (count($rcop->datoscc) > 0) {
                        foreach ($rcop->datoscc as $idcopcc => $rdcopcc) {
                            //Construyendo los pases del comprobante
                            if ($rdcopcc['importeconcepto'] != 0) {
                                $objComprobante->dataComprobante[$contdataAnotacion]->idoperacion = $datosOperacion[0]['operacioncontable'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->operacion = $arraydatosopcc[0]['denominacion'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->numerodocumento = $arraydatosopcc[0]['iddocumento'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->iddocumento = $arraydatosopcc[0]['iddocumento'];


                                $concatcuenta = $dataCuenta->concatcta . '.' . $rdcopcc['concat'];
                                //Si la cuenta con sus centros de costo y elementos de gasto tiene que estar aperturada y existir el idcuenta en el clasificador de cuentas
                                $idcuenta = null;
                                if ($apertura == 1) {
                                    $cuentagastocontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                    //Si la cuenta no existe
                                    if (!$cuentagastocontabiliza->idcuenta) {
                                        $failed->text = "NO-CUENTA-CONCAT";
                                        $failed->concat = $concatcuenta;
                                        return $failed;
                                    } else {
                                        $idcuenta = $cuentagastocontabiliza->idcuenta;
                                    }
                                }
                                //Para debitar o acreditar se tiene en cuenta si es un comprobante de operaciones o de cancelacion de pagos indebidos
                                $debitocredito = 0;
                                if ($tipocomprobante == 1 || $tipocomprobante == 3) {
                                    if ($rcop->creditodebito == 1) {
                                        $debitocredito = 0;
                                    } else {
                                        $debitocredito = 1;
                                    }
                                } else {
                                    if ($rcop->creditodebito == 1) {
                                        $debitocredito = 1;
                                    } else {
                                        $debitocredito = 0;
                                    }
                                }
                                $objComprobante->dataComprobante[$contdataAnotacion]->coddocprim = $codigomodelo;
                                $objComprobante->dataComprobante[$contdataAnotacion]->concatcta = $concatcuenta;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idcuenta = $idcuenta;
                                $objComprobante->dataComprobante[$contdataAnotacion]->cuenta = $concatcuenta;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idnaturaleza = 1;
                                //$dataAnotacion[$contdataAnotacion]['idtipocuenta'] = $dataCuenta->idtipocuenta;
                                $objComprobante->dataComprobante[$contdataAnotacion]->contabilidadAdicional = 0;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = ($rcop->creditodebito == 1) ? 0 : 1;
                                $objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = $debitocredito;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $idmoneda;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $monedaContable->idmoneda;
                                $objComprobante->dataComprobante[$contdataAnotacion]->moneda = $moneda;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                                $objComprobante->dataComprobante[$contdataAnotacion]->compra = $compra;
                                $objComprobante->dataComprobante[$contdataAnotacion]->factordeconversion = $factordeconversion;
                                $objComprobante->dataComprobante[$contdataAnotacion]->importe = abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->importemb = abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->importemo = abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->porciento = $rcop->porciento;
                                $objComprobante->dataComprobante[$contdataAnotacion]->docobl = $rcop->obligacion;
                                if ($rcop->obligacion = '') {
                                    $hoy = Date('d/m/Y');
                                    $objComprobante->dataComprobante[$contdataAnotacion]->fechaobl = $hoy;
                                }
                                $contdataAnotacion++;
                                //Obj temporal con el comprobante para analizarlo en el pdf del comprobante por centros de costo
                                $arrayComprobanteCentCosto[$contceco]['idcuenta'] = $rcop->cuentacontable;
                                $arrayComprobanteCentCosto[$contceco]['cuenta'] = $concatcuenta;
                                $arrayComprobanteCentCosto[$contceco]['denomcuenta'] = $dataCuenta->descripcion;
                                $arrayComprobanteCentCosto[$contceco]['debitocredito'] = $debitocredito;
                                $arrayComprobanteCentCosto[$contceco]['centrocosto'] = $rdcopcc['centrocosto'];
                                $arrayComprobanteCentCosto[$contceco]['importe'] = abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2));
                                $contceco++;
                                //Obj temporal con el comprobante de operaciones para exportar los ficheros de importacion con los demas sistemas contables
                                $sqlComprobante = "INSERT INTO mod_nomina.dat_comprobantenomina(idsubsistema, idtipocomprobante, fechacontable,
                                            idoperacion, operacion, numerodocumento, iddocumento, concatcta, idcuenta, cuenta, idnaturaleza, contabilidadadicional, debitocredito,
                                            idmoneda, moneda, idtasa, compra, factordeconversion, importe, importemb, importemo, porciento, idelaborarpagos, idpersona, direccion, nombreapellidos, denomcuenta, ci, refretenciones)
                                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                                $conn->execute($sqlComprobante, array($idsubsistema, null, $fechacontable,
                                    null, $datosOperacion[0]['operacioncontable'], null, null, $concatcuenta, $idcuenta, $concatcuenta, 1, 0, $debitocredito,
                                    $monedaContable->idmoneda, $idmoneda, $idtasa, $compra, $factordeconversion, abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2)), abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2)),
                                    abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2)), $rcop->porciento, $idelaborarpagos, null, null, null, $dataCuenta->descripcion, null, null));
                         }
                        }
                    } else if (count($rcop->datosccpersona) > 0) {
                        //Recorriendo los centros de costo y las personas
                        foreach ($rcop->datosccpersona as $idccp => $rccp) {
                            foreach ($rccp['personas'] as $idcopcc => $rdcopcc) {
                                //Construyendo los pases del comprobante
                                if ($rdcopcc['importeconcepto'] != 0) {
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idoperacion = $datosOperacion[0]['operacioncontable'];
                                    $objComprobante->dataComprobante[$contdataAnotacion]->operacion = $arraydatosopcc[0]['denominacion'];
                                    $objComprobante->dataComprobante[$contdataAnotacion]->numerodocumento = $arraydatosopcc[0]['iddocumento'];
                                    $objComprobante->dataComprobante[$contdataAnotacion]->iddocumento = $arraydatosopcc[0]['iddocumento'];
                                    $concatcuenta = $dataCuenta->concatcta . '.' . $rdcopcc['concat'];
                                    //Si la cuenta con sus centros de costo y personas tiene que estar aperturada y existir el idcuenta en el clasificador de cuentas
                                    $idcuenta = null;
                                    if ($apertura == 1) {
                                        $cuentagastocontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                        //Si la cuenta no existe
                                        if (!$cuentagastocontabiliza->idcuenta) {
                                            $failed->text = "NO-CUENTA-CONCAT";
                                            $failed->concat = $concatcuenta;
                                            return $failed;
                                        } else {
                                            $idcuenta = $cuentagastocontabiliza->idcuenta;
                                        }
                                    }

                                    //Para debitar o acreditar se tiene en cuenta si es un comprobante de operaciones o de cancelacion de pagos indebidos
                                    $debitocredito = 0;
                                    if ($tipocomprobante == 1 || $tipocomprobante == 3) {
                                        if ($rcop->creditodebito == 1) {
                                            $debitocredito = 0;
                                        } else {
                                            $debitocredito = 1;
                                        }
                                    } else {
                                        if ($rcop->creditodebito == 1) {
                                            $debitocredito = 1;
                                        } else {
                                            $debitocredito = 0;
                                        }
                                    }
                                    $objComprobante->dataComprobante[$contdataAnotacion]->coddocprim = $codigomodelo;
                                    //$objComprobante->dataComprobante[$contdataAnotacion]->concatcta    = $cuentagastocontabiliza->concatctax;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->concatcta = $concatcuenta;
                                    //$objComprobante->dataComprobante[$contdataAnotacion]->idcuenta     = $cuentagastocontabiliza->idcuenta;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idcuenta = $idcuenta;
                                    //$objComprobante->dataComprobante[$contdataAnotacion]->cuenta       = $cuentagastocontabiliza->text;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->cuenta = $concatcuenta;
                                    //$objComprobante->dataComprobante[$contdataAnotacion]->idnaturaleza = $cuentagastocontabiliza->idnaturaleza;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idnaturaleza = 1;
                                    //$dataAnotacion[$contdataAnotacion]['idtipocuenta'] = $dataCuenta->idtipocuenta;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->contabilidadAdicional = 0;
                                    //$objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = ($rcop->creditodebito == 1) ? 0 : 1;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = $debitocredito;
                                    //$objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $idmoneda;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $monedaContable->idmoneda;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->moneda = $moneda;
                                    //$objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->compra = $compra;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->factordeconversion = $factordeconversion;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->importe = abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2));
                                    $objComprobante->dataComprobante[$contdataAnotacion]->importemb = abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2));
                                    $objComprobante->dataComprobante[$contdataAnotacion]->importemo = abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2));
                                    $objComprobante->dataComprobante[$contdataAnotacion]->porciento = $rcop->porciento;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->docobl = ($rdcopcc['obligacion'])?$rdcopcc['obligacion']:$rcop->obligacion;								
                                    	
                                    //if($idccp == 1){print_r($objComprobante->dataComprobante);}									
                                    if ($rdcopcc['obligacion'] = '') {
                                        $hoy = Date('d/m/Y');
                                        $objComprobante->dataComprobante[$contdataAnotacion]->fechaobl = $hoy;
                                    }
                                    $contdataAnotacion++;
                                    //Obj temporal con el comprobante para analizarlo en el pdf del comprobante por centros de costo
                                    $arrayComprobanteCentCosto[$contceco]['idcuenta'] = $rcop->cuentacontable;
                                    $arrayComprobanteCentCosto[$contceco]['cuenta'] = $concatcuenta;
                                    $arrayComprobanteCentCosto[$contceco]['denomcuenta'] = $dataCuenta->descripcion;
                                    $arrayComprobanteCentCosto[$contceco]['debitocredito'] = $debitocredito;
                                    $arrayComprobanteCentCosto[$contceco]['centrocosto'] = $rccp['centrocosto'];
                                    $arrayComprobanteCentCosto[$contceco]['importe'] = abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2));
                                    $contceco++;
                                    //Obj temporal con el comprobante de operaciones para exportar los ficheros de importacion con los demas sistemas contables
                                    $sqlComprobante = "INSERT INTO mod_nomina.dat_comprobantenomina(idsubsistema, idtipocomprobante, fechacontable,
                                            idoperacion, operacion, numerodocumento, iddocumento, concatcta, idcuenta, cuenta, idnaturaleza, contabilidadadicional, debitocredito,
                                            idmoneda, moneda, idtasa, compra, factordeconversion, importe, importemb, importemo, porciento, idelaborarpagos, idpersona, direccion, nombreapellidos, denomcuenta, ci, refretenciones, abreviaturaret)
                                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                                    $conn->execute($sqlComprobante, array($idsubsistema, null, $fechacontable,
                                        null, $datosOperacion[0]['operacioncontable'], null, null, $concatcuenta, $idcuenta, $concatcuenta, 1, 0, $debitocredito,
                                        $monedaContable->idmoneda, $idmoneda, $idtasa, $compra, $factordeconversion, abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2)), abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2)),
                                        abs(round($rdcopcc['importeconcepto'] * $rcop->porciento / 100, 2)), $rcop->porciento, $idelaborarpagos, $rcop->idpersona, $rcop->direccion, $rcop->nombreyapellidos, $dataCuenta->descripcion, $rcop->ci, $rcop->refretenciones, $rcop->abreviaturaret));
                                }
                            }
                        }

                    } else if (count($rcop->datoscentcost) > 0) {
                        //Recorriendo los centros de costo
						$obligacion = $rcop->obligacion;
                        foreach ($rcop->datoscentcost as $idccp => $rccp) {
                            //Construyendo los pases del comprobante
                            if ($rccp['importeconcepto'] != 0) {
                                $objComprobante->dataComprobante[$contdataAnotacion]->idoperacion = $datosOperacion[0]['operacioncontable'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->operacion = $arraydatosopcc[0]['denominacion'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->numerodocumento = $arraydatosopcc[0]['iddocumento'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->iddocumento = $arraydatosopcc[0]['iddocumento'];


                                $concatcuenta = $dataCuenta->concatcta . '.' . $rccp['concat'];
                                //Si la cuenta con sus centros de costo tiene que estar aperturada y existir el idcuenta en el clasificador de cuentas
                                $idcuenta = null;
                                if ($apertura == 1) {
                                    $cuentagastocontabiliza = $this->integrator->contabilidad_financiera->obtenerCuentaPorConcat($idestructura, $concatcuenta);
                                    //Si la cuenta no existe
                                    if (!$cuentagastocontabiliza->idcuenta) {
                                        $failed->text = "NO-CUENTA-CONCAT";
                                        $failed->concat = $concatcuenta;
                                        return $failed;
                                    } else {
                                        $idcuenta = $cuentagastocontabiliza->idcuenta;
                                    }
                                }

                                //Para debitar o acreditar se tiene en cuenta si es un comprobante de operaciones o de cancelacion de pagos indebidos
                                $debitocredito = 0;
                                if ($tipocomprobante == 1 || $tipocomprobante == 3) {
                                    if ($rcop->creditodebito == 1) {
                                        $debitocredito = 0;
                                    } else {
                                        $debitocredito = 1;
                                    }
                                } else {
                                    if ($rcop->creditodebito == 1) {
                                        $debitocredito = 1;
                                    } else {
                                        $debitocredito = 0;
                                    }
                                }
                                $objComprobante->dataComprobante[$contdataAnotacion]->coddocprim = $codigomodelo;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->concatcta    = $cuentagastocontabiliza->concatctax;
                                $objComprobante->dataComprobante[$contdataAnotacion]->concatcta = $concatcuenta;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->idcuenta     = $cuentagastocontabiliza->idcuenta;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idcuenta = $idcuenta;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->cuenta       = $cuentagastocontabiliza->text;
                                $objComprobante->dataComprobante[$contdataAnotacion]->cuenta = $concatcuenta;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->idnaturaleza = $cuentagastocontabiliza->idnaturaleza;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idnaturaleza = 1;
                                //$dataAnotacion[$contdataAnotacion]['idtipocuenta'] = $dataCuenta->idtipocuenta;
                                $objComprobante->dataComprobante[$contdataAnotacion]->contabilidadAdicional = 0;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = ($rcop->creditodebito == 1) ? 0 : 1;
                                $objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = $debitocredito;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $idmoneda;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $monedaContable->idmoneda;
                                $objComprobante->dataComprobante[$contdataAnotacion]->moneda = $moneda;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                                $objComprobante->dataComprobante[$contdataAnotacion]->compra = $compra;
                                $objComprobante->dataComprobante[$contdataAnotacion]->factordeconversion = $factordeconversion;
                                $objComprobante->dataComprobante[$contdataAnotacion]->importe = abs(round($rccp['importeconcepto'] * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->importemb = abs(round($rccp['importeconcepto'] * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->importemo = abs(round($rccp['importeconcepto'] * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->porciento = $rcop->porciento;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->docobl = $rcop->obligacion;
								$objComprobante->dataComprobante[$contdataAnotacion]->docobl = $rccp['obligacion'];
                                if ($rccp['obligacion'] = '') {
                                    $hoy = Date('d/m/Y');
                                    $objComprobante->dataComprobante[$contdataAnotacion]->fechaobl = $hoy;
                                }
                                $contdataAnotacion++;
                                //Obj temporal con el comprobante para analizarlo en el pdf del comprobante por centros de costo
                                $arrayComprobanteCentCosto[$contceco]['idcuenta'] = $rcop->cuentacontable;
                                $arrayComprobanteCentCosto[$contceco]['cuenta'] = $concatcuenta;
                                $arrayComprobanteCentCosto[$contceco]['denomcuenta'] = $dataCuenta->descripcion;
                                $arrayComprobanteCentCosto[$contceco]['debitocredito'] = $debitocredito;
                                $arrayComprobanteCentCosto[$contceco]['centrocosto'] = $rccp['centrocosto'];
                                $arrayComprobanteCentCosto[$contceco]['importe'] = abs(round($rccp['importeconcepto'] * $rcop->porciento / 100, 2));
                                $contceco++;
                                //Obj temporal con el comprobante de operaciones para exportar los ficheros de importacion con los demas sistemas contables
                                $sqlComprobante = "INSERT INTO mod_nomina.dat_comprobantenomina(idsubsistema, idtipocomprobante, fechacontable,
                                            idoperacion, operacion, numerodocumento, iddocumento, concatcta, idcuenta, cuenta, idnaturaleza, contabilidadadicional, debitocredito,
                                            idmoneda, moneda, idtasa, compra, factordeconversion, importe, importemb, importemo, porciento, idelaborarpagos, idpersona, direccion, nombreapellidos, denomcuenta, ci, refretenciones, abreviaturaret)
                                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                                $conn->execute($sqlComprobante, array($idsubsistema, null, $fechacontable,
                                    null, $datosOperacion[0]['operacioncontable'], null, null, $concatcuenta, $idcuenta, $concatcuenta, 1, 0, $debitocredito,
                                    $monedaContable->idmoneda, $idmoneda, $idtasa, $compra, $factordeconversion, abs(round($rccp['importeconcepto'] * $rcop->porciento / 100, 2)), abs(round($rccp['importeconcepto'] * $rcop->porciento / 100, 2)),
                                    abs(round($rccp['importeconcepto'] * $rcop->porciento / 100, 2)), $rcop->porciento, $idelaborarpagos, $rcop->idpersona, $rcop->direccion, $rcop->nombreyapellidos, $dataCuenta->descripcion, $rcop->ci, $rcop->refretenciones, $rcop->abreviaturaret));
                            }

                        }

                    } else {
						$obligacion = $rcop->obligacion;
                        //Si es una cuenta fija o una cuenta con personas aperturadas
                        if ($rcop->montocuenta != 0/* && !empty($dataCuenta->idcuenta)*/) {
                            if (($rcop->persona == true) || (($rcop->persona == false && !empty($dataCuenta->idcuenta)))) {
                                //Para debitar o acreditar se tiene en cuenta si es un comprobante de operaciones o de cancelacion de pagos indebidos
                                $debitocredito = 0;
                                if ($tipocomprobante == 1 || $tipocomprobante == 3) {
                                    if ($rcop->creditodebito == 1) {
                                        $debitocredito = 0;
                                    } else {
                                        $debitocredito = 1;
                                    }
                                } else {
                                    if ($rcop->creditodebito == 1) {
                                        $debitocredito = 1;
                                    } else {
                                        $debitocredito = 0;
                                    }
                                }
                                //Construyendo los pases del comprobante
                                $objComprobante->dataComprobante[$contdataAnotacion]->coddocprim = $codigomodelo;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idoperacion = $datosOperacion[0]['operacioncontable'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->operacion = $arraydatosopcc[0]['denominacion'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->numerodocumento = $arraydatosopcc[0]['iddocumento'];
                                $objComprobante->dataComprobante[$contdataAnotacion]->iddocumento = $arraydatosopcc[0]['iddocumento'];
                                if ($rcop->persona == true) {//
                                    //if($rcop->personasnocodcontable == true){print_r($dataCuenta);die;}
                                    $objComprobante->dataComprobante[$contdataAnotacion]->concatcta = $rcop->concat. ' ' .$rcop->denomconcepto . ' ' .$rcop->nombreyapellidos;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idcuenta = $dataCuenta->idcuenta;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->cuenta = $dataCuenta->text;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idnaturaleza = 1;
                                    //Obj temporal con el comprobante para analizarlo en el pdf del comprobante por centros de costo
                                    $arrayComprobanteCentCosto[$contceco]['idcuenta'] = $rcop->cuentacontable;
                                    $arrayComprobanteCentCosto[$contceco]['cuenta'] = $rcop->concat;
                                    $arrayComprobanteCentCosto[$contceco]['denomcuenta'] = $dataCuenta->descripcion;
                                    $arrayComprobanteCentCosto[$contceco]['debitocredito'] = $debitocredito;
                                    $arrayComprobanteCentCosto[$contceco]['centrocosto'] = $rcop->idcentrocosto;
                                    $arrayComprobanteCentCosto[$contceco]['importe'] = abs(round($rcop->montocuenta * $rcop->porciento / 100, 2));
                                    $contceco++;
                                } else {
                                    $objComprobante->dataComprobante[$contdataAnotacion]->concatcta = $dataCuenta->concatctax . ' ' .$rcop->denomconcepto;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idcuenta = $dataCuenta->idcuenta;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->cuenta = $dataCuenta->text;
                                    $objComprobante->dataComprobante[$contdataAnotacion]->idnaturaleza = $dataCuenta->idnaturaleza;
                                    //Obj temporal con el comprobante para analizarlo en el pdf del comprobante por centros de costo
                                    foreach ($rcop->degloseconceptocc as $centc => $rdegcc) {
                                        //Array del comprobante temporal
                                        $arrayComprobanteCentCosto[$contceco]['idcuenta'] = $rcop->cuentacontable;
                                        $arrayComprobanteCentCosto[$contceco]['cuenta'] = $dataCuenta->concatctax;
                                        $arrayComprobanteCentCosto[$contceco]['denomcuenta'] = $dataCuenta->descripcion;
                                        $arrayComprobanteCentCosto[$contceco]['debitocredito'] = $debitocredito;
                                        $arrayComprobanteCentCosto[$contceco]['centrocosto'] = $centc;
                                        $arrayComprobanteCentCosto[$contceco]['importe'] = abs(round($rdegcc['importe'] * $rcop->porciento / 100, 2));//print_r($rcop);die;
                                        $contceco++;

                                    }
                                }

                                //$dataAnotacion[$contdataAnotacion]['idtipocuenta'] = $dataCuenta->idtipocuenta;
                                $objComprobante->dataComprobante[$contdataAnotacion]->contabilidadAdicional = 0;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = ($rcop->creditodebito == 1) ? 0 : 1;
                                $objComprobante->dataComprobante[$contdataAnotacion]->debitoCredito = $debitocredito;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $idmoneda;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idmoneda = $monedaContable->idmoneda;
                                $objComprobante->dataComprobante[$contdataAnotacion]->moneda = $moneda;
                                //$objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                                $objComprobante->dataComprobante[$contdataAnotacion]->idtasa = $idtasa;
                                $objComprobante->dataComprobante[$contdataAnotacion]->compra = $compra;
                                $objComprobante->dataComprobante[$contdataAnotacion]->factordeconversion = $factordeconversion;
                                $objComprobante->dataComprobante[$contdataAnotacion]->importe = abs(round($rcop->montocuenta * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->importemb = abs(round($rcop->montocuenta * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->importemo = abs(round($rcop->montocuenta * $rcop->porciento / 100, 2));
                                $objComprobante->dataComprobante[$contdataAnotacion]->porciento = $rcop->porciento;
                                $objComprobante->dataComprobante[$contdataAnotacion]->docobl = $rcop->obligacion;
                                if ($rcop->obligacion = '') {
                                    $hoy = Date('d/m/Y');
                                    $objComprobante->dataComprobante[$contdataAnotacion]->fechaobl = $hoy;
                                }
                                $contdataAnotacion++;
                                //Obj temporal con el comprobante de operaciones para exportar los ficheros de importacion con los demas sistemas contables
                                $sqlComprobante = "INSERT INTO mod_nomina.dat_comprobantenomina(idsubsistema, idtipocomprobante, fechacontable,
                                            idoperacion, operacion, numerodocumento, iddocumento, concatcta, idcuenta, cuenta, idnaturaleza, contabilidadadicional, debitocredito,
                                            idmoneda, moneda, idtasa, compra, factordeconversion, importe, importemb, importemo, porciento, idelaborarpagos, idpersona, direccion, nombreapellidos, denomcuenta, ci, refretenciones, abreviaturaret)
                                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                                $conn->execute($sqlComprobante, array($idsubsistema, null, $fechacontable,
                                    null, $datosOperacion[0]['operacioncontable'], null, null, ($rcop->persona == true) ? $rcop->concat : $dataCuenta->concatctax, $dataCuenta->idcuenta, ($rcop->persona == true) ? $rcop->concat : $dataCuenta->concatctax,
                                    1, 0, $debitocredito, $monedaContable->idmoneda, $idmoneda, $idtasa, $compra, $factordeconversion, abs(round($rcop->montocuenta * $rcop->porciento / 100, 2)), abs(round($rcop->montocuenta * $rcop->porciento / 100, 2)),
                                    abs(round($rcop->montocuenta * $rcop->porciento / 100, 2)), $rcop->porciento, $idelaborarpagos, $rcop->idpersona, $rcop->direccion, $rcop->nombreyapellidos, ($rcop->nombreyapellidos ? $dataCuenta->descripcion . ' - ' . $rcop->nombreyapellidos : $dataCuenta->descripcion), $rcop->ci, $rcop->refretenciones, $rcop->abreviaturaret));
                            }
                        }
                    }
                }
                $conn->commit();

                //Si el modulo de nomina no postea comprobantes para la contabilidad: Caso TRD, Bicsa
                if($apertura == 0){
                    //Eliminando y adicionando los temporales de los pases del comprobante por centros de costo
                    $objDatComprobantesCC = new DatComprobanteNominaCentrosCosto();
                    $arraycompccelaborarpagos = $objDatComprobantesCC->obtenerComprobanteCentrosCostoxElaborarPagos($idelaborarpagos);
                    if (count($arraycompccelaborarpagos) > 0) {
                        foreach ($arraycompccelaborarpagos as $rcelp) {
                            //Borrando los datos temporales del comprobante
                            $objNominaDatosDelete = Doctrine::getTable('DatComprobanteNominaCentrosCosto')->find($rcelp['idcomprobantenominacentrocosto']);
                            $objNominaDatosDelete->delete();
                        }
                    }
                    //Adiciionando el ultimo comprobante contabilizado
                    foreach ($arrayComprobanteCentCosto as $rcompcc) {
                        $objDatComprobantesCCSave = new DatComprobanteNominaCentrosCosto();
                        $objDatComprobantesCCSave->idcuenta = $rcompcc['idcuenta'];
                        $objDatComprobantesCCSave->cuenta = $rcompcc['cuenta'];
                        $objDatComprobantesCCSave->denomcuenta = $rcompcc['denomcuenta'];
                        $objDatComprobantesCCSave->debitocredito = $rcompcc['debitocredito'];
                        $objDatComprobantesCCSave->centrocosto = $rcompcc['centrocosto'];
                        $objDatComprobantesCCSave->idelaborarpagos = $idelaborarpagos;
                        $objDatComprobantesCCSave->importe = $rcompcc['importe'];
                        $objDatComprobantesCCSave->save();
                    }
                //Si el modulo de nomina postea comprobantes para la contabilidad: Caso Todos los demas Clientes del ERP
                }else{
                   $datoscompccser = serialize($arrayComprobanteCentCosto);
                    /* Guardo el archivo con los datos serializados */
                    $register = Zend_Registry::getInstance();
                    $nombreArchivo = $idelaborarpagos . ".compcc";
                    $direccion = $register->config->modulo_path . 'comun/recursos/compcentroscosto/' . $nombreArchivo;
                    //$archivo = fopen($direccion, "w");
                    //fclose($archivo);
                    file_put_contents($direccion, $datoscompccser);
                }

                return $objComprobante;
                //  }
            } else {
                $failed->text = 'NO-MODELO-CONTABLE';
                return $failed;
            }

        } else {
            $failed->text = "NO-MODELO-CONTABLE";
            return $failed;
        }
    }

    public function cancelarComprobante($idelaborarpago){
        //$idComprobante
        $sqlComprobante = "select idcomprobanteoperaciones from mod_nomina.dat_elaborarpagos
                                where idelaborarpagos = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $idcomprobante = $conn->fetchOne($sqlComprobante, array($idelaborarpago));
        //Cancelando el comprobante
        if($idcomprobante){
            $datoscompcancelacion = $this->integrator->contabilidad->revertirComprobanteExterno (array($idcomprobante), 'Revirtiendo comprobante de las n&oacute;minas');
            if($datoscompcancelacion){
               //Actualizando elaborarpagos para quitar el comprobante de operaciones y poner el de cancelacion
               $sqlComprobante = "UPDATE mod_nomina.dat_elaborarpagos
                                   SET idcomprobanteoperaciones = ?, numerocomprobanteoperaciones = ?, 
                                       idcomprobantecancelacion = ?, numerocomprobantecancelacion = ?
                                 WHERE idelaborarpagos = ?;";
               $mg = Doctrine_Manager::getInstance();
               $conn = $mg->getCurrentConnection();
               $idcomprobante = $conn->fetchOne($sqlComprobante, array(null, null, $datoscompcancelacion[$idcomprobante]['idcomprobante'], $datoscompcancelacion[$idcomprobante]['numero'],$idelaborarpago));
           }
           return 'COMPROBANTE-OPERACIONES-CANCELADO';
        }else{
            return 'NO-COMPROBANTE-OPERACIONES-CANCELAR';
        }
    }

    public function verificarModelo($modeloContable)
    {
        $flagcceg = 0;
        $flagccpcc = 0;
        $result = new stdClass();
        foreach ($modeloContable as $imod => $modelo) {
            if ($modelo['tipocuenta'] == 'fija') {
                //Recorriendo los valores contables. Estos valores son los conceptos de la nomina
                //Si la cuenta tiene sustituciones
                if (isset($modelo['sustituciones'])) {
                    // print_r($modeloContable);die;
                    foreach ($modelo['sustituciones'] as $isust => $rsust) {
                        // print_r($rsust);die;
                        //Si la sustitucion es un centro de costo y le siguen los elementos del gasto
                        if (($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust - 1]['identificador'] == 'idelementoobjeto') || ($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust + 1]['identificador'] == 'idelementoobjeto')) {
                            $flagcceg = 1;
                        }
						//Si la sustitucion es por el codigo contable de las personas
                        if ($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust + 1]['identificador'] == 'idpersonacdgocontable') {
                            $flagccpcc = 1;
                        }
						//Si la sustitucion es un centro de costo solamente
						if (($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust - 1]['identificador'] == null) || ($rsust['identificador'] == 'idcentrogrupo' && $modelo['sustituciones'][$isust + 1]['identificador'] == null)) {
                            $flagcc = 1;
                        }
                    }

                }
            }
        }
        $result->flagcceg = $flagcceg;
        $result->flagccpcc = $flagccpcc;
		$result->flagcc = $flagcc;
        return $result;

    }

    public function obtenerPersonasContabilizanConceptoSinCodContable($arrayDatNomina, $camponomina, $idestructura)
    {
        $objreturn = new stdClass();
        $arraypersonascontabilizan = array();
        $arraypersonasnocontabilizan = array();
        $cont1 = 0;
        $cont2 = 0;
        $objDatPersonaCodContable = new ConfigPersonaCodigoContable();
        $objDatDatosModeloNominaConceptos = new DatDatosModeloNominaConceptos();
        foreach ($arrayDatNomina as $idn => $dnom) {
            $valores = unserialize($dnom['valores']);
            foreach ($valores as $iv => $rv) {
                $arrids = explode('-', $rv['id']);
                $idpersona = $arrids[0];
                $idcargoocupado = $arrids[1];
                $importeconcepto = $rv["c$camponomina"];
                if ($importeconcepto != 0.00) {
                    $arraypersonascontabilizan[$cont1]['idpersona'] = $idpersona;
                    //Datos persona
                    $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel, dd.direccion, doc.numero from mod_persona.dat_persona dp
                                left join mod_persona.dat_direccion dd on (dd.idpersona = dp.idpersona)
                                left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
                                where dp.idpersona = ?";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($idpersona));
                    //Datos cuenta retenciones
                    $datosestnomina = $objDatDatosModeloNominaConceptos->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($camponomina);
                    $datretenc = '';
                    if ($datosestnomina[0]['tipo'] == 2) {
                        $retexplode = explode('_', $datosestnomina[0]['idconcepto']);
                        $tiporetencion = $retexplode[1];
                        //Datos retencion
                        $sqlDatosRet = "select dr.refdocumentoacredita, ntr.abreviatura as abreviaturaret from mod_nomina.dat_retencionpersona dr
						                    inner join mod_nomina.nom_tiporetencion ntr on(ntr.idtiporetencion = dr.idtiporetencion)
                                            where dr.idtiporetencion = ? and dr.idpersona = ? and dr.identidad = ?";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $refretenciones = $conn->fetchAll($sqlDatosRet, array($tiporetencion, $idpersona, $idestructura));
                    }
                    $nombrepersona = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                    $arraypersonascontabilizan[$cont1]['nombreapellido'] = $nombrepersona;
                    $arraypersonascontabilizan[$cont1]['direccion'] = $arrdatpersona[0]['direccion'];
                    $arraypersonascontabilizan[$cont1]['ci'] = $arrdatpersona[0]['numero'];
                    $arraypersonascontabilizan[$cont1]['idcentrocosto'] = $rv['idcentrocosto'];
                    $arraypersonascontabilizan[$cont1]['refretenciones'] = $refretenciones[0]['refdocumentoacredita'];
                    $arraypersonascontabilizan[$cont1]['abreviaturaret'] = $refretenciones[0]['abreviaturaret'];
                    $arraypersonascontabilizan[$cont1]['importe'] = $importeconcepto;
                    $cont1++;
                }


            }
        }
        $objreturn->array = $arraypersonascontabilizan;
        $objreturn->failed = 'OK';
        return $objreturn;
    }

    public function obtenerPersonasContabilizanConcepto($arrayDatNomina, $camponomina, $idestructura)
    {
        $objreturn = new stdClass();
        $arraypersonascontabilizan = array();
        $arraypersonasnocontabilizan = array();
        $cont1 = 0;
        $cont2 = 0;
        $objDatPersonaCodContable = new ConfigPersonaCodigoContable();
        $objDatDatosModeloNominaConceptos = new DatDatosModeloNominaConceptos();
        foreach ($arrayDatNomina as $idn => $dnom) {
            $valores = unserialize($dnom['valores']);
            foreach ($valores as $iv => $rv) {
                $arrids = explode('-', $rv['id']);
                $idpersona = $arrids[0];
                $idcargoocupado = $arrids[1];
                $codc = $rv['cdgocontable'];
                $datosconfcogcontable = ($codc != null) ? $codc : $objDatPersonaCodContable->obtenerConfigDadoIdPersona($idpersona, $idestructura)[0]['cdgocontable'];//print_r($rv);die;
                //if (is_array($datosconfcogcontable)) {
                if ($datosconfcogcontable != null) {
                    $importeconcepto = $rv["c$camponomina"];
                    if ($importeconcepto != 0.00) {
                        $arraypersonascontabilizan[$cont1]['idpersona'] = $idpersona;
                        //Datos persona
                        $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel, dd.direccion, doc.numero from mod_persona.dat_persona dp
		            		        left join mod_persona.dat_direccion dd on (dd.idpersona = dp.idpersona)
		            		        left join mod_persona.dat_docidentidad doc on (doc.idpersona = dp.idpersona and doc.principal = 1)
		            		        where dp.idpersona = ?";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($idpersona));
                        //Datos cuenta retenciones
                        $datosestnomina = $objDatDatosModeloNominaConceptos->obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina($camponomina);
                        $datretenc = '';
                        if ($datosestnomina[0]['tipo'] == 2) {
                            $retexplode = explode('_', $datosestnomina[0]['idconcepto']);
                            $tiporetencion = $retexplode[1];
                            //Datos retencion
                            $sqlDatosRet = "select refdocumentoacredita from mod_nomina.dat_retencionpersona
		            		                	where idtiporetencion = ? and idpersona = ? and identidad = ?";
                            $mg = Doctrine_Manager::getInstance();
                            $conn = $mg->getCurrentConnection();
                            $refretenciones = $conn->fetchOne($sqlDatosRet, array($tiporetencion, $idpersona, $idestructura));
                        }
                        $nombrepersona = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                        $arraypersonascontabilizan[$cont1]['nombreapellido'] = $nombrepersona;
                        $arraypersonascontabilizan[$cont1]['cdgocontable'] = $datosconfcogcontable;
                        $arraypersonascontabilizan[$cont1]['direccion'] = $arrdatpersona[0]['direccion'];
                        $arraypersonascontabilizan[$cont1]['ci'] = $arrdatpersona[0]['numero'];
                        $arraypersonascontabilizan[$cont1]['idcentrocosto'] = $rv['idcentrocosto'];
                        $arraypersonascontabilizan[$cont1]['refretenciones'] = $refretenciones;
                        $arraypersonascontabilizan[$cont1]['importe'] = $importeconcepto;
                        $cont1++;
                    }
                } else {
                    $arraypersonasnocontabilizan[$cont2] = $idpersona;
                    $cont2++;
                }
                /*} else {
            $arraypersonasnocontabilizan[$cont2] = $idpersona;
            $cont2++;
          }*/
            }
        }
        if (count($arraypersonasnocontabilizan) > 0) {
            $texto = '';
            foreach ($arraypersonasnocontabilizan as $ip => $rp) {
                //Datos persona
                $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		            		        where dp.idpersona = ?";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($rp));
                $nombrepersona = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                if ($texto == '') {
                    $texto = $nombrepersona;
                } else {
                    $texto = $texto . ' ,' . $nombrepersona;
                }
            }
            $objreturn->texto = $texto;
            $objreturn->failed = 'NO-PERSONAS-COD-CONTABLE';
            return $objreturn;
        } else {
            $objreturn->array = $arraypersonascontabilizan;
            $objreturn->failed = 'OK';
            return $objreturn;
        }
    }

    //aqui
    public function buscarPersonasNoContabilizan($arrayDatNomina)
    {
        $objreturn = new stdClass();
        $objreturn->flag = 0;
        $arraynombres = array();
        $contarraynombres = 0;
        $datCargosOcup = new DatCargosOcupados();
        foreach ($arrayDatNomina as $idn => $dnom) {
            $valores = unserialize($dnom['valores']);
            foreach ($valores as $iv => $rv) {
                $arrids = explode('-', $rv['id']);
                $idcargoocupado = $arrids[1];
                //$tienecc        = $datCargosOcup->tieneCentroCostoxCargoOcupado($idcargoocupado);
                if (empty($rv['idcentrocosto'])) {
                    $objreturn->flag = 1;
                    //Datos persona
                    $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		            		        where dp.idpersona = ?";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($arrids[0]));
                    $nombrepersona = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                    $arraynombres[$contarraynombres] = $nombrepersona;
                    $contarraynombres++;
                }
            }

        }
        $objreturn->arraypersonas = $arraynombres;
        return $objreturn;
    }

    public function calcularMontoxConceptos($idelaborarpagos, $idestructuramodelodomina, $tipocontabilizacion, $arraydatospersonacomprobante, $arraydatospersonanomina)
    {
        if ($tipocontabilizacion == 1) {
            return DatConceptosMontoElaborarPago::obtenerMontoXElaborarPagoEstNomina($idelaborarpagos, $idestructuramodelodomina);
        } else if ($tipocontabilizacion == 2) {
            $montoconcepto = 0;
            foreach ($arraydatospersonacomprobante as $rpc) {
                foreach ($arraydatospersonanomina as $rpn) {
                    if ($rpc == $rpn[id]) {
                        $montoconcepto = number_format($montoconcepto, 2, '.', '') + number_format($rpn["c$idestructuramodelodomina"], 2, '.', '');
                        break;
                    }
                }

            }
            return $montoconcepto;
        } else {
            $montoconcepto = 0;
            foreach ($arraydatospersonanomina as $rpn) {
                if ($rpn["c$idestructuramodelodomina"] < 0) {
                    $montoconcepto = number_format($montoconcepto, 2, '.', '') + number_format($rpn["c$idestructuramodelodomina"], 2, '.', '');
                }
            }


            return $montoconcepto;
        }

    }

    public function organizarPersonasxCentrosCosto($arraydatospersona, $arrayConceptosContabilizan, $tipocomprobante, $arraypersonasidcargosocupago = null)
    {
        $idestructura = $this->global->Estructura->idestructura;
        //Buscando los centros de costo que estan en nomina
        $sqlCentrosdeCosto = "select distinct(centrocosto.idcentrogrupo)
		                      from mod_contabilidadcosto.nom_centrocosto centrocosto
		                      inner join mod_nomina.dat_cargosocupados cocup on (cocup.idcentrocosto = centrocosto.idcentrogrupo)
		                      left join mod_contabilidadcosto.dat_centro_grupo_entidad dcce on (dcce.idcentrogrupo = centrocosto.idcentrogrupo)
                              where (centrocosto.idestructuracomun = $idestructura) or (dcce.idestructuracomun = $idestructura)";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrcentroscosto = $conn->fetchAll($sqlCentrosdeCosto);

        if (count($arrcentroscosto) > 0) {
            $objCentrosCostoImportes = null;
            $contobjCentrosCostoImportes = 0;
            //Recorriendo los conceptos que tienen elementos del gasto
            foreach ($arrayConceptosContabilizan as $ic => $rc) {
                $objCentrosCostoImportes[$contobjCentrosCostoImportes]->idconceptoscontables = $rc['idconceptoscontables'];
                $objCentrosCostoImportes[$contobjCentrosCostoImportes]->idestructuramodelodomina = $rc['idestructuramodelodomina'];
                $objCentrosCostoImportes[$contobjCentrosCostoImportes]->idelementosgasto = $rc['idelementosgasto'];
                $objCentrosCostoImportes[$contobjCentrosCostoImportes]->montoxconcepto = $rc['montoxconcepto'];
                //Recorro los centros de costo para ver que persona esta
                $objCentrosCosto = null;
                $contobjCentrosCosto = 0;

                foreach ($arrcentroscosto as $icc => $dcc) {
                    $contpersonas = 0;
                    $objCentrosCosto[$contobjCentrosCosto]->centroscosto = $dcc['idcentrogrupo'];
                    $importepersona = number_format(0, 2, '.', '');
                    if ($tipocomprobante == 1) {
                        foreach ($arraydatospersona as $i => $dpers) {
                            //Dame idpersona - idcargosocupados
                            $arrpersonabuscarcc = explode('-', $dpers[id]);
                            $idpersonabuscarcc = $arrpersonabuscarcc[0];
                            $idcargoocupbuscarcc = $arrpersonabuscarcc[1];
                            //Dime si la persona y el cargo que ocupa tiene configurado el centro de costo
                            /*$sqlCountCC = "select count(cocup.idcargosocupados) from mod_nomina.dat_cargosocupados cocup
		              inner join mod_contabilidadcosto.nom_centrocosto centrocosto on (centrocosto.idcentrogrupo = cocup.idcentrocosto)
		    		  where cocup.idpersona=? and cocup.idcargosocupados=? and cocup.idcentrocosto=?;";
                $mg         = Doctrine_Manager::getInstance();
                $conn       = $mg->getCurrentConnection();
                $countcc    = $conn->fetchAll($sqlCountCC, array($idpersonabuscarcc, $idcargoocupbuscarcc, $dcc['idcentrogrupo']));*/
                            //Si la persona esta en el centro de costo la adiciono al obj
                            if ($dcc['idcentrogrupo'] == $dpers['idcentrocosto']) {
                                $objCentrosCosto[$contobjCentrosCosto]->personas[$contpersonas] = $dpers;
                                $contpersonas++;
                                $idestructurar = $rc['idestructuramodelodomina'];
                                $importepersona = number_format($importepersona, 2, '.', '') + number_format($dpers["c$idestructurar"], 2, '.', '');
                            }
                        }

                    } else if ($tipocomprobante == 2) {
                        foreach ($arraypersonasidcargosocupago as $ipcc => $dperscocup) {
                            foreach ($arraydatospersona as $i => $dpers) {
                                //Dame idpersona - idcargosocupados
                                if ($dperscocup == $dpers[id]) {
                                    $arrpersonabuscarcc = explode('-', $dpers[id]);
                                    $idpersonabuscarcc = $arrpersonabuscarcc[0];
                                    $idcargoocupbuscarcc = $arrpersonabuscarcc[1];
                                    //Dime si la persona y el cargo que ocupa tiene configurado el centro de costo
                                    /*$sqlCountCC = "select count(cocup.idcargosocupados) from mod_nomina.dat_cargosocupados cocup
		                            inner join mod_contabilidadcosto.nom_centrocosto centrocosto on (centrocosto.idcentrogrupo = cocup.idcentrocosto)
		    		                where cocup.idpersona=? and cocup.idcargosocupados=? and cocup.idcentrocosto=?;";
                    $mg         = Doctrine_Manager::getInstance();
                    $conn       = $mg->getCurrentConnection();
                    $countcc    = $conn->fetchAll($sqlCountCC, array($idpersonabuscarcc, $idcargoocupbuscarcc, $dcc['idcentrogrupo']));*/
                                    //Si la persona esta en el centro de costo la adiciono al obj
                                    if ($dcc['idcentrogrupo'] == $dpers['idcentrocosto']) {
                                        //$objCentrosCosto[$contobjCentrosCosto]->personas[$contpersonas] = $dpers;
                                        //$contpersonas++;
                                        $idestructurar = $rc['idestructuramodelodomina'];
                                        $importepersona = number_format($importepersona, 2, '.', '') + number_format($dpers["c$idestructurar"], 2, '.', '');
                                    }
                                }


                            }
                        }
                    } else {
                        foreach ($arraydatospersona as $i => $dpers) {
                            //Dame idpersona - idcargosocupados
                            $arrpersonabuscarcc = explode('-', $dpers[id]);
                            $idpersonabuscarcc = $arrpersonabuscarcc[0];
                            $idcargoocupbuscarcc = $arrpersonabuscarcc[1];
                            //Dime si la persona y el cargo que ocupa tiene configurado el centro de costo
                            /*$sqlCountCC = "select count(cocup.idcargosocupados) from mod_nomina.dat_cargosocupados cocup
		              inner join mod_contabilidadcosto.nom_centrocosto centrocosto on (centrocosto.idcentrogrupo = cocup.idcentrocosto)
		    		  where cocup.idpersona=? and cocup.idcargosocupados=? and cocup.idcentrocosto=?;";
                $mg         = Doctrine_Manager::getInstance();
                $conn       = $mg->getCurrentConnection();
                $countcc    = $conn->fetchAll($sqlCountCC, array($idpersonabuscarcc, $idcargoocupbuscarcc, $dcc['idcentrogrupo']));*/
                            //Si la persona esta en el centro de costo la adiciono al obj
                            if ($dcc['idcentrogrupo'] == $dpers['idcentrocosto']) {
                                //$objCentrosCosto[$contobjCentrosCosto]->personas[$contpersonas] = $dpers;
                                //$contpersonas++;
                                $idestructurar = $rc['idestructuramodelodomina'];
                                if ($dpers["c$idestructurar"] < 0) {
                                    $importepersona = number_format($importepersona, 2, '.', '') + number_format($dpers["c$idestructurar"], 2, '.', '');
                                }

                            }
                        }
                    }

                    $objCentrosCosto[$contobjCentrosCosto]->importeconcepto = number_format($importepersona, 2, '.', '');
                    $contobjCentrosCosto++;

                }
                $objCentrosCostoImportes[$contobjCentrosCostoImportes]->desgloseimporte = $objCentrosCosto;
                $contobjCentrosCostoImportes++;
            }
            // print_r($objCentrosCostoImportes);die;
            return $objCentrosCostoImportes;
        } else {
            return -1;
        }
    }

    public function buscarDatosCentroCostoPersona($idestructura, $centrocosto, $conceptocontable, $idestructuranomina, $arrcentosimporte, $obligacion)
    {
        $montocuenta = 0;
        $arrayreturn = array();
        $cont = 0;
        $objCodContable = new ConfigPersonaCodigoContable();
        //Buscando el importe del cc
        foreach ($arrcentosimporte as $i => $rci) {
            if ($rci->centroscosto == $centrocosto['idcentrogrupo']) {
                if (count($rci->personas) > 0) {
                    //Centro de costo
                    $arrayreturn['centrocosto'] = $rci->centroscosto;
                    $datoscentrocosto = $this->integrator->contabilidad_costos->obtenerCentroPorId($rci->centroscosto);
                    //$rexplode = explode('.', $datoscentrocosto['concat']);
                    //$arrayreturn['concat'] = $rexplode[0];
                    $arrayreturn['concat'] = $datoscentrocosto['concat'];
                    $arraypersonas = array();
                    $contp = 0;
                    foreach ($rci->personas as $ip => $rp) {
                        //Codigo contable
                        $idpersona = $rp['idpersona'];
                        $codigocontable = $objCodContable->obtenerConfigDadoIdPersonaEntidad($idpersona, $idestructura);
                        if (count($codigocontable) > 0) {
                            $arraypersonas[$contp]['idpersona'] = $idpersona;
                            $arraypersonas[$contp]['nombre'] = $codigocontable[0]['nombreapellido'];
                            $arraypersonas[$contp]['cdgocontable'] = $codigocontable[0]['cdgocontable'];
                            $arraypersonas[$contp]['obligacion'] = $obligacion;
                            $arraypersonas[$contp]['concat'] = $arrayreturn['concat'] . '.' . $codigocontable[0]['cdgocontable'];
                            $arraypersonas[$contp]['importeconcepto'] = $rp["c$idestructuranomina"];
                            $contp++;

                        }

                    }
                    $arrayreturn['personas'] = $arraypersonas;
                }
                $arrayreturn['importeconcepto'] = $rci->importeconcepto;
                $montocuenta = $montocuenta + $rci->importeconcepto;
                //$cont++;
                break;

            }
        }
        $respuesta->montocc = $montocuenta;
        $respuesta->datoscc = $arrayreturn;
        return $respuesta;
    }

    public function buscarDatosCentroCosto($centrocosto = null, $idelementogasto, $arrcentosimporte, $imod, $concatelemento, $tiposustitucion, $indiceelemento)
    {
        $montocuenta = 0;
        $arrayreturn = array();
        $cont = 0;

        //Buscando el importe del cc
        foreach ($arrcentosimporte as $i => $rci) {
            if ($rci->centroscosto == $centrocosto['idcentrogrupo']) {
                $arrayreturn['centrocosto'] = $rci->centroscosto;
                $datoscentrocosto = $this->integrator->contabilidad_costos->obtenerCentroPorId($rci->centroscosto);
                $rexplode = explode('.', $datoscentrocosto['concat']);
                /*if (count($rexplode) > 1) {
                    $arrayreturn['concat'] = ($tiposustitucion == 'idcentrogrupo' && $indiceelemento == 0) ? $rexplode[0] . $rexplode[1] . '.' . $concatelemento : $concatelemento . '.' . $rexplode[0] . $rexplode[1];
                } else {*/
                    $arrayreturn['concat'] = ($tiposustitucion == 'idcentrogrupo' && $indiceelemento == 0) ? $datoscentrocosto['concat'] . '.' . $concatelemento : $concatelemento . '.' . $datoscentrocosto['concat'];
                //}


                $arrayreturn['importeconcepto'] = $rci->importeconcepto;
                $montocuenta = $montocuenta + $rci->importeconcepto;
                $arrayreturn['idelementogasto'] = $idelementogasto;
                //$cont++;
                break;

            }
        }
        $respuesta->montocc = $montocuenta;
        $respuesta->datoscc = $arrayreturn;
        return $respuesta;
        /*if($imod == 1 && $idcentrocosto == 990000000225){
              print_r($arrayreturn);die;
            }*/

    }

    public function exportarASM($idelaborarpagos)
    {
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Anticipos Salariales Mensuales');
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Carnet de identidad');
        $objPHPExcel->getActiveSheet()->setCellValue('B1', 'Nombre y apellidos');
        $objPHPExcel->getActiveSheet()->setCellValue('C1', 'ASM');
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('B1')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'left' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objPHPExcel->getActiveSheet()->getStyle('C1')->getBorders()->applyFromArray(
            array(
                'bottom' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                ),
                'right' => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
        $objDatosNominas = new DatNominaDatos();
        $arrDatosNominas = $objDatosNominas->obtenerDatosNominaPlantillaPorElaborarPago($idelaborarpagos);
        $fila = 2;

        if (count($arrDatosNominas) > 0) {
            foreach ($arrDatosNominas as $k => $v) {
                $arrValores = unserialize($v['valores']);
                foreach ($arrValores as $iv => $rv) {
                    $rexplode = explode('-', $rv['id']);
                    //$datospersona = $ioc->pvd->getPrincipalesDatosPersona(array($rexplode[0]),null,null,null,null,null);
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $rv['c202']);
                    $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $rv['c203']);
                    $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $rv['c369']);
                    $fila++;
                }

            }
        }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Reporte de los anticipos salariales mensuales.xls" ');
        header('Cache-Control: max-age=0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
    }

    //Funcion para buscar las personas que pertenecen a las plantillas nominales
    public function buscarPersonasNominas($arraynominas, $persona, $modovisualizar = null)
    {
        if ($modovisualizar == 2) {
            return true;
        } else {
            foreach ($arraynominas as $rnomina) {
                if ($persona['idnomina'] == $rnomina) {
                    return true;
                }
            }
        }
        return false;
    }

    public function actualizarPeriodoPagoContabilizado($idelaborarpago, $idComprobante, $numComprobant, $tipocomprobante = null)
    {
        //Guardando los datos del comprobante en el periodo de pago
        $objDatElaborarPagoUpdate = Doctrine::getTable('DatElaborarPagos')->find($idelaborarpago);// print_r($objDatElaborarPagoUpdate);die;

        if ($tipocomprobante == 1) {
            // $objHisDatosNomina = new HisElaborarpagos();
            // $contComprobanteHis = $objHisDatosNomina->contComprobanteCancelacionOperaciones($idelaborarpago);

            // if ($contComprobanteHis > 0) {
            //     $idusuario = $this->global->Perfil->idusuario;
            //     $objHisDatosNomina->insertarDatosHistoricosElaborarPagoComCanc($idelaborarpago, $objDatElaborarPagoUpdate->idtipopago, $objDatElaborarPagoUpdate->idperiodopago, $objDatElaborarPagoUpdate->fechapago, $objDatElaborarPagoUpdate->fechainicioperiodo, $objDatElaborarPagoUpdate->fechafinperiodo, $objDatElaborarPagoUpdate->identidad, null, null, $objDatElaborarPagoUpdate->idcomprobantecancelacion, $objDatElaborarPagoUpdate->numerocomprobantecancelacion,  $idcomprobantecuentasporcobrar = null, $numerocomprobantecuentaxcobrar = null, $objDatElaborarPagoUpdate->descripcion, $idusuario, $tipocomprobante = 2);
            // }

            $objDatElaborarPagoUpdate->idcomprobanteoperaciones = $idComprobante;
            $objDatElaborarPagoUpdate->numerocomprobanteoperaciones = $numComprobant;
            $objDatElaborarPagoUpdate->idcomprobantecancelacion = null;
            $objDatElaborarPagoUpdate->numerocomprobantecancelacion = null;
            
        } else if ($tipocomprobante == 2) {
            $objDatElaborarPagoUpdate->idcomprobanteoperaciones = null;
            $objDatElaborarPagoUpdate->numerocomprobanteoperaciones = null;
            $objDatElaborarPagoUpdate->idcomprobantecancelacion = $idComprobante;
            $objDatElaborarPagoUpdate->numerocomprobantecancelacion = $numComprobant;            
        } else {
            $objDatElaborarPagoUpdate->idcomprobantecuentasporcobrar = $idComprobante;
            $objDatElaborarPagoUpdate->numerocomprobantecuentaxcobrar = $numComprobant;
        }
        $objDatElaborarPagoUpdate->save();
        return 'ok';

    }

    private function obtenerIdconceptoPDqueSonDescuento($idelaborapagos, $identidad)
    {
        /*$sql = "SELECT  DISTINCT ddmnc.idconcepto,cemn.idestructuramodelodomina
              FROM
              mod_nomina.conf_estructuramodelosnomina cemn,
              mod_nomina.dat_datosmodelonominaconceptos ddmnc,
              mod_nomina.conf_estructuramodelosnominaentidad cemne
              WHERE
              cemn.idestructuramodelodomina = ddmnc.idestructuramodelosnomina AND
              cemn.idtipocampo = 2 AND  ddmnc.tipo = 5 AND cemne.idestructuramodelodomina = cemn.idestructuramodelodomina
              AND cemne.idestructura = ?;";

      $mg           = Doctrine_Manager::getInstance();
      $conn         = $mg->getCurrentConnection();
      $idconceptopd = $conn->fetchAll($sql, array($identidad));
      print_r($idconceptopd);die;

      $arrayidconceptopd      = array();
      $arrayfinalidconceptopd = array();
      $arraAux                = array();
      foreach ($idconceptopd as $k => $valor) {
        $id = explode('_', $valor['idconcepto'])[4];
        if (!in_array($id, $arrayidconceptopd)) {
          $arraAux['idconcepto']               = $id;
          $arraAux['idestructuramodelodomina'] = $valor['idestructuramodelodomina'];
          array_push($arrayidconceptopd, $id);
          array_push($arrayfinalidconceptopd, $arraAux);
        }
      }

      $stringfinalidconceptopd = $this->obtenerArrayIdConceptoPd($arrayidconceptopd);*/

        $sql = "SELECT
               cemn.idestructuramodelodomina,
               cemn.denominacion
               FROM
               mod_nomina.conf_estructuramodelosnomina cemn
               WHERE
               cemn.idtipocampo <> 1 AND
               cemn.descuento = 1;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrayidestructuramodelodenomina = $conn->fetchAll($sql);
        $arrayidestructuramodelodenominavalores = array();
        foreach ($arrayidestructuramodelodenomina as $k => $valor) {
            array_push($arrayidestructuramodelodenominavalores, 'c' . $valor['idestructuramodelodomina']);
        }
        // print_r($arrayidestructuramodelodenominavalores);die;
        return $arrayidestructuramodelodenominavalores;
    }

    private function obtenerArrayIdConceptoPd($arrayidconceptopd)
    {
        $stringfinalidconceptopd = '';
        foreach ($arrayidconceptopd as $k => $valor) {
            if ($valor) {
                if ($k == count($arrayidconceptopd) - 1) {
                    $stringfinalidconceptopd .= $valor;
                } else {
                    $stringfinalidconceptopd .= $valor . ',';
                }
            }

        }


        return $stringfinalidconceptopd;
    }

    private function dameArrayCampo($camposnomina, $indice)
    {
        $finalidconceptopd = array();
        foreach ($camposnomina as $clave => $campo) {
            if ($campo['indice'] == $indice) {
                $finalidconceptopd = array('indice' => $campo['indice'], 'denominacion' => $campo['denominacion']);
            }
        }
        return $finalidconceptopd;
    }

    private function estaValorEnArray($array, $valor)
    {

        foreach ($array as $clave => $campo) {
            if ($campo == $valor)
                return true;
        }
        return false;
    }

    public function exportarDescuentosAplicados($idelaborapagos, $identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $arrayidconceptopd = $this->obtenerIdconceptoPDqueSonDescuento($idelaborapagos, $identidad);
        $objHisRetenciones = new HisRetencionesPersona();
        $datosEntidad = $objHisRetenciones->obtenerDatosEntidadDadoId($identidad);

        //print_r($arrayidconceptopd);die;
        $datosNomina = new DatNominaDatos();
        $NomTipoNomina = new NomTipoNomina();

        $arrayCamposDescuentosPersona = array();
        $cont = 0;
        foreach ($idelaborapagos as $cont => $idelaborapago) {
            $arrayDatNomina = $datosNomina->obtenerDatosNominaPorElaborarPago($idelaborapago);
            $denominacionnomina = $NomTipoNomina->obtenerDenominacionNominaXIdElaborarPago($idelaborapago)[0]['denominacion'];

            $campos = unserialize($arrayDatNomina[0]['campos']);

            foreach ($arrayDatNomina as $idn => $dnom) {
                $valores = unserialize($dnom['valores']);
                foreach ($valores as $k => $personadescuentos) {
                    foreach ($personadescuentos as $indice => $valorid) {
                        if ($this->estaValorEnArray($arrayidconceptopd, $indice)) {
                            if ($valorid > 0.00) {
                                $sql = "SELECT pcc.cdgocontable,
                                CASE WHEN p.snombre is null 
                                THEN  p.nombre || ' '||p.papel || ' '||p.sapel 
                                ELSE  p.nombre || ' '||p.snombre || ' '||p.papel || ' '||p.sapel END as persona, di.numero
                                FROM mod_persona.dat_persona p 
                                INNER JOIN mod_persona.dat_docidentidad di ON(di.idpersona = p.idpersona)
                                LEFT JOIN mod_nomina.conf_personacdgocontable pcc  ON( p.idpersona = pcc.idpersona AND pcc.idestructura = ?)
                                WHERE p.idpersona = ?;";
                                $idpersona = explode('-', $personadescuentos['id'])[0];
                                $datospersona = $conn->fetchArray($sql, array($identidad, $idpersona));
                                $arrayconcetoPDyDescuento = $this->dameArrayCampo($campos, $indice);
                                $denominacionCampo = $arrayconcetoPDyDescuento['denominacion'];
                                $valorCampo = $valorid;
                                $plantillan1 = explode('-', $personadescuentos['plantillanominal']);

                                if (count($plantillan1) > 1) {
                                    $plantillan = $plantillan1[2];
                                    $ordenplantillan = $plantillan[1];
                                } else {
                                    $plantillan = $personadescuentos['plantillanominal'];
                                }
                                array_push($arrayCamposDescuentosPersona, array(
                                        'cdgoctble' => $datospersona[0],
                                        'ci' => $datospersona[2],
                                        'persona' => $datospersona[1],
                                        "tipodescuento" => $denominacionCampo,
                                        "valordescuento" => $valorCampo,
                                        'nomina' => $denominacionnomina,
                                        'plantillanominal' => $plantillan
                                    )
                                );
                            }

                        }
                    }
                }
            }
        }
        $arrayCamposDescuentosPersona = $this->ordenarArrayPorClave($arrayCamposDescuentosPersona, 'plantillanominal');
        //print_r($arrayCamposDescuentosPersona);die;

        $datos = $arrayCamposDescuentosPersona;
        $encabezado = array('Cod', 'CI', 'Nombre y apellidos', 'Descuento', 'Importe', 'Nómina');
        $pdf = new Mipdf($datos, $encabezado, 'L', 'mm', 'letter');
        ob_start();
        $pdf = $this->DatosGenerales($pdf);
        $this->datosPiedePagina($pdf, $identidad);
        $pdf->identidad = $identidad;
        $pdf->crearCabezera('Descuentos por persona', $datosEntidad[0]['denominacion'], $datosEntidad[0]['codigo']);
        $pdf->pintarContenido();

        //Totales de descuentos
        $pdf->Ln();
        $posmediotabla = ($pdf->getAncho() - $pdf->getAnchoTabla()) / 2;
        $pdf->SetFont('Arial', 'B');
        $pdf->pintarCelda('Total general por descuentos', $pdf->getAnchoTabla(), $posmediotabla + 1, 'C', false, 1, 0, 200);

        $arrtotales = array();
        foreach ($datos as $persona) {
            $arrtotales[$persona['nomina']][$persona['tipodescuento']] += $persona['valordescuento'];
        }

        foreach ($arrtotales as $nomina => $arrtotal) {
            //($texto, $ancho, $posicion, $alineacion, $encabezado, $saltodelinea, $border, $color, $m)
            $pdf->SetFont('Arial', 'B');
            $pdf->pintarCelda($nomina, $pdf->getAnchoTabla(), $posmediotabla + 1, 'L', false, 1, 1, 240/*,false*/);
            foreach ($arrtotal as $campo => $valor) {
                $pdf->SetFont('Arial', '');
                $pdf->pintarCelda($campo, ($posmediotabla + 1), $posmediotabla + 1, 'L', false, 0, 1, 255/*,false*/);
                $pdf->pintarCelda($valor, $pdf->getAnchoTabla() - ($posmediotabla + 1), ($posmediotabla + 1) * 2, 'L', false, 1, 1, 255/*,false*/);
            }
        }

        $pdf->Output();
        ob_flush();
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

    public function ordenarArrayPorClave($array, $clave, $orden = SORT_ASC)
    {
        $nuevoarray = array();
        $arrayaordenar = array();

        if (count($array) > 0) {
            foreach ($array as $k => $v) {
                if (is_array($v)) {
                    foreach ($v as $k2 => $v2) {
                        if ($k2 == $clave) {
                            $arrayaordenar[$k] = $v2;
                        }
                    }
                } else {
                    $arrayaordenar[$k] = $v;
                }
            }

            switch ($orden) {
                case SORT_ASC:
                    asort($arrayaordenar);
                    break;
                case SORT_DESC:
                    arsort($arrayaordenar);
                    break;
            }
            $cont = 0;
            foreach ($arrayaordenar as $k => $v) {
                $nuevoarray[$cont++] = $array[$k];
            }
        }

        return $nuevoarray;
    }

    public function datosPiedePagina($pdf, $identidad)
    {
        $obj = new ReportepdfModel();
        $datospiefirma = $obj->getPieFirmaDocumentoXIdEntidad($identidad);
        // print_r($identidad);die;
        $arrdatosfirmas = array();
        foreach ($datospiefirma as $pfirma) {
            $pnombre = trim($pfirma['nombre']);
            $snombre = trim($pfirma['snombre']);
            $papell = trim($pfirma['papel']);
            $sapell = trim($pfirma['sapel']);
            $nombrecompleto = (empty($pfirma['snombre'])) ? $pnombre . ' ' . $papell . ' ' . $sapell :
                $pnombre . ' ' . $snombre . ' ' . $papell . ' ' . $sapell;
            $arrdatosfirmas[$pfirma['orden']]['idpersona'] = $pfirma['idpersona'];
            $arrdatosfirmas[$pfirma['orden']]['piefirma'] = $pfirma['denominacion'];
            $arrdatosfirmas[$pfirma['orden']]['nombre'] = $nombrecompleto;
        }

        $pdf->fnSetDatosPiePagina($arrdatosfirmas);
    }

    public function pintarCuerpo($pdf)
    {
        $pdf->gh;

        return $pdf;
    }

    public function exportarDescuentosNoAplicados($idelaborarpagos, $identidad, $accionvalidar)
    {
        $idtiponomina = ConfigModeloNomina::obtenerIdTiposNominaporTipoPago($idelaborarpagos);
        $ci = ConfigEstructurarModelosNomina::obtenerCampoCarnetIdentidad($idtiponomina[0]['idtiponomina']);
        $nombreapellidos = ConfigEstructurarModelosNomina::obtenerCampoNombre($idtiponomina[0]['idtiponomina'], $identidad);
        $campovalornegativo = ConfigEstructurarModelosNomina::obtenerCampoNegativo($idtiponomina[0]['idtiponomina'], $identidad);
        $respuesta = array();
        $arraypersonas = array();
        $cont = 0;
        $datosnomina = DatNominaDatos::obtenerDatosNominaPorElaborarPago($idelaborarpagos);
        foreach ($datosnomina as $i => $nomina) {
            $arrValores = unserialize($nomina['valores']);
            foreach ($arrValores as $pers) {
                if ($pers['c' . $campovalornegativo[0]['idestructuramodelodomina']] < 0) {
                    $arraypersonas[$cont]['CI'] = $pers['c' . $ci[0]['idestructuramodelodomina']];
                    $arraypersonas[$cont]['Nombre'] = $pers['c' . $nombreapellidos[0]['idestructuramodelodomina']];
                    $arraypersonas[$cont]['Importe'] = $pers['c' . $campovalornegativo[0]['idestructuramodelodomina']];
                    $cont++;
                }
            }
        }

        if ($accionvalidar == 1) {
            if (count($campovalornegativo) == 0 || count($arraypersonas) == 0) {
                if (count($campovalornegativo) == 0) {
                    $respuesta['msg'] = 'NO-CAMPOS-VALORES-NEGATIVOS';
                    $respuesta['denomtiponomina'] = NomTipoNomina::obtenerDenominacion($idtiponomina[0]['idtiponomina']);
                    return $respuesta;
                }
                if (count($arraypersonas) == 0) {
                    $respuesta['msg'] = 'NO-PERSONAS-IMPORTES-NEGATIVOS';
                    return $respuesta;
                }
            } else
                return 'ok';
        } else {
            //Creando el objeto de phpexel
            $objPHPExcel = new PHPExcel();
            $objPHPExcel->setActiveSheetIndex(0);
            $objPHPExcel->getActiveSheet()->setTitle('Descuentos no aplicados');
            $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(30);
            $objPHPExcel->getActiveSheet()->getRowDimension(2)->setRowHeight(20);
            $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(25);
            $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(55);
            $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(25);

            //Formato del Titulo
            //Concatenando desde B hasta D para escribir Titulo
            $objPHPExcel->getActiveSheet()->mergeCells('B1:D1');
            $objPHPExcel->getActiveSheet()->setCellValue('B1', 'Descuentos no aplicados');
            for ($i = 2; $i < 5; $i++) {
                $this->fnPintarBordes($objPHPExcel, chr($i + 64) . '1', 0, 1, 1, 1, PHPExcel_Style_Border::BORDER_MEDIUM);
            }
            $this->fnFuenteTexto($objPHPExcel, 'B1', 'Arial', 12);
            $this->fnAlinearTexto($objPHPExcel, 'B1', 'center', 'center', 0);

            //Formato del campo CI
            $objPHPExcel->getActiveSheet()->setCellValue('B2', $ci[0]['denominacion']);
            $this->fnPintarBordes($objPHPExcel, 'B2', 1, 1, 1, 1, PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnFuenteTexto($objPHPExcel, 'B2', 'Arial', 10);
            $this->fnAlinearTexto($objPHPExcel, 'B2', 'center', 'center', 0);

            //Formato del campo Nombre y apellidos
            $objPHPExcel->getActiveSheet()->setCellValue('C2', $nombreapellidos[0]['denominacion']);
            $this->fnPintarBordes($objPHPExcel, 'C2', 1, 1, 1, 1, PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnFuenteTexto($objPHPExcel, 'C2', 'Arial', 10);
            $this->fnAlinearTexto($objPHPExcel, 'C2', 'center', 'center', 0);

            //Formato del campo Diferencia
            $objPHPExcel->getActiveSheet()->setCellValue('D2', $campovalornegativo[0]['denominacion']);
            $this->fnPintarBordes($objPHPExcel, 'D2', 1, 1, 1, 1, PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnFuenteTexto($objPHPExcel, 'D2', 'Arial', 10);
            $this->fnAlinearTexto($objPHPExcel, 'D2', 'center', 'center', 0);

            $numero = 3;
            //Valores de cada campo de3 la persona (codigo dinamico)
            foreach ($arraypersonas as $persona) {
                //Formato de los valores del campo CI
                $objPHPExcel->getActiveSheet()->setCellValue('B' . $numero, $persona['CI']);
                $this->fnPintarBordes($objPHPExcel, 'B' . $numero, 1, 1, 1, 1, PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, 'B' . $numero, 'left', 'center', 0);

                //Formato de los valores del campo Nombre y apellidos
                $objPHPExcel->getActiveSheet()->setCellValue('C' . $numero, $persona['Nombre']);
                $this->fnPintarBordes($objPHPExcel, 'C' . $numero, 1, 1, 1, 1, PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, 'C' . $numero, 'left', 'center', 0);

                //Formato de los valores del campo Diferencia
                $objPHPExcel->getActiveSheet()->setCellValue('D' . $numero, $persona['Importe']);
                $this->fnPintarBordes($objPHPExcel, 'D' . $numero, 1, 1, 1, 1, PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, 'D' . $numero, 'left', 'center', 0);

                $numero++;
            }
            //TERMINACION DEL EXCEL*********************************************************
            ob_end_clean();
            //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="Descuentos no aplicados.xls" ');
            header('Cache-Control: max-age=0');

            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            ob_end_clean();
            echo($objWriter->save('php://output'));

            $objPHPExcel->disconnectWorksheets();
            unset($objPHPExcel);
        }
    }

    private function buscarPadre($arr, $id)
    {
        foreach ($arr as $key => $e) {
            if ($e['idfila'] == $id) {
                foreach ($arr as $k => $ep) {
                    if ($ep['idfila'] == $e['idpadre']) {
                        return $ep;
                    }
                }
                return -1;
            }
        }
        return -1;
    }

    /**Funcionalidades para los estilos del excel
     * @Autor Ing. Dainier Velázquez Labrada
     */
    public function fnPintarCelda(&$objPHPExcel, $column, $row, $val, $border = null, $bordercolor = null, $font = null, $fontsize = null, $fontcolor = null, $alignhor = null, $alignver = null, $rotate = null, $bold = null)
    {
        //Ejemplo
        //$this->fnPintarCelda($objPHPExcel, 'A', 3, 'Entidad prueba', 't,r,b,l', '700000', 'Arial', 10, '700000', 'center', 'center', 90, 0);

        //Pintando el valor de la celda
        $objPHPExcel->getActiveSheet()->setCellValue($column . $row, $val);

        //Pintando los bordes a la celda
        if (!empty($border)) {
            $arrbordes = explode(',', $border);
            foreach ($arrbordes as &$bord) {
                $bord = mb_strtolower($bord);
                switch ($bord) {
                    case 't':
                        $realborder = 'top';
                        break;
                    case 'top':
                        $realborder = 'top';
                        break;
                    case 'r':
                        $realborder = 'right';
                        break;
                    case 'right':
                        $realborder = 'right';
                        break;
                    case 'b':
                        $realborder = 'bottom';
                        break;
                    case 'bottom':
                        $realborder = 'bottom';
                        break;
                    case 'l':
                        $realborder = 'left';
                        break;
                    case 'left':
                        $realborder = 'left';
                        break;
                    default:
                        $realborder = null;
                        break;
                }

                $objPHPExcel->getActiveSheet()->getStyle($column . $row)->getBorders()->applyFromArray(
                    array(
                        $realborder => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array(
                                'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                            )
                        )
                    )
                );
            }
        }

        //Dandole fuente a la celda
        $objPHPExcel->getActiveSheet()->getStyle($column . $row)->getFont()->applyFromArray(
            array(
                'name' => $font,
                'bold' => ($bold == 1) ? TRUE : FALSE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => $fontsize,
                'color' => array(
                    'rgb' => (!empty($fontcolor)) ? $fontcolor : '000000'
                )
            )
        );

        //Centrando el texto de la celda
        $objPHPExcel->getActiveSheet()->getStyle($column . $row)->getAlignment()->applyFromArray(
            array(
                'horizontal' => $alignhor,
                'vertical' => $alignver,
                'rotation' => $rotate, //0 ó 90
                'wrap' => TRUE
            )
        );

    }

    public function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()->applyFromArray(
            array(
                $lado => array(
                    'style' => $tipoborde,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
    }

    public function fnAlinearTexto(&$objPHPExcel, $celda, $hor, $ver, $rot)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()->applyFromArray(
            array(
                'horizontal' => $hor,
                'vertical' => $ver,
                'rotation' => $rot, //0 ó 90
                'wrap' => TRUE
            )
        );
    }

    public function fnFuenteTexto(&$objPHPExcel, $celda, $name, $size)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()->applyFromArray(
            array(
                'name' => $name,
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => $size,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
    }

    /**
     * Convertir un índice numérico (1-based) a la columna Excel correspondiente.
     * Ejemplo: 1 -> A, 26 -> Z, 27 -> AA, 52 -> AZ, 53 -> BA, etc.
     */
    private function convertirIndiceAColumna($index)
    {
        $result = '';
        while ($index > 0) {
            $mod = ($index - 1) % 26;
            $result = chr(65 + $mod) . $result;
            $index = intval(($index - 1) / 26);
        }
        return $result;
    }

    public function fnFormatoNumeros(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );
    }

    public function fnFechaHora()
    {
        //Cambiando la zona horaria
        date_default_timezone_set('America/Havana');
        //Capturando la fecha y hora
        $fecha = date('d/m/Y');
        $hora = date('h:i:s A');
        $arraydate['fecha'] = $fecha;
        $arraydate['hora'] = $hora;
        return $arraydate;
    }

    public function fnPintarResumen(&$objPHPExcel, $numero, $arrayCampos)
    {
        //Cambiandole la dimensión a la fila de Conceptos
        $objPHPExcel->getActiveSheet()->getRowDimension($numero)->setRowHeight(50);
        //Escribiendo "Concepto" e "Importe Total"
        $objPHPExcel->getActiveSheet()->setCellValue('C' . $numero, 'Concepto');
        $objPHPExcel->getActiveSheet()->setCellValue('C' . ($numero + 1), 'Importe Total');
        $numeroAux = $numero;
        for ($i = 0; $i < 2; $i++) {
            //Dandole formato 'center' a la palabra "Concepto"
            $this->fnAlinearTexto($objPHPExcel, 'C' . $numeroAux, 'center', 'center', 0);
            //Dandole formato 'bold' a la palabra "Concepto"
            $this->fnFuenteTexto($objPHPExcel, 'C' . $numeroAux, 'Arial', 11);
            //Pintando los bordes de la palabra "Concepto"
            $this->fnPintarBordes($objPHPExcel, 'C' . $numeroAux, 'top', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, 'C' . $numeroAux, 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, 'C' . $numeroAux, 'left', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, 'C' . $numeroAux, 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
            $numeroAux++;
        }

        //Código dinámico para las denominaciones de los campos y sus respectivos valores
        $letra = 0;
        for ($k = 0; $k < 2; $k++) {
            $letra = 4;
            foreach ($arrayCampos as $x => $camposnomina) {
                $letraconvertida = ($letra < 27) ? chr($letra + 64) : 'A' . chr($letra + 38);
                ($k == 0) ? $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $camposnomina['denominacion']) :
                    $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . $numero, $camposnomina['subtotal']);
                //Formato numérico
                $this->fnFormatoNumeros($objPHPExcel, $letraconvertida . $numero);
                //Dandole formato 'center'
                $this->fnAlinearTexto($objPHPExcel, $letraconvertida . $numero, 'center', 'center', 0);
                //Dandole borders
                ($k == 0) ? $this->fnPintarBordes($objPHPExcel, $letraconvertida . $numero, 'top', PHPExcel_Style_Border::BORDER_MEDIUM) :
                    $this->fnPintarBordes($objPHPExcel, $letraconvertida . $numero, 'top', PHPExcel_Style_Border::BORDER_THIN);

                ($k == 1) ? $this->fnPintarBordes($objPHPExcel, $letraconvertida . $numero, 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM) :
                    $this->fnPintarBordes($objPHPExcel, $letraconvertida . $numero, 'bottom', PHPExcel_Style_Border::BORDER_THIN);

                ($x == (count($arrayCampos) - 1)) ? $this->fnPintarBordes($objPHPExcel, $letraconvertida . $numero, 'right', PHPExcel_Style_Border::BORDER_MEDIUM) :
                    $this->fnPintarBordes($objPHPExcel, $letraconvertida . $numero, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $letra++;
            }
            $numero++;
        }
    }

    public function fnDesgloseBilletes($importeadesglozar)
    {
        $importetotal = (strlen(explode('.', $importeadesglozar)[1]) == 1) ? ($importeadesglozar . "0") : $importeadesglozar;
        //Arrays con valores de los billetes y menudos
        $array_valor_billetes = [100, 50, 20, 10, 5, 3, 1];
        $array_valor_menudos = [20, 5, 1];
        $importebillete = explode('.', $importetotal)[0];
        $importemenudo = intval((strlen(explode('.', $importetotal)[1]) == 1) ? (explode('.', $importetotal)[1] . "0") : (explode('.', $importetotal)[1]));
        $arraybilletes = array();
        $arraymenudo = array();
        $arrayfinal = array();
        //LLenando las columnas de billetes y menudos con sus respectivos valores
        foreach ($array_valor_billetes as $b => $billete) {
            //Cantidad de BILLETES
            $cant_billetes = ($importebillete >= $billete) ? intval($importebillete / $billete) : 0;
            $importebillete = ($importebillete != $billete) ? (($importebillete > $billete) ? ($importebillete % $billete) : $importebillete) : 0;
            $arraybilletes[$billete] += $cant_billetes;

            //Cantidad de MENUDO
            if ($b < count($array_valor_menudos)) {
                $cant_menudos = ($importemenudo >= $array_valor_menudos[$b]) ? intval($importemenudo / $array_valor_menudos[$b]) : 0;
                $importemenudo = ($importemenudo != $array_valor_menudos[$b]) ? (($importemenudo > $array_valor_menudos[$b]) ? ($importemenudo % $array_valor_menudos[$b]) : $importemenudo) : 0;
                $arraymenudo[$array_valor_menudos[$b]] += $cant_menudos;
            }
        }
        $arrayfinal[0] = $arraybilletes;
        $arrayfinal[1] = $arraymenudo;
        return $arrayfinal;
    }

    public function fnPintarDesglose(&$objPHPExcel, $numero, $importetotaldesglose, $arrcantbilletesdesglose)
    {
        //Extrayendo las cantidades de billetes del array $arrcantbilletesdesglose
        //Arrays con valores de los billetes y menudos
        $array_billetes = [100, 50, 20, 10, 5, 3, 1];
        $array_cant_billetes = array();
        $array_menudo = [20, 5, 1];
        $array_cant_menudo = array();
        foreach ($arrcantbilletesdesglose as $desglosepersona) {
            foreach ($array_billetes as $bill) {
                $array_cant_billetes[$bill] += $desglosepersona[0][$bill];
            }
            foreach ($array_menudo as $men) {
                $array_cant_menudo[$men] += $desglosepersona[1][$men];
            }
        }

        //Importe total a devengar
        $importetotal = (strlen(explode('.', $importetotaldesglose)[1]) == 1) ? ($importetotaldesglose . "0") : $importetotaldesglose;
        /*Escribiendo Desglose de Billetes*************************************************/
        //Concatenando desde C hasta I
        $objPHPExcel->getActiveSheet()->mergeCells('C' . $numero . ':I' . $numero);
        //Escribiendo "Desglose"
        $objPHPExcel->getActiveSheet()->setCellValue('C' . $numero, 'Desglose de billetes (' . number_format($importetotal, 2, ',', '') . ')');
        //Dandole formato 'center' a la palabra "Desglose"
        $this->fnAlinearTexto($objPHPExcel, 'C' . $numero, 'center', 'center', 0);
        for ($i = 3; $i < 10; $i++) {
            //Dandole formato 'bold' a la palabra "Desglose"
            $this->fnFuenteTexto($objPHPExcel, 'C' . $numero, 'Arial', 13);
            //Pintando los bordes de la palabra "Desglose"
            $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numero, 'top', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numero, 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numero, 'left', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numero, 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
        }
        $numeroAux = $numero + 1;
        /*Escribiendo Billete y Menudo******************************************************/
        //Cambiandole la dimensión a la fila de Billete; Menudo
        $objPHPExcel->getActiveSheet()->getRowDimension($numeroAux)->setRowHeight(30);
        //Concatenando desde C hasta D y de la E hasta la I
        $objPHPExcel->getActiveSheet()->mergeCells('E' . $numeroAux . ':H' . $numeroAux);
        //Escribiendo Billete, Menudo y Cant
        $objPHPExcel->getActiveSheet()->setCellValue('C' . $numeroAux, 'Billetes');
        $objPHPExcel->getActiveSheet()->setCellValue('D' . $numeroAux, 'Cant.');
        $objPHPExcel->getActiveSheet()->setCellValue('E' . $numeroAux, 'Menudo');
        $objPHPExcel->getActiveSheet()->setCellValue('I' . $numeroAux, 'Cant.');
        //Dandole formato 'center' a las palabras Billete; Menudo
        $this->fnAlinearTexto($objPHPExcel, 'C' . $numeroAux, 'center', 'center', 0);
        $this->fnAlinearTexto($objPHPExcel, 'D' . $numeroAux, 'center', 'center', 0);
        $this->fnAlinearTexto($objPHPExcel, 'E' . $numeroAux, 'center', 'center', 0);
        $this->fnAlinearTexto($objPHPExcel, 'I' . $numeroAux, 'center', 'center', 0);
        for ($i = 3; $i < 10; $i++) {
            //Dandole formato 'bold' a la palabra "Desglose"
            $this->fnFuenteTexto($objPHPExcel, 'C' . $numeroAux, 'Arial', 11);
            $this->fnFuenteTexto($objPHPExcel, 'D' . $numeroAux, 'Arial', 11);
            $this->fnFuenteTexto($objPHPExcel, 'E' . $numeroAux, 'Arial', 11);
            $this->fnFuenteTexto($objPHPExcel, 'I' . $numeroAux, 'Arial', 11);
            //Pintando los bordes de la palabra "Desglose"
            $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numeroAux, 'top', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numeroAux, 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numeroAux, 'left', PHPExcel_Style_Border::BORDER_MEDIUM);
            $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numeroAux, 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
        }
        $numeroAux++;
        /*Escribiendo El contenido de la tabla*********************************************/
        //LLenando las columnas de billetes y menudos con sus respectivos valores
        $contmenudo = 0;
        foreach ($array_cant_billetes as $b => $billete) {
            //Concatenando desde la E hasta la H
            $objPHPExcel->getActiveSheet()->mergeCells('E' . $numeroAux . ':H' . $numeroAux);

            //Escribiendo el valor de cada celda
            //Cantidad de BILLETES
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $numeroAux, $b . '');
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $numeroAux, $billete . '');
            //Cantidad de MENUDO
            if ($contmenudo < count($array_menudo)) {
                $objPHPExcel->getActiveSheet()->setCellValue('E' . $numeroAux, $array_menudo[$contmenudo] . '');
                $objPHPExcel->getActiveSheet()->setCellValue('I' . $numeroAux, $array_cant_menudo[$array_menudo[$contmenudo]] . '');
            }

            //Dandole formato 'center' a las palabras Billete; Menudo
            $this->fnAlinearTexto($objPHPExcel, 'C' . $numeroAux, 'center', 'center', 0);
            $this->fnAlinearTexto($objPHPExcel, 'D' . $numeroAux, 'center', 'center', 0);
            $this->fnAlinearTexto($objPHPExcel, 'E' . $numeroAux, 'center', 'center', 0);
            $this->fnAlinearTexto($objPHPExcel, 'I' . $numeroAux, 'center', 'center', 0);
            for ($i = 3; $i < 10; $i++) {
                $this->fnFuenteTexto($objPHPExcel, 'C' . $numeroAux, 'Arial', 11);
                $this->fnFuenteTexto($objPHPExcel, 'E' . $numeroAux, 'Arial', 11);
                //Pintando los bordes de la palabra "Desglose"
                $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numeroAux, 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numeroAux, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numeroAux, 'left', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, chr($i + 64) . $numeroAux, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            }
            $numeroAux++;
            $contmenudo++;
        }
    }

    public function in_array_field($needle, $needle_field, $haystack, $strict = false)
    {
        if ($strict) {
            foreach ($haystack as $item)
                if (isset($item[$needle_field]) && $item[$needle_field] === $needle)
                    return true;
        } else {
            foreach ($haystack as $item)
                if (isset($item[$needle_field]) && $item[$needle_field] == $needle)
                    return true;
        }
        return false;
    }

    public function fnPintarEncabezado(&$objPHPExcel, $id, $idestructura, $objdatosperiodo, $titulo, $numerohoja)
    {
        //CODIGO DE PHP EXEL
        $objPHPExcel->setActiveSheetIndex($numerohoja);
        $objPHPExcel->getActiveSheet()->setTitle($titulo);
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, 16, 1);
        //Concatenando la primera fila para escribir "nomina"
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Nóminas');
        //Dandole formato 'center' a la palabra nomina

        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold' a la palabra nomina
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        $letrarecorrer = 1;
        for ($i = 0; $i < 17; $i++) {
            $letraconvertidarecorrer = chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda 'nomina'
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrer . '1', 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
            $letrarecorrer++;
        }
        $this->fnPintarBordes($objPHPExcel, 'Q2', 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
        //Concatenando la segunda fila para escribir "entidad"
        $objPHPExcel->getActiveSheet()->mergeCells('A2:B2');
        $objPHPExcel->getActiveSheet()->setCellValue('A2', 'Entidad');
        //Dandole formato 'center' a la palabra entidad
        $this->fnAlinearTexto($objPHPExcel, 'A2', 'center', '', 0);
        $letrarecorrerA2B2 = 1;
        for ($i = 0; $i < 2; $i++) {
            $letraconvertidarecorrerA2B2 = chr($letrarecorrerA2B2 + 64);
            //Dandole borders a la palabra entidad
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrerA2B2 . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $letrarecorrerA2B2++;
        }
        $this->fnPintarBordes($objPHPExcel, 'B2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        //Concatenando la segunda fila para escribir "Cheque"
        $objPHPExcel->getActiveSheet()->mergeCells('C2:D2');
        $objPHPExcel->getActiveSheet()->setCellValue('C2', 'Cheque');
        //Dandole formato 'center' a la palabra Cheque
        $this->fnAlinearTexto($objPHPExcel, 'C2', 'center', '', 0);
        //Dandole borders a la palabra Cheque
        $letrarecorrerC2D2 = 3;
        for ($i = 0; $i < 2; $i++) {
            $letraconvertidarecorrerC2D2 = chr($letrarecorrerC2D2 + 64);
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrerC2D2 . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $letrarecorrerC2D2++;
        }
        $this->fnPintarBordes($objPHPExcel, 'D2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        //Concatenando desde E2 hasta I2 para escribir "Tipo de Nominas"
        $objPHPExcel->getActiveSheet()->mergeCells('E2:I2');
        $objPHPExcel->getActiveSheet()->setCellValue('E2', 'Tipo de Nóminas');
        //Dandole formato 'center' a la palabra "Tipo de Nominas"
        $this->fnAlinearTexto($objPHPExcel, 'E2', 'center', 'center', 0);
        //Dandole borders a la palabra "Tipo de Nominas"
        $letrarecorrerE2I2 = 5;
        for ($i = 0; $i < 5; $i++) {
            $letraconvertidarecorrerE2I2 = chr($letrarecorrerE2I2 + 64);
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrerE2I2 . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $letrarecorrerE2I2++;
        }
        $this->fnPintarBordes($objPHPExcel, 'I2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        //Concatenando desde E2 hasta I2 para escribir "Período"
        $objPHPExcel->getActiveSheet()->mergeCells('L2:Q2');
        $objPHPExcel->getActiveSheet()->setCellValue('L2', 'Período');
        //Dandole formato 'center' a la palabra "Período"
        $this->fnAlinearTexto($objPHPExcel, 'L2', 'center', '', 0);
        //Dandole borders a la palabra "Período"
        $this->fnPintarBordes($objPHPExcel, 'L2', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $letrarecorrerL2Q2 = 12;
        for ($i = 0; $i < 6; $i++) {
            $letraconvertidarecorrerL2Q2 = chr($letrarecorrerL2Q2 + 64);
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrerL2Q2 . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $letrarecorrerL2Q2++;
        }
        //Concatenando desde J2 hasta J4 para escribir "Nomina"
        $objPHPExcel->getActiveSheet()->mergeCells('J2:J4');
        $objPHPExcel->getActiveSheet()->setCellValue('J2', 'Nómina Nro.');
        //Dandole formato 'center' a la palabra "Nomina"
        $this->fnAlinearTexto($objPHPExcel, 'J2', 'center', '', 0);
        //Dandole borders a la palabra "Nomina"
        $columnaJ2J4 = 2;
        for ($i = 0; $i < 3; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'J' . $columnaJ2J4, 'left', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'J' . $columnaJ2J4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaJ2J4++;
        }
        $this->fnPintarBordes($objPHPExcel, 'J4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        //Concatenando desde K2 hasta K4 para escribir "Hoja Nro"
        $objPHPExcel->getActiveSheet()->mergeCells('K2:K4');
        $objPHPExcel->getActiveSheet()->setCellValue('K2', 'Hoja Nro.');
        //Dandole formato 'center' a la palabra "Hoja Nro"
        $this->fnAlinearTexto($objPHPExcel, 'K2', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'K4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaK2K4 = 2;
        for ($i = 0; $i < 3; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'K' . $columnaK2K4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaK2K4++;
        }
        //Concatenando desde A3 hasta A4 para escribir "Nombre"
        $objPHPExcel->getActiveSheet()->mergeCells('A3:A4');
        $objPHPExcel->getActiveSheet()->setCellValue('A3', 'Nombre');
        $objPHPExcel->getActiveSheet()->setCellValue('A3', 'Nombre');
        //Dandole formato 'center' a la palabra "Nombre"
        $this->fnAlinearTexto($objPHPExcel, 'A3', 'center', '', 0);
        //Dandole borders a la palabra "Nombre"
        $this->fnPintarBordes($objPHPExcel, 'A4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaA3A4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'A' . $columnaA3A4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaA3A4++;
        }
        $this->fnPintarBordes($objPHPExcel, 'A3', 'left', PHPExcel_Style_Border::BORDER_THIN);
        //Concatenando desde B3 hasta B4 para escribir "Código"
        $objPHPExcel->getActiveSheet()->mergeCells('B3:B4');
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Código');
        //Dandole formato 'center' a la palabra "Código"
        $this->fnAlinearTexto($objPHPExcel, 'B3', 'center', '', 0);
        //Dandole borders a la palabra "Código"
        $this->fnPintarBordes($objPHPExcel, 'B4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaB3B4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'B' . $columnaB3B4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaB3B4++;
        }
        //Concatenando desde C3 hasta C4 para escribir "No."
        $objPHPExcel->getActiveSheet()->mergeCells('C3:C4');
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'No.');
        //Dandole formato 'center' a la palabra "No."
        $this->fnAlinearTexto($objPHPExcel, 'C3', 'center', '', 0);
        //Dandole borders a la palabra "No."
        $this->fnPintarBordes($objPHPExcel, 'C4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaC3C4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'C' . $columnaC3C4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaC3C4++;
        }
        //Concatenando desde D3 hasta D4 para escribir "Fecha"
        $objPHPExcel->getActiveSheet()->mergeCells('D3:D4');
        $objPHPExcel->getActiveSheet()->setCellValue('D3', 'Fecha');
        //Dandole formato 'center' a la palabra "Fecha"
        $this->fnAlinearTexto($objPHPExcel, 'D3', 'center', '', 0);
        //Dandole borders a la palabra "Fecha"
        $this->fnPintarBordes($objPHPExcel, 'D4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaD3D4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'D' . $columnaD3D4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaD3D4++;
        }
        //Concatenando desde E3 hasta E4 para escribir "Sueldos"
        $objPHPExcel->getActiveSheet()->mergeCells('E3:E4');
        $objPHPExcel->getActiveSheet()->setCellValue('E3', 'Sueldos');
        //Dandole formato 'center' a la palabra "Sueldos"
        $this->fnAlinearTexto($objPHPExcel, 'E3', 'center', '', 90);
        //Dandole borders a la palabra "Fecha"
        $this->fnPintarBordes($objPHPExcel, 'E4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaE3E4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'E' . $columnaE3E4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaE3E4++;
        }
        //Concatenando desde F3 hasta F4 para escribir "Jornales"
        $objPHPExcel->getActiveSheet()->mergeCells('F3:F4');
        $objPHPExcel->getActiveSheet()->setCellValue('F3', 'Jornales');
        //Dandole formato 'center' a la palabra "Jornales"
        $this->fnAlinearTexto($objPHPExcel, 'F3', 'center', '', 90);
        //Dandole borders a la palabra "Jornales"
        $this->fnPintarBordes($objPHPExcel, 'F4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaF3F4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'F' . $columnaF3F4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaF3F4++;
        }
        //Concatenando desde G3 hasta G4 para escribir "Vacaciones"
        $objPHPExcel->getActiveSheet()->mergeCells('G3:G4');
        $objPHPExcel->getActiveSheet()->setCellValue('G3', 'Vacaciones');
        //Dandole formato 'center' a la palabra "Vacaciones"
        $this->fnAlinearTexto($objPHPExcel, 'G3', 'center', '', 90);
        //Dandole borders a la palabra "Vacaciones"
        $this->fnPintarBordes($objPHPExcel, 'G4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaG3G4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'G' . $columnaG3G4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaG3G4++;
        }
        //Concatenando desde H3 hasta H4 para escribir "Licencias"
        $objPHPExcel->getActiveSheet()->mergeCells('H3:H4');
        $objPHPExcel->getActiveSheet()->setCellValue('H3', 'Licencias');
        //Dandole formato 'center' a la palabra "Licencias"
        $this->fnAlinearTexto($objPHPExcel, 'H3', 'center', '', 90);
        //Dandole borders a la palabra "Licencias"
        $this->fnPintarBordes($objPHPExcel, 'H4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaH3H4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'H' . $columnaH3H4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaH3H4++;
        }
        //Concatenando desde I3 hasta I4 para escribir "Subsidios"
        $objPHPExcel->getActiveSheet()->mergeCells('I3:I4');
        $objPHPExcel->getActiveSheet()->setCellValue('I3', 'Subsidios');
        //Dandole formato 'center' a la palabra "Subsidios"
        $this->fnAlinearTexto($objPHPExcel, 'I3', 'center', '', 90);
        //Dandole borders a la palabra "Subsidios"
        $this->fnPintarBordes($objPHPExcel, 'I4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $columnaI3I4 = 3;
        for ($i = 0; $i < 2; $i++) {
            $this->fnPintarBordes($objPHPExcel, 'I' . $columnaI3I4, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $columnaI3I4++;
        }
        //Escribiendo dd/mm/yy desde L4 hasta Q4 "
        $objPHPExcel->getActiveSheet()->setCellValue('L4', 'Día');
        $objPHPExcel->getActiveSheet()->setCellValue('M4', 'Mes');
        $objPHPExcel->getActiveSheet()->setCellValue('N4', 'Año');
        $objPHPExcel->getActiveSheet()->setCellValue('O4', 'Día');
        $objPHPExcel->getActiveSheet()->setCellValue('P4', 'Mes');
        $objPHPExcel->getActiveSheet()->setCellValue('Q4', 'Año');
        //Dandole formato 'center' a dd/mm/yy desde L4 hasta Q4
        $letrarecorrer = 12;
        for ($i = 0; $i < 5; $i++) {
            $letraconvertidarecorrer = chr($letrarecorrer + 64);
            $this->fnAlinearTexto($objPHPExcel, $letraconvertidarecorrer . '4', 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrer . '4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrer . '4', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrer . '4', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $letrarecorrer++;
        }
        $this->fnAlinearTexto($objPHPExcel, 'Q4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'Q4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'Q4', 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
        $this->fnPintarBordes($objPHPExcel, 'Q4', 'top', PHPExcel_Style_Border::BORDER_THIN);
        //Concatenando desde L3 hasta N3 para escribir "Desde"
        $objPHPExcel->getActiveSheet()->mergeCells('L3:N3');
        $objPHPExcel->getActiveSheet()->setCellValue('L3', 'Desde');
        //Dandole formato 'center' a la palabra "Desde"
        $this->fnAlinearTexto($objPHPExcel, 'L3', 'center', 'center', 0);
        //Dandole borders a la palabra "Desde"
        $letrarecorrerDesde = 12;
        for ($i = 0; $i < 3; $i++) {
            $letraconvertidarecorrerDesde = chr($letrarecorrerDesde + 64);
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrerDesde . '3', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $letrarecorrerDesde++;
        }
        //Concatenando desde O3 hasta Q3 para escribir "Hasta"
        $objPHPExcel->getActiveSheet()->mergeCells('O3:Q3');
        $objPHPExcel->getActiveSheet()->setCellValue('O3', 'Hasta');
        //Dandole formato 'center' a la palabra "Hasta"
        $this->fnAlinearTexto($objPHPExcel, 'O3', 'center', 'center', 0);
        //Dandole borders a la palabra "Hasta"
        $letrarecorrerHasta = 15;
        for ($i = 0; $i < 2; $i++) {
            $letraconvertidarecorrerHasta = chr($letrarecorrerHasta + 64);
            $this->fnPintarBordes($objPHPExcel, $letraconvertidarecorrerHasta . '3', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $letrarecorrerHasta++;
        }
        $this->fnPintarBordes($objPHPExcel, 'Q3', 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
        //Escribiendo el Nombre en A5
        $objPHPExcel->getActiveSheet()->setCellValue('A5', $objdatosperiodo['datosentidad'][0]['abreviatura']);
        //Escribiendo el Codigo en B5
        $objPHPExcel->getActiveSheet()->setCellValue('B5', $objdatosperiodo['datosentidad'][0]['codigo']);
        //Escribiendo el No. en C5
        $objPHPExcel->getActiveSheet()->setCellValue('C5', '');
        //Escribiendo la Fecha en D5
        $objPHPExcel->getActiveSheet()->setCellValue('D5', '');
        //Escribiendo el Sueldo en E5
        $objPHPExcel->getActiveSheet()->setCellValue('E5', '');
        //Escribiendo el Jornal en F5
        $objPHPExcel->getActiveSheet()->setCellValue('F5', '');
        //Escribiendo las Vacaciones en G5
        $objPHPExcel->getActiveSheet()->setCellValue('G5', '');
        //Escribiendo las Licencias en H5
        $objPHPExcel->getActiveSheet()->setCellValue('H5', '');
        //Escribiendo los Subsidios en I5
        $objPHPExcel->getActiveSheet()->setCellValue('I5', '');
        //Escribiendo el Nro de la nomina en J5
        $objPHPExcel->getActiveSheet()->setCellValue('J5', '');
        //Escribiendo el Nro de la hoja en K5
        $objPHPExcel->getActiveSheet()->setCellValue('K5', '');

        //Escribiendo el dia en L5
        $objPHPExcel->getActiveSheet()->setCellValue('L5', '' . $objdatosperiodo['fechainicioperiodo'][0]);
        //Escribiendo el mes en M5
        $objPHPExcel->getActiveSheet()->setCellValue('M5', '' . $objdatosperiodo['fechainicioperiodo'][1]);
        //Escribiendo el año en N5
        $objPHPExcel->getActiveSheet()->setCellValue('N5', '' . $objdatosperiodo['fechainicioperiodo'][2]);
        //Escribiendo el dia en O5
        $objPHPExcel->getActiveSheet()->setCellValue('O5', '' . $objdatosperiodo['fechafinperiodo'][0]);
        //Escribiendo el mes en P5
        $objPHPExcel->getActiveSheet()->setCellValue('P5', '' . $objdatosperiodo['fechafinperiodo'][1]);
        //Escribiendo el año en Q5
        $objPHPExcel->getActiveSheet()->setCellValue('Q5', '' . $objdatosperiodo['fechafinperiodo'][2]);
        for ($valcampos = 1; $valcampos <= 17; $valcampos++) {
            //Dandole formato 'center'
            $this->fnAlinearTexto($objPHPExcel, chr($valcampos + 64) . '5', 'center', 'center', 0);
            //Dandole borders
            $this->fnPintarBordes($objPHPExcel, chr($valcampos + 64) . '5', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, chr($valcampos + 64) . '5', 'left', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, chr($valcampos + 64) . '5', 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
        }
        $this->fnPintarBordes($objPHPExcel, 'Q5', 'right', PHPExcel_Style_Border::BORDER_MEDIUM);
        //Cambiandole la dimensión a las filas
        $objPHPExcel->getActiveSheet()->getRowDimension(3)->setRowHeight(40);
        $objPHPExcel->getActiveSheet()->getRowDimension(4)->setRowHeight(40);
        $objPHPExcel->getActiveSheet()->getRowDimension(6)->setRowHeight(40);
        $objPHPExcel->getActiveSheet()->getRowDimension(7)->setRowHeight(40);
        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(23);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(35);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(35);
    }

    public function fnPorCajaCajero(&$objPHPExcel, $id, $idestructura, $arrCentros, $arrcolumna, $arrcamposinvisibles, $objdatosperiodo, $cajacajero)
    {
        $objPHPExcel->createSheet($cajacajero);
        $objConfigEstModelNomina = new ConfigEstructurarModelosNomina();
        //Encabezado
        $this->fnPintarEncabezado($objPHPExcel, $id, $idestructura, $objdatosperiodo, ($cajacajero == 1) ? 'Por Caja' : 'Por Cajero', $cajacajero);

        //Pintando la denominacion de los campos y el campo firma
        $cantidadCamposString = 1;
        $letra = 1;
        $letrasconcat = 0;
        $arrayCampos = array();
        $cont = 0;
        foreach ($arrcolumna as $x => $camposnomina) {
            $cantidadCamposString += ($camposnomina['tipocampo'] == 1) ? 1 : 0;
            if ($camposnomina['tipocampo'] == 2 || $camposnomina['tipocampo'] == 3 || $camposnomina['tipocampo'] == 4) {
                $arrayCampos[$cont]['denominacion'] = $camposnomina['denominacion'];
                $cont++;
            }
            $valorletrasconcat = ($letrasconcat > 0) ? chr($letrasconcat + 64) : '';
            $letraconvertida = $valorletrasconcat . chr($letra + 64);
            //Concatenando 6 y 7 desde A hasta Q para escribir los campos
            $objPHPExcel->getActiveSheet()->mergeCells('' . $letraconvertida . '6:' . $letraconvertida . '7');
            $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . '6', $camposnomina['denominacion'] . '');
            //Dandole formato 'center'
            $this->fnAlinearTexto($objPHPExcel, $letraconvertida . '6', 'center', 'center', 0);
            //Dandole borders
            $this->fnPintarBordes($objPHPExcel, $letraconvertida . '6', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraconvertida . '6', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraconvertida . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraconvertida . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $letra++;
            if ($letra % 27 == 0) {
                $letrasconcat++;
                $letra = 1;
            }
        }
        if ($cajacajero == 1) {
            //Poniendo el campo de firma
            $letra1 = (intval((count($arrcolumna) + 1) / 26) > 0) ? chr(intval((count($arrcolumna) + 1) / 26) + 64) : '';
            $letra2 = chr(intval((count($arrcolumna) + 1) % 26) + 64);
            if ($letra2 == "@") {
                $letra2 = "A";
            }
            $objPHPExcel->getActiveSheet()->mergeCells($letra1 . $letra2 . '6:' . $letra1 . $letra2 . '7');
            $objPHPExcel->getActiveSheet()->setCellValue($letra1 . $letra2 . '6', 'Firma');
            //Dandole formato 'center'
            $this->fnAlinearTexto($objPHPExcel, $letra1 . $letra2 . '6', 'center', 'center', 0);
            //Dandole borders
            $this->fnPintarBordes($objPHPExcel, $letra1 . $letra2 . '6', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letra1 . $letra2 . '6', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letra1 . $letra2 . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letra1 . $letra2 . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        }

        //Código dinámico
        if (count($arrCentros) > 0) {
            $sum = 0;
            $numero = 8;
            $contador = 0;
            $arrfilassubtotales = array();
            if ($cajacajero == 1) {
                //Obteniendo el id del campo del importe para el desglose de billetes
                $idcampodevengar = $objConfigEstModelNomina->obtenerCampoADevengar($id, 1);
                //Variable para guardar la suma total del campo para el desglose de billetes y el array de cantidades de billetes por persona
                $importetotaldesglose = 0;
                $arrcantbilletesdesglose = array();
                $contdesglose = 0;
            }
            $objPHPExcel->getActiveSheet()->freezePane('A8');
            foreach ($arrCentros as $i => $centro) {
                //Concatenando para escribir el nombre de los centros
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':' . $letraconvertida . '' . $numero . '');
                $objPHPExcel->getActiveSheet()->setCellValue('A' . $numero . '', $centro->centro . '');
                //Dandole formato 'bold' a las divisiones
                $this->fnFuenteTexto($objPHPExcel, 'A' . $numero, 'Arial', 12);
                $numero++;
                $inicioceldaspersona = $numero;
                $contpersona = 0;
                foreach ($centro->personas as $j => $persona) { //CAJA - CAJERO
                    if ($cajacajero == 1) {
                        if (!empty($persona['c' . $idcampodevengar])) {
                            $arrcantbilletesdesglose [$contdesglose] = $this->fnDesgloseBilletes($persona['c' . $idcampodevengar]);
                            $importetotaldesglose += $persona['c' . $idcampodevengar];
                            $contdesglose++;
                        }
                    }
                    $temp = array();
                    foreach ($persona as $g => $k) {
                        array_push($temp, $k);
                    }
                    $sum += $temp[(count($temp) - 1)];

                    //Datos de las personas
                    foreach ($arrcolumna as $columna) {
                        //Escribiendo los datos de la persona
                        $objPHPExcel->getActiveSheet()->setCellValue($columna['celda'] . '' . $numero . '', $persona[$columna['indice']] . '');
                        ($columna['tipocampo'] != 1) ? $this->fnFormatoNumeros($objPHPExcel, $columna['celda'] . $numero) : '';
                        ($columna['escampopersona'] == 'numidentidad') ? $this->fnAlinearTexto($objPHPExcel, $columna['celda'] . '' . $numero, 'center', '', 0) : '';
                        ($columna['escampopersona'] == 'nombreapellidos') ? $this->fnAlinearTexto($objPHPExcel, $columna['celda'] . '' . $numero, 'left', '', 0) : '';
                    }

                    $numero++;
                    $contpersona++;
                }
                $numerocelda = $inicioceldaspersona + $contpersona;
                $numeroceldaparasuma = $numerocelda - 1;
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numerocelda . ':' . chr($cantidadCamposString - 1 + 64) . $numerocelda . '');
                $objPHPExcel->getActiveSheet()->setCellValue('A' . $numerocelda . '', 'Sub Total');
                //Dandole formato 'bold' a la palabra "Sub Total"
                $this->fnFuenteTexto($objPHPExcel, 'A' . $numerocelda, 'Arial');
                //Dandole formato 'center' a la palabra "Sub Total"
                $this->fnAlinearTexto($objPHPExcel, 'A' . $numerocelda, 'center', '', 0);
                //Dandole borders
                $letra = $cantidadCamposString;
                $letrasconcat = 0;
                foreach ($arrcolumna as $columna) {
                    if ($columna['tipocampo'] != 1) {
                        $valorletrasconcat = ($letrasconcat > 0) ? chr($letrasconcat + 64) : '';
                        $letraactual = $valorletrasconcat . chr($letra + 64);
                        $this->fnFuenteTexto($objPHPExcel, $letraactual . $numero, 'Arial');
                        $this->fnFormatoNumeros($objPHPExcel, $letraactual . $numero);
                        $letra++;
                        if ($letra % 27 == 0) {
                            $letrasconcat++;
                            $letra = 1;
                        }
                    }
                }

                //Subtotales
                $letra = $cantidadCamposString;
                $letrasconcat = 0;
                foreach ($arrcolumna as $columna) {
                    if ($columna['tipocampo'] != 1) {
                        $valorletrasconcat = ($letrasconcat > 0) ? chr($letrasconcat + 64) : '';
                        $possumatotal = $valorletrasconcat . chr($letra + 64);
                        $objPHPExcel->getActiveSheet()->setCellValue($possumatotal . $numero . '', '=SUM(' . $possumatotal . '' . $inicioceldaspersona . ':' . $possumatotal . '' . $numeroceldaparasuma . ')');
                        $letra++;
                        if ($letra % 27 == 0) {
                            $letrasconcat++;
                            $letra = 1;
                        }
                    }
                }
                $arrfilassubtotales[$contador] = $numero;
                $contador++;
                $numero++;
            }

            // Aqui va el codigo para calcular el subtotal general haciendo uso de @$arrfilassubtotales: Arreglo con los
            // numeros de las filas donde se encuentran los subtotales por centros de costo
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':' . chr(($cantidadCamposString - 1) + 64) . $numero . '');
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $numero . '', 'Total General');
            //Dandole formato 'center' a la palabra Total General
            $this->fnAlinearTexto($objPHPExcel, 'A' . $numero, 'center', '', 0);
            //Dandole formato 'bold' a la palabra Total General
            $this->fnFuenteTexto($objPHPExcel, 'A' . $numero, 'Arial');
            $valormonetario = 0;
            $cont = 0;
            $letra = $cantidadCamposString;
            $letrasconcat = 0;
            foreach ($arrcolumna as $columna) {
                if ($columna['tipocampo'] != 1) {
                    $valorletrasconcat = ($letrasconcat > 0) ? chr($letrasconcat + 64) : '';
                    $letraacumulada = $valorletrasconcat . chr($letra + 64);
                    for ($y = 0; $y < count($arrfilassubtotales); $y++) {
                        $posicion = $arrfilassubtotales[$y];
                        $valormonetario += $objPHPExcel->getActiveSheet()->getCell($letraacumulada . '' . $posicion)->getCalculatedValue();
                    }
                    //Acumulando los subtotales generales por campo, para luego pintar el cuadro Resumen
                    $arrayCampos[$cont]['subtotal'] = $valormonetario;
                    $cont++;

                    $objPHPExcel->getActiveSheet()->setCellValue($letraacumulada . '' . $numero . '', '' . $valormonetario);
                    //Dandole bold al Total General
                    //Dandole formato 'bold' a la palabra Total General
                    $this->fnFuenteTexto($objPHPExcel, $letraacumulada . '' . $numero, 'Arial');
                    $this->fnFormatoNumeros($objPHPExcel, $letraacumulada . $numero);
                    $valormonetario = 0;
                    $letra++;
                    if ($letra % 27 == 0) {
                        $letrasconcat++;
                        $letra = 1;
                    }
                }
            }
        }
    }

    public function exportarNomina($identidad, $id, $formato, $tipovisualizacion, $estado, $cajacajero, $arrdatos = null)
    {
        $r = null;
        $arrcolumna = array();
        $idestructura = 0;
        /* FORMATO Exel */
        if ($formato == "Exel") {
            $objPHPExcel = new PHPExcel();
            $objNomina = new DatNomina();
            $objDatosNominas = new DatNominaDatos();
            $objPlantillaNominal = new ConfPlantillaNominal();

            $arrDatosNominas = ($estado == 0) ? $arrdatos :
                $objDatosNominas->obtenerDatosNominaPlantillaPorElaborarPagoPDF($id);

            //Caja o Cajero
            if ($cajacajero != 0) {//Especificamente Caja o Cajero
                $arrDatosNominasAux = array();
                foreach ($arrDatosNominas as $nomina) {
                    if ($nomina['cajacajero'] == $cajacajero) {
                        $arrDatosNominasAux[] = $nomina;
                    }
                }
                $arrDatosNominas = array_values($arrDatosNominasAux);
            }

            //Encabezado
            $idnomina = $arrDatosNominas[0]['idnomina'];
            $datosnomina = $objNomina->obtenerObj($idnomina);
            $datelaborarpago = Doctrine::getTable('DatElaborarPagos')->find($datosnomina->idelaborarpago);
            $nomtipopago = Doctrine::getTable('NomTipoPago')->find($datelaborarpago->idtipopago);
            $clasificacionpago = $nomtipopago->clasificacionpago;
            $objdatosperiodo['clasificacionpago'] = $clasificacionpago;
            $objdatosperiodo['fechainicioperiodo'] = explode('/', $datelaborarpago->fechainicioperiodo);
            $objdatosperiodo['fechafinperiodo'] = explode('/', $datelaborarpago->fechafinperiodo);
            $objdatosperiodo['fechapago'] = explode('/', $datelaborarpago->fechapago);
            $objdatosperiodo['datosentidad'] = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);

            $this->fnPintarEncabezado($objPHPExcel, $id, $idestructura, $objdatosperiodo, 'General', 0);

            //Carga de datos de personas
            if (count($arrDatosNominas) > 0) {
                $arrCentros = array();
                $arrcentroscaja = array();
                $arrcentroscajero = array();
                foreach ($arrDatosNominas as $k => $v) {
                    $denominacionplantilla = $objPlantillaNominal->obtenerDenomXId($v['idplantillanominal']);
                    $arrValores = unserialize($v['valores']);
                    $arrcolumnaaux = unserialize($v['campos']);

                    //Definiendo para cada persona el tipo de pago, por CAJA o CAJERO
                    foreach ($arrValores as $i => $valores) {
                        $arrValores[$i]['cajacajero'] = $v['cajacajero'];
                    }

                    //Reestructuración del array $arrcolumna*********************
                    $objConfigEstModelNomina = new ConfigEstructurarModelosNomina();
                    $contCol = 0;
                    $arrcolumna = array();
                    $contCampInv = 0;
                    $arrcamposinvisibles = array();
                    //$campo = ($estado != 1) ? 'visiblereporteprenomina' : 'visiblereportenomina';
                    $campo = ($estado == 1) ? 'sc_4_06' : 'sc_4_01';
                    foreach ($arrcolumnaaux as $c => $col) {
                        if ($c < count($arrcolumnaaux) - 1) {
                            $idestructuramodelnom = substr($col['indice'], 1, strlen($col['indice']) - 1);
                            if ($idestructuramodelnom) {
                                $arr = $objConfigEstModelNomina->obtenerDatosEstNominaxIdEstModeloNomina($idestructuramodelnom);
                                if ($arr[0][$campo] == 1) {
                                    $arrcolumna[$contCol]['indice'] = $col['indice'];
                                    $arrcolumna[$contCol]['denominacion'] = $col['denominacion'];
                                    $arrcolumna[$contCol]['tipocampo'] = $col['tipocampo'];
                                    $arrcolumna[$contCol]['orden'] = $col['orden'];
                                    $arrcolumna[$contCol]['visible'] = $col['visible'];
                                    $arrcolumna[$contCol]['total'] = $col['total'];
                                    $arrcolumna[$contCol]['escampopersona'] = $arr[0]['escampopersona'];
                                    $contCol++;
                                } else {
                                    $arrcamposinvisibles[$contCampInv] = $col['indice'];
                                    $contCampInv++;
                                }
                            }
                        }
                    }
                    $arrIdsPersonas = array();
                    $arrIdsCargosOcup = array();
                    foreach ($arrValores as $i => $p) {
                        $a = explode('-', $p['id']);
                        $arrIdsPersonas[] = $a[0];
                        $arrIdsCargosOcup[] = $a[1];
                    }
                    //Busco las vacaciones de las personas
                    $sqlVac = "select dvp.idpersona, hvp.tiempoacumulado, hvp.importeacumulado  from mod_nomina.dat_vacacionespersona dvp
										left join mod_nomina.his_vacacionespersona hvp on (hvp.idvacacionespersona = dvp.idvacacionespersona)
										where hvp.idnomina = ? and (dvp.fechafin is null or dvp.fechafin >= now()) and dvp.idpersona in (" . implode(',', $arrIdsPersonas) . ");";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    $arrVacPersonas = $conn->fetchAll($sqlVac, array($v['idnomina']));
                    //Incluyo las vacaciones de la persona
                    foreach ($arrValores as $i => $p) {
                        $a = explode('-', $p['id']);
                        $tiene = 2;
                        foreach ($arrVacPersonas as $j => $vac) {
                            if ($a[0] == $vac['idpersona']) {
                                $tiene = 1;
                                break;
                            }
                        }
                        if ($tiene == 2) {
                        }
                    }
                    //Busco los cargos que tienen las personas
                    $sqlCargos = "select idpersona||'-'||idcargosocupados as id, idcargo from mod_nomina.dat_cargosocupados
                                 where idcargosocupados in (" . implode(',', $arrIdsCargosOcup) . ");";
                    $arrCargosPersonas = $conn->fetchAll($sqlCargos);

                    $contadorpersona = 0;
                    //foreach ($arrCargosPersonas as $j => $carPer) {
                    foreach ($arrValores as $i => $p) {
                        $contadorpersona++;
                        // if ($carPer['id'] == $p['id'] /*&& !empty($carPer['idcargo'])*/) {
                        $arrCentros[$v['idplantillanominal']]->centro = $denominacionplantilla;
                        $arrCentros[$v['idplantillanominal']]->personas[] = $p;
                        // }
                    }
                    //}
                }
            }

            //Pintando la denominacion de los campos
            $cantidadCamposString = 1;
            $letra = 1;
            $letrasconcat = 0;
            $letraconvertida = "";
            $arrayCampos = array();
            $cont = 0;
            foreach ($arrcolumna as $x => $camposnomina) {
                $cantidadCamposString += ($camposnomina['tipocampo'] == 1) ? 1 : 0;
                if ($camposnomina['tipocampo'] == 2 || $camposnomina['tipocampo'] == 3 || $camposnomina['tipocampo'] == 4) {
                    $arrayCampos[$cont]['denominacion'] = $camposnomina['denominacion'];
                    $cont++;
                }
                $valorletrasconcat = ($letrasconcat > 0) ? chr($letrasconcat + 64) : '';
                $letraconvertida = $valorletrasconcat . chr($letra + 64);
                $arrcolumna[$x]['celda'] = $letraconvertida;
                //Concatenando 6 y 7 desde A - Cantidad campos para escribir los campos
                $objPHPExcel->getActiveSheet()->mergeCells($letraconvertida . '6:' . $letraconvertida . '7');
                $objPHPExcel->getActiveSheet()->setCellValue($letraconvertida . '6', $camposnomina['denominacion'] . '');
                //Dandole formato 'center'
                $this->fnAlinearTexto($objPHPExcel, $letraconvertida . '6', 'center', 'center', 0);
                //Dandole borders
                $this->fnPintarBordes($objPHPExcel, $letraconvertida . '6', 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraconvertida . '6', 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraconvertida . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraconvertida . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $letra++;
                //$letrasconcat = (intval($letra / 27) > 0) ? chr(intval($letra / 27) + 64) . '' : '';
                if ($letra % 27 == 0) {
                    $letrasconcat++;
                    $letra = 1;
                }
            }
            //Código dinámico
            if (count($arrDatosNominas) > 0) {
                $sum = 0;
                $numero = 8;
                $contador = 0;
                $arrfilassubtotales = array();
                $objPHPExcel->getActiveSheet()->freezePane('A8');
                foreach ($arrCentros as $i => $centro) {
                    //Concatenando para escribir el nombre de los centros
                    $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':' . $letraconvertida . '' . $numero . '');
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . $numero . '', $centro->centro . '');
                    //Dandole formato 'bold' a las divisiones
                    $this->fnFuenteTexto($objPHPExcel, 'A' . $numero, 'Arial', 12);
                    $numero++;
                    $inicioceldaspersona = $numero;
                    $contpersona = 0;
                    foreach ($centro->personas as $j => $persona) { //GENERAL
                        //Creando los arreglos para CAJA y CAJERO con los datos de las personas
                        if ($persona['cajacajero'] == 1) {
                            $arrcentroscaja[$i]->centro = $centro->centro;
                            $arrcentroscaja[$i]->personas[] = $persona;
                        } elseif ($persona['cajacajero'] == 2) {
                            $arrcentroscajero[$i]->centro = $centro->centro;
                            $arrcentroscajero[$i]->personas[] = $persona;
                        }

                        $temp = array();
                        foreach ($persona as $g => $k) {
                            array_push($temp, $k);
                        }
                        $sum += $temp[(count($temp) - 1)];
                        //Datos de las personas
                        foreach ($arrcolumna as $columna) {
                            //Escribiendo los datos de la persona
                            $objPHPExcel->getActiveSheet()->setCellValue($columna['celda'] . '' . $numero . '', $persona[$columna['indice']] . '');
                            ($columna['tipocampo'] != 1) ? $this->fnFormatoNumeros($objPHPExcel, $columna['celda'] . $numero) : '';
                            ($columna['escampopersona'] == 'numidentidad') ? $this->fnAlinearTexto($objPHPExcel, $columna['celda'] . '' . $numero, 'center', '', 0) : '';
                            ($columna['escampopersona'] == 'nombreapellidos') ? $this->fnAlinearTexto($objPHPExcel, $columna['celda'] . '' . $numero, 'left', '', 0) : '';
                        }
                        $numero++;
                        $contpersona++;
                    }
                    $numerocelda = $inicioceldaspersona + $contpersona;
                    $numeroceldaparasuma = $numerocelda - 1;
                    $objPHPExcel->getActiveSheet()->mergeCells('A' . $numerocelda . ':' . chr($cantidadCamposString - 1 + 64) . $numerocelda . '');
                    $objPHPExcel->getActiveSheet()->setCellValue('A' . $numerocelda . '', 'Sub Total');
                    //Dandole formato 'bold' a la palabra "Sub Total"
                    $this->fnFuenteTexto($objPHPExcel, 'A' . $numerocelda, 'Arial');
                    //Dandole formato 'center' a la palabra "Sub Total"
                    $this->fnAlinearTexto($objPHPExcel, 'A' . $numerocelda, 'center', '', 0);
                    //Dandole borders
                    $letra = $cantidadCamposString;
                    $letrasconcat = 0;
                    foreach ($arrcolumna as $columna) {
                        if ($columna['tipocampo'] != 1) {
                            $valorletrasconcat = ($letrasconcat > 0) ? chr($letrasconcat + 64) : '';
                            $letraactual = $valorletrasconcat . chr($letra + 64);
                            //$letraactual = ($g < 27) ? chr($g + 64) : 'A' . chr($g + 38);
                            //$this->fnPintarBordes($objPHPExcel, $letraactual . $numero, 'right', PHPExcel_Style_Border::BORDER_THIN);
                            $this->fnFuenteTexto($objPHPExcel, $letraactual . $numero, 'Arial');
                            $this->fnFormatoNumeros($objPHPExcel, $letraactual . $numero);
                            $letra++;
                            if ($letra % 27 == 0) {
                                $letrasconcat++;
                                $letra = 1;
                            }
                        }
                    }

                    //Subtotales
                    $letra = $cantidadCamposString;
                    $letrasconcat = 0;
                    foreach ($arrcolumna as $columna) {
                        if ($columna['tipocampo'] != 1) {
                            $valorletrasconcat = ($letrasconcat > 0) ? chr($letrasconcat + 64) : '';
                            $possumatotal = $valorletrasconcat . chr($letra + 64);
                            $objPHPExcel->getActiveSheet()->setCellValue($possumatotal . $numero . '', '=SUM(' . $possumatotal . '' . $inicioceldaspersona . ':' . $possumatotal . '' . $numeroceldaparasuma . ')');
                            $letra++;
                            if ($letra % 27 == 0) {
                                $letrasconcat++;
                                $letra = 1;
                            }
                        }
                    }
                    $arrfilassubtotales[$contador] = $numero;
                    $contador++;
                    $numero++;
                }
                // Aqui va el codigo para calcular el subtotal general haciendo uso de @$arrfilassubtotales: Arreglo con los
                // numeros de las filas donde se encuentran los subtotales por centros de costo
                $objPHPExcel->getActiveSheet()->setCellValue('A' . $numero, 'Total General');
                $objPHPExcel->getActiveSheet()->mergeCells('A' . $numero . ':' . chr(($cantidadCamposString - 1) + 64) . $numero . '');
                //Dandole formato 'center' a la palabra Total General
                $this->fnAlinearTexto($objPHPExcel, 'A' . $numero, 'center', '', 0);
                //Dandole formato 'bold' a la palabra Total General
                $this->fnFuenteTexto($objPHPExcel, 'A' . $numero, 'Arial');
                $valormonetario = 0;
                $cont = 0;
                $letra = $cantidadCamposString;
                $letrasconcat = 0;
                foreach ($arrcolumna as $columna) {
                    if ($columna['tipocampo'] != 1) {
                        $valorletrasconcat = ($letrasconcat > 0) ? chr($letrasconcat + 64) : '';
                        $letraacumulada = $valorletrasconcat . chr($letra + 64);
                        //$letraacumulada = ($t < 27) ? chr($t + 64) : 'A' . chr($t + 38);
                        for ($y = 0; $y < count($arrfilassubtotales); $y++) {
                            $posicion = $arrfilassubtotales[$y];
                            $valormonetario += $objPHPExcel->getActiveSheet()->getCell($letraacumulada . '' . $posicion)->getCalculatedValue();
                        }
                        //Acumulando los subtotales generales por campo, para luego pintar el cuadro Resumen
                        $arrayCampos[$cont]['subtotal'] = $valormonetario;
                        $cont++;

                        //Pintando los valores de los subtotales generales por campos
                        $objPHPExcel->getActiveSheet()->setCellValue($letraacumulada . '' . $numero . '', '' . $valormonetario);
                        //Dandole bold al Total General
                        //Dandole formato 'bold' a la palabra Total General
                        $this->fnFuenteTexto($objPHPExcel, $letraacumulada . '' . $numero, 'Arial');
                        $this->fnFormatoNumeros($objPHPExcel, $letraacumulada . $numero);
                        $valormonetario = 0;
                        $letra++;
                        if ($letra % 27 == 0) {
                            $letrasconcat++;
                            $letra = 1;
                        }
                    }
                }

                //Resumen de subtotales
                //$this->fnPintarResumen($objPHPExcel, ($numero + 3), $arrayCampos);
                //FIN DE NOMINA GENERAL ********************************************************

                //print_r($arrcentroscaja);die;
                //NOMINA POR CAJA ********************************************************
                $this->fnPorCajaCajero($objPHPExcel, $id, $idestructura, $arrcentroscaja, $arrcolumna, $arrcamposinvisibles, $objdatosperiodo, 1);

                //NOMINA POR CAJERO ********************************************************
                $this->fnPorCajaCajero($objPHPExcel, $id, $idestructura, $arrcentroscajero, $arrcolumna, $arrcamposinvisibles, $objdatosperiodo, 2);
            }

            //TERMINACION DEL EXCEL*********************************************************
            $objPHPExcel->setActiveSheetIndex(0);
            ob_end_clean();
            //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
            //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment;filename="Nómina.xls" ');
            header('Cache-Control: max-age=0');
            header('Pragma: no-cache');
            header('Expires: 0');

            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            ob_end_clean();
            echo($objWriter->save('php://output'));

            $objPHPExcel->disconnectWorksheets();
            unset($objPHPExcel);
        } else if ($formato == "Pdf") { /* FORMATO PDF */
            if ($estado == 0) {
                $arrDatosNominas = $arrdatos;
            } else {
                $objDatosNominas = new DatNominaDatos();
                $arrDatosNominas = $objDatosNominas->obtenerDatosNominaPlantillaPorElaborarPagoPDF($id);
            }

            //Caja o Cajero
            if ($cajacajero != 0) {//Especificamente Caja o Cajero
                $arrDatosNominasAux = array();
                foreach ($arrDatosNominas as $nomina) {
                    if ($nomina['cajacajero'] == $cajacajero) {
                        $arrDatosNominasAux[] = $nomina;
                    }
                }
                $arrDatosNominas = array_values($arrDatosNominasAux);
            }

            $objReportePDF = new ReportepdfModel();
            $objReportePDF->CrearReportePDF($identidad, $tipovisualizacion, $arrDatosNominas, $estado);
        }
        echo json_encode($r);
    }

    public function exportarCamposEspecificos($identidad, $id, $campos)
    {

        $objPHPExcel = new PHPExcel();
        $objNomina = new DatNomina();
        $objDatosNominas = new DatNominaDatos();
        $arrDatosNominas = $objDatosNominas->obtenerDatosNominaPlantillaPorElaborarPago($id);

        //Encabezado
        $idnomina = $arrDatosNominas[0]['idnomina'];
        $datosnomina = $objNomina->obtenerObj($idnomina);
        $datelaborarpago = Doctrine::getTable('DatElaborarPagos')->find($datosnomina->idelaborarpago);
        $nomtipopago = Doctrine::getTable('NomTipoPago')->find($datelaborarpago->idtipopago);
        $clasificacionpago = $nomtipopago->clasificacionpago;
        $objdatosperiodo['clasificacionpago'] = $clasificacionpago;
        $objdatosperiodo['fechainicioperiodo'] = explode('/', $datelaborarpago->fechainicioperiodo);
        $objdatosperiodo['fechafinperiodo'] = explode('/', $datelaborarpago->fechafinperiodo);
        $objdatosperiodo['fechapago'] = explode('/', $datelaborarpago->fechapago);
        $objdatosperiodo['datosentidad'] = HisRetencionesPersona::obtenerDatosEntidadDadoId($identidad);

        //Carga de datos de personas
        $arrPersonas = array();
        $arrcolumna = array();
        if (count($arrDatosNominas) > 0) {
            foreach ($arrDatosNominas as $k => $v) {
                $arrValores = unserialize($v['valores']);
                $arrcampos = unserialize($v['campos']);
                $arrcampos = $this->indexarArreglo($arrcampos, 'indice');

                //Reestructuración de las columnas
                foreach ($campos as $camp) {
                    $arrcolumna[$camp['idcampo']]['indice'] = $camp['idcampo'];
                    $arrcolumna[$camp['idcampo']]['denominacion'] = $arrcampos['c' . $camp['idcampo']]['denominacion'];
                    $arrcolumna[$camp['idcampo']]['orden'] = $arrcampos['c' . $camp['idcampo']]['orden'];
                    $arrcolumna[$camp['idcampo']]['tipocampo'] = $arrcampos['c' . $camp['idcampo']]['tipocampo'];
                }
                //Ordenar el arreglo de columnas por orden
                $arrcolumna = $this->ordenarArrayPorClave($arrcolumna, 'orden');
                $arrcolumna = $this->indexarArreglo($arrcolumna, 'indice');

                //Carga de datos personas
                foreach ($arrValores as $i => $p) {
                    foreach ($arrcolumna as $c => $col) {
                        $arrPersonas[$p['id']][$c] = $p['c' . $c];
                    }
                }
            }
        }

        //Pintando la denominacion de los campos
        $cantidadCamposString = 0;
        $letra = 1;
        foreach ($arrcolumna as $x => $camposnomina) {
            $cantidadCamposString += ($camposnomina['tipocampo'] == 1) ? 1 : 0;
            $letraconvertida = $this->convertirIndiceAColumna($letra);
            $this->fnPintarCelda($objPHPExcel, $letraconvertida, 1, $camposnomina['denominacion'], 't,r,b,l', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $this->fnPintarComentarioCeldaExcel($objPHPExcel, $letraconvertida . '1', 'XETID', 'Descripción: ', $camposnomina['denominacion']);
            $letra++;
        }
        //Pintando el valor de cada campo para cada persona
        if (count($arrDatosNominas) > 0) {
            $numero = 2;
            foreach ($arrPersonas as $p => $persona) {
                $letra = 1;
                foreach ($persona as $c => $valor) {
                    $letraconvertida = $this->convertirIndiceAColumna($letra);
                    $objPHPExcel->getActiveSheet()->getRowDimension($numero)->setRowHeight(30);
                    $this->fnPintarCelda($objPHPExcel, $letraconvertida, $numero, $valor, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                    if ($letra >= $cantidadCamposString) {
                        $this->fnFormatoNumeros($objPHPExcel, $letraconvertida . $numero);
                    }
                    $letra++;
                }
                $numero++;
            }
        }

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Campos de la Nómina.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        //$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    public function indexarArreglo($array, $indice)
    {
        $arrayfinal = array();
        foreach ($array as $i => $r) {
            $arrayfinal[$r[$indice . '']] = $r;
            //$array[$r[$indice]] = $r;
            //unset($array[$i]);
        }
        return $arrayfinal;
    }

    public function exportarXMLContabilizacionSABIC($idelaborarpago, $idtipopago, $identidad, $crc)
    {
        $obj = new ReporteXMLContabilidad();
        $xml = $obj->fnCrearXML($idelaborarpago, $idtipopago, $identidad, $crc);
        return $xml;
    }
	
	public function exportarDBFContabilizacionSABIC($idelaborarpago, $idtipopago, $identidad)
    {$texto = 'Contribución';
        //Obteniendo los datos del comprobante guardado
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
		$sqlComprobante = "SELECT * FROM mod_nomina.dat_comprobantenomina WHERE idelaborarpagos = ?;";
        $arrComprobanteNomina = $conn->fetchAll($sqlComprobante, array($idelaborarpago));
		//Campos del DBF
		$arraycamposdbf[0] = ['CTA', C, 50];
		$arraycamposdbf[1] = ['DEBE', N, 16, 2];
		$arraycamposdbf[2] = ['HABER', N, 16, 2];
		$arraycamposdbf[3] = ['DESCRIPCION', C, 255];
		$db = XBaseWritableTable::create("contabilizacion.dbf", $arraycamposdbf);$cont = 0;
        //Recorriendo los datos del Comprobante para pintar en el DBF las cuentas Deudoras
        foreach($arrComprobanteNomina as $rcomp){
            if($rcomp['debitocredito'] == 0){
                $rec = $db->appendRecord();
                foreach ($arraycamposdbf as $campo){
                    $denomcampo = $campo[0];
                    //Cuentas Deudoras
                    switch ($denomcampo) {
                        case  'CTA':
                            $rec->setObjectByName($denomcampo, $rcomp['concatcta']);
                            break;
                        case  'DEBE':
                            $rec->setObjectByName($denomcampo, $rcomp['importe']);
                            break;
                        case  'HABER':
                            $rec->setObjectByName($denomcampo, '');
                            break;
                        case  'DESCRIPCION':
                            $rec->setObjectByName($denomcampo, $this->quitar_tildes($rcomp['denomcuenta']));
                            break;
                    }
                }
                $db->writeRecord();
            }

        }
        //Recorriendo los datos del Comprobante para pintar en el DBF las cuentas acreedoras
        foreach($arrComprobanteNomina as $rcomp){
            //Cuentas Acreedoras
            if($rcomp['debitocredito'] == 1){
                $rec = $db->appendRecord();
                foreach ($arraycamposdbf as $campo){
                    $denomcampo = $campo[0];
                    //Cuentas Deudoras
                    switch ($denomcampo) {
                        case  'CTA':
                            $rec->setObjectByName($denomcampo, $rcomp['concatcta']);
                            break;
                        case  'DEBE':
                            $rec->setObjectByName($denomcampo, '');
                            break;
                        case  'HABER':
                            $rec->setObjectByName($denomcampo, $rcomp['importe']);
                            break;
                        case  'DESCRIPCION':
                            $rec->setObjectByName($denomcampo, $this->quitar_tildes($rcomp['denomcuenta']));
                            break;
                    }
                }
                $db->writeRecord();
            }
        }
        $db->close();
        $s->codigo = 'OK';
        $s->url = "/pvd/nomina/contabilizacion.dbf";
        return $s;
    }

    function quitar_tildes($cadena) {
		$no_permitidas= array ("á","é","í","ó","ú","Á","É","Í","Ó","Ú","ñ","À","Ã","Ì","Ò","Ù","Ã™","Ã ","Ã¨","Ã¬","Ã²","Ã¹","ç","Ç","Ã¢","ê","Ã®","Ã´","Ã»","Ã‚","ÃŠ","ÃŽ","Ã”","Ã›","ü","Ã¶","Ã–","Ã¯","Ã¤","«","Ò","Ã","Ã„","Ã‹");
		$permitidas= array ("a","e","i","o","u","A","E","I","O","U","n","N","A","E","I","O","U","a","e","i","o","u","c","C","a","e","i","o","u","A","E","I","O","U","u","o","O","i","a","e","U","I","A","E");
		$texto = str_replace($no_permitidas, $permitidas ,$cadena);
		return $texto;
}

    public function fnObtenerPersonasSinCorreo($idelaborarpagos)
    {
        $idelaborarpagos = is_array($idelaborarpagos) ? implode(',', $idelaborarpagos) : $idelaborarpagos;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT dp.idpersona
            FROM mod_persona.dat_persona dp
            left join mod_persona.dat_contacto dc on (dc.idpersona = dp.idpersona and dc.idtipomediocontacto = 2)
            inner join mod_nomina.dat_personaselaborarpagos dpep ON (dpep.idpersona = dp.idpersona)
            where dpep.idelaborarpagos IN ({$idelaborarpagos}) and dpep.excluido = 0 and dc.idcontacto is null;";
        return $conn->fetchAll($sql);
    }

    public function fnPintarComentarioCeldaExcel(&$objPHPExcel, $celda, $autor, $textotitulo, $textocomentario)
    {
        $objPHPExcel->getActiveSheet()
            ->getComment($celda)//'A1'
            ->setAuthor($autor);//Pepe
        $objCommentRichText = $objPHPExcel->getActiveSheet()
            ->getComment($celda)//'A1'
            ->getText()->createTextRun($textotitulo);//'Descripción: '
        $objCommentRichText->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()
            ->getComment($celda)//'A1'
            ->getText()->createTextRun("\n");
        $objPHPExcel->getActiveSheet()
            ->getComment($celda)//'A1'
            ->getText()->createTextRun($textocomentario);//'Campos especificos de la nómina'
    }

}