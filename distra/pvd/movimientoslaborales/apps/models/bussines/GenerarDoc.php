<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 22/06/17
 * Time: 14:46
 */
class GenerarDoc
{
    public function ConstruirDocumento($datos)
    {
        try {
            $register = Zend_Registry::getInstance();
            $dir = '/pvd/movimientoslaborales/views/contrato.doc';
            $direccion = $register->config->dir_webaplication.$dir;
            include "HTMLTODOC.php";
            $o = new HTML_TO_DOC();
            $o->createDoc($datos, $direccion, false);
            readfile($direccion);
            header("Content-Type: application/vnd.ms-word");
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("content-disposition: attachment;filename=contrato.doc");
        } catch (Exception $e) {
            echo $e;
            exit;
        }
    }
}