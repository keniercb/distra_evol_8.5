<?php 
    
	require_once("dompdf-0.5.1/dompdf_config.inc.php");
	$htmlcontent = stripslashes($_POST['mybodyvalue']);
	$htmlcontent = str_replace("ó","&#243;",$htmlcontent);
	$dompdf = new DOMPDF();
	if ($_POST['mypaperor']=='p'){ 
		$dataorientation = 'portrait';
	} else { 
		$dataorientation = 'landscape';
	} 
	$dompdf->set_paper ('letter', $dataorientation );
	$dompdf->load_html($htmlcontent);
	$dompdf->render();
	$dompdf->stream("reporte_gm.pdf");
?>