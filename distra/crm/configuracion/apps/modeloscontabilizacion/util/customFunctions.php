<?php

/**
 * Fichero que incluye funciones personalizadas auxiliares.
 * 
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @package ERP Cuba.
 */
if (!function_exists('get_class_name_from_file')) {

    /**
     * Devuelve los nombres de todas las clases contenidas en un fichero.
     * 
     * @version v1.0
     * @param string $path Ruta hasta el fichero
     * @param boolean $asArray Define si devolver la respuesta en un arreglo en 
     * caso de que el fichero contenga una sola clase (FALSE por defecto). 
     * @return string|int|array Devuelve -1 si no existe el fichero en la ruta 
     * especificada, 0 si no existen clases declaradas en el fichero, el nombre 
     * de la clase o un arreglo con los nombres de todas las clases que existen 
     * en el fichero.
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @copyright (c) 2014, XETID.
     * @example get_class_name_from_file("/ruta/al/fichero.php");
     */
    function get_class_name_from_file($path, $asArray = FALSE)
    {
        if (!file_exists($path)) {
            return -1;
        }

        $comment = '(?:\/\*\*+[^\*\n]*\*[^\*\/\n]*\*\/)|(?:\/\/.*\n)';
        $begin = '(?:abstract|final)\s+';
        $pattern = "/(?:$comment)*\s*\n+(?:$begin)?\bclass\b\s+(\b\S+\b)/i";
        $contents = file_get_contents($path);

        preg_match_all($pattern, $contents, $matches, PREG_PATTERN_ORDER);
        if (!is_array($matches) || count($matches) !== 2) {
            return 0;
        }

        if (!empty($matches[1])) {
            return (count($matches[1]) > 1 || $asArray) ? $matches[1] : $matches[1][0];
        }
    }

}

if (!function_exists('get_parents_from_file')) {

    /**
     * Devuelve los nombres de todas las clases de las que heredan las clases
     * contenidas en un fichero.
     * 
     * @version v1.0
     * @param string $path Ruta hasta el fichero
     * @param boolean $asArray Define si devolver la respuesta en un arreglo en 
     * caso de que el fichero contenga una sola clase (FALSE por defecto). 
     * @return string|int|array Devuelve -1 si no existe el fichero en la ruta 
     * especificada, 0 si no existen clases padres  en las clases declaradas en el fichero, 
     * el nombre de la clase padre(en caso de que exista solo una) o un arreglo 
     * con los nombres de todas las clases de las que heredan las clases declaradas 
     * en el fichero.
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @copyright (c) 2014, XETID.
     * @example get_parents_from_file("/ruta/al/fichero.php");
     */
    function get_parents_from_file($path, $asArray = FALSE)
    {
        if (!file_exists($path)) {
            return -1;
        }

        $comment = '(?:\/\*\*+[^\*\n]*\*[^\*\/\n]*\*\/)|(?:\/\/.*\n)';
        $begin = '(?:abstract|final)\s+';
        $pattern = "/(?:$comment)*\s*\n+(?:$begin)?\bclass\b\s+\b\S+\b\s+extends\s+(\b\w+\b)/i";
        $contents = file_get_contents($path);

        preg_match_all($pattern, $contents, $matches, PREG_PATTERN_ORDER);
        if (!is_array($matches) || count($matches) !== 2) {
            return 0;
        }

        if (!empty($matches[1])) {
            return (count($matches[1]) > 1 || $asArray) ? $matches[1] : $matches[1][0];
        }
    }

}

if (!function_exists('get_methods_from_file')) {

    /**
     * Devuelve los nombres de todas las funciones contenidas en un fichero.
     * 
     * @version v1.0
     * @param string $path Ruta hasta el fichero
     * @param boolean $asArray Define si devolver la respuesta en un arreglo. 
     * @return string|int|array Devuelve -1 si no existe el fichero en la ruta 
     * especificada, 0 si no existen funciones declaradas en el ficheroo un 
     * arreglo con los nombres de todas las funciones que existen en el fichero.
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @copyright (c) 2014, XETID.
     * @example get_methods_from_file("/ruta/al/fichero.php");
     */
    function get_methods_from_file($path, $asArray = TRUE)
    {
        if (!file_exists($path)) {
            return -1;
        }

//        $comment = '(?:\/\*\*+[^\*\n]*\*[^\*\/\n]*\*\/)|(?:\/\/.*\n)';
//        $begin = '(?:public)\s+';
//        $pattern = "/(?:$comment)*\s*(?:$begin)?\bfunction\b\s+(\b\S+\b)\s*\(/i";
        $comment = '(?:\/\*\*+[^\*\n]*\*[^\*\/\n]*\*\/)|(?:\/\/.*\n)';
        $declaration = '(?:\bpublic\b)|(?:[^privateprotectedfinal\s]+)';
        $pattern = "/(?:$comment)*\s*(?:$declaration)\s+\bfunction\b\s+(\b\S+\b)\s*\(/i";
        
        $contents = file_get_contents($path);
        preg_match_all($pattern, $contents, $matches, PREG_PATTERN_ORDER);
        
        if (!is_array($matches) || count($matches) !== 2) {
            return 0;
        }

        if (!empty($matches[1])) {
            return (count($matches[1]) > 1 || $asArray) ? $matches[1] : $matches[1][0];
        }
    }

}

/* Esta es la funcion que debera contruir el comprobante */
if (!function_exists('build_comprobante')) {
    /* incluyendo la clase helper */
    if (!class_exists('ModelHelper')) {
        $path = $dir_abs_mt . 'apps/configuracion/modeloscontabilizacion/util/ModelHelper.php';
        if (!file_exists($path)) {
            throw new Exception("El fichero 'ModelHelper' no existe en la ruta '{$path}'");
        }

        require_once $path;
    }

    /**
     * Construye un comprobante de operaciones a partir de un modelo de
     * contabilización.
     * 
     * @version v1.0
     * @param int|string $idmodel Identificador del modelo
     * @param array $extras Arreglo con todos los parametros necesarios para evaluar 
     * las funciones y llamadas a servicios en la configuracion del modelos
     * @param boolean $showPreview Define si se mostrara un vista previa del
     * comprobante (TRUE por defecto). 
     * @return string|int|array FALTA POR DEFINIR.
     * @throws Exception
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @copyright (c) 2014, XETID.
     */
    function build_comprobante($idmodel, $extras = array(), $showPreview = TRUE)
    {
        $model = new ModelHelper($idmodel, $extras);

        try {
            $model->evalModel();
        } catch (Exception $e) {
            print_r($e);
            die;
            throw $e;
        }
    }

}