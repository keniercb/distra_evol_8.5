<?php

/**
 *
 *
 * @author         Ing. Rodain Terrer Molina
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class GestionProformasModel extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
    }

    /**
     * Funcionalidad que obtiene los tipos de contratos.
     *
     * @return array Arreglo con la respuesta del servidor
     * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
     */
    public function getTiposContratos()
    {
        $tipo = new DatTipoContrato();
        $idestructura = $this->global->Estructura->idestructura;
        $filtro=new stdClass();
        $filtro->property=estructura;
        $filtro->value=$idestructura;
        $result = $tipo->getDataTipoContrato($idestructura, array($filtro));
        $data = array();
        foreach ($result as $value) {
            $value['leaf'] = true;
            $value['text'] = $value['denominacion'];
            $value['qtip'] = $value['denominacion'];
            $value['id'] = $value['idtipocontrato'];
            $data[] = $value;
        }
        return $data;
    }

    /**
     * Funcionalidad que obtiene las clausulas de una proforma.
     *
     * @param array $params Arreglo con los datos de la peticion
     *
     * @return array Arreglo con la respuesta del servidor
     * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
     */
    public function getClausulas($params)
    {
        if ($params['idcontratomarco']) {
            $contratoclausula = new DatContratoMarcoClausula();
            $result = $contratoclausula->getClauslas(
                $params['idcontratomarco']
            );
        } else {
            $proformaclausula = new DatProformaClausula();
            $result = $proformaclausula->getClauslas($params['idproforma']);
        }
        return $result;
    }

    public function guardarHerenciaProforma($params)
    {
        try {
            if ($this->global->Perfil->idestructuracomun
                != $params['idestructura']
            ) {
                $conexionActual = Doctrine_Manager::getInstance()
                    ->getCurrentConnection();
//                $proformas = $conexionActual->fetchAll(
//                    "SELECT * FROM mod_crmcontratacion.dat_proforma WHERE
//                               idestructuracomun=" . $params['idestructura']." AND denominacion=". params['denominacion']);
                $consulta
                    = "
                        SELECT prof.* FROM mod_crmcontratacion.dat_proforma prof
                        inner join mod_crmcontratacion.dat_tipocontrato tc on 
                        prof.idtipocontrato=tc.idtipocontrato
                        WHERE 
                        prof.idestructuracomun=" . $params['idestructura'] . "
                        AND tc.denominacion='" . $params['denominacion'] . "'";
                $proformas = $conexionActual->fetchAll($consulta);
                if (count($proformas) > 0) {
                    foreach ($proformas as $pro) {
                        $nuevaProforma = new DatProforma();
                        $nuevaProforma->idestructuracomun
                            = $this->global->Perfil->idestructuracomun;
                        $nuevaProforma->denominacion = $pro['denominacion'];
                        $nuevaProforma->idtipocontrato = $params['id'];
                        $nuevaProforma->vendedor = $pro['vendedor'];
                        $nuevaProforma->comprador = $pro['comprador'];
                        $nuevaProforma->ambos = $pro['ambos'];
                        $nuevaProforma->anexos = $pro['anexos'];
                        $nuevaProforma->marco = $pro['marco'];
                        $nuevaProforma->idplantilla = $pro['idplantilla'];
                        $nuevaProforma->save();
                        $proformaclausulas = Doctrine::getTable(
                            'DatProformaClausula'
                        )
                            ->findBy('idproforma', $pro['idproforma']);
                        foreach ($proformaclausulas as $roltra) {
                            $nuevaproformaclausula = new DatProformaClausula();
                            $nuevaproformaclausula->idproforma
                                = $nuevaProforma->idproforma;
                            $nuevaproformaclausula->idclausula
                                = $roltra['idclausula'];
                            $nuevaproformaclausula->contenido
                                = $roltra['contenido'];
                            $nuevaproformaclausula->orden = $roltra['orden'];
                            $nuevaproformaclausula->save();
                        }
                    }
                    return array('success' => true, 'code' => 1);
                } else {
                    return array('success' => true, 'code' => 2);
                }
            } else {
                return array('success' => true, 'code' => 3);
            }
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }


    public function exportarProforma($params){
//        $direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
//            "pvd/comun/recursos/fpdf/fpdf.php";
//        include($direccionComun);
//        $pdf = new fpdf('L', 'mm', array(440,560));
        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $dir_rel_mt = '/'; //Direccion del Marco de trabajo relativa a la carpeta de publicacion.
        $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt); //Direccion absoluta del marco de trabajo
        include($dir_abs_mt . 'apps/pvd/comun/recursos/Mpdf/mpdf.php');
        //require_once 'bootstrap.php';
//        require_once 'apps/crm/comun/recursos/PHPWord/bootstrap.php';
//        include($dir_abs_mt . 'apps/crm/comun/recursos/PHPWord/bootstrap.php');
//        include($dir_abs_mt . 'apps/crm/comun/recursos/PHPWord/src/PhpWord/PhpWord.php');
//        include($dir_abs_mt . 'apps/crm/comun/recursos/PHPWord/src/PhpWord/PhpWord.php');
//        include($dir_abs_mt . 'apps/crm/comun/recursos/PHPWord/src/PhpWord/Settings.php');
//        include($dir_abs_mt . 'apps/crm/comun/recursos/PHPWord/src/PhpWord/Media.php');
//        include($dir_abs_mt . 'apps/crm/comun/recursos/PHPWord/src/PhpWord/Style.php');
//        include('PhpOffice\PhpWord');
        $pdf = new mPDF();
//        $PhpWord=new \PhpOffice\PhpWord\PhpWord();

//        $doc=new PhpWord();
//        $class = 'PhpOffice\\PhpWord\\PhpWord';
//        $doc = new $class();
//        $pdf->SetTitle("Proforma");
//        $pdf->SetAuthor("Ing. Osiel Fundora Ramírez");
//        $pdf->SetLeftMargin(2);
//        $pdf->AddPage();
//        $pdf->SetFont('Arial', 'B', 20);
//        //var_dump($estructura);die;
//        $pdf->SetX(100);
//        $pdf->Cell(100,15,"Promedio de trabajadores",0,0, 'C');
//        $pdf->Cell(200,15,"$cod",0,0, 'C');
//        $pdf->Ln(15);
//        $pdf->WriteHTML('algo plis');


//        $pdf->Output();
//        header("Expires: Mon, 15 Dec 2003 05:00:00 GMT");
        $datosproforma=$this->getDatosProforma($params['idproforma']);
        $tituloReporte='proforma_'.$datosproforma['datos']['denominacion'].'_'.date('Y-m-d');
//        $tituloReporte='proforma';
//        $tituloReporte=tempnam('', 'xyz');

//        $section=$PhpWord->createSection();
//        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $datosproforma['html']);
//        $section->addText($datosproforma['texto']);
//        print_r($datosproforma['texto']);die;
//        $objWriter= \PhpOffice\PhpWord\IOFactory::createWriter($PhpWord, 'Word2007');
//        $objWriter->save($tituloReporte);
//        header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
//        header("Cache-Control: no-cache, must-revalidate");
        header("Cache-Control: no-cache, must-revalidate");
//        header("Pragma: no-cache");
//        header('Content-Type: application/force-download');
//        header('Content-Type: application/octet-stream', false);
//        header('Content-Type: application/download', false);
        header("Content-type: application/octect-stream"); // application/vnd.ms-word  application/msword application/pdf
//        header("Content-type: application/msword"); // application/vnd.ms-word  application/msword application/pdf
        header("Content-type: application/pdf"); // application/vnd.ms-word  application/msword application/pdf
//        header("Content-Disposition: attachment; filename=\"" . 'prueba' . '.docx' . "\"");
//        header("Content-Disposition: attachment; filename=\"" . basename($tituloReporte . '.pdf') . "\"");
//        header("Content-Description: PHP/INTERBASE Generated Data");


//        ob_clean();
//        flush();
//        $objWriter->save($tituloReporte);
//        readfile($tituloReporte);
//        $objWriter->save('php://output');
//        unlink($tituloReporte);
//        exit;
//        $objWriter->save($tituloReporte . '.docx');

        $pdf->WriteHTML($datosproforma['html']);
        $pdf->Output($tituloReporte . '.pdf', 'D');
//        echo $datosproforma['texto'];
    }

    private function getHeaderFooterPlantilla($idplantilla, $pdf){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $plantilla=$conexionActual->fetchAll("
            SELECT pe.*, (encode(pe.img,'escape')) as img
            FROM mod_crmadministracion.dat_plantillaestructura pe
            WHERE pe.idplantilla=".$idplantilla
        );
        $header='';
        $footer='';
        foreach($plantilla as $p){
            if($p['region']=='t'){
                if($p['tipo']==1){
//                    $header.=$p['texto'];
//                    $pdf->SetHeader($p['texto']);
                    $header.=$this->getElementText($p);
                }else{
//                    $header.=$p['img'];
//                    $pdf->SetHe;
                    $header.=$this->getElementImage($p);
                }
            }
            if($p['region']=='b'){
                $footer.='';
            }
        }
//        $header='<div style="height: 90px"><table width="100%"><tr>'.$header.'</tr></table></div>';
        $header='<table width="100%" height="50px"><tr height="50px">'.$header.'</tr></table>';
//        print($header);die;
        $pdf->setAutoTopMargin='stretch';
        $pdf->SetHTMLHeader($header);
        return array('header'=>$header, '$footer'=>$footer);
    }

    private function getPosition($posicion){
        $posiciones=array(
            'l'=>'width: 33%;',
            'c'=>'left: 33%; width: 34%;',
            'r'=>'left: 67%; width: 33%;',
            'h'=>'width: 100%;',
        );
//        $posiciones=array(
//            'l'=>' width="33%" align="left" ',
//            'c'=>' width="34%" align="center"  left="33%" ',
//            'r'=>' width="33%" align="right" left="67%" ',
//            'h'=>' width="100%" ',
//        );
        return $posiciones[$posicion];
    }

    private function getElementImage($p){
        return '<td style="position:absolute; height: 60px; '.$this->getPosition($p['posicion']).'">
            <img src="data:image/jpg;base64,'.$p['img'].' " 
            style="display: block; margin: 0 auto; width: 50%; height: 100%;" 
            />
            </td>';
    }

    private function getElementImage1($p){
        return '<div style="
                 height: 90px; overflow: hidden; position: absolute;'  //
            .$this->getPosition($p['posicion']).'">
            <img src="data:image/jpg;base64,'.$p['img'].' " 
            style="display: block; margin: 0 auto; width: 50%; height: 100%;" 
            />
            </div>';
    }

    private function getElementText($p){
        $a='<div style="height: 90px; overflow: hidden; position: static"></div>';
        return '<td style="position:absolute; height: 60px; '.$this->getPosition($p['posicion']).'">
                <div style="margin: 0 10px;">'.$p['texto'].'</div></td>';
    }

    private function getElementText1($p){
        $a='<div style="height: 90px; overflow: hidden; position: static"></div>';
        return '<div style="
                 height: 90px; overflow: hidden; position: absolute;'  //
                .$this->getPosition($p['posicion']).'">
                <div style="margin: 0 10px;">'.$p['texto'].'</div></div>';
    }
    private function getDatosProforma($idproforma){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $result=$conexionActual->fetchAll("
            SELECT m1.idproforma,m1.denominacion,m1.vendedor,m1.comprador,m1.ambos, m1.anexos,
            m3.denominacion as clausula,m2.contenido as contenidoclausula, m1.idplantilla
            FROM mod_crmcontratacion.dat_proforma m1 
            INNER JOIN mod_crmcontratacion.dat_proformaclausula m2 ON m1.idproforma=m2.idproforma
            INNER JOIN mod_crmcontratacion.nom_clausula m3 ON m2.idclausula=m3.idclausula 
            WHERE m1.idproforma=$idproforma");
        $html='';
        $texto='';
        $primero=true;
        $anexos='';
        foreach($result as $r){
            if($primero){
                $html="<span style=\"font-weight:bold;\">".$r['denominacion']."</span><br><br>
                    DE UNA PARTE:".$r['vendedor']."<br>
                    DE OTRA PARTE:".$r['comprador']."<br>
                    AMBAS PARTES:".$r['ambos']."<br>
                   
                    CLAUSULAS<br><br>-".$r['clausula']."<br>".$r['contenidoclausula']."<br>";
                $texto=$r['denominacion']."\n
                    DE UNA PARTE:\n".$r['vendedor']."\n
                    DE OTRA PARTE:\n".$r['comprador']."\n
                    AMBAS PARTES:\n".$r['ambos']."\n
                    CLAUSULAS\n-".$r['clausula']."\n".$r['contenidoclausula']."\n";
                $anexos="ANEXOS:".$r['anexos'];
                $primero=false;
            }else{
                $html.="-".$r['clausula']."<br>".$r['contenidoclausula']."<br>";
                $texto.="-".$r['clausula']."\n".$r['contenidoclausula']."\n";
            }
        }
        $html.=$anexos;
        $texto.=$anexos;
//        $texto=str_replace(array('<p>', '</p>', '<br>'), '', $texto);
//        $texto=str_replace('/<(script|style)[^>]*>[\s\S]*?<\/\1>|<\/?[^>]+>/i', '', $texto);
        $texto=preg_replace('/<(script|style)[^>]*>[\s\S]*?<\/\1>|<\/?[^>]+>/i', '', $texto);
//        print_r($result);die;
        return array('html'=>$html, 'texto'=>$texto, 'datos'=>$result[0]);
    }

    public function getDocumento($idnodo)
    {
        return $idnodo;
    }

    public function getConfiguraciones(){
        $conf = new ConfContratacionModel();
        return $conf->loadConfProforma();
    }

    public function cargarDocumentos($params)
    {
        try {
            $documentos = array();
//            return array('success'=> true, 'data'=>array(
//                0=>array('idnodo'=>'1', 'nombre'=>'Documento 1'),
//                1=>array('idnodo'=>'2', 'nombre'=>'Documento 2'),
//                2=>array('idnodo'=>'3', 'nombre'=>'Documento 3'),
//            ));
//            if(false){
            if($this->_gestordocumental->testGD()){
                $result = $this->getConfiguraciones();
                if (count($result) && $result[0]['activo']){
                    $idespaciotrabajo=$params['idespaciotrabajo']?$params['idespaciotrabajo']:$result[0]['idespaciotrabajo'];
                    if($idespaciotrabajo)
                        $documentos = $this->_gestordocumental->getContenido(
                            array('idespaciotrabajo' => $idespaciotrabajo)
                        );
                    return array('success'=> true, 'data'=>$documentos);
                }else{
                    return array('success'=> false, 'msg'=>'No está activado el gestor documental para proformas.');
                }
            }else{
                return array('success'=> false, 'msg'=>'No existe un gestor documental.');
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function guardarDocumento($params){
       // print_r($params);die;
        if($this->_gestordocumental->testGD()) {
            $result = $this->getConfiguraciones();
            if (count($result) && $result[0]['activo']) {
                if (count($_FILES) != 0 && $result[0]['idespaciotrabajo']) {

                    if($params['idespaciotrabajo']==''){
                        $params['idespaciotrabajogeneral']=$result[0]['idespaciotrabajo'];
                        $params['idespaciotrabajo']=$this->crearEspacioTrabajoTipoContrato($params);
                    }

                    if($_FILES[0]['name'])
                        $_FILES[0]['realname'] = $params['nombre'];
                    $documento = $this->_gestordocumental->saveDocument($params['idespaciotrabajo']);
                    if (count($documento) == 0) {
                        throw new Exception(
                            'Ocurrio un error al salvar el documento.', 335
                        );
                    }
                    return array('success'=>true);
                }
            }else{
                return array('success'=> false, 'data'=>'No está activado el gestor documental para proformas.');
            }
        }else{
            return array('success'=> false, 'data'=>'No existe un gestor documental.');
        }
    }

    public function eliminarDocumentos($params){
        try {
            $this->_gestordocumental->delFile(json_decode($params['nodos']));
            return array('success'=>true);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function crearEspacioTrabajoTipoContrato($params){
        $tipoContrato = Doctrine::getTable('DatTipoContrato')->find(
            $params['idtipocontrato']
        );
        $estructura=$this->doQuery(
            "SELECT e.denominacion
                FROM mod_estructuracomp.dat_estructura e
                INNER JOIN mod_estructuracomp.nom_filaestruc fe on(e.idestructura=fe.idfila)
                WHERE idestructura=".$this->global->Estructura->idestructura);
				
		//print_r($estructura);die;		
        $idespacio = $this->_gestordocumental->CreateWorkSpace(
            $params['idespaciotrabajogeneral'], $estructura[0]['denominacion']
        );
		
        $idespacio = $this->_gestordocumental->CreateWorkSpace(
            $idespacio, $tipoContrato->denominacion
        );
        $tipoContrato->idespaciotrabajo=$idespacio;
        $tipoContrato->save();
        return $idespacio;
    }
	
	private function doQuery($query){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        return $conexionActual->fetchAll($query);
    }
}
