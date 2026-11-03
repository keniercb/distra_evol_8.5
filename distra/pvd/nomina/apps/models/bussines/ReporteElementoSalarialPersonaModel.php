<?php
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

    function __construct($arrayDatos = array(), $arrayEncabezado = array(), $orientation = 'L', $unit = 'mm', $format = 'A4')
    {
      parent::fpdf($orientation, $unit, $format);
      $this->arrayDatos               = $arrayDatos;
      $this->arrayEncabezado          = $arrayEncabezado;
      $this->tamannoLetraContenido    = 10;
      $this->tamannoLetraEncabezado   = 12;
      $this->ajusteancho              = 0;
      $this->ajustepos                = 0;
      $this->anchoTabla               = 0;
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
      $datospiepagina     = $this->fnGetDatosPiePagina();
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
        $posCelda   = $this->arrayposicionencabezados[$clave] + $posmediotabla;
        $this->pintarCelda($texto, $anchoCelda, $posCelda, 'L', true, 0, 0, 200);
      }
      $this->SetFont('Arial', '', $this->tamannoLetraContenido);
      $this->Ln();

    }

    public function establecerLogo()
    {
      //Logo
      /*$register  = Zend_Registry::getInstance();
      $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
      $this->Image($direccion, 5, 5, 22, 10);*/
      $this->Ln();
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
      $cant          = count(array_keys($this->arrayEncabezado));
      // print_r($cant);die;
      $datos     = $this->arrayDatos;
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
            $posCelda   = $this->arrayposicionencabezados[$i] + $posmediotabla;
            $this->pintarCelda($texto, $anchoCelda, $posCelda, 'L', false, 0, 1);
            $i++;

          }

        }

        $this->Ln();

        $copiaagrupador = $valor[$agrupador];
      }
    }

    public function pintarContenidoModo2($arrayHomologo)
    {
      $posmediotabla = ($this->ancho - $this->anchoTabla) / 2;
      $cant          = count(array_keys($this->arrayEncabezado));
      // print_r($cant);die;
      $datos     = $this->arrayDatos;
      $agrupador = $this->dameAgrupador();

      $copiaagrupador = $datos[0][$agrupador];

      $this->pintarEncabezado();

      $this->pintarCelda($this->arrayDatos[0][$agrupador], $this->anchoTabla, $posmediotabla + 1, 'C', false, 1, 0, 240);

      foreach ($datos as $clave => $valor) {
        // print_r($arrayHomologo[$clave]);die;
        if ($valor[$agrupador] != $copiaagrupador) {
          $this->pintarCelda($valor[$agrupador], $this->anchoTabla, $posmediotabla + 1, 'C', false, 1, 0, 240);
        }
        $i = 0;
        foreach ($valor as $c => $texto) {
          if ($i == $cant) {
            //print_r($arrayHomologo[$clave]['elementonuevo']);die;
            $this->pintarCelda("Conceptos con escalas configuradas", $this->anchoTabla, $posmediotabla+1, 'L', false, 1, 1,234);
            foreach($arrayHomologo[$clave]['elementonuevo'] as $elemento){
              $this->pintarCelda($elemento, $this->anchoTabla, $posmediotabla+1, 'L', false, 1, 1);
            }
            //continue;
          } else {

            $anchoCelda = $this->arraytamannosencabezados[$i];
            $posCelda   = $this->arrayposicionencabezados[$i] + $posmediotabla;
            if ($i == $cant-1) {
              $this->pintarCelda($texto, $anchoCelda, $posCelda, 'L', false, 1, 1);
            }else{
              $this->pintarCelda($texto, $anchoCelda, $posCelda, 'L', false, 0, 1);
            }
            $i++;

          }

        }

        $this->Ln();

        $copiaagrupador = $valor[$agrupador];
      }
    }

    private function guardarAnchosColumnas()
    {
      $pos         = 1;
      $clavesDatos = array_keys($this->arrayDatos[0]);
      $cant        = count(array_keys($this->arrayEncabezado));
      // print_r($cant);die;

      foreach ($this->arrayEncabezado as $clave => $valor) {
        $this->SetFont('Arial', 'B', $this->tamannoLetraEncabezado);
        $largoinicialEncabezado = $this->GetStringWidth($valor) + 2;
        $mayor                  = -9999999999;
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

    public function pintarCelda($texto, $ancho = false, $posicion = 0, $alineacion = 'L',
                                $encabezado = false, $saltodelinea = 0, $border = 0, $color = 0, $m = '')

    {

      $posicion = ($posicion) ? $posicion : $this->GetX();
      if ($posicion == 'medio') {
        $anchotexto = $this->GetStringWidth($texto);
        $posicion   = ($this->ancho + $anchotexto) / 2;
      }
      if ($posicion == 'final') {
        $anchotexto = $this->GetStringWidth($texto);
        $posicion   = ($this->ancho - $anchotexto) - 3;
      }
      $ancho = ($ancho) ? $ancho : $this->GetStringWidth($texto);


      $tamannoletra = ($encabezado) ? $this->tamannoLetraEncabezado : $this->tamannoLetraContenido;
      $color        = ($color == 0) ? 0 : $color;
      $llevaColor       = ($color == 0) ? 0 : 1;
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

class ReporteElementoSalarialPersonaModel extends ZendExt_Model {

    public function ReporteElementoSalarialPersonaModel() {
        parent::ZendExt_Model();
    
	}
	
	 public function exportarElementosSalNoConfig($identidad)
    {
      $arrayFinal = array();
      $arrayFinal1 = array();

      $objHisRetenciones = new HisRetencionesPersona();
      $datosEntidad      = $objHisRetenciones->obtenerDatosEntidadDadoId($identidad);

      $mg   = Doctrine_Manager::getInstance();
      $conn = $mg->getCurrentConnection();

      //Obtengo personas con cargos ocupados y plantillas nominales
      $sql = "SELECT DISTINCT  dco.idcargo,
((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from
 mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> ''
 THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as plantilla,
                pcodc.cdgocontable, dpdi.numero as numid,
                (CASE WHEN dp.snombre is not null THEN dp.nombre||' '||dp.snombre||' '||dp.papel||' '||dp.sapel
                 ELSE dp.nombre||' '||dp.papel ||' '||dp.sapel END) as nombre,
                 nc.denominacion AS cargo,
                 CASE WHEN dco.idsituacionlaboral is not null THEN nsl.denominacion
                 ELSE 'Sin situación' END  AS situacionlaboral
                FROM mod_nomina.dat_cargosocupados dco
			INNER JOIN mod_persona.dat_persona dp ON (dco.idpersona = dp.idpersona AND dco.identidad = ?)
			LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc ON (cpnc.idcargo = dco.idcargo)
			LEFT JOIN mod_nomina.conf_plantillanominal cpn ON (cpn.idplantillanominal = cpnc.idplantillanominal)
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
      left join mod_nomina.conf_personacdgocontable pcodc ON (pcodc.idpersona = dco.idpersona and pcodc.idestructura = dco.identidad)
			left join   mod_estructuracomp.dat_cargo c ON (c.idcargo = dco.idcargo)
      left join   mod_estructuracomp.nom_cargo nc ON (c.idnomcargo = nc.idnomcargo)
      left join   mod_nomina.nom_situacionlaboral nsl ON (dco.idsituacionlaboral = nsl.idsituacionlaboral)
			WHERE  dp.feliminado is null and dco.idcargosocupados is not null AND c.idproyecto=0  order by plantilla,nombre ASC;";

      $personasCargosOcupados = $conn->fetchAll($sql, array($identidad));

      //busco por cada cargo los conceptos pd configurables a las personas
      foreach ($personasCargosOcupados as $claveCO => $personaCO) {

        $sql1 = "SELECT
  ncpd.idconceptopercepciondescuento,
  ccpdes.idconfconceptospdelementossalariales,
  ncpd.abreviatura,
  ncpd.denominacion,
  ncpd.descripcion
FROM
  mod_nomina.conf_elementosalarialcargo cesc,
  mod_nomina.conf_conceptospdelementossalariales ccpdes,
  mod_nomina.nom_conceptopercepciondescuento ncpd,
  mod_nomina.nom_conceptopdtarifa nct,
  mod_nomina.nom_estructuraescalar nee
WHERE
  ccpdes.idelementosalarialcargo = cesc.idelementosalarialcargo AND
  ccpdes.idconceptopercepciondescuento = ncpd.idconceptopercepciondescuento AND
  ncpd.idconceptopercepciondescuento = nct.idconceptopercepciondescuento AND
  nct.idconceptopdtarifa = nee.idconceptopdtarifa AND
  cesc.idcargo = ? AND
  nct.idformacalculo = 3 AND
  nee.idtipoentrada = 4;";

        $idcargo     = $personaCO['idcargo'];
        $plantilla     = $personaCO['plantilla'];
        $conceptospd = $conn->fetchAll($sql1, array($idcargo));


        //Verifico si estan configurados esos conceptos pd de la persona
        $conceptospdPersonaNoConfigurados = '';
        $conceptospd1                     = '';
        $arrayConceptospdPersonaNoConfigurados=array();
        foreach ($conceptospd as $claveConceptopd => $conceptopd) {
          $sql2        = "SELECT idconfescalaelementosalarialpersona
             FROM mod_nomina.conf_escalaelementosalarialpersona
             WHERE idconfconceptospdelementossalariales=?;";
          $idconfconceptospdelementossalariales = $conceptopd['idconfconceptospdelementossalariales'];
          $abrevconceptospdelementossalariales  = $conceptopd['abreviatura'];
          $denomconceptospdelementossalariales  = $conceptopd['denominacion'];
          $existe                               = $conn->fetchAll($sql2, array($idconfconceptospdelementossalariales));
          //no configurado(count($existe)== 0) configurados(count($existe) > 0)
          if (count($existe) > 0) {
            $conceptospdPersonaNoConfigurados .= $abrevconceptospdelementossalariales . "\n ,";
            array_push($arrayConceptospdPersonaNoConfigurados,$denomconceptospdelementossalariales);
          }
          $conceptospd1 .= $abrevconceptospdelementossalariales . "\n ,";
        }
        // print_r($arrayConceptospdPersonaNoConfigurados);die;

        //elimino la coma final
        $conceptospdPersonaNoConfigurados       = str_split($conceptospdPersonaNoConfigurados, strlen($conceptospdPersonaNoConfigurados) - 1)[0];
        $conceptospd1                           = str_split($conceptospd1, strlen($conceptospd1) - 1)[0];
        // $personaCO['conceptospdnoconfigurados'] = $conceptospdPersonaNoConfigurados;
        $personaCO['plantilla_nominal'] = $plantilla;

        array_shift($personaCO);
        array_shift($personaCO);
        //$personaCO1=$personaCO;
        $personaCO1['elementonuevo']=$arrayConceptospdPersonaNoConfigurados;
        array_push($arrayFinal, $personaCO);
        array_push($arrayFinal1, $personaCO1);

      }
      //print_r($arrayFinal1);die;

      $datos      = $arrayFinal;
      $encabezado = array('Cod', 'CI', 'Nombre y apellidos','Cargo', 'Situación laboral');
      $pdf        = new Mipdf($datos, $encabezado, 'L', 'mm', 'A3');
      $pdf        = $this->DatosGenerales($pdf);
      $this->datosPiedePagina($pdf, $identidad);
      $pdf->crearCabezera('Elementos salariales a la persona configurados', $datosEntidad[0]['denominacion'], $datosEntidad[0]['codigo']);


      $pdf->pintarContenidoModo2($arrayFinal1);
      $pdf->Output();
    } 
	
	 public function DatosGenerales($pdf)
    {
      $pdf->SetTitle(utf8_decode("Reportes Nómina"));
      $pdf->SetAuthor(utf8_decode("Tte. Ing. Roberto León Socarrás"));
      $pdf->SetLeftMargin(2);
      $pdf->AddPage();
      $pdf->SetFont('Arial', 'B', 12);
      return $pdf;
    }

    function ordenarArrayPorClave($array, $clave, $clave2 ,$orden = SORT_ASC)
    {

      $nuevoarray    = array();
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
      $obj           = new ReportepdfModel();
      $datospiefirma = $obj->getPieFirmaDocumentoXIdEntidad($identidad);
      // print_r($identidad);die;
      $arrdatosfirmas = array();
      foreach ($datospiefirma as $pfirma) {
        $pnombre                                       = trim($pfirma['nombre']);
        $snombre                                       = trim($pfirma['snombre']);
        $papell                                        = trim($pfirma['papel']);
        $sapell                                        = trim($pfirma['sapel']);
        $nombrecompleto                                = (empty($pfirma['snombre'])) ? $pnombre . ' ' . $papell . ' ' . $sapell :
          $pnombre . ' ' . $snombre . ' ' . $papell . ' ' . $sapell;
        $arrdatosfirmas[$pfirma['orden']]['idpersona'] = $pfirma['idpersona'];
        $arrdatosfirmas[$pfirma['orden']]['piefirma']  = $pfirma['denominacion'];
        $arrdatosfirmas[$pfirma['orden']]['nombre']    = $nombrecompleto;
      }

      $pdf->fnSetDatosPiePagina($arrdatosfirmas);
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 

