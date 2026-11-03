<?php

class FuncionesGlobalesModel extends ZendExt_Model {

     //metodo global para ser usuado por otros exportar
    public function cargarEtiquetas($componente) {
        $dirweb = Zend_Registry::getInstance()->config->dir_webaplication;
        $etiquetas = file_get_contents($dirweb . "/planificacion/planmeta/views/js/{$componente}/{$componente}_idioma.js");
        unset($dirweb);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $etiquetas = str_replace("etiqueta.", "", $etiquetas);
        $etiquetas = str_replace("initEtiquetas = function ()", "", $etiquetas);
        $etiquetas = str_replace("cargarInterfaz();", "", $etiquetas);
        $etiquetas = split(";", $etiquetas);

        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split("=", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq [$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);
        return $arrayEtiq;
    }


}
