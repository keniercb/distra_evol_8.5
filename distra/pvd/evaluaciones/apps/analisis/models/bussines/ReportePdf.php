<?php
class ReportePdf extends ZendExt_Model {

	var $pdf;
	var $posY;

     public function setUp() {
        parent::ZendExt_Model();
    }

	public function ReportePdf(){
		$dir=$_SERVER ['DOCUMENT_ROOT'];
		$apps = str_replace('/web','/',$dir);
		require_once($apps.'apps/pvd/comun/recursos/tcpdf/config/lang/eng.php');
		require_once($apps.'apps/pvd/comun/recursos/tcpdf/tcpdf.php');

		// $idpersona = $idp;
	   //$this->objpdf = new asdsads();
	}
	
	public function CrearPlanilla(){
		$this->pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, A4, true, 'UTF-8', false);

		// set document information
		$this->pdf->SetCreator(PDF_CREATOR);
		$this->pdf->SetAuthor('Boris A.');
		$this->pdf->SetTitle('TCPDF Example 002');
		$this->pdf->SetSubject('TCPDF Tutorial');
		$this->pdf->SetKeywords('TCPDF, PDF, example, test, guide');

		// remove default header/footer
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
		$this->pdf->SetFont('times', 'B', 10);
 	}

	public function CrearPagina($arrpersonas,$titulo,$idpreprocesoevaluativo,$estado,$denominacionproceso){
		$this->pdf->AddPage();
		$tabla;		
		$long = count($arrpersonas);
		for ($i=0;$i<$long;$i++){
			$tabla=$tabla.'<tr>
				 <td >'.$arrpersonas[$i]['numid'].'</td>
				 <td >'.$arrpersonas[$i]['nombre'].'</td>
				 <td >'.$arrpersonas[$i]['papel'].'</td>
				 <td >'.$arrpersonas[$i]['sapel'].'</td>
				 <td >'.$this->formatoEstadoPdf($arrpersonas[$i]['estado']).'</td>
				 <td >'.$arrpersonas[$i]['resultado'].'</td>
			 </tr>';
		 }
		$elem = '<h2 align = "center">'.$titulo.'</h2>		
		<h2 align = "left">'.$denominacionproceso.'</h2>
		<table border="1" align = "center" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc">No. identidad</td>
				<td bgcolor="#dcdcdc">Nombre</td>
				<td bgcolor="#dcdcdc">Primer apellido</td>
				<td bgcolor="#dcdcdc">Segundo apellido</td>
				<td bgcolor="#dcdcdc">Estado</td>
				<td bgcolor="#dcdcdc">Evaluaci&oacute;n</td>
			</tr>
			'.$tabla.'
		</table>';
		$this->pdf->writeHTML($elem, true, false, true, false, '');
		
		
	}

	public function Guardar()
	{
		$this->pdf->Output('ReportePdf.pdf', 'F');
	}
	public function formatoEstadoPdf($estado){
	    if($estado == 1){
		    return 'Evaluado';
		}else if($estado == 2){
			return 'No evaluado';
		}else 		    
		    return 'En reclamaci&oacute;n';
	}
}
?>	
