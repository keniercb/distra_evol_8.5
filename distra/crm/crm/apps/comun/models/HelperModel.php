<?php

/**
 * Created by PhpStorm.
 * User: raciel
 * Date: 22/07/14
 * Time: 22:40
 */
class HelperModel
{

    public static function excecute($agModel, $agFunction, $agParams)
    {

        // Verificar que sea un objeto el modelo
        if (is_object($agModel)) {
            // Verificar que la funcion exista
            try {
                if (is_callable(array($agModel, $agFunction), true)) {
                    return call_user_func(
                        array($agModel, $agFunction), $agParams
                    );
                }
            } catch (Exception $e) {
                if($e->getCode()==0)
                    return null;
                else
                    throw $e;
            }

        }
        // salida null significa que no afecta nada de la salida
        return null;
    }

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
    public static function get_class_name_from_file($path, $asArray = FALSE)
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
    public static function get_parents_from_file($path, $asArray = FALSE)
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

    /**
     * Incluye un fichero y sus dependencias
     *
     * @param string $path Ruta hasta el fichero.
     * @param string [$nameParentsClass] Nombre de las clases padres.
     * @return void
     */
    public static function inludeDomainModel($path, $nameParentsClass = NULL)
    {
        if (file_exists($path)) {
            $arraypath = explode('/', $path);
            /* Obtengo los nombres de las clases de las que hereda */
            $nameParentsClass = is_null($nameParentsClass) ? self::get_parents_from_file($path, TRUE) :
                array($nameParentsClass);

            $pattern = implode('/', array_splice($arraypath, 0, count($arraypath) - 1));
            $pattern .= '/generated/*.php';
            /* Buscar las bases que sean necesaria para instanciar */
            foreach (glob($pattern) as $file) {
                /* Obtengo los nombre de las clases del fichero */
                $classesname = self::get_class_name_from_file($file, true);
                if ($classesname !== 0 && $classesname !== -1) {
                    /* encuentro los nombres de clases comunes entre cada fichero base y el domain */
                    if (!is_array($nameParentsClass)) {
                        $nameParentsClass = array();
                    }

                    /* Esto es para intersectar haciendo una comparacion de los nombres insensibles
                     * a may�sculas y min�sculas
                     */
                    $communClases = array_uintersect($classesname, $nameParentsClass, "strcasecmp");

                    if (count($communClases) > 0) {
                        /* incluyo la base */
                        include_once $file;
                    }
                }
            }
            /* incluyo la clase principal */
            include_once $path;
        }
    }


} 