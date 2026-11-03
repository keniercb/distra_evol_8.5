<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class IntercambioSipacModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function ExportarDatosSipac($tempFile)
    {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header(
            "Content-Disposition: attachment; filename=\"datos_exportados("
            . Date('d-m-Y') . ").sipac\""
        );
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Pragma: no-cache');
        header('Content-Length: ' . filesize($tempFile));
        ob_clean();
        flush();
        readfile($tempFile);
        unlink($tempFile);
    }

    public function ImportarDatosSipac($tempFile)
    {
        $objcmpintercambiomodel = new CmpIntercambioModel();
        $respuesta = $objcmpintercambiomodel->EfectuarImportacion($tempFile);
        return $respuesta;

    }


}