<?php
class GenerarPlantillaPDF
{
    public function GenerarPlantillaPDF()
    {
        $dir=$_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps.'web/pvd/comun/bibliotecas/html2pdf_v4.03/html2pdf.class.php');
    }

    public function ConstruirPlantilla($datos, $orientacion, $formato, $margenes)
    {
        try {
            if (strpos($datos, '<img src=') == true) {
                $datos = str_replace('%20', ' ', $datos);
            }
            $datos = str_replace('../../', $_SERVER ['DOCUMENT_ROOT'].'/pvd/maestro/documentos/', $datos);
            $htmlpdf = new HTML2PDF($orientacion, $formato, 'es', true, 'UTF-8', $margenes);
            $htmlpdf->setDefaultFont('Helvetica');
            ob_end_clean();
            $htmlpdf->writeHTML(str_replace('\&quot;', ' ', $datos), isset($_GET['vuehtml']));
            ob_end_clean();
            $htmlpdf->Output('plantilla.pdf');
        } catch(HTML2PDF_exception $e) {
            echo $e;
            exit;
        }
    }
}