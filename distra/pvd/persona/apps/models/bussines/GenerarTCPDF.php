<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 30/05/16
 * Time: 9:22
 */
class GenerarTCPDF
{
    public function GenerarTCPDF()
    {
        $dir=$_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps.'web/pvd/comun/bibliotecas/html2pdf_v4.03/html2pdf.class.php');
    }

    public function ConstruirFicha($datos)
    {
        try {
            $datos = str_replace('../../', $_SERVER ['DOCUMENT_ROOT'].'/pvd/maestro/documentos/', $datos);
            $htmlpdf = new HTML2PDF('P', 'A4', 'es', true, 'UTF-8', array(8,8,8,8));
            $htmlpdf->setDefaultFont('Arial');
            ob_end_clean();
            $htmlpdf->writeHTML(str_replace('\&quot;', ' ', $datos), isset($_GET['vuehtml']));
            ob_end_clean();
            $htmlpdf->Output('contrato.pdf');
        } catch (HTML2PDF_exception $e) {
            echo $e;
            exit;
        }
    }
}