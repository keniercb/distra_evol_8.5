<?php

/**
 * @author Ing. Dainier Valazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class ReporteXMLContabilidad extends ZendExt_Model
{
    private $datos;
    private $ruta;

    public function ReporteXMLContabilidad()
    {
        parent::ZendExt_Model();
        $fecha = Date('d/m/y');
        $rexplode = explode('/', $fecha);
        $mes = $rexplode[1];
        $anno = $rexplode[2];
		//Formato del nombre 'xml_asinom' + mes + quincena = 2 + año
        $this->ruta = "xml_asinom".$mes.'2'.$anno.".xml";
    }

    public function fnCrearXML($idelaborarpago, $idtipopago, $identidad, $crc)
    {
        //Obteniendo los datos del comprobante guardado
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
		$datosentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad);
        $denomentidad = utf8_decode($datosentidad[0]->denominacion);
        //$codigoentidad = $datosentidad[0]->codigo;
        $sqlCodigo = "SELECT codigocontabilidad FROM mod_estructuracomp.dat_estructura WHERE idestructura = ?;";
		$codigoentidad = $conn->fetchAll($sqlCodigo, array($identidad))[0]['codigocontabilidad'];
        
        $sqlComprobante = "SELECT * FROM mod_nomina.dat_comprobantenomina WHERE idelaborarpagos = ?;";
        $arrComprbanteCC = $conn->fetchAll($sqlComprobante, array($idelaborarpago));
        $cuerpoxml = $this->fnCuerpoXML($denomentidad, $codigoentidad, $arrComprbanteCC);		
        return $this->fnCabeceraXML($cuerpoxml, $arrComprbanteCC, $crc);

    }

    private function generarCRC($fecha, $datos, $tamañomb){
        $cantidadelementos = count($datos);
        $arrayletraspares = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
        $arrayletrasimpares = ['N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        $crc = $cantidadelementos;
        //Fechas
        $rexplode = explode('/', $fecha);
        $mes = (int)$rexplode[1];
        $anno = $rexplode[2];		
        //Letra mes
        if($mes%2==0){
            $crc = $crc.$arrayletraspares[$mes];
        }else{
            $crc = $crc.$arrayletrasimpares[$mes];
        }
		//Dividiendo el tamaño entre la cantidad de elementos
		$tamañombentreelem = number_format($tamañomb/$cantidadelementos, 2);
		$rexpltam = explode('.',$tamañombentreelem);
		//Concatenando el resultado de la division pero al reves. Primero lo q esta a la derecha de la coma y luego el resto
		$tamreves = $rexpltam[1].$rexpltam[0];
        $crc = $crc.$tamreves;
        return $crc;

    }

    private function fnCabeceraXML($cuerpoxml, $arrComprbanteCC, $crc)
    {
    $sabic = '<cta_sabic>Sabic</cta_sabic>';
          $xmlprint = <<<XML
<?xml version='1.0' encoding="Windows-1252" standalone="yes"?>
<VFPData>
	<xsd:schema id="VFPData" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
		<xsd:element name="VFPData" msdata:IsDataSet="true">
			<xsd:complexType>
				<xsd:choice maxOccurs="unbounded">
					<xsd:element name="t_xml059" minOccurs="0" maxOccurs="unbounded">
						<xsd:complexType>
							<xsd:sequence>
								<xsd:element name="cta_sabic">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="14"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="cta_nombre">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="80"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="imp_db">
									<xsd:simpleType>
										<xsd:restriction base="xsd:decimal">
											<xsd:totalDigits value="9"/>
											<xsd:fractionDigits value="2"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="imp_cr">
									<xsd:simpleType>
										<xsd:restriction base="xsd:decimal">
											<xsd:totalDigits value="9"/>
											<xsd:fractionDigits value="2"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="est_1raqui">
									<xsd:simpleType>
										<xsd:restriction base="xsd:decimal">
											<xsd:totalDigits value="9"/>
											<xsd:fractionDigits value="2"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="imp_liqest">
									<xsd:simpleType>
										<xsd:restriction base="xsd:decimal">
											<xsd:totalDigits value="9"/>
											<xsd:fractionDigits value="2"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="cta_pagdeu">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="16"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="cod_ident">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="11"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="cod_entgru">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="3"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="nom_entgru">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="80"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="cod_areas">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="3"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="nom_areas">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="60"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="observ">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="200"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="cod_retdes">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="3"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
								<xsd:element name="dir_trabaj">
									<xsd:simpleType>
										<xsd:restriction base="xsd:string">
											<xsd:maxLength value="200"/>
										</xsd:restriction>
									</xsd:simpleType>
								</xsd:element>
							</xsd:sequence>
						</xsd:complexType>
					</xsd:element>
				</xsd:choice>
				<xsd:anyAttribute namespace="http://www.w3.org/XML/1998/namespace" processContents="lax"/>
			</xsd:complexType>
		</xsd:element>
	</xsd:schema>
	$cuerpoxml
</VFPData>
XML;
        $returncrc = $this->generarCRC(Date('d/m/y'), $arrComprbanteCC, strlen($xmlprint)/*mb_strlen($xmlprint)*/);//print_r(strlen($xmlprint));die;
        
		if($crc == 1){
            return $returncrc;
        }//else{
            //Guardando la cabecera del xml
            //file_put_contents($this->ruta, $xmlprint, FILE_APPEND | LOCK_EX);
            //mkdir($this->ruta, 0777, true);
            Header('Content-disposition: attachment; filename=' . $this->ruta);
            echo($xmlprint);
        //}

    }

    private function fnCuerpoXML($denomentidad, $codigoentidad, $arrComprbanteCC)
    {
        $xml = '';
        foreach ($arrComprbanteCC as $i => $comp) {
            if($comp['debitocredito'] == 1){
                //$xml.= "\t";
                if($i!=0){
                    $xml.= "\t";
                }
                $xml.= "<t_xml059>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<cta_sabic>" . $comp['cuenta'] . "</cta_sabic>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<cta_nombre>" . utf8_decode($comp['denomcuenta']) . "</cta_nombre>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<imp_db>" . 0.00 . "</imp_db>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<imp_cr>" . $comp['importe'] . "</imp_cr>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<est_1raqui>" . 0 . "</est_1raqui>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<imp_liqest>" . 0 . "</imp_liqest>";
                if(!$comp['refretenciones']){
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cta_pagdeu/>";
                }  else{
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cta_pagdeu>".$comp['refretenciones']."</cta_pagdeu>";
                }
                if(!$comp['ci']){
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cod_ident/>";
                }else{
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cod_ident>".$comp['ci']."</cod_ident>";
                }
                $xml.= "\n"."\t"."\t";
				//print_r('lool'.$codigoentidad);die;
                $xml.= "<cod_entgru>" . (string) $codigoentidad . "</cod_entgru>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<nom_entgru>" . $denomentidad . "</nom_entgru>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<cod_areas/>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<nom_areas/>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<observ>" . 'Contabilización de la nomina' . "</observ>";
                $xml.= "\n"."\t"."\t";
                if(!$comp['abreviaturaret']){
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cod_retdes/>";
                }  else{
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cod_retdes>".$comp['abreviaturaret']."</cod_retdes>";
                }
                if(!$comp['direccion']){
					$xml.= "\n"."\t"."\t";					
                    $xml.= "<dir_trabaj/>";
                }else{
                    $xml.= "\n"."\t"."\t";
					$xml.= "<dir_trabaj>".$comp['direccion']."</dir_trabaj>";                    
                }
                $xml.= "\n"."\t";
                $xml.= "</t_xml059>";
                $xml.= "\n";

            }else{
                if($i!=0){
                    $xml.= "\t";
                }
                //$xml.= "\t";
                $xml.= "<t_xml059>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<cta_sabic>" . $comp['cuenta'] . "</cta_sabic>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<cta_nombre>" . utf8_decode($comp['denomcuenta']) . "</cta_nombre>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<imp_db>" . $comp['importe'] . "</imp_db>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<imp_cr>" . 0.00 . "</imp_cr>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<est_1raqui>" . 0 . "</est_1raqui>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<imp_liqest>" . 0 . "</imp_liqest>";
                if(!$comp['refretenciones']){
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cta_pagdeu/>";
                }  else{
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cta_pagdeu>".$comp['refretenciones']."</cta_pagdeu>";
                }
                if(!$comp['ci']){
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cod_ident/>";
                }else{
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cod_ident>".$comp['ci']."</cod_ident>";
                }
                $xml.= "\n"."\t"."\t";
                $xml.= "<cod_entgru>" . (string) $codigoentidad . "</cod_entgru>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<nom_entgru>" . $denomentidad . "</nom_entgru>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<cod_areas/>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<nom_areas/>";
                $xml.= "\n"."\t"."\t";
                $xml.= "<observ>" . 'Contabilizacion de la nomina' . "</observ>";
                $xml.= "\n"."\t"."\t";
                if(!$comp['abreviaturaret']){
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cod_retdes/>";
                }  else{
                    $xml.= "\n"."\t"."\t";
                    $xml.= "<cod_retdes>".$comp['abreviaturaret']."</cod_retdes>";
                }
                $xml.= "\n"."\t"."\t";
                if(!$comp['direccion']){
					$xml.= "\n"."\t"."\t";					
                    $xml.= "<dir_trabaj/>";
                }else{
                    $xml.= "\n"."\t"."\t";
					$xml.= "<dir_trabaj>".$comp['direccion']."</dir_trabaj>";                    
                }
                $xml.= "\n"."\t";
                $xml.= "</t_xml059>";
                $xml.= "\n";
            }
        }
        return $xml;
    }
}





